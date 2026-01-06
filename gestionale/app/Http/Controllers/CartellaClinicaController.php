<?php

namespace App\Http\Controllers;

use App\Models\Utente;
use Inertia\Inertia;
use App\Models\CartellaClinicaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Crypt;


use App\Models\CartellaClinica;

class CartellaClinicaController extends Controller
{
    public function show(Utente $paziente)
    {
        $user = Session::get('logged_user');

        if (!$user || $user['ruolo'] !== 'staff') {
            abort(403, 'Accesso consentito solo allo staff');
        }

        return Inertia::render('CartellaClinica', [
            'paziente' => [
                'id' => $paziente->id,
                'nome' => $paziente->nome,
                'cognome' => $paziente->cognome,
            ],
        ]);
    }

    public function store(Request $request, $pazienteId)
    {
        $user = Session::get('logged_user');
        if (!$user || $user['ruolo'] !== 'staff') {
            abort(403);
        }

        $request->validate([
            'files'   => 'required',
            'files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:51200',
        ]);

        $files = $request->file('files');

        if (!is_array($files)) {
            $files = [$files];
        }

        foreach ($files as $file) {

            // 1️ leggiamo il contenuto reale del file
            $content = file_get_contents($file->getRealPath());

            // 2️ cifriamo il contenuto
            $encryptedContent = Crypt::encrypt($content);

            // 3️ path tecnico (NON pubblico)
            $path = "cartelle_cliniche/{$pazienteId}/" . uniqid() . '.bin';

            // 4️ salviamo il file CIFRATO
            Storage::disk('private')->put($path, $encryptedContent);

            // 5️ salviamo i metadati nel DB (UGUALE A PRIMA)
            CartellaClinicaFile::create([
                'paziente_id'   => $pazienteId,
                'uploaded_by'   => $user['id_utente'],
                'original_name' => $file->getClientOriginalName(),
                'file_path'     => $path,
                'mime_type'     => $file->getClientMimeType(),
                'file_size'     => $file->getSize(),
            ]);
        }

        return response()->json([
            'success' => true,
        ]);
    }




    public function data($pazienteId)
    {
        $user = session('logged_user');
        if ($user['ruolo'] !== 'staff') abort(403);

        $paziente = Utente::with(['terapisti', 'cartellaClinica'])->findOrFail($pazienteId);


        $files = CartellaClinicaFile::with('uploader')
            ->where('paziente_id', $pazienteId)
            ->latest()
            ->get()
            ->map(fn($f) => [
                'id' => $f->id,
                'original_name' => $f->original_name,
                'uploader' => $f->uploader->nome . ' ' . $f->uploader->cognome,
                'created_at' => $f->created_at->format('d/m/Y H:i'),
            ]);

        return response()->json([
            'paziente' => [
                'id' => $paziente->id,
                'nome' => $paziente->nome,
                'cognome' => $paziente->cognome,
                'sesso' => $paziente->sesso,
                'nascita' => $paziente->nascita,
                'email' => $paziente->email,
                'telefono' => $paziente->telefono,
                'terapisti' => $paziente->terapisti,
            ],
            'cartella' => $paziente->cartellaClinica,
            'files' => $files,
        ]);
    }


    public function download($id)
    {
        $user = session('logged_user');
        if ($user['ruolo'] !== 'staff') abort(403);

        $file = CartellaClinicaFile::findOrFail($id);

        if (!Storage::disk('private')->exists($file->file_path)) {
            abort(404, 'File non trovato');
        }

        // 1️ leggiamo il contenuto CIFRATO
        $encryptedContent = Storage::disk('private')->get($file->file_path);

        // 2️decifriamo il contenuto
        $content = Crypt::decrypt($encryptedContent);

        // 3️restituiamo il file originale al browser
        return response($content)
            ->header('Content-Type', $file->mime_type)
            ->header(
                'Content-Disposition',
                'attachment; filename="' . $file->original_name . '"'
            );
    }



    // public function download($id)
    // {
    //     $file = CartellaClinicaFile::findOrFail($id);

    //     $fullPath = storage_path('app/' . $file->file_path);

    //     dd([
    //         'db_path' => $file->file_path,
    //         'full_path' => $fullPath,
    //         'exists' => file_exists($fullPath),
    //     ]);
    // }




    public function destroy($fileId)
    {
        $user = session('logged_user');
        if ($user['ruolo'] !== 'staff') abort(403);

        $file = CartellaClinicaFile::findOrFail($fileId);

        // elimina il file CIFRATO dal disk corretto
        if (Storage::disk('private')->exists($file->file_path)) {
            Storage::disk('private')->delete($file->file_path);
        }

        // elimina il record dal DB
        $file->delete();

        return response()->json(['success' => true]);
    }



    public function update(Request $request, Utente $paziente)
    {
        $user = session('logged_user');
        if ($user['ruolo'] !== 'staff') abort(403);

        $data = $request->validate([
            'anamnesi' => 'nullable|string',
            'diagnosi' => 'nullable|string',
            'terapia'  => 'nullable|string',
            'note'     => 'nullable|string',
        ]);

        $cartella = CartellaClinica::firstOrCreate(
            ['paziente_id' => $paziente->id],
            $data
        );

        $cartella->update($data);

        return response()->json([
            'success' => true,
            'cartella' => $cartella,
        ]);
    }


    public function patientView()
    {
        $sessionUser = session('logged_user');

        if (!$sessionUser || $sessionUser['ruolo'] !== 'paziente') {
            abort(403);
        }

        $paziente = Utente::with([
            'terapisti',
            'cartellaClinica',
        ])->findOrFail($sessionUser['id_utente']);

        return response()->json([
            'paziente' => [
                'nome' => $paziente->nome,
                'cognome' => $paziente->cognome,
                'nascita' => $paziente->nascita,
                'created_at' => $paziente->created_at,
            ],
            'terapisti' => $paziente->terapisti,
            'cartella' => $paziente->cartellaClinica,
        ]);
    }
}

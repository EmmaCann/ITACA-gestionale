<?php

namespace App\Http\Controllers;

use App\Models\Utente;
use Inertia\Inertia;
use App\Models\CartellaClinicaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;

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
            'files.*' => 'required|file|max:10240', // 10MB
        ]);

        foreach ($request->file('files') as $file) {
            $path = $file->store(
                "cartelle_cliniche/{$pazienteId}"
            );

            CartellaClinicaFile::create([
                'paziente_id'   => $pazienteId,
                'uploaded_by'   => $user['id'],
                'original_name' => $file->getClientOriginalName(),
                'file_path'     => $path,
                'mime_type'     => $file->getClientMimeType(),
                'file_size'     => $file->getSize(),
            ]);
        }

        return response()->json([
            'message' => 'File caricati con successo',
        ]);
    }


    public function data($pazienteId)
    {
        $user = session('logged_user');
        if ($user['ruolo'] !== 'staff') abort(403);

        $paziente = Utente::with('terapisti')->findOrFail($pazienteId);

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
                'nome' => $paziente->nome,
                'cognome' => $paziente->cognome,
                'sesso' => $paziente->sesso,
                'eta' => optional($paziente->nascita)->age,
                'terapisti' => $paziente->terapisti,
            ],
            'files' => $files,
        ]);
    }
}

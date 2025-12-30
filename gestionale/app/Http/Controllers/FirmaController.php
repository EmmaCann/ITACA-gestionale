<?php

namespace App\Http\Controllers;

use App\Models\Firma;
use Illuminate\Http\Request;
use Spatie\SimpleExcel\SimpleExcelWriter;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use App\Models\Utente;

class FirmaController extends Controller
{
    public function index(Request $request)
    {
        $query = Firma::with(['terapista', 'paziente']);

        if ($request->filled('mese')) $query->whereMonth('data', $request->input('mese'));
        if ($request->filled('anno')) $query->whereYear('data', $request->input('anno'));
        if ($request->boolean('oggi')) {
            $query->whereDate('data', now()->toDateString());
        }
        if ($request->filled('terapista_id')) {
            $query->where('terapista_id', $request->input('terapista_id'));
        }

        if ($request->filled('paziente_id')) {
            $query->where('paziente_id', $request->input('paziente_id'));
        }


        $firme = $query->get()->map(function ($firma) {
            $nome = $firma->paziente ? $firma->paziente->nome : $firma->nome;
            $cognome = $firma->paziente ? $firma->paziente->cognome : $firma->cognome;

            return [
                'id'        => $firma->id,
                'paziente_id' => $firma->paziente_id,
                'nome'      => $nome,
                'cognome'   => $cognome,
                'data'      => $firma->data?->format('Y-m-d'),
                'terapia'   => $firma->terapia,
                'terapista' => $firma->terapista
                    ? $firma->terapista->nome . ' ' . $firma->terapista->cognome
                    : null,
            ];
        });

        return response()->json($firme);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'paziente_id'  => 'nullable|exists:utente,id',
            'nome'         => 'nullable|required_without:paziente_id|string|max:255',
            'cognome'      => 'nullable|required_without:paziente_id|string|max:255',
            'data'         => 'required|date',
            'terapia'      => 'required|string|max:255',
            'terapista_id' => 'required|exists:utente,id',
        ]);

        // Se selezioni un paziente, copiamo comunque nome/cognome (snapshot)
        if (!empty($validated['paziente_id'])) {
            $p = Utente::select('id', 'nome', 'cognome')->find($validated['paziente_id']);
            $validated['nome'] = $p?->nome ?? $validated['nome'] ?? '';
            $validated['cognome'] = $p?->cognome ?? $validated['cognome'] ?? '';
        }

        $firma = Firma::create($validated);

        return response()->json([
            'message' => 'Firma creata con successo.',
            'firma' => $firma->load(['terapista', 'paziente']),
        ], 201);
    }

    public function destroy($id)
    {
        $firma = Firma::findOrFail($id);
        $firma->delete();

        return response()->json([
            'message' => 'Firma eliminata con successo.',
        ]);
    }




    public function export(Request $request)
    {
        $query = Firma::with('terapista');

        // filtri mese/anno
        if ($request->filled('mese')) {
            $query->whereMonth('data', $request->input('mese'));
        }

        if ($request->filled('anno')) {
            $query->whereYear('data', $request->input('anno'));
        }
        if ($request->boolean('oggi')) {
            $query->whereDate('data', now()->toDateString());
        }
        if ($request->filled('terapista_id')) {
            $query->where('terapista_id', $request->input('terapista_id'));
        }

        if ($request->filled('paziente_id')) {
            $query->where('paziente_id', $request->input('paziente_id'));
        }


        //  Se in sessione c'è un paziente → esporta solo le sue firme
        $logged = Session::get('logged_user');
        if (!empty($logged) && ($logged['ruolo'] ?? null) === 'paziente') {
            $userId  = $logged['id_utente'] ?? null;
            $nome    = $logged['nome'] ?? null;
            $cognome = $logged['cognome'] ?? null;

            $query->where(function ($q) use ($userId, $nome, $cognome) {
                // nuovo: match su paziente_id
                if (!empty($userId)) {
                    $q->where('paziente_id', $userId);
                }

                // fallback: vecchi record senza paziente_id (match su nome/cognome)
                if (!empty($nome) && !empty($cognome)) {
                    $q->orWhere(function ($qq) use ($nome, $cognome) {
                        $qq->whereNull('paziente_id')
                            ->whereRaw('LOWER(nome) = ?', [mb_strtolower($nome)])
                            ->whereRaw('LOWER(cognome) = ?', [mb_strtolower($cognome)]);
                    });
                }
            });
        }

        // righe per excel
        $rows = $query->get()->map(function ($firma) {
            return [
                'ID'        => $firma->id,
                'Nome'      => $firma->nome,
                'Cognome'   => $firma->cognome,
                'Data'      => $firma->data ? $firma->data->format('Y-m-d') : null,
                'Terapia'   => $firma->terapia,
                'Terapista' => optional($firma->terapista)->nome . ' ' . optional($firma->terapista)->cognome,
            ];
        })->toArray();

        // path temporaneo
        $tempPath = storage_path('app/archivio_firme.xlsx');

        // crea excel
        SimpleExcelWriter::create($tempPath)
            ->addRows($rows)
            ->close();

        // download + delete after send
        return response()
            ->download($tempPath, 'archivio_firme.xlsx')
            ->deleteFileAfterSend(true);
    }



    /**
     * Ritorna la lista delle firme per l'utente loggato (confronto su nome e cognome
     * presi dalla sessione). Supporta filtri opzionali: mese, anno, terapista_id.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function firmePazienteLoggato(Request $request)
    {
        $logged = Session::get('logged_user');
        if (empty($logged) || empty($logged['id_utente'])) {
            return response()->json(['errore' => 'Non autenticato'], 401);
        }

        $userId = $logged['id_utente'];

        $query = Firma::with('terapista')
            ->where(function ($q) use ($userId, $logged) {
                // nuovo modo
                $q->where('paziente_id', $userId);

                // fallback vecchi record senza paziente_id
                if (!empty($logged['nome']) && !empty($logged['cognome'])) {
                    $q->orWhere(function ($qq) use ($logged) {
                        $qq->whereNull('paziente_id')
                            ->whereRaw('LOWER(nome) = ?', [mb_strtolower($logged['nome'])])
                            ->whereRaw('LOWER(cognome) = ?', [mb_strtolower($logged['cognome'])]);
                    });
                }
            });

        if ($request->filled('mese')) $query->whereMonth('data', $request->input('mese'));
        if ($request->filled('anno')) $query->whereYear('data', $request->input('anno'));
        if ($request->boolean('oggi')) {
            $query->whereDate('data', now()->toDateString());
        }
        if ($request->filled('terapista_id')) {
            $query->where('terapista_id', $request->input('terapista_id'));
        }



        $firme = $query->get()->map(function ($firma) {
            return [
                'id'        => $firma->id,
                'nome'      => $firma->nome,
                'cognome'   => $firma->cognome,
                'data'      => $firma->data?->format('Y-m-d'),
                'terapia'   => $firma->terapia,
                'terapista' => $firma->terapista
                    ? $firma->terapista->nome . ' ' . $firma->terapista->cognome
                    : null,
            ];
        });

        return response()->json($firme);
    }
}

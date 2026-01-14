<?php

namespace App\Http\Controllers;

use App\Models\Firma;
use Illuminate\Http\Request;
use Spatie\SimpleExcel\SimpleExcelWriter;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Utente;

class FirmaController extends Controller
{
    public function index(Request $request)
    {
        $query = Firma::with(['terapista', 'terapisti', 'paziente', 'terapie'])
            ->orderBy('data', 'desc')
            ->orderBy('id', 'desc');

        if ($request->filled('mese')) {
            $query->whereMonth('data', $request->input('mese'));
        }

        if ($request->filled('anno')) {
            $query->whereYear('data', $request->input('anno'));
        }

        if ($request->boolean('oggi')) {
            $query->whereDate('data', now()->toDateString());
        }

        // filtro terapista (legacy + multi)
        if ($request->filled('terapista_id')) {
            $terapistaId = $request->input('terapista_id');

            $query->where(function ($q) use ($terapistaId) {
                $q->where('terapista_id', $terapistaId)
                    ->orWhereHas('terapisti', function ($qq) use ($terapistaId) {
                        $qq->where('utente.id', $terapistaId);
                    });
            });
        }

        if ($request->filled('paziente_id')) {
            $query->where('paziente_id', $request->input('paziente_id'));
        }

        $firme = $query->get()->map(function ($firma) {
            $nome    = $firma->paziente ? $firma->paziente->nome : $firma->nome;
            $cognome = $firma->paziente ? $firma->paziente->cognome : $firma->cognome;

            return [
                'id'          => $firma->id,
                'paziente_id' => $firma->paziente_id,
                'nome'        => $nome,
                'cognome'     => $cognome,
                'data'        => $firma->data?->format('Y-m-d'),
                'terapie'     => $firma->getTerapieEffettive()->values(),
                'terapisti'   => $firma->getTerapistiEffettivi()
                    ->map(fn($t) => $t->nome . ' ' . $t->cognome)
                    ->values(),
                'note'        => $firma->note,
            ];
        });

        return response()->json($firme);
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'paziente_id' => 'nullable|exists:utente,id',
            'nome'        => 'nullable|required_without:paziente_id|string|max:255',
            'cognome'     => 'nullable|required_without:paziente_id|string|max:255',
            'data'        => 'required|date',
            'note'        => 'nullable|string',

            // legacy
            'terapista_id' => 'nullable|exists:utente,id',
            'terapia'      => 'nullable|string|max:255',

            // nuovo (multi)
            'terapisti'   => 'nullable|array',
            'terapisti.*' => 'exists:utente,id',
            'terapie'     => 'nullable|array',
            'terapie.*'   => 'string|max:255',
        ]);

        // snapshot paziente
        if (!empty($validated['paziente_id'])) {
            $p = Utente::select('id', 'nome', 'cognome')->find($validated['paziente_id']);
            $validated['nome']    = $p?->nome ?? $validated['nome'] ?? '';
            $validated['cognome'] = $p?->cognome ?? $validated['cognome'] ?? '';
        }

        // fallback legacy
        $terapistaLegacy = $validated['terapista_id']
            ?? ($validated['terapisti'][0] ?? null);

        $terapiaLegacy = $validated['terapia']
            ?? ($validated['terapie'][0] ?? null);

        $firma = Firma::create([
            'paziente_id'  => $validated['paziente_id'] ?? null,
            'nome'         => $validated['nome'],
            'cognome'      => $validated['cognome'],
            'data'         => $validated['data'],
            'note'         => $validated['note'] ?? null,
            'terapista_id' => $terapistaLegacy,
            'terapia'      => $terapiaLegacy,
        ]);

        // MULTI TERAPISTI
        if (!empty($validated['terapisti']) && count($validated['terapisti']) > 1) {
            $firma->terapisti()->sync($validated['terapisti']);
        }

        // MULTI TERAPIE
        if (!empty($validated['terapie']) && count($validated['terapie']) > 1) {
            foreach ($validated['terapie'] as $terapia) {
                DB::table('firma_terapia')->insert([
                    'firma_id' => $firma->id,
                    'terapia'  => $terapia,
                ]);
            }
        }

        return response()->json([
            'message' => 'Firma creata con successo.',
            'firma'   => $firma->load(['terapista', 'terapisti', 'paziente', 'terapie']),
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
        $query = Firma::with(['terapista', 'terapisti', 'terapie']);

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
            $tid = $request->input('terapista_id');

            $query->where(function ($q) use ($tid) {
                $q->where('terapista_id', $tid)
                    ->orWhereHas('terapisti', fn($qq) => $qq->where('utente.id', $tid));
            });
        }

        if ($request->filled('paziente_id')) {
            $query->where('paziente_id', $request->input('paziente_id'));
        }

        $rows = $query->get()->map(function ($firma) {
            return [
                'ID'        => $firma->id,
                'Nome'      => $firma->nome,
                'Cognome'   => $firma->cognome,
                'Data'      => $firma->data?->format('Y-m-d'),
                'Terapie'   => $firma->getTerapieEffettive()->implode(', '),
                'Terapisti' => $firma->getTerapistiEffettivi()
                    ->map(fn($t) => $t->nome . ' ' . $t->cognome)
                    ->implode(', '),
                'Note'      => $firma->note,
            ];
        })->toArray();

        $tempPath = storage_path('app/archivio_firme.xlsx');

        SimpleExcelWriter::create($tempPath)
            ->addRows($rows)
            ->close();

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

        $query = Firma::with(['terapista', 'terapisti', 'terapie'])
            ->where(function ($q) use ($userId, $logged) {
                $q->where('paziente_id', $userId);

                if (!empty($logged['nome']) && !empty($logged['cognome'])) {
                    $q->orWhere(function ($qq) use ($logged) {
                        $qq->whereNull('paziente_id')
                            ->whereRaw('LOWER(nome) = ?', [mb_strtolower($logged['nome'])])
                            ->whereRaw('LOWER(cognome) = ?', [mb_strtolower($logged['cognome'])]);
                    });
                }
            });

        if ($request->filled('mese')) {
            $query->whereMonth('data', $request->input('mese'));
        }

        if ($request->filled('anno')) {
            $query->whereYear('data', $request->input('anno'));
        }

        if ($request->boolean('oggi')) {
            $query->whereDate('data', now()->toDateString());
        }

        $firme = $query->get()->map(function ($firma) {
            return [
                'id'        => $firma->id,
                'nome'      => $firma->nome,
                'cognome'   => $firma->cognome,
                'data'      => $firma->data?->format('Y-m-d'),
                'terapie'   => $firma->getTerapieEffettive()->values(),
                'terapisti' => $firma->getTerapistiEffettivi()
                    ->map(fn($t) => $t->nome . ' ' . $t->cognome)
                    ->values(),
            ];
        });

        return response()->json($firme);
    }
}

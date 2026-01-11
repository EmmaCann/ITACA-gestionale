<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ListaAttesa;
use App\Models\Utente;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;


class ListaAttesaController extends Controller
{
    public function index(Request $request)
    {
        // Pulizia solo una volta al giorno
        $oggi = now()->toDateString();
        $ultimaPulizia = cache('ultima_pulizia');

        if ($ultimaPulizia !== $oggi) {
            $this->cleanChiamati();
            cache(['ultima_pulizia' => $oggi], now()->addDay());
        }

        $query = ListaAttesa::with(['terapista', 'utente']);

        // Filtro: tipo utente (registrato / nuovo)
        if ($request->has('tipo_utente')) {
            if ($request->tipo_utente === 'registrato') {
                $query->whereNotNull('utente_id');
            } elseif ($request->tipo_utente === 'nuovo') {
                $query->whereNull('utente_id');
            }
        }

        // Filtro: tipologia terapia
        if ($request->has('terapia')) {
            $query->where('terapia', $request->terapia);
        }

        // Filtro: richiesta terapista specifico
        if ($request->has('richiesta_terapista') && $request->richiesta_terapista === '1') {
            $query->whereNotNull('terapista_id');
        }

        $voci = $query->orderByDesc('data')->get();

        return response()->json($voci);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'nome' => 'nullable|string',
            'cognome' => 'nullable|string',
            'telefono' => 'nullable|string',
            'email' => 'nullable|email',
            'data' => 'required|date',
            'terapia' => 'required|string',
             'note' => 'nullable|string',
            'terapista_id' => 'nullable|exists:utente,id',
            'utente_id' => 'nullable|exists:utente,id',
        ]);

        // Se viene passato un utente registrato, recuperiamo i suoi dati
        if (!empty($validated['utente_id'])) {
            $utente = Utente::find($validated['utente_id']);
            if ($utente) {
                $validated['nome'] = $utente->nome;
                $validated['cognome'] = $utente->cognome;
                $validated['telefono'] = $utente->telefono ?? $validated['telefono'];
                $validated['email'] = $utente->email ?? $validated['email'];
            }
        }

        $validated['chiamato'] = false;

        $voce = ListaAttesa::create($validated);

        return response()->json($voce, 201);
    }


    public function segnaChiamato(Request $request, $id)
    {
        $request->validate([
            'chiamato' => 'required|boolean',
        ]);

        $voce = ListaAttesa::findOrFail($id);
        $voce->chiamato = $request->chiamato;
        $voce->save();

        return response()->json(['success' => true]);
    }


    public function cleanChiamati()
    {
        Log::info('Esecuzione cleanChiamati - eliminazione voci chiamate e vecchie.');

        ListaAttesa::whereDate('data', '<', now()->format('Y-m-d'))
            ->where('chiamato', true)
            ->delete();
    }

    public function aggiornaTerapia(Request $request, $id)
    {
        $request->validate([
            'terapia' => 'required|string',
        ]);

        $voce = ListaAttesa::findOrFail($id);
        $voce->terapia = $request->terapia;
        $voce->save();

        return response()->json(['success' => true]);
    }

    public function aggiornaTerapista(Request $request, $id)
    {
        $request->validate([
            'terapista_id' => 'nullable|exists:utente,id',
        ]);

        $voce = ListaAttesa::findOrFail($id);
        $voce->terapista_id = $request->terapista_id;
        $voce->save();

        return response()->json(['success' => true]);
    }
}

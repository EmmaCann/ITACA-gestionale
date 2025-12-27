<?php

namespace App\Http\Controllers;

use App\Models\Tariffa;
use App\Models\Utente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TariffaController extends Controller
{
    //  Mostra tutte le tariffe 
    public function index()
    {
        $tariffe = Tariffa::with('terapista')->get();
        return response()->json($tariffe->values());
    }

    //  Crea una nuova tariffa
    public function store(Request $request)
    {
        $validated = $request->validate([
            'utente_id' => 'required|exists:utente,id',
            'terapia'   => 'required|string|max:255',
            'prezzo'    => 'required|numeric|min:0',
            'durata'    => 'required|integer|min:1',
            'note'      => 'nullable|string',
        ]);

        $tariffa = Tariffa::create($validated);

        return redirect()->back()->with('success', 'Tariffa creata con successo.');
    }

    //  Mostra una tariffa singola (opzionale, per modale/modifica)
    public function show($id)
    {
        $tariffa = Tariffa::with('terapista')->findOrFail($id);

        return response()->json($tariffa);
    }

    //  Aggiorna una tariffa
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'utente_id' => 'required|exists:utente,id',
            'terapia'   => 'required|string|max:255',
            'prezzo'    => 'required|numeric|min:0',
            'durata'    => 'required|integer|min:1',
            'note'      => 'nullable|string',
        ]);

        $tariffa = Tariffa::findOrFail($id);
        $tariffa->update($validated);

        return response()->json(['message' => 'Tariffa aggiornata con successo.']);
    }


    //  Elimina una tariffa
    public function destroy($id)
    {
        $tariffa = Tariffa::findOrFail($id);
        $tariffa->delete();

        return response()->json(['message' => 'Tariffa eliminata con successo.'], 200);
    }
}

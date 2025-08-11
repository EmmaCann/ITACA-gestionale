<?php

namespace App\Http\Controllers;

use App\Models\Firma;
use Illuminate\Http\Request;
use Spatie\SimpleExcel\SimpleExcelWriter;

class FirmaController extends Controller
{
    public function index(Request $request)
    {
        $query = Firma::with('terapista');

        if ($request->filled('mese')) {
            $query->whereMonth('data', $request->input('mese'));
        }

        if ($request->filled('anno')) {
            $query->whereYear('data', $request->input('anno'));
        }

        $firme = $query->get()->map(function ($firma) {
            return [
                'id'        => $firma->id,
                'nome'      => $firma->nome,
                'cognome'   => $firma->cognome,
                'data'      => $firma->data->format('Y-m-d'),
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
            'nome'         => 'required|string|max:255',
            'cognome'      => 'required|string|max:255',
            'data'         => 'required|date',
            'terapia'      => 'required|string|max:255',
            'terapista_id' => 'required|exists:utente,id',
        ]);

        $firma = Firma::create($validated);

        return response()->json([
            'message' => 'Firma creata con successo.',
            'firma' => $firma->load('terapista'),
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

    if ($request->filled('mese')) {
        $query->whereMonth('data', $request->input('mese'));
    }

    if ($request->filled('anno')) {
        $query->whereYear('data', $request->input('anno'));
    }

    $rows = $query->get()->map(function ($firma) {
        return [
            'ID'        => $firma->id,
            'Nome'      => $firma->nome,
            'Cognome'   => $firma->cognome,
            'Data'      => $firma->data->format('Y-m-d'),
            'Terapia'   => $firma->terapia,
            'Terapista' => optional($firma->terapista)->nome . ' ' . optional($firma->terapista)->cognome,
        ];
    })->toArray();

    // Percorso temporaneo per il file Excel
    $tempPath = storage_path('app/archivio_firme.xlsx');

    // Crea e salva il file Excel
    SimpleExcelWriter::create($tempPath)
        ->addRows($rows)
        ->close(); // <-- importante per chiudere e salvare il file

    // Ritorna il file per il download e lo elimina dopo l'invio
    return response()->download($tempPath, 'archivio_firme.xlsx')->deleteFileAfterSend(true);
}


}

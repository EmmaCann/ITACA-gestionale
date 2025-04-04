<?php

namespace App\Http\Controllers;

use App\Models\Pagamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PagamentoController extends Controller
{
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'terapista_id'  => 'required|exists:utente,id',
        'data'          => 'required|date',
        'importo'       => 'required|numeric|min:0',
        'paziente_id'   => 'nullable|exists:utente,id',
        'nome'          => 'required_without:paziente_id|string|max:255',
        'cognome'       => 'required_without:paziente_id|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Errore di validazione',
            'errors' => $validator->errors(),
        ], 422);
    }

    // Usa input() invece di all()
    $pagamento = Pagamento::create([
        'terapista_id' => $request->input('terapista_id'),
        'data'         => $request->input('data'),
        'importo'      => $request->input('importo'),
        'paziente_id'  => $request->input('paziente_id'),
        'nome'         => $request->input('nome'),
        'cognome'      => $request->input('cognome'),
    ]);


    return response()->json([
        'message' => 'Pagamento creato con successo',
        'pagamento' => $pagamento,
    ], 201);
}

}

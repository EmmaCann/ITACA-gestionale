<?php

namespace App\Http\Controllers;

use App\Models\Appuntamento;
use Illuminate\Http\Request;


class AppuntamentiController extends Controller
{
    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'terapista_id' => 'required|exists:utente,id',
            'data' => 'required|date',
            'ora' => 'required|date_format:H:i',
            'note' => 'nullable|string',
            'paziente_id' => 'nullable|exists:utente,id',
            'nome' => 'nullable|required_without:paziente_id|string',
            'cognome' => 'nullable|required_without:paziente_id|string',
        ]);
    
        
        $appuntamento = Appuntamento::create($validated);
    
        return response()->json([
            'message' => 'Appuntamento creato con successo!',
            'data' => $appuntamento
        ], 201);
    }


}

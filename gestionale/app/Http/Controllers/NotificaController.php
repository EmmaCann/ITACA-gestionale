<?php

namespace App\Http\Controllers;

use App\Models\Notifica;
use App\Models\Utente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class NotificaController extends Controller
{
    public function store(Request $request)
    {

        $admin = Session::get('logged_user');

        if (!$admin || $admin['ruolo'] !== 'admin') {
            return response()->json(['errore' => 'Non autorizzato'], 403);
        }

        $request->validate([
            'destinatario' => 'required|in:tutti,staff,pazienti,singolo',
            'messaggio'    => 'required|string',
            'tipologia'    => 'nullable|string',
            'urgenza'      => 'nullable|string',
            'utente_id'    => 'nullable|exists:utenti,id'
        ]);

        
        $notifica = Notifica::create([
            'admin_id' => $admin['id_utente'], 
            'messaggio' => $request->messaggio,
            'tipologia' => $request->tipologia,
            'urgenza'   => $request->urgenza,
        ]);


        switch ($request->destinatario) {
            case 'tutti':
                $utenti = Utente::pluck('id');
                break;

            case 'staff':
                $utenti = Utente::where('ruolo', 'staff')->pluck('id');
                break;

            case 'pazienti':
                $utenti = Utente::where('ruolo', 'paziente')->pluck('id');
                break;

            case 'singolo':
                $utenti = collect([$request->utente_id]);
                break;
        }

       
        foreach ($utenti as $utenteId) {
            $notifica->destinatari()->attach($utenteId, [
                'letta' => false,
                'letta_il' => null
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notifica inviata correttamente'
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Notifica;
use App\Models\Utente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotificaController extends Controller
{

    public function index()
    {
        $utenteId = Session::get('logged_user.id_utente');

        if (!$utenteId) {
            return response()->json([], 401);
        }

        $notifiche = DB::table('notifica_utente')
            ->join('notifiche', 'notifiche.id', '=', 'notifica_utente.notifica_id')
            ->leftJoin('utente as mittente', 'mittente.id', '=', 'notifiche.admin_id')
            ->where('notifica_utente.utente_id', $utenteId)
            ->orderBy('notifiche.created_at', 'desc')
            ->select(
                'notifiche.id',
                'notifiche.messaggio',
                'notifiche.tipologia',
                'notifiche.urgenza',
                'notifica_utente.letta',
                'notifiche.created_at',

                // MITTENTE
                'mittente.nome as mittente_nome',
                'mittente.cognome as mittente_cognome'
            )
            ->get();

        $nonLette = $notifiche->where('letta', 0)->count();

        return response()->json([
            'non_lette' => $nonLette,
            'notifiche' => $notifiche
        ]);
    }

    public function segnaComeLetta($id)
    {
        $utenteId = Session::get('logged_user.id_utente');

        DB::table('notifica_utente')
            ->where('notifica_id', $id)
            ->where('utente_id', $utenteId)
            ->update([
                'letta' => 1,
                'letta_il' => now()
            ]);

        return response()->json(['success' => true]);
    }


    public function store(Request $request)
    {

        $utente = Session::get('logged_user');

        if (
            !$utente ||
            !in_array($utente['ruolo'], ['admin', 'staff'])
        ) {
            return response()->json(['errore' => 'Non autorizzato'], 403);
        }


        $request->validate([
            'destinatario' => 'required|in:tutti,staff,pazienti,singolo',
            'messaggio'    => 'required|string',
            'tipologia'    => 'nullable|string',
            'urgenza'      => 'nullable|string',
            'utente_id'    => 'nullable|exists:utente,id'
        ]);


        $notifica = Notifica::create([
            'admin_id' => $utente['id_utente'],
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

        Log::info('Invio notifica', $request->all());


        return response()->json([
            'success' => true,
            'message' => 'Notifica inviata correttamente'
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pagamento;
use App\Models\Firma;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class PagamentiPazientiController extends Controller
{
    public function index()
    {
        // Recupera l'ID dell'utente loggato dalla sessione
        $userId = Session::get('logged_user')['id_utente'];

        // Recupera i pagamenti dell'utente loggato
        $pagamenti = Pagamento::where('paziente_id', $userId)->get();

        // Recupera tutte le firme senza filtri per analisi
        $firme = Firma::all();

        // Log dei dati recuperati dal database
        Log::info('Pagamenti recuperati:', ['pagamenti' => $pagamenti]);
        Log::info('Firme recuperate:', ['firme' => $firme]);

        // Recupera il nome e cognome dell'utente loggato dalla sessione
        $loggedUser = Session::get('logged_user');
        $loggedNome = strtolower($loggedUser['nome']);
        $loggedCognome = strtolower($loggedUser['cognome']);

        // Determina lo stato dei pagamenti confrontando con le firme
        $pagamentiConStato = $pagamenti->map(function ($pagamento) use ($firme, $loggedNome, $loggedCognome) {

            // Paziente
            if ($pagamento->paziente_id) {
                $utente = $pagamento->paziente;
                $pagamento->nome = $utente->nome;
                $pagamento->cognome = $utente->cognome;
            }

            // TERAPISTA
            if ($pagamento->terapista) {
                $pagamento->therapist =
                    $pagamento->terapista->nome . " " . $pagamento->terapista->cognome;
            } else {
                $pagamento->therapist = null;
            }
            // Cerca la firma corrispondente
            $firmaCorrispondente = $firme->first(function ($f) use ($pagamento, $loggedNome, $loggedCognome) {
                return strtolower($f->nome) === $loggedNome &&
                    strtolower($f->cognome) === $loggedCognome &&
                    $f->data->eq($pagamento->data) &&
                    $f->terapista_id === $pagamento->terapista_id;
            });

            // Prestazione = terapia della firma
            $pagamento->service = $firmaCorrispondente->terapia ?? null;



            // STATO
            $pagamento->status = $firme->contains(function ($firma) use ($pagamento, $loggedNome, $loggedCognome) {
                return strtolower($firma->nome) === $loggedNome &&
                    strtolower($firma->cognome) === $loggedCognome &&
                    $firma->data->eq($pagamento->data) &&
                    $firma->terapista_id === $pagamento->terapista_id &&
                    $firma->terapia === $pagamento->terapista->staffDati->terapia;
            }) ? 'paid' : 'unpaid';


            return $pagamento;
        });


        return response()->json([
            'data' => $pagamentiConStato
        ]);
    }
}

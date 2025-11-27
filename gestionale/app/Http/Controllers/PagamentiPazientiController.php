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
   public function index(Request $request)
{
    $loggedUser = Session::get('logged_user');
    $userId = $loggedUser['id_utente'];

    $loggedNome = strtolower($loggedUser['nome']);
    $loggedCognome = strtolower($loggedUser['cognome']);

    
    $month = $request->query('month');     // 1..12
    $year = $request->query('year');       // 2025
    $terapista = $request->query('terapista'); // ID terapista
    $status = $request->query('status');   // paid | unpaid

    // FIRME filtrate
    $firme = Firma::whereRaw('LOWER(nome) = ?', [$loggedNome])
        ->whereRaw('LOWER(cognome) = ?', [$loggedCognome])
        ->when($month, fn($q) => $q->whereMonth('data', $month))
        ->when($year, fn($q) => $q->whereYear('data', $year))
        ->when($terapista && $terapista != 'all', fn($q) => $q->where('terapista_id', $terapista))
        ->get();

    // PAGAMENTI dell’utente
    $pagamenti = Pagamento::where('paziente_id', $userId)->get();

    // GENERA RISULTATO
    $risultato = $firme->map(function ($firma) use ($pagamenti, $status) {

        $pagamento = $pagamenti->first(function ($p) use ($firma) {
            return $p->data->eq($firma->data) &&
                   $p->terapista_id == $firma->terapista_id;
        });

        $rowStatus = $pagamento ? 'paid' : 'unpaid';

        // filtra per stato (solo se richiesto)
        if ($status && $status !== $rowStatus) {
            return null;
        }

        return [
            'data' => $firma->data,
            'therapist' => $firma->terapista?->nome . ' ' . $firma->terapista?->cognome,
            'therapist_id' => $firma->terapista_id,
            'service' => $firma->terapia,
            'status' => $rowStatus,
        ];
    })
    ->filter() // rimuove null
    ->values();

    return response()->json([
        'data' => $risultato
    ]);
}


}

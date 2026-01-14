<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pagamento;
use App\Models\Firma;
use Illuminate\Support\Facades\Session;

class PagamentiPazientiController extends Controller
{
    public function index(Request $request)
    {
        /* =========================
         * 1. UTENTE LOGGATO
         * ========================= */
        $logged = Session::get('logged_user');

        if (!$logged || empty($logged['id_utente'])) {
            return response()->json(['error' => 'Non autenticato'], 401);
        }

        $userId        = $logged['id_utente'];
        $loggedNome    = mb_strtolower($logged['nome']);
        $loggedCognome = mb_strtolower($logged['cognome']);

        /* =========================
         * 2. FILTRI
         * ========================= */
        $month     = $request->query('month');     // 1..12
        $year      = $request->query('year');      // 2025
        $terapista = $request->query('terapista'); // id | all
        $status    = $request->query('status');    // paid | unpaid

        /* =========================
         * 3. FIRME DEL PAZIENTE
         * ========================= */
        $firme = Firma::with('terapista')
            ->where(function ($q) use ($userId, $loggedNome, $loggedCognome) {
                $q->where('paziente_id', $userId)
                  ->orWhere(function ($qq) use ($loggedNome, $loggedCognome) {
                      $qq->whereNull('paziente_id')
                         ->whereRaw('LOWER(nome) = ?', [$loggedNome])
                         ->whereRaw('LOWER(cognome) = ?', [$loggedCognome]);
                  });
            })
            ->when($month, fn ($q) => $q->whereMonth('data', $month))
            ->when($year, fn ($q) => $q->whereYear('data', $year))
            ->when(
                $terapista && $terapista !== 'all',
                fn ($q) => $q->where('terapista_id', $terapista)
            )
            ->orderBy('data', 'desc')
            ->get();

        /* =========================
         * 4. PAGAMENTI VISIBILI
         * ========================= */
        $pagamenti = Pagamento::with('terapista')
            ->where(function ($q) use ($userId, $loggedNome, $loggedCognome) {
                $q->where('paziente_id', $userId)
                  ->orWhere(function ($qq) use ($loggedNome, $loggedCognome) {
                      $qq->whereNull('paziente_id')
                         ->whereRaw('LOWER(nome) = ?', [$loggedNome])
                         ->whereRaw('LOWER(cognome) = ?', [$loggedCognome]);
                  });
            })
            ->get();

        /* =========================
         * 5. COSTRUZIONE RISULTATO
         * ========================= */
        $rows = collect();

        // 5A — FIRME (pagate / da pagare)
        foreach ($firme as $firma) {
            $pagamento = $pagamenti->first(function ($p) use ($firma) {
                return
                    $p->terapista_id == $firma->terapista_id &&
                    $p->data->toDateString() === $firma->data->toDateString();
            });

            $rowStatus = $pagamento ? 'paid' : 'unpaid';

            if ($status && $status !== $rowStatus) {
                continue;
            }

            $rows->push([
                'data'         => $firma->data->format('Y-m-d'),
                'therapist'    => $firma->terapista
                    ? $firma->terapista->nome . ' ' . $firma->terapista->cognome
                    : null,
                'therapist_id' => $firma->terapista_id,
                'service'      => $firma->terapia,
                'status'       => $rowStatus,
            ]);
        }

        // 5B — PAGAMENTI SENZA FIRMA (ADMIN)
        $pagamentiSenzaFirma = $pagamenti->filter(function ($p) use ($firme) {
            return !$firme->first(function ($f) use ($p) {
                return
                    $f->terapista_id == $p->terapista_id &&
                    $f->data->toDateString() === $p->data->toDateString();
            });
        });

        foreach ($pagamentiSenzaFirma as $p) {
            if ($status && $status !== 'paid') {
                continue;
            }

            $rows->push([
                'data'         => $p->data->format('Y-m-d'),
                'therapist'    => $p->terapista
                    ? $p->terapista->nome . ' ' . $p->terapista->cognome
                    : null,
                'therapist_id' => $p->terapista_id,
                'service'      => 'Pagamento registrato',
                'status'       => 'paid',
            ]);
        }

        /* =========================
         * 6. RESPONSE
         * ========================= */
        return response()->json([
            'data' => $rows
                ->sortByDesc('data')
                ->values(),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appuntamento;
use App\Models\CartellaClinica;
use App\Models\Firma;
use App\Models\ListaAttesa;
use App\Models\Pagamento;
use App\Models\Tariffa;

class SystemMaintenanceController extends Controller
{
    /** Lista d'Attesa */
    public function purgeWaitlist(Request $request)
    {
        $count = ListaAttesa::query()->delete();
        return response()->json([
            'status' => 'success',
            'message' => "Eliminati {$count} record dalla lista d'attesa",
            'deleted' => $count,
        ]);
    }

    /** Archivio Firme */
    public function purgeSignatures(Request $request)
    {
        $count = Firma::query()->delete();
        return response()->json([
            'status' => 'success',
            'message' => "Eliminate {$count} firme digitali",
            'deleted' => $count,
        ]);
    }

    /** Appuntamenti */
    public function purgeAppointments(Request $request)
    {
        $count = Appuntamento::query()->delete();
        return response()->json([
            'status' => 'success',
            'message' => "Eliminati {$count} appuntamenti",
            'deleted' => $count,
        ]);
    }

    /** Registro Incassi / Pagamenti */
    public function purgePayments(Request $request)
    {
        $count = Pagamento::query()->delete();
        return response()->json([
            'status' => 'success',
            'message' => "Eliminati {$count} record di pagamento",
            'deleted' => $count,
        ]);
    }

    /** Tariffario */
    public function purgePrices(Request $request)
    {
        $count = Tariffa::query()->delete();
        return response()->json([
            'status' => 'success',
            'message' => "Eliminate {$count} tariffe",
            'deleted' => $count,
        ]);
    }

    /** Cartelle Cliniche */
    public function purgeMedicalCharts(Request $request)
    {
        $count = CartellaClinica::query()->delete();
        return response()->json([
            'status' => 'success',
            'message' => "Eliminate {$count} cartelle cliniche",
            'deleted' => $count,
        ]);
    }
}

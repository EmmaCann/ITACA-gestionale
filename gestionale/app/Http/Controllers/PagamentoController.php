<?php

namespace App\Http\Controllers;

use App\Models\Pagamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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



public function stats()
{
    $oggi = Carbon::today();
    $settimana = Carbon::now()->subDays(7);
    $mese = Carbon::now()->startOfMonth();
    $anno = Carbon::now()->startOfYear();

    return response()->json([
        'giorno' => Pagamento::whereDate('data', $oggi)->sum('importo'),
        'settimana' => Pagamento::where('data', '>=', $settimana)->sum('importo'),
        'mese' => Pagamento::where('data', '>=', $mese)->sum('importo'),
        'anno' => Pagamento::where('data', '>=', $anno)->sum('importo'),
    ]);
}



public function dettagliStats(Request $request)
{
    $tipo = $request->input('tipo'); // 'giorno', 'settimana', 'mese', 'anno'
    $oggi = Carbon::today();

    $query = Pagamento::query();

    switch ($tipo) {
        case 'giorno':
            $oggi = Carbon::today();
            $incassi = $query->whereDate('data', $oggi)
                ->select(DB::raw("HOUR(data) as ora"), DB::raw("SUM(importo) as totale"))
                ->groupBy(DB::raw("HOUR(data)"))
                ->pluck('totale', 'ora');
        
            $dati = collect(range(8, 20))->map(function ($ora) use ($incassi) {
                return [
                    'label' => sprintf('%02d:00', $ora),
                    'valore' => number_format($incassi[$ora] ?? 0, 2) . '€'
                ];
            });
            break;
        

            case 'settimana':
                $inizioSettimana = Carbon::now()->startOfWeek();
                $incassi = $query->where('data', '>=', $inizioSettimana)
                    ->select(DB::raw("DATE(data) as giorno"), DB::raw("SUM(importo) as totale"))
                    ->groupBy('giorno')
                    ->pluck('totale', 'giorno');
            
                $dati = collect(range(0, 6))->map(function ($i) use ($inizioSettimana, $incassi) {
                    $giorno = $inizioSettimana->copy()->addDays($i);
                    $dataKey = $giorno->toDateString();
                    return [
                        'label' => $giorno->translatedFormat('D d/m'),
                        'valore' => number_format($incassi[$dataKey] ?? 0, 2) . '€'
                    ];
                });
                break;
            

                case 'mese':
                    $inizioMese = Carbon::now()->startOfMonth();
                    $incassi = $query->where('data', '>=', $inizioMese)
                        ->select(DB::raw("WEEK(data, 1) as settimana"), DB::raw("SUM(importo) as totale"))
                        ->groupBy(DB::raw("WEEK(data, 1)"))
                        ->pluck('totale', 'settimana');
                
                    $dati = collect(range(1, 4))->map(function ($settimana) use ($incassi) {
                        return [
                            'label' => 'Settimana ' . $settimana,
                            'valore' => number_format($incassi[$settimana] ?? 0, 2) . '€'
                        ];
                    });
                    break;
                
                    case 'anno':
                        $inizioAnno = Carbon::now()->startOfYear();
                        $incassi = $query->where('data', '>=', $inizioAnno)
                            ->select(DB::raw("MONTH(data) as mese"), DB::raw("SUM(importo) as totale"))
                            ->groupBy(DB::raw("MONTH(data)"))
                            ->pluck('totale', 'mese');
                    
                        $dati = collect(range(1, 12))->map(function ($mese) use ($incassi) {
                            return [
                                'label' => Carbon::createFromDate(null, $mese)->translatedFormat('M'),
                                'valore' => number_format($incassi[$mese] ?? 0, 2) . '€'
                            ];
                        });
                        break;
                    

        default:
            return response()->json(['error' => 'Tipo non valido'], 422);
    }

    return response()->json($dati->values());

}



}

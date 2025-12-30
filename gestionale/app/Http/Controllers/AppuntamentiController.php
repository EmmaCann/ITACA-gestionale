<?php

namespace App\Http\Controllers;

use App\Models\Appuntamento;
use App\Models\PazienteTerapista;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class AppuntamentiController extends Controller
{
    private function colorForTherapist(int $id = 0): string
    {
        // 12 colori molto diversi tra loro
        $palette = [
            '#2563EB', // blue
            '#DC2626', // red
            '#7C3AED', // purple
            '#F59E0B', // amber
            '#059669', // emerald
            '#D946EF', // fuchsia
            '#0EA5E9', // sky
            '#EA580C', // orange
            '#10B981', // green
            '#9333EA', // violet
            '#14B8A6', // teal
            '#EF4444', // rose-red
        ];
        if ($id <= 0) return '#64748B'; // fallback slate
        return $palette[($id - 1) % count($palette)];
    }

    private function idealTextColor(string $hexBg): string
    {
        // hex -> luminanza approssimata per decidere tra nero o bianco
        $hex = ltrim($hexBg, '#');
        if (strlen($hex) === 3) $hex = "{$hex[0]}{$hex[0]}{$hex[1]}{$hex[1]}{$hex[2]}{$hex[2]}";
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        // YIQ
        $yiq = (($r * 299) + ($g * 587) + ($b * 114)) / 1000;
        return $yiq >= 140 ? '#111827' : '#FFFFFF'; // dark gray vs white
    }


    public function index(Request $request)
    {
        $ruolo  = session('logged_user.ruolo');
        $userId = session('logged_user.id_utente');

        $start        = $request->query('start');
        $end          = $request->query('end');
        $terapistaId  = $request->query('terapista_id');

        Log::info("CALENDAR INDEX", [
            'ruolo'             => $ruolo,
            'userId'            => $userId,
            'start'             => $start,
            'end'               => $end,
            'terapista_filter'  => $terapistaId,
        ]);

        $q = Appuntamento::query()->with([
            'paziente:id,nome,cognome',
            'terapista:id,nome,cognome',
        ]);

        // Range temporale richiesto da FullCalendar
        if ($start && $end) {
            $q->whereBetween('data', [
                Carbon::parse($start)->toDateString(),
                Carbon::parse($end)->toDateString()
            ]);
        }

        // -----------------------------------------
        // 1️⃣ FILTRO PER RUOLO
        // -----------------------------------------
        if ($ruolo === 'admin') {
            // admin vede tutto
        } elseif ($ruolo === 'staff') {
            // staff vede SOLO i suoi appuntamenti
            $q->where('terapista_id', $userId);
        } elseif ($ruolo === 'paziente') {
            // paziente vede SOLO i suoi appuntamenti
            $q->where('paziente_id', $userId);
        }

        // -----------------------------------------
        // 2️⃣ FILTRO TERAPISTA (solo admin + paziente)
        // -----------------------------------------
        if (
            ($ruolo === 'admin' || $ruolo === 'paziente') &&
            $terapistaId !== null &&
            $terapistaId !== '' &&
            is_numeric($terapistaId)
        ) {
            $q->where('terapista_id', intval($terapistaId));
        }

        $items = $q->get();

        Log::info("CALENDAR RESULTS", [
            'count' => $items->count(),
            'ids'   => $items->pluck('id'),
        ]);

        // Mappiamo gli eventi per FullCalendar
        $events = $items->map(function ($a) {
            $date = $a->data instanceof Carbon ? $a->data->toDateString() : $a->data;
            $time = $a->ora instanceof Carbon ? $a->ora->format('H:i:s') : ($a->ora ?: '00:00:00');

            $startAt = Carbon::createFromFormat('Y-m-d H:i:s', "$date $time");
            $durata  = $a->durata_minuti ?? 30;
            $endAt   = (clone $startAt)->addMinutes($durata);

            $pazienteName = $a->paziente
                ? trim("{$a->paziente->nome} {$a->paziente->cognome}")
                : trim("{$a->nome} {$a->cognome}");

            if ($pazienteName === '') $pazienteName = 'Paziente';

            $terapistaName = $a->terapista
                ? trim("{$a->terapista->nome} {$a->terapista->cognome}")
                : "Terapista";

            $title = "{$pazienteName} — Dr. {$terapistaName}";

            $bg = $this->colorForTherapist((int)$a->terapista_id);
            $fg = $this->idealTextColor($bg);

            return [
                'id'              => $a->id,
                'title'           => $title,
                'start'           => $startAt->format('Y-m-d\TH:i:s'),
                'end'             => $endAt->format('Y-m-d\TH:i:s'),
                'backgroundColor' => $bg,
                'borderColor'     => $bg,
                'textColor'       => $fg,
                'extendedProps'   => [
                    'paziente_id'   => $a->paziente_id,
                    'terapista_id'  => $a->terapista_id,
                    'note'          => $a->note,
                    'durata_minuti' => $durata,
                ],
            ];
        });

        return response()->json($events);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'terapista_id'  => 'required|exists:utente,id',
            'data'          => 'required|date',
            'ora'           => 'required|date_format:H:i',
            'note'          => 'nullable|string',
            'paziente_id'   => 'nullable|exists:utente,id',
            'nome'          => 'nullable|required_without:paziente_id|string',
            'cognome'       => 'nullable|required_without:paziente_id|string',
            'durata_minuti' => 'nullable|integer|min:5|max:720',
        ]);

        if (empty($validated['durata_minuti'])) {
            $validated['durata_minuti'] = 30;
        }

        $appuntamento = Appuntamento::create($validated);

        // Se l'appuntamento ha un paziente, assicuriamoci che la coppia paziente-terapista esista
        if (!empty($validated['paziente_id'])) {
            $exists = PazienteTerapista::where('paziente_id', $validated['paziente_id'])
                ->where('terapista_id', $validated['terapista_id'])
                ->exists();

            if (! $exists) {
                PazienteTerapista::create([
                    'paziente_id'  => $validated['paziente_id'],
                    'terapista_id' => $validated['terapista_id'],
                    'data'         => $validated['data'], // puoi decidere cosa salvare
                ]);
            }
        }

        return response()->json([
            'message' => 'Appuntamento creato con successo!',
            'data' => $appuntamento
        ], 201);
    }



    public function update(Request $request, $id)
    {
        $ruolo = session('logged_user.ruolo');
        if ($ruolo !== 'admin') {
            return response()->json(['message' => 'Non autorizzato'], 403);
        }

        $validated = $request->validate([
            'start'          => ['nullable', 'date'],
            'end'            => ['nullable', 'date'],
            'data'           => ['nullable', 'date'],
            'ora'            => ['nullable', 'date_format:H:i'],
            'durata_minuti'  => ['nullable', 'integer', 'min:5', 'max:720'],
            'note'           => ['nullable', 'string'],
            'terapista_id'   => ['nullable', 'exists:utente,id'],
            'paziente_id'    => ['nullable', 'exists:utente,id'],
            'nome'           => ['nullable', 'string'],   // per ospite
            'cognome'        => ['nullable', 'string'],   // per ospite
        ]);

        $a = Appuntamento::findOrFail($id);

        // caso drag/resize
        if (!empty($validated['start'])) {
            $start = \Illuminate\Support\Carbon::parse($validated['start']);
            $a->data = $start->toDateString();
            $a->ora  = $start->format('H:i:s');
            if (!empty($validated['end'])) {
                $end  = \Illuminate\Support\Carbon::parse($validated['end']);
                $diff = $start->diffInMinutes($end);
                $a->durata_minuti = max(5, min($diff, 12 * 60));
            }
        }

        // caso form (edit manuale)
        if (!empty($validated['data'])) $a->data = $validated['data'];
        if (!empty($validated['ora']))  $a->ora  = $validated['ora'];
        if (array_key_exists('durata_minuti', $validated) && $validated['durata_minuti'] !== null) {
            $a->durata_minuti = $validated['durata_minuti'];
        }
        if (array_key_exists('note', $validated))        $a->note = $validated['note'];
        if (!empty($validated['terapista_id']))         $a->terapista_id = $validated['terapista_id'];

        // ospite o cambio paziente
        if (array_key_exists('paziente_id', $validated)) $a->paziente_id = $validated['paziente_id'];
        if (array_key_exists('nome', $validated))        $a->nome = $validated['nome'];
        if (array_key_exists('cognome', $validated))     $a->cognome = $validated['cognome'];

        $a->save();

        // 🔹 dopo aver salvato l'appuntamento, assicuriamo il record in pazienti_terapisti
        if (!empty($a->paziente_id) && !empty($a->terapista_id)) {
            $exists = PazienteTerapista::where('paziente_id', $a->paziente_id)
                ->where('terapista_id', $a->terapista_id)
                ->exists();

            if (! $exists) {
                PazienteTerapista::create([
                    'paziente_id'  => $a->paziente_id,
                    'terapista_id' => $a->terapista_id,
                    'data'         => $a->data?->toDateString() ?? now()->toDateString(),
                ]);
            }
        }

        return response()->json(['ok' => true]);
    }

    public function show($id)
    {
        $a = Appuntamento::with([
            'paziente:id,nome,cognome,email,telefono_1,telefono_2',
            'terapista:id,nome,cognome,email,telefono_1,telefono_2',
        ])->findOrFail($id);

        return response()->json([
            'id'            => $a->id,
            'data'          => $a->data,
            'ora'           => $a->ora,
            'durata_minuti' => $a->durata_minuti,
            'note'          => $a->note,

            'paziente'      => $a->paziente
                ? [
                    'id'         => $a->paziente->id,
                    'nome'       => $a->paziente->nome,
                    'cognome'    => $a->paziente->cognome,
                    'email'      => $a->paziente->email,
                    'telefono_1' => $a->paziente->telefono_1,
                    'telefono_2' => $a->paziente->telefono_2,
                ]
                : [
                    'nome'    => $a->nome,
                    'cognome' => $a->cognome,
                ],

            'terapista'     => $a->terapista
                ? [
                    'id'         => $a->terapista->id,
                    'nome'       => $a->terapista->nome,
                    'cognome'    => $a->terapista->cognome,
                    'email'      => $a->terapista->email,
                    'telefono_1' => $a->terapista->telefono_1,
                    'telefono_2' => $a->terapista->telefono_2,
                ]
                : null,
        ]);
    }


    public function giornalieri(Request $request)
    {
        $ruolo = session('logged_user.ruolo');
        if ($ruolo !== 'admin') {
            return response()->json(['message' => 'Non autorizzato'], 403);
        }

        $data = $request->query('data', now()->toDateString());
        $now  = now();

        $appuntamenti = Appuntamento::with([
            'paziente:id,nome,cognome',
            'terapista:id,nome,cognome',
        ])
            ->whereDate('data', $data)
            ->orderBy('ora')
            ->get();

        $result = [
            'mattina'   => [],
            'pomeriggio' => [],
        ];

        foreach ($appuntamenti as $a) {
            // ---- dati base
            $ora = substr($a->ora, 0, 5);

            $pazienteNome = $a->paziente
                ? "{$a->paziente->nome} {$a->paziente->cognome}"
                : trim("{$a->nome} {$a->cognome}");

            $terapistaNome = $a->terapista
                ? "Dr.ssa {$a->terapista->nome} {$a->terapista->cognome}"
                : "Terapista";

            // ---- calcolo orari
            $start = Carbon::createFromFormat('Y-m-d H:i', "{$data} {$ora}");
            $durata = $a->durata_minuti ?? 30;
            $end = (clone $start)->addMinutes($durata);
            $endPlus2h = (clone $end)->addHours(2);

            // ---- firma?
            $firmaExists = \App\Models\Firma::whereDate('data', $data)
                ->where('terapista_id', $a->terapista_id)
                ->whereRaw('LOWER(nome) = ?', [mb_strtolower($a->paziente->nome ?? $a->nome)])
                ->whereRaw('LOWER(cognome) = ?', [mb_strtolower($a->paziente->cognome ?? $a->cognome)])
                ->exists();

            // ---- status
            if ($firmaExists) {
                $status = 'present';
            } elseif ($now->lessThan($endPlus2h)) {
                $status = 'pending';
            } else {
                $status = 'absent';
            }

            // ---- fascia oraria
            $fascia = ((int)substr($ora, 0, 2) < 14) ? 'mattina' : 'pomeriggio';

            $result[$fascia][$ora][] = [
                'id'        => $a->id,
                'paziente'  => $pazienteNome,
                'terapista' => $terapistaNome,
                'status'    => $status,
            ];
        }

        return response()->json($result);
    }
}

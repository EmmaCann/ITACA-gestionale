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

        $start       = $request->query('start');
        $end         = $request->query('end');
        $terapistaId = $request->query('terapista_id');

        Log::info("CALENDAR INDEX", [
            'ruolo'            => $ruolo,
            'userId'           => $userId,
            'start'            => $start,
            'end'              => $end,
            'terapista_filter' => $terapistaId,
        ]);

        $q = Appuntamento::query()->with([
            'paziente:id,nome,cognome',
            'terapista:id,nome,cognome',
            'pazienti:id,nome,cognome',
            'terapisti:id,nome,cognome',
        ]);

        // Range FullCalendar
        if ($start && $end) {
            $q->whereBetween('data', [
                Carbon::parse($start)->toDateString(),
                Carbon::parse($end)->toDateString()
            ]);
        }

        // -----------------------------------------
        // 1) FILTRO RUOLO (retrocompatibile)
        // -----------------------------------------
        if ($ruolo === 'admin') {
            // admin vede tutto
        } elseif ($ruolo === 'staff') {
            // staff: single (terapista_id) OR gruppo (pivot terapisti)
            $q->where(function ($qq) use ($userId) {
                $qq->where('terapista_id', $userId)
                    ->orWhereHas('terapisti', function ($t) use ($userId) {
                        $t->where('utente.id', $userId);
                    });
            });
        } elseif ($ruolo === 'paziente') {
            // paziente: single (paziente_id) OR gruppo (pivot pazienti)
            $q->where(function ($qq) use ($userId) {
                $qq->where('paziente_id', $userId)
                    ->orWhereHas('pazienti', function ($p) use ($userId) {
                        $p->where('utente.id', $userId);
                    });
            });
        }

        // -----------------------------------------
        // 2) FILTRO TERAPISTA (solo admin + paziente)
        //    include anche gruppi via pivot
        // -----------------------------------------
        if (
            ($ruolo === 'admin' || $ruolo === 'paziente') &&
            $terapistaId !== null &&
            $terapistaId !== '' &&
            is_numeric($terapistaId)
        ) {
            $tid = (int)$terapistaId;
            $q->where(function ($qq) use ($tid) {
                $qq->where('terapista_id', $tid)
                    ->orWhereHas('terapisti', function ($t) use ($tid) {
                        $t->where('utente.id', $tid);
                    });
            });
        }

        $items = $q->get();

        Log::info("CALENDAR RESULTS", [
            'count' => $items->count(),
            'ids'   => $items->pluck('id'),
        ]);

        $events = $items->map(function ($a) {
            $date = $a->data instanceof Carbon ? $a->data->toDateString() : $a->data;
            $time = $a->ora instanceof Carbon ? $a->ora->format('H:i:s') : ($a->ora ?: '00:00:00');

            $startAt = Carbon::createFromFormat('Y-m-d H:i:s', "$date $time");
            $durata  = $a->durata_minuti ?? 30;
            $endAt   = (clone $startAt)->addMinutes($durata);

            // titolo evento
            if ($a->is_group) {
                $title = $a->titolo ?: 'Terapia di gruppo';
            } else {
                $pazienteName = $a->paziente
                    ? trim("{$a->paziente->nome} {$a->paziente->cognome}")
                    : trim("{$a->nome} {$a->cognome}");
                if ($pazienteName === '') $pazienteName = 'Paziente';

                $terapistaName = $a->terapista
                    ? trim("{$a->terapista->nome} {$a->terapista->cognome}")
                    : "Terapista";

                $title = "{$pazienteName} — Dr. {$terapistaName}";
            }

            // colore: usiamo terapista_id (nei gruppi è il "referente")
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
                    'is_group'      => (bool)$a->is_group,
                    'titolo'        => $a->titolo,
                ],
            ];
        });

        return response()->json($events);
    }


    public function store(Request $request)
    {
        $isGroup = $request->boolean('is_group');

        if ($isGroup) {
            $validated = $request->validate([
                'is_group'      => 'required|boolean',

                'titolo'        => 'required|string|max:255',
                'pazienti_ids'  => 'required|array|min:1',
                'pazienti_ids.*' => 'exists:utente,id',

                'terapisti_ids'  => 'required|array|min:1',
                'terapisti_ids.*' => 'exists:utente,id',

                'data'          => 'required|date',
                'ora'           => 'required|date_format:H:i',
                'note'          => 'nullable|string',
                'durata_minuti' => 'nullable|integer|min:5|max:720',
            ]);

            $durata = !empty($validated['durata_minuti']) ? (int)$validated['durata_minuti'] : 30;

            // ✅ terapista referente (NOT NULL in DB)
            $referenteId = (int)$validated['terapisti_ids'][0];

            $appuntamento = Appuntamento::create([
                'terapista_id'  => $referenteId,
                'paziente_id'   => null,          // ok: è nullable
                'nome'          => null,
                'cognome'       => null,

                'data'          => $validated['data'],
                'ora'           => $validated['ora'],
                'note'          => $validated['note'] ?? null,
                'durata_minuti' => $durata,

                'is_group'      => true,
                'titolo'        => $validated['titolo'],
            ]);

            // pivot
            $appuntamento->pazienti()->sync(array_values(array_unique($validated['pazienti_ids'])));
            $appuntamento->terapisti()->sync(array_values(array_unique($validated['terapisti_ids'])));

            // opzionale: popola pazienti_terapisti (come fai per i singoli)
            foreach ($validated['pazienti_ids'] as $pid) {
                foreach ($validated['terapisti_ids'] as $tid) {
                    PazienteTerapista::firstOrCreate(
                        ['paziente_id' => $pid, 'terapista_id' => $tid],
                        ['data' => $validated['data']]
                    );
                }
            }

            return response()->json([
                'message' => 'Terapia di gruppo creata con successo!',
                'data' => $appuntamento
            ], 201);
        }

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
            'pazienti:id,nome,cognome,email,telefono_1,telefono_2',
            'terapisti:id,nome,cognome,email,telefono_1,telefono_2',
        ])->findOrFail($id);

        return response()->json([
            'id'            => $a->id,
            'data'          => $a->data,
            'ora'           => $a->ora,
            'durata_minuti' => $a->durata_minuti,
            'note'          => $a->note,

            // retrocompat: per gruppo mettiamo null (evita ospite vuoto)
            'paziente'  => $a->is_group ? null : (
                $a->paziente
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
                ]
            ),

            'terapista' => $a->is_group ? null : (
                $a->terapista
                ? [
                    'id'         => $a->terapista->id,
                    'nome'       => $a->terapista->nome,
                    'cognome'    => $a->terapista->cognome,
                    'email'      => $a->terapista->email,
                    'telefono_1' => $a->terapista->telefono_1,
                    'telefono_2' => $a->terapista->telefono_2,
                ]
                : null
            ),

            // nuovi campi gruppo (la UI vecchia può ignorarli)
            'is_group' => (bool)$a->is_group,
            'titolo'   => $a->titolo,

            'pazienti' => $a->is_group ? $a->pazienti->map(fn($p) => [
                'id'         => $p->id,
                'nome'       => $p->nome,
                'cognome'    => $p->cognome,
                'email'      => $p->email,
                'telefono_1' => $p->telefono_1,
                'telefono_2' => $p->telefono_2,
            ])->values() : null,

            'terapisti' => $a->is_group ? $a->terapisti->map(fn($t) => [
                'id'         => $t->id,
                'nome'       => $t->nome,
                'cognome'    => $t->cognome,
                'email'      => $t->email,
                'telefono_1' => $t->telefono_1,
                'telefono_2' => $t->telefono_2,
            ])->values() : null,
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
            'mattina'    => [],
            'pomeriggio' => [],
        ];

        foreach ($appuntamenti as $a) {
            $ora = substr($a->ora, 0, 5);

            // ✅ GRUPPO: niente firma (per ora), nome = titolo
            if ($a->is_group) {
                $pazienteNome = $a->titolo ?: 'Terapia di gruppo';

                $terapistaNome = $a->terapista
                    ? "Dr.ssa {$a->terapista->nome} {$a->terapista->cognome}"
                    : "Terapista";

                $start = Carbon::createFromFormat('Y-m-d H:i', "{$data} {$ora}");
                $durata = $a->durata_minuti ?? 30;
                $end = (clone $start)->addMinutes($durata);
                $endPlus2h = (clone $end)->addHours(2);

                $status = $now->lessThan($endPlus2h) ? 'pending' : 'absent';

                $fascia = ((int)substr($ora, 0, 2) < 14) ? 'mattina' : 'pomeriggio';

                $result[$fascia][$ora][] = [
                    'id'        => $a->id,
                    'paziente'  => $pazienteNome,
                    'terapista' => $terapistaNome,
                    'status'    => $status,
                ];

                continue; // IMPORTANTISSIMO
            }

            // ✅ SINGOLO (tuo codice attuale)
            $pazienteNome = $a->paziente
                ? "{$a->paziente->nome} {$a->paziente->cognome}"
                : trim("{$a->nome} {$a->cognome}");

            $terapistaNome = $a->terapista
                ? "Dr.ssa {$a->terapista->nome} {$a->terapista->cognome}"
                : "Terapista";

            $start = Carbon::createFromFormat('Y-m-d H:i', "{$data} {$ora}");
            $durata = $a->durata_minuti ?? 30;
            $end = (clone $start)->addMinutes($durata);
            $endPlus2h = (clone $end)->addHours(2);

            $firmaExists = \App\Models\Firma::whereDate('data', $data)
                ->where('terapista_id', $a->terapista_id)
                ->whereRaw('LOWER(nome) = ?', [mb_strtolower($a->paziente->nome ?? $a->nome)])
                ->whereRaw('LOWER(cognome) = ?', [mb_strtolower($a->paziente->cognome ?? $a->cognome)])
                ->exists();

            if ($firmaExists) {
                $status = 'present';
            } elseif ($now->lessThan($endPlus2h)) {
                $status = 'pending';
            } else {
                $status = 'absent';
            }

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

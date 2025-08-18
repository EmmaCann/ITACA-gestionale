<?php

namespace App\Http\Controllers;

use App\Models\Appuntamento;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

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

        $start = $request->query('start');
        $end   = $request->query('end');
        $terapistaId = $request->query('terapista_id');

        $q = Appuntamento::query()->with([
            'paziente:id,nome,cognome',
            'terapista:id,nome,cognome',
        ]);

        if ($start && $end) {
            $q->whereBetween('data', [
                \Illuminate\Support\Carbon::parse($start)->toDateString(),
                \Illuminate\Support\Carbon::parse($end)->toDateString()
            ]);
        }

        if ($terapistaId) {
            $q->where('terapista_id', $terapistaId);
        }


        if ($ruolo === 'staff') {
            $q->where('terapista_id', $userId);
        } elseif ($ruolo === 'paziente') {
            $q->where('paziente_id', $userId);
        }

        $items = $q->get();

        $events = $items->map(function ($a) {
            // data + ora (ora può essere string TIME o Carbon: normalizziamo)
            $date = $a->data instanceof Carbon ? $a->data->toDateString() : $a->data;
            $time = $a->ora instanceof Carbon ? $a->ora->format('H:i:s') : ($a->ora ?: '00:00:00');

            // Crea il datetime in timezone app e invia in formato "locale" senza offset
            $startAt = Carbon::createFromFormat(
                'Y-m-d H:i:s',
                "$date $time",
                config('app.timezone', 'Europe/Rome')
            );
            $durata = $a->durata_minuti ?? 30;
            $endAt  = (clone $startAt)->addMinutes($durata);

            // Titoli
            $pazienteName  = $a->paziente
                ? trim(($a->paziente->nome ?? '') . ' ' . ($a->paziente->cognome ?? ''))
                : trim(($a->nome ?? '') . ' ' . ($a->cognome ?? ''));
            if ($pazienteName === '') $pazienteName = 'Paziente';

            $terapistaName = $a->terapista
                ? trim(($a->terapista->nome ?? '') . ' ' . ($a->terapista->cognome ?? ''))
                : 'Terapista';

            $title = "{$pazienteName} — Dr. {$terapistaName}";

            $bg = $this->colorForTherapist((int)$a->terapista_id);
            $fg = $this->idealTextColor($bg);

            return [
                'id'    => $a->id,
                'title' => $title,                       // "Paziente — Terapista"
                'start' => $startAt->format('Y-m-d\TH:i:s'),
                'end'   => $endAt->format('Y-m-d\TH:i:s'),
                'backgroundColor' => $bg,
                'borderColor'     => $bg,
                'textColor'       => $fg,               // <— testo leggibile
                'extendedProps' => [
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

        return response()->json(['ok' => true]);
    }

    public function destroy(Request $request, $id)
    {
        $ruolo = session('logged_user.ruolo');
        if ($ruolo !== 'admin') {
            return response()->json(['message' => 'Non autorizzato'], 403);
        }

        $a = Appuntamento::findOrFail($id);
        $a->delete();

        return response()->json(['ok' => true]);
    }


    public function show(Request $request, $id)
    {
        $ruolo  = session('logged_user.ruolo');
        $userId = session('logged_user.id_utente');

        $a = Appuntamento::with([
            'paziente:id,nome,cognome',
            'terapista:id,nome,cognome',
        ])->findOrFail($id);

        // visibilità base
        if ($ruolo === 'staff' && $a->terapista_id !== $userId) {
            return response()->json(['message' => 'Non autorizzato'], 403);
        }
        if ($ruolo === 'paziente' && $a->paziente_id !== $userId) {
            return response()->json(['message' => 'Non autorizzato'], 403);
        }

        return response()->json([
            'id'             => $a->id,
            'data'           => $a->data?->toDateString(),
            'ora'            => $a->ora instanceof \Carbon\Carbon ? $a->ora->format('H:i:s') : $a->ora,
            'durata_minuti'  => $a->durata_minuti,
            'note'           => $a->note,
            'paziente_id'    => $a->paziente_id,
            'paziente_nome'  => $a->paziente?->nome ?? $a->nome,
            'paziente_cognome' => $a->paziente?->cognome ?? $a->cognome,
            'terapista_id'   => $a->terapista_id,
            'terapista_nome' => $a->terapista?->nome,
            'terapista_cognome' => $a->terapista?->cognome,
            'created_at'     => $a->created_at,
        ]);
    }
}

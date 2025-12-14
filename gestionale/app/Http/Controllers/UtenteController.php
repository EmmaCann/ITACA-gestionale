<?php

namespace App\Http\Controllers;

use App\Models\Utente;
use App\Models\StaffDati;
use App\Models\CartellaClinica;
use App\Models\Appuntamento;
use App\Models\PazienteTerapista;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use Symfony\Component\HttpFoundation\Response;

use Illuminate\Support\Facades\Hash;

class UtenteController extends Controller
{
    public function indexPazienti(Request $request)
    {
        $search         = $request->string('search')->toString();
        $sesso          = $request->string('sesso')->toString();          // 'M' | 'F'


        $etaMin         = $request->has('eta_min') ? (int) $request->input('eta_min') : null;
        $etaMax         = $request->has('eta_max') ? (int) $request->input('eta_max') : null;

        $terapistaId    = $request->integer('terapista_id');
        $multiTerapisti = $request->boolean('multi_terapisti');



        // Include i terapisti nel risultato
        $q = Utente::query()
            ->where('ruolo', 'paziente')
            ->with(['terapisti:id,nome,cognome']);

        // STAFF → vede solo i suoi pazienti
        $session = Session::get('logged_user');
        if ($session && $session['ruolo'] === 'staff') {
            $terapistaId = $session['id_utente'];

            $q->whereExists(function ($sub) use ($terapistaId) {
                $sub->selectRaw(1)
                    ->from('pazienti_terapisti as pt')
                    ->whereColumn('pt.paziente_id', 'utente.id')
                    ->where('pt.terapista_id', $terapistaId);
            });
        }



        // search per nome + cognome
        if ($search !== '') {
            $q->where(function ($qq) use ($search) {
                $qq->where('nome', 'like', "%{$search}%")
                    ->orWhere('cognome', 'like', "%{$search}%");
            });
        }

        // sesso
        if (in_array($sesso, ['M', 'F'], true)) {
            $q->where('sesso', $sesso);
        }

        if (!is_null($etaMin) || !is_null($etaMax)) {
            $today = \Carbon\Carbon::today();

            // età >= etaMin  → nati entro (oggi - etaMin anni)
            if (!is_null($etaMin)) {
                $upperBirthDate = $today->copy()->subYears($etaMin);
                $q->whereDate('nascita', '<=', $upperBirthDate);
            }

            // età <= etaMax  → nati dopo (oggi - (etaMax+1) anni)
            // (quindi esclude chi ha già compiuto etaMax+1)
            if (!is_null($etaMax)) {
                $lowerBirthDateExclusive = $today->copy()->subYears($etaMax + 1);
                $q->whereDate('nascita', '>', $lowerBirthDateExclusive);
            }
        }

        // pazienti di un terapista specifico
        if (!empty($terapistaId)) {
            $q->whereExists(function ($sub) use ($terapistaId) {
                $sub->selectRaw(1)
                    ->from('pazienti_terapisti as pt')
                    ->whereColumn('pt.paziente_id', 'utente.id')
                    ->where('pt.terapista_id', $terapistaId);
            });
        }

        // pazienti con >1 terapista (collaborazione)
        if ($multiTerapisti) {
            $q->whereExists(function ($sub) {
                $sub->selectRaw(1)
                    ->from('pazienti_terapisti as pt2')
                    ->whereColumn('pt2.paziente_id', 'utente.id')
                    ->groupBy('pt2.paziente_id')
                    ->havingRaw('COUNT(DISTINCT pt2.terapista_id) > 1');
            });
        }

        return $q->get();
    }


    public function indexStaff(Request $request)
    {
        $search      = $request->string('search')->toString();
        $sesso       = $request->string('sesso')->toString();          // 'M' | 'F'
        $professione = $request->string('professione')->toString();    // staff_dati.professione

        $q = Utente::query()
            ->where('ruolo', 'staff')
            ->with('staffDati');

        if ($search !== '') {
            $q->where(function ($qq) use ($search) {
                $qq->where('nome', 'like', "%{$search}%")
                    ->orWhere('cognome', 'like', "%{$search}%");
            });
        }

        if (in_array($sesso, ['M', 'F'])) {
            $q->where('sesso', $sesso);
        }

        if ($professione !== '') {
            $q->whereHas('staffDati', function ($qq) use ($professione) {
                $qq->where('professione', $professione);
            });
        }

        return $q->get();
    }




    public function profilo()
    {
        $sessionUser = Session::get('logged_user');

        if (!$sessionUser) {
            return redirect()->route('login_form');
        }

        // Recupero dettagli completi dal DB
        $utente = Utente::find($sessionUser['id_utente']);

        return inertia('Profile', [
            'utente' => $utente
        ]);
    }

    public function cambiaPassword(Request $request)
    {
        // 1. controlliamo che l'utente sia loggato
        $sessionUser = Session::get('logged_user');
        if (!$sessionUser) {
            return response()->json(['errore' => 'Non sei autenticato'], 401);
        }

        // 2. validazione
        $request->validate([
            'password_attuale' => 'required|string',
            'nuova_password' => 'required|string|min:6',
            'conferma_password' => 'required|string|same:nuova_password',
        ], [
            'conferma_password.same' => 'La conferma non coincide con la nuova password.'
        ]);

        // 3. recupero utente
        $utente = Utente::find($sessionUser['id_utente']);

        if (!$utente) {
            return response()->json(['errore' => 'Utente non trovato'], 404);
        }

        // 4. verifica password attuale
        if (!Hash::check($request->password_attuale, $utente->password)) {
            return response()->json(['errore' => 'La password attuale non è corretta'], 422);
        }

        // 5. preveniamo riuso stessa password
        if (Hash::check($request->nuova_password, $utente->password)) {
            return response()->json(['errore' => 'La nuova password deve essere diversa da quella attuale'], 422);
        }

        // 6. aggiorna password (Hash automatico dal mutator)
        $utente->password = $request->nuova_password;
        $utente->save();

        // 7. aggiorniamo sessione (facoltativo)
        Session::put('logged_user.username', $utente->username);

        return response()->json([
            'success' => true,
            'messaggio' => 'Password aggiornata con successo'
        ]);
    }




    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipoUtente' => ['required', Rule::in(['paziente', 'staff'])],
            'nome' => 'required|string|max:255',
            'cognome' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'dataNascita' => 'nullable|date',
            'professione' => 'nullable|string|max:255',
            'diagnosi' => 'nullable|string',
            'sesso' => 'nullable|in:M,F',
        ]);

        // Genera username univoco
        $cognomeCompatto = str_replace(' ', '', $validated['cognome']);
        $baseUsername = Str::slug($validated['nome'], '') . '.' . Str::slug($cognomeCompatto, '');
        $username = $baseUsername;
        $counter = 1;

        while (Utente::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }

        Log::info('Sesso ricevuto dal frontend:', ['raw' => $request->input('sesso')]);

        // Creazione utente
        $utente = Utente::create([
            'nome' => $validated['nome'],
            'cognome' => $validated['cognome'],
            'username' => $username,
            'password' => 'password',
            'email' => $validated['email'] ?? null,
            'telefono' => $validated['telefono'] ?? null,
            'nascita' => $validated['dataNascita'] ?? null,
            'ruolo' => $validated['tipoUtente'],
            'sesso' => $validated['sesso'] ?? null,
        ]);

        if ($validated['tipoUtente'] === 'staff') {
            $utente->staffDati()->create([
                'professione' => $validated['professione'] ?? 'Non specificata',
            ]);
        }

        if ($validated['tipoUtente'] === 'paziente') {
            $utente->cartellaClinica()->create([
                'anamnesi' => '',
                'diagnosi' => $validated['diagnosi'] ?? '',
                'terapia' => '',
                'note' => '',
            ]);
        }

        return response()->json([
            'message' => 'Utente creato con successo',
            'utente' => $utente->load(['staffDati', 'cartellaClinica']),
        ], 201);
    }

    public function terapisti()
    {
        $terapisti = Utente::where('ruolo', 'staff')
            ->select('id', 'nome', 'cognome')
            ->get()
            ->map(function ($utente) {
                return [
                    'value' => $utente->id,
                    'label' => 'Dr. ' . $utente->nome . ' ' . $utente->cognome,
                ];
            })
            ->values();

        return response()->json($terapisti);
    }

    public function professioniTerapisti()
    {
        $professioni = StaffDati::select('professione')
            ->distinct()
            ->whereNotNull('professione')
            ->pluck('professione');

        return response()->json($professioni);
    }


    public function destroy(Utente $utente)
    {
        $id = $utente->id;

        try {
            // 1) Cancella appuntamenti (paziente o terapista)
            Appuntamento::where('paziente_id', $id)
                ->orWhere('terapista_id', $id)
                ->delete();

            // 2) Cancella relazioni pazienti_terapisti
            PazienteTerapista::where('paziente_id', $id)
                ->orWhere('terapista_id', $id)
                ->delete();

            // 3) Cancella cartella clinica se è paziente
            CartellaClinica::where('paziente_id', $id)->delete();

            // 4) Cancella staff_dati se è staff
            StaffDati::where('utente_id', $id)->delete();

            // 5) Cancella l'utente stesso
            $utente->delete();

            return response()->json([
                'message' => 'Utente eliminato con tutti i dati collegati.'
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errore DELETE utente', [
                'utente_id' => $id,
                'msg' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Errore durante l\'eliminazione',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, Utente $utente)
    {
        try {
            // Validazione base
            $validated = $request->validate([
                'nome' => 'nullable|string|max:255',
                'cognome' => 'nullable|string|max:255',
                'nascita' => 'nullable|date',
                'sesso' => 'nullable|in:M,F',
                'telefono' => 'nullable|string|max:50',
                'email' => 'nullable|email|max:255',
                'password' => 'nullable|string|min:6',
                'professione' => 'nullable|string|max:255',
                'diagnosi' => 'nullable|string',
                'terapista_id' => 'nullable|integer|exists:utente,id',
            ]);

            // Update campi base
            $utente->fill([
                'nome' => $validated['nome'] ?? $utente->nome,
                'cognome' => $validated['cognome'] ?? $utente->cognome,
                'nascita' => $validated['nascita'] ?? $utente->nascita,
                'sesso' => $validated['sesso'] ?? $utente->sesso,
                'telefono' => $validated['telefono'] ?? $utente->telefono,
                'email' => $validated['email'] ?? $utente->email,
            ]);

            // Se password presente → aggiorna
            if (!empty($validated['password'])) {
                $utente->password = Hash::make($validated['password']);
            }

            $utente->save();

            // Se staff → aggiorna professione
            if ($utente->ruolo === 'staff') {
                if (!empty($validated['professione'])) {
                    StaffDati::updateOrCreate(
                        ['utente_id' => $utente->id],
                        ['professione' => $validated['professione']]
                    );
                }
            }

            // Se paziente → aggiorna diagnosi e terapista
            if ($utente->ruolo === 'paziente') {
                if (!empty($validated['diagnosi'])) {
                    CartellaClinica::updateOrCreate(
                        ['paziente_id' => $utente->id],
                        ['diagnosi' => $validated['diagnosi']]
                    );
                }

                if (!empty($validated['terapista_id'])) {
                    // elimina relazioni esistenti e crea nuova
                    PazienteTerapista::where('paziente_id', $utente->id)->delete();
                    PazienteTerapista::create([
                        'paziente_id' => $utente->id,
                        'terapista_id' => $validated['terapista_id'],
                        'data' => now(),
                    ]);
                }
            }

            return response()->json([
                'message' => 'Utente aggiornato con successo',
                'utente' => $utente->fresh(),
            ], 200);
        } catch (\Throwable $e) {
            Log::error("Errore update utente", [
                'id' => $utente->id,
                'msg' => $e->getMessage(),
            ]);
            return response()->json([
                'message' => 'Errore durante la modifica',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function utentiPerNotifica()
    {
        if (!Session::has('logged_user')) {
            return response()->json(['error' => 'Non autenticato'], 401);
        }

        $utenti = Utente::select('id', 'nome', 'cognome')
            ->whereIn('ruolo', ['staff', 'paziente'])
            ->orderBy('cognome')
            ->get();

        return response()->json($utenti);
    }

}

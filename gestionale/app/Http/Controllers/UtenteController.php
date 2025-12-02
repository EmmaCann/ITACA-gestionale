<?php

namespace App\Http\Controllers;

use App\Models\Utente;
use App\Models\StaffDati;
use App\Models\CartellaClinica;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;

class UtenteController extends Controller
{

    public function indexPazienti()
    {
        return Utente::where('ruolo', 'paziente')->get();
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
        // Validazione base
        $validated = $request->validate([
            'tipoUtente' => ['required', Rule::in(['paziente', 'staff'])],
            'nome' => 'required|string|max:255',
            'cognome' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'dataNascita' => 'nullable|date',
            'professione' => 'nullable|string|max:255',
            'diagnosi' => 'nullable|string',
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

        // Creazione utente
        $utente = Utente::create([
            'nome' => $validated['nome'],
            'cognome' => $validated['cognome'],
            'username' => $username,
            'password' => 'password', // viene criptata automaticamente dal model
            'email' => $validated['email'] ?? null,
            'telefono' => $validated['telefono'] ?? null,
            'nascita' => $validated['dataNascita'] ?? null,
            'ruolo' => $validated['tipoUtente'],
        ]);

        // Relazione staff o paziente
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
}

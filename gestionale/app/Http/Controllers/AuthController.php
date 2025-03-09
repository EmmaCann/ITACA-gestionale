<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Utente;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;


class AuthController extends Controller
{
    /**
     * Mostra il form di login.
     */
    public function showLoginForm()
    {
        return Inertia::render('Login');
    }

    public function login(Request $request)
    {
        // Validazione dei dati
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = Utente::where('username', $request->username)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            Session::put('logged_user', [
                'id_utente' => $user->id,
                'username' => $user->username,
                'nome' => $user->nome,
                'cognome' => $user->cognome,
                'ruolo' => $user->ruolo,
            ]);
            Session::regenerate();

            // Determina la URL di reindirizzamento in base al ruolo
            $redirectUrl = match ($user->ruolo) {
                'admin' => route('home_admin'),
                'staff' => route('home_staff'),
                'paziente' => route('home_paziente'),
                default => route('login_form'),
            };


            return response()->json(['success' => true, 'redirect_url' => $redirectUrl]);
        }



        return response()->json(['errore' => "Ops! C'è qualcosa che non va"], 401);
    }



    public function logout()
    {
        Session::flush();
        return redirect()->route('login_form');
    }
}

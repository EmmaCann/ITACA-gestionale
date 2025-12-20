<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Utente;
use App\Models\Firma;
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

        $user = Utente::where('username', $request->username)
            ->orWhere('email', $request->username)
            ->first();

        if (!$user) {
            return response()->json(['errore' => 'Utente inesistente'], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['errore' => 'Password errata'], 401);
        }

        Session::put('logged_user', [
            'id_utente' => $user->id,
            'username'  => $user->username,
            'nome'      => $user->nome,
            'cognome'   => $user->cognome,
            'ruolo'     => $user->ruolo,
        ]);
        Session::regenerate();

        // $redirectUrl = match ($user->ruolo) {
        //     'admin'   => route('home_admin'),
        //     'staff'   => route('home_staff'),
        //     'paziente' => route('home_paziente'),
        //     default   => route('login_form'),
        // };
        $redirectUrl = route('home');

        $needsPrivacyAcceptance =
            !$user->privacy_accepted_at || !$user->terms_accepted_at;

        $needsPasswordChange =
            is_null($user->password_changed_at);


        return response()->json([
            'success' => true,
            'redirect_url' => $redirectUrl,
            'onboarding' => [
                'needs_privacy' => $needsPrivacyAcceptance,
                'needs_password_change' => $needsPasswordChange,
            ],
        ]);
    }



    public function logout()
    {
        Session::flush();
        return redirect()->route('login_form');
    }

    public function acceptLegal(Request $request)
    {
        $userId = Session::get('logged_user.id_utente');

        if (!$userId) {
            return response()->json(['errore' => 'Non autenticato'], 401);
        }

        $user = Utente::find($userId);
        if (!$user) {
            return response()->json(['errore' => 'Utente non trovato'], 404);
        }

        // versioni hardcoded per ora
        $privacyVersion = 'v1.0';
        $termsVersion   = 'v1.0';

        $user->update([
            'privacy_accepted_at' => now(),
            'privacy_version'     => $privacyVersion,
            'terms_accepted_at'   => now(),
            'terms_version'       => $termsVersion,
        ]);

        return response()->json([
            'success' => true,
            'privacy_accepted_at' => $user->privacy_accepted_at,
            'terms_accepted_at' => $user->terms_accepted_at,
            'privacy_version' => $user->privacy_version,
            'terms_version' => $user->terms_version,
        ]);
    }
}

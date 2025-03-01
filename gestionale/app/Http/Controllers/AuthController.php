<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Utente;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
    /**
     * Mostra il form di login.
     */
    public function showLoginForm()
    {
      //  return view('login');        
      return Inertia::render('Login'); 
    }


    public function login(Request $request)
    {
        // Validazione dei dati in input
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

      
        $error = [];

       // Recupera i dati inseriti
        $username = trim($request->input('username'));
       $password = trim($request->input('password'));

       // Cerca l'utente nel database
       $user = Utente::where('username', $username)->first();

       if ($user && Hash::check($password, $user->password)) {
           // Salva i dati dell'utente in sessione
           Session::put('logged_user', [
               'id_utente' => $user->id,
               'username' => $user->username,
               'nome' => $user->nome,
               'cognome' => $user->cognome,
               'ruolo' => $user->ruolo,
           ]);
           Session::regenerate();
           
            return redirect()->route('home');
        } else {
           
            $error['errore'] = "Ops! C'è qualcosa che non va";
        }

        return redirect()->route('login_form')->withErrors($error)->withInput();

    }

    
    public function logout()
    {
        Session::flush();

        return redirect()->route('login_form');
    }
}

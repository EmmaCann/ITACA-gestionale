<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
     
        if (!Session::has('logged_user')) {
            return redirect()->route('login_form')->withErrors(['errore' => 'Devi effettuare l’accesso per accedere alla Home']);
        }

        // redirect per home con react
        // return Inertia::render('Home', [
        //     'user' => Session::get('logged_user')
        // ]);
        
        //redirect per test backend 
        $user = Session::get('logged_user'); // Recupera l'utente dalla sessione
         return Inertia::render('Home', [
            'user' => Session::get('logged_user')
        ]);
    }
}


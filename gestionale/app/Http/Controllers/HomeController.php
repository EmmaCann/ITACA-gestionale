<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;

class HomeController extends Controller
{

    public function admin()
    {
        return Inertia::render('Home', [
            'canEdit' => session('logged_user.ruolo') === 'admin',
        ]);
    }
    public function staff()
    {
        return Inertia::render('HomeStaff', [
            'canEdit' => session('logged_user.ruolo') === 'admin',
        ]);
    }
    public function paziente()
    {
        return Inertia::render('HomePaziente', [
            'canEdit' => session('logged_user.ruolo') === 'admin',
        ]);
    }
}

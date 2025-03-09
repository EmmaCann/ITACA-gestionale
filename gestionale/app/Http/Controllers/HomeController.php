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
            'user' => Session::get('logged_user')
        ]);
    }

    public function staff()
    {
        return Inertia::render('HomeStaff', [
            'user' => Session::get('logged_user')
        ]);
    }

    public function paziente()
    {
        return Inertia::render('HomePaziente', [
            'user' => Session::get('logged_user')
        ]);
    }
}

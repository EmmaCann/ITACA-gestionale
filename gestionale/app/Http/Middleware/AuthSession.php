<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class AuthSession
{
    public function handle(Request $request, Closure $next)
    {
        if (!Session::has('logged_user')) {
            
            if (!$request->is('login')) {
                return redirect()->route('login_form')->withErrors(['error' => 'Devi effettuare il login per accedere.']);
            }
        }

        return $next($request);
    }
}

<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Imposta la lingua di Carbon
        Carbon::setLocale('it');

        // Se vuoi forzare anche la lingua di sistema
        App::setLocale('it');

        // Condividi il ruolo e i dati dell'utente loggato con tutte le pagine Inertia
        Inertia::share([
            'ruolo' => function () {
                return Session::get('logged_user.ruolo');
            },
            'logged_user' => function () {
                return Session::get('logged_user');
            },
        ]);
    }
}

<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\AuthSession;
use App\Http\Controllers\UtenteController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\AppuntamentiController;
use App\Http\Controllers\ListaAttesaController;
use App\Http\Controllers\TariffaController;
use App\Http\Controllers\FirmaController;
use App\Http\Controllers\SystemMaintenanceController;
use App\Http\Controllers\PagamentiPazientiController;
use App\Http\Controllers\NotificaController;
use App\Http\Controllers\CartellaClinicaController;

Route::get('/', function () {
    return redirect()->route('login_form');
});

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login_form');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// routes/web.php
Route::get('/calendario', fn() => Inertia::render('Calendario'))
    ->middleware([AuthSession::class])
    ->name('calendario');


Route::middleware([AuthSession::class])->group(function () {

// Route::get('/home-admin', [HomeController::class, 'admin'])->name('home_admin');
// Route::get('/home-staff', [HomeController::class, 'staff'])->name('home_staff');
// Route::get('/home-paziente', [HomeController::class, 'paziente'])->name('home_paziente');
Route::post('/utenti', [UtenteController::class, 'store'])->name('utenti.store');
Route::get('/get-pazienti', [UtenteController::class, 'indexPazienti']);
Route::get('/utenti/staff',    [UtenteController::class, 'indexStaff']);
Route::get('/terapisti', [UtenteController::class, 'terapisti'])->name('utenti.terapisti');
Route::get('/professioni/terapisti', [UtenteController::class, 'professioniTerapisti'])->name('utenti.professioniTerapisti');

Route::get('/profilo', [UtenteController::class, 'profilo'])->name('profilo');
Route::post('/profilo/cambio-password', [UtenteController::class, 'cambiaPassword'])->name('password.change');
Route::delete('/utenti/{utente}', [UtenteController::class, 'destroy'])->name('utenti.destroy');
Route::put('/utenti/{utente}', [UtenteController::class, 'update'])->name('utenti.update');
Route::get('/profilo', [UtenteController::class, 'profilo'])->name('profilo');
Route::post('/profilo/cambio-password', [UtenteController::class, 'cambiaPassword'])->name('password.change');
Route::get('/admin/utenti-per-notifica', [UtenteController::class, 'utentiPerNotifica']);


Route::post('/pagamenti', [PagamentoController::class, 'store'])->name('pagamento.store');
Route::get('/pagamenti/stats', [PagamentoController::class, 'stats']);
Route::get('/pagamenti/dettagli-stats', [PagamentoController::class, 'dettagliStats']);

Route::post('/appuntamenti', [AppuntamentiController::class, 'store']);
Route::get('/appuntamenti-get', [AppuntamentiController::class, 'index']);
Route::patch('/appuntamenti/{id}', [AppuntamentiController::class, 'update']);
Route::get('/appuntamenti/{id}', [AppuntamentiController::class, 'show']);
Route::delete('/appuntamenti/{id}', [AppuntamentiController::class, 'destroy']);


Route::get('/incassi-per-anno', [PagamentoController::class, 'incassiPerAnno']);
Route::get('/pagamenti/filtrati', [PagamentoController::class, 'filtraPagamenti']);


Route::get('/', function () {
    return Inertia::render('Home', [
        'ruolo' => session('logged_user.ruolo'),
        'canEdit' => session('logged_user.ruolo') === 'admin'
    ]);
})->name('home');

Route::get('/home', function () {
   return Inertia::render('Home', [
        'ruolo' => session('logged_user.ruolo'),
        'canEdit' => session('logged_user.ruolo') === 'admin'
    ]);
})->name('home');

Route::get('/incassi', fn() => Inertia::render('Incassi'))->name('incassi');
Route::get('/utenti', fn() => Inertia::render('Utenti'))->name('utenti');
Route::get('/pagamenti', fn() => Inertia::render('Pagamenti'))->name('pagamenti');
Route::get('/appuntamenti', fn() => Inertia::render('Appuntamenti'))->name('appuntamenti');
Route::get('/archivio-firme', function () {
    $ruolo = session('logged_user.ruolo');
    return Inertia::render('ArchivioFirme', ['ruolo' => $ruolo]);
})->name('archivio-firme');
Route::get('/lista-attesa', fn() => Inertia::render('ListaAttesa'))->name('lista-attesa');
Route::get('/tariffario', fn() => Inertia::render('Tariffario'))->name('tariffario');
Route::get('/chi-siamo', fn() => Inertia::render('ChiSiamo'))->name('chi-siamo');
Route::get('/staff', fn() => Inertia::render('Staff'))->name('staff');
Route::get('/utilita', fn() => Inertia::render('Utilità'))->name('utilita');

Route::get('/incassi/{tipo}', function ($tipo) {
    return Inertia::render('IncassoDettaglio', ['tipo' => $tipo]);
})->name('incassi.dettaglio');



Route::get('/get-lista-attesa', [ListaAttesaController::class, 'index']);
Route::post('/aggiungi-lista-attesa', [ListaAttesaController::class, 'store']);
Route::patch('/lista-attesa/{id}/chiamato', [ListaAttesaController::class, 'segnaChiamato']);
Route::patch('/lista-attesa/{id}/aggiorna-terapia', [ListaAttesaController::class, 'aggiornaTerapia']);
Route::patch('/lista-attesa/{id}/aggiorna-terapista', [ListaAttesaController::class, 'aggiornaTerapista']);


Route::get('/tariffe', [TariffaController::class, 'index'])->name('tariffe.index');
Route::post('/tariffe', [TariffaController::class, 'store'])->name('tariffe.store');
Route::get('/tariffe/{id}', [TariffaController::class, 'show'])->name('tariffe.show');
Route::post('/tariffe/update/{id}', [TariffaController::class, 'update']);
Route::delete('/tariffe/{id}', [TariffaController::class, 'destroy']);

Route::get('/firme', [FirmaController::class, 'index']);
Route::post('/firme', [FirmaController::class, 'store']);
Route::delete('/firme/{id}', [FirmaController::class, 'destroy']);
Route::get('/firme/export', [FirmaController::class, 'export']);
// Lista firme per paziente loggato (usa nome/cognome in sessione)
Route::get('/firme/paziente', [FirmaController::class, 'firmePazienteLoggato']);



// Route per i pagamenti dei pazienti
Route::get('/pagamenti-pazienti', [PagamentiPazientiController::class, 'index']);


Route::post('/admin/utilita/purge/waitlist',       [SystemMaintenanceController::class, 'purgeWaitlist'])->name('utilita.purge.waitlist');
Route::post('/admin/utilita/purge/signatures',     [SystemMaintenanceController::class, 'purgeSignatures'])->name('utilita.purge.signatures');
Route::post('/admin/utilita/purge/appointments',   [SystemMaintenanceController::class, 'purgeAppointments'])->name('utilita.purge.appointments');
Route::post('/admin/utilita/purge/payments',       [SystemMaintenanceController::class, 'purgePayments'])->name('utilita.purge.payments');
Route::post('/admin/utilita/purge/prices',         [SystemMaintenanceController::class, 'purgePrices'])->name('utilita.purge.prices');
Route::post('/admin/utilita/purge/medical-charts', [SystemMaintenanceController::class, 'purgeMedicalCharts'])->name('utilita.purge.medical');
Route::post(
    '/admin/utilita/purge/notifications',
    [SystemMaintenanceController::class, 'purgeNotifications']
)->name('utilita.purge.notifications');

//sistema notifiche
Route::post('/admin/notifiche', [NotificaController::class, 'store']);
Route::get('/notifiche', [NotificaController::class, 'index']);
Route::post('/notifiche/{id}/letta', [NotificaController::class, 'segnaComeLetta']);


 /*
    |---------------------------
    | Cartella Clinica (CORRETTO)
    |---------------------------
    */

    // UI
    Route::get('/cartella-clinica/{paziente}', fn ($paziente) =>
        Inertia::render('CartellaClinica', [
            'pazienteId' => $paziente,
            'ruolo' => session('logged_user.ruolo'),
        ])
    )->name('cartella.clinica');

    // DATA
    Route::get('/cartella-clinica/{paziente}/data', [CartellaClinicaController::class, 'data']);

    // FILES
    Route::post('/cartella-clinica/{paziente}/files', [CartellaClinicaController::class, 'store']);
    Route::get('/cartella-clinica/file/{file}/download', [CartellaClinicaController::class, 'download']);
    Route::delete('/cartella-clinica/file/{file}', [CartellaClinicaController::class, 'destroy']);


});


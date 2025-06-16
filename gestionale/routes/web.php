<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UtenteController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\AppuntamentiController;
use App\Http\Controllers\ListaAttesaController;


// Route::get('/', function () {
//     return Inertia::render('Home');
// });

Route::post('/utenti', [UtenteController::class, 'store'])->name('utenti.store');
Route::get('/get-pazienti', [UtenteController::class, 'indexPazienti']);
Route::get('/terapisti', [UtenteController::class, 'terapisti'])->name('utenti.terapisti');
Route::get('/professioni/terapisti', [UtenteController::class, 'professioniTerapisti'])->name('utenti.professioniTerapisti');
Route::post('/pagamenti', [PagamentoController::class, 'store'])->name('pagamento.store');
Route::get('/pagamenti/stats', [PagamentoController::class, 'stats']);
Route::get('/pagamenti/dettagli-stats', [PagamentoController::class, 'dettagliStats']);
Route::post('/appuntamenti', [AppuntamentiController::class, 'store']);



Route::get('/', fn () => Inertia::render('Home'))->name('home');
Route::get('/home', fn () => Inertia::render('Home'))->name('home');
Route::get('/incassi', fn () => Inertia::render('Incassi'))->name('incassi');
Route::get('/pazienti', fn () => Inertia::render('Pazienti'))->name('pazienti');
Route::get('/archivio-firme', fn () => Inertia::render('ArchivioFirme'))->name('archivio-firme');
Route::get('/lista-attesa', fn () => Inertia::render('ListaAttesa'))->name('lista-attesa');
Route::get('/tariffario', fn () => Inertia::render('Tariffario'))->name('tariffario');
Route::get('/chi-siamo', fn () => Inertia::render('ChiSiamo'))->name('chi-siamo');



Route::get('/get-lista-attesa', [ListaAttesaController::class, 'index']);
Route::post('/aggiungi-lista-attesa', [ListaAttesaController::class, 'store']);
Route::patch('/lista-attesa/{id}/chiamato', [ListaAttesaController::class, 'segnaChiamato']);
Route::patch('/lista-attesa/{id}/aggiorna-terapia', [ListaAttesaController::class, 'aggiornaTerapia']);
Route::patch('/lista-attesa/{id}/aggiorna-terapista', [ListaAttesaController::class, 'aggiornaTerapista']);

<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UtenteController;
use App\Http\Controllers\PagamentoController;
// Route::get('/', function () {
//     return Inertia::render('Home');
// });

Route::post('/utenti', [UtenteController::class, 'store'])->name('utenti.store');
Route::get('/get-pazienti', [UtenteController::class, 'indexPazienti']);
Route::get('/terapisti', [UtenteController::class, 'terapisti'])->name('utenti.terapisti');
Route::post('/pagamenti', [PagamentoController::class, 'store'])->name('pagamento.store');
Route::get('/pagamenti/stats', [PagamentoController::class, 'stats']);




Route::get('/', fn () => Inertia::render('Home'))->name('home');
Route::get('/home', fn () => Inertia::render('Home'))->name('home');
Route::get('/incassi', fn () => Inertia::render('Incassi'))->name('incassi');
Route::get('/pazienti', fn () => Inertia::render('Pazienti'))->name('pazienti');
Route::get('/archivio-firme', fn () => Inertia::render('ArchivioFirme'))->name('archivio-firme');
Route::get('/lista-attesa', fn () => Inertia::render('ListaAttesa'))->name('lista-attesa');
Route::get('/tariffario', fn () => Inertia::render('Tariffario'))->name('tariffario');
Route::get('/chi-siamo', fn () => Inertia::render('ChiSiamo'))->name('chi-siamo');



<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Home');
// });


Route::get('/', fn () => Inertia::render('Home'))->name('home');
Route::get('/home', fn () => Inertia::render('Home'))->name('home');
Route::get('/incassi', fn () => Inertia::render('Incassi'))->name('incassi');
Route::get('/pazienti', fn () => Inertia::render('Pazienti'))->name('pazienti');
Route::get('/archivio-firme', fn () => Inertia::render('ArchivioFirme'))->name('archivio-firme');
Route::get('/lista-attesa', fn () => Inertia::render('ListaAttesa'))->name('lista-attesa');
Route::get('/tariffario', fn () => Inertia::render('Tariffario'))->name('tariffario');
Route::get('/chi-siamo', fn () => Inertia::render('ChiSiamo'))->name('chi-siamo');



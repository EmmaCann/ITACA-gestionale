<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\AuthSession;


Route::get('/', function () {
    return redirect()->route('login_form');
});

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login_form');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware([AuthSession::class])->group(function () {

    Route::get('/home-admin', [HomeController::class, 'admin'])->name('home_admin');
    Route::get('/home-staff', [HomeController::class, 'staff'])->name('home_staff');
    Route::get('/home-paziente', [HomeController::class, 'paziente'])->name('home_paziente');
    
});

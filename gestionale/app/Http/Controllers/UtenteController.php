<?php

namespace App\Http\Controllers;

use App\Models\Utente;
use App\Models\StaffDati;
use App\Models\CartellaClinica;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UtenteController extends Controller
{
    public function store(Request $request)
    {
        // Validazione base
        $validated = $request->validate([
            'tipoUtente' => ['required', Rule::in(['paziente', 'staff'])],
            'nome' => 'required|string|max:255',
            'cognome' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'dataNascita' => 'nullable|date',
            'professione' => 'nullable|string|max:255',
            'diagnosi' => 'nullable|string',
        ]);

        // Genera username univoco
        $cognomeCompatto = str_replace(' ', '', $validated['cognome']);
        $baseUsername = Str::slug($validated['nome'], '') . '.' . Str::slug($cognomeCompatto, '');
        $username = $baseUsername;
        $counter = 1;

        while (Utente::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }

        // Creazione utente
        $utente = Utente::create([
            'nome' => $validated['nome'],
            'cognome' => $validated['cognome'],
            'username' => $username,
            'password' => 'password', // viene criptata automaticamente dal model
            'email' => $validated['email'] ?? null,
            'telefono' => $validated['telefono'] ?? null,
            'nascita' => $validated['dataNascita'] ?? null,
            'ruolo' => $validated['tipoUtente'],
        ]);

        // Relazione staff o paziente
        if ($validated['tipoUtente'] === 'staff') {
            $utente->staffDati()->create([
                'professione' => $validated['professione'] ?? 'Non specificata',
            ]);
        }

        if ($validated['tipoUtente'] === 'paziente') {
            $utente->cartellaClinica()->create([
                'anamnesi' => '',
                'diagnosi' => $validated['diagnosi'] ?? '',
                'terapia' => '',
                'note' => '',
            ]);
        }

        return response()->json([
            'message' => 'Utente creato con successo',
            'utente' => $utente->load(['staffDati', 'cartellaClinica']),
        ], 201);
    }


    public function terapisti()
    {
        $terapisti = Utente::where('ruolo', 'staff')
            ->select('id', 'nome', 'cognome')
            ->get()
            ->map(function ($utente) {
                return [
                    'value' => $utente->id,
                    'label' => 'Dr. ' . $utente->nome . ' ' . $utente->cognome,
                ];
            })
            ->values(); 

        return response()->json($terapisti);
    }
}

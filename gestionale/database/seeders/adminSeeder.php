<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Utente;

class adminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Utente::create([
            'username' => 'adminTest',
            'password' => 'password',
            'email' => 'test@example.com',
            'nome' => 'Mario',
            'cognome' => 'Rossi',
            'nascita' => '1995-07-10',
            'ruolo' => 'admin',
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Utente;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
    {
        // evita duplicati se il seeder viene rilanciato
        $exists = Utente::where('username', 'admin')
            ->orWhere('email', 'admin@example.com')
            ->exists();

        if ($exists) {
            return;
        }

        Utente::create([
            'nome'      => 'Amministratore',
            'cognome'   => 'Sistema',
            'username'  => 'admin',
            'password'  => 'password',        // verrà hashata dal mutator
            'email'     => 'admin@example.com',
            'telefono'  => '0000000000',
            'nascita'   => '1990-01-01',      // adatta se la colonna non accetta null
            'ruolo'     => 'admin',
        ]);
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('utente', function (Blueprint $table) {
            // Cambia la colonna sesso in ENUM('M','F') nullable
            $table->enum('sesso', ['M', 'F'])->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('utente', function (Blueprint $table) {
            // Torna a boolean nullable
            $table->boolean('sesso')->nullable()->change();
        });
    }
};

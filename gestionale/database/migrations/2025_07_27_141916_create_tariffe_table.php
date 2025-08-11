<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tariffe', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utente_id')->constrained('utente')->onDelete('cascade');
            $table->string('terapia');
            $table->decimal('prezzo', 8, 2);
            $table->integer('durata'); // in minuti
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariffe');
    }
};

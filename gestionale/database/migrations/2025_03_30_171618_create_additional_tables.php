<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdditionalTables extends Migration
{
    public function up()
    {
        // Tabella staff_dati
        Schema::create('staff_dati', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utente_id')->unique()->constrained('utente')->onDelete('cascade');
            $table->string('professione');
        });

        // Tabella cartelle_cliniche
        Schema::create('cartelle_cliniche', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paziente_id')->unique()->constrained('utente')->onDelete('cascade');
            $table->text('anamnesi');
            $table->text('diagnosi');
            $table->text('terapia');
            $table->text('note');
            $table->timestamps();
        });

        // Tabella lista_attesa
        Schema::create('lista_attesa', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('cognome');
            $table->string('telefono');
            $table->string('email');
            $table->date('data');
            $table->string('terapia');
            $table->foreignId('terapista_id')->constrained('utente')->onDelete('cascade');
            $table->boolean('chiamato');
            $table->foreignId('utente_id')->nullable()->constrained('utente')->onDelete('set null');
            $table->dateTime('created_at')->default(now());
        });

        // Tabella pagamenti
        Schema::create('pagamenti', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paziente_id')->constrained('utente')->onDelete('cascade');
            $table->foreignId('terapista_id')->constrained('utente')->onDelete('cascade');
            $table->date('data');
            $table->decimal('importo', 8, 2);
            $table->dateTime('created_at')->default(now());
        });

        // Tabella appuntamenti
        Schema::create('appuntamenti', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paziente_id')->constrained('utente')->onDelete('cascade');
            $table->foreignId('terapista_id')->constrained('utente')->onDelete('cascade');
            $table->date('data');
            $table->time('ora');
            $table->text('note');
            $table->dateTime('created_at')->default(now());
        });
    }

    public function down()
    {
        Schema::dropIfExists('appuntamenti');
        Schema::dropIfExists('pagamenti');
        Schema::dropIfExists('lista_attesa');
        Schema::dropIfExists('cartelle_cliniche');
        Schema::dropIfExists('staff_dati');
    }
}

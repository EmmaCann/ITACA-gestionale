<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePagamentiPerUtentiNonRegistrati extends Migration
{
    public function up()
    {
        Schema::table('pagamenti', function (Blueprint $table) {
            // Elimina la foreign key esistente su paziente_id
            $table->dropForeign(['paziente_id']);
        });

        Schema::table('pagamenti', function (Blueprint $table) {
            // Rendi paziente_id nullable
            $table->unsignedBigInteger('paziente_id')->nullable()->change();

            // Aggiungi i campi nome e cognome per utenti non registrati
            $table->string('nome')->nullable()->after('paziente_id');
            $table->string('cognome')->nullable()->after('nome');

            // Ricrea la foreign key con ON DELETE SET NULL
            $table->foreign('paziente_id')
                ->references('id')
                ->on('utente')
                ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('pagamenti', function (Blueprint $table) {
            // Rimuovi la foreign key e i nuovi campi
            $table->dropForeign(['paziente_id']);
            $table->dropColumn(['nome', 'cognome']);
        });

        Schema::table('pagamenti', function (Blueprint $table) {
            // Rendi paziente_id NOT NULL di nuovo
            $table->unsignedBigInteger('paziente_id')->nullable(false)->change();

            // Ripristina la foreign key originale
            $table->foreign('paziente_id')
                ->references('id')
                ->on('utente')
                ->onDelete('cascade');
        });
    }
}

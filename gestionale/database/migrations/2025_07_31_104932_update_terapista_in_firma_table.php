<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('firme', function (Blueprint $table) {
            // Rimuove la colonna 'terapista' (stringa)
            $table->dropColumn('terapista');

            // Aggiunge la colonna 'terapista_id' come FK
            $table->unsignedBigInteger('terapista_id')->after('terapia');

            $table->foreign('terapista_id')
                ->references('id')
                ->on('utente')
                ->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('firme', function (Blueprint $table) {
            $table->dropForeign(['terapista_id']);
            $table->dropColumn('terapista_id');
            $table->string('terapista')->after('terapia');
        });
    }
};

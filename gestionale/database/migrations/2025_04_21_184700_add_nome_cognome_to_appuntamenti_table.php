<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNomeCognomeToAppuntamentiTable extends Migration
{
    public function up()
    {
        Schema::table('appuntamenti', function (Blueprint $table) {
            $table->string('nome')->nullable()->after('paziente_id');
            $table->string('cognome')->nullable()->after('nome');
        });
    }

    public function down()
    {
        Schema::table('appuntamenti', function (Blueprint $table) {
            $table->dropColumn(['nome', 'cognome']);
        });
    }
}

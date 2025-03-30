<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTelefonoToUtenteTable extends Migration
{
    public function up()
    {
        Schema::table('utente', function (Blueprint $table) {
            $table->string('telefono')->after('email');
        });
    }

    public function down()
    {
        Schema::table('utente', function (Blueprint $table) {
            $table->dropColumn('telefono');
        });
    }
}


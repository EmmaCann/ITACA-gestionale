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
      Schema::table('lista_attesa', function (Blueprint $table) {
            $table->string('nome')->nullable()->change();
            $table->string('cognome')->nullable()->change();
            $table->string('telefono')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->date('data')->nullable()->change();
            $table->string('terapia')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::table('lista_attesa', function (Blueprint $table) {
            $table->string('nome')->nullable(false)->change();
            $table->string('cognome')->nullable(false)->change();
            $table->string('telefono')->nullable(false)->change();
            $table->string('email')->nullable(false)->change();
            $table->date('data')->nullable(false)->change();
            $table->string('terapia')->nullable(false)->change();
        });
    }
};

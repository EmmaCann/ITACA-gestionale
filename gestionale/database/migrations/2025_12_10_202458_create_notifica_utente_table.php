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
        Schema::create('notifica_utente', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('notifica_id');
            $table->unsignedBigInteger('utente_id');
            $table->boolean('letta')->default(false);
            $table->timestamp('letta_il')->nullable();

            $table->timestamps();

            $table->foreign('notifica_id')->references('id')->on('notifiche')->onDelete('cascade');
            $table->foreign('utente_id')->references('id')->on('utente')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifica_utente');
    }
};

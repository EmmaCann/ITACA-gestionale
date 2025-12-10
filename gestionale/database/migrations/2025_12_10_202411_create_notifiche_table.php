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
        Schema::create('notifiche', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id'); // utente che invia la notifica
            $table->string('titolo')->nullable();
            $table->text('messaggio');
            $table->string('tipologia')->nullable(); // es: sistema, appuntamento, pagamento...
            $table->string('urgenza')->nullable();   // es: alta, media, bassa
            $table->timestamps();

            $table->foreign('admin_id')->references('id')->on('utente')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifiche');
    }
};

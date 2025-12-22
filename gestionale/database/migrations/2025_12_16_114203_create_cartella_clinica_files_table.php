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
        Schema::create('cartella_clinica_files', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('paziente_id');
            $table->unsignedBigInteger('uploaded_by'); // staff

            $table->string('original_name');
            $table->string('file_path');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();

            $table->timestamps();

            $table->foreign('paziente_id')
                ->references('id')->on('utente')
                ->onDelete('cascade');

            $table->foreign('uploaded_by')
                ->references('id')->on('utente')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cartella_clinica_files');
    }
};

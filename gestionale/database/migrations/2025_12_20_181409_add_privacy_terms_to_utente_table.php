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
        Schema::table('utente', function (Blueprint $table) {
            $table->timestamp('privacy_accepted_at')->nullable()->after('ruolo');
            $table->string('privacy_version', 20)->nullable()->after('privacy_accepted_at');

            $table->timestamp('terms_accepted_at')->nullable()->after('privacy_version');
            $table->string('terms_version', 20)->nullable()->after('terms_accepted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('utente', function (Blueprint $table) {
            $table->dropColumn([
                'privacy_accepted_at',
                'privacy_version',
                'terms_accepted_at',
                'terms_version',
            ]);
        });
    }
};

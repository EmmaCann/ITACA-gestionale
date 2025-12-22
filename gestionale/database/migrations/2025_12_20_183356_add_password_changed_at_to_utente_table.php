<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('utente', function (Blueprint $table) {
            $table
                ->timestamp('password_changed_at')
                ->nullable()
                ->after('terms_version');
        });
    }

    public function down()
    {
        Schema::table('utente', function (Blueprint $table) {
            $table->dropColumn('password_changed_at');
        });
    }
};

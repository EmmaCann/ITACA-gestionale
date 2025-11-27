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
        Schema::table('pagamenti', function (Blueprint $table) {
            $table->boolean('fattura')->default(false)->after('importo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('pagamenti', function (Blueprint $table) {
            $table->dropColumn('fattura');
        });
    }
};

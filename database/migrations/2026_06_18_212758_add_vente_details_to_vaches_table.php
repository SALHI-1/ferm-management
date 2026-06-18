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
        Schema::table('vaches', function (Blueprint $table) {
            $table->decimal('prix_vente', 10, 2)->nullable();
            $table->date('date_vente')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vaches', function (Blueprint $table) {
            $table->dropColumn(['prix_vente', 'date_vente']);
        });
    }
};

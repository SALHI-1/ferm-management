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
            $table->decimal('part_ferme_net', 4, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vaches', function (Blueprint $table) {
            $table->dropColumn('part_ferme_net');
        });
    }
};

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
            $table->enum('subvention_status', ['pending', 'accepted', 'rejected'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vaches', function (Blueprint $table) {
            $table->dropColumn('subvention_status');
        });
    }
};

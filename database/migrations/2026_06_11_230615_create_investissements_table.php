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
     Schema::create('investissements', function (Blueprint $table) {
    $table->id();
    $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
    $table->foreignId('vache_id')->constrained('vaches')->onDelete('cascade');
    $table->enum('type_investissement', ['demi', 'complet']);
    $table->float('part_possedee'); // ex: 0.5 ou 1.0
    $table->date('date_investissement');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investissements');
    }
};

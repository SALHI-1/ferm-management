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
Schema::create('vaches', function (Blueprint $table) {
    $table->id();
    
    $table->foreignId('mother_id')->nullable()->constrained('vaches')->onDelete('set null');
    
    $table->enum('sexe', ['female', 'male']);
    $table->enum('origine', ['achete', 'ne_sur_ferme']);
    $table->enum('statut_vente', ['vendue', 'non_vendue'])->default('non_vendue');
    $table->string('numero_ticket')->unique();
    $table->string('image')->nullable();
    $table->string('fichier_documents')->nullable();
    $table->enum('statut_sante', ['sickness', 'pregnancy', 'healthy'])->default('healthy');
    $table->date('date_naissance')->nullable();
    $table->date('date_entree');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vaches');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
 public function up(): void {
    Schema::create('health_statuses', function (Blueprint $table) {
        $table->id();
        $table->foreignId('vache_id')->constrained('vaches')->onDelete('cascade');
        $table->enum('type', ['pregnancy', 'sickness', 'checkup']);
        $table->date('date_debut');
        $table->date('date_fin')->nullable();
        $table->timestamps();
    });

    Schema::create('costs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('vache_id')->constrained('vaches')->onDelete('cascade');
        $table->enum('type', ['food', 'veterinaire', 'autre']);
        $table->decimal('price', 10, 2);
        $table->date('date_facture');
        $table->timestamps();
    });

    Schema::create('productions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('vache_id')->constrained('vaches')->onDelete('cascade');
        $table->float('quantite_litres');
        $table->date('periode_mois'); // Format Y-m-01 pour centraliser par mois
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suivi_tables');
    }
};

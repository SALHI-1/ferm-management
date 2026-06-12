<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\SoftDeletes;

return new class extends Migration {
    public function up(): void {
        // Tables des types spécifiques d'utilisateurs
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->enum('role', ['admin', 'super_admin'])->default('admin');
            $table->timestamps();
        });

        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->date('date_inscription');
            $table->timestamps();
        });

        Schema::create('managers', function (Blueprint $table) {
            $table->id(); // Prêt pour futurs champs
            $table->timestamps();
        });

        // Table centrale Users (Polymorphe)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('telephone')->nullable();
            $table->string('password');
            
            // Les colonnes polymorphes : userable_id et userable_type
            $table->numericMorphs('userable'); 
            
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void {
        Schema::dropIfExists('users');
        Schema::dropIfExists('managers');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('admins');
    }
};
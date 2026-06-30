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
        // PostgreSQL does not support MySQL's MODIFY syntax.
        // Laravel's enum columns are implemented as varchar + CHECK constraint in PostgreSQL.
        // We drop the old CHECK constraint and add a new one with the extra value.
        \Illuminate\Support\Facades\DB::statement(
            "ALTER TABLE costs DROP CONSTRAINT IF EXISTS costs_type_check"
        );
        \Illuminate\Support\Facades\DB::statement(
            "ALTER TABLE costs ADD CONSTRAINT costs_type_check CHECK (type IN ('food', 'veterinaire', 'autre', 'lait_consomme'))"
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to the original three-value constraint.
        \Illuminate\Support\Facades\DB::statement(
            "ALTER TABLE costs DROP CONSTRAINT IF EXISTS costs_type_check"
        );
        \Illuminate\Support\Facades\DB::statement(
            "ALTER TABLE costs ADD CONSTRAINT costs_type_check CHECK (type IN ('food', 'veterinaire', 'autre'))"
        );
    }
};

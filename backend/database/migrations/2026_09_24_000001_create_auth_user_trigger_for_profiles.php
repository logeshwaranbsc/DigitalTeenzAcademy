<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Creates a PostgreSQL Database Trigger function on auth.users so that
     * any user created in Supabase Auth (auth.users) automatically drops/populates
     * a corresponding profile in the public.profiles table.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("
                CREATE OR REPLACE FUNCTION public.handle_new_user()
                RETURNS TRIGGER AS $$
                BEGIN
                    INSERT INTO public.profiles (
                        id,
                        auth_user_id,
                        first_name,
                        last_name,
                        email,
                        phone,
                        role,
                        status,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        gen_random_uuid(),
                        NEW.id,
                        COALESCE(NULLIF(NEW.raw_user_meta_data->>'first_name', ''), split_part(NEW.email, '@', 1)),
                        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
                        NEW.email,
                        NEW.raw_user_meta_data->>'phone',
                        COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'student'),
                        'active',
                        NOW(),
                        NOW()
                    )
                    ON CONFLICT (auth_user_id) DO UPDATE SET
                        first_name = EXCLUDED.first_name,
                        last_name = EXCLUDED.last_name,
                        email = EXCLUDED.email,
                        phone = COALESCE(EXCLUDED.phone, profiles.phone),
                        role = EXCLUDED.role,
                        updated_at = NOW();

                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql SECURITY DEFINER;
            ");

            DB::statement("
                DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
                CREATE TRIGGER on_auth_user_created
                    AFTER INSERT ON auth.users
                    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;");
            DB::statement("DROP FUNCTION IF EXISTS public.handle_new_user();");
        }
    }
};

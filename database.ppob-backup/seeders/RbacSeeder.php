<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RbacSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            'dashboard','users','tenants','wallet','deposits','products','prices',
            'transactions','providers','provider_mapping','provider_health',
            'payments','notifications','commissions','promotions','reports',
            'theme','branding','audit','settings'
        ];

        foreach ($modules as $module) {
            Permission::firstOrCreate([
                'slug' => "{$module}.view",
            ], [
                'name' => "View {$module}",
                'module' => $module,
            ]);
            Permission::firstOrCreate([
                'slug' => "{$module}.manage",
            ], [
                'name' => "Manage {$module}",
                'module' => $module,
            ]);
        }

        $super = Role::firstOrCreate(
            ['slug' => 'super_admin'],
            ['name' => 'Super Admin']
        );

        $super->permissions()->sync(Permission::pluck('id'));
    }
}

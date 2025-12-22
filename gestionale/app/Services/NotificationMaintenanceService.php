<?php
namespace App\Services;

use App\Models\Notifica;
use App\Models\SystemFlag;
use Illuminate\Support\Facades\DB;

class NotificationMaintenanceService
{
    /**
     * @return bool true se la pulizia è stata eseguita
     */
    public static function purgeIfNeeded(): bool
    {
        $flag = SystemFlag::find('notifications_last_purge_at');

        if ($flag) {
            $lastPurge = now()->parse($flag->value);

            if ($lastPurge->diffInDays(now()) < 30) {
                return false;
            }
        }

        DB::transaction(function () {
            DB::table('notifica_utente')->delete();
            Notifica::query()->delete();

            SystemFlag::updateOrCreate(
                ['key' => 'notifications_last_purge_at'],
                ['value' => now()->toDateTimeString()]
            );
        });

        return true;
    }
}

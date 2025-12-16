<?php 

namespace App\Http\Middleware;

use Closure;
use App\Services\NotificationMaintenanceService;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class AdminMonthlyMaintenance
{
    public function handle($request, Closure $next)
    {
        $user = Session::get('logged_user');

        if ($user && $user['ruolo'] === 'admin') {
            $purged = NotificationMaintenanceService::purgeIfNeeded();

            if ($purged) {
                Session::flash('notifications_purged', true);
            }
        }
        Log::info('AdminMonthlyMaintenance executed');

        return $next($request);
    }
}

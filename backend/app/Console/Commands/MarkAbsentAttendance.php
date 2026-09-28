<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use App\Models\Holiday;
use App\Models\Profile;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class MarkAbsentAttendance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:mark-absent {--days=30 : Number of past days to process}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically mark active profiles absent on past working days with no check-in';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');
        $endDate = today()->subDay(); // Up to yesterday
        $startDate = today()->subDays($days);

        if ($startDate->gt($endDate)) {
            $this->error('Start date cannot be greater than end date.');
            return 1;
        }

        $this->info("Processing auto-absent from {$startDate->toDateString()} to {$endDate->toDateString()}...");

        // Fetch all active student and employee profiles
        $profiles = Profile::where('status', 'active')
            ->whereIn('role', ['student', 'employee'])
            ->get();

        if ($profiles->isEmpty()) {
            $this->info('No active student/employee profiles found.');
            return 0;
        }

        // Fetch holidays in the date range
        $holidayDates = Holiday::betweenDates($startDate->toDateString(), $endDate->toDateString())
            ->pluck('date')
            ->map(fn($d) => $d->format('Y-m-d'))
            ->toArray();

        $absentCount = 0;

        foreach ($profiles as $profile) {
            // Profile creation date lower bound
            $profileCreatedDate = $profile->created_at ? $profile->created_at->startOfDay() : $startDate;
            $effectiveStartDate = $profileCreatedDate->gt($startDate) ? $profileCreatedDate : $startDate;

            if ($effectiveStartDate->gt($endDate)) {
                continue;
            }

            $period = CarbonPeriod::create($effectiveStartDate, $endDate);

            foreach ($period as $date) {
                // Skip weekly holiday (Sunday = 0)
                if ($date->isSunday()) {
                    continue;
                }

                $dateStr = $date->toDateString();

                // Skip holidays
                if (in_array($dateStr, $holidayDates, true)) {
                    continue;
                }

                // Check if an attendance record exists for this profile on this date
                $exists = Attendance::where('profile_id', $profile->id)
                    ->whereDate('check_in_at', $dateStr)
                    ->exists();

                if (!$exists) {
                    Attendance::create([
                        'profile_id'  => $profile->id,
                        'user_type'   => $profile->role,
                        'check_in_at' => $date->copy()->setTime(9, 0, 0), // 09:00 AM placeholder
                        'status'      => 'absent',
                    ]);
                    $absentCount++;
                }
            }
        }

        $this->info("Successfully generated {$absentCount} absent attendance records.");
        Log::info("Command attendance:mark-absent executed. Generated {$absentCount} absent records.");

        return 0;
    }
}

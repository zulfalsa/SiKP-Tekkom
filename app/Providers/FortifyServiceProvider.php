<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Fortify;

// --- IMPORT INTERFACE DAN CLASS CUSTOM ---
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\RegisterResponse; // <--- Tambahkan ini
use App\Http\Responses\LoginResponse as CustomLoginResponse;
use App\Http\Responses\RegisterResponse as CustomRegisterResponse; // <--- Tambahkan ini

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register Custom Login Response (Sudah ada sebelumnya)
        $this->app->singleton(LoginResponse::class, CustomLoginResponse::class);

        // Register Custom Register Response (BARU)
        $this->app->singleton(RegisterResponse::class, CustomRegisterResponse::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);

        Fortify::loginView(function () {
            return inertia('auth/login');
        });

        Fortify::registerView(function () {
            return inertia('auth/register');
        });

        Fortify::requestPasswordResetLinkView(function () {
            return inertia('auth/forgot-password');
        });

        Fortify::resetPasswordView(function ($request) {
            return inertia('auth/reset-password', ['request' => $request]);
        });

        Fortify::verifyEmailView(function () {
            return inertia('auth/verify-email');
        });

        Fortify::confirmPasswordView(function () {
            return inertia('auth/confirm-password');
        });

        Fortify::twoFactorChallengeView(function () {
            return inertia('auth/two-factor-challenge');
        });

        RateLimiter::for('login', function (Request $request) {
            $email = (string) $request->email;

            return Limit::perMinute(10)->by($email . $request->ip());
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
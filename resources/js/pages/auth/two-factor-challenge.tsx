import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { Head, Link, useForm } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        code: '',
        recovery_code: '',
    });

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Kode Pemulihan',
                description:
                    'Konfirmasikan akses ke akun Anda dengan memasukkan salah satu kode pemulihan darurat Anda.',
                toggleText: 'Masuk menggunakan kode autentikasi',
            };
        }

        return {
            title: 'Kode Autentikasi',
            description:
                'Masukkan kode autentikasi yang disediakan oleh aplikasi autentikator Anda.',
            toggleText: 'Masuk menggunakan kode pemulihan',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
        reset();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/two-factor-challenge');
    };

    // Sync OTP input with form data
    const handleOtpChange = (value: string) => {
        setCode(value);
        setData('code', value);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#ECECF4] p-4 dark:bg-gray-900">
            <Head title="Two-Factor Authentication" />

            {/* Back to Dashboard Button */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8">
                <Button
                    variant="ghost"
                    asChild
                    className="group text-muted-foreground hover:text-foreground hover:bg-white/50"
                >
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>

            <Card className="w-full max-w-[550px] border-0 shadow-2xl sm:rounded-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                <CardContent className="p-8 md:p-14">
                    {/* Header / Logo Section */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-transparent text-[#4F46E5] dark:text-indigo-400">
                            <AppLogoIcon className="h-16 w-16 fill-current" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            SiKP Tekkom
                        </h1>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                            {authConfigContent.title}
                        </p>
                    </div>

                    <div className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">
                        {authConfigContent.description}
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-6">
                        {showRecoveryInput ? (
                            <div className="grid gap-2">
                                <Input
                                    id="recovery_code"
                                    name="recovery_code"
                                    type="text"
                                    value={data.recovery_code}
                                    className="h-12 border-gray-300 bg-white px-4 text-base focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 rounded-lg text-center tracking-widest"
                                    placeholder="Kode Pemulihan"
                                    autoFocus={showRecoveryInput}
                                    onChange={(e) => setData('recovery_code', e.target.value)}
                                    required
                                />
                                <InputError message={errors.recovery_code} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="flex w-full items-center justify-center">
                                    <InputOTP
                                        maxLength={OTP_MAX_LENGTH}
                                        value={code}
                                        onChange={handleOtpChange}
                                        disabled={processing}
                                        pattern={REGEXP_ONLY_DIGITS}
                                    >
                                        <InputOTPGroup className="gap-2">
                                            {Array.from(
                                                { length: OTP_MAX_LENGTH },
                                                (_, index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                        className="h-12 w-10 border-gray-300 bg-white text-lg focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 rounded-md"
                                                    />
                                                ),
                                            )}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <InputError message={errors.code} />
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-bold bg-[#4834d4] hover:bg-[#3c2bb3] text-white shadow-lg transition-all hover:shadow-indigo-500/30 rounded-lg"
                                disabled={processing}
                            >
                                {processing && <Spinner className="mr-2 h-4 w-4" />}
                                Lanjutkan
                            </Button>

                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                <button
                                    type="button"
                                    className="cursor-pointer font-medium text-[#4834d4] hover:text-indigo-700 hover:underline dark:text-indigo-400 transition-colors"
                                    onClick={toggleRecoveryMode}
                                >
                                    {authConfigContent.toggleText}
                                </button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#ECECF4] p-4 dark:bg-gray-900">
            <Head title="Forgot Password" />

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
                    <div className="mb-10 flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-transparent text-[#4F46E5] dark:text-indigo-400">
                            <AppLogoIcon className="h-16 w-16 fill-current" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            SiKP Tekkom
                        </h1>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Reset Kata Sandi
                        </p>
                    </div>

                    <div className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi Anda.
                    </div>

                    {status && (
                        <div className="mb-6 rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div className="grid gap-5">
                            {/* Input Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="h-12 border-gray-300 bg-white px-4 text-base focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 rounded-lg"
                                    autoComplete="email"
                                    autoFocus
                                    placeholder="email@example.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full h-12 text-base font-bold bg-[#4834d4] hover:bg-[#3c2bb3] text-white shadow-lg transition-all hover:shadow-indigo-500/30 rounded-lg"
                                disabled={processing}
                            >
                                {processing && <Spinner className="mr-2 h-4 w-4" />}
                                Kirim Tautan Reset
                            </Button>
                        </div>

                        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                            Ingat kata sandi Anda?{' '}
                            <TextLink
                                href="/login"
                                className="font-bold text-[#4834d4] hover:text-indigo-700 hover:underline dark:text-indigo-400"
                            >
                                Masuk
                            </TextLink>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
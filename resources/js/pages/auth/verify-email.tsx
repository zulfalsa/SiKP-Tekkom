import AppLogoIcon from '@/components/app-logo-icon';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#ECECF4] p-4 dark:bg-gray-900">
            <Head title="Email verification" />

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
                            Verifikasi Email
                        </p>
                    </div>

                    <div className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Harap verifikasi alamat email Anda dengan mengeklik tautan yang baru saja kami kirimkan melalui email kepada Anda.
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-8 rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                        </div>
                    )}

                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold bg-[#4834d4] hover:bg-[#3c2bb3] text-white shadow-lg transition-all hover:shadow-indigo-500/30 rounded-lg"
                            disabled={processing}
                        >
                            {processing && <Spinner className="mr-2 h-4 w-4" />}
                            Kirim Ulang Email Verifikasi
                        </Button>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            <TextLink
                                href={logout()}
                                method="post"
                                as="button"
                                className="font-bold text-[#4834d4] hover:text-indigo-700 hover:underline dark:text-indigo-400 cursor-pointer"
                            >
                                Keluar
                            </TextLink>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
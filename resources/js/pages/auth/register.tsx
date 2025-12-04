import { Link, useForm, Head } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        identity_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // PERBAIKAN DISINI:
        // Pindahkan kurung tutup ')' ke AKHIR, setelah object options
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthSimpleLayout
            title="Daftar Akun SiKP"
            description="Masukkan detail pribadi Anda untuk membuat akun baru"
        >
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-6">
                    {/* Input Nama */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            className="block w-full"
                            autoComplete="name"
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Input Identity Number (NIP/NIM) */}
                    <div className="space-y-2">
                        <Label htmlFor="identity_number">NIP / NIM</Label>
                        <Input
                            id="identity_number"
                            name="identity_number"
                            value={data.identity_number}
                            className="block w-full"
                            autoComplete="off"
                            onChange={(e) => setData('identity_number', e.target.value)}
                            required
                        />
                        <InputError message={errors.identity_number} />
                    </div>

                    {/* Input Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Input Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Input Konfirmasi Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Daftar
                    </Button>
                </div>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
                Sudah punya akun?{' '}
                <Link
                    href="/login" 
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Masuk
                </Link>
            </div>
        </AuthSimpleLayout>
    );
}
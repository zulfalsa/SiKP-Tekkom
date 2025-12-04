import { Head, Link } from '@inertiajs/react';
import { FileText, Info, LogIn, UserPlus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface WelcomeProps {
    announcements: Announcement[];
    canLogin: boolean;
    // Tambahkan props lain jika diperlukan, misal auth status
    auth?: {
        user: any;
    };
}

export default function Welcome({ announcements = [], canLogin, auth }: WelcomeProps) {
    // Helper function untuk cek apakah user sudah login
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 font-sans">
            <Head title="Selamat Datang" />

            {/* --- HERO SECTION --- */}
            <header className="relative overflow-hidden pt-16 pb-32 lg:pt-32">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="mb-6 flex justify-center">
                        {/* Ganti dengan Logo Universitas/Fakultas jika ada */}
                        <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                            <FileText className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
                        Sistem Informasi <span className="text-blue-600">Kerja Praktik</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10">
                        Teknik Komputer - Universitas Diponegoro
                    </p>
                    
                    <div className="flex justify-center gap-4">
                        {user ? (
                            // Jika user sudah login, arahkan ke dashboard admin
                            <Link href="/admin/dashboard">
                                <Button size="lg" className="text-lg px-8">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            // Jika belum login
                            <>
                                {canLogin && (
                                    <Link href="/login">
                                        <Button size="lg" variant="default" className="text-lg px-8">
                                            <LogIn className="mr-2 h-5 w-5" /> Masuk
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/register">
                                    <Button size="lg" variant="outline" className="text-lg px-8 bg-white dark:bg-gray-800">
                                        <UserPlus className="mr-2 h-5 w-5" /> Daftar
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 opacity-10 pointer-events-none">
                     <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                     <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                     <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>
            </header>

            {/* --- FEATURES / INFO SECTION --- */}
            <section className="py-16 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-md bg-blue-50 dark:bg-blue-900/20">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                    <Info className="h-6 w-6" />
                                </div>
                                <CardTitle>Pusat Informasi</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    Akses panduan, syarat, dan alur pelaksanaan Kerja Praktik terbaru.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/info-syarat">
                                    <Button variant="link" className="p-0 text-blue-600">Pelajari Selengkapnya &rarr;</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-green-50 dark:bg-green-900/20">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <CardTitle>Dokumen & Berkas</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    Unduh template proposal, logbook harian, dan formulir penilaian.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/dokumen">
                                    <Button variant="link" className="p-0 text-green-600">Lihat Dokumen &rarr;</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-purple-50 dark:bg-purple-900/20">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                                <CardTitle>Alur Mudah</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    Proses administrasi yang lebih terstruktur dan transparan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="link" className="p-0 text-purple-600 cursor-default">Terintegrasi Sistem</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* --- ANNOUNCEMENTS SECTION --- */}
            {announcements.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center mb-10">Pengumuman Terbaru</h2>
                        <div className="space-y-6">
                            {announcements.map((ann) => (
                                <Card key={ann.id} className="shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl text-blue-700">{ann.title}</CardTitle>
                                            <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                                                {new Date(ann.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                            {ann.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/info-syarat">
                                <Button variant="outline">Lihat Semua Pengumuman</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* --- FOOTER --- */}
            <footer className="py-8 bg-gray-50 dark:bg-gray-900 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Program Studi Teknik Komputer - Universitas Diponegoro</p>
            </footer>
        </div>
    );
}
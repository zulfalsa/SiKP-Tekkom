import { Head } from '@inertiajs/react';
import { Megaphone, Calendar, Info, Eye } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout'; 
import { type BreadcrumbItem } from '@/types';

// --- INTERFACE & DUMMY DATA ---

interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface InfoProps {
    announcements: Announcement[];
    auth: { user: any };
}

// DUMMY DATA PENGUMUMAN
const dummyAnnouncements: Announcement[] = [
    {
        id: 1,
        title: 'Pembukaan Pendaftaran Kerja Praktik Periode Ganjil 2026',
        content: '<strong>PENTING!</strong> Pendaftaran Kerja Praktik (KP) untuk semester Ganjil Tahun Akademik 2025/2026 telah dibuka. Harap perhatikan tanggal-tanggal penting berikut:\n\n' +
                 '<ul><li>Batas Akhir Pendaftaran: <strong>15 Januari 2026</strong></li><li>Pengumuman Dosen Pembimbing: 25 Januari 2026</li><li>Mulai Pelaksanaan KP: 1 Februari 2026</li></ul>\n\n' +
                 'Pastikan semua dokumen persyaratan telah diunggah di sistem. Kontak bagian akademik jika ada kendala. Terima kasih!',
        created_at: '2025-12-01T10:00:00Z',
    },
    {
        id: 2,
        title: 'Revisi Prosedur Pengajuan Surat Izin ke Perusahaan',
        content: 'Telah terjadi revisi minor pada alur pengajuan surat izin ke perusahaan. Sekarang, Anda dapat mengajukan permohonan surat melalui <a href="#" target="_blank">formulir online</a> ini tanpa perlu datang ke kampus. Sistem akan memproses surat dalam 3x24 jam kerja.',
        created_at: '2025-11-25T10:00:00Z',
    },
    {
        id: 3,
        title: 'Workshop Penulisan Laporan Ilmiah (Wajib KP)',
        content: 'Diwajibkan bagi seluruh mahasiswa yang akan atau sedang melaksanakan KP untuk mengikuti Workshop Penulisan Laporan Ilmiah. Acara akan dilaksanakan pada:\n\n' +
                 '<ol><li>Tanggal: Sabtu, 10 Desember 2025</li><li>Waktu: 09.00 - 12.00 WIB</li><li>Tempat: Ruang Auditorium A</li></ol>\n\n' +
                 'Absensi akan dicatat sebagai syarat kelulusan KP.',
        created_at: '2025-11-15T10:00:00Z',
    },
];

// Definisi Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pedoman & Persyaratan Resmi',
        href: '/info-syarat',
    },
];

// --- KOMPONEN UTAMA ---

export default function GuestInfo({ announcements: receivedAnnouncements, auth }: InfoProps) {
    
    // KRUSIAL: Logika untuk memastikan data dummy muncul
    const currentAnnouncements = 
        (Array.isArray(receivedAnnouncements) && receivedAnnouncements.length > 0)
        ? receivedAnnouncements
        : dummyAnnouncements; 

    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Logika debugging dihilangkan untuk kode bersih
    }, [receivedAnnouncements, currentAnnouncements.length]);

    // Fungsi untuk membuka modal detail
    const openDetail = (ann: Announcement) => {
        setSelectedAnnouncement(ann);
        setIsModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi & Pengumuman" />
            
            {/* Container Utama: Ubah padding agar sesuai GuestDocuments */}
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8 overflow-y-auto">
                
                {/* Header Halaman: Disesuaikan dengan Header Dokumen */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        {/* Menggunakan ikon info sebagai ganti megaphone untuk header utama */}
                        <Info className="h-7 w-7 text-violet-600" />
                        Papan Informasi & Syarat
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Berita terbaru, jadwal akademik, dan syarat penting seputar Kerja Praktik.
                    </p>
                </div>

                {/* Daftar Pengumuman: Menghilangkan max-width container */}
                <div className="space-y-6 w-full">
                    {currentAnnouncements.length > 0 ? currentAnnouncements.map((ann, index) => (
                        <Card 
                            key={ann.id} 
                            // Styling Card: Border kiri ungu, shadow lebih halus, warna background menyesuaikan tema
                            className="overflow-hidden border-l-4 border-l-violet-600 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out group border-muted dark:bg-card"
                        >
                            <CardHeader className="bg-muted/50 pb-3 border-b border-muted dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
                                        <Megaphone className="h-6 w-6 text-violet-600" />
                                        {ann.title}
                                    </CardTitle>
                                    <div className="flex items-center text-xs font-medium text-muted-foreground bg-background px-3 py-1 rounded-full border shadow-sm flex-shrink-0 dark:border-border">
                                        <Calendar className="h-3 w-3 mr-1.5 text-violet-500" />
                                        {formatDate(ann.created_at)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="prose dark:prose-invert max-w-none">
                                    <div 
                                        className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-base line-clamp-3 [&_a]:text-blue-600 [&_a]:underline"
                                        dangerouslySetInnerHTML={{ __html: ann.content }}
                                    />
                                </div>
                                {/* Tombol Baca Selengkapnya */}
                                <div className="mt-4 flex justify-end">
                                    <Button 
                                        variant="ghost" // Menggunakan ghost untuk tampilan lebih minimal
                                        size="sm" 
                                        className="text-violet-600 hover:bg-violet-50/50 hover:text-violet-700 dark:hover:bg-violet-900/30 dark:text-violet-400 dark:hover:text-violet-300 shadow-none"
                                        onClick={() => openDetail(ann)}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        Baca Selengkapnya
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        // Placeholder jika tidak ada pengumuman
                        <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-border bg-card/30">
                            <div className="bg-muted p-4 rounded-full mb-4">
                                <Megaphone className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">Belum ada pengumuman</h3>
                            <p className="text-muted-foreground mt-1">Informasi terbaru akan segera dipublikasikan di halaman ini.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail Pengumuman */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-card">
                    {selectedAnnouncement && (
                        <div>
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-2 text-violet-600">
                                    <Megaphone className="h-5 w-5" />
                                    <span className="text-sm font-semibold uppercase tracking-wider">Pengumuman Resmi</span>
                                </div>
                                <DialogTitle className="text-2xl font-bold leading-tight text-foreground">
                                    {selectedAnnouncement.title}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-2 mt-2 pt-2 border-t dark:border-border text-muted-foreground">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    Diterbitkan pada: {formatDate(selectedAnnouncement.created_at)}
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="mt-6 space-y-4">
                                {/* Render HTML di Modal (Dengan formatting yang lengkap) */}
                                <div 
                                    className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-base text-foreground [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
                                    dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
                                />
                            </div>

                            <div className="mt-8 flex justify-end pt-4 border-t dark:border-border">
                                <Button onClick={() => setIsModalOpen(false)} className="bg-violet-600 hover:bg-violet-700">Tutup</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
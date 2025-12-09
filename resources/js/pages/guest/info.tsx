import { Head } from '@inertiajs/react';
import { 
    Megaphone, 
    Calendar, 
    Info, 
    Eye, 
    Clock, 
    BookOpen, 
    CheckCircle2, 
    FileSpreadsheet, 
    GraduationCap
} from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout'; 
import { type BreadcrumbItem } from '@/types';

// --- TIPE DATA & INTERFACE ---

interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface StaticGuide {
    id: number;
    title: string;
    icon: any;
    color: string;
    description: string;
    details: string; // HTML content untuk modal
}

interface InfoProps {
    announcements: Announcement[];
    auth: { user: any };
}

// --- DATA STATIS (INFORMASI & PANDUAN) ---
const staticGuides: StaticGuide[] = [
    {
        id: 1,
        title: 'Syarat Akademik KP',
        icon: GraduationCap,
        color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
        description: 'Persyaratan SKS dan IPK minimum untuk mengambil mata kuliah KP.',
        details: `
            <div class="space-y-4">
                <div class="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                    <span class="text-2xl">🎓</span>
                    <div>
                        <h4 class="font-bold text-purple-700 dark:text-purple-300">Kualifikasi Mahasiswa</h4>
                        <p class="text-sm text-muted-foreground">Pastikan Anda memenuhi kriteria berikut sebelum mendaftar.</p>
                    </div>
                </div>
                <ul class="list-disc pl-5 space-y-2 text-foreground">
                    <li>Mahasiswa aktif <strong>Semester 5</strong> atau lebih.</li>
                    <li>Telah menempuh minimal <strong>70 SKS</strong> (Satuan Kredit Semester) tanpa nilai E.</li>
                    <li>Indeks Prestasi Kumulatif (IPK) minimal <strong>2.00</strong>.</li>
                    <li>Status Mahasiswa Aktif (Tidak sedang Cuti Akademik).</li>
                </ul>
                <div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400 text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Catatan:</strong> KP harus diseminarkan untuk mendapatkan nilai akhir.
                </div>
            </div>
        `
    },
    {
        id: 2,
        title: 'Alur dan Dokumen yang Perlu Dipersiapkan',
        icon: CheckCircle2,
        color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
        description: 'Langkah-langkah mulai dari pengajuan proposal hingga plotting dosen.',
        details: `
            <div class="space-y-6">
                <div>
                    <h3 class="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                        🚀 Alur Pendaftaran
                    </h3>
                    <ol class="relative border-l border-emerald-200 dark:border-emerald-800 ml-3 space-y-8">
                        
                        <li class="ml-6">
                            <span class="absolute flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-950 dark:bg-emerald-900">
                                <span class="text-xs font-bold text-emerald-600">1</span>
                            </span>
                            <h4 class="font-bold text-foreground">Pengajuan Usulan dan Balancing Dosen</h4>
                            <p class="text-sm text-muted-foreground mt-1 mb-2">Mahasiswa mencari instansi, lalu mengisi form usulan. Koordinator akan melakukan Balancing untuk Pembagian Dosen Pembimbing.</p>
                            <a href="/documents" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-200 hover:bg-emerald-100 transition-colors dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                                📄 Unduh Form Usulan
                            </a>
                        </li>

                        <li class="ml-6">
                            <span class="absolute flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-950 dark:bg-emerald-900">
                                <span class="text-xs font-bold text-emerald-600">2</span>
                            </span>
                            <h4 class="font-bold text-foreground">Surat Pengantar dan Pendaftaran Resmi</h4>
                            <p class="text-sm text-muted-foreground mt-1 mb-2">Setelah mendapatkan dosen pembimbing, minta tanda tangan persetujuan dan urus surat ke Fakultas.</p>
                            <a href="/documents" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-200 hover:bg-emerald-100 transition-colors dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                                📄 Unduh Template Surat
                            </a>
                        </li>

                        <li class="ml-6">
                            <span class="absolute flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-950 dark:bg-emerald-900">
                                <span class="text-xs font-bold text-emerald-600">3</span>
                            </span>
                            <h4 class="font-bold text-foreground">Monitoring dan Logbook</h4>
                            <p class="text-sm text-muted-foreground mt-1 mb-2">Jika KP dilakukan saat masa kuliah aktif, wajib lapor absensi dan mengisi logbook harian/mingguan.</p>
                            <a href="/documents" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-200 hover:bg-emerald-100 transition-colors dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                                📄 Unduh Logbook & Absensi
                            </a>
                        </li>

                        <li class="ml-6">
                            <span class="absolute flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-950 dark:bg-emerald-900">
                                <span class="text-xs font-bold text-emerald-600">4</span>
                            </span>
                            <h4 class="font-bold text-foreground">Seminar KP dan Pemberkasan</h4>
                            <p class="text-sm text-muted-foreground mt-1 mb-2">Seminar dilakukan setelah Laporan dan Makalah disetujui oleh Dosen Pembimbing.</p>
                            <a href="/documents" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-200 hover:bg-emerald-100 transition-colors dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                                📄 Unduh Syarat Seminar
                            </a>
                        </li>
                    </ol>
                </div>
            </div>
        `
    },
    {
        id: 3,
        title: 'Ketentuan Laporan',
        icon: FileSpreadsheet,
        color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
        description: 'Format penulisan, logbook mingguan, dan batas waktu pengumpulan.',
        details: `
            <div class="space-y-4">
                 <div class="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800 mb-4">
                    <span class="text-2xl">📝</span>
                    <div>
                        <h4 class="font-bold text-orange-700 dark:text-orange-300">Administrasi Laporan</h4>
                        <p class="text-sm text-muted-foreground">Ketentuan teknis penyusunan laporan akhir.</p>
                    </div>
                </div>
                <h3 class="font-bold text-lg mb-2">Pedoman Utama</h3>
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Logbook Mingguan:</strong> Wajib diisi di SiKP minimal 4 minggu kegiatan.</li>
                    <li><strong>Format:</strong> Font Times New Roman 12, Spasi 1.5, Kertas A4 (Margin 4-3-3-3).</li>
                    <li><strong>Bimbingan:</strong> Asistensi dengan Dosen Pembimbing.</li>
                    <li><strong>Deadline:</strong> Laporan dikumpulkan maksimal 3 bulan setelah KP selesai.</li>
                </ul>
            </div>
        `
    },
];

// --- DUMMY DATA PENGUMUMAN ---
const dummyAnnouncements: Announcement[] = [
    {
        id: 1,
        title: 'Pembukaan Pendaftaran KP Periode Ganjil 2025/2026',
        content: 'Pendaftaran Kerja Praktik untuk semester depan telah dibuka. Mahasiswa diharapkan segera melengkapi berkas prasyarat sebelum tanggal <strong>15 Januari 2026</strong>.',
        created_at: '2025-12-01T08:00:00Z',
    },
    {
        id: 2,
        title: 'Jadwal Sosialisasi & Coaching Clinic',
        content: 'Akan diadakan sesi tanya jawab terkait prosedur KP baru di Ruang Sidang Utama pada hari Jumat, 10 Desember 2025 pukul 13.00 WIB.',
        created_at: '2025-11-28T14:00:00Z',
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Info & Panduan',
        href: '/info',
    },
];

export default function GuestInfo({ announcements: receivedAnnouncements, auth }: InfoProps) {
    
    // Logika Data: Gunakan data dari server jika ada, jika tidak gunakan dummy
    const currentAnnouncements = 
        (Array.isArray(receivedAnnouncements) && receivedAnnouncements.length > 0)
        ? receivedAnnouncements 
        : dummyAnnouncements; 

    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState<StaticGuide | null>(null);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

    // Handlers
    const openAnnouncement = (ann: Announcement) => {
        setSelectedAnnouncement(ann);
        setIsAnnModalOpen(true);
    };

    const openGuide = (guide: StaticGuide) => {
        setSelectedGuide(guide);
        setIsGuideModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi & Panduan" />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 md:p-8 overflow-y-auto">
                
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                       <Info className="h-8 w-8 text-violet-600" /> Pusat Informasi
                    </h1>
                    <p className="text-muted-foreground text-lg mt-2 max-w-3xl">
                        Panduan lengkap prosedur Kerja Praktik, syarat akademik, dan pengumuman terbaru dari prodi.
                    </p>
                </div>

                <div className="flex flex-col gap-10">
                    
                    {/* SECTION 1: PANDUAN STATIS (GRID LAYOUT) */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-violet-500" />
                                Panduan & Persyaratan
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {staticGuides.map((guide) => (
                                <Card 
                                    key={guide.id} 
                                    className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-violet-500 cursor-pointer group h-full" 
                                    onClick={() => openGuide(guide)}
                                >
                                    <CardHeader className="pb-2 flex flex-row items-center gap-4 space-y-0">
                                        <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${guide.color}`}>
                                            <guide.icon className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg leading-tight">{guide.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {guide.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="pt-0 pb-4 mt-auto">
                                        <span className="text-xs font-medium text-violet-600 dark:text-violet-400 flex items-center gap-1 group-hover:underline decoration-violet-600/50 underline-offset-4">
                                            Lihat Detail <Eye className="h-3 w-3" />
                                        </span>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 2: PENGUMUMAN TERBARU (DYNAMIC LIST) */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                <Megaphone className="h-5 w-5 text-red-500" />
                                Pengumuman Terbaru
                            </h2>
                            <Badge variant="outline" className="px-3 py-1">
                                {currentAnnouncements.length} Berita
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {currentAnnouncements.map((ann) => (
                                <Card key={ann.id} className="group overflow-hidden hover:border-violet-300 dark:hover:border-violet-800 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 sm:p-6">
                                        {/* Date Badge */}
                                        <div className="flex-shrink-0 flex flex-row md:flex-col items-center gap-2 md:gap-1 bg-muted/50 p-2 md:p-3 rounded-lg border min-w-[100px] justify-center text-center">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs font-semibold text-foreground">
                                                {formatDate(ann.created_at)}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow min-w-0 space-y-1">
                                            <h3 className="text-lg font-semibold group-hover:text-violet-600 transition-colors">
                                                {ann.title}
                                            </h3>
                                            <div 
                                                className="text-sm text-muted-foreground line-clamp-2"
                                                dangerouslySetInnerHTML={{ __html: ann.content }}
                                            />
                                        </div>

                                        {/* Action */}
                                        <div className="flex-shrink-0 pt-2 md:pt-0">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full md:w-auto hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-900/20"
                                                onClick={() => openAnnouncement(ann)}
                                            >
                                                Baca
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Modal Panduan Statis */}
            <Dialog open={isGuideModalOpen} onOpenChange={setIsGuideModalOpen}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                    {selectedGuide && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${selectedGuide.color}`}>
                                        <selectedGuide.icon className="h-5 w-5" />
                                    </div>
                                    <DialogTitle>{selectedGuide.title}</DialogTitle>
                                </div>
                            </DialogHeader>
                            <div className="py-2 text-sm text-foreground">
                                {/* HTML Content Rendered Here */}
                                <div 
                                    className="prose dark:prose-invert max-w-none prose-sm prose-ul:list-disc prose-ol:list-decimal"
                                    dangerouslySetInnerHTML={{ __html: selectedGuide.details }} 
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setIsGuideModalOpen(false)}>Tutup</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Pengumuman */}
            <Dialog open={isAnnModalOpen} onOpenChange={setIsAnnModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                    {selectedAnnouncement && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl">{selectedAnnouncement.title}</DialogTitle>
                                <DialogDescription className="flex items-center gap-2 pt-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    Diposting pada {formatDate(selectedAnnouncement.created_at)}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <div 
                                    className="prose dark:prose-invert text-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }} 
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setIsAnnModalOpen(false)}>Tutup</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}
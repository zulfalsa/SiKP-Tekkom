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
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout'; 
import { type BreadcrumbItem } from '@/types';

// Interface untuk data pengumuman
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

// Definisi Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Info & Syarat',
        href: '/info-syarat',
    },
];

export default function GuestInfo({ announcements = [], auth }: InfoProps) {
    // State untuk menyimpan pengumuman yang sedang dipilih untuk ditampilkan di modal
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fungsi untuk membuka modal detail
    const openDetail = (ann: Announcement) => {
        setSelectedAnnouncement(ann);
        setIsModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi & Pengumuman" />
            
            {/* Container Utama */}
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6 overflow-y-auto">
                
                {/* Header Halaman */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-sidebar-foreground">
                            Papan Informasi
                        </h1>
                        <p className="text-muted-foreground">
                            Berita terbaru dan informasi penting seputar Kerja Praktik.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl w-full mx-auto space-y-6">
                    {announcements.length > 0 ? announcements.map((ann) => (
                        <Card key={ann.id} className="overflow-hidden border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow group">
                            <CardHeader className="bg-orange-50/50 dark:bg-orange-900/10 pb-3 border-b border-orange-100 dark:border-orange-900/30">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <CardTitle className="text-xl text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                        <Megaphone className="h-5 w-5 text-orange-600" />
                                        {ann.title}
                                    </CardTitle>
                                    <div className="flex items-center text-xs font-medium text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border shadow-sm">
                                        <Calendar className="h-3 w-3 mr-1.5" />
                                        {new Date(ann.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 relative">
                                <div className="prose dark:prose-invert max-w-none">
                                    {/* PERUBAHAN: Render HTML, bukan text biasa */}
                                    <div 
                                        className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed text-base line-clamp-3 [&_a]:text-blue-600 [&_a]:underline"
                                        dangerouslySetInnerHTML={{ __html: ann.content }}
                                    />
                                </div>
                                {/* Tombol Baca Selengkapnya */}
                                <div className="mt-4 flex justify-end">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-900/50 dark:hover:bg-orange-900/20"
                                        onClick={() => openDetail(ann)}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        Baca Selengkapnya
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-dashed shadow-sm">
                            <div className="bg-muted p-4 rounded-full mb-4">
                                <Megaphone className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">Belum ada pengumuman</h3>
                            <p className="text-muted-foreground mt-1">Informasi terbaru akan muncul di halaman ini.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail Pengumuman */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    {selectedAnnouncement && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-2 text-orange-600">
                                    <Megaphone className="h-5 w-5" />
                                    <span className="text-sm font-semibold uppercase tracking-wider">Pengumuman</span>
                                </div>
                                <DialogTitle className="text-2xl font-bold leading-tight">
                                    {selectedAnnouncement.title}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-2 mt-2 pt-2 border-t">
                                    <Calendar className="h-4 w-4" />
                                    Diterbitkan pada: {new Date(selectedAnnouncement.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="mt-6 space-y-4">
                                {/* PERUBAHAN: Render HTML di Modal */}
                                <div 
                                    className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-base text-foreground [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
                                    dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
                                />
                            </div>

                            <div className="mt-8 flex justify-end pt-4 border-t">
                                <Button onClick={() => setIsModalOpen(false)}>Tutup</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
import { Head, Link } from '@inertiajs/react';
import { Megaphone, Home, Calendar, Info, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            <Head title="Informasi & Pengumuman" />
            
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b p-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="font-bold text-xl flex items-center gap-2 text-gray-800 dark:text-white">
                        <Info className="h-6 w-6 text-orange-600" />
                        Papan Informasi
                    </h1>
                    <Link href="/">
                        <Button variant="ghost" size="sm"><Home className="mr-2 h-4 w-4"/> Beranda</Button>
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 p-6">
                <div className="space-y-6">
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
                                    {/* Tampilkan cuplikan konten (maks 3 baris) */}
                                    <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed text-base line-clamp-3">
                                        {ann.content}
                                    </p>
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
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed shadow-sm">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <Megaphone className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Belum ada pengumuman</h3>
                            <p className="text-gray-500 mt-1">Informasi terbaru akan muncul di halaman ini.</p>
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
                                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {selectedAnnouncement.title}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-2 mt-2 pt-2 border-t">
                                    <Calendar className="h-4 w-4" />
                                    Diterbitkan pada: {new Date(selectedAnnouncement.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="mt-6 space-y-4">
                                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                                    {selectedAnnouncement.content}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end pt-4 border-t">
                                <Button onClick={() => setIsModalOpen(false)}>Tutup</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
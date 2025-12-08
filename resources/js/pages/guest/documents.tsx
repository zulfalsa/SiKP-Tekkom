import { Head } from '@inertiajs/react';
import { FileText, Download, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout'; // Import Layout
import { type BreadcrumbItem } from '@/types';

// Interface LinkData
interface LinkData {
    id: number;
    title: string;
    url: string;
}

interface DocumentProps {
    documents: any[];
    links: LinkData[];
    auth: { user: any };
}

// Definisi Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dokumen Publik',
        href: '/dokumen',
    },
];

export default function GuestDocuments({ documents = [], links = [], auth }: DocumentProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dokumen & Berkas" />

            {/* Container Utama */}
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6 overflow-y-auto">
                
                {/* Header Halaman */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-sidebar-foreground">
                            Pusat Unduhan
                        </h1>
                        <p className="text-muted-foreground">
                            Unduh berkas resmi dan akses tautan penting untuk keperluan Kerja Praktik.
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl w-full space-y-8 mx-auto">
                    {/* Dokumen Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <FileText className="h-6 w-6 text-blue-600" /> Dokumen Resmi
                            </CardTitle>
                            <CardDescription>Template laporan, surat pengantar, dan form penilaian.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {documents && documents.length > 0 ? documents.map((doc) => (
                                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors gap-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{doc.title}</h3>
                                        {doc.description && <p className="text-sm text-muted-foreground mb-1">{doc.description}</p>}
                                        <p className="text-xs text-muted-foreground">Diupload: {new Date(doc.created_at).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    <a href={`/dokumen/download/${doc.id}`} target="_blank" rel="noreferrer">
                                        <Button size="sm" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                                            <Download className="mr-2 h-4 w-4"/> Unduh
                                        </Button>
                                    </a>
                                </div>
                            )) : (
                                <div className="text-center py-12 border border-dashed rounded-lg">
                                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">Belum ada dokumen yang tersedia saat ini.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Link Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <LinkIcon className="h-6 w-6 text-green-600" /> Tautan Eksternal
                            </CardTitle>
                            <CardDescription>Shortcut ke Google Form, Grup WA, dan sumber daya online lainnya.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {links && links.length > 0 ? links.map((link) => (
                                <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-full text-green-600 dark:text-green-400">
                                            <LinkIcon className="h-5 w-5" />
                                        </div>
                                        <span className="font-medium text-lg">{link.title}</span>
                                    </div>
                                    <a 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center px-4 py-2 rounded-md hover:bg-accent"
                                    >
                                        Buka <span className="hidden sm:inline ml-1">Tautan</span> &rarr;
                                    </a>
                                </div>
                            )) : (
                                <div className="text-center py-8 border border-dashed rounded-lg">
                                    <LinkIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">Belum ada tautan tersedia.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

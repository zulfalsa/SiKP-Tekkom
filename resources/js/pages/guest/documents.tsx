import { Head, Link } from '@inertiajs/react';
import { FileText, Download, Link as LinkIcon, Home, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DocumentProps {
    documents: any[];
    links: any[];
    auth: { user: any };
}

export default function GuestDocuments({ documents = [], links = [], auth }: DocumentProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            <Head title="Dokumen & Berkas" />
            
            {/* Header / Navbar Sederhana */}
            <div className="bg-white dark:bg-gray-800 border-b p-4 shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="font-bold text-xl flex items-center gap-2 text-gray-800 dark:text-white">
                        <FileIcon className="h-6 w-6 text-blue-600" />
                        SiKP Tekkom
                    </h1>
                    <Link href="/">
                        <Button variant="ghost" size="sm"><Home className="mr-2 h-4 w-4"/> Beranda</Button>
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 p-6">
                <div className="text-center py-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Pusat Unduhan</h1>
                    <p className="text-gray-500 mt-2">Unduh berkas resmi dan akses tautan penting untuk keperluan Kerja Praktik.</p>
                </div>

                {/* Dokumen Section */}
                <Card className="shadow-md border-0 ring-1 ring-gray-200 dark:ring-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <FileText className="h-6 w-6 text-blue-600" /> Dokumen Resmi
                        </CardTitle>
                        <CardDescription>Template laporan, surat pengantar, dan form penilaian.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {documents && documents.length > 0 ? documents.map((doc) => (
                            <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:border-blue-300 transition-colors gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{doc.title}</h3>
                                    {doc.description && <p className="text-sm text-gray-500 mb-1">{doc.description}</p>}
                                    <p className="text-xs text-gray-400">Diupload: {new Date(doc.created_at).toLocaleDateString('id-ID')}</p>
                                </div>
                                <a href={`/dokumen/download/${doc.id}`} target="_blank" rel="noreferrer">
                                    <Button size="sm" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                                        <Download className="mr-2 h-4 w-4"/> Unduh
                                    </Button>
                                </a>
                            </div>
                        )) : (
                            <div className="text-center py-12 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500">Belum ada dokumen yang tersedia saat ini.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Link Section */}
                <Card className="shadow-md border-0 ring-1 ring-gray-200 dark:ring-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <LinkIcon className="h-6 w-6 text-green-600" /> Tautan Eksternal
                        </CardTitle>
                        <CardDescription>Shortcut ke Google Form, Grup WA, dll.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {links && links.length > 0 ? links.map((link) => (
                            <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:border-green-300 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-full text-green-600 dark:text-green-400">
                                        <LinkIcon className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-gray-800 dark:text-white text-lg">{link.title}</span>
                                </div>
                                <a 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-md hover:bg-blue-100"
                                >
                                    Buka <span className="hidden sm:inline ml-1">Tautan</span> &rarr;
                                </a>
                            </div>
                        )) : (
                            <div className="text-center py-8 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <LinkIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500">Belum ada tautan tersedia.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
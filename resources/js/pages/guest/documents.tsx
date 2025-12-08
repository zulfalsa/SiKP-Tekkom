import { Head } from '@inertiajs/react';
import { 
    FileText, 
    Download, 
    Link as LinkIcon, 
    Calendar, 
    ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
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

//
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

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8 overflow-y-auto">
                
                {/* Header Halaman */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Pusat Unduhan
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Unduh berkas resmi dan akses tautan penting untuk keperluan Kerja Praktik.
                    </p>
                </div>

                <div className="space-y-10 w-full">
                    
                    {/* SECTION 1: DOKUMEN RESMI */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground">Dokumen Resmi</h2>
                        </div>

                        {documents && documents.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {documents.map((doc) => (
                                    <Card key={doc.id} className="flex flex-col hover:shadow-lg transition-all duration-300 group border-muted">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    Resmi
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg font-bold leading-tight line-clamp-2 min-h-[3rem]">
                                                {doc.title}
                                            </CardTitle>
                                        </CardHeader>
                                        
                                        <CardContent className="flex-grow pb-2">
                                            {doc.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {doc.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>
                                                    {new Date(doc.created_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pt-2">
                                            <a 
                                                href={`/dokumen/download/${doc.id}`} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="w-full"
                                            >
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2">
                                                    <Download className="h-4 w-4" />
                                                    Unduh Berkas
                                                </Button>
                                            </a>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
                                <div className="p-4 bg-muted rounded-full mb-3">
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground font-medium">Belum ada dokumen yang tersedia.</p>
                            </div>
                        )}
                    </section>

                    {/* SECTION 2: TAUTAN EKSTERNAL */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <LinkIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground">Tautan Eksternal</h2>
                        </div>

                        {links && links.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {links.map((link) => (
                                    <Card key={link.id} className="flex flex-col hover:shadow-lg transition-all duration-300 group border-muted">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="p-2.5 bg-green-50 dark:bg-green-950/50 rounded-xl text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                                                    <LinkIcon className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <CardTitle className="text-lg font-bold leading-tight">
                                                {link.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-muted-foreground">
                                                Akses tautan langsung ke sumber daya eksternal terkait.
                                            </p>
                                        </CardContent>

                                        <CardFooter className="pt-2">
                                            <a 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="w-full"
                                            >
                                                <Button variant="outline" className="w-full hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 group-hover:border-green-200 gap-2">
                                                    Buka Tautan <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            </a>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
                                <div className="p-4 bg-muted rounded-full mb-3">
                                    <LinkIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground font-medium">Belum ada tautan tersedia.</p>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </AppLayout>
    );
}
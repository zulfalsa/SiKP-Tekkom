import { useState, type FormEventHandler } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2, FileText, Megaphone, Link as LinkIcon, Download, Pencil } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; 
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';

// Interface untuk Props yang dikirim dari Controller
interface DashboardProps {
    documents: Array<{
        id: number;
        title: string;
        description: string | null;
        file_path: string;
        created_at: string;
    }>;
    announcements: Array<{
        id: number;
        title: string;
        content: string;
        created_at: string;
    }>;
    links: Array<{
        id: number;
        title: string;
        url: string;
    }>;
}

// Interface Helper
interface Document { id: number; title: string; description: string | null; file_path: string; created_at: string; }
interface Announcement { id: number; title: string; content: string; created_at: string; }
interface Link { id: number; title: string; url: string; }

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

export default function Dashboard({ documents = [], announcements = [], links = [] }: DashboardProps) {
    
    // --- STATE MANAGEMENT ---
    const [docOpen, setDocOpen] = useState(false);
    const [annOpen, setAnnOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);

    // State untuk menyimpan item yang sedang diedit
    const [editingDoc, setEditingDoc] = useState<Document | null>(null);
    const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
    const [editingLink, setEditingLink] = useState<Link | null>(null);

    // --- FORMS ---

    // 1. Dokumen Form
    // Tambahkan _method: 'POST' secara default. Nanti diubah jadi 'PUT' saat edit agar support file upload.
    const docForm = useForm({ 
        title: '', 
        description: '', 
        file: null as File | null, 
        _method: 'POST' 
    });

    // 2. Pengumuman Form
    const annForm = useForm({ title: '', content: '' });

    // 3. Link Form
    const linkForm = useForm({ title: '', url: '' });

    // --- OPEN/CLOSE HELPERS ---

    // Dokumen Helpers
    const openCreateDoc = () => {
        setEditingDoc(null);
        docForm.reset();
        docForm.setData({ title: '', description: '', file: null, _method: 'POST' });
        setDocOpen(true);
    };

    const openEditDoc = (doc: Document) => {
        setEditingDoc(doc);
        docForm.setData({
            title: doc.title,
            description: doc.description || '',
            file: null,
            _method: 'PUT' // Penting untuk update file di Laravel via POST
        });
        setDocOpen(true);
    };

    // Pengumuman Helpers
    const openCreateAnn = () => {
        setEditingAnn(null);
        annForm.reset();
        setAnnOpen(true);
    };

    const openEditAnn = (ann: Announcement) => {
        setEditingAnn(ann);
        annForm.setData({ title: ann.title, content: ann.content });
        setAnnOpen(true);
    };

    // Link Helpers
    const openCreateLink = () => {
        setEditingLink(null);
        linkForm.reset();
        setLinkOpen(true);
    };

    const openEditLink = (link: Link) => {
        setEditingLink(link);
        linkForm.setData({ title: link.title, url: link.url });
        setLinkOpen(true);
    };

    // --- SUBMIT HANDLERS ---

    const submitDoc: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (editingDoc) {
            // URL Edit: /admin/documents/{id}
            // Kita pakai POST + _method: PUT karena FormData (file upload) tidak native support PUT di browser
            docForm.post(`/admin/documents/${editingDoc.id}`, {
                onSuccess: () => { docForm.reset(); setDocOpen(false); },
                forceFormData: true,
            });
        } else {
            // URL Create: /admin/documents
            docForm.post('/admin/documents', {
                onSuccess: () => { docForm.reset(); setDocOpen(false); },
            });
        }
    };

    const submitAnn: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (editingAnn) {
            // URL Edit: /admin/announcements/{id}
            annForm.put(`/admin/announcements/${editingAnn.id}`, {
                onSuccess: () => { annForm.reset(); setAnnOpen(false); },
            });
        } else {
            // URL Create: /admin/announcements
            annForm.post('/admin/announcements', {
                onSuccess: () => { annForm.reset(); setAnnOpen(false); },
            });
        }
    };

    const submitLink: FormEventHandler = (e) => {
        e.preventDefault();

        if (editingLink) {
            // URL Edit: /admin/links/{id}
            linkForm.put(`/admin/links/${editingLink.id}`, {
                onSuccess: () => { linkForm.reset(); setLinkOpen(false); },
            });
        } else {
            // URL Create: /admin/links
            linkForm.post('/admin/links', {
                onSuccess: () => { linkForm.reset(); setLinkOpen(false); },
            });
        }
    };

    // Fungsi Hapus Universal
    const deleteItem = (url: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Koordinator" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-sidebar-foreground">
                            Panel Kontrol Koordinator
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola dokumen, informasi, dan tautan penting untuk mahasiswa.
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="documents" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="documents">Dokumen</TabsTrigger>
                        <TabsTrigger value="announcements">Pengumuman</TabsTrigger>
                        <TabsTrigger value="links">Link Eksternal</TabsTrigger>
                    </TabsList>

                    {/* --- TAB CONTENT: DOKUMEN --- */}
                    <TabsContent value="documents" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Repositori Dokumen</CardTitle>
                                    <CardDescription>
                                        Upload template proposal, logbook, dan form penilaian.
                                    </CardDescription>
                                </div>
                                <Dialog open={docOpen} onOpenChange={setDocOpen}>
                                    <DialogTrigger asChild>
                                        {/* Ganti onClick standard dengan handler khusus */}
                                        <Button 
                                            className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                                            onClick={openCreateDoc}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Upload
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingDoc ? 'Edit Dokumen' : 'Upload Dokumen Baru'}</DialogTitle>
                                            <DialogDescription>
                                                File akan tersedia untuk didownload oleh mahasiswa.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={submitDoc} className="space-y-4 mt-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="doc-title">Judul Dokumen</Label>
                                                <Input 
                                                    id="doc-title"
                                                    placeholder="Contoh: Template Proposal KP"
                                                    value={docForm.data.title} 
                                                    onChange={e => docForm.setData('title', e.target.value)} 
                                                    required 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="doc-desc">Deskripsi (Opsional)</Label>
                                                <Input 
                                                    id="doc-desc"
                                                    placeholder="Keterangan singkat..."
                                                    value={docForm.data.description || ''} 
                                                    onChange={e => docForm.setData('description', e.target.value)} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="doc-file">
                                                    File (PDF/DOCX/XLSX - Max 5MB)
                                                    {editingDoc && <span className="text-xs text-muted-foreground ml-2">(Biarkan kosong jika tidak diganti)</span>}
                                                </Label>
                                                <Input 
                                                    id="doc-file"
                                                    type="file" 
                                                    onChange={e => docForm.setData('file', e.target.files ? e.target.files[0] : null)} 
                                                    required={!editingDoc} // Wajib hanya jika create baru
                                                />
                                                {docForm.errors.file && <p className="text-sm text-red-500">{docForm.errors.file}</p>}
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <Button type="submit" disabled={docForm.processing}>
                                                    {docForm.processing ? 'Menyimpan...' : 'Simpan Dokumen'}
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Dokumen</TableHead>
                                            <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documents.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                    Belum ada dokumen yang diunggah.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            documents.map((doc) => (
                                                <TableRow key={doc.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-100 dark:bg-blue-900/30">
                                                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold">{doc.title}</div>
                                                                <div className="text-xs text-muted-foreground md:hidden">
                                                                    {new Date(doc.created_at).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                                        {doc.description || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <a 
                                                                href={`/dokumen/download/${doc.id}`} 
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                            {/* Tombol Edit */}
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-amber-600 hover:bg-amber-100"
                                                                onClick={() => openEditDoc(doc)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            {/* Tombol Hapus */}
                                                            <Button 
                                                                variant="destructive" 
                                                                size="icon" 
                                                                className="h-8 w-8"
                                                                onClick={() => deleteItem(`/admin/documents/${doc.id}`)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB CONTENT: PENGUMUMAN --- */}
                    <TabsContent value="announcements" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Pengumuman & Berita</CardTitle>
                                    <CardDescription>
                                        Informasi timeline KP, jadwal sidang, dan pemberitahuan penting.
                                    </CardDescription>
                                </div>
                                <Dialog open={annOpen} onOpenChange={setAnnOpen}>
                                    <DialogTrigger asChild>
                                        <Button 
                                            className="bg-sidebar-primary text-sidebar-primary-foreground"
                                            onClick={openCreateAnn}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Buat Baru
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingAnn ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</DialogTitle>
                                            <DialogDescription>
                                                Informasi akan langsung tampil di dashboard mahasiswa.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={submitAnn} className="space-y-4 mt-2">
                                            <div className="space-y-2">
                                                <Label>Judul</Label>
                                                <Input 
                                                    value={annForm.data.title} 
                                                    onChange={e => annForm.setData('title', e.target.value)} 
                                                    required 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Isi Pengumuman</Label>
                                                <Textarea
                                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    rows={5}
                                                    value={annForm.data.content} 
                                                    onChange={e => annForm.setData('content', e.target.value)} 
                                                    required 
                                                />
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <Button type="submit" disabled={annForm.processing}>
                                                    {annForm.processing ? 'Menyimpan...' : 'Publikasikan'}
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {announcements.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">Belum ada pengumuman aktif.</div>
                                    ) : (
                                        announcements.map((ann) => (
                                            <div key={ann.id} className="flex flex-col gap-2 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Megaphone className="h-4 w-4 text-orange-500" />
                                                        <h4 className="font-semibold">{ann.title}</h4>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-amber-600 hover:bg-amber-100"
                                                            onClick={() => openEditAnn(ann)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                                                            onClick={() => deleteItem(`/admin/announcements/${ann.id}`)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {ann.content}
                                                </p>
                                                <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                                                    Diposting pada: {new Date(ann.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB CONTENT: LINK EKSTERNAL --- */}
                    <TabsContent value="links" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Link Eksternal</CardTitle>
                                    <CardDescription>
                                        Tautan cepat ke Google Form, Grup WhatsApp, atau website lain.
                                    </CardDescription>
                                </div>
                                <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
                                    <DialogTrigger asChild>
                                        <Button 
                                            className="bg-sidebar-primary text-sidebar-primary-foreground"
                                            onClick={openCreateLink}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Tambah Link
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingLink ? 'Edit Link' : 'Tambah Link Baru'}</DialogTitle>
                                            <DialogDescription>
                                                Isi label dan URL tujuan.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={submitLink} className="space-y-4 mt-2">
                                            <div className="space-y-2">
                                                <Label>Label Link</Label>
                                                <Input 
                                                    placeholder="Contoh: Form Pendaftaran KP"
                                                    value={linkForm.data.title} 
                                                    onChange={e => linkForm.setData('title', e.target.value)} 
                                                    required 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>URL Tujuan</Label>
                                                <Input 
                                                    type="url"
                                                    placeholder="https://..."
                                                    value={linkForm.data.url} 
                                                    onChange={e => linkForm.setData('url', e.target.value)} 
                                                    required 
                                                />
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <Button type="submit" disabled={linkForm.processing}>
                                                    {linkForm.processing ? 'Menyimpan...' : 'Simpan'}
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Label</TableHead>
                                            <TableHead className="hidden md:table-cell">URL</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {links.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                    Belum ada link eksternal.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            links.map((link) => (
                                                <TableRow key={link.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <LinkIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                            {link.title}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate max-w-[300px] block">
                                                            {link.url}
                                                        </a>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-amber-600 hover:bg-amber-100"
                                                                onClick={() => openEditLink(link)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-red-500 hover:bg-red-100"
                                                                onClick={() => deleteItem(`/admin/links/${link.id}`)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
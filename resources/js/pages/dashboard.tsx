import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Download,
    FileText,
    Link as LinkIcon,
    Megaphone,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

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
interface Document {
    id: number;
    title: string;
    description: string | null;
    file_path: string;
    created_at: string;
}
interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
}
interface Link {
    id: number;
    title: string;
    url: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

export default function Dashboard({
    documents = [],
    announcements = [],
    links = [],
}: DashboardProps) {
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
    const docForm = useForm({
        title: '',
        description: '',
        file: null as File | null,
        _method: 'POST',
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
        docForm.setData({
            title: '',
            description: '',
            file: null,
            _method: 'POST',
        });
        setDocOpen(true);
    };

    const openEditDoc = (doc: Document) => {
        setEditingDoc(doc);
        docForm.setData({
            title: doc.title,
            description: doc.description || '',
            file: null,
            _method: 'PUT',
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
            docForm.post(`/admin/documents/${editingDoc.id}`, {
                onSuccess: () => {
                    docForm.reset();
                    setDocOpen(false);
                },
                forceFormData: true,
            });
        } else {
            docForm.post('/admin/documents', {
                onSuccess: () => {
                    docForm.reset();
                    setDocOpen(false);
                },
            });
        }
    };

    const submitAnn: FormEventHandler = (e) => {
        e.preventDefault();

        if (editingAnn) {
            annForm.put(`/admin/announcements/${editingAnn.id}`, {
                onSuccess: () => {
                    annForm.reset();
                    setAnnOpen(false);
                },
            });
        } else {
            annForm.post('/admin/announcements', {
                onSuccess: () => {
                    annForm.reset();
                    setAnnOpen(false);
                },
            });
        }
    };

    const submitLink: FormEventHandler = (e) => {
        e.preventDefault();

        if (editingLink) {
            linkForm.put(`/admin/links/${editingLink.id}`, {
                onSuccess: () => {
                    linkForm.reset();
                    setLinkOpen(false);
                },
            });
        } else {
            linkForm.post('/admin/links', {
                onSuccess: () => {
                    linkForm.reset();
                    setLinkOpen(false);
                },
            });
        }
    };

    // Fungsi Hapus Universal
    const deleteItem = (url: string) => {
        if (
            confirm(
                'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.',
            )
        ) {
            router.delete(url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Koordinator" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-10 bg-[#ECECF4] dark:bg-gray-900 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Panel Kontrol Koordinator
                        </h1>
                        <p className="text-muted-foreground mt-1 text-base">
                            Kelola dokumen, informasi, dan tautan penting untuk
                            mahasiswa di satu tempat.
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="documents" className="w-full space-y-6">
                    <div className="flex justify-center md:justify-start">
                        <TabsList className="bg-white/60 p-1 rounded-xl gap-2 shadow-sm border border-white/20 backdrop-blur-md">
                            <TabsTrigger
                                value="documents"
                                className="data-[state=active]:bg-[#4834d4] data-[state=active]:text-white rounded-lg px-6 py-2.5 font-medium transition-all"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Dokumen
                            </TabsTrigger>
                            <TabsTrigger
                                value="announcements"
                                className="data-[state=active]:bg-[#4834d4] data-[state=active]:text-white rounded-lg px-6 py-2.5 font-medium transition-all"
                            >
                                <Megaphone className="w-4 h-4 mr-2" />
                                Pengumuman
                            </TabsTrigger>
                            <TabsTrigger
                                value="links"
                                className="data-[state=active]:bg-[#4834d4] data-[state=active]:text-white rounded-lg px-6 py-2.5 font-medium transition-all"
                            >
                                <LinkIcon className="w-4 h-4 mr-2" />
                                Link Eksternal
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* --- TAB CONTENT: DOKUMEN --- */}
                    <TabsContent value="documents" className="space-y-4 mt-0">
                        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-bold text-[#4F46E5]">
                                        Repositori Dokumen
                                    </CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Upload template proposal, logbook, dan
                                        form penilaian.
                                    </CardDescription>
                                </div>
                                <Dialog open={docOpen} onOpenChange={setDocOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={openCreateDoc}
                                            className="bg-[#4834d4] hover:bg-[#3c2bb3] text-white shadow-lg shadow-indigo-500/20 rounded-lg h-10 px-6"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />{' '}
                                            Upload
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
                                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-bold text-[#4F46E5]">
                                                    {editingDoc
                                                        ? 'Edit Dokumen'
                                                        : 'Upload Dokumen Baru'}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    File akan tersedia untuk
                                                    didownload oleh mahasiswa.
                                                </DialogDescription>
                                            </DialogHeader>
                                        </div>
                                        <div className="p-6">
                                            <form
                                                onSubmit={submitDoc}
                                                className="space-y-5"
                                            >
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="doc-title"
                                                        className="text-xs uppercase tracking-wider font-semibold text-gray-500"
                                                    >
                                                        Judul Dokumen
                                                    </Label>
                                                    <Input
                                                        id="doc-title"
                                                        placeholder="Contoh: Template Proposal KP"
                                                        value={
                                                            docForm.data.title
                                                        }
                                                        onChange={(e) =>
                                                            docForm.setData(
                                                                'title',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="doc-desc"
                                                        className="text-xs uppercase tracking-wider font-semibold text-gray-500"
                                                    >
                                                        Deskripsi (Opsional)
                                                    </Label>
                                                    <Input
                                                        id="doc-desc"
                                                        placeholder="Keterangan singkat..."
                                                        value={
                                                            docForm.data
                                                                .description ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            docForm.setData(
                                                                'description',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="doc-file"
                                                        className="text-xs uppercase tracking-wider font-semibold text-gray-500"
                                                    >
                                                        File (PDF/DOCX/XLSX -
                                                        Max 5MB)
                                                        {editingDoc && (
                                                            <span className="text-xs text-muted-foreground ml-2 normal-case font-normal">
                                                                (Biarkan kosong
                                                                jika tidak
                                                                diganti)
                                                            </span>
                                                        )}
                                                    </Label>
                                                    <Input
                                                        id="doc-file"
                                                        type="file"
                                                        onChange={(e) =>
                                                            docForm.setData(
                                                                'file',
                                                                e.target
                                                                    .files
                                                                    ? e.target
                                                                          .files[0]
                                                                    : null,
                                                            )
                                                        }
                                                        required={!editingDoc}
                                                        className="cursor-pointer file:text-indigo-600 file:font-bold file:mr-4 h-12 pt-2.5 border-gray-300 rounded-lg"
                                                    />
                                                    {docForm.errors.file && (
                                                        <p className="text-sm text-red-500">
                                                            {
                                                                docForm.errors
                                                                    .file
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex justify-end pt-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            docForm.processing
                                                        }
                                                        className="bg-[#4834d4] hover:bg-[#3c2bb3] text-white font-bold h-12 px-8 rounded-lg shadow-md"
                                                    >
                                                        {docForm.processing
                                                            ? 'Menyimpan...'
                                                            : 'Simpan Dokumen'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b border-gray-100">
                                            <TableHead className="text-[#4F46E5] font-semibold">
                                                Nama Dokumen
                                            </TableHead>
                                            <TableHead className="hidden md:table-cell text-[#4F46E5] font-semibold">
                                                Deskripsi
                                            </TableHead>
                                            <TableHead className="text-right text-[#4F46E5] font-semibold">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documents.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={3}
                                                    className="text-center h-40 text-muted-foreground"
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <div className="bg-gray-100 p-3 rounded-full">
                                                            <FileText className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                        <p>
                                                            Belum ada dokumen
                                                            yang diunggah.
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            documents.map((doc) => (
                                                <TableRow
                                                    key={doc.id}
                                                    className="hover:bg-indigo-50/30 transition-colors border-b border-gray-50"
                                                >
                                                    <TableCell className="font-medium py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100">
                                                                <FileText className="h-5 w-5 text-[#4F46E5]" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-gray-800">
                                                                    {doc.title}
                                                                </div>
                                                                <div className="text-xs text-gray-400 mt-0.5 md:hidden">
                                                                    {new Date(
                                                                        doc.created_at,
                                                                    ).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-gray-500">
                                                        {doc.description || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <a
                                                                href={`/dokumen/download/${doc.id}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-gray-500"
                                                                title="Download"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-600"
                                                                onClick={() =>
                                                                    openEditDoc(
                                                                        doc,
                                                                    )
                                                                }
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"
                                                                onClick={() =>
                                                                    deleteItem(
                                                                        `/admin/documents/${doc.id}`,
                                                                    )
                                                                }
                                                                title="Hapus"
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
                    <TabsContent value="announcements" className="space-y-4 mt-0">
                        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-bold text-[#4F46E5]">
                                        Pengumuman & Berita
                                    </CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Informasi timeline KP, jadwal sidang,
                                        dan pemberitahuan penting.
                                    </CardDescription>
                                </div>
                                <Dialog
                                    open={annOpen}
                                    onOpenChange={setAnnOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={openCreateAnn}
                                            className="bg-[#4834d4] hover:bg-[#3c2bb3] text-white shadow-lg shadow-indigo-500/20 rounded-lg h-10 px-6"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />{' '}
                                            Buat Baru
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[725px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
                                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-bold text-[#4F46E5]">
                                                    {editingAnn
                                                        ? 'Edit Pengumuman'
                                                        : 'Buat Pengumuman Baru'}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Informasi akan langsung
                                                    tampil di dashboard
                                                    mahasiswa.
                                                </DialogDescription>
                                            </DialogHeader>
                                        </div>
                                        <div className="p-6">
                                            <form
                                                onSubmit={submitAnn}
                                                className="space-y-5"
                                            >
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                                        Judul
                                                    </Label>
                                                    <Input
                                                        value={
                                                            annForm.data.title
                                                        }
                                                        onChange={(e) =>
                                                            annForm.setData(
                                                                'title',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                                        Isi Pengumuman
                                                    </Label>
                                                    <div className="border rounded-lg overflow-hidden border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                                                        <RichTextEditor
                                                            value={
                                                                annForm.data
                                                                    .content
                                                            }
                                                            onChange={(
                                                                content,
                                                            ) =>
                                                                annForm.setData(
                                                                    'content',
                                                                    content,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end pt-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            annForm.processing
                                                        }
                                                        className="bg-[#4834d4] hover:bg-[#3c2bb3] text-white font-bold h-12 px-8 rounded-lg shadow-md"
                                                    >
                                                        {annForm.processing
                                                            ? 'Menyimpan...'
                                                            : 'Publikasikan'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="space-y-4">
                                    {announcements.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground flex flex-col items-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                            <Megaphone className="h-8 w-8 text-gray-300 mb-2" />
                                            Belum ada pengumuman aktif.
                                        </div>
                                    ) : (
                                        announcements.map((ann) => (
                                            <div
                                                key={ann.id}
                                                className="group flex flex-col gap-3 rounded-xl border border-gray-100 p-5 hover:border-indigo-200 hover:shadow-md transition-all bg-white"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-orange-100 p-2 rounded-lg">
                                                            <Megaphone className="h-5 w-5 text-orange-600" />
                                                        </div>
                                                        <h4 className="font-bold text-lg text-gray-800 group-hover:text-[#4F46E5] transition-colors">
                                                            {ann.title}
                                                        </h4>
                                                    </div>
                                                    <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-amber-500 hover:bg-amber-50 hover:text-amber-600 rounded-lg"
                                                            onClick={() =>
                                                                openEditAnn(ann)
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                            onClick={() =>
                                                                deleteItem(
                                                                    `/admin/announcements/${ann.id}`,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600 prose dark:prose-invert max-w-none pl-[3.25rem]"
                                                    dangerouslySetInnerHTML={{
                                                        __html: ann.content,
                                                    }}
                                                />
                                                <p className="text-xs text-gray-400 pl-[3.25rem] mt-1 font-medium">
                                                    Diposting pada:{' '}
                                                    {new Date(
                                                        ann.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB CONTENT: LINK EKSTERNAL --- */}
                    <TabsContent value="links" className="space-y-4 mt-0">
                        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-bold text-[#4F46E5]">
                                        Link Eksternal
                                    </CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Tautan cepat ke Google Form, Grup
                                        WhatsApp, atau website lain.
                                    </CardDescription>
                                </div>
                                <Dialog
                                    open={linkOpen}
                                    onOpenChange={setLinkOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={openCreateLink}
                                            className="bg-[#4834d4] hover:bg-[#3c2bb3] text-white shadow-lg shadow-indigo-500/20 rounded-lg h-10 px-6"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />{' '}
                                            Tambah Link
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
                                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-bold text-[#4F46E5]">
                                                    {editingLink
                                                        ? 'Edit Link'
                                                        : 'Tambah Link Baru'}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Isi label dan URL tujuan.
                                                </DialogDescription>
                                            </DialogHeader>
                                        </div>
                                        <div className="p-6">
                                            <form
                                                onSubmit={submitLink}
                                                className="space-y-5"
                                            >
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                                        Label Link
                                                    </Label>
                                                    <Input
                                                        placeholder="Contoh: Form Pendaftaran KP"
                                                        value={
                                                            linkForm.data.title
                                                        }
                                                        onChange={(e) =>
                                                            linkForm.setData(
                                                                'title',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                                        URL Tujuan
                                                    </Label>
                                                    <Input
                                                        type="url"
                                                        placeholder="https://..."
                                                        value={
                                                            linkForm.data.url
                                                        }
                                                        onChange={(e) =>
                                                            linkForm.setData(
                                                                'url',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex justify-end pt-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            linkForm.processing
                                                        }
                                                        className="bg-[#4834d4] hover:bg-[#3c2bb3] text-white font-bold h-12 px-8 rounded-lg shadow-md"
                                                    >
                                                        {linkForm.processing
                                                            ? 'Menyimpan...'
                                                            : 'Simpan'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b border-gray-100">
                                            <TableHead className="text-[#4F46E5] font-semibold">
                                                Label
                                            </TableHead>
                                            <TableHead className="hidden md:table-cell text-[#4F46E5] font-semibold">
                                                URL
                                            </TableHead>
                                            <TableHead className="text-right text-[#4F46E5] font-semibold">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {links.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={3}
                                                    className="text-center h-40 text-muted-foreground"
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <div className="bg-gray-100 p-3 rounded-full">
                                                            <LinkIcon className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                        <p>
                                                            Belum ada link
                                                            eksternal.
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            links.map((link) => (
                                                <TableRow
                                                    key={link.id}
                                                    className="hover:bg-indigo-50/30 transition-colors border-b border-gray-50"
                                                >
                                                    <TableCell className="font-medium py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 border border-green-100">
                                                                <LinkIcon className="h-5 w-5 text-green-600" />
                                                            </div>
                                                            <span className="font-bold text-gray-800">
                                                                {link.title}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <a
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline truncate max-w-[300px] block font-medium"
                                                        >
                                                            {link.url}
                                                        </a>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 rounded-lg hover:bg-amber-50 text-amber-500 hover:text-amber-600"
                                                                onClick={() =>
                                                                    openEditLink(
                                                                        link,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"
                                                                onClick={() =>
                                                                    deleteItem(
                                                                        `/admin/links/${link.id}`,
                                                                    )
                                                                }
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
import { Head } from '@inertiajs/react';
import { FileText, Download, Link as LinkIcon, ExternalLink, Calendar, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import '@/css/chat-assistant.css';

// --- DUMMY DATA ---
interface LinkData {
  id: number;
  title: string;
  url: string;
}

interface DocumentData {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface DocumentProps {
  documents: DocumentData[];
  links: LinkData[];
  auth: { user: any };
}

// Data Dummy Dokumen Resmi
const dummyDocuments: DocumentData[] = [
  { id: 1, title: 'Template Laporan Akhir Kerja Praktik (Word)', description: 'Wajib menggunakan template ini untuk konsistensi format dan layout laporan. Versi terbaru 2024.', created_at: '2025-10-01T10:00:00Z' },
  { id: 2, title: 'Surat Permohonan Izin Kerja Praktik', description: 'Digunakan untuk pengajuan izin resmi ke perusahaan atau instansi terkait. Format PDF.', created_at: '2025-09-15T10:00:00Z' },
  { id: 3, title: 'Formulir Penilaian Pembimbing Lapangan', description: 'Formulir wajib diisi oleh Supervisor di tempat Kerja Praktik Anda. Format Excel.', created_at: '2025-11-05T10:00:00Z' },
  { id: 4, title: 'Panduan Teknis Penulisan Abstrak (Revisi)', description: 'Panduan singkat tentang cara penulisan abstrak yang benar, termasuk kata kunci dan format.', created_at: '2025-11-20T10:00:00Z' },
  { id: 5, title: 'Prosedur Pengajuan Seminar Kerja Praktik', description: 'Langkah-langkah lengkap yang harus diikuti sebelum mendaftar seminar dan sidang.', created_at: '2025-11-25T10:00:00Z' },
  { id: 6, title: 'Daftar Kontak Dosen Pembimbing (Q3 2025)', description: 'Daftar kontak dan jam konsultasi Dosen Pembimbing terbaru per kuartal 3 tahun 2025.', created_at: '2025-12-01T10:00:00Z' },
];

// Data Dummy Tautan Penting
const dummyLinks: LinkData[] = [
  { id: 101, title: 'Pendaftaran Seminar & Sidang KP (Google Form)', url: 'https://forms.google.com/pendaftaran-sidang' },
  { id: 102, title: 'Grup Diskusi WhatsApp Kerja Praktik', url: 'https://chat.whatsapp.com/group-kp-resmi' },
  { id: 103, title: 'Jadwal Penting Akademik (Calendar)', url: 'https://calendar.google.com/akademik-kp' },
];

// Definisi Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dokumen Publik', href: '/dokumen' },
];

// --- KOMPONEN UTAMA (Kini dijamin menggunakan data dummy) ---
export default function GuestDocuments({ auth }: DocumentProps) { // Menerima auth, tapi mengabaikan documents dan links yang masuk
  const documents = dummyDocuments;
  const links = dummyLinks;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dokumen & Berkas" />

      {/* Container Utama */}
      <div className="flex h-full flex-1 flex-col gap-12 p-6 md:p-16 overflow-y-auto bg-white">
        
        {/* Konten Maksimal 7XL */}
        <div className="max-w-7xl w-full mx-auto">
          
          {/* Header Halaman */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 border-b pb-6 border-gray-100">
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                Pusat Sumber Daya
              </h1>
              <p className="text-lg text-gray-500">
                Akses koleksi dokumen resmi dan tautan penting terbaru.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                variant="outline"
                className="text-violet-700 border-violet-300 hover:bg-violet-50 transition-colors shadow-sm"
              >
                Butuh Bantuan?
              </Button>
            </div>
          </div>
          {/* --- */}

          <div className="space-y-12">
            
            {/* Dokumen Section */}
            <section 
              className="transition-all duration-700 delay-100" 
              data-aos="fade-up"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <FileText className="h-6 w-6 text-violet-600"/> Dokumen Resmi
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Template laporan, surat pengantar, dan form penilaian yang wajib diunduh.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Menggunakan 'documents' yang kini adalah 'dummyDocuments' */}
                {documents && documents.length > 0 ? (
                  documents.map((doc) => (
                    <Card 
                      key={doc.id}
                      className="group shadow-md hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 hover:border-violet-300 transform hover:-translate-y-1"
                    >
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <h3 className="font-medium text-base text-gray-900 group-hover:text-violet-700 transition-colors line-clamp-2">
                              {doc.title}
                            </h3>
                            {doc.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{doc.description}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-3">Diperbarui: {new Date(doc.created_at).toLocaleDateString('id-ID')}</p>
                          </div>
                          
                          <a href={`/dokumen/download/${doc.id}`} target="_blank" rel="noreferrer" className="flex-shrink-0">
                            <Button 
                              size="icon" 
                              className="w-10 h-10 bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                              aria-label={`Unduh ${doc.title}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="lg:col-span-3 text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/70">
                    <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <p className="text-base text-gray-500 font-medium">Belum ada dokumen yang tersedia saat ini.</p>
                  </div>
                )}
              </div>
            </section>

            {/* --- */}
            
            {/* Link Section: Tampilan List Elegan */}
            <section 
              className="transition-all duration-700 delay-200"
              data-aos="fade-up"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <LinkIcon className="h-6 w-6 text-violet-600"/> Tautan Penting
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Akses cepat ke formulir eksternal, grup diskusi, dan sumber daya online.
              </p>
              
              <div className="grid gap-3">
                {/* Menggunakan 'links' yang kini adalah 'dummyLinks' */}
                {links && links.length > 0 ? (
                  links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white transition-all duration-300 ease-in-out hover:shadow-md hover:border-violet-300 group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Fungsi Ikon berdasarkan Judul Tautan */}
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-violet-50 text-violet-600 shrink-0 transition-colors duration-300 group-hover:bg-violet-100">
                          {link.title.includes('Jadwal') ? (
                            <Calendar className="h-4 w-4" />
                          ) : link.title.includes('Form') ? (
                            <Code className="h-4 w-4" />
                          ) : (
                            <LinkIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-base text-gray-900 block truncate group-hover:text-violet-700 transition-colors">{link.title}</span>
                          <span className="text-sm text-gray-400 block truncate">{link.url}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-violet-600 font-medium transition-all duration-300 flex-shrink-0 group-hover:gap-3 group-hover:text-violet-700">
                        <span className="hidden sm:inline">Kunjungi</span>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/70">
                    <LinkIcon className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <p className="text-base text-gray-500 font-medium">Belum ada tautan penting yang tersedia.</p>
                  </div>
                )}
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
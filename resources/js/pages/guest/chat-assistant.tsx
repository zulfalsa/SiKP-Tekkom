import { Head, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect, FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type BreadcrumbItem } from '@/types';

const BotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8"/><path d="M22 7.26C22 7 21.74 6.74 21.39 6.58C18.66 5.48 15.65 5 12 5C8.35 5 5.34 5.48 2.61 6.58C2.26 6.74 2 7 2 7.26V18C2 18.5 2.5 19 3 19H21C21.5 19 22 18.5 22 18V7.26Z"/><path d="M6 13C6 14.7 7.3 16 9 16"/><path d="M15 16C16.7 16 18 14.7 18 13"/>
    </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/>
    </svg>
);

const RefreshCwIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12A9 9 0 0 0 6 15L3 12"/><path d="M3 12A9 9 0 0 0 18 9L21 12"/>
    </svg>
);

const Loader2Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
);


interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const initialMessages: Message[] = [
    {
        id: '1',
        role: 'assistant',
        content: 'Halo! Saya asisten virtual SiKP. Ada yang bisa saya bantu mengenai **Kerja Praktik** hari ini? Anda bisa bertanya tentang alur pendaftaran, syarat, atau jadwal sidang.',
        timestamp: new Date(),
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chat Assistant',
        href: '/',
    },
];

const getMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('syarat') || lowerQuery.includes('daftar') || lowerQuery.includes('kapan') || lowerQuery.includes('prasyarat') || lowerQuery.includes('registrasi') || lowerQuery.includes('administrasi')) {
        return (
            "## Syarat dan Waktu Pendaftaran Kerja Praktik (KP)\n\n" +
            "Periode **pendaftaran** KP umumnya dibuka **dua kali setahun** (semester ganjil dan genap). Pastikan Anda memenuhi syarat **prasyarat** berikut:\n\n" +
            "1.  **SKS Minimum**: Telah menempuh minimal **110 SKS**.\n" +
            "2.  **Mata Kuliah Prasyarat**: Lulus semua mata kuliah inti di tahun pertama dan kedua dengan nilai minimal **C**.\n" +
            "3.  **Surat Balasan**: Sudah memiliki Surat Keterangan Diterima dari Instansi/Perusahaan tempat KP.\n" +
            "4.  **IPK**: IPK Kumulatif minimal **2.75** (disarankan).\n\n" +
            "**Langkah Registrasi:**\n" +
            "* Cek **kalender akademik** untuk tanggal pembukaan pendaftaran **resmi**.\n" +
            "* Ajukan permohonan melalui portal SiKP dengan mengunggah semua dokumen **administrasi** pendukung.\n" +
            "* Tunggu pengumuman Dosen Pembimbing yang akan di-**Balancing** oleh **Koordinator KP**."
        );
    }
    
    else if (lowerQuery.includes('alur') || lowerQuery.includes('prosedur') || lowerQuery.includes('tahapan') || lowerQuery.includes('proses') || lowerQuery.includes('mekanisme') || lowerQuery.includes('pelaksanaan')) {
        return (
            "## Alur Pelaksanaan Kerja Praktik (KP)\n\n" +
            "Pelaksanaan KP melibatkan beberapa **tahapan** penting. Berikut adalah ringkasan alurnya:\n\n" +
            "1.  **Pencarian Instansi (Bulan 1)**: Mahasiswa mencari dan mendapatkan surat **Persetujuan Balasan**.\n" +
            "2.  **Pendaftaran SiKP (Bulan 2)**: Mengunggah surat balasan dan dokumen prasyarat di **Portal SiKP**.\n" +
            "3.  **Pembimbingan (Bulan 2-3)**: Dosen Pembimbing ditetapkan, dan mahasiswa mulai **konsultasi laporan**.\n" +
            "4.  **Pelaksanaan KP (Minimal 1 Bulan Penuh)**: Melaksanakan KP di lokasi. Wajib mengisi **jurnal harian** di SiKP.\n" +
            "5.  **Penyelesaian Laporan (Bulan 3)**: **Finalisasi laporan** dan persetujuan dari Dosen Pembimbing.\n" +
            "6.  **Pendaftaran Sidang (Bulan 4)**: Mendaftar **ujian sidang** KP setelah semua **revisi** disetujui.\n\n" +
            "Setiap tahap memiliki *deadline* yang ketat. Selalu ikuti pengumuman resmi dari **Koordinator KP**."
        );
    }
    
    else if (lowerQuery.includes('laporan') || lowerQuery.includes('format') || lowerQuery.includes('dokumen') || lowerQuery.includes('template') || lowerQuery.includes('penulisan') || lowerQuery.includes('hardcopy') || lowerQuery.includes('softcopy')) {
        return (
            "## Pedoman Penulisan Laporan & Dokumen Kelengkapan KP\n\n" +
            "Laporan Kerja Praktik harus disusun berdasarkan **Pedoman KP Terbaru**. \n\n" +
            "**Dokumen Kelengkapan Wajib (Diunggah ke SiKP):**\n" +
            "* Formulir **A1** (Persetujuan Judul/Topik).\n" +
            "* Formulir **A2** (Penetapan Dosen Pembimbing).\n" +
            "* Formulir **B1** (Lembar Konsultasi/Bimbingan).\n" +
            "* Formulir **B2** (Formulir Penilaian Instansi).\n" +
            "* Formulir **B3** (Jurnal Harian/Logbook).\n" +
            "* **Laporan Final** (PDF) yang sudah di-ACC.\n\n" +
            "Semua *template* dan pedoman **penulisan** tersedia di menu **Unduhan Dokumen**."
        );
    }
    
    else if (lowerQuery.includes('sidang') || lowerQuery.includes('presentasi') || lowerQuery.includes('penguji') || lowerQuery.includes('jadwal sidang') || lowerQuery.includes('ujian') || lowerQuery.includes('revisi') || lowerQuery.includes('seminar')) {
        return (
            "## Persiapan dan Syarat Ujian Sidang KP\n\n" +
            "**Ujian Sidang KP/Seminar** adalah tahap akhir untuk mendapatkan nilai akhir KP.\n\n" +
            "**Syarat Wajib Pendaftaran Sidang:**\n" +
            "* Laporan telah di-**ACC** oleh **Dosen Pembimbing**.\n" +
            "* Telah melengkapi dokumen **A1** dan **B1** (Konsultasi).\n" +
            "* Sudah memiliki bukti pembayaran **Kertas Hijau** (biaya sidang).\n" +
            "* Semua **administrasi** lainnya (nilai, pembayaran) telah diselesaikan.\n" +
            "* Waktu **Pelaksanaan KP** (**Minimal 1 bulan**) sudah terpenuhi.\n\n" +
            "Pengumuman **jadwal sidang** (termasuk nama **Dosen Penguji** dan waktu) akan diumumkan minimal **satu minggu** sebelum pelaksanaan."
        );
    }

    else if (lowerQuery.includes('dosen') || lowerQuery.includes('pembimbing') || lowerQuery.includes('konsultasi') || lowerQuery.includes('dopim') || lowerQuery.includes('bimbingan')) {
        return (
            "## Dosen Pembimbing (Dopim) KP dan Bimbingan\n\n" +
            "**Dosen Pembimbing** akan membantu Anda selama proses **penulisan laporan** dan **pelaksanaan KP**.\n\n" +
            "**Penetapan Dosen:**\n" +
            "Dosen Pembimbing (**Dopim**) ditetapkan oleh **Koordinator KP** setelah **registrasi** disetujui, biasanya 1-2 minggu setelah batas akhir pendaftaran.\n\n" +
            "**Ketentuan Konsultasi/Bimbingan:**\n" +
            "* Mahasiswa wajib melakukan **konsultasi** minimal **6 kali**.\n" +
            "* Semua **log konsultasi** harus dicatat di sistem SiKP (atau melalui **Formulir B1**).\n" +
            "* Ikuti jadwal dan media komunikasi (chat/tatap muka) yang ditetapkan oleh Dosen Pembimbing Anda."
        );
    }
    
    else if (lowerQuery.includes('jurnal') || lowerQuery.includes('harian') || lowerQuery.includes('logbook') || lowerQuery.includes('kegiatan') || lowerQuery.includes('aktivitas')) {
        return (
            "## Jurnal Harian/Logbook Kegiatan KP (Formulir B3)\n\n" +
            "**Jurnal harian** adalah catatan wajib **aktivitas** Anda selama **Kerja Praktik** di instansi. Ini setara dengan **Formulir B3**.\n\n" +
            "**Kewajiban Pengisian:**\n" +
            "* Wajib diisi minimal **3 kali** dalam seminggu.\n" +
            "* Setiap entri harus mencakup tanggal, deskripsi kegiatan detail, dan **bukti pendukung**.\n" +
            "* Pengisian dilakukan melalui modul **Jurnal Harian** di portal SiKP. Perlu **Validasi** dari Dosen Pembimbing Lapangan.\n\n" +
            "Jurnal harian yang tidak lengkap atau terlambat dapat memengaruhi **penilaian**."
        );
    }

    else if (lowerQuery.includes('surat') || lowerQuery.includes('pengantar') || lowerQuery.includes('balasan') || lowerQuery.includes('instansi') || lowerQuery.includes('perusahaan') || lowerQuery.includes('penerimaan')) {
        return (
            "## Surat Pengantar dan Surat Balasan Instansi\n\n" +
            "**Surat Pengantar** adalah surat resmi dari kampus yang Anda ajukan ke instansi untuk memohon izin KP.\n\n" +
            "**Proses Surat:**\n" +
            "* Ajukan permohonan Surat Pengantar melalui **Administrasi Fakultas**.\n" +
            "* Setelah surat dikirim, Anda harus menunggu **Surat Balasan** atau **Surat Keterangan Diterima** dari Instansi.\n" +
            "* **Surat Balasan** (penerimaan) inilah yang wajib diunggah ke SiKP sebagai bukti Anda diterima dan menjadi syarat utama **Registrasi**."
        );
    }

    else if (lowerQuery.includes('nilai') || lowerQuery.includes('kelulusan') || lowerQuery.includes('lulus') || lowerQuery.includes('grading') || lowerQuery.includes('ipk')) {
        return (
            "## Komponen Nilai Akhir KP\n\n" +
            "Nilai akhir KP Anda ditentukan dari beberapa **komponen** utama:\n\n" +
            "1.  **Dosen Pembimbing (40%)**: Penilaian berdasarkan **bimbingan**, kelengkapan **jurnal**, dan **laporan**.\n" +
            "2.  **Dosen Penguji (40%)**: Penilaian saat **sidang** (presentasi dan jawaban).\n" +
            "3.  **Pembimbing Lapangan (20%)**: Penilaian dari **instansi** (kedisiplinan, kinerja, etika).\n\n" +
            "Syarat **kelulusan** minimal adalah nilai **C** (setara 2.00) secara keseluruhan. Nilai KP akan dimasukkan ke dalam **Transkrip Nilai**."
        );
    }
    
    else if (lowerQuery.includes('koordinator') || lowerQuery.includes('koor') || lowerQuery.includes('kontak')) {
        return (
            "## Koordinator Kerja Praktik (Koordinator KP)\n\n" +
            "**Koordinator KP** adalah dosen atau staf yang bertanggung jawab penuh atas seluruh **administrasi** dan **akademik** pelaksanaan Kerja Praktik di program studi Anda.\n\n" +
            "**Peran Utama:**\n" +
            "* Menetapkan **Dosen Pembimbing** (**Balancing Dopim**).\n" +
            "* Menyetujui **pendaftaran** dan **dokumen administrasi**.\n" +
            "* Mengumumkan **jadwal sidang**.\n\n" +
            "Informasi kontak dan jadwal konsultasi Koordinator KP dapat ditemukan di papan pengumuman fakultas atau halaman **Informasi Koordinator** di portal SiKP."
        );
    }
    
    else {
        return (
            "Halo! Saya mengerti Anda memiliki pertanyaan tentang **Kerja Praktik (KP)**.\n\n" +
            "Saat ini, saya terprogram untuk membantu Anda dengan topik-topik utama berikut:\n\n" +
            "1.  **Syarat & Pendaftaran**: Tanya tentang 'Syarat KP', 'Registrasi', atau 'Kapan boleh daftar'.\n" +
            "2.  **Alur & Prosedur**: Tanya tentang 'Alur KP', 'Tahapan', atau 'Pelaksanaan'.\n" +
            "3.  **Dokumen & Laporan**: Tanya tentang 'Format laporan', 'Penulisan', atau 'A1, B1, B2'.\n" +
            "4.  **Sidang & Ujian**: Tanya tentang 'Jadwal sidang', 'Syarat seminar', atau 'Kertas hijau'.\n" +
            "5.  **Dosen Pembimbing**: Tanya tentang 'Dopim', 'Konsultasi', atau 'Bimbingan'.\n" +
            "6.  **Jurnal Harian**: Tanya tentang 'Jurnal harian', 'Logbook', atau 'Aktivitas'.\n" +
            "7.  **Surat**: Tanya tentang 'Surat pengantar' atau 'Surat balasan instansi'.\n" +
            "8.  **Nilai Akhir**: Tanya tentang 'Nilai KP', 'Kelulusan', atau 'Grading'.\n" +
            "9.  **Koordinator**: Tanya tentang 'Koordinator KP' atau 'Kontak Koordinator'.\n\n" +
            "Mohon ulangi pertanyaan Anda dengan menggunakan salah satu kata kunci di atas agar saya bisa memberikan informasi yang paling akurat."
        );
    }
};

export default function ChatAssistant({ auth }: { auth: { user: any } }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const query = input.trim();
        if (!query || isTyping) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: query,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        const typingDuration = Math.random() * 1500 + 1500; 
        
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: getMockResponse(query),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, typingDuration);
    };

    const resetChat = () => {
        setMessages(initialMessages);
    };

    const renderContent = (content: string) => {
        let htmlContent = content.replace(/\n/g, '<br/>');
        
        htmlContent = htmlContent.replace(/## (.*?)<br\/>/g, '<h3 class="text-base font-semibold mt-2 mb-1 text-violet-700 dark:text-violet-400">$1</h3>');
        
        htmlContent = htmlContent.replace(/<br\/>\* (.*?)/g, '<br/><li class="list-item-custom">$1</li>');
        
        if (htmlContent.includes('<li class="list-item-custom">')) {
            htmlContent = htmlContent.replace(/<br\/>(<li class="list-item-custom">)/g, '$1'); 
            
            const parts = htmlContent.split('<li class="list-item-custom">');
            htmlContent = parts[0];
            
            let inList = false;
            for (let i = 1; i < parts.length; i++) {
                const part = '<li class="list-item-custom">' + parts[i];
                if (!inList) {
                    htmlContent += '<ul class="list-disc ml-4 space-y-1">';
                    inList = true;
                }
                
                const endOfListItem = part.indexOf('<br/>');
                
                if (endOfListItem !== -1) {
                    const listItem = part.substring(0, endOfListItem).replace('<li class="list-item-custom">', '<li>');
                    htmlContent += listItem + '</li>';
                    const remaining = part.substring(endOfListItem);

                    if (!remaining.trim().startsWith('<li')) {
                        htmlContent += '</ul>';
                        inList = false;
                        htmlContent += remaining;
                    } else {
                        htmlContent += remaining;
                    }
                } else {
                    htmlContent += part.replace('<li class="list-item-custom">', '<li>');
                }
            }
            if (inList) {
                htmlContent += '</ul>';
            }
        }
        
        htmlContent = htmlContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        htmlContent = htmlContent.replace(/<br\/>(<br\/>){2,}/g, '<br/><br/>');

        return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat Assistant" />

            <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50 dark:bg-gray-950">
                
                <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                            <BotIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-800 dark:text-gray-100">SiKP Assistant</h1>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className={`block w-2 h-2 rounded-full ${isTyping ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`}></span>
                                {isTyping ? 'Typing...' : 'Online'}
                            </p>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={resetChat} 
                        title="Reset Chat"
                        className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <RefreshCwIcon className="h-4 w-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-end gap-3 ${
                                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-violet-600 text-white`}>
                                        <BotIcon className="h-5 w-5" />
                                    </div>
                                )}

                                {msg.id === '1' && msg.role === 'assistant' ? (
                                    <div className="flex flex-col items-center text-center py-4 w-full">
                                        <div className="w-12 h-12 bg-violet-600 text-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                                            <BotIcon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-violet-700 dark:text-violet-400 mb-2">SiKP Assistant: Siap Membantu!</h3>
                                        <div className={`relative px-4 py-3 max-w-[90%] sm:max-w-[70%] text-gray-600 dark:text-gray-300 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 text-sm leading-relaxed`}>
                                            {renderContent(msg.content)}
                                            <span className="text-[10px] block mt-2 text-gray-400 text-right">
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`relative px-4 py-3 max-w-[85%] sm:max-w-[75%] text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300 ${
                                        msg.role === 'user'
                                            ? 'bg-violet-600 text-white rounded-xl rounded-tr-md shadow-md'
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl rounded-tl-md shadow-sm border border-gray-200 dark:border-gray-700'
                                    }`}>
                                        {renderContent(msg.content)}
                                        <span className={`text-[10px] block mt-1 text-right ${msg.role === 'user' ? 'text-violet-100 opacity-80' : 'text-gray-400 dark:text-gray-500'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}
                                
                                {msg.role === 'user' && (
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500`}>
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-start gap-3 justify-start">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center">
                                    <BotIcon className="h-5 w-5" />
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shrink-0">
                    <div className="max-w-3xl mx-auto">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-end gap-2 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all"
                        >
                            <Input
                                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2 min-h-[40px] max-h-32 resize-none text-base"
                                placeholder="Tanya sesuatu tentang KP (cth: 'Syarat daftar KP')..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isTyping}
                                autoComplete="off"
                            />
                            <Button 
                                type="submit" 
                                size="icon" 
                                disabled={!input.trim() || isTyping}
                                className={`h-10 w-10 rounded-full transition-all ${
                                    input.trim() 
                                        ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/50' 
                                        : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-400'
                                }`}
                            >
                                {isTyping ? <Loader2Icon className="h-5 w-5 animate-spin" /> : <SendIcon className="h-5 w-5" />}
                            </Button>
                        </form>
                        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                            Bot dapat membuat kesalahan. Selalu verifikasi informasi penting.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
import { Head, useForm } from '@inertiajs/react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect, FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type BreadcrumbItem } from '@/types';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Initial dummy messages untuk demo tampilan
const initialMessages: Message[] = [
    {
        id: '1',
        role: 'assistant',
        content: 'Halo! Saya asisten virtual SiKP. Ada yang bisa saya bantu mengenai Kerja Praktik hari ini? Anda bisa bertanya tentang alur pendaftaran, dokumen yang diperlukan, atau jadwal sidang.',
        timestamp: new Date(),
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chat Assistant',
        href: '/',
    },
];

export default function ChatAssistant({ auth }: { auth: { user: any } }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll ke bawah saat ada pesan baru
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulasi response AI (Ganti ini dengan API call sebenarnya nanti)
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: getMockResponse(userMessage.content),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    };

    // Fungsi Mock Response Sederhana
    const getMockResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('daftar') || lowerQuery.includes('syarat')) {
            return 'Untuk mendaftar Kerja Praktik, Anda harus sudah menempuh minimal 100 SKS dan lulus mata kuliah prasyarat. Silakan unduh formulir pendaftaran di menu Dokumen.';
        } else if (lowerQuery.includes('laporan') || lowerQuery.includes('dokumen')) {
            return 'Format laporan KP dapat diunduh di halaman Dokumen & Berkas. Pastikan Anda mengikuti pedoman penulisan yang berlaku.';
        } else if (lowerQuery.includes('sidang') || lowerQuery.includes('jadwal')) {
            return 'Jadwal sidang KP biasanya diumumkan setiap akhir bulan. Cek menu Info & Syarat untuk pengumuman terbaru.';
        } else {
            return 'Maaf, saya belum mengerti pertanyaan spesifik Anda. Coba tanyakan tentang "pendaftaran", "laporan", atau "jadwal".';
        }
    };

    const resetChat = () => {
        setMessages(initialMessages);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat Assistant" />

            <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 dark:bg-gray-900">
                
                {/* Chat Header (Mobile Only / Simple Info) */}
                <div className="p-4 bg-white dark:bg-gray-800 border-b flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-800 dark:text-gray-100">SiKP Assistant</h1>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={resetChat} title="Reset Chat">
                        <RefreshCw className="h-4 w-4 text-gray-500" />
                    </Button>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-3 ${
                                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                }`}
                            >
                                {/* Avatar */}
                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    msg.role === 'user' 
                                        ? 'bg-gray-200 dark:bg-gray-700' 
                                        : 'bg-blue-600 text-white'
                                }`}>
                                    {msg.role === 'user' ? <User className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <Bot className="h-5 w-5" />}
                                </div>

                                {/* Bubble */}
                                <div className={`relative px-4 py-3 rounded-2xl max-w-[85%] sm:max-w-[75%] shadow-sm text-sm leading-relaxed ${
                                    msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-sm'
                                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                                }`}>
                                    {msg.content}
                                    <span className={`text-[10px] block mt-1 opacity-70 text-right ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
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

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-800 border-t shrink-0">
                    <div className="max-w-3xl mx-auto">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-end gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all"
                        >
                            <Input
                                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 min-h-[44px] max-h-32 resize-none"
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
                                className={`h-10 w-10 rounded-lg transition-all ${
                                    input.trim() 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                                        : 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                                }`}
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
                        <p className="text-center text-xs text-gray-400 mt-2">
                            Bot dapat membuat kesalahan. Selalu verifikasi informasi penting.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
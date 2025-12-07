import { Head } from '@inertiajs/react';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type BreadcrumbItem } from '@/types';
import '@/css/chat-assistant.css'; // Pastikan CSS ini ada dan terisi

// --- INTERFACE & DUMMY DATA ---

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
        content:
            'Halo! Aku S.Kp.\n\nAku terintegrasi sama Pedoman KP terbaru, jadi kamu bisa tanya tentang:\n• Syarat Kerja Praktik\n• Alur Kerja Praktik\n• Alur Balancing Dosen',
        timestamp: new Date(),
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chat Assistant',
        href: '/',
    },
];

// --- KOMPONEN UTAMA ---

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

    /**
     * Mengirim pesan ke backend Laravel untuk diteruskan ke OpenAI.
     * Error 419 (CSRF Token) telah diantisipasi di sini.
     */
    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const query = input.trim();
        if (!query) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: query,
            timestamp: new Date(),
        };

        // 1. Tampilkan pesan user & siapkan state
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // 2. Siapkan riwayat pesan untuk dikirim ke API
        const historyForApi = messages.map(msg => ({
            role: msg.role,
            content: msg.content,
        }));
        
        // Tambahkan pesan user saat ini
        historyForApi.push({ role: 'user', content: query });
        
        // Dapatkan CSRF Token
        const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        // Pengecekan CSRF token (Mengantisipasi Error 419)
        if (!csrfToken) {
            setIsTyping(false);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "ERROR: Gagal mengirim pesan. Token keamanan (CSRF) hilang. Refresh halaman Anda.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
            return;
        }

        try {
            // 3. Panggil API backend Laravel (Endpoint: /chat/send)
            const response = await fetch('/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken, 
                },
                body: JSON.stringify({
                    messages: historyForApi,
                }),
            });

            if (!response.ok) {
                // Tangani error HTTP seperti 419, 500, dll.
                const statusText = response.statusText || 'Unknown Error';
                throw new Error(`HTTP error! status: ${response.status} (${statusText})`);
            }

            const data = await response.json();
            const botResponseContent = data.response; // Asumsi backend mengirim { response: "Jawaban AI" }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: botResponseContent || "Maaf, tidak ada balasan dari AI.",
                timestamp: new Date(),
            };
            
            // 4. Tampilkan balasan AI
            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            console.error("Error calling AI API:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Terjadi kesalahan saat menghubungi server: ${error instanceof Error ? error.message : "Tidak diketahui"}`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            // 5. Selesai mengetik
            setIsTyping(false);
        }
    };

    const resetChat = () => {
        setMessages(initialMessages);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat Assistant" />

            {/* Container Utama Chat - Tinggi Penuh */}
            <div className="chat-page flex flex-col h-full max-h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 dark:bg-gray-900">
                {/* Header Chat */}
                <div className="chat-header flex items-center justify-between bg-white dark:bg-gray-800 border-b px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="avatar-assistant">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">ChatBot SiKP</h2>
                            <p className="text-sm text-gray-500">Teknik Komputer UNDIP</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-500 hover:text-red-500 transition-colors" 
                            title="Clear conversation" 
                            onClick={resetChat}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Area Percakapan - Dapat di-scroll */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="conversation-area px-4 md:px-8 py-8">
                            <div className="max-w-4xl mx-auto space-y-6">
                                {/* Render messages */}
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`message-row flex gap-4 ${
                                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        
                                        {/* Avatar Asisten (di kiri) */}
                                        {msg.role === 'assistant' && msg.id !== '1' && (
                                            <div className='flex-shrink-0'>
                                                <div className="avatar-assistant w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                                                    <Bot className="h-4 w-4" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Bubble / Card */}
                                        <div
                                            className={`message-bubble ${msg.role === 'assistant' ? 'assistant-bubble' : 'user-bubble'} ${msg.role === 'user' ? 'order-last' : ''}`}
                                        >
                                            {/* Welcome message khusus (menggunakan Card) */}
                                            {msg.id === '1' && msg.role === 'assistant' ? (
                                                <Card className="welcome-card shadow-sm border">
                                                    <CardContent className="flex gap-3 items-start p-4">
                                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                            <Bot className="text-purple-600 h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-purple-700 font-semibold mb-1">Halo! Aku S.Kp.</h3>
                                                            <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
                                                                {msg.content}
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ) : (
                                                // Bubble pesan biasa
                                                <>
                                                    <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>
                                                    <div className={`text-[11px] mt-1 text-right ${msg.role === 'user' ? 'text-white/80' : 'text-gray-500/80'}`}>
                                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        
                                        {/* Avatar User (di kanan) */}
                                        {msg.role === 'user' && (
                                            <div className='flex-shrink-0'>
                                                <div className="avatar-user w-8 h-8 rounded-full bg-gray-100 border border-gray-300 text-gray-600 flex items-center justify-center">
                                                    <User className="h-4 w-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Indikator Typing */}
                                {isTyping && (
                                    <div className="flex items-start gap-4">
                                        <div className="avatar-assistant w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="typing-bubble bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-4 py-3 rounded-2xl shadow-sm">
                                            <div className="flex gap-1">
                                                <span className="dot" />
                                                <span className="dot delay" />
                                                <span className="dot delay-lg" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                {/* Input Area */}
                <div className="chat-input-area bg-white dark:bg-gray-800 border-t p-6">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <div className="flex-1">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Coba tanya : Kapan boleh KP?"
                                    className="h-12 rounded-lg pl-4 pr-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500 shadow-sm"
                                    disabled={isTyping}
                                />
                            </div>

                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isTyping}
                                className={`h-12 w-12 rounded-xl transition-colors duration-200 ${input.trim() ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
                        <p className="text-center text-xs text-gray-400 mt-3">
                            Bot dapat membuat kesalahan. Selalu verifikasi informasi penting.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
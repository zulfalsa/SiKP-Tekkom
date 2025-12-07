<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use OpenAI\Laravel\Facades\OpenAI;

class ChatController extends Controller
{
    // Mengasumsikan Anda telah mengatur OPENAI_API_KEY di file .env Anda

    public function sendMessage(Request $request)
    {
        // 1. Validasi request
        $validated = $request->validate([
            'messages' => 'required|array',
            'messages.*.role' => 'required|string|in:user,assistant',
            'messages.*.content' => 'required|string',
        ]);

        $messages = $validated['messages'];
        
        // --- RAG (Retrieval-Augmented Generation) ---
        // Jika Anda ingin bot hanya menjawab berdasarkan pedoman KP,
        // Anda harus melakukan langkah-langkah berikut:
        // 1. Ambil pertanyaan terakhir dari user.
        $latestQuestion = end($messages)['content'];
        // 2. Cari dokumen KP yang relevan di database (menggunakan full-text search atau vector database).
        // 3. Tambahkan konteks dokumen ke dalam prompt system.
        
        // Contoh Prompt System untuk konteks KP:
        $systemMessage = [
            'role' => 'system',
            'content' => "Anda adalah ChatBot SiKp, asisten yang sangat ramah dan informatif dari Teknik Komputer UNDIP. Jawaban Anda harus didasarkan **HANYA** pada informasi resmi tentang Kerja Praktik (KP). Jangan pernah menjawab pertanyaan di luar konteks KP. Balas dalam Bahasa Indonesia.",
        ];
        
        // Gabungkan system message dengan riwayat chat
        array_unshift($messages, $systemMessage);
        
        try {
            // 2. Panggil API OpenAI
            $response = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo', // Pilih model yang sesuai (gpt-4o atau gpt-3.5-turbo)
                'messages' => $messages,
            ]);

            // 3. Ekstrak jawaban
            $botResponse = $response->choices[0]->message->content;

            // 4. Kirim kembali ke frontend
            return response()->json([
                'response' => $botResponse,
            ]);

        } catch (\Exception $e) {
            // Log error
            \Log::error('OpenAI Error: ' . $e->getMessage());

            return response()->json([
                'response' => 'Maaf, terjadi masalah saat memproses permintaan Anda. Kode error: ' . substr($e->getMessage(), 0, 50) . '...',
            ], 500);
        }
    }
}
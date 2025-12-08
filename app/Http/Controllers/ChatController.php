<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    /**
     * Mengirim pesan pengguna ke OpenAI API, mempertahankan riwayat percakapan
     * dalam session Laravel.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessage(Request $request)
    {
        try {
            // 1. Validasi Input
            $request->validate([
                'message' => 'required|string'
            ]);

            $userMessage = $request->message;
            $apiKey = env('OPENAI_API_KEY');

            // Cek Ketersediaan API Key
            if (!$apiKey) {
                return response()->json([
                    'error' => 'API Key tidak ditemukan.',
                    'message' => 'Harap atur OPENAI_API_KEY di file .env Anda.'
                ], 500);
            }

            // 2. Ambil Riwayat Percakapan (Session)
            $messages = $request->session()->get('chat_history', []);

            // Jika riwayat kosong, tambahkan pesan Sistem (System Prompt)
            if (empty($messages)) {
                $messages[] = [
                    "role" => "system", 
                    "content" => "Anda adalah Asisten AI yang ramah dan membantu untuk Sistem Informasi Proyek (SiKP). Jawablah pertanyaan dengan profesional dan relevan dengan konteks proyek atau teknologi."
                ];
            }

            // 3. Tambahkan Pesan Pengguna ke Riwayat
            $messages[] = [
                "role" => "user", 
                "content" => $userMessage
            ];

            // 4. Panggil OpenAI Chat Completion API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                "model" => "gpt-3.5-turbo", // Model yang digunakan
                "messages" => $messages,     // Mengirim seluruh riwayat percakapan
                "temperature" => 0.7,        // Tingkat kreativitas (0.0-1.0)
            ]);

            // 5. Penanganan Error dari API
            if ($response->failed()) {
                return response()->json([
                    'error' => 'Gagal memanggil API OpenAI',
                    'detail' => $response->body()
                ], 500);
            }

            // 6. Ambil Balasan AI
            $botReply = $response->json()['choices'][0]['message']['content'];

            // 7. Tambahkan Balasan AI ke Riwayat dan Simpan ke Session
            $messages[] = [
                "role" => "assistant", 
                "content" => $botReply
            ];
            $request->session()->put('chat_history', $messages);

            // 8. Kirim Balasan ke Frontend
            return response()->json([
                'reply' => $botReply
            ]);

        } catch (\Exception $e) {
            // Penanganan Error Server Internal
            return response()->json([
                'error' => 'Server Error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { errorResponse } from "@/app/api/generate/types";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  const {
    projectType,
    projectDetails,
    tone,
    hourlyRate,
    estimatedHours,
    language,
  } = await req.json();

  const prompt = `Buatkan proposal proyek freelance berdasarkan detail berikut:

  1. Jenis proyek: ${projectType}
  
  2. Deskripsi proyek: ${projectDetails}
  
  3. Nada bahasa: ${tone}
  
  4. Bahasa yang digunakan: ${language}
  
  Sertakan bagian-bagian berikut:
  
  1. Deskripsi Proyek — jelaskan tujuan dan latar belakang proyek.
  
  2. Ruang Lingkup — rincikan layanan yang akan diberikan.
  
  3. Alur Kerja — jelaskan tahapan kerja dari awal hingga selesai.
  
  4. Estimasi Biaya — hitung berdasarkan tarif Rp ${hourlyRate}/jam × ${estimatedHours} jam.
  
  5. Penutup Profesional — sampaikan komitmen dan ajakan untuk diskusi lebih lanjut.
  
  Formatkan agar rapi dan mudah disalin ke dokumen.
  Tulis dalam bahasa ${language} dengan gaya yang ${tone}.
  
  Hilangkan semua instruksi dan fokus pada teks proposal yang siap digunakan.
  `;
  let proposal;
  try {
    const completion = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });

    proposal = completion.text;

    console.log("Generated proposal:", proposal);

    if (!proposal) {
      return NextResponse.json(
        { error: "Gagal menghasilkan proposal. Silakan coba lagi." },
        { status: 400 }
      );
    }
  } catch (errorResponse) {
    const error = errorResponse as errorResponse;
    return NextResponse.json(
      {
        error: error.error.message || "Gagal memproses permintaan.",
        details: error,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ proposal });
}

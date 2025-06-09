import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { projectType, projectDetails, tone, hourlyRate, estimatedHours } =
    await req.json();

  const prompt = `Buatkan proposal proyek freelance berdasarkan informasi berikut:

Jenis proyek: ${projectType}
Detail proyek: ${projectDetails}
Gaya bahasa: ${tone}

Tambahkan bagian:
1. Deskripsi proyek
2. Ruang lingkup
3. Alur kerja
4. Estimasi biaya (berdasarkan Rp ${hourlyRate}/jam x ${estimatedHours} jam)
5. Penutup profesional

Gunakan bahasa Indonesia dengan nada ${tone}. Formatkan agar mudah disalin ke dokumen.`;
  let proposal;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    proposal = completion.choices[0].message.content;
  } catch (error) {}

  return NextResponse.json({ proposal });
}

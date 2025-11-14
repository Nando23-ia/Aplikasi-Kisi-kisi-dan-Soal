
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, GeneratedContent } from "../types";

const getSubKompetensi = (bentukSoal: string): string => {
  const lowerCaseBentuk = bentukSoal.toLowerCase();
  if (lowerCaseBentuk.includes("pilihan ganda")) {
    return "Menemukan informasi dalam teks";
  }
  if (lowerCaseBentuk.includes("isian") || lowerCaseBentuk.includes("essay")) {
    return "Memahami teks secara literal";
  }
  if (lowerCaseBentuk.includes("menjodohkan")) {
    return "Merefleksikan isi teks untuk menentukan jawaban yang sesuai";
  }
  return "Kompetensi tidak spesifik";
};

const buildPrompt = (data: FormData): string => {
  const questionSummary = data.questionTypes
    .map((qt) => `${qt.count} soal ${qt.type}`)
    .join(", ");

  return `
    Anda adalah seorang ahli perancang kurikulum dan guru berpengalaman di Indonesia. 
    Tugas Anda adalah membuat kisi-kisi soal, lembar soal siswa, dan kunci jawaban yang komprehensif dan berkualitas tinggi dalam format JSON.

    Gunakan informasi berikut untuk membuat soal:
    - Mata Pelajaran: ${data.mataPelajaran}
    - Kelas: ${data.kelas}
    - Tipe Ujian: ${data.tipeUjian}
    - Materi Utama: ${data.materi}
    - Tema/Subtema: ${data.tema}
    - Konten: ${data.konten}
    - Konteks: ${data.konteks}
    - Kompetensi Umum: ${data.kompetensi}
    - Jumlah dan Bentuk Soal: ${questionSummary}

    Instruksi Penting:
    1.  **kisiKisi**: Buat array objek untuk kisi-kisi. Setiap objek mewakili satu nomor soal.
        -   Kolom 'subKompetensi' harus diisi berdasarkan 'bentukSoal' dengan aturan:
            -   Pilihan Ganda (Tunggal, Kompleks): "Menemukan informasi dalam teks"
            -   Isian, Essay: "Memahami teks secara literal"
            -   Menjodohkan: "Merefleksikan isi teks untuk menentukan jawaban yang sesuai"
        -   Kolom 'noSoal' harus berupa string yang merepresentasikan nomor soal.
    2.  **lembarSoal**: Buat array objek untuk lembar soal.
        -   Untuk soal Pilihan Ganda, buat 1-3 teks bacaan yang panjang dan relevan. Kelompokkan beberapa soal di bawah setiap teks bacaan. Masukkan teks bacaan ke dalam properti 'teksBacaan'.
        -   Untuk soal menjodohkan, berikan dua kolom untuk dijodohkan.
        -   Untuk soal pilihan ganda kompleks, instruksikan siswa untuk memilih lebih dari satu jawaban.
    3.  **kunciJawaban**: Buat array objek untuk kunci jawaban, pastikan nomor dan jawaban sesuai dengan lembar soal.

    Pastikan output JSON valid dan sesuai dengan skema yang diberikan.
  `;
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    kisiKisi: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tema: { type: Type.STRING },
          konten: { type: Type.STRING },
          konteks: { type: Type.STRING },
          kompetensi: { type: Type.STRING },
          bentukSoal: { type: Type.STRING },
          noSoal: { type: Type.STRING },
          subKompetensi: { type: Type.STRING },
          rincianKompetensi: { type: Type.STRING },
          uraianSoal: { type: Type.STRING },
        },
        required: ["tema", "konten", "konteks", "kompetensi", "bentukSoal", "noSoal", "subKompetensi", "rincianKompetensi", "uraianSoal"],
      },
    },
    lembarSoal: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          teksBacaan: { type: Type.STRING },
          pertanyaan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                nomor: { type: Type.INTEGER },
                soal: { type: Type.STRING },
                pilihan: { type: Type.ARRAY, items: { type: Type.STRING } },
                tipe: { type: Type.STRING }
              },
              required: ["nomor", "soal", "tipe"],
            },
          },
        },
      },
    },
    kunciJawaban: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          nomor: { type: Type.INTEGER },
          jawaban: { type: Type.STRING },
        },
        required: ["nomor", "jawaban"],
      },
    },
  },
  required: ["kisiKisi", "lembarSoal", "kunciJawaban"],
};

export const generateBlueprint = async (formData: FormData): Promise<GeneratedContent> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const prompt = buildPrompt(formData);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonString = response.text;
    const generatedContent: GeneratedContent = JSON.parse(jsonString);

    // Post-processing to ensure subKompetensi is correct
    generatedContent.kisiKisi = generatedContent.kisiKisi.map(item => ({
      ...item,
      subKompetensi: getSubKompetensi(item.bentukSoal)
    }));
    
    return generatedContent;
  } catch (error) {
    console.error("Error generating blueprint:", error);
    throw new Error("Gagal menghasilkan data dari AI. Silakan coba lagi.");
  }
};

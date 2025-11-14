
import type { GeneratedContent, FormData } from "../types";

declare const XLSX: any;

export const exportToExcel = (
  content: GeneratedContent,
  formData: FormData
) => {
  // 1. Create Kisi-Kisi Worksheet
  const kisiKisiHeaders = [
    "Tema/Subtema",
    "Konten",
    "Konteks",
    "Kompetensi",
    "Bentuk Soal",
    "No Soal",
    "Subkompetensi",
    "Rincian Kompetensi",
    "Uraian Soal",
  ];
  const kisiKisiData = content.kisiKisi.map((item) => [
    item.tema,
    item.konten,
    item.konteks,
    item.kompetensi,
    item.bentukSoal,
    item.noSoal,
    item.subKompetensi,
    item.rincianKompetensi,
    item.uraianSoal,
  ]);
  const wsKisiKisi = XLSX.utils.aoa_to_sheet([kisiKisiHeaders, ...kisiKisiData]);
  
  // Auto-fit columns for kisi-kisi sheet
  const kisiKisiCols = Object.keys(kisiKisiData[0] || {}).map((_, i) => ({
      wch: Math.max(...kisiKisiData.map(row => row[i] ? row[i].toString().length : 0), kisiKisiHeaders[i].length) + 2
  }));
  wsKisiKisi['!cols'] = kisiKisiCols;


  // 2. Create Lembar Soal Worksheet
  const lembarSoalData: (string | number)[][] = [];
  content.lembarSoal.forEach((item) => {
    if (item.teksBacaan) {
      lembarSoalData.push([`Bacalah teks berikut untuk menjawab soal-soal di bawahnya:`]);
      lembarSoalData.push([item.teksBacaan]);
      lembarSoalData.push([]); // Add a blank line
    }
    item.pertanyaan.forEach((p) => {
      lembarSoalData.push([`${p.nomor}.`, p.soal]);
      if (p.pilihan && p.pilihan.length > 0) {
        p.pilihan.forEach((opt) => lembarSoalData.push(["", opt]));
      }
      lembarSoalData.push([]); // Add a blank line after each question
    });
  });
  const wsLembarSoal = XLSX.utils.aoa_to_sheet(lembarSoalData);
  wsLembarSoal['!cols'] = [{ wch: 5 }, { wch: 100 }];


  // 3. Create Kunci Jawaban Worksheet
  const kunciJawabanHeaders = ["Nomor Soal", "Kunci Jawaban"];
  const kunciJawabanData = content.kunciJawaban.map((item) => [
    item.nomor,
    item.jawaban,
  ]);
  const wsKunciJawaban = XLSX.utils.aoa_to_sheet([kunciJawabanHeaders, ...kunciJawabanData]);
  wsKunciJawaban['!cols'] = [{ wch: 15 }, { wch: 50 }];

  // 4. Create Workbook and Download
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsKisiKisi, "Kisi-Kisi Soal");
  XLSX.utils.book_append_sheet(wb, wsLembarSoal, "Lembar Soal Siswa");
  XLSX.utils.book_append_sheet(wb, wsKunciJawaban, "Kunci Jawaban");

  const fileName = `Kisi-Kisi_${formData.mataPelajaran.replace(
    / /g,
    "_"
  )}_${formData.kelas.replace(/ /g, "_")}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

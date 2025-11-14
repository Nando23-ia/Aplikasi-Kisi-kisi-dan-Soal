
export enum BentukSoal {
  PILIHAN_GANDA = "PILIHAN GANDA",
  PILIHAN_GANDA_TUNGGAL = "PILIHAN GANDA TUNGGAL",
  PILIHAN_GANDA_KOMPLEKS = "PILIHAN GANDA KOMPLEKS",
  ISIAN = "ISIAN",
  MENJODOHKAN = "MENJODOHKAN",
  ESSAY = "ESSAY",
}

export enum TipeUjian {
  TENGAH_SEMESTER_GANJIL = "TENGAH SEMESTER GANJIL",
  SEMESTER_GANJIL = "SEMESTER GANJIL",
  TENGAH_SEMESTER_GENAP = "TENGAH SEMESTER GENAP",
  SEMESTER_GENAP = "SEMESTER GENAP",
}

export interface QuestionType {
  type: BentukSoal;
  count: number;
}

export interface FormData {
  logoKiri: string | null;
  logoKanan: string | null;
  namaSekolah: string;
  tipeUjian: TipeUjian;
  tahunPelajaran: string;
  mataPelajaran: string;
  kelas: string;
  materi: string;
  tema: string;
  konten: string;
  konteks: "PERSONAL" | "SAINTIFIK";
  kompetensi: "MEMAHAMI" | "MENGEVALUASI";
  questionTypes: QuestionType[];
}

export interface BlueprintItem {
  tema: string;
  konten: string;
  konteks: string;
  kompetensi: string;
  bentukSoal: string;
  noSoal: string;
  subKompetensi: string;
  rincianKompetensi: string;
  uraianSoal: string;
}

export interface QuestionDetail {
  nomor: number;
  soal: string;
  pilihan?: string[];
  tipe?: 'tunggal' | 'kompleks' | 'isian' | 'menjodohkan' | 'essay';
}

export interface WorksheetItem {
  teksBacaan?: string;
  pertanyaan: QuestionDetail[];
}

export interface Answer {
  nomor: number;
  jawaban: string;
}

export interface GeneratedContent {
  kisiKisi: BlueprintItem[];
  lembarSoal: WorksheetItem[];
  kunciJawaban: Answer[];
}

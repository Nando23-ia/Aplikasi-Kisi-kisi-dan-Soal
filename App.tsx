
import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { BlueprintDisplay } from './components/BlueprintDisplay';
import { generateBlueprint } from './services/geminiService';
import { exportToExcel } from './services/excelService';
import { BentukSoal, TipeUjian } from './types';
import type { FormData, GeneratedContent } from './types';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    logoKiri: null,
    logoKanan: null,
    namaSekolah: 'SEKOLAH HARAPAN BANGSA',
    tipeUjian: TipeUjian.SEMESTER_GANJIL,
    tahunPelajaran: '2024/2025',
    mataPelajaran: 'Bahasa Indonesia',
    kelas: 'X',
    materi: 'Teks anekdot, teks laporan hasil observasi',
    tema: 'Menganalisis Teks',
    konten: 'Struktur, kebahasaan, dan makna tersirat',
    konteks: 'SAINTIFIK',
    kompetensi: 'MEMAHAMI',
    questionTypes: [{ type: BentukSoal.PILIHAN_GANDA, count: 10 }, { type: BentukSoal.ESSAY, count: 5 }],
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    try {
      const content = await generateBlueprint(formData);
      setGeneratedContent(content);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedContent) {
      exportToExcel(generatedContent, formData);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-6m-3 6v-3m-3 3v-6m0 10h6m-6-4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
          <h1 className="text-xl font-bold text-gray-800">Generator Kisi-Kisi Soal AI</h1>
        </div>
        <div className="flex items-center gap-4">
          {generatedContent && (
            <button onClick={handleDownload} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              Download Excel
            </button>
          )}
        </div>
      </header>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">
            <p className="font-bold">Terjadi Kesalahan</p>
            <p>{error}</p>
        </div>
      )}

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <aside className="lg:w-[450px] xl:w-[500px] bg-white shadow-lg overflow-y-auto">
          <InputForm
            formData={formData}
            setFormData={setFormData}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </aside>
        <section className="flex-1 overflow-auto">
          <BlueprintDisplay content={generatedContent} formData={formData} />
        </section>
      </main>
    </div>
  );
};

export default App;

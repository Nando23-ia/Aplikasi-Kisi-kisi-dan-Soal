
import React from 'react';
import type { GeneratedContent, FormData } from '../types';

interface BlueprintDisplayProps {
  content: GeneratedContent | null;
  formData: FormData;
}

const KertasKosong: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-8 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <h3 className="text-xl font-semibold text-gray-600">Hasil Akan Ditampilkan di Sini</h3>
    <p className="text-gray-500 mt-2">Isi formulir di sebelah kiri dan klik "Buat Kisi-Kisi" untuk memulai.</p>
  </div>
);

const Header: React.FC<{ formData: FormData }> = ({ formData }) => (
  <header className="mb-4">
    <div className="flex justify-between items-center">
      <img src={formData.logoKiri || 'https://via.placeholder.com/80'} alt="Logo Kiri" className="h-20 w-20 object-contain" />
      <div className="text-center">
        <h1 className="font-bold text-lg uppercase">{formData.namaSekolah || "NAMA SEKOLAH"}</h1>
        <p className="text-sm">Alamat Sekolah, Kota, Kode Pos</p>
        <p className="text-sm">Website: www.sekolah.id | Email: info@sekolah.id</p>
      </div>
      <img src={formData.logoKanan || 'https://via.placeholder.com/80'} alt="Logo Kanan" className="h-20 w-20 object-contain" />
    </div>
    <hr className="border-t-2 border-black mt-2" />
    <hr className="border-t-4 border-black mt-1" />
    <div className="text-center mt-4">
      <h2 className="font-bold text-base uppercase">FORMAT KISI-KISI UJIAN {formData.tipeUjian}</h2>
      <p className="font-bold text-base">TAHUN PELAJARAN {formData.tahunPelajaran}</p>
    </div>
    <div className="mt-4 text-sm">
      <div className="grid grid-cols-2">
        <p><span className="font-semibold">Mata Pelajaran:</span> {formData.mataPelajaran}</p>
        <p><span className="font-semibold">Kelas:</span> {formData.kelas}</p>
      </div>
    </div>
  </header>
);

export const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({ content, formData }) => {
  if (!content) {
    return <KertasKosong />;
  }

  const Page: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
      <div className="w-[29.7cm] min-h-[21cm] bg-white shadow-lg p-8 mx-auto my-4 break-after-page">
          <Header formData={formData} />
          <h3 className="text-center font-bold text-lg my-4 uppercase">{title}</h3>
          {children}
      </div>
  );

  return (
    <div className="w-full h-full bg-gray-200 p-4 overflow-y-auto">
      
      {/* KISI-KISI SOAL */}
      <Page title="Kisi-Kisi Penulisan Soal">
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-200 font-bold">
              {["Tema/Subtema", "Konten", "Konteks", "Kompetensi", "Bentuk Soal", "No Soal", "Subkompetensi", "Rincian Kompetensi", "Uraian Soal"].map(h => (
                <th key={h} className="border border-black p-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.kisiKisi.map((item, index) => (
              <tr key={index}>
                <td className="border border-black p-1">{item.tema}</td>
                <td className="border border-black p-1">{item.konten}</td>
                <td className="border border-black p-1">{item.konteks}</td>
                <td className="border border-black p-1">{item.kompetensi}</td>
                <td className="border border-black p-1">{item.bentukSoal}</td>
                <td className="border border-black p-1 text-center">{item.noSoal}</td>
                <td className="border border-black p-1">{item.subKompetensi}</td>
                <td className="border border-black p-1">{item.rincianKompetensi}</td>
                <td className="border border-black p-1">{item.uraianSoal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>

      {/* LEMBAR SOAL */}
      <Page title="Lembar Soal Siswa">
        <div className="space-y-4 text-sm">
          {content.lembarSoal.map((item, index) => (
            <div key={index}>
              {item.teksBacaan && (
                <div className="bg-gray-50 p-3 border rounded-md mb-3">
                  <p className="font-semibold mb-2">Bacalah teks berikut dengan saksama untuk menjawab soal-soal di bawahnya!</p>
                  <p className="text-justify whitespace-pre-line">{item.teksBacaan}</p>
                </div>
              )}
              {item.pertanyaan.map((p, pIndex) => (
                <div key={pIndex} className="mb-3 flex gap-2">
                  <span className="font-semibold">{p.nomor}.</span>
                  <div className="flex-1">
                    <p className="whitespace-pre-line">{p.soal}</p>
                    {p.pilihan && (
                      <div className="mt-1 space-y-1">
                        {p.pilihan.map((opt, optIndex) => (
                          <p key={optIndex}>{opt}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Page>

      {/* KUNCI JAWABAN */}
      <Page title="Kunci Jawaban">
        <div className="grid grid-cols-5 gap-4 text-sm">
          {content.kunciJawaban.sort((a,b) => a.nomor - b.nomor).map(item => (
            <div key={item.nomor} className="flex gap-2">
              <span className="font-bold">{item.nomor}.</span>
              <span>{item.jawaban}</span>
            </div>
          ))}
        </div>
      </Page>
    </div>
  );
};

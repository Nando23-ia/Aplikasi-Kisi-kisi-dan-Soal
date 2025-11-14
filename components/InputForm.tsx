import React from 'react';
import { BentukSoal, TipeUjian } from '../types';
import type { FormData, QuestionType } from '../types';

interface InputFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const FileInput: React.FC<{ label: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; preview: string | null; }> = ({ label, onChange, preview }) => (
  <div className="flex flex-col items-center gap-2 p-2 border-2 border-dashed rounded-lg">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {preview ? (
      <img src={preview} alt="Logo preview" className="h-16 w-16 object-contain" />
    ) : (
      <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
    )}
    <input type="file" accept="image/*" className="text-sm w-full" onChange={onChange} />
  </div>
);

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
);

const SelectField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; }> = ({ label, value, onChange, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
      {children}
    </select>
  </div>
);

const TextareaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number; }> = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
);

export const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, onGenerate, isLoading }) => {
  
  const handleFileChange = (field: 'logoKiri' | 'logoKanan') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleChange = (field: keyof Omit<FormData, 'questionTypes' | 'logoKiri' | 'logoKanan'>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // FIX: Correctly typed the generic event handler for question type changes.
  // The generic `K` is inferred from the `field` argument, which correctly sets the event target type.
  // The incorrect cast on `e.target.value` was removed.
  // `as any` is used to bypass a TypeScript limitation with correlated types on computed properties.
  const handleQuestionTypeChange = <K extends keyof QuestionType>(index: number, field: K) => (e: React.ChangeEvent<K extends 'type' ? HTMLSelectElement : HTMLInputElement>) => {
      const newValue = e.target.value;
      const updatedTypes = [...formData.questionTypes];
      updatedTypes[index] = { ...updatedTypes[index], [field]: (field === 'count' ? parseInt(newValue, 10) || 0 : newValue) as any };
      setFormData(prev => ({ ...prev, questionTypes: updatedTypes }));
  };

  const addQuestionType = () => {
      setFormData(prev => ({
          ...prev,
          questionTypes: [...prev.questionTypes, { type: BentukSoal.PILIHAN_GANDA, count: 5 }]
      }));
  };

  const removeQuestionType = (index: number) => {
      if (formData.questionTypes.length <= 1) return;
      setFormData(prev => ({
          ...prev,
          questionTypes: prev.questionTypes.filter((_, i) => i !== index)
      }));
  };

  return (
    <div className="p-6 bg-gray-50 space-y-6 overflow-y-auto h-full">
      <h2 className="text-2xl font-bold text-gray-800">Input Data Kisi-Kisi</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <FileInput label="Logo Kiri" onChange={handleFileChange('logoKiri')} preview={formData.logoKiri} />
        <FileInput label="Logo Kanan" onChange={handleFileChange('logoKanan')} preview={formData.logoKanan} />
      </div>

      <InputField label="Nama Sekolah" value={formData.namaSekolah} onChange={handleChange('namaSekolah')} placeholder="Contoh: SMA Negeri 1 Indonesia" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Format Kisi-Kisi Ujian" value={formData.tipeUjian} onChange={handleChange('tipeUjian')}>
            {Object.values(TipeUjian).map(tipe => <option key={tipe} value={tipe}>{tipe}</option>)}
          </SelectField>
          <InputField label="Tahun Pelajaran" value={formData.tahunPelajaran} onChange={handleChange('tahunPelajaran')} placeholder="Contoh: 2024/2025" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Mata Pelajaran" value={formData.mataPelajaran} onChange={handleChange('mataPelajaran')} placeholder="Contoh: Bahasa Indonesia" />
          <InputField label="Kelas" value={formData.kelas} onChange={handleChange('kelas')} placeholder="Contoh: X" />
      </div>
      
      <TextareaField label="Materi Pokok" value={formData.materi} onChange={handleChange('materi')} placeholder="Jelaskan secara singkat materi utama yang akan diujikan, pisahkan dengan koma jika lebih dari satu." />

      <div className="p-4 border rounded-md bg-white">
        <h3 className="font-semibold text-gray-800 mb-2">Detail Kompetensi</h3>
        <div className="space-y-4">
            <InputField label="Tema/Subtema" value={formData.tema} onChange={handleChange('tema')} placeholder="Contoh: Teks Deskripsi" />
            <InputField label="Konten" value={formData.konten} onChange={handleChange('konten')} placeholder="Contoh: Struktur dan Kebahasaan Teks" />
            <div className="grid grid-cols-2 gap-4">
                <SelectField label="Konteks" value={formData.konteks} onChange={handleChange('konteks')}>
                    <option value="PERSONAL">Personal</option>
                    <option value="SAINTIFIK">Saintifik</option>
                </SelectField>
                <SelectField label="Kompetensi" value={formData.kompetensi} onChange={handleChange('kompetensi')}>
                    <option value="MEMAHAMI">Memahami</option>
                    <option value="MENGEVALUASI">Mengevaluasi</option>
                </SelectField>
            </div>
        </div>
      </div>
      
      <div className="p-4 border rounded-md bg-white">
        <h3 className="font-semibold text-gray-800 mb-3">Bentuk dan Jumlah Soal</h3>
        <div className="space-y-3">
          {formData.questionTypes.map((qt, index) => (
            <div key={index} className="flex items-center gap-2">
              <SelectField label="" value={qt.type} onChange={handleQuestionTypeChange(index, 'type')}>
                {Object.values(BentukSoal).map(bentuk => <option key={bentuk} value={bentuk}>{bentuk}</option>)}
              </SelectField>
              <InputField label="" value={qt.count.toString()} onChange={handleQuestionTypeChange(index, 'count')} />
              <button onClick={() => removeQuestionType(index)} className="mt-5 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300" disabled={formData.questionTypes.length <= 1}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
        <button onClick={addQuestionType} className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          + Tambah Bentuk Soal
        </button>
      </div>
      
      <button onClick={onGenerate} disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Membuat Kisi-kisi...
          </>
        ) : "Buat Kisi-Kisi Sekarang"}
      </button>
    </div>
  );
};
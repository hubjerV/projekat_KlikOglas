import React, { useState } from 'react';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import FileUpload from './FileUpload';
import SelectCategory from './SelectCategory';
import SubmitButton from './SubmitButton';
import axios from 'axios';
import HeroIllustration from '../components/HeroIllustration';
;


interface OglasResponse {
  message: string;
}

const OglasForm: React.FC = () => {
  const [form, setForm] = useState({
    naslov: '',
    opis: '',
    cijena: '',
    lokacija: '',
    kontakt: '',
    kategorija: '',
  });

  const [slikeUrls, setSlikeUrls] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      ...form,
      slike: slikeUrls,
    };

    try {
      const response = await axios.post<OglasResponse>('http://localhost:8000/oglasi/', dataToSend);
      alert(response.data.message);
    } catch (error) {
      alert('Greška pri postavljanju oglasa');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Postavi novi oglas</h2>
        <InputField label="Naslov" name="naslov" value={form.naslov} onChange={handleChange} />
        <TextAreaField label="Opis" name="opis" value={form.opis} onChange={handleChange} />
        <FileUpload onUploadComplete={(urls) => setSlikeUrls(urls)} />
        <InputField label="Cijena" name="cijena" value={form.cijena} onChange={handleChange} type="number" />
        <InputField label="Lokacija" name="lokacija" value={form.lokacija} onChange={handleChange} />
        <InputField label="Kontakt" name="kontakt" value={form.kontakt} onChange={handleChange} />
        <SelectCategory value={form.kategorija} onChange={handleChange} />
        <SubmitButton />
      </form>
    </div>
  );
};

export default OglasForm;

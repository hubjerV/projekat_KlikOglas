import React, { useState } from 'react';
import InputField from './InputField';
import FileUpload from './FileUpload';
import SubmitButton from './SubmitButton';
import SelectCategory from './SelectCategory';
import axios from 'axios';
import HeroIllustration from '../components/HeroIllustration';

interface OglasResponse {
  message: string;
}

const TextAreaField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-400"
      rows={4}
      required
    />
  </div>
);

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
      //const response = await axios.post<OglasResponse>('http://localhost:8000/oglasi/', dataToSend);
      const token = localStorage.getItem("access_token");

       const response = await axios.post<OglasResponse>(
         'http://localhost:8000/oglasi/',
         dataToSend,
         {
          headers: {
          Authorization: `Bearer ${token}`,
          }
        }
      );

      alert(response.data.message);
    } catch (error) {
      alert('Greška pri postavljanju oglasa');
      console.error(error);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f9f9f9] text-[#111] overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <HeroIllustration />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border border-gray-200"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Postavi novi oglas</h2>

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
    </div>
  );
};

export default OglasForm;

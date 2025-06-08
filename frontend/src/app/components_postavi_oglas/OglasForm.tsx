import React, { useState } from 'react';
import InputField from './InputField';
import FileUpload from './FileUpload';
import SubmitButton from './SubmitButton';
import SelectCategory from './SelectCategory';
import axios from 'axios';

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
    <label className="block text-sm font-medium text-white mb-1" htmlFor={name}>
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 bg-transparent border border-gray-400 rounded text-white placeholder-gray-300"
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
      const response = await axios.post<OglasResponse>('http://localhost:8000/oglasi/', dataToSend);
      alert(response.data.message);
    } catch (error) {
      alert('Greška pri postavljanju oglasa');
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-900 w-full flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800 p-6 rounded shadow-lg mx-4 my-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Postavi novi oglas</h2>

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

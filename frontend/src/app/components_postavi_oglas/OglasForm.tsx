import React, { useState } from 'react';
import axios from 'axios';
import HeroIllustration from '../components/HeroIllustration';
import { useEffect} from 'react';

interface OglasResponse {
  message: string;
}

const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
}> = ({ label, name, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800"
      required
    />
  </div>
);

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
      className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800"
      rows={4}
      required
    />
  </div>
);

// const SelectCategory: React.FC<{
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
// }> = ({ value, onChange }) => (
//   <div className="mb-4">
//     <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
//     <select
//       name="kategorija"
//       value={value}
//       onChange={onChange}
//       className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800"
//       required
//     >
//       <option value="">-- Odaberi kategoriju --</option>
//       <option value="Tehnika">Tehnika</option>
//       <option value="Nekretnine">Nekretnine</option>
//       <option value="Automobili">Automobili</option>
//       <option value="Ostalo">Ostalo</option>
//     </select>
//   </div>
// );
const SelectCategory: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ value, onChange }) => {
  const [kategorije, setKategorije] = useState<string[]>([]);

  useEffect(() => {
    const fetchKategorije = async () => {
      const res = await fetch("http://localhost:8000/admin/users/kategorije");
      const data = await res.json();
      setKategorije(data.map((k: any) => k.naziv));
    };
    fetchKategorije();
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
      <select
        name="kategorija"
        value={value}
        onChange={onChange}
        className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800"
        required
      >
        <option value="">-- Odaberi kategoriju --</option>
        {kategorije.map((kat) => (
          <option key={kat} value={kat}>
            {kat}
          </option>
        ))}
      </select>
    </div>
  );
};


const OglasForm: React.FC = () => {
  const [form, setForm] = useState({
    naslov: '',
    opis: '',
    cijena: '',
    lokacija: '',
    kontakt: '',
    kategorija: '',
  });

  const [slike, setSlike] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("naslov", form.naslov);
    formData.append("opis", form.opis);
    formData.append("cijena", form.cijena);
    formData.append("lokacija", form.lokacija);
    formData.append("kontakt", form.kontakt);
    formData.append("kategorija", form.kategorija);

    if (slike) {
      Array.from(slike).forEach((file) => {
        formData.append("slike", file); // backend očekuje List[UploadFile]
      });
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post<OglasResponse>(
        "http://localhost:8000/oglasi-novi/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Greška pri postavljanju oglasa");
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

          {/* Input za slike */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dodaj slike</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSlike(e.target.files)}
              className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800"
            />
          </div>

          <InputField label="Cijena" name="cijena" value={form.cijena} onChange={handleChange} type="number" />
          <InputField label="Lokacija" name="lokacija" value={form.lokacija} onChange={handleChange} />
          <InputField label="Kontakt" name="kontakt" value={form.kontakt} onChange={handleChange} />
          <SelectCategory value={form.kategorija} onChange={handleChange} />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Postavi oglas
          </button>
        </form>
      </div>
    </div>
  );
};

export default OglasForm;

import React from 'react';

interface SelectCategoryProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectCategory: React.FC<SelectCategoryProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
    <select
      name="kategorija"            // <--- Dodaj ovo ovde
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2"
      required
    >
      <option value="">Odaberi kategoriju</option>
      <option value="vozila">Vozila</option>
      <option value="nekretnine">Nekretnine</option>
      <option value="elektronika">Elektronika</option>
      <option value="ostalo">Ostalo</option>
    </select>
  </div>
);


export default SelectCategory;

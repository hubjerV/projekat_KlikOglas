import React from 'react';

interface SelectCategoryProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectCategory: React.FC<SelectCategoryProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-white mb-1" htmlFor="kategorija">
      Kategorija
    </label>
    <select
      id="kategorija"
      name="kategorija"
      value={value}
      onChange={onChange}
      className="w-full p-2 bg-gray-800 border border-gray-400 rounded text-white"
    >
      <option value="">Izaberite kategoriju</option>
      <option value="vozila">Vozila</option>
      <option value="nekretnine">Nekretnine</option>
      <option value="elektronika">Elektronika</option>
      <option value="namestaj">Nameštaj</option>
    </select>
  </div>
);

export default SelectCategory;

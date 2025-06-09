// Primer InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
      {label}
    </label>

    {/* Input ima belu pozadinu, crn tekst, sivi border */}
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 bg-white border border-gray-400 rounded text-black placeholder-gray-500"
      required
    />
  </div>
);


export default InputField;

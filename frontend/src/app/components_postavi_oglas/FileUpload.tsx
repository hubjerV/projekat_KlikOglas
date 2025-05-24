import React, { useState } from 'react';

interface FileUploadProps {
  onUploadComplete: (uploadedUrls: string[]) => void;  // callback za URL-ove uploadovanih slika
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setUploading(true);

    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    try {
      const response = await fetch("http://localhost:8000/upload_slika/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Greška pri uploadu slika");
      }

      const data = await response.json();
      onUploadComplete(data.uploaded);  // prosledi URL-ove roditelju
    } catch (error) {
      console.error(error);
      alert("Neuspešan upload slika.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Dodaj slike</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full"
        disabled={uploading}
      />
      {uploading && <p>Učitavanje slika...</p>}
    </div>
  );
};

export default FileUpload;

// src/components/common/FileUpload.tsx
import React, { useState } from 'react';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  accept?: string;
  currentFileName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onChange, 
  accept = "application/pdf,image/*", 
  currentFileName 
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(currentFileName);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedFileName(file.name);
      onChange(file);
    } else {
      setSelectedFileName(undefined);
      onChange(null);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        id="file-upload"
        className="file-input"
        onChange={handleFileChange}
        accept={accept}
      />
      <label htmlFor="file-upload" className="file-label">
        Обрати файл
      </label>
      {selectedFileName && (
        <span className="file-name">{selectedFileName}</span>
      )}
    </div>
  );
};

export default FileUpload;
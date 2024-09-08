'use client'

import { useState, useCallback } from 'react';
import { WideCardFileUpload } from "@/components/wide-card-file-upload";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = useCallback((file: File | null) => {
    setUploadedFile(file);
    if (file) {
      console.log('File uploaded:', file.name, 'Size:', file.size, 'bytes');
      // You can add more arbitrary functions here
    } else {
      console.log('File removed');
      // You can add more arbitrary functions here for file removal
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <WideCardFileUpload onFileChange={handleFileUpload} />
      {uploadedFile && (
        <p className="mt-4 text-center text-sm text-gray-600">
          File "{uploadedFile.name}" uploaded successfully!
        </p>
      )}
    </div>
  );
}

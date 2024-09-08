"use client";

import { useState, useCallback } from "react";
import { WideCardFileUpload } from "@/components/wide-card-file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { pdfGenerateBamlSchema } from "./actions/extract-pdf";
import { useStream } from "./hooks/useStream";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = useCallback((file: File | null) => {
    setUploadedFile(file);
    if (file) {
      console.log("File uploaded:", file.name, "Size:", file.size, "bytes");
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      console.log("File removed");
      setPreviewUrl(null);
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <WideCardFileUpload onFileChange={handleFileUpload} />
      {uploadedFile && (
        <p className="mt-4 text-center text-sm text-gray-600">
          File "{uploadedFile.name}" uploaded successfully!
        </p>
      )}
      {uploadedFile && (
        <div className="mt-8 flex gap-8">
          <div className="w-1/2">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Uploaded file preview"
                width={500}
                height={700}
                style={{ objectFit: "contain", width: "100%", height: "auto" }}
                // placeholder color: not sure why it's not rendering yet.
                className="rounded-md bg-red-700"
              />
            )}
          </div>
          <div className="w-1/2"></div>
        </div>
      )}
    </div>
  );
}

export const RightPanel = () => {
  const { data, partialData, isComplete, isLoading, error, mutate } = useStream(
    pdfGenerateBamlSchema
  );
  return (
    <div>
      <Button
        onClick={() => {
          // call mutate with the base64 string! which will call the pdfGenerateBamlSchema server action
          // and then partialData will be updated with the new data as it streams in.
          // mutate()
        }}
        className="mb-4"
      >
        Extract
      </Button>
      <Tabs defaultValue="baml-schema">
        <TabsList>
          <TabsTrigger value="baml-schema">BAML Schema</TabsTrigger>
          <TabsTrigger value="json-output">JSON Output</TabsTrigger>
        </TabsList>
        <TabsContent value="baml-schema">
          {/* Content for BAML Schema tab */}
          <div className="p-4 bg-gray-100 text-muted-foreground rounded">
            <p>BAML Schema content goes here</p>
          </div>
        </TabsContent>
        <TabsContent value="json-output">
          {/* Content for JSON Output tab */}
          <div className="p-4 bg-gray-100 text-muted-foreground rounded">
            <p>JSON Output content goes here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

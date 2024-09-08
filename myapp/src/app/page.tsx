"use client";

import PdfToImageConverter from "@/components/PdfToImageConverter";
import XlsToImageConverter from "@/components/XlsToImageConverter";
import DocxToImageConverter from "@/components/DocxToImageConverter";
import AudioPlayer from "@/components/AudioPlayer";
import { useState, useCallback, useEffect } from "react";
import { WideCardFileUpload } from "@/components/wide-card-file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import {
  extractWithSchema,
  pdfGenerateBamlSchema,
} from "./actions/extract-pdf";
import { useStream } from "./hooks/useStream";
import { Input } from "@/components/ui/input";
import { bamlBoilerPlate } from "./constants";
import { Provider, useAtom } from "jotai";
import { atomStore, filesAtom } from "./atoms";
import { CodeMirrorViewer } from "./BAMLPreview";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileUpload = useCallback((file: File | null) => {
    setUploadedFile(file);
    if (file) {
      console.log("File uploaded:", file.name, "Size:", file.size, "bytes");
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      if (file.type.startsWith("image/")) {
        setImageUrl(url);
      } else {
        setImageUrl(null);
      }
    } else {
      console.log("File removed");
      setFileUrl(null);
      setImageUrl(null);
    }
  }, []);

  const handleConversionComplete = useCallback(
    (convertedImageUrl: string | null) => {
      setImageUrl(convertedImageUrl);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  return (
    <Provider store={atomStore}>
      <div className="w-full max-w-md mx-auto">
        <WideCardFileUpload onFileChange={handleFileUpload} />
        {uploadedFile && (
          <p className="mt-4 text-center text-sm text-gray-600">
            File "{uploadedFile.name}" uploaded successfully!
          </p>
        )}
        {fileUrl && (
          <div className="mt-4">
            {uploadedFile?.type === "application/pdf" && (
              <PdfToImageConverter
                pdfUrl={fileUrl}
                onConversionComplete={handleConversionComplete}
              />
            )}
            {uploadedFile?.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (
              <XlsToImageConverter
                xlsUrl={fileUrl}
                onConversionComplete={handleConversionComplete}
              />
            )}
            {uploadedFile?.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
              <DocxToImageConverter
                docxUrl={fileUrl}
                onConversionComplete={handleConversionComplete}
              />
            )}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Converted file"
                style={{ maxWidth: "100%" }}
              />
            ) : uploadedFile?.type.startsWith("image/") ? (
              <img
                src={fileUrl}
                alt="Uploaded image"
                style={{ maxWidth: "100%" }}
              />
            ) : uploadedFile?.type.startsWith("audio/") ? (
              <AudioPlayer audioUrl={fileUrl} />
            ) : (
              <p>Converting file to image...</p>
            )}
          </div>
        )}
      </div>
    </Provider>
  );
}

const getBase64ImageFromPath = async (imagePath: string): Promise<string> => {
  if (imagePath.startsWith("data:")) {
    // It's already a base64 string
    return imagePath;
  } else {
    // It's a path, fetch the image and convert to base64
    console.log("imagePath", imagePath);
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
};

// pass in the image base64 string to this component
export const RightPanel = ({ base64 }: { base64: string }) => {
  const [prompt, setPrompt] = useState<string | undefined>(undefined);
  const getBase64Uri = async () => {
    const url = window.location.origin + base64;
    return await getBase64ImageFromPath(url);
  };
  // TODO: need to fix the types. data and partialData are actually a string.
  const [runAllError, setRunAllError] = useState<string | undefined>(undefined);
  const {
    data: dataBaml,
    partialData: partialDataBaml,
    isLoading: isLoadingBaml,
    isComplete: isCompleteBaml,
    isError: isErrorBaml,
    error: errorBaml,
    mutate: mutateBaml,
  } = useStream(pdfGenerateBamlSchema);

  const {
    partialData: partialDataJson,
    isLoading: isLoadingJson,
    isComplete: isCompleteJson,
    isError: isErrorJson,
    error: errorJson,
    mutate: mutateJson,
  } = useStream(extractWithSchema);

  const runAll = async () => {
    try {
      console.log("mutatebaml");
      const base64Uri = await getBase64Uri();
      const data = await mutateBaml(base64Uri, prompt);
      console.log("bamlFile", data);

      console.log("mutatejson");
      if (!data) {
        throw new Error("Failed to generate BAML schema");
      }

      const res = await mutateJson(base64Uri, data + bamlBoilerPlate);
      console.log("jsonOutput", res);
      setRunAllError(undefined); // Reset error if runAll succeeds
    } catch (error) {
      console.error("Error running runAll:", error);
      setRunAllError("Failed to run extraction. Please try again.");
    }
  };

  const [projectFiles, setProjectFiles] = useAtom(filesAtom);

  useEffect(() => {
    setProjectFiles({ "baml_src/main.baml": bamlBoilerPlate });
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          runAll();
        }}
        className="mb-4"
      >
        Extract
      </Button>
      <Input
        value={prompt ?? ""}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter an optional prompt. E.g. 'focus on xyz'"
      />
      <Tabs defaultValue="baml-schema">
        <TabsList>
          <TabsTrigger value="baml-schema">BAML Schema</TabsTrigger>
          <TabsTrigger value="json-output">JSON Output</TabsTrigger>
        </TabsList>
        <TabsContent value="baml-schema">
          {/* Content for BAML Schema tab */}
          <div className="p-4 bg-gray-100 text-muted-foreground rounded">
            <CodeMirrorViewer
              lang="baml"
              // TODO: set this to the returned baml file
              shouldScrollDown={isLoadingBaml}
            />
            <p>BAML Schema content goes here</p>
            {partialDataBaml && <p>{partialDataBaml}</p>}
          </div>
        </TabsContent>
        <TabsContent value="json-output">
          {/* Content for JSON Output tab */}
          <div className="p-4 bg-gray-100 text-muted-foreground rounded">
            <p>JSON Output content goes here</p>
            {partialDataJson && <p>{partialDataJson}</p>}
          </div>
        </TabsContent>
      </Tabs>
      {runAllError && <div className="text-red-500">{runAllError}</div>}
    </div>
  );
};

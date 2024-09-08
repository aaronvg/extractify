"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  DragEvent,
} from "react";
import ReactDOM from "react-dom/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  Send,
  FileText,
  File as FileIcon,
  Mic,
  FileSpreadsheet,
  FileImage,
  Music,
} from "lucide-react";
import PdfToImageConverter from "@/components/PdfToImageConverter";
import XlsToImageConverter from "@/components/XlsToImageConverter";
import DocxToImageConverter from "@/components/DocxToImageConverter";
import ExtractifyComponent from "./ExtractifyComponent";
import Header from "@/components/Header";
import exampleFiles from "@/examples";
// import { ExampleFile } from '../types/file-types'

const getSuggestions = (fileType: string) => {
  switch (fileType) {
    case "application/pdf":
      return [
        "Extract all headings and subheadings from the PDF.",
        "Summarize the main points of each page in bullet points.",
        "Identify and list any tables or figures in the document.",
        "Extract all references or citations from the PDF.",
      ];
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return [
        "Summarize the data in each sheet of the Excel file.",
        "Identify the top 5 highest values in a specific column.",
        "Calculate the average, median, and mode for a numerical column.",
        "Extract all unique values from a specific column.",
      ];
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return [
        "Extract all the text content and summarize it in bullet points.",
        "Identify and list all formatting styles used in the document.",
        "Extract all comments and tracked changes in the document.",
        "List all hyperlinks present in the document.",
      ];
    case "image/jpeg":
    case "image/png":
      return [
        "Describe the main elements visible in the image.",
        "Identify any text present in the image.",
        "Detect and list the colors used in the image.",
        "Estimate the number of people or objects in the image.",
      ];
    case "audio/mpeg":
      return [
        "Transcribe the audio content.",
        "Identify the main speakers in the audio.",
        "Summarize the key points discussed in the audio.",
        "Detect any background noises or music in the audio.",
      ];
    default:
      return [
        "Extract all the text content from the file and summarize it in bullet points.",
        "Analyze the sentiment of the content and provide a brief explanation of the overall tone.",
        "Identify and list the top 5 most frequently occurring keywords in the file.",
        "Generate a concise abstract of the file's content, highlighting its main ideas and conclusions.",
      ];
  }
};

export function ExtractifyChat() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(
    null
  );
  const [input, setInput] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [messages, setMessages] = useState<
    { text: string; schema: string; data: string }[]
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInput(transcript);
      };
    }
  }, []);

  useEffect(() => {
    if (isListening) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
  }, [isListening]);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Handle the dropped file
      // You might want to create an ExampleFile object here
      // setSelectedFile(...)
    }
  };

  const convertFile = async (file: File): Promise<string | null> => {
    const fileUrl = URL.createObjectURL(file);
    let convertedImage: string | null = null;

    if (file.type === "application/pdf") {
      convertedImage = await new Promise((resolve) => {
        const converter = document.createElement("div");
        document.body.appendChild(converter);
        const root = ReactDOM.createRoot(converter);
        root.render(
          <PdfToImageConverter
            pdfUrl={fileUrl}
            onConversionComplete={(imageUrl) => {
              root.unmount();
              document.body.removeChild(converter);
              resolve(imageUrl);
            }}
          />
        );
      });
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      convertedImage = await new Promise((resolve) => {
        const converter = document.createElement("div");
        document.body.appendChild(converter);
        const root = ReactDOM.createRoot(converter);
        root.render(
          <XlsToImageConverter
            xlsUrl={fileUrl}
            onConversionComplete={(imageUrl) => {
              root.unmount();
              document.body.removeChild(converter);
              resolve(imageUrl);
            }}
          />
        );
      });
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      convertedImage = await new Promise((resolve) => {
        const converter = document.createElement("div");
        document.body.appendChild(converter);
        const root = ReactDOM.createRoot(converter);
        root.render(
          <DocxToImageConverter
            docxUrl={fileUrl}
            onConversionComplete={(imageUrl) => {
              root.unmount();
              document.body.removeChild(converter);
              resolve(imageUrl);
            }}
          />
        );
      });
    }

    return convertedImage;
  };

  const handleFileSelect = useCallback(async (selectedFile: any) => {
    setSelectedFile(selectedFile);
    setFile(null);
    setConvertedImageUrl(null);
    setIsConverting(true);

    try {
      console.log("selectedFile", selectedFile);
      console.log("selectedFile.url", selectedFile.url);
      const response = await fetch(selectedFile.url);
      console.log("response", response);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const file = new File([blob], selectedFile.name, {
        type: selectedFile.type,
      });
      await handleFile(file, selectedFile.url);
    } catch (error) {
      console.error("Error loading example file:", error);
      setIsConverting(false);
    }
  }, []);

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

  const handleFile = useCallback(
    async (uploadedFile: File, uploadedFileUrl?: string) => {
      setFile(uploadedFile);
      setConvertedImageUrl(null);
      setIsConverting(true);

      if (
        uploadedFile.type === "application/pdf" ||
        uploadedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        uploadedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const convertedImage = await convertFile(uploadedFile);
        setConvertedImageUrl(convertedImage);
      } else if (uploadedFile.type.startsWith("image/")) {
        if (!uploadedFileUrl) {
          throw new Error("No URL provided for image");
        }
        const imageUri = await getBase64ImageFromPath(uploadedFileUrl);
        console.log("imageUri", imageUri);
        setConvertedImageUrl(imageUri);
      } else if (uploadedFile.type.startsWith("audio/")) {
        setConvertedImageUrl(URL.createObjectURL(uploadedFile));
      }

      setIsConverting(false);
    },
    []
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setConvertedImageUrl(null);
  };

  const handleExtract = () => {
    if (convertedImageUrl) {
      setMessages((prev) => [
        { text: input, data: convertedImageUrl, schema: "image/png" },
        ...prev,
      ]);
      setInput("");
    }
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Implement voice input logic here
  };

  const renderPreview = () => {
    if (isConverting) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <span>Converting...</span>
        </div>
      );
    }

    if (convertedImageUrl) {
      if (file?.type.startsWith("audio/")) {
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <Music className="w-16 h-16 mb-4 text-purple-500" />
            <audio controls className="w-full max-w-md">
              <source src={convertedImageUrl} type={file.type} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      }
      return (
        <img
          src={convertedImageUrl}
          alt="Preview"
          className="max-w-full h-auto"
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <FileIcon className="w-16 h-16 mr-2" />
        <span>Preview for {file?.name}</span>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-50 text-gray-900 relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Header onFileSelect={handleFileSelect} selectedFile={selectedFile} />
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center text-blue-500">
            <Upload className="mx-auto h-16 w-16 mb-4" />
            <p className="text-2xl font-medium">Drop files here</p>
            <p className="text-sm mt-2">100mb limit</p>
          </div>
        </div>
      )}
      <div
        className={`flex-1 flex flex-col ${
          isPreviewOpen && file ? "mr-[45%]" : ""
        } transition-all duration-300`}
      >
        <ScrollArea className="flex-1 p-4 flex flex-col">
          {messages.map((message, index) => (
            <ExtractifyComponent
              key={index}
              prompt={message.text}
              content={message.data}
            />
          ))}
        </ScrollArea>
        {file && (
          <div className="border-t border-gray-200 p-4">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Suggestions:
              </p>
              <div className="space-y-2">
                {getSuggestions(file.type).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left text-sm bg-gray-50 hover:bg-gray-100"
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter extraction instructions..."
                className="pr-24 resize-none bg-gray-50 border-gray-200 min-h-[150px] text-gray-900 w-full text-base"
                onFocus={() => setIsListening(true)}
                onBlur={() => setIsListening(false)}
              />
              <div className="absolute right-2 bottom-2 flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Upload className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceInput}
                  className={`text-gray-500 hover:text-gray-700 ${
                    isRecording ? "bg-red-100" : ""
                  }`}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleExtract}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Extract
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {file && (
        <div
          className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 transition-all duration-300 ${
            isPreviewOpen ? "w-[45%]" : "w-0"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePreview}
            className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2"
          >
            {isPreviewOpen ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          {isPreviewOpen && (
            <div className="h-full p-4 overflow-auto">{renderPreview()}</div>
          )}
        </div>
      )}
      {!file && !isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Button
              variant="ghost"
              size="lg"
              className="text-gray-500 hover:text-gray-700 pointer-events-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mb-2" />
              <span className="sr-only">Upload file</span>
            </Button>
            <p className="text-lg font-medium text-gray-500">
              Drag or Upload files to Start!
            </p>
            <p className="text-sm mt-2 text-gray-400">
              upload your own, or try one of these.
            </p>
          </div>
        </div>
      )}
      <input
        type="file"
        onChange={handleFileInput}
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  );
}

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  File as FileIcon,
  Music,
  Camera,
} from "lucide-react";

import exampleFiles from "@/examples";

interface ExampleFile {
  name: string;
  type: string;
  url: string;
}

interface HeaderProps {
  onFileSelect: (file: ExampleFile) => void;
  selectedFile: ExampleFile | null;
}

const Header: React.FC<HeaderProps> = ({ onFileSelect, selectedFile }) => {
  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="w-6 h-6" />;
    if (type.includes("sheet")) return <FileSpreadsheet className="w-6 h-6" />;
    if (type.includes("image")) return <FileImage className="w-6 h-6" />;
    if (type.includes("audio")) return <Music className="w-6 h-6" />;
    // webcame
    if (type.includes("webcam")) return <Camera className="w-6 h-6" />;
    return <FileIcon className="w-6 h-6" />;
  };

  const getFileColor = (type: string) => {
    if (type.includes("pdf")) return "bg-red-100 text-red-600";
    if (type.includes("sheet")) return "bg-green-100 text-green-600";
    if (type.includes("image")) return "bg-blue-100 text-blue-600";
    if (type.includes("audio")) return "bg-purple-100 text-purple-600";
    if (type.includes("document")) return "bg-yellow-100 text-yellow-600";
    if (type.includes("webcam")) return "bg-gray-100 text-gray-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <ScrollArea className="w-full">
        <div className="flex space-x-4 overflow-x-auto max-w-[500px]">
          {exampleFiles.map((file, index) => (
            <Button
              key={index}
              variant={selectedFile?.name === file.name ? "default" : "ghost"}
              className={`w-20 h-20 flex flex-col items-center justify-center text-xs p-2 rounded-lg transition-all ${
                selectedFile?.name === file.name
                  ? "ring-2 ring-offset-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => onFileSelect(file)}
            >
              <div className={`rounded-full p-2 ${getFileColor(file.type)}`}>
                {getFileIcon(file.type)}
              </div>
              <div className="mt-2 text-center overflow-hidden text-ellipsis w-full">
                {file.name.split(".")[0]}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </header>
  );
};

export default Header;

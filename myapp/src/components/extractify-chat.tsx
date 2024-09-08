'use client'

import React, { useState, useRef, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronLeft, Upload, X, Send, FileText, File as FileIcon, Mic, FileSpreadsheet, FileImage, Music } from 'lucide-react'
import PdfToImageConverter from "@/components/PdfToImageConverter"
import XlsToImageConverter from "@/components/XlsToImageConverter"
import DocxToImageConverter from "@/components/DocxToImageConverter"
import ExtractifyComponent from './ExtractifyComponent'
import Header from "@/components/Header"
import exampleFiles from '@/examples'

const suggestions = [
  "Extract all the text content from the uploaded file and summarize it in bullet points.",
  "Analyze the sentiment of the document and provide a brief explanation of the overall tone.",
  "Identify and list the top 5 most frequently occurring keywords in the document.",
  "Generate a concise abstract of the document, highlighting its main ideas and conclusions.",
]

interface ExampleFile {
  name: string;
  type: string;
  url: string;
}

export function ExtractifyChat() {
  const [file, setFile] = useState<File | null>(null)
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(true)
  const [messages, setMessages] = useState<{ text: string; schema: string; data: string }[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<ExampleFile | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const convertFile = async (file: File): Promise<string | null> => {
    const fileUrl = URL.createObjectURL(file)
    let convertedImage: string | null = null

    if (file.type === 'application/pdf') {
      convertedImage = await new Promise((resolve) => {
        const converter = document.createElement('div')
        document.body.appendChild(converter)
        const root = ReactDOM.createRoot(converter)
        root.render(
          <PdfToImageConverter pdfUrl={fileUrl} onConversionComplete={(imageUrl) => {
            root.unmount()
            document.body.removeChild(converter)
            resolve(imageUrl)
          }} />
        )
      })
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      convertedImage = await new Promise((resolve) => {
        const converter = document.createElement('div')
        document.body.appendChild(converter)
        const root = ReactDOM.createRoot(converter)
        root.render(
          <XlsToImageConverter xlsUrl={fileUrl} onConversionComplete={(imageUrl) => {
            root.unmount()
            document.body.removeChild(converter)
            resolve(imageUrl)
          }} />
        )
      })
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      convertedImage = await new Promise((resolve) => {
        const converter = document.createElement('div')
        document.body.appendChild(converter)
        const root = ReactDOM.createRoot(converter)
        root.render(
          <DocxToImageConverter docxUrl={fileUrl} onConversionComplete={(imageUrl) => {
            root.unmount()
            document.body.removeChild(converter)
            resolve(imageUrl)
          }} />
        )
      })
    }

    return convertedImage
  }

  const handleFileSelect = useCallback(async (selectedFile: ExampleFile) => {
    setSelectedFile(selectedFile)
    setFile(null)
    setConvertedImageUrl(null)
    setIsConverting(true)

    try {
      const response = await fetch(selectedFile.url)
      if (!response.ok) throw new Error('Network response was not ok')
      const blob = await response.blob()
      const file = new File([blob], selectedFile.name, { type: selectedFile.type })
      await handleFile(file)
    } catch (error) {
      console.error('Error loading example file:', error)
      setIsConverting(false)
    }
  }, [])

  const handleFile = useCallback(async (uploadedFile: File) => {
    setFile(uploadedFile)
    setConvertedImageUrl(null)
    setIsConverting(true)

    if (uploadedFile.type === 'application/pdf' ||
        uploadedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const convertedImage = await convertFile(uploadedFile)
      setConvertedImageUrl(convertedImage)
    } else if (uploadedFile.type.startsWith('image/')) {
      setConvertedImageUrl(URL.createObjectURL(uploadedFile))
    } else if (uploadedFile.type.startsWith('audio/')) {
      setConvertedImageUrl(URL.createObjectURL(uploadedFile))
    }

    setIsConverting(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
    setConvertedImageUrl(null)
  }

  const handleExtract = () => {
    if (convertedImageUrl) {
      setMessages(prev => [{ text: input, data: convertedImageUrl, schema: "image/png" }, ...prev])
      setInput('')
    }
  }

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen)
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
    // Implement voice input logic here
  }

  const renderPreview = () => {
    if (isConverting) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <span>Converting...</span>
        </div>
      )
    }

    if (convertedImageUrl) {
      if (file?.type.startsWith('audio/')) {
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <Music className="w-16 h-16 mb-4 text-purple-500" />
            <audio controls className="w-full max-w-md">
              <source src={convertedImageUrl} type={file.type} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )
      }
      return (
        <img 
          src={convertedImageUrl} 
          alt="Preview" 
          className="max-w-full h-auto"
        />
      )
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <FileIcon className="w-16 h-16 mr-2" />
        <span>Preview for {file?.name}</span>
      </div>
    )
  }

  return (
    <div 
      className="flex flex-col h-screen bg-gray-50 text-gray-900 relative"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
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
      <div className={`flex-1 flex flex-col ${isPreviewOpen && file ? 'mr-[45%]' : ''} transition-all duration-300`}>
        <ScrollArea className="flex-1 p-4 flex flex-col">
          {messages.map((message, index) => (
            <ExtractifyComponent key={index} prompt={message.text}
              content={message.data}
            />
          ))}
          {messages.length === 0 && file && (
            <>
              <div className="flex-grow" />
              <div className="flex flex-col items-center justify-end">
                <p className="text-lg font-medium text-gray-500 mb-4">Try one of these suggestions:</p>
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full max-w-2xl justify-start text-left text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 mb-2 p-3 rounded-lg transition-colors"
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </>
          )}
        </ScrollArea>
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter extraction instructions..."
              className="pr-24 resize-none bg-gray-50 border-gray-200 min-h-[150px] text-gray-900 w-full"
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
                className={`text-gray-500 hover:text-gray-700 ${isRecording ? 'bg-red-100' : ''}`}
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button onClick={handleExtract} className="bg-blue-500 text-white hover:bg-blue-600">
                Extract
              </Button>
            </div>
          </div>
        </div>
      </div>
      {file && (
        <div className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 transition-all duration-300 ${isPreviewOpen ? 'w-[45%]' : 'w-0'}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePreview}
            className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2"
          >
            {isPreviewOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          {isPreviewOpen && (
            <div className="h-full p-4 overflow-auto">
              {renderPreview()}
            </div>
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
            <p className="text-lg font-medium text-gray-500">Drag or Upload files to Start!</p>
            <p className="text-sm mt-2 text-gray-400">upload your own, or try one of these.</p>
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
  )
}

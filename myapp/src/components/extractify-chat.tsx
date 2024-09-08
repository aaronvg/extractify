'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronLeft, Upload, X, Send, FileText, File, Mic } from 'lucide-react'

export function ExtractifyChat() {
  const [file, setFile] = useState<File | null>(null)
  const [input, setInput] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(true)
  const [messages, setMessages] = useState<{ text: string; schema: string; data: string }[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  const handleExtract = () => {
    if (input.trim() || file) {
      const schema = `{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" },
    "city": { "type": "string" }
  },
  "required": ["name", "age"]
}`
      const data = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}`
      setMessages(prev => [...prev, { text: input, schema, data }])
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

  return (
    <div 
      className="flex h-screen bg-gray-50 text-gray-900 relative"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
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
        <ScrollArea className="flex-1 p-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-4 bg-white rounded-lg p-3 shadow-sm">
              <p className="mb-2">{message.text}</p>
              <Tabs defaultValue="schema" className="w-full">
                <TabsList>
                  <TabsTrigger value="schema">JSON Schema</TabsTrigger>
                  <TabsTrigger value="data">JSON Data</TabsTrigger>
                </TabsList>
                <TabsContent value="schema">
                  <pre className="bg-gray-100 p-2 rounded overflow-x-auto"><code>{message.schema}</code></pre>
                </TabsContent>
                <TabsContent value="data">
                  <pre className="bg-gray-100 p-2 rounded overflow-x-auto"><code>{message.data}</code></pre>
                </TabsContent>
              </Tabs>
            </div>
          ))}
        </ScrollArea>
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter extraction instructions..."
              className="pr-24 resize-none bg-gray-50 border-gray-200 min-h-[100px] text-gray-900 w-full"
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
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">File Preview</h3>
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-grow border rounded-lg">
                <div className="p-4 min-h-full flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <File className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm">{file.name}</p>
                      <p className="text-xs mt-2">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
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
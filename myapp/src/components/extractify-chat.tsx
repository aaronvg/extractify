'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { FileIcon, Upload, X, Send, Mic, Music, FileText, FileImage, File } from 'lucide-react'

const suggestions = [
  "Extract all the text content from the uploaded file and summarize it in bullet points.",
  "Analyze the sentiment of the document and provide a brief explanation of the overall tone.",
  "Identify and list the top 5 most frequently occurring keywords in the document.",
  "Generate a concise abstract of the document, highlighting its main ideas and conclusions.",
]

export function ExtractifyChat() {
  const [files, setFiles] = useState<File[]>([])
  const [input, setInput] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<{ text: string; files: string[] }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (newFiles: FileList) => {
    setFiles(prevFiles => [...prevFiles, ...Array.from(newFiles)])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove))
  }

  const handleExtract = () => {
    if (input.trim() || files.length > 0) {
      setMessages(prev => [...prev, { text: input, files: files.map(f => f.name) }])
      setInput('')
      setFiles([])
    }
  }

  const handleVoiceInput = () => {
    setIsRecording(true)
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream)
        const audioChunks: BlobPart[] = []

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data)
        })

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
          const audioFile = new File([audioBlob], "voice-input.wav", { type: 'audio/wav' })
          setFiles(prevFiles => [...prevFiles, audioFile])
          setIsRecording(false)
        })

        mediaRecorder.start()

        setTimeout(() => {
          mediaRecorder.stop()
          stream.getTracks().forEach(track => track.stop())
        }, 5000) // Stop recording after 5 seconds
      })
      .catch(error => {
        console.error("Error accessing microphone:", error)
        setIsRecording(false)
      })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="w-5 h-5" />
    if (fileType.startsWith('audio/')) return <Music className="w-5 h-5" />
    if (fileType.startsWith('video/')) return <FileIcon className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  return (
    <div 
      className="flex flex-col h-screen bg-gray-50 text-gray-900 relative"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className={`flex-1 overflow-auto p-4 transition-opacity duration-300 ${dragActive ? 'opacity-0' : 'opacity-100'}`}>
        {messages.map((message, index) => (
          <div key={index} className="mb-4 bg-white rounded-lg p-3 shadow-sm">
            <p className="mb-2">{message.text}</p>
            {message.files.length > 0 && (
              <div className="text-sm text-gray-500">
                Files: {message.files.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={`border-t border-gray-200 p-4 bg-white transition-opacity duration-300 ${dragActive ? 'opacity-0' : 'opacity-100'}`}>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <div className="relative flex items-center bg-gray-100 rounded-lg w-64 h-12 group p-2">
                    <div className="flex items-center overflow-hidden flex-1 mr-2">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 rounded">
                        {getFileIcon(file.type)}
                      </div>
                      <span className="ml-2 text-sm truncate text-gray-700 flex-1">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
                      onClick={() => removeFile(file)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-0 overflow-hidden bg-white shadow-lg rounded-lg border-none">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold truncate text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {file.type || 'Unknown'} - {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <div className="flex items-center justify-center h-64 bg-gray-50">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : file.type.startsWith('audio/') ? (
                      <audio controls className="w-full max-w-[90%]">
                        <source src={URL.createObjectURL(file)} type={file.type} />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <div className="text-center text-gray-400">
                        <File className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-sm">Preview not available</p>
                      </div>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        )}
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter extraction instructions..."
            className="pr-24 resize-none bg-gray-50 border-gray-200 min-h-[100px] text-gray-900"
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
      {files.length === 0 && !dragActive && (
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
            <p className="text-lg font-medium text-gray-500">Drag or upload files to start!</p>
            <p className="text-sm mt-2 text-gray-400">100mb limit</p>
          </div>
        </div>
      )}
      {files.length > 0 && !dragActive && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center space-y-2 pointer-events-none">
          <div className="max-w-2xl w-full pointer-events-auto">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 mb-2 p-3 rounded-lg transition-colors"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
      {dragActive && (
        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center z-50">
          <div className="text-center text-blue-500">
            <Upload className="mx-auto h-16 w-16 mb-4" />
            <p className="text-2xl font-medium">Drop files here</p>
            <p className="text-sm mt-2">100mb limit</p>
          </div>
        </div>
      )}
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="hidden"
        ref={fileInputRef}
      />
      <input
        type="file"
        accept="audio/*"
        capture="user"
        onChange={handleFileInput}
        className="hidden"
        ref={audioInputRef}
      />
    </div>
  )
}
'use client'

import { useState, useRef, DragEvent, ChangeEvent, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { FileIcon, X } from 'lucide-react'

interface WideCardFileUploadProps {
  onFileChange: (file: File | null) => void;
}

export function WideCardFileUpload({ onFileChange }: WideCardFileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleFileSelected = useCallback((selectedFile: File | null) => {
    setFile(selectedFile)
    onFileChange(selectedFile)
  }, [onFileChange])

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0])
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    onFileChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <Card className="w-[450px] h-[200px] mx-auto">
      <CardContent className="p-0 h-full">
        <div
          className="relative w-full h-full flex items-center justify-between px-6 cursor-pointer overflow-hidden"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={handleChange}
            className="hidden"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={file ? 'file' : 'placeholder'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2 flex-1 min-w-0"
            >
              <FileIcon className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {file ? file.name : 'Click or drag file to upload'}
              </span>
            </motion.div>
          </AnimatePresence>
          {file && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          )}
          <motion.div
            className="absolute inset-0 bg-primary/5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: dragActive ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
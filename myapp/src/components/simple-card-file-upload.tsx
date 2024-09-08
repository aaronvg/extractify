'use client'

import React,{ useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import { FileIcon } from 'lucide-react'

interface SimpleCardFileUploadProps {
  onFileUpload: (file: File) => void;
}

export function SimpleCardFileUpload({ onFileUpload }: SimpleCardFileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const uploadedFile = e.dataTransfer.files[0];
      setFile(uploadedFile)
      onFileUpload(uploadedFile)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile)
      onFileUpload(uploadedFile)
    }
  }

  return (
    <Card className="w-[350px] h-[200px] mx-auto">
      <CardContent className="p-0 h-full">
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleFileDrop}
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
              className="flex items-center space-x-2 px-4"
            >
              <FileIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : 'Click or drag file to upload'}
              </span>
            </motion.div>
          </AnimatePresence>
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
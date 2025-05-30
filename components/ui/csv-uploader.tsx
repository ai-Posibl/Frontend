"use client"

import type * as React from "react"
import { useRef, useState } from "react"
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CSVUploaderProps {
  onFileChange: (file: File | null) => void
  className?: string
}

export function CSVUploader({ onFileChange, className }: CSVUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    // Check if file is a CSV
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return false
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit")
      return false
    }

    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
        onFileChange(droppedFile)
      } else {
        onFileChange(null)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setError(null)

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
        onFileChange(selectedFile)
      } else {
        onFileChange(null)
      }
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    onFileChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          dragActive ? "border-[#b5d333] bg-[#f8faed]" : "border-gray-300 bg-gray-50",
          file ? "py-4" : "py-8",
          error ? "border-red-300 bg-red-50" : "",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!file ? handleClick : undefined}
      >
        <input ref={inputRef} type="file" accept=".csv" onChange={handleChange} className="hidden" id="csv-upload" />

        {!file && !error && (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-3" />
            <p className="text-gray-700 font-medium mb-1">Upload CSV File</p>
            <p className="text-gray-500 text-sm">Click or drag and drop your file here</p>
            <p className="text-gray-400 text-xs mt-2">Maximum file size: 5MB</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
            <p className="text-red-600 font-medium mb-1">{error}</p>
            <p className="text-gray-500 text-sm">Please try again with a valid CSV file</p>
          </div>
        )}

        {file && !error && (
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-[#b5d333] mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-800 truncate max-w-[200px]">{file.name}</p>
                <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveFile()
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

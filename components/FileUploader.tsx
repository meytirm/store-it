'use client'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

function FileUploader({ ownerId, accountId, className }: Props) {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn('uploader-button', className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag &#39;n&#39; drop some files here, or click to select files</p>
      )}
    </div>
  )
}

export default FileUploader

interface Props {
  ownerId: string
  accountId: string
  className?: string
}

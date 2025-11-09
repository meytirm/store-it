'use client'
import { useCallback, useState, type MouseEvent } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from '@/components/Thumbnail'

function FileUploader({ ownerId, accountId, className }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  function handleRemoveFile(e: MouseEvent<HTMLImageElement>, fileName: string) {
    e.preventDefault()
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

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
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading...</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name)

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="preview-item-name">{file.name}</div>
                  <Image
                    src="/assets/icons/file-loader.gif"
                    alt="loader"
                    width={80}
                    height={26}
                  />
                </div>
                <Image
                  src="/assets/icons/file-loader.gif"
                  alt="Remove"
                  height={26}
                  width={26}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            )
          })}
        </ul>
      )}
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

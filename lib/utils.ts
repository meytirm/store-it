import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { FileType } from 'next/dist/lib/file-exists'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseStringify(value: unknown) {
  return JSON.parse(JSON.stringify(value))
}

export function getFileType(fileName: string) {
  const extension = fileName.toLowerCase().split('.').pop() ?? ''

  const map: Record<string, string> = {
    // images
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    webp: 'image',
    svg: 'image',
    bmp: 'image',
    tiff: 'image',
    // video
    mp4: 'video',
    mov: 'video',
    webm: 'video',
    mkv: 'video',
    avi: 'video',
    // audio
    mp3: 'audio',
    wav: 'audio',
    ogg: 'audio',
    m4a: 'audio',
    flac: 'audio',
    // documents / text
    pdf: 'document',
    doc: 'document',
    docx: 'document',
    xls: 'document',
    xlsx: 'document',
    ppt: 'document',
    pptx: 'document',
    txt: 'text',
    md: 'text',
    csv: 'text',
    // code
    js: 'code',
    jsx: 'code',
    ts: 'code',
    tsx: 'code',
    json: 'code',
    html: 'code',
    css: 'code',
    // archives
    zip: 'archive',
    rar: 'archive',
    '7z': 'archive',
    tar: 'archive',
    gz: 'archive',
  }

  return {
    type: extension ? (map[extension] ?? 'unknown') : 'unknown',
    extension,
  }
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export const getFileIcon = (
  extension: string | undefined,
  type: FileType | string,
) => {
  switch (extension) {
    // Document
    case 'pdf':
      return '/assets/icons/file-pdf.svg'
    case 'doc':
      return '/assets/icons/file-doc.svg'
    case 'docx':
      return '/assets/icons/file-docx.svg'
    case 'csv':
      return '/assets/icons/file-csv.svg'
    case 'txt':
      return '/assets/icons/file-txt.svg'
    case 'xls':
    case 'xlsx':
      return '/assets/icons/file-document.svg'
    // Image
    case 'svg':
      return '/assets/icons/file-image.svg'
    // Video
    case 'mkv':
    case 'mov':
    case 'avi':
    case 'wmv':
    case 'mp4':
    case 'flv':
    case 'webm':
    case 'm4v':
    case '3gp':
      return '/assets/icons/file-video.svg'
    // Audio
    case 'mp3':
    case 'mpeg':
    case 'wav':
    case 'aac':
    case 'flac':
    case 'ogg':
    case 'wma':
    case 'm4a':
    case 'aiff':
    case 'alac':
      return '/assets/icons/file-audio.svg'

    default:
      switch (type) {
        case 'image':
          return '/assets/icons/file-image.svg'
        case 'document':
          return '/assets/icons/file-document.svg'
        case 'video':
          return '/assets/icons/file-video.svg'
        case 'audio':
          return '/assets/icons/file-audio.svg'
        default:
          return '/assets/icons/file-other.svg'
      }
  }
}

export const constructFileUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
}

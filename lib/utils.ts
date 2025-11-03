import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseStringify(value: unknown) {
  return JSON.parse(JSON.stringify(value))
}

export function getFileType(fileName: string) {
  const extension = fileName.toLowerCase().split('.').pop()

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

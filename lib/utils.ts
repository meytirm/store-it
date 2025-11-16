import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { FileType } from 'next/dist/lib/file-exists'
import { TotalSpace } from '@/types'

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
    mp4: 'media',
    mov: 'media',
    webm: 'media',
    mkv: 'media',
    avi: 'media',
    // audio
    mp3: 'media',
    wav: 'media',
    ogg: 'media',
    m4a: 'media',
    flac: 'media',
    // documents / text
    pdf: 'document',
    doc: 'document',
    docx: 'document',
    xls: 'document',
    xlsx: 'document',
    ppt: 'document',
    pptx: 'document',
    txt: 'document',
    md: 'document',
    csv: 'document',
  }

  return {
    type: extension ? (map[extension] ?? 'other') : 'other',
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

export const convertFileSize = (sizeInBytes: number, digits?: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + ' Bytes' // Less than 1 KB, show in Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024
    return sizeInKB.toFixed(digits || 1) + ' KB' // Less than 1 MB, show in KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024)
    return sizeInMB.toFixed(digits || 1) + ' MB' // Less than 1 GB, show in MB
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024)
    return sizeInGB.toFixed(digits || 1) + ' GB' // 1 GB or more, show in GB
  }
}

export const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString) return '—'

  const date = new Date(isoString)

  let hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? 'pm' : 'am'

  hours = hours % 12 || 12

  const time = `${hours}:${minutes.toString().padStart(2, '0')}${period}`
  const day = date.getDate()
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const month = monthNames[date.getMonth()]

  return `${time}, ${day} ${month}`
}

export const constructDownloadUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
}

export const getFileTypesParams = (type: string) => {
  switch (type) {
    case 'documents':
      return ['document']
    case 'images':
      return ['image']
    case 'media':
      return ['video', 'audio']
    case 'others':
      return ['other']
    default:
      return ['document']
  }
}

export const calculatePercentage = (sizeInBytes: number) => {
  const totalSizeInBytes = 2 * 1024 * 1024 * 1024 // 2GB in bytes
  const percentage = (sizeInBytes / totalSizeInBytes) * 100
  return Number(percentage.toFixed(2))
}

export const getUsageSummary = (totalSpace: TotalSpace) => {
  return [
    {
      title: 'Documents',
      size: totalSpace.document.size,
      latestDate: totalSpace.document.latestDate,
      icon: '/assets/icons/file-document-light.svg',
      url: '/documents',
    },
    {
      title: 'Images',
      size: totalSpace.image.size,
      latestDate: totalSpace.image.latestDate,
      icon: '/assets/icons/file-image-light.svg',
      url: '/images',
    },
    {
      title: 'Media',
      size: totalSpace.video.size + totalSpace.audio.size,
      latestDate:
        totalSpace.video.latestDate > totalSpace.audio.latestDate
          ? totalSpace.video.latestDate
          : totalSpace.audio.latestDate,
      icon: '/assets/icons/file-video-light.svg',
      url: '/media',
    },
    {
      title: 'Others',
      size: totalSpace.other.size,
      latestDate: totalSpace.other.latestDate,
      icon: '/assets/icons/file-other-light.svg',
      url: '/others',
    },
  ]
}

import Image from 'next/image'
import { cn, getFileIcon } from '@/lib/utils'

function Thumbnail({ type, extension, url, imageClassName, className }: Props) {
  const isImage = type === 'image' && extension !== 'svg'
  const imageSrc = isImage ? url : getFileIcon(extension, type)
  return (
    <figure className={cn('thumbnail', className)}>
      <Image
        src={imageSrc}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          'size-8 object-contain',
          imageClassName,
          isImage && 'thumbnail-image',
        )}
      />
    </figure>
  )
}

export default Thumbnail

interface Props {
  type: string
  extension: string
  url: string
  imageClassName?: string
  className?: string
}

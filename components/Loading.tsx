import Image from 'next/image'

function Loading({
  isLoading,
  isDark = true,
}: {
  isLoading: boolean
  isDark?: boolean
}) {
  const imageSrc = isDark
    ? '/assets/icons/loader.svg'
    : '/assets/icons/loader-brand.svg'
  return (
    isLoading && (
      <Image
        src={imageSrc}
        alt="loader"
        width={24}
        height={24}
        className="animate-spin"
      />
    )
  )
}

export default Loading

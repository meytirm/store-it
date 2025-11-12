import Image from 'next/image'

function Loading({ isLoading }: { isLoading: boolean }) {
  return (
    isLoading && (
      <Image
        src="/assets/icons/loader.svg"
        alt="loader"
        width={24}
        height={24}
        className="animate-spin"
      />
    )
  )
}

export default Loading

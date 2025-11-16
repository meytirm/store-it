'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/actions/file.actions'
import { FileInterface } from '@/types'
import Thumbnail from '@/components/Thumbnail'
import FormattedDateTime from '@/components/FormattedDateTime'
import { useDebounce } from 'use-debounce'
import Loading from '@/components/Loading'

function Search() {
  const [query, setQuery] = useState('')
  const searchParms = useSearchParams()
  const searchQuery = searchParms.get('query') || ''
  const [results, setResults] = useState<FileInterface[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const path = usePathname()
  const [debouncedQuery] = useDebounce(query, 300)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true)
      if (debouncedQuery.length === 0) {
        setResults([])
        setOpen(false)
        setIsLoading(false)
        return router.push(path.replace(searchParms.toString(), ''))
      }
      try {
        const files = await getFiles({ types: [], searchText: query })
        setResults(files.rows)
        setOpen(true)
      } catch (error) {
        console.error('Error fetching files:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiles()
  }, [debouncedQuery])
  useEffect(() => {
    if (!searchQuery) {
      setQuery('')
    }
  }, [searchQuery])

  const handleClickItem = (file: FileInterface) => {
    setOpen(false)
    setResults([])

    router.push(`/${file.type + 's'}?query=${query}`)
  }

  return (
    <div className="search">
      <div className="search-input-wrapper">
        {isLoading ? (
          <Loading isLoading={true} isDark={false} />
        ) : (
          <Image
            src="/assets/icons/search.svg"
            alt="Search"
            width={24}
            height={24}
          />
        )}
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file: FileInterface) => (
                <li
                  onClick={() => handleClickItem(file)}
                  className="flex items-center justify-between"
                  key={file.$id}
                >
                  <div className="flex cursor-pointer items-center gap-3">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Search

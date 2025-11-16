import { FileInterface, SearchParamProps } from '@/types'
import Sort from '@/components/Sort'
import { getFiles } from '@/lib/actions/file.actions'
import FileCard from '@/components/FileCard'
import { getFileTypesParams } from '@/lib/utils'
import { FileType } from 'next/dist/lib/file-exists'

async function Page({ searchParams, params }: SearchParamProps) {
  const type = ((await params)?.type as string) || ''
  const searchText = ((await searchParams)?.query as string) || ''
  const sort = ((await searchParams)?.sort as string) || ''

  const types = getFileTypesParams(type) as FileType[]
  const files = await getFiles({ types, searchText, sort })
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total size: <span className="h5">0 MB</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort By:</p>
            <Sort />
          </div>
        </div>
      </section>

      {files.total > 0 ? (
        <section className="file-list">
          {files.rows.map((file: FileInterface) => (
            <FileCard key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  )
}

export default Page

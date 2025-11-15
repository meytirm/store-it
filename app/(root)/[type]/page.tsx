import { FileInterface, SearchParamProps } from '@/types'
import Sort from '@/components/Sort'
import { getFiles } from '@/lib/actions/file.actions'
import FileCard from '@/components/FileCard'
import { getFileTypesParams } from '@/lib/utils'
import { FileType } from 'next/dist/lib/file-exists'

async function Page({ params }: SearchParamProps) {
  console.log('hert')
  const type = ((await params)?.type as string) || ''
  console.log(type)
  const types = getFileTypesParams(type) as FileType[]
  const files = await getFiles({ types })
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

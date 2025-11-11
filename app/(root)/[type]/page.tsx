import { FileInterface, SearchParamProps } from '@/types'
import Sort from '@/components/Sort'
import { getFiles } from '@/lib/actions/file.actions'

async function Page({ params }: SearchParamProps) {
  const type = ((await params)?.type as string) || ''

  const files = await getFiles()
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
        <section>
          {files.rows.map((file: FileInterface) => (
            <h1 className="h1" key={file.$id}>
              {file.name}
            </h1>
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  )
}

export default Page

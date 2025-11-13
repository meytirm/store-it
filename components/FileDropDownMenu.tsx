import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { actionsDropdownItems } from '@/constants'
import { ActionType, FileInterface } from '@/types'
import Link from 'next/link'
import { constructDownloadUrl } from '@/lib/utils'

function FileDropDownMenu({
  isDropdownOpen,
  setIsDropdownOpen,
  file,
  setAction,
  setIsModalOpen,
}: Props) {
  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger className="shad-no-focus">
        <Image src="/assets/icons/dots.svg" alt="dots" width={34} height={34} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="max-w-[200px] truncate">
          {file.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actionsDropdownItems.map((item: ActionType) => (
          <DropdownMenuItem
            key={item.value}
            className="shad-dropdown-item"
            onClick={() => {
              setAction(item)
              const isAllowed = [
                'rename',
                'delete',
                'share',
                'details',
              ].includes(item.value)
              if (isAllowed) {
                // setName(file.name)
                setIsModalOpen(true)
              }
            }}
          >
            {item.value === 'download' ? (
              <Link
                href={constructDownloadUrl(file.bucketFileId)}
                download={file.name}
                className="flex items-center gap-2"
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={30}
                  height={30}
                />
                {item.label}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={30}
                  height={30}
                />
                {item.label}
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FileDropDownMenu

interface Props {
  isDropdownOpen: boolean
  setIsDropdownOpen: (open: boolean) => void
  file: FileInterface
  setAction: (action: ActionType) => void
  setIsModalOpen: (open: boolean) => void
}

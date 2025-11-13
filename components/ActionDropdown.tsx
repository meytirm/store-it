'use client'
import { ActionType, FileInterface } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Loading from '@/components/Loading'
import { renameFile } from '@/lib/actions/user.actions'
import { usePathname } from 'next/navigation'
import FileDropDownMenu from '@/components/FileDropDownMenu'
import { FileDetails } from '@/components/ActionsModalContent'

function ActionDropdown({ file }: { file: FileInterface }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [action, setAction] = useState<ActionType | null>(null)
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const closeAllModals = () => {
    setIsModalOpen(false)
    setIsDropdownOpen(false)
    setAction(null)
    setName(file.name)
  }
  const path = usePathname()

  const handleAction = async () => {
    if (!action) return
    setIsLoading(true)
    let success = false

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => console.log('share'),
      delete: () => console.log('delete'),
    }

    success = await actions[action.value as keyof typeof actions]()

    if (success) {
      closeAllModals()
    }

    setIsLoading(false)
  }

  const renderDialogContent = () => {
    if (!action) return null
    const { value, label } = action
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === 'rename' && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === 'details' && <FileDetails file={file} />}
        </DialogHeader>
        {['rename', 'delete', 'share'].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              <Loading isLoading={isLoading} />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    )
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <FileDropDownMenu
        file={file}
        setAction={setAction}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setIsModalOpen={setIsModalOpen}
        setName={setName}
      />
      {renderDialogContent()}
    </Dialog>
  )
}

export default ActionDropdown

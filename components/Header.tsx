import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { signOutUser } from '@/lib/actions/user.actions'
import FileUploader from '@/components/FileUploader'

function Header({ $id: ownerId, accountId }: Props) {
  return (
    <header className="header">
      Search
      <div className="header-wrapper">
        <FileUploader ownerId={ownerId} accountId={accountId} />
        <form
          action={async () => {
            'use server'
            await signOutUser()
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logout"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header

interface Props {
  $id: string
  accountId: string
}

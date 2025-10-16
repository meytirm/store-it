import { Button } from '@/components/ui/button'
import Image from 'next/image'

function Header() {
  return (
    <header className="header">
      Search
      <div className="header-wrapper">
        fileUploaders
        <form>
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

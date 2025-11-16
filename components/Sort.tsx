'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePathname, useRouter } from 'next/navigation'
import { sortTypes } from '@/constants'
import * as NProgress from 'nprogress'

function Sort() {
  const path = usePathname()
  const router = useRouter()

  const handleSort = (value: string) => {
    NProgress.start()

    router.push(`${path}?sort=${value}`)

    setTimeout(() => {
      NProgress.done()
    }, 500)
  }
  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map((sort) => (
          <SelectItem
            key={sort.value}
            value={sort.value}
            className="shad-select-item"
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default Sort

import { cn, formatDateTime } from '@/lib/utils'

function FormattedDateTime({ date, className }: Props) {
  return (
    <div className={cn('body-1 text-light-200', className)}>
      {formatDateTime(date)}
    </div>
  )
}

export default FormattedDateTime

interface Props {
  date: string
  className?: string
}

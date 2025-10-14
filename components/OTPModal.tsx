'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useState, type MouseEvent } from 'react'
import Image from 'next/image'
import { sendEmailOTP, verifySecret } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'

function OTPModal({ email, accountId }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const sessionId = await verifySecret({ accountId, password })

      if (sessionId) {
        router.push('/')
      }
    } catch (error) {
      console.log('Field to verify OTP', error)
    }
  }

  const handleResendOTP = async () => {
    await sendEmailOTP({ email })
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter your OTP
            <Image
              src="assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => setIsOpen(false)}
              className="otp-close-button"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We&#39;ve sent a code to{' '}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot className="shad-otp-slot" index={0} />
            <InputOTPSlot className="shad-otp-slot" index={1} />
            <InputOTPSlot className="shad-otp-slot" index={2} />
            <InputOTPSlot className="shad-otp-slot" index={3} />
            <InputOTPSlot className="shad-otp-slot" index={4} />
            <InputOTPSlot className="shad-otp-slot" index={5} />
          </InputOTPGroup>
        </InputOTP>
        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
              type="button"
            >
              Submit
              {loading && (
                <Image
                  src="assets/icons/loader.svg"
                  alt="loading"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>
            <div className="subtitle-2 mt-2 text-center text-light-100">
              Didn&#39;t receive the code?
              <Button
                type="button"
                variant="link"
                className="pl-1 text-brand"
                onClick={handleResendOTP}
              >
                Click here to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OTPModal

interface Props {
  email: string
  accountId: string
}

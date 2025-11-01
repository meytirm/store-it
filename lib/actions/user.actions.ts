'use server'

import { createAdminClient, createSessionClient } from '@/lib/appwrite'
import { appwriteConfig } from '@/lib/appwrite/config'
import { Query, ID } from 'node-appwrite'
import { parseStringify } from '@/lib/utils'
import { avatarPlaceholderUrl } from '@/constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface createAccountParams {
  email: string
  fullName: string
}

const getUserByEmail = async (email: string) => {
  const { tables } = await createAdminClient()

  const result = await tables.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: 'users',
    queries: [Query.equal('email', email)],
  })

  return result.total > 0 ? result.rows[0] : null
}

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
}
export const sendEmailOTP = async ({
  email,
}: Omit<createAccountParams, 'fullName'>) => {
  const { account } = await createAdminClient()

  try {
    const session = await account.createEmailToken({
      email,
      userId: ID.unique(),
    })
    return session.userId
  } catch (error) {
    handleError(error, 'Failed to create email token')
  }
}

export const createAccount = async ({
  email,
  fullName,
}: createAccountParams) => {
  const existingUser = await getUserByEmail(email)

  const accountId = await sendEmailOTP({ email })

  console.log('he***', accountId)

  if (!accountId) {
    throw new Error('Failed to send OTP')
  }

  if (!existingUser) {
    const { tables } = await createAdminClient()
    console.log('here')

    await tables.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: 'users',
      rowId: ID.unique(),
      data: {
        email,
        fullName,
        avatar: avatarPlaceholderUrl,
        accountId,
      },
    })
  }

  return parseStringify({ accountId })
}

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string
  password: string
}) => {
  try {
    const { account } = await createAdminClient()

    const session = await account.createSession({
      userId: accountId,
      secret: password,
    })

    ;(await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
    })

    return parseStringify({ sessionId: session.$id })
  } catch (error) {
    handleError(error, 'Failed to verify OTP')
  }
}

export const getCurrentUser = async () => {
  try {
    const { account, tables } = await createSessionClient()
    const result = await account.get()

    const user = await tables.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: 'users',
      queries: [Query.equal('accountId', result.$id)],
    })

    if (user.total <= 0) {
      return null
    }

    return parseStringify(user.rows[0])
  } catch (e) {
    console.log(e)
  }
}

export const signOutUser = async () => {
  const { account } = await createSessionClient()
  try {
    await account.deleteSession({ sessionId: 'current' })
    const cookiesMethods = await cookies()
    cookiesMethods.delete('appwrite-session')
  } catch (e) {
    handleError(e, 'Failed to sign out user')
  } finally {
    redirect('/sign-in')
  }
}

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      await sendEmailOTP({ email })
      return parseStringify({ accountId: existingUser.$id })
    }
    return parseStringify({ accountId: null, error: 'User not found' })
  } catch (e) {
    handleError(e, 'Failed to sign in user')
  }
}

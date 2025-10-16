'use server'

import { createAdminClient, createSessionClient } from '@/lib/appwrite'
import { appwriteConfig } from '@/lib/appwrite/config'
import { Query, ID } from 'node-appwrite'
import { parseStringify } from '@/lib/utils'
import { cookies } from 'next/headers'

interface createAccountParams {
  email: string
  fullName: string
}

const getUserByEmail = async (email: string) => {
  const { tables } = await createSessionClient()

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
  const { account } = await createSessionClient()

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
    const { tables } = await createSessionClient()
    console.log('here')

    await tables.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: 'users',
      rowId: ID.unique(),
      data: {
        email,
        fullName,
        avatar: '',
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
  const { account } = await createSessionClient()
  const session = await account.createSession({
    userId: accountId,
    secret: password,
  })

  await cookies()
    .then((c) =>
      c.set('appwrite-session', session.secret, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
      }),
    )
    .catch((e) => console.log(e))

  return parseStringify({ sessionId: session.$id })
}

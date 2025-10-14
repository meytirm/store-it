'use server'

import { createSessionClient } from '@/lib/appwrite'
import { appwriteConfig } from '@/lib/appwrite/config'
import { Query, ID } from 'node-appwrite'
import { parseStringify } from '@/lib/utils'

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
const sendEmailOTP = async ({
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

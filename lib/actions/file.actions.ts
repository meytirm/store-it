'use server'
import { RenameFileProps, UploadFileParams } from '@/types'
import { createAdminClient } from '@/lib/appwrite'
import { InputFile } from 'node-appwrite/file'
import { appwriteConfig } from '@/lib/appwrite/config'
import { ID, Models, Query } from 'node-appwrite'
import { constructFileUrl, getFileType, parseStringify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/actions/user.actions'

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
}

const createQueries = (currentUser: Models.User) => {
  const queries = [
    Query.select(['*', 'owner.*']),
    Query.or([
      Query.equal('owner', [currentUser.$id]),
      Query.contains('users', [currentUser.email]),
    ]),
  ]

  // TODO: Search, sort, limits...

  return queries
}

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileParams) => {
  const { storage, tables } = await createAdminClient()

  try {
    const inputFile = InputFile.fromBuffer(file, file.name)
    const bucketFile = await storage.createFile({
      bucketId: appwriteConfig.bucketId,
      fileId: ID.unique(),
      file: inputFile,
    })

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    }

    const newFile = await tables
      .createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: 'files',
        rowId: ID.unique(),
        data: fileDocument,
      })
      .catch(async (e) => {
        await storage.deleteFile({
          fileId: bucketFile.$id,
          bucketId: appwriteConfig.bucketId,
        })
        handleError(e, 'Failed to create file')
      })

    revalidatePath(path)
    return parseStringify(newFile)
  } catch (e) {
    handleError(e, 'Failed to upload file')
  }
}

export const getFiles = async () => {
  const { tables } = await createAdminClient()

  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new Error('User not found')
    }

    const queries = createQueries(currentUser)

    const files = await tables.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: 'files',
      queries,
    })

    return parseStringify(files)
  } catch (e) {
    handleError(e, 'Failed to get files')
  }
}

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { tables } = await createAdminClient()

  try {
    const newName = `${name}.${extension}`
    const updatedFile = await tables.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: 'files',
      rowId: fileId,
      data: { name: newName },
    })
    revalidatePath(path)
    return parseStringify(updatedFile)
  } catch (e) {
    handleError(e, 'Failed to rename file')
  }
}

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: {
  fileId: string
  emails: string[]
  path: string
}) => {
  const { tables } = await createAdminClient()

  try {
    const updatedFile = await tables.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: 'files',
      rowId: fileId,
      data: { users: emails },
    })
    revalidatePath(path)
    return parseStringify(updatedFile)
  } catch (e) {
    handleError(e, 'Failed to rename file')
  }
}

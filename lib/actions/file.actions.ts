'use server'
import { UploadFileParams } from '@/types'
import { createAdminClient } from '@/lib/appwrite'
import { InputFile } from 'node-appwrite/file'
import { appwriteConfig } from '@/lib/appwrite/config'
import { ID } from 'node-appwrite'
import { constructFileUrl, getFileType, parseStringify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
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

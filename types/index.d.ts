import { Models } from 'node-appwrite'

export interface UploadFileParams {
  file: File
  ownerId: string
  accountId: string
  path: string
}

export interface SearchParamProps {
  params?: Promise<SegmentParams>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface FileInterface extends Models.Row {
  name: string
  url: string
  type: string
  extension: string
  size: number
  bucketFileId: string
  owner: {
    fullName: string
  }
  users: []
}

export interface ActionType {
  label: string
  icon: string
  value: string
}

export interface RenameFileProps {
  fileId: string
  name: string
  extension: string
  path: string
}

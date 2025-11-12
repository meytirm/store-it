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
}

export interface ActionType {
  label: string
  icon: string
  value: string
}

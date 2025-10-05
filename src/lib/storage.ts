// src/lib/storage.ts

import { supabase } from './supabase'

export type BucketName =
  | 'profile-pictures'
  | 'materi'
  | 'kuis-attachments'
  | 'documents'

interface UploadOptions {
  bucket: BucketName
  folder?: string
  fileName?: string
  allowedTypes?: string[]
  maxSize?: number // in bytes
  isPublic?: boolean
}

interface FileListItem {
  name: string
  id?: string
  created_at?: string
  updated_at?: string
  last_accessed_at?: string
  metadata?: Record<string, unknown>
}

export class StorageService {
  // Upload single file
  static async uploadFile(
    file: File,
    options: UploadOptions
  ): Promise<{ url: string | null; error: string | null }> {
    const {
      bucket,
      folder = '',
      fileName,
      allowedTypes = [],
      maxSize = 5 * 1024 * 1024, // 5MB default
      isPublic = false,
    } = options

    try {
      // Validate file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return {
          url: null,
          error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
        }
      }

      // Validate file size
      if (file.size > maxSize) {
        return {
          url: null,
          error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
        }
      }

      // Generate unique filename
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const finalFileName =
        fileName ||
        `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      const filePath = folder ? `${folder}/${finalFileName}` : finalFileName

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        return { url: null, error: error.message }
      }

      // Get public URL if needed
      if (isPublic) {
        const { data: publicData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path)

        return { url: publicData.publicUrl, error: null }
      }

      // Get signed URL for private files
      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(data.path, 60 * 60 * 24 * 7) // 7 days expiry

      if (signedError) {
        return { url: null, error: signedError.message }
      }

      return { url: signedData.signedUrl, error: null }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return { url: null, error: errorMessage }
    }
  }

  // Upload multiple files
  static async uploadMultipleFiles(
    files: File[],
    options: UploadOptions
  ): Promise<
    Array<{ file: string; url: string | null; error: string | null }>
  > {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, options).then((result) => ({
        file: file.name,
        ...result,
      }))
    )

    return Promise.all(uploadPromises)
  }

  // Delete file
  static async deleteFile(
    bucket: BucketName,
    filePath: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath])

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return { success: false, error: errorMessage }
    }
  }

  // Download file
  static async downloadFile(
    bucket: BucketName,
    filePath: string
  ): Promise<{ blob: Blob | null; error: string | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(filePath)

      if (error) {
        return { blob: null, error: error.message }
      }

      return { blob: data, error: null }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return { blob: null, error: errorMessage }
    }
  }

  // Get file URL
  static getFileUrl(
    bucket: BucketName,
    filePath: string,
    isPublic = false
  ): string {
    if (isPublic) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
      return data.publicUrl
    }

    // For private files, you'll need to generate signed URL separately
    return ''
  }

  // List files in a folder
  static async listFiles(
    bucket: BucketName,
    folder: string
  ): Promise<{ files: FileListItem[]; error: string | null }> {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

      if (error) {
        return { files: [], error: error.message }
      }

      return { files: (data as FileListItem[]) || [], error: null }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return { files: [], error: errorMessage }
    }
  }

  // Move/rename file
  static async moveFile(
    bucket: BucketName,
    fromPath: string,
    toPath: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .move(fromPath, toPath)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return { success: false, error: errorMessage }
    }
  }
}

// Helper functions for specific use cases
export const uploadProfilePicture = async (userId: string, file: File) => {
  return StorageService.uploadFile(file, {
    bucket: 'profile-pictures',
    folder: userId,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 2 * 1024 * 1024, // 2MB
    isPublic: true,
  })
}

export const uploadMateri = async (mataKuliahId: string, file: File) => {
  return StorageService.uploadFile(file, {
    bucket: 'materi',
    folder: mataKuliahId,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
    isPublic: false,
  })
}

export const uploadKuisAttachment = async (kuisId: string, file: File) => {
  return StorageService.uploadFile(file, {
    bucket: 'kuis-attachments',
    folder: kuisId,
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    isPublic: false,
  })
}

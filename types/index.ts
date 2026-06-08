// ============================================================
// VaultDrive – TypeScript Interfaces & Types
// ============================================================

export interface FileRecord {
  id: string;
  file_name: string;
  file_type: string;
  folder_name: string;
  file_size: number;
  file_url: string;
  storage_path: string;
  uploaded_at: string;
}

export interface FolderRecord {
  id: string;
  name: string;
  created_at: string;
  file_count?: number;
}

export interface NoteRecord {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export type SortOption = 'date_desc' | 'date_asc' | 'size_desc' | 'size_asc' | 'name_asc' | 'name_desc';

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  imageCount: number;
  videoCount: number;
  docCount: number;
  otherCount: number;
}

export type FileCategory = 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'spreadsheet' | 'archive' | 'text' | 'other';

// ============================================================
// VaultDrive – File Type Utilities & Icon Mapping
// ============================================================

import { FileCategory } from '@/types';

/** Map MIME type to a category */
export function getFileCategory(mimeType: string): FileCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'pdf';
  if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
    return 'document';
  if (
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'text/csv'
  )
    return 'spreadsheet';
  if (mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed' || mimeType === 'application/x-rar-compressed')
    return 'archive';
  if (mimeType.startsWith('text/')) return 'text';
  return 'other';
}

/** CSS gradient class per category */
export function getCategoryColor(category: FileCategory): string {
  const map: Record<FileCategory, string> = {
    image: 'from-violet-500 to-purple-600',
    video: 'from-rose-500 to-pink-600',
    audio: 'from-green-500 to-emerald-600',
    pdf: 'from-red-500 to-orange-600',
    document: 'from-blue-500 to-indigo-600',
    spreadsheet: 'from-emerald-500 to-teal-600',
    archive: 'from-amber-500 to-yellow-600',
    text: 'from-slate-400 to-slate-600',
    other: 'from-slate-500 to-slate-700',
  };
  return map[category];
}

/** Lucide icon name per category (used as string lookup) */
export function getCategoryIcon(category: FileCategory): string {
  const map: Record<FileCategory, string> = {
    image: 'Image',
    video: 'Video',
    audio: 'Music',
    pdf: 'FileText',
    document: 'FileText',
    spreadsheet: 'Sheet',
    archive: 'Archive',
    text: 'AlignLeft',
    other: 'File',
  };
  return map[category];
}

/** Check if a file type supports in-app preview */
export function isPreviewable(mimeType: string): boolean {
  return (
    mimeType.startsWith('image/') ||
    mimeType === 'application/pdf' ||
    mimeType.startsWith('video/') ||
    mimeType.startsWith('audio/') ||
    mimeType.startsWith('text/')
  );
}

/** Accepted MIME types for the upload dropzone */
export const ACCEPTED_MIME_TYPES: Record<string, string[]> = {
  'image/*': [],
  'video/*': [],
  'audio/*': [],
  'application/pdf': [],
  'application/msword': [],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
  'application/vnd.ms-excel': [],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
  'text/csv': [],
  'text/plain': [],
  'application/zip': [],
  'application/x-zip-compressed': [],
};

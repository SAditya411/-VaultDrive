// ============================================================
// VaultDrive – Supabase Server Actions
// All data operations for files and folders
// ============================================================

'use server';

import { createClient } from '@supabase/supabase-js';
import { FileRecord, FolderRecord, NoteRecord, SortOption, StorageStats } from '@/types';
import { revalidatePath } from 'next/cache';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ─── Files ────────────────────────────────────────────────

/** Fetch files with optional folder filter, search, and sort */
export async function getFiles(
  folder?: string | null,
  search?: string,
  sort: SortOption = 'date_desc'
): Promise<FileRecord[]> {
  const supabase = getSupabase();
  let query = supabase.from('files').select('*');

  if (folder) query = query.eq('folder_name', folder);
  if (search && search.trim()) query = query.ilike('file_name', `%${search.trim()}%`);

  const sortMap: Record<SortOption, { column: string; ascending: boolean }> = {
    date_desc: { column: 'uploaded_at', ascending: false },
    date_asc: { column: 'uploaded_at', ascending: true },
    size_desc: { column: 'file_size', ascending: false },
    size_asc: { column: 'file_size', ascending: true },
    name_asc: { column: 'file_name', ascending: true },
    name_desc: { column: 'file_name', ascending: false },
  };
  const { column, ascending } = sortMap[sort];
  query = query.order(column, { ascending });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as FileRecord[]) ?? [];
}

/** Delete a file record + storage object */
export async function deleteFile(id: string, storagePath: string): Promise<void> {
  const supabase = getSupabase();

  const { error: storageError } = await supabase.storage.from('vault').remove([storagePath]);
  if (storageError) throw new Error(storageError.message);

  const { error } = await supabase.from('files').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/files');
}

/** Move a file to a different folder */
export async function moveFile(id: string, folderName: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('files').update({ folder_name: folderName }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/files');
}

/** Insert file metadata after Supabase Storage upload */
export async function insertFileRecord(record: Omit<FileRecord, 'id' | 'uploaded_at'>): Promise<FileRecord> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('files').insert(record).select().single();
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/files');
  return data as FileRecord;
}

// ─── Folders ──────────────────────────────────────────────

/** Fetch all folders with their file counts */
export async function getFolders(): Promise<FolderRecord[]> {
  const supabase = getSupabase();
  const { data: folders, error } = await supabase
    .from('folders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);

  // Attach file counts
  const enriched = await Promise.all(
    (folders as FolderRecord[]).map(async (f) => {
      const { count } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true })
        .eq('folder_name', f.name);
      return { ...f, file_count: count ?? 0 };
    })
  );
  return enriched;
}

/** Create a new folder */
export async function createFolder(name: string): Promise<FolderRecord> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('folders').insert({ name }).select().single();
  if (error) throw new Error(error.message);
  revalidatePath('/folders');
  return data as FolderRecord;
}

/** Rename a folder and update all file references */
export async function renameFolder(id: string, oldName: string, newName: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('folders').update({ name: newName }).eq('id', id);
  if (error) throw new Error(error.message);
  await supabase.from('files').update({ folder_name: newName }).eq('folder_name', oldName);
  revalidatePath('/folders');
  revalidatePath('/files');
}

/** Delete a folder and move its files to root */
export async function deleteFolder(id: string, name: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.from('files').update({ folder_name: 'root' }).eq('folder_name', name);
  const { error } = await supabase.from('folders').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/folders');
  revalidatePath('/files');
}

// Notes

export async function getNotes(search = ''): Promise<NoteRecord[]> {
  const supabase = getSupabase();
  let query = supabase.from('notes').select('*').order('updated_at', { ascending: false });

  if (search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`title.ilike.${term},content.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as NoteRecord[]) ?? [];
}

export async function createNote(title: string, content: string): Promise<NoteRecord> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('notes')
    .insert({ title: title.trim(), content })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/notes');
  return data as NoteRecord;
}

export async function updateNote(id: string, title: string, content: string): Promise<NoteRecord> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('notes')
    .update({ title: title.trim(), content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/notes');
  return data as NoteRecord;
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/notes');
}

// ─── Stats ─────────────────────────────────────────────────

/** Aggregate storage stats for the dashboard */
export async function getStorageStats(): Promise<StorageStats> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('files').select('file_type, file_size');
  if (error) throw new Error(error.message);

  const files = (data ?? []) as { file_type: string; file_size: number }[];
  return {
    totalFiles: files.length,
    totalSize: files.reduce((sum, f) => sum + f.file_size, 0),
    imageCount: files.filter((f) => f.file_type.startsWith('image/')).length,
    videoCount: files.filter((f) => f.file_type.startsWith('video/')).length,
    docCount: files.filter(
      (f) =>
        f.file_type === 'application/pdf' ||
        f.file_type.includes('word') ||
        f.file_type.includes('excel') ||
        f.file_type.includes('sheet')
    ).length,
    otherCount: files.filter(
      (f) =>
        !f.file_type.startsWith('image/') &&
        !f.file_type.startsWith('video/') &&
        !f.file_type.includes('pdf') &&
        !f.file_type.includes('word') &&
        !f.file_type.includes('excel') &&
        !f.file_type.includes('sheet')
    ).length,
  };
}

/** Verify access code */
export async function verifyAccessCode(code: string): Promise<boolean> {
  return code === process.env.ACCESS_CODE;
}

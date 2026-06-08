// ============================================================
// VaultDrive – useUpload hook
// Handles multi-file upload to Supabase Storage + metadata insert
// ============================================================

'use client';

import { useState } from 'react';
import { UploadProgress } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { insertFileRecord } from '@/lib/supabase/actions';

export function useUpload(onComplete?: () => void) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const updateUpload = (index: number, patch: Partial<UploadProgress>) => {
    setUploads((prev) => prev.map((u, i) => (i === index ? { ...u, ...patch } : u)));
  };

  const uploadFiles = async (files: File[], folderName = 'root') => {
    const supabase = createClient();
    setIsUploading(true);
    const initialState: UploadProgress[] = files.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));
    setUploads(initialState);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      updateUpload(i, { status: 'uploading', progress: 10 });

      try {
        // Build a unique storage path
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${folderName}/${timestamp}_${safeName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('vault')
          .upload(storagePath, file, { upsert: false });

        if (uploadError) throw new Error(uploadError.message);

        updateUpload(i, { progress: 70 });

        // Get public URL
        const { data: urlData } = supabase.storage.from('vault').getPublicUrl(storagePath);

        // Insert metadata record
        await insertFileRecord({
          file_name: file.name,
          file_type: file.type || 'application/octet-stream',
          folder_name: folderName,
          file_size: file.size,
          file_url: urlData.publicUrl,
          storage_path: storagePath,
        });

        updateUpload(i, { progress: 100, status: 'success' });
      } catch (err: unknown) {
        updateUpload(i, {
          status: 'error',
          error: err instanceof Error ? err.message : 'Upload failed',
        });
      }
    }

    setIsUploading(false);
    onComplete?.();
  };

  const resetUploads = () => setUploads([]);

  return { uploads, isUploading, uploadFiles, resetUploads };
}

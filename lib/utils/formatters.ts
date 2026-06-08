// ============================================================
// VaultDrive – Utility Formatters
// ============================================================

/**
 * Format bytes into a human-readable string (KB, MB, GB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

/**
 * Format a date string into a relative or absolute human-readable date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format a storage percentage (0–100)
 */
export function formatPercent(used: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.min(100, Math.round((used / total) * 100))}%`;
}

/**
 * Truncate a filename preserving extension
 */
export function truncateFileName(name: string, maxLength = 24): string {
  if (name.length <= maxLength) return name;
  const ext = name.split('.').pop();
  const base = name.slice(0, maxLength - (ext ? ext.length + 4 : 3));
  return ext ? `${base}...${ext}` : `${base}...`;
}

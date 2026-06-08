export function getDownloadUrl(fileUrl: string, fileName: string): string {
  const separator = fileUrl.includes('?') ? '&' : '?';
  return `${fileUrl}${separator}download=${encodeURIComponent(fileName)}`;
}

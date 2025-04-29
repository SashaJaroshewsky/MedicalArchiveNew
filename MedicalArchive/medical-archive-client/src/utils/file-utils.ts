export const getFileUrl = (filePath: string): string => {
  if (!filePath) return '';
  return `https://localhost:7066/api/Files/${filePath}`;
};

export const getFileExtension = (filePath: string): string => {
  if (!filePath) return '';
  return filePath.split('.').pop()?.toLowerCase() || '';
};
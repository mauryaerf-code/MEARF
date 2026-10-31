/**
 * Helper utility to build in-built PDF preview URLs and resolve Google Drive embeds
 */

export function extractDriveFileId(url) {
  if (!url) return null;
  const match = url.match(/(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/);
  return match ? match[1] : null;
}

export function getProxyPdfUrl(url) {
  if (!url) return '';
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `/api/proxy-pdf?id=${fileId}`;
  }
  return `/api/proxy-pdf?url=${encodeURIComponent(url)}`;
}

export function getFastEmbedDriveUrl(url) {
  if (!url) return '';
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://docs.google.com/viewer?srcid=${fileId}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`;
  }
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
}

export function getEmbedDriveUrl(url) {
  if (!url) return '';
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
}

export function getDirectDownloadUrl(url) {
  if (!url) return '';
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

export function getDirectDriveViewUrl(url) {
  if (!url) return '';
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
  return url;
}

export function getAlternateDriveEmbedUrl(url) {
  if (!url) return '';
  const fileId = extractDriveFileId(url);
  if (fileId) {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(downloadUrl)}&embedded=true`;
  }
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
}

export function getPdfViewerUrl(url, { title = '', author = '', journal = '', from = '' } = {}) {
  if (!url) return '#';
  const params = new URLSearchParams();
  params.set('file', url);
  if (title) params.set('title', title);
  if (author) params.set('author', author);
  if (journal) params.set('journal', journal);
  if (from) params.set('from', from);
  return `/pdf-viewer?${params.toString()}`;
}

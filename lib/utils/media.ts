/**
 * Get the full URL for a media file
 * Handles both absolute URLs and relative paths
 */
export function getMediaUrl(path: string | undefined | null): string | null {
  if (!path) {
    console.log('[v0] getMediaUrl: path is null or undefined')
    return null
  }

  console.log('[v0] getMediaUrl: input path =', path)

  // If already an absolute URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log('[v0] getMediaUrl: returning absolute URL =', path)
    return path
  }

  // If it's a relative path, prepend the API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  console.log('[v0] getMediaUrl: API URL =', apiUrl)

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  const fullUrl = `${apiUrl}/${cleanPath}`
  console.log('[v0] getMediaUrl: generated full URL =', fullUrl)

  return fullUrl
}

/**
 * Get thumbnail URL with fallback
 */
export function getThumbnailUrl(
  coverImage: string | undefined | null,
  thumbnailUrl: string | undefined | null
): string | null {
  console.log('[v0] getThumbnailUrl: coverImage =', coverImage, ', thumbnailUrl =', thumbnailUrl)
  const result = getMediaUrl(coverImage || thumbnailUrl)
  console.log('[v0] getThumbnailUrl: result =', result)
  return result
}

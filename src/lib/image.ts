export function normalizeImageUrl(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return ''

  try {
    const parsed = new URL(trimmed)
    if (parsed.hostname.includes('drive.google.com')) {
      const path = parsed.pathname
      let id = ''

      if (path.startsWith('/file/d/')) {
        id = path.split('/')[3]
      } else if (path.startsWith('/open')) {
        id = parsed.searchParams.get('id') || ''
      }

      if (id) {
        return `https://drive.google.com/uc?export=view&id=${id}`
      }
    }
  } catch {
    return trimmed
  }

  return trimmed
}

export function isValidImageUrl(value: string) {
  if (!value.trim()) return true
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

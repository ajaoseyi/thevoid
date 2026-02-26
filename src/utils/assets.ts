const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, '')

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const cloudinaryBaseUrl = trimTrailingSlashes(import.meta.env.VITE_CLOUDINARY_BASE_URL?.trim() ?? '')

export const resolveAssetUrl = (path: string) => {
  if (!path) return path
  if (isAbsoluteUrl(path)) return path

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (!cloudinaryBaseUrl) {
    return normalizedPath
  }

  return `${cloudinaryBaseUrl}${normalizedPath}`
}


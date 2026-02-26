/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_CLOUDINARY_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


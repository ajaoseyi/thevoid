import { useEffect } from 'react'

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>

export type SeoConfig = {
  title: string
  logo:string
  description: string
  path: string
  imagePath?: string
  type?: 'Website' | 'Article' | 'Organization'
  jsonLd?: JsonLdValue
}

const DEFAULT_SITE_URL = 'https://thevoid.example'
const SITE_NAME = 'The Void'

const siteBaseUrl = (import.meta.env.VITE_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, '')

const toAbsoluteUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${siteBaseUrl}${normalizedPath}`
}

const setOrCreateMeta = (selector: string, attrs: Record<string, string>, content: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    for (const [key, value] of Object.entries(attrs)) {
      element.setAttribute(key, value)
    }
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const setCanonical = (href: string) => {
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const setJsonLd = (jsonLd?: JsonLdValue) => {
  const scriptId = 'seo-jsonld'
  const existing = document.getElementById(scriptId)
  if (!jsonLd) {
    existing?.remove()
    return
  }

  const script = existing ?? document.createElement('script')
  script.id = scriptId
  script.setAttribute('type', 'application/ld+json')
  script.textContent = JSON.stringify(jsonLd)
  if (!existing) {
    document.head.appendChild(script)
  }
}

export const usePageSeo = ({ title, description, path, imagePath = '/images/design-branding-1.jpg', type = 'Website', jsonLd }: SeoConfig) => {
  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(path)
    const imageUrl = toAbsoluteUrl(imagePath)

    document.title = title
    setCanonical(canonicalUrl)

    setOrCreateMeta('meta[name="description"]', { name: 'description' }, description)
    setOrCreateMeta('meta[property="og:title"]', { property: 'og:title' }, title)
    setOrCreateMeta('meta[property="og:description"]', { property: 'og:description' }, description)
    setOrCreateMeta('meta[property="og:type"]', { property: 'og:type' }, type)
    setOrCreateMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl)
    setOrCreateMeta('meta[property="og:image"]', { property: 'og:image' }, imageUrl)
    setOrCreateMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, SITE_NAME)

    setOrCreateMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
    setOrCreateMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title)
    setOrCreateMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description)
    setOrCreateMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl)

    setJsonLd(jsonLd)
  }, [description, imagePath, jsonLd, path, title, type])
}

export const getSiteBaseUrl = () => siteBaseUrl


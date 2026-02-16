import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const DUMMY_META_KEY = 'META_DEV_API_KEY_REPLACE_ME'
const DUMMY_ACCOUNT_ID = 'INSTAGRAM_ACCOUNT_ID_REPLACE_ME'
const DEFAULT_LIMIT = 12
const MAX_LIMIT = 50

const accessToken = process.env.META_DEV_API_KEY ?? DUMMY_META_KEY
const instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID ?? DUMMY_ACCOUNT_ID
const graphVersion = process.env.META_GRAPH_VERSION ?? 'v22.0'

const limitInput = Number.parseInt(process.env.INSTAGRAM_FETCH_LIMIT ?? `${DEFAULT_LIMIT}`, 10)
const fetchLimit =
  Number.isFinite(limitInput) && limitInput > 0
    ? Math.min(limitInput, MAX_LIMIT)
    : DEFAULT_LIMIT

const useBusinessEndpoint =
  instagramAccountId.trim().length > 0 && instagramAccountId !== DUMMY_ACCOUNT_ID

const fields = useBusinessEndpoint
  ? 'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp'
  : 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'

const baseUrl = useBusinessEndpoint
  ? `https://graph.facebook.com/${graphVersion}/${instagramAccountId}/media`
  : 'https://graph.instagram.com/me/media'

const outputPath = resolve(process.cwd(), 'public', 'data', 'featured-videos.json')

const buildRequestUrl = (url) => {
  const requestUrl = new URL(url)
  requestUrl.searchParams.set('fields', fields)
  requestUrl.searchParams.set('access_token', accessToken)
  if (!requestUrl.searchParams.has('limit')) {
    requestUrl.searchParams.set('limit', `${Math.min(fetchLimit, 25)}`)
  }
  return requestUrl.toString()
}

const toCleanText = (value) => (typeof value === 'string' ? value.trim() : '')

const toTitle = (caption) => {
  const firstLine = caption.split('\n')[0]?.replace(/\s+/g, ' ').trim() ?? ''
  if (!firstLine) return 'Instagram video'
  return firstLine.length > 72 ? `${firstLine.slice(0, 69)}...` : firstLine
}

const isVideoMedia = (item) => {
  const mediaType = toCleanText(item.media_type).toUpperCase()
  const mediaProductType = toCleanText(item.media_product_type).toUpperCase()
  return mediaType === 'VIDEO' || mediaProductType === 'REELS'
}

const normalizeVideo = (item) => {
  const id = toCleanText(item.id)
  const src = toCleanText(item.media_url)
  if (!id || !src) return null

  const mediaProductType = toCleanText(item.media_product_type).toUpperCase()
  const caption = toCleanText(item.caption)
  const permalink = toCleanText(item.permalink)

  return {
    id,
    tag: mediaProductType === 'REELS' ? 'Reel' : 'Instagram',
    title: toTitle(caption),
    poster: toCleanText(item.thumbnail_url) || src,
    src,
    permalink,
  }
}

if (accessToken === DUMMY_META_KEY) {
  console.warn(
    `Using dummy META key (${DUMMY_META_KEY}). Set META_DEV_API_KEY to fetch real Instagram videos.`,
  )
}

const mediaItems = []
let nextPageUrl = buildRequestUrl(baseUrl)

while (nextPageUrl && mediaItems.length < fetchLimit) {
  const response = await fetch(nextPageUrl)
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Instagram fetch failed (${response.status}): ${body}`)
  }

  const payload = await response.json()
  if (payload?.error) {
    throw new Error(
      `Instagram API error: ${payload.error.message ?? 'Unknown error'} (${payload.error.code ?? 'n/a'})`,
    )
  }

  const pageItems = Array.isArray(payload?.data) ? payload.data : []
  mediaItems.push(...pageItems)

  if (mediaItems.length >= fetchLimit) break
  const next = typeof payload?.paging?.next === 'string' ? payload.paging.next : null
  nextPageUrl = next ? buildRequestUrl(next) : null
}

const videos = mediaItems
  .filter((item) => isVideoMedia(item))
  .map((item) => normalizeVideo(item))
  .filter((item) => item !== null)
  .slice(0, fetchLimit)

if (videos.length === 0) {
  throw new Error('No Instagram video media found. Check account permissions and API scopes.')
}

const outputPayload = {
  source: 'instagram-graph',
  fetchedAt: new Date().toISOString(),
  account: useBusinessEndpoint ? instagramAccountId : 'me',
  videos,
}

await mkdir(resolve(process.cwd(), 'public', 'data'), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(outputPayload, null, 2)}\n`, 'utf8')

console.log(`Saved ${videos.length} videos to ${outputPath}`)

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import { resolveAssetUrl } from './utils/assets'
import {
  getContentCreationImageByNumber,
  getDesignBrandingImageByNumber,
} from './utils/cloudinaryImages'
import { getSiteBaseUrl, usePageSeo, type SeoConfig } from './utils/seo'

const normalizePath = (path: string) => {
  if (!path || path === '/') return '/'
  return path.replace(/\/+$/, '') || '/'
}

const introWords = ['step', 'into', 'the', 'void']
const INTRO_WORD_STEP_MS = 1600
const INTRO_WORD_ANIMATION_MS = 1450
const INTRO_OUTRO_MS = 850
const SCROLL_DURATION_MS = 820
const BOOT_PRELOAD_MAX_WAIT_MS = 14_000
const INTRO_PREVIEW_IMAGE_COUNT = 4
const PRIORITY_FEATURED_VIDEO_COUNT = 4

const introPreloadImages = [
  ...Array.from({ length: 8 }, (_, index) => getContentCreationImageByNumber(index + 1)),
  ...Array.from({ length: 13 }, (_, index) => getDesignBrandingImageByNumber(index + 1)),
]

const fallbackFeaturedVideos = [
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301159/featured-lemonade_ond3sq.mp4',
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301163/featured-kaduna-chapter_nrjyh0.mp4',
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301173/free_fhxjyw.mp4',
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301143/featured-void-reel_j5ef0q.mp4',
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301183/rayjay-void_rpi3jy.mp4',
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301134/social-media-mockup_gg3ily.mp4',
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301140/video-2_x44fly.mp4',
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301161/video-3_xgfyzy.mp4',
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301165/video-4_ktrrw8.mp4',
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301141/video-5_cyryom.mp4',
  'https://res.cloudinary.com/dcoza82oi/video/upload/v1772301154/video-6_yf1rrz.mp4',
]

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const animateWindowScroll = (targetTop: number, durationMs = SCROLL_DURATION_MS) => {
  const startTop = window.scrollY
  const distance = targetTop - startTop
  if (Math.abs(distance) < 2) return

  const startTime = performance.now()
  const tick = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(1, elapsed / durationMs)
    const eased = easeInOutCubic(progress)
    window.scrollTo(0, startTop + distance * eased)
    if (progress < 1) {
      window.requestAnimationFrame(tick)
    }
  }

  window.requestAnimationFrame(tick)
}

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = src
  })

const INTRO_PREVIEW_SEEK_SECONDS = 2

const preloadVideoFrame = (src: string) =>
  new Promise<void>((resolve) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true

    const done = () => {
      video.onloadedmetadata = null
      video.onloadeddata = null
      video.onseeked = null
      video.onerror = null
      video.pause()
      resolve()
    }

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : NaN
      const targetTime =
        Number.isFinite(duration) && duration > 0
          ? Math.min(INTRO_PREVIEW_SEEK_SECONDS, Math.max(duration - 0.05, 0))
          : INTRO_PREVIEW_SEEK_SECONDS
      const seekAndResolve = () => {
        video.onseeked = () => done()
        try {
          video.currentTime = targetTime
        } catch {
          done()
        }
      }

      if (video.readyState >= 2) {
        seekAndResolve()
      } else {
        video.onloadeddata = () => seekAndResolve()
      }
    }
    video.onerror = () => done()
    video.src = src
    video.load()
  })

const siteBaseUrl = getSiteBaseUrl()

const getSeoConfigForPath = (path: string): SeoConfig => {
  const commonOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Void',
    url: siteBaseUrl,
  }

  switch (path) {
    case '/services':
      return {
        logo:'',
        title: 'Services | The Void Media Group',
        description:
          'Creatiive media agency that specializes in video production, social media systems, creative consulting, and brand design built for modern brands and teams.',
        path: '/services',
        imagePath: getDesignBrandingImageByNumber(2),
        jsonLd: {
          ...commonOrganization,
          makesOffer: {
            '@type': 'OfferCatalog',
            name: 'Video and Creative Services',
          },
        },
      }
    case '/about':
      return {
        title: 'About | The Void',
        logo: '',
        description:
          'Meet The Void, a global collective of creators and technologists building story-first video systems for brands.',
        path: '/about',
        imagePath: getContentCreationImageByNumber(4),
        jsonLd: {
          ...commonOrganization,
          description: 'Global collective of directors, producers, and technologists.',
        },
      }
    default:
      return {
        title: 'The Void | Creative Digital Studio',
        description:
          'The Void is a bold creative digital studio crafting websites, brands, and digital experiences that stand out. Lets build something unforgettable.we build story-first video systems, social channels much more ',
        path: '/',
        logo: '',
        imagePath: getContentCreationImageByNumber(1),
        jsonLd: [
          commonOrganization,
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'The Void',
            url: siteBaseUrl,
          },
        ],
      }
  }
}

function App() {
  const location = useLocation()
  const [isIntroVisible, setIsIntroVisible] = useState(true)
  const [isIntroLeaving, setIsIntroLeaving] = useState(false)
  const [isIntroSequenceComplete, setIsIntroSequenceComplete] = useState(false)
  const [isBootPreloadComplete, setIsBootPreloadComplete] = useState(false)
  const [bootPreloadProgress, setBootPreloadProgress] = useState(0)
  const path = normalizePath(location.pathname)
  const seoConfig = useMemo(() => getSeoConfigForPath(path), [path])
  const shouldShowIntroProgress = isIntroSequenceComplete && !isBootPreloadComplete
  const bootProgressPercent = Math.round(bootPreloadProgress * 100)

  usePageSeo(seoConfig)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const totalDuration = reducedMotion
      ? 1200
      : (introWords.length - 1) * INTRO_WORD_STEP_MS + INTRO_WORD_ANIMATION_MS + INTRO_OUTRO_MS

    const introDoneTimer = window.setTimeout(() => {
      setIsIntroSequenceComplete(true)
    }, totalDuration)

    return () => {
      window.clearTimeout(introDoneTimer)
    }
  }, [])

  useEffect(() => {
    let isActive = true
    let hasSettled = false

    const completePreload = () => {
      if (!isActive || hasSettled) return
      hasSettled = true
      window.clearTimeout(timeoutId)
      setBootPreloadProgress(1)
      setIsBootPreloadComplete(true)
    }

    const timeoutId = window.setTimeout(() => {
      completePreload()
    }, BOOT_PRELOAD_MAX_WAIT_MS)

    const preloadBootAssets = async () => {
      const imageSources = Array.from(new Set(introPreloadImages.map((src) => resolveAssetUrl(src))))
      const previewImageSources = imageSources.slice(0, INTRO_PREVIEW_IMAGE_COUNT)
      const backgroundImageSources = imageSources.slice(INTRO_PREVIEW_IMAGE_COUNT)

      const videoSources = Array.from(new Set(fallbackFeaturedVideos.map((src) => resolveAssetUrl(src))))
      const priorityVideoSources = videoSources.slice(0, PRIORITY_FEATURED_VIDEO_COUNT)
      const backgroundVideoSources = videoSources.slice(PRIORITY_FEATURED_VIDEO_COUNT)

      const preloadTasks: Promise<unknown>[] = [
        ...previewImageSources.map((src) => preloadImage(src)),
        ...priorityVideoSources.map((src) => preloadVideoFrame(src)),
      ]
      const totalTaskCount = preloadTasks.length

      if (totalTaskCount === 0) {
        completePreload()
        window.setTimeout(() => {
          void Promise.allSettled([
            fetch('/data/featured-videos.json', { cache: 'force-cache' }).catch(() => undefined),
            ...backgroundImageSources.map((src) => preloadImage(src)),
            ...backgroundVideoSources.map((src) => preloadVideoFrame(src)),
          ])
        }, 0)
        return
      }

      let completedTaskCount = 0
      const trackedTasks = preloadTasks.map((task) =>
        task.finally(() => {
          completedTaskCount += 1
          if (!isActive || hasSettled) return
          const nextProgress = completedTaskCount / totalTaskCount
          setBootPreloadProgress((current) => Math.max(current, nextProgress))
        }),
      )

      await Promise.allSettled(trackedTasks)
      completePreload()
      window.setTimeout(() => {
        void Promise.allSettled([
          fetch('/data/featured-videos.json', { cache: 'force-cache' }).catch(() => undefined),
          ...backgroundImageSources.map((src) => preloadImage(src)),
          ...backgroundVideoSources.map((src) => preloadVideoFrame(src)),
        ])
      }, 0)
    }

    void preloadBootAssets()

    return () => {
      isActive = false
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (!isIntroSequenceComplete || !isBootPreloadComplete) return
    setIsIntroLeaving(true)
    const hideIntroTimer = window.setTimeout(() => {
      setIsIntroVisible(false)
    }, INTRO_OUTRO_MS)

    return () => {
      window.clearTimeout(hideIntroTimer)
    }
  }, [isBootPreloadComplete, isIntroSequenceComplete])

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLDivElement | null
    if (!cursor) return

    const moveCursor = (clientX: number, clientY: number) => {
      cursor.style.left = `${clientX}px`
      cursor.style.top = `${clientY}px`
    }

    const handlePointerMove = (event: PointerEvent) => {
      moveCursor(event.clientX, event.clientY)
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      moveCursor(touch.clientX, touch.clientY)
    }

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      moveCursor(touch.clientX, touch.clientY)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerMove)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerMove)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (location.hash) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const target = document.querySelector(location.hash)
          if (!target) return
          const top = window.scrollY + target.getBoundingClientRect().top
          if (reducedMotion) {
            window.scrollTo(0, top)
            return
          }
          animateWindowScroll(top)
        })
      })
      return
    }

    if (reducedMotion) {
      window.scrollTo(0, 0)
      return
    }
    animateWindowScroll(0)
  }, [location.hash, location.pathname])

  return (
    <div className="page">
      {isIntroVisible ? (
        <div className={`intro-clip${isIntroLeaving ? ' is-leaving' : ''}`} aria-hidden="true">
          <div className="intro-clip-line">
            {introWords.map((word, index) => (
              <span
                key={word}
                className="intro-clip-word"
                style={{ '--intro-delay': `${(index * INTRO_WORD_STEP_MS) / 1000}s` } as CSSProperties}
              >
                {word}
              </span>
            ))}
          </div>
          {shouldShowIntroProgress ? (
            <div className="intro-progress-slider">
              <div className="intro-progress-meta">
                <span>Loading experience</span>
                <span>{bootProgressPercent}%</span>
              </div>
              <div className="intro-progress-track" role="presentation">
                <span
                  className="intro-progress-fill"
                  style={{ '--intro-progress': `${bootProgressPercent}%` } as CSSProperties}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="custom-cursor" data-mode="default" data-action="" aria-hidden="true" />
      <Header />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App


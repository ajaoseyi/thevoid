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
const BOOT_PRELOAD_TIMEOUT_MS = 2600

const introPreloadImages = [
  getContentCreationImageByNumber(1),
  getContentCreationImageByNumber(3),
  getContentCreationImageByNumber(4),
  getDesignBrandingImageByNumber(1),
  getDesignBrandingImageByNumber(2),
  getDesignBrandingImageByNumber(3),
]

const introPreloadVideos = [
  '/media/featured-lemonade.mp4',
  '/media/featured-kaduna-chapter.mp4',
  '/media/free.mp4',
  '/media/featured-void-reel.mp4',
  '/media/rayjay-void.mp4',
  '/media/social-media-mockup.mp4',
  '/media/video-2.mp4',
  '/media/video-3.mp4',
  '/media/video-4.mp4',
  '/media/video-5.mp4',
  '/media/video-6.mp4',
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
  const path = normalizePath(location.pathname)
  const seoConfig = useMemo(() => getSeoConfigForPath(path), [path])

  usePageSeo(seoConfig)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const totalDuration = reducedMotion
      ? 1200
      : (introWords.length - 1) * INTRO_WORD_STEP_MS + INTRO_WORD_ANIMATION_MS + INTRO_OUTRO_MS
    const leaveAt = Math.max(0, totalDuration - INTRO_OUTRO_MS)

    const leaveTimer = window.setTimeout(() => {
      setIsIntroLeaving(true)
    }, leaveAt)

    const introDoneTimer = window.setTimeout(() => {
      setIsIntroSequenceComplete(true)
    }, totalDuration)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(introDoneTimer)
    }
  }, [])

  useEffect(() => {
    const preloadBootAssets = async () => {
      const preloadTasks: Promise<unknown>[] = [
        fetch('/data/featured-videos.json').catch(() => undefined),
        ...introPreloadImages.map((src) => preloadImage(resolveAssetUrl(src))),
        ...introPreloadVideos.map((src) => preloadVideoFrame(resolveAssetUrl(src))),
      ]

      const timeoutTask = new Promise<void>((resolve) => {
        window.setTimeout(resolve, BOOT_PRELOAD_TIMEOUT_MS)
      })

      await Promise.race([Promise.allSettled(preloadTasks), timeoutTask])
    }

    void preloadBootAssets()
  }, [])

  useEffect(() => {
    if (!isIntroSequenceComplete) return
    setIsIntroVisible(false)
  }, [isIntroSequenceComplete])

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

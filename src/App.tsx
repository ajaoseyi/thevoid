import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import './App.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'

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
  '/images/content-creation-1.jpg',
  '/images/content-creation-3.jpg',
  '/images/content-creation-4.jpg',
  '/images/design-branding-1.jpg',
  '/images/design-branding-2.jpg',
  '/images/design-branding-3.jpg',
]

const introPreloadVideos = [
  '/media/featured-lemonade.mp4',
  '/media/featured-kaduna-chapter.mp4',
  '/media/free.mp4',
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

const preloadVideoMetadata = (src: string) =>
  new Promise<void>((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => resolve()
    video.onerror = () => resolve()
    video.src = src
    video.load()
  })

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))
  const [isIntroVisible, setIsIntroVisible] = useState(true)
  const [isIntroLeaving, setIsIntroLeaving] = useState(false)
  const [isIntroSequenceComplete, setIsIntroSequenceComplete] = useState(false)
  const [isBootReady, setIsBootReady] = useState(false)

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
    let isMounted = true

    const preloadBootAssets = async () => {
      const preloadTasks: Promise<unknown>[] = [
        fetch('/data/featured-videos.json').catch(() => undefined),
        ...introPreloadImages.map((src) => preloadImage(src)),
        ...introPreloadVideos.map((src) => preloadVideoMetadata(src)),
      ]

      const timeoutTask = new Promise<void>((resolve) => {
        window.setTimeout(resolve, BOOT_PRELOAD_TIMEOUT_MS)
      })

      await Promise.race([Promise.allSettled(preloadTasks), timeoutTask])

      if (isMounted) {
        setIsBootReady(true)
      }
    }

    void preloadBootAssets()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isIntroSequenceComplete || !isBootReady) return
    setIsIntroVisible(false)
  }, [isBootReady, isIntroSequenceComplete])

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
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = useMemo(
    () =>
      (to: string) => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const url = new URL(to, window.location.origin)
        const nextPath = normalizePath(url.pathname)
        window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
        setPath(nextPath)

        if (url.hash) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const target = document.querySelector(url.hash)
              if (!target) return

              const top = window.scrollY + target.getBoundingClientRect().top
              if (reducedMotion) {
                window.scrollTo(0, top)
                return
              }
              animateWindowScroll(top)
            })
          })
        } else {
          if (reducedMotion) {
            window.scrollTo(0, 0)
            return
          }
          animateWindowScroll(0)
        }
      },
    [],
  )

  const page = (() => {
    switch (path) {
      case '/services':
        return <Services onNavigate={navigate} />
      case '/about':
        return <About />
      default:
        return <Home />
    }
  })()

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
      <Header onNavigate={navigate} />
      <main className="page-content">{page}</main>
      <Footer onNavigate={navigate} />
    </div>
  )
}

export default App

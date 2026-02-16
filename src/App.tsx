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

const introWords = ['the', 'studio', 're imagining', 'your', 'brand']
const INTRO_WORD_STEP_MS = 1600
const INTRO_WORD_ANIMATION_MS = 1450
const INTRO_OUTRO_MS = 850

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))
  const [isIntroVisible, setIsIntroVisible] = useState(true)
  const [isIntroLeaving, setIsIntroLeaving] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const totalDuration = reducedMotion
      ? 1200
      : (introWords.length - 1) * INTRO_WORD_STEP_MS + INTRO_WORD_ANIMATION_MS + INTRO_OUTRO_MS
    const leaveAt = Math.max(0, totalDuration - INTRO_OUTRO_MS)

    const leaveTimer = window.setTimeout(() => {
      setIsIntroLeaving(true)
    }, leaveAt)

    const hideTimer = window.setTimeout(() => {
      setIsIntroVisible(false)
    }, totalDuration)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLDivElement | null
    if (!cursor) return

    const handleMove = (event: MouseEvent) => {
      cursor.style.left = `${event.clientX}px`
      cursor.style.top = `${event.clientY}px`
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
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
        const url = new URL(to, window.location.origin)
        const nextPath = normalizePath(url.pathname)
        window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
        setPath(nextPath)
        if (url.hash) {
          requestAnimationFrame(() => {
            const target = document.querySelector(url.hash)
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
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

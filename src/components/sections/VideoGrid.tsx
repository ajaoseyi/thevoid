import { useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent, type TouchEvent } from 'react'
import  NextIcon  from '../../assets/icons/next.svg'
import  PreviousIcon  from '../../assets/icons/previous.svg'
import { resolveAssetUrl } from '../../utils/assets'

type VideoItem = {
  id: string
  tag: string
  title: string
  poster: string
  src: string
  cta?: string
  permalink?: string
}

const fallbackVideos: VideoItem[] = [
  {
    id: 'lemonade',
    tag: 'Campaign',
    title: 'Lemonade',
    poster: resolveAssetUrl('/media/featured-lemonade.mp4'),
    src: resolveAssetUrl('/media/featured-lemonade.mp4'),
  },
  {
    id: 'kaduna-chapter',
    tag: 'Wedding',
    title: 'Kaduna Chapter',
    poster: resolveAssetUrl('/media/featured-kaduna-chapter.mp4'),
    src: resolveAssetUrl('/media/featured-kaduna-chapter.mp4'),
  },
  {
    id: 'free',
    tag: 'Car Sessions ',
    title: 'BMW',
    poster: resolveAssetUrl('/media/free.mp4'),
    src: resolveAssetUrl('/media/free.mp4'),
  },

  {
    id: 'rayjan',
    tag: 'Fashion House',
    title: 'Rayjaj',
    poster: resolveAssetUrl('/media/featured-void-reel.mp4'),
    src: resolveAssetUrl('/media/rayjay-void.mp4'),
  },
  {
    id: 'picnic-hangout',
    tag: 'Lifestyle',
    title: 'Picnic Hangout',
    poster: resolveAssetUrl('/media/social-media-mockup.mp4'),
    src: resolveAssetUrl('/media/video-4.mp4'),
  },
  {
    id: 'video-three',
    tag: 'Food Porn',
    title: 'Pastries',
    poster: resolveAssetUrl('/media/featured-kaduna-chapter.mp4'),
    src: resolveAssetUrl('/media/video-3.mp4'),
  },

  {
    id: 'food-porn',
    tag: 'Food Porn',
    title: 'Grills & Vibes',
    poster: resolveAssetUrl('/media/featured-lemonade.mp4'),
    src: resolveAssetUrl('/media/video-2.mp4'),
  },
  {
      "id": "jaguar",
      "tag": "Car Sessions",
      "title": "JAGUAR",
      "poster": resolveAssetUrl('/media/featured-lemonade.mp4'),
      "src": resolveAssetUrl('/media/video-5.mp4')
    },
     {
      "id": "skating-skating",
      "tag": "Lifestyle",
      "title": "Skating, Skating",
      "poster": resolveAssetUrl('/media/featured-lemonade.mp4'),
      "src": resolveAssetUrl('/media/video-6.mp4')
    }
]

const AUTO_ADVANCE_MS = 30_000
const LOOP_MULTIPLIER = 3

const normalizeVideoItem = (value: unknown): VideoItem | null => {
  if (!value || typeof value !== 'object') return null

  const item = value as Record<string, unknown>
  const id = typeof item.id === 'string' ? item.id.trim() : ''
  const src = typeof item.src === 'string' ? resolveAssetUrl(item.src.trim()) : ''
  const poster = typeof item.poster === 'string' ? resolveAssetUrl(item.poster.trim()) : src
  const title =
    typeof item.title === 'string' && item.title.trim().length > 0
      ? item.title.trim()
      : 'Instagram video'
  const tag =
    typeof item.tag === 'string' && item.tag.trim().length > 0
      ? item.tag.trim()
      : 'Instagram'
  const cta = typeof item.cta === 'string' && item.cta.trim().length > 0 ? item.cta.trim() : undefined
  const permalink =
    typeof item.permalink === 'string' && item.permalink.trim().length > 0
      ? item.permalink.trim()
      : undefined

  if (!id || !src) return null

  return {
    id,
    src,
    poster,
    title,
    tag,
    cta,
    permalink,
  }
}

const isInstagramCta = (cta?: string) => (cta ?? '').trim().toLowerCase() === 'from instagram'

const VideoGrid = () => {
  const [videos, setVideos] = useState<VideoItem[]>(fallbackVideos)
  const [isCarouselHovered, setIsCarouselHovered] = useState(false)
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)
  const [playingCardIndex, setPlayingCardIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mutedById, setMutedById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(fallbackVideos.map((video) => [video.id, true])),
  )
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isFullscreenActive, setIsFullscreenActive] = useState(false)
  const activeIndexRef = useRef(0)
  const scrollSettleTimeoutRef = useRef<number | null>(null)
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null)
  const playModeRef = useRef<{ index: number | null; mode: 'hover' | 'click' | null }>({
    index: null,
    mode: null,
  })
  const carouselVideos = useMemo(
    () =>
      Array.from({ length: LOOP_MULTIPLIER }, () => videos).flatMap((group) => group),
    [videos],
  )

  const syncToCenteredCopy = (logicalIndex: number, smooth: boolean) => {
    const container = gridRef.current
    const baseCount = videos.length
    if (!container || baseCount === 0) return

    const normalizedIndex = ((logicalIndex % baseCount) + baseCount) % baseCount
    const centeredIndex = baseCount + normalizedIndex
    const target = container.children.item(centeredIndex) as HTMLElement | null
    if (!target) return

    container.scrollTo({
      left: target.offsetLeft,
      behavior: smooth ? 'smooth' : 'auto',
    })
    setActiveIndex(normalizedIndex)
  }

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLDivElement | null
    if (!cursor) return

    if (hoveredCardIndex === null) {
      cursor.dataset.mode = 'default'
      cursor.dataset.action = ''
      return
    }

    cursor.dataset.mode = 'video'
    cursor.dataset.action = playingCardIndex === hoveredCardIndex ? 'pause' : 'play'
  }, [hoveredCardIndex, playingCardIndex])

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLDivElement | null
    return () => {
      if (!cursor) return
      cursor.dataset.mode = 'default'
      cursor.dataset.action = ''
    }
  }, [])

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    let isMounted = true

    const loadFeaturedVideos = async () => {
      try {
        const response = await fetch('/data/featured-videos.json', { cache: 'force-cache' })
        if (!response.ok) return

        const payload = (await response.json()) as unknown
        const candidates =
          Array.isArray(payload)
            ? payload
            : payload &&
                typeof payload === 'object' &&
                Array.isArray((payload as { videos?: unknown }).videos)
              ? ((payload as { videos: unknown[] }).videos ?? [])
              : []

        const normalized = candidates
          .map((entry) => normalizeVideoItem(entry))
          .filter((entry): entry is VideoItem => entry !== null)

        if (isMounted && normalized.length > 0) {
          const merged = [...fallbackVideos, ...normalized].filter(
            (video, index, arr) => arr.findIndex((entry) => entry.id === video.id) === index,
          )
          setVideos(merged)
        }
      } catch {
        // Keep fallback videos if instagram feed is unavailable.
      }
    }

    void loadFeaturedVideos()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setMutedById((current) => {
      const next = { ...current }
      for (const video of videos) {
        if (!(video.id in next)) {
          next[video.id] = true
        }
      }
      return next
    })
  }, [videos])

  useEffect(() => {
    if (videos.length === 0) return
    setHoveredCardIndex(null)
    setPlayingCardIndex(null)
    playModeRef.current = { index: null, mode: null }

    const frame = window.requestAnimationFrame(() => {
      syncToCenteredCopy(0, false)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [videos.length])

  useEffect(() => {
    if (videos.length < 2) return
    if (isCarouselHovered || playingCardIndex !== null || isFullscreenActive) return

    const timer = window.setInterval(() => {
      syncToCenteredCopy(activeIndexRef.current + 1, true)
    }, AUTO_ADVANCE_MS)

    return () => window.clearInterval(timer)
  }, [isCarouselHovered, isFullscreenActive, playingCardIndex, videos.length])

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreenActive(document.fullscreenElement !== null)
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    const target = gridRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setIsRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const handleToggle = (renderIndex: number) => {
    const target = videoRefs.current[renderIndex]
    if (!target) return

    if (target.paused) {
      playModeRef.current = { index: renderIndex, mode: 'click' }
      videoRefs.current.forEach((video, videoIndex) => {
        if (videoIndex !== renderIndex) {
          video?.pause()
        }
      })
      const playPromise = target.play()
      if (playPromise) {
        playPromise.catch(() => undefined)
      }
    } else {
      if (playModeRef.current.mode === 'hover' && playModeRef.current.index === renderIndex) {
        playModeRef.current = { index: renderIndex, mode: 'click' }
        setPlayingCardIndex(renderIndex)
      } else {
        target.pause()
      }
    }
  }

  const handleHoverPlay = (event: PointerEvent<HTMLDivElement>, renderIndex: number) => {
    if (event.pointerType !== 'mouse') return
    const target = videoRefs.current[renderIndex]
    if (!target || !target.paused) return

    playModeRef.current = { index: renderIndex, mode: 'hover' }
    videoRefs.current.forEach((video, videoIndex) => {
      if (videoIndex !== renderIndex) {
        video?.pause()
      }
    })

    const playPromise = target.play()
    if (playPromise) {
      playPromise.catch(() => undefined)
    }
  }

  const handleHoverPause = (event: PointerEvent<HTMLDivElement>, renderIndex: number) => {
    if (event.pointerType !== 'mouse') return
    const target = videoRefs.current[renderIndex]
    if (!target || target.paused) return
    if (playModeRef.current.mode === 'hover' && playModeRef.current.index === renderIndex) {
      target.pause()
    }
  }

  const handleAudioToggle = (event: MouseEvent<HTMLButtonElement>, index: number, id: string) => {
    event.stopPropagation()
    event.preventDefault()
    const target = videoRefs.current[index]
    setMutedById((current) => {
      const currentMuted = current[id] ?? true
      const next = { ...current, [id]: !currentMuted }
      if (target) {
        target.muted = next[id]
      }
      return next
    })
  }

  const handleCarouselScroll = () => {
    if (scrollSettleTimeoutRef.current !== null) {
      window.clearTimeout(scrollSettleTimeoutRef.current)
    }

    scrollSettleTimeoutRef.current = window.setTimeout(() => {
      const container = gridRef.current
      const baseCount = videos.length
      if (!container || baseCount === 0) return

      const cards = Array.from(container.children) as HTMLElement[]
      if (cards.length === 0) return

      const currentLeft = container.scrollLeft
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft - currentLeft)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      const logicalIndex = nearestIndex % baseCount
      setActiveIndex(logicalIndex)

      if (nearestIndex < baseCount || nearestIndex >= baseCount * (LOOP_MULTIPLIER - 1)) {
        const centeredIndex = baseCount + logicalIndex
        const centeredCard = cards[centeredIndex]
        if (centeredCard) {
          container.scrollTo({
            left: centeredCard.offsetLeft,
            behavior: 'auto',
          })
        }
      }
    }, 120)
  }

  useEffect(() => {
    return () => {
      if (scrollSettleTimeoutRef.current !== null) {
        window.clearTimeout(scrollSettleTimeoutRef.current)
      }
    }
  }, [])

  const handleSlidePrev = () => {
    if (playingCardIndex !== null && videos.length > 1) {
      const baseCount = videos.length
      const currentRenderIndex = playingCardIndex
      const currentLogicalIndex = ((currentRenderIndex % baseCount) + baseCount) % baseCount
      const nextLogicalIndex = (currentLogicalIndex - 1 + baseCount) % baseCount
      const nextRenderIndex = baseCount + nextLogicalIndex
      const currentVideo = videoRefs.current[currentRenderIndex]
      const nextVideo = videoRefs.current[nextRenderIndex]
      const shouldPreserveFullscreen = document.fullscreenElement === currentVideo

      syncToCenteredCopy(nextLogicalIndex, true)

      if (currentVideo && !currentVideo.paused) {
        currentVideo.pause()
      }

      if (nextVideo) {
        playModeRef.current = { index: nextRenderIndex, mode: 'click' }
        const playPromise = nextVideo.play()
        if (playPromise) {
          playPromise.catch(() => undefined)
        }
        if (shouldPreserveFullscreen && nextVideo.requestFullscreen) {
          void nextVideo.requestFullscreen().catch(() => undefined)
        }
      }
      return
    }

    syncToCenteredCopy(activeIndexRef.current - 1, true)
  }

  const handleSlideNext = () => {
    if (playingCardIndex !== null && videos.length > 1) {
      const baseCount = videos.length
      const currentRenderIndex = playingCardIndex
      const currentLogicalIndex = ((currentRenderIndex % baseCount) + baseCount) % baseCount
      const nextLogicalIndex = (currentLogicalIndex + 1) % baseCount
      const nextRenderIndex = baseCount + nextLogicalIndex
      const currentVideo = videoRefs.current[currentRenderIndex]
      const nextVideo = videoRefs.current[nextRenderIndex]
      const shouldPreserveFullscreen = document.fullscreenElement === currentVideo

      syncToCenteredCopy(nextLogicalIndex, true)

      if (currentVideo && !currentVideo.paused) {
        currentVideo.pause()
      }

      if (nextVideo) {
        playModeRef.current = { index: nextRenderIndex, mode: 'click' }
        const playPromise = nextVideo.play()
        if (playPromise) {
          playPromise.catch(() => undefined)
        }
        if (shouldPreserveFullscreen && nextVideo.requestFullscreen) {
          void nextVideo.requestFullscreen().catch(() => undefined)
        }
      }
      return
    }

    syncToCenteredCopy(activeIndexRef.current + 1, true)
  }

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0]
    if (!touch) return
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = swipeStartRef.current
    swipeStartRef.current = null
    const touch = event.changedTouches[0]
    if (!start || !touch) return

    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    if (absDx < 40 || absDx <= absDy) return

    if (dx < 0) {
      handleSlideNext()
    } else {
      handleSlidePrev()
    }
  }

  return (
    <section id="featured-work">
      <p className="featured-works-heading">FEATURED WORKS</p>
      <div className="relative">
        <button
          type="button"
          aria-label="Slide videos left"
          className="absolute left-8 top-1/2 z-10 hidden -translate-y-1/2 disabled:cursor-not-allowed disabled:opacity-40 md:block"
          onClick={handleSlidePrev}
          onMouseEnter={handleSlidePrev}
          disabled={videos.length < 2}
        >
          <span aria-hidden="true"><img className='h-12' src={PreviousIcon}/></span>
        </button>
        <button
          type="button"
          aria-label="Slide videos right"
          className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 text-xl leading-none text-white transition disabled:cursor-not-allowed disabled:opacity-40 md:block"
          onClick={handleSlideNext}
          onMouseEnter={handleSlideNext}
          disabled={videos.length < 2}
        >
          <span aria-hidden="true"><img className='h-14' src={NextIcon}/></span>
        </button>
        <div
          ref={gridRef}
          className={`video-grid${playingCardIndex !== null ? ' is-expanded' : ''}${isRevealed ? ' is-revealed' : ''}`}
          onScroll={handleCarouselScroll}
          onPointerEnter={() => setIsCarouselHovered(true)}
          onPointerLeave={() => setIsCarouselHovered(false)}
        >
          {carouselVideos.map((video, renderIndex) => {
            const logicalIndex = videos.length === 0 ? 0 : renderIndex % videos.length
            const isMuted = mutedById[video.id] ?? true

            return (
              <div
                key={`${video.id}-${renderIndex}`}
                className={`video-card${playingCardIndex === renderIndex ? ' is-playing' : ''}`}
                aria-pressed={playingCardIndex === renderIndex}
                role="button"
                tabIndex={0}
                aria-label={`${playingCardIndex === renderIndex ? 'Pause' : 'Play'} ${video.title} video`}
                onClick={() => handleToggle(renderIndex)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleToggle(renderIndex)
                  }
                }}
                onPointerEnter={(event) => {
                  setHoveredCardIndex(renderIndex)
                  handleHoverPlay(event, renderIndex)
                }}
                onPointerLeave={(event) => {
                  setHoveredCardIndex(null)
                  handleHoverPause(event, renderIndex)
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                aria-current={activeIndex === logicalIndex ? 'true' : undefined}
              >
                <video
                  ref={(node) => {
                    videoRefs.current[renderIndex] = node
                  }}
                  className="video-media"
                  preload="metadata"
                  playsInline
                  muted={isMuted}
                  poster={video.poster}
                  src={video.src}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onPlay={() => {
                    if (playModeRef.current.mode === 'click') {
                      setPlayingCardIndex(renderIndex)
                    }
                  }}
                  onPause={() => {
                    if (playModeRef.current.index === renderIndex) {
                      playModeRef.current = { index: null, mode: null }
                    }
                    setPlayingCardIndex((current) => (current === renderIndex ? null : current))
                  }}
                  onEnded={() => {
                    if (playModeRef.current.index === renderIndex) {
                      playModeRef.current = { index: null, mode: null }
                    }
                    setPlayingCardIndex((current) => (current === renderIndex ? null : current))
                  }}
                />
                {playingCardIndex === renderIndex ? (
                  <button
                    className={`video-audio-toggle${isMuted ? ' is-muted' : ''}`}
                    type="button"
                    aria-pressed={!isMuted}
                    aria-label={isMuted ? ' Mute audio' : 'Turn sound on'}
                    onClick={(event) => handleAudioToggle(event, renderIndex, video.id)}
                  >
                    <span aria-hidden="true">{!isMuted ? 'Sound on' : 'Muted'}</span>
                  </button>
                ) : null}
                {playingCardIndex === renderIndex ? null : (
                  <div className="video-overlay">
                    <span className="video-label">{video.tag}</span>
                    <h3>{video.title}</h3>
                  </div>
                )}
                {video.cta && !isInstagramCta(video.cta) ? <span className="video-cta">{video.cta}</span> : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default VideoGrid

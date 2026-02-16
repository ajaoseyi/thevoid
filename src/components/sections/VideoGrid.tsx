import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'

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
    poster: '/media/featured-lemonade.mp4',
    src: '/media/featured-lemonade.mp4',
  },
  {
    id: 'void-reel',
    tag: 'Reel',
    title: 'VOID Story Cut',
    poster: '/media/featured-void-reel.mp4',
    src: '/media/featured-void-reel.mp4',
  },
  {
    id: 'kaduna-chapter',
    tag: 'Wedding',
    title: 'Kaduna Chapter',
    poster: '/media/featured-kaduna-chapter.mp4',
    src: '/media/featured-kaduna-chapter.mp4',
  },
  {
    id: 'free',
    tag: 'Reel',
    title: 'Free',
    poster: '/media/free.mp4',
    src: '/media/free.mp4',
  },
]

const normalizeVideoItem = (value: unknown): VideoItem | null => {
  if (!value || typeof value !== 'object') return null

  const item = value as Record<string, unknown>
  const id = typeof item.id === 'string' ? item.id.trim() : ''
  const src = typeof item.src === 'string' ? item.src.trim() : ''
  const poster = typeof item.poster === 'string' ? item.poster.trim() : src
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
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [mutedById, setMutedById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(fallbackVideos.map((video) => [video.id, true])),
  )
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const playModeRef = useRef<{ id: string | null; mode: 'hover' | 'click' | null }>({
    id: null,
    mode: null,
  })

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLDivElement | null
    if (!cursor) return

    if (!hoveredId) {
      cursor.dataset.mode = 'default'
      cursor.dataset.action = ''
      return
    }

    cursor.dataset.mode = 'video'
    cursor.dataset.action = playingId === hoveredId ? 'pause' : 'play'
  }, [hoveredId, playingId])

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLDivElement | null
    return () => {
      if (!cursor) return
      cursor.dataset.mode = 'default'
      cursor.dataset.action = ''
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadFeaturedVideos = async () => {
      try {
        const response = await fetch('/data/featured-videos.json', { cache: 'no-store' })
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
          setVideos(normalized)
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

  const handleToggle = (index: number) => {
    const target = videoRefs.current[index]
    if (!target) return

    if (target.paused) {
      playModeRef.current = { id: videos[index]?.id ?? null, mode: 'click' }
      videoRefs.current.forEach((video, videoIndex) => {
        if (videoIndex !== index) {
          video?.pause()
        }
      })
      const playPromise = target.play()
      if (playPromise) {
        playPromise.catch(() => undefined)
      }
    } else {
      const activeId = videos[index]?.id ?? null
      if (playModeRef.current.mode === 'hover' && playModeRef.current.id === activeId) {
        playModeRef.current = { id: activeId, mode: 'click' }
        setPlayingId(activeId)
      } else {
        target.pause()
      }
    }
  }

  const handleHoverPlay = (event: PointerEvent<HTMLDivElement>, index: number) => {
    if (event.pointerType !== 'mouse') return
    const target = videoRefs.current[index]
    if (!target || !target.paused) return

    playModeRef.current = { id: videos[index]?.id ?? null, mode: 'hover' }
    videoRefs.current.forEach((video, videoIndex) => {
      if (videoIndex !== index) {
        video?.pause()
      }
    })

    const playPromise = target.play()
    if (playPromise) {
      playPromise.catch(() => undefined)
    }
  }

  const handleHoverPause = (event: PointerEvent<HTMLDivElement>, index: number) => {
    if (event.pointerType !== 'mouse') return
    const target = videoRefs.current[index]
    if (!target || target.paused) return
    const activeId = videos[index]?.id ?? null
    if (playModeRef.current.mode === 'hover' && playModeRef.current.id === activeId) {
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

  return (
    <section id="featured-work">
      <p className="featured-works-heading">FEATURED WORKS</p>
      <div
        ref={gridRef}
        className={`video-grid${playingId ? ' is-expanded' : ''}${isRevealed ? ' is-revealed' : ''}`}
      >
        {videos.map((video, index) => {
          const isMuted = mutedById[video.id] ?? true

          return (
            <div
              key={video.id}
              className={`video-card${playingId === video.id ? ' is-playing' : ''}`}
              aria-pressed={playingId === video.id}
              role="button"
              tabIndex={0}
              aria-label={`${playingId === video.id ? 'Pause' : 'Play'} ${video.title} video`}
              onClick={() => handleToggle(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleToggle(index)
                }
              }}
              onPointerEnter={(event) => {
                setHoveredId(video.id)
                handleHoverPlay(event, index)
              }}
              onPointerLeave={(event) => {
                setHoveredId(null)
                handleHoverPause(event, index)
              }}
            >
              <video
                ref={(node) => {
                  videoRefs.current[index] = node
                }}
                className="video-media"
                poster={video.poster}
                preload="metadata"
                playsInline
                muted={isMuted}
                src={video.src}
                onPlay={() => {
                  if (playModeRef.current.mode === 'click') {
                    setPlayingId(video.id)
                  }
                }}
                onPause={() => {
                  if (playModeRef.current.id === video.id) {
                    playModeRef.current = { id: null, mode: null }
                  }
                  setPlayingId((current) => (current === video.id ? null : current))
                }}
                onEnded={() => {
                  if (playModeRef.current.id === video.id) {
                    playModeRef.current = { id: null, mode: null }
                  }
                  setPlayingId((current) => (current === video.id ? null : current))
                }}
              />
              {playingId === video.id ? (
                <button
                  className={`video-audio-toggle${isMuted ? ' is-muted' : ''}`}
                  type="button"
                  aria-pressed={!isMuted}
                  aria-label={isMuted ? ' Mute audio' : 'Turn sound on'}
                  onClick={(event) => handleAudioToggle(event, index, video.id)}
                >
                  <span aria-hidden="true">{isMuted ? 'Sound on' : 'Muted'}</span>
                </button>
              ) : null}
              {playingId === video.id ? null : (
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
    </section>
  )
}

export default VideoGrid

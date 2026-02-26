import { useEffect, useState } from 'react'
import { resolveAssetUrl } from '../../utils/assets'

const contentCards = [
  { title: 'Brand campaigns', imageNumber: 1 },
  { title: 'Social-first visuals', imageNumber: 3 },
  { title: 'Editorial stories', imageNumber: 4 },
]

const numberWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

const consultingCards = [
  {
    title: 'Ideation',
    body: 'Direction sessions, concept framing, and campaign blueprints.',
  },
  {
    title: 'Strategy',
    body: 'Audience mapping, platform planning, and creative sequencing.',
  },
  {
    title: 'Execution',
    body: 'Production systems that keep quality and speed aligned.',
  },
]

const designBrandingImageNames = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
]


type LightboxImage = { src: string; fallbackSrc: string; alt: string }

const ServicesShowcase = () => {
  const [isContentGalleryOpen, setIsContentGalleryOpen] = useState(false)
  const [isBrandingGalleryOpen, setIsBrandingGalleryOpen] = useState(false)
  const [activeImageState, setActiveImageState] = useState<{
    images: LightboxImage[]
    currentIndex: number
  } | null>(null)
  const brandingPreviewItems = designBrandingImageNames.slice(0, 4)
  const contentPreviewItems = contentCards.slice(0, 4)
  const getContentImage = (imageNumber: number, title: string): LightboxImage => ({
    src: resolveAssetUrl(`/images/content-creation-${imageNumber}.jpg`),
    fallbackSrc: resolveAssetUrl(`/images/content-creation-${numberWords[imageNumber - 1]}.jpg`),
    alt: title,
  })
  const getDesignBrandingImage = (index: number, imageName: string): LightboxImage => ({
    src: resolveAssetUrl(`/images/design-branding-${index + 1}.jpg`),
    fallbackSrc: resolveAssetUrl(`/images/design-branding-${imageName}.jpg`),
    alt: `Design and branding ${index + 1}`,
  })
  const contentLightboxImages = numberWords.map((_, index) =>
    getContentImage(index + 1, `Content creation ${index + 1}`),
  )
  const brandingLightboxImages = designBrandingImageNames.map((imageName, index) =>
    getDesignBrandingImage(index, imageName),
  )
  const activeImage = activeImageState
    ? activeImageState.images[activeImageState.currentIndex] ?? null
    : null

  const openLightboxAtIndex = (images: LightboxImage[], index: number) => {
    if (!images.length) {
      return
    }
    const normalizedIndex = ((index % images.length) + images.length) % images.length
    setActiveImageState({ images, currentIndex: normalizedIndex })
  }

  const goToLightboxImage = (direction: 'next' | 'prev') => {
    if (!activeImageState) {
      return
    }
    const delta = direction === 'next' ? 1 : -1
    openLightboxAtIndex(activeImageState.images, activeImageState.currentIndex + delta)
  }

  useEffect(() => {
    if (!activeImage && !isBrandingGalleryOpen && !isContentGalleryOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeImage) {
          setActiveImageState(null)
          return
        }

        if (isContentGalleryOpen) {
          setIsContentGalleryOpen(false)
          return
        }

        setIsBrandingGalleryOpen(false)
      }

      if (!activeImage) {
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToLightboxImage('next')
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToLightboxImage('prev')
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeImage, activeImageState, isBrandingGalleryOpen, isContentGalleryOpen])

  return (
    <section className="services-showcase" id="mission">
      <div className="expertise-intro">
        <p className="expertise-kicker">Crafted to scale</p>
        <h2>
          Our <em>Expertise</em>
        </h2>
        <p>
          We blend strategy, design, and production into service systems that feel bold
          on-screen and stay operational behind the scenes.
        </p>
      </div>

      <article className="expertise-block">
        <div className="expertise-block-head">
          <h3>Content Creation</h3>
          <p>Narrative-first production for digital campaigns, launches, and episodic work.</p>
          
        </div>
         <div className="content-meta-row mb-5">
            <span>01 / Services</span>
            <button
              className="content-view-all"
              onClick={() => setIsContentGalleryOpen(true)}
              type="button"
            >
              View all
            </button>
          </div>
        <div className="content-creation-grid">

          {contentPreviewItems.map((card, index) => (
            <button
              className={`content-card content-card-button shade-${index + 1}`}
              key={card.title}
              type="button"
              onClick={() => openLightboxAtIndex(contentLightboxImages, card.imageNumber - 1)}
            >
              <img
                className="content-card-image"
                src={resolveAssetUrl(`/images/content-creation-${card.imageNumber}.jpg`)}
                alt={card.title}
                loading="lazy"
                onError={(event) => {
                  const target = event.currentTarget
                  const fallbackSrc = getContentImage(card.imageNumber, card.title).fallbackSrc
                  if (target.dataset.fallbackApplied === 'true') {
                    return
                  }
                  target.dataset.fallbackApplied = 'true'
                  target.src = fallbackSrc
                }}
              />
              <div className="content-card-overlay">{card.title}</div>
            </button>
          ))}
        </div>
      </article>

      <article className="expertise-block social-block">
        <div className="social-preview" aria-hidden="true">
          <div className="social-phone">
            <video
              className="social-phone-video"
              src={resolveAssetUrl('/media/social-media-mockup.mp4')}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>
        </div>
        <div className="social-copy">
          <span>02 / Services</span>
          <h3>
            Social Media
            <br />
            Management
          </h3>
          <div className="social-platforms" aria-hidden="true">
            <span>IG</span>
            <span>TT</span>
            <span>FB</span>
            <span>YT</span>
            <span>X</span>
            <span>LI</span>
          </div>
          <p>
            We don&apos;t just post, we curate communities. Our strategic approach combines
            aesthetic consistency with data-driven growth to build an unbreakable brand
            presence.
          </p>
          <ul className="social-points">
            <li>Strategic Grid Layout</li>
            <li>Engagement Optimization</li>
            <li>Trend-Pulse Monitoring</li>
          </ul>
        </div>
      </article>

      <article className="expertise-block consulting-block">
        <div className="consulting-head">
          <span>03 / Services</span>
          <h3>Creative Consulting</h3>
        </div>
        <div className="consulting-grid">
          {consultingCards.map((card) => (
            <div className="consulting-card" key={card.title}>
              <div className="consulting-dot" aria-hidden="true" />
              <h4>{card.title}</h4>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="expertise-block branding-block">
        <div className="branding-copy">
          <div className="branding-meta-row">
            <span>04 / Services</span>
            <button
              className="branding-view-all"
              onClick={() => setIsBrandingGalleryOpen(true)}
              type="button"
            >
              View all
            </button>
          </div>
          <h3>Design &amp; Branding</h3>
          <p>
            Visual identity systems designed for digital-first brands that need consistency
            across launch assets, social pages, and campaign rollouts.
          </p>
        </div>
        <div className="branding-grid">
          {brandingPreviewItems.map((imageName, index) => (
            <button
              className="branding-tile branding-tile-button"
              key={imageName}
              type="button"
              onClick={() => openLightboxAtIndex(brandingLightboxImages, index)}
            >
              <img
                className="branding-tile-image"
                src={resolveAssetUrl(`/images/design-branding-${index + 1}.jpg`)}
                alt={`Design and branding ${index + 1}`}
                loading="lazy"
                onError={(event) => {
                  const target = event.currentTarget
                  const fallbackSrc = getDesignBrandingImage(index, imageName).fallbackSrc
                  if (target.dataset.fallbackApplied === 'true') {
                    return
                  }
                  target.dataset.fallbackApplied = 'true'
                  target.src = fallbackSrc
                }}
              />
            </button>
          ))}
        </div>
      </article>

      <article className="expertise-block web-block">
        <div className="web-head">
          <span>05 / Services</span>
          <h3>Website Creation</h3>
        </div>
        <div className="web-stage">
          <div className="web-stage-screen">
            <strong>Custom digital storefront</strong>
            <small>Fast loading. Responsive. Brand-aligned.</small>
          </div>
          <div className="web-stage-phone" aria-hidden="true">
            <span />
          </div>
        </div>
      </article>

 
      <div className="services-final-cta">
        <h3>
          Ready to <em>step into the void?</em>
        </h3>
        <p>Let&apos;s build something that feels sharp, modern, and impossible to ignore.</p>
        <div className="services-final-actions">
          <button className="cta" type="button">
            Start a project
          </button>
          <button className="cta ghost" type="button">
            Download deck
          </button>
        </div>
      </div>

      {isContentGalleryOpen ? (
        <div
          aria-label="Content creation examples"
          className="content-gallery-modal"
          onClick={() => setIsContentGalleryOpen(false)}
          role="dialog"
        >
          <div className="content-gallery-panel" onClick={(event) => event.stopPropagation()}>
            <div className="content-gallery-head">
              <h4> Content Creation</h4>
              <button
                aria-label="Close content creation gallery"
                className="content-gallery-close"
                onClick={() => setIsContentGalleryOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="content-gallery-grid">
              {numberWords.map((name, index) => (
                <button
                  className="content-gallery-item"
                  key={`${name}-content-modal`}
                  onClick={() => openLightboxAtIndex(contentLightboxImages, index)}
                  type="button"
                >
                  <img
                    alt={`Content creation ${index + 1}`}
                    className="content-gallery-image"
                    src={resolveAssetUrl(`/images/content-creation-${index + 1}.jpg`)}
                    loading="lazy"
                    onError={(event) => {
                      const target = event.currentTarget
                      const fallbackSrc = getContentImage(index + 1, `Content creation ${index + 1}`).fallbackSrc
                      if (target.dataset.fallbackApplied === 'true') {
                        return
                      }
                      target.dataset.fallbackApplied = 'true'
                      target.src = fallbackSrc
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {isBrandingGalleryOpen ? (
        <div
          aria-label="Design and branding examples"
          className="branding-gallery-modal"
          onClick={() => setIsBrandingGalleryOpen(false)}
          role="dialog"
        >
          <div className="branding-gallery-panel" onClick={(event) => event.stopPropagation()}>
            <div className="branding-gallery-head">
              <h4>Design &amp; Branding</h4>
              <button
                aria-label="Close design and branding gallery"
                className="branding-gallery-close"
                onClick={() => setIsBrandingGalleryOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="branding-gallery-grid">
              {designBrandingImageNames.map((imageName, index) => (
                <button
                  className="branding-gallery-item"
                  key={`${imageName}-modal`}
                  onClick={() => openLightboxAtIndex(brandingLightboxImages, index)}
                  type="button"
                >
                  <img
                    alt={`Design and branding ${index + 1}`}
                    className="branding-gallery-image"
                    src={resolveAssetUrl(`/images/design-branding-${index + 1}.jpg`)}
                    loading="lazy"
                    onError={(event) => {
                      const target = event.currentTarget
                      const fallbackSrc = getDesignBrandingImage(index, imageName).fallbackSrc
                      if (target.dataset.fallbackApplied === 'true') {
                        return
                      }
                      target.dataset.fallbackApplied = 'true'
                      target.src = fallbackSrc
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeImage ? (
        <div
          aria-label="Content image preview"
          className="content-lightbox"
          onClick={() => setActiveImageState(null)}
          role="dialog"
        >
          <button
            aria-label="Close image preview"
            className="content-lightbox-close"
            onClick={() => setActiveImageState(null)}
            type="button"
          >
            Close
          </button>
          <div className="content-lightbox-stage" onClick={(event) => event.stopPropagation()}>
            <button
              aria-label="Previous image"
              className="content-lightbox-nav content-lightbox-nav-prev"
              onClick={(event) => {
                event.stopPropagation()
                goToLightboxImage('prev')
              }}
              type="button"
            >
              <span aria-hidden="true">&lt;</span>
            </button>
            <button
              aria-label="Next image"
              className="content-lightbox-nav content-lightbox-nav-next"
              onClick={(event) => {
                event.stopPropagation()
                goToLightboxImage('next')
              }}
              type="button"
            >
              <span aria-hidden="true">&gt;</span>
            </button>
            <img
              key={activeImage.src}
              alt={activeImage.alt}
              className="content-lightbox-image"
              src={activeImage.src}
              onError={(event) => {
                const target = event.currentTarget
                if (target.dataset.fallbackApplied === 'true') {
                  return
                }
                target.dataset.fallbackApplied = 'true'
                target.src = activeImage.fallbackSrc
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default ServicesShowcase

const contentCards = [
  'Brand campaigns',
  'Commercial shoots',
  'Social-first visuals',
  'Editorial stories',
]

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

const brandTiles = ['Identity systems', 'Typography kit', 'Visual language', 'Brand atlas']

const productCards = ['Printed materials', 'Custom merchandise']

const ServicesShowcase = () => {
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
          <span>01 / Services</span>
          <h3>Content Creation</h3>
          <p>Narrative-first production for digital campaigns, launches, and episodic work.</p>
        </div>
        <div className="content-creation-grid">
          {contentCards.map((card, index) => (
            <div className={`content-card shade-${index + 1}`} key={card}>
              <div className="content-card-overlay">{card}</div>
            </div>
          ))}
        </div>
      </article>

      <article className="expertise-block social-block">
        <div className="social-preview" aria-hidden="true">
          <div className="social-phone">
            <video
              className="social-phone-video"
              src="/media/social-media-mockup.mp4"
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
          <span>04 / Services</span>
          <h3>Design &amp; Branding</h3>
          <p>
            Visual identity systems designed for digital-first brands that need consistency
            across launch assets, social pages, and campaign rollouts.
          </p>
        </div>
        <div className="branding-grid">
          {brandTiles.map((tile, index) => (
            <div className={`branding-tile tile-${index + 1}`} key={tile}>
              <span>{tile}</span>
            </div>
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

      <article className="expertise-block products-block">
        <div className="products-copy">
          <span>06 / Services</span>
          <h3>Merchandise &amp; Printing</h3>
          <p>
            Packaging systems, press-ready files, and premium merch kits produced for
            campaigns, events, and team drops.
          </p>
        </div>
        <div className="products-grid">
          {productCards.map((card) => (
            <div className="product-card" key={card}>
              <p>{card}</p>
            </div>
          ))}
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
    </section>
  )
}

export default ServicesShowcase

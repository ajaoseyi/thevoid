const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Creative Marketing Agency</p>
          <h1>YOUR BRAND DONE RIGHT.</h1>
          <p className="lead">
            From brand identity and content design to high-quality video and modern websites, we create the tools your business needs to grow.
          </p>
          <a className="" href='https://wa.me/2348119113099' target="_blank" rel="noopener noreferrer"  >
         <button className="cta mt-8 scale-103" type="button">
          Get in touch
        </button>
        </a>
        </div>
        {/* <div className="hero-media">
          <div className="media-card large">
            <div className="media-overlay">
              <span>Feature</span>
              <strong>Atlas - Launch Film</strong>
            </div>
          </div>
          <div className="media-row">
            <div className="media-card small" />
            <div className="media-card small alt" />
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default Hero

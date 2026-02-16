const AboutUs = () => {
  return (
    <section className="about" id="about">
      <div className="section-head">
        <h2>About us</h2>
        <p>
          We are a video studio that blends cinematic craft with scalable systems. Our teams
          build content ecosystems that travel across platforms without losing the heart of
          the story.
        </p>
      </div>
      <div className="about-grid">
        <article className="about-card">
          <h3>Creators</h3>
          <p>Directors, editors, and designers building bold narratives.</p>
        </article>
        <article className="about-card">
          <h3>Technologists</h3>
          <p>Workflow architects shaping faster, smarter production.</p>
        </article>
        <article className="about-card">
          <h3>Amplifiers</h3>
          <p>Launch strategists connecting stories to audiences worldwide.</p>
        </article>
      </div>
    </section>
  )
}

export default AboutUs

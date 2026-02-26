import { useNavigate } from 'react-router-dom'

const Services = () => {
  const navigate = useNavigate()

  return (
    <div className="services-page">
      <section className="page-hero">
        <p className="eyebrow">Services</p>
        <h1>End-to-end video craft, built to scale.</h1>
        <p className="lead">
          From brand strategy to multi-format production, we build modular systems that
          keep stories consistent across every channel.
        </p>
        <button className="cta primary" type="button" onClick={() => navigate('/#contact')}>
          Start a project
        </button>
      </section>

      <section className="services">
        <div className="section-head">
          <h2>Core capabilities</h2>
          <p>
            We orchestrate creative, production, and distribution to deliver campaigns,
            episodic content, and always-on social storytelling.
          </p>
        </div>
        <div className="service-grid">
          <article className="service-card">
            <h3>Brand Films</h3>
            <p>Signature stories that anchor campaigns and launch new products.</p>
          </article>
          <article className="service-card">
            <h3>Social Series</h3>
            <p>Recurring formats optimized for fast-moving channels.</p>
          </article>
          <article className="service-card">
            <h3>Post + Motion</h3>
            <p>Editing, color, sound, and motion systems that scale.</p>
          </article>
          <article className="service-card">
            <h3>Localization</h3>
            <p>Multi-language versioning with voice and on-screen adaptation.</p>
          </article>
          <article className="service-card">
            <h3>Studio Build</h3>
            <p>Embedded teams to help brands run consistent video pipelines.</p>
          </article>
          <article className="service-card">
            <h3>Performance Toolkit</h3>
            <p>Testing, analytics, and distribution roadmaps.</p>
          </article>
        </div>
      </section>

      <section className="cta-block" id="contact">
        <div>
          <h2>Ready to build your launch?</h2>
          <p>
            Tell us what you are making. We will map the strategy and deliver a plan that
            scales with your team.
          </p>
        </div>
        <button className="cta primary" type="button" onClick={() => navigate('/#contact')}>
          Contact us
        </button>
      </section>
    </div>
  )
}

export default Services

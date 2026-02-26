import AboutUs from '../components/sections/AboutUs'

const About = () => {
  return (
    <div className="about-page about-story-page">
      <section className="page-hero about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">About</p>
          <h1>We build systems for story-first video.</h1>
          <p className="lead">
            The void is a global collective of directors, producers, and technologists bringing
            brand stories to life with cinematic craft and scalable tools.
          </p>
        </div>
        <aside className="about-hero-chronicle" aria-label="How we work">
          <p>Story arc</p>
          <ol>
            <li>
              <span>01</span>
              Discover the emotional angle worth following.
            </li>
            <li>
              <span>02</span>
              Design repeatable production systems around it.
            </li>
            <li>
              <span>03</span>
              Launch across channels with consistency and speed.
            </li>
          </ol>
        </aside>
      </section>

      <section className="about-manifesto" aria-label="What defines us">
        <article>
          <h3>Purpose over noise</h3>
          <p>Every format, frame, and motion has a narrative job.</p>
        </article>
        <article>
          <h3>Global, but personal</h3>
          <p>We scale pipelines while preserving human collaboration.</p>
        </article>
        <article>
          <h3>Built to endure</h3>
          <p>We create libraries and systems, not one-off campaigns.</p>
        </article>
      </section>

      <AboutUs />

      <section className="process about-values">
        <div className="section-head">
          <h2>Our values</h2>
          <p>
            We care about craft, collaboration, and speed. We turn ambitious ideas into
            repeatable production systems.
          </p>
        </div>
        <div className="process-steps">
          <div>
            <span>C1</span>
            <h3>Craft</h3>
            <p>Every frame has purpose, every story is built with intention.</p>
          </div>
          <div>
            <span>C2</span>
            <h3>Care</h3>
            <p>We partner closely with teams to build trust and momentum.</p>
          </div>
          <div>
            <span>C3</span>
            <h3>Scale</h3>
            <p>Our systems make it easier to ship more without losing quality.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

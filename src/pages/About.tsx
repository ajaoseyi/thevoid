import AboutUs from '../components/sections/AboutUs'

const About = () => {
  return (
    <div className="about-page">
      <section className="page-hero">
        <p className="eyebrow">About</p>
        <h1>We build systems for story-first video.</h1>
        <p className="lead">
          The void is a global collective of directors, producers, and technologists bringing
          brand stories to life with cinematic craft and scalable tools.
        </p>
      </section>
      <AboutUs />
      <section className="process">
        <div className="section-head">
          <h2>Our values</h2>
          <p>
            We care about craft, collaboration, and speed. We turn ambitious ideas into
            repeatable production systems.
          </p>
        </div>
        <div className="process-steps">
          <div>
            <h3>Craft</h3>
            <p>Every frame has purpose, every story is built with intention.</p>
          </div>
          <div>
            <h3>Care</h3>
            <p>We partner closely with teams to build trust and momentum.</p>
          </div>
          <div>
            <h3>Scale</h3>
            <p>Our systems make it easier to ship more without losing quality.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

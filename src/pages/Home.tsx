import Hero from '../components/sections/Hero'
import AboutUs from '../components/sections/AboutUs'
import VideoGrid from '../components/sections/VideoGrid'
import ServicesShowcase from '../components/sections/ServicesShowcase'

const Home = () => {
  return (
    <>
      <Hero />
        <VideoGrid />


      <ServicesShowcase />

      <AboutUs />

  
  

      <section className="process" id="culture">
        <div className="section-head">
          <h2>How we work</h2>
          <p>
            A flexible, collaborative process designed for speed, scale, and creative
            daring.
          </p>
        </div>
        <div className="process-steps">
          <div>
            <h3>01 Discovery</h3>
            <p>Strategy, research, and creative direction to sharpen intent.</p>
          </div>
          <div>
            <h3>02 Production</h3>
            <p>Hybrid teams deliver cinematic quality and repeatable systems.</p>
          </div>
          <div>
            <h3>03 Amplification</h3>
            <p>Distribution toolkits built to travel across every channel.</p>
          </div>
        </div>
      </section>

      <section className="metrics" id="careers">
        <div className="metric">
          <h3>120+</h3>
          <p>Campaigns launched in the last year.</p>
        </div>
        <div className="metric">
          <h3>36</h3>
          <p>Global creator partners across 8 studios.</p>
        </div>
        <div className="metric">
          <h3>5x</h3>
          <p>Average lift in engagement for client launches.</p>
        </div>
      </section>

      
    </>
  )
}

export default Home

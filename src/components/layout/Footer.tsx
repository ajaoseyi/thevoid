import { Instagram, Sms, Youtube } from 'iconsax-reactjs'
import { Link } from 'react-router-dom'

const Footer = () => {

  return (
    <footer className="footer text-lg mt-12">
      <div>
        <h3>The Void</h3>
        <p>Lagos · Abuja · Australia</p>
        <div className="flex gap-3 items-center my-3" aria-label="Social media">
          <a href="https://www.instagram.com/thevoidmg?igsh=MWpyMzM2ZDZmdmY2NQ==" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram size={32} variant="Linear" />
          </a>
            <a href="https://m.youtube.com/@ishreact?fbclid=PAZnRzaAQNfk1leHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaeeAzUX9m5ZWjaAFi4_n7O799wvKVqPD96_qrIscA49fuMK51Bd7AJNsONR5g_aem_oc7k8BeLAs1-k6SSD_A2bg" aria-label="Youtube">
            <Youtube size={32} variant="Linear" />
          </a>
          <a href="mailto:hello@myriad.video" aria-label="Gmail">
            <Sms size={32} variant="Linear" />
          </a>
        </div>
      </div>
      <div className="footer-links">
        <Link to="/#featured-work">Work</Link>
        <Link to="/#mission">Services</Link>
        <Link to="/about">About</Link>
        <Link to="/#contact">Contact</Link>
      </div>
      <div className="footer-links">
        <a href="mailto:hello@myriad.video">hello@myriad.video</a>
        <a href="tel:+13105551234">+1 (310) 555-1234</a>
      </div>
    </footer>
  )
}

export default Footer

import type { MouseEvent } from 'react'

type FooterProps = {
  onNavigate: (to: string) => void
}

const Footer = ({ onNavigate }: FooterProps) => {
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, to: string) => {
    event.preventDefault()
    onNavigate(to)
  }

  return (
    <footer className="footer mt-12">
      <div>
        <h3>The Void</h3>
        <p>Lagos · Abuja · London</p>
      </div>
      <div className="footer-links">
        <a href="/#featured-work" onClick={(event) => handleNavigate(event, '/#featured-work')}>
          Work
        </a>
        <a href="/#mission" onClick={(event) => handleNavigate(event, '/#mission')}>
          Services
        </a>
        <a href="/about" onClick={(event) => handleNavigate(event, '/about')}>
          About
        </a>
        <a href="/#contact" onClick={(event) => handleNavigate(event, '/#contact')}>
          Contact
        </a>
      </div>
      <div className="footer-links">
        <a href="mailto:hello@myriad.video">hello@myriad.video</a>
        <a href="tel:+13105551234">+1 (310) 555-1234</a>
      </div>
    </footer>
  )
}

export default Footer

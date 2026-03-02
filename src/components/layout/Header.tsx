import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import WhiteLogo from  '../../assets/icons/logo-white.png'
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(max-width: 768px)')
    const handleChange = () => setIsMobile(media.matches)
    handleChange()
    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }
    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [])

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  const hamburgerStyle: CSSProperties = {
    display: isMobile ? 'inline-flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '4px',
    width: '44px',
    height: '44px',
    marginLeft: 'auto',
    border: '1px solid var(--border)',
    borderRadius: '999px',
    background: 'transparent',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  }

  const barStyle: CSSProperties = {
    display: 'block',
    width: '18px',
    height: '2px',
    background: 'var(--text-primary)',
    borderRadius: '999px',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  }

  const navLinksStyle: CSSProperties | undefined = isMobile
    ? {
        display: isMenuOpen ? 'flex' : 'none',
        width: '100%',
        flexDirection: 'column',
        gap: '0.85rem',
        padding: '0.75rem 0 1rem',
      }
    : undefined

  return (
    <header className="site-header">
      <nav className="nav">
        <Link className="brand" to="/">
          <img className='h-[40px]' src={WhiteLogo} alt="The Void"/>
          <span className="brand-name">The Void</span>
        </Link>
        <button
          className="hamburger"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
          style={hamburgerStyle}
        >
          <span
            style={{
              ...barStyle,
              transform: isMenuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
            }}
          />
          <span style={{ ...barStyle, opacity: isMenuOpen ? 0 : 1 }} />
          <span
            style={{
              ...barStyle,
              transform: isMenuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
        <div
          id="primary-navigation"
          className="nav-links"
          style={navLinksStyle}
        >
          <Link to="/#featured-work" onClick={closeMenu}>Work</Link>
          <Link to="/#mission" onClick={closeMenu}>Services</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/#contact" onClick={closeMenu}>Contact</Link>
        </div>
        <a className="hidden md:block" href='https://wa.me/2348119113099' target="_blank" rel="noopener noreferrer"  >
          <button className="cta scale-103 md:block hidden " type="button">
            Get in touch
          </button>
        </a>
      </nav>
    </header>
  )
}

export default Header

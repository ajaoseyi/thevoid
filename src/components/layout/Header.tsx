import type { MouseEvent } from 'react'

type HeaderProps = {
  onNavigate: (to: string) => void
}

const Header = ({ onNavigate }: HeaderProps) => {
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, to: string) => {
    event.preventDefault()
    onNavigate(to)
  }

  return (
    <header className="site-header">
      <nav className="nav">
        <a className="brand" href="/" onClick={(event) => handleNavigate(event, '/')}>
          <span className="brand-mark" />
          <span className="brand-name">The Void</span>
        </a>
        <div className="nav-links">
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
        <button className="cta" type="button" onClick={() => onNavigate('/#contact')}>
          Get in touch
        </button>
      </nav>
    </header>
  )
}

export default Header

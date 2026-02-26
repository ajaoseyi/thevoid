import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="site-header">
      <nav className="nav">
        <Link className="brand" to="/">
          <span className="brand-mark" />
          <span className="brand-name">The Void</span>
        </Link>
        <div className="nav-links">
          <Link to="/#featured-work">Work</Link>
          <Link to="/#mission">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/#contact">Contact</Link>
        </div>
        {/* <button className="cta" type="button">
          Get in touch
        </button> */}
      </nav>
    </header>
  )
}

export default Header

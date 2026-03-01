import { Link } from 'react-router-dom'
import WhiteLogo from  '../../assets/icons/logo-white.png'
const Header = () => {
  return (
    <header className="site-header">
      <nav className="nav">
        <Link className="brand" to="/">
          <img className='h-[40px]' src={WhiteLogo}/>
          <span className="brand-name">The Void</span>
        </Link>
        <div className="nav-links">
          <Link to="/#featured-work">Work</Link>
          <Link to="/#mission">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/#contact">Contact</Link>
        </div>
        <a href='https://wa.me/2348119113099' target="_blank" rel="noopener noreferrer"  >
         <button className="cta scale-103" type="button">
          Get in touch
        </button>
        </a>
      </nav>
    </header>
  )
}

export default Header

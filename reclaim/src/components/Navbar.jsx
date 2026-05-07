import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'

function Navbar() {
  const navigate = useNavigate()
  const user = auth.currentUser
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 1.5rem', borderBottom: '1px solid #eee',
      position: 'sticky', top: 0, background: '#fff', zIndex: 100,
    }}>
      <Link to="/" style={{ fontWeight: '700', fontSize: '1.1rem', textDecoration: 'none', color: '#1a1a1a' }}>
        Reclaim
      </Link>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}
        className="desktop-nav">
        <Link to="/browse" style={navLink}>Browse</Link>
        <Link to="/post" style={navLink}>Post Item</Link>
        {user ? (
          <>
            <Link to="/profile" style={navLink}>Profile</Link>
            <button onClick={handleLogout} style={logoutBtn}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={loginBtn}>Login</Link>
        )}
      </div>

      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none', flexDirection: 'column', gap: '5px',
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
        }}
        className="hamburger"
      >
        <span style={{ width: '22px', height: '2px', background: '#1a1a1a', display: 'block', borderRadius: '2px' }} />
        <span style={{ width: '22px', height: '2px', background: '#1a1a1a', display: 'block', borderRadius: '2px' }} />
        <span style={{ width: '22px', height: '2px', background: '#1a1a1a', display: 'block', borderRadius: '2px' }} />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '60px', left: 0, right: 0,
          background: '#fff', borderBottom: '1px solid #eee',
          display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem', gap: '1rem',
          zIndex: 99,
        }}
          className="mobile-menu"
        >
          <Link to="/browse" onClick={() => setMenuOpen(false)} style={navLink}>Browse</Link>
          <Link to="/post" onClick={() => setMenuOpen(false)} style={navLink}>Post Item</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={navLink}>Profile</Link>
              <button onClick={handleLogout} style={{ ...logoutBtn, textAlign: 'left' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} style={loginBtn}>Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}

const navLink = { fontSize: '0.9rem', color: '#444', textDecoration: 'none', fontWeight: '500' }
const logoutBtn = { background: '#f5f5f5', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', border: 'none', cursor: 'pointer' }
const loginBtn = { background: '#1a1a1a', color: '#fff', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', textDecoration: 'none' }

export default Navbar
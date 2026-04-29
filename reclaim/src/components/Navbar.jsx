import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'

function Navbar() {
  const navigate = useNavigate()
  const user = auth.currentUser

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid #eee'
    }}>
      <Link to="/" style={{ fontWeight: '700', fontSize: '1.1rem' }}>Reclaim</Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/browse">Browse</Link>
        <Link to="/post">Post Item</Link>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} style={{
              background: '#f5f5f5', padding: '0.4rem 1rem',
              borderRadius: '6px', fontSize: '0.85rem'
            }}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{
            background: '#1a1a1a', color: '#fff',
            padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem'
          }}>Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid #eee'
    }}>
      <Link to="/" style={{ fontWeight: '700', fontSize: '1.1rem' }}>Reclaim</Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/browse">Browse</Link>
        <Link to="/post">Post Item</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  )
}

export default Navbar
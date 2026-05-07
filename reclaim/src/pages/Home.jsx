import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1 style={{
        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
        fontWeight: '700', marginBottom: '1rem', lineHeight: '1.2'
      }}>
        Lost something?
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
        Browse lost & found items on campus or post one yourself.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/browse" style={{
          background: '#1a1a1a', color: '#fff',
          padding: '0.7rem 1.4rem', borderRadius: '8px',
          fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none'
        }}>Browse Items</Link>
        <Link to="/post" style={{
          background: '#f5f5f5', color: '#1a1a1a',
          padding: '0.7rem 1.4rem', borderRadius: '8px',
          fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none'
        }}>Post an Item</Link>
      </div>
    </div>
  )
}

export default Home
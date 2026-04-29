import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
        Lost something?
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Browse lost & found items on campus or post one yourself.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/browse" style={{
          background: '#1a1a1a', color: '#fff',
          padding: '0.7rem 1.4rem', borderRadius: '8px'
        }}>Browse Items</Link>
        <Link to="/post" style={{
          background: '#f5f5f5', color: '#181717ff',
          padding: '0.7rem 1.4rem', borderRadius: '8px'
        }}>Post an Item</Link>
      </div>
    </div>
  )
}

export default Home
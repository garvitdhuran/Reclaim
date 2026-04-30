import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Link } from 'react-router-dom'

function Browse() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setItems(data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchItems()
  }, [])

  if (loading) return <p style={{ padding: '3rem 2rem', color: '#999' }}>Loading...</p>

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: '700' }}>Browse Items</h2>
        <Link to="/post" style={{
          background: '#1a1a1a', color: '#fff',
          padding: '0.5rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem'
        }}>+ Post Item</Link>
      </div>

      {items.length === 0 && (
        <p style={{ color: '#999' }}>No items posted yet. Be the first!</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(item => (
          <Link to={`/item/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
            <div style={{
              border: '1px solid #eee',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              transition: 'border-color 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ccc'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: '600',
                    padding: '2px 8px', borderRadius: '20px',
                    background: item.type === 'lost' ? '#fff0f0' : '#f0fff4',
                    color: item.type === 'lost' ? '#cc0000' : '#007a33'
                  }}>
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#999' }}>{item.date}</span>
                </div>
                <h3 style={{ fontWeight: '600', fontSize: '1rem', color: '#1a1a1a', marginBottom: '0.3rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>{item.location}</p>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#bbb', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                View →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Browse
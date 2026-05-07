import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Link } from 'react-router-dom'

function Home() {
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, resolved: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'items'))
        const items = snapshot.docs.map(d => d.data())
        setStats({
          total:    items.length,
          lost:     items.filter(i => i.type === 'lost').length,
          found:    items.filter(i => i.type === 'found').length,
          resolved: items.filter(i => i.status !== 'active').length,
        })
      } catch (err) {
        console.error(err)
      }
      setLoadingStats(false)
    }
    fetchStats()
  }, [])

  return (
    <div style={{ maxWidth: '680px', margin: '5rem auto', padding: '0 1.5rem' }}>

      {/* Hero */}
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 2.8rem)',
        fontWeight: '700', marginBottom: '1rem',
        lineHeight: '1.2', color: '#111',
      }}>
        Lost something on campus?
      </h1>
      <p style={{ color: '#888', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: '1.6' }}>
        Reclaim is your campus lost & found — post what you lost or found,
        search by location, and get it back fast.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
        <Link to="/browse" style={{
          background: '#1a1a1a', color: '#fff',
          padding: '0.75rem 1.5rem', borderRadius: '8px',
          fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none',
        }}>Browse Items</Link>
        <Link to="/post" style={{
          background: '#f5f5f5', color: '#1a1a1a',
          padding: '0.75rem 1.5rem', borderRadius: '8px',
          fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none',
        }}>+ Post an Item</Link>
      </div>

      {/* Live Stats */}
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          Live on campus
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Total Posted', value: stats.total },
            { label: 'Lost',         value: stats.lost  },
            { label: 'Found',        value: stats.found },
            { label: 'Resolved',     value: stats.resolved },
          ].map(s => (
            <div key={s.label} style={{
              border: '1px solid #eee', borderRadius: '12px',
              padding: '1.1rem 1rem', background: '#fff',
            }}>
              <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111', margin: 0, lineHeight: 1 }}>
                {loadingStats ? '—' : s.value}
              </p>
              <p style={{ fontSize: '0.78rem', color: '#aaa', margin: '0.4rem 0 0' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home
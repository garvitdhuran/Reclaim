import { useEffect, useState, useMemo } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Link } from 'react-router-dom'

const LOCATIONS = ['All', 'Library', 'Atrium', 'Auditorium', 'A Block Mess', 'CCD', 'C Block', 'B Block', 'Chai Adda', 'Learners Arena', 'Pushpa Devi Mess', 'Football Ground', 'Basketball Court', 'Tennis Court', 'Main Ground', 'Other']

const CATEGORIES = ['All', 'ID Card', 'Wallet', 'Phone', 'Earphones', 'Laptop', 'Bottle', 'Keys', 'Bag', 'Charger', 'Stationery', 'Clothing', 'Other']

const inputStyle = {
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  border: '1.5px solid #e0e0e0',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
  transition: 'border-color 0.2s',
  width: '100%',
  boxSizing: 'border-box',
}

const labelStyle = {
  fontSize: '0.75rem',
  color: '#aaa',
  marginBottom: '0.3rem',
  display: 'block',
  fontWeight: '500',
}

function Browse() {
  const [items, setItems]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [keyword, setKeyword]           = useState('')
  const [location, setLocation]         = useState('All')
  const [locationText, setLocationText] = useState('')
  const [category, setCategory]         = useState('All')
  const [exactDate, setExactDate]       = useState('')
  const [dateFrom, setDateFrom]         = useState('')
  const [dateTo, setDateTo]             = useState('')

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

  const filtered = useMemo(() => {
    const kw  = keyword.trim().toLowerCase()
    const loc = locationText.trim().toLowerCase()
    return items.filter(item => {
      if (kw && !item.title?.toLowerCase().includes(kw) && !item.description?.toLowerCase().includes(kw)) return false
      if (location !== 'All' && !item.location?.toLowerCase().startsWith(location.toLowerCase())) return false
      if (loc && !item.location?.toLowerCase().includes(loc)) return false
      if (category !== 'All') {
        if (!item.category || item.category.toLowerCase() !== category.toLowerCase()) return false
      }
      if (exactDate) {
        if (item.date !== exactDate) return false
      } else {
        if (dateFrom && item.date < dateFrom) return false
        if (dateTo   && item.date > dateTo)   return false
      }
      return true
    })
  }, [items, keyword, location, locationText, category, exactDate, dateFrom, dateTo])

  const clearAll = () => {
    setKeyword(''); setLocation('All'); setLocationText('')
    setCategory('All'); setExactDate(''); setDateFrom(''); setDateTo('')
  }

  const hasFilters = keyword || location !== 'All' || locationText || category !== 'All' || exactDate || dateFrom || dateTo

  if (loading) return <p style={{ padding: '3rem 2rem', color: '#999' }}>Loading...</p>

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontWeight: '700', fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', color: '#111' }}>Browse Items</h2>
        <Link to="/post" style={{
          background: '#1a1a1a', color: '#fff',
          padding: '0.5rem 1rem', borderRadius: '8px',
          fontSize: '0.82rem', textDecoration: 'none', fontWeight: '500', whiteSpace: 'nowrap'
        }}>+ Post Item</Link>
      </div>

      {/* Filters */}
      <div style={{
        background: '#fafafa', border: '1px solid #eee', borderRadius: '12px',
        padding: '1rem', marginBottom: '1.25rem',
        display: 'flex', flexDirection: 'column', gap: '0.9rem',
      }}>
        {/* Keyword */}
        <input
          type="text"
          placeholder="🔍  Search by keyword…"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={inputStyle}
        />

        {/* Category chips */}
        <div>
          <label style={labelStyle}>Category</label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1.5px solid',
                borderColor: category === cat ? '#1a1a1a' : '#e0e0e0',
                background: category === cat ? '#1a1a1a' : '#fff',
                color: category === cat ? '#fff' : '#666',
                fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select value={location} onChange={e => setLocation(e.target.value)}
            style={{ ...inputStyle, width: 'auto', flex: '1 1 140px' }}>
            {LOCATIONS.map(l => <option key={l} value={l}>{l === 'All' ? 'All locations' : l}</option>)}
          </select>
          <input
            type="text" placeholder="Or type a location…"
            value={locationText} onChange={e => setLocationText(e.target.value)}
            style={{ ...inputStyle, flex: '1 1 140px' }}
          />
        </div>

        {/* Date filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 120px' }}>
            <label style={labelStyle}>Exact date</label>
            <input type="date" value={exactDate}
              onChange={e => { setExactDate(e.target.value); setDateFrom(''); setDateTo('') }}
              style={inputStyle} />
          </div>
          <span style={{ color: '#ccc', fontSize: '0.82rem', paddingBottom: '0.5rem' }}>or</span>
          <div style={{ flex: '1 1 100px' }}>
            <label style={labelStyle}>From</label>
            <input type="date" value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setExactDate('') }}
              style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={labelStyle}>To</label>
            <input type="date" value={dateTo}
              onChange={e => { setDateTo(e.target.value); setExactDate('') }}
              style={inputStyle} />
          </div>
        </div>

        {hasFilters && (
          <button onClick={clearAll} style={{
            alignSelf: 'flex-start', background: 'none', border: 'none',
            color: '#999', fontSize: '0.8rem', cursor: 'pointer',
            padding: 0, textDecoration: 'underline', fontFamily: 'inherit',
          }}>Clear all filters</button>
        )}
      </div>

      {/* Count */}
      <p style={{ fontSize: '0.82rem', color: '#aaa', marginBottom: '1rem' }}>
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
        {hasFilters ? ' for current filters' : ''}
      </p>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '3rem 1rem', color: '#bbb',
          border: '1.5px dashed #eee', borderRadius: '12px',
        }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</p>
          <p style={{ fontWeight: '500', color: '#999' }}>No items match your filters.</p>
          <p style={{ fontSize: '0.85rem' }}>Try a different keyword or clear the filters.</p>
        </div>
      )}

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filtered.map(item => (
          <Link to={`/item/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
            <div style={{
              border: '1px solid #eee', borderRadius: '12px', padding: '1rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              transition: 'border-color 0.2s', background: '#fff',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ccc'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: '600', padding: '2px 8px', borderRadius: '20px',
                    background: item.type === 'lost' ? '#fff0f0' : '#f0fff4',
                    color: item.type === 'lost' ? '#cc0000' : '#007a33',
                  }}>
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </span>
                  {item.category && (
                    <span style={{
                      fontSize: '0.72rem', padding: '2px 8px', borderRadius: '20px',
                      background: '#f0f0f0', color: '#555', fontWeight: '500',
                    }}>{item.category}</span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: '#bbb' }}>{item.date}</span>
                </div>
                <h3 style={{
                  fontWeight: '600', fontSize: '0.95rem', color: '#1a1a1a',
                  marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#888', margin: 0 }}>📍 {item.location}</p>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#bbb', whiteSpace: 'nowrap', marginLeft: '0.75rem', marginTop: '0.2rem' }}>
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
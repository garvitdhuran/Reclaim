import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'

function PostItem() {
  const [type, setType] = useState('lost')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!auth.currentUser) {
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, 'items'), {
        type,
        title,
        description,
        location,
        date,
        status: 'active',
        postedBy: auth.currentUser.uid,
        postedByEmail: auth.currentUser.email,
        createdAt: serverTimestamp()
      })
      navigate('/browse')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '500px', margin: '3rem auto', padding: '0 2rem' }}>
      <h2 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Post an Item</h2>
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
        Report something you lost or found on campus.
      </p>

      {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Lost or Found toggle */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setType('lost')}
            style={{
              flex: 1, padding: '0.6rem',
              borderRadius: '8px', border: '1px solid',
              borderColor: type === 'lost' ? '#1a1a1a' : '#e0e0e0',
              background: type === 'lost' ? '#1a1a1a' : '#fff',
              color: type === 'lost' ? '#fff' : '#666',
              fontWeight: '500', cursor: 'pointer'
            }}>
            Lost
          </button>
          <button
            type="button"
            onClick={() => setType('found')}
            style={{
              flex: 1, padding: '0.6rem',
              borderRadius: '8px', border: '1px solid',
              borderColor: type === 'found' ? '#1a1a1a' : '#e0e0e0',
              background: type === 'found' ? '#1a1a1a' : '#fff',
              color: type === 'found' ? '#fff' : '#666',
              fontWeight: '500', cursor: 'pointer'
            }}>
            Found
          </button>
        </div>

        <input
          type="text"
          placeholder="Item name (e.g. Blue water bottle)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />

        <textarea
          placeholder="Description — color, brand, any details that help identify it"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        <input
          type="text"
          placeholder="Location (e.g. Library 2nd floor)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            background: loading ? '#999' : '#1a1a1a',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
          {loading ? 'Posting...' : 'Post Item'}
        </button>

      </form>
    </div>
  )
}

const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  fontSize: '0.95rem',
  outline: 'none',
  width: '100%'
}

export default PostItem
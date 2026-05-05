import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useParams, useNavigate } from 'react-router-dom'

function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, 'items', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() })
        } else {
          navigate('/browse')
        }
      } catch (err) {
        console.error(err)
        navigate('/browse')
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id, navigate])

  if (loading) return <p style={{ padding: '3rem 2rem', color: '#999' }}>Loading...</p>
  if (!item) return null

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1.5rem' }}>

      {/* Back */}
      <button
        onClick={() => navigate('/browse')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#999', fontSize: '0.88rem', padding: 0,
          marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
        }}
      >
        ← Back to Browse
      </button>

      {/* Image */}
      {item.imageUrl && (
        <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.75rem', fontWeight: '600', padding: '3px 10px', borderRadius: '20px',
            background: item.type === 'lost' ? '#fff0f0' : '#f0fff4',
            color: item.type === 'lost' ? '#cc0000' : '#007a33',
          }}>
            {item.type === 'lost' ? 'Lost' : 'Found'}
          </span>
          <span style={{
            fontSize: '0.75rem', fontWeight: '500', padding: '3px 10px', borderRadius: '20px',
            background: item.status === 'active' ? '#f4f4f4' : '#f0fff4',
            color: item.status === 'active' ? '#555' : '#276749',
          }}>
            {item.status === 'active' ? 'Active' : 'Resolved ✓'}
          </span>
        </div>

        <h1 style={{ fontWeight: '700', fontSize: '1.6rem', color: '#111', marginBottom: '0.5rem' }}>
          {item.title}
        </h1>

        <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: '#888' }}>📍 {item.location}</span>
          <span style={{ fontSize: '0.85rem', color: '#888' }}>📅 {item.date}</span>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '1.5rem' }} />

      {/* Description */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontWeight: '600', fontSize: '0.9rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
          Description
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.6' }}>
          {item.description}
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '1.5rem' }} />

      {/* Contact */}
      <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '12px', padding: '1.25rem' }}>
        <h3 style={{ fontWeight: '600', fontSize: '0.9rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
          Contact the Poster
        </h3>

        {/* Email */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#bbb', margin: '0 0 0.2rem' }}>Email</p>
            <p style={{ fontSize: '0.95rem', fontWeight: '500', color: '#1a1a1a', margin: 0 }}>
              {item.postedByEmail}
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(item.postedByEmail)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            style={{
              padding: '0.4rem 1rem', borderRadius: '8px',
              border: '1.5px solid #e0e0e0',
              background: copied ? '#f0fff4' : '#fff',
              color: copied ? '#276749' : '#555',
              fontSize: '0.82rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>

        {/* WhatsApp — fully inlined, no variable */}
        <a
          href={`https://wa.me/?text=Hi, I saw your post on Reclaim about "${item.title}". I think I can help!`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.7rem', borderRadius: '10px',
            background: '#25D366', color: '#fff',
            fontWeight: '600', fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Message on WhatsApp
        </a>
      </div>

    </div>
  )
}

export default ItemDetails
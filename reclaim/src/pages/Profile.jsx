import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'

const LOCATIONS = [
  'Library', 'Atrium', 'Auditorium', 'A Block Mess', 'CCD', 'C Block',
  'B Block', 'Chai Adda', 'Learners Arena', 'Pushpa Devi Mess',
  'Football Ground', 'Basketball Court', 'Tennis Court', 'Main Ground', 'R1', 'R2', 'R3', 'Other'
]

const CATEGORIES = [
  'ID Card', 'Wallet', 'Phone', 'Earphones', 'Laptop', 'Bottle',
  'Keys', 'Bag', 'Charger', 'Stationery', 'Clothing', 'Other'
]

const STATUS_COLORS = {
  active:    { bg: '#f4f4f4', color: '#555' },
  returned:  { bg: '#f0fff4', color: '#276749' },
  reclaimed: { bg: '#ebf8ff', color: '#1a5276' },
}

const STATUS_LABEL = {
  active:    'Active',
  returned:  'Returned ✓',
  reclaimed: 'Got it back ✓',
}

const inputStyle = {
  padding: '0.6rem 0.9rem',
  borderRadius: '8px',
  border: '1.5px solid #e0e0e0',
  fontSize: '0.88rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  background: '#fff',
}

function Badge({ text, bg, color }) {
  return (
    <span style={{
      fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px',
      borderRadius: '20px', background: bg, color,
    }}>{text}</span>
  )
}

function SectionHeader({ emoji, title, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
      <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
      <h3 style={{ fontWeight: '700', fontSize: '1rem', color: '#111', margin: 0 }}>{title}</h3>
      <span style={{
        fontSize: '0.75rem', background: '#f0f0f0', color: '#888',
        borderRadius: '20px', padding: '1px 8px', fontWeight: '500',
      }}>{count}</span>
    </div>
  )
}

function ItemRow({ item, onMarkReturned, onMarkReclaimed, onDelete, onEdit }) {
  const [confirm, setConfirm]     = useState(false)
  const [editing, setEditing]     = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)
  const [editDesc, setEditDesc]   = useState(item.description)
  const [editLoc, setEditLoc]     = useState(item.location)
  const [editCat, setEditCat]     = useState(item.category || '')
  const [saving, setSaving]       = useState(false)

  const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.active

  const handleSave = async () => {
    if (!editTitle.trim() || !editDesc.trim() || !editLoc) return
    setSaving(true)
    await onEdit(item.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      location: editLoc,
      category: editCat,
    })
    setSaving(false)
    setEditing(false)
  }

  return (
    <div style={{
      border: '1px solid #eee', borderRadius: '12px',
      padding: '1rem 1.2rem', background: '#fff',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge
            text={item.type === 'lost' ? 'Lost' : 'Found'}
            bg={item.type === 'lost' ? '#fff0f0' : '#f0fff4'}
            color={item.type === 'lost' ? '#cc0000' : '#007a33'}
          />
          <Badge
            text={STATUS_LABEL[item.status] || 'Active'}
            bg={statusStyle.bg}
            color={statusStyle.color}
          />
          {item.category && (
            <Badge text={item.category} bg="#f0f0f0" color="#555" />
          )}
        </div>
        <span style={{ fontSize: '0.78rem', color: '#bbb' }}>{item.date}</span>
      </div>

      {/* Edit form or normal view */}
      {editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.3rem' }}>
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="Item name"
            style={inputStyle}
          />
          <textarea
            value={editDesc}
            onChange={e => setEditDesc(e.target.value)}
            placeholder="Description"
            rows={2}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <select
            value={editCat}
            onChange={e => setEditCat(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select category…</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={editLoc}
            onChange={e => setEditLoc(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select location…</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '0.4rem 1rem', borderRadius: '8px', border: 'none',
                background: '#1a1a1a', color: '#fff',
                fontSize: '0.82rem', fontWeight: '500', cursor: 'pointer',
              }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(false); setEditTitle(item.title); setEditDesc(item.description); setEditLoc(item.location); setEditCat(item.category || '') }}
              style={{
                padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid #e0e0e0',
                background: '#fff', color: '#666',
                fontSize: '0.82rem', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1a1a1a', margin: 0 }}>{item.title}</p>
          <p style={{ fontSize: '0.82rem', color: '#999', margin: '0.2rem 0 0' }}>📍 {item.location}</p>
          <p style={{ fontSize: '0.82rem', color: '#777', margin: '0.3rem 0 0', lineHeight: '1.4' }}>
            {item.description}
          </p>
        </div>
      )}

      {/* Actions */}
      {item.status === 'active' && !editing && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
          {item.type === 'found' && (
            <button onClick={() => onMarkReturned(item.id)} style={actionBtn('#f0fff4', '#276749')}>
              ✓ Mark as Returned
            </button>
          )}
          {item.type === 'lost' && (
            <button onClick={() => onMarkReclaimed(item.id)} style={actionBtn('#ebf8ff', '#1a5276')}>
              ✓ Got it back
            </button>
          )}
          <button onClick={() => setEditing(true)} style={actionBtn('#f9f9f9', '#444')}>
            ✏️ Edit
          </button>
          {!confirm ? (
            <button onClick={() => setConfirm(true)} style={actionBtn('#fff5f5', '#c53030')}>
              🗑 Delete
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#c53030' }}>Sure?</span>
              <button onClick={() => onDelete(item.id)} style={actionBtn('#fff0f0', '#c53030')}>Yes, delete</button>
              <button onClick={() => setConfirm(false)} style={actionBtn('#f4f4f4', '#555')}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const actionBtn = (bg, color) => ({
  padding: '0.3rem 0.8rem', borderRadius: '8px', border: '1px solid',
  borderColor: color + '44', background: bg, color,
  fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer',
})

function EmptyState({ msg }) {
  return (
    <div style={{
      textAlign: 'center', padding: '2rem 1rem',
      border: '1.5px dashed #eee', borderRadius: '12px', color: '#bbb',
    }}>
      <p style={{ margin: 0, fontSize: '0.88rem' }}>{msg}</p>
    </div>
  )
}

function Profile() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = auth.currentUser

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const fetchMyItems = async () => {
      try {
        const q = query(
          collection(db, 'items'),
          where('postedBy', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchMyItems()
  }, [user, navigate])

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'items', id), { status })
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'items', id))
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleEdit = async (id, updates) => {
    await updateDoc(doc(db, 'items', id), updates)
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  const myFound = items.filter(i => i.type === 'found')
  const myLost  = items.filter(i => i.type === 'lost')

  const totalPosted   = items.length
  const totalReturned = items.filter(i => i.status === 'returned' || i.status === 'reclaimed').length
  const totalActive   = items.filter(i => i.status === 'active').length

  if (loading) return <p style={{ padding: '3rem 2rem', color: '#999' }}>Loading...</p>

  return (
    <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '0 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: '700', fontSize: '1.6rem', color: '#111', marginBottom: '0.25rem' }}>
          My Profile
        </h2>
        <p style={{ color: '#888', fontSize: '0.88rem', margin: 0 }}>{user.email}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Posted', value: totalPosted,   bg: '#f4f4f4', color: '#333' },
          { label: 'Active',       value: totalActive,   bg: '#fff8e1', color: '#b7791f' },
          { label: 'Resolved',     value: totalReturned, bg: '#f0fff4', color: '#276749' },
        ].map(s => (
          <div key={s.label} style={{
            flex: '1 1 80px', background: s.bg, borderRadius: '10px',
            padding: '0.75rem 1rem', textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.4rem', fontWeight: '700', color: s.color, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: '0.75rem', color: '#999', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Found items */}
      <div style={{ marginBottom: '2.5rem' }}>
        <SectionHeader title="Items I Found & Reported" count={myFound.length} />
        {myFound.length === 0
          ? <EmptyState msg="You haven't reported any found items yet." />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {myFound.map(item => (
                <ItemRow
                  key={item.id} item={item}
                  onMarkReturned={(id) => updateStatus(id, 'returned')}
                  onMarkReclaimed={(id) => updateStatus(id, 'reclaimed')}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
        }
      </div>

      {/* Lost items */}
      <div style={{ marginBottom: '2.5rem' }}>
        <SectionHeader title="Items I Lost & Reported" count={myLost.length} />
        {myLost.length === 0
          ? <EmptyState msg="You haven't reported any lost items yet." />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {myLost.map(item => (
                <ItemRow
                  key={item.id} item={item}
                  onMarkReturned={(id) => updateStatus(id, 'returned')}
                  onMarkReclaimed={(id) => updateStatus(id, 'reclaimed')}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
        }
      </div>

    </div>
  )
}

export default Profile
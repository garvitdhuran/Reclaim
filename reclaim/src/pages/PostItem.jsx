import { useState, useRef } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'

const LOCATIONS = [
  'Library', 'Atrium', 'Auditorium', 'A Block Mess', 'CCD', 'C Block',
  'B Block', 'Chai Adda', 'Learners Arena', 'Pushpa Devi Mess',
  'Football Ground', 'Basketball Court', 'Tennis Court', 'Main Ground', 'R1', 'R2', 'R3', 'Other'
]

const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1.5px solid #e0e0e0',
  fontSize: '0.95rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
  background: '#fff',
}

const inputErrorStyle = {
  ...inputStyle,
  borderColor: '#e53e3e',
}

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p style={{ color: '#e53e3e', fontSize: '0.78rem', marginTop: '0.25rem', marginBottom: 0 }}>
      {msg}
    </p>
  )
}

function PostItem() {
  const [type, setType]                     = useState('lost')
  const [title, setTitle]                   = useState('')
  const [description, setDescription]       = useState('')
  const [location, setLocation]             = useState('')
  const [locationDetail, setLocationDetail] = useState('')
  const [date, setDate]                     = useState('')
  const [image, setImage]                   = useState(null)
  const [imagePreview, setImagePreview]     = useState(null)
  const [loading, setLoading]               = useState(false)
  const [submitError, setSubmitError]       = useState('')
  const [fieldErrors, setFieldErrors]       = useState({})
  const [success, setSuccess]               = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  // ── Cloudinary upload ──
  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'uzpkwhpn')
    const res = await fetch('https://api.cloudinary.com/v1_1/dr1nh9u6e/image/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (!data.secure_url) throw new Error('Image upload failed. Please try again.')
    return data.secure_url
  }

  const validate = () => {
    const errors = {}
    if (!title.trim()) {
      errors.title = 'Item name is required.'
    } else if (title.trim().length < 3) {
      errors.title = 'Item name must be at least 3 characters.'
    }
    if (!description.trim()) {
      errors.description = 'Description is required.'
    } else if (description.trim().length < 10) {
      errors.description = 'Please add a bit more detail (min 10 characters).'
    }
    if (!location) {
      errors.location = 'Please select a location.'
    }
    if (!date) {
      errors.date = 'Date is required.'
    } else if (date > today) {
      errors.date = 'Date cannot be in the future.'
    }
    if (image && image.size > 5 * 1024 * 1024) {
      errors.image = 'Image must be under 5MB.'
    }
    return errors
  }

  const handleBlur = (field) => {
    const allErrors = validate()
    setFieldErrors((prev) => ({ ...prev, [field]: allErrors[field] }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
    setFieldErrors((prev) => ({ ...prev, image: undefined }))
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!auth.currentUser) {
      navigate('/login')
      return
    }

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    try {
      let imageUrl = ''
      if (image) {
        imageUrl = await uploadImage(image)
      }

      const fullLocation = locationDetail.trim()
        ? `${location} — ${locationDetail.trim()}`
        : location

      await addDoc(collection(db, 'items'), {
        type,
        title: title.trim(),
        description: description.trim(),
        location: fullLocation,
        date,
        imageUrl,
        status: 'active',
        postedBy: auth.currentUser.uid,
        postedByEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      })

      setSuccess(true)
      setTimeout(() => navigate('/browse'), 1200)
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '520px', margin: '3rem auto', padding: '0 1.5rem' }}>

      <h2 style={{ fontWeight: '700', fontSize: '1.6rem', marginBottom: '0.3rem', color: '#111' }}>
        Post an Item
      </h2>
      <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>
        Report something you lost or found on campus.
      </p>

      {submitError && (
        <div style={{
          background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '8px',
          padding: '0.75rem 1rem', color: '#c53030', fontSize: '0.85rem', marginBottom: '1.25rem',
        }}>
          {submitError}
        </div>
      )}

      {success && (
        <div style={{
          background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: '8px',
          padding: '0.75rem 1rem', color: '#276749', fontSize: '0.9rem',
          marginBottom: '1.25rem', fontWeight: '500',
        }}>
          ✓ Posted successfully! Redirecting…
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

        {/* Lost / Found Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['lost', 'found'].map((t) => (
            <button
              key={t} type="button" onClick={() => setType(t)}
              style={{
                flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1.5px solid',
                borderColor: type === t ? '#1a1a1a' : '#e0e0e0',
                background: type === t ? '#1a1a1a' : '#fff',
                color: type === t ? '#fff' : '#888',
                fontWeight: '500', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.15s',
              }}
            >
              {t === 'lost' ? '😔 Lost' : '🙌 Found'}
            </button>
          ))}
        </div>

        {/* Item Name */}
        <div>
          <input
            type="text"
            placeholder="Item name (e.g. Blue water bottle)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur('title')}
            style={fieldErrors.title ? inputErrorStyle : inputStyle}
          />
          <FieldError msg={fieldErrors.title} />
        </div>

        {/* Description */}
        <div>
          <textarea
            placeholder="Description — color, brand, any identifying details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description')}
            rows={3}
            style={{ ...(fieldErrors.description ? inputErrorStyle : inputStyle), resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <FieldError msg={fieldErrors.description} />
            <span style={{ fontSize: '0.75rem', color: '#bbb', marginLeft: 'auto', marginTop: '0.2rem' }}>
              {description.length} chars
            </span>
          </div>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <select
            value={location}
            onChange={(e) => { setLocation(e.target.value); handleBlur('location') }}
            onBlur={() => handleBlur('location')}
            style={fieldErrors.location ? inputErrorStyle : inputStyle}
          >
            <option value="">Select a location…</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <FieldError msg={fieldErrors.location} />
          {location && (
            <input
              type="text"
              placeholder="Floor / specific spot (optional) e.g. 2nd floor, near gate"
              value={locationDetail}
              onChange={(e) => setLocationDetail(e.target.value)}
              style={{ ...inputStyle, fontSize: '0.88rem', color: '#555' }}
            />
          )}
        </div>

        {/* Date */}
        <div>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            onBlur={() => handleBlur('date')}
            style={fieldErrors.date ? inputErrorStyle : inputStyle}
          />
          <FieldError msg={fieldErrors.date} />
        </div>

        {/* Image Upload with preview */}
        <div>
          {!imagePreview ? (
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '0.4rem', padding: '1.5rem',
              border: `1.5px dashed ${fieldErrors.image ? '#e53e3e' : '#d0d0d0'}`,
              borderRadius: '10px', cursor: 'pointer', background: '#fafafa',
              color: '#999', fontSize: '0.88rem', transition: 'border-color 0.2s',
            }}>
              <span style={{ fontSize: '1.5rem' }}>📷</span>
              <span>Click to upload a photo <span style={{ color: '#bbb' }}>(optional)</span></span>
              <span style={{ fontSize: '0.75rem', color: '#bbb' }}>Max 5MB · JPG, PNG, WEBP</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
          ) : (
            <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #e0e0e0' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }}
              />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none',
                  borderRadius: '6px', padding: '0.3rem 0.6rem',
                  fontSize: '0.78rem', cursor: 'pointer', fontWeight: '500',
                }}
              >
                ✕ Remove
              </button>
              <div style={{
                padding: '0.5rem 0.75rem', fontSize: '0.78rem', color: '#888',
                background: '#fafafa', borderTop: '1px solid #f0f0f0',
              }}>
                {image?.name} · {(image?.size / 1024).toFixed(0)} KB
              </div>
            </div>
          )}
          <FieldError msg={fieldErrors.image} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          style={{
            padding: '0.8rem',
            background: loading || success ? '#999' : '#1a1a1a',
            color: '#fff', borderRadius: '8px', fontSize: '0.95rem',
            fontWeight: '600', cursor: loading || success ? 'not-allowed' : 'pointer',
            border: 'none', transition: 'background 0.15s', letterSpacing: '0.01em',
          }}
        >
          {loading ? 'Posting…' : success ? '✓ Posted!' : type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
        </button>

      </form>
    </div>
  )
}

export default PostItem
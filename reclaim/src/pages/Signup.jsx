import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '0 2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Create account</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>Sign Up</button>
      </form>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Already have an account? <Link to="/login" style={{ color: '#1a1a1a', fontWeight: '500' }}>Log in</Link>
      </p>
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

const btnStyle = {
  padding: '0.75rem',
  background: '#1a1a1a',
  color: '#fff',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontWeight: '500',
  cursor: 'pointer'
}

export default Signup
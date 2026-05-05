import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Browse from './pages/Browse'
import PostItem from './pages/PostItem'
import ItemDetails from './pages/ItemDetails'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    // Wait for Firebase to restore auth session before rendering
    const unsub = onAuthStateChanged(auth, () => {
      setAuthReady(true)
    })
    return () => unsub()
  }, [])

  if (!authReady) return null // or a loading spinner

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/post" element={<PostItem />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
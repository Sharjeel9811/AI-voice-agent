import React, { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Loading from './Components/Loading'
import axios from 'axios'
import Builder from './pages/Builder'
import Billing from './pages/Billing'
import ApiKeys from './pages/ApiKeys'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import Widget from './pages/Widget'

const App = () => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const location = useLocation()

  useEffect(()=>{
    const fetchCurrentUser=async()=>{
      try {
        const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/current`,{withCredentials:true})
        setUser(res.data.user)
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCurrentUser();
  },[])

  useEffect(() => {
    if (!user) return
    if (location.pathname === '/widget') return

    var existing = document.getElementById('va-embed-script')
    if (existing) return

    var PLATFORM_USER_ID = '6a64df3de3efecf72dd7fa14'

    var s = document.createElement('script')
    s.id = 'va-embed-script'
    s.src = '/widget.js'
    s.setAttribute('data-user-id', PLATFORM_USER_ID)
    s.async = true
    document.body.appendChild(s)

    return function() {
      var el = document.getElementById('va-embed-script')
      if (el) el.remove()
      var fab = document.getElementById('va-fab-wrap')
      if (fab) fab.remove()
      var chat = document.getElementById('va-chat')
      if (chat) chat.remove()
    }
  }, [user, location.pathname])

  if (loading) return <Loading />

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home user={user} setuser={setUser}/>} />
        <Route path='/login' element={<Login setuser={setUser}/>}/>
        <Route path='/builder' element={<Builder user={user} setuser={setUser}/>} />
        <Route path='/billing' element={<Billing user={user} setuser={setUser}/>} />
        <Route path='/api-keys' element={<ApiKeys user={user} setuser={setUser}/>} />
        <Route path='/payment-success' element={<PaymentSuccess setuser={setUser} />} />
        <Route path='/payment-cancel' element={<PaymentCancel />} />
        <Route path='/widget' element={<Widget />} />
      </Routes>
    </div>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Loading from './Components/Loading'
import axios from 'axios'
import Builder from './pages/Builder'
import Billing from './pages/Billing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import Widget from './pages/Widget'
import SiteWidget from './Components/SiteWidget'

const App = () => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


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

  if (loading) return <Loading />

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home user={user} setuser={setUser}/>} />
        <Route path='/login' element={<Login setuser={setUser}/>}/>
        <Route path='/builder' element={<Builder user={user} setuser={setUser}/>} />
<Route path='/billing' element={<Billing user={user} setuser={setUser}/>} />
        <Route path='/payment-success' element={<PaymentSuccess setuser={setUser} />} />
        <Route path='/payment-cancel' element={<PaymentCancel />} />
        <Route path='/widget' element={<Widget />} />
      </Routes>
      <SiteWidget user={user} />
    </div>
  )
}

export default App
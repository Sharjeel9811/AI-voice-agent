import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { MdBuild, MdCreditCard, MdLogout, MdMenu, MdClose, MdPerson, MdKey } from 'react-icons/md'
import theme from '../Configs/theme'

const Navbar = ({ user, setuser }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navItems = [
    { label: 'Builder', path: '/builder', icon: <MdBuild size={16} /> },
    { label: 'Billing', path: '/billing', icon: <MdCreditCard size={16} /> },
    ...(user?.plan === 'enterprise' ? [{ label: 'API Keys', path: '/api-keys', icon: <MdKey size={16} /> }] : []),
  ]

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {
        credentials: 'include',
      })
      setuser(null)
      navigate('/login')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(11,11,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${theme.border.light}` : '1px solid transparent',
      }}
    >
      <div className="w-full flex items-center justify-between px-6 lg:px-12 py-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: theme.accent.gradient }}
          >
            <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
          </div>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: theme.text.primary }}
          >
            VoiceAgent
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  color: isActive ? theme.text.primary : theme.text.secondary,
                  background: isActive ? 'rgba(124,92,252,0.12)' : 'transparent',
                }}
              >
                {item.icon}
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-[13px] left-3 right-3 h-[2px] rounded-full"
                    style={{ background: theme.accent.gradient }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenu(!mobileMenu)}
            className="sm:hidden w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: theme.text.secondary }}
          >
            {mobileMenu ? <MdClose size={18} /> : <MdMenu size={18} />}
          </motion.button>

          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  color: theme.text.muted,
                  border: `1px solid ${theme.border.light}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.error.text
                  e.currentTarget.style.borderColor = theme.error.border
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.text.muted
                  e.currentTarget.style.borderColor = theme.border.light
                }}
              >
                <MdLogout size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Avatar + Dropdown */}
              <div className="relative" ref={menuRef}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpen(!open)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer select-none"
                  style={{
                    background: theme.accent.gradient,
                    color: theme.text.primary,
                    boxShadow: `0 0 12px ${theme.button.primary.glow}`,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </motion.div>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl p-4 z-50"
                      style={{
                        background: 'rgba(18,18,31,0.95)',
                        border: `1px solid ${theme.border.light}`,
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      }}
                    >
                      <div
                        className="absolute -top-1.5 right-3 w-3 h-3 rotate-45"
                        style={{
                          background: 'rgba(18,18,31,0.95)',
                          borderLeft: `1px solid ${theme.border.light}`,
                          borderTop: `1px solid ${theme.border.light}`,
                        }}
                      />

                      <div className="flex items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${theme.border.light}` }}>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: theme.accent.gradient, color: theme.text.primary }}
                        >
                          {user?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: theme.text.primary }}>
                            {user?.name || 'User'}
                          </p>
                          <p className="text-[11px] truncate" style={{ color: theme.text.secondary }}>
                            {user?.email || 'No email'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium" style={{ color: theme.text.muted }}>Plan</span>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: user?.plan === 'premium' ? 'rgba(124,92,252,0.15)' : 'rgba(255,255,255,0.06)',
                            color: user?.plan === 'premium' ? theme.accent.primary : theme.text.secondary,
                          }}
                        >
                          {user?.plan === 'premium' ? 'Premium' : user?.plan === 'enterprise' ? 'Enterprise' : 'Free'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: theme.button.primary.background,
                color: theme.button.primary.text,
                boxShadow: `0 0 12px ${theme.button.primary.glow}`,
              }}
            >
              <MdPerson size={14} />
              <span className="hidden sm:inline">Login</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden"
            style={{ borderTop: `1px solid ${theme.border.light}` }}
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMobileMenu(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left"
                    style={{
                      color: isActive ? theme.text.primary : theme.text.secondary,
                      background: isActive ? 'rgba(124,92,252,0.12)' : 'transparent',
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )
              })}
              {!user && (
                <button
                  onClick={() => { navigate('/login'); setMobileMenu(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left"
                  style={{
                    color: theme.button.primary.text,
                    background: theme.button.primary.background,
                  }}
                >
                  <MdPerson size={16} />
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
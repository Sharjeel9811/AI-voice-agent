import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MdClose, MdMic } from 'react-icons/md'

const SiteWidget = ({ user }) => {
  const [open, setOpen] = useState(false)

  if (!user?._id) return null

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              width: 370, height: 520, borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <iframe
              src={`/widget?userId=${user._id}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Voice Agent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB — toggles mic / X */}
      <motion.button
        onClick={() => setOpen(!open)}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C5CFC, #7C5CFC)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(124,92,252,0.4)',
          position: 'relative',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <MdClose size={22} color="#fff" /> : <MdMic size={22} color="#fff" />}

        {/* Pulse ring — only when closed */}
        {!open && (
          <motion.div
            style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: '2px solid rgba(124,92,252,0.3)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.button>
    </div>
  )
}

export default SiteWidget

import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { MdCancel, MdArrowForward } from 'react-icons/md'
import theme from '../Configs/theme'

const PaymentCancel = () => {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: theme.bg.primary }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.1)' }}
        >
          <MdCancel size={40} style={{ color: theme.error.text }} />
        </motion.div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: theme.text.primary }}
        >
          Payment Cancelled
        </h1>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: theme.text.secondary }}
        >
          No worries! Your payment was not processed. You can try again whenever
          you're ready.
        </p>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: `0 0 24px ${theme.button.primary.glow}` }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/billing')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          style={{
            background: theme.button.primary.background,
            color: theme.button.primary.text,
          }}
        >
          Back to Billing
          <MdArrowForward size={16} />
        </motion.button>
      </motion.div>
    </div>
  )
}

export default PaymentCancel

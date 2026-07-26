import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MdCheckCircle, MdArrowForward } from 'react-icons/md'
import axios from 'axios'
import theme from '../Configs/theme'

const PaymentSuccess = ({ setuser }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const verify = async () => {
      const sessionId = searchParams.get('session_id')
      if (!sessionId) {
        setStatus('error')
        return
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/billing/verify-session?sessionId=${sessionId}`,
          { withCredentials: true }
        )

        if (data.success && data.user) {
          setuser(data.user)
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch (err) {
        console.error('Verification failed', err)
        setStatus('error')
      }
    }
    verify()
  }, [searchParams, setuser])

  useEffect(() => {
    if (status !== 'success') return
    const timer = setTimeout(() => navigate('/'), 5000)
    return () => clearTimeout(timer)
  }, [navigate, status])

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
        {status === 'verifying' && (
          <>
            <motion.span
              className="w-16 h-16 rounded-full border-4 border-white/10 border-t-[#7C5CFC] inline-block mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <h1 className="text-xl font-bold mb-2" style={{ color: theme.text.primary }}>
              Verifying your payment...
            </h1>
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Please wait a moment.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'rgba(52,211,153,0.1)' }}
            >
              <MdCheckCircle size={40} style={{ color: theme.success.text }} />
            </motion.div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: theme.text.primary }}>
              Payment Successful!
            </h1>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: theme.text.secondary }}>
              Welcome to Pro! Your account has been upgraded and all premium features are now unlocked.
            </p>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: `0 0 24px ${theme.button.primary.glow}` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{
                background: theme.button.primary.background,
                color: theme.button.primary.text,
              }}
            >
              Go to Home
              <MdArrowForward size={16} />
            </motion.button>
            <p className="text-[11px] mt-4" style={{ color: theme.text.muted }}>
              Redirecting in 5 seconds...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-xl font-bold mb-3" style={{ color: theme.text.primary }}>
              Something went wrong
            </h1>
            <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
              We couldn't verify your payment. Please contact support.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl text-sm font-semibold"
              style={{
                background: theme.button.primary.background,
                color: theme.button.primary.text,
              }}
            >
              Go to Home
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default PaymentSuccess

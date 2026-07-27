import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { MdKey, MdContentCopy, MdRefresh, MdVisibility, MdVisibilityOff, MdCheck, MdClose, MdCode, MdInfo } from 'react-icons/md'
import Navbar from '../Components/Navbar'
import theme from '../Configs/theme'
import axios from 'axios'

const ApiKeys = ({ user, setuser }) => {
  const navigate = useNavigate()
  const [apiKey, setApiKey] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.plan !== 'enterprise') { navigate('/billing'); return }
    fetchKey()
  }, [user])

  const fetchKey = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/api-key`,
        { withCredentials: true }
      )
      setApiKey(data.apiKey)
    } catch {
      setMsg('Failed to load API key')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/api-key/regenerate`,
        {},
        { withCredentials: true }
      )
      setApiKey(data.apiKey)
      setMsg('Key regenerated!')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg('Failed to regenerate')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setMsg('Copied!')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  const exampleJson = JSON.stringify({ userId: user?._id || 'YOUR_USER_ID', message: 'Hello', history: [] }, null, 2)

  const sectionCard = {
    background: theme.bg.card,
    border: `1px solid ${theme.border.light}`,
    borderRadius: '12px',
    padding: '20px',
  }

  return (
    <div style={{ background: theme.bg.primary, minHeight: '100vh' }}>
      <Navbar user={user} setuser={setuser} />

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(124,92,252,0.1)', color: theme.accent.primary }}>
            <MdKey size={28} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text.primary }}>
            API Keys
          </h1>
          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: theme.text.secondary }}>
            Integrate your AI voice agent programmatically using HTTP requests.
            Your API key authenticates requests to the VoiceAgent API.
          </p>
        </motion.div>

        {/* What is this for */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ ...sectionCard, marginBottom: 20 }}
        >
          <div className="flex items-start gap-3">
            <MdInfo size={18} style={{ color: theme.accent.primary, marginTop: 2, flexShrink: 0 }} />
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: theme.text.primary }}>
                What is an API Key?
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: theme.text.secondary }}>
                An API key lets you send messages to your AI agent programmatically — from your own backend,
                a mobile app, or any server-side application. You can build custom interfaces, automate
                conversations, or integrate the agent into your existing tools.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key display */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ ...sectionCard, marginBottom: 20 }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: theme.text.secondary }}>
            Your API Key
          </p>

          {loading ? (
            <p className="text-xs" style={{ color: theme.text.muted }}>Loading...</p>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex-1 px-4 py-3 rounded-lg text-xs font-mono select-all"
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: `1px solid ${theme.border.light}`,
                    color: revealed ? theme.accent.primary : theme.text.muted,
                    wordBreak: 'break-all',
                  }}
                >
                  {revealed ? apiKey : '••••••••••••••••••••••••••••••'}
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRevealed(!revealed)}
                  className="px-3 py-3 rounded-lg text-[11px] font-medium"
                  style={{ background: 'rgba(255,255,255,0.05)', color: theme.text.secondary, border: `1px solid ${theme.border.light}` }}
                >
                  {revealed ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                </motion.button>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-medium"
                  style={{ background: 'rgba(124,92,252,0.12)', color: theme.accent.primary }}
                >
                  <MdContentCopy size={12} />
                  Copy Key
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRegenerate}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-medium"
                  style={{ background: 'rgba(255,255,255,0.05)', color: theme.text.secondary, border: `1px solid ${theme.border.light}` }}
                >
                  <MdRefresh size={12} />
                  Regenerate
                </motion.button>
                <AnimatePresence>
                  {msg && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px]"
                      style={{ color: theme.success.text }}
                    >
                      <MdCheck size={12} style={{ display: 'inline', marginRight: 2 }} />
                      {msg}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>

        {/* Where to use */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          {[
            { title: 'Backend Integration', desc: 'Connect your AI agent to your Node.js, Python, or any backend service via HTTP requests.' },
            { title: 'Mobile Apps', desc: 'Build custom chat interfaces inside your iOS or Android app using the API.' },
            { title: 'Automation', desc: 'Trigger conversations, process messages, and automate customer interactions programmatically.' },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl text-center"
              style={{ background: theme.bg.card, border: `1px solid ${theme.border.light}` }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: theme.text.primary }}>{item.title}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: theme.text.secondary }}>{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Code examples */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-bold mb-4" style={{ color: theme.text.primary }}>
            <MdCode size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
            Example Usage
          </h2>

          <div className="space-y-4">
            {/* cURL */}
            <div style={sectionCard}>
              <p className="text-[11px] font-semibold mb-2" style={{ color: theme.text.secondary }}>cURL</p>
              <pre className="text-[11px] font-mono leading-relaxed p-4 rounded-lg overflow-x-auto" style={{ background: 'rgba(0,0,0,0.25)', color: theme.accent.secondary }}>
                {'curl -X POST https://ai-voice-agent-gules-nu.vercel.app/api/agent/chat \\\n  -H "Authorization: Bearer ' + (apiKey || 'YOUR_API_KEY') + '" \\\n  -H "Content-Type: application/json" \\\n  -d \'' + exampleJson + '\''}
              </pre>
            </div>

            {/* Node.js */}
            <div style={sectionCard}>
              <p className="text-[11px] font-semibold mb-2" style={{ color: theme.text.secondary }}>Node.js</p>
              <pre className="text-[11px] font-mono leading-relaxed p-4 rounded-lg overflow-x-auto" style={{ background: 'rgba(0,0,0,0.25)', color: theme.accent.secondary }}>
                {`const axios = require('axios');

const res = await axios.post(
  'https://ai-voice-agent-gules-nu.vercel.app/api/agent/chat',
  ${exampleJson},
  {
    headers: {
      Authorization: 'Bearer ${apiKey || 'YOUR_API_KEY'}',
      'Content-Type': 'application/json',
    },
  }
);

console.log(res.data.reply);`}
              </pre>
            </div>

            {/* Python */}
            <div style={sectionCard}>
              <p className="text-[11px] font-semibold mb-2" style={{ color: theme.text.secondary }}>Python</p>
              <pre className="text-[11px] font-mono leading-relaxed p-4 rounded-lg overflow-x-auto" style={{ background: 'rgba(0,0,0,0.25)', color: theme.accent.secondary }}>
                {`import requests
import json

url = "https://ai-voice-agent-gules-nu.vercel.app/api/agent/chat"
headers = {
    "Authorization": "Bearer ${apiKey || 'YOUR_API_KEY'}",
    "Content-Type": "application/json"
}
data = ${exampleJson}

res = requests.post(url, headers=headers, json=data)
print(res.json()["reply"])`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ApiKeys
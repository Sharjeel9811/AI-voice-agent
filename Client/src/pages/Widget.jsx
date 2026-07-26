import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MdSend, MdClose, MdMic, MdMicOff, MdVolumeUp } from 'react-icons/md'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const themes = {
  dark:  { key: 'dark', bg: '#0B0B14', surface: '#16162A', accent: '#7C5CFC', text: '#FFFFFF', textSecondary: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.08)' },
  light: { key: 'light', bg: '#F8F9FC', surface: '#FFFFFF', accent: '#6C5CE7', text: '#1A1A2E', textSecondary: 'rgba(26,26,46,0.5)', border: 'rgba(0,0,0,0.08)' },
  glass: { key: 'glass', bg: 'linear-gradient(135deg, #0F0C29, #302B63, #24243E)', surface: 'rgba(255,255,255,0.08)', accent: '#00D4FF', text: '#FFFFFF', textSecondary: 'rgba(255,255,255,0.45)', border: 'rgba(255,255,255,0.12)', glass: true },
  neon:  { key: 'neon', bg: '#0A0A0F', surface: '#111118', accent: '#FF2D95', text: '#FFFFFF', textSecondary: 'rgba(255,255,255,0.4)', border: 'rgba(255,45,149,0.2)', glow: true },
}

// Each entry describes ONE real, honest app state — no fake/looping labels.
const stateCopy = {
  idle:       { label: 'Ready',      desc: 'Tap the mic or type to start' },
  listening:  { label: 'Listening',  desc: 'Hearing your voice...' },
  processing: { label: 'Thinking',   desc: 'Working on a reply...' },
  speaking:   { label: 'Speaking',   desc: 'Responding to you...' },
}

const SoundBars = ({ active, accent }) => {
  const [bars, setBars] = useState(function() {
    return Array.from({ length: 16 }, function() { return 4 })
  })

  useEffect(function() {
    if (!active) { setBars(Array.from({ length: 16 }, function() { return 4 })); return }
    var interval = setInterval(function() {
      setBars(Array.from({ length: 16 }, function() { return 4 + Math.random() * 24 }))
    }, 220)
    return function() { clearInterval(interval) }
  }, [active])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 32 }}>
      {bars.map(function(h, i) {
        return (
          <motion.div key={i} style={{ width: 3, borderRadius: 2, background: accent }}
            animate={{ height: h, opacity: active ? 1 : 0.25 }}
            transition={{ duration: 0.25, ease: 'easeOut' }} />
        )
      })}
    </div>
  )
}

const TypingIndicator = ({ accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0' }}>
    {[0, 1, 2].map(function(i) {
      return <motion.div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: accent }} animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
    })}
  </div>
)

const Widget = () => {
  const [agentConfig, setAgentConfig] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [appState, setAppState] = useState('idle') // 'idle' | 'listening' | 'processing' | 'speaking'
  const [mode, setMode] = useState('voice')
  const [status, setStatus] = useState('loading')
  const [offline, setOffline] = useState(false)
  const [hasChatted, setHasChatted] = useState(false)
  const [micSupported, setMicSupported] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null)

  const params = new URLSearchParams(window.location.search)
  const userId = params.get('userId')

  // ---------- Load agent config, with real offline caching ----------
  useEffect(() => {
    if (!userId) { setStatus('error'); return }
    const loadAgent = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/agent/public/${userId}`, { timeout: 5000 })
        if (data.agent) {
          setAgentConfig(data.agent)
          setMessages([{ role: 'assistant', content: data.agent.welcomeMessage || 'Hi! How can I help you today?' }])
          setStatus('ready')
          try {
            localStorage.setItem('va_agent_' + userId, JSON.stringify(data.agent))
          } catch (e) { }
        } else {
          setStatus('error')
        }
      } catch (err) {
        var cached = null
        try { cached = JSON.parse(localStorage.getItem('va_agent_' + userId)) } catch (e) {}
        if (cached) {
          setAgentConfig(cached)
          setMessages([{ role: 'assistant', content: cached.welcomeMessage || 'Hi! How can I help you today?' }])
          setOffline(true)
          setStatus('ready')
        } else {
          setStatus('error')
        }
      }
    }
    loadAgent()
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, appState])

  useEffect(() => {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) setMicSupported(false)
  }, [])

  // ---------- Click-to-talk mic ----------
  var startListening = function() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR || appState !== 'idle') return

    var recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = function(event) {
      var transcript = event.results[0][0].transcript
      if (transcript.trim()) sendMessage(transcript.trim())
    }
    recognition.onerror = function() {
      setAppState('idle')
    }
    recognition.onend = function() {
      setAppState(function(prev) { return prev === 'listening' ? 'idle' : prev })
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setAppState('listening')
    } catch (e) {
      setAppState('idle')
    }
  }

  var stopListening = function() {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch (e) {}
    }
    setAppState('idle')
  }

  var handleMicClick = function() {
    if (appState === 'listening') stopListening()
    else if (appState === 'idle') startListening()
  }

  // ---------- Sending messages ----------
  var sendMessage = async function(text) {
    var message = text || input.trim()
    if (!message || appState === 'processing') return
    setInput('')
    if (!hasChatted) setHasChatted(true)
    setMessages(function(p) { return [...p, { role: 'user', content: message }] })
    setAppState('processing')

    if (offline) {
      setTimeout(function() {
        setMessages(function(p) { return [...p, { role: 'assistant', content: "I'm currently offline. The server is not running." }] })
        setAppState('idle')
      }, 800)
      return
    }

    try {
      var history = messages.slice(-10).map(function(m) { return { role: m.role, content: m.content } })
      var res = await axios.post(BACKEND_URL + '/api/agent/chat', { userId: userId, message: message, history: history }, { timeout: 15000 })
      var reply = res.data.reply || "I couldn't generate a response."
      setMessages(function(p) { return [...p, { role: 'assistant', content: reply }] })
      if (mode === 'voice') {
        speak(reply)
      } else {
        setAppState('idle')
      }
    } catch (err) {
      setMessages(function(p) { return [...p, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again." }] })
      setAppState('idle')
    }
  }

  var speak = function(text) {
    if (!synthRef.current) { setAppState('idle'); return }
    synthRef.current.cancel()
    var u = new SpeechSynthesisUtterance(text)
    u.rate = (agentConfig && agentConfig.voiceSpeed) || 1
    u.pitch = 1
    u.volume = 1
    var voices = synthRef.current.getVoices()
    var v = voices.find(function(v) { return v.name.indexOf('Google') !== -1 && v.lang.indexOf('en') === 0 }) || voices.find(function(v) { return v.lang.indexOf('en') === 0 })
    if (v) u.voice = v
    u.onstart = function() { setAppState('speaking') }
    u.onend = function() { setAppState('idle') }
    u.onerror = function() { setAppState('idle') }
    synthRef.current.speak(u)
  }

  var handleKeyDown = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  var accent = (agentConfig && agentConfig.accentColor) || themes.dark.accent
  var th = agentConfig && themes[agentConfig.theme] ? themes[agentConfig.theme] : themes.dark
  var bg = th.glass ? 'linear-gradient(135deg, #0F0C29, #302B63, #24243E)' : th.bg

  if (status === 'loading') {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0B0B14' }}>
        <motion.div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(124,92,252,0.2)', borderTopColor: '#7C5CFC' }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 16, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>Loading agent...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0B0B14' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(248,113,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MdClose size={20} color="#F87171" />
        </div>
        <p style={{ color: '#F87171', fontSize: 13, marginTop: 12, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>Agent not found</p>
      </div>
    )
  }

  var current = stateCopy[appState]
  var VoiceIcon = appState === 'listening' ? MdMic : appState === 'speaking' ? MdVolumeUp : appState === 'processing' ? MdMicOff : MdMic
  var name = (agentConfig && agentConfig.agentName) || 'Assistant'
  var business = (agentConfig && agentConfig.businessName) || 'Your AI Assistant'
  var initial = name.charAt(0).toUpperCase()
  var showLanding = !hasChatted && messages.length <= 1

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: 0, padding: 0, background: bg, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', position: 'relative' }}>

      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid ' + th.border, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        background: th.glass ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
        backdropFilter: th.glass ? 'blur(16px)' : 'none',
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
            boxShadow: th.glow ? '0 0 16px ' + accent + '50' : 'none',
          }}>{initial}</div>
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderRadius: '50%', background: '#34D399', border: '2px solid ' + bg }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: th.text, fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.2 }}>{name}</p>
          <p style={{ color: th.textSecondary, fontSize: 10, margin: 0, lineHeight: 1.4 }}>{business}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={function() { setMode(mode === 'voice' ? 'text' : 'voice') }}
            style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600, transition: 'all 0.2s',
              background: mode === 'voice' ? accent + '18' : th.surface, color: mode === 'voice' ? accent : th.textSecondary }}>
            {mode === 'voice' ? 'Voice' : 'Text'}
          </button>
          <button onClick={function() { window.parent.postMessage('va-close-chat', '*') }}
            style={{ background: 'transparent', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: th.textSecondary, display: 'flex', transition: 'color 0.2s' }}>
            <MdClose size={15} />
          </button>
        </div>
      </div>

      {/* Offline banner */}
      {offline && (
        <div style={{ padding: '5px 12px', textAlign: 'center', fontSize: 10, background: 'rgba(251,191,36,0.12)', color: '#FBBF24', borderBottom: '1px solid rgba(251,191,36,0.15)' }}>
          Offline — AI replies unavailable
        </div>
      )}

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {showLanding ? (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>

              {/* Voice rings */}
              <div style={{ position: 'relative', width: 110, height: 110, marginBottom: 24 }}>
                {appState !== 'idle' && (
                  <>
                    <motion.div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid ' + accent, opacity: 0.12 }}
                      animate={{ scale: [1, 1.35, 1], opacity: [0.12, 0, 0.12] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '2px solid ' + accent, opacity: 0.2 }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />
                    <motion.div style={{ position: 'absolute', inset: 22, borderRadius: '50%', border: '1.5px solid ' + accent, opacity: 0.3 }}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }} />
                  </>
                )}
                <motion.button onClick={handleMicClick} disabled={!micSupported || appState === 'processing' || appState === 'speaking'}
                  style={{
                    position: 'absolute', inset: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: micSupported ? 'pointer' : 'not-allowed',
                    background: 'linear-gradient(135deg, ' + accent + ', ' + accent + 'BB)',
                    boxShadow: th.glow ? '0 0 40px ' + accent + '50, 0 0 80px ' + accent + '15' : '0 0 24px ' + accent + '35',
                    opacity: micSupported ? 1 : 0.4,
                  }}
                  animate={appState !== 'idle' ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 1.8, repeat: appState !== 'idle' ? Infinity : 0, ease: 'easeInOut' }}>
                  <VoiceIcon size={26} color="#fff" />
                </motion.button>
              </div>

              {/* State label */}
              <AnimatePresence mode="wait">
                <motion.div key={appState} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} style={{ textAlign: 'center', marginBottom: 4 }}>
                  <p style={{ color: th.text, fontSize: 14, fontWeight: 600, margin: '0 0 3px' }}>{current.label}</p>
                  <p style={{ color: th.textSecondary, fontSize: 11, margin: 0 }}>
                    {micSupported ? current.desc : 'Voice input not supported in this browser'}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Sound bars */}
              <div style={{ marginTop: 24 }}>
                <SoundBars active={appState === 'listening'} accent={accent} />
              </div>

              <p style={{ color: th.textSecondary, fontSize: 10, marginTop: 24, textAlign: 'center', opacity: 0.6 }}>
                Tap the mic to talk, or type a message below
              </p>
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
              style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
              {messages.map(function(msg, i) {
                var isUser = msg.role === 'user'
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 10, alignItems: 'flex-end' }}>
                    {!isUser && (
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, ' + accent + ', ' + accent + '99)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', marginRight: 8, flexShrink: 0, boxShadow: th.glow ? '0 0 8px ' + accent + '30' : 'none' }}>
                        {initial}
                      </div>
                    )}
                    <div style={{ maxWidth: '78%' }}>
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        background: isUser
                          ? 'linear-gradient(135deg, ' + accent + ', ' + accent + 'CC)'
                          : th.glass ? 'rgba(255,255,255,0.06)' : th.surface,
                        color: isUser ? '#fff' : th.text,
                        fontSize: 12, lineHeight: 1.55,
                        boxShadow: isUser ? (th.glow ? '0 4px 16px ' + accent + '25' : 'none') : '0 2px 8px rgba(0,0,0,0.08)',
                        border: isUser ? 'none' : '1px solid ' + th.border,
                      }}>{msg.content}</div>
                    </div>
                  </motion.div>
                )
              })}

              {appState === 'processing' && (
                <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, ' + accent + ', ' + accent + '99)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', marginRight: 8, flexShrink: 0 }}>{initial}</div>
                  <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: th.glass ? 'rgba(255,255,255,0.06)' : th.surface, border: '1px solid ' + th.border }}>
                    <TypingIndicator accent={accent} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Listening pill */}
      <AnimatePresence>
        {appState === 'listening' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ position: 'absolute', bottom: 90, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 20, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', zIndex: 10, backdropFilter: 'blur(8px)' }}>
            <motion.div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444' }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
            <span style={{ color: '#EF4444', fontSize: 11, fontWeight: 600 }}>Listening — tap mic to stop</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div style={{
        padding: '10px 12px', borderTop: '1px solid ' + th.border, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        background: th.glass ? 'rgba(255,255,255,0.04)' : th.surface ? 'rgba(0,0,0,0.02)' : 'transparent',
      }}>
        {micSupported && (
          <motion.button whileTap={{ scale: 0.85 }} onClick={handleMicClick} disabled={appState === 'processing' || appState === 'speaking'}
            style={{
              width: 38, height: 38, borderRadius: '50%', border: 'none', flexShrink: 0,
              cursor: (appState === 'processing' || appState === 'speaking') ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              background: appState === 'listening' ? 'rgba(239,68,68,0.15)' : (th.glass ? 'rgba(255,255,255,0.06)' : th.surface),
              color: appState === 'listening' ? '#EF4444' : th.textSecondary,
              border: appState === 'listening' ? '1px solid rgba(239,68,68,0.35)' : '1px solid ' + th.border,
            }}>
            {appState === 'listening' ? <MdMicOff size={16} /> : <MdMic size={16} />}
          </motion.button>
        )}
        <div style={{ flex: 1, position: 'relative' }}>
          <input ref={inputRef} type="text" value={input} onChange={function(e) { setInput(e.target.value) }} onKeyDown={handleKeyDown}
            placeholder={offline ? 'Offline...' : appState === 'listening' ? 'Listening...' : 'Type a message...'}
            disabled={offline || appState === 'listening'}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: th.glass ? 'rgba(255,255,255,0.06)' : th.surface,
              border: '1px solid ' + th.border, borderRadius: 12,
              padding: '10px 14px', color: th.text, fontSize: 12, outline: 'none', fontFamily: 'inherit',
              opacity: offline ? 0.5 : 1, transition: 'border-color 0.2s',
            }} />
        </div>
        <motion.button whileTap={{ scale: 0.85 }} onClick={function() { sendMessage() }} disabled={!input.trim() || appState === 'processing' || offline}
          style={{
            width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s',
            background: input.trim() && !offline ? 'linear-gradient(135deg, ' + accent + ', ' + accent + 'CC)' : th.glass ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            color: input.trim() && !offline ? '#fff' : th.textSecondary,
            boxShadow: input.trim() && !offline ? '0 4px 12px ' + accent + '30' : 'none',
          }}>
          <MdSend size={15} />
        </motion.button>
      </div>

      {/* Bottom bar */}
      <div style={{
        padding: '8px 16px', borderTop: '1px solid ' + th.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        background: th.glass ? 'rgba(255,255,255,0.02)' : 'transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: offline ? '#FBBF24' : '#34D399', display: 'inline-block' }} />
          <span style={{ fontSize: 10, fontWeight: 500, color: th.textSecondary }}>{offline ? 'Offline' : 'Connected'}</span>
        </div>
        <span style={{ fontSize: 9, color: th.textSecondary, opacity: 0.6 }}>Voice Agent</span>
      </div>
    </div>
  )
}

export default Widget

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import toast, { Toaster } from 'react-hot-toast'
import {
  MdSave, MdContentCopy, MdMic, MdVolumeUp,
  MdSmartToy, MdBusiness, MdChat, MdPalette, MdCode,
} from 'react-icons/md'
import Navbar from '../Components/Navbar'
import theme from '../Configs/theme'
import axios from 'axios'

const tones = [
  { value: 'professional', label: 'Professional', desc: 'Formal & business-like' },
  { value: 'friendly', label: 'Friendly', desc: 'Warm & approachable' },
  { value: 'casual', label: 'Casual', desc: 'Relaxed & conversational' },
  { value: 'sales', label: 'Sales', desc: 'Persuasive & energetic' },
  { value: 'support', label: 'Support', desc: 'Helpful & patient' },
]

const themes = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'glass', label: 'Glass' },
  { value: 'neon', label: 'Neon' },
]

const defaultForm = {
  agentName: 'My Assistant',
  businessName: '',
  businessType: '',
  businessDescription: '',
  tone: 'friendly',
  welcomeMessage: 'Hi! How can I help you today?',
  systemPrompt: '',
  theme: 'dark',
  accentColor: '#7C5CFC',
  enableVoice: true,
  voiceSpeed: 1,
}

const Builder = ({ user, setuser }) => {
  const [form, setForm] = useState({ ...defaultForm })
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('basic')
  const [showEmbed, setShowEmbed] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/agent/config`,
          { withCredentials: true }
        )
        if (data.agent) {
          setForm((prev) => ({ ...prev, ...data.agent }));
        }
      } catch (err) {
        console.error('Failed to load config', err)
      }
    }
    fetchConfig()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/agent/save`,
        form,
        { withCredentials: true }
      )
      setForm({ ...defaultForm })
      setHasSaved(true)
      toast.success('Agent saved successfully!', {
        style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(124,92,252,0.3)' },
        iconTheme: { primary: '#7C5CFC', secondary: '#fff' },
      })
    } catch (err) {
      toast.error('Failed to save agent', {
        style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' },
        iconTheme: { primary: '#ef4444', secondary: '#fff' },
      })
    } finally {
      setSaving(false)
    }
  }

  const embedCode = user
    ? `<script src="${import.meta.env.VITE_BACKEND_URL}/widget.js" data-user-id="${user._id}"></script>`
    : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    toast.success('Embed code copied!', {
      style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(124,92,252,0.3)' },
      iconTheme: { primary: '#7C5CFC', secondary: '#fff' },
    })
  }

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: <MdSmartToy size={16} /> },
    { id: 'business', label: 'Business', icon: <MdBusiness size={16} /> },
    { id: 'personality', label: 'Personality', icon: <MdChat size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <MdPalette size={16} /> },
    { id: 'voice', label: 'Voice', icon: <MdVolumeUp size={16} /> },
  ]

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${theme.border.light}`,
    color: theme.text.primary,
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    color: theme.text.secondary,
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '6px',
    display: 'block',
  }

  return (
    <div style={{ background: theme.bg.primary, minHeight: '100vh' }}>
      <Navbar user={user} setuser={setuser} />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: theme.text.primary }}>
              Build Your Agent
            </h1>
            <p className="text-sm mt-1" style={{ color: theme.text.secondary }}>
              Configure your AI voice assistant and embed it anywhere
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasSaved && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEmbed(!showEmbed)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${theme.border.light}`,
                  color: theme.text.primary,
                }}
              >
                <MdCode size={14} />
                Get Embed Code
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${theme.button.primary.glow}` }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-50"
              style={{
                background: theme.button.primary.background,
                color: theme.button.primary.text,
              }}
            >
              {saving ? (
                <motion.span
                  className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <MdSave size={14} />
              )}
              {saving ? 'Saving...' : 'Save Agent'}
            </motion.button>
          </div>
        </div>

        {/* Embed Code Panel */}
        <AnimatePresence>
          {showEmbed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div
                className="rounded-xl p-5"
                style={{
                  background: theme.bg.card,
                  border: `1px solid ${theme.border.light}`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold" style={{ color: theme.text.primary }}>
                    Embed Code
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      color: theme.text.secondary,
                      border: `1px solid ${theme.border.light}`,
                    }}
                  >
                    <MdContentCopy size={12} />
                    Copy
                  </motion.button>
                </div>
                <div
                  className="rounded-lg p-4 text-xs font-mono leading-relaxed overflow-x-auto"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    color: theme.accent.primary,
                  }}
                >
                  {embedCode}
                </div>
                <p className="text-[11px] mt-3" style={{ color: theme.text.muted }}>
                  Paste this script tag into any website's HTML to add your voice agent widget.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <div className="lg:w-48 shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
                  style={{
                    color: activeSection === s.id ? theme.text.primary : theme.text.secondary,
                    background: activeSection === s.id ? 'rgba(124,92,252,0.12)' : 'transparent',
                  }}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-6"
              style={{
                background: theme.bg.card,
                border: `1px solid ${theme.border.light}`,
              }}
            >
              {/* Basic Info */}
              {activeSection === 'basic' && (
                <div className="space-y-5">
                  <h2 className="text-sm font-bold mb-4" style={{ color: theme.text.primary }}>
                    Basic Information
                  </h2>
                  <div>
                    <label style={labelStyle}>Agent Name</label>
                    <input
                      type="text"
                      value={form.agentName}
                      onChange={(e) => handleChange('agentName', e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Shifra"
                      onFocus={(e) => e.target.style.borderColor = theme.border.focus}
                      onBlur={(e) => e.target.style.borderColor = theme.border.light}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Welcome Message</label>
                    <textarea
                      value={form.welcomeMessage}
                      onChange={(e) => handleChange('welcomeMessage', e.target.value)}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
                      placeholder="Hi! How can I help you today?"
                      onFocus={(e) => e.target.style.borderColor = theme.border.focus}
                      onBlur={(e) => e.target.style.borderColor = theme.border.light}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Custom System Prompt (optional)</label>
                    <textarea
                      value={form.systemPrompt}
                      onChange={(e) => handleChange('systemPrompt', e.target.value)}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                      placeholder="Override the default personality prompt..."
                      onFocus={(e) => e.target.style.borderColor = theme.border.focus}
                      onBlur={(e) => e.target.style.borderColor = theme.border.light}
                    />
                    <p className="text-[10px] mt-1" style={{ color: theme.text.muted }}>
                      Leave empty to use auto-generated prompt based on your settings
                    </p>
                  </div>
                </div>
              )}

              {/* Business */}
              {activeSection === 'business' && (
                <div className="space-y-5">
                  <h2 className="text-sm font-bold mb-4" style={{ color: theme.text.primary }}>
                    Business Details
                  </h2>
                  <div>
                    <label style={labelStyle}>Business Name</label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => handleChange('businessName', e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Acme Corp"
                      onFocus={(e) => e.target.style.borderColor = theme.border.focus}
                      onBlur={(e) => e.target.style.borderColor = theme.border.light}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Business Type</label>
                    <input
                      type="text"
                      value={form.businessType}
                      onChange={(e) => handleChange('businessType', e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. E-commerce, SaaS, Restaurant"
                      onFocus={(e) => e.target.style.borderColor = theme.border.focus}
                      onBlur={(e) => e.target.style.borderColor = theme.border.light}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Business Description</label>
                    <textarea
                      value={form.businessDescription}
                      onChange={(e) => handleChange('businessDescription', e.target.value)}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                      placeholder="Describe what your business does..."
                      onFocus={(e) => e.target.style.borderColor = theme.border.focus}
                      onBlur={(e) => e.target.style.borderColor = theme.border.light}
                    />
                  </div>
                </div>
              )}

              {/* Personality */}
              {activeSection === 'personality' && (
                <div className="space-y-5">
                  <h2 className="text-sm font-bold mb-4" style={{ color: theme.text.primary }}>
                    Personality & Tone
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tones.map((t) => (
                      <motion.button
                        key={t.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChange('tone', t.value)}
                        className="text-left p-4 rounded-xl transition-all"
                        style={{
                          background: form.tone === t.value ? 'rgba(124,92,252,0.1)' : 'rgba(255,255,255,0.02)',
                          border: form.tone === t.value
                            ? `1px solid rgba(124,92,252,0.3)`
                            : `1px solid ${theme.border.light}`,
                        }}
                      >
                        <p className="text-xs font-semibold mb-0.5" style={{ color: theme.text.primary }}>
                          {t.label}
                        </p>
                        <p className="text-[11px]" style={{ color: theme.text.muted }}>
                          {t.desc}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeSection === 'appearance' && (
                <div className="space-y-5">
                  <h2 className="text-sm font-bold mb-4" style={{ color: theme.text.primary }}>
                    Widget Appearance
                  </h2>
                  <div>
                    <label style={labelStyle}>Theme</label>
                    <div className="flex gap-2">
                      {themes.map((t) => (
                        <motion.button
                          key={t.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChange('theme', t.value)}
                          className="px-4 py-2 rounded-lg text-xs font-medium"
                          style={{
                            background: form.theme === t.value ? 'rgba(124,92,252,0.15)' : 'rgba(255,255,255,0.04)',
                            border: form.theme === t.value
                              ? `1px solid rgba(124,92,252,0.3)`
                              : `1px solid ${theme.border.light}`,
                            color: form.theme === t.value ? theme.accent.primary : theme.text.secondary,
                          }}
                        >
                          {t.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                        style={{ background: 'transparent' }}
                      />
                      <input
                        type="text"
                        value={form.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        style={{ ...inputStyle, width: '140px' }}
                        onFocus={(e) => e.target.style.borderColor = theme.border.focus}
                        onBlur={(e) => e.target.style.borderColor = theme.border.light}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Voice */}
              {activeSection === 'voice' && (
                <div className="space-y-5">
                  <h2 className="text-sm font-bold mb-4" style={{ color: theme.text.primary }}>
                    Voice Settings
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold" style={{ color: theme.text.primary }}>
                        Enable Voice
                      </p>
                      <p className="text-[11px]" style={{ color: theme.text.muted }}>
                        Allow users to speak with your agent
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleChange('enableVoice', !form.enableVoice)}
                      className="w-11 h-6 rounded-full relative transition-colors"
                      style={{
                        background: form.enableVoice ? theme.accent.primary : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full absolute top-0.5"
                        style={{ background: '#fff' }}
                        animate={{ left: form.enableVoice ? '22px' : '2px' }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  </div>
                  {form.enableVoice && (
                    <div>
                      <label style={labelStyle}>Voice Speed: {form.voiceSpeed}x</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={form.voiceSpeed}
                        onChange={(e) => handleChange('voiceSpeed', parseFloat(e.target.value))}
                        className="w-full accent-[#7C5CFC]"
                      />
                      <div className="flex justify-between text-[10px]" style={{ color: theme.text.muted }}>
                        <span>Slow</span>
                        <span>Normal</span>
                        <span>Fast</span>
                      </div>
                    </div>
                  )}
                  <div
                    className="rounded-lg p-4 flex items-start gap-3"
                    style={{ background: 'rgba(124,92,252,0.05)', border: `1px solid rgba(124,92,252,0.1)` }}
                  >
                    <MdMic size={16} style={{ color: theme.accent.primary, marginTop: 2 }} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: theme.text.primary }}>
                        Browser Voice Recognition
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: theme.text.muted }}>
                        Uses Web Speech API — works in Chrome, Edge, and Safari. Users click the mic button to speak.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Builder

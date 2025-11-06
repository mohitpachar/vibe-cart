import React, { useState } from 'react'
import * as api from '../lib/api.js'

export default function AuthCard({ onAuth, onClose }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    try {
      setErr(''); 
      setLoading(true);

      let result;

      if (mode === 'register') {
        result = await api.register(name, email, password); // returns { user, token }
      } else {
        result = await api.login(email, password); // returns { user, token }
      }

      onAuth(result); // ✅ now passes both
    } catch (e) {
      setErr(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>{mode === 'login' ? 'Welcome Back 👋' : 'Create Account 📝'}</h2>

        <div className="form">
          {mode === 'register' && (
            <input className="input" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
          )}
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />

          {err && <div className="error">{err}</div>}

          <button className="button" onClick={submit} disabled={loading}>
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}
          </button>

          <button className="switch-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Need an account? Register →' : 'Already have an account? Login →'}
          </button>
        </div>

      </div>
    </div>
  )
}

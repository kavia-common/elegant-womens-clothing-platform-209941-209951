import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// PUBLIC_INTERFACE
export default function AdminLogin() {
  /** Admin login screen; stores JWT on success */
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      nav('/admin');
    } catch (error) {
      setErr(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ padding: '1rem', maxWidth: 400, margin: '2rem auto' }}>
      <h1 className="h2">Admin Login</h1>
      <form className="stack" onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label htmlFor="password">Password</label>
        <input id="password" className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {err ? <div className="badge" style={{ color: '#b91c1c' }}>{err}</div> : null}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>
    </div>
  );
}

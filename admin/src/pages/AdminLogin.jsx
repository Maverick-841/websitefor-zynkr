import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLockPasswordFill, RiMailLine } from '@remixicon/react';

export const AdminLogin = () => {
  const defaultAdminEmail = 'admin@zynkr.com';
  const defaultAdminPassword = 'adminpassword';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fillDefaultCredentials = () => {
    setEmail(defaultAdminEmail);
    setPassword(defaultAdminPassword);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-2xl tracking-tighter">Z</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 mt-2 font-medium">Authenticating dashboard access</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="group relative">
            <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium transition-all"
            />
          </div>
          <div className="group relative">
            <RiLockPasswordFill className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium transition-all"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-4 font-bold tracking-wide transition-all duration-300 shadow-xl shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>

          <button
            type="button"
            onClick={fillDefaultCredentials}
            className="w-full border border-slate-700 hover:border-slate-500 text-slate-300 rounded-xl py-3 font-semibold transition-colors"
          >
            Use Default Admin Credentials
          </button>

          <div className="text-xs text-slate-400 bg-slate-950/70 border border-slate-800 rounded-xl p-3 leading-5">
            <p>Admin Email: {defaultAdminEmail}</p>
            <p>Admin Password: {defaultAdminPassword}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

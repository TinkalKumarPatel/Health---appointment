import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'admin') navigate('/admin');
      else if (loggedInUser.role === 'doctor') navigate('/doctor');
      else navigate('/patient');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-600 text-white items-center justify-center shadow-md shadow-blue-200 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to CarePoint</h1>
          <p className="mt-1 text-sm text-slate-500">
            Access your doctor appointments and health records
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <span className="font-bold text-red-500 text-base">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {/* 1-Click Quick Demo Login Box */}
        <div className="mb-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100">
          <p className="text-xs font-bold text-blue-900 uppercase tracking-wider text-center mb-2.5">
            ⚡ 1-Click Demo Login (Instant Access)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('patient1@example.com', 'Patient@123')}
              className="py-2.5 px-2 text-center rounded-lg bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-slate-800 text-xs font-bold transition shadow-sm"
            >
              <div className="text-lg mb-0.5">👤</div>
              Patient
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('doctor1@example.com', 'Doctor@123')}
              className="py-2.5 px-2 text-center rounded-lg bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-slate-800 text-xs font-bold transition shadow-sm"
            >
              <div className="text-lg mb-0.5">👨‍⚕️</div>
              Doctor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin1@example.com', 'Admin@123')}
              className="py-2.5 px-2 text-center rounded-lg bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-slate-800 text-xs font-bold transition shadow-sm"
            >
              <div className="text-lg mb-0.5">🛡️</div>
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-md shadow-blue-200 transition disabled:opacity-50 text-sm"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="text-center text-sm text-slate-600 mt-6 pt-6 border-t border-slate-100">
          New to CarePoint?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

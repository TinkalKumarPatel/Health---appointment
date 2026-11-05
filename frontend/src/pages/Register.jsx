import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Doctor-specific optional fields
  const [specialty, setSpecialty] = useState('General Medicine');
  const [fee, setFee] = useState('50');
  const [location, setLocation] = useState('City General Clinic');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await register(name, email, password, role);
      if (newUser.role === 'doctor') navigate('/doctor');
      else if (newUser.role === 'admin') navigate('/admin');
      else navigate('/patient');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-teal-600 text-white items-center justify-center shadow-md shadow-teal-200 mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create a CarePoint Account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign up in 30 seconds to schedule appointments and care
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <span className="font-bold text-red-500 text-base">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {/* Role Toggle Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Your Account Type:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`p-3.5 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                role === 'patient'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl">👤</div>
              <div>
                <div className="font-bold text-sm">Patient</div>
                <div className="text-[11px] text-slate-500">Book doctor visits</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`p-3.5 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                role === 'doctor'
                  ? 'border-teal-600 bg-teal-50/50 text-teal-900 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl">👨‍⚕️</div>
              <div>
                <div className="font-bold text-sm">Doctor</div>
                <div className="text-[11px] text-slate-500">Manage patients</div>
              </div>
            </button>
          </div>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'doctor' ? 'e.g. Dr. Jane Foster' : 'e.g. Rahul Sharma'}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          {/* If registering as Doctor, show specialty fields */}
          {role === 'doctor' && (
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-3">
              <div className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                Doctor Professional Details
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Specialty</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Clinic Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Show Passwords</span>
            </label>
            <span>Password min 6 chars</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-md shadow-blue-200 transition disabled:opacity-50 text-sm"
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'doctor' ? 'Doctor' : 'Patient'}`}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="text-center text-sm text-slate-600 mt-6 pt-6 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50 shadow-sm shadow-indigo-100/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Vibrant Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-cyan-200 group-hover:scale-105 group-hover:shadow-lg transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                  CarePoint
                </span>
                <span className="text-[10px] block text-cyan-600 font-extrabold -mt-1 tracking-widest uppercase">
                  Health & Care
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-10 space-x-1">
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition ${
                  isActive('/')
                    ? 'text-indigo-700 bg-indigo-50/80 shadow-sm shadow-indigo-100'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/doctors"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition ${
                  isActive('/doctors')
                    ? 'text-teal-700 bg-teal-50/80 shadow-sm shadow-teal-100'
                    : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                Find Doctors
              </Link>
              {user?.role === 'patient' && (
                <Link
                  to="/patient"
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition ${
                    isActive('/patient')
                      ? 'text-emerald-700 bg-emerald-50/80 shadow-sm shadow-emerald-100'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  My Appointments
                </Link>
              )}
              {user?.role === 'doctor' && (
                <Link
                  to="/doctor"
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition ${
                    isActive('/doctor')
                      ? 'text-blue-700 bg-blue-50/80 shadow-sm shadow-blue-100'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Doctor Schedule
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition ${
                    isActive('/admin')
                      ? 'text-purple-700 bg-purple-50/80 shadow-sm shadow-purple-100'
                      : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                  }`}
                >
                  Admin Portal
                </Link>
              )}
            </div>
          </div>

          {/* Right Header / Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-800">{user.name}</div>
                  <div className="text-xs">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold capitalize shadow-sm text-[11px] ${
                        user.role === 'admin'
                          ? 'bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-800 border border-purple-200'
                          : user.role === 'doctor'
                          ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200'
                          : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-500 rounded-xl transition border border-rose-200 shadow-sm hover:shadow-rose-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-50 rounded-xl transition border border-indigo-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-xl transition shadow-md shadow-cyan-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Find Doctors
          </Link>
          {user?.role === 'patient' && (
            <Link
              to="/patient"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50"
            >
              My Appointments
            </Link>
          )}
          {user?.role === 'doctor' && (
            <Link
              to="/doctor"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              Doctor Schedule
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-purple-700 hover:bg-purple-50"
            >
              Admin Portal
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600 px-3">
                  Signed in as <span className="font-extrabold text-slate-800">{user.name}</span> ({user.role})
                </div>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2 px-3 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

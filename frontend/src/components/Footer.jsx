import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CarePoint</span>
            </div>
            <p className="text-sm text-slate-400">
              Modern healthcare appointment platform connecting patients with trusted doctors for timely medical care.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-teal-400 transition">Home</Link></li>
              <li><Link to="/doctors" className="hover:text-teal-400 transition">Find Doctors</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition">Patient Portal</Link></li>
              <li><Link to="/register" className="hover:text-teal-400 transition">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Popular Specialties</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/doctors?specialty=Cardiology" className="hover:text-teal-400 transition">Cardiology</Link></li>
              <li><Link to="/doctors?specialty=Dermatology" className="hover:text-teal-400 transition">Dermatology</Link></li>
              <li><Link to="/doctors?specialty=Pediatrics" className="hover:text-teal-400 transition">Pediatrics</Link></li>
              <li><Link to="/doctors?specialty=Neurology" className="hover:text-teal-400 transition">Neurology</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Emergency & Care</h4>
            <p className="text-sm text-slate-400 mb-2">
              For medical emergencies, please dial your local emergency services immediately.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 text-xs font-medium border border-red-800">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              24/7 Helpline: 1-800-CARE-NOW
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CarePoint Healthcare Platform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span className="hover:text-slate-400">Terms of Service</span>
            <span className="hover:text-slate-400">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


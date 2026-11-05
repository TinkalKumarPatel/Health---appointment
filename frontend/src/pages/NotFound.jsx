import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-16 px-4 bg-slate-50 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-3xl font-black">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">
          The healthcare resource or page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}


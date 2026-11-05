import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DoctorList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [name, setName] = useState(searchParams.get('name') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Neurology',
    'Orthopedics'
  ];

  const getSpecialtyBadge = (spec) => {
    switch (spec) {
      case 'Cardiology':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Dermatology':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pediatrics':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Neurology':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Orthopedics':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  const fetchDoctors = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (specialty && specialty !== 'All Specialties') params.append('specialty', specialty);
    if (name.trim()) params.append('name', name.trim());
    if (location.trim()) params.append('location', location.trim());
    if (date) params.append('date', date);

    api.get(`/api/doctors?${params.toString()}`)
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch doctors', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleReset = () => {
    setSpecialty('');
    setName('');
    setLocation('');
    setDate('');
    setSearchParams({});
    api.get('/api/doctors').then((res) => setDoctors(res.data));
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-indigo-50/30 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Colorful Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 mb-2">
            👨‍⚕️ Top Certified Medical Practitioners
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Search & Book Doctors</h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse qualified clinical specialists and schedule your consultation with instant slot confirmation
          </p>
        </div>

        {/* Filter Bar with Colorful Accents */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-indigo-100 mb-8">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Medical Specialty
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {specialties.map((s) => (
                  <option key={s} value={s === 'All Specialties' ? '' : s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Doctor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hospital / Clinic
              </label>
              <input
                type="text"
                placeholder="e.g. City Hospital"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Available Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="lg:col-span-4 flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              >
                Reset Filters
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-xl shadow-md shadow-cyan-200 transition"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner text="Finding available doctors..." />
        ) : doctors.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-800">No doctors match your search</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your specialty or clearing filters to view all available specialists.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 rounded-xl"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showing <span className="font-black text-slate-800">{doctors.length}</span> Verified Specialists
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doc, idx) => {
                const avatarGradients = [
                  'from-rose-500 to-red-600 shadow-rose-200',
                  'from-purple-500 to-indigo-600 shadow-purple-200',
                  'from-amber-400 to-orange-500 shadow-amber-200',
                  'from-cyan-500 to-blue-600 shadow-blue-200',
                  'from-emerald-500 to-teal-600 shadow-emerald-200'
                ];
                const grad = avatarGradients[idx % avatarGradients.length];

                return (
                  <div
                    key={doc._id}
                    className="bg-white p-6 rounded-2xl border-2 border-indigo-100/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${grad} text-white font-black text-xl flex items-center justify-center shadow-lg`}>
                            {doc.user?.name ? doc.user.name.replace('Dr. ', '').charAt(0) : 'D'}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{doc.user?.name}</h3>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold border mt-1 ${getSpecialtyBadge(doc.specialty)}`}>
                              {doc.specialty}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[11px] text-slate-400 font-semibold uppercase">Fee</div>
                          <div className="text-2xl font-black text-teal-700">${doc.fees}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-4">
                        <span>★ 4.9</span>
                        <span className="text-slate-400 font-normal">• 100% Recommended</span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 mb-4 bg-gradient-to-r from-slate-50 to-indigo-50/40 p-4 rounded-xl border border-indigo-50">
                        {doc.qualifications && doc.qualifications.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-semibold">Degrees:</span>
                            <span className="font-bold text-slate-800">{doc.qualifications.join(', ')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-semibold">Clinical Experience:</span>
                          <span className="font-bold text-slate-800">{doc.experienceYears} Years</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-semibold">Affiliated Hospital:</span>
                          <span className="font-bold text-slate-800">{doc.locations?.join(' • ') || 'Main Clinic Hub'}</span>
                        </div>
                      </div>

                      {/* Availability Pills */}
                      {doc.availability && doc.availability.length > 0 && (
                        <div className="mb-4">
                          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                            Weekly Clinic Availability
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, dIdx) => {
                              const isAvailable = doc.availability.some((a) => a.day === dIdx);
                              return (
                                <span
                                  key={dayName}
                                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                                    isAvailable
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                      : 'bg-slate-100 text-slate-400 opacity-50'
                                  }`}
                                >
                                  {isAvailable ? `✓ ${dayName}` : dayName}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Accepting Patients
                      </span>
                      <Link
                        to={`/book/${doc._id}`}
                        className="py-2.5 px-5 text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-xl transition shadow-md shadow-cyan-200"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

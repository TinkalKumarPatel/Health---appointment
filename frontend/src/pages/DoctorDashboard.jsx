import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DoctorDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  // Availability editor state
  const [availability, setAvailability] = useState([]);
  const [savingAvailability, setSavingAvailability] = useState(false);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get Doctor's appointments
      const apptRes = await api.get('/api/appointments');
      setAppointments(apptRes.data);

      // 2. Get Doctor profile details
      const docRes = await api.get('/api/doctors');
      const myProfile = docRes.data.find(
        (d) => String(d.user?._id || d.user) === String(user?._id || user?.id)
      );

      if (myProfile) {
        setDoctorProfile(myProfile);
        setAvailability(myProfile.availability || []);
      }
    } catch (err) {
      console.error('Failed to load doctor dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await api.put(`/api/appointments/${appointmentId}`, { status: newStatus });
      setActionMessage({ type: 'success', text: `Appointment marked as ${newStatus}.` });
      fetchData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status.' });
    }
  };

  const handleToggleDay = (dayIndex) => {
    const exists = availability.some((a) => a.day === dayIndex);
    if (exists) {
      setAvailability(availability.filter((a) => a.day !== dayIndex));
    } else {
      setAvailability([...availability, { day: dayIndex, start: '09:00', end: '17:00' }]);
    }
  };

  const handleTimeChange = (dayIndex, field, value) => {
    setAvailability(
      availability.map((a) => (a.day === dayIndex ? { ...a, [field]: value } : a))
    );
  };

  const handleSaveAvailability = async () => {
    if (!doctorProfile) return;
    setSavingAvailability(true);
    try {
      await api.put(`/api/doctors/${doctorProfile._id}/availability`, {
        availability
      });
      setActionMessage({ type: 'success', text: 'Weekly availability updated successfully.' });
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save availability.' });
    } finally {
      setSavingAvailability(false);
    }
  };

  const pendingAppointments = appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed');
  const completedAppointments = appointments.filter((a) => a.status === 'completed');

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Doctor Portal</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome, <strong className="text-slate-800">{user?.name}</strong> • Specialty:{' '}
            <span className="text-teal-700 font-bold">{doctorProfile?.specialty || 'General Practice'}</span>
          </p>
        </div>

        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium flex justify-between items-center ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage(null)} className="text-xs font-bold underline">Dismiss</button>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-bold">
              👨‍⚕️
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{pendingAppointments.length}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Patients</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{completedAppointments.length}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Consultations</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              💰
            </div>
            <div>
              <div className="text-2xl font-black text-teal-700">
                ${completedAppointments.length * (doctorProfile?.fees || 100)}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Revenue</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Scheduled Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Patient Appointments Queue</h2>

              {loading ? (
                <LoadingSpinner text="Loading schedule..." />
              ) : appointments.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">No appointment requests at this moment.</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appt) => {
                    const patient = appt.patient;
                    const dateObj = new Date(appt.date);

                    return (
                      <div
                        key={appt._id}
                        className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">
                              {patient?.name?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{patient?.name || 'Patient'}</div>
                              <div className="text-xs text-slate-500">{patient?.email}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                appt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                appt.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                                'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {appt.status}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 mb-3 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Date & Time:</span>
                            <span className="font-semibold text-slate-800">
                              {dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Clinical Reason:</span>
                            <span className="font-medium text-slate-700">{appt.notes || 'Routine consultation'}</span>
                          </div>
                        </div>

                        {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(appt._id, 'completed')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                            >
                              Mark Completed
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Manage Availability Slots */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Weekly Clinic Hours</h2>
              <p className="text-xs text-slate-500 mb-4">
                Toggle days you are open for bookings and define your daily working hours.
              </p>

              <div className="space-y-3">
                {daysOfWeek.map((dayName, idx) => {
                  const activeSlot = availability.find((a) => a.day === idx);
                  const isActive = Boolean(activeSlot);

                  return (
                    <div
                      key={dayName}
                      className={`p-3 rounded-xl border text-xs transition ${
                        isActive ? 'bg-teal-50/60 border-teal-200' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-800">{dayName}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleDay(idx)}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            isActive ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isActive ? 'Active' : 'Off'}
                        </button>
                      </div>

                      {isActive && (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="time"
                            value={activeSlot.start || '09:00'}
                            onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                          />
                          <span className="text-slate-400">to</span>
                          <input
                            type="time"
                            value={activeSlot.end || '17:00'}
                            onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleSaveAvailability}
                disabled={savingAvailability}
                className="w-full mt-6 py-2.5 px-4 rounded-xl text-white font-bold bg-teal-600 hover:bg-teal-700 transition shadow-md shadow-teal-100 disabled:opacity-50 text-xs"
              >
                {savingAvailability ? 'Saving...' : 'Save Availability'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


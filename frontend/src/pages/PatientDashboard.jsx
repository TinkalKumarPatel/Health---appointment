import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PatientDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [actionMessage, setActionMessage] = useState(null);

  // Reschedule state
  const [reschedulingId, setReschedulingId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');

  const fetchAppointments = () => {
    setLoading(true);
    api.get('/api/appointments')
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch patient appointments', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.delete(`/api/appointments/${id}`);
      setActionMessage({ type: 'success', text: 'Appointment has been cancelled.' });
      fetchAppointments();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to cancel appointment.' });
    }
  };

  const handleRescheduleSubmit = async (id) => {
    if (!rescheduleDate) return;
    try {
      await api.put(`/api/appointments/${id}`, {
        date: new Date(rescheduleDate).toISOString()
      });
      setActionMessage({ type: 'success', text: 'Appointment rescheduled successfully.' });
      setReschedulingId(null);
      fetchAppointments();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to reschedule.' });
    }
  };

  const now = new Date();
  const upcomingCount = appointments.filter((a) => new Date(a.date) >= now && a.status !== 'cancelled').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;

  const filteredAppointments = appointments.filter((a) => {
    if (activeTab === 'upcoming') return new Date(a.date) >= now && a.status !== 'cancelled';
    if (activeTab === 'past') return new Date(a.date) < now || a.status === 'completed';
    if (activeTab === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Confirmed</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pending</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Portal</h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back, <strong className="text-slate-800">{user?.name}</strong>. Manage your scheduled visits and medical records.
            </p>
          </div>
          <Link
            to="/doctors"
            className="py-2.5 px-5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-100 transition flex items-center gap-2"
          >
            <span>+</span> Book New Appointment
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-bold">
              📅
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{upcomingCount}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Visits</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              🩺
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{completedCount}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Consultations</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center text-xl font-bold">
              📑
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{appointments.length}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Records</div>
            </div>
          </div>
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'all'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            All Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'upcoming'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'past'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Past & Completed
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'cancelled'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Cancelled ({cancelledCount})
          </button>
        </div>

        {/* Appointment Cards */}
        {loading ? (
          <LoadingSpinner text="Loading your appointments..." />
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
              📅
            </div>
            <h3 className="text-lg font-bold text-slate-800">No appointments in this category</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              You do not have any scheduled appointments matching your selected filter.
            </p>
            <Link
              to="/doctors"
              className="mt-4 inline-block px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm"
            >
              Book an Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => {
              const apptDate = new Date(appt.date);
              const isPast = apptDate < now;
              const doctorUser = appt.doctor?.user;

              return (
                <div
                  key={appt._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                        {doctorUser?.name ? doctorUser.name.replace('Dr. ', '').charAt(0) : 'D'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{doctorUser?.name || 'Assigned Specialist'}</h3>
                        <p className="text-xs text-teal-700 font-semibold">{appt.doctor?.specialty || 'General Practice'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(appt.status)}
                      <span className="text-sm font-bold text-slate-800">${appt.doctor?.fees || 100}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 mb-4 bg-slate-50 p-4 rounded-xl">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Date & Time:</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {apptDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        <br />
                        <span className="text-teal-700 font-semibold">{apptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Consultation Notes:</span>
                      <span className="font-medium text-slate-700 line-clamp-2">
                        {appt.notes || 'General health consultation'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Location:</span>
                      <span className="font-medium text-slate-700">
                        {appt.doctor?.locations?.[0] || 'CarePoint Clinic Hub'}
                      </span>
                    </div>
                  </div>

                  {/* Reschedule inline editor */}
                  {reschedulingId === appt._id && (
                    <div className="p-4 mb-4 rounded-xl bg-teal-50/50 border border-teal-200">
                      <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">Select New Date & Time</h4>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="datetime-local"
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRescheduleSubmit(appt._id)}
                          className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition"
                        >
                          Confirm Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => setReschedulingId(null)}
                          className="px-3 py-2 text-slate-500 hover:text-slate-700 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {appt.status !== 'cancelled' && appt.status !== 'completed' && !isPast && (
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReschedulingId(appt._id);
                          setRescheduleDate(new Date(appt.date).toISOString().slice(0, 16));
                        }}
                        className="px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-xl border border-teal-200 transition"
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(appt._id)}
                        className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition"
                      >
                        Cancel Appointment
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
  );
}


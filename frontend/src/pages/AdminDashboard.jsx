import React, { useState, useEffect } from 'react';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [actionMessage, setActionMessage] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, apptRes, specRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/appointments'),
        api.get('/api/admin/specialties')
      ]);
      setUsers(usersRes.data);
      setAppointments(apptRes.data);
      setSpecialties(specRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setActionMessage({ type: 'success', text: 'User removed from platform.' });
      fetchAdminData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete user.' });
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await api.put(`/api/admin/users/${id}`, { role: newRole });
      setActionMessage({ type: 'success', text: `User role updated to ${newRole}.` });
      fetchAdminData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update role.' });
    }
  };

  const handleUpdateApptStatus = async (id, newStatus) => {
    try {
      await api.put(`/api/appointments/${id}`, { status: newStatus });
      setActionMessage({ type: 'success', text: `Appointment status updated to ${newStatus}.` });
      fetchAdminData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status.' });
    }
  };

  const patientCount = users.filter((u) => u.role === 'patient').length;
  const doctorCount = users.filter((u) => u.role === 'doctor').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Administration</h1>
          <p className="text-sm text-slate-500 mt-1">Platform-wide overview, user credentials, and master schedule control</p>
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

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-black text-slate-900">{users.length}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Total Users</div>
            <div className="text-[11px] text-slate-500 mt-1">{patientCount} Patients • {doctorCount} Doctors</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-black text-teal-700">{appointments.length}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Appointments</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              {appointments.filter((a) => a.status === 'confirmed').length} Active
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-black text-purple-700">{specialties.length}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Clinical Specialties</div>
            <div className="text-[11px] text-slate-500 mt-1">Departments Active</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-2xl font-black text-blue-700">99.9%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">System Health</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Operational</div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 mb-6 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'users' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            User Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'appointments' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Master Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('specialties')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'specialties' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Specialties ({specialties.length})
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving administrative records..." />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Tab: Users */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-semibold text-slate-800">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u._id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-white"
                          >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u._id)}
                            className="text-xs font-semibold text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Appointments */}
            {activeTab === 'appointments' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Specialty</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Manage Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((a) => (
                      <tr key={a._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{a.patient?.name || 'Patient'}</div>
                          <div className="text-xs text-slate-400">{a.patient?.email}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-teal-700">{a.doctor?.specialty || 'General'}</td>
                        <td className="px-6 py-4 text-xs">
                          {new Date(a.date).toLocaleDateString()} {new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                              a.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              a.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              a.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={a.status}
                            onChange={(e) => handleUpdateApptStatus(a._id, e.target.value)}
                            className="text-xs font-medium px-2 py-1 border border-slate-200 rounded-lg"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Specialties */}
            {activeTab === 'specialties' && (
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {specialties.map((spec) => (
                    <div key={spec} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-sm">{spec}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


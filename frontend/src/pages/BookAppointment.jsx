import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successBooking, setSuccessBooking] = useState(null);

  // Suggested time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    api.get(`/api/doctors/${doctorId}`)
      .then((res) => {
        setDoctor(res.data);
        // Default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split('T')[0]);
        setSelectedTime('10:00 AM');
      })
      .catch((err) => {
        console.error('Failed to load doctor', err);
        setError('Doctor details could not be loaded.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedDate || !selectedTime) {
      setError('Please select both a date and an available time slot.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      // Convert 12h time to 24h
      let [timePart, modifier] = selectedTime.split(' ');
      let [hours, minutes] = timePart.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
      const isoDatetime = new Date(`${selectedDate}T${String(hours).padStart(2, '0')}:${minutes}:00`);

      const res = await api.post('/api/appointments', {
        doctorId: doctor._id,
        date: isoDatetime.toISOString(),
        durationMinutes: 30,
        notes: notes || 'General medical consultation'
      });

      setSuccessBooking(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please choose another slot.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading doctor profile..." />;

  if (successBooking) {
    return (
      <div className="bg-slate-50 min-h-[calc(100vh-16rem)] py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Appointment Confirmed!</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            Your appointment has been successfully scheduled with <strong>{doctor?.user?.name}</strong>.
          </p>

          <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 mb-6 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Time:</span>
              <span className="font-semibold text-slate-800">{new Date(successBooking.date).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Specialty:</span>
              <span className="font-semibold text-slate-800">{doctor?.specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Consultation Fee:</span>
              <span className="font-bold text-teal-700">${doctor?.fees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="capitalize font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                {successBooking.status}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              to="/patient"
              className="block w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-md shadow-teal-100"
            >
              Go to My Appointments
            </Link>
            <Link
              to="/doctors"
              className="block w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition"
            >
              Book Another Appointment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/doctors" className="inline-flex items-center text-xs font-semibold text-teal-600 hover:text-teal-700 mb-2">
            ← Back to all doctors
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Schedule Your Consultation</h1>
          <p className="text-sm text-slate-500 mt-1">Select an appointment time that works best for you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-teal-100 mb-4">
                {doctor?.user?.name ? doctor.user.name.replace('Dr. ', '').charAt(0) : 'D'}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{doctor?.user?.name}</h3>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 mt-1 mb-4">
                {doctor?.specialty}
              </div>

              <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <span className="font-semibold text-slate-800">{doctor?.experienceYears} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consultation Fee:</span>
                  <span className="font-extrabold text-teal-700 text-sm">${doctor?.fees}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Locations:</span>
                  <span className="font-medium text-slate-800">{doctor?.locations?.join(', ') || 'Main Clinic'}</span>
                </div>
                {doctor?.qualifications && (
                  <div>
                    <span className="text-slate-400 block mb-1">Degrees:</span>
                    <span className="font-medium text-slate-800">{doctor.qualifications.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                  <span className="text-red-500 font-bold">!</span>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>

                {/* 2. Time Slots */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. Select Time Slot
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition border ${
                          selectedTime === slot
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-100 ring-2 ring-teal-500/50'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Reason / Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. Reason for Visit / Medical Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your symptoms or reason for the consultation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>

                {/* Summary & Submit */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-slate-600">Total payable at clinic:</span>
                    <span className="text-xl font-extrabold text-teal-700">${doctor?.fees}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg shadow-teal-600/20 transition disabled:opacity-50 text-sm"
                  >
                    {submitting ? 'Confirming Appointment...' : 'Confirm Appointment Booking'}
                  </button>

                  <p className="text-xs text-slate-400 text-center mt-3">
                    Free cancellation up to 2 hours prior to scheduled appointment
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


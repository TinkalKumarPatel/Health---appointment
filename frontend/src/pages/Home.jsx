import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import BMICalculator from '../components/BMICalculator';

export default function Home() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Interactive Symptom Matcher state
  const [activeSymptomIndex, setActiveSymptomIndex] = useState(0);

  const symptomGuides = [
    {
      symptom: 'Chest Discomfort & High BP',
      specialty: 'Cardiology',
      icon: '❤️',
      themeColor: 'from-rose-500 to-red-600',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      description: 'Persistent chest tightness, irregular heartbeat, shortness of breath, or uncontrolled high blood pressure.',
      doctorName: 'Dr. Sarah Smith',
      doctorDocId: '660000000000000000000011',
      fee: '$120'
    },
    {
      symptom: 'Acne, Skin Rash & Allergies',
      specialty: 'Dermatology',
      icon: '✨',
      themeColor: 'from-purple-500 to-fuchsia-600',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Inflammatory skin conditions, eczema, unexplained rashes, mole checks, or hair loss.',
      doctorName: 'Dr. Marcus Johnson',
      doctorDocId: '660000000000000000000012',
      fee: '$95'
    },
    {
      symptom: 'Child Fever & Vaccination',
      specialty: 'Pediatrics',
      icon: '👶',
      themeColor: 'from-amber-400 to-orange-500',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Pediatric care for infants and kids: seasonal infections, immunization schedules, and developmental milestones.',
      doctorName: 'Dr. Emily Williams',
      doctorDocId: '660000000000000000000013',
      fee: '$80'
    },
    {
      symptom: 'Severe Migraine & Dizziness',
      specialty: 'Neurology',
      icon: '🧠',
      themeColor: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      description: 'Chronic headaches, neuropathic numbness, balance disorders, memory lapses, or spinal nerve issues.',
      doctorName: 'Dr. Robert Chen',
      doctorDocId: '660000000000000000000014',
      fee: '$150'
    },
    {
      symptom: 'Joint Pain & Sports Injury',
      specialty: 'Orthopedics',
      icon: '🦴',
      themeColor: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Knee arthritis, ligament sprains, chronic back stiffness, fractures, or sports rehabilitation.',
      doctorName: 'Dr. Lisa Davis',
      doctorDocId: '660000000000000000000015',
      fee: '$110'
    }
  ];

  useEffect(() => {
    api.get('/api/doctors')
      .then((res) => {
        setDoctors(res.data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load featured doctors', err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('name', searchTerm);
    if (selectedSpecialty) params.append('specialty', selectedSpecialty);
    navigate(`/doctors?${params.toString()}`);
  };

  const specialties = [
    {
      name: 'Cardiology',
      icon: '❤️',
      desc: 'Heart & vascular care',
      bgLight: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-600',
      glow: 'group-hover:shadow-rose-100',
      iconBg: 'bg-gradient-to-tr from-rose-500 to-red-500'
    },
    {
      name: 'Dermatology',
      icon: '✨',
      desc: 'Skin, hair & nail care',
      bgLight: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      glow: 'group-hover:shadow-purple-100',
      iconBg: 'bg-gradient-to-tr from-purple-500 to-fuchsia-500'
    },
    {
      name: 'Pediatrics',
      icon: '👶',
      desc: 'Child health care',
      bgLight: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-600',
      glow: 'group-hover:shadow-amber-100',
      iconBg: 'bg-gradient-to-tr from-amber-400 to-orange-500'
    },
    {
      name: 'Neurology',
      icon: '🧠',
      desc: 'Brain & nerve diagnosis',
      bgLight: 'bg-cyan-50',
      border: 'border-cyan-200',
      text: 'text-cyan-700',
      glow: 'group-hover:shadow-cyan-100',
      iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600'
    },
    {
      name: 'Orthopedics',
      icon: '🦴',
      desc: 'Joints & spine care',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      glow: 'group-hover:shadow-emerald-100',
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600'
    },
  ];

  const testimonials = [
    {
      quote: "Booking with Dr. Smith was instant! I received timely care for my blood pressure without waiting hours at a crowded hospital.",
      author: "David Miller",
      badge: "Verified Patient",
      avatarBg: "from-blue-500 to-cyan-500",
      cardBorder: "border-blue-100 hover:border-blue-300"
    },
    {
      quote: "The doctor dashboard and easy rescheduling gave me peace of mind when my child fell sick. Excellent healthcare experience!",
      author: "Priya Sharma",
      badge: "Verified Mother",
      avatarBg: "from-amber-400 to-rose-500",
      cardBorder: "border-amber-100 hover:border-amber-300"
    },
    {
      quote: "Dr. Johnson pinpointed my allergy in one consultation. Clean interface, transparent fees, and polite clinical staff.",
      author: "Carlos Rodriguez",
      badge: "Verified Patient",
      avatarBg: "from-purple-500 to-indigo-600",
      cardBorder: "border-purple-100 hover:border-purple-300"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      {/* Colorful Emergency & Live Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 text-white text-xs py-2.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/30"></span>
            <span>All Clinical Departments Are Open • Online & In-Clinic Appointments</span>
          </div>
          <div className="flex items-center gap-4 text-cyan-100">
            <span>🚨 24/7 Helpline: <strong className="text-white underline">1-800-CARE-NOW</strong></span>
            <span className="hidden md:inline font-bold text-amber-300">⚡ Instant Confirmation</span>
          </div>
        </div>
      </div>

      {/* Colorful Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        {/* Colorful Glowing Ambient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-cyan-950/50">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Verified Specialists • Smart Healthcare Booking
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            Find the Right Doctor <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Book Quality Care in Minutes
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-10 leading-relaxed font-normal">
            Connect with board-certified physicians across 15+ specialties. View live availability, transparent consultation fees, and schedule your visit hassle-free.
          </p>

          {/* Search Box with Colorful Accents */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-2xl max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 text-slate-800 border-2 border-indigo-200/50"
          >
            <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 transition">
              <span className="text-teal-600 mr-2 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Doctor name (e.g. Dr. Smith)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm focus:outline-none font-medium"
              />
            </div>

            <div className="sm:w-56 flex items-center px-4 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 transition">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm focus:outline-none text-slate-700 font-bold"
              >
                <option value="">All Specialties</option>
                {specialties.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="py-3 px-8 rounded-xl font-bold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 transition shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 active:scale-95"
            >
              Search Doctors
            </button>
          </form>

          {/* Glowing Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-3xl font-black bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">50+</div>
              <div className="text-xs text-slate-300 mt-1 uppercase font-bold tracking-wider">Expert Doctors</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">10,000+</div>
              <div className="text-xs text-slate-300 mt-1 uppercase font-bold tracking-wider">Happy Patients</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-3xl font-black bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">15+</div>
              <div className="text-xs text-slate-300 mt-1 uppercase font-bold tracking-wider">Specialties</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-3xl font-black bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">4.9 / 5</div>
              <div className="text-xs text-slate-300 mt-1 uppercase font-bold tracking-wider">Patient Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Colorful Interactive Symptom Matcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-indigo-800/60">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black text-amber-300 uppercase tracking-widest block mb-2">
              💡 Interactive Health Guide
            </span>
            <h2 className="text-3xl font-black tracking-tight">Not Sure Which Doctor to See?</h2>
            <p className="text-slate-300 text-sm mt-2">
              Click your symptom below to see the recommended clinical department and doctor:
            </p>
          </div>

          {/* Symptom Chips Selector */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {symptomGuides.map((item, idx) => (
              <button
                key={item.symptom}
                type="button"
                onClick={() => setActiveSymptomIndex(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 border ${
                  activeSymptomIndex === idx
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-300 text-slate-950 shadow-xl shadow-cyan-400/30 scale-105 border-cyan-200'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/15'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.symptom}</span>
              </button>
            ))}
          </div>

          {/* Matched Department & Specialist Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-xl">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${symptomGuides[activeSymptomIndex].badgeBg}`}>
                  {symptomGuides[activeSymptomIndex].specialty}
                </span>
                <span className="text-xs font-bold text-amber-300">
                  ⚡ Consultation Fee: {symptomGuides[activeSymptomIndex].fee}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{symptomGuides[activeSymptomIndex].doctorName}</h3>
              <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
                {symptomGuides[activeSymptomIndex].description}
              </p>
            </div>

            <div className="flex justify-start md:justify-end">
              <Link
                to={`/doctors?specialty=${symptomGuides[activeSymptomIndex].specialty}`}
                className="py-3 px-6 rounded-xl text-sm font-extrabold bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 transition shadow-xl shadow-teal-400/40 active:scale-95"
              >
                Book This Specialist →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Colorful Specialties Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <span className="text-xs font-black text-teal-600 uppercase tracking-widest block mb-2">Explore Departments</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Browse by Medical Specialty</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            Choose from our primary clinical fields to connect with dedicated healthcare providers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {specialties.map((item) => (
            <Link
              key={item.name}
              to={`/doctors?specialty=${item.name}`}
              className={`${item.bgLight} p-6 rounded-2xl border-2 ${item.border} hover:shadow-xl ${item.glow} hover:-translate-y-1 transition duration-200 group flex flex-col items-center text-center`}
            >
              <div className={`w-14 h-14 rounded-2xl ${item.iconBg} text-white shadow-md flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition`}>
                {item.icon}
              </div>
              <h3 className={`font-black text-slate-900 group-hover:${item.text} transition text-base`}>{item.name}</h3>
              <p className="text-xs text-slate-600 mt-1.5 font-medium">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="bg-gradient-to-b from-slate-100 to-indigo-50/40 border-y border-indigo-100/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-1">Our Certified Medical Team</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Featured Specialists</h2>
              <p className="text-slate-500 text-sm mt-1">Book an appointment directly with top-rated physicians</p>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700 hover:text-indigo-900"
            >
              View all doctors →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading doctors..." />
          ) : doctors.length === 0 ? (
            <p className="text-slate-500 text-center py-10">No doctors listed right now.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doc, idx) => {
                // Vibrant avatar gradient colors
                const avatarGradients = [
                  'from-rose-500 to-red-600 shadow-rose-200',
                  'from-purple-500 to-indigo-600 shadow-purple-200',
                  'from-amber-400 to-orange-500 shadow-amber-200',
                  'from-cyan-500 to-blue-600 shadow-blue-200'
                ];
                const grad = avatarGradients[idx % avatarGradients.length];

                return (
                  <div
                    key={doc._id}
                    className="bg-white rounded-2xl border-2 border-indigo-100/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-300 transition duration-200 flex flex-col justify-between"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${grad} text-white font-black text-xl flex items-center justify-center shadow-lg`}>
                          {doc.user?.name ? doc.user.name.replace('Dr. ', '').charAt(0) : 'D'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{doc.user?.name}</h3>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 mt-0.5 border border-indigo-100">
                            {doc.specialty}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mb-3">
                        <span>★ 4.9</span>
                        <span className="text-slate-400 font-normal">(120+ verified reviews)</span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Experience:</span>
                          <span className="font-bold text-slate-800">{doc.experienceYears || 5} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Consultation Fee:</span>
                          <span className="font-black text-teal-700 text-sm">${doc.fees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Clinic Location:</span>
                          <span className="font-medium truncate max-w-[150px]">{doc.locations?.[0] || 'Main Clinic'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-b from-slate-50 to-indigo-50/50 border-t border-slate-100">
                      <Link
                        to={`/book/${doc._id}`}
                        className="block w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 transition shadow-md shadow-cyan-200"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Tool & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Interactive BMI Tool */}
          <BMICalculator />

          {/* Patient Reviews with Colorful Avatar Badges */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-1">
                Verified Patient Testimonials
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">What Patients Say About CarePoint</h2>
            </div>

            <div className="space-y-4">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className={`bg-white p-6 rounded-2xl border-2 ${t.cardBorder} shadow-sm hover:shadow-md transition`}
                >
                  <div className="flex items-center gap-1 text-amber-400 text-sm mb-2.5">
                    ★★★★★
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${t.avatarBg} text-white font-bold flex items-center justify-center text-[11px]`}>
                        {t.author.charAt(0)}
                      </div>
                      <span className="font-extrabold text-slate-800">{t.author}</span>
                    </div>
                    <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold">
                      {t.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-black text-teal-600 uppercase tracking-widest block mb-2">Simple Process</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How CarePoint Works</h2>
            <p className="text-slate-500 text-sm mt-2">Get quality medical attention in three easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-blue-50/50 to-white p-8 rounded-2xl border-2 border-blue-100 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-200">
                1
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Find Your Doctor</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter verified medical doctors by specialty, qualification, experience, fee, and location.
              </p>
            </div>

            <div className="bg-gradient-to-b from-teal-50/50 to-white p-8 rounded-2xl border-2 border-teal-100 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-200">
                2
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Select Date & Time</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                View the doctor’s live weekly availability and select an open time slot that suits your schedule.
              </p>
            </div>

            <div className="bg-gradient-to-b from-purple-50/50 to-white p-8 rounded-2xl border-2 border-purple-100 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-purple-200">
                3
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Confirm & Receive Care</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get an instant confirmed booking. Easily track, reschedule, or cancel from your patient dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

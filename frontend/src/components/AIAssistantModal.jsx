import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AIAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I'm your CarePoint Health Assistant. How can I help you today?",
      options: [
        'Find a doctor for my symptoms',
        'How to book an appointment?',
        'Consultation fees & timing',
        'How to reschedule or cancel?'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputText('');

    // Generate intelligent instant response
    setTimeout(() => {
      let reply = '';
      let actionLink = null;
      let actionText = null;

      const lower = text.toLowerCase();
      if (lower.includes('heart') || lower.includes('chest') || lower.includes('blood pressure')) {
        reply = "For chest pain, hypertension or cardiovascular concerns, you should consult our Cardiology Department. Dr. Sarah Smith is currently available.";
        actionLink = '/doctors?specialty=Cardiology';
        actionText = 'View Cardiologists';
      } else if (lower.includes('skin') || lower.includes('rash') || lower.includes('acne') || lower.includes('hair')) {
        reply = "For skin issues, allergies, or rashes, our Dermatology specialist Dr. Marcus Johnson can assist you.";
        actionLink = '/doctors?specialty=Dermatology';
        actionText = 'View Dermatologists';
      } else if (lower.includes('child') || lower.includes('kid') || lower.includes('baby') || lower.includes('pediatric')) {
        reply = "For children's health, vaccinations, or development checks, consult Dr. Emily Williams in Pediatrics.";
        actionLink = '/doctors?specialty=Pediatrics';
        actionText = 'View Pediatricians';
      } else if (lower.includes('headache') || lower.includes('brain') || lower.includes('migraine') || lower.includes('nerve')) {
        reply = "For neurological concerns, severe migraines, or spine/nerve symptoms, please see Dr. Robert Chen (Neurology).";
        actionLink = '/doctors?specialty=Neurology';
        actionText = 'View Neurologists';
      } else if (lower.includes('bone') || lower.includes('joint') || lower.includes('knee') || lower.includes('fracture')) {
        reply = "For joint pain, sports injuries, or orthopedic checkups, Dr. Lisa Davis is available in Orthopedics.";
        actionLink = '/doctors?specialty=Orthopedics';
        actionText = 'View Orthopedic Doctors';
      } else if (lower.includes('book') || lower.includes('how to book')) {
        reply = "Booking is easy! Go to 'Find Doctors', pick your specialist, choose an open date and time slot, and confirm. Instant confirmation is provided.";
        actionLink = '/doctors';
        actionText = 'Browse Doctors Now';
      } else if (lower.includes('fee') || lower.includes('cost') || lower.includes('price')) {
        reply = "Consultation fees start at $50-$130 depending on the specialist. You can view each doctor's exact fee upfront before booking.";
        actionLink = '/doctors';
        actionText = 'Check Doctor Fees';
      } else if (lower.includes('cancel') || lower.includes('reschedule')) {
        reply = "You can easily reschedule or cancel an appointment from your Patient Dashboard under 'My Appointments' with zero penalty.";
        actionLink = '/patient';
        actionText = 'Go to My Appointments';
      } else {
        reply = "I understand. You can explore our verified medical specialists by department, or book a general checkup right away.";
        actionLink = '/doctors';
        actionText = 'Find a Specialist';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          actionLink,
          actionText
        }
      ]);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-2xl shadow-teal-700/50 hover:scale-105 active:scale-95 transition group"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <span className="text-sm">Health Assistant AI</span>
          <span className="text-lg">💬</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-slate-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                🩺
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">CarePoint AI Assistant</h3>
                <span className="text-[11px] text-teal-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Always Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg text-lg"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>

                {/* Quick suggestions pills */}
                {m.options && (
                  <div className="mt-2.5 space-y-1.5 w-full">
                    {m.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(opt)}
                        className="block w-full text-left p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-semibold transition border border-teal-200/60"
                      >
                        👉 {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct Action Link */}
                {m.actionLink && (
                  <Link
                    to={m.actionLink}
                    onClick={() => setIsOpen(false)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-[11px] hover:bg-teal-700 transition shadow-sm"
                  >
                    {m.actionText} →
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask symptoms, doctors, fees..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}


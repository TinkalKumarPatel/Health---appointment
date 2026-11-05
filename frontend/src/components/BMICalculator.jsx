import React, { useState } from 'react';

export default function BMICalculator() {
  const [height, setHeight] = useState(170); // cm
  const [weight, setWeight] = useState(68);  // kg
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight) return;
    const heightInMeters = height / 100;
    const score = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(score);

    if (score < 18.5) {
      setCategory({
        label: 'Underweight',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        tip: 'Consider consulting a clinical nutritionist to develop a healthy weight-gain plan.'
      });
    } else if (score < 25) {
      setCategory({
        label: 'Healthy Weight',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        tip: 'Great job! Maintain your balanced nutrition and regular physical activity.'
      });
    } else if (score < 30) {
      setCategory({
        label: 'Overweight',
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        tip: 'Regular cardiovascular exercise and a reduced-calorie meal plan are recommended.'
      });
    } else {
      setCategory({
        label: 'Obese',
        color: 'text-red-700 bg-red-50 border-red-200',
        tip: 'Consult a cardiologist or general physician for a supervised wellness check.'
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold">
          ⚖️
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Interactive Health Calculator</h3>
          <p className="text-xs text-slate-500">Calculate your Body Mass Index (BMI) in seconds</p>
        </div>
      </div>

      <form onSubmit={calculateBMI} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Height:</span>
            <span className="text-teal-700">{height} cm</span>
          </div>
          <input
            type="range"
            min="120"
            max="220"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>120 cm</span>
            <span>220 cm</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Weight:</span>
            <span className="text-teal-700">{weight} kg</span>
          </div>
          <input
            type="range"
            min="35"
            max="160"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>35 kg</span>
            <span>160 kg</span>
          </div>
        </div>

        <button
          type="submit"
          className="sm:col-span-2 py-3 px-6 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition shadow-md shadow-teal-100 text-sm"
        >
          Check My BMI Score
        </button>
      </form>

      {bmi && category && (
        <div className={`p-5 rounded-2xl border ${category.color} animate-in fade-in transition`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Your Result:</span>
            <span className="text-2xl font-black">{bmi} BMI</span>
          </div>
          <div className="text-sm font-bold mb-1">Category: {category.label}</div>
          <p className="text-xs opacity-90 leading-relaxed">{category.tip}</p>
        </div>
      )}
    </div>
  );
}


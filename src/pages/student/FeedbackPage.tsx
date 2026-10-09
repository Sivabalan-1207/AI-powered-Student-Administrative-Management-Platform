import React, { useState } from 'react';
import { store } from '../../services/store';
import { MessageSquareText, Star, CheckCircle2 } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState(5);
  const [timeSat, setTimeSat] = useState(5);
  const [claritySat, setClaritySat] = useState(5);
  const [easeOfUse, setEaseOfUse] = useState(5);
  const [comments, setComments] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.submitFeedback({
      requestId: 'REQ-2026-00098',
      rating,
      timeSatisfaction: timeSat,
      claritySatisfaction: claritySat,
      easeOfUse,
      comments
    });
    setSubmittedMsg(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <MessageSquareText className="w-6 h-6 text-indigo-600" />
          <span>Student Service Feedback</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Help us improve university administrative workflows and food/stationery service delivery.
        </p>
      </div>

      {submittedMsg ? (
        <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-extrabold text-emerald-900">Thank you for your feedback!</h2>
          <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
            Your response helps improve student services and administrative turnaround performance.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 text-xs shadow-2xs">
          <div>
            <label className="block font-bold text-slate-800 mb-2">Overall Platform Rating:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-xl transition-all ${
                    rating >= star ? 'text-amber-400 scale-110' : 'text-slate-300'
                  }`}
                >
                  <Star className="w-7 h-7 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">Processing Time Satisfaction (1 to 5):</label>
            <input
              type="range"
              min="1"
              max="5"
              value={timeSat}
              onChange={(e) => setTimeSat(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="text-[11px] text-slate-500 font-semibold">Score: {timeSat} / 5</div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">Clarity of Instructions & Guidance (1 to 5):</label>
            <input
              type="range"
              min="1"
              max="5"
              value={claritySat}
              onChange={(e) => setClaritySat(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="text-[11px] text-slate-500 font-semibold">Score: {claritySat} / 5</div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">Optional Suggestions & Comments:</label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="What could we improve?"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

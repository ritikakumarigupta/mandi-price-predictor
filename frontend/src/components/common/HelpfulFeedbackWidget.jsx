import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const HelpfulFeedbackWidget = () => {
  const { lang } = useLanguage();
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [responseType, setResponseType] = useState(null); // 'yes' | 'no'
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const handleVote = (type) => {
    setResponseType(type);
    setFeedbackGiven(true);
    // Auto-save positive feedback or prompt for comment on negative
    if (type === 'yes') {
      saveFeedback({ type: 'yes', comment: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    saveFeedback({ type: responseType, comment });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackGiven(false);
      setComment('');
    }, 3000);
  };

  const saveFeedback = ({ type, comment }) => {
    try {
      const existing = JSON.parse(localStorage.getItem('mandisetu_feedbacks') || '[]');
      existing.push({
        id: Date.now(),
        type,
        comment,
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
      });
      localStorage.setItem('mandisetu_feedbacks', JSON.stringify(existing));
    } catch (e) {
      console.error('Error saving feedback:', e);
    }
  };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
        title="प्रतिक्रिया दें (Feedback)"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">{lang === 'hi' ? 'प्रतिक्रिया' : 'Feedback'}</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="User feedback widget"
      className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-80 rounded-2xl p-4 glass-panel bg-slate-900/90 text-white border border-emerald-500/30 shadow-2xl backdrop-blur-xl animate-fade-in"
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          {lang === 'hi' ? 'किसान सहायता व फीडबैक' : 'Farmer Feedback'}
        </span>
        <button
          onClick={() => setMinimized(true)}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Minimize"
          aria-label="Minimize feedback widget"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!feedbackGiven && !submitted ? (
        <div className="pt-3 space-y-2">
          <p className="text-xs font-medium text-slate-200">
            {lang === 'hi' 
              ? 'क्या यह जानकारी आपके लिए मददगार थी?' 
              : 'Was this mandi information helpful to you?'}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleVote('yes')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'हाँ, मददगार है' : 'Yes, helpful'}</span>
            </button>
            <button
              onClick={() => handleVote('no')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सुधार चाहिए' : 'Needs work'}</span>
            </button>
          </div>
        </div>
      ) : submitted ? (
        <div className="pt-3 flex items-center gap-2 text-xs font-bold text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{lang === 'hi' ? 'धन्यवाद! आपकी राय हमारे लिए मूल्यवान है।' : 'Thank you for your valuable feedback!'}</span>
        </div>
      ) : (
        <form onSubmit={handleCommentSubmit} className="pt-3 space-y-2">
          <label htmlFor="feedback-comment" className="text-xs text-slate-300 block">
            {lang === 'hi' ? 'हम इसे किसानों के लिए और कैसे बेहतर बनाएं?' : 'How can we make this better for farmers?'}
          </label>
          <textarea
            id="feedback-comment"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={lang === 'hi' ? 'यहाँ अपना सुझाव लिखें...' : 'Type suggestion here...'}
            className="w-full text-xs p-2 rounded-xl bg-slate-800/90 border border-emerald-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setFeedbackGiven(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 cursor-pointer shadow-md"
            >
              {lang === 'hi' ? 'भेजें' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </aside>
  );
};

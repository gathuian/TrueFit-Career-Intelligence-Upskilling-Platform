import React, { useState } from 'react';
import { Sparkles, AlertOctagon, RefreshCw, HeartHandshake } from 'lucide-react';
import { ApplicationCard, RejectionAutopsyResult, UserProfile } from '../types';

interface RejectionAutopsyModalProps {
  application: ApplicationCard | null;
  onClose: () => void;
  userProfile: UserProfile;
}

export const RejectionAutopsyModal: React.FC<RejectionAutopsyModalProps> = ({
  application,
  onClose,
  userProfile,
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [autopsyResult, setAutopsyResult] = useState<RejectionAutopsyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!application) return null;

  const handleRunAutopsy = async () => {
    if (!feedbackText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/rejection-autopsy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decodedJob: application.decodedJob || {
            roleTitle: application.roleTitle,
            company: application.company,
          },
          userProfile,
          interviewFeedback: feedbackText,
        }),
      });
      const data = await res.json();
      setAutopsyResult(data);
    } catch (err) {
      console.error('Error running rejection autopsy:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1C1A18] rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Career Resilience &amp; Growth Engine</span>
            </div>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mt-1">
              Rejection Autopsy: {application.company}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          Standard rejections are shrouded in generic HR platitudes (&ldquo;we had many qualified applicants&rdquo;). TrueFit deconstructs what actually triggered the decision and gives you a concrete pivot for your next pipeline target.
        </p>

        {/* Input Feedback / Interview Notes */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
            Paste the rejection email, recruiter feedback, or your own interview notes:
          </label>
          <textarea
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="e.g. 'The team really enjoyed meeting you, but we decided to move forward with a candidate who had deeper hands-on experience in distributed systems at our scale...'"
            className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-900 dark:focus:border-stone-500 font-sans leading-relaxed"
          />
        </div>

        <button
          onClick={handleRunAutopsy}
          disabled={isLoading || !feedbackText.trim()}
          className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 disabled:bg-stone-300 dark:disabled:bg-stone-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 dark:border-stone-900/30 border-t-white dark:border-t-stone-950 rounded-full animate-spin" />
              <span>Diagnosing Hidden Signals...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
              <span>Run Rejection Autopsy</span>
            </>
          )}
        </button>

        {/* Results */}
        {autopsyResult && (
          <div className="space-y-5 pt-4 border-t border-stone-100 dark:border-stone-800 animate-fadeIn">
            {/* Diagnosis */}
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-900 dark:text-rose-300">
                <span>Primary Root Cause: {autopsyResult.diagnosis.primaryRootCause}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
                  {autopsyResult.diagnosis.confidenceLevel} Confidence
                </span>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                {autopsyResult.diagnosis.summary}
              </p>
            </div>

            {/* Hidden Signals Decoded */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                Hidden Signals in the HR Language:
              </div>
              <div className="space-y-1.5">
                {autopsyResult.hiddenSignals.map((signal, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300">
                    {signal}
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Pivot */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Tactical Pivot for Next Role</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 text-rose-900 dark:text-rose-300">
                  <span className="font-semibold block mb-0.5">Stop Doing:</span>
                  {autopsyResult.tacticalPivot.whatToStopDoing}
                </div>
                <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-300">
                  <span className="font-semibold block mb-0.5">Start Doing:</span>
                  {autopsyResult.tacticalPivot.whatToStartDoing}
                </div>
              </div>

              <div className="text-xs text-stone-700 dark:text-stone-300 pt-1 border-t border-stone-200/50 dark:border-stone-800">
                <span className="font-semibold text-stone-900 dark:text-stone-100">Upskilling Adjustment: </span>
                {autopsyResult.tacticalPivot.upskillingAdjustment}
              </div>
            </div>

            {/* Empathetic Reassurance */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <HeartHandshake className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed italic">
                &ldquo;{autopsyResult.reassurance}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { ApplicationCard, UserProfile } from '../types';

interface OutreachModalProps {
  application: ApplicationCard | null;
  onClose: () => void;
  userProfile: UserProfile;
}

export const OutreachModal: React.FC<OutreachModalProps> = ({
  application,
  onClose,
  userProfile,
}) => {
  const [outreachType, setOutreachType] = useState<'follow_up_email' | 'cover_letter' | 'recruiter_dm' | 'future_peer_dm'>('follow_up_email');
  const [customNotes, setCustomNotes] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState<{ subject: string; body: string; toneExplanation: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!application) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decodedJob: application.decodedJob || {
            roleTitle: application.roleTitle,
            company: application.company,
            realPriorities: ['Distributed system reliability', 'High-autonomy execution'],
          },
          userProfile,
          outreachType,
          customNotes,
        }),
      });
      const data = await res.json();
      setGeneratedDraft(data);
    } catch (err) {
      console.error('Error generating outreach draft:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedDraft) return;
    const textToCopy = `Subject: ${generatedDraft.subject}\n\n${generatedDraft.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1C1A18] rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              AI Strategic Outreach Generator
            </div>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mt-1">
              Draft for {application.roleTitle} at {application.company}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Outreach Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'follow_up_email', label: 'Follow-up Email' },
            { id: 'cover_letter', label: 'Direct Pitch Note' },
            { id: 'recruiter_dm', label: 'Recruiter DM' },
            { id: 'future_peer_dm', label: 'Future Peer DM' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setOutreachType(type.id as any);
                setGeneratedDraft(null);
              }}
              className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                outreachType === type.id
                  ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-950'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Optional Custom Notes */}
        <div>
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
            Any specific talking point or conversation note? (optional)
          </label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="e.g. Discussed their Q3 migration to Postgres during initial chat..."
            className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
          />
        </div>

        {/* Generate Button */}
        <div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 disabled:bg-stone-300 dark:disabled:bg-stone-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 dark:border-stone-900/30 border-t-white dark:border-t-stone-950 rounded-full animate-spin" />
                <span>Crafting Tone-Calibrated Message...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
                <span>Generate Outreach Draft</span>
              </>
            )}
          </button>
        </div>

        {/* Draft Output */}
        {generatedDraft && (
          <div className="space-y-4 pt-2 border-t border-stone-100 dark:border-stone-800 animate-fadeIn">
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <span className="font-semibold">Why this tone works: </span>
              {generatedDraft.toneExplanation}
            </div>

            <div className="space-y-2 bg-stone-50 dark:bg-stone-900/70 p-4 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-800">
                <span className="font-semibold text-stone-800 dark:text-stone-200">Subject: {generatedDraft.subject}</span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Full Draft'}</span>
                </button>
              </div>

              <div className="pt-2 whitespace-pre-wrap font-sans text-stone-800 dark:text-stone-200 leading-relaxed">
                {generatedDraft.body}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

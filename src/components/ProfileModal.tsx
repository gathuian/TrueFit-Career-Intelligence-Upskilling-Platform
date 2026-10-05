import React, { useState } from 'react';
import { Shield, Download, Upload, Check, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onExportData,
  onImportData,
}) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [newSkill, setNewSkill] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()],
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSave = () => {
    onSaveProfile(profile);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1C1A18] rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Candidate Profile &amp; Privacy Architecture
            </div>
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mt-1">
              Your Professional Foundation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Privacy Sandbox Card */}
        <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                Local-First Sandbox Mode
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.localPrivacyMode}
                onChange={(e) =>
                  setProfile({ ...profile, localPrivacyMode: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            When enabled, all profile records, CRM statuses, and decoded briefs reside strictly in your browser’s localStorage. Personal identifiable information (PII) is automatically redacted before AI semantic reasoning.
          </p>
        </div>

        {/* Profile Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Candidate Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Current Title
            </label>
            <input
              type="text"
              value={profile.currentTitle}
              onChange={(e) => setProfile({ ...profile, currentTitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="40"
              value={profile.yearsExperience}
              onChange={(e) =>
                setProfile({ ...profile, yearsExperience: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-900 dark:focus:border-stone-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Minimum Target Salary
            </label>
            <input
              type="text"
              value={profile.workStylePreferences.minimumTargetSalary}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  workStylePreferences: {
                    ...profile.workStylePreferences,
                    minimumTargetSalary: e.target.value,
                  },
                })
              }
              placeholder="e.g. $160,000"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-900 dark:focus:border-stone-500 font-mono"
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
            Professional Summary / Career Arc
          </label>
          <textarea
            rows={3}
            value={profile.summary}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-900 dark:focus:border-stone-500 font-sans leading-relaxed"
          />
        </div>

        {/* Core Skills Management */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
            Core Verified Skills &amp; Domain Expertise
          </label>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 min-h-[60px]">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 shadow-2xs"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs ml-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. Distributed Tracing, Rust, ADRs)..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 dark:bg-stone-200 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              + Add
            </button>
          </form>
        </div>

        {/* Culture & Work Style Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Autonomy Preference
            </label>
            <select
              value={profile.workStylePreferences.autonomyPreference}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  workStylePreferences: {
                    ...profile.workStylePreferences,
                    autonomyPreference: e.target.value as any,
                  },
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-xs bg-stone-50 dark:bg-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-500 cursor-pointer"
            >
              <option value="High">High Autonomy (Self-Directed)</option>
              <option value="Moderate">Balanced (Sprint Milestones)</option>
              <option value="Structured">Structured (Defined Process)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Pace Preference
            </label>
            <select
              value={profile.workStylePreferences.pacePreference}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  workStylePreferences: {
                    ...profile.workStylePreferences,
                    pacePreference: e.target.value as any,
                  },
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-xs bg-stone-50 dark:bg-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-500 cursor-pointer"
            >
              <option value="Async Deep Work">Async Deep Work &amp; RFCs</option>
              <option value="Balanced">Balanced (Standups + Focus)</option>
              <option value="Fast Iterative Sprints">Fast Iterative Sprints</option>
            </select>
          </div>
        </div>

        {/* Data Portability (Export / Import) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExportData}
              className="inline-flex items-center gap-1.5 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All Data (JSON)</span>
            </button>

            <label className="inline-flex items-center gap-1.5 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 underline cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportData}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {savedNotice ? <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedNotice ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

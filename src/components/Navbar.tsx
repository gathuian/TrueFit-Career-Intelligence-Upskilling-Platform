import React from 'react';
import { ShieldCheck, User, Sparkles, Sliders, Moon, Sun, HelpCircle, Compass } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenTutorial: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  userProfile: UserProfile;
  hasDecodedJob: boolean;
  onNewDecode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenTutorial,
  darkMode,
  onToggleTheme,
  userProfile,
  hasDecodedJob,
  onNewDecode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 dark:bg-[#1C1A18]/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('decoder')}
            className="flex items-baseline gap-2.5 text-left group focus-visible:outline-none cursor-pointer"
          >
            <span className="font-serif text-2xl tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
              TrueFit
            </span>
            <span className="hidden sm:inline text-xs font-normal text-stone-400 dark:text-stone-500 tracking-normal">
              Career Intelligence &amp; Growth Engine
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-stone-600 dark:text-stone-400">
          <button
            onClick={() => setActiveTab('decoder')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'decoder'
                ? 'text-stone-900 dark:text-stone-100 border-stone-900 dark:border-stone-100 font-semibold'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            1. The Decoder
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'bridge'
                ? 'text-stone-900 dark:text-stone-100 border-stone-900 dark:border-stone-100 font-semibold'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            2. Skill Bridge
          </button>

          <button
            onClick={() => setActiveTab('accelerator')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'accelerator'
                ? 'text-stone-900 dark:text-stone-100 border-stone-900 dark:border-stone-100 font-semibold'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            3. Accelerator
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'interview'
                ? 'text-stone-900 dark:text-stone-100 border-stone-900 dark:border-stone-100 font-semibold'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            4. Mock Simulator
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'crm'
                ? 'text-stone-900 dark:text-stone-100 border-stone-900 dark:border-stone-100 font-semibold'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            5. Career CRM
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`transition-colors pb-0.5 border-b-2 cursor-pointer flex items-center gap-1 ${
              activeTab === 'playground'
                ? 'text-teal-700 dark:text-teal-400 border-teal-700 dark:border-teal-400 font-semibold'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-teal-700 dark:hover:text-teal-400'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>6. Side Playground</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Theme Toggle, How It Works, Profile, Decode) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Tutorial / Guide Button */}
          <button
            onClick={onOpenTutorial}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-800 rounded-lg transition-colors cursor-pointer"
            title="Interactive Walkthrough Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span>How it works</span>
          </button>

          {/* Profile & Privacy Sandbox */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-800 rounded-lg transition-colors cursor-pointer"
            title="Manage profile & privacy settings"
          >
            <span className="relative flex h-2 w-2">
              {userProfile.localPrivacyMode && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${userProfile.localPrivacyMode ? 'bg-emerald-500' : 'bg-stone-400'}`}></span>
            </span>
            <span className="truncate max-w-[80px] sm:max-w-none">{userProfile.name}</span>
          </button>

          {/* New Decode CTA */}
          <button
            onClick={onNewDecode}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            + Decode Job
          </button>
        </div>

      </div>

      {/* Mobile nav strip */}
      <div className="lg:hidden flex overflow-x-auto gap-4 px-4 py-2 border-t border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#1C1A18] text-xs">
        <button
          onClick={() => setActiveTab('decoder')}
          className={`whitespace-nowrap pb-1 ${activeTab === 'decoder' ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100' : 'text-stone-500 dark:text-stone-400'}`}
        >
          Decoder
        </button>
        <button
          onClick={() => setActiveTab('bridge')}
          className={`whitespace-nowrap pb-1 ${activeTab === 'bridge' ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100' : 'text-stone-500 dark:text-stone-400'}`}
        >
          Skill Bridge
        </button>
        <button
          onClick={() => setActiveTab('accelerator')}
          className={`whitespace-nowrap pb-1 ${activeTab === 'accelerator' ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100' : 'text-stone-500 dark:text-stone-400'}`}
        >
          Accelerator
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`whitespace-nowrap pb-1 ${activeTab === 'interview' ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100' : 'text-stone-500 dark:text-stone-400'}`}
        >
          Mock Interview
        </button>
        <button
          onClick={() => setActiveTab('crm')}
          className={`whitespace-nowrap pb-1 ${activeTab === 'crm' ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100' : 'text-stone-500 dark:text-stone-400'}`}
        >
          Career CRM
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`whitespace-nowrap pb-1 flex items-center gap-1 ${activeTab === 'playground' ? 'text-teal-700 dark:text-teal-400 font-semibold border-b-2 border-teal-700 dark:border-teal-400' : 'text-stone-500 dark:text-stone-400'}`}
        >
          <Compass className="w-3 h-3" />
          <span>Playground</span>
        </button>
        <button
          onClick={onOpenTutorial}
          className="whitespace-nowrap pb-1 text-stone-500 dark:text-stone-400 flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3" />
          <span>Tour</span>
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  Mail,
  Send,
  UserCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Users,
  Compass
} from 'lucide-react';
import { ApplicationCard, ApplicationStatus, DecodedJob } from '../types';

interface ApplicationCRMProps {
  applications: ApplicationCard[];
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onOpenOutreachModal: (app: ApplicationCard) => void;
  onOpenAutopsyModal: (app: ApplicationCard) => void;
  onOpenNetworkModal: (app: ApplicationCard) => void;
  onSelectApplication: (app: ApplicationCard) => void;
}

const COLUMNS: { status: ApplicationStatus; label: string; countColor: string }[] = [
  { status: 'saved', label: '1. Saved Roles', countColor: 'text-stone-500' },
  { status: 'decoded', label: '2. Decoded', countColor: 'text-amber-700' },
  { status: 'upskilling', label: '3. In Upskilling', countColor: 'text-indigo-700' },
  { status: 'applied', label: '4. Applied', countColor: 'text-blue-700' },
  { status: 'interviewing', label: '5. Interviewing', countColor: 'text-purple-700' },
  { status: 'offer', label: '6. Offer / Accepted', countColor: 'text-emerald-700' },
  { status: 'rejected', label: '7. Autopsy / Closed', countColor: 'text-stone-500' },
];

export const ApplicationCRM: React.FC<ApplicationCRMProps> = ({
  applications,
  onUpdateStatus,
  onOpenOutreachModal,
  onOpenAutopsyModal,
  onOpenNetworkModal,
  onSelectApplication,
}) => {
  const [selectedColumnFilter, setSelectedColumnFilter] = useState<string>('all');

  return (
    <div className="space-y-8">
      {/* CRM Header */}
      <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <span>Career Health &amp; Pipeline</span>
              <span aria-hidden="true">·</span>
              <span>{applications.length} Tracked Roles</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
              Application CRM &amp; Strategic Outreach
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed max-w-2xl">
              Track your roles through upskilling, outreach, and interviews. Generate tailored follow-up drafts based on decoded company tone or run a Rejection Autopsy to refine your roadmaps.
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px]">
          {COLUMNS.map((col) => {
            const colApps = applications.filter((a) => a.status === col.status);

            return (
              <div
                key={col.status}
                className="w-72 shrink-0 bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-3 flex flex-col max-h-[750px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                  <span className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    {col.label}
                  </span>
                  <span className={`font-mono text-xs font-bold ${col.countColor} dark:text-amber-400 tabular-nums`}>
                    {colApps.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-0.5">
                  {colApps.length === 0 ? (
                    <div className="text-center py-8 text-xs text-stone-400 dark:text-stone-600 italic">
                      No roles in this stage
                    </div>
                  ) : (
                    colApps.map((app) => (
                      <div
                        key={app.id}
                        className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 shadow-2xs hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-xs transition-all space-y-2.5 text-left group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="font-semibold text-stone-900 dark:text-stone-100 text-xs line-clamp-1">
                              {app.company}
                            </span>
                            <span className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-1">
                              {app.roleTitle}
                            </span>
                          </div>
                          {app.matchScore > 0 && (
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 tabular-nums shrink-0">
                              {app.matchScore}%
                            </span>
                          )}
                        </div>

                        {app.salaryRange && (
                          <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 tabular-nums">
                            {app.salaryRange}
                          </div>
                        )}

                        {app.targetSkillGap && (
                          <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 px-2 py-1 rounded border border-amber-200/50 dark:border-amber-900/50">
                            Focus: {app.targetSkillGap}
                          </div>
                        )}

                        {/* Tactical Actions */}
                        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-1 text-[11px]">
                          {col.status !== 'rejected' && (
                            <button
                              onClick={() => onOpenOutreachModal(app)}
                              className="px-2 py-1 rounded bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-1 transition-colors cursor-pointer"
                              title="Generate customized follow-up or pitch email"
                            >
                              <Mail className="w-3 h-3 text-stone-500 dark:text-stone-400" />
                              <span>Draft Email</span>
                            </button>
                          )}

                          <button
                            onClick={() => onOpenNetworkModal(app)}
                            className="px-2 py-1 rounded bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Network Nudge: people to connect with"
                          >
                            <Users className="w-3 h-3 text-stone-500 dark:text-stone-400" />
                            <span>Network</span>
                          </button>

                          {col.status === 'rejected' && (
                            <button
                              onClick={() => onOpenAutopsyModal(app)}
                              className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-200 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Run Autopsy</span>
                            </button>
                          )}
                        </div>

                        {/* Move Stage Selector */}
                        <div className="pt-1 flex items-center justify-between text-[10px] text-stone-400 dark:text-stone-500">
                          <span>Move to:</span>
                          <select
                            value={app.status}
                            onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                            className="bg-transparent text-stone-700 dark:text-stone-300 font-medium text-[11px] hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer focus:outline-none"
                          >
                            <option value="saved" className="dark:bg-stone-900">Saved</option>
                            <option value="decoded" className="dark:bg-stone-900">Decoded</option>
                            <option value="upskilling" className="dark:bg-stone-900">In Upskilling</option>
                            <option value="applied" className="dark:bg-stone-900">Applied</option>
                            <option value="interviewing" className="dark:bg-stone-900">Interviewing</option>
                            <option value="offer" className="dark:bg-stone-900">Offer</option>
                            <option value="rejected" className="dark:bg-stone-900">Autopsy / Closed</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

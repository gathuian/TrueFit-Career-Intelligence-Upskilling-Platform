import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Target,
  Play
} from 'lucide-react';
import { DecodedJob, InterviewQuestion, InterviewEvaluation } from '../types';

interface MockInterviewViewProps {
  decodedJob: DecodedJob | null;
  questions: InterviewQuestion[];
  isLoadingQuestions: boolean;
  onGenerateQuestions: (mode?: string) => Promise<void>;
  onEvaluateAnswer: (question: InterviewQuestion, answer: string) => Promise<InterviewEvaluation>;
  onNavigateToDecoder: () => void;
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({
  decodedJob,
  questions,
  isLoadingQuestions,
  onGenerateQuestions,
  onEvaluateAnswer,
  onNavigateToDecoder,
}) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Speech Synthesis & Recognition support
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        setSpeechSupported(true);
      }
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setRecognitionSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setUserAnswer((prev) => prev + ' ' + transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const currentQuestion = questions[selectedQuestionIndex];
  const company = decodedJob?.company || 'Target Company';

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    }
  };

  const speakQuestion = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || !userAnswer.trim() || isEvaluating) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    try {
      const result = await onEvaluateAnswer(currentQuestion, userAnswer);
      setEvaluation(result);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetForNext = (newIndex: number) => {
    setSelectedQuestionIndex(newIndex);
    setUserAnswer('');
    setEvaluation(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!decodedJob) {
    return (
      <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-600 dark:text-stone-400">
          <Target className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
          No Target Job Decoded
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          The Mock Interview Simulator tunes its questions directly to the unwritten rules and implicit needs of a specific JD. Please decode a role first.
        </p>
        <button
          onClick={onNavigateToDecoder}
          className="mt-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          Decode a Job First
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <span>Simulator</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-900 dark:text-stone-100 font-semibold">{company}</span>
              <span aria-hidden="true">·</span>
              <span>Tuned to Implicit JD Needs</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
              Mock Interview Simulator
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
              Standard interview prep asks generic questions. TrueFit simulates the exact hiring manager for {decodedJob.roleTitle} at {company}, testing your resilience, unwritten seniority cues, and stakeholder diplomacy.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onGenerateQuestions('implicit_needs')}
              disabled={isLoadingQuestions}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 disabled:bg-stone-300 dark:disabled:bg-stone-800 text-white text-xs font-medium transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isLoadingQuestions ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white dark:border-stone-400 dark:border-t-stone-950 rounded-full animate-spin" />
                  <span>Synthesizing Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
                  <span>Fresh Question Set</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Question Selector Tabs */}
        {questions.length > 0 && (
          <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id || idx}
                onClick={() => handleResetForNext(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedQuestionIndex === idx
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                Question 0{idx + 1}: {q.category.split(':')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Interactive Stage */}
      {currentQuestion ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Main: Question & Answer Area */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Question Card */}
            <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  {currentQuestion.category}
                </span>

                {speechSupported && (
                  <button
                    onClick={() => speakQuestion(currentQuestion.question)}
                    className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    title={isSpeaking ? 'Stop voice' : 'Listen to question'}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100 leading-snug">
                &ldquo;{currentQuestion.question}&rdquo;
              </h2>

              {/* Hiring Manager Intent Drawer */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  What the Hiring Manager is secretly listening for:
                </div>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {currentQuestion.hiringManagerIntent}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentQuestion.keyTraitsToDemonstrate.map((trait, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[11px]"
                    >
                      ✓ {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Answer Input Card */}
            <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Your Response (Speak or Type)
                </label>

                <div className="flex items-center gap-2">
                  {recognitionSupported && (
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isRecording
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 animate-pulse'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isRecording ? 'Listening... (Click to Stop)' : 'Voice Dictate'}</span>
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Answer as if speaking directly to the hiring manager. Frame your answer with context, technical trade-offs, and how you communicated with your team..."
                  className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 dark:focus:border-stone-600 font-sans leading-relaxed"
                />

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setUserAnswer('')}
                    className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
                  >
                    Clear answer
                  </button>

                  <button
                    type="submit"
                    disabled={isEvaluating || !userAnswer.trim()}
                    className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 disabled:bg-stone-300 dark:disabled:bg-stone-800 text-white text-xs font-medium transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white dark:border-stone-400 dark:border-t-stone-950 rounded-full animate-spin" />
                        <span>Evaluating Subtext &amp; Impact...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit for Instant Coaching</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right / Secondary: Instant Coaching & Evaluation Results */}
          <div className="lg:col-span-5 space-y-6">
            {evaluation ? (
              <div className="bg-white dark:bg-[#1C1A18] border-2 border-stone-900 dark:border-stone-700 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Response Impact Score
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-3xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                        {evaluation.score}
                      </span>
                      <span className="text-xs text-stone-400 dark:text-stone-500">/ 10</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    evaluation.score >= 8
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : evaluation.score >= 6
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                  }`}>
                    {evaluation.score >= 8 ? 'Compelling Pitch' : evaluation.score >= 6 ? 'Competent, Needs Polish' : 'Refinement Needed'}
                  </span>
                </div>

                {/* Subtle Impressions */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                    What the Hiring Manager subconscious heard:
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-100 dark:border-stone-800 leading-relaxed italic">
                    &ldquo;{evaluation.subtleImpressions}&rdquo;
                  </p>
                </div>

                {/* Strengths */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    What worked well:
                  </div>
                  <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-400">
                    {evaluation.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missed Opportunities */}
                {evaluation.missedOpportunities.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      Missed opportunities to elevate:
                    </div>
                    <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-400">
                      {evaluation.missedOpportunities.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500">·</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Refined Response Suggestion */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Refined Executive Script:
                  </div>
                  <p className="text-xs text-stone-800 dark:text-stone-200 bg-amber-50/60 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 leading-relaxed">
                    {evaluation.refinedResponseSuggestion}
                  </p>
                </div>

                {/* Next Question CTA */}
                {selectedQuestionIndex < questions.length - 1 && (
                  <button
                    onClick={() => handleResetForNext(selectedQuestionIndex + 1)}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Proceed to Question 0{selectedQuestionIndex + 2}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Real-Time Coach Waiting
                </div>
                <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100">
                  Instant Feedback Architecture
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  When you submit your answer, TrueFit evaluates your response across:
                </p>
                <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-stone-400">01</span>
                    <span>Subtext &amp; Executive Presence (Does this sound like someone ready for this level?)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-stone-400">02</span>
                    <span>Avoidance of Red-Flag Pitfalls (e.g. {currentQuestion.pitfallToAvoid})</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-stone-400">03</span>
                    <span>Grounded proof points linking to your completed 4-hour projects</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Click above to synthesize interview questions tuned to {company}&apos;s implicit needs.
          </p>
        </div>
      )}
    </div>
  );
};

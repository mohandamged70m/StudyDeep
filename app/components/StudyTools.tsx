"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Notebook } from '../data/subjects';
import { BookOpen, Award, Check, X, RotateCcw, ChevronLeft, ChevronRight, Sparkles, Clock } from 'lucide-react';
import { useToast } from './ToastProvider';

interface StudyToolsProps {
  notebook: Notebook;
  isVip: boolean;
  onOpenUpgrade: () => void;
}

export default function StudyTools({ notebook, isVip, onOpenUpgrade }: StudyToolsProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'flashcards' | 'exams'>('guide');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const { showToast } = useToast();

  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [checkedQuestions, setCheckedQuestions] = useState<string[]>([]);
  const [examScore, setExamScore] = useState<number | null>(null);

  // Timer state
  const EXAM_DURATION = 300;
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeExam = notebook.exams[0] || null;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setTimeLeft(EXAM_DURATION);
    setTimerActive(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimerActive(false);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (!activeExam) return;
    // Auto-check all unanswered questions as wrong
    activeExam.questions.forEach(q => {
      if (!checkedQuestions.includes(q.id)) {
        setCheckedQuestions(prev => [...prev, q.id]);
      }
    });
    setTimeout(() => getScore(), 100);
    showToast('انتهى الوقت! تم تصحيح الإجابات تلقائياً.', 'error');
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);
    setTimeLeft(EXAM_DURATION);
  };

  useEffect(() => {
    if (activeTab === 'exams') {
      resetExam();
    }
  }, [activeTab]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = activeExam?.questions.length || 0;
  const progressPct = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const handleNextCard = () => {
    if (isTransitioning) return;
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev + 1) % notebook.flashcards.length);
  };

  const handlePrevCard = () => {
    if (isTransitioning) return;
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev - 1 + notebook.flashcards.length) % notebook.flashcards.length);
  };

  const handleAnswerSelect = (qId: string, option: string) => {
    if (checkedQuestions.includes(qId)) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
    // Auto-check immediately
    setCheckedQuestions(prev => [...prev, qId]);
    if (!timerActive) startTimer();
  };

  const resetExam = () => {
    setSelectedAnswers({});
    setCheckedQuestions([]);
    setExamScore(null);
    resetTimer();
  };

  const getScore = () => {
    if (!activeExam) return;
    let score = 0;
    activeExam.questions.forEach((q) => {
      const correctVal = lang === 'ar' ? q.correctAnswerAr : q.correctAnswer;
      if (selectedAnswers[q.id] === correctVal) {
        score++;
      }
    });
    setExamScore(score);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);
    showToast(`النتيجة: ${score} / ${totalQuestions}`, score === totalQuestions ? 'success' : 'info');
  };

  const goToQuestion = (qIdx: number) => {
    const el = document.getElementById(`exam-q-${qIdx}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-[0_0_0_1px_rgba(245,158,11,0.03)]">
      <div className="border-b border-zinc-800/80 bg-zinc-900/45 px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1 text-xs font-semibold font-arabic overflow-x-auto">
            <button
              onClick={() => setActiveTab('guide')}
              className={`shrink-0 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-zinc-400 border border-zinc-800 bg-zinc-900 hover:text-white'
              }`}
            >
              دليل المذاكرة
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`shrink-0 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-zinc-400 border border-zinc-800 bg-zinc-900 hover:text-white'
              }`}
            >
              الكروت الذكية ({notebook.flashcards.length})
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`shrink-0 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === 'exams'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-zinc-400 border border-zinc-800 bg-zinc-900 hover:text-white'
              }`}
            >
              الامتحانات ({notebook.exams.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-500 font-arabic">
              <Sparkles className="h-3 w-3 text-amber-500" />
              {notebook.titleAr}
            </div>
            <div className="flex rounded-md border border-zinc-700 bg-zinc-950 p-0.5 text-[9px] font-semibold text-zinc-400 font-arabic">
              <button
                onClick={() => setLang('ar')}
                className={`rounded px-2 py-0.5 transition-all cursor-pointer ${lang === 'ar' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'}`}
              >
                عربي
              </button>
              <button
                onClick={() => setLang('en')}
                className={`rounded px-2 py-0.5 transition-all cursor-pointer ${lang === 'en' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.04),transparent_55%)]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {!isVip && activeTab !== 'guide' && (
          <div className="flex h-full flex-col items-center justify-center space-y-4 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white font-arabic">ميزة الكروت والامتحانات مغلقة 🔒</h3>
            <p className="max-w-xs text-xs text-zinc-400 font-arabic">
              أدوات الاختبار والمراجعة السريعة متاحة فقط في باقة الدحيح لتجربة تعلم أعمق.
            </p>
            <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-right">
              <div className="text-[11px] text-zinc-400 font-arabic">سعر الاشتراك الرمزي:</div>
              <div className="text-lg font-bold text-amber-500 font-arabic">49 جنيه مصري فقط للترم</div>
              <div className="mt-1 text-[10px] text-zinc-500 font-arabic">الدفع: فودافون كاش، انستاباي، فوري.</div>
            </div>
            <button
              onClick={onOpenUpgrade}
              className="rounded-lg bg-amber-500 px-6 py-2.5 text-xs font-semibold text-black transition-all hover:bg-amber-600 cursor-pointer font-arabic"
            >
              اشترك الآن وافتح الأدوات الدراسية
            </button>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/45 p-4 text-xs leading-relaxed">
            <div className="mb-2 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <BookOpen className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-extrabold text-white font-arabic">
                {lang === 'ar' ? 'دليل المذاكرة المولد ذكياً' : 'AI-Generated Course Syllabus'}
              </h2>
            </div>
            <div className="text-zinc-300 font-arabic prose prose-invert prose-xs max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({ children }) => <h1 className="text-base font-extrabold text-white mt-4 mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-extrabold text-white mt-3 mb-1.5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xs font-bold text-amber-400 mt-3 mb-1">{children}</h3>,
                  p: ({ children }) => <p className="mb-2 leading-relaxed text-zinc-300">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="text-zinc-300">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                  code: ({ children, className }) => {
                    if (!className) return <code className="bg-zinc-800 text-amber-300 px-1 py-0.5 rounded text-[11px]">{children}</code>;
                    return (
                      <pre className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 my-2 overflow-x-auto text-[11px] font-mono">
                        <code className={className}>{children}</code>
                      </pre>
                    );
                  },
                }}
              >
                {lang === 'ar' ? notebook.studyGuideAr : notebook.studyGuide}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {isVip && activeTab === 'flashcards' && notebook.flashcards.length > 0 && (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center space-y-6">
            <div
              onClick={() => !isTransitioning && setIsFlipped(!isFlipped)}
              className="relative flex h-52 w-full max-w-sm cursor-pointer select-none flex-col items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-center shadow-xl"
              style={{ perspective: '1000px' }}
            >
              <div
                className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between transition-transform duration-500"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-arabic">
                  {lang === 'ar' ? 'المصطلح' : 'Term'}
                </div>
                <div className="text-base font-extrabold text-white font-arabic">
                  {lang === 'ar' ? notebook.flashcards[currentCardIdx].termAr : notebook.flashcards[currentCardIdx].term}
                </div>
                <div className="text-[9px] text-zinc-500 font-arabic">اضغط للقلب لمعرفة المعنى</div>
              </div>
              <div
                className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between transition-transform duration-500"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-arabic">
                  {lang === 'ar' ? 'التعريف والشرح' : 'Definition'}
                </div>
                <div className="text-xs font-semibold leading-relaxed text-zinc-100 font-arabic">
                  {lang === 'ar' ? notebook.flashcards[currentCardIdx].definitionAr : notebook.flashcards[currentCardIdx].definition}
                </div>
                <div className="text-[9px] text-amber-500 font-arabic">اضغط للقلب</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={handlePrevCard}
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white cursor-pointer"
              >
                <ChevronRight className={`h-4 w-4 ${lang === 'en' ? 'rotate-180' : ''}`} />
              </button>
              <span className="font-mono text-xs text-zinc-500">
                {currentCardIdx + 1} / {notebook.flashcards.length}
              </span>
              <button
                onClick={handleNextCard}
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white cursor-pointer"
              >
                <ChevronLeft className={`h-4 w-4 ${lang === 'en' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {isVip && activeTab === 'exams' && activeExam && (
          <div className="space-y-4">
            {/* Timer + Progress Header */}
            <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-sm -mx-4 px-4 pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white font-arabic">{lang === 'ar' ? activeExam.titleAr : activeExam.title}</h3>
                  <p className="text-[10px] text-zinc-500 font-arabic">
                    {lang === 'ar' ? 'اختر الإجابة الصحيحة — التصحيح تلقائي' : 'Select the correct answer — auto-graded'}
                  </p>
                </div>
                <button
                  onClick={resetExam}
                  className="flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white cursor-pointer font-arabic"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{lang === 'ar' ? 'إعادة البدء' : 'Reset'}</span>
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
                <span className="text-zinc-400 font-mono shrink-0">
                  {answeredCount}/{totalQuestions}
                </span>
                {timerActive && (
                  <span className={`flex items-center gap-1 font-mono shrink-0 ${timeLeft < 30 ? 'text-rose-500' : timeLeft < 60 ? 'text-amber-500' : 'text-zinc-400'}`}>
                    <Clock className="w-3 h-3" />
                    {formatTime(timeLeft)}
                  </span>
                )}
              </div>

              {/* Question navigation dots */}
              {totalQuestions > 1 && (
                <div className="flex gap-1.5 mt-2 justify-center">
                  {activeExam.questions.map((q, qIdx) => {
                    const isAns = selectedAnswers[q.id] !== undefined;
                    const isCorrect = selectedAnswers[q.id] === (lang === 'ar' ? q.correctAnswerAr : q.correctAnswer);
                    let dotColor = 'bg-zinc-800';
                    if (checkedQuestions.includes(q.id)) {
                      dotColor = isCorrect ? 'bg-emerald-500' : 'bg-rose-500';
                    } else if (isAns) {
                      dotColor = 'bg-amber-500';
                    }
                    return (
                      <button
                        key={q.id}
                        onClick={() => goToQuestion(qIdx)}
                        className={`w-4 h-4 rounded-full text-[7px] font-bold text-black transition-all ${dotColor} hover:scale-125`}
                        title={`سؤال ${qIdx + 1}`}
                      >
                        {checkedQuestions.includes(q.id) ? (isCorrect ? '✓' : '✗') : (qIdx + 1)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {activeExam.questions.map((q, qIdx) => {
                const optionsList = lang === 'ar' ? q.optionsAr : q.options;
                const correctAns = lang === 'ar' ? q.correctAnswerAr : q.correctAnswer;
                const selectedAns = selectedAnswers[q.id];
                const isChecked = checkedQuestions.includes(q.id);
                const isCorrect = selectedAns === correctAns;

                return (
                  <div key={q.id} id={`exam-q-${qIdx}`} className={`space-y-3 rounded-xl border p-4 transition-all ${isChecked ? (isCorrect ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-rose-500/30 bg-rose-500/[0.02]') : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <div className="flex items-start gap-3">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px] font-mono ${isChecked ? (isCorrect ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-rose-500 bg-rose-500/20 text-rose-500') : 'border-zinc-700 bg-zinc-800 text-zinc-400'}`}>
                        {isChecked ? (isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />) : (qIdx + 1)}
                      </span>
                      <h4 className="mt-0.5 text-xs font-bold text-zinc-200 font-arabic">{lang === 'ar' ? q.questionAr : q.question}</h4>
                    </div>

                    {optionsList && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                        {optionsList.map((option) => {
                          const isOptionSelected = selectedAns === option;
                          let btnStyle = 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-600';

                          if (isOptionSelected) {
                            if (isChecked) {
                              btnStyle = isCorrect ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' : 'border-rose-500 bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30';
                            } else {
                              btnStyle = 'border-amber-500 bg-amber-500/10 text-amber-400';
                            }
                          } else if (isChecked && option === correctAns) {
                            btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                          }

                          return (
                            <button
                              key={option}
                              onClick={() => handleAnswerSelect(q.id, option)}
                              disabled={isChecked}
                              className={`rounded-lg border px-3 py-2.5 text-right text-xs transition-all cursor-pointer font-arabic ${btnStyle}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {isChecked && (
                      <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-[11px] leading-relaxed text-zinc-400 font-arabic">
                        <strong className="mb-1 block font-bold text-amber-500">
                          {lang === 'ar' ? 'الشرح والحل النموذجي:' : 'Detailed Explanation:'}
                        </strong>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {lang === 'ar' ? q.explanationAr : q.explanation}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-zinc-800 pt-4 text-center">
              {examScore === null ? (
                <button
                  onClick={getScore}
                  disabled={checkedQuestions.length !== totalQuestions}
                  className="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2 text-xs font-bold text-white transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer font-arabic"
                >
                  {lang === 'ar' ? 'اعرض نتيجتي النهائية' : 'Show Score'}
                </button>
              ) : (
                <div className="mx-auto max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="text-[10px] font-semibold uppercase text-zinc-500 font-arabic">
                    {lang === 'ar' ? 'الدرجة النهائية للترم' : 'Exam Score'}
                  </div>
                  <div className="my-1 font-mono text-4xl font-extrabold text-emerald-500">
                    {examScore} / {totalQuestions}
                  </div>
                  <p className="text-xs text-zinc-400 font-arabic">
                    {examScore === totalQuestions ? 'دحيح رسمي! تقييم ممتاز مبروك 🥳' : 'بداية كويسة! راجع النقط الصعبة واستعد للامتحان الحقيقي.'}
                  </p>
                  {timerActive === false && examScore !== totalQuestions && (
                    <button
                      onClick={resetExam}
                      className="mt-3 text-[10px] text-amber-500 hover:text-amber-400 underline underline-offset-2 font-arabic"
                    >
                      حاول مرة تانية
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

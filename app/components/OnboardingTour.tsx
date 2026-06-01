"use client";

import React, { useState } from 'react';
import { Sparkles, Upload, MessageSquare, BookOpen, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const STEPS = [
  {
    icon: Sparkles,
    title: 'أهلاً بك في كشكول LM!',
    description: 'مساعدك الدراسي الذكي اللي بيشرحلك بالعامية المصرية. ارفع محاضراتك، اسأل أسئلتك، واختبر نفسك — كل حاجة في مكان واحد.',
    target: 'center',
  },
  {
    icon: Upload,
    title: 'المصادر الدراسية',
    description: 'من هنا بتضيف محاضراتك (PDF، فيديوهات يوتيوب، أو ملاحظات مكتوبة). اختار المصادر اللي عايز الذكاء الاصطناعي يقرأها عشان يجاوبك بناءً عليها.',
    target: 'sources',
  },
  {
    icon: MessageSquare,
    title: 'الدردشة الذكية',
    description: 'اسأل أي سؤال بالعامية أو الفصحى أو الإنجليزية. الذكاء الاصطناعي بيشرحلك المفاهيم المعقدة بأسلوب بسيط زي ما صاحبك بيشرحلك.',
    target: 'chat',
  },
  {
    icon: BookOpen,
    title: 'أدوات الدراسة المتقدمة',
    description: 'كروت الفلاش كارد للمراجعة السريعة، امتحانات تجريبية، و بودكاست الدحيح الصوتي — كل ده عشان تذاكر بذكاء مش بجهد.',
    target: 'tools',
  },
];

interface OnboardingTourProps {
  notebookTitle?: string;
}

export default function OnboardingTour({ notebookTitle }: OnboardingTourProps) {
  const [hasSeenTour, setHasSeenTour] = useLocalStorage('onboardingSeen', false);
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(!hasSeenTour);

  if (!isOpen) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setIsOpen(false);
      setHasSeenTour(true);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    setHasSeenTour(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          ></div>
        </div>

        <button
          onClick={handleSkip}
          className="absolute top-4 left-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center" dir="rtl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
            <Icon className="w-7 h-7" />
          </div>

          <h2 className="text-lg font-extrabold text-white font-arabic mb-2">
            {current.title}
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-arabic">
            {current.description}
          </p>

          {step === 0 && notebookTitle && (
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-400 font-arabic">
              <Sparkles className="w-3 h-3" />
              {notebookTitle}
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 mt-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-amber-500' : 'w-1.5 bg-zinc-700'
                }`}
              ></div>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-800 px-6 py-3 flex items-center justify-between bg-zinc-900/50">
          <button
            onClick={handleSkip}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors font-arabic"
          >
            تخطي
          </button>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all font-arabic"
          >
            <span>{isLast ? 'ابدأ المذاكرة!' : 'التالي'}</span>
            {!isLast && <ArrowLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

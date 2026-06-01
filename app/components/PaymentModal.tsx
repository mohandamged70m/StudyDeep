"use client";

import React, { useState } from 'react';
import { X, Check, CreditCard, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'semester' | 'year'>('semester');
  const [paymentMethod, setPaymentMethod] = useState<'vodafone' | 'instapay' | 'fawry' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instaAddress, setInstaAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'plans' | 'method' | 'success'>('plans');
  const [fawryCode] = useState(() => Math.floor(10000000 + Math.random() * 90000000).toString());

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setStep('method');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate transaction
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 2500);
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
    // Reset modal
    setStep('plans');
    setPaymentMethod(null);
    setPhoneNumber('');
    setInstaAddress('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'plans' && (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-semibold uppercase tracking-wider">
                باقات الطلاب - وفر وذاكر صح
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-arabic">
                اشترك في باقة الدحيح
              </h2>
              <p className="text-sm text-zinc-400 mt-1 max-w-md mx-auto">
                افتح كل المواد والمحاضرات، اسمع بودكاست الشرح بالبلدي، وحل امتحانات السنين السابقة بدون حدود وبسعر أرخص من تمن كشكول واحد!
              </p>
            </div>

            {/* Plans Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Semester Plan */}
              <div 
                onClick={() => setSelectedPlan('semester')}
                className={`cursor-pointer p-5 rounded-xl border-2 transition-all relative ${
                  selectedPlan === 'semester' 
                    ? 'border-amber-500 bg-amber-500/5' 
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                {selectedPlan === 'semester' && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-black rounded-full p-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                )}
                <div className="text-xs font-semibold text-amber-500 mb-1">اشتراك الترم الكامل</div>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-3xl font-bold">49</span>
                  <span className="text-sm font-semibold">جنيه / الترم</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">
                  أرخص من حصة كورس واحدة. يغطي 4 شهور دراسة كاملة.
                </p>
              </div>

              {/* Full Year Plan */}
              <div 
                onClick={() => setSelectedPlan('year')}
                className={`cursor-pointer p-5 rounded-xl border-2 transition-all relative ${
                  selectedPlan === 'year' 
                    ? 'border-amber-500 bg-amber-500/5' 
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                {selectedPlan === 'year' && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-black rounded-full p-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                )}
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  الأكثر توفيراً
                </div>
                <div className="text-xs font-semibold text-amber-500 mb-1">اشتراك السنة كاملة</div>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-3xl font-bold">79</span>
                  <span className="text-sm font-semibold">جنيه / السنة</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">
                  وفر 20% وبشمل الترمين الصيفي والأساسي.
                </p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-6 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-xs text-zinc-300">مساحة غير محدودة لرفع ملفات المحاضرات والـ PDF وصور الملازم</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-xs text-zinc-300">شرح فوري بالعامية المصرية (كأن زميلك الدحيح بيشرحلك المنهج)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-xs text-zinc-300">توليد امتحانات كاملة بنظام امتحانات جامعتك (MCQ ومقالي بـ إجابات نموذجية)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-xs text-zinc-300">تشغيل بودكاست الدحيح الصوتي لشرح المنهج بالبلدي (توفير للباقة)</span>
              </div>
            </div>

            <button 
              onClick={handleSubscribe}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold py-3 px-6 rounded-xl transition-all font-arabic text-center cursor-pointer shadow-lg shadow-amber-500/10"
            >
              اختر طريقة الدفع المحلية المناسبة لك
            </button>
          </div>
        )}

        {step === 'method' && (
          <div className="p-6 sm:p-8" dir="rtl">
            <button 
              onClick={() => setStep('plans')}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white mb-6 text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>العودة للباقات</span>
            </button>

            <h3 className="text-xl font-bold text-white mb-4 font-arabic">
              اختر طريقة الدفع المناسبة في مصر:
            </h3>

            {/* Local Methods selector */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button 
                onClick={() => setPaymentMethod('vodafone')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'vodafone' 
                    ? 'border-red-500 bg-red-500/5 text-red-500' 
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Smartphone className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold font-arabic">فودافون كاش</span>
              </button>

              <button 
                onClick={() => setPaymentMethod('instapay')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'instapay' 
                    ? 'border-teal-500 bg-teal-500/5 text-teal-500' 
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <CreditCard className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold font-arabic">انستاباي</span>
              </button>

              <button 
                onClick={() => setPaymentMethod('fawry')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'fawry' 
                    ? 'border-amber-500 bg-amber-500/5 text-amber-500' 
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span className="text-lg font-black mb-2 font-mono">Fawry</span>
                <span className="text-xs font-semibold font-arabic">فوري</span>
              </button>
            </div>

            {/* Render Payment form based on selection */}
            {paymentMethod === 'vodafone' && (
              <form onSubmit={handleProcessPayment} className="space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800 animate-fade-in">
                <div className="text-sm text-zinc-300">
                  سيتم خصم <strong className="text-red-500">{selectedPlan === 'semester' ? '49' : '79'} جنيه</strong> من محفظتك.
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">أدخل رقم المحفظة (فودافون، اتصالات، أورنج كاش)</label>
                  <input 
                    type="tel" 
                    placeholder="01xxxxxxxxx"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    pattern="01[0125][0-9]{8}"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 text-left font-mono"
                  />
                </div>
                <button 
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : "ادفع الآن عبر المحفظة"}
                </button>
              </form>
            )}

            {paymentMethod === 'instapay' && (
              <form onSubmit={handleProcessPayment} className="space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800 animate-fade-in">
                <div className="text-sm text-zinc-300">
                  قم بتحويل مبلغ <strong className="text-teal-400">{selectedPlan === 'semester' ? '49' : '79'} جنيه</strong> إلى العنوان التالي في انستاباي:
                </div>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-center font-mono font-bold text-white text-base select-all cursor-pointer hover:border-teal-500/50 transition-colors">
                  kashkool@instapay
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">أدخل عنوان انستاباي الخاص بك للتأكيد (IPN Address)</label>
                  <input 
                    type="text" 
                    placeholder="username@instapay"
                    required
                    value={instaAddress}
                    onChange={(e) => setInstaAddress(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-left font-mono"
                  />
                </div>
                <button 
                  disabled={isProcessing}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : "تأكيد عملية التحويل"}
                </button>
              </form>
            )}

            {paymentMethod === 'fawry' && (
              <div className="space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800 animate-fade-in text-center">
                <div className="text-sm text-zinc-300 text-right">
                  توجه لأقرب كشك فوري واستخدم كود الدفع التالي للدفع المباشر:
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg border-2 border-dashed border-amber-500 text-center">
                  <div className="text-xs text-zinc-500 uppercase">كود دفع فوري</div>
                  <div className="text-3xl font-bold font-mono tracking-widest text-amber-500 my-1">{fawryCode}</div>
                  <div className="text-xs text-zinc-400">صالح لمدة 24 ساعة</div>
                </div>
                <div className="text-xs text-zinc-400 text-right">
                  المبلغ المطلوب: <strong>{selectedPlan === 'semester' ? '49' : '79'} جنيه</strong>
                </div>
                <button 
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2.5 px-4 rounded-lg text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : "لقد قمت بالدفع بالفعل"}
                </button>
              </div>
            )}

            {!paymentMethod && (
              <div className="text-center py-6 text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
                برجاء اختيار وسيلة دفع بالضغط عليها في الأعلى
              </div>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center" dir="rtl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2 font-arabic">
              تم التفعيل بنجاح! 🎉
            </h3>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-6">
              مبروك! تم تفعيل اشتراك باقة الدحيح لحسابك. جميع المميزات مفتوحة الآن بالكامل طوال فترة الاشتراك. بالتوفيق في دراستك!
            </p>
            <button 
              onClick={handleFinish}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-all cursor-pointer"
            >
              ابدأ المذاكرة الآن
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

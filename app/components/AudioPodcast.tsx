"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PodcastEpisode } from '../data/subjects';
import { Play, Pause, Download, Volume2, Award, CheckCircle, RefreshCw, SkipBack } from 'lucide-react';

interface AudioPodcastProps {
  podcast: PodcastEpisode[];
  isVip: boolean;
  onOpenUpgrade: () => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export default function AudioPodcast({ podcast, isVip, onOpenUpgrade }: AudioPodcastProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration] = useState(165);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showScriptOnly, setShowScriptOnly] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const seekTo = useCallback((clientX: number) => {
    const bar = progressBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newTime = Math.floor((pct / 100) * duration);
    setCurrentTime(newTime);
    setProgress(pct);
    const lineIndex = Math.min(Math.floor((newTime / duration) * podcast.length), podcast.length - 1);
    setActiveIndex(newTime > 0 ? lineIndex : -1);
  }, [duration, podcast.length]);

  const handleBarClick = useCallback((e: React.MouseEvent) => {
    if (!isVip) { onOpenUpgrade(); return; }
    seekTo(e.clientX);
  }, [isVip, seekTo, onOpenUpgrade]);

  const handleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isVip) return;
    setIsDragging(true);
    seekTo(e.clientX);
  }, [isVip, seekTo]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => seekTo(e.clientX);
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, seekTo]);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1000 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            stopTimer();
            setIsPlaying(false);
            setProgress(100);
            setActiveIndex(-1);
            return 0;
          }
          const nextTime = prev + 1;
          setProgress((nextTime / duration) * 100);
          const lineIndex = Math.min(Math.floor((nextTime / duration) * podcast.length), podcast.length - 1);
          setActiveIndex(lineIndex);
          return nextTime;
        });
      }, intervalMs);
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [isPlaying, duration, podcast.length, playbackSpeed, stopTimer]);

  const handlePlayPause = () => {
    if (!isVip) { onOpenUpgrade(); return; }
    if (currentTime >= duration) {
      setCurrentTime(0);
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleGenerate = () => {
    if (!isVip) { onOpenUpgrade(); return; }
    setIsGenerating(true);
    setIsPlaying(false);
    stopTimer();
    setProgress(0);
    setCurrentTime(0);
    setActiveIndex(-1);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 4000);
  };

  const handleRestart = () => {
    stopTimer();
    setCurrentTime(0);
    setProgress(0);
    setActiveIndex(-1);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeWaveIndex = Math.floor((progress / 100) * waveHeights.length);

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <div>
          <h2 className="text-sm font-bold text-white font-arabic">بودكاست الدحيح 🎙️</h2>
          <p className="text-[10px] text-zinc-400 font-arabic">شرح صوتي ممتع ومبسط بالعامية المصرية لجميع ملفاتك</p>
        </div>

        {isVip && isGenerated && (
          <button
            onClick={() => setShowScriptOnly(!showScriptOnly)}
            className="text-[10px] font-semibold text-amber-500 border border-amber-500/20 px-2 py-1 rounded bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer font-arabic shrink-0"
          >
            {showScriptOnly ? 'عرض تشغيل الصوت' : 'توفير الباقة'}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between" dir="rtl">
        {!isVip && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 px-4 space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-arabic">بودكاست الدحيح الصوتي مقفل 🔒</h3>
            <p className="text-xs text-zinc-400 max-w-xs font-arabic">
              الذكاء الاصطناعي بيحول محاضراتك المكتوبة لـ بودكاست حواري مضحك وبسيط بالعامية المصرية عشان تسمعه وانت في المواصلات.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-right w-full max-w-sm">
              <div className="text-[11px] text-zinc-400 font-arabic">مميزات اشتراك الدحيح:</div>
              <div className="text-xs text-zinc-300 mt-1 flex items-center gap-1.5 font-arabic">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>تحويل أي ملف مرفوع أو لينك يوتيوب لبودكاست صوتي فوراً</span>
              </div>
              <div className="text-xs text-zinc-300 mt-1 flex items-center gap-1.5 font-arabic">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>لهجة مصرية عامية ممتازة مع فكاهة الطلبة (الدحيح والمحاور)</span>
              </div>
            </div>
            <button
              onClick={onOpenUpgrade}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs py-2.5 px-6 rounded-lg transition-all cursor-pointer font-arabic"
            >
              اشترك بـ 49ج للترم لفتح البودكاست
            </button>
          </div>
        )}

        {isVip && !isGenerated && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Volume2 className="w-10 h-10 text-zinc-600 mb-3 animate-pulse" />
            <h3 className="text-xs font-bold text-zinc-300 font-arabic">لم يتم إنشاء بودكاست لهذا الكشكول بعد</h3>
            <p className="text-[10px] text-zinc-500 max-w-xs mt-1 font-arabic">
              قم بإنشاء حلقة شرح صوتي بالعامية لتلخيص المصادر المرفوعة الآن.
            </p>
            <button
              onClick={handleGenerate}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs py-2 px-4 rounded-lg cursor-pointer transition-all font-arabic"
            >
              توليد حلقة الدحيح بالعامية
            </button>
          </div>
        )}

        {isVip && isGenerating && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-3" />
            <h3 className="text-xs font-bold text-white font-arabic">جاري توليد الاسكربت الصوتي وتسجيل المحاكاة</h3>
            <p className="text-[10px] text-zinc-500 max-w-xs mt-1 font-arabic">
              بيفكر كأن أحمد وسارة بيذاكروا سوا ليلة الامتحان... بتاخد حوالي 5 ثواني
            </p>
          </div>
        )}

        {isVip && isGenerated && !isGenerating && (
          <div className="flex flex-col h-full justify-between gap-4">

            {!showScriptOnly && (
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 flex flex-col items-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider font-arabic mb-1">
                  الحلقة الأولى: ملخص تفاعلي بالبلدي
                </div>
                <div className="text-xs text-zinc-400 font-arabic text-center mb-4">
                  المدة الكلية: {formatTime(duration)} • السرعة: {playbackSpeed}x
                </div>

                {/* Reactive Waveform */}
                <div className="flex items-end gap-[3px] h-20 w-full max-w-xs justify-center mb-4 select-none">
                  {waveHeights.map((h, i) => {
                    const isPlayed = i <= activeWaveIndex;
                    const isCurrent = i === activeWaveIndex || (i === activeWaveIndex + 1 && isPlaying);
                    let barColor = 'bg-zinc-800';
                    let barHeight = 4;

                    if (isDragging) {
                      barColor = 'bg-zinc-700';
                      barHeight = h * 0.5;
                    } else if (isPlaying && isCurrent) {
                      barColor = 'bg-amber-400';
                      barHeight = Math.min(100, h * 1.4);
                    } else if (isPlayed && isPlaying) {
                      barColor = 'bg-amber-500/70';
                      barHeight = h;
                    } else if (isPlaying) {
                      barColor = 'bg-zinc-600';
                      barHeight = h * 0.6;
                    } else if (progress > 0) {
                      barColor = isPlayed ? 'bg-amber-500/50' : 'bg-zinc-700';
                      barHeight = isPlayed ? h * 0.8 : 4;
                    }

                    return (
                      <div
                        key={i}
                        className={`w-[5px] rounded-full transition-all duration-200 ${barColor} ${isCurrent && isPlaying ? 'animate-pulse' : ''}`}
                        style={{ height: `${barHeight}%` }}
                      ></div>
                    );
                  })}
                </div>

                {/* Draggable Progress Bar */}
                <div
                  ref={progressBarRef}
                  className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden relative cursor-pointer group"
                  onMouseDown={handleBarMouseDown}
                  onClick={handleBarClick}
                >
                  <div
                    className="absolute top-0 right-0 h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-100 group-hover:h-2.5"
                    style={{ width: `${progress}%` }}
                  ></div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ right: `${progress}%`, marginRight: '-6px' }}
                  ></div>
                </div>

                {/* Time display */}
                <div className="w-full flex items-center justify-between mt-2">
                  <span className="text-[10px] text-zinc-500 font-mono">{formatTime(currentTime)}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={handleRestart}
                    className="p-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="إعادة التشغيل"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePlayPause}
                    className="w-12 h-12 bg-amber-500 hover:bg-amber-600 text-black rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-amber-500/10 hover:scale-105"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 font-bold" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <div className="flex items-center gap-1">
                    {SPEED_OPTIONS.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`text-[9px] font-bold px-1.5 py-1 rounded transition-all cursor-pointer ${
                          playbackSpeed === speed
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                            : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const blob = new Blob([podcast.map(l => `${l.characterNameAr}: ${l.textAr}`).join('\n\n')], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'podcast-script.txt';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="تحميل الاسكربت"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Transcript */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px]">
              <div className="text-[10px] text-zinc-500 font-semibold mb-2 pb-1 border-b border-zinc-900 font-arabic">
                {showScriptOnly ? 'اسكربت الحلقة الكامل لتوفير باقة الإنترنت 📶' : 'اسكربت الحلقة الحواري (يتحرك مع الصوت):'}
              </div>

              {podcast.map((line, idx) => {
                const isLineActive = activeIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all ${
                      isLineActive
                        ? 'border-amber-500/40 bg-amber-500/5 shadow-[0_0_0_1px_rgba(245,158,11,0.08)]'
                        : 'border-zinc-900 bg-zinc-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={line.avatar}
                        alt={line.characterName}
                        className="w-5 h-5 rounded-full border border-zinc-850 object-cover"
                      />
                      <span className="text-[10px] font-bold text-zinc-300 font-arabic">
                        {line.characterNameAr}
                      </span>
                      <span className="text-[8px] text-zinc-500 font-mono mr-auto">
                        {line.audioTime}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed font-arabic ${isLineActive ? 'text-zinc-200' : 'text-zinc-400'}`}>
                      {line.textAr}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const waveHeights = [
  25, 45, 15, 60, 35, 75, 40, 50, 20, 80, 55, 30, 70, 45, 90, 65, 35, 50, 15, 60, 30, 45, 25, 70,
  15, 40, 60, 25, 75, 35, 80, 50, 20, 65, 55, 30, 70, 45, 85, 60, 35, 50, 15, 60, 30, 45, 25, 70,
  20, 55, 35, 75, 40, 65, 25, 80, 45, 30, 70, 50, 15, 60, 35, 85, 40, 55, 20, 70, 45, 30, 65, 50,
];

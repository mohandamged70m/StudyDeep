"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_NOTEBOOKS, Notebook, Source } from '../data/subjects';
import SourceManager from '../components/SourceManager';
import AIChat from '../components/AIChat';
import StudyTools from '../components/StudyTools';
import AudioPodcast from '../components/AudioPodcast';
import PaymentModal from '../components/PaymentModal';
import OnboardingTour from '../components/OnboardingTour';
import { ToastProvider } from '../components/ToastProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import { SourceSkeleton, ChatSkeleton, StudyToolsSkeleton, PodcastSkeleton } from '../components/SkeletonLoader';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Award, Share2, Menu, X, Sparkles, PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen, Sun, Moon } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Workspace() {
  const [storedNotebookId, setStoredNotebookId] = useLocalStorage<string>('activeNotebookId', MOCK_NOTEBOOKS[0].id);
  const [isVip, setIsVip] = useLocalStorage('isVip', false);
  const [isDataSaver, setIsDataSaver] = useLocalStorage('isDataSaver', false);
  const [storedSourceIds, setStoredSourceIds] = useLocalStorage<string[]>('selectedSourceIds', []);
  const [theme, setTheme] = useLocalStorage<'dark' | 'desert'>('theme', 'dark');

  const findNotebook = useCallback((id: string) => {
    return MOCK_NOTEBOOKS.find(nb => nb.id === id) || MOCK_NOTEBOOKS[0];
  }, []);

  const [activeNotebook, setActiveNotebook] = useState<Notebook>(() => findNotebook(storedNotebookId));
  const [activeSources, setActiveSources] = useState<Source[]>(() => {
    const nb = findNotebook(storedNotebookId);
    return nb.sources;
  });
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(() => {
    if (storedSourceIds.length > 0) return storedSourceIds;
    const nb = findNotebook(storedNotebookId);
    return nb.sources.map(s => s.id);
  });
  const [isLoading, setIsLoading] = useState(true);

  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sourcePanelOpen, setSourcePanelOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'desert' ? 'desert' : '');
  }, [theme]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setActiveSources(activeNotebook.sources);
    if (storedSourceIds.length === 0) {
      const ids = activeNotebook.sources.map(s => s.id);
      setSelectedSourceIds(ids);
      setStoredSourceIds(ids);
    }
  }, [activeNotebook.id]);

  useEffect(() => {
    setStoredSourceIds(selectedSourceIds);
  }, [selectedSourceIds]);

  const handleToggleSource = (id: string) => {
    setSelectedSourceIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleAddSource = (newSource: Source) => {
    const updatedSources = [...activeSources, newSource];
    setActiveSources(updatedSources);
    setSelectedSourceIds(prev => [...prev, newSource.id]);
    activeNotebook.sources = updatedSources;
  };

  const handleDeleteSource = (id: string) => {
    const updatedSources = activeSources.filter(s => s.id !== id);
    setActiveSources(updatedSources);
    setSelectedSourceIds(prev => prev.filter(sid => sid !== id));
    activeNotebook.sources = updatedSources;
  };

  const handleSelectNotebook = (notebook: Notebook) => {
    setActiveNotebook(notebook);
    setStoredNotebookId(notebook.id);
    setSelectedSourceIds(notebook.sources.map(s => s.id));
    setMobileMenuOpen(false);
  };

  const handleShare = () => {
    const shareText = `تعال ذاكر معايا مادة "${activeNotebook.titleAr}" على كشكول LM! الذكاء الاصطناعي بيشرح بالبلدي وعليه امتحانات محلولة. اضغط على اللينك وادخل مجاناً:`;
    const shareUrl = window.location.href;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getSelectedSources = () => {
    return activeSources.filter(s => selectedSourceIds.includes(s.id));
  };

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'desert' : 'dark');
  }, [setTheme]);

  const shortcuts = useMemo(() => ({
    'Ctrl+\\': () => setSourcePanelOpen(prev => !prev),
    'escape': () => { setMobileMenuOpen(false); },
    'Ctrl+b': () => setSidebarCollapsed(prev => !prev),
    'Ctrl+t': () => toggleTheme(),
    'Ctrl+shift+u': () => setIsUpgradeOpen(true),
  }), [toggleTheme]);

  useKeyboardShortcuts(shortcuts);

  return (
    <ToastProvider>
    <div className="min-h-screen text-zinc-100 flex flex-col font-sans" style={{ backgroundColor: 'var(--bg-screen)', color: 'var(--text-primary)' }} dir="rtl">

      {/* Top Navigation */}
      <header className="h-14 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSourcePanelOpen(!sourcePanelOpen)}
            className="hidden lg:flex p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-all"
            title={sourcePanelOpen ? 'إخفاء المصادر' : 'إظهار المصادر'}
          >
            {sourcePanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-all"
            title={sidebarCollapsed ? 'إظهار الكشاكيل' : 'إخفاء الكشاكيل'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-black text-black text-base shadow font-mono">
              ك
            </div>
            <span className="text-base font-extrabold text-white font-arabic tracking-tight">كشكول <span className="text-amber-500">LM</span></span>
          </Link>

          <span className="hidden md:inline-block text-zinc-700">|</span>
          <span className="hidden md:inline text-xs font-bold text-zinc-400 font-arabic bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-850 truncate max-w-[200px]">
            {activeNotebook.titleAr}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
            title={theme === 'dark' ? 'الوضع الصحراوي (الدفا)' : 'الوضع الداكن'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {isVip ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-bold font-arabic">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>باقة الدحيح نشطة</span>
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[10px] text-zinc-500 font-arabic">باقة تجريبية</span>
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all font-arabic cursor-pointer flex items-center gap-1 shadow-md shadow-amber-500/10"
              >
                <Award className="w-3.5 h-3.5 font-extrabold" />
                <span>ترقية (49ج)</span>
              </button>
            </div>
          )}

          <button
            onClick={handleShare}
            className="p-2 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
            title="مشاركة الكشكول مع دفعتك"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Sidebar - Notebook Picker (Desktop Only, collapsible) */}
        <aside className={`hidden md:flex flex-col border-l border-zinc-900 bg-zinc-950 p-4 space-y-4 shrink-0 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'w-0 p-0 overflow-hidden border-0' : 'w-64'}`}>
          <div className={`${sidebarCollapsed ? 'hidden' : ''}`}>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-arabic mb-4">الكشاكيل الدراسية</div>
            <div className="space-y-1">
              {MOCK_NOTEBOOKS.map((nb) => {
                const isActive = activeNotebook.id === nb.id;
                return (
                  <button
                    key={nb.id}
                    onClick={() => handleSelectNotebook(nb)}
                    className={`w-full text-right p-3 rounded-xl transition-all border flex flex-col gap-1 cursor-pointer ${
                      isActive
                        ? 'border-amber-500/30 bg-amber-500/5 text-white'
                        : 'border-transparent text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold font-arabic">{nb.titleAr}</div>
                    <div className="text-[9px] text-zinc-500 truncate w-full font-arabic">{nb.descriptionAr}</div>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-zinc-900">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-arabic mb-3">تفاصيل الحساب</div>
              <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-500 font-arabic">نوع الباقة:</span>
                  <span className="font-bold text-zinc-300 font-arabic">{isVip ? 'دحيح (سنوي/ترم)' : 'مجاني'}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-500 font-arabic">المصادر المرفوعة:</span>
                  <span className="font-mono text-zinc-300">{activeSources.length}</span>
                </div>
                {!isVip && (
                  <button
                    onClick={() => setIsUpgradeOpen(true)}
                    className="w-full text-center py-1.5 mt-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-[10px] border border-amber-500/20 rounded-lg transition-all cursor-pointer font-arabic"
                  >
                    افتح جميع المميزات
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Core Workspace Columns Grid */}
        <main className={`flex-1 grid grid-cols-1 ${sourcePanelOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} p-4 gap-4 overflow-y-auto lg:overflow-hidden lg:h-[calc(100vh-3.5rem)]`}>

          {/* Column 1: Source Manager (collapsible) */}
          <div className={`lg:h-full lg:overflow-hidden ${sourcePanelOpen ? 'block' : 'hidden lg:hidden xl:block'}`}>
            <ErrorBoundary fallbackTitle="خطأ في تحميل المصادر">
              {isLoading ? <SourceSkeleton /> : (
                <SourceManager
                  sources={activeSources}
                  selectedSourceIds={selectedSourceIds}
                  onToggleSource={handleToggleSource}
                  onAddSource={handleAddSource}
                  onDeleteSource={handleDeleteSource}
                  isDataSaver={isDataSaver}
                  onToggleDataSaver={() => setIsDataSaver(!isDataSaver)}
                  isVip={isVip}
                  onOpenUpgrade={() => setIsUpgradeOpen(true)}
                  isCollapsed={!sourcePanelOpen}
                />
              )}
            </ErrorBoundary>
          </div>

          {/* Column 2: AI Chat */}
          <div className={`lg:h-full lg:overflow-hidden ${sourcePanelOpen ? '' : 'lg:col-span-2'}`}>
            <ErrorBoundary fallbackTitle="خطأ في تحميل الدردشة">
              {isLoading ? <ChatSkeleton /> : (
                <AIChat
                  notebookTitle={activeNotebook.titleAr}
                  notebookId={activeNotebook.id}
                  selectedSources={getSelectedSources()}
                  allSources={activeSources}
                />
              )}
            </ErrorBoundary>
          </div>

          {/* Column 3: Study Tools & Audio Podcast */}
          <div className={`lg:h-full lg:overflow-hidden flex flex-col gap-4 ${sourcePanelOpen ? '' : 'hidden lg:hidden xl:flex'}`}>

            {/* Podcast Player (top of right column) */}
            <div className="shrink-0" style={{ minHeight: '200px' }}>
              <ErrorBoundary fallbackTitle="خطأ في تحميل البودكاست">
                {isLoading ? <PodcastSkeleton /> : (
                  <AudioPodcast
                    podcast={activeNotebook.podcast}
                    isVip={isVip}
                    onOpenUpgrade={() => setIsUpgradeOpen(true)}
                  />
                )}
              </ErrorBoundary>
            </div>

            {/* Interactive Flashcards/Exams Hub (bottom of right column) */}
            <div className="flex-1 lg:overflow-hidden">
              <ErrorBoundary fallbackTitle="خطأ في تحميل الأدوات الدراسية">
                {isLoading ? <StudyToolsSkeleton /> : (
                  <StudyTools
                    notebook={activeNotebook}
                    isVip={isVip}
                    onOpenUpgrade={() => setIsUpgradeOpen(true)}
                  />
                )}
              </ErrorBoundary>
            </div>
          </div>

        </main>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          ></div>

          <div className="relative w-80 bg-zinc-950 border-l border-zinc-900 h-full p-5 flex flex-col justify-between z-10 animate-slide-in-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-400 font-arabic">اختر المادة العلمية</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {MOCK_NOTEBOOKS.map((nb) => {
                  const isActive = activeNotebook.id === nb.id;
                  return (
                    <button
                      key={nb.id}
                      onClick={() => handleSelectNotebook(nb)}
                      className={`w-full text-right p-3 rounded-xl transition-all border flex flex-col gap-1 cursor-pointer ${
                        isActive
                          ? 'border-amber-500/30 bg-amber-500/5 text-white'
                          : 'border-transparent text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                      }`}
                    >
                      <div className="text-xs font-bold font-arabic">{nb.titleAr}</div>
                      <div className="text-[9px] text-zinc-500 font-arabic">{nb.descriptionAr}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-900 space-y-4">
              <div className="bg-zinc-900/40 p-3 rounded-xl text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-arabic">الباقة الحالية:</span>
                  <span className="font-bold text-amber-500 font-arabic">{isVip ? 'دحيح (ترم/سنة)' : 'مجانية محدودة'}</span>
                </div>
                {!isVip && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsUpgradeOpen(true);
                    }}
                    className="w-full text-center py-2 mt-1 bg-amber-500 text-black font-extrabold rounded-lg text-[10px] cursor-pointer font-arabic"
                  >
                    اشترك الآن بـ 49 جنيه للترم
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint bar */}
      <div className="hidden md:flex items-center justify-center gap-4 px-4 py-1.5 border-t border-zinc-900 bg-zinc-950/60 text-[9px] text-zinc-600 font-arabic">
        <span><kbd className="px-1 py-0.5 bg-zinc-900 rounded text-zinc-400 font-mono text-[8px]">Ctrl+\</kbd> إخفاء/إظهار المصادر</span>
        <span><kbd className="px-1 py-0.5 bg-zinc-900 rounded text-zinc-400 font-mono text-[8px]">Ctrl+B</kbd> القائمة الجانبية</span>
        <span><kbd className="px-1 py-0.5 bg-zinc-900 rounded text-zinc-400 font-mono text-[8px]">Ctrl+T</kbd> تغيير الثيم</span>
        <span><kbd className="px-1 py-0.5 bg-zinc-900 rounded text-zinc-400 font-mono text-[8px]">Esc</kbd> إغلاق القوائم</span>
      </div>

      {/* First-time onboarding tour */}
      <OnboardingTour notebookTitle={activeNotebook.titleAr} />

      {/* Checkout simulator Modal */}
      <PaymentModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={() => {
          setIsVip(true);
        }}
      />
    </div>
    </ToastProvider>
  );
}

"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Source } from '../data/subjects';
import { FileText, Video, Plus, CheckSquare, Square, Trash2, ShieldAlert, Sparkles, BookOpen, Upload, FileImage, Link, Type, Check, Loader2 } from 'lucide-react';

interface SourceManagerProps {
  sources: Source[];
  selectedSourceIds: string[];
  onToggleSource: (id: string) => void;
  onAddSource: (source: Source) => void;
  onDeleteSource: (id: string) => void;
  isDataSaver: boolean;
  onToggleDataSaver: () => void;
  isVip: boolean;
  onOpenUpgrade: () => void;
  isCollapsed?: boolean;
}

const SOURCE_TYPES = [
  { key: 'pdf' as const, label: 'PDF', icon: FileText, color: 'rose', desc: 'محاضرات وملازم' },
  { key: 'youtube' as const, label: 'يوتيوب', icon: Video, color: 'red', desc: 'فيديوهات شرح' },
  { key: 'text' as const, label: 'نص', icon: Type, color: 'amber', desc: 'ملاحظات مكتوبة' },
  { key: 'image' as const, label: 'صورة', icon: FileImage, color: 'blue', desc: 'صور ملازم' },
];

export default function SourceManager({
  sources,
  selectedSourceIds,
  onToggleSource,
  onAddSource,
  onDeleteSource,
  isDataSaver,
  onToggleDataSaver,
  isVip,
  onOpenUpgrade,
  isCollapsed
}: SourceManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [sourceType, setSourceType] = useState<'pdf' | 'youtube' | 'text' | 'image'>('pdf');
  const [newTitle, setNewTitle] = useState('');
  const [newUrlOrText, setNewUrlOrText] = useState('');
  const selectedCount = selectedSourceIds.length;

  // Drag-and-drop state
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; progress: number } | null>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const simulateUpload = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    let type: 'pdf' | 'youtube' | 'text' | 'image' = 'pdf';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) type = 'image';
    else if (['mp4', 'webm'].includes(ext)) type = 'youtube';
    else if (['txt', 'md'].includes(ext)) type = 'text';

    if (!isVip && sources.length >= 3) {
      onOpenUpgrade();
      return;
    }

    setUploadProgress({ name: fileName, progress: 0 });

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (!prev) return null;
        const next = Math.min(prev.progress + Math.random() * 30, 100);
        if (next >= 100) {
          clearInterval(interval);
          const newSource: Source = {
            id: `upload-${Date.now()}`,
            name: fileName,
            type: type === 'youtube' ? 'youtube' : type === 'image' ? 'image' : type === 'text' ? 'text' : 'pdf',
            size: type === 'image' ? '1.2 MB' : type === 'pdf' ? '2.1 MB' : '45 KB',
            content: `Auto-extracted content from ${fileName}.`,
            contentAr: `محتوى مستخرج تلقائياً من ${fileName}.`,
          };
          onAddSource(newSource);
          setTimeout(() => setUploadProgress(null), 300);
          return { ...prev, progress: 100 };
        }
        return { ...prev, progress: next };
      });
    }, 200);

    setTimeout(() => clearInterval(interval), 4000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => simulateUpload(file.name));
  }, [sources.length, isVip]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (!isVip && sources.length >= 3) {
      onOpenUpgrade();
      return;
    }

    const newSource: Source = {
      id: `custom-src-${Date.now()}`,
      name: sourceType === 'pdf'
        ? newTitle.endsWith('.pdf') ? newTitle : `${newTitle}.pdf`
        : sourceType === 'youtube' ? `YouTube: ${newTitle}` : sourceType === 'image' ? `${newTitle}.jpg` : `${newTitle} (ملاحظة)`,
      type: sourceType === 'pdf' ? 'pdf' : sourceType === 'youtube' ? 'youtube' : sourceType === 'image' ? 'image' : 'text',
      size: sourceType === 'pdf' ? '1.4 MB' : sourceType === 'youtube' ? '12.0 MB' : sourceType === 'image' ? '820 KB' : '15 KB',
      content: sourceType === 'text'
        ? newUrlOrText
        : `This is simulated extracted content from the ${sourceType} resource "${newTitle}". Standard university concepts apply.`,
      contentAr: sourceType === 'text'
        ? newUrlOrText
        : `محتوى مستخرج تجريبي من ملف الـ ${sourceType} المسمى "${newTitle}". يحتوي على شرح وتفاصيل مفيدة.`
    };

    onAddSource(newSource);
    setNewTitle('');
    setNewUrlOrText('');
    setShowAddForm(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'youtube': return <Video className="w-4 h-4 text-red-500" />;
      case 'image': return <FileImage className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-[0_0_0_1px_rgba(245,158,11,0.03)]"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 font-arabic">
              <Sparkles className="h-3 w-3" />
              مركز المصادر
            </span>
            <h2 className="text-sm font-bold text-white font-arabic">المصادر الدراسية ({sources.length})</h2>
            <p className="text-[10px] text-zinc-500 font-arabic">اختَر المصادر التي سيقرأها الذكاء الاصطناعي في الإجابة.</p>
          </div>

          <button
            onClick={onToggleDataSaver}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all cursor-pointer ${
              isDataSaver
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
            title="توفير باقة الموبايل انترنت عن طريق تقليل حجم الصور ومنع الفيديوهات"
          >
            <span className="font-arabic">توفير الباقة</span>
            <span className={`h-1.5 w-1.5 rounded-full ${isDataSaver ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`}></span>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-arabic">
          <div className="rounded-lg border border-zinc-800/90 bg-zinc-900/60 px-2.5 py-2 text-zinc-400">
            <span className="block text-zinc-500">إجمالي المصادر</span>
            <span className="mt-0.5 block text-xs font-bold text-white">{sources.length}</span>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-2 text-amber-300">
            <span className="block text-amber-400/80">المحدد حالياً</span>
            <span className="mt-0.5 block text-xs font-bold">{selectedCount}</span>
          </div>
        </div>
      </div>

      {!isVip && sources.length >= 3 && (
        <div className="mx-4 mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 flex items-start gap-2.5">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="text-[11px] text-amber-300 font-arabic leading-relaxed">
            وصلت للحد الأقصى للحساب المجاني (3 مصادر).
            <button onClick={onOpenUpgrade} className="mr-1 font-bold underline underline-offset-2">
              اشترك بـ 49ج لرفع غير محدود
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 relative">
        {isDragOver && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-500 bg-zinc-950/90 backdrop-blur-sm">
            <Upload className="w-8 h-8 text-amber-500 mb-2" />
            <p className="text-sm font-bold text-amber-500 font-arabic">أفلت الملفات هنا للرفع</p>
            <p className="text-[10px] text-zinc-400 font-arabic">PDF, صور, نصوص — كل أنواع المحاضرات</p>
          </div>
        )}

        {uploadProgress && uploadProgress.progress < 100 && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-arabic truncate ml-2">{uploadProgress.name}</span>
              <span className="text-zinc-500 font-mono">{Math.round(uploadProgress.progress)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress.progress}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-zinc-500 font-arabic flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              جاري استخراج النصوص وتحليل المحتوى...
            </p>
          </div>
        )}

        {sources.length === 0 && !uploadProgress ? (
          <div
            className={`flex h-36 flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              isDragOver ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700'
            }`}
            onDragEnter={handleDragEnter}
          >
            <div className="mb-2 rounded-full border border-zinc-800 bg-zinc-900 p-2">
              <Upload className="h-4 w-4 text-zinc-500" />
            </div>
            <p className="text-xs text-zinc-400 font-arabic">اسحب وأفلت الملفات هنا</p>
            <p className="mt-1 text-[10px] text-zinc-500 font-arabic">أو استخدم الزر أدناه لإضافة مصدر</p>
          </div>
        ) : (
          sources.map((src) => {
            const isSelected = selectedSourceIds.includes(src.id);
            return (
              <div
                key={src.id}
                className={`group flex items-center justify-between rounded-xl border p-3 transition-all ${
                  isSelected
                    ? 'border-amber-500/35 bg-amber-500/5 shadow-[0_0_0_1px_rgba(245,158,11,0.08)]'
                    : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                <div onClick={() => onToggleSource(src.id)} className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer">
                  <button className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    {isSelected ? <CheckSquare className="h-4 w-4 text-amber-500" /> : <Square className="h-4 w-4" />}
                  </button>
                  <div className="flex shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 p-2">
                    {getIcon(src.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-zinc-200 font-arabic">{src.name}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[9px] text-zinc-500">
                      <span>{src.type.toUpperCase()}</span>
                      <span>•</span>
                      <span>{isDataSaver && src.type === 'youtube' ? 'مضغوط (1.2 MB)' : src.size}</span>
                      {isDataSaver && (
                        <>
                          <span>•</span>
                          <span className="text-[8px] text-emerald-500 font-arabic">موفر للباقة</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteSource(src.id)}
                  className="mr-2 shrink-0 rounded p-1 text-zinc-600 transition-all hover:bg-zinc-800/50 hover:text-rose-500 opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {showAddForm ? (
        <form onSubmit={handleAddSubmit} className="space-y-3 border-t border-zinc-800 bg-zinc-950/95 p-4" dir="rtl">
          <div className="grid grid-cols-4 gap-1.5">
            {SOURCE_TYPES.map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSourceType(key)}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 text-[9px] font-arabic transition-all ${
                  sourceType === key
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${sourceType === key ? 'text-amber-500' : 'text-zinc-500'}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-[10px] text-zinc-500 font-arabic">
              {sourceType === 'pdf' ? 'اسم المحاضرة أو الملف' : sourceType === 'youtube' ? 'عنوان الفيديو التعليمي' : sourceType === 'image' ? 'اسم صورة الملزمة' : 'عنوان الملاحظة'}
            </label>
            <input
              type="text"
              placeholder={sourceType === 'pdf' ? 'مثال: محاضرة النهايات الأولى.pdf' : sourceType === 'youtube' ? 'مثال: شرح د. أحمد للوبس' : 'اسم الملاحظة'}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-2 text-right text-xs text-white focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] text-zinc-500 font-arabic">
              {sourceType === 'pdf' ? 'رابط الملف (اختياري)' : sourceType === 'youtube' ? 'رابط الفيديو (YouTube URL)' : sourceType === 'image' ? 'رابط الصورة (اختياري)' : 'اكتب أو انسخ النص هنا'}
            </label>
            {sourceType === 'text' ? (
              <textarea
                placeholder="اكتب ملاحظات المحاضرة هنا..."
                value={newUrlOrText}
                onChange={(e) => setNewUrlOrText(e.target.value)}
                className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-2 text-right text-xs text-white focus:border-amber-500 focus:outline-none"
                required
              />
            ) : (
              <input
                type="text"
                placeholder={sourceType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'اختياري — سيتم توليد المحتوى تلقائياً'}
                value={newUrlOrText}
                onChange={(e) => setNewUrlOrText(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-2 text-right text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-amber-500 py-2 text-center text-xs font-semibold text-black transition-all hover:bg-amber-600 font-arabic cursor-pointer"
            >
              إضافة المصدر
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-200 font-arabic cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setSourceType('pdf'); setShowAddForm(true); }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 py-2 px-3 text-[10px] font-semibold text-zinc-300 transition-all hover:border-amber-500/30 hover:bg-zinc-800 hover:text-white cursor-pointer font-arabic"
            >
              <FileText className="h-3.5 w-3.5 text-rose-500" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => { setSourceType('youtube'); setShowAddForm(true); }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 py-2 px-3 text-[10px] font-semibold text-zinc-300 transition-all hover:border-amber-500/30 hover:bg-zinc-800 hover:text-white cursor-pointer font-arabic"
            >
              <Video className="h-3.5 w-3.5 text-red-500" />
              <span>يوتيوب</span>
            </button>
          </div>
          <button
            onClick={() => { setSourceType('text'); setShowAddForm(true); }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 py-2 px-4 text-[10px] font-semibold text-zinc-400 transition-all hover:border-amber-500/30 hover:bg-zinc-800 hover:text-white cursor-pointer font-arabic"
          >
            <Plus className="h-3.5 w-3.5 text-amber-500" />
            <span>إضافة ملاحظة مكتوبة أو رابط</span>
          </button>
        </div>
      )}
    </div>
  );
}

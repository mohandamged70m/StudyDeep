"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { Source } from '../data/subjects';
import { Send, Sparkles, BookOpen, ShieldCheck, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  fullText?: string;
  dialect: 'eg' | 'ar' | 'en';
  sourcesUsed?: string[];
}

interface AIChatProps {
  notebookTitle: string;
  notebookId: string;
  selectedSources: Source[];
  allSources: Source[];
}

function useStreamingText(fullText: string, isStreaming: boolean, onDone: () => void) {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isStreaming || !fullText) return;

    indexRef.current = 0;
    setDisplayedText('');

    timerRef.current = setInterval(() => {
      if (indexRef.current < fullText.length) {
        const chunk = Math.min(3, fullText.length - indexRef.current);
        setDisplayedText(fullText.slice(0, indexRef.current + chunk));
        indexRef.current += chunk;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        onDone();
      }
    }, 25);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStreaming, fullText]);

  return displayedText;
}

export default function AIChat({ notebookTitle, notebookId, selectedSources, allSources }: AIChatProps) {
  const [messages, setMessages] = useLocalStorage<Message[]>(`chat-${notebookId}`, []);
  const [inputValue, setInputValue] = useState('');
  const [dialect, setDialect] = useState<'eg' | 'ar' | 'en'>('eg');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectedSourceCount = selectedSources.length;

  const getWelcomeMessage = useCallback((dl: 'eg' | 'ar' | 'en', title: string): string => {
    if (dl === 'eg') {
      return `يا هلا بيك يا دحيح! 👋 أنا كشكولك الذكي لمادة "${title}". ارفع أي ملف أو فيديو، واسألني في أي حاجة واقفة قدامك وهبسطهالك بالبلدي كأني صاحبك اللي بيشرحلك ليلة الامتحان! عايزني أشرح إيه النهاردة؟`;
    } else if (dl === 'ar') {
      return `مرحباً بك في مساعدك الدراسي لمادة "${title}". 📚 يمكنك طرح أي سؤال حول المصادر المحددة، وسأقوم بالإجابة عليها بالتفصيل باللغة العربية الفصحى.`;
    } else {
      return `Welcome to your AI study companion for "${title}". 🚀 Ask me anything about your uploaded materials, and I will explain the concepts clearly with full academic rigor.`;
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      const welcome: Message = {
        id: 'welcome',
        sender: 'ai',
        text: getWelcomeMessage(dialect, notebookTitle),
        fullText: getWelcomeMessage(dialect, notebookTitle),
        dialect: dialect,
      };
      setMessages([welcome]);
    }
  }, [notebookId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      dialect: dialect,
    };

    const responseText = generateSimulatedResponse(textToSend, selectedSources, dialect, notebookId);

    const aiMsgId = `msg-ai-${Date.now()}`;
    const aiMsg: Message = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      fullText: responseText,
      dialect: dialect,
      sourcesUsed: selectedSources.map(s => s.name),
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputValue('');
    setIsTyping(true);
    setStreamingMsgId(aiMsgId);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleStreamDone = useCallback(() => {
    setStreamingMsgId(null);
    setIsTyping(false);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const getSuggestedPrompts = () => {
    if (dialect === 'eg') {
      return [
        { label: "شرح بالبلدي", text: "اشرحلي أهم فكرة في المحاضرات دي بالبلدي كأني في ابتدائي وبأمثلة عملية من مصر." },
        { label: "لخص في نقاط", text: "اعملي ملخص سريع ومنظم جداً لأهم القوانين أو النقط اللي بتيجي في الامتحانات." },
        { label: "حللي مسألة صعبة", text: "دربني على سؤال صعب ممكن ييجي في الميدترم وحله معايا خطوة بخطوة." },
      ];
    } else if (dialect === 'ar') {
      return [
        { label: "ملخص للمصادر", text: "لخص النقاط الجوهرية لجميع ملفات المحاضرات المحددة." },
        { label: "شرح القوانين", text: "اشرح القوانين الرياضية أو المفاهيم الطبية الواردة بالتفصيل." },
        { label: "سؤال وجواب", text: "اطرح عليّ سؤالاً اختبارياً وراجع إجابتي لتصحيح المفاهيم." },
      ];
    } else {
      return [
        { label: "Summarize core points", text: "Provide a structured summary of the selected lectures highlighting formulas and facts." },
        { label: "Explain key formulas", text: "Walk me through the mathematical derivations/concepts in these documents." },
        { label: "Practice exam prep", text: "Generate a tough exam style question based on these sources and explain the correct solution." },
      ];
    }
  };

  const generateSimulatedResponse = (question: string, sources: Source[], dl: 'eg' | 'ar' | 'en', courseId: string): string => {
    if (sources.length === 0) {
      if (dl === 'eg') return "بص يا بطل، أنت مش محدد أي مصدر للذكاء الاصطناعي يقرأه! علم على المربع اللي جنب اسم المحاضرة في اليمين عشان أقدر أذاكرها معاك وأجاوبك صح. 😉";
      return dl === 'ar'
        ? "عذراً، يرجى تحديد مصدر واحد على الأقل من القائمة اليمنى ليتمكن الذكاء الاصطناعي من قراءته والإجابة على سؤالك."
        : "Please select at least one source file from the left sidebar so I can base my answer on your course materials.";
    }

    const lowerQ = question.toLowerCase();
    const isLimits = courseId === 'calculus-1';
    const isPython = courseId === 'intro-cs';
    const isAnatomy = courseId === 'anatomy';

    if (dl === 'eg') {
      if (isLimits) {
        if (lowerQ.includes('شرح') || lowerQ.includes('ملخص') || lowerQ.includes('بلدي')) {
          return `يا دحيح، ركز معايا بقى عشان نلم مادة التفاضل دي في دقيقتين! 🧠

بص يا سيدي، **النهايات (Limits)** فكرتها كلها إننا بنحوم حوالين نقطة، مش مهم الدالة بتساوي كام عند النقطة دي بالظبط، المهم لما بنقرب أوي منها.

لو عوضت تعويض مباشر وطلع معاك $\\frac{0}{0}$، دي اسمها **كمية غير معينة**. يعني الآلة هتشتمك وتقولك Math Error! هنا بنعمل إيه؟
1. **التحليل**: بتفك المقدار كأقواس عشان تطير القوس الصفري المسبب للمشكلة.
2. **الضرب في المرافق**: لو عندك جذر تربيعي رخم في المسألة.
3. **قاعدة لوبيتال (الحل السحري)**: بتشتق البسط لوحده والمقام لوحده وتعوض تاني.

**قوانين الاشتقاق الأساسية اللي لازم تحفظها عشان تدخل الميدترم بقلب جامد:**
- مشتقة $x^n$ هي $n \\cdot x^{n-1}$ (بننزل الأس ونطرح واحد).
- مشتقة الـ $\\sin(x)$ بـ $\\cos(x)$.
- مشتقة الـ $\\cos(x)$ بـ $-\\sin(x)$.

وضحت كده ولا محتاج نطبق بمسألة؟`;
        }
        return `سؤالك ممتاز عن التفاضل! 💡

بناءً على المصادر اللي حددتها (زي **${sources[0].name}**)، المشتقة الأولى للدالة هي ميل المماس للمنحنى عند أي نقطة.

لو عندك دالة مركبة زي $f(g(x))$، بنستخدم **قاعدة السلسلة (Chain Rule)**:
1. بنشتق الدالة الكبيرة اللي برة ونسيب اللي جوة زي ما هو.
2. بنضرب الناتج في مشتقة اللي جوة القوس.

مثال: مشتقة $(x^2 + 5)^3$
- اشتق برة: $3(x^2 + 5)^2$
- اشتق جوة: $2x$
- النتيجة النهائية: $3(x^2 + 5)^2 \\cdot 2x = 6x(x^2 + 5)^2$.

فهمت اللعبة؟ جرب تحل مشتقة $\\sin(3x)$ كده وقولي طلعت معاك كام!`;
      }

      if (isPython) {
        if (lowerQ.includes('شرح') || lowerQ.includes('ملخص') || lowerQ.includes('بلدي')) {
          return `يا هندسة، البرمجة دي أسهل مما تتخيل بس افهم الفكرة وسيبك من الحفظ! 🐍

بايثون لغة طيبة جداً، بتفهمك بسرعة لأن كتابتها شبه الإنجليزي العادي. الركيزة الأساسية فيها هي **المسافات البادئة (Indentation)**. في لغات تانية بنستخدم أقواس \`{}\` عشان نعرف نهاية الـ loop أو الـ if، في بايثون بنستخدم **المسافة البادئة**. لو نسيت مسافة، الكود هيجيله تشنجات ويديك \`IndentationError\`.

**أهم حاجتين بيجوا في امتحانات العملي:**
1. **الـ if/else (الشروط)**:
   \`\`\`python
   if gpa >= 3.4:
       print("أنت دحيح رسمي 🎉")
   elif gpa >= 2.0:
       print("مقبول، عديت الحمد لله 😅")
   else:
       print("شد حيلك الترم الجاي 📚")
   \`\`\`
2. **الـ Loops (التكرار)**:
   - \`for\`: لما تكون عارف هتلف كام لفة (مثلاً بتعد من 1 لـ 10).
   - \`while\`: بتلف طول ما الشرط صح. (أوعى تنسى تزود العداد عشان ما يدخلش في Infinite Loop واللاب توب يسخن منك ويقفل!).

عايز نكتب كود معين ونجربه سوا؟`;
        }
        return `بص يا بطل، ده توضيح سريع بخصوص سؤالك في لغة بايثون:

في بايثون، المتغيرات ذكية وبتعرف نوعها لوحدها (Dynamically Typed). يعني لما تكتب \`x = 5\` هي بتعرف لوحدها إنه عدد صحيح (Integer)، ولو كتبت \`name = "Kashkool"\` بتفهم إنه نص (String).

لو عايز تجمع عناصر في قائمة (List)، بنستخدم الـ Loops كده:
\`\`\`python
grades = [85, 90, 78, 92]
total = 0
for grade in grades:
    total += grade
print("المجموع:", total) # هيطبع 345
\`\`\`
جرب الكود ده عندك وقولي لو فيه أي سطر مش فاهم بيعمل إيه بالظبط!`;
      }

      if (isAnatomy) {
        return `أهلاً يا دكتور المستقبل! 🩺 عظام جسمنا الـ 206 دي حكايتها حكاية.

الهيكل العظمي متقسم لجزئين رئيسيين عشان يسهل دراسته:
1. **الهيكل المحوري (Axial Skeleton)**: وده اللي على المحور المركزي لجسمك وفيه **80 عظمة** (الجمجمة عشان تحمي المخ، العمود الفقري عشان الضهر والحبل الشوكي، والقفص الصدري عشان يحمي القلب والرئتين).
2. **الهيكل الطرفي (Appendicular Skeleton)**: وده اللي بيخليك تتحرك وتجري، وفيه **126 عظمة** (الدراعين، الرجلين، عظام الحوض والكتف).

**معلومة مهمة جداً للامتحان:** العضم مش مجرد خشب ساند الجسم! ده مصنع الدم بتاعك. عملية اسمها **Hemopoiesis** (إنتاج خلايا الدم) بتحصل جوة نخاع العظم الأحمر اللي في العظام المفلطحة. يعني كرات دمك الحمراء والبيضاء بتتصنع جوة عضمك!

لو عندك أي مصطلح لاتيني رخم مش عارف تحفظه، قولي عليه وهبسطهولك بطريقة ما تتنسيش!`;
      }
    }

    if (dl === 'ar') {
      return `بناءً على مراجعة المصادر المرفقة (**${sources.map(s => s.name).join(', ')}**)، إليك الإجابة الأكاديمية المفصلة:

1. **التعريف العلمي**: المفاهيم المدروسة تشكل حجر الأساس في هذا القسم الدراسي.
2. **التحليل الجبري/السريري**:
   - شرح مبسط للخطوات الأساسية المطلوبة.
   - التطبيق المباشر باستخدام القوانين المقررة في المنهج الدراسي للترم الحالي.

إذا كنت بحاجة إلى شرح مسألة معينة بالخطوات، يرجى كتابة نص السؤال بالكامل هنا وسأقوم بحله فوراً.`;
    }

    return `Based on the selected sources (${sources.map(s => s.name).join(', ')}), here is the breakdown:

1. **Core Concept**: The material outlines key principles relevant to your syllabus.
2. **Key Formulas / Syntax**:
   - Make sure to note proper constraints and definitions.
   - Review past exam configurations which typically focus on these derivations.

Would you like a step-by-step example or a practical question to test your understanding?`;
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    // Placeholder — would send to analytics in production
    console.log(`Feedback ${type} on message ${msgId}`);
  };

  const StreamingMessage = ({ msg }: { msg: Message }) => {
    const isStreaming = !!(msg.id === streamingMsgId && msg.fullText);
    const displayedText = useStreamingText(msg.fullText || '', isStreaming, handleStreamDone);
    const textToRender = isStreaming ? displayedText : msg.text || msg.fullText || '';

    return (
      <div className="whitespace-pre-line font-arabic leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          components={{
            code({ className, children, ...props }) {
              const isInline = !className;
              if (isInline) {
                return <code className="bg-zinc-800 text-amber-300 px-1 py-0.5 rounded text-[11px]" {...props}>{children}</code>;
              }
              return (
                <div className="relative group">
                  <pre className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 my-2 overflow-x-auto text-[11px] font-mono leading-relaxed">
                    <code className={className} {...props}>{children}</code>
                  </pre>
                  <button
                    onClick={() => handleCopy(String(children), `code-${msg.id}`)}
                    className="absolute top-2 right-2 p-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === `code-${msg.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              );
            },
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            ul({ children }) {
              return <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>;
            },
            strong({ children }) {
              return <strong className="font-bold text-white">{children}</strong>;
            },
          }}
        >
          {textToRender}
        </ReactMarkdown>
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-amber-500 animate-pulse ml-0.5 align-middle"></span>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-[0_0_0_1px_rgba(245,158,11,0.03)]">
      <div className="border-b border-zinc-800/80 bg-zinc-900/45 px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 font-arabic">
              <Sparkles className="h-3 w-3" />
              مساعد ذكي للطلاب
            </span>
            <h1 className="text-sm font-bold text-white font-arabic">الدردشة الذكية — {notebookTitle}</h1>
            <p className="text-[10px] text-zinc-500 font-arabic">اسأل على أي مفهوم، واطلب شرح ثم اختبار ثم مراجعة.</p>
          </div>

          <div className="flex items-center gap-1 self-start rounded-lg border border-zinc-700 bg-zinc-950 p-0.5 text-[10px] font-semibold font-arabic">
            <button
              onClick={() => setDialect('eg')}
              className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                dialect === 'eg' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              عامية
            </button>
            <button
              onClick={() => setDialect('ar')}
              className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                dialect === 'ar' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              فصحى
            </button>
            <button
              onClick={() => setDialect('en')}
              className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                dialect === 'en' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-arabic">
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-400">
            <BookOpen className="h-3 w-3 text-amber-500" />
            مصادر محددة: <strong className="text-zinc-200">{selectedSourceCount}</strong>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            محفوظ داخل الكشكول
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-500">
            كل المصادر: {allSources.length}
          </span>
        </div>
      </div>

      <div
        className="flex-1 space-y-4 overflow-y-auto p-4 min-h-[250px] bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent_45%)]"
        dir={dialect === 'en' ? 'ltr' : 'rtl'}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'rounded-br-none bg-amber-500 text-black font-semibold'
                  : 'rounded-bl-none border border-zinc-800 bg-zinc-900/90 text-zinc-100'
              }`}
            >
              {msg.sender === 'ai' ? (
                <StreamingMessage msg={msg} />
              ) : (
                <div className="whitespace-pre-line font-arabic">{msg.text}</div>
              )}

              {msg.sourcesUsed && msg.sourcesUsed.length > 0 && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-zinc-800/80 pt-2">
                  <span className="text-[9px] text-zinc-500 font-arabic">المصادر المستعينة:</span>
                  {msg.sourcesUsed.map((srcName, idx) => (
                    <span
                      key={idx}
                      className="inline-flex max-w-[130px] items-center gap-1 truncate rounded border border-zinc-700 bg-zinc-950 px-1.5 py-0.5 text-[9px] text-zinc-400"
                      title={srcName}
                    >
                      <BookOpen className="h-2.5 w-2.5 text-amber-500" />
                      <span>{srcName}</span>
                    </span>
                  ))}
                </div>
              )}

              {msg.sender === 'ai' && msg.text && msg.id !== 'welcome' && !streamingMsgId && (
                <div className="mt-2 flex items-center gap-2 border-t border-zinc-800/80 pt-2">
                  <button
                    onClick={() => handleCopy(msg.fullText || msg.text, msg.id)}
                    className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-white transition-colors"
                    title="نسخ الإجابة"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => handleFeedback(msg.id, 'up')}
                    className="text-zinc-500 hover:text-emerald-500 transition-colors"
                    title="مفيد"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback(msg.id, 'down')}
                    className="text-zinc-500 hover:text-rose-500 transition-colors"
                    title="غير مفيد"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && !streamingMsgId && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-none border border-zinc-800 bg-zinc-900 px-4 py-3 text-xs text-zinc-400">
              <span className="font-arabic">كشكول بيفكر ويكتب</span>
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500" style={{ animationDelay: '0ms' }}></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500" style={{ animationDelay: '150ms' }}></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-2 flex gap-2 overflow-x-auto select-none" dir={dialect === 'en' ? 'ltr' : 'rtl'}>
        {getSuggestedPrompts().map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.text)}
            className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[10px] text-zinc-400 transition-all hover:border-amber-500/30 hover:bg-zinc-800 hover:text-white cursor-pointer font-arabic"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="border-t border-zinc-800 bg-zinc-900/30 p-4">
        <form onSubmit={handleFormSubmit} className="flex gap-2" dir={dialect === 'en' ? 'ltr' : 'rtl'}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              dialect === 'eg'
                ? 'اسأل أي سؤال بالبلدي أو الإنجليزي...'
                : dialect === 'ar'
                ? 'اكتب سؤالك هنا باللغة العربية...'
                : 'Ask any question about your selected files...'
            }
            rows={1}
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none font-arabic resize-none min-h-[42px] max-h-[120px]"
          />
          <button
            type="submit"
            className="flex shrink-0 items-center justify-center rounded-xl bg-amber-500 px-3 py-3 text-black transition-all hover:bg-amber-600 cursor-pointer self-end"
          >
            <Send className="h-4 w-4 font-bold" />
          </button>
        </form>
      </div>
    </div>
  );
}

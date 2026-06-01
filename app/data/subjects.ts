export interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'youtube' | 'text' | 'image';
  size: string;
  duration?: string; // for youtube
  content: string;
  contentAr?: string;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  termAr: string;
  definitionAr: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  questionAr: string;
  options?: string[];
  optionsAr?: string[];
  correctAnswer: string;
  correctAnswerAr: string;
  explanation: string;
  explanationAr: string;
}

export interface Exam {
  id: string;
  title: string;
  titleAr: string;
  questions: ExamQuestion[];
}

export interface PodcastEpisode {
  character: 'Ahmed' | 'Sara';
  characterName: string;
  characterNameAr: string;
  avatar: string;
  text: string;
  textAr: string;
  audioTime: string;
}

export interface Notebook {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  sources: Source[];
  studyGuide: string;
  studyGuideAr: string;
  flashcards: Flashcard[];
  exams: Exam[];
  podcast: PodcastEpisode[];
}

export const MOCK_NOTEBOOKS: Notebook[] = [
  {
    id: "calculus-1",
    title: "Math 1 - Calculus & Limits",
    titleAr: "رياضيات 1 - تفاضل وتكامل ونهايات",
    description: "Covers Limits, Continuity, Derivatives, and Applications of Derivatives for Engineering & Science students.",
    descriptionAr: "شامل النهايات، الاتصال، الاشتقاق وتطبيقات التفاضل لطلبة هندسة وعلوم.",
    category: "Engineering",
    categoryAr: "كلية الهندسة",
    sources: [
      {
        id: "calc-pdf-1",
        name: "Lecture 1: Limits & Continuity.pdf",
        type: "pdf",
        size: "1.2 MB",
        content: `Calculus relies heavily on the concept of limits. 
Definition of a Limit: We write lim (x->c) f(x) = L if we can make the values of f(x) arbitrarily close to L by taking x sufficiently close to c, but not equal to c.
One-Sided Limits:
- Left-hand limit: lim (x->c-) f(x) = L1
- Right-hand limit: lim (x->c+) f(x) = L2
A limit exists if and only if both one-sided limits exist and are equal: L1 = L2.
Continuity at a Point: A function f is continuous at x = c if:
1. f(c) is defined.
2. lim (x->c) f(x) exists.
3. lim (x->c) f(x) = f(c).
Intermediate Value Theorem (IVT): If f is continuous on a closed interval [a, b], and N is any number between f(a) and f(b), then there exists a number c in (a, b) such that f(c) = N. This theorem is crucial for finding roots of functions.`,
        contentAr: `تعتمد مادة التفاضل والتكامل بشكل أساسي على مفهوم النهايات (Limits).
تعريف النهاية: نكتب lim (x->c) f(x) = L إذا كان بإمكاننا جعل قيم f(x) قريبة بشكل عشوائي من L عن طريق أخذ قيم x قريبة بما يكفي من c، ولكن لا تساوي c.
النهايات أحادية الجانب (One-Sided Limits):
- النهاية من اليسار: lim (x->c-) f(x) = L1
- النهاية من اليمين: lim (x->c+) f(x) = L2
تكون النهاية موجودة (Limit Exists) إذا وفقط إذا كانت النهايتان من اليمين واليسار موجودتين ومتساويتين: L1 = L2.
الاتصال عند نقطة (Continuity): تكون الدالة f متصلة عند النقطة x = c إذا تحقق:
1. f(c) معرّفة.
2. النهاية عندما تقترب x من c موجودة.
3. النهاية تساوي قيمة الدالة: lim (x->c) f(x) = f(c).
نظرية القيمة المتوسطة (IVT): إذا كانت f متصلة على الفترة المغلقة [a, b]، وكان N أي رقم بين f(a) و f(b)، فإن هناك رقماً c في الفترة المفتوحة (a, b) بحيث يكون f(c) = N. وتستخدم هذه النظرية لإثبات وجود جذور للدوال.`
      },
      {
        id: "calc-yt-1",
        name: "Dr. Mostafa El-Ghandour - Explaining Limits (YouTube)",
        type: "youtube",
        size: "14.5 MB",
        duration: "18:24",
        content: `In this lecture video, Dr. Mostafa explains how to solve indeterminate forms like 0/0.
Key rules discussed:
1. Factoring (التحليل): Expressing polynomials as factors to cancel out terms like (x - c).
2. Conjugate Multiplication (الضرب في المرافق): Used for square roots. For a term like (sqrt(x) - 2), multiply numerator and denominator by (sqrt(x) + 2).
3. L'Hopital's Rule: If lim f(x)/g(x) results in 0/0 or infinity/infinity, and both functions are differentiable, then lim f(x)/g(x) = lim f'(x)/g'(x).
Example solved: lim (x->2) (x^2 - 4) / (x - 2) = lim (x->2) (x-2)(x+2) / (x-2) = lim (x->2) (x+2) = 4.`,
        contentAr: `في هذا الفيديو، يشرح الدكتور مصطفى كيفية حل النهايات غير المعينة مثل 0/0.
القواعد الرئيسية المشروحة:
1. التحليل (Factoring): فك المقادير الجبرية كعوامل لاختصار القوس الصفري مثل (x - c).
2. الضرب في المرافق (Conjugate Multiplication): يُستخدم في حالات الجذور التربيعية. لمقدار مثل (sqrt(x) - 2)، نضرب البسط والمقام في المرافق (sqrt(x) + 2).
3. قاعدة لوبيتال (L'Hopital's Rule): إذا كانت نهاية خارج قسمة دالتين تعطي كمية غير معينة 0/0 أو مالانهاية/مالانهاية، وكانت الدالتان قابلتين للاشتقاق، فإن النهاية تساوي نهاية مشتقة البسط على مشتقة المقام: lim f(x)/g(x) = lim f'(x)/g'(x).
مثال محلول: نهاية (x^2 - 4) / (x - 2) عندما تقترب x من 2. بالتحليل: (x-2)(x+2)/(x-2) = (x+2). بالتعويض المباشر عن x بـ 2 تكون النتيجة 4.`
      },
      {
        id: "calc-paper-1",
        name: "My Lecture Sheet Notes (Derivatives).jpg",
        type: "image",
        size: "820 KB",
        content: `Handwritten Notes:
Derivative Definition: f'(x) = lim (h->0) [f(x+h) - f(x)] / h.
Common Derivative Rules:
- Power Rule: d/dx [x^n] = n * x^(n-1).
- Product Rule: d/dx [u * v] = u'v + uv'.
- Quotient Rule: d/dx [u / v] = (u'v - uv') / v^2.
- Chain Rule: d/dx [f(g(x))] = f'(g(x)) * g'(x).
Trig Derivatives:
- sin(x) -> cos(x)
- cos(x) -> -sin(x)
- tan(x) -> sec^2(x)
- sec(x) -> sec(x)tan(x)`,
        contentAr: `ملاحظات بخط اليد:
تعريف المشتقة الأولى: f'(x) = lim (h->0) [f(x+h) - f(x)] / h.
قواعد الاشتقاق الأساسية:
- دالة القوة: مشتقة x^n هي n * x^(n-1).
- حاصل ضرب دالتين: الأولى في مشتقة الثانية + الثانية في مشتقة الأولى (u'v + uv').
- خارج قسمة دالتين: (مشتقة البسط * المقام - البسط * مشتقة المقام) / (المقام)^2.
- قاعدة السلسلة (Chain Rule): مشتقة الدالة الخارجية بالنسبة لداخلها مضروبة في مشتقة الدالة الداخلية.
مشتقات الدوال المثلثية:
- الجيب sin(x) -> جيب التمام cos(x).
- جيب التمام cos(x) -> سالب الجيب -sin(x).
- الظل tan(x) -> قاطع التمام تربيع sec^2(x).
- القاطع sec(x) -> القاطع في الظل sec(x)tan(x).`
      }
    ],
    studyGuide: `### 1. Limits & Continuity
*   **Intuition**: Limits define the behavior of a function near a point, rather than at the point.
*   **Indeterminate Forms**: If direct substitution yields $0/0$, use factoring, conjugates, or **L'Hopital's Rule**.
*   **Continuity Rules**: The limit must exist, the function must be defined at that point, and the limit value must equal the function value.

### 2. Basic Derivatives
*   **The Power Rule**: Bring the exponent to the front and decrease the power by 1: $\\frac{d}{dx} x^n = n x^{n-1}$.
*   **Trigonometric Functions**: Know your derivatives for $\\sin(x)$, $\\cos(x)$, and $\\tan(x)$.

### 3. Key Theorems for Exams
*   **Intermediate Value Theorem (IVT)**: If a continuous function transitions from negative to positive in an interval, it MUST cross $y = 0$ (at least one root exists).`,
    studyGuideAr: `### 1. النهايات والاتصال (Limits & Continuity)
*   **الفكرة ببساطة**: النهاية بتعرفنا سلوك الدالة وهي بتقرب من نقطة معينة، مش شرط تكون معرفة عند النقطة دي بالظبط.
*   **الكميات غير المعينة**: لما تعوض ويطلع معاك $\\frac{0}{0}$، استخدم التحليل، أو الضرب في المرافق، أو **قاعدة لوبيتال** (اشتق البسط لوحده والمقام لوحده).
*   **شروط الاتصال**: الدالة تكون معرفة عند النقطة، والنهاية تكون موجودة، وقيمة النهاية تساوي قيمة الدالة بالظبط.

### 2. المشتقات الأساسية (Basic Derivatives)
*   **قاعدة القوة**: بننزل الأس قدام الـ x وننقص منه 1: $\\frac{d}{dx} x^n = n x^{n-1}$.
*   **الدوال المثلثية**: احفظ كويس جداً مشتقات الجيب والجيب تمام والظل: مشتقة الـ $\\sin$ هي $\\cos$، ومشتقة الـ $\\cos$ هي $-\\sin$.

### 3. النظريات الهامة في الامتحانات
*   **نظرية القيمة المتوسطة (IVT)**: لو الدالة متصلة في فترة، وقيمتها اتغيرت من سالب لموجب، يبقى أكيد عدت على الصفر. يعني فيه جذر (Root) للدالة في الفترة دي.`,
    flashcards: [
      {
        id: "fc-c1-1",
        term: "Indeterminate Form",
        definition: "A mathematical expression (like 0/0 or infinity/infinity) whose limit cannot be determined solely from the limits of the individual parts.",
        termAr: "كمية غير معينة",
        definitionAr: "تعبير رياضي (زي 0/0 أو مالانهاية/مالانهاية) قيمته مش واضحة بالتعويض المباشر ومحتاج تحليل أو استخدام قاعدة لوبيتال لحسابه."
      },
      {
        id: "fc-c1-2",
        term: "L'Hopital's Rule",
        definition: "A method to evaluate limits of indeterminate forms by differentiating the numerator and denominator.",
        termAr: "قاعدة لوبيتال",
        definitionAr: "طريقة لحساب نهايات الكميات غير المعينة عن طريق اشتقاق البسط لوحده والمقام لوحده وبعدين نعوض تاني."
      },
      {
        id: "fc-c1-3",
        term: "Intermediate Value Theorem",
        definition: "States that a continuous function on a closed interval [a,b] takes on every value between f(a) and f(b).",
        termAr: "نظرية القيمة المتوسطة",
        definitionAr: "بتقول إن لو الدالة متصلة على فترة مغلقة، فالدالة بتاخد كل القيم اللي بين نقطة البداية والنهاية ومستحيل تنط من غير ما تعدي عليهم."
      }
    ],
    exams: [
      {
        id: "calc-exam-1",
        title: "Calculus 1 - Mock Midterm (Engineering)",
        titleAr: "رياضيات 1 - امتحان تجريبي لميدترم هندسة",
        questions: [
          {
            id: "q-calc-1",
            question: "Evaluate the limit: lim (x -> 3) (x^2 - 9) / (x - 3)",
            questionAr: "احسب النهاية التالية: نهاية (x^2 - 9) / (x - 3) عندما تقترب x من 3",
            options: ["3", "6", "0", "Does not exist"],
            optionsAr: ["3", "6", "0", "غير موجودة"],
            correctAnswer: "6",
            correctAnswerAr: "6",
            explanation: "Substituting x = 3 gives 0/0. Factoring the numerator: (x - 3)(x + 3) / (x - 3). Canceling (x - 3) leaves (x + 3). Substituting x = 3 yields 3 + 3 = 6.",
            explanationAr: "بالتعويض المباشر عن x بـ 3 يطلع الناتج 0/0 (كمية غير معينة). نحلل البسط فرق بين مربعين: (x - 3)(x + 3). نختصر القوس الصفري (x - 3) من البسط والمقام، يتبقى لدينا (x + 3). بالتعويض المباشر الآن: 3 + 3 = 6."
          },
          {
            id: "q-calc-2",
            question: "What is the derivative of f(x) = x^3 - 5x + 4 with respect to x?",
            questionAr: "ما هي مشتقة الدالة f(x) = x^3 - 5x + 4 بالنسبة لـ x؟",
            options: ["3x^2 - 5", "3x^2 - 5x", "x^2 - 5", "3x^2 - 5 + 4"],
            optionsAr: ["3x^2 - 5", "3x^2 - 5x", "x^2 - 5", "3x^2 - 5 + 4"],
            correctAnswer: "3x^2 - 5",
            correctAnswerAr: "3x^2 - 5",
            explanation: "Using the power rule: d/dx(x^3) = 3x^2, d/dx(-5x) = -5, and d/dx(4) = 0. Adding these gives 3x^2 - 5.",
            explanationAr: "باستخدام قاعدة القوة: مشتقة الأول x^3 هي 3x^2، ومشتقة -5x هي -5، ومشتقة الثابت 4 هي صفر. نجمع المشتقات لتصبح النتيجة 3x^2 - 5."
          }
        ]
      }
    ],
    podcast: [
      {
        character: "Ahmed",
        characterName: "Ahmed (المحاور)",
        characterNameAr: "أحمد (المحاور)",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        text: "Hey everyone! Welcome to Kashkool Podcast. Today we are diving into Calculus 1, specifically Limits and Derivatives. I have with me our resident 'Dahiha' Sara. Sara, why do students find limits so confusing?",
        textAr: "يا هلا بيكم يا شباب في بودكاست كشكول! النهاردة هنبسط التفاضل والتكامل، وتحديداً النهايات والاشتقاق. معايا دحيحة الدفعة سارة. سارة، هو ليه الناس بتبعت تصيح من النهايات دي؟ الموضوع مرعب ولا إيه؟",
        audioTime: "0:00"
      },
      {
        character: "Sara",
        characterName: "Sara (الدحيحة)",
        characterNameAr: "سارة (الدحيحة)",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "Haha, not at all, Ahmed! Limits are actually super logical. It's just studying how a function behaves when we get extremely close to a point. Like, we don't care about what happens exactly at x = 3, we care about what happens at x = 2.99999 or 3.00001.",
        textAr: "هههههه لا خالص يا أحمد، الموضوع بسيط جداً لو فهمت الفكرة. النهايات هي بس دراسة سلوك الدالة لما نقرب أوي من نقطة. يعني مش مهم إيه اللي بيحصل عند الـ x بتساوى 3 بالظبط، المهم لما نقرب أوي منها زي 2.9999 أو 3.00001.",
        audioTime: "0:24"
      },
      {
        character: "Ahmed",
        characterName: "Ahmed (المحاور)",
        characterNameAr: "أحمد (المحاور)",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        text: "Okay, but what about the zero over zero (0/0) problem? Whenever I plug in the number in my exams, it gives me math error on the scientific calculator and I freeze!",
        textAr: "تمام، بس إيه حكاية الصفر على صفر (0/0) دي؟ كل ما أعوض في الامتحان الآلة تقولي Math Error وبحس إن مستقبلي بيضيع والمراقب بيبصلي!",
        audioTime: "0:45"
      },
      {
        character: "Sara",
        characterName: "Sara (الدحيحة)",
        characterNameAr: "سارة (الدحيحة)",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "Don't panic! 0/0 is just an 'indeterminate form'. It means the answer is hidden and we need to do some work to find it. In Egypt, professors love using three main tricks: factoring the brackets to cancel the bad terms, multiplying by the conjugate if there's a square root, or using the magic shortcut: L'Hopital's rule, where you differentiate the top and bottom separately. Easy peasy!",
        textAr: "ولا يهمك! 0/0 دي مجرد 'كمية غير معينة'، يعني القيمة موجودة بس مستخبية وعايزين نطلعها. الدكاترة عندنا في مصر بيحبوا تلات حيل أساسية: التحليل عشان تطير القوس الصفري، الضرب في المرافق لو فيه جذر تربيعي، أو الحل السحري السريع: قاعدة لوبيتال، تشتق البسط لوحده والمقام لوحده وتعوض وهيطلع معاك الحل علطول!",
        audioTime: "1:05"
      }
    ]
  },
  {
    id: "intro-cs",
    title: "Intro to Computer Science & Python",
    titleAr: "مقدمة علوم الحاسب والبرمجة بايثون",
    description: "Learn computer hardware basics, algorithms, and fundamental programming concepts using Python like loops, conditions, and lists.",
    descriptionAr: "تعلم أساسيات الكمبيوتر، الخوارزميات، ومفاهيم البرمجة الأساسية بلغة بايثون مثل الحلقات والشروط والمصفوفات.",
    category: "Computer Science",
    categoryAr: "حاسبات ومعلومات",
    sources: [
      {
        id: "cs-pdf-1",
        name: "Lec 1 - Computational Thinking & Python.pdf",
        type: "pdf",
        size: "950 KB",
        content: `Computer Science is the study of information processes, algorithms, and computers.
Computational Thinking involves 4 key pillars:
1. Decomposition: Breaking down a complex problem into smaller, manageable parts.
2. Pattern Recognition: Identifying similarities or trends within problems.
3. Abstraction: Focusing only on the important details and ignoring irrelevant information.
4. Algorithms: Creating step-by-step instructions to solve the problem.
Python Programming: Python is an interpreted, high-level language known for readability.
Variables and Data Types:
- Integer (e.g., x = 5)
- Float (e.g., y = 3.14)
- String (e.g., name = "Kashkool")
- Boolean (e.g., is_active = True)
Control Flow:
- If-Else conditions let the program make decisions.
- Loops (for and while) allow repetitive execution of code blocks.`,
        contentAr: `علم الحاسوب (Computer Science) هو دراسة خوارزميات معالجة البيانات وأجهزة الكمبيوتر.
التفكير الحاسوبي (Computational Thinking) يعتمد على 4 ركائز:
1. التفكيك (Decomposition): تقسيم المشكلة المعقدة لأجزاء صغيرة يسهل حلها.
2. التعرف على الأنماط (Pattern Recognition): تحديد التشابهات أو الاتجاهات المتكررة.
3. التجريد (Abstraction): التركيز على التفاصيل المهمة فقط وإهمال التفاصيل غير المؤثرة.
4. الخوارزميات (Algorithms): كتابة خطوات متتالية واضحة لحل المشكلة.
لغة البرمجة بايثون (Python): لغة عالية المستوى، مفسرة ومشهورة بسهولة قراءتها وكتابتها.
المتغيرات وأنواع البيانات:
- عدد صحيح Integer (مثل x = 5)
- عدد عشري Float (مثل y = 3.14)
- نص String (مثل name = "كشكول")
- منطقي Boolean (مثل is_active = True)
التحكم في سريان البرنامج:
- شروط (If-Else) لاتخاذ القرارات.
- التكرار (Loops) مثل for و while لتكرار كود معين عدة مرات.`
      },
      {
        id: "cs-yt-1",
        name: "Python Loops Tutorial - CodeZilla (YouTube)",
        type: "youtube",
        size: "22.1 MB",
        duration: "25:10",
        content: `CodeZilla Youtube Channel explains Python Loops in Egyptian Arabic.
A loop repeats instructions.
'For' loops are typically used when you know the number of iterations beforehand (e.g. iterating over a list).
Example:
for i in range(5):
    print("Mazaaker!", i)
'While' loops run as long as a condition is True. You must update the loop variable to prevent an infinite loop!
Example:
counter = 0
while counter < 5:
    print(counter)
    counter += 1`,
        contentAr: `قناة كودزيلا الشهيرة تشرح الحلقات التكرارية (Loops) بالعامية المصرية.
التكرار يعيد تشغيل الأوامر.
حلقة (For Loop) بتستخدم غالباً لما تكون عارف عدد مرات التكرار مسبقاً (زي المرور على عناصر قائمة).
مثال:
for i in range(5):
    print("مذاكر!", i)
حلقة (While Loop) بتفضل شغالة طول ما الشرط محقق وصحيح (True). لازم تزود العداد جوة اللوب عشان ما تدخلش في تكرار لا نهائي (Infinite Loop)!
مثال:
counter = 0
while counter < 5:
    print(counter)
    counter += 1`
      }
    ],
    studyGuide: `### 1. Computational Thinking
*   **Decomposition**: Break complex problems down.
*   **Abstraction**: Keep the simple, drop the noise.
*   **Algorithms**: Step-by-step logic.

### 2. Python Basics
*   **Syntax**: Indentation matters! Python uses spaces, not curly braces \`{}\`.
*   **Conditionals**:
    \`\`\`python
    if score >= 50:
        print("Passed! مبروك النجاح")
    else:
        print("Try again! شد حيلك")
    \`\`\`
*   **Loops**: Prevent infinite loops by incrementing variables inside \`while\` loops.`,
    studyGuideAr: `### 1. التفكير الحاسوبي (Computational Thinking)
*   **تفكيك المشاكل**: قسم المشكلة الكبيرة لمسائل صغيرة وحلها واحدة واحدة.
*   **التجريد**: ركز على المهم وسيبك من التفاصيل الجانبية اللي بتشتتك.
*   **الخوارزمية**: خطوات مترتبة لحل أي مشكلة برمجية.

### 2. أساسيات بايثون (Python Basics)
*   **المسافات البادئة (Indentation)**: بايثون بتعتمد على المسافات لتنظيم الكود مش الأقواس \`{}\`! لو المسافة غلط، الكود هيطلع Error (IndentationError).
*   **الجمل الشرطية**:
    \`\`\`python
    if score >= 50:
        print("Passed! مبروك النجاح")
    else:
        print("Try again! شد حيلك الترم الجاي")
    \`\`\`
*   **الحلقات التكرارية**: خد بالك في الـ \`while\` loop إنك تزود العداد عشان الكود ما يفضلش شغال للمالانهاية ويهنج الجهاز.`,
    flashcards: [
      {
        id: "fc-cs-1",
        term: "Indentation",
        definition: "The spaces at the beginning of a code line, used in Python to define code blocks instead of braces.",
        termAr: "المسافة البادئة (Indentation)",
        definitionAr: "المسافات اللي في أول السطر في بايثون، وبتستخدم لتحديد البلوك البرمجي التابع لـ if أو loop، وغيابها بيعمل خطأ في تشغيل الكود."
      },
      {
        id: "fc-cs-2",
        term: "Algorithm",
        definition: "A precise, step-by-step set of instructions to perform a calculation or solve a problem.",
        termAr: "الخوارزمية",
        definitionAr: "مجموعة من الخطوات المحددة والمرتبة منطقياً لحل مشكلة معينة أو عمل عملية حسابية."
      }
    ],
    exams: [
      {
        id: "cs-exam-1",
        title: "Introduction to Python Quiz",
        titleAr: "اختبار أساسيات لغة بايثون",
        questions: [
          {
            id: "q-cs-1",
            question: "Which of the following creates a variable with the value 5 as an integer in Python?",
            questionAr: "أي مما يلي يقوم بإنشاء متغير يحمل القيمة 5 كعدد صحيح في بايثون؟",
            options: ["x = 5", "int x = 5", "var x = 5", "x := 5"],
            optionsAr: ["x = 5", "int x = 5", "var x = 5", "x := 5"],
            correctAnswer: "x = 5",
            correctAnswerAr: "x = 5",
            explanation: "Python is dynamically typed. You do not need to declare the type (like int) or use 'var'. Simply use the assignment operator '='.",
            explanationAr: "بايثون لغة ذات نمط ديناميكي (dynamically typed)، يعني مش محتاج تحدد نوع المتغير (زي int) ولا تستخدم كلمة 'var'. بتكتب اسم المتغير وعلامة '=' والقيمة علطول."
          }
        ]
      }
    ],
    podcast: [
      {
        character: "Ahmed",
        characterName: "Ahmed (المحاور)",
        characterNameAr: "أحمد (المحاور)",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        text: "Welcome back! Today we are coding. We are talking about Python. Honestly Sara, Python looks too simple, is it actually a real language?",
        textAr: "منورين يا شباب! النهاردة هنتكلم برمجة وبايثون بالذات. بصي يا سارة، لغة بايثون دي شكلها سهل أوي لدرجة مريبة، هي لغة حقيقية بجد ولا لعبة لطلبة الكليات؟",
        audioTime: "0:00"
      },
      {
        character: "Sara",
        characterName: "Sara (الدحيحة)",
        characterNameAr: "سارة (الدحيحة)",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "Haha, it's very real! It runs Instagram, Spotify, and most AI systems in the world. Its simplicity is its strength. Instead of wasting time on semicolons and curly braces, you focus on the algorithm. But beware the spaces! Python uses indentation. One missing space and your code crashes.",
        textAr: "هههههه لا حقيقية جداً طبعاً! دي بتشغل إنستجرام وسبوتيفاي ومعظم أنظمة الذكاء الاصطناعي في العالم. سهولتها دي هي قوتها، بتخليك تركز في حل المشكلة مش في تفاصيل كتابة الكود والقوس المتقفل والفاصلة المنقوطة. بس خلي بالك من المسافات! مسافة واحدة ناقصة في أول السطر الكود هيزعل ويقف علطول.",
        audioTime: "0:25"
      }
    ]
  },
  {
    id: "anatomy",
    title: "Human Anatomy - Skeletal System",
    titleAr: "علم التشريح - الجهاز الهيكلي",
    description: "Detailed study of human bones, joints, skeletal structures, classifications, and common clinical pathologies for medical & nursing students.",
    descriptionAr: "دراسة مفصلة لعظام الإنسان، المفاصل، الهيكل العظمي وتصنيفاته، مع الحالات المرضية الشائعة لطلبة الطب والتمريض.",
    category: "Medicine",
    categoryAr: "كلية الطب والتمريض",
    sources: [
      {
        id: "anatomy-pdf-1",
        name: "Chapter 3: The Skeletal System Overview.pdf",
        type: "pdf",
        size: "2.4 MB",
        content: `The human skeletal system consists of 206 bones in adults.
Functions of the Skeletal System:
1. Support: Provides structural framework for the body.
2. Protection: Surrounds vital organs (e.g., skull protects brain, rib cage protects heart/lungs).
3. Movement: Skeletal muscles attach to bones via tendons, acting as levers.
4. Mineral Storage: Stores calcium and phosphorus.
5. Hemopoiesis: Red bone marrow produces red blood cells, white blood cells, and platelets.
Divisions of the Skeleton:
- Axial Skeleton (80 bones): Lies along the central axis. Includes skull, vertebral column, auditory ossicles, hyoid bone, and rib cage.
- Appendicular Skeleton (126 bones): Upper and lower limbs, plus pectoral (shoulder) and pelvic girdles.`,
        contentAr: `يتكون الجهاز الهيكلي البشري (Skeletal System) من 206 عظمة في الشخص البالغ.
وظائف الجهاز الهيكلي:
1. الدعم (Support): يوفر الهيكل البنائي والتدعيم للجسم.
2. الحماية (Protection): يحمي الأعضاء الحيوية (زي الجمجمة اللي بتحمي المخ، والقفص الصدري اللي بيحمي القلب والرئتين).
3. الحركة (Movement): بتثبت العضلات الهيكلية في العظام عن طريق الأوتار، فبتشتغل كرافع للحركة.
4. تخزين المعادن: مخزن أساسي للكالسيوم والفوسفور.
5. إنتاج خلايا الدم (Hemopoiesis): نخاع العظم الأحمر بينتج كرات الدم الحمراء والبيضاء والصفائح الدموية.
أقسام الهيكل العظمي:
- الهيكل العظمي المحوري (Axial Skeleton) ويحتوي على 80 عظمة: يقع على المحور المركزي للجسم (الجمجمة، العمود الفقري، والقفص الصدري).
- الهيكل العظمي الطرفي (Appendicular Skeleton) ويحتوي على 126 عظمة: يشمل الأطراف العلوية والسفلية، وعظام الحوض والكتف.`
      }
    ],
    studyGuide: `### 1. Bone Functions & Components
*   **Bones to know**: 206 bones in adult bodies.
*   **Hemopoiesis**: Production of blood cells inside red bone marrow.
*   **Storage**: Primary reservoir for Calcium ($Ca^{2+}$) and Phosphorus.

### 2. Axial vs Appendicular
*   **Axial (80 bones)**: Skull, Spine, Ribs. (Protects core)
*   **Appendicular (126 bones)**: Arms, Legs, Pelvis. (Enables movement)`,
    studyGuideAr: `### 1. وظائف العظام ومكوناتها
*   **العدد**: 206 عظمة في الإنسان البالغ.
*   **إنتاج خلايا الدم (Hemopoiesis)**: بيحصل جوة نخاع العظام الأحمر.
*   **التخزين**: هو المخزن الرئيسي للكالسيوم ($Ca^{2+}$) والفوسفور في الجسم.

### 2. الهيكل المحوري والطرفي
*   **الهيكل المحوري (80 عظمة)**: الجمجمة، العمود الفقري، والضلوع. (وظيفته الأساسية حماية المراكز الحيوية).
*   **الهيكل الطرفي (126 عظمة)**: الدراعين، الرجلين، وعظام الكتف والحوض. (وظيفته الأساسية الحركة والتحرك).`,
    flashcards: [
      {
        id: "fc-an-1",
        term: "Hemopoiesis",
        definition: "The process of blood cell formation, occurring inside the red bone marrow of specific bones.",
        termAr: "إنتاج خلايا الدم (Hemopoiesis)",
        definitionAr: "عملية تكوين خلايا الدم (كرات حمراء، بيضاء، صفائح) وبتحصل في نخاع العظام الأحمر."
      },
      {
        id: "fc-an-2",
        term: "Axial Skeleton",
        definition: "The 80 bones along the central axis of the body, including the skull, ribs, and vertebral column.",
        termAr: "الهيكل العظمي المحوري",
        definitionAr: "مجموعة الـ 80 عظمة اللي موجودة على المحور الطولي للجسم وبتحمي الأعضاء الأساسية زي المخ والنخاع الشوكي والقلب."
      }
    ],
    exams: [
      {
        id: "an-exam-1",
        title: "Anatomy - Bones & Skeleton Quiz",
        titleAr: "اختبار علم التشريح - العظام والهيكل العظمي",
        questions: [
          {
            id: "q-an-1",
            question: "How many bones are there in the adult human skeleton?",
            questionAr: "كم عدد العظام الموجودة في الهيكل العظمي للإنسان البالغ؟",
            options: ["206", "300", "180", "216"],
            optionsAr: ["206", "300", "180", "216"],
            correctAnswer: "206",
            correctAnswerAr: "206",
            explanation: "An adult human has 206 bones. Infants are born with around 270-300 bones, which fuse together as they grow.",
            explanationAr: "الشخص البالغ عنده 206 عظمة. لكن الأطفال بيتولدوا بحوالي 270 لـ 300 عظمة، وبتلتحم ببعضها مع النمو لحد ما يستقروا على 206."
          }
        ]
      }
    ],
    podcast: [
      {
        character: "Ahmed",
        characterName: "Ahmed (المحاور)",
        characterNameAr: "أحمد (المحاور)",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        text: "Today we have medical students with us! We are talking about the Skeletal System. 206 bones... Sara, why does a human need 206 bones? Isn't one big shield bone better?",
        textAr: "النهاردة بقى معانا طلبة الطب والتمريض! هنتكلم عن الجهاز الهيكلي وعظام الإنسان. 206 عظمة يا سارة! هو احنا ليه متفتفتين كده؟ ما كان كفاية عظمة واحدة تحمينا وخلاص؟",
        audioTime: "0:00"
      },
      {
        character: "Sara",
        characterName: "Sara (الدحيحة)",
        characterNameAr: "سارة (الدحيحة)",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "Haha! If we had one big shield, we would move like robots, Ahmed! The 206 bones are joined together at joints to give us flexibility. Plus, bones do way more than just structural support. They store your body's calcium and literally manufacture your red and white blood cells inside the red bone marrow. So your blood is manufactured inside your bones. Mind-blowing, right?",
        textAr: "هههههه لو عظمة واحدة كشيلد هنمشي زي الروبوتات ومش هنعرف نتني دراعنا حتى! الـ 206 عظمة دول متوصلين بمفاصل عشان نعرف نتحرك بمرونة. وكمان العظام مش مجرد دعامة، دي بتخزن الكالسيوم وبتصنع خلايا دمك الحمراء والبيضاء جوة نخاع العظام! يعني دمك بيتصنع جوة عضمك، سبحان الله!",
        audioTime: "0:25"
      }
    ]
  }
];

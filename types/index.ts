// ==================== USER & AUTH ====================
export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

// ==================== NOTEBOOKS ====================
export interface Notebook {
  id: string;
  user_id: string;
  title: string;
  color: string;
  emoji: string;
  source_count?: number;
  last_studied?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotebookInput {
  title: string;
  color?: string;
  emoji?: string;
}

// ==================== SOURCES ====================
export type SourceType = 'pdf' | 'text' | 'youtube';

export interface Source {
  id: string;
  notebook_id: string;
  type: SourceType;
  title: string;
  raw_content?: string;
  metadata?: SourceMetadata;
  storage_path?: string;
  created_at: string;
}

export interface SourceMetadata {
  pages?: number;
  duration?: string;
  url?: string;
  size?: string;
  word_count?: number;
}

// ==================== CHUNKS (RAG) ====================
export interface Chunk {
  id: string;
  source_id: string;
  notebook_id: string;
  content: string;
  chunk_index: number;
  embedding?: number[];
}

// ==================== CHAT ====================
export interface ChatMessage {
  id: string;
  notebook_id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  created_at: string;
}

export interface Citation {
  sourceId: string;
  sourceTitle: string;
  location: string;
}

// ==================== FLASHCARDS ====================
export type Difficulty = 'new' | 'easy' | 'hard' | 'again';

export interface Flashcard {
  id: string;
  notebook_id: string;
  question: string;
  answer: string;
  difficulty: Difficulty;
  next_review: string;
  review_count: number;
  source?: string;
  created_at: string;
}

export type FlashcardMode = 'study' | 'browse' | 'quiz';

// ==================== MIND MAP ====================
export interface MindMapNode {
  id: string;
  label: string;
  color: 'teal' | 'violet' | 'amber' | 'coral' | 'green' | 'gray';
  level: 1 | 2;
  parent?: string;
}

export interface MindMapEdge {
  from: string;
  to: string;
}

export interface MindMap {
  center: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

// ==================== SUMMARY ====================
export interface Summary {
  id: string;
  notebook_id: string;
  coreConcepts: string[];
  keyTerms: KeyTerm[];
  topicBreakdown: TopicBreakdown[];
  examQuestions: string[];
  connections: string;
  created_at: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface TopicBreakdown {
  topic: string;
  percentage: number;
}

// ==================== STUDY PLAN ====================
export interface StudyPlan {
  id: string;
  notebook_id: string;
  exam_date: string;
  hours_per_day: number;
  totalDays: number;
  days: StudyDay[];
  created_at: string;
}

export interface StudyDay {
  day: number;
  date: string;
  focus: string;
  tasks: StudyTask[];
}

export type TaskType = 'read' | 'flashcards' | 'review' | 'practice';

export interface StudyTask {
  type: TaskType;
  description: string;
  duration: number;
  completed?: boolean;
}

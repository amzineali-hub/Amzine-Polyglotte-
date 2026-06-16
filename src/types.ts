export interface VocabularyWord {
  id: string;
  term: string;
  translation: string;
  example: string;
  exampleTranslation?: string;
  notes?: string;
  learnedAt?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  translation: string;
}

export interface Quiz {
  title: string;
  topic: string;
  questions: QuizQuestion[];
}

export interface TextLesson {
  id: string;
  title: string;
  difficulty: "B1" | "B2";
  category: "Culture" | "Société" | "Histoire" | "Quotidien";
  text: string;
  englishSummary: string;
  vocabulary: Omit<VocabularyWord, "id">[];
  quiz: QuizQuestion[];
}

export interface DialogueScenario {
  id: string;
  title: string;
  difficulty: "B1" | "B2";
  icon: string;
  companionName: string;
  companionRole: string;
  userRole: string;
  setting: string;
  goal: string;
  initialGreeting: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: string;
  vocabularyList?: { term: string; definition: string }[];
  timestamp: string;
}

export interface SavedFlashcard {
  term: string;
  translation: string;
  example: string;
  notes?: string;
  savedAt: string;
}

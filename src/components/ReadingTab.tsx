import React, { useState } from "react";
import { TEXT_LESSONS } from "../data/lessons";
import { TextLesson, SavedFlashcard } from "../types";
import { BookOpen, Star, CheckCircle, AlertTriangle, ChevronRight, HelpCircle, FileText, Globe } from "lucide-react";
import { QuizMode } from "./QuizMode";

interface ReadingTabProps {
  onSaveFlashcard: (card: SavedFlashcard) => void;
  savedFlashcards: SavedFlashcard[];
  onCompleteLesson: (lessonId: string) => void;
  completedLessons: string[];
}

export function ReadingTab({
  onSaveFlashcard,
  savedFlashcards,
  onCompleteLesson,
  completedLessons,
}: ReadingTabProps) {
  const [selectedLesson, setSelectedLesson] = useState<TextLesson>(TEXT_LESSONS[0]);
  const [showEnglishSummary, setShowEnglishSummary] = useState(false);
  
  // Quiz state
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleSelectLesson = (lesson: TextLesson) => {
    setSelectedLesson(lesson);
    setShowEnglishSummary(false);
    setUserAnswers({});
    setSubmitted(false);
    setQuizScore(null);
  };

  const handleSelectOption = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    selectedLesson.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    setQuizScore(score);
    setSubmitted(true);
    
    if (score === selectedLesson.quiz.length) {
      onCompleteLesson(selectedLesson.id);
    }
  };

  const isFlashcardSaved = (term: string) => {
    return savedFlashcards.some((fc) => fc.term.toLowerCase() === term.toLowerCase());
  };

  const handleToggleVocabulary = (vocab: any) => {
    if (isFlashcardSaved(vocab.term)) return;
    onSaveFlashcard({
      term: vocab.term,
      translation: vocab.translation,
      example: vocab.example,
      savedAt: new Date().toISOString(),
    });
  };

  return (
    <div id="reading-lessons-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left pane: Lessons list */}
      <div id="lessons-list-column" className="lg:col-span-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2 mb-1">
          Lectures intermédiaires (B1 / B2)
        </h3>
        <div id="lessons-list" className="space-y-2">
          {TEXT_LESSONS.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isSelected = selectedLesson.id === lesson.id;
            return (
              <button
                key={lesson.id}
                id={`lesson-btn-${lesson.id}`}
                onClick={() => handleSelectLesson(lesson)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                  isSelected
                    ? "bg-brand-green-light border-brand-green shadow-sm ring-1 ring-brand-green/10"
                    : "bg-white border-[#E5E5E5] hover:border-gray-400"
                }`}
              >
                <div
                  className={`p-2 rounded-lg mt-0.5 ${
                    isCompleted ? "bg-brand-green-light text-brand-green" : "bg-brand-yellow-light text-brand-yellow"
                  }`}
                >
                  <BookOpen size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lesson.difficulty === "B2"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {lesson.difficulty}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                      {lesson.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm leading-tight truncate">
                    {lesson.title}
                  </h4>
                  {isCompleted && (
                    <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-2">
                      <CheckCircle size={12} strokeWidth={2.5} /> Complété
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right pane: Selected lesson content */}
      <div id="lesson-content-column" className="lg:col-span-8 space-y-6">
        <div id="lesson-header" className="bg-brand-green-light/40 border border-brand-green/20 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-brand-green bg-brand-green-light px-2.5 py-0.5 rounded-full">
              Niveau {selectedLesson.difficulty}
            </span>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
              • {selectedLesson.category}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-950 font-sans tracking-tight">
            {selectedLesson.title}
          </h2>
        </div>

        {/* The Text in French */}
        <div id="french-text-section" className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <FileText size={14} /> Le texte en français
          </h3>
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line font-sans">
            {selectedLesson.text}
          </p>

          <div id="translation-toggle" className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <p className="text-xs text-gray-500">
              Besoin d'aide ? Activez le résumé en anglais pour valider votre compréhension globale.
            </p>
            <button
              id="toggle-summary-btn"
              onClick={() => setShowEnglishSummary(!showEnglishSummary)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border border-[#E5E5E5] text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Globe size={13} />
              {showEnglishSummary ? "Masquer la traduction" : "Afficher la traduction"}
            </button>
          </div>

          {showEnglishSummary && (
            <div id="english-summary" className="bg-[#F8FAFC] border-l-4 border-sky-500 p-4 rounded-r-xl mt-3 animate-fadeIn">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wide block mb-1">
                English Translation / Summary
              </span>
              <p className="text-sm text-gray-700 leading-relaxed italic">{selectedLesson.englishSummary}</p>
            </div>
          )}
        </div>

        {/* Vocabulary Highlight list */}
        <div id="vocabulary-vocab-section" className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-3 flex items-center justify-between">
            <span>📚 Expressions idiomatiques & vocabulaire clé</span>
            <span className="text-[10px] text-brand-green font-normal normal-case">Cliquez sur l'étoile pour sauvegarder</span>
          </h3>
          <div id="vocab-items-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedLesson.vocabulary.map((vocab, index) => {
              const saved = isFlashcardSaved(vocab.term);
              return (
                <div
                  key={index}
                  className="p-3 border border-gray-100 bg-brand-green-light/20 rounded-xl flex items-start gap-2 justify-between group hover:bg-brand-green-light/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-950 text-sm flex items-center gap-1.5">
                      {vocab.term}
                    </p>
                    <p className="text-xs font-medium text-gray-500 italic mt-0.5">{vocab.translation}</p>
                    <p className="text-[11px] text-gray-600 leading-tight bg-white p-1.5 rounded-lg border border-gray-100 mt-2">
                       <strong className="text-[10px] text-gray-400">Ex :</strong> {vocab.example}
                    </p>
                  </div>
                  <button
                    id={`save-vocab-btn-${index}`}
                    onClick={() => handleToggleVocabulary(vocab)}
                    disabled={saved}
                    className={`ml-2 p-1.5 rounded-lg border transition-all ${
                      saved
                        ? "bg-brand-yellow-light text-brand-yellow-dark border-brand-yellow/30"
                        : "bg-white text-gray-400 hover:text-brand-yellow border-gray-200 hover:border-brand-yellow/30"
                    }`}
                    title={saved ? "Enregistré" : "Sauvegarder dans mes flashcards"}
                  >
                    <Star size={15} fill={saved ? "currentColor" : "none"} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comprehension Quiz */}
        <div id="comprehension-quiz-section" className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <HelpCircle size={14} /> Exercice de compréhension
            </h3>
            {completedLessons.includes(selectedLesson.id) && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle size={12} strokeWidth={2.5} /> Validé
              </span>
            )}
          </div>

          <div id="quiz-questions" className="space-y-6">
            {selectedLesson.quiz.map((q, qIdx) => {
              const selectedOption = userAnswers[qIdx];
              return (
                <div key={qIdx} className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm">
                    {qIdx + 1}. {q.question}
                  </p>
                  <p className="text-xs text-gray-500 italic">Translation: {q.translation.split("?")[0]}?</p>
                  
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      let optionStyle = "border-gray-200 bg-white hover:bg-gray-50 text-gray-800";
                      
                      if (isSelected) {
                        optionStyle = "border-brand-green bg-brand-green-light text-brand-green-dark ring-1 ring-brand-green/20";
                      }
                      
                      if (submitted) {
                        const isCorrectOpt = q.correctIndex === optIdx;
                        if (isCorrectOpt) {
                          optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500/20";
                        } else if (isSelected) {
                          optionStyle = "border-rose-500 bg-rose-50 text-rose-950 ring-1 ring-rose-500/20";
                        } else {
                          optionStyle = "border-gray-100 bg-white opacity-60 text-gray-400";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          id={`quiz-${qIdx}-opt-${optIdx}`}
                          disabled={submitted}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left p-2.5 px-3 rounded-lg border text-xs transition-all duration-150 flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {submitted && q.correctIndex === optIdx && (
                            <span className="text-emerald-600 font-bold text-[10px] uppercase">Réponse correcte</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-3 text-xs bg-white border border-gray-100 p-3 rounded-lg">
                      <p className="text-gray-800 leading-relaxed font-medium flex items-start gap-1">
                        <strong className="text-brand-green">Explication : </strong>
                        <span className="text-gray-600 font-normal">{q.explanation}</span>
                      </p>
                      <p className="text-gray-400 mt-1 italic text-[10px]">
                        Correct answer translation: {q.translation.split("?")[1] || q.translation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div id="quiz-submission-controls" className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!submitted ? (
              <>
                <p className="text-xs text-gray-500">
                  Répondez à toutes les questions pour valider la leçon ({Object.keys(userAnswers).length} / {selectedLesson.quiz.length} répondus).
                </p>
                <button
                  id="submit-lesson-quiz-btn"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < selectedLesson.quiz.length}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all ${
                    Object.keys(userAnswers).length === selectedLesson.quiz.length
                      ? "bg-brand-green text-white hover:bg-brand-green-dark hover:shadow-md cursor-pointer"
                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  }`}
                >
                  Valider mes réponses
                </button>
              </>
            ) : (
              <div id="quiz-score-display" className="w-full flex flex-col sm:flex-row items-center justify-between p-4 bg-brand-green-light/40 rounded-xl border border-brand-green/20">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full ${quizScore === selectedLesson.quiz.length ? "bg-brand-green-light border border-brand-green/30 text-brand-green" : "bg-brand-yellow-light text-brand-yellow"}`}>
                    {quizScore === selectedLesson.quiz.length ? (
                      <CheckCircle size={22} strokeWidth={2.5} />
                    ) : (
                      <AlertTriangle size={22} strokeWidth={2.5} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      Score : {quizScore} / {selectedLesson.quiz.length} corrects !
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {quizScore === selectedLesson.quiz.length
                        ? "Félicitations ! Vous avez acquis les compétences de cette lecture."
                        : "Réessayez pour obtenir un sans-faute et débloquer les points de réputations !"}
                    </p>
                  </div>
                </div>
                <button
                  id="retry-quiz-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setUserAnswers({});
                    setQuizScore(null);
                  }}
                  className="mt-3 sm:mt-0 font-semibold text-xs text-brand-green border border-brand-green/35 bg-white hover:bg-brand-green-light/30 px-4 py-2 rounded-lg transition-colors"
                >
                  Recommencer le quiz
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic AI Quiz Block */}
        {completedLessons.includes(selectedLesson.id) ? (
          <QuizMode
            lesson={selectedLesson}
            onSaveFlashcard={onSaveFlashcard}
            savedFlashcards={savedFlashcards}
          />
        ) : (
          <div className="bg-brand-green-light/30 border border-brand-green/20 p-6 rounded-2xl text-center space-y-3 mt-6">
            <h4 className="font-semibold text-gray-950 text-sm">🧠 Débloquez le Quiz de Perfectionnement IA</h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Répondez d'abord correctement aux questions de compréhension de base ci-dessus pour débloquer les exercices de perfectionnement dynamiques générés par l'IA de Gemini !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

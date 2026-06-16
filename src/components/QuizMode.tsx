import React, { useState, useEffect } from "react";
import { TextLesson, SavedFlashcard, Quiz, QuizQuestion } from "../types";
import { Sparkles, HelpCircle, Loader2, CheckCircle2, XCircle, AlertCircle, RefreshCw, Volume2, Bookmark, Star } from "lucide-react";
import { speakFrench } from "../utils/speech";

interface QuizModeProps {
  lesson: TextLesson;
  onSaveFlashcard: (card: SavedFlashcard) => void;
  savedFlashcards: SavedFlashcard[];
}

export function QuizMode({ lesson, onSaveFlashcard, savedFlashcards }: QuizModeProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Auto-generate or reset quiz when lesson changes
  useEffect(() => {
    setQuiz(null);
    setUserAnswers({});
    setSubmitted(false);
    setScore(null);
    setError(null);
  }, [lesson]);

  const generateAIQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setUserAnswers({});
    setSubmitted(false);
    setScore(null);

    try {
      const response = await fetch("/api/gemini/reading-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: lesson.title,
          text: lesson.text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue lors de la génération.");
      }

      const data = await response.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("Le format du quiz généré est invalide.");
      }

      setQuiz(data);
    } catch (err: any) {
      console.error("AI Quiz generation failed:", err);
      setError(err.message || "Impossible de se connecter au serveur de dialogue pour générer le quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!quiz) return;
    let computedScore = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        computedScore++;
      }
    });
    setScore(computedScore);
    setSubmitted(true);
  };

  const handleSaveQuizVocab = (term: string, translation: string) => {
    const isAlreadySaved = savedFlashcards.some(
      (c) => c.term.toLowerCase() === term.toLowerCase()
    );
    if (isAlreadySaved) return;

    onSaveFlashcard({
      term: term,
      translation: translation,
      example: `Tiré du quiz de la leçon "${lesson.title}"`,
      savedAt: new Date().toISOString(),
    });
  };

  const isFlashcardSaved = (term: string) => {
    return savedFlashcards.some((fc) => fc.term.toLowerCase() === term.toLowerCase());
  };

  return (
    <div
      id="ai-quiz-mode-container"
      className="bg-gradient-to-br from-brand-green-light/30 to-brand-green-light/10 border border-brand-green/20 p-6 rounded-2xl shadow-xs mt-6 space-y-6 animate-fadeIn"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-green/10 pb-4">
        <div className="flex items-start gap-3">
          <div className="bg-brand-green text-white p-2.5 rounded-xl shrink-0">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-brand-green-dark tracking-widest bg-brand-green-light px-2 py-0.5 rounded-md">
              Fonctionnalité IA
            </span>
            <h3 className="font-display font-bold text-gray-950 text-base md:text-lg mt-1">
              Perfectionnement : Quiz Interactif IA
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Générez de nouvelles questions exclusives basées sur la subtilité de ce texte.
            </p>
          </div>
        </div>

        {!quiz && !isLoading && (
          <button
            id="generate-ai-quiz-btn"
            onClick={generateAIQuiz}
            className="shrink-0 font-bold text-xs uppercase tracking-wider bg-brand-green text-white py-2.5 px-4 rounded-xl shadow-xs hover:bg-brand-green-dark hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Générer un quiz IA</span>
          </button>
        )}
      </div>

      {isLoading && (
        <div id="ai-quiz-loading" className="py-12 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-green-light rounded-full blur-xl opacity-50 animate-pulse"></div>
            <Loader2 className="animate-spin text-brand-green relative z-10" size={36} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-gray-800 font-sans">Analyse fine et génération des questions...</p>
            <p className="text-xs text-gray-400">Gemini formule vos défis de vocabulaire et de grammaire personnalisés.</p>
          </div>
        </div>
      )}

      {error && (
        <div id="ai-quiz-error" className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-rose-950 text-xs">
          <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={16} />
          <div className="space-y-2">
            <p className="font-semibold">Oops! Échec de la génération</p>
            <p className="text-rose-800 leading-relaxed">{error}</p>
            <button
              id="retry-ai-quiz-error-btn"
              onClick={generateAIQuiz}
              className="mt-1 flex items-center gap-1 font-bold text-brand-green border-b border-brand-green/20 hover:border-brand-green/70 overflow-hidden"
            >
              Réessayer la génération
            </button>
          </div>
        </div>
      )}

      {quiz && (
        <div id="ai-quiz-questions-wrapper" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-brand-green-dark bg-brand-green-light px-3 py-1 rounded-full border border-brand-green/20">
              {quiz.title}
            </p>
            <button
              id="regenerate-ai-quiz-btn"
              onClick={generateAIQuiz}
              className="text-xs font-semibold text-brand-green hover:text-brand-green-dark flex items-center gap-1 transition-colors cursor-pointer"
              title="Générer d'autres questions"
            >
              <RefreshCw size={13} />
              <span>Regénérer d'autres questions</span>
            </button>
          </div>

          <div className="space-y-5">
            {quiz.questions.map((q, qIdx) => {
              const selectedOption = userAnswers[qIdx];
              return (
                <div
                  key={qIdx}
                  className="space-y-3 p-4 bg-white rounded-xl border border-brand-green/10 shadow-3xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-950 text-sm">
                      {qIdx + 1}. {q.question}
                    </p>
                    <button
                      id={`speak-ai-question-${qIdx}`}
                      onClick={(e) => speakFrench(q.question, e)}
                      className="p-1 rounded-md text-gray-400 hover:text-brand-green hover:bg-brand-green-light/20 transition-colors shrink-0"
                      title="Écouter la question"
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 italic">Translation: {q.translation.split("?")[0]}?</p>

                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      let optionStyle = "border-gray-200 bg-white hover:bg-brand-green-light/20 text-gray-800";

                      if (isSelected) {
                        optionStyle = "border-brand-green bg-brand-green-light text-brand-green-dark font-semibold ring-1 ring-brand-green/10";
                      }

                      if (submitted) {
                        const isCorrectOpt = q.correctIndex === optIdx;
                        if (isCorrectOpt) {
                          optionStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium ring-1 ring-emerald-500/20";
                        } else if (isSelected) {
                          optionStyle = "border-rose-500 bg-rose-50 text-rose-950 ring-1 ring-rose-500/20";
                        } else {
                          optionStyle = "border-gray-100 bg-white opacity-60 text-gray-400";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          id={`ai-quiz-${qIdx}-opt-${optIdx}`}
                          disabled={submitted}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left p-2.5 px-3 rounded-lg border text-xs transition-all duration-150 flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {submitted && q.correctIndex === optIdx && (
                            <span className="text-emerald-700 font-bold text-[10px] uppercase tracking-wider">
                              Correct d'après l'IA
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-3 text-xs bg-brand-green-light/20 border border-brand-green/20 p-3 rounded-lg space-y-2">
                      <div className="text-gray-800 leading-relaxed font-medium">
                        <strong className="text-brand-green">Analyse IA : </strong>
                        <span className="text-gray-600 font-normal">{q.explanation}</span>
                      </div>
                      <div className="text-gray-400 italic text-[10px] flex items-center justify-between">
                        <span>Translation: {q.translation.split("?")[1] || q.translation}</span>
                        
                        {/* Instant save words/keyterms from correct answers */}
                        <button
                          id={`save-ai-vocab-btn-${qIdx}`}
                          onClick={() => handleSaveQuizVocab(q.options[q.correctIndex], `Défini en contexte de quiz : ${q.question}`)}
                          disabled={isFlashcardSaved(q.options[q.correctIndex])}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 transition-all ${
                            isFlashcardSaved(q.options[q.correctIndex])
                              ? "bg-brand-yellow-light text-brand-yellow-dark border-brand-yellow/30"
                              : "bg-white text-gray-500 border-gray-200 hover:text-brand-yellow hover:border-brand-yellow/30"
                          }`}
                        >
                          <Star size={10} fill={isFlashcardSaved(q.options[q.correctIndex]) ? "currentColor" : "none"} />
                          <span>{isFlashcardSaved(q.options[q.correctIndex]) ? "Enregistré" : "Flashcard"}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div id="ai-quiz-submission-controls" className="pt-4 border-t border-brand-green/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!submitted ? (
              <>
                <p className="text-xs text-gray-500">
                  Validez vos réponses pour comparer vos résultats avec la synthèse de Gemini ({Object.keys(userAnswers).length} / {quiz.questions.length} répondus).
                </p>
                <button
                  id="submit-ai-quiz-btn"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < quiz.questions.length}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all ${
                    Object.keys(userAnswers).length === quiz.questions.length
                      ? "bg-brand-green text-white hover:bg-brand-green-dark hover:shadow-md cursor-pointer"
                      : "bg-gray-100 text-gray-400 border border-gray-250 cursor-not-allowed"
                  }`}
                >
                  Valider mes réponses IA
                </button>
              </>
            ) : (
              <div id="ai-quiz-score-display" className="w-full flex flex-col sm:flex-row items-center justify-between p-4 bg-brand-green-light/40 rounded-xl border border-brand-green/20 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full ${score === quiz.questions.length ? "bg-brand-green-light border border-brand-green/30 text-brand-green" : "bg-brand-yellow-light text-brand-yellow"}`}>
                    {score === quiz.questions.length ? (
                      <CheckCircle2 size={22} strokeWidth={2.5} />
                    ) : (
                      <CheckCircle2 size={22} className="opacity-60" strokeWidth={2} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      Score de Compréhension : {score} / {quiz.questions.length} correctes !
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {score === quiz.questions.length
                        ? "Sans-faute légendaire ! Vous flânez avec aisance au sommet d'un niveau B1/B2."
                        : "Excellent effort culturel. Analysez les explications ci-dessus pour peaufiner vos nuances."}
                    </p>
                  </div>
                </div>
                <button
                  id="retry-ai-quiz-btn"
                  onClick={generateAIQuiz}
                  className="shrink-0 font-semibold text-xs text-brand-green border border-brand-green/30 bg-white hover:bg-brand-green-light/30 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Générer un autre quiz IA
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!quiz && !isLoading && !error && (
        <div className="text-center py-4 text-xs text-gray-400 italic">
          Cliquez sur le bouton ci-dessus pour initier l'analyse par l'IA et générer votre exercice interactif personnalisé.
        </div>
      )}
    </div>
  );
}

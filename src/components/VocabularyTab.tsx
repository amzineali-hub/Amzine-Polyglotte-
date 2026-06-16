import React, { useState } from "react";
import { SavedFlashcard } from "../types";
import { Star, RefreshCw, Layers, CheckCircle2, AlertCircle, Bookmark, Trash2, Smile, Volume2, AudioLines } from "lucide-react";
import { speakFrench } from "../utils/speech";

interface VocabularyTabProps {
  savedFlashcards: SavedFlashcard[];
  onRemoveFlashcard: (term: string) => void;
  onClearAllFlashcards: () => void;
  autoPronounce: boolean;
  onToggleAutoPronounce: (val: boolean) => void;
}

export function VocabularyTab({
  savedFlashcards,
  onRemoveFlashcard,
  onClearAllFlashcards,
  autoPronounce,
  onToggleAutoPronounce,
}: VocabularyTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"cards" | "test">("cards");
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  
  // Self-test game states
  const [testIndex, setTestIndex] = useState(0);
  const [isTestFlipped, setIsTestFlipped] = useState(false);
  const [testScores, setTestScores] = useState<{ [term: string]: "known" | "practice" }>({});

  const handleFlipCard = (index: number) => {
    if (flippedIndex === index) {
      setFlippedIndex(null);
    } else {
      setFlippedIndex(index);
    }
  };

  const handleTestEvaluation = (term: string, rating: "known" | "practice") => {
    setTestScores((prev) => ({ ...prev, [term]: rating }));
    setIsTestFlipped(false);
    
    // Auto-advance to next card after a small delay
    if (testIndex < savedFlashcards.length - 1) {
      setTimeout(() => {
        setTestIndex((prev) => prev + 1);
      }, 100);
    }
  };

  const resetTest = () => {
    setTestIndex(0);
    setIsTestFlipped(false);
    setTestScores({});
  };

  return (
    <div id="vocabulary-notebook-container" className="space-y-6">
      {/* Inner tabs filter bar */}
      <div id="vocab-nav" className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex gap-4">
          <button
            id="subtab-cards-btn"
            onClick={() => setActiveSubTab("cards")}
            className={`text-xs font-bold uppercase tracking-widest pb-1 transition-all border-b-2 ${
              activeSubTab === "cards" 
                ? "border-brand-yellow text-brand-yellow-dark" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Mes Flashcards ({savedFlashcards.length})
          </button>
          <button
            id="subtab-test-btn"
            onClick={() => {
              setActiveSubTab("test");
              resetTest();
            }}
            disabled={savedFlashcards.length === 0}
            className={`text-xs font-bold uppercase tracking-widest pb-1 transition-all border-b-2 ${
              savedFlashcards.length === 0 
                ? "opacity-40 cursor-not-allowed text-gray-300"
                : activeSubTab === "test" 
                  ? "border-brand-yellow text-brand-yellow-dark" 
                  : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Auto-Évaluation de Mémoire
          </button>
        </div>

        {savedFlashcards.length > 0 && activeSubTab === "cards" && (
          <button
            id="clear-all-flashcards-btn"
            onClick={onClearAllFlashcards}
            className="text-[10px] font-bold text-rose-600 uppercase tracking-wider hover:underline flex items-center gap-1"
          >
            <Trash2 size={11} /> Tout effacer
          </button>
        )}
      </div>

      {activeSubTab === "cards" ? (
        <div id="cards-tab-wrapper" className="space-y-6">
          {/* Audio Pronunciation settings block */}
          <div id="audio-pronounce-settings-card" className="bg-brand-yellow-light/20 border border-brand-yellow/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="bg-brand-yellow-light text-brand-yellow-dark p-2.5 rounded-xl shrink-0 border border-brand-yellow/10">
                <AudioLines size={18} strokeWidth={2.2} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-gray-900 font-sans">Prononciation Vocale Automatique IA</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Lit automatiquement à haute voix la prononciation française correcte de chaque nouveau terme enregistré.
                </p>
              </div>
            </div>
            
            {/* Beautiful, premium styled toggle switch */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                id="toggle-auto-pronounce-btn"
                onClick={() => onToggleAutoPronounce(!autoPronounce)}
                className={`relative w-11 h-6 transition-colors duration-200 rounded-full cursor-pointer outline-none ${
                  autoPronounce ? "bg-brand-yellow" : "bg-gray-200"
                }`}
                role="switch"
                aria-checked={autoPronounce}
                title={autoPronounce ? "Désactiver la prononciation automatique" : "Activer la prononciation automatique"}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 shadow-xs transform ${
                    autoPronounce ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-xs font-bold text-gray-700 min-w-[60px] select-none">
                {autoPronounce ? "Activée" : "Désactivée"}
              </span>
            </div>
          </div>

          {savedFlashcards.length === 0 ? (
            <div id="empty-flashcards-state" className="text-center py-16 bg-brand-yellow-light/10 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="bg-gray-100 p-3 rounded-full text-gray-400">
                <Layers size={30} />
              </div>
              <h4 className="font-bold text-gray-850 text-sm">Votre carnet est vide !</h4>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                Explorez les leçons de lecture ou parlez virtuellement à l'IA pour repérer du vocabulaire intéressant et l'ajouter d'un simple clic !
              </p>
            </div>
          ) : (
            <div id="flashcards-items-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {savedFlashcards.map((card, index) => {
                const isFlipped = flippedIndex === index;
                return (
                  <div
                    key={index}
                    id={`flashcard-${index}`}
                    onClick={() => handleFlipCard(index)}
                    className={`min-h-[160px] p-5 rounded-2xl border cursor-pointer transition-all duration-300 transform relative flex flex-col justify-between ${
                      isFlipped
                        ? "bg-brand-yellow-light/35 border-brand-yellow/30 shadow-md scale-[1.01]"
                        : "bg-white border-gray-200 hover:border-gray-400 shadow-2xs hover:shadow-xs"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-brand-yellow-dark uppercase tracking-widest flex items-center gap-1 bg-brand-yellow-light border border-brand-yellow/20 px-2 py-0.5 rounded-full">
                          <Bookmark size={9} /> B1 / B2
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`speak-flashcard-btn-${index}`}
                            onClick={(e) => speakFrench(card.term, e)}
                            className="p-1.5 rounded-md text-gray-450 hover:text-brand-yellow hover:bg-brand-yellow-light/40 transition-colors"
                            title="Écouter la prononciation"
                          >
                            <Volume2 size={13} />
                          </button>
                          <button
                            id={`delete-flashcard-btn-${index}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveFlashcard(card.term);
                            }}
                            className="p-1 rounded-md text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Supprimer la carte"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {!isFlipped ? (
                        <div className="pt-2">
                          <p className="text-base font-bold text-gray-900 tracking-tight font-sans">
                            {card.term}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-2 font-mono">Cliquez pour retourner ↴</p>
                        </div>
                      ) : (
                        <div className="pt-2 animate-fadeIn">
                          <p className="text-sm font-semibold text-brand-yellow-dark italic">
                            {card.translation}
                          </p>
                          <p className="text-[11px] text-gray-600 leading-normal mt-2.5 bg-white p-2 border border-gray-100 rounded-lg">
                            {card.example}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="self-end text-[10px] text-gray-400 font-mono">
                      {new Date(card.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Evaluation Self test screen */
        savedFlashcards.length > 0 && (
          <div id="self-evaluation-deck" className="max-w-md mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 font-mono">
                Carte {testIndex + 1} sur {savedFlashcards.length}
              </span>
              <button
                id="reset-test-game-btn"
                onClick={resetTest}
                className="text-xs font-semibold text-brand-yellow-dark flex items-center gap-1 hover:underline"
              >
                <RefreshCw size={12} /> Recommencer le test
              </button>
            </div>

            {/* Main Interactive card */}
            <div
              id="test-card-container"
              onClick={() => setIsTestFlipped(!isTestFlipped)}
              className={`min-h-[240px] p-8 rounded-3xl border-2 text-center flex flex-col justify-between cursor-pointer transition-all duration-300 transform ${
                isTestFlipped
                  ? "bg-[#FAF5FF] border-purple-300 shadow-md scale-[1.02]"
                  : "bg-brand-yellow-light/25 border-brand-yellow/30 shadow-lg"
              }`}
            >
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  {isTestFlipped ? "La Traduction" : "Le Terme Français"}
                </span>

                {!isTestFlipped ? (
                  <div className="py-6 space-y-4">
                    <p className="text-2xl font-extrabold text-gray-900 tracking-tight font-sans">
                      {savedFlashcards[testIndex].term}
                    </p>
                    <div className="flex justify-center">
                      <button
                        id="test-card-speak-btn"
                        onClick={(e) => speakFrench(savedFlashcards[testIndex].term, e)}
                        className="p-2 py-1.5 px-3 rounded-lg bg-brand-yellow-light text-brand-yellow-dark hover:bg-brand-yellow-light/60 transition-colors flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer"
                        title="Écouter la prononciation"
                      >
                        <Volume2 size={12} />
                        <span>Prononcer</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-mono">Touchez la carte pour découvrir le sens ↴</p>
                  </div>
                ) : (
                  <div className="py-2 space-y-4 animate-fadeIn">
                    <p className="text-xl font-bold text-purple-900">
                      {savedFlashcards[testIndex].translation}
                    </p>
                    <div className="bg-white p-3 rounded-xl border border-purple-100 text-left">
                      <p className="text-[11px] font-bold text-purple-400 uppercase tracking-widest mb-1">Mise en contexte :</p>
                      <p className="text-xs text-gray-700 leading-normal italic">
                        {savedFlashcards[testIndex].example}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-400 font-medium">
                {isTestFlipped ? "Cliquez de nouveau pour revoir le mot" : "Retournez pour évaluer vos acquis"}
              </div>
            </div>

            {/* Scoring controls */}
            {isTestFlipped && (
              <div id="test-scoring-controls" className="grid grid-cols-2 gap-4 animate-fadeIn">
                <button
                  id="mark-score-practice-btn"
                  onClick={() => handleTestEvaluation(savedFlashcards[testIndex].term, "practice")}
                  className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100/50 text-rose-800 text-xs font-bold font-sans flex items-center justify-center gap-2 transition-colors"
                >
                  <AlertCircle size={15} /> À réviser encore !
                </button>
                <button
                  id="mark-score-known-btn"
                  onClick={() => handleTestEvaluation(savedFlashcards[testIndex].term, "known")}
                  className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/50 text-emerald-800 text-xs font-bold font-sans flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 size={15} /> Je le maîtrise !
                </button>
              </div>
            )}

            {/* Global result stats panel */}
            <div id="test-results-panel" className="bg-white border border-gray-100 rounded-xl p-4 text-xs space-y-2">
              <h5 className="font-bold text-gray-950 uppercase tracking-wider text-[10px]">Résultats de la session :</h5>
              <div className="flex justify-between text-gray-600">
                <span>Maîtrisés : <strong className="text-emerald-600">{Object.values(testScores).filter(v => v === "known").length}</strong></span>
                <span>À travailler : <strong className="text-rose-600">{Object.values(testScores).filter(v => v === "practice").length}</strong></span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

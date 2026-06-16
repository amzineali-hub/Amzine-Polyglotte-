import React, { useState, useEffect } from "react";
import { SavedFlashcard } from "./types";
import { ReadingTab } from "./components/ReadingTab";
import { DialogueTab } from "./components/DialogueTab";
import { VocabularyTab } from "./components/VocabularyTab";
import { GrammarCorner } from "./components/GrammarCorner";
import { speakFrench } from "./utils/speech";
import { BookOpen, MessageSquare, Star, Sparkles, LogOut, Award, Menu, X, Landmark } from "lucide-react";

const STARTER_FLASHCARDS: SavedFlashcard[] = [
  {
    term: "bien que",
    translation: "although / even though (requires subjunctive)",
    example: "Bien qu'il fasse froid, nous irons nous promener aux Tuileries.",
    savedAt: new Date().toISOString(),
  },
  {
    term: "avoir hâte de",
    translation: "to look forward to / to be eager to",
    example: "J'ai hâte de déguster cette tarte tatin fraîchement cuite !",
    savedAt: new Date().toISOString(),
  },
  {
    term: "au fur et à mesure",
    translation: "as we go along / bit by bit",
    example: "Vous apprendrez de nouvelles expressions au fur et à mesure de vos discussions.",
    savedAt: new Date().toISOString(),
  },
  {
    term: "le remue-méninges",
    translation: "brainstorming session",
    example: "Faisons un petit remue-méninges afin de trouver la meilleure solution.",
    savedAt: new Date().toISOString(),
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"lessons" | "dialogues" | "notebook" | "helper">("lessons");
  const [savedFlashcards, setSavedFlashcards] = useState<SavedFlashcard[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [streak, setStreak] = useState(1);
  const [dialogueTurns, setDialogueTurns] = useState(0);
  const [autoPronounce, setAutoPronounce] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("french_auto_pronounce");
      return stored !== null ? stored === "true" : true;
    } catch {
      return true;
    }
  });

  const handleToggleAutoPronounce = (val: boolean) => {
    setAutoPronounce(val);
    localStorage.setItem("french_auto_pronounce", String(val));
  };

  // Load from local storage
  useEffect(() => {
    try {
      const storedCards = localStorage.getItem("french_saved_flashcards");
      if (storedCards) {
        setSavedFlashcards(JSON.parse(storedCards));
      } else {
        // Hydrate with starters so it's not empty
        setSavedFlashcards(STARTER_FLASHCARDS);
        localStorage.setItem("french_saved_flashcards", JSON.stringify(STARTER_FLASHCARDS));
      }

      const storedLessons = localStorage.getItem("french_completed_lessons");
      if (storedLessons) {
        setCompletedLessons(JSON.parse(storedLessons));
      }

      const storedStreak = localStorage.getItem("french_streak");
      if (storedStreak) {
        setStreak(parseInt(storedStreak, 10));
      }

      const storedTurns = localStorage.getItem("french_dialogue_turns");
      if (storedTurns) {
        setDialogueTurns(parseInt(storedTurns, 10));
      }
    } catch (e) {
      console.error("Local storage failed to parse:", e);
    }
  }, []);

  // Save to local storage on changes
  const handleSaveFlashcard = (card: SavedFlashcard) => {
    setSavedFlashcards((prev) => {
      const exists = prev.some((c) => c.term.toLowerCase() === card.term.toLowerCase());
      if (exists) return prev;
      const updated = [card, ...prev];
      localStorage.setItem("french_saved_flashcards", JSON.stringify(updated));
      if (autoPronounce) {
        speakFrench(card.term);
      }
      return updated;
    });
  };

  const handleRemoveFlashcard = (term: string) => {
    setSavedFlashcards((prev) => {
      const updated = prev.filter((c) => c.term.toLowerCase() !== term.toLowerCase());
      localStorage.setItem("french_saved_flashcards", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllFlashcards = () => {
    if (confirm("Voulez-vous supprimer toutes vos cartes mémoires ?")) {
      setSavedFlashcards([]);
      localStorage.setItem("french_saved_flashcards", JSON.stringify([]));
    }
  };

  const handleCompleteLesson = (lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const updated = [...prev, lessonId];
      localStorage.setItem("french_completed_lessons", JSON.stringify(updated));
      
      // Bump streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("french_streak", newStreak.toString());
      
      return updated;
    });
  };

  const handleAddDialogueMessage = () => {
    const nextTurns = dialogueTurns + 1;
    setDialogueTurns(nextTurns);
    localStorage.setItem("french_dialogue_turns", nextTurns.toString());
  };

  return (
    <div id="french-learning-app-root" className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans">
      {/* Elegantly Crafted Premium Header */}
      <header id="header-navbar" className="sticky top-0 z-50 bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-brand-green via-brand-yellow to-brand-red-core text-white p-2 rounded-xl flex items-center justify-center shadow-xs">
            <Landmark size={20} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-display font-bold text-gray-950 text-base md:text-lg tracking-tight leading-tight">
              Amzine Polyglotte
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Niveau Intermédiaire B1 / B2
            </p>
          </div>
        </div>

        {/* Level badge and Email */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[11px] font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
            amzine.ali@gmail.com
          </span>
          <div className="bg-brand-yellow-light border border-brand-yellow/30 text-brand-yellow-dark font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-3xs">
            <Award size={13} strokeWidth={2.5} />
            <span>Adhérent B1/B2</span>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main id="app-workspace-body" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Welcome message and Quote of the day B1/B2 style */}
        <div id="welcome-motivational-banner" className="bg-white border border-[#E5E5E5] rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-gray-950 text-lg md:text-xl tracking-tight">
              Bonjour, ravi de vous retrouver !
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
              "La langue française est une femme. Et cette femme est si belle, si fière, si modeste, si hardie, si touchante, si chaste, si noble, si familière, si folle..." — Anatole France. Continuez vos exercices d'aujourd'hui.
            </p>
          </div>
          <div className="bg-brand-green-light border border-brand-green/20 p-3 rounded-2xl shrink-0 self-start md:self-auto">
            <span className="text-[10px] font-bold text-brand-green-dark uppercase tracking-widest block mb-0.5">Citation polyglotte :</span>
            <p className="text-xs italic text-brand-green-dark font-semibold">"Petit à petit, l'oiseau fait son nid."</p>
          </div>
        </div>

        {/* Segmented workspace navigation Tabs */}
        <div id="workspace-tabs-bar" className="bg-white border border-[#E5E5E5] p-1.5 rounded-2xl flex flex-wrap gap-1.5 shadow-3xs">
          <button
            id="tab-lessons-btn"
            onClick={() => setActiveTab("lessons")}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === "lessons"
                ? "bg-brand-green text-white shadow-xs hover:bg-brand-green-dark"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <BookOpen size={14} />
            <span>Lectures & Quiz</span>
          </button>

          <button
            id="tab-dialogues-btn"
            onClick={() => setActiveTab("dialogues")}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === "dialogues"
                ? "bg-brand-yellow text-white shadow-xs hover:bg-brand-yellow-dark"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <MessageSquare size={14} />
            <span>Dialogues Interactifs IA</span>
          </button>

          <button
            id="tab-helper-btn"
            onClick={() => setActiveTab("helper")}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === "helper"
                ? "bg-brand-red-core text-white shadow-xs hover:bg-brand-red-dark"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Sparkles size={14} />
            <span>Coin Grammaire</span>
          </button>

          <button
            id="tab-notebook-btn"
            onClick={() => setActiveTab("notebook")}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === "notebook"
                ? "bg-brand-green text-white shadow-xs hover:bg-brand-green-dark"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Star size={14} />
            <span>Mes Flashcards ({savedFlashcards.length})</span>
          </button>
        </div>

        {/* Segmented workspace content panels */}
        <div id="workspace-core-view-port" className="bg-white border border-[#E5E5E5] p-6 rounded-3xl shadow-3xs min-h-[450px]">
          {activeTab === "lessons" && (
            <div className="animate-fadeIn">
              <ReadingTab
                onSaveFlashcard={handleSaveFlashcard}
                savedFlashcards={savedFlashcards}
                onCompleteLesson={handleCompleteLesson}
                completedLessons={completedLessons}
              />
            </div>
          )}

          {activeTab === "dialogues" && (
            <div className="animate-fadeIn">
              <DialogueTab
                onSaveFlashcard={handleSaveFlashcard}
                savedFlashcards={savedFlashcards}
                onAddDialogueMessage={handleAddDialogueMessage}
              />
            </div>
          )}

          {activeTab === "helper" && (
            <div className="animate-fadeIn">
              <GrammarCorner
                onSaveFlashcard={handleSaveFlashcard}
                savedFlashcards={savedFlashcards}
              />
            </div>
          )}

          {activeTab === "notebook" && (
            <div className="animate-fadeIn">
              <VocabularyTab
                savedFlashcards={savedFlashcards}
                onRemoveFlashcard={handleRemoveFlashcard}
                onClearAllFlashcards={handleClearAllFlashcards}
                autoPronounce={autoPronounce}
                onToggleAutoPronounce={handleToggleAutoPronounce}
              />
            </div>
          )}
        </div>
      </main>

      {/* Aesthetic Parisian-Inspired Footer footer */}
      <footer id="app-footer-bar" className="bg-white border-t border-[#E5E5E5] py-6 px-6 text-center text-xs text-gray-400 font-medium">
        <p>
          Amzine Polyglotte © 2026 — Conçu spécifiquement pour la fluidité B1/B2. 
          Propulsé de manière éthique et sécurisée par Google Gemini 3.5 Flash.
        </p>
      </footer>
    </div>
  );
}

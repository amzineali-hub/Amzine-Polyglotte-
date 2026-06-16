import React, { useState, useRef, useEffect } from "react";
import { DIALOGUE_SCENARIOS } from "../data/scenarios";
import { DialogueScenario, ChatMessage, SavedFlashcard } from "../types";
import { 
  MessageSquare, Send, RefreshCw, Star, Play, CheckCircle, 
  HelpCircle, ChevronRight, User, Sparkles, BookOpen, Clock, Loader2 
} from "lucide-react";

interface DialogueTabProps {
  onSaveFlashcard: (card: SavedFlashcard) => void;
  savedFlashcards: SavedFlashcard[];
  onAddDialogueMessage: () => void;
}

export function DialogueTab({
  onSaveFlashcard,
  savedFlashcards,
  onAddDialogueMessage,
}: DialogueTabProps) {
  const [selectedScenario, setSelectedScenario] = useState<DialogueScenario | null>(null);
  const [chatHistory, setChatHistory] = useState<{ [scenarioId: string]: ChatMessage[] }>({});
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, selectedScenario]);

  const handleStartScenario = (scenario: DialogueScenario) => {
    setSelectedScenario(scenario);
    setErrorStatus(null);
    setInputText("");

    // Initialize with greeter if empty
    if (!chatHistory[scenario.id] || chatHistory[scenario.id].length === 0) {
      setChatHistory((prev) => ({
        ...prev,
        [scenario.id]: [
          {
            id: "initial-greet",
            role: "assistant",
            content: scenario.initialGreeting,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      }));
    }
  };

  const currentMessages = selectedScenario ? chatHistory[selectedScenario.id] || [] : [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedScenario || loading) return;

    const userMessageContent = inputText.trim();
    setInputText("");
    setLoading(true);
    setErrorStatus(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update state with user message immediately
    const updatedMessages = [...currentMessages, userMsg];
    setChatHistory((prev) => ({
      ...prev,
      [selectedScenario.id]: updatedMessages,
    }));

    onAddDialogueMessage();

    try {
      // Map ChatMessage format for API
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          scenario: {
            title: selectedScenario.title,
            companionRole: selectedScenario.companionRole,
            userRole: selectedScenario.userRole,
            setting: selectedScenario.setting,
            goal: selectedScenario.goal,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de joindre le tuteur de français.");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const companionMsg: ChatMessage = {
        id: `companion-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        feedback: data.feedback,
        vocabularyList: data.newVocabulary,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatHistory((prev) => ({
        ...prev,
        [selectedScenario.id]: [...updatedMessages, companionMsg],
      }));
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Erreur de connexion avec l'IA. Vérifiez que la clé GEMINI_API_KEY est configurée.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    if (!selectedScenario) return;
    if (confirm("Voulez-vous réinitialiser le dialogue de ce scénario ?")) {
      setChatHistory((prev) => ({
        ...prev,
        [selectedScenario.id]: [
          {
            id: `greet-${Date.now()}`,
            role: "assistant",
            content: selectedScenario.initialGreeting,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      }));
      setErrorStatus(null);
    }
  };

  const handleSaveVocabulary = (term: string, definition: string) => {
    const isSaved = savedFlashcards.some((fc) => fc.term.toLowerCase() === term.toLowerCase());
    if (isSaved) return;

    onSaveFlashcard({
      term,
      translation: definition,
      example: "Appris dans le scénario : " + (selectedScenario?.title || "Dialogue"),
      savedAt: new Date().toISOString(),
    });
  };

  const isWordSaved = (term: string) => {
    return savedFlashcards.some((fc) => fc.term.toLowerCase() === term.toLowerCase());
  };

  return (
    <div id="dialogues-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
      {/* Left sidebar - Select Scenario */}
      <div id="scenario-selector-sidebar" className="lg:col-span-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">
          Jeux de rôle & conversations
        </h3>
        <p className="text-xs text-gray-500 px-2 leading-relaxed">
          Sélectionnez un scénario du quotidien ou professionnel pour converser avec notre tuteur virtuel.
        </p>

        <div id="scenarios-list" className="space-y-2 mt-3">
          {DIALOGUE_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenario?.id === scenario.id;
            const messagesList = chatHistory[scenario.id] || [];
            const isStarted = messagesList.length > 1;

            return (
              <button
                key={scenario.id}
                id={`scenario-btn-${scenario.id}`}
                onClick={() => handleStartScenario(scenario)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? "bg-brand-yellow-light/40 border-brand-yellow shadow-sm ring-1 ring-brand-yellow/10"
                    : "bg-white border-[#E5E5E5] hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scenario.difficulty === "B2"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    Niveau {scenario.difficulty}
                  </span>
                  {isStarted && (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Clock size={10} /> En cours
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-gray-950 text-sm leading-tight mt-1.5">{scenario.title}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-normal">
                   <strong>Cadre :</strong> {scenario.setting}
                </p>

                <div className="flex items-center justify-between mt-3 text-xs font-semibold text-brand-yellow-dark group">
                  <span className="flex items-center gap-1">
                    {isSelected ? "En discussion active" : "Démarrer le jeu de rôle"}
                  </span>
                  <ChevronRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Box - Live Dialogue interface */}
      <div id="conversational-chat-box" className="lg:col-span-8 flex flex-col bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs min-h-[500px]">
        {selectedScenario ? (
          <>
            {/* Active Companion Header */}
            <div id="companion-chat-header" className="bg-brand-yellow-light/10 border-b border-[#E5E5E5] p-4 px-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-950 text-sm">{selectedScenario.title}</h3>
                  <span className="text-[10px] font-bold bg-brand-yellow-light border border-brand-yellow/30 text-brand-yellow">
                     {selectedScenario.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Interlocuteur : <span className="font-semibold text-gray-700">{selectedScenario.companionName}</span> ({selectedScenario.companionRole})
                </p>
              </div>
              <button
                id="reset-chat-btn"
                onClick={handleResetChat}
                className="p-2 text-gray-400 hover:text-brand-yellow hover:bg-brand-yellow-light/40 rounded-lg transition-all"
                title="Recommencer à zéro"
              >
                <RefreshCw size={15} />
              </button>
            </div>

            {/* Roleplay Objective Reminder banner */}
            <div id="scenario-goal-banner" className="bg-amber-50/50 border-b border-amber-200/50 p-3.5 px-6">
              <p className="text-xs text-amber-950 leading-relaxed">
                🎯 <strong>Votre rôle :</strong> {selectedScenario.userRole}. <br />
                🎯 <strong>Votre objectif :</strong> {selectedScenario.goal}
              </p>
            </div>

            {/* Conversation Flow Area */}
            <div id="chat-messages-scroll-area" className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[400px]">
              {currentMessages.map((msg, index) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div key={msg.id || index} className="space-y-2">
                    {/* Message Bubble container */}
                    <div className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}>
                      {isAssistant && (
                        <div className="w-8 h-8 rounded-full bg-[#FAF5FF] border border-[#E9D5FF] flex items-center justify-center text-purple-700 shrink-0 select-none">
                          <Sparkles size={14} />
                        </div>
                      )}
                      
                      <div className="max-w-[85%] group">
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed ${
                            isAssistant
                              ? "bg-gray-100 text-gray-900 rounded-tl-none font-sans"
                              : "bg-brand-yellow text-white rounded-tr-none font-sans font-medium"
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.content}</p>
                        </div>
                        <span className={`text-[9px] text-gray-400 mt-1 block ${isAssistant ? "text-left pl-1" : "text-right pr-1"}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Rich feedback box if partner has tips or correction list */}
                    {isAssistant && (msg.feedback || (msg.vocabularyList && msg.vocabularyList.length > 0)) && (
                      <div className="ml-11 mr-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-3 shadow-2xs">
                        {msg.feedback && (
                          <div>
                            <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wilder block mb-0.5">
                              Aide & corrections linguistiques du tuteur B1/B2
                            </span>
                            <p className="text-xs text-gray-700 leading-normal bg-white p-2.5 rounded-lg border border-slate-100">
                              {msg.feedback}
                            </p>
                          </div>
                        )}

                        {msg.vocabularyList && msg.vocabularyList.length > 0 && (
                          <div className="border-t border-gray-100 pt-2">
                            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wilder block mb-1">
                              Vocabulaire d'intérêt introduit
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.vocabularyList.map((item, vIdx) => {
                                const saved = isWordSaved(item.term);
                                return (
                                  <div key={vIdx} className="bg-white border border-gray-50 p-2 rounded-lg flex items-center justify-between gap-1">
                                    <div className="text-[11px] min-w-0">
                                      <p className="font-semibold text-gray-950 truncate">{item.term}</p>
                                      <p className="text-[10px] text-gray-500 truncate italic">{item.definition}</p>
                                    </div>
                                    <button
                                      id={`save-item-${index}-${vIdx}`}
                                      onClick={() => handleSaveVocabulary(item.term, item.definition)}
                                      disabled={saved}
                                      className={`p-1 rounded-md transition-all ${
                                        saved
                                          ? "text-amber-600 bg-amber-50"
                                          : "text-gray-400 hover:text-amber-500 hover:bg-gray-50"
                                      }`}
                                      title={saved ? "Sauvegardé !" : "Enregistrer"}
                                    >
                                      <Star size={12} fill={saved ? "currentColor" : "none"} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Waiting companion chat bubble placeholder */}
              {loading && (
                <div className="flex gap-3 justify-start animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-brand-yellow-light flex items-center justify-center text-brand-yellow shrink-0">
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div className="bg-gray-100 text-gray-600 p-4 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                    <span className="font-medium">{selectedScenario.companionName} réfléchit à sa réponse...</span>
                  </div>
                </div>
              )}

              {/* API Key Missing error fallback */}
              {errorStatus && (
                <div id="ai-error-banner" className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 leading-normal">
                  <p className="font-bold">Erreur de traitement par l'IA :</p>
                  <p className="mt-1">{errorStatus}</p>
                  <p className="mt-2 text-gray-500">
                     Veuillez vous assurer que la variable d'environnement <strong>GEMINI_API_KEY</strong> est bien entrée dans l'onglet des secrets du panneau Google AI Studio. En attendant, faites appel aux textes statiques du premier onglet !
                  </p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Submission Bar Area */}
            <form id="chat-input-toolbar-form" onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#E5E5E5] flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Écrivez votre réponse en français... (e.g. « Bonjour ! J'aimerais acheter... »)"
                disabled={loading}
                className="flex-1 border border-[#E5E5E5] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-yellow transition-colors"
                id="chat-sentence-input-box"
              />
              <button
                type="submit"
                id="send-chat-payload-btn"
                disabled={loading || !inputText.trim()}
                className={`p-3 rounded-xl transition-all font-semibold flex items-center justify-center ${
                  inputText.trim() && !loading
                    ? "bg-brand-yellow text-white hover:bg-brand-yellow-dark hover:shadow"
                    : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                }`}
                title="Envoyer la réplique"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div id="empty-companion-state" className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 space-y-3">
            <div className="bg-brand-yellow-light/40 p-4 rounded-full border border-gray-100 text-brand-yellow">
              <MessageSquare size={36} strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Dialogue interactif avec l'IA</h3>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Sélectionnez un scénario sur la gauche pour entamer un jeu de rôle ludique. L'IA réagira avec correction de votre grammaire et traduction à la volée !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

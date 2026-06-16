import React, { useState } from "react";
import { Sparkles, Loader2, Star, Check, Globe } from "lucide-react";
import { SavedFlashcard } from "../types";

interface GrammarCornerProps {
  onSaveFlashcard: (card: SavedFlashcard) => void;
  savedFlashcards: SavedFlashcard[];
}

export function GrammarCorner({ onSaveFlashcard, savedFlashcards }: GrammarCornerProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setErrorText(null);
    setResult(null);

    try {
      const response = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText.trim(),
          context: "Analyse libre de l'apprenant dans le coin grammaire"
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de joindre le tuteur de français.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Erreur de connexion. Assurez-vous que votre clé GEMINI_API_KEY est bien configurée.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = (vocab: any) => {
    onSaveFlashcard({
      term: vocab.term,
      translation: vocab.translation,
      example: vocab.example,
      savedAt: new Date().toISOString()
    });
  };

  const isWordSaved = (term: string) => {
    return savedFlashcards.some((w) => w.term.toLowerCase() === term.toLowerCase());
  };

  return (
    <div id="grammar-corner-wrapper" className="space-y-6">
      <div id="grammar-banner" className="bg-brand-red-light/40 border border-brand-red-core/20 p-5 rounded-2xl">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Sparkles size={16} className="text-brand-red-core animate-pulse" /> L'Analyseur intelligent de français
        </h3>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          Saisissez n'importe quelle phrase en français (une expression que vous venez d'entendre, un paragraphe que vous essayez d'écrire, etc.). L'IA va la décomposer, traduire, corriger les éventuelles erreurs et vous expliquer le mécanisme grammatical utilisé.
        </p>
      </div>

      <div id="grammar-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input pane */}
        <form id="grammar-analysis-form" onSubmit={handleAnalyze} className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor="grammar-text" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-1">
              Votre texte en français
            </label>
            <textarea
              id="grammar-text"
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Exemple : « Hier, je suis allé à la boulangerie bien que j'aie déjà mangé du pain. »"
              className="w-full text-sm border border-[#E5E5E5] p-3.5 rounded-2xl focus:outline-none focus:border-brand-red-core transition-colors leading-relaxed bg-white"
            />
          </div>

          <button
            type="submit"
            id="start-grammar-analysis-btn"
            disabled={loading || !inputText.trim()}
            className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 ${
              inputText.trim() && !loading
                ? "bg-brand-red-core text-white hover:bg-brand-red-dark hover:shadow cursor-pointer"
                : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Analyse IA en cours...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Analyser l'expression
              </>
            )}
          </button>
        </form>

        {/* Output outcome pane */}
        <div id="analysis-outcome-panel" className="lg:col-span-7 bg-white border border-[#E5E5E5] rounded-2xl p-6 min-h-[300px] flex flex-col justify-between">
          {loading ? (
            <div id="loading-grammar-state" className="flex-1 flex flex-col items-center justify-center space-y-3">
              <Loader2 size={32} className="animate-spin text-brand-red-core" />
              <p className="text-xs text-gray-500 font-medium">Décomposition grammaticale, traduction et glossaire en préparation...</p>
            </div>
          ) : errorText ? (
            <div id="analysis-err-state" className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 leading-normal">
              <p className="font-bold">Erreur rencontrée :</p>
              <p className="mt-1">{errorText}</p>
              <p className="mt-2 text-gray-500">
                Assurez-vous que votre clé d'API Google Gemini est configurée dans le coin supérieur Secrets du projet.
              </p>
            </div>
          ) : result ? (
            <div id="analysis-results-loaded" className="space-y-5 animate-fadeIn">
              {/* Traduction */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block mb-1">Traduction / English translation</span>
                <p className="text-sm text-slate-700 italic">"{result.translation}"</p>
              </div>

              {/* Correction constructives */}
              {result.corrections && (
                <div className="border border-brand-yellow/30 bg-brand-yellow-light/20 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-brand-yellow-dark uppercase tracking-wider block mb-1">Correction et style conseillés</span>
                  <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                    {result.corrections}
                  </p>
                </div>
              )}

              {/* Notes Grammaticales */}
              {result.grammarNotes && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Décryptage grammatical</span>
                  <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed bg-neutral-50 border border-neutral-100 p-4 rounded-xl">
                    {result.grammarNotes}
                  </div>
                </div>
              )}

              {/* Vocabulaire d'intérêt */}
              {result.vocabulary && result.vocabulary.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Mots et tournures clés</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.vocabulary.map((v: any, index: number) => {
                      const isSaved = isWordSaved(v.term);
                      return (
                        <div key={index} className="p-3 bg-white border border-gray-100 rounded-xl flex items-start justify-between gap-1">
                          <div className="text-[11px] min-w-0">
                            <p className="font-semibold text-gray-900">{v.term}</p>
                            <p className="text-gray-500 font-medium italic mt-0.5">{v.translation}</p>
                            <p className="text-[9px] text-gray-400 line-clamp-2 mt-1 leading-normal">
                              Ex : {v.example}
                            </p>
                          </div>
                          <button
                            id={`save-word-btn-${index}`}
                            onClick={() => handleSaveWord(v)}
                            disabled={isSaved}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isSaved
                                ? "bg-brand-yellow-light text-brand-yellow-dark border-brand-yellow/30"
                                : "bg-white text-gray-400 hover:text-brand-yellow border-gray-200 hover:border-brand-yellow/30"
                            }`}
                            title={isSaved ? "Sauvegardé" : "Enregistrer"}
                          >
                            <Star size={12} fill={isSaved ? "currentColor" : "none"} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div id="grammar-empty-state" className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-2">
              <Sparkles size={28} className="text-gray-300" />
              <p className="text-xs font-semibold text-gray-800">Aucun texte analysé</p>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">Saisissez une phrase ou paragraphe en français dans le panneau gauche pour démarrer le décodage grammatical immédiat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

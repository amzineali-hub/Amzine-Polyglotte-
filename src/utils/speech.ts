import React from "react";

/**
 * Helper utility to speak text in French using the Web Speech Synthesis API.
 */
export const speakFrench = (text: string, e?: React.MouseEvent) => {
  if (e) {
    e.stopPropagation(); // Avoid triggering card flip or select actions on parent elements
  }
  
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("La synthèse vocale n'est pas supportée dans ce navigateur.");
    return;
  }

  try {
    // Stop existing speech to ensure instant feedback on consecutive clicks
    window.speechSynthesis.cancel();

    // Create utterance configured for French
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";

    // Retrieve proper French voice if available in the system
    const voices = window.speechSynthesis.getVoices();
    // Prioritize B1/B2 preferred natural sounding voices if possible
    const voice = voices.find((v) => v.lang.startsWith("fr-") || v.lang === "fr-FR");
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Speech synthesis failed:", error);
  }
};

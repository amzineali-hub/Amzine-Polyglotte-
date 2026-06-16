import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy initialization of Gemini SDK on-demand
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key === "") {
      throw new Error("Clé d'API GEMINI_API_KEY non configurée. Veuillez ajouter votre clé dans l'onglet 'Secrets' de l'interface Google AI Studio d'abord.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// JSON body parser
app.use(express.json());

// API route: Explain or correct a French phrase
app.post("/api/gemini/explain", async (req, res) => {
  try {
    const { text, context } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const prompt = `Vous êtes un tuteur de français expérimenté qui enseigne à des apprenants de niveau intermédiaire (B1/B2). 
Analysez le texte ou la phrase suivante : "${text}".
Le contexte de l'utilisateur est : "${context || "Analyse générale"}".

Fournissez une réponse structurée en JSON contenant :
1. "translation" : Traduction professionnelle en anglais.
2. "corrections" : Si l'utilisateur s'est trompé, proposez des corrections constructives en français simple. Si c'est correct, expliquez pourquoi ou proposez des variantes plus naturelles.
3. "grammarNotes" : Explications claires des points de grammaire importants présents dans la phrase (temps, accords, pronoms, subjonctif, etc.) adaptés au niveau B1/B2.
4. "vocabulary" : Un tableau d'objets { term: string, translation: string, example: string } pour les mots-clés ou expressions idiomatiques présents.

Renvoyez uniquement l'objet JSON correspondant à ce schéma. Ne mettez pas de balises de code Markdown.`;

    const response = await getGeminiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             translation: { type: Type.STRING },
             corrections: { type: Type.STRING },
             grammarNotes: { type: Type.STRING },
             vocabulary: {
                type: Type.ARRAY,
                items: {
                   type: Type.OBJECT,
                   properties: {
                      term: { type: Type.STRING },
                      translation: { type: Type.STRING },
                      example: { type: Type.STRING }
                   },
                   required: ["term", "translation", "example"]
                }
             }
          },
          required: ["translation", "grammarNotes", "vocabulary"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/gemini/explain:", error);
    res.status(500).json({ error: error.message || "Erreur de traitement des explications." });
  }
});

// API route: Generate intermediate French quiz dynamically
app.post("/api/gemini/quiz", async (req, res) => {
  try {
    const { topic } = req.body; // e.g. "Le Subjonctif", "Au restaurant", "Les pronoms Y et EN"
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const prompt = `Générez un quiz de français de niveau intermédiaire (B1/B2) sur le thème : "${topic}".
Le quiz doit comporter exactement 5 questions à choix multiples.
Chaque question résout un problème intermédiaire de grammaire, de vocabulaire, d'expressions élégantes ou de compréhension dans ce thème. 

Fournissez la réponse uniquement au format JSON avec le schéma suivant :
{
  "title": "Nom du Quiz",
  "questions": [
    {
      "question": "Énoncé de la question en français",
      "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
      "correctIndex": 0, // Indice de la bonne réponse entre 0 et 3
      "explanation": "Explication détaillée du choix de réponse correct en français, y compris les règles de grammaire associées",
      "translation": "Traduction de la question et de la bonne réponse en anglais"
    }
  ]
}

Ne mettez pas de balises de code Markdown. Renvoie uniquement l'objet JSON.`;

    const response = await getGeminiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  translation: { type: Type.STRING }
                },
                required: ["question", "options", "correctIndex", "explanation", "translation"]
              }
            }
          },
          required: ["title", "questions"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/gemini/quiz:", error);
    res.status(500).json({ error: error.message || "Erreur de génération de quiz." });
  }
});

// API route: Generate dynamic reading comprehension quiz based on custom text
app.post("/api/gemini/reading-quiz", async (req, res) => {
  try {
    const { title, text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const prompt = `Générez un quiz de français de niveau intermédiaire (B1/B2) basé exclusivement sur la lecture suivante :
Titre : "${title || "Texte inconnu"}"
Texte : "${text}"

Le quiz doit comporter exactement 3 questions à choix multiples pour tester rigoureusement la compréhension de l'écrit (compréhension fine, vocabulaire en contexte ou grammaire utilisée).
Chaque question doit posséder 4 options (la bonne réponse doit varier d'indice d'une question à l'autre).

Fournissez la réponse uniquement au format JSON avec le schéma suivant :
{
  "title": "Quiz IA - ${title || "Lecture"}",
  "questions": [
    {
      "question": "Énoncé de la question en français",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0, // Indice de la bonne réponse (0-3)
      "explanation": "Explication claire du choix correct en français",
      "translation": "English translation of the question and the correct choice"
    }
  ]
}

Ne mettez pas de balises de code Markdown. Renvoie uniquement l'objet JSON.`;

    const response = await getGeminiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  translation: { type: Type.STRING }
                },
                required: ["question", "options", "correctIndex", "explanation", "translation"]
              }
            }
          },
          required: ["title", "questions"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/gemini/reading-quiz:", error);
    res.status(500).json({ error: error.message || "Erreur de génération du quiz IA." });
  }
});

// API route: Live Interactive Dialogue Companion
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, scenario } = req.body;
    // messages: array of objects { role: "user" | "assistant", content: string }
    // scenario: { title, companionRole, userRole, setting, goal }
    
    if (!messages || !scenario) {
      return res.status(400).json({ error: "Messages and scenario are required" });
    }

    // Format previous conversation history for the model
    const conversationHistory = messages.map((m: any) => `${m.role === "user" ? "Apprenant" : "Interlocuteur IA"}: ${m.content}`).join("\n");

    const prompt = `Vous êtes un habitant de Paris et un interlocuteur de français expérimenté pour les apprenants de niveau intermédiaire (B1/B2).
Nous jouons une mise en situation (jeu de rôle) avec les paramètres suivants :
- Scénario : ${scenario.title}
- Lieu / Contexte : ${scenario.setting}
- Votre rôle : ${scenario.companionRole}
- Rôle de l'apprenant : ${scenario.userRole}
- Objectif de l'apprenant : ${scenario.goal}

Voici l'historique complet de la discussion actuelle :
${conversationHistory}

Votre tâche : 
1. Répondez au dernier message de l'apprenant en français. Votre style de réponse doit être extrêmement naturel, chaleureux, spontané mais accessible pour un niveau intermédiaire.
2. Si le dernier message écrit par l'apprenant contient des erreurs de grammaire, de conjugaison, ou de vocabulaire non-naturel, fournissez systématiquement une correction constructive, brève et polie. S'il n'y a pas d'erreur, dites discrètement "Excellent français !".
3. Listez 2 ou 3 mots ou expressions intéressants utilisés dans votre réponse, avec leur définition ou équivalent afin d'enrichir le vocabulaire de l'apprenant.

Renvoyez UNIQUEMENT un objet JSON contenant :
{
  "reply" : "Votre réponse en jeu de rôle (en français)",
  "feedback" : "La correction polie et brève des erreurs du dernier message de l'apprenant, ou des conseils pour parler de manière plus naturelle (en français/anglais)",
  "newVocabulary" : [
    { "term": "expression ou mot clé", "definition": "explication simple en français et traduction en anglais" }
  ]
}

Ne mettez pas de balises de code Markdown. Renvoie uniquement l'objet JSON.`;

    const response = await getGeminiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            feedback: { type: Type.STRING },
            newVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING }
                },
                required: ["term", "definition"]
              }
            }
          },
          required: ["reply", "feedback", "newVocabulary"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/gemini/chat:", error);
    res.status(500).json({ error: error.message || "Erreur de traitement de dialogue conversationnel." });
  }
});

// Vite middleware for development or serving build in production
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

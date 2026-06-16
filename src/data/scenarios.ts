import { DialogueScenario } from "../types";

export const DIALOGUE_SCENARIOS: DialogueScenario[] = [
  {
    id: "boulanger-parisien",
    title: "À la Boulangerie de Montmartre",
    difficulty: "B1",
    icon: "Coffee",
    companionName: "Monsieur Jean-Pierre",
    companionRole: "Un artisan boulanger parisien fier de ses produits traditionneles",
    userRole: "Un client curieux qui veut commander des viennoiseries et comprendre leur fabrication",
    setting: "La boulangerie de quartier pittoresque près de la Basilique du Sacré-Cœur",
    goal: "Acheter des croissants et une bûche, puis interroger le boulanger sur ce qui rend ses croissants aussi croustillants.",
    initialGreeting: "Bonjour jeune homme / mademoiselle ! Entrez, entrez. Bienvenue dans ma boulangerie ! Qu'est-ce que je peux vous servir aujourd'hui ?"
  },
  {
    id: "recherche-appartement",
    title: "Négociation d'Appartement à Lyon",
    difficulty: "B2",
    icon: "Home",
    companionName: "Madame Sophie",
    companionRole: "Une agente immobilière stricte mais professionnelle",
    userRole: "Un locataire potentiel cherchant un deux-pièces confortable mais ayant un budget serré",
    setting: "Un bel immeuble en pierre de taille du quartier de la Croix-Rousse",
    goal: "Négocier sur les charges d'électricité incluses ou non, et s'assurer que le garant étranger soit accepté.",
    initialGreeting: "Bonjour, enchantée de faire votre connaissance. Entrons visiter ! Comme vous le voyez, c'est un superbe appartement très lumineux. Avez-vous préparé votre dossier de location ?"
  },
  {
    id: "entretien-embauche",
    title: "Entretien d'Embauche chez TechSolutions",
    difficulty: "B2",
    icon: "Briefcase",
    companionName: "Monsieur Alexandre",
    companionRole: "Le directeur des ressources humaines tatillon mais amical",
    userRole: "Un candidat postulant pour un poste de chef de projet communication intermédiaire",
    setting: "Un bureau moderne et vitré au cœur du quartier de la Défense près de Paris",
    goal: "Présenter vos expériences passées, exprimer votre intérêt et justifier de votre capacité à gérer le stress en entreprise.",
    initialGreeting: "Installez-vous, je vous en prie. Merci pour votre candidature. J'ai lu votre CV avec attention, mais j'aimerais que vous me parliez de vous en quelques phrases. Qu'est-ce qui vous amène chez nous ?"
  },
  {
    id: "marche-aux-puces",
    title: "Négociation aux Puces de Saint-Ouen",
    difficulty: "B1",
    icon: "ShoppingBag",
    companionName: "Gérard",
    companionRole: "Un brocanteur gouailleur et malicieux, habitué à négocier tous les prix",
    userRole: "Un amateur d'objets anciens cherchant un miroir vintage des années 70 et des affiches d'art",
    setting: "Un stand achalandé et poussiéreux, remplit de trésors rétro aux Puces de Paris",
    goal: "Faire baisser le prix de l'objet choisi de 30% en faisant valoir ses légères rayures.",
    initialGreeting: "Ah, vous lorgnez sur ce miroir en laiton à ce que je vois ? C'est de l'authentique d'époque, une vraie merveille ! Je vous en propose un bon prix. Qu'en dites-vous ?"
  }
];

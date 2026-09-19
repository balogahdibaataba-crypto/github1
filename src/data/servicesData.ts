import { OrientationService } from "../types";

export const SERVICES: OrientationService[] = [
  {
    id: "serv-test-unit",
    title: "Passation d'un Test d'Orientation Psychométrique (Unit)",
    description: "Accès à la passation complète et à l'analyse instantanée de l'un de nos tests d'orientation (RIASEC, Intelligences Multiples, Leadership...).",
    priceFCFA: 1000,
    priceEUR: 1.50,
    priceUSD: 1.80,
    features: [
      "Passation en ligne guidée d'un test psychométrique",
      "Calcul immédiat des scores et profil dominant",
      "Recommandations de 3 domaines d'études adaptés",
      "Intégration directe dans votre dossier candidat"
    ]
  },
  {
    id: "serv-bilan-competences",
    title: "Bilan de Compétences & Suggestion de Métiers Adéquats",
    description: "Analyse globale de vos compétences, propositions de professions & métiers adéquats, détection des besoins de renforcement et formations recommandées.",
    priceFCFA: 5000,
    priceEUR: 7.50,
    priceUSD: 8.50,
    popular: true,
    features: [
      "Diagnostic complet des aptitudes et compétences clés",
      "Propositions de professions & métiers adéquats directement accessibles",
      "Plan de renforcement de compétences (lacunes identifiées)",
      "Formations conseillées & liste des institutions dispensatrices",
      "Rapport détaillé téléchargeable"
    ]
  },
  {
    id: "serv-rapport-certifie",
    title: "Conseils d'Orientation Scolaire et Professionnelle + Rapport Certifié",
    description: "Conseils stratégiques personnalisés et document officiel signé et tamponné certifiant l'évaluation et l'orientation complète par le Dr. BALOGAH Dibaataba avec Code QR.",
    priceFCFA: 15000,
    priceEUR: 23.00,
    priceUSD: 25.00,
    popular: true,
    features: [
      "Consultation & Conseils d'Orientation Scolaire et Professionnelle",
      "Rapport Officiel d'Orientation Certifié par le Dr BALOGAH Dibaataba",
      "Mentions légales d'authentification officielles & Numéro de série",
      "Vérification des notes (matières ≥ 10/20) & éligibilité universitaire",
      "Code QR d'authenticité infalsifiable pour universités et employeurs"
    ]
  },
  {
    id: "serv-examen-certification",
    title: "Examen de Certification Professionnelle & Validation des Acquis (VAE)",
    description: "Inscription à l'examen de certification professionnelle (200 parcours certifiants) ou audit VAE avec épreuves de 100 questions et délivrance de Certificat Officiel. Frais : 55 000 FCFA payables en totalité à l'inscription.",
    priceFCFA: 55000,
    priceEUR: 84.00,
    priceUSD: 92.00,
    popular: true,
    features: [
      "Frais de certification : 55 000 FCFA payables en totalité à l'inscription",
      "Audit d'authenticité des documents par l'IA (Relevés, Attestations, CV)",
      "Génération d'examen personnalisé de 100 questions (50% fermées / 50% ouvertes)",
      "Examen couvrant les disciplines scientifiques, stages et expériences",
      "Score minimal requis : 80/100 points",
      "Délivrance automatique du Certificat Professionnel Officiel téléchargeable"
    ]
  },
  {
    id: "serv-cv-lettre",
    title: "Optimisation de CV & Lettre Académique",
    description: "Relecture, correction et valorisation de votre dossier de candidature auprès des universités et ambassades.",
    priceFCFA: 1000,
    priceEUR: 1.50,
    priceUSD: 1.80,
    features: [
      "Relecture minutieuse par un conseiller d'orientation",
      "Mise en page moderne adaptée aux standards universitaires",
      "Correction des fautes de langue et syntaxe",
      "Livraison en format PDF imprimable et Word éditable"
    ]
  },
  {
    id: "serv-pack-international",
    title: "Accompagnement Études à l'Étranger & Visa",
    description: "Conseil stratégique pour réussir ses démarches d'études au Maroc, Sénégal, Côte d'Ivoire, France, Canada, USA, Chine.",
    priceFCFA: 15000,
    priceEUR: 23.00,
    priceUSD: 25.00,
    features: [
      "Sélection des établissements et procédures Campus France / Bourses AMCI",
      "Budget prévisionnel (Scolarité + Coût de la vie mensuel)",
      "Guide des démarches de visa étudiant",
      "Entretien direct avec le Dr. BALOGAH Dibaataba"
    ]
  }
];



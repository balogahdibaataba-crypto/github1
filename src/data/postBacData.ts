import {
  PostBacField,
  PostBacApprenticeshipTrade,
  PostBacStudentRecords,
  PostBacOrientationDecision,
  SubjectCalculationDetail,
  PostBacSubjectGrades,
} from "../types";

/**
 * BASE DE DONNÉES OFFICIELLE DES GRANDES FILIÈRES UNIVERSITAIRES & GRANDES ÉCOLES POST-BAC
 * Cabinet Conseil Dr BALOGAH Dibaataba - OrientaAfrik
 */
export const POST_BAC_FIELDS: PostBacField[] = [
  // =========================================================================
  // 1. SCIENCES DE LA SANTÉ & MÉDECINE
  // =========================================================================
  {
    id: "field-medecine-generale",
    code: "MED-GEN",
    name: "Médecine Générale (Doctorat d'État en Médecine)",
    category: "sante_medecine",
    categoryLabel: "Sciences de la Santé & Médicales",
    shortDescription: "Formation d'élite préparant au titre de Docteur en Médecine, diagnostic, soins et chirurgie.",
    fullDescription: "La filière de Médecine Générale forme les futurs médecins généralistes et spécialistes. Les études durent 7 à 8 ans selon le système LMD santé et mènent au Diplôme d'État de Docteur en Médecine avec internat hospitalier.",
    dominantSubjects: [
      { subject: "Sciences de la Vie et de la Terre (SVT)", coefficient: 6 },
      { subject: "Physique-Chimie (PCT)", coefficient: 5 },
      { subject: "Mathématiques", coefficient: 4 },
      { subject: "Français", coefficient: 3 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "svt", subjectLabel: "SVT", minScore: 12.0 },
        { subjectKey: "physiqueChimie", subjectLabel: "Physique-Chimie", minScore: 11.5 },
        { subjectKey: "mathematiques", subjectLabel: "Mathématiques", minScore: 10.0 },
        { subjectKey: "francais", subjectLabel: "Français", minScore: 10.0 },
      ],
      globalMinAvg: 11.5,
      recommendedBacSeries: ["D", "C", "S"],
      formulaExplanation: "Moyenne calculée sur 2nde, 1ère, Tle (T1-T3) + BAC 1 + BAC 2 ≥ 12.0 en SVT, ≥ 11.5 en PCT, ≥ 10.0 en Mathématiques et Français.",
    },
    idealProfile: [
      "Vocation humaniste et sens aigu de l'éthique médicale",
      "Grande endurance intellectuelle et capacité de mémorisation",
      "Rigueur scientifique, sens de l'observation et empathie",
      "Résistance au stress et sang-froid",
    ],
    riasecMatch: ["I", "S", "R"],
    degreeLevels: ["Diplôme d'État de Docteur en Médecine", "Doctorat / PhD", "Master Professionnel"],
    targetInstitutions: ["Faculté des Sciences de Santé (FSS) - UL", "FSS - Kara", "UFR Sciences Médicales", "Cameroun CUSS", "Sénégal UCAD"],
    careerOutcomes: [
      "Médecin Généraliste en hôpital ou clinique",
      "Chirurgien (spécialisation post-doctorat)",
      "Pédiatre, Gynécologue-Obstétricien, Cardiologue",
      "Médecin Épidémiologiste auprès de l'OMS ou ONG",
      "Médecin Conseil en Santé Publique",
    ],
    employmentProspects: "Très Élevé",
    isHighDemand: true,
  },
  {
    id: "field-pharmacie",
    code: "PHARM",
    name: "Pharmacie & Sciences Pharmaceutiques",
    category: "sante_medecine",
    categoryLabel: "Sciences de la Santé & Médicales",
    shortDescription: "Conception, contrôle, délivrance et dispensation des médicaments et produits de santé.",
    fullDescription: "La formation en Pharmacie allie la chimie organique, la biochimie, la pharmacologie et la toxicologie pour former des pharmaciens d'officine, hospitaliers et industriels.",
    dominantSubjects: [
      { subject: "Physique-Chimie (PCT)", coefficient: 6 },
      { subject: "Sciences de la Vie et de la Terre (SVT)", coefficient: 5 },
      { subject: "Mathématiques", coefficient: 4 },
      { subject: "Français", coefficient: 3 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "physiqueChimie", subjectLabel: "Physique-Chimie", minScore: 12.0 },
        { subjectKey: "svt", subjectLabel: "SVT", minScore: 11.0 },
        { subjectKey: "mathematiques", subjectLabel: "Mathématiques", minScore: 10.5 },
      ],
      globalMinAvg: 11.0,
      recommendedBacSeries: ["D", "C", "S"],
      formulaExplanation: "Moyenne cumulative ≥ 12.0 en PCT, ≥ 11.0 en SVT et ≥ 10.5 en Mathématiques.",
    },
    idealProfile: [
      "Précision méticuleuse et rigueur en manipulations chimiques",
      "Grand sens des responsabilités et respect des posologies",
      "Appétence pour la recherche biomédicale",
    ],
    riasecMatch: ["I", "C", "S"],
    degreeLevels: ["Diplôme d'État de Docteur en Médecine", "Doctorat / PhD", "Master Professionnel"],
    targetInstitutions: ["FSS Lomé", "FSS Kara", "Faculté de Pharmacie Dakar", "UFR Pharmacie Abidjan"],
    careerOutcomes: [
      "Docteur en Pharmacie (Titulaire d'officine)",
      "Pharmacien Biologiste Médical",
      "Responsable Contrôle Qualité en Industrie Pharmaceutique",
      "Inspecteur de la Pharmacie et du Médicament",
    ],
    employmentProspects: "Très Élevé",
    isHighDemand: true,
  },
  {
    id: "field-sciences-infirmieres-maieutique",
    code: "INF-SAGE",
    name: "Sciences Infirmières, Maïeutique & Soins Obstétricaux",
    category: "sante_medecine",
    categoryLabel: "Sciences de la Santé & Médicales",
    shortDescription: "Soins infirmiers avancés, suivi obstétrical de la mère et du nouveau-né, santé communautaire.",
    fullDescription: "Prépare aux diplômes d'État d'Infirmier et de Sage-Femme (Maïeuticien) pour administrer les soins préventifs, curatifs et de réadaptation dans les centres hospitaliers et dispensaires.",
    dominantSubjects: [
      { subject: "Sciences de la Vie et de la Terre (SVT)", coefficient: 5 },
      { subject: "Physique-Chimie (PCT)", coefficient: 4 },
      { subject: "Français", coefficient: 4 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "svt", subjectLabel: "SVT", minScore: 10.5 },
        { subjectKey: "physiqueChimie", subjectLabel: "Physique-Chimie", minScore: 10.0 },
        { subjectKey: "francais", subjectLabel: "Français", minScore: 10.0 },
      ],
      globalMinAvg: 10.5,
      recommendedBacSeries: ["D", "C", "A4"],
      formulaExplanation: "Moyenne cumulative ≥ 10.5 en SVT, ≥ 10.0 en PCT et ≥ 10.0 en Français.",
    },
    idealProfile: [
      "Grande empathie, écoute active et dévouement au patient",
      "Sang-froid dans les situations d'urgence pédiatrique et néonatale",
      "Aisance relationnelle et esprit d'équipe",
    ],
    riasecMatch: ["S", "R", "I"],
    degreeLevels: ["Licence LMD", "Master Professionnel", "DUT / BTS"],
    targetInstitutions: ["ENAM Lomé & Kara", "École des Auxiliaires Médicaux", "Institut de Soins Supérieurs"],
    careerOutcomes: [
      "Infirmier Diplômé d'État (IDE)",
      "Sage-Femme / Maïeuticien d'État",
      "Surveillant Général d'Unité de Soins",
      "Coordinateur de programmes de santé maternelle",
    ],
    employmentProspects: "Très Élevé",
  },

  // =========================================================================
  // 2. INGÉNIERIE, TECHNOLOGIES & INFORMATIQUE
  // =========================================================================
  {
    id: "field-genie-logiciel-ia",
    code: "INFO-IA",
    name: "Génie Logiciel, Intelligence Artificielle & Data Science",
    category: "ingenierie_informatique",
    categoryLabel: "Ingénierie, Technologies & Informatique",
    shortDescription: "Conception logicielle avancée, algorithmes d'IA, apprentissage automatique et architecture cloud.",
    fullDescription: "La filière forme les ingénieurs et concepteurs de systèmes numériques de pointe : développement web et mobile full-stack, traitement massif de données (Big Data), réseaux neuronaux et cybersécurité.",
    dominantSubjects: [
      { subject: "Mathématiques", coefficient: 6 },
      { subject: "Physique-Chimie (PCT)", coefficient: 4 },
      { subject: "Anglais", coefficient: 4 },
      { subject: "Français", coefficient: 2 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "mathematiques", subjectLabel: "Mathématiques", minScore: 11.5 },
        { subjectKey: "physiqueChimie", subjectLabel: "Physique-Chimie", minScore: 10.5 },
        { subjectKey: "anglais", subjectLabel: "Anglais", minScore: 10.5 },
      ],
      globalMinAvg: 11.0,
      recommendedBacSeries: ["C", "D", "E", "Ti", "F2"],
      formulaExplanation: "Moyenne cumulative ≥ 11.5 en Mathématiques, ≥ 10.5 en PCT et ≥ 10.5 en Anglais.",
    },
    idealProfile: [
      "Forte pensée algorithmique et logique mathématique",
      "Passion pour le code, la technologie et l'automatisation",
      "Capacité d'auto-formation permanente et veille technologique",
      "Maîtrise de l'anglais technique",
    ],
    riasecMatch: ["I", "R", "C"],
    degreeLevels: ["Diplôme d'Ingénieur", "Licence LMD", "Master Professionnel", "Doctorat / PhD"],
    targetInstitutions: ["ENSI Lomé", "INP-HB Yamoussoukro", "IAI-Togo", "ESMT Dakar", "Polytechnique"],
    careerOutcomes: [
      "Ingénieur Intelligence Artificielle & Machine Learning",
      "Développeur Full-Stack / Architecte Logiciel",
      "Data Scientist / Data Analyst",
      "Ingénieur DevOps & Cloud Computing",
      "Consultant en Cybersécurité",
    ],
    employmentProspects: "Très Élevé",
    isHighDemand: true,
  },
  {
    id: "field-genie-civil-btp",
    code: "GC-BTP",
    name: "Génie Civil, BTP & Infrastructures Durables",
    category: "ingenierie_informatique",
    categoryLabel: "Ingénierie, Technologies & Informatique",
    shortDescription: "Calcul de structures, construction d'immeubles, ponts, routes et ouvrages d'art.",
    fullDescription: "Forme les cadres techniques et ingénieurs concepteurs de bâtisses, réseaux routiers, ponts, barrages et systèmes d'assainissement avec dimensionnement aux normes Eurocodes et BAEL.",
    dominantSubjects: [
      { subject: "Mathématiques", coefficient: 6 },
      { subject: "Physique-Chimie (PCT)", coefficient: 6 },
      { subject: "Français", coefficient: 3 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "mathematiques", subjectLabel: "Mathématiques", minScore: 11.5 },
        { subjectKey: "physiqueChimie", subjectLabel: "Physique-Chimie", minScore: 11.5 },
      ],
      globalMinAvg: 11.0,
      recommendedBacSeries: ["C", "E", "F4", "D"],
      formulaExplanation: "Moyenne cumulative ≥ 11.5 en Mathématiques ET en Physique-Chimie.",
    },
    idealProfile: [
      "Aptitude spatiale et visualisation tridimensionnelle",
      "Goût pour le travail de terrain et la direction de chantier",
      "Rigueur dans les calculs de résistance des matériaux (RDM)",
    ],
    riasecMatch: ["R", "I", "E"],
    degreeLevels: ["Diplôme d'Ingénieur", "Licence LMD", "Master Professionnel", "DUT / BTS"],
    targetInstitutions: ["ENSI Lomé", "2iE Ouagadougou", "INP-HB", "EAMAU (Architecture & Urbanisme)"],
    careerOutcomes: [
      "Ingénieur Calculateur de Structures BTP",
      "Conducteur de Travaux / Directeur de Projet BTP",
      "Ingénieur Ouvrages d'Art et Routes",
      "Expert en Contrôle Technique et Sécurité Bâtiment",
    ],
    employmentProspects: "Très Élevé",
    isHighDemand: true,
  },
  {
    id: "field-genie-electrique-energies",
    code: "GE-SOLAIRE",
    name: "Génie Électrique, Électrotechnique & Énergies Renouvelables",
    category: "ingenierie_informatique",
    categoryLabel: "Ingénierie, Technologies & Informatique",
    shortDescription: "Production, distribution électrique, parcs solaires photovoltaïques et réseaux intelligents.",
    fullDescription: "Prépare les ingénieurs et techniciens supérieurs aux défis de la transition énergétique : conception de centrales solaires, automatismes industriels, transformateurs et micro-réseaux (Smart Grids).",
    dominantSubjects: [
      { subject: "Physique-Chimie (PCT)", coefficient: 6 },
      { subject: "Mathématiques", coefficient: 5 },
      { subject: "Anglais", coefficient: 3 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "physiqueChimie", subjectLabel: "Physique-Chimie", minScore: 11.0 },
        { subjectKey: "mathematiques", subjectLabel: "Mathématiques", minScore: 11.0 },
      ],
      globalMinAvg: 11.0,
      recommendedBacSeries: ["C", "F1", "F2", "F3", "E", "D"],
      formulaExplanation: "Moyenne cumulative ≥ 11.0 en Physique-Chimie ET en Mathématiques.",
    },
    idealProfile: [
      "Intérêt pour l'électricité de puissance et les énergies vertes",
      "Esprit d'analyse pour le diagnostic de pannes complexes",
      "Respect strict des normes de sécurité haute tension",
    ],
    riasecMatch: ["R", "I", "C"],
    degreeLevels: ["Diplôme d'Ingénieur", "Licence LMD", "Master Professionnel", "DUT / BTS"],
    targetInstitutions: ["ENSI Lomé", "Centre d'Excellence Régional CER-MEP", "ESMT", "Polytech Lomé"],
    careerOutcomes: [
      "Ingénieur en Systèmes Solaires & Énergies Propres",
      "Responsable Maintenance Électrotechnique Industrielle",
      "Ingénieur Réseau Électrique Haute Tension (CEET, etc.)",
      "Chef de Projet Efficacité Énergétique",
    ],
    employmentProspects: "Très Élevé",
    isHighDemand: true,
  },

  // =========================================================================
  // 3. SCIENCES ÉCONOMIQUES, GESTION & FINANCE
  // =========================================================================
  {
    id: "field-sciences-economiques-gestion",
    code: "FASEG",
    name: "Sciences Économiques & Gestion (Finance, Comptabilité & Audit)",
    category: "eco_gestion",
    categoryLabel: "Sciences Économiques & de Gestion",
    shortDescription: "Analyse macro/micro-économique, comptabilité générale, finance d'entreprise et audit.",
    fullDescription: "La FASEG offre un cursus de référence menant aux carrières de banquier, auditeur financier, expert-comptable, économiste d'État, contrôleur de gestion et analyste financier de marché.",
    dominantSubjects: [
      { subject: "Mathématiques", coefficient: 5 },
      { subject: "Français", coefficient: 4 },
      { subject: "Histoire-Géographie / Économie", coefficient: 4 },
      { subject: "Anglais", coefficient: 3 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "mathematiques", subjectLabel: "Mathématiques", minScore: 10.5 },
        { subjectKey: "francais", subjectLabel: "Français", minScore: 10.0 },
        { subjectKey: "histoireGeo", subjectLabel: "Histoire-Géo / Éco", minScore: 10.0 },
      ],
      globalMinAvg: 10.5,
      recommendedBacSeries: ["G2", "G3", "C", "D", "A4"],
      formulaExplanation: "Moyenne cumulative ≥ 10.5 en Mathématiques, ≥ 10.0 en Français et ≥ 10.0 en Histoire-Géo.",
    },
    idealProfile: [
      "Aisance avec les chiffres, les pourcentages et les bilans comptables",
      "Sens aigu de l'organisation, de la rigueur et de la conformité",
      "Compréhension des dynamiques de marché et d'entrepreneuriat",
    ],
    riasecMatch: ["C", "E", "I"],
    degreeLevels: ["Licence LMD", "Master Professionnel", "Doctorat / PhD"],
    targetInstitutions: ["FASEG Université de Lomé", "FASEG Kara", "CESAG Dakar", "BCEAO Training"],
    careerOutcomes: [
      "Auditeur Financier & Commissaire aux Comptes",
      "Chef Comptable / Directeur Administratif et Financier (DAF)",
      "Analyste de Risques en Banque et Microfinance",
      "Économiste Chercheur / Conseiller Économique Ministériel",
    ],
    employmentProspects: "Élevé",
    isHighDemand: true,
  },
  {
    id: "field-marketing-commerce-international",
    code: "MKT-CI",
    name: "Marketing Digital, Commerce International & Supply Chain",
    category: "eco_gestion",
    categoryLabel: "Sciences Économiques & de Gestion",
    shortDescription: "Stratégie de marque, e-commerce, négociation d'affaires et transit douanier.",
    fullDescription: "Discipline orientée vers l'expansion commerciale des entreprises, le marketing digital, les opérations de transport multimodal (Port Autonome de Lomé), le dédouanement et le commerce mondial.",
    dominantSubjects: [
      { subject: "Français", coefficient: 4 },
      { subject: "Anglais", coefficient: 4 },
      { subject: "Mathématiques", coefficient: 3 },
      { subject: "Histoire-Géographie", coefficient: 3 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "francais", subjectLabel: "Français", minScore: 10.5 },
        { subjectKey: "anglais", subjectLabel: "Anglais", minScore: 10.5 },
        { subjectKey: "mathematiques", subjectLabel: "Mathématiques", minScore: 10.0 },
      ],
      globalMinAvg: 10.5,
      recommendedBacSeries: ["G3", "G2", "A4", "D"],
      formulaExplanation: "Moyenne cumulative ≥ 10.5 en Français, ≥ 10.5 en Anglais et ≥ 10.0 en Mathématiques.",
    },
    idealProfile: [
      "Excellente force de persuasion et sens de la négociation",
      "Créativité publicitaire et compréhension des réseaux sociaux",
      "Maîtrise des langues vivantes et ouverture internationale",
    ],
    riasecMatch: ["E", "A", "C"],
    degreeLevels: ["Licence LMD", "Master Professionnel", "DUT / BTS"],
    targetInstitutions: ["ESGIS", "FASEG Lomé", "Institut Universitaire d'Abidjan", "BEM Dakar"],
    careerOutcomes: [
      "Responsable Marketing Digital & Growth Hacker",
      "Directeur Commercial & Négociateur Grand Compte",
      "Responsable Logistique & Transit Portuaire",
      "Courtier en Commerce International",
    ],
    employmentProspects: "Élevé",
  },

  // =========================================================================
  // 4. DROIT, SCIENCES POLITIQUES & SCIENCES SOCIALES
  // =========================================================================
  {
    id: "field-droit-sciences-politiques",
    code: "FDD-POL",
    name: "Droit Privé, Droit Public & Sciences Politiques",
    category: "droit_politique_social",
    categoryLabel: "Droit, Sciences Politiques & Sciences Sociales",
    shortDescription: "Législation, droit des affaires OHADA, contentieux, magistrature et diplomatie.",
    fullDescription: "La Faculté de Droit forme les juristes, avocats, magistrats, notaires et diplomates à la maîtrise des textes juridiques, aux procédures judiciaires et aux relations internationales.",
    dominantSubjects: [
      { subject: "Français / Littérature", coefficient: 6 },
      { subject: "Philosophie", coefficient: 5 },
      { subject: "Histoire-Géographie", coefficient: 4 },
      { subject: "Anglais", coefficient: 3 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "francais", subjectLabel: "Français", minScore: 11.0 },
        { subjectKey: "philosophie", subjectLabel: "Philosophie", minScore: 10.5 },
        { subjectKey: "histoireGeo", subjectLabel: "Histoire-Géo", minScore: 10.5 },
        { subjectKey: "anglais", subjectLabel: "Anglais", minScore: 10.0 },
      ],
      globalMinAvg: 11.0,
      recommendedBacSeries: ["A4", "G1", "D", "C"],
      formulaExplanation: "Moyenne cumulative ≥ 11.0 en Français, ≥ 10.5 en Philo et Histoire-Géo, ≥ 10.0 en Anglais.",
    },
    idealProfile: [
      "Éloquence verbale et grande rigueur dans l'argumentation",
      "Sens aigu de la justice, de l'impartialité et de l'éthique",
      "Capacité impressionnante de lecture et analyse critique de textes",
    ],
    riasecMatch: ["E", "S", "I"],
    degreeLevels: ["Licence LMD", "Master Professionnel", "Doctorat / PhD"],
    targetInstitutions: ["Faculté de Droit (FDD) - Université de Lomé", "FDD Kara", "ENA Lomé", "Centre de Formation Professionnelle des Avocats"],
    careerOutcomes: [
      "Avocat au Barreau / Magistrat (Juge, Procureur)",
      "Juriste d'Entreprise spécialisé en Droit OHADA / Fiscal",
      "Notaire / Huissier de Justice",
      "Diplomate / Cadre du Ministère des Affaires Étrangères",
      "Administrateur Civil (ENA)",
    ],
    employmentProspects: "Élevé",
    isHighDemand: true,
  },
  {
    id: "field-sociologie-psychologie-education",
    code: "SOCIO-PSY",
    name: "Sociologie, Psychologie & Sciences de l'Éducation",
    category: "droit_politique_social",
    categoryLabel: "Droit, Sciences Politiques & Sciences Sociales",
    shortDescription: "Comportement humain, dynamiques sociales, psychologie cognitive et ingénierie pédagogique.",
    fullDescription: "Étudie les transformations socioculturelles, la gestion des ressources humaines, le soutien psychologique et la formation des formateurs selon les méthodes du Dr BALOGAH.",
    dominantSubjects: [
      { subject: "Français", coefficient: 5 },
      { subject: "Philosophie", coefficient: 4 },
      { subject: "Histoire-Géographie", coefficient: 4 },
      { subject: "Sciences de la Vie et de la Terre (SVT)", coefficient: 3 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "francais", subjectLabel: "Français", minScore: 10.5 },
        { subjectKey: "philosophie", subjectLabel: "Philosophie", minScore: 10.0 },
        { subjectKey: "histoireGeo", subjectLabel: "Histoire-Géo", minScore: 10.0 },
      ],
      globalMinAvg: 10.5,
      recommendedBacSeries: ["A4", "D"],
      formulaExplanation: "Moyenne cumulative ≥ 10.5 en Français, ≥ 10.0 en Philo et Histoire-Géo.",
    },
    idealProfile: [
      "Intérêt pour l'accompagnement humain et l'analyse sociale",
      "Écoute bienveillante, sens clinique et empathie",
      "Capacité à mener des enquêtes sociologiques de terrain",
    ],
    riasecMatch: ["S", "I", "A"],
    degreeLevels: ["Licence LMD", "Master Professionnel", "Doctorat / PhD"],
    targetInstitutions: ["FSHS Lomé", "INSE (Sciences de l'Éducation)", "FSHS Kara"],
    careerOutcomes: [
      "Psychologue Clinicien / Conseiller d'Orientation",
      "Sociologue du Développement / Spécialiste Genre & Inclusion",
      "Responsable des Ressources Humaines (RH)",
      "Inspecteur de l'Éducation Nationale / Formateur de Formateurs",
    ],
    employmentProspects: "Moyen",
  },

  // =========================================================================
  // 5. LETTRES, LANGUES, COMMUNICATION & ARTS
  // =========================================================================
  {
    id: "field-lettres-langues-traduction",
    code: "FLLA-TRAD",
    name: "Lettres Modernes, Linguistique, Traduction & Interprétariat",
    category: "lettres_langues_communication",
    categoryLabel: "Lettres, Langues & Communication",
    shortDescription: "Maîtrise des langues (Anglais, Allemand, Espagnol), traduction internationale et critique littéraire.",
    fullDescription: "La FLLA prépare aux métiers de la traduction de conférences, de l'interprétation simultanée, de l'enseignement des langues vivantes et de la coopération internationale.",
    dominantSubjects: [
      { subject: "Français / Littérature", coefficient: 6 },
      { subject: "Anglais", coefficient: 6 },
      { subject: "Philosophie", coefficient: 4 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "francais", subjectLabel: "Français", minScore: 11.0 },
        { subjectKey: "anglais", subjectLabel: "Anglais", minScore: 11.0 },
      ],
      globalMinAvg: 11.0,
      recommendedBacSeries: ["A4"],
      formulaExplanation: "Moyenne cumulative ≥ 11.0 en Français ET en Anglais.",
    },
    idealProfile: [
      "Passion pour les langues, la littérature et l'interculturalité",
      "Mémoire auditive développée et rapidité de reformulation",
      "Excellence stylistique à l'écrit et à l'oral",
    ],
    riasecMatch: ["A", "S", "I"],
    degreeLevels: ["Licence LMD", "Master Professionnel", "Doctorat / PhD"],
    targetInstitutions: ["FLLA Université de Lomé", "FLLA Kara", "ASTI Buea (Traduction)", "ISIT Paris"],
    careerOutcomes: [
      "Traducteur - Interprète de Conférences (ONU, UA, CEDEAO)",
      "Professeur Certifié de Langues (Français / Anglais)",
      "Rédacteur en Chef / Éditeur / Critique Littéraire",
      "Attaché Culturel d'Ambassade",
    ],
    employmentProspects: "Élevé",
  },
  {
    id: "field-communication-journalisme",
    code: "ISICA",
    name: "Sciences de l'Information, Journalisme & Communication Publique",
    category: "lettres_langues_communication",
    categoryLabel: "Lettres, Langues & Communication",
    shortDescription: "Presse écrite, télévision, radio, journalisme d'investigation et relations publiques.",
    fullDescription: "L'Institut des Sciences de l'Information, de la Communication et des Arts (ISICA) forme les professionnels de l'information, de la communication de crise et des médias audiovisuels.",
    dominantSubjects: [
      { subject: "Français", coefficient: 6 },
      { subject: "Anglais", coefficient: 4 },
      { subject: "Histoire-Géographie", coefficient: 4 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "francais", subjectLabel: "Français", minScore: 11.0 },
        { subjectKey: "anglais", subjectLabel: "Anglais", minScore: 10.5 },
        { subjectKey: "histoireGeo", subjectLabel: "Histoire-Géo", minScore: 10.5 },
      ],
      globalMinAvg: 10.5,
      recommendedBacSeries: ["A4", "G1", "D"],
      formulaExplanation: "Moyenne cumulative ≥ 11.0 en Français, ≥ 10.5 en Anglais et Histoire-Géo.",
    },
    idealProfile: [
      "Curiosité journalistique, audace et esprit d'investigation",
      "Aisance devant la caméra et au micro",
      "Éthique professionnelle et respect de la déontologie médiatique",
    ],
    riasecMatch: ["A", "E", "S"],
    degreeLevels: ["Licence LMD", "Master Professionnel"],
    targetInstitutions: ["ISICA Lomé", "CESTI Dakar", "ESSTIC Yaoundé"],
    careerOutcomes: [
      "Journaliste Reporter / Présentateur Télévisuel",
      "Directeur de la Communication (DIRCOM)",
      "Chargé de Relations Publiques & Presse",
      "Producteur de Contenus Audiovisuels & Documentariste",
    ],
    employmentProspects: "Élevé",
  },

  // =========================================================================
  // 6. AGRONOMIE, ENVIRONNEMENT & AGRO-INDUSTRIE
  // =========================================================================
  {
    id: "field-agronomie-agroindustrie",
    code: "ESA-AGRO",
    name: "Agronomie Générale, Agro-industrie & Sécurité Alimentaire",
    category: "agronomie_environnement",
    categoryLabel: "Agronomie & Agro-industrie",
    shortDescription: "Production végétale, élevage intensif, biotechnologies agricoles et transformation des récoltes.",
    fullDescription: "L'École Supérieure d'Agronomie (ESA) prépare les ingénieurs agronomes capables de moderniser l'agriculture africaine, d'assurer la souveraineté alimentaire et de diriger des complexes agro-industriels.",
    dominantSubjects: [
      { subject: "Sciences de la Vie et de la Terre (SVT)", coefficient: 6 },
      { subject: "Physique-Chimie (PCT)", coefficient: 5 },
      { subject: "Mathématiques", coefficient: 4 },
    ],
    admissionConditions: {
      requiredSubjects: [
        { subjectKey: "svt", subjectLabel: "SVT", minScore: 11.0 },
        { subjectKey: "physiqueChimie", subjectLabel: "Physique-Chimie", minScore: 10.5 },
        { subjectKey: "mathematiques", subjectLabel: "Mathématiques", minScore: 10.0 },
      ],
      globalMinAvg: 11.0,
      recommendedBacSeries: ["D", "C", "S"],
      formulaExplanation: "Moyenne cumulative ≥ 11.0 en SVT, ≥ 10.5 en PCT et ≥ 10.0 en Mathématiques.",
    },
    idealProfile: [
      "Attachement au monde rural et passion pour le vivant",
      "Volonté d'industrialiser les chaînes de valeur agricoles",
      "Pragmatisme et aptitudes managériales de terrain",
    ],
    riasecMatch: ["R", "I", "E"],
    degreeLevels: ["Diplôme d'Ingénieur", "Licence LMD", "Master Professionnel", "Doctorat / PhD"],
    targetInstitutions: ["ESA Université de Lomé", "INP-HB Agronomie", "Faculté d'Agronomie Cotonou"],
    careerOutcomes: [
      "Ingénieur Agronome / Agro-économiste",
      "Directeur d'Usine Agroalimentaire",
      "Directeur d'Exploitation Agropastorale Moderne",
      "Consultant International FAO / PAM en Sécurité Alimentaire",
    ],
    employmentProspects: "Très Élevé",
    isHighDemand: true,
  },
];

/**
 * RÉPERTOIRE DES MÉTIERS PORTEURS & FORMATIONS PROFESSIONNELLES QUALIFIANTES POST-BAC
 * (Alternance, CQP Post-BAC, BTS Pro, Certifications de Haut Niveau pour l'Insertion Rapide & Entrepreneuriat)
 */
export const POST_BAC_APPRENTICESHIP_TRADES: PostBacApprenticeshipTrade[] = [
  {
    id: "trade-dev-fullstack-cloud",
    title: "Développeur Web Full-Stack & Applications Cloud (Fast-Track)",
    domain: "Numérique & Systèmes Informatiques",
    diplomaOrCert: "CQP Post-BAC",
    trainingDuration: "12 à 18 mois (Projets réels + Stage en Entreprise)",
    shortDescription: "Maîtrise complète de React, Node.js, Python, bases de données SQL/NoSQL et déploiement cloud sécurisé.",
    keySkills: ["TypeScript / React", "Node.js / Express", "Bases de données & API REST", "Git & CI/CD", "Cybersécurité de base"],
    entryRequirements: "Niveau Baccalauréat toutes séries, logique éprouvée et forte motivation.",
    averageStartingSalaryFCFA: "250 000 - 550 000 FCFA / mois (+ Missions Télétravail Internationales)",
    growthRate: "+38% de croissance d'embauche annuelle",
    careerOpportunities: [
      "Développeur Front-End / Back-End en Startup ou Fintech",
      "Freelance International sur plateformes (Upwork, Malt)",
      "Fondateur d'Agence de Solutions Numériques",
    ],
    entrepreneurshipScore: 10,
    whyRecommended: "Insertion professionnelle quasi-immédiate sans attendre 5 ans d'études théoriques.",
  },
  {
    id: "trade-technicien-solaire-energies",
    title: "Technicien Supérieur en Systèmes Solaires Photovoltaïques & Pompage Solaire",
    domain: "Énergies Renouvelables & Électrotechnique",
    diplomaOrCert: "BTS Professionnel",
    trainingDuration: "18 à 24 mois (Ateliers pratiques + Chantiers)",
    shortDescription: "Dimensionnement, installation et maintenance de centrales solaires autonomes, hybrides et mini-réseaux ruraux.",
    keySkills: ["Dimensionnement solaire (PVsyst)", "Installation d'onduleurs & batteries lithium", "Pompage solaire agricole", "Sécurité électrique NFC 15-100"],
    entryRequirements: "Baccalauréat C, D, E, F1, F2, F3 ou profil motivé après remise à niveau.",
    averageStartingSalaryFCFA: "200 000 - 450 000 FCFA / mois",
    growthRate: "+45% de demande avec l'électrification rurale",
    careerOpportunities: [
      "Installateur Agréé de Systèmes Solaires Résidentiels & Industriels",
      "Chef d'Équipe Énergie chez les opérateurs solaires (BBOXX, Zola, Sunna)",
      "Création de sa propre Entreprise d'Énergie Solaire",
    ],
    entrepreneurshipScore: 10,
    whyRecommended: "Secteur prioritaire de développement en Afrique avec des financements massifs de projets.",
  },
  {
    id: "trade-froid-climatisation-industrielle",
    title: "Expert en Froid Industriel, Climatisation Centrale & Chaîne du Froid",
    domain: "Froid, Climatisation & Traitement d'Air",
    diplomaOrCert: "BTS Professionnel",
    trainingDuration: "18 à 24 mois",
    shortDescription: "Installation et dépannage de chambres froides agroalimentaires, climatiseurs centraux VRV/VRF et morgues.",
    keySkills: ["Thermodynamique des fluides", "Brasage & tuyauterie frigorifique", "Régulation électronique", "Récupération écologique des fluides"],
    entryRequirements: "Baccalauréat technique ou général.",
    averageStartingSalaryFCFA: "220 000 - 500 000 FCFA / mois",
    growthRate: "+30% de demande constante",
    careerOpportunities: [
      "Technicien de Maintenance en Entrepôts Frigorifiques et Port",
      "Installateur Climatisation pour Banques, Hôtels et Grands Immeubles",
      "Entrepreneur Spécialiste de la Chaîne du Froid Agricole",
    ],
    entrepreneurshipScore: 9,
    whyRecommended: "Métier en tension permanente sous climat tropical, revenus très attractifs et autonomie garantie.",
  },
  {
    id: "trade-comptabilite-fiscale-pratique",
    title: "Gestionnaire de Paie, Comptabilité Pratique & Fiscalité OHADA",
    domain: "Gestion & Tertiaire",
    diplomaOrCert: "CQP Post-BAC",
    trainingDuration: "12 mois (Logiciels SAGE, SAARI, Déclarations OTR)",
    shortDescription: "Tenue des comptes, déclarations fiscales (TVA, IRPP, IS, CNSS) et établissement des fiches de paie.",
    keySkills: ["Maîtrise de SAGE Compta & Paie", "Fiscalité d'entreprise OHADA", "Déclarations en ligne OTR / Impôts", "Rapprochement bancaire"],
    entryRequirements: "Baccalauréat G2, G3, A4, D, C.",
    averageStartingSalaryFCFA: "180 000 - 380 000 FCFA / mois",
    growthRate: "+22% de besoin continu chez les PME/PMI",
    careerOpportunities: [
      "Collaborateur en Cabinet d'Expertise Comptable",
      "Comptable Unique en PME/PMI",
      "Consultant Indépendant en Déclarations Fiscales & Sociales",
    ],
    entrepreneurshipScore: 8,
    whyRecommended: "Chaque nouvelle entreprise créée a l'obligation légale d'avoir un comptable opérationnel.",
  },
  {
    id: "trade-diagnostic-automobile-hybride",
    title: "Technicien de Diagnostic Électronique Automobile & Véhicules Hybrides",
    domain: "Mécanique & Mécatronique Automobile",
    diplomaOrCert: "Titre Pro Certifié",
    trainingDuration: "18 mois (Valises de diagnostic OBD, calculateurs)",
    shortDescription: "Dépannage des pannes électroniques, reprogrammation de calculateurs (ECU) et maintenance de véhicules modernes.",
    keySkills: ["Utilisation des scanners OBD-II / Launch", "Électronique embarquée & multiplexage", "Diagnostic injection directe et turbo", "Sécurité haute tension hybride"],
    entryRequirements: "Baccalauréat toutes séries avec curiosité technique.",
    averageStartingSalaryFCFA: "250 000 - 600 000 FCFA / mois",
    growthRate: "+35% avec la modernisation du parc automobile",
    careerOpportunities: [
      "Chef d'Atelier de Diagnostic en Concession Automobile",
      "Expert en Électronique Automobile Indépendant",
      "Création d'un Garage Moderne de Diagnostic Scanner",
    ],
    entrepreneurshipScore: 10,
    whyRecommended: "Rareté des vrais spécialistes en diagnostic électronique sur le marché local, rentabilité exceptionnelle.",
  },
  {
    id: "trade-infographie-motion-design",
    title: "Infographiste 3D, Motion Designer & UI/UX Designer Numérique",
    domain: "Arts Graphiques, Médias & Design",
    diplomaOrCert: "Titre Pro Certifié",
    trainingDuration: "12 mois (Suite Adobe, Blender, Figma, After Effects)",
    shortDescription: "Création d'identités visuelles percutantes, animations 3D publicitaires, interfaces d'applications et montages vidéo pro.",
    keySkills: ["Photoshop, Illustrator, InDesign", "After Effects & Motion 2D/3D", "Figma UI/UX", "Montage vidéo Premiere Pro"],
    entryRequirements: "Baccalauréat toutes séries, sensibilité artistique.",
    averageStartingSalaryFCFA: "200 000 - 450 000 FCFA / mois (+ Contrats Freelance)",
    growthRate: "+28% de croissance liée à l'économie digitale",
    careerOpportunities: [
      "Directeur Artistique Junior en Agence de Communication",
      "Motion Designer pour chaînes TV et plateformes e-commerce",
      "Studio Créatif Indépendant",
    ],
    entrepreneurshipScore: 9,
    whyRecommended: "Possibilité de générer des revenus dès les premiers mois de formation via des contrats de design.",
  },
  {
    id: "trade-fibre-optique-telecoms",
    title: "Technicien Réseaux Fibre Optique (FTTH/FTTO) & Télécoms 5G",
    domain: "Télécommunications & Réseaux",
    diplomaOrCert: "CQP Post-BAC",
    trainingDuration: "12 mois (Soudure optique, réflectométrie OTDR)",
    shortDescription: "Tirage, raccordement par fusion, réflectométrie et maintenance des liaisons à très haut débit.",
    keySkills: ["Soudure de fibres optiques par fusion", "Mesures et réflectométrie (OTDR)", "Câblage structuré cuivre & fibre", "Configuration de routeurs pro"],
    entryRequirements: "Baccalauréat toutes séries.",
    averageStartingSalaryFCFA: "200 000 - 450 000 FCFA / mois",
    growthRate: "+40% avec le déploiement national de la fibre",
    careerOpportunities: [
      "Technicien Fibre chez les FAI (Togocom, Moov, CanalBox, etc.)",
      "Sous-traitant en Déploiement Télécoms pour Entreprises",
      "Chef d'Équipe Câblage Réseaux Informatiques",
    ],
    entrepreneurshipScore: 9,
    whyRecommended: "Chantiers massifs de numérisation urbaine et rurale garantissant un travail immédiat.",
  },
  {
    id: "trade-agropastoral-elevage-moderne",
    title: "Manager d'Exploitation Avicole, Piscicole & Maraîchage Hors-Sol",
    domain: "Agropastoral & Économie Verte",
    diplomaOrCert: "CQP Post-BAC",
    trainingDuration: "12 à 18 mois (Pratique directe en ferme-école)",
    shortDescription: "Conduite d'élevages avicoles (poulets de chair, pondeuses), étangs piscicoles en circuit fermé et serres hydroponiques.",
    keySkills: ["Biosécurité & prophylaxie animale", "Formulation d'aliments de provende", "Gestion d'écloseries et étangs", "Commercialisation et circuits courts"],
    entryRequirements: "Baccalauréat toutes séries, esprit d'entreprendre.",
    averageStartingSalaryFCFA: "250 000 - 700 000 FCFA / mois (Bénéfices de production)",
    growthRate: "+50% de demande sur le marché de consommation locale",
    careerOpportunities: [
      "Propriétaire d'une Ferme Avicole / Piscicole Moderne",
      "Directeur d'Élevage Commercial pour Groupements Agricoles",
      "Fournisseur Agréé pour Supermarchés, Hôtels et Restaurants",
    ],
    entrepreneurshipScore: 10,
    whyRecommended: "Marché captif énorme : les pays de la région importent encore la majorité de leurs volailles et poissons.",
  },
];

/**
 * MOTEUR D'ÉVALUATION POST-BAC (Cabinet Dr BALOGAH)
 * Calcule les moyennes trimestrielles cumulées (2nde, 1ère, Tle) + BAC 1 + BAC 2
 * Évalue l'éligibilité aux filières universitaires, applique la réorientation vers les métiers porteurs
 * et traite la demande d'apprentissage avec mention des filières éligibles.
 */
export function evaluatePostBacOrientation(records: PostBacStudentRecords): PostBacOrientationDecision {
  const subjectsKeys: (keyof PostBacStudentRecords["grades"])[] = [
    "francais",
    "philosophie",
    "anglais",
    "histoireGeo",
    "mathematiques",
    "physiqueChimie",
    "svt",
    "economieCompta",
    "eps",
  ];

  const subjectNamesMap: Record<string, string> = {
    francais: "Français",
    philosophie: "Philosophie",
    anglais: "Anglais",
    histoireGeo: "Histoire-Géographie",
    mathematiques: "Mathématiques",
    physiqueChimie: "Physique-Chimie (PCT)",
    svt: "Sciences de la Vie et de la Terre (SVT)",
    economieCompta: "Économie & Comptabilité",
    eps: "Éducation Physique (EPS)",
  };

  const subjectDetails: Record<string, SubjectCalculationDetail> = {};
  let totalPointsAll = 0;
  let totalGradesCountAll = 0;

  subjectsKeys.forEach((key) => {
    const subjData = records.grades[key];
    const gradesList: { level: string; term?: string; grade: number }[] = [];

    if (subjData) {
      // 2nde
      if (subjData.grade2nde) {
        if (subjData.grade2nde.t1 !== undefined && subjData.grade2nde.t1 !== null && !isNaN(subjData.grade2nde.t1)) {
          gradesList.push({ level: "2nde", term: "T1", grade: Number(subjData.grade2nde.t1) });
        }
        if (subjData.grade2nde.t2 !== undefined && subjData.grade2nde.t2 !== null && !isNaN(subjData.grade2nde.t2)) {
          gradesList.push({ level: "2nde", term: "T2", grade: Number(subjData.grade2nde.t2) });
        }
        if (subjData.grade2nde.t3 !== undefined && subjData.grade2nde.t3 !== null && !isNaN(subjData.grade2nde.t3)) {
          gradesList.push({ level: "2nde", term: "T3", grade: Number(subjData.grade2nde.t3) });
        }
      }
      // 1ère
      if (subjData.grade1ere) {
        if (subjData.grade1ere.t1 !== undefined && subjData.grade1ere.t1 !== null && !isNaN(subjData.grade1ere.t1)) {
          gradesList.push({ level: "1ère", term: "T1", grade: Number(subjData.grade1ere.t1) });
        }
        if (subjData.grade1ere.t2 !== undefined && subjData.grade1ere.t2 !== null && !isNaN(subjData.grade1ere.t2)) {
          gradesList.push({ level: "1ère", term: "T2", grade: Number(subjData.grade1ere.t2) });
        }
        if (subjData.grade1ere.t3 !== undefined && subjData.grade1ere.t3 !== null && !isNaN(subjData.grade1ere.t3)) {
          gradesList.push({ level: "1ère", term: "T3", grade: Number(subjData.grade1ere.t3) });
        }
      }
      // Tle
      if (subjData.gradeTle) {
        if (subjData.gradeTle.t1 !== undefined && subjData.gradeTle.t1 !== null && !isNaN(subjData.gradeTle.t1)) {
          gradesList.push({ level: "Tle", term: "T1", grade: Number(subjData.gradeTle.t1) });
        }
        if (subjData.gradeTle.t2 !== undefined && subjData.gradeTle.t2 !== null && !isNaN(subjData.gradeTle.t2)) {
          gradesList.push({ level: "Tle", term: "T2", grade: Number(subjData.gradeTle.t2) });
        }
        if (subjData.gradeTle.t3 !== undefined && subjData.gradeTle.t3 !== null && !isNaN(subjData.gradeTle.t3)) {
          gradesList.push({ level: "Tle", term: "T3", grade: Number(subjData.gradeTle.t3) });
        }
      }
      // BAC 1 (Probatoire)
      if (subjData.gradeBac1 !== undefined && subjData.gradeBac1 !== null && !isNaN(subjData.gradeBac1)) {
        gradesList.push({ level: "BAC 1", term: "Examen", grade: Number(subjData.gradeBac1) });
      }
      // BAC 2 (Terminale)
      if (subjData.gradeBac2 !== undefined && subjData.gradeBac2 !== null && !isNaN(subjData.gradeBac2)) {
        gradesList.push({ level: "BAC 2", term: "Examen", grade: Number(subjData.gradeBac2) });
      }
    }

    const count = gradesList.length;
    const totalSum = gradesList.reduce((acc, curr) => acc + curr.grade, 0);
    const calculatedAverage = count > 0 ? Number((totalSum / count).toFixed(2)) : 0;
    const isPassing10 = calculatedAverage >= 10.0;

    totalPointsAll += totalSum;
    totalGradesCountAll += count;

    subjectDetails[key] = {
      subjectName: subjectNamesMap[key] || key,
      gradesList,
      totalSum: Number(totalSum.toFixed(2)),
      count,
      calculatedAverage,
      isPassing10,
    };
  });

  const globalAcademicAverage = totalGradesCountAll > 0 ? Number((totalPointsAll / totalGradesCountAll).toFixed(2)) : 0;

  // Evaluate eligibility for each Higher Education Field
  const eligibleFields: PostBacField[] = [];
  const ineligibleFields: { field: PostBacField; reasons: string[] }[] = [];

  POST_BAC_FIELDS.forEach((field) => {
    const reasons: string[] = [];

    // Check specific required subjects
    field.admissionConditions.requiredSubjects.forEach((req) => {
      const subjStat = subjectDetails[req.subjectKey];
      if (!subjStat || subjStat.count === 0) {
        reasons.push(`Notes manquantes en ${req.subjectLabel} (minimum requis : ${req.minScore}/20)`);
      } else if (subjStat.calculatedAverage < req.minScore) {
        reasons.push(
          `Moyenne en ${req.subjectLabel} insuffisante (${subjStat.calculatedAverage}/20 vs minimum exigé de ${req.minScore}/20)`
        );
      }
    });

    // Check global average threshold
    if (globalAcademicAverage < field.admissionConditions.globalMinAvg) {
      reasons.push(
        `Moyenne générale académique (${globalAcademicAverage}/20) en-deçà du seuil recommandé (${field.admissionConditions.globalMinAvg}/20)`
      );
    }

    if (reasons.length === 0) {
      eligibleFields.push(field);
    } else {
      ineligibleFields.push({ field, reasons });
    }
  });

  const eligibleCategories = Array.from(new Set(eligibleFields.map((f) => f.categoryLabel)));

  // Psychometric Concordance Analysis
  const userRiasec = records.psychometrics?.dominantRiasec || "IRS";
  const userCognitiveIQ = records.psychometrics?.cognitiveIQScore || 110;
  let alignmentScore = 80;
  let matchDescription = "Très bonne adéquation psycho-intellectuelle avec les exigences de l'enseignement supérieur.";

  if (userCognitiveIQ >= 120) {
    alignmentScore = 95;
    matchDescription = "Profil psychométrique d'excellence avec fort potentiel d'abstraction logique et d'endurance académique.";
  } else if (userCognitiveIQ < 95) {
    alignmentScore = 65;
    matchDescription = "Profil préférentiellement pratique, recommandant des formations axées sur la professionnalisation directe.";
  }

  // Decision formulation
  let recommendedDecisionType: PostBacOrientationDecision["recommendedDecisionType"] = "UNIVERSITE_GRANDES_ECOLES";
  const decisionJustification: string[] = [];
  let officialAdviceSummary = "";

  const wantsApprenticeship = records.userWishedPathway === "apprentissage_metier_postbac";

  if (wantsApprenticeship) {
    if (eligibleFields.length > 0) {
      // Requested apprenticeship while being eligible for higher education fields
      recommendedDecisionType = "APPRENTISSAGE_EXCELLENCE_AVEC_MENTION_ETUDES_POSSIBLES";
      officialAdviceSummary = `Votre demande d'apprentissage professionnel qualifiant post-BAC est ACCORDÉE AVEC MENTION SPÉCIALE D'EXCELLENCE. Le Cabinet Conseil vous informe que vos résultats académiques vous rendent également pleinement éligible à ${eligibleFields.length} filières de l'Enseignement Supérieur. Ce choix délibéré vers un métier porteur constitue un tremplin remarquable pour l'entrepreneuriat et le leadership technique.`;
      decisionJustification.push(
        "Validation de la demande d'apprentissage professionnel qualifiant selon le souhait explicite de l'apprenant.",
        `Constat d'une pleine éligibilité académique à des filières supérieures de premier plan (${eligibleCategories.join(", ")}).`,
        "La double compétence académique et pratique garantit une ascension fulgurante sur le marché de l'emploi."
      );
    } else {
      recommendedDecisionType = "APPRENTISSAGE_REORIENTATION_CONSEILLEE";
      officialAdviceSummary = `Votre demande d'orientation vers l'apprentissage d'un métier porteur post-BAC est ACCORDÉE ET FORTEMENT ENCOURAGÉE. Ce parcours professionnalisant correspond parfaitement à votre profil et vous garantit une qualification technique immédiatement monétisable.`;
      decisionJustification.push(
        "Accord favorable pour l'insertion en filière technique / apprentissage certifié.",
        "Alignement avec les besoins réels du marché économique et de l'emploi."
      );
    }
  } else {
    // Student wanted university field
    if (eligibleFields.length > 0) {
      if (eligibleCategories.includes("Sciences de la Santé & Médicales")) {
        recommendedDecisionType = "SCIENCES_SANTE";
      } else if (eligibleCategories.includes("Ingénierie, Technologies & Informatique")) {
        recommendedDecisionType = "INGENIERIE_TECH";
      } else if (eligibleCategories.includes("Sciences Économiques & de Gestion")) {
        recommendedDecisionType = "ECO_GESTION";
      } else if (eligibleCategories.includes("Droit, Sciences Politiques & Sciences Sociales")) {
        recommendedDecisionType = "DROIT_SOCIAL";
      } else {
        recommendedDecisionType = "UNIVERSITE_GRANDES_ECOLES";
      }

      officialAdviceSummary = `Dossier académique FAVORABLE pour une admission dans les filières de l'Enseignement Supérieur (${eligibleFields.length} filière(s) éligible(s)). Vos moyennes dans les disciplines clés et vos tests psychométriques confirment votre aptitude aux études universitaires.`;
      decisionJustification.push(
        `Moyenne générale académique satisfaisante (${globalAcademicAverage}/20).`,
        `Validation des prérequis dans les matières maîtresses exigées par les facultés et grandes écoles.`,
        `Concordance psychométrique positive (${alignmentScore}%) avec les parcours de l'enseignement supérieur.`
      );
    } else {
      // Rejection / conditional redirect to high-demand trade
      recommendedDecisionType = "APPRENTISSAGE_REORIENTATION_CONSEILLEE";
      officialAdviceSummary = `Votre dossier scolaire ne satisfait pas l'ensemble des moyennes requises pour un accès direct aux filières universitaires sélectionnées. Conformément aux directives d'orientation du Dr BALOGAH, votre demande est redirigée avec bienveillance vers un APPRENTISSAGE PROFESSIONNEL DANS UN MÉTIER PORTEUR POST-BAC (BTS / CQP / Certifications d'Excellence), garantissant un taux d'insertion rapide et une autonomie financière.`;
      decisionJustification.push(
        `Insuffisance des moyennes dans certaines disciplines fondamentales requises pour les facultés d'État.`,
        `Risque d'échec ou d'abandon précoce en première année de licence générale.`,
        `Redirection stratégique vers des formations professionnelles pratiques à fort potentiel d'embauche et d'entrepreneuriat.`
      );
    }
  }

  return {
    studentName: records.studentName || "Étudiant / Candidat Post-BAC",
    date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    bacSerie: records.bacSerie || "Série Non Définie",
    subjectDetails,
    globalAcademicAverage,
    eligibleFields,
    ineligibleFields,
    eligibleCategories,
    recommendedDecisionType,
    officialAdviceSummary,
    recommendedApprenticeshipTrades: POST_BAC_APPRENTICESHIP_TRADES,
    decisionJustification,
    psychometricConcordance: {
      dominantRiasec: userRiasec,
      alignmentScore,
      matchDescription,
      cognitiveAptitude: userCognitiveIQ >= 115 ? "Très Élevée (Capacité d'abstraction supérieure)" : "Standard (Bonne adaptabilité pratique)",
    },
    counselorSignatureDate: new Date().toLocaleDateString("fr-FR"),
  };
}

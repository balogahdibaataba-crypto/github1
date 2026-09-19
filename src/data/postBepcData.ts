import { HighSchoolStream, ApprenticeshipTrade, PostBepcStudentRecords, PostBepcOrientationDecision, SubjectCalculationDetail } from "../types";

/**
 * BASE DE DONNÉES OFFICIELLE DES SÉRIES DU LYCÉE
 * (Enseignement Général Littéraire & Scientifique, Enseignement Technique Tertiaire & Industriel)
 * Cabinet Conseil Dr BALOGAH Dibaataba - OrientaAfrik
 */
export const HIGH_SCHOOL_STREAMS: HighSchoolStream[] = [
  // 1. SÉRIE A4 - LITTÉRAIRE
  {
    id: "stream-a4",
    code: "A4",
    name: "Seconde Littéraire & Sciences Humaines (Série A4)",
    category: "Général Littéraire",
    shortDescription: "Filière d'excellence littéraire, linguistique, philosophique, juridique et des sciences humaines.",
    fullDescription: "La série A4 prépare les élèves aux études supérieures dans les domaines du droit, des sciences politiques, de la communication, du journalisme, des langues étrangères, de la sociologie, de la psychologie, de la diplomatie et de l'enseignement.",
    admissionConditions: {
      requiredSubjects: ["Français", "Anglais"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Français ET en Anglais.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Français / Littérature", coefficient: 5 },
      { subject: "Philosophie (1ère / Tle)", coefficient: 5 },
      { subject: "Anglais", coefficient: 4 },
      { subject: "Histoire-Géographie", coefficient: 3 },
      { subject: "Langue Vivante 2 (Allemand / Espagnol)", coefficient: 3 },
    ],
    idealProfile: [
      "Forte passion pour la lecture, l'expression écrite et l'éloquence orale",
      "Curiosité pour l'actualité, l'histoire, la culture générale et le débat d'idées",
      "Aptitudes solides en langues vivantes (Français, Anglais, Allemand/Espagnol)",
      "Esprit d'analyse critique, de synthèse et argumentation structurée"
    ],
    higherEducationOutcomes: [
      "Faculté de Droit & Sciences Politiques (Licence, Master, Doctorat)",
      "Faculté des Lettres, Langues & Arts (FLLA)",
      "École Supérieure de Journalisme & Communication",
      "Instituts de Diplomatie & Relations Internationales",
      "Écoles Normales Supérieures (ENS) - Enseignement secondaire",
      "Sciences de l'Éducation, Sociologie, Psychologie & Travail Social"
    ],
    targetCareers: [
      "Magistrat, Avocat, Juriste d'entreprise, Notaire",
      "Journaliste, Rédacteur en chef, Spécialiste des Relations Publiques",
      "Diplomate, Cadre d'organisations internationales (ONU, UA, CEDEAO)",
      "Professeur certifié de Lettres, Anglais ou Histoire-Géo",
      "Traducteur-Interprète de conférences, Linguiste",
      "Consultant en Communication Institutionnelle & Marketing de Contenu"
    ],
    isHighDemand: true,
  },

  // 2. SÉRIE S (C, D) - SCIENTIFIQUE
  {
    id: "stream-s",
    code: "S (C, D)",
    name: "Seconde Scientifique (Tronc Commun vers Terminale C & D)",
    category: "Général Scientifique",
    shortDescription: "Filière des sciences fondamentales, médicales, technologiques, mathématiques et ingénierie.",
    fullDescription: "La Seconde Scientifique offre un socle rigoureux en sciences dures pour préparer vers la Terminale C (Mathématiques et Sciences Physiques) ou la Terminale D (Sciences de la Vie et de la Terre, Chimie et Mathématiques), ouvrant sur la médecine, la pharmacie, les écoles polytechniques d'ingénieurs, l'agronomie et l'informatique.",
    admissionConditions: {
      requiredSubjects: ["Mathématiques", "Physique-Chimie (PCT)", "Sciences de la Vie et de la Terre (SVT)"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Mathématiques, en Physique-Chimie ET en SVT.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Mathématiques", coefficient: 6 },
      { subject: "Physique-Chimie", coefficient: 5 },
      { subject: "Sciences de la Vie et de la Terre (SVT)", coefficient: 4 },
      { subject: "Français", coefficient: 3 },
      { subject: "Anglais", coefficient: 2 },
    ],
    idealProfile: [
      "Esprit logique, rigueur mathématique et goût pour la résolution de problèmes",
      "Intérêt pour l'expérimentation scientifique, le vivant, l'espace et la matière",
      "Bonne capacité de concentration et persévérance face aux calculs abstraits",
      "Curiosité pour les innovations technologiques et médicales"
    ],
    higherEducationOutcomes: [
      "Faculté des Sciences de Santé (FSS) : Médecine générale, Pharmacie, Odontologie",
      "Écoles Nationales Supérieures d'Ingénieurs (ENSI, INP-HB, 2iE, ESP)",
      "Facultés des Sciences (Mathématiques, Physique, Chimie, Biologie)",
      "Écoles Supérieures d'Agronomie (ESA) & Sciences Vétérinaires",
      "Instituts de Génie Informatique, Télécoms & Intelligence Artificielle",
      "Classes Préparatoires aux Grandes Écoles (CPGE Scientifiques)"
    ],
    targetCareers: [
      "Médecin généraliste / Spécialiste, Chirurgien, Pharmacien, Biologiste",
      "Ingénieur en Intelligence Artificielle, Développeur Logiciel, Data Scientist",
      "Ingénieur des Travaux Publics, Ingénieur Électromécanicien, Énergéticien",
      "Ingénieur Agronome, Agro-économiste, Spécialiste en Sécurité Alimentaire",
      "Architecte, Géomètre-Topographe, Urbaniste",
      "Enseignant-Chercheur en Mathématiques, Physique ou Biologie"
    ],
    isHighDemand: true,
  },

  // 3. SÉRIE G1 - TECHNIQUE TERTIAIRE (SECRÉTARIAT / BUREAUTIQUE / GESTION ADMINISTRATIVE)
  {
    id: "stream-g1",
    code: "G1",
    name: "Techniques Administratives, Secrétariat & Bureautique (Série G1)",
    category: "Technique Tertiaire",
    shortDescription: "Filière technique tertiaire centrée sur la communication professionnelle, l'organisation administrative et la gestion de bureau.",
    fullDescription: "La série G1 forme des spécialistes de l'administration, du secrétariat moderne bilingue, de la bureautique avancée, de l'assistanat de direction et de la gestion documentaire numérique pour les entreprises et administrations.",
    admissionConditions: {
      requiredSubjects: ["Français", "Anglais"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Français ET en Anglais.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Communication & Organisation Administrative", coefficient: 5 },
      { subject: "Français & Correspondance Professionnelle", coefficient: 4 },
      { subject: "Anglais Commercial", coefficient: 4 },
      { subject: "Bureautique & Informatique de Gestion", coefficient: 3 },
      { subject: "Droit & Économie d'Entreprise", coefficient: 3 },
    ],
    idealProfile: [
      "Excellente maîtrise de la langue française écrite et de l'orthographe",
      "Sens aigu de l'organisation, de la méthode, de la discrétion et de la rigueur",
      "Aisance relationnelle, accueil et sens du protocole",
      "Intérêt pour les outils bureautiques numériques (Word, Excel, ERP, messageries)"
    ],
    higherEducationOutcomes: [
      "BTS / Licence Pro Secrétariat de Direction Bilingue",
      "BTS / Licence Pro Assistanat de Gestion PME-PMI",
      "Licence Pro Ressources Humaines & Administration du Personnel",
      "Instituts Universitaires de Technologie (IUT) en Gestion Administrative",
      "Écoles de Management & Communication d'Entreprise"
    ],
    targetCareers: [
      "Assistant(e) de Direction Générale, Office Manager",
      "Secrétaire Juridique ou Médical(e)",
      "Chargé(e) d'accueil et des relations publiques en institution",
      "Gestionnaire des flux documentaires et archivage numérique",
      "Assistant(e) en Ressources Humaines"
    ],
    isHighDemand: true,
  },

  // 4. SÉRIE G2 - TECHNIQUE TERTIAIRE (COMPTABILITÉ & GESTION)
  {
    id: "stream-g2",
    code: "G2",
    name: "Techniques Quantitatives de Gestion & Comptabilité (Série G2)",
    category: "Technique Tertiaire",
    shortDescription: "Filière technique financière et comptable d'excellence pour la gestion financière des entreprises.",
    fullDescription: "La série G2 forme aux métiers des chiffres, de la comptabilité générale et analytique, de la finance, de la fiscalité, de l'audit et du contrôle de gestion. Elle allie rigueur mathématique et logique financière.",
    admissionConditions: {
      requiredSubjects: ["Mathématiques", "Physique-Chimie (PCT)", "Sciences de la Vie et de la Terre (SVT)"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Mathématiques, en PCT ET en SVT.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Comptabilité Générale & Financière", coefficient: 6 },
      { subject: "Mathématiques Générales & Financières", coefficient: 5 },
      { subject: "Économie Générale & d'Entreprise", coefficient: 4 },
      { subject: "Droit (Civil, Commercial, Travail)", coefficient: 3 },
      { subject: "Français & Anglais", coefficient: 4 },
    ],
    idealProfile: [
      "Forte affinité avec les chiffres, les calculs et les tableaux structurés",
      "Rigueur morale, intégrité, sens de la précision et du détail",
      "Capacité d'analyse financière et esprit de synthèse",
      "Intérêt pour le monde de la banque, de l'entreprise et de la fiscalité"
    ],
    higherEducationOutcomes: [
      "BTS / DUT / Licence Pro Comptabilité & Gestion des Entreprises",
      "Filière Expertise Comptable (DCG, DSCG, DEC - Expert-Comptable)",
      "Facultés des Sciences Économiques et de Gestion (FASEG)",
      "Écoles Supérieures de Commerce, Banque & Finance",
      "Masters en Audit, Contrôle de Gestion & Ingénierie Financière"
    ],
    targetCareers: [
      "Expert-Comptable, Commissaire aux Comptes",
      "Directeur Administratif et Financier (DAF), Contrôleur de gestion",
      "Auditeur financier en cabinet international (Big Four)",
      "Gestionnaire de portefeuille bancaire, Analyste crédit",
      "Inspecteur des Impôts et du Trésor Public",
      "Comptable unique en PME ou grande entreprise"
    ],
    isHighDemand: true,
  },

  // 5. SÉRIE G3 - TECHNIQUE TERTIAIRE (COMMERCE & MARKETING)
  {
    id: "stream-g3",
    code: "G3",
    name: "Techniques Commerciales, Vente & Marketing (Série G3)",
    category: "Technique Tertiaire",
    shortDescription: "Filière orientée vers le commerce, la prospection commerciale, le marketing et la négociation d'affaires.",
    fullDescription: "La série G3 forme les professionnels du commerce moderne, des techniques de vente, de la gestion de la relation client (CRM), du marketing digital, de la distribution et de la logistique commerciale.",
    admissionConditions: {
      requiredSubjects: ["Mathématiques", "Physique-Chimie (PCT)", "Sciences de la Vie et de la Terre (SVT)"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Mathématiques, en PCT ET en SVT.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Techniques Commerciales & Vente", coefficient: 5 },
      { subject: "Marketing & Études de Marché", coefficient: 4 },
      { subject: "Mathématiques Appliquées & Statistiques", coefficient: 4 },
      { subject: "Économie & Droit Commercial", coefficient: 3 },
      { subject: "Anglais Commercial & Français", coefficient: 4 },
    ],
    idealProfile: [
      "Sens prononcé du contact humain, force de persuasion et dynamisme",
      "Goût pour le défi commercial, la négociation et les objectifs de résultats",
      "Créativité, sens du service client et adaptabilité",
      "Intérêt pour le commerce en ligne (E-commerce) et les réseaux sociaux"
    ],
    higherEducationOutcomes: [
      "BTS / DUT Commerce International / Action Commerciale",
      "Licence Pro Marketing Digital & E-Commerce",
      "Écoles Supérieures de Commerce & Management (BBA, Master)",
      "Licence Pro Logistique, Achats & Supply Chain Management"
    ],
    targetCareers: [
      "Responsable Commercial, Chef des Ventes, Ingénieur Commercial",
      "Responsable Marketing Digital & Growth Hacker",
      "Courtier en Commerce International, Négociateur d'affaires",
      "Gestionnaire de boutique en ligne / E-commerçant",
      "Responsable Relation Client & Fidélisation"
    ],
    isHighDemand: true,
  },

  // 6. SÉRIE F1 - TECHNIQUE INDUSTRIELLE (CONSTRUCTION MÉCANIQUE)
  {
    id: "stream-f1",
    code: "F1",
    name: "Génie Mécanique & Construction Mécanique (Série F1)",
    category: "Technique Industriel & Technologique",
    shortDescription: "Filière industrielle dédiée à la conception, la fabrication mécanique, la CAO/DAO et la maintenance d'équipements industriels.",
    fullDescription: "La série F1 prépare aux technologies de conception mécanique assistée par ordinateur (CAO), à l'usinage conventionnel et numérique (CNC), à l'automatisation et à la maintenance des machines industrielles lourdes et légères.",
    admissionConditions: {
      requiredSubjects: ["Mathématiques", "Physique-Chimie (PCT)", "Sciences de la Vie et de la Terre (SVT)"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Mathématiques, en PCT ET en SVT.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Construction Mécanique & Dessin Industriel (CAO)", coefficient: 6 },
      { subject: "Mathématiques", coefficient: 5 },
      { subject: "Physique Appliquée & Mécanique", coefficient: 5 },
      { subject: "Atelier & Technologie de Fabrication", coefficient: 4 },
      { subject: "Français & Anglais Technique", coefficient: 3 },
    ],
    idealProfile: [
      "Forte vision spatiale 3D et passion pour les machines et moteurs",
      "Précision manuelle alliée à un raisonnement mathématique rigoureux",
      "Plaisir à fabriquer, assembler, diagnostiquer et réparer des systèmes",
      "Aptitude pour les logiciels de dessin assisté par ordinateur (AutoCAD, SolidWorks)"
    ],
    higherEducationOutcomes: [
      "Écoles d'Ingénieurs en Génie Mécanique & Productique (ENSI, INP-HB)",
      "BTS / DUT Génie Mécanique & Productique (GMP)",
      "Licence Pro Conception & Fabrication Assistée par Ordinateur",
      "Instituts de Maintenance Industrielle & Robotique"
    ],
    targetCareers: [
      "Ingénieur en Conception Mécanique / R&D Automobile & Aéronautique",
      "Responsable de Maintenance Industrielle en Usine",
      "Programmeur / Opérateur de Machines-outils à Commande Numérique (CNC)",
      "Chef d'atelier d'usinage et de chaudronnerie de haute précision",
      "Dessinateur-Projeteur Industriel"
    ],
    isHighDemand: true,
  },

  // 7. SÉRIE F2 - TECHNIQUE INDUSTRIELLE (ÉLECTRONIQUE)
  {
    id: "stream-f2",
    code: "F2",
    name: "Génie Électronique & Systèmes Numériques (Série F2)",
    category: "Technique Industriel & Technologique",
    shortDescription: "Filière des circuits imprimés, de l'instrumentation, des télécommunications et des microprocesseurs.",
    fullDescription: "La série F2 forme les techniciens et futurs ingénieurs en électronique analogique et numérique, en systèmes embarqués, en télécommunications, en domotique et en robotique.",
    admissionConditions: {
      requiredSubjects: ["Mathématiques", "Physique-Chimie (PCT)", "Sciences de la Vie et de la Terre (SVT)"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Mathématiques, en PCT ET en SVT.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Électronique Théorique & Appliquée", coefficient: 6 },
      { subject: "Mathématiques", coefficient: 5 },
      { subject: "Physique & Électricité", coefficient: 5 },
      { subject: "Schémas & Laboratoire Électronique", coefficient: 4 },
      { subject: "Informatique Industrielle", coefficient: 3 },
    ],
    idealProfile: [
      "Passion pour les technologies high-tech, les cartes mères, circuits et puces",
      "Minutie, patience et logique de diagnostic de pannes",
      "Goût pour la programmation de microcontrôleurs (Arduino, Raspberry Pi)",
      "Solide compréhension des mathématiques appliquées et des signaux"
    ],
    higherEducationOutcomes: [
      "Écoles d'Ingénieurs en Télécoms, Électronique & Systèmes Embarqués",
      "BTS / DUT Génie Électrique & Informatique Industrielle (GEII)",
      "Licence Pro Télécommunications & Réseaux Mobiles (4G/5G/Fibre)",
      "Formations supérieures en Robotique & Mécatronique"
    ],
    targetCareers: [
      "Ingénieur en Systèmes Embarqués & Objets Connectés (IoT)",
      "Technicien Supérieur / Ingénieur Réseaux Télécoms & Fibre Optique",
      "Concepteur de cartes électroniques pour le secteur médical ou industriel",
      "Spécialiste de la maintenance des équipements biomédicaux hospitaliers",
      "Expert en Domotique et Sécurité Électronique (Vidéosurveillance, Alarmes)"
    ],
    isHighDemand: true,
  },

  // 8. SÉRIE F3 - TECHNIQUE INDUSTRIELLE (ÉLECTROTECHNIQUE & ÉNERGIES)
  {
    id: "stream-f3",
    code: "F3",
    name: "Génie Électrotechnique & Énergies Renouvelables (Série F3)",
    category: "Technique Industriel & Technologique",
    shortDescription: "Filière des courants forts, des réseaux électriques, des transformateurs, du solaire photovoltaïque et de l'automatisation.",
    fullDescription: "La série F3 est le pilier de la transition énergétique en Afrique. Elle forme à la production, au transport, à la distribution et à la gestion de l'énergie électrique haute et basse tension, avec une place centrale accordée aux centrales solaires et hybrides.",
    admissionConditions: {
      requiredSubjects: ["Mathématiques", "Physique-Chimie (PCT)", "Sciences de la Vie et de la Terre (SVT)"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Mathématiques, en PCT ET en SVT.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Électrotechnique & Réseaux Électriques", coefficient: 6 },
      { subject: "Physique Appliquée & Énergétique", coefficient: 5 },
      { subject: "Mathématiques", coefficient: 5 },
      { subject: "Automates Programmables & Schémas Électriques", coefficient: 4 },
      { subject: "Installations Industrielles & Sécurité", coefficient: 3 },
    ],
    idealProfile: [
      "Attrait pour les grands systèmes énergétiques, le solaire, l'éolien et les centrales",
      "Sens aigu du respect des normes de sécurité et de la protection des personnes",
      "Aptitude au travail d'équipe sur chantiers et en postes de distribution",
      "Solides compétences mathématiques et physiques"
    ],
    higherEducationOutcomes: [
      "Écoles d'Ingénieurs Électromécanique, Énergie & Réseaux Électriques",
      "BTS / DUT Électrotechnique & Énergies Renouvelables",
      "Licence Pro Systèmes Solaires Photovoltaïques & Efficacité Énergétique",
      "Instituts Spécialisés 2iE Ouagadougou, ENSI Lomé, ESP Dakar"
    ],
    targetCareers: [
      "Ingénieur / Chef de Projet Centrales Solaires Photovoltaïques",
      "Ingénieur Réseau Électrique (Compagnies Nationales d'Électricité)",
      "Automaticien Industriel, Concepteur d'armoires de puissance",
      "Responsable Sécurité Électrique et Audit d'Efficacité Énergétique",
      "Entrepreneur installateur de solutions solaires pour particuliers et industries"
    ],
    isHighDemand: true,
  },

  // 9. SÉRIE F4 - TECHNIQUE INDUSTRIELLE (GÉNIE CIVIL & BÂTIMENT)
  {
    id: "stream-f4",
    code: "F4",
    name: "Génie Civil, Bâtiment & Travaux Publics (Série F4)",
    category: "Technique Industriel & Technologique",
    shortDescription: "Filière des infrastructures, de la construction de bâtiments, des routes, des ponts et de l'aménagement urbain.",
    fullDescription: "La série F4 forme aux techniques de construction moderne, au dessin de plans d'architecture, au calcul des structures en béton armé, à la topographie, au métré et à la conduite de chantiers de BTP.",
    admissionConditions: {
      requiredSubjects: ["Mathématiques", "Physique-Chimie (PCT)", "Sciences de la Vie et de la Terre (SVT)"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Mathématiques, en PCT ET en SVT.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Dessin d'Architecture & CAO BTP", coefficient: 6 },
      { subject: "Mécanique des Structures & Résistance des Matériaux", coefficient: 5 },
      { subject: "Mathématiques", coefficient: 5 },
      { subject: "Technologie du Bâtiment & Métré", coefficient: 4 },
      { subject: "Topographie & Géotechnique", coefficient: 3 },
    ],
    idealProfile: [
      "Passion pour l'architecture, la construction de bâtiments et les grands ouvrages d'art",
      "Excellente vision de l'espace, sens du dessin technique et des échelles",
      "Goût du travail de terrain, des chantiers et du contact avec les équipes de maçonnerie",
      "Rigueur dans le calcul des volumes, charges et devis quantitatifs"
    ],
    higherEducationOutcomes: [
      "Écoles d'Architecture & d'Urbanisme (EAMAU Lomé, ENSA)",
      "Écoles d'Ingénieurs en Génie Civil (ENSI, 2iE, INP-HB, ESTP)",
      "BTS / DUT Bâtiment, Travaux Publics & Géomètre-Topographe",
      "Licence Pro Conduite de Travaux & Éco-Matériaux de Construction"
    ],
    targetCareers: [
      "Architecte, Urbaniste, Designer d'espaces urbains",
      "Ingénieur en Calcul de Structures Béton Armé / Métallique",
      "Conducteur de Travaux BTP, Directeur de Chantier",
      "Géomètre-Topographe, Cartographe Foncier",
      "Mètreur-Vérificateur, Économiste de la Construction",
      "Entrepreneur Fondateur d'une entreprise générale de BTP"
    ],
    isHighDemand: true,
  },

  // 10. SÉRIE E - MATHÉMATIQUES & TECHNIQUE (HAUT NIVEAU POLYTECHNIQUE)
  {
    id: "stream-e",
    code: "E",
    name: "Mathématiques & Technique (Série E - Voie Royale d'Ingénierie)",
    category: "Technique Industriel & Technologique",
    shortDescription: "Filière d'élite combinant l'excellence théorique des mathématiques pures et la technologie industrielle de pointe.",
    fullDescription: "La série E est la filière technologique d'excellence par excellence. Elle conjugue le très haut niveau mathématique et physique de la série C avec la pratique poussée du dessin industriel, de la mécanique et de l'électrotechnique, formant directement les futurs grands ingénieurs et chercheurs polytechniciens.",
    admissionConditions: {
      requiredSubjects: ["Mathématiques", "Physique-Chimie (PCT)", "Sciences de la Vie et de la Terre (SVT)"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Mathématiques, en PCT ET en SVT.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Mathématiques Supérieures", coefficient: 7 },
      { subject: "Sciences Physiques & Chimie", coefficient: 6 },
      { subject: "Sciences de l'Ingénieur & Technologie", coefficient: 6 },
      { subject: "Informatique & Algorithmique", coefficient: 4 },
      { subject: "Français & Philosophie", coefficient: 3 },
    ],
    idealProfile: [
      "Performances exceptionnelles et passion pour les mathématiques et la physique",
      "Aptitude à comprendre simultanément la théorie abstraite et les applications techniques réelles",
      "Forte endurance de travail et ambition d'intégrer les grandes écoles polytechniques",
      "Esprit d'innovation technologique et d'invention industrielle"
    ],
    higherEducationOutcomes: [
      "Classes Préparatoires aux Grandes Écoles d'Ingénieurs (CPGE MPSI / PTSI)",
      "Instituts Nationaux Polytechniques (INP-HB, Polytechnique Paris, Lausanne)",
      "Écoles Internationales d'Aéronautique, Spatial, Énergie Nucléaire & Robotique",
      "Doctorats en Sciences Physiques et Sciences pour l'Ingénieur"
    ],
    targetCareers: [
      "Ingénieur en Aéronautique, Aérospatiale & Systèmes Autonomes",
      "Ingénieur en Recherche & Développement (R&D) Haute Technologie",
      "Expert en Énergies Avancées & Systèmes Industriels Complexes",
      "Professeur d'Université / Chercheur en Sciences de l'Ingénieur",
      "Directeur Technique (CTO) de grands groupes multinationaux"
    ],
    isHighDemand: true,
  },

  // 11. SÉRIE Ti - TECHNOLOGIES DE L'INFORMATION
  {
    id: "stream-ti",
    code: "Ti",
    name: "Technologies de l'Information & Systèmes Numériques (Série Ti)",
    category: "Technique Industriel & Technologique",
    shortDescription: "Filière technologique moderne spécialisée en informatique, développement de logiciels, réseaux et cybersécurité.",
    fullDescription: "La série Ti prépare aux métiers du numérique dès le lycée : développement d'applications, administration de bases de données, sécurité des réseaux, cloud computing, maintenance matérielle et logiciels libres.",
    admissionConditions: {
      requiredSubjects: ["Mathématiques", "Physique-Chimie (PCT)", "Sciences de la Vie et de la Terre (SVT)"],
      minAverageRequired: 10.0,
      formulaExplanation: "Moyenne cumulée de la 6ème jusqu'au BEPC ≥ 10/20 en Mathématiques, en PCT ET en SVT.",
      bepcRequired: true,
    },
    dominantSubjects: [
      { subject: "Informatique & Programmation (Algorithmes)", coefficient: 6 },
      { subject: "Réseaux & Télécommunications", coefficient: 5 },
      { subject: "Mathématiques", coefficient: 5 },
      { subject: "Physique & Électronique Numérique", coefficient: 4 },
      { subject: "Anglais Technique", coefficient: 3 },
    ],
    idealProfile: [
      "Passionné d'informatique, de code, d'Internet et d'applications mobiles",
      "Bon esprit logique, curiosité technologique et autodidactie",
      "Aisance avec la langue anglaise informatique",
      "Intérêt pour la cybersécurité et l'intelligence artificielle"
    ],
    higherEducationOutcomes: [
      "Licences et Masters en Génie Logiciel, Cybersécurité & Data Science",
      "BTS / DUT Informatique de Gestion & Réseaux",
      "Écoles d'Ingénieurs en Informatique & Télécoms",
      "Certifications Internationales Cisco (CCNA), Microsoft, AWS Cloud, CompTIA"
    ],
    targetCareers: [
      "Développeur d'Applications Web & Mobiles Full-Stack",
      "Administrateur Systèmes, Réseaux & Cloud",
      "Analyste en Cybersécurité & Protection des Données",
      "Technicien Supérieur de Maintenance Informatique & Datacenter",
      "Intégrateur de Solutions d'Intelligence Artificielle"
    ],
    isHighDemand: true,
  }
];

/**
 * BASE DE DONNÉES EXHAUSTIVE DES MÉTIERS DE L'APPRENTISSAGE ET FORMATION PROFESSIONNELLE
 * (Accessible avec ou sans le BEPC - Focus Secteurs Porteurs)
 * Cabinet Conseil Dr BALOGAH Dibaataba - OrientaAfrik
 */
export const APPRENTICESHIP_TRADES: ApprenticeshipTrade[] = [
  // 1. ÉNERGIES RENOUVELABLES & SOLAIRE (SECTEUR PORTEUR MAJEUR)
  {
    id: "appr-1",
    title: "Technicien Installateur & Maintenancier de Centrales Solaires Photovoltaïques",
    category: "Énergies & Électricité",
    description: "Assure le dimensionnement pratique, le câblage, la pose sur toiture et au sol des panneaux solaires, le raccordement des onduleurs, régulateurs et parcs de batteries solaires pour habitations, forages agricoles et entreprises.",
    accessRequirement: "Accessible avec ou sans le BEPC",
    diplomaOrCertificate: "CQP / CAP Installateur Solaire / Attestation de Qualification Professionnelle",
    trainingDuration: "12 à 24 mois (Atelier + Chantiers)",
    keyPracticalSkills: ["Dimensionnement de kits solaires", "Câblage en courant continu et alternatif", "Maintenance de parcs de batteries Li-ion et Gel", "Dépannage d'onduleurs hybrides"],
    careerOutcomes: ["Technicien en entreprise d'énergie solaire", "Chef d'équipe chantiers solaires", "Auto-entrepreneur installateur indépendant"],
    isLeadingSector: true,
    leadingSectorName: "Énergies Renouvelables & Transition Énergétique",
    estimatedMonthlyIncomeFCFA: "200.000 - 650.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-2",
    title: "Électricien Bâtiment & Domotique Moderne",
    category: "Énergies & Électricité",
    description: "Réalise les installations électriques complètes de résidences, bureaux et commerces selon les normes de sécurité en vigueur : tirage de câbles, disjoncteurs, éclairage LED, prises, automatismes de portails et parafoudres.",
    accessRequirement: "Accessible avec ou sans le BEPC",
    diplomaOrCertificate: "CAP / CQP Électricité Bâtiment / Attestation de Fin d'Apprentissage (AFA)",
    trainingDuration: "24 à 36 mois",
    keyPracticalSkills: ["Lecture de schémas électriques", "Pose de tableaux de distribution", "Installation de systèmes domotiques et variateurs", "Détection de courts-circuits"],
    careerOutcomes: ["Artisan électricien agréé", "Chef électricien sur chantiers BTP", "Technicien de maintenance immobilière"],
    isLeadingSector: true,
    leadingSectorName: "BTP Moderne & Aménagement Énergétique",
    estimatedMonthlyIncomeFCFA: "180.000 - 550.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },

  // 2. FROID & CLIMATISATION (SECTEUR TRÈS PORTEUR)
  {
    id: "appr-3",
    title: "Frigoriste & Frigoriste-Climaticien Bâtiment & Automobile",
    category: "Froid, Climatisation & Thermique",
    description: "Installe, entretient, recharge en fluides frigorigènes écologiques et dépanne les climatiseurs split, chambres froides de conservation agricole et réfrigérateurs ménagers et industriels.",
    accessRequirement: "Accessible avec ou sans le BEPC",
    diplomaOrCertificate: "CQP / CAP Froid & Climatisation",
    trainingDuration: "24 à 36 mois",
    keyPracticalSkills: ["Brasure de tuyaux en cuivre", "Tirage au vide et charge en gaz frigorigènes R32/R410A", "Diagnostic électrique des compresseurs", "Entretien antibactérien des évaporateurs"],
    careerOutcomes: ["Installateur dépanneur agréé", "Frigoriste de chaînes agroalimentaires et supermarchés", "Créateur de son propre atelier frigorifique"],
    isLeadingSector: true,
    leadingSectorName: "Froid Industriel & Climatisation Écologique",
    estimatedMonthlyIncomeFCFA: "250.000 - 800.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },

  // 3. BTP & ÉCO-CONSTRUCTION
  {
    id: "appr-4",
    title: "Maçon-Bâtisseur & Spécialiste Béton Armé & Briques Écologiques (BTCS)",
    category: "BTP & Construction",
    description: "Édifie les fondations, murs, dalles, poteaux et finitions d'habitations et d'ouvrages publics. Maîtrise le dosage du mortier, le ferraillage et la fabrication de briques en terre stabilisée écologiques.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CAP / CQP Maçonnerie / Certificat Professionnel BTP",
    trainingDuration: "24 à 36 mois",
    keyPracticalSkills: ["Lecture de plans de fondations", "Ferraillage et coulage de béton", "Montage de murs d'aplomb", "Crépissage et enduits de finition"],
    careerOutcomes: ["Chef maçon de chantier", "Contremaître BTP", "Entrepreneur artisan constructeur"],
    isLeadingSector: true,
    leadingSectorName: "BTP Moderne & Éco-Matériaux de Construction",
    estimatedMonthlyIncomeFCFA: "200.000 - 700.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-5",
    title: "Menuisier Aluminium, Vitrerie & Façades Modernes",
    category: "BTP & Construction",
    description: "Fabrique et pose des portes, baies vitrées coulissantes, fenêtres en profilés aluminium, vérandas, cloisons amovibles de bureaux et rampes d'escaliers design.",
    accessRequirement: "Accessible avec ou sans le BEPC",
    diplomaOrCertificate: "CQP Menuiserie Aluminium & Vitrerie / Attestation d'Apprentissage",
    trainingDuration: "18 à 30 mois",
    keyPracticalSkills: ["Découpe millimétrée de profilés alu", "Pose de verres trempés et sécurit", "Assemblage mécanique et joints d'étanchéité", "Pose de serrures multipoints"],
    careerOutcomes: ["Artisan atelier d'aluminium", "Sous-traitant de promoteurs immobiliers", "Chef d'entreprise de vitrerie moderne"],
    isLeadingSector: true,
    leadingSectorName: "BTP & Finition Décorative Haut de Gamme",
    estimatedMonthlyIncomeFCFA: "220.000 - 750.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-6",
    title: "Plombier Sanitaire & Installateur de Forages Hydrauliques",
    category: "BTP & Construction",
    description: "Conçoit et installe les réseaux d'alimentation en eau potable, d'évacuation des eaux usées, la pose de sanitaires, châteaux d'eau, surpresseurs et pompes immergées solaires.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CAP / CQP Plomberie Sanitaire",
    trainingDuration: "24 mois",
    keyPracticalSkills: ["Raccordement tuyauteries PPR, PVC et multicouche", "Pose de pompes immergées et ballons sous pression", "Débouchage et détection de fuites cachées", "Installation d'équipements de salle de bains modernes"],
    careerOutcomes: ["Plombier indépendant d'urgence", "Technicien hydraulique de forages ruraux et urbains", "Chef d'équipe plomberie BTP"],
    isLeadingSector: true,
    leadingSectorName: "Hydraulique, Eau Potable & Assainissement",
    estimatedMonthlyIncomeFCFA: "180.000 - 600.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-7",
    title: "Carreleur-Mosaïste & Poseur de Résines Époxy 3D",
    category: "BTP & Construction",
    description: "Réalise la pose de carrelage au sol et mural, faïence de luxe, marbre, pavés extérieurs et revêtements contemporains en résine époxy 3D décorative.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CQP / Attestation d'Apprentissage Maître Artisan",
    trainingDuration: "18 à 24 mois",
    keyPracticalSkills: ["Nivellement de chapes", "Découpe de carreaux grand format", "Jointoiement étanche", "Application de résine de sol 3D sans joint"],
    careerOutcomes: ["Artisan carreleur de résidences de prestige", "Chef poseur en rénovation immobilière"],
    isLeadingSector: true,
    leadingSectorName: "Décoration Immobilière & Design Intérieur",
    estimatedMonthlyIncomeFCFA: "170.000 - 500.000 FCFA",
    entrepreneurshipPotential: "Élevé",
  },
  {
    id: "appr-8",
    title: "Peintre en Bâtiment, Enduits Décoratifs & Staff / Faux-Plafonds",
    category: "BTP & Construction",
    description: "Prépare les surfaces murales, applique peintures intérieures et extérieures anti-humidité, peintures décoratives à effet (stuc, sablé) et fabrique des faux-plafonds modernes en staff/plâtre et LED.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CQP Peinture & Décoration Bâtiment",
    trainingDuration: "18 à 24 mois",
    keyPracticalSkills: ["Ponçage et ratissage d'enduit", "Moulage et pose de corniches en staff", "Harmonisation des palettes de couleurs", "Traitement des fissures et de l'humidité"],
    careerOutcomes: ["Peintre-décorateur professionnel", "Poseur de staff et faux-plafonds lumineux", "Chef d'équipe finition bâtiment"],
    isLeadingSector: true,
    leadingSectorName: "Décoration & Aménagement d'Intérieur",
    estimatedMonthlyIncomeFCFA: "160.000 - 450.000 FCFA",
    entrepreneurshipPotential: "Élevé",
  },

  // 4. MÉCANIQUE & MOBILITÉ MODERNE
  {
    id: "appr-9",
    title: "Mécanicien Automobile & Spécialiste Diagnostic Électronique (Scanner)",
    category: "Mécanique & Maintenance",
    description: "Assure la révision générale des moteurs essence et diesel, le diagnostic des calculateurs électroniques via valise de diagnostic, la réparation des boîtes de vitesses automatiques et des systèmes de freinage ABS.",
    accessRequirement: "Accessible avec ou sans le BEPC",
    diplomaOrCertificate: "CAP / CQP / BT Mécanique & Électronique Automobile",
    trainingDuration: "24 à 36 mois",
    keyPracticalSkills: ["Utilisation de valises OBD de diagnostic scanner", "Démontage et calage de courroies de distribution", "Réparation d'injecteurs et pompes haute pression", "Électricité automobile et démarreurs"],
    careerOutcomes: ["Chef mécanicien en concession automobile", "Créateur de garage moderne multi-marques", "Technicien de flotte de transport"],
    isLeadingSector: true,
    leadingSectorName: "Maintenance Automobile & Diagnostic Digital",
    estimatedMonthlyIncomeFCFA: "200.000 - 700.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-10",
    title: "Mécanicien-Réparateur d'Engins Agricoles & Motoculteurs",
    category: "Mécanique & Maintenance",
    description: "Entretient et répare les tracteurs, moissonneuses, motopompes d'irrigation et décortiqueuses motorisées au service de la mécanisation agricole.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CQP Mécanique Agricole",
    trainingDuration: "24 mois",
    keyPracticalSkills: ["Entretien des circuits hydrauliques", "Réglage de carburateurs et pompes d'irrigation", "Usinage de pièces d'adaptation", "Soudure de châssis agricoles"],
    careerOutcomes: ["Technicien d'ateliers coopératifs agricoles", "Mécanicien itinérant de zones rurales", "Artisan motoriste"],
    isLeadingSector: true,
    leadingSectorName: "Agro-Équipement & Mécanisation Rurale",
    estimatedMonthlyIncomeFCFA: "180.000 - 550.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-11",
    title: "Soudeur-Chaudronnier de Haute Précision (TIG / MIG-MAG / Arc)",
    category: "Métallurgie & Chaudronnerie",
    description: "Assemble et fabrique des portails en fer forgé artistiques, des citernes de stockage d'eau et d'hydrocarbures, des hangars métalliques et des passerelles industrielles.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CQP / CAP Chaudronnerie & Soudure Homologuée",
    trainingDuration: "24 à 36 mois",
    keyPracticalSkills: ["Soudure à l'arc électrode enrobée", "Soudure TIG sur inox et aluminium", "Traçage de tôles et cintrage de tubes", "Lecture de plans de charpente métallique"],
    careerOutcomes: ["Soudeur en industrie pétrolière et portuaire", "Artisan ferronnier d'art", "Constructeur de charpentes de hangars"],
    isLeadingSector: true,
    leadingSectorName: "Industrie Métallique & Charpente Lourde",
    estimatedMonthlyIncomeFCFA: "220.000 - 800.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },

  // 5. AGROALIMENTAIRE, TRANSFORMATION & ÉLEVAGE (SECTEUR CLÉ DE SOUVERAINETÉ)
  {
    id: "appr-12",
    title: "Technicien Agro-Transformateur de Produits Locaux (Jus, Farines, Conserves)",
    category: "Agroalimentaire & Élevage",
    description: "Transforme les récoltes locales (ananas, mangue, manioc, maïs, soja, épices) en produits finis emballés selon les normes d'hygiène HACCP : jus pasteurisés, farines infantiles enrichies, chips, fruits séchés et huiles de première pression.",
    accessRequirement: "Accessible avec ou sans le BEPC",
    diplomaOrCertificate: "CQP Transformation Agroalimentaire / Certificat Qualité Hygiène",
    trainingDuration: "12 à 24 mois",
    keyPracticalSkills: ["Procédés de pasteurisation et mise en bouteille stérile", "Dosage d'ingrédients et formulation de recettes", "Conditionnement sous vide et étiquetage légal", "Gestion des stocks et traçabilité"],
    careerOutcomes: ["Créateur d'une unité de transformation agroalimentaire de marque locale", "Chef de production en usine agroalimentaire", "Fournisseur de supermarchés et boutiques bio"],
    isLeadingSector: true,
    leadingSectorName: "Agro-Industrie & Valorisation des Produits du Terroir",
    estimatedMonthlyIncomeFCFA: "200.000 - 900.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-13",
    title: "Éleveur Professionnel Avicole (Poulets de Chair & Pondeuses) & Alimentateur",
    category: "Agroalimentaire & Élevage",
    description: "Gère des fermes modernes de production d'œufs de table et de poulets de chair : construction de poulaillers aérés, plan de prophylaxie vaccinale, formulation d'aliments équilibrés et commercialisation.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CQP Aviculture Moderne & Gestion de Ferme",
    trainingDuration: "12 à 18 mois",
    keyPracticalSkills: ["Gestion du planning de vaccination", "Formulation d'aliments à base de maïs, soja et concentrés", "Contrôle de la température et biosécurité", "Vente directe et circuits de distribution d'œufs"],
    careerOutcomes: ["Propriétaire de ferme avicole rentable", "Conseiller technique en provenderie", "Responsable d'élevage en exploitation intégrée"],
    isLeadingSector: true,
    leadingSectorName: "Agrobusiness & Sécurité Alimentaire",
    estimatedMonthlyIncomeFCFA: "250.000 - 1.200.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-14",
    title: "Pisciculteur Moderne (Élevage de Tilapia & Clarias en Bacs et Étangs)",
    category: "Agroalimentaire & Élevage",
    description: "Produit du poisson frais en bacs hors-sol, étangs ou systèmes en recirculation (RAS) : reproduction artificielle par insémination, grossissement, alimentation flottante et vente aux poissonneries et restaurants.",
    accessRequirement: "Accessible avec ou sans le BEPC",
    diplomaOrCertificate: "CQP Pisciculture & Aquaculture Continentale",
    trainingDuration: "12 mois",
    keyPracticalSkills: ["Production d'alevins par reproduction artificielle", "Contrôle des paramètres de l'eau (pH, oxygène dissous, ammoniac)", "Gestion du nourrissage et calibrage régulier", "Construction de bassins en bâche étanche"],
    careerOutcomes: ["Entrepreneur aquacole", "Gestionnaire de ferme piscicole commerciale", "Fournisseur de poissons frais pour les marchés"],
    isLeadingSector: true,
    leadingSectorName: "Aquaculture & Production Halieutique",
    estimatedMonthlyIncomeFCFA: "200.000 - 850.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-15",
    title: "Maraîcher Urbain & Spécialiste Cultures Hors-Sol / Hydroponie",
    category: "Agroalimentaire & Élevage",
    description: "Cultive des légumes frais (tomates, piments, laitues, carottes, concombres) en milieu périurbain avec des techniques modernes de goutte-à-goutte et de substrats hors-sol sans pesticides chimiques.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CQP Maraîchage Écologique & Hydroponie",
    trainingDuration: "12 mois",
    keyPracticalSkills: ["Installation de systèmes d'irrigation goutte-à-goutte", "Fabrication de compost et biopesticides naturels", "Gestion des rotations de cultures et calendrier de semis", "Vente en paniers maraîchers aux ménages"],
    careerOutcomes: ["Entrepreneur maraîcher bio", "Fournisseur d'hôtels et restaurants de la capitale"],
    isLeadingSector: true,
    leadingSectorName: "Agriculture Urbaine & Agro-Écologie",
    estimatedMonthlyIncomeFCFA: "180.000 - 600.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },

  // 6. NUMÉRIQUE DE PROXIMITÉ & RÉPARATION HIGH-TECH
  {
    id: "appr-16",
    title: "Technicien Réparateur de Smartphones, Tablettes & Micro-Soudure CMS",
    category: "Numérique & Électronique",
    description: "Réalise le diagnostic, le changement d'écrans OLED, le remplacement de puces de charge (Tristar/U2), le désoxydation des cartes mères tombées dans l'eau et le déblocage logiciel officiel de téléphones.",
    accessRequirement: "Accessible avec ou sans le BEPC",
    diplomaOrCertificate: "CQP Réparation GSM / Certificat Expert Micro-Soudure",
    trainingDuration: "12 à 18 mois",
    keyPracticalSkills: ["Micro-soudure sous microscope de composants 0201", "Remplacement d'afficheurs et nappes tactiles", "Flashe et restauration de systèmes Android et iOS", "Remplacement de connecteurs de charge USB-C et Lightning"],
    careerOutcomes: ["Propriétaire de boutique de réparation GSM", "Technicien de SAV pour distributeurs officiels de téléphones"],
    isLeadingSector: true,
    leadingSectorName: "Économie Circulaire Numérique & SAV High-Tech",
    estimatedMonthlyIncomeFCFA: "200.000 - 600.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-17",
    title: "Technicien de Maintenance Ordinateurs, Imprimantes & Réseaux Wi-Fi Locaux",
    category: "Numérique & Électronique",
    description: "Assure le dépannage matériel des PC portables et fixes (remplacement de claviers, disques SSD, mémoire RAM), l'éradication des virus, la recharge de toners et l'installation de routeurs Wi-Fi sécurisés.",
    accessRequirement: "Accessible avec ou sans le BEPC",
    diplomaOrCertificate: "CQP Maintenance Informatique & Réseaux de Proximité",
    trainingDuration: "12 à 24 mois",
    keyPracticalSkills: ["Installation propre de systèmes d'exploitation et logiciels de bureautique", "Nettoyage thermique et remplacement de pâte thermique", "Maintenance préventive des imprimantes laser et multifonctions", "Configuration de caméras IP et points d'accès Wi-Fi"],
    careerOutcomes: ["Artisan informaticien de quartier", "Technicien support informatique en PME"],
    isLeadingSector: true,
    leadingSectorName: "Services Numériques de Proximité",
    estimatedMonthlyIncomeFCFA: "170.000 - 450.000 FCFA",
    entrepreneurshipPotential: "Élevé",
  },

  // 7. MODE, COUTURE & TEXTILE AFRICAIN
  {
    id: "appr-18",
    title: "Styliste-Modéliste & Maître Tailleur en Haute Couture Africaine (Pagne & Prêt-à-Porter)",
    category: "Mode, Textile & Habillement",
    description: "Crée des vêtements de prestige masculins et féminins en pagnes traditionnels (Wax, Kente, Batik, Faso Danfani) et tissus nobles : dessin de croquis de mode, patronage sur mesure, coupe et broderies artistiques.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CAP / CQP Couture & Stylisme / Diplôme de Maître Tailleur",
    trainingDuration: "24 à 36 mois",
    keyPracticalSkills: ["Prise de mesures morphologiques précises", "Tracé de patrons et gradation de tailles", "Montage de cols, vestes doublées, chemises et robes de cérémonie", "Broderie main et machine industrielle"],
    careerOutcomes: ["Créateur de sa propre maison de haute couture", "Costumier de spectacles et défilés de mode", "Fabricant de prêt-à-porter exportable"],
    isLeadingSector: true,
    leadingSectorName: "Industrie Textile, Mode & Création Panafricaine",
    estimatedMonthlyIncomeFCFA: "200.000 - 1.000.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-19",
    title: "Tapissier-Garnisseur & Spécialiste Décoration Salons & Voitures",
    category: "Mode, Textile & Habillement",
    description: "Fabrique et rénove les fauteuils, canapés modernes en cuir et velours, têtes de lit capitonnées et habillage complet des sièges et toits de voitures.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CQP Tapisserie & Sellerie Générale",
    trainingDuration: "24 mois",
    keyPracticalSkills: ["Coupe et couture de cuir et similicuir lourd", "Pose de mousse haute densité et ressorts", "Capitonnage et finitions par clous décoratifs", "Habillage sur mesure de sièges d'automobiles"],
    careerOutcomes: ["Artisan tapissier d'ameublement", "Gérant d'atelier de sellerie automobile"],
    isLeadingSector: false,
    estimatedMonthlyIncomeFCFA: "150.000 - 450.000 FCFA",
    entrepreneurshipPotential: "Élevé",
  },

  // 8. SOINS CORPORELS, BEAUTÉ & BIEN-ÊTRE
  {
    id: "appr-20",
    title: "Esthéticienne-Cosméticienne & Spécialiste Soins Naturels de la Peau Noire",
    category: "Beauté & Bien-être",
    description: "Pratique les soins du visage, le gommage corporel, l'onglerie moderne (pose de gel, capsules, nail art), le maquillage professionnel pour cérémonies et la fabrication de cosmétiques à base de karité et coco.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CAP / CQP Esthétique & Cosmétique Naturelle",
    trainingDuration: "12 à 24 mois",
    keyPracticalSkills: ["Diagnostic du type de peau et soins adaptés", "Pose et façonnage d'ongles résine et acrylique", "Maquillage événementiel haute définition", "Conseil en produits dermocosmétiques sans produits éclaircissants toxiques"],
    careerOutcomes: ["Gérante d'institut de beauté et spa", "Maquilleuse professionnelle de mariages et tournages vidéo", "Créatrice de marque de cosmétiques naturels"],
    isLeadingSector: true,
    leadingSectorName: "Industrie Cosmétique & Économie du Bien-être",
    estimatedMonthlyIncomeFCFA: "180.000 - 650.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-21",
    title: "Coiffeur-Barbier Visagiste & Spécialiste Nattes / Locks Artistiques",
    category: "Beauté & Bien-être",
    description: "Réalise coupes pour hommes au rasoir et tondeuse avec dégradés américains, création et entretien de locks, pose de perruques lace wigs et coiffures traditionnelles africaines.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CQP Coiffure & Soins Capillaires",
    trainingDuration: "12 à 24 mois",
    keyPracticalSkills: ["Techniques de dégradé à blanc et contours précis", "Départ et reprise de locks à l'aiguille", "Tressage rapide et régulier", "Colorations et soins profonds du cheveu crépu naturel"],
    careerOutcomes: ["Propriétaire de salon de coiffure moderne / Barbershop branché", "Coiffeur à domicile haut de gamme"],
    isLeadingSector: false,
    estimatedMonthlyIncomeFCFA: "150.000 - 500.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },

  // 9. HÔTELLERIE, RESTAURATION & MÉTIERS DE BOUCHE
  {
    id: "appr-22",
    title: "Chef Cuisinier en Gastronomie Africaine & Cuisine Internationale",
    category: "Restauration, Hôtellerie & Métiers de Bouche",
    description: "Conçoit les cartes de menus, prépare les plats traditionnels raffinés (sauces locales, poissons braisés, viandes marinées) et mets internationaux pour hôtels, maquis chics et traiteurs d'événements.",
    accessRequirement: "Accessible avec ou sans le BEPC",
    diplomaOrCertificate: "CAP / CQP Cuisine & Restauration / Diplôme des Arts Culinaires",
    trainingDuration: "18 à 24 mois",
    keyPracticalSkills: ["Maîtrise des cuissons et assaisonnements équilibrés", "Présentation artistique d'assiettes gastronomiques", "Gestion des règles d'hygiène alimentaire et de la chaîne du froid", "Calcul du coût de revient et gestion des commandes"],
    careerOutcomes: ["Chef cuisinier en grand hôtel ou restaurant", "Traiteur événementiel pour mariages et banquets", "Gérant de restaurant ou fast-food africain"],
    isLeadingSector: true,
    leadingSectorName: "Tourisme, Hôtellerie & Gastronomie Africaine",
    estimatedMonthlyIncomeFCFA: "200.000 - 750.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },
  {
    id: "appr-23",
    title: "Pâtissier-Boulanger & Glacier Artisanal",
    category: "Restauration, Hôtellerie & Métiers de Bouche",
    description: "Fabrique pains spéciaux, baguettes croustillantes, viennoiseries feuilletées (croissants), gâteaux personnalisés en pâte à sucre pour anniversaires et glaces artisanales aux fruits tropicaux.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CAP / CQP Boulangerie-Pâtisserie Moderne",
    trainingDuration: "18 à 24 mois",
    keyPracticalSkills: ["Pétrissage, fermentation et cuisson au four professionnel", "Montage de pièces montées et gâteaux de mariage", "Travail du chocolat et décors personnalisés", "Fabrication de crèmes pâtissières et ganaches"],
    careerOutcomes: ["Chef pâtissier en boulangerie moderne", "Créateur de sa propre pâtisserie de commande en ligne"],
    isLeadingSector: true,
    leadingSectorName: "Artisanat Alimentaire & Pâtisserie Événementielle",
    estimatedMonthlyIncomeFCFA: "180.000 - 600.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  },

  // 10. BOIS & ÉBÉNISTERIE MODERNE
  {
    id: "appr-24",
    title: "Ébéniste-Designer & Menuisier Bois Moderne (Cuisines Équipées & Dressings)",
    category: "Bois, Ameublement & Ébénisterie",
    description: "Crée des meubles sur mesure haut de gamme (tables en teck ou iroko, dressings encastrés, meubles TV avec éclairage LED, portes sculptées) à partir de bois massif et panneaux mélaminés.",
    accessRequirement: "Accessible sans le BEPC (Tous niveaux)",
    diplomaOrCertificate: "CAP / CQP Menuiserie-Ébénisterie",
    trainingDuration: "24 à 36 mois",
    keyPracticalSkills: ["Rabotage, toupillage et assemblage à tenon-mortaise", "Conception de meubles modernes en 3D", "Application de vernis polyuréthane au pistolet", "Pose de quincaillerie à fermeture amortie"],
    careerOutcomes: ["Artisan ébéniste de mobilier de luxe", "Installateur de cuisines modernes et placards", "Chef d'atelier de menuiserie bois"],
    isLeadingSector: true,
    leadingSectorName: "Ameublement & Design d'Habitat",
    estimatedMonthlyIncomeFCFA: "190.000 - 650.000 FCFA",
    entrepreneurshipPotential: "Très Élevé",
  }
];

/**
 * QUESTIONNAIRE PSYCHOMÉTRIQUE D'INTÉRÊTS ET D'ASPIRATIONS POST-BEPC
 * Cabinet Dr BALOGAH Dibaataba
 */
export const POST_BEPC_INTEREST_QUESTIONS = [
  {
    id: 1,
    questionText: "Quel type d'activités vous passionne le plus au quotidien ?",
    options: [
      { label: "Lire des romans, débattre, rédiger des textes, apprendre de nouvelles langues étrangères", pathway: "A4", scoreCategory: "litteraire" },
      { label: "Résoudre des calculs complexes, comprendre le fonctionnement des cellules vivantes et des réactions chimiques", pathway: "S", scoreCategory: "scientifique" },
      { label: "Gérer un budget, calculer des profits, faire des comptes ou organiser des documents de bureau", pathway: "G2_G1", scoreCategory: "gestion" },
      { label: "Démonter des appareils, réparer un moteur, manipuler des câbles électriques ou fabriquer des objets de vos mains", pathway: "technique_apprentissage", scoreCategory: "technique_artisanat" }
    ]
  },
  {
    id: 2,
    questionText: "Quel est votre objectif principal après l'obtention de votre diplôme ?",
    options: [
      { label: "Faire de longues études universitaires (Doctorat, Master, Magistrature, Grande École)", pathway: "lycee_general", scoreCategory: "etudes_longues" },
      { label: "Apprendre rapidement un métier concret pour créer ma propre entreprise et être financièrement autonome", pathway: "apprentissage_metier", scoreCategory: "insertion_rapide" },
      { label: "Acquérir des compétences techniques spécialisées (BTS, Licence Pro, Ingénierie) puis entrer sur le marché de l'emploi", pathway: "lycee_technique", scoreCategory: "technologique" },
      { label: "Créer un commerce ou une activité de services dans les énergies, le bâtiment ou l'agrobusiness", pathway: "apprentissage_porteur", scoreCategory: "entrepreneuriat" }
    ]
  },
  {
    id: 3,
    questionText: "Face à une panne ou un problème concret, quelle est votre première réaction ?",
    options: [
      { label: "Chercher à comprendre le mécanisme par la logique mathématique et physique", pathway: "S_F", scoreCategory: "scientifique" },
      { label: "Prendre des outils et tester immédiatement le démontage et le remplacement des pièces", pathway: "apprentissage", scoreCategory: "pratique" },
      { label: "Rédiger une synthèse du problème et consulter des documents explicatifs", pathway: "A4_G1", scoreCategory: "litteraire" },
      { label: "Calculer le coût de réparation et évaluer la rentabilité d'acheter une nouvelle pièce", pathway: "G2_G3", scoreCategory: "commercial" }
    ]
  },
  {
    id: 4,
    questionText: "Quel environnement de travail vous attire le plus à long terme ?",
    options: [
      { label: "Un bureau climatisé, un cabinet juridique, un ministère ou une salle de rédaction", pathway: "tertiaire_litteraire", scoreCategory: "bureau" },
      { label: "Un laboratoire de recherche, un hôpital ou un centre d'ingénierie", pathway: "scientifique_medical", scoreCategory: "sciences" },
      { label: "Un atelier moderne, un chantier de construction ou une centrale solaire sur le terrain", pathway: "technique_terrain", scoreCategory: "terrain" },
      { label: "Une entreprise commerciale, une agence bancaire ou une unité de production", pathway: "gestion_commerce", scoreCategory: "affaires" }
    ]
  }
];

/**
 * MOTEUR OFFICIEL DE CALCUL ET D'ORIENTATION POST-BEPC
 * Suivant les règles strictes transmises par le Cabinet Dr BALOGAH Dibaataba :
 * - Calcul de moyenne par matière = somme des notes de la 6ème à la 3ème + BEPC / nombre de notes intégrées.
 * - Accès A4 et G1 : Moyenne Français ≥ 10 ET Moyenne Anglais ≥ 10.
 * - Accès S, G2, G3, F1, F2, F3, F4, E, Ti : Moyenne Maths ≥ 10 ET Moyenne PCT ≥ 10 ET Moyenne SVT ≥ 10.
 * - Si les moyennes nécessaires ne sont pas réunies pour la série demandée -> Orientation vers l'apprentissage d'un métier adapté.
 * - Si l'élève demande l'apprentissage alors qu'il a les moyennes requises pour le lycée -> Lui accorder l'apprentissage tout en lui indiquant qu'il peut poursuivre ses études au lycée en accédant aux séries correspondantes.
 */
export function evaluatePostBepcOrientation(records: PostBepcStudentRecords): PostBepcOrientationDecision {
  const subjectDetails: Record<string, SubjectCalculationDetail> = {};

  const subjectsToEvaluate: Array<{ key: keyof PostBepcStudentRecords["grades"]; name: string }> = [
    { key: "francais", name: "Français" },
    { key: "anglais", name: "Anglais" },
    { key: "mathematiques", name: "Mathématiques" },
    { key: "physiqueChimie", name: "Physique-Chimie (PCT)" },
    { key: "svt", name: "Sciences de la Vie et de la Terre (SVT)" },
    { key: "histoireGeo", name: "Histoire-Géographie" },
    { key: "eps", name: "Éducation Physique & Sportive" },
  ];

  subjectsToEvaluate.forEach(({ key, name }) => {
    const rawSubject = records.grades[key];
    const gradesList: { level: string; term?: string; grade: number }[] = [];

    let sum6 = 0, count6 = 0;
    let sum5 = 0, count5 = 0;
    let sum4 = 0, count4 = 0;
    let sum3 = 0, count3 = 0;

    if (rawSubject) {
      // 6ème
      if (rawSubject.grade6eme) {
        const { t1, t2, t3 } = rawSubject.grade6eme;
        if (t1 !== undefined && t1 !== null && !isNaN(t1)) {
          gradesList.push({ level: "6ème", term: "T1", grade: Number(t1) });
          sum6 += Number(t1); count6++;
        }
        if (t2 !== undefined && t2 !== null && !isNaN(t2)) {
          gradesList.push({ level: "6ème", term: "T2", grade: Number(t2) });
          sum6 += Number(t2); count6++;
        }
        if (t3 !== undefined && t3 !== null && !isNaN(t3)) {
          gradesList.push({ level: "6ème", term: "T3", grade: Number(t3) });
          sum6 += Number(t3); count6++;
        }
      }

      // 5ème
      if (rawSubject.grade5eme) {
        const { t1, t2, t3 } = rawSubject.grade5eme;
        if (t1 !== undefined && t1 !== null && !isNaN(t1)) {
          gradesList.push({ level: "5ème", term: "T1", grade: Number(t1) });
          sum5 += Number(t1); count5++;
        }
        if (t2 !== undefined && t2 !== null && !isNaN(t2)) {
          gradesList.push({ level: "5ème", term: "T2", grade: Number(t2) });
          sum5 += Number(t2); count5++;
        }
        if (t3 !== undefined && t3 !== null && !isNaN(t3)) {
          gradesList.push({ level: "5ème", term: "T3", grade: Number(t3) });
          sum5 += Number(t3); count5++;
        }
      }

      // 4ème
      if (rawSubject.grade4eme) {
        const { t1, t2, t3 } = rawSubject.grade4eme;
        if (t1 !== undefined && t1 !== null && !isNaN(t1)) {
          gradesList.push({ level: "4ème", term: "T1", grade: Number(t1) });
          sum4 += Number(t1); count4++;
        }
        if (t2 !== undefined && t2 !== null && !isNaN(t2)) {
          gradesList.push({ level: "4ème", term: "T2", grade: Number(t2) });
          sum4 += Number(t2); count4++;
        }
        if (t3 !== undefined && t3 !== null && !isNaN(t3)) {
          gradesList.push({ level: "4ème", term: "T3", grade: Number(t3) });
          sum4 += Number(t3); count4++;
        }
      }

      // 3ème
      if (rawSubject.grade3eme) {
        const { t1, t2, t3 } = rawSubject.grade3eme;
        if (t1 !== undefined && t1 !== null && !isNaN(t1)) {
          gradesList.push({ level: "3ème", term: "T1", grade: Number(t1) });
          sum3 += Number(t1); count3++;
        }
        if (t2 !== undefined && t2 !== null && !isNaN(t2)) {
          gradesList.push({ level: "3ème", term: "T2", grade: Number(t2) });
          sum3 += Number(t2); count3++;
        }
        if (t3 !== undefined && t3 !== null && !isNaN(t3)) {
          gradesList.push({ level: "3ème", term: "T3", grade: Number(t3) });
          sum3 += Number(t3); count3++;
        }
      }

      // BEPC Examen
      if (rawSubject.gradeBepc !== undefined && rawSubject.gradeBepc !== null && !isNaN(rawSubject.gradeBepc)) {
        gradesList.push({ level: "BEPC", term: "Examen", grade: Number(rawSubject.gradeBepc) });
      }
    }

    const count = gradesList.length;
    const totalSum = gradesList.reduce((acc, item) => acc + item.grade, 0);
    const calculatedAverage = count > 0 ? Number((totalSum / count).toFixed(2)) : 0;
    const isPassing10 = count > 0 && calculatedAverage >= 10.0;

    subjectDetails[key as string] = {
      subjectName: name,
      gradesList,
      totalSum,
      count,
      calculatedAverage,
      isPassing10,
      annualAverages: {
        avg6eme: count6 > 0 ? Number((sum6 / count6).toFixed(2)) : null,
        avg5eme: count5 > 0 ? Number((sum5 / count5).toFixed(2)) : null,
        avg4eme: count4 > 0 ? Number((sum4 / count4).toFixed(2)) : null,
        avg3eme: count3 > 0 ? Number((sum3 / count3).toFixed(2)) : null,
        gradeBepc: rawSubject?.gradeBepc !== undefined && rawSubject?.gradeBepc !== null ? Number(rawSubject.gradeBepc) : null,
      }
    };
  });

  const avgFrancais = subjectDetails["francais"]?.calculatedAverage || 0;
  const avgAnglais = subjectDetails["anglais"]?.calculatedAverage || 0;
  const avgMaths = subjectDetails["mathematiques"]?.calculatedAverage || 0;
  const avgPct = subjectDetails["physiqueChimie"]?.calculatedAverage || 0;
  const avgSvt = subjectDetails["svt"]?.calculatedAverage || 0;

  // Conditions strictes d'accès :
  // A4 et G1 : Français ≥ 10 ET Anglais ≥ 10
  const isEligibleForA4_G1 = avgFrancais >= 10.0 && avgAnglais >= 10.0;

  // S, G2, G3, F1, F2, F3, F4, E, Ti : Maths ≥ 10 ET PCT ≥ 10 ET SVT ≥ 10
  const isEligibleForS_G2_G3_F1_F4_E_Ti = avgMaths >= 10.0 && avgPct >= 10.0 && avgSvt >= 10.0;

  // Liste des séries éligibles et inéligibles
  const eligibleStreams: HighSchoolStream[] = [];
  const ineligibleStreams: { stream: HighSchoolStream; reasons: string[] }[] = [];

  HIGH_SCHOOL_STREAMS.forEach((stream) => {
    const reasons: string[] = [];

    if (stream.code === "A4" || stream.code === "G1") {
      if (avgFrancais < 10.0) {
        reasons.push(`Moyenne cumulée en Français insuffisante (${avgFrancais}/20 < 10/20).`);
      }
      if (avgAnglais < 10.0) {
        reasons.push(`Moyenne cumulée en Anglais insuffisante (${avgAnglais}/20 < 10/20).`);
      }
      if (isEligibleForA4_G1) {
        eligibleStreams.push(stream);
      } else {
        ineligibleStreams.push({ stream, reasons });
      }
    } else {
      // Séries S, G2, G3, F1, F2, F3, F4, E, Ti
      if (avgMaths < 10.0) {
        reasons.push(`Moyenne cumulée en Mathématiques insuffisante (${avgMaths}/20 < 10/20).`);
      }
      if (avgPct < 10.0) {
        reasons.push(`Moyenne cumulée en Physique-Chimie insuffisante (${avgPct}/20 < 10/20).`);
      }
      if (avgSvt < 10.0) {
        reasons.push(`Moyenne cumulée en SVT insuffisante (${avgSvt}/20 < 10/20).`);
      }
      if (isEligibleForS_G2_G3_F1_F4_E_Ti) {
        eligibleStreams.push(stream);
      } else {
        ineligibleStreams.push({ stream, reasons });
      }
    }
  });

  // Sélection des métiers recommandés selon le profil et les intérêts
  let recommendedApprenticeshipTrades = APPRENTICESHIP_TRADES.slice(0, 6);
  if (records.userInterests && records.userInterests.length > 0) {
    const matched = APPRENTICESHIP_TRADES.filter(t => 
      records.userInterests.some(interest => 
        t.category.toLowerCase().includes(interest.toLowerCase()) || 
        t.title.toLowerCase().includes(interest.toLowerCase())
      )
    );
    if (matched.length > 0) {
      recommendedApprenticeshipTrades = matched;
    }
  }

  const decisionJustification: string[] = [];
  let recommendedDecisionType: PostBepcOrientationDecision["recommendedDecisionType"] = "LYCEE_GENERAL";
  let officialAdviceSummary = "";

  // Cas 1 : L'élève a expressément demandé l'apprentissage d'un métier
  if (records.userWishedPathway === "apprentissage_metier") {
    if (isEligibleForA4_G1 || isEligibleForS_G2_G3_F1_F4_E_Ti) {
      recommendedDecisionType = "APPRENTISSAGE_AVEC_MENTION_ETUDES_POSSIBLES";
      
      const eligibleCodes = eligibleStreams.map(s => s.code).join(", ");
      officialAdviceSummary = `Votre demande d'orientation vers l'apprentissage d'un métier est pleinement accordée et valorisée. Compte tenu de vos excellents résultats académiques (6ème au BEPC), vous remplissez également toutes les conditions nécessaires pour poursuivre vos études au Lycée d'enseignement général ou technique en accédant aux séries : ${eligibleCodes}. Vous avez donc le double privilège de choisir entre une insertion professionnelle rapide par l'artisanat ou la poursuite d'un cursus au lycée.`;
      
      decisionJustification.push("Demande explicite d'orientation vers l'apprentissage d'un métier qualifiant.");
      decisionJustification.push(`Conditions d'accès au Lycée également remplies pour les séries : ${eligibleCodes}.`);
      decisionJustification.push("Possibilité de préparer un CQP, CAP, BT ou de poursuivre au lycée selon votre projet de vie.");
    } else {
      recommendedDecisionType = "APPRENTISSAGE_METIER";
      officialAdviceSummary = `Votre demande d'orientation vers l'apprentissage d'un métier est accordée. Ce choix correspond parfaitement à vos aptitudes pratiques et vous permettra d'acquérir une qualification solide dans un secteur porteur et générateur de revenus rapides.`;
      decisionJustification.push("Demande explicite d'orientation vers l'apprentissage d'un métier.");
      decisionJustification.push("Aptitudes pratiques adaptées aux filières professionnelles et artisanales.");
    }
  } 
  // Cas 2 : L'élève a demandé une série du lycée (Générale ou Technique)
  else {
    const isWishedA4orG1 = records.wishedStreamOrTrade.toUpperCase().includes("A4") || records.wishedStreamOrTrade.toUpperCase().includes("G1");
    const isWishedScientificOrTech = records.wishedStreamOrTrade.toUpperCase().includes("S") ||
      records.wishedStreamOrTrade.toUpperCase().includes("C") ||
      records.wishedStreamOrTrade.toUpperCase().includes("D") ||
      records.wishedStreamOrTrade.toUpperCase().includes("G2") ||
      records.wishedStreamOrTrade.toUpperCase().includes("G3") ||
      records.wishedStreamOrTrade.toUpperCase().includes("F1") ||
      records.wishedStreamOrTrade.toUpperCase().includes("F2") ||
      records.wishedStreamOrTrade.toUpperCase().includes("F3") ||
      records.wishedStreamOrTrade.toUpperCase().includes("F4") ||
      records.wishedStreamOrTrade.toUpperCase().includes("E") ||
      records.wishedStreamOrTrade.toUpperCase().includes("TI");

    let isWishedEligible = false;
    if (isWishedA4orG1 && isEligibleForA4_G1) isWishedEligible = true;
    if (isWishedScientificOrTech && isEligibleForS_G2_G3_F1_F4_E_Ti) isWishedEligible = true;

    // Si pas de souhait spécifique, vérifier si au moins une filière est accessible
    if (!isWishedA4orG1 && !isWishedScientificOrTech) {
      if (isEligibleForS_G2_G3_F1_F4_E_Ti || isEligibleForA4_G1) {
        isWishedEligible = true;
      }
    }

    if (isWishedEligible) {
      if (isEligibleForS_G2_G3_F1_F4_E_Ti && !isEligibleForA4_G1) {
        recommendedDecisionType = records.userWishedPathway === "lycee_technique" ? "LYCEE_TECHNIQUE" : "LYCEE_GENERAL";
        officialAdviceSummary = `Avis Favorable d'Orientation vers les séries Scientifiques et Techniques (S, G2, G3, F1, F2, F3, F4, E, Ti). Vos moyennes cumulées de la 6ème au BEPC en Mathématiques (${avgMaths}/20), Physique-Chimie (${avgPct}/20) et SVT (${avgSvt}/20) sont toutes supérieures ou égales à 10/20.`;
      } else if (isEligibleForA4_G1 && !isEligibleForS_G2_G3_F1_F4_E_Ti) {
        recommendedDecisionType = records.wishedStreamOrTrade.includes("G1") ? "LYCEE_TECHNIQUE" : "LYCEE_GENERAL";
        officialAdviceSummary = `Avis Favorable d'Orientation vers les séries Littéraires & Administratives (A4, G1). Vos moyennes cumulées de la 6ème au BEPC en Français (${avgFrancais}/20) et Anglais (${avgAnglais}/20) sont supérieures ou égales à 10/20.`;
      } else {
        recommendedDecisionType = records.userWishedPathway === "lycee_technique" ? "LYCEE_TECHNIQUE" : "LYCEE_GENERAL";
        officialAdviceSummary = `Avis Favorable d'Orientation d'Excellence Pluridisciplinaire. Vous remplissez à la fois les conditions d'accès aux séries Littéraires (A4, G1) et aux séries Scientifiques/Techniques (S, G2, G3, F1 à F4, E, Ti). Le choix final peut s'appuyer sur votre projet professionnel personnel.`;
      }

      decisionJustification.push(`Moyennes cumulées conformes aux critères ministériels de passage au second cycle.`);
      decisionJustification.push(`Séries autorisées : ${eligibleStreams.map(s => s.code).join(", ")}.`);
    } 
    // Échec aux conditions académiques -> REDIRECTION VERS L'APPRENTISSAGE
    else {
      recommendedDecisionType = "APPRENTISSAGE_METIER";
      officialAdviceSummary = `Orientation recommandée vers l'Apprentissage d'un Métier Qualifiant. Vos moyennes cumulées dans les matières donnant accès à la série demandée sont insuffisantes pour garantir une scolarité réussie au lycée d'enseignement général ou technique. Une formation professionnelle par apprentissage (CQP, CAP, BT) vous assurera des compétences pratiques recherchées sur le marché de l'emploi et une rapide insertion socio-économique.`;

      decisionJustification.push("Moyennes cumulées (6ème à BEPC) inférieures au seuil réglementaire de 10/20 dans les matières fondamentales requises.");
      decisionJustification.push("Recommandation d'orientation positive vers l'apprentissage d'un métier qualifiant dans un secteur porteur (BTP, Énergies, Mécanique, Agro-transformation, Numérique, etc.).");
    }
  }

  const currentDateStr = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return {
    studentName: records.studentName || "Candidat(e) à l'Orientation Post-BEPC",
    date: currentDateStr,
    subjectDetails,
    isEligibleForA4_G1,
    isEligibleForS_G2_G3_F1_F4_E_Ti,
    eligibleStreams,
    ineligibleStreams,
    recommendedDecisionType,
    officialAdviceSummary,
    recommendedApprenticeshipTrades,
    decisionJustification,
    counselorSignatureDate: currentDateStr
  };
}

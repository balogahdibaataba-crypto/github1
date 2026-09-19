import { TrainingProgram, TrainingProgramModule } from "../types";

// Base curated seed list + structured expansion generator to guarantee 200 rich certifying programs
const UN_ORGANIZATIONS = ["PNUD", "UNICEF", "PAM (WFP)", "HCR (UNHCR)", "OMS (WHO)", "OIM", "FAO", "Croix-Rouge", "Oxfam", "Banque Mondiale", "Union Africaine", "USAID"];

// Raw structured program definitions targeting UN, International Orgs, NGOs & High-Demand Careers
const RAW_PROGRAM_TEMPLATES: Array<{
  title: string;
  category: TrainingProgram["category"];
  level: TrainingProgram["level"];
  durationHours: number;
  description: string;
  careerOutcomes: string[];
  isUNFavored: boolean;
  targetOrganizations: string[];
  isHighDemandJob: boolean;
  moduleTopics: string[];
}> = [
  // 1. UN & HUMANITARIAN ACTION
  {
    title: "Certificat Supérieur en Coordination Humanitaire & Système Cluster ONU",
    category: "Nations Unies & Action Humanitaire",
    level: "Certificat Professionnel Supérieur",
    durationHours: 140,
    description: "Maîtrisez l'architecture de la réponse humanitaire internationale, la coordination OCHA, la gestion des crises complexes et le fonctionnement des clusters sectoriels (WASH, Santé, Protection).",
    careerOutcomes: ["Coordinateur de Cluster OCHA / ONG", "Chef de Mission Humanitaire", "Spécialiste de la Réponse aux Urgences", "Consultant ONU"],
    isUNFavored: true,
    targetOrganizations: ["OCHA", "PNUD", "HCR", "Oxfam", "Croix-Rouge"],
    isHighDemandJob: true,
    moduleTopics: ["Architecture OCHA & Inter-Cluster", "Évaluation Rapide des Besoins (MIRA)", "Financement d'Urgence (CERF/CBPF)", "Standards Minimums SPHERE"]
  },
  {
    title: "Spécialisation en Protection de l'Enfance en Contexte de Crise & Conflit (UNICEF)",
    category: "Nations Unies & Action Humanitaire",
    level: "Certificat d'Excellence Métier",
    durationHours: 120,
    description: "Formation certifiante aux normes internationales de protection de l'enfance, prévention du recrutement d'enfants-soldats, réunification familiale et soutien psychosocial.",
    careerOutcomes: ["Officier de Protection de l'Enfance (UNICEF)", "Manager de Projet Protection ONG", "Conseiller Droits de l'Enfant", "Expert Psychosocial"],
    isUNFavored: true,
    targetOrganizations: ["UNICEF", "Save the Children", "HCR", "Plan International"],
    isHighDemandJob: true,
    moduleTopics: ["Cadres Juridiques & Droits de l'Enfant", "Espaces Amis des Enfants (EAE)", "Gestion des Cas & Réunification", "Prévention des Violences & Exploitations"]
  },
  {
    title: "Certificat d'Expert en Eau, Assainissement & Hygiène en Urgence (WASH)",
    category: "Nations Unies & Action Humanitaire",
    level: "Certificat Professionnel Supérieur",
    durationHours: 130,
    description: "Conception et déploiement d'infrastructures hydrauliques d'urgence, traitement de l'eau en camp de réfugiés et promotion de l'hygiène en situation d'épidémie.",
    careerOutcomes: ["Ingénieur / Expert WASH", "Coordinateur WASH ONG", "Consultant Hydraulique Sanitaire", "Chef de Projet Urgence"],
    isUNFavored: true,
    targetOrganizations: ["UNICEF", "MSF", "Action Contre la Faim", "CICR"],
    isHighDemandJob: true,
    moduleTopics: ["Traitement & Distribution de l'Eau", "Assainissement & Latrines d'Urgence", "Promotion de l'Hygiène & Réduction des Risques", "Gestion des Boues & Déchets Sanitaires"]
  },
  {
    title: "Spécialiste en Prévention & Prise en Charge des Violences Basées sur le Genre (VBG/GBV)",
    category: "Nations Unies & Action Humanitaire",
    level: "Spécialisation VAE sur Titres",
    durationHours: 110,
    description: "Stratégies holistiques de prévention des VBG, accompagnement médical, juridique et psychosocial des survivantes en contexte de crise et de post-conflit.",
    careerOutcomes: ["Officier VBG / GBV Specialist (UNFPA)", "Coordinateur Centre d'Écoute ONG", "Conseiller en Égalité des Genres", "Expert Droits Humains"],
    isUNFavored: true,
    targetOrganizations: ["UNFPA", "ONU Femmes", "IRC", "Care International"],
    isHighDemandJob: true,
    moduleTopics: ["Cadres Conceptuels & Directives IASC VBG", "Prise en Charge Médicale & Psychosociale", "Gestion Confidentielle des Données (GBVIMS)", "Plaidoyer & Autonomisation Économique"]
  },
  {
    title: "Certificat en Logistique Humanitaire & Emergency Supply Chain (PAM / WFP)",
    category: "Nations Unies & Action Humanitaire",
    level: "Certificat Professionnel Supérieur",
    durationHours: 150,
    description: "Pilotage de la chaîne d'approvisionnement d'urgence, gestion des entrepôts stratégiques, ponts aériens, convois terrestres et distribution de vivres.",
    careerOutcomes: ["Logisticien Humanitaire Sénior", "Responsable Supply Chain PAM/WFP", "Manager de Flotte & Transit", "Coordinateur Achats ONG"],
    isUNFavored: true,
    targetOrganizations: ["PAM (WFP)", "HCR", "Croix-Rouge", "Logistics Cluster"],
    isHighDemandJob: true,
    moduleTopics: ["Planification des Approvisionnements d'Urgence", "Gestion des Stockages & Entrepôts", "Transport Multimodal & Douanes", "Distribution de Vivres & Cash-Based Transfers"]
  },
  {
    title: "Certificat en Droit International Humanitaire (DIH) & Protection des Réfugiés",
    category: "Nations Unies & Action Humanitaire",
    level: "Certificat d'Excellence Métier",
    durationHours: 110,
    description: "Application des Conventions de Genève, droit des réfugiés et personnes déplacées internes (PDI), protection des civils et mécanismes de justice transitionnelle.",
    careerOutcomes: ["Officier de Protection HCR", "Juriste International Humanitaire", "Conseiller Droits de l'Homme", "Analyste Géopolitique"],
    isUNFavored: true,
    targetOrganizations: ["HCR", "CICR", "HCDH (OHCHR)", "Amnesty International"],
    isHighDemandJob: true,
    moduleTopics: ["Conventions de Genève & Protocole Additionnel", "Statut de Réfugié (Convention 1951)", "Protection des Personnes Déplacées (PDI)", "Mécanismes de Recours Internationaux"]
  },
  {
    title: "Expertise en Sûreté, Sécurité & Gestion des Risques sur le Terrain (UNDSS)",
    category: "Nations Unies & Action Humanitaire",
    level: "Certificat Professionnel Supérieur",
    durationHours: 100,
    description: "Évaluation des menaces, protocoles de sécurité réseau UNDSS, gestion des kidnappings/évacuations sanitaires et négociation d'accès humanitaire.",
    careerOutcomes: ["Field Security Officer (UNDSS / ONG)", "Coordinateur Sécurité Pays", "Consultant Gestion des Risques", "Officier de Liaison Militaire/Civile"],
    isUNFavored: true,
    targetOrganizations: ["UNDSS", "INSO", "MSF", "ECHO"],
    isHighDemandJob: true,
    moduleTopics: ["Security Risk Management (SRM)", "Communication Radio & Systèmes d'Alerte", "Gestion des Crises & Évacuations", "Acceptation Communautaire & Négociation"]
  },
  {
    title: "Certificat en Assistance Monétaire Humanitaire (Cash & Voucher Assistance - CVA)",
    category: "Nations Unies & Action Humanitaire",
    level: "Certificat d'Excellence Métier",
    durationHours: 95,
    description: "Mise en œuvre des transferts monétaires, coupons électroniques, partenariats Mobile Money et analyse des marchés locaux en crise.",
    careerOutcomes: ["Spécialiste CVA / Transferts Monétaires", "Officier de Programme PAM", "Analyste Marchés Économiques", "Manager FinTech Humanitaire"],
    isUNFavored: true,
    targetOrganizations: ["PAM", "CaLP Network", "Mercy Corps", "Oxfam"],
    isHighDemandJob: true,
    moduleTopics: ["Feasability & Market Assessment", "Modalités CVA (Cash in Hand, Mobile Money, Vouchers)", "Protection des Données des Bénéficiaires", "Suivi & Recommandations Post-Distribution"]
  },
  {
    title: "Certificat en Consolidation de la Paix, Médiation & Résolution des Conflits",
    category: "Nations Unies & Action Humanitaire",
    level: "Certificat Professionnel Supérieur",
    durationHours: 120,
    description: "Analyse des facteurs de conflit, techniques de médiation communautaire, désarmement et réinsertion (DDR) et cohésion sociale.",
    careerOutcomes: ["Peacebuilding Specialist (PNUD)", "Médiateur Communautaire", "Conseiller en Gestion des Conflits", "Chargé de Programme Maintien de la Paix"],
    isUNFavored: true,
    targetOrganizations: ["PNUD", "Union Africaine", "CEDEAO", "Search for Common Ground"],
    isHighDemandJob: true,
    moduleTopics: ["Cartographie & Dynamique des Conflits", "Techniques de Négociation & Médiation", "Programme DDR & Réconciliation", "Alerte Précoce & Cohésion Sociale"]
  },
  {
    title: "Spécialisation en Redevabilité & Prévention des Abus Sexuels (AAP & PSEA)",
    category: "Nations Unies & Action Humanitaire",
    level: "Certificat d'Excellence Métier",
    durationHours: 90,
    description: "Mise en place de mécanismes de plaintes et de redevabilité communautaire, formation aux normes PSEA (Protection contre l'Exploitation et les Abus Sexuels).",
    careerOutcomes: ["PSEA Focal Point (ONU)", "Officier Redevabilité & CFM", "Auditeur Éthique & Conformité", "Consultant Humanitaire"],
    isUNFavored: true,
    targetOrganizations: ["ONU", "OIM", "Save the Children", "IRC"],
    isHighDemandJob: true,
    moduleTopics: ["Directives IASC PSEA", "Conception de Mécanismes de Plaintes (CFM)", "Enquêtes Interne & Protection des Lanceurs d'Alerte", "Engagement Communautaire"]
  },

  // 2. PROJECT MANAGEMENT & EVALUATION
  {
    title: "Certificat Supérieur en Management de Projets & Suivi-Évaluation (PMP/GAR)",
    category: "Management & Projets",
    level: "Certificat Professionnel Supérieur",
    durationHours: 120,
    description: "Cadre logique, Gestion Axée sur les Résultats (GAR), indicateurs d'impact, KoboToolbox, méthodes Agiles et suivi budgétaire rigoureux.",
    careerOutcomes: ["Chef de Projet Sénior", "Responsable Suivi-Évaluation (M&E Manager)", "Directeur des Opérations PMO", "Consultant Bailleurs"],
    isUNFavored: true,
    targetOrganizations: ["PNUD", "Banque Mondiale", "BAD", "Unions Régionales"],
    isHighDemandJob: true,
    moduleTopics: ["Cadre Logique & Matrice des Risques", "Collecte Mobile de Données KoboToolbox", "Calcul des Indicateurs de Performance KPIs", "Rapports d'Impact Bailleurs"]
  },
  {
    title: "Spécialiste en Passation des Marchés Publics & Projets Banque Mondiale / BAD",
    category: "Management & Projets",
    level: "Certificat Professionnel Supérieur",
    durationHours: 140,
    description: "Procédures de passation des marchés des banques multilatérales de développement (BM, BAD, BIDC), rédaction des DAO et gestion des litiges contractuels.",
    careerOutcomes: ["Spécialiste en Passation de Marchés (SPM)", "Consultant Bailleurs de Fonds", "Membre Commission de Dépouillement", "Auditeur Marchés Publics"],
    isUNFavored: true,
    targetOrganizations: ["Banque Mondiale", "BAD", "Projets d'État", "BIDC"],
    isHighDemandJob: true,
    moduleTopics: ["Directives de Passation de Marchés BM/BAD", "Elaboration des Dossiers d'Appel d'Offres (DAO)", "Évaluation des Offres Techniques & Financières", "Gestion & Audit des Contrats"]
  },
  {
    title: "Certificat en Montage de Propositions & Recherche de Financements (Grant Writing)",
    category: "Management & Projets",
    level: "Certificat d'Excellence Métier",
    durationHours: 100,
    description: "Rédaction stratégique de propositions techniques et budgétaires répondant aux appels d'offres des bailleurs internationaux (USAID, UE, Fond mondial, etc.).",
    careerOutcomes: ["Grant Manager / Business Developer", "Responsable Mobilisation de Ressources", "Consultant Fundraising", "Chef de Projet Développement"],
    isUNFavored: true,
    targetOrganizations: ["USAID", "Union Européenne", "Fond Mondial", "WWF"],
    isHighDemandJob: true,
    moduleTopics: ["Cartographie des Bailleurs & Appels à Projets", "Conception de la Note Conceptuelle (Concept Note)", "Budgétisation Détaillée & Coûts Indirects", "Négociation & Signature de la Subvention"]
  },
  {
    title: "Certificat en Suivi-Évaluation d'Impact avec Stata, R & Power BI",
    category: "Management & Projets",
    level: "Spécialisation VAE sur Titres",
    durationHours: 130,
    description: "Méthodes quantitatives d'évaluation d'impact (double différence, propension), traitement statistique des enquêtes ménages et création de tableaux de bord dynamique.",
    careerOutcomes: ["Analyste Statistiques & S&E", "Consultant Évaluation d'Impact", "Data Manager Projets", "Chercheur en Économie du Développement"],
    isUNFavored: true,
    targetOrganizations: ["PNUD", "J-PAL", "Banque Mondiale", "Institut de Statistique"],
    isHighDemandJob: true,
    moduleTopics: ["Échantillonnage & Enquêtes de Terrain", "Analyse Économétrique sur Stata/R", "Tableaux de Bord Dynamiques Power BI", "Rapports Évaluatifs Rigoureux"]
  },

  // 3. AI & TECH HIGH-DEMAND
  {
    title: "Certificat d'Excellence en Intelligence Artificielle & Prompt Engineering",
    category: "Technologies & IA",
    level: "Certificat d'Excellence Métier",
    durationHours: 110,
    description: "Utilisation professionnelle des LLM (Gemini, ChatGPT, Claude) pour l'automatisation administrative, l'analyse stratégique, le codage et la prise de décision.",
    careerOutcomes: ["Prompt Engineer / Specialist IA", "Consultant Transformation Digitale", "Manager Innovation & Automation", "Chef de Projet IA"],
    isUNFavored: false,
    targetOrganizations: ["Multinationales", "Cabinets de Conseil", "ONG", "Startups"],
    isHighDemandJob: true,
    moduleTopics: ["Architecture des Modèles de Langage LLM", "Techniques Avancées de Prompting", "Intégration d'Agents IA & Workflows", "Éthique, Biais & Protection des Données"]
  },
  {
    title: "Certificat d'Expert en Data Science, Big Data & Power BI Décisionnel",
    category: "Technologies & IA",
    level: "Certificat Professionnel Supérieur",
    durationHours: 150,
    description: "Machine Learning avec Python, modélisation prédictive, data pipelines SQL/NoSQL et visualisation avancée pour comités de direction.",
    careerOutcomes: ["Data Scientist Sénior", "Business Intelligence Manager", "Analyste Big Data", "Ingénieur Données"],
    isUNFavored: false,
    targetOrganizations: ["Banques", "Opérateurs Telecom", "Organisations Int.", "Fintechs"],
    isHighDemandJob: true,
    moduleTopics: ["Python pour Data Science (Pandas, Scikit-Learn)", "Modélisation Prédicitive Machine Learning", "Architectures SQL / Data Warehousing", "Tableaux de Bord Exécutifs Power BI"]
  },
  {
    title: "Certificat en Cybersécurité, Pentesting & Sécurité des Systèmes d'Information (SOC)",
    category: "Technologies & IA",
    level: "Certificat Professionnel Supérieur",
    durationHours: 150,
    description: "Protection des réseaux d'entreprise, audit d'intrusion (Ethical Hacking), conformité ISO 27001, détection d'attaques et réponse aux incidents.",
    careerOutcomes: ["Analyste SOC / Cybersécurité", "Auditeur Sécurité SI (Pentester)", "Responsable Sécurité SI (RSSI)", "Ingénieur Réseaux"],
    isUNFavored: true,
    targetOrganizations: ["Banques", "Gouvernements", "Agences Cybersécurité", "ONG"],
    isHighDemandJob: true,
    moduleTopics: ["Sécurité Réseaux & Cryptographie", "OWASP Top 10 & Ethical Hacking", "Sécurisation Cloud AWS/Azure", "Normes ISO 27001 & Gestion de Crise"]
  },
  {
    title: "Certificat en Systèmes d'Information Géographique (SIG) & Cartographie Satellite",
    category: "Technologies & IA",
    level: "Certificat d'Excellence Métier",
    durationHours: 120,
    description: "Maîtrise de QGIS, ArcGIS et Google Earth Engine pour le suivi de la déforestation, la planification urbaine, la gestion des crises et l'agriculture de précision.",
    careerOutcomes: ["Spécialiste SIG / Cartographe", "Analyste Télédétection Satellite", "Expert Urbanisme & Climat", "Consultant Environnement"],
    isUNFavored: true,
    targetOrganizations: ["FAO", "PNUE (UNEP)", "UNITAR", "Ministères"],
    isHighDemandJob: true,
    moduleTopics: ["Bases de Données Spatiales PostGIS", "Cartographie Vectorielle & Raster sous QGIS", "Télédétection Satellite (Sentinel/Landsat)", "Analyse Spatiale pour Projets Humanitaires"]
  },

  // 4. ENVIRONMENT, CLIMATE & SUSTAINABLE DEVELOPMENT
  {
    title: "Certificat d'Expert en Évaluation d'Impact Environnemental et Social (EIES / ESIA)",
    category: "Développement Durable",
    level: "Certificat Professionnel Supérieur",
    durationHours: 130,
    description: "Études d'impact environnemental, normes de sauvegarde de la Banque Mondiale (NES), plans de gestion environnementale et consultation publique.",
    careerOutcomes: ["Expert Environnementaliste EIES", "Consultant Sauvegardes Sociales", "Responsable HSE / RSE", "Auditeur Écologique"],
    isUNFavored: true,
    targetOrganizations: ["Banque Mondiale", "PNUE", "BAD", "Sociétés Minières/BTP"],
    isHighDemandJob: true,
    moduleTopics: ["Normes de Sauvegarde Environnementale (NES BM)", "Méthodologie d'Étude d'Impact", "Plan de Gestion Environnemental et Social (PGES)", "Participation Communautaire & Réinstallation"]
  },
  {
    title: "Certificat en Finance Verte, Crédits Carbone & Projets Climat (REDD+)",
    category: "Développement Durable",
    level: "Certificat Professionnel Supérieur",
    durationHours: 125,
    description: "Ingénierie financière des projets climat, mécanismes de crédit carbone, obligations vertes (Green Bonds) et accès aux fonds mondiaux (GCF).",
    careerOutcomes: ["Spécialiste Finance Climat", "Manager Projets Crédit Carbone", "Conseiller Transition Énergétique", "Consultant Fonds Vert"],
    isUNFavored: true,
    targetOrganizations: ["Fonds Vert Climat (GCF)", "PNUD", "Banque Mondiale", "Cabinets Climat"],
    isHighDemandJob: true,
    moduleTopics: ["Marchés du Carbone Volontaires & Réglementés", "Montage de Dossier Fonds Vert pour le Climat (GCF)", "Mécanisme REDD+ & Forêts", "Analyse de Risque Climatique"]
  },
  {
    title: "Certificat en Agroécologie, Sécurité Alimentaire & Résilience Agricole (FAO)",
    category: "Développement Durable",
    level: "Spécialisation VAE sur Titres",
    durationHours: 115,
    description: "Systèmes semenciers résilients, techniques d'irrigation économe, gestion intégrée des ravageurs et renforcement des chaînes de valeur agricoles.",
    careerOutcomes: ["Chargé de Programme Sécurité Alimentaire (FAO)", "Ingénieur Agronome Conseils", "Manager Coopérative Agricole", "Consultant Développement Rural"],
    isUNFavored: true,
    targetOrganizations: ["FAO", "FIDA (IFAD)", "PAM", "ONG Agronomiques"],
    isHighDemandJob: true,
    moduleTopics: ["Techniques Agroécologiques & Sols", "Gestion des Risques Sécheresse / Inondations", "Chaînes de Valeur Agricoles & Marchés", "Évaluation de la Malnutrition Rurale"]
  },

  // 5. HEALTH & SANITATION
  {
    title: "Certificat en Épidémiologie de Terrain & Surveillance des Maladies Émergentes (OMS)",
    category: "Santé, Hygiène & Environnement",
    level: "Certificat Professionnel Supérieur",
    durationHours: 140,
    description: "Surveillance épidémiologique, investigation de foyers d'infection, riposte aux pandémies (Ébola, Choléra, COVID) et règlement sanitaire international.",
    careerOutcomes: ["Épidémiologiste de Terrain (OMS)", "Officier Surveillance Sanitaire", "Manager de Crise Épidémique", "Consultant Santé Publique"],
    isUNFavored: true,
    targetOrganizations: ["OMS (WHO)", "Africa CDC", "MSF", "Ministères Santé"],
    isHighDemandJob: true,
    moduleTopics: ["Règlement Sanitaire International (RSI)", "Investigation d'Épidémies & Échantillonnage", "Analyse de Données Épidémiologiques", "Communication de Risque & Engagement Communautaire"]
  },
  {
    title: "Certificat en Management Hospitalier & Gestion des Services de Santé",
    category: "Santé, Hygiène & Environnement",
    level: "Certificat Professionnel Supérieur",
    durationHours: 120,
    description: "Pilotage administratif des centres hospitaliers, gestion de la pharmacie, hygiène hospitalière et accréditation qualité des soins.",
    careerOutcomes: ["Directeur / Administrateur d'Hôpital", "Gestionnaire de Centre de Santé", "Consultant Qualité Soins", "Officier Santé ONG"],
    isUNFavored: true,
    targetOrganizations: ["Centres Hospitaliers", "Croix-Rouge", "OMS", "Projets Santé"],
    isHighDemandJob: true,
    moduleTopics: ["Gestion Financière & Tarification des Soins", "Approvisionnement Médicamenteux & Pharmacie", "Hygiène Hospitalière & Prévention des Infections", "Accréditation & Normes Qualité"]
  },

  // 6. FINANCE, AUDIT & COMPLIANCE
  {
    title: "Certificat en Audit Financier & Contrôle des Subventions Bailleurs",
    category: "Finance & Comptabilité",
    level: "Certificat Professionnel Supérieur",
    durationHours: 130,
    description: "Audit des dépenses d'ONG, vérification des pièces justificatives, règles d'éligibilité USAID/UE/Banque Mondiale et prévention des fraudes.",
    careerOutcomes: ["Auditeur Sénior Projets Bailleurs", "Directeur Financier ONG", "Contrôleur de Gestion International", "Consultant Compliance"],
    isUNFavored: true,
    targetOrganizations: ["KPMG", "Deloitte", "Banque Mondiale", "USAID", "ONG Int."],
    isHighDemandJob: true,
    moduleTopics: ["Règles d'Éligibilité des Coûts Bailleurs", "Procédures d'Audit Externe & Rapport d'Inéligibilité", "Prévention de la Fraude & Corruption", "Clôture Financière des Subventions"]
  },
  {
    title: "Certificat en Compliance Anti-Blanchiment (AML/CFT) & Anti-Corruption (ISO 37001)",
    category: "Droit & Governance",
    level: "Certificat Professionnel Supérieur",
    durationHours: 110,
    description: "Normes GAFI/FATF, cartographie des risques de blanchiment, due diligence KYC/KYB, sanctions internationales et gouvernance d'entreprise.",
    careerOutcomes: ["Compliance Officer", "Responsable Anti-Blanchiment (AML)", "Analyste Risques & Sanctions", "Consultant Gouvernance"],
    isUNFavored: true,
    targetOrganizations: ["Banques", "Fintechs", "Organisations Int.", "Sociétés Minières"],
    isHighDemandJob: true,
    moduleTopics: ["Directives GAFI / FATF", "Procédures KYC (Know Your Customer) & PEP", "Système de Management Anti-Corruption ISO 37001", "Gestion des Sanctions Internationales"]
  },

  // 7. LOGISTICS, SUPPLY CHAIN & OHADA LAW
  {
    title: "Certificat en Supply Chain Globale, Douanes & Incoterms 2020",
    category: "Logistique & Supply Chain",
    level: "Certificat Professionnel Supérieur",
    durationHours: 130,
    description: "Gestion des opérations d'import-export, dédouanement, optimisation des coûts de fret maritime/aérien et réglementation portuaire.",
    careerOutcomes: ["Responsable Supply Chain", "Directeur Transit & Douanes", "Manager Logistique Import/Export", "Consultant Commerce Int."],
    isUNFavored: false,
    targetOrganizations: ["Bolloré/AGL", "Maersk", "Compagnies Maritimes", "ONG"],
    isHighDemandJob: true,
    moduleTopics: ["Incoterms 2020 & Maîtrise des Risques", "Procédures Douanières & Régimes Suspensifs", "Gestion des Flocs Maritimes & Aériens", "Entreposage & Gestion de Flotte"]
  },
  {
    title: "Certificat en Droit des Affaires OHADA & Juriste d'Entreprise",
    category: "Droit & Governance",
    level: "Spécialisation VAE sur Titres",
    durationHours: 115,
    description: "Acte uniformes OHADA, droit des sociétés commerciales, contrats d'affaires, sûretés, procédures collectives et contentieux commercial.",
    careerOutcomes: ["Juriste d'Entreprise OHADA", "Consultant Droit des Affaires", "Responsable Recouvrement & Contentieux", "Conseiller Juridique"],
    isUNFavored: false,
    targetOrganizations: ["Cabinets d'Avocats", "Entreprises privées", "Banques", "Port Autonome"],
    isHighDemandJob: true,
    moduleTopics: ["Gouvernance des Sociétés Commerciales", "Sûretés & Garanties de Crédit", "Recouvrement de Créances OHADA", "Arbitrage & Médiation Commerciale"]
  }
];

// Domain Expansion Titles Generator to reach 200 distinct high-value training certificates
const DOMAIN_EXPANSIONS: Array<{
  category: TrainingProgram["category"];
  isUNFavored: boolean;
  prefix: string;
  titles: string[];
}> = [
  {
    category: "Nations Unies & Action Humanitaire",
    isUNFavored: true,
    prefix: "Certificat International en",
    titles: [
      "Gestion des Campements & Sites de Personnes Déplacées (CCCM)",
      "Analyse de la Sécurité Alimentaire & Cadre Harmonisé (CH)",
      "Inclusion du Handicap dans la Réponse Humanitaire",
      "Cartographie & Analyse des Vulnérabilités Communautaires",
      "Gestion des Convois & Ponts Aériens d'Urgence",
      "Suivi de la Santé Maternelle & Infantile en Crise",
      "Gestion des Épidémies de Choléra & Fièvres Hémorragiques",
      "Éducation en Situation d'Urgence (EiE)",
      "Médiation Foncière & Prévention des Conflits Pastoraux",
      "Dépollution & Sensibilisation aux Risques Explosifs (UNMAS)",
      "Gestion des Télécommunications d'Urgence (ETC Cluster)",
      "Plaidoyer International & Relations avec les Médias en Crise",
      "Assistance aux Migrants & Prévention de la Traite (OIM)",
      "Abris d'Urgence & Habitat Transitoire (Shelter Cluster)",
      "Gestion des Stocks Stratégiques de Médicaments d'Urgence",
      "Gestion des Déchets Médicaux & Risques Biologiques",
      "Droits des Minorités & Protection des Groupes Vulnérables",
      "Gouvernance Locale & Transition Humanitaire-Développement",
      "Suivi des Déplacements de Population & DTM (OIM)",
      "Gestion des Équipes Médicales d'Urgence (EMT)",
      "Prévention de la Malnutrition Aiguë Sévère (MAS)",
      "Sécurisation des Convois Humanitaires en Zone d'Hostilité",
      "Systèmes d'Alerte Précoce & Préparation aux Catastrophes",
      "Accès Humanitaire & Négociation avec les Groupes Armés",
      "Gestion des Centres d'Isolement & Quarantaine Sanitaire",
      "Droit Asile & Protection des Demandeurs d'Asile",
      "Gestion des Données Bénéficiaires & Biométrie Éthique",
      "Évaluation des Besoins Multi-Sectoriels (MSNA)",
      "Partenariats Stratégiques avec les ONG Locales (Localisation)",
      "Gestion des Crises Volcaniques, Inondations & Sécheresses",
      "Prise en Charge du Stress Traumatique chez les Humanitaires",
      "Sensibilisation au Risque Chimique, Biologique & Nucléaire (NRBC)",
      "Inclusion du Genre dans la Réponse d'Urgence",
      "Gestion de la Chaîne du Froid Vaccinale en Zone Enclavée",
      "Communication pour le Changement de Comportement (CCCS)",
      "Analyse des Données Satellitaires Copernicus / Sentinel",
      "Gestion des Entrepôts Régionaux & Plateformes Logistiques",
      "Audit de Qualité des Prestations d'Urgence",
      "Protection des Données Personnelles des Bénéficiaires",
      "Conception de Programmes de Résilience Post-Conflit"
    ]
  },
  {
    category: "Management & Projets",
    isUNFavored: true,
    prefix: "Certificat Supérieur en",
    titles: [
      "Gestion Axée sur les Résultats (GAR / RBM)",
      "Pilotage de Projets Agiles & Méthode Scrum",
      "Management de Portefeuilles de Projets (PMO)",
      "Gestion des Risques & Contrôle Interne des Projets",
      "Audit & Évaluation Finale des Projets Bailleurs",
      "Leadership Stratégique & Conduite du Changement",
      "Gestion des Conflits d'Équipes & Négociation",
      "Négociation de Contrats d'Assistance Technique",
      "Gestion de Projets de Digitalisation Publique",
      "Pilotage des Partenariats Public-Privé (PPP)",
      "Gouvernance des Projets d'Infrastructures Communautaires",
      "Gestion de la Qualité ISO 9001 dans les Organisations",
      "Conception de Tableaux de Bord de Pilotage Stratégique",
      "Gestion des Approvisionnements & Achats Stratégiques",
      "Management des Projets de Santé Publique",
      "Gestion de Projets d'Électrification Rurale",
      "Pilotage de la Transformation Digitale des Administrations",
      "Management des Projets d'Eau Potable & Assainissement",
      "Gestion des Projets d'Éducation & Formation Pro",
      "Conduite de Projets de Micro-Infrastructure BTP",
      "Gestion des Projets d'Inclusion Économique des Jeunes",
      "Management de Projets d'Entreprenariat Féminin",
      "Design Thinking & Innovation Sociale",
      "Gestion de la Relation avec les Parties Prenantes",
      "Audit d'Organisation & Reconfiguration des Processus"
    ]
  },
  {
    category: "Technologies & IA",
    isUNFavored: false,
    prefix: "Certificat Professionnel en",
    titles: [
      "Développement Web Full-Stack (React, Node.js, TypeScript)",
      "Développement d'Applications Mobiles (Flutter / React Native)",
      "Cloud Computing & Architecture DevOps (Docker, Kubernetes)",
      "Administration de Bases de Données SQL & NoSQL",
      "Business Analytics & Tableaux de Bord Power BI",
      "Automation Python & Scripting de Processus",
      "Analyse de Données Massives avec PySpark & Hadoop",
      "Ingénierie de la Donnée & Data Engineering",
      "Sécurité des Applications Web & Mobile",
      "Conception d'Interfaces UX/UI Centrée Utilisateur",
      "Administration des Réseaux Cisco & VPN",
      "Gestion des Systèmes d'Information de Santé DHIS2",
      "Intelligence Artificielle Appliquée au Diagnostic Médical",
      "Analyse de Données Financières & Algorithmes",
      "Gestion des Infrastructures Informatiques Hospitalières",
      "Architectures Souveraines Cloud & Données Publiques",
      "Ingénierie des Projets IoT & Capteurs Intelligents",
      "Sécurisation des Transactions Financières & Blockchain",
      "Supervision des Réseaux & SIEM Splunk/Elastic",
      "Développement d'Agents IA pour la Relation Client",
      "Analyse des Données Électorales & Biométrie",
      "Sécurisation des Identités Numériques & IAM",
      "Dépannage & Maintenance Avancée des Équipements IT",
      "Audit de Code Source & Détection des Filles de Sécurité",
      "Gestion de Projets Informatiques selon ITIL v4"
    ]
  },
  {
    category: "Finance & Comptabilité",
    isUNFavored: false,
    prefix: "Certificat d'Excellence en",
    titles: [
      "Comptabilité Financière selon le Systeme SYSCOHADA Révisé",
      "Contrôle de Gestion & Analyse des Coûts",
      "Gestion Financière des Projets de Développement",
      "Audit Comptable & Financier des Entreprises",
      "Fiscalité des Entreprises & Optimisation Légale",
      "Microfinance, Gestion des Risques de Crédit & Recovery",
      "Gestion de Trésorerie & Relations Bancaires",
      "Ingénierie Financière & Évaluation d'Entreprises",
      "Gestion des Risques de Change & Marchés Monétaires",
      "Comptabilité Analytique & Budgétisation",
      "Audit de la Paie & Charges Sociales",
      "Gestion des Actifs Immobilisés & Amortissements",
      "Prévention de la Fraude Comptable & Cyber-Criminalité Financière",
      "Analyse Financière des Banques & Établissements de Crédit",
      "Financement des PME & Levée de Fonds"
    ]
  },
  {
    category: "Ressources Humaines",
    isUNFavored: false,
    prefix: "Certificat de Spécialisation en",
    titles: [
      "Gestion Prévisionnelle des Emplois et Compétences (GPEC)",
      "Recrutement Sourcing Digital & Chasse de Têtes",
      "Administration de la Paie & Déclarations Sociales",
      "Droit du Travail & Gestion des Relations Sociales",
      "Management de la Formation Continue & Plans de Carrière",
      "Coaching Professionnel & Développement du Leadership",
      "Gouvernance RH en Environnement Multiculturel",
      "Digitalisation RH & Déploiement de SIRH",
      "Gestion des Conflits du Travail & Négociation Syndicale",
      "Santé, Sécurité au Travail (SST) & Conditions de Travail",
      "Évaluation des Performances & Entretien Annuel",
      "Marque Employeur & Attraction des Talents",
      "Gestion des Expatriés & Mobilité Internationale",
      "Audit Social & Diagnostic des Climats d'Entreprise",
      "Inclusion, Diversité & Égalité Professionnelle"
    ]
  },
  {
    category: "Développement Durable",
    isUNFavored: true,
    prefix: "Certificat Supérieur en",
    titles: [
      "Management de la RSE (Responsabilité Sociétale des Entreprises)",
      "Gestion Durable des Déchets Solides & Économie Circulaire",
      "Énergies Renouvelables Solaire Photovoltaïque & Off-Grid",
      "Audit Énergétique & Efficacité Énergétique des Bâtiments",
      "Gestion Intégrée des Ressources en Eau (GIRE)",
      "Urbanisme Durable & Amenagement du Territoire",
      "Préservation de la Biodiversité & Gestion des Aires Protégées",
      "Gestion Durable des Forêts & Certification FSC",
      "Résilience Climatique des Infrastructures BTP",
      "Systèmes d'Irrigation Goutte-à-Goutte & Économie d'Eau",
      "Gouvernance des Ressources Minières & Pétrolières (ITIE)",
      "Droit de l'Environnement & Contentieux Écologique",
      "Pêche Durable & Gestion des Ressources Halieutiques",
      "Tourisme Durable & Écotourisme Communautaire",
      "Bilan Carbone & Stratégies de Décarbonation"
    ]
  },
  {
    category: "Santé, Hygiène & Environnement",
    isUNFavored: true,
    prefix: "Certificat d'Excellence en",
    titles: [
      "Santé Communautaire & Promotion de la Santé",
      "Gestion des Programmes de Lutte Contre le Paludisme & VIHs",
      "Santé Maternelle, Néonatale & Infantile (SMNI)",
      "Hygiène, Sécurité & Environnement (HSE) Industriel",
      "Nutrition Communautaire & Lutte Contre les Carences",
      "Pharmacie Hospitalière & Supply Chain des Réactifs",
      "Bioéthique & Droit Médical",
      "Gestion des Urgences Médico-Chirurgicales",
      "Santé Mentale & Prise en Charge des Traumatismes",
      "Gestion de la Qualité en Laboratoire d'Analyses Médicales"
    ]
  },
  {
    category: "Droit & Governance",
    isUNFavored: true,
    prefix: "Certificat Supérieur en",
    titles: [
      "Diplomatie, Protocoles & Relations Internationales",
      "Bonne Gouvernance & Transparence dans le Secteur Public",
      "Droit Maritime, Portuaire & Transport International",
      "Droit des Partenariats Public-Privé (PPP)",
      "Propriété Intellectuelle & Brevets d'Invention (OAPI)",
      "Droit du Numérique, Protection des Données & GDPR",
      "Arbitrage International & Modes Alternatifs de Règlement",
      "Droit Minier, Énergétique & Foncier",
      "Passation des Marchés Publics & Contentieux Administratif",
      "Lutte Contre la Corruption & Cybercriminalité"
    ]
  },
  {
    category: "Logistique & Supply Chain",
    isUNFavored: false,
    prefix: "Certificat d'Expert en",
    titles: [
      "Gestion des Entrepôts, Stocks & Inventaires",
      "Management des Flottes Automobile & Transport Terrestre",
      "Gestion des Opérations Portuaires & Manutention",
      "Transit, Douanes & Procédures d'Exportation",
      "Supply Chain Verte & Logistique Éco-Responsable",
      "Achats Internationaux & Négociation Fournisseurs",
      "Gestion de la Chaîne du Froid Agroalimentaire",
      "Planification des Besoins (MRP) & Logistique de Production",
      "Systèmes d'Information Logistiques (WMS / TMS)",
      "Gestion des Risques Logistiques & Assurances Fret"
    ]
  },
  {
    category: "Communication & Relations Int.",
    isUNFavored: true,
    prefix: "Certificat d'Excellence en",
    titles: [
      "Communication de Crise & Relations Presse",
      "Plaidoyer Stratégique & Mobilisation d'Opinion",
      "Marketing Digital, Réseaux Sociaux & Community Management",
      "Communication Institutionnelle & Marque d'Organisation",
      "Storytelling & Production Audiovisuelle pour Projets",
      "Journalisme d'Investigation & Fact-Checking",
      "Relations Publiques & Événementiel International",
      "Communication pour le Développement (C4D)",
      "Gestion de la Réputation En Ligne & E-Réputation",
      "Stratégies de Mobilisation Communautaire"
    ]
  }
];

function enrichModuleWithContent(programTitle: string, category: string, topic: string, idx: number): TrainingProgramModule {
  const isUN = category.includes("Nations Unies") || category.includes("Humanitaire") || category.includes("Développement") || category.includes("Droit");
  
  const unNormsReference = isUN
    ? "Standards Internationaux ONU / OCHA - Charte Humanitaire SPHERE & Directives IASC 2026"
    : "Normes Internationales ISO 21500 / Cadre de Référence Management & Audit d'Excellence 2026";

  const lessonContentText = `=== COURS MAGISTRAL AVANCÉ, DÉFINITIONS DES CONCEPTS & FICHE D'ANALYSE APPROFONDIE (OrientaAfrik & Certification) ===
PROGRAMME : ${programTitle}
MODULE ${idx + 1} : ${topic.toUpperCase()}
RÉFÉRENCE NORMATIVE : ${unNormsReference}

1. DÉFINITION EXPLICITE DES PRINCIPAUX CONCEPTS ABORDÉS DANS LE COURS
Avant d'aborder la mise en œuvre pratique, il convient de définir avec précision les concepts fondamentaux qui structurent ce module :

• CONCEPT 1 : La Gestion Axée sur les Résultats (GAR) et l'Alignement Stratégique
  - Définition : La GAR est une approche de management par laquelle une organisation veille à ce que ses processus, produits et services contribuent directement à l'atteinte de résultats clairement définis et mesurables.
  - Explication détaillée : Contrairement aux approches traditionnelles axées uniquement sur les activités et les dépenses, la GAR impose de mesurer l'impact réel et les changements qualitatifs ou quantitatifs observés chez les bénéficiaires ou au sein des systèmes ciblés.

• CONCEPT 2 : La Ligne de Base (Baseline) et la Théorie du Changement (Theory of Change)
  - Définition : La ligne de base représente la situation initiale mesurée avant le lancement d'une intervention, servant de point de comparaison neutre. La Théorie du Changement explicite la chaîne de causalité expliquant comment et pourquoi une série d'actions produira les effets escomptés.
  - Explication détaillée : Sans une baseline scientifiquement établie, il est impossible de démontrer la valeur ajoutée ou l'impact net d'un projet, d'une formation VAE ou d'un programme d'orientation.

• CONCEPT 3 : Les Normes Minimales de Redevabilité et de Qualité (Standards SPHERE & ISO)
  - Définition : Ensemble de principes et d'exigences techniques universelles garantissant le respect de la dignité humaine, de la sécurité des données et de l'efficience opérationnelle.
  - Explication détaillée : Ces normes interdisent la gestion empirique ou approximative et imposent des seuils minimaux de qualité vérifiables par des auditeurs externes.

• CONCEPT 4 : La Matrice d'Évaluation des Risques et la Contingence
  - Définition : Outil d'anticipation permettant d'identifier les événements indésirables (politiques, financiers, climatiques, logistiques), d'évaluer leur probabilité et leur impact, et de définir des plans d'atténuation préventifs.
  - Explication détaillée : Dans les projets complexes, l'absence de plan de contingence entraîne des retards majeurs ou le retrait des bailleurs de fonds.

2. EXPLICATION APPROFONDIE DES DIFFÉRENTS POINTS DU PROGRAMME
Chaque point inscrit au programme fait l'objet d'un développement explicatif et argumenté :

• Point A : Analyse du Cadre Juridique, Institutionnel et Déontologique
  - Développement : L'application des normes internationales nécessite une maîtrise parfaite des chartes déontologiques inter-agences. L'expert doit concilier les exigences juridiques nationales et les standards internationaux de transparence (Directives IASC, conventions OIT, règles de passation des marchés). L'accent est mis sur l'éthique de la redevabilité envers les communautés et le refus de tout conflit d'intérêts.

• Point B : Méthodologie Opérationnelle et Structuration des Livrables
  - Développement : La réussite de l'intervention repose sur le déploiement méthodique en quatre phases (Diagnostic initial, Cadrage budgétaire, Exécution supervisée et Audit final). Chaque étape requiert des outils dédiés (KoboToolbox pour la collecte de données, Power BI pour les tableaux de bord, matrices du Cadre Logique pour le suivi des indicateurs).

• Point C : Suivi-Évaluation et Tableaux de Bord de Performance (KPIs)
  - Développement : Le suivi des indicateurs clés de performance ne se limite pas à un contrôle de routine. Il s'agit d'un instrument dynamique d'aide à la décision stratégique permettant de réajuster les ressources et de corriger les dérives dès leur apparition.

3. DÉPLOIEMENT MÉTHODOLOGIQUE PAS À PAS (CYCLE DE PROJET & DÉCISION)
• Étape 1 : Diagnostic Approfondi & Ligne de Base (Baseline)
  Analyse SWOT/STEEPLE, évaluation rapide des besoins (MIRA), cartographie dynamique des parties prenantes et analyse de vulnérabilité.
• Étape 2 : Planification Opérationnelle & Cadrage Financier
  Élaboration du Cadre Logique (Matrice des résultats), budgétisation analytique, allocation des ressources humaines et matrice des risques prioritaires.
• Étape 3 : Exécution, Pilotage & Outils Numériques
  Déploiement sur le terrain, suivi des flux de données en temps réel via des solutions ERP et formulaires mobiles (KoboToolbox, Power BI, ODK), coordination des équipes inter-agences.
• Étape 4 : Suivi-Évaluation, Audit & Capitalisation
  Contrôle qualitatif et quantitatif, audits de conformité, rédaction des rapports de performance destinés aux bailleurs et formulaires de retour d'expérience (Lessons Learned).

4. ÉTUDE DE CAS COMPLEXE & RETOUR D'EXPÉRIENCE DU TERRAIN
Analyse circonstanciée d'une crise opérationnelle survenue lors d'un projet de ${programTitle} :
- Défi rencontré : Rupture imprévue de la chaîne logistique, choc sécuritaire ou écart budgétaire critique dans la mise en œuvre de "${topic}".
- Solution corrective apportée : Activation immédiate du plan de contingence, réallocation budgétaire approuvée par le comité de pilotage et concertation multipartite.
- Enseignement clé : La réactivité organisationnelle repose sur la robustesse du système de suivi-évaluation et la rigueur des procédures de conformité.

5. INDICATEURS CLÉS DE PERFORMANCE (KPIs) & RECOMMANDATIONS PRATIQUES
• Taux de conformité aux procédures bailleurs : ≥ 98%
• Indice de satisfaction des partenaires et communautés bénéficiaires : ≥ 90/100
• Respect du calendrier d'exécution des étapes clés : Écart maximal toléré de ± 5%
• Recommandation majeure : Systématiser la double validation (technique et financière) avant la transmission de tout livrable aux instances internationales.`;

  const bibliographicReferences = [
    `Nations Unies (PNUD & OCHA). Manuel de Gestion Axée sur les Résultats (GAR) et Directives de Suivi-Évaluation des Projets Internationaux. Éditions ONU, New York.`,
    `Organisation Internationale de Normalisation (ISO). ISO 21500:2021 - Management des projets, programmes et portefeuilles : Principes et lignes directrices. ISO, Genève.`,
    `Banque Mondiale & Union Européenne. Cadre de Référence pour l'Audit et la Redevabilité des Financements Internationaux de Développement. Washington D.C. / Bruxelles.`,
    `Comité Permanent Inter-Organisations (IASC) & Projet SPHERE. Charte Humanitaire et Normes Minimales dans les Interventions d'Urgence et de Développement, Genève.`
  ];

  const researchAssignment = {
    id: `research-m${idx + 1}`,
    title: `Travail de Recherche Opérationnelle : Analyse Critique & Plan d'Action sur "${topic}"`,
    instructions: `Dans le cadre de votre préparation à la certification internationale en ${programTitle}, vous devez rédiger une note d'analyse synthétique et opérationnelle (entre 300 et 800 mots) répondant aux consignes suivantes :

1. Diagnostiquez un problème ou un enjeu majeur lié à "${topic}" dans une organisation internationale (ONU, ONG, Ministère ou entreprise).
2. Proposez une méthodologie pas à pas conforme aux normes internationales (GAR, ISO 21500 ou SPHERE) pour résoudre ce problème.
3. Définissez 3 indicateurs clés de performance (KPIs) mesurables et une stratégie de gestion des risques associées.
4. Appuyez votre argumentation sur au moins une référence bibliographique ou normative citée dans le cours.`,
    evaluationCriteria: [
      "Compréhension des enjeux et rigueur théorique (sur 5 points)",
      "Pertinence de la méthodologie proposée et conformité aux normes ONU/OI (sur 5 points)",
      "Définition précise des indicateurs KPIs et de la matrice des risques (sur 5 points)",
      "Qualité de la rédaction, structure synthétique et citations bibliographiques (sur 5 points)"
    ],
    expectedDeliverable: "Note de Synthèse Stratégique & Plan d'Action Opérationnel (300 à 800 mots)"
  };

  const practiceQuestions = [
    {
      id: 1,
      questionText: `Dans le cadre du module "${topic}", quel est l'objectif premier du diagnostic initial selon les normes internationales ?`,
      options: [
        "Commencer les dépenses avant toute analyse",
        "Identifier avec précision les besoins réels, évaluer les risques et définir la ligne de base (baseline)",
        "Ignorer l'avis des populations locales et des parties prenantes",
        "Supprimer les mécanismes de contrôle pour accélérer les opérations"
      ],
      correctOptionIndex: 1,
      explanation: "Selon les directives ONU/OCHA et ISO 21500, un diagnostic rigoureux permet d'établir la ligne de base, d'anticiper les risques et de concevoir des interventions adaptées et pérennes."
    },
    {
      id: 2,
      questionText: `Quelle condition est indispensable pour garantir la redevabilité et la conformité d'un projet de ${programTitle} ?`,
      options: [
        "Garder toutes les données financières secrètes",
        "Disposer d'un système de Suivi-Évaluation indépendant et produire des rapports périodiques audités",
        "Modifier les indicateurs de performance en cours de route sans justification",
        "Ne pas réaliser d'évaluation finale"
      ],
      correctOptionIndex: 1,
      explanation: "La redevabilité envers les bailleurs de fonds et les populations exige un suivi-évaluation transparent, documenté et vérifiable par des audits externes."
    },
    {
      id: 3,
      questionText: `Lors de la phase d'exécution de "${topic}", quelle posture l'expert de terrain doit-il adopter en cas d'imprévu majeur ?`,
      options: [
        "Abandonner immédiatement la mission sans avertir la hiérarchie",
        "Appliquer le plan de gestion des risques, alerter le comité de pilotage et réajuster le plan d'action",
        "Masquer les difficultés dans les rapports d'avancement",
        "Transgresser les règles d'éthique et de sécurité"
      ],
      correctOptionIndex: 1,
      explanation: "La gestion professionnelle des projets internationaux impose la mise en œuvre de la matrice des risques et une communication transparente avec le comité de pilotage."
    }
  ];

  return {
    id: `m${idx + 1}`,
    title: topic,
    description: `Cours magistral approfondi, références bibliographiques, travaux de recherche et auto-évaluation sur ${topic}.`,
    keyTopics: ["Cadre Normatif ONU/OI", "Méthodologie Opérationnelle", "Gestion des Risques & Audit", "Recherche & Cas Terrain"],
    durationHours: 35,
    unNormsReference,
    lessonContentText,
    bibliographicReferences,
    researchAssignment,
    practiceQuestions
  };
}

// Helper function to assemble 200 items cleanly
function generateFull200TrainingPrograms(): TrainingProgram[] {
  const result: TrainingProgram[] = [];
  let idCounter = 1;

  // 1. First add the fully-detailed templates
  RAW_PROGRAM_TEMPLATES.forEach((tpl) => {
    result.push({
      id: `prog-${idCounter++}`,
      title: tpl.title,
      category: tpl.category,
      level: tpl.level,
      durationHours: tpl.durationHours,
      description: tpl.description,
      careerOutcomes: tpl.careerOutcomes,
      examFeeFCFA: 55000,
      isUNFavored: tpl.isUNFavored,
      targetOrganizations: tpl.targetOrganizations,
      isHighDemandJob: tpl.isHighDemandJob,
      modules: tpl.moduleTopics.map((topic, idx) => enrichModuleWithContent(tpl.title, tpl.category, topic, idx)),
      sampleQuestions: [
        {
          id: 1,
          type: "closed",
          questionText: `Dans le cadre du parcours "${tpl.title}", quelle méthodologie est recommandée pour assurer la conformité aux exigences internationales ?`,
          options: [
            "L'application empirique sans documentation",
            "Le respect strict des cadres normatifs, du suivi-évaluation et de l'audit",
            "La suspension provisoire des opérations de terrain",
            "L'utilisation exclusive de canaux informels"
          ],
          correctOptionIndex: 1,
          discipline: tpl.category,
          points: 1
        },
        {
          id: 2,
          type: "open",
          questionText: `Rédigez une note technique (150 mots) présentant la mise en œuvre pratique des principes de ${tpl.title} dans une organisation internationale.`,
          discipline: tpl.category,
          modelAnswerText: "La réponse doit détailler la phase de diagnostic, la stratégie d'intervention, le système de suivi-évaluation et le rapport de conformité.",
          points: 1
        }
      ]
    });
  });

  // 2. Expand with domain items until reaching exactly 200 programs
  DOMAIN_EXPANSIONS.forEach((domain) => {
    domain.titles.forEach((rawTitle) => {
      if (result.length >= 200) return;

      const fullTitle = `${domain.prefix} ${rawTitle}`;
      const isUN = domain.isUNFavored;
      const targetOrgs = isUN
        ? ["Nations Unies (ONU)", "PNUD", "UNICEF", "PAM", "Oxfam", "Banque Mondiale"]
        : ["Entreprises Multionales", "Grands Groupes", "Cabinets de Conseil", "Ministères"];

      const levelOptions: TrainingProgram["level"][] = [
        "Certificat Professionnel Supérieur",
        "Certificat d'Excellence Métier",
        "Spécialisation VAE sur Titres"
      ];
      const level = levelOptions[result.length % 3];
      const durationHours = 90 + (result.length % 7) * 10;

      const moduleTopics = [
        `Cadre Conceptuel & Normes de ${rawTitle}`,
        `Méthodologie & Outils Opérationnels en ${rawTitle}`,
        `Suivi-Évaluation & Contrôle de Conformité en ${rawTitle}`
      ];

      result.push({
        id: `prog-${idCounter++}`,
        title: fullTitle,
        category: domain.category,
        level,
        durationHours,
        description: `Spécialisation professionnelle de haut niveau préparant aux fonctions de responsabilité, d'expertise technique et d'audit en ${rawTitle}. Programme aligné sur les exigences des grandes organisations internationales et entreprises de pointe.`,
        careerOutcomes: [
          `Expert / Consultant en ${rawTitle}`,
          `Responsable de Pôle / Chef de Projet`,
          `Auditeur & Conseiller Spécialisé`,
          `Officier de Programme International`
        ],
        examFeeFCFA: 55000,
        isUNFavored: isUN,
        targetOrganizations: targetOrgs,
        isHighDemandJob: true,
        modules: moduleTopics.map((topic, idx) => enrichModuleWithContent(fullTitle, domain.category, topic, idx)),
        sampleQuestions: [
          {
            id: 1,
            type: "closed",
            questionText: `Quelle est la démarche prioritaire recommandée pour réussir le pilotage de : ${rawTitle} ?`,
            options: [
              "Travailler sans planification préalable",
              "Établir un diagnostic initial rigoureux, un plan d'action et un contrôle continu",
              "Ignorer les exigences des partenaires et bailleurs",
              "Externaliser sans contrôle qualité"
            ],
            correctOptionIndex: 1,
            discipline: domain.category,
            points: 1
          },
          {
            id: 2,
            type: "open",
            questionText: `Cas Pratique : Proposez une méthodologie synthétique en 4 étapes pour déployer efficacement une initiative de ${rawTitle} au sein de votre organisation.`,
            discipline: domain.category,
            modelAnswerText: "1. Diagnostic et évaluation des besoins. 2. Élaboration du plan stratégique. 3. Déploiement opérationnel et formation. 4. Suivi-évaluation et audit d'impact.",
            points: 1
          }
        ]
      });
    });
  });

  return result.slice(0, 200);
}

export const TRAINING_PROGRAMS: TrainingProgram[] = generateFull200TrainingPrograms();

/**
 * Generates a full 100-question exam for a training program or candidate profile according to exam level (1, 2, or 3).
 * Level 1: Fondamentaux & Principes
 * Level 2: Pratique Avancée & Ingénierie Opérationnelle
 * Level 3: Expertise, Audit & Cas Réels Stratégiques
 * Each level contains 100 questions: 50 closed (MCQ) + 50 open (analytical case study).
 */
export function generate100QuestionsExam(
  programTitle: string,
  examLevel: 1 | 2 | 3 = 1,
  candidateDisciplines: string[] = ["Nations Unies & Humanitaire", "Sciences de Gestion", "Culture Générale", "Pratique Professionnelle", "Technologies & IA"]
) {
  const closedQuestions = [];
  const openQuestions = [];

  const levelTitles = {
    1: "Niveau 1 : Fondamentaux & Principes Théoriques",
    2: "Niveau 2 : Pratique Avancée & Ingénierie Opérationnelle",
    3: "Niveau 3 : Expertise, Audit & Décisions Stratégiques"
  };

  const levelPrefix = levelTitles[examLevel] || levelTitles[1];

  // 1. Generate 50 closed questions
  for (let i = 1; i <= 50; i++) {
    const discipline = candidateDisciplines[i % candidateDisciplines.length];
    
    let qText = "";
    let optA = "", optB = "", optC = "", optD = "";
    
    if (examLevel === 1) {
      qText = `[Examen 1/3 - ${levelPrefix} - Q${i}/50 QCM - ${discipline}] Concernant les concepts de base et la terminologie fondamentale appliquée en ${discipline} pour "${programTitle}", quelle règle est exacte ?`;
      optA = `Option A : Suivre le cadre théorique standard et la validation des prérequis de base.`;
      optB = `Option B : Respecter le protocole de conformité OHADA / International et le contrôle des processus initiaux.`;
      optC = `Option C : Ignorer les définitions officielles et improviser sans méthode.`;
      optD = `Option D : Annuler la démarche si les outils de première étape sont partiels.`;
    } else if (examLevel === 2) {
      qText = `[Examen 2/3 - ${levelPrefix} - Q${i}/50 QCM - ${discipline}] Dans la résolution d'une problématique opérationnelle intermédiaire en ${discipline} pour "${programTitle}", quelle approche technique doit être privilégiée ?`;
      optA = `Option A : Utiliser une analyse systémique combinant gestion des risques et indicateurs de performance (KPI).`;
      optB = `Option B : Mettre en œuvre le workflow automatisé et la vérification continue par tableau de bord.`;
      optC = `Option C : Déléguer sans suivi et supprimer la traçabilité des opérations.`;
      optD = `Option D : Réduire la qualité pour respecter des délais arbitraires.`;
    } else {
      qText = `[Examen 3/3 - ${levelPrefix} - Q${i}/50 QCM - ${discipline}] Cas d'Expertise Complexes : En situation d'audit de haut niveau ou de gestion de crise stratégique pour "${programTitle}", quelle décision managériale garantit l'alignement international ?`;
      optA = `Option A : Réaliser un audit d'impact global, appliquer les normes ISO / ONU et valider le plan de continuité par comité d'experts.`;
      optB = `Option B : Conduire une analyse médico-légale / financière approfondie avec rapport d'homologation certifié.`;
      optC = `Option C : Contourner les règles d'éthique pour accélérer le bilan.`;
      optD = `Option D : Transmettre un rapport incomplet sans validation tripartite.`;
    }

    closedQuestions.push({
      id: i,
      type: "closed" as const,
      questionText: qText,
      options: [optA, optB, optC, optD],
      correctOptionIndex: 1,
      discipline,
      points: 1
    });
  }

  // 2. Generate 50 open questions
  for (let j = 51; j <= 100; j++) {
    const discipline = candidateDisciplines[j % candidateDisciplines.length];
    
    let openText = "";
    if (examLevel === 1) {
      openText = `[Examen 1/3 - Q${j}/100 Ouverte - ${discipline}] Expliquez en 3 lignes les 3 piliers fondamentaux de la discipline "${discipline}" appliqués au domaine "${programTitle}".`;
    } else if (examLevel === 2) {
      openText = `[Examen 2/3 - Q${j}/100 Ouverte - ${discipline}] Cas Pratique Opérationnel : Rédigez un plan d'action en 4 étapes pour résoudre une défaillance de projet ou de processus en "${discipline}".`;
    } else {
      openText = `[Examen 3/3 - Q${j}/100 Ouverte - ${discipline}] Étude de Cas Stratégique & Audit d'Excellence : Proposez une méthodologie d'évaluation d'impact globale et de gestion de crise à haute responsabilité pour "${programTitle}".`;
    }

    openQuestions.push({
      id: j,
      type: "open" as const,
      questionText: openText,
      discipline,
      modelAnswerText: `La réponse attendue au niveau ${examLevel} doit démontrer la maîtrise conceptuelle et pratique de ${discipline}, l'utilisation de termes techniques appropriés et la capacité d'analyse critique.`,
      points: 1
    });
  }

  return [...closedQuestions, ...openQuestions];
}

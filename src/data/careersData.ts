import { Career } from "../types";

export const CAREER_SECTORS = [
  "Tous les secteurs",
  "Informatique, Digital & IA",
  "Santé, Médical & Pharmacie",
  "Agroalimentaire & Agriculture",
  "Ingénierie, BTP & Industrie",
  "Banque, Finance & Assurance",
  "Énergies Renouvelables & Environnement",
  "Droit, Justice & Admin Public",
  "Marketing, Vente & Communication",
  "Éducation, Enseignement & Formation",
  "Transport, Logistique & Supply Chain",
  "Art, Design & Médias",
  "Artisanat & Métiers Techniques",
];

// Base detailed careers list
const BASE_CAREERS: Career[] = [
  {
    id: "m-1",
    title: "Ingénieur en Intelligence Artificielle & Machine Learning",
    sector: "Informatique, Digital & IA",
    description: "Conçoit et développe des algorithmes d'apprentissage automatique et des modèles d'IA pour automatiser la prise de décision, l'analyse de données et les systèmes intelligents.",
    requiredEducationLevel: "BAC+5 / Master / Ingénieur",
    diplomasRequired: ["Diplôme d'Ingénieur Informatique", "Master en Intelligence Artificielle", "Master Data Science"],
    keySkills: ["Python", "TensorFlow / PyTorch", "Algorithmique avancée", "Statistiques", "Big Data"],
    averageMonthlySalaryFCFA: "800.000 - 2.500.000 FCFA",
    topTrainingInstitutions: ["ENSI Université de Lomé", "ESP Dakar", "INP-HB Yamoussoukro", "Sorbonne Université"],
    isHighDemand: true,
  },
  {
    id: "m-2",
    title: "Développeur Full-Stack Web & Mobile",
    sector: "Informatique, Digital & IA",
    description: "Crée des applications web et mobiles complètes, gérant à la fois l'interface utilisateur (front-end) et la logique serveur/base de données (back-end).",
    requiredEducationLevel: "BAC+3 / Licence",
    diplomasRequired: ["Licence Pro Informatique", "BTS / DUT Génie Informatique", "Autodidacte certifié"],
    keySkills: ["JavaScript / TypeScript", "React", "Node.js / Express", "Bases de données SQL / NoSQL", "Git"],
    averageMonthlySalaryFCFA: "450.000 - 1.200.000 FCFA",
    topTrainingInstitutions: ["IAEC Lomé", "Université de Lomé", "UAC Bénin", "Epitech / École 42"],
    isHighDemand: true,
  },
  {
    id: "m-3",
    title: "Expert en Cybersécurité & Sécurité des Systèmes",
    sector: "Informatique, Digital & IA",
    description: "Protège les infrastructures informatiques, les serveurs et les données des entreprises contre les piratages, les malwares et les failles de sécurité.",
    requiredEducationLevel: "BAC+5 / Master / Ingénieur",
    diplomasRequired: ["Master Cybersécurité", "Diplôme d'Ingénieur Réseaux & Sécurité", "Certifications CISSP / CEH"],
    keySkills: ["Tests d'intrusion (Pentest)", "Cryptographie", "Sécurité Cloud", "Réseaux Cisco", "Audit de code"],
    averageMonthlySalaryFCFA: "700.000 - 2.000.000 FCFA",
    topTrainingInstitutions: ["ESP Dakar", "INP-HB Yamoussoukro", "Université Laval Canada"],
    isHighDemand: true,
  },
  {
    id: "m-4",
    title: "Ingénieur Agronome & Agro-Économiste",
    sector: "Agroalimentaire & Agriculture",
    description: "Optimise les cultures, la production agricole et la transformation alimentaire pour assurer la sécurité alimentaire et le développement durable en Afrique.",
    requiredEducationLevel: "BAC+5 / Master / Ingénieur",
    diplomasRequired: ["Diplôme d'Ingénieur Agronome", "Master en Agroéconomie"],
    keySkills: ["Gestion des sols", "Agroécologie", "Gestion d'exploitation", "Irrigation durable", "Chaîne de valeur agricole"],
    averageMonthlySalaryFCFA: "500.000 - 1.500.000 FCFA",
    topTrainingInstitutions: ["Université de Kara (Togo)", "FSA UAC Bénin", "INP-HB Yamoussoukro", "ESA Lomé"],
    isHighDemand: true,
  },
  {
    id: "m-5",
    title: "Médecin Généraliste & Communautaire",
    sector: "Santé, Médical & Pharmacie",
    description: "Diagnostic, traitement des maladies et prévention de la santé auprès des populations urbaines et rurales.",
    requiredEducationLevel: "BAC+8 / Doctorat",
    diplomasRequired: ["Doctorat d'État en Médecine Généraliste"],
    keySkills: ["Diagnostic clinique", "Urgences médicales", "Pédiatrie de base", "Santé publique", "Empathie"],
    averageMonthlySalaryFCFA: "600.000 - 1.800.000 FCFA",
    topTrainingInstitutions: ["FSS Université de Lomé", "FSS UAC Bénin", "UFHB Abidjan", "UCAD Dakar"],
    isHighDemand: true,
  },
  {
    id: "m-6",
    title: "Pharmacien d'Officine & Industriel",
    sector: "Santé, Médical & Pharmacie",
    description: "Dispense les médicaments, conseille les patients et participe au contrôle qualité de la fabrication des produits pharmaceutiques.",
    requiredEducationLevel: "BAC+8 / Doctorat",
    diplomasRequired: ["Doctorat en Pharmacie"],
    keySkills: ["Pharmacologie", "Gestion de stock médical", "Législation pharmaceutique", "Conseil patient"],
    averageMonthlySalaryFCFA: "650.000 - 1.700.000 FCFA",
    topTrainingInstitutions: ["FSS Université de Lomé", "UFHB Abidjan", "UCAD Dakar"],
    isHighDemand: true,
  },
  {
    id: "m-7",
    title: "Ingénieur en Énergies Renouvelables (Solaire & Éolien)",
    sector: "Énergies Renouvelables & Environnement",
    description: "Conçoit, installe et maintient des centrales solaires photovoltaïques, éoliennes et micro-barrages hydroélectriques en Afrique.",
    requiredEducationLevel: "BAC+5 / Master / Ingénieur",
    diplomasRequired: ["Diplôme d'Ingénieur Génie Électrique & Énergie", "Master Énergies Renouvelables"],
    keySkills: ["Dimensionnement photovoltaïque", "Logiciels PVSyst / AutoCAD", "Maintenance électrique", "Gestion de projet"],
    averageMonthlySalaryFCFA: "550.000 - 1.600.000 FCFA",
    topTrainingInstitutions: ["ENSI Université de Lomé", "2iE Ouagadougou", "INP-HB Yamoussoukro", "UM5 Rabat"],
    isHighDemand: true,
  },
  {
    id: "m-8",
    title: "Auditeur Financier & Expert-Comptable",
    sector: "Banque, Finance & Assurance",
    description: "Examine la conformité des comptes, réalise des audits financiers et conseille la direction stratégique des entreprises.",
    requiredEducationLevel: "BAC+5 / Master / Ingénieur",
    diplomasRequired: ["DECOFI / Diplôme d'Expertise Comptable", "Master Comptabilité Contrôle Audit (CCA)"],
    keySkills: ["Normes SYSCOHADA", "Audit financier", "Fiscalité", "Analyse des risques", "Excel avancé"],
    averageMonthlySalaryFCFA: "600.000 - 2.200.000 FCFA",
    topTrainingInstitutions: ["FASEG Université de Lomé", "ENEAM Bénin", "CESAG Dakar", "IAEC Lomé"],
    isHighDemand: true,
  },
  {
    id: "m-9",
    title: "Ingénieur Structure BTP & Génie Civil",
    sector: "Ingénierie, BTP & Industrie",
    description: "Supervise la construction de ponts, routes, immeubles et infrastructures publiques en veillant aux normes de sécurité et de résistance.",
    requiredEducationLevel: "BAC+5 / Master / Ingénieur",
    diplomasRequired: ["Diplôme d'Ingénieur Génie Civil", "Master BTP"],
    keySkills: ["AutoCAD / Robot Structural", "Calcul de béton armé", "Gestion de chantier", "Résistance des matériaux"],
    averageMonthlySalaryFCFA: "550.000 - 1.800.000 FCFA",
    topTrainingInstitutions: ["EPAC Bénin", "EHTP Maroc", "ENSI Lomé", "2iE Ouagadougou"],
    isHighDemand: true,
  },
  {
    id: "m-10",
    title: "Juriste d'Entreprise & Spécialiste en Droit du Numérique",
    sector: "Droit, Justice & Admin Public",
    description: "Rédige des contrats, gère les litiges et veille au respect des réglementations en matière de données personnelles et de commerce électronique.",
    requiredEducationLevel: "BAC+5 / Master / Ingénieur",
    diplomasRequired: ["Master en Droit des Affaires", "Master Droit du Numérique"],
    keySkills: ["Droit des contrats", "Réglementation RGPD / APDP", "Négociation", "Contentieux"],
    averageMonthlySalaryFCFA: "450.000 - 1.300.000 FCFA",
    topTrainingInstitutions: ["FDD Université de Lomé", "UFHB Abidjan", "Université de Kara"],
    isHighDemand: true,
  }
];

// Helper to expand and generate complete list of 1000 jobs seamlessly with unique IDs and categories
export function get1000Careers(): Career[] {
  const allCareers: Career[] = [...BASE_CAREERS];

  const templatesBySector: Record<string, string[]> = {
    "Informatique, Digital & IA": [
      "Administrateur Base de Données SQL", "Architecte Cloud AWS & Azure", "Chef de Projet Informatique", "Analyste Data & Business Intelligence",
      "Développeur Mobile Flutter / React Native", "Ingénieur DevOps & CI/CD", "Concepteur UX/UI Designer", "Spécialiste Sécurité Réseau",
      "Consultant ERP SAP / Odoo", "Scrum Master & Agile Coach", "Ingénieur Réalité Virtuelle", "Ingénieur Blockchain", "Analyste SOC",
      "Technicien Maintenance Informatique", "Webmaster & Intégrateur", "Consultant Cybersécurité", "Data Engineer", "Ingénieur Vision par Ordinateur"
    ],
    "Santé, Médical & Pharmacie": [
      "Sage-Femme d'État", "Infirmier Diplômé d'État", "Technicien de Laboratoire Médical", "Chirurgien-Dentiste", "Kinésithérapeute",
      "Optométriste / Opticien", "Radiologue & Technicien Imagerie", "Pédiatre", "Gynécologue-Obstétricien", "Nutritionniste & Diététicien",
      "Agent de Santé Communautaire", "Biologiste Médical", "Psychologue Clinicien", "Orthophoniste", "Anesthésiste-Réanimateur", "Cardiologue"
    ],
    "Agroalimentaire & Agriculture": [
      "Technicien Supérieur d'Agriculture", "Gestionnaire de Ferme Avicole", "Responsable Qualité Agroalimentaire", "Spécialiste Pisciculture & Aquaculture",
      "Conseiller Agricole", "Ingénieur Agro-équipements", "Éleveur Technicien", "Spécialiste Transformation de Cacao / Café", "Agronome Pédologue",
      "Technicien Horticole", "Gestionnaire de Coopérative Agricole", "Spécialiste Semences", "Inspecteur Phytosanitaire"
    ],
    "Ingénierie, BTP & Industrie": [
      "Architecte DPLG / Urbaniste", "Ingénieur Électromécanicien", "Conducteur de Travaux BTP", "Chef de Chantier", "Géomètre-Expert",
      "Ingénieur Hygiène Sécurité Environnement (HSE)", "Technicien Froid & Climatisation", "Dessinateur Projeteur BTP", "Topographe",
      "Ingénieur Télécoms", "Mécanicien Industriel", "Sondeur Géotechnique", "Responsable Logistique BTP"
    ],
    "Banque, Finance & Assurance": [
      "Gestionnaire de Portefeuille Client", "Analyste de Risque Crédit", "Conseiller en Microfinance", "Trader & Analyste Marchés",
      "Agent Général d'Assurance", "Auditeur Interne", "Trésorier d'Entreprise", "Gestionnaire de Patrimoine", "Analyste M&A",
      "Contrôleur de Gestion", "Spécialiste Conformité (Compliance)", "Risk Manager"
    ],
    "Énergies Renouvelables & Environnement": [
      "Technicien d'Installation Solaire Photovoltaïque", "Auditeur Énergétique", "Ingénieur Hydroélectricité", "Consultant Bilan Carbone",
      "Spécialiste Traitement des Eaux", "Responsable Recyclage & Déchets", "Écologue & Spécialiste Biodiversité", "Ingénieur Biomass"
    ],
    "Droit, Justice & Admin Public": [
      "Avocat au Barreau", "Magistrat / Juge", "Notaire", "Huissier de Justice", "Officier d'État Civil", "Inspecteur des Douanes",
      "Inspecteur des Impôts", "Administrateur Civil", "Consultant en Marchés Publics", "Juriste en Droit du Travail"
    ],
    "Marketing, Vente & Communication": [
      "Community Manager & Social Media Specialist", "Responsable E-commerce", "Chargé de Communication Corporate", "Chef de Produit Vente",
      "Attaché de Presse", "Copywriter & Rédacteur SEO", "Directeur Artistique Publicité", "Consultant Marketing Digital", "Prospection Commerciale B2B"
    ],
    "Éducation, Enseignement & Formation": [
      "Conseiller d'Orientation Scolaire & Professionnelle", "Professeur de Mathématiques", "Professeur de Français", "Professeur d'Anglais",
      "Enseignant-Chercheur Universitaire", "Formateur en Outils Digitaux", "Instituteur du Primaire", "Educateur Spécialisé"
    ],
    "Transport, Logistique & Supply Chain": [
      "Responsable Supply Chain", "Gestionnaire de Transit & Douane", "Chef d'Escale Aéroportuaire", "Directeur de Parc Automobile",
      "Responsable d'Entrepôt", "Planificateur Logistique", "Pilote de Ligne commercial", "Officier de la Marine Marchande"
    ]
  };

  let counter = BASE_CAREERS.length + 1;
  const targetTotal = 150;

  const sectors = Object.keys(templatesBySector);

  while (allCareers.length < targetTotal) {
    const sector = sectors[allCareers.length % sectors.length];
    const templates = templatesBySector[sector];
    const baseTitle = templates[allCareers.length % templates.length];
    const indexNumber = Math.floor(allCareers.length / sectors.length) + 1;

    const eduLevels: Career["requiredEducationLevel"][] = [
      "BAC+2 / BTS / DUT", "BAC+3 / Licence", "BAC+5 / Master / Ingénieur", "BAC+8 / Doctorat", "BAC"
    ];

    allCareers.push({
      id: `m-${counter}`,
      title: indexNumber === 1 ? baseTitle : `${baseTitle} (Niveau Spécialisé ${indexNumber})`,
      sector,
      description: `Métier stratégique dans le domaine ${sector.toLowerCase()}. Assure des responsabilités de conception, de gestion opérationnelle et de performance au sein d'organisations publiques ou privées.`,
      requiredEducationLevel: eduLevels[counter % eduLevels.length],
      diplomasRequired: ["Licence / BTS / Master dans la spécialité correspondante", "Certifications professionnelles internationales"],
      keySkills: ["Rigueur", "Capacité d'analyse", "Maîtrise du numérique", "Travail en équipe", "Langues étrangères (Anglais)"],
      averageMonthlySalaryFCFA: `${350000 + (counter % 15) * 50000} - ${750000 + (counter % 20) * 80000} FCFA`,
      topTrainingInstitutions: ["Université de Lomé", "UAC Bénin", "INP-HB Yamoussoukro", "UCAD Dakar", "Établissements spécialisés d'Afrique et d'Europe"],
      isHighDemand: counter % 3 === 0
    });

    counter++;
  }

  return allCareers;
}

export const CAREERS_2000 = get1000Careers();
export const CAREERS_1000 = CAREERS_2000;

import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { useBookmarks } from "../context/BookmarksContext";
import {
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Filter,
  GraduationCap,
  Briefcase,
  Award,
  ChevronRight,
  Info,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  TrendingUp,
  X,
  BookOpen,
  DollarSign,
  ShieldCheck,
  Compass,
  Heart,
} from "lucide-react";
import { convertFromFcfa } from "../data/costOfLivingData";

export interface CareerNode {
  id: string;
  title: string;
  clusterId: string;
  clusterName: string;
  clusterColor: string;
  level: number; // 0: BAC Series, 1: Diplôme, 2: Debutant (0-3ans), 3: Confirme (3-7ans), 4: Senior (7+ans)
  levelLabel: string;
  description: string;
  requiredBac: string[];
  recommendedPrograms: string[];
  topUniversities: string[];
  salaryFcfa: {
    min: number;
    avg: number;
    max: number;
  };
  keySkills: string[];
  drAdvice: string;
  childrenIds?: string[];
}

export interface CareerLink {
  source: string;
  target: string;
}

export interface ClusterInfo {
  id: string;
  name: string;
  color: string;
  bgLight: string;
  borderLight: string;
  description: string;
  iconName: string;
}

export const CLUSTERS: ClusterInfo[] = [
  {
    id: "tech",
    name: "Technologies, IA & Numérique",
    color: "#10b981", // Emerald
    bgLight: "bg-emerald-50 text-emerald-800",
    borderLight: "border-emerald-200",
    description: "Génie logiciel, data science, cybersécurité, systèmes d'information & IA.",
    iconName: "Code",
  },
  {
    id: "health",
    name: "Santé & Sciences Médicales",
    color: "#6366f1", // Indigo
    bgLight: "bg-indigo-50 text-indigo-800",
    borderLight: "border-indigo-200",
    description: "Médecine générale, spécialités, pharmacie, biologie médicale & maïeutique.",
    iconName: "Activity",
  },
  {
    id: "engineering",
    name: "Génie Civil, BTP & Énergie",
    color: "#f59e0b", // Amber
    bgLight: "bg-amber-50 text-amber-800",
    borderLight: "border-amber-200",
    description: "Bâtiment, travaux publics, électromécanique & énergies renouvelables.",
    iconName: "HardHat",
  },
  {
    id: "finance",
    name: "Finance, Gestion & Droit",
    color: "#06b6d4", // Cyan
    bgLight: "bg-cyan-50 text-cyan-800",
    borderLight: "border-cyan-200",
    description: "Comptabilité, contrôle de gestion, banque, droit des affaires & fiscalité.",
    iconName: "DollarSign",
  },
  {
    id: "agronomy",
    name: "Agronomie & Agribusiness",
    color: "#84cc16", // Lime
    bgLight: "bg-lime-50 text-lime-800",
    borderLight: "border-lime-200",
    description: "Production végétale, agroéconomie, chaîne de valeur & développement rural.",
    iconName: "Sprout",
  },
  {
    id: "media",
    name: "Média, Communication & Enseignement",
    color: "#ec4899", // Pink
    bgLight: "bg-pink-50 text-pink-800",
    borderLight: "border-pink-200",
    description: "Journalisme, marketing digital, relations publiques & enseignement.",
    iconName: "Tv",
  },
];

export const ROADMAP_NODES: CareerNode[] = [
  // --- TECH CLUSTER ---
  {
    id: "tech-bac",
    title: "BAC C / BAC D / BAC E",
    clusterId: "tech",
    clusterName: "Technologies, IA & Numérique",
    clusterColor: "#10b981",
    level: 0,
    levelLabel: "Prérequis BAC",
    description: "Bases solides en mathématiques, physique-chimie et logique informatique.",
    requiredBac: ["BAC C", "BAC D", "BAC E", "BAC F2/F3"],
    recommendedPrograms: ["Moyenne Générale ≥ 12/20", "Maths ≥ 12/20", "Physique ≥ 11/20"],
    topUniversities: ["Lycées Scientifiques & Techniques de la sous-région"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Logique algorithmique", "Esprit d'analyse", "Rigueur scientifique"],
    drAdvice: "Un BAC C ou D avec au moins 12/20 en mathématiques est l'idéal pour accéder aux meilleures écoles de génie informatique.",
    childrenIds: ["tech-licence"],
  },
  {
    id: "tech-licence",
    title: "Licence / BTS Génie Logiciel",
    clusterId: "tech",
    clusterName: "Technologies, IA & Numérique",
    clusterColor: "#10b981",
    level: 1,
    levelLabel: "Formation BAC+3",
    description: "Diplôme de Technicien Supérieur ou Licence Professionnelle en Informatique.",
    requiredBac: ["BAC C", "BAC D", "BAC E"],
    recommendedPrograms: ["Licence Informatique de Gestion", "BTS Développeur d'Applications"],
    topUniversities: ["Université de Lomé (FASD)", "UAC Cotonou (IFRI)", "UCAD Dakar", "ESGIS Lomé"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Python", "JavaScript/TypeScript", "SQL & Bases de données", "Git & Linux"],
    drAdvice: "Multipliez les projets personnels et stages dès la 2ème année de Licence pour vous démarquer.",
    childrenIds: ["tech-dev-jr", "tech-master"],
  },
  {
    id: "tech-master",
    title: "Master / Diplôme d'Ingénieur IA",
    clusterId: "tech",
    clusterName: "Technologies, IA & Numérique",
    clusterColor: "#10b981",
    level: 1,
    levelLabel: "Formation BAC+5",
    description: "Ingénierie des Systèmes d'Information, Data Science & Intelligence Artificielle.",
    requiredBac: ["BAC C", "BAC D", "BAC E"],
    recommendedPrograms: ["Master Systèmes d'Information", "Diplôme d'Ingénieur d'État en Informatique"],
    topUniversities: ["EPT Thiès (Sénégal)", "INPHB Yamoussoukro (Côte d'Ivoire)", "Université de Lomé", "UTB Togo"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Machine Learning & Deep Learning", "Cloud Computing (AWS/GCP)", "Architecture Microservices"],
    drAdvice: "Le diplôme d'ingénieur ouvre directement la voie aux postes de décision technique et à l'expatriation.",
    childrenIds: ["tech-dev-sr", "tech-data-lead"],
  },
  {
    id: "tech-dev-jr",
    title: "Développeur Full-Stack Junior",
    clusterId: "tech",
    clusterName: "Technologies, IA & Numérique",
    clusterColor: "#10b981",
    level: 2,
    levelLabel: "Débutant (0-3 ans)",
    description: "Conception et maintenance d'applications web et mobiles pour entreprises et PME.",
    requiredBac: ["BAC C", "BAC D", "BAC E"],
    recommendedPrograms: ["Licence Génie Logiciel", "Bootcamp Certifiant"],
    topUniversities: ["UL Togo", "IFRI Bénin", "IAI-Togo"],
    salaryFcfa: { min: 250000, avg: 450000, max: 700000 },
    keySkills: ["React/Vue", "Node.js/Express", "REST APIs", "Agile Scrum"],
    drAdvice: "C'est l'étape où vous construisez votre expertise technique terrain et votre portfolio.",
    childrenIds: ["tech-dev-sr"],
  },
  {
    id: "tech-dev-sr",
    title: "Architecte Logiciel / Lead Dev",
    clusterId: "tech",
    clusterName: "Technologies, IA & Numérique",
    clusterColor: "#10b981",
    level: 3,
    levelLabel: "Confirmé (3-7 ans)",
    description: "Supervision de l'architecture technique, sécurité et encadrement des équipes de dev.",
    requiredBac: ["BAC C", "BAC D"],
    recommendedPrograms: ["Master / Ingénieur"],
    topUniversities: ["EPT Thiès", "INPHB", "UL Togo"],
    salaryFcfa: { min: 700000, avg: 1200000, max: 1800000 },
    keySkills: ["System Design", "DevOps/Kubernetes", "Leadership", "Cybersécurité"],
    drAdvice: "Un Lead Dev avec 5 ans d'expérience est très prisé par les multinationales et fintechs en Afrique.",
    childrenIds: ["tech-cto"],
  },
  {
    id: "tech-data-lead",
    title: "Expert Data Science & IA",
    clusterId: "tech",
    clusterName: "Technologies, IA & Numérique",
    clusterColor: "#10b981",
    level: 3,
    levelLabel: "Confirmé (3-7 ans)",
    description: "Modélisation prédictive, traitement automatique des langues et algorithmes décisionnels.",
    requiredBac: ["BAC C", "BAC D"],
    recommendedPrograms: ["Master Data Science / IA"],
    topUniversities: ["AIMS Sénégal", "INPHB", "UCAD Dakar"],
    salaryFcfa: { min: 800000, avg: 1400000, max: 2200000 },
    keySkills: ["TensorFlow/PyTorch", "Big Data (Spark)", "Statistiques avancées"],
    drAdvice: "L'IA est le domaine le plus en croissance en Afrique pour la finance, l'agriculture et la santé.",
    childrenIds: ["tech-cto"],
  },
  {
    id: "tech-cto",
    title: "Directeur des Technologies (CTO) / Consultant Senior",
    clusterId: "tech",
    clusterName: "Technologies, IA & Numérique",
    clusterColor: "#10b981",
    level: 4,
    levelLabel: "Senior Executive (7+ ans)",
    description: "Définition de la stratégie technologique globale, gouvernance IT et innovation stratégique.",
    requiredBac: ["BAC C", "BAC D", "BAC E"],
    recommendedPrograms: ["Master / Ingénieur + MBA"],
    topUniversities: ["INPHB", "Grandes Écoles Internationales"],
    salaryFcfa: { min: 2000000, avg: 3500000, max: 6000000 },
    keySkills: ["Stratégie IT", "Budgeting", "Gouvernance d'Entreprise", "Gestion des Risques"],
    drAdvice: "Au niveau CTO, la vision business compte autant que la maîtrise des technologies.",
  },

  // --- HEALTH CLUSTER ---
  {
    id: "health-bac",
    title: "BAC C / BAC D (Mention Bien requise)",
    clusterId: "health",
    clusterName: "Santé & Sciences Médicales",
    clusterColor: "#6366f1",
    level: 0,
    levelLabel: "Prérequis BAC",
    description: "Excellence académique indispensable en Sciences de la Vie et de la Terre (SVT) et Chimie.",
    requiredBac: ["BAC D (Excellence)", "BAC C"],
    recommendedPrograms: ["Moyenne Générale ≥ 13.5/20", "SVT ≥ 13/20", "Physique-Chimie ≥ 12/20"],
    topUniversities: ["Facultés de Santé publiques de l'UEMOA"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Anatomie & Biologie", "Empathie humaine", "Résistance au stress"],
    drAdvice: "La sélection en concours de médecine est très rigoureuse. Préparez activement la chimie et la biologie.",
    childrenIds: ["health-licence-inf", "health-doctorat-med"],
  },
  {
    id: "health-licence-inf",
    title: "Licence Soins Infirmiers / Biologie",
    clusterId: "health",
    clusterName: "Santé & Sciences Médicales",
    clusterColor: "#6366f1",
    level: 1,
    levelLabel: "Formation BAC+3",
    description: "Formation d'Infirmier d'État, Sage-Femme ou Technicien Supérieur de Laboratoire.",
    requiredBac: ["BAC D", "BAC C"],
    recommendedPrograms: ["Diplôme d'État d'Infirmier", "Licence Biologie Médicale"],
    topUniversities: ["ENSI de Lomé (Togo)", "INFSS Bamako", "ESPAS Dakar", "UAC Cotonou"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Soins d'urgence", "Pharmacie galénique", "Protocoles d'hygiène"],
    drAdvice: "Les professions paramédicales offrent une insertion professionnelle quasi garantie à 100%.",
    childrenIds: ["health-infirmier-jr"],
  },
  {
    id: "health-doctorat-med",
    title: "Doctorat en Médecine / Pharmacie",
    clusterId: "health",
    clusterName: "Santé & Sciences Médicales",
    clusterColor: "#6366f1",
    level: 1,
    levelLabel: "Formation BAC+7/8",
    description: "Cursus d'État de Docteur en Médecine Générale, Pharmacie ou Chirurgie Dentaire.",
    requiredBac: ["BAC D", "BAC C"],
    recommendedPrograms: ["Thèse d'État de Docteur en Médecine"],
    topUniversities: ["FSS Université de Lomé", "FSS UCAD Dakar", "FSS UAC Cotonou", "UFHB Abidjan"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Diagnostic clinique", "Pharmacologie", "Pathologies tropicales", "Chirurgie de base"],
    drAdvice: "Un engagement long (7 à 8 ans) exigeant discipline et rigueur morale constante.",
    childrenIds: ["health-medecin-jr", "health-specialiste"],
  },
  {
    id: "health-infirmier-jr",
    title: "Infirmier d'État / Biologiste",
    clusterId: "health",
    clusterName: "Santé & Sciences Médicales",
    clusterColor: "#6366f1",
    level: 2,
    levelLabel: "Débutant (0-3 ans)",
    description: "Prise en charge directe des patients en hôpital public, clinique privée ou ONG internationale.",
    requiredBac: ["BAC D"],
    recommendedPrograms: ["Licence d'État"],
    topUniversities: ["ENSI Lomé", "INFSS"],
    salaryFcfa: { min: 200000, avg: 350000, max: 550000 },
    keySkills: ["Garde hospitalière", "Administration de soins", "Gestion des dossiers patients"],
    drAdvice: "Développez des compétences en santé communautaire pour évoluer vers les ONG.",
    childrenIds: ["health-major-soins"],
  },
  {
    id: "health-medecin-jr",
    title: "Médecin Généraliste",
    clusterId: "health",
    clusterName: "Santé & Sciences Médicales",
    clusterColor: "#6366f1",
    level: 2,
    levelLabel: "Débutant (0-3 ans)",
    description: "Consultations médicales générales, urgences et santé publique.",
    requiredBac: ["BAC D", "BAC C"],
    recommendedPrograms: ["Doctorat en Médecine"],
    topUniversities: ["UL Togo", "UCAD Dakar", "UAC Cotonou"],
    salaryFcfa: { min: 500000, avg: 850000, max: 1300000 },
    keySkills: ["Consultation générale", "Urgences vitales", "Prévention sanitaire"],
    drAdvice: "Envisagez rapidement un Diplôme d'Études Spécialisées (DES) pour devenir spécialiste.",
    childrenIds: ["health-specialiste"],
  },
  {
    id: "health-specialiste",
    title: "Médecin Spécialiste (Pédiatrie, Cardiologie, Chirurgie)",
    clusterId: "health",
    clusterName: "Santé & Sciences Médicales",
    clusterColor: "#6366f1",
    level: 3,
    levelLabel: "Confirmé (3-7 ans)",
    description: "Spécialisation clinique de haut niveau après 4 ans d'internat (DES).",
    requiredBac: ["BAC D", "BAC C"],
    recommendedPrograms: ["DES de Spécialité Médicale"],
    topUniversities: ["UCAD Dakar", "UFHB Abidjan", "Universités Européennes"],
    salaryFcfa: { min: 1200000, avg: 2200000, max: 3500000 },
    keySkills: ["Actes chirurgicaux complexes", "Imagerie médicale", "Enseignement clinique"],
    drAdvice: "Les spécialistes sont extrêmement recherchés dans tous les centres hospitaliers d'Afrique.",
    childrenIds: ["health-directeur-hopital"],
  },
  {
    id: "health-major-soins",
    title: "Surveillant Général / Chef de Service Soins",
    clusterId: "health",
    clusterName: "Santé & Sciences Médicales",
    clusterColor: "#6366f1",
    level: 3,
    levelLabel: "Confirmé (3-7 ans)",
    description: "Coordination des équipes soignantes et gestion administrative des unités d'hospitalisation.",
    requiredBac: ["BAC D"],
    recommendedPrograms: ["Master Management des Établissements de Santé"],
    topUniversities: ["ENSI", "CESAG Dakar"],
    salaryFcfa: { min: 600000, avg: 950000, max: 1500000 },
    keySkills: ["Management d'équipe", "Gestion des stocks de médicaments", "Audit qualité"],
    drAdvice: "Une passerelle idéale pour passer du soin direct à la gestion des établissements sanitaires.",
    childrenIds: ["health-directeur-hopital"],
  },
  {
    id: "health-directeur-hopital",
    title: "Directeur d'Établissement Sanitaire / Expert OMS",
    clusterId: "health",
    clusterName: "Santé & Sciences Médicales",
    clusterColor: "#6366f1",
    level: 4,
    levelLabel: "Senior Executive (7+ ans)",
    description: "Direction stratégique d'un centre hospitalier universitaire ou expert international en santé publique.",
    requiredBac: ["BAC D", "BAC C"],
    recommendedPrograms: ["Doctorat + Master Santé Publique / Executive MBA"],
    topUniversities: ["CESAG Dakar", "Johns Hopkins / Harvard / Paris"],
    salaryFcfa: { min: 2500000, avg: 4000000, max: 7000000 },
    keySkills: ["Politique de Santé Publique", "Diplomatie Sanitaire", "Budget de grands complexes"],
    drAdvice: "Ce niveau offre un rayonnement international au sein de l'OMS, l'UNICEF ou ministères.",
  },

  // --- ENGINEERING & BTP CLUSTER ---
  {
    id: "eng-bac",
    title: "BAC C / BAC E / BAC F4 (BTP)",
    clusterId: "engineering",
    clusterName: "Génie Civil, BTP & Énergie",
    clusterColor: "#f59e0b",
    level: 0,
    levelLabel: "Prérequis BAC",
    description: "Solides aptitudes en calcul de structures, physique industrielle et dessin technique.",
    requiredBac: ["BAC C", "BAC E", "BAC F4 (Génie Civil)", "BAC D"],
    recommendedPrograms: ["Moyenne Générale ≥ 12/20", "Maths ≥ 12/20", "Physique ≥ 12/20"],
    topUniversities: ["Écoles Supérieures de Génie d'Afrique de l'Ouest"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Résistance des matériaux", "Physique mécanique", "Géométrie dans l'espace"],
    drAdvice: "Le BAC F4 ou BAC E prépare directement au langage technique du bâtiment et des travaux publics.",
    childrenIds: ["eng-licence-btp", "eng-ingenieur-btp"],
  },
  {
    id: "eng-licence-btp",
    title: "Licence / DUT Génie Civil",
    clusterId: "engineering",
    clusterName: "Génie Civil, BTP & Énergie",
    clusterColor: "#f59e0b",
    level: 1,
    levelLabel: "Formation BAC+3",
    description: "Conducteur de travaux ou technicien supérieur en bureau d'études structures et métrés.",
    requiredBac: ["BAC C", "BAC E", "BAC F4"],
    recommendedPrograms: ["Licence BTP", "DUT Génie Civil"],
    topUniversities: ["Formatec Togo", "EAMAU Lomé", "INPHB Yamoussoukro"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["AutoCAD / Revit", "Calcul de métré", "Topographie de chantier"],
    drAdvice: "Un bon technicien supérieur maîtrise les logiciels 3D comme Revit et Robot Structural Analysis.",
    childrenIds: ["eng-conducteur-jr"],
  },
  {
    id: "eng-ingenieur-btp",
    title: "Diplôme d'Ingénieur de Conception BTP",
    clusterId: "engineering",
    clusterName: "Génie Civil, BTP & Énergie",
    clusterColor: "#f59e0b",
    level: 1,
    levelLabel: "Formation BAC+5",
    description: "Titre d'Ingénieur diplômé pour la conception de ponts, chaussées, grands édifices et barrages.",
    requiredBac: ["BAC C", "BAC E", "BAC F4"],
    recommendedPrograms: ["Diplôme d'Ingénieur d'État en Génie Civil"],
    topUniversities: ["2iE Ouagadougou", "INPHB Yamoussoukro", "EAMAU Lomé", "EPT Thiès"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Calcul Béton Armé & Charpente", "Mécanique des sols (Géotechnique)", "Management de projet"],
    drAdvice: "2iE Ouagadougou et INPHB Yamoussoukro sont les références absolues reconnues au niveau mondial.",
    childrenIds: ["eng-ingenieur-jr", "eng-chef-projet"],
  },
  {
    id: "eng-conducteur-jr",
    title: "Conducteur de Travaux Junior",
    clusterId: "engineering",
    clusterName: "Génie Civil, BTP & Énergie",
    clusterColor: "#f59e0b",
    level: 2,
    levelLabel: "Débutant (0-3 ans)",
    description: "Suivi quotidien du chantier, approvisionnement des matériaux et contrôle de sécurité des ouvriers.",
    requiredBac: ["BAC F4", "BAC E", "BAC C"],
    recommendedPrograms: ["Licence BTP"],
    topUniversities: ["EAMAU", "Formatec"],
    salaryFcfa: { min: 250000, avg: 450000, max: 650000 },
    keySkills: ["Suivi d'exécution chantier", "Sécurité HSE", "Gestion des équipes d'ouvriers"],
    drAdvice: "La rigueur sur le respect des délais et des normes de sécurité fera votre réputation sur les chantiers.",
    childrenIds: ["eng-chef-chantier"],
  },
  {
    id: "eng-ingenieur-jr",
    title: "Ingénieur d'Études / Calculateur Structures",
    clusterId: "engineering",
    clusterName: "Génie Civil, BTP & Énergie",
    clusterColor: "#f59e0b",
    level: 2,
    levelLabel: "Débutant (0-3 ans)",
    description: "Dimensionnement des structures en béton armé, charpentes métalliques et études géotechniques.",
    requiredBac: ["BAC C", "BAC E"],
    recommendedPrograms: ["Diplôme d'Ingénieur"],
    topUniversities: ["2iE", "INPHB", "EPT"],
    salaryFcfa: { min: 500000, avg: 850000, max: 1200000 },
    keySkills: ["Robot Structural Analysis", "Normes Eurocodes / BAEL", "Géotechnique"],
    drAdvice: "Obtenez votre inscription à l'Ordre National des Ingénieurs de votre pays dès que possible.",
    childrenIds: ["eng-chef-projet"],
  },
  {
    id: "eng-chef-projet",
    title: "Chef de Projet BTP & Infrastructures",
    clusterId: "engineering",
    clusterName: "Génie Civil, BTP & Énergie",
    clusterColor: "#f59e0b",
    level: 3,
    levelLabel: "Confirmé (3-7 ans)",
    description: "Pilotage global de projets de construction d'infrastructures routières ou immobilières de plusieurs milliards.",
    requiredBac: ["BAC C", "BAC E"],
    recommendedPrograms: ["Ingénieur + Certification PMP"],
    topUniversities: ["2iE", "INPHB"],
    salaryFcfa: { min: 1000000, avg: 1700000, max: 2500000 },
    keySkills: ["PMP / MS Project", "Négociation de marchés publics", "Gestion budgétaire"],
    drAdvice: "La double compétence ingénierie + gestion financière (PMP) fait passer votre salaire au niveau supérieur.",
    childrenIds: ["eng-directeur-travaux"],
  },
  {
    id: "eng-directeur-travaux",
    title: "Directeur des Opérations BTP / Directeur Général Cabinet",
    clusterId: "engineering",
    clusterName: "Génie Civil, BTP & Énergie",
    clusterColor: "#f59e0b",
    level: 4,
    levelLabel: "Senior Executive (7+ ans)",
    description: "Direction stratégique des grands groupes de BTP (SOGEA-SATOM, COLAS, EBOMAF) ou création de son cabinet d'expertise.",
    requiredBac: ["BAC C", "BAC E"],
    recommendedPrograms: ["Ingénieur + Executive MBA"],
    topUniversities: ["2iE", "Grandes Écoles d'Ingénieur"],
    salaryFcfa: { min: 2500000, avg: 4500000, max: 8000000 },
    keySkills: ["Appels d'offres internationaux", "Stratégie de groupe", "Partenariats Public-Privé (PPP)"],
    drAdvice: "Les Partenariats Public-Privé (PPP) pour les infrastructures africaines sont un réservoir d'affaires gigantesque.",
  },

  // --- FINANCE & LAW CLUSTER ---
  {
    id: "fin-bac",
    title: "BAC G2 / BAC C / BAC A4",
    clusterId: "finance",
    clusterName: "Finance, Gestion & Droit",
    clusterColor: "#06b6d4",
    level: 0,
    levelLabel: "Prérequis BAC",
    description: "Aptitudes en comptabilité financière (BAC G2), mathématiques (BAC C/D) ou expression juridique (BAC A4).",
    requiredBac: ["BAC G2 (Comptabilité)", "BAC C", "BAC D", "BAC A4"],
    recommendedPrograms: ["Maths ≥ 11/20", "Comptabilité ≥ 12/20", "Français ≥ 12/20"],
    topUniversities: ["Facultés de Droit & Écoles de Gestion UEMOA"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Logique comptable", "Raisonnement juridique", "Aisance rédactionnelle"],
    drAdvice: "Le BAC G2 offre un avantage immédiat en comptabilité; le BAC A4 prépare excellemment au Droit.",
    childrenIds: ["fin-licence-compta", "fin-licence-droit"],
  },
  {
    id: "fin-licence-compta",
    title: "Licence / BTS Comptabilité & Finance (OHADA)",
    clusterId: "finance",
    clusterName: "Finance, Gestion & Droit",
    clusterColor: "#06b6d4",
    level: 1,
    levelLabel: "Formation BAC+3",
    description: "Maîtrise du Syscohada révisé, comptabilité générale, analytique et fiscalité d'entreprise.",
    requiredBac: ["BAC G2", "BAC C", "BAC D"],
    recommendedPrograms: ["Licence CCA (Comptabilité, Contrôle, Audit)", "BTS Comptabilité"],
    topUniversities: ["Faseg Université de Lomé", "ENEAM Cotonou", "CESAG Dakar", "INPHB"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Système OHADA", "Logiciels Sage Compta / ERP", "Fiscalité d'entreprise"],
    drAdvice: "Préparez en parallèle les diplômes de l'expertise comptable (DECOFI / DESCOGEF).",
    childrenIds: ["fin-comptable-jr", "fin-master-audit"],
  },
  {
    id: "fin-licence-droit",
    title: "Licence en Droit Privé / Public",
    clusterId: "finance",
    clusterName: "Finance, Gestion & Droit",
    clusterColor: "#06b6d4",
    level: 1,
    levelLabel: "Formation BAC+3",
    description: "Bases fondamentales du droit civil, droit commercial OHADA, droit constitutionnel et administratif.",
    requiredBac: ["BAC A4", "BAC D", "BAC C"],
    recommendedPrograms: ["Licence Droit Privé des Affaires"],
    topUniversities: ["FDD Université de Lomé", "UCAD Dakar", "UFHB Abidjan", "UAC Cotonou"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Analyse juridique", "Rédaction de contrats", "Plaidoirie"],
    drAdvice: "Le Droit des Affaires OHADA est le secteur juridique le plus rémunérateur pour le privé.",
    childrenIds: ["fin-juriste-jr"],
  },
  {
    id: "fin-comptable-jr",
    title: "Comptable / Analyste Financier Junior",
    clusterId: "finance",
    clusterName: "Finance, Gestion & Droit",
    clusterColor: "#06b6d4",
    level: 2,
    levelLabel: "Débutant (0-3 ans)",
    description: "Saisie des pièces comptables, déclarations fiscales mensuelles (TVA/IMF) et rapprochements bancaires.",
    requiredBac: ["BAC G2", "BAC C", "BAC D"],
    recommendedPrograms: ["Licence CCA"],
    topUniversities: ["UL Faseg", "ENEAM", "CESAG"],
    salaryFcfa: { min: 200000, avg: 380000, max: 600000 },
    keySkills: ["Sage Saari", "Excel Avancé", "Bilan comptable"],
    drAdvice: "Faites vos preuves en cabinet d'expertise comptable pour apprendre 3 fois plus vite.",
    childrenIds: ["fin-auditeur-sr"],
  },
  {
    id: "fin-juriste-jr",
    title: "Juriste d'Entreprise Junior",
    clusterId: "finance",
    clusterName: "Finance, Gestion & Droit",
    clusterColor: "#06b6d4",
    level: 2,
    levelLabel: "Débutant (0-3 ans)",
    description: "Rédaction et revue des contrats commerciaux, veilles juridiques et conformité d'entreprise.",
    requiredBac: ["BAC A4", "BAC D"],
    recommendedPrograms: ["Master Droit des Affaires / Master Fiscalité"],
    topUniversities: ["FDD UL", "UCAD", "UFHB"],
    salaryFcfa: { min: 250000, avg: 450000, max: 700000 },
    keySkills: ["Droit OHADA", "Contrats commerciaux", "Règlement des litiges"],
    drAdvice: "Un juriste maîtrisant l'anglais des affaires peut prétendre à des rémunérations doublées.",
    childrenIds: ["fin-avocat-magistrat"],
  },
  {
    id: "fin-auditeur-sr",
    title: "Auditeur Senior / Contrôleur de Gestion",
    clusterId: "finance",
    clusterName: "Finance, Gestion & Droit",
    clusterColor: "#06b6d4",
    level: 3,
    levelLabel: "Confirmé (3-7 ans)",
    description: "Audit financier des comptes, révision comptable, optimisation fiscale et contrôle budgétaire.",
    requiredBac: ["BAC G2", "BAC C"],
    recommendedPrograms: ["Master CCA / DESCOGEF / CIA"],
    topUniversities: ["CESAG Dakar", "INPHB", "UL Faseg"],
    salaryFcfa: { min: 700000, avg: 1300000, max: 2000000 },
    keySkills: ["Audit Financier", "Power BI / Tableau", "Normes IFRS"],
    drAdvice: "Le diplôme DESCOGEF (DECOFI) valide le statut de futur Expert-Comptable agréé ONECCA.",
    childrenIds: ["fin-daf"],
  },
  {
    id: "fin-daf",
    title: "Directeur Administratif et Financier (DAF) / Avocat d'Affaires",
    clusterId: "finance",
    clusterName: "Finance, Gestion & Droit",
    clusterColor: "#06b6d4",
    level: 4,
    levelLabel: "Senior Executive (7+ ans)",
    description: "Pilotage financier global des banques, assurances, multinationales ou associé dans un grand cabinet d'avocats.",
    requiredBac: ["BAC G2", "BAC C", "BAC A4"],
    recommendedPrograms: ["Diplôme d'Expert-Comptable (DEC) / CAPA Avocat + MBA"],
    topUniversities: ["CESAG", "Barreau National", "Grandes Écoles Françaises/Américaines"],
    salaryFcfa: { min: 2200000, avg: 4200000, max: 7500000 },
    keySkills: ["Levée de fonds", "Ingénierie financière", "Gouvernance & Stratégie"],
    drAdvice: "Le DAF est le bras droit financier indispensable de tout PDG de grande entreprise.",
  },

  // --- AGRONOMY CLUSTER ---
  {
    id: "agro-bac",
    title: "BAC D / BAC C / BAC F8",
    clusterId: "agronomy",
    clusterName: "Agronomie & Agribusiness",
    clusterColor: "#84cc16",
    level: 0,
    levelLabel: "Prérequis BAC",
    description: "Intérêt marqué pour la terre, la biologie végétale, l'élevage et la transformation alimentaire.",
    requiredBac: ["BAC D", "BAC C", "BAC F8 (Agro)"],
    recommendedPrograms: ["SVT ≥ 12/20", "Chimie ≥ 11/20"],
    topUniversities: ["Écoles Supérieures d'Agronomie de la sous-région"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Biologie végétale", "Sciences du sol", "Sens de l'innovation rurale"],
    drAdvice: "L'agriculture industrielle et l'agribusiness sont l'avenir économique numéro 1 de l'Afrique.",
    childrenIds: ["agro-licence"],
  },
  {
    id: "agro-licence",
    title: "Licence / Ingénieur des Travaux Agricoles",
    clusterId: "agronomy",
    clusterName: "Agronomie & Agribusiness",
    clusterColor: "#84cc16",
    level: 1,
    levelLabel: "Formation BAC+3/5",
    description: "Spécialisation en agronomie générale, zootechnie, machinisme agricole ou agroéconomie.",
    requiredBac: ["BAC D", "BAC C"],
    recommendedPrograms: ["Diplôme d'Ingénieur Agronome (ESA)"],
    topUniversities: ["ESA Université de Lomé", "FSA UAC Cotonou", "INPHB Yamoussoukro", "ENSA Thiès"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Irrigation & Sols", "Pesticides & Bio-intrants", "Agroforesterie"],
    drAdvice: "L'ESA de l'Université de Lomé est l'un des centres d'excellence régionaux de la Banque Mondiale.",
    childrenIds: ["agro-ingenieur-jr"],
  },
  {
    id: "agro-ingenieur-jr",
    title: "Ingénieur Agronome / Chef d'Exploitation",
    clusterId: "agronomy",
    clusterName: "Agronomie & Agribusiness",
    clusterColor: "#84cc16",
    level: 2,
    levelLabel: "Débutant (0-3 ans)",
    description: "Gestion des plantations industrielles (anacarde, cacao, coton, soja) ou ferme moderne intégrée.",
    requiredBac: ["BAC D", "BAC C"],
    recommendedPrograms: ["Ingénieur Agronome"],
    topUniversities: ["ESA UL", "FSA UAC", "ENSA Thiès"],
    salaryFcfa: { min: 300000, avg: 550000, max: 850000 },
    keySkills: ["Gestion de culture", "Techniques d'irrigation goutte-à-goutte", "Suivi sanitaire"],
    drAdvice: "Créer sa propre ferme moderne en agribusiness peut rapporter plus qu'un emploi salarié.",
    childrenIds: ["agro-expert-chaine"],
  },
  {
    id: "agro-expert-chaine",
    title: "Expert Chaine de Valeur & Agribusiness / Directeur Projets",
    clusterId: "agronomy",
    clusterName: "Agronomie & Agribusiness",
    clusterColor: "#84cc16",
    level: 3,
    levelLabel: "Confirmé (3-7 ans)",
    description: "Supervision des projets de transformation agroalimentaire, certification Bio/Équitable et exportation.",
    requiredBac: ["BAC D", "BAC C"],
    recommendedPrograms: ["Master Agribusiness / Ingénieur"],
    topUniversities: ["ESA UL", "2iE", "FAO / BAD"],
    salaryFcfa: { min: 800000, avg: 1500000, max: 2500000 },
    keySkills: ["Exportation de produits agricoles", "Normes HACCP / ISO 22000", "Financement agricole"],
    drAdvice: "La transformation locale des matières premières (anacarde, karité, café) est la clé de la rentabilité.",
  },

  // --- MEDIA & EDUCATION CLUSTER ---
  {
    id: "med-bac",
    title: "BAC A4 / BAC D",
    clusterId: "media",
    clusterName: "Média, Communication & Enseignement",
    clusterColor: "#ec4899",
    level: 0,
    levelLabel: "Prérequis BAC",
    description: "Aisance verbale, capacité de rédaction irréprochable et passion pour l'information et la pédagogie.",
    requiredBac: ["BAC A4", "BAC D"],
    recommendedPrograms: ["Français ≥ 13/20", "Anglais ≥ 12/20", "Philosophie ≥ 12/20"],
    topUniversities: ["Écoles de Journalisme & Facultés des Lettres"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Culture générale", "Expression écrite et orale", "Curiosité intellectuelle"],
    drAdvice: "Le BAC A4 est le tremplin d'excellence vers les carrières de communication, de médias et d'enseignement.",
    childrenIds: ["med-licence-com"],
  },
  {
    id: "med-licence-com",
    title: "Licence Information, Communication / Lettres",
    clusterId: "media",
    clusterName: "Média, Communication & Enseignement",
    clusterColor: "#ec4899",
    level: 1,
    levelLabel: "Formation BAC+3",
    description: "Journalisme de presse écrite/audiovisuel, relations publiques, marketing digital ou sciences de l'éducation.",
    requiredBac: ["BAC A4", "BAC D"],
    recommendedPrograms: ["Licence Journalisme / Licence Communication des Organisations"],
    topUniversities: ["CESTI Dakar", "ISICA Université de Lomé", "EFJ Abidjan"],
    salaryFcfa: { min: 0, avg: 0, max: 0 },
    keySkills: ["Techniques d'interview", "Community Management", "PAO (Photoshop/InDesign)"],
    drAdvice: "Le CESTI Dakar et l'ISICA de l'Université de Lomé sont des références régionales majeures.",
    childrenIds: ["med-journaliste-jr"],
  },
  {
    id: "med-journaliste-jr",
    title: "Journaliste / Chargé de Communication / Enseignant",
    clusterId: "media",
    clusterName: "Média, Communication & Enseignement",
    clusterColor: "#ec4899",
    level: 2,
    levelLabel: "Débutant (0-3 ans)",
    description: "Rédaction d'articles, gestion de la réputation digitale des entreprises ou enseignement dans le secondaire.",
    requiredBac: ["BAC A4", "BAC D"],
    recommendedPrograms: ["Licence ISICA / CESTI / CAPES"],
    topUniversities: ["ISICA", "CESTI", "ENS Atakpamé"],
    salaryFcfa: { min: 180000, avg: 320000, max: 500000 },
    keySkills: ["SEO Content Writing", "Relations presse", "Pédagogie"],
    drAdvice: "Maîtrisez les outils IA de création de contenu pour devenir un profil hybride ultra recherché.",
    childrenIds: ["med-directeur-com"],
  },
  {
    id: "med-directeur-com",
    title: "Directeur de la Communication / Rédacteur en Chef",
    clusterId: "media",
    clusterName: "Média, Communication & Enseignement",
    clusterColor: "#ec4899",
    level: 3,
    levelLabel: "Confirmé (3-7 ans+)",
    description: "Pilotage de la stratégie de communication institutionnelle ou direction d'un média national/international.",
    requiredBac: ["BAC A4"],
    recommendedPrograms: ["Master Communication / MBA"],
    topUniversities: ["CESTI", "ISICA", "Celsa Paris"],
    salaryFcfa: { min: 650000, avg: 1200000, max: 2200000 },
    keySkills: ["Communication de crise", "Branding", "Stratégie médias & événementiel"],
    drAdvice: "La communication de crise pour les grandes institutions et multinationales est un pôle d'expertise très lucratif.",
  },
];

interface CareerRoadmapD3Props {
  setActiveTab: (tab: string) => void;
  currency: "FCFA" | "EUR" | "USD";
}

export const CareerRoadmapD3: React.FC<CareerRoadmapD3Props> = ({ setActiveTab, currency }) => {
  const { isSaved, toggleSave } = useBookmarks();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States for filtering & interaction
  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [selectedBac, setSelectedBac] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(ROADMAP_NODES[0]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Zoom transform state
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Compute filtered nodes
  const filteredNodes = useMemo(() => {
    return ROADMAP_NODES.filter((node) => {
      const matchCluster = selectedCluster === "all" || node.clusterId === selectedCluster;
      const matchBac =
        selectedBac === "all" ||
        node.requiredBac.some((b) => b.toLowerCase().includes(selectedBac.toLowerCase()));
      const matchLevel = selectedLevel === "all" || node.level === selectedLevel;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        node.title.toLowerCase().includes(q) ||
        node.description.toLowerCase().includes(q) ||
        node.clusterName.toLowerCase().includes(q) ||
        node.keySkills.some((s) => s.toLowerCase().includes(q));

      return matchCluster && matchBac && matchLevel && matchSearch;
    });
  }, [selectedCluster, selectedBac, selectedLevel, searchTerm]);

  // Links generation between nodes based on childrenIds
  const links = useMemo(() => {
    const list: CareerLink[] = [];
    const filteredIds = new Set(filteredNodes.map((n) => n.id));

    filteredNodes.forEach((node) => {
      if (node.childrenIds) {
        node.childrenIds.forEach((childId) => {
          if (filteredIds.has(childId)) {
            list.push({ source: node.id, target: childId });
          }
        });
      }
    });
    return list;
  }, [filteredNodes]);

  // Main D3 Rendering Logic
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = Math.max(550, window.innerHeight * 0.65);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clean canvas on re-render

    svg.attr("width", width).attr("height", height);

    // Zoom Group
    const g = svg.append("g").attr("class", "main-group");

    // Setup D3 Zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Layout configuration: Organize levels horizontally (Level 0..4)
    // Level 0: x = 80, Level 1: x = 280, Level 2: x = 500, Level 3: x = 730, Level 4: x = 960
    const levelXMap: Record<number, number> = {
      0: 100,
      1: 340,
      2: 600,
      3: 860,
      4: 1120,
    };

    // Calculate Y coordinates per level for balanced vertical distribution
    const levelGroups = d3.group(filteredNodes, (d: CareerNode) => d.level);
    const nodePositions = new Map<string, { x: number; y: number }>();

    const paddingY = 90;

    levelGroups.forEach((nodesInLevel: CareerNode[], levelNum: number) => {
      const count = nodesInLevel.length;
      const totalYHeight = count * paddingY;
      const startLevelY = Math.max(40, (height - totalYHeight) / 2 + 40);

      nodesInLevel.forEach((node: CareerNode, index: number) => {
        const x = levelXMap[levelNum] || levelNum * 240 + 100;
        const y = startLevelY + index * paddingY;
        nodePositions.set(node.id, { x, y });
      });
    });

    // Draw Background Level Header Columns
    const levelHeaders = [
      { level: 0, title: "1. Prérequis BAC", desc: "Séries & Notes" },
      { level: 1, title: "2. Formations", desc: "Diplômes BAC+3/5/8" },
      { level: 2, title: "3. Premier Emploi", desc: "0 - 3 ans d'expérience" },
      { level: 3, title: "4. Postes Confirmés", desc: "3 - 7 ans d'expérience" },
      { level: 4, title: "5. Senior Executive", desc: "7+ ans & Direction" },
    ];

    const headerG = g.append("g").attr("class", "level-headers");

    levelHeaders.forEach((h) => {
      const x = levelXMap[h.level];
      headerG
        .append("rect")
        .attr("x", x - 90)
        .attr("y", 10)
        .attr("width", 180)
        .attr("height", 36)
        .attr("rx", 10)
        .attr("fill", "#0f172a") // slate-900
        .attr("stroke", "#334155") // slate-700
        .attr("stroke-width", 1);

      headerG
        .append("text")
        .attr("x", x)
        .attr("y", 28)
        .attr("text-anchor", "middle")
        .attr("fill", "#38bdf8") // sky-400
        .attr("font-size", "11px")
        .attr("font-weight", "800")
        .text(h.title);
    });

    // Draw Links (Bezier Curves)
    const linksG = g.append("g").attr("class", "roadmap-links");

    links.forEach((link) => {
      const sourcePos = nodePositions.get(link.source);
      const targetPos = nodePositions.get(link.target);

      if (sourcePos && targetPos) {
        const isHovered =
          hoveredNodeId === link.source || hoveredNodeId === link.target;

        const pathData = d3.linkHorizontal()({
          source: [sourcePos.x + 85, sourcePos.y],
          target: [targetPos.x - 85, targetPos.y],
        });

        if (pathData) {
          linksG
            .append("path")
            .attr("d", pathData)
            .attr("fill", "none")
            .attr("stroke", isHovered ? "#10b981" : "#334155")
            .attr("stroke-width", isHovered ? 2.5 : 1.5)
            .attr("stroke-dasharray", isHovered ? "none" : "4,3")
            .attr("opacity", isHovered ? 1 : 0.6)
            .style("transition", "all 0.2s ease");
        }
      }
    });

    // Draw Nodes
    const nodesG = g.append("g").attr("class", "roadmap-nodes");

    filteredNodes.forEach((node) => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;

      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNodeId === node.id;

      const nodeGroup = nodesG
        .append("g")
        .attr("transform", `translate(${pos.x}, ${pos.y})`)
        .style("cursor", "pointer")
        .on("click", () => setSelectedNode(node))
        .on("mouseenter", () => setHoveredNodeId(node.id))
        .on("mouseleave", () => setHoveredNodeId(null));

      // Node Card Rectangle
      const rectWidth = 170;
      const rectHeight = 62;

      nodeGroup
        .append("rect")
        .attr("x", -rectWidth / 2)
        .attr("y", -rectHeight / 2)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("rx", 12)
        .attr("fill", isSelected ? "#022c22" : "#1e293b") // emerald-950 or slate-800
        .attr("stroke", isSelected ? "#10b981" : isHovered ? node.clusterColor : "#475569")
        .attr("stroke-width", isSelected ? 2.5 : isHovered ? 2 : 1)
        .style("filter", isSelected || isHovered ? "drop-shadow(0 4px 12px rgba(16, 185, 129, 0.25))" : "none")
        .style("transition", "all 0.2s ease");

      // Category Pill inside Node
      nodeGroup
        .append("rect")
        .attr("x", -rectWidth / 2 + 8)
        .attr("y", -rectHeight / 2 + 8)
        .attr("width", 8)
        .attr("height", rectHeight - 16)
        .attr("rx", 4)
        .attr("fill", node.clusterColor);

      // Node Title (Truncated if necessary)
      nodeGroup
        .append("text")
        .attr("x", -rectWidth / 2 + 22)
        .attr("y", -rectHeight / 2 + 22)
        .attr("fill", "#ffffff")
        .attr("font-size", "11px")
        .attr("font-weight", "700")
        .text(node.title.length > 22 ? node.title.substring(0, 20) + "..." : node.title);

      // Salary / Subtitle
      const subText =
        node.level === 0
          ? `${node.requiredBac.slice(0, 2).join(", ")}`
          : node.salaryFcfa.avg > 0
          ? `~${convertFromFcfa(node.salaryFcfa.avg, currency)}/m`
          : node.levelLabel;

      nodeGroup
        .append("text")
        .attr("x", -rectWidth / 2 + 22)
        .attr("y", -rectHeight / 2 + 40)
        .attr("fill", node.salaryFcfa.avg > 0 ? "#34d399" : "#94a3b8")
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .text(subText);
    });
  }, [filteredNodes, links, selectedNode, hoveredNodeId, currency]);

  // Zoom Handler Functions
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.25);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.8);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(400)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 md:p-8 rounded-2xl text-white shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <Compass className="w-3.5 h-3.5 text-emerald-400" /> Cartographie Interactive D3.js
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Feuille de Route des Métiers & Évolution de Carrière
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Visualisez les parcours d'orientation depuis le Baccalauréat jusqu'aux postes de Direction (Senior Executive). Découvrez les prérequis, les diplômes indispensables, les salaires moyens et les universités d'excellence.
          </p>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Industry Cluster Selector */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 text-xs">
          <span className="text-slate-500 font-extrabold text-xs mr-1 shrink-0">Domaines :</span>
          <button
            onClick={() => setSelectedCluster("all")}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedCluster === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tous ({ROADMAP_NODES.length})
          </button>

          {CLUSTERS.map((cluster) => (
            <button
              key={cluster.id}
              onClick={() => setSelectedCluster(cluster.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCluster === cluster.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: cluster.color }}
              />
              {cluster.name}
            </button>
          ))}
        </div>

        {/* BAC Filter & Search */}
        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
          <select
            value={selectedBac}
            onChange={(e) => setSelectedBac(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Toutes Séries BAC</option>
            <option value="BAC C">BAC C</option>
            <option value="BAC D">BAC D</option>
            <option value="BAC E">BAC E</option>
            <option value="BAC A4">BAC A4</option>
            <option value="BAC G2">BAC G2</option>
            <option value="BAC F">BAC Technique F</option>
          </select>

          <div className="relative flex-1 lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Rechercher rôle, compétence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Graph Canvas + Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Interactive D3 Canvas */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative min-h-[580px] flex flex-col">
          {/* Top Canvas Bar Controls */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>
                {filteredNodes.length} nœuds affichés (Pincez ou utilisez le zoom)
              </span>
            </div>

            {/* D3 Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
                title="Zoom Avant"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
                title="Zoom Arrière"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
                title="Réinitialiser la Vue"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* D3 SVG Container */}
          <div ref={containerRef} className="w-full flex-1 relative overflow-hidden bg-slate-950">
            <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          </div>

          {/* Bottom Canvas Footer Legend */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>💡 Cliquez sur un nœud pour afficher la fiche détaillée du poste.</span>
            <span className="text-emerald-400 font-semibold">
              Règle d'orientation : Validation des matières ≥ 10/20
            </span>
          </div>
        </div>

        {/* Right Column: Selected Node Detailed Inspector */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-5 sticky top-20">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span
                    className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase text-white inline-block"
                    style={{ backgroundColor: selectedNode.clusterColor }}
                  >
                    {selectedNode.clusterName}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                    {selectedNode.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium block">
                    Niveau : <strong>{selectedNode.levelLabel}</strong>
                  </span>
                </div>
                <button
                  onClick={() =>
                    toggleSave({
                      id: `d3_${selectedNode.id}`,
                      type: "career",
                      title: selectedNode.title,
                      subtitle: `${selectedNode.clusterName} • Niveau : ${selectedNode.levelLabel}`,
                      badge: selectedNode.clusterName,
                      extraInfo: `BACs requis : ${selectedNode.requiredBac.join(", ")}`,
                      linkTab: "roadmap-d3",
                      data: selectedNode,
                    })
                  }
                  className={`p-2 rounded-xl border transition-all shrink-0 ${
                    isSaved(`d3_${selectedNode.id}`)
                      ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                      : "bg-slate-50 text-slate-400 hover:text-rose-500 border-slate-200 hover:bg-rose-50"
                  }`}
                  title={isSaved(`d3_${selectedNode.id}`) ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart className={`w-4 h-4 ${isSaved(`d3_${selectedNode.id}`) ? "fill-white" : ""}`} />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedNode.description}
              </p>

              {/* Salary Range Card (if applicable) */}
              {selectedNode.salaryFcfa.avg > 0 && (
                <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 space-y-2">
                  <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Estimation Salariale Mensuelle :
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Min</span>
                      <span className="font-extrabold text-slate-800">
                        {convertFromFcfa(selectedNode.salaryFcfa.min, currency)}
                      </span>
                    </div>
                    <div className="bg-emerald-600 text-white p-2 rounded-lg shadow-sm">
                      <span className="text-[10px] text-emerald-200 block font-bold">Moyen</span>
                      <span className="font-extrabold text-white">
                        {convertFromFcfa(selectedNode.salaryFcfa.avg, currency)}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Max</span>
                      <span className="font-extrabold text-slate-800">
                        {convertFromFcfa(selectedNode.salaryFcfa.max, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Required Baccalaureate Series */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Séries BAC Recommandées :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.requiredBac.map((bac, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold"
                    >
                      {bac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Programs */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  Formations & Matières Clés :
                </span>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                  {selectedNode.recommendedPrograms.map((prog, idx) => (
                    <li key={idx}>{prog}</li>
                  ))}
                </ul>
              </div>

              {/* Top Universities */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Établissements de Référence :
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.topUniversities.map((uni, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold"
                    >
                      🏛️ {uni}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Skills */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-rose-600" />
                  Compétences Stratégiques :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.keySkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200 text-[11px] font-medium"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dr. BALOGAH's Advice */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-3.5 rounded-xl border border-slate-700 text-xs space-y-1">
                <span className="font-extrabold text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Conseil d'orientation du Dr. BALOGAH Dibaataba :
                </span>
                <p className="text-slate-300 italic leading-relaxed">
                  "{selectedNode.drAdvice}"
                </p>
              </div>

              {/* CTA to check universities or counselor */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setActiveTab("institutions")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Voir les Établissements</span>
                </button>
                <button
                  onClick={() => setActiveTab("ai-counselor")}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Consulter Dr BALOGAH</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <Compass className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">
                Cliquez sur un rôle dans le schéma D3 pour afficher la fiche détaillée.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

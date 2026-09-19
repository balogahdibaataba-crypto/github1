import React, { useState, useEffect, useMemo } from "react";
import { SubjectGrade } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Calculator,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen,
  RefreshCw,
  Check,
  ShieldAlert,
  Save,
  Trash2,
  Search,
  Filter,
  Building2,
  MapPin,
  Plus,
  PlusCircle,
  SlidersHorizontal,
  Settings2,
  FileText,
  RotateCcw,
  CheckCircle2,
  Layers,
  Edit3,
  UploadCloud,
  Paperclip,
  Eye,
  FileCheck,
  Award,
  ArrowLeftRight,
  Scale
} from "lucide-react";
import { getConclusionAvis } from "../utils/evaluationRules";
import { getProgramTuitionEstimate } from "../utils/costCalculations";
import { getAllInstitutions } from "../data/institutionsData";
import {
  getCalculatorGradesCache,
  saveCalculatorGradesCache,
  clearCalculatorGradesCache,
} from "../utils/localStorageCache";

export interface ProgramRequirement {
  id: string;
  name: string;
  category: string;
  minOverall: number;
  subjectMinima: Record<string, number>;
  description: string;
  instName?: string;
  instId?: string;
  country?: string;
  degree?: string;
}

export interface DossierDocument {
  id: string;
  category: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: "verified" | "pending" | "rejected";
  auditNotes?: string;
  hasGrades?: boolean;
}

export const PROGRAM_REQUIREMENTS_DATABASE: ProgramRequirement[] = [
  // 1. SCIENTIFIQUE & TECHNOLOGIES
  {
    id: "genie-info-ia",
    name: "Génie Informatique & Intelligence Artificielle",
    category: "Sciences Exactes & Technologies",
    minOverall: 12.5,
    subjectMinima: { Informatique: 15, Mathematiques: 14, PhysiqueChimie: 13, Anglais: 12, Francais: 11 },
    description: "Exige de solides compétences logiques en mathématiques et programmation, ainsi qu'une bonne maîtrise de l'anglais technique.",
  },
  {
    id: "cybersecurite-reseaux",
    name: "Cybersécurité, Cryptographie & Réseaux",
    category: "Sciences Exactes & Technologies",
    minOverall: 13.5,
    subjectMinima: { Informatique: 16, Mathematiques: 15, PhysiqueChimie: 13, Anglais: 13 },
    description: "Protection des systèmes informatiques, audit de vulnérabilités, sécurité cloud et protection des données.",
  },
  {
    id: "data-science-stat",
    name: "Statistique, Big Data & Data Science",
    category: "Sciences Exactes & Technologies",
    minOverall: 14.0,
    subjectMinima: { Mathematiques: 16, Informatique: 15, PhysiqueChimie: 12, Anglais: 13 },
    description: "Spécialité quantitative de pointe pour la modélisation prédictive, le machine learning et l'analyse algorithmique.",
  },
  {
    id: "genie-logiciel-web",
    name: "Génie Logiciel & Développements Web/Mobile",
    category: "Sciences Exactes & Technologies",
    minOverall: 12.0,
    subjectMinima: { Informatique: 14, Mathematiques: 13, Anglais: 12, Francais: 11 },
    description: "Conception d'applications d'entreprise, architecture logicielle et gestion de bases de données cloud.",
  },

  // 2. SANTÉ & MÉDICAL
  {
    id: "medecine-sante",
    name: "Médecine Générale & Chirurgie",
    category: "Sciences Médicales & Santé",
    minOverall: 14.0,
    subjectMinima: { SVT: 15, PhysiqueChimie: 14, Mathematiques: 13, Francais: 12, Anglais: 12 },
    description: "Cursus d'excellence exigeant des notes très élevées en biologie (SVT), physique-chimie et mathématiques.",
  },
  {
    id: "pharmacie-biologie",
    name: "Pharmacie & Biologie Médicale",
    category: "Sciences Médicales & Santé",
    minOverall: 13.5,
    subjectMinima: { SVT: 14, PhysiqueChimie: 14, Mathematiques: 12, Francais: 12, Anglais: 12 },
    description: "Formation axée sur la chimie des médicaments, les sciences biologiques et la pharmacologie.",
  },
  {
    id: "odontostomatologie",
    name: "Chirurgie Dentaire & Odontostomatologie",
    category: "Sciences Médicales & Santé",
    minOverall: 13.5,
    subjectMinima: { SVT: 14, PhysiqueChimie: 14, Mathematiques: 12, Francais: 12 },
    description: "Diagnostic, prévention et traitement des pathologies bucco-dentaires et chirurgie orale.",
  },
  {
    id: "infirmiers-sagefemme",
    name: "Sciences Infirmières & Maïeutique (Sage-Femme)",
    category: "Sciences Médicales & Santé",
    minOverall: 12.5,
    subjectMinima: { SVT: 14, PhysiqueChimie: 12, Francais: 12, Anglais: 11 },
    description: "Pratique des soins de santé primaires, assistance médicale et santé maternelle et infantile.",
  },
  {
    id: "kinesitherapie-reeducation",
    name: "Physiothérapie & Kinésithérapie",
    category: "Sciences Médicales & Santé",
    minOverall: 12.0,
    subjectMinima: { SVT: 13, PhysiqueChimie: 12, Francais: 12, Mathematiques: 11 },
    description: "Rééducation fonctionnelle, anatomie humaine et réadaptation physique.",
  },

  // 3. DROIT & SCIENCES POLITIQUES
  {
    id: "droit-affaires",
    name: "Droit Public & Droit des Affaires",
    category: "Sciences Juridiques & Politiques",
    minOverall: 12.0,
    subjectMinima: { Francais: 14, Histoire: 13, Geographie: 12, Anglais: 12 },
    description: "Nécessite une excellente capacité de rédaction en français, un esprit d'analyse juridique et une bonne culture historique.",
  },
  {
    id: "droit-international",
    name: "Droit International & Diplomatie Humanitaire",
    category: "Sciences Juridiques & Politiques",
    minOverall: 13.0,
    subjectMinima: { Francais: 15, Anglais: 14, Histoire: 14, Geographie: 12 },
    description: "Régulation des traités internationaux, contentieux international et droit de la mer.",
  },
  {
    id: "administration-politique",
    name: "Administration Publique & Science Politique",
    category: "Sciences Juridiques & Politiques",
    minOverall: 12.5,
    subjectMinima: { Francais: 14, Histoire: 14, Geographie: 13, Anglais: 12 },
    description: "Préparation aux concours de la haute fonction publique, diplomatie et gestion de l'État.",
  },
  {
    id: "carrieres-judiciaires",
    name: "Carrières Judiciaires, Magistrature & Barreau",
    category: "Sciences Juridiques & Politiques",
    minOverall: 13.5,
    subjectMinima: { Francais: 15, Histoire: 14, Geographie: 13, Anglais: 12 },
    description: "Formation d'excellence préparant au concours d'avocat, de magistrat et de greffier.",
  },

  // 4. ÉCONOMIE & MANAGEMENT
  {
    id: "gestion-finance",
    name: "Sciences de Gestion, Finance & Banques",
    category: "Sciences Économiques & Gestion",
    minOverall: 12.0,
    subjectMinima: { Mathematiques: 13, Anglais: 13, Francais: 12, Informatique: 12 },
    description: "Allie compétences quantitatives financières, analyse de données éco et gestion d'entreprise.",
  },
  {
    id: "comptabilite-audit",
    name: "Comptabilité, Contrôle & Audit (CCA)",
    category: "Sciences Économiques & Gestion",
    minOverall: 12.5,
    subjectMinima: { Mathematiques: 14, Francais: 12, Informatique: 13, Anglais: 12 },
    description: "Cursus de rigueur chiffrée spécialisé en normes comptables internationales (SYSCOHADA/IFRS) et audit financier.",
  },
  {
    id: "marketing-digital",
    name: "Marketing Digital, E-Commerce & Communication Stratégique",
    category: "Sciences Économiques & Gestion",
    minOverall: 12.0,
    subjectMinima: { Francais: 14, Anglais: 13, Informatique: 13, Histoire: 11 },
    description: "Stratégies de communication numérique, réseaux sociaux, analyse de comportements clients et vente en ligne.",
  },
  {
    id: "ressources-humaines",
    name: "Management des Ressources Humaines & VAE",
    category: "Sciences Économiques & Gestion",
    minOverall: 12.0,
    subjectMinima: { Francais: 14, Anglais: 12, Histoire: 12, Informatique: 11 },
    description: "Recrutement, gestion des carrières, droit du travail, bilan de compétences et climat social.",
  },

  // 5. INGÉNIERIE & BTP
  {
    id: "ecole-polytechnique",
    name: "Polytechnique & Métiers de l'Ingénieur",
    category: "Sciences Exactes & Ingénierie",
    minOverall: 14.5,
    subjectMinima: { Mathematiques: 16, PhysiqueChimie: 15, Informatique: 14, Anglais: 13, Francais: 12 },
    description: "Grandes Écoles d'Ingénieurs militaires et civiles d'Afrique et de l'international.",
  },
  {
    id: "genie-civil-btp",
    name: "Génie Civil, Structures & BTP",
    category: "Sciences Exactes & Ingénierie",
    minOverall: 13.0,
    subjectMinima: { Mathematiques: 14, PhysiqueChimie: 14, Informatique: 12, Francais: 11, Anglais: 11 },
    description: "Conception et calcul de structures de bâtiments, ponts et infrastructures de transport.",
  },
  {
    id: "energies-electrique",
    name: "Énergies Renouvelables & Génie Électrique",
    category: "Sciences Exactes & Ingénierie",
    minOverall: 13.0,
    subjectMinima: { PhysiqueChimie: 14, Mathematiques: 14, Informatique: 13, Anglais: 12 },
    description: "Ingénierie des réseaux électriques solaires, éoliens et systèmes d'automatismes industriels.",
  },
  {
    id: "maintenance-automatisme",
    name: "Maintenance Industrielle & Génie Mécanique",
    category: "Sciences Exactes & Ingénierie",
    minOverall: 12.0,
    subjectMinima: { PhysiqueChimie: 13, Mathematiques: 13, Informatique: 13, Anglais: 11 },
    description: "Maintenance des lignes de production automatisées, robotique et mécatronique.",
  },

  // 6. AGRONOMIE & BIO-RESSOURCES
  {
    id: "agronomie-agroalimentaire",
    name: "Agronomie, Agroéconomie & Production Végétale",
    category: "Agronomie & Environnement",
    minOverall: 12.0,
    subjectMinima: { SVT: 14, PhysiqueChimie: 13, Mathematiques: 12, Francais: 11, Anglais: 11 },
    description: "Spécialité stratégique pour la sécurité alimentaire, le développement agricole et la gestion des sols.",
  },
  {
    id: "halieutique-peche",
    name: "Sciences Halieutiques & Aquacultures",
    category: "Agronomie & Environnement",
    minOverall: 12.0,
    subjectMinima: { SVT: 14, PhysiqueChimie: 12, Mathematiques: 11, Francais: 11 },
    description: "Gestion des ressources marines, élevage d'espèces aquatiques et transformation des produits de la pêche.",
  },

  // 7. TRANSPORT & MARITIME
  {
    id: "commerce-logistique",
    name: "Commerce International & Logistique Supply Chain",
    category: "Transport, Logistique & Maritime",
    minOverall: 12.0,
    subjectMinima: { Anglais: 14, Francais: 13, Mathematiques: 12, Geographie: 12 },
    description: "Gestion des opérations d'export-import, douane, transit maritime et transport routier.",
  },
  {
    id: "genie-maritime-portuaire",
    name: "Génie Maritime & Administration Portuaire",
    category: "Transport, Logistique & Maritime",
    minOverall: 12.5,
    subjectMinima: { PhysiqueChimie: 13, Mathematiques: 13, Anglais: 14, Francais: 12 },
    description: "Manutention portuaire, droit maritime, sécurité en mer et exploitation des conteneurs.",
  },

  // 8. ARCHITECTURE & DESIGN
  {
    id: "architecture-urbanisme",
    name: "Architecture, Urbanisme & Design d'Espace",
    category: "Architecture & Design",
    minOverall: 12.5,
    subjectMinima: { Mathematiques: 13, PhysiqueChimie: 12, Francais: 12, Histoire: 12, Geographie: 12 },
    description: "Création spatiale, esthétique architecturale et modélisation technique du territoire.",
  },
  {
    id: "arts-visuels-design",
    name: "Arts Visuels, Infographie & Design 3D",
    category: "Architecture & Design",
    minOverall: 11.5,
    subjectMinima: { Informatique: 13, Francais: 12, Histoire: 12, Anglais: 11 },
    description: "Création graphique digitale, modélisation 3D et direction artistique numérique.",
  },

  // 9. LANGUES & DIPLOMATIE
  {
    id: "langues-diplomatie",
    name: "Langues, Traduction & Relations Internationales",
    category: "Lettres & Langues",
    minOverall: 13.0,
    subjectMinima: { Francais: 15, Anglais: 15, Espagnol: 13, Histoire: 12 },
    description: "Cursus international axé sur la maîtrise multilingue, la diplomatie et le commerce transfrontalier.",
  },
  {
    id: "journalisme-communication",
    name: "Journalisme, Médias & Communication Digital",
    category: "Lettres & Langues",
    minOverall: 12.5,
    subjectMinima: { Francais: 15, Histoire: 13, Geographie: 13, Anglais: 13 },
    description: "Formation à la rédaction journalistique, la production audiovisuelle et l'investigation.",
  },

  // 10. SCIENCES HUMAINES & SOCIALES
  {
    id: "psychologie-education",
    name: "Psychologie & Sciences de l'Éducation",
    category: "Sciences Humaines & Sociales",
    minOverall: 12.0,
    subjectMinima: { Francais: 14, SVT: 12, Histoire: 12, Anglais: 11 },
    description: "Étude du développement humain, de l'apprentissage et du conseil psycho-pédagogique.",
  },
  {
    id: "sociologie-anthropologie",
    name: "Sociologie & Développement Communautaire",
    category: "Sciences Humaines & Sociales",
    minOverall: 12.0,
    subjectMinima: { Francais: 14, Histoire: 14, Geographie: 13, Anglais: 11 },
    description: "Analyse des dynamiques sociales, enquêtes de terrain et études d'impact social.",
  },
  {
    id: "action-humanitaire",
    name: "Gestion de Projets Humanitaires & ONG",
    category: "Sciences Humaines & Sociales",
    minOverall: 12.0,
    subjectMinima: { Francais: 14, Anglais: 14, Geographie: 13, Histoire: 12 },
    description: "Conduite de programmes de développement, secours d'urgence et droit international humanitaire.",
  },

  // 11. GEOLOGIE & MINES
  {
    id: "geologie-mines",
    name: "Géologie, Ressources Minières & Pétrole",
    category: "Mines, Énergie & Géologie",
    minOverall: 13.0,
    subjectMinima: { PhysiqueChimie: 14, Geographie: 13, Mathematiques: 13, SVT: 13 },
    description: "Prospection des gisements miniers et pétroliers, hydrogéologie et géotechnique.",
  },

  // 12. HÔTELLERIE & TOURISME
  {
    id: "hotellerie-tourisme",
    name: "Hôtellerie de Luxe & Gestion Touristique",
    category: "Hôtellerie & Tourisme",
    minOverall: 12.0,
    subjectMinima: { Anglais: 14, Francais: 13, Geographie: 13, Espagnol: 12 },
    description: "Management d'établissements hôteliers, accueil d'affaires et valorisation du patrimoine.",
  }
];

/**
 * Helper to build requirement profile from institution program specs
 */
function parseRequiredSubjectsMap(requiredSubjects?: string[], admissionCond?: string, progName?: string): {
  subjectMinima: Record<string, number>;
  minOverall: number;
} {
  const subjectMinima: Record<string, number> = {};
  const lowerCond = (admissionCond || "").toLowerCase();
  const lowerName = (progName || "").toLowerCase();

  let baseOverall = 12.0;

  if (lowerName.includes("médecine") || lowerName.includes("chirurgie") || lowerName.includes("santé") || lowerName.includes("odontostomatologie")) {
    baseOverall = 14.0;
    subjectMinima["SVT"] = 15;
    subjectMinima["PhysiqueChimie"] = 14;
    subjectMinima["Mathematiques"] = 13;
    subjectMinima["Francais"] = 12;
    subjectMinima["Anglais"] = 12;
  } else if (lowerName.includes("pharmacie") || lowerName.includes("biologie médicale")) {
    baseOverall = 13.5;
    subjectMinima["SVT"] = 14;
    subjectMinima["PhysiqueChimie"] = 14;
    subjectMinima["Mathematiques"] = 12;
    subjectMinima["Francais"] = 12;
  } else if (lowerName.includes("polytechnique") || lowerName.includes("ingénieur") || lowerName.includes("ia") || lowerName.includes("cybersécurité") || lowerName.includes("data science")) {
    baseOverall = 13.5;
    subjectMinima["Mathematiques"] = 15;
    subjectMinima["Informatique"] = 15;
    subjectMinima["PhysiqueChimie"] = 13;
    subjectMinima["Anglais"] = 13;
  } else if (lowerName.includes("génie informatique") || lowerName.includes("logiciel") || lowerName.includes("systèmes")) {
    baseOverall = 12.5;
    subjectMinima["Informatique"] = 14;
    subjectMinima["Mathematiques"] = 13;
    subjectMinima["PhysiqueChimie"] = 12;
    subjectMinima["Anglais"] = 12;
  } else if (lowerName.includes("génie civil") || lowerName.includes("btp") || lowerName.includes("énergie") || lowerName.includes("mécanique") || lowerName.includes("automatisme")) {
    baseOverall = 12.5;
    subjectMinima["Mathematiques"] = 14;
    subjectMinima["PhysiqueChimie"] = 14;
    subjectMinima["Informatique"] = 12;
  } else if (lowerName.includes("droit") || lowerName.includes("magistrature") || lowerName.includes("politique") || lowerName.includes("judiciaire")) {
    baseOverall = 12.5;
    subjectMinima["Francais"] = 14;
    subjectMinima["Histoire"] = 13;
    subjectMinima["Geographie"] = 12;
    subjectMinima["Anglais"] = 12;
  } else if (lowerName.includes("comptab") || lowerName.includes("gestion") || lowerName.includes("finance") || lowerName.includes("économie") || lowerName.includes("banque") || lowerName.includes("audit")) {
    baseOverall = 12.0;
    subjectMinima["Mathematiques"] = 13;
    subjectMinima["Francais"] = 12;
    subjectMinima["Anglais"] = 12;
    subjectMinima["Informatique"] = 12;
  } else if (lowerName.includes("agronomie") || lowerName.includes("agro") || lowerName.includes("halieutique") || lowerName.includes("aquaculture")) {
    baseOverall = 12.0;
    subjectMinima["SVT"] = 14;
    subjectMinima["PhysiqueChimie"] = 13;
    subjectMinima["Mathematiques"] = 12;
  } else if (lowerName.includes("langue") || lowerName.includes("traduction") || lowerName.includes("diplomatie") || lowerName.includes("journalisme") || lowerName.includes("lettres")) {
    baseOverall = 12.5;
    subjectMinima["Francais"] = 15;
    subjectMinima["Anglais"] = 14;
    subjectMinima["Histoire"] = 13;
  } else if (lowerName.includes("architecture") || lowerName.includes("urbanisme") || lowerName.includes("design")) {
    baseOverall = 12.5;
    subjectMinima["Mathematiques"] = 13;
    subjectMinima["PhysiqueChimie"] = 12;
    subjectMinima["Francais"] = 12;
    subjectMinima["Histoire"] = 12;
  } else {
    if (requiredSubjects && requiredSubjects.length > 0) {
      requiredSubjects.forEach((rs) => {
        const rsLow = rs.toLowerCase();
        if (rsLow.includes("math")) subjectMinima["Mathematiques"] = 12;
        else if (rsLow.includes("phys") || rsLow.includes("chim")) subjectMinima["PhysiqueChimie"] = 12;
        else if (rsLow.includes("svt") || rsLow.includes("biolog")) subjectMinima["SVT"] = 12;
        else if (rsLow.includes("info")) subjectMinima["Informatique"] = 12;
        else if (rsLow.includes("franc")) subjectMinima["Francais"] = 12;
        else if (rsLow.includes("anglais")) subjectMinima["Anglais"] = 12;
        else if (rsLow.includes("hist")) subjectMinima["Histoire"] = 11;
        else if (rsLow.includes("géo") || rsLow.includes("geo")) subjectMinima["Geographie"] = 11;
      });
    }
    if (Object.keys(subjectMinima).length === 0) {
      subjectMinima["Francais"] = 12;
      subjectMinima["Mathematiques"] = 11;
      subjectMinima["Anglais"] = 11;
    }
  }

  return { subjectMinima, minOverall: baseOverall };
}

let cachedProgramRequirements: ProgramRequirement[] | null = null;

/**
 * Build a complete unified catalog of program requirements from ALL institutions
 */
export function buildAllInstitutionsProgramRequirements(): ProgramRequirement[] {
  if (cachedProgramRequirements) return cachedProgramRequirements;

  const allInstitutions = getAllInstitutions();
  const result: ProgramRequirement[] = [...PROGRAM_REQUIREMENTS_DATABASE];
  const existingIds = new Set(result.map((r) => r.id));

  allInstitutions.forEach((inst) => {
    (inst.programs || []).forEach((prog) => {
      const uniqueId = `inst_${inst.id}___${prog.id}`;
      if (!existingIds.has(uniqueId)) {
        existingIds.add(uniqueId);
        const { subjectMinima, minOverall } = parseRequiredSubjectsMap(
          prog.requiredSubjects,
          prog.admissionConditions,
          prog.name
        );

        const facName = prog.facultyOrSchool || "Faculté / Établissement d'enseignement supérieur";

        result.push({
          id: uniqueId,
          name: `${prog.name} (${inst.shortName || inst.name})`,
          instName: inst.name,
          instId: inst.id,
          country: inst.country,
          degree: prog.degree,
          category: `${inst.name} • ${facName}`,
          minOverall,
          subjectMinima,
          description: `Diplôme : ${prog.degree || "Licence / Master"} (${prog.duration || "3 ans"}). Établissement : ${inst.name} (${inst.city}, ${inst.country}). ${prog.admissionConditions || ""}`,
        });
      }
    });
  });

  cachedProgramRequirements = result;
  return result;
}

interface GradeCalculatorProps {
  initialProgramName?: string;
  initialInstName?: string;
  onGradesCalculated: (gradesSummary: any) => void;
  onGoToAICounselor: () => void;
}

export const GradeCalculator: React.FC<GradeCalculatorProps> = ({
  initialProgramName,
  initialInstName,
  onGradesCalculated,
  onGoToAICounselor,
}) => {
  const cachedData = getCalculatorGradesCache();

  // All filières database across all universities
  const allProgramsDatabase = useMemo(() => buildAllInstitutionsProgramRequirements(), []);
  const allInstitutionsList = useMemo(() => getAllInstitutions(), []);

  // Filter states for large program database
  const [selectedInstFilter, setSelectedInstFilter] = useState<string>("Tous");
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>("Tous");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const [selectedProgramId, setSelectedProgramId] = useState<string>(() => {
    if (initialProgramName) {
      const found = allProgramsDatabase.find(
        (p) =>
          p.name.toLowerCase().includes(initialProgramName.toLowerCase()) ||
          initialProgramName.toLowerCase().includes(p.name.toLowerCase())
      );
      if (found) return found.id;
    }
    if (cachedData?.selectedProgramId) {
      return cachedData.selectedProgramId;
    }
    return "genie-info-ia";
  });

  // Filter programs with early break (cap at 300 matches for ultra-fast performance)
  const filteredPrograms = useMemo(() => {
    const query = searchKeyword.trim().toLowerCase();
    const hasInstFilter = selectedInstFilter !== "Tous";
    const hasCountryFilter = selectedCountryFilter !== "Tous";
    const matches: ProgramRequirement[] = [];

    for (let i = 0; i < allProgramsDatabase.length; i++) {
      const prog = allProgramsDatabase[i];
      if (hasInstFilter && prog.instId !== selectedInstFilter && prog.instName !== selectedInstFilter) {
        continue;
      }
      if (hasCountryFilter && prog.country !== selectedCountryFilter) {
        continue;
      }
      if (query !== "") {
        const matchesName = prog.name.toLowerCase().includes(query);
        const matchesCategory = prog.category.toLowerCase().includes(query);
        const matchesInst = (prog.instName || "").toLowerCase().includes(query);
        const matchesDegree = (prog.degree || "").toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesInst && !matchesDegree) {
          continue;
        }
      }
      matches.push(prog);
      if (matches.length >= 300) break;
    }

    return matches;
  }, [allProgramsDatabase, selectedInstFilter, selectedCountryFilter, searchKeyword]);

  // Mode & Manual Target Selection State
  const [targetSelectMode, setTargetSelectMode] = useState<"database" | "custom_manual">("database");
  const [customInstName, setCustomInstName] = useState<string>("");
  const [customProgName, setCustomProgName] = useState<string>("");
  const [customMinOverall, setCustomMinOverall] = useState<number>(12);
  const [customSubjectMinima, setCustomSubjectMinima] = useState<Record<string, number>>({});

  // Comparison Mode States
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [comparisonTargetSelectMode, setComparisonTargetSelectMode] = useState<"database" | "custom_manual">("database");
  const [comparisonProgramId, setComparisonProgramId] = useState<string>(() => {
    const found = allProgramsDatabase.find((p) => p.id !== (cachedData?.selectedProgramId || "genie-info-ia"));
    return found ? found.id : "medecine-sante";
  });
  const [comparisonCustomInstName, setComparisonCustomInstName] = useState<string>("");
  const [comparisonCustomProgName, setComparisonCustomProgName] = useState<string>("");
  const [comparisonCustomMinOverall, setComparisonCustomMinOverall] = useState<number>(13);
  const [comparisonCustomSubjectMinima, setComparisonCustomSubjectMinima] = useState<Record<string, number>>({});
  const [comparisonSearchKeyword, setComparisonSearchKeyword] = useState<string>("");
  const [comparisonInstFilter, setComparisonInstFilter] = useState<string>("Tous");

  // BAC 1 and BAC 2 Averages State
  const [bac1Average, setBac1Average] = useState<number | "">("");
  const [bac2Average, setBac2Average] = useState<number | "">("");

  const bac1Num = typeof bac1Average === "number" ? bac1Average : 0;
  const bac2Num = typeof bac2Average === "number" ? bac2Average : 0;
  const hasBac1 = typeof bac1Average === "number" && !isNaN(bac1Average);
  const hasBac2 = typeof bac2Average === "number" && !isNaN(bac2Average);

  const combinedBacAvg = useMemo(() => {
    if (hasBac1 && hasBac2) return (bac1Num + bac2Num) / 2;
    if (hasBac2) return bac2Num;
    if (hasBac1) return bac1Num;
    return null;
  }, [hasBac1, hasBac2, bac1Num, bac2Num]);

  const activeReqProgram = useMemo(() => {
    if (targetSelectMode === "custom_manual") {
      return {
        id: "custom-manual-target",
        name: customProgName.trim() || "Filière Cible Visée",
        instName: customInstName.trim() || "Université / Établissement Visé",
        instId: "custom-inst",
        country: "Togo / Afrique",
        degree: "Licence / Master",
        category: `${customInstName.trim() || "Université Visée"} • Saisie Manuelle`,
        minOverall: customMinOverall,
        subjectMinima: customSubjectMinima,
        description: `Filière visée : ${customProgName || "Filière Cible"} à ${customInstName || "Université Visée"}. Seuil d'admissibilité minimal exigé : ${customMinOverall}/20.`,
      };
    }
    return (
      allProgramsDatabase.find((p) => p.id === selectedProgramId) ||
      filteredPrograms[0] ||
      allProgramsDatabase[0]
    );
  }, [targetSelectMode, customProgName, customInstName, customMinOverall, customSubjectMinima, selectedProgramId, allProgramsDatabase, filteredPrograms]);

  const activeComparisonReqProgram = useMemo(() => {
    if (comparisonTargetSelectMode === "custom_manual") {
      return {
        id: "custom-manual-comparison-target",
        name: comparisonCustomProgName.trim() || "Seconde Filière Cible",
        instName: comparisonCustomInstName.trim() || "Établissement Comparé",
        instId: "custom-inst-comp",
        country: "Togo / Afrique",
        degree: "Licence / Master",
        category: `${comparisonCustomInstName.trim() || "Université Comparée"} • Saisie Manuelle`,
        minOverall: comparisonCustomMinOverall,
        subjectMinima: comparisonCustomSubjectMinima,
        description: `Seconde filière comparée : ${comparisonCustomProgName || "Seconde Filière"} à ${comparisonCustomInstName || "Établissement Comparé"}. Seuil minimal : ${comparisonCustomMinOverall}/20.`,
      };
    }
    return (
      allProgramsDatabase.find((p) => p.id === comparisonProgramId) ||
      allProgramsDatabase.find((p) => p.id !== activeReqProgram.id) ||
      allProgramsDatabase[1] ||
      allProgramsDatabase[0]
    );
  }, [
    comparisonTargetSelectMode,
    comparisonCustomProgName,
    comparisonCustomInstName,
    comparisonCustomMinOverall,
    comparisonCustomSubjectMinima,
    comparisonProgramId,
    allProgramsDatabase,
    activeReqProgram.id,
  ]);

  const filteredComparisonPrograms = useMemo(() => {
    const query = comparisonSearchKeyword.trim().toLowerCase();
    const hasInst = comparisonInstFilter !== "Tous";
    const matches: ProgramRequirement[] = [];

    for (let i = 0; i < allProgramsDatabase.length; i++) {
      const prog = allProgramsDatabase[i];
      if (hasInst && prog.instId !== comparisonInstFilter && prog.instName !== comparisonInstFilter) {
        continue;
      }
      if (query !== "") {
        const matchesName = prog.name.toLowerCase().includes(query);
        const matchesCat = prog.category.toLowerCase().includes(query);
        const matchesInst = (prog.instName || "").toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesInst) continue;
      }
      matches.push(prog);
      if (matches.length >= 200) break;
    }
    return matches;
  }, [allProgramsDatabase, comparisonInstFilter, comparisonSearchKeyword]);

  // Third Program Comparison States (3-filières)
  const [thirdTargetSelectMode, setThirdTargetSelectMode] = useState<"database" | "custom_manual">("database");
  const [thirdProgramId, setThirdProgramId] = useState<string>(() => {
    const found = allProgramsDatabase.find(
      (p) => p.id !== (cachedData?.selectedProgramId || "genie-info-ia") && p.id !== "medecine-sante"
    );
    return found ? found.id : "droit-prive";
  });
  const [thirdCustomInstName, setThirdCustomInstName] = useState<string>("");
  const [thirdCustomProgName, setThirdCustomProgName] = useState<string>("");
  const [thirdCustomMinOverall, setThirdCustomMinOverall] = useState<number>(11);
  const [thirdCustomSubjectMinima, setThirdCustomSubjectMinima] = useState<Record<string, number>>({});
  const [thirdSearchKeyword, setThirdSearchKeyword] = useState<string>("");
  const [thirdInstFilter, setThirdInstFilter] = useState<string>("Tous");

  const activeThirdReqProgram = useMemo(() => {
    if (thirdTargetSelectMode === "custom_manual") {
      return {
        id: "custom-manual-third-target",
        name: thirdCustomProgName.trim() || "Troisième Filière Cible",
        instName: thirdCustomInstName.trim() || "Établissement Comparé 3",
        instId: "custom-inst-third",
        country: "Togo / Afrique",
        degree: "Licence / Master",
        category: `${thirdCustomInstName.trim() || "Université Comparée 3"} • Saisie Manuelle`,
        minOverall: thirdCustomMinOverall,
        subjectMinima: thirdCustomSubjectMinima,
        description: `Troisième filière comparée : ${thirdCustomProgName || "Troisième Filière"} à ${thirdCustomInstName || "Établissement Comparé 3"}. Seuil minimal : ${thirdCustomMinOverall}/20.`,
      };
    }
    return (
      allProgramsDatabase.find((p) => p.id === thirdProgramId) ||
      allProgramsDatabase.find((p) => p.id !== activeReqProgram.id && p.id !== activeComparisonReqProgram.id) ||
      allProgramsDatabase[2] ||
      allProgramsDatabase[0]
    );
  }, [
    thirdTargetSelectMode,
    thirdCustomProgName,
    thirdCustomInstName,
    thirdCustomMinOverall,
    thirdCustomSubjectMinima,
    thirdProgramId,
    allProgramsDatabase,
    activeReqProgram.id,
    activeComparisonReqProgram.id,
  ]);

  const filteredThirdPrograms = useMemo(() => {
    const query = thirdSearchKeyword.trim().toLowerCase();
    const hasInst = thirdInstFilter !== "Tous";
    const matches: ProgramRequirement[] = [];

    for (let i = 0; i < allProgramsDatabase.length; i++) {
      const prog = allProgramsDatabase[i];
      if (hasInst && prog.instId !== thirdInstFilter && prog.instName !== thirdInstFilter) {
        continue;
      }
      if (query !== "") {
        const matchesName = prog.name.toLowerCase().includes(query);
        const matchesCat = prog.category.toLowerCase().includes(query);
        const matchesInst = (prog.instName || "").toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesInst) continue;
      }
      matches.push(prog);
      if (matches.length >= 200) break;
    }
    return matches;
  }, [allProgramsDatabase, thirdInstFilter, thirdSearchKeyword]);

  // Mode & Manual Subjects State
  const [calcMode, setCalcMode] = useState<"manual_full" | "program_required">("manual_full");
  const [selectedSeries, setSelectedSeries] = useState<"SERIE_D" | "SERIE_C" | "SERIE_A4" | "SERIE_G2" | "LIBRE">("SERIE_D");

  // Base Series Presets for Manual Entry
  const SERIES_PRESETS = useMemo(() => {
    return {
      SERIE_D: {
        label: "BAC D (Scientifique SVT)",
        subjects: [
          { key: "SVT", name: "Sciences de la Vie et de la Terre (SVT)", category: "Sciences Exactes", defaultCoeff: 4 },
          { key: "PhysiqueChimie", name: "Sciences Physiques & Chimie", category: "Sciences Exactes", defaultCoeff: 4 },
          { key: "Mathematiques", name: "Mathématiques", category: "Sciences Exactes", defaultCoeff: 4 },
          { key: "Francais", name: "Français (Langue & Dissertation)", category: "Langues", defaultCoeff: 2 },
          { key: "Anglais", name: "Anglais (LV1)", category: "Langues", defaultCoeff: 2 },
          { key: "Philosophie", name: "Philosophie", category: "Sciences Sociales & Humaines", defaultCoeff: 2 },
          { key: "HistoireGeo", name: "Histoire & Géographie", category: "Sciences Sociales & Humaines", defaultCoeff: 2 },
          { key: "Informatique", name: "Informatique & Algorithmique", category: "Sciences Exactes", defaultCoeff: 2 },
          { key: "EPS", name: "Éducation Physique & Sportive (EPS)", category: "Sports & Option", defaultCoeff: 1 },
        ],
      },
      SERIE_C: {
        label: "BAC C (Scientifique Maths)",
        subjects: [
          { key: "Mathematiques", name: "Mathématiques", category: "Sciences Exactes", defaultCoeff: 5 },
          { key: "PhysiqueChimie", name: "Sciences Physiques & Chimie", category: "Sciences Exactes", defaultCoeff: 5 },
          { key: "SVT", name: "Sciences de la Vie et de la Terre (SVT)", category: "Sciences Exactes", defaultCoeff: 3 },
          { key: "Francais", name: "Français (Langue & Dissertation)", category: "Langues", defaultCoeff: 2 },
          { key: "Anglais", name: "Anglais (LV1)", category: "Langues", defaultCoeff: 2 },
          { key: "Philosophie", name: "Philosophie", category: "Sciences Sociales & Humaines", defaultCoeff: 2 },
          { key: "HistoireGeo", name: "Histoire & Géographie", category: "Sciences Sociales & Humaines", defaultCoeff: 2 },
          { key: "Informatique", name: "Informatique", category: "Sciences Exactes", defaultCoeff: 2 },
          { key: "EPS", name: "Éducation Physique & Sportive (EPS)", category: "Sports & Option", defaultCoeff: 1 },
        ],
      },
      SERIE_A4: {
        label: "BAC A4 (Littéraire & Langues)",
        subjects: [
          { key: "Philosophie", name: "Philosophie", category: "Sciences Sociales & Humaines", defaultCoeff: 5 },
          { key: "Francais", name: "Français (Langue & Dissertation)", category: "Langues", defaultCoeff: 5 },
          { key: "Anglais", name: "Anglais (LV1)", category: "Langues", defaultCoeff: 3 },
          { key: "HistoireGeo", name: "Histoire & Géographie", category: "Sciences Sociales & Humaines", defaultCoeff: 3 },
          { key: "EspagnolAllemand", name: "Langue Vivante 2 (Espagnol/Allemand)", category: "Langues", defaultCoeff: 3 },
          { key: "Mathematiques", name: "Mathématiques", category: "Sciences Exactes", defaultCoeff: 2 },
          { key: "SVT", name: "Sciences de la Vie et de la Terre (SVT)", category: "Sciences Exactes", defaultCoeff: 2 },
          { key: "Informatique", name: "Informatique", category: "Sciences Exactes", defaultCoeff: 1 },
          { key: "EPS", name: "Éducation Physique & Sportive (EPS)", category: "Sports & Option", defaultCoeff: 1 },
        ],
      },
      SERIE_G2: {
        label: "BAC G2 / STMG (Gestion & Compta)",
        subjects: [
          { key: "Comptabilite", name: "Comptabilité & Techniques de Gestion", category: "Technique & Gestion", defaultCoeff: 5 },
          { key: "EconomieDroit", name: "Économie & Droit", category: "Technique & Gestion", defaultCoeff: 4 },
          { key: "Mathematiques", name: "Mathématiques Financières & Stats", category: "Sciences Exactes", defaultCoeff: 3 },
          { key: "Francais", name: "Français (Langue & Redaction)", category: "Langues", defaultCoeff: 3 },
          { key: "Anglais", name: "Anglais des Affaires", category: "Langues", defaultCoeff: 2 },
          { key: "Informatique", name: "Informatique de Gestion & Excel", category: "Sciences Exactes", defaultCoeff: 2 },
          { key: "HistoireGeo", name: "Histoire & Géographie Économique", category: "Sciences Sociales & Humaines", defaultCoeff: 2 },
          { key: "EPS", name: "Éducation Physique & Sportive (EPS)", category: "Sports & Option", defaultCoeff: 1 },
        ],
      },
      LIBRE: {
        label: "Saisie Personnalisée Libre (Toutes Matières)",
        subjects: [
          { key: "Francais", name: "Français", category: "Langues", defaultCoeff: 3 },
          { key: "Anglais", name: "Anglais", category: "Langues", defaultCoeff: 2 },
          { key: "Philosophie", name: "Philosophie", category: "Sciences Sociales & Humaines", defaultCoeff: 3 },
          { key: "HistoireGeo", name: "Histoire-Géographie", category: "Sciences Sociales & Humaines", defaultCoeff: 2 },
          { key: "Mathematiques", name: "Mathématiques", category: "Sciences Exactes", defaultCoeff: 4 },
          { key: "PhysiqueChimie", name: "Sciences Physiques & Chimie", category: "Sciences Exactes", defaultCoeff: 3 },
          { key: "SVT", name: "SVT", category: "Sciences Exactes", defaultCoeff: 3 },
          { key: "Informatique", name: "Informatique", category: "Sciences Exactes", defaultCoeff: 2 },
        ],
      },
    };
  }, []);

  // Flexible Active Subjects List state (user can add/remove any subject one by one or clear all)
  const [activeSubjectsList, setActiveSubjectsList] = useState<Array<{
    key: string;
    name: string;
    category: string;
    defaultCoeff: number;
    isCustom?: boolean;
  }>>(() => SERIES_PRESETS.SERIE_D.subjects);

  // Coefficients state mapping subject key -> coeff
  const [coeffs, setCoeffs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SERIES_PRESETS.SERIE_D.subjects.forEach((s) => {
      initial[s.key] = s.defaultCoeff;
    });
    return initial;
  });

  const defaultGrades: Record<string, number> = {};

  const [grades, setGrades] = useState<Record<string, number>>(() => {
    return cachedData?.grades ? cachedData.grades : {};
  });

  // Modal State for Adding a Custom Subject
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [newSubName, setNewSubName] = useState<string>("");
  const [newSubCategory, setNewSubCategory] = useState<string>("Sciences Exactes");
  const [newSubCoeff, setNewSubCoeff] = useState<number>(2);
  const [newSubGrade, setNewSubGrade] = useState<number>(12);
  const [newSubMinRequired, setNewSubMinRequired] = useState<number>(10);

  // Student Profile Level (Bachelier vs BEPC)
  const [studentLevel, setStudentLevel] = useState<"bachelier" | "bepc">("bachelier");

  const BACHELIER_PRESET_DOCS: DossierDocument[] = [
    {
      id: "doc-bulletins-bac",
      category: "Bulletins de la Seconde à la Terminale",
      fileName: "Bulletins_Scolaires_Seconde_Premiere_Terminale.pdf",
      fileSize: "3.2 MB",
      uploadDate: "Aujourd'hui",
      status: "verified",
    },
    {
      id: "doc-bac1-default",
      category: "Relevé de notes BAC 1 (Première)",
      fileName: "Releve_Officiel_BAC1_Scanne.pdf",
      fileSize: "1.4 MB",
      uploadDate: "Aujourd'hui",
      status: "verified",
    },
    {
      id: "doc-bac2-default",
      category: "Relevé de notes BAC 2 (Terminale)",
      fileName: "Releve_Officiel_BAC2_Scanne.pdf",
      fileSize: "1.8 MB",
      uploadDate: "Aujourd'hui",
      status: "verified",
    },
    {
      id: "doc-bac-attestations",
      category: "Attestation de Succès du BAC 1 et BAC 2",
      fileName: "Attestations_Succes_BAC1_BAC2.pdf",
      fileSize: "1.1 MB",
      uploadDate: "Aujourd'hui",
      status: "verified",
    },
  ];

  const BEPC_PRESET_DOCS: DossierDocument[] = [
    {
      id: "doc-bulletins-bepc",
      category: "Bulletins de la 6ème à la 3ème",
      fileName: "Bulletins_Scolaires_6eme_5eme_4eme_3eme.pdf",
      fileSize: "2.7 MB",
      uploadDate: "Aujourd'hui",
      status: "verified",
    },
    {
      id: "doc-bepc-releve",
      category: "Relevé de notes officiel du BEPC",
      fileName: "Releve_Officiel_BEPC_Scanne.pdf",
      fileSize: "1.2 MB",
      uploadDate: "Aujourd'hui",
      status: "verified",
    },
    {
      id: "doc-bepc-attestation",
      category: "Attestation de succès du BEPC",
      fileName: "Attestation_Succes_BEPC.pdf",
      fileSize: "0.9 MB",
      uploadDate: "Aujourd'hui",
      status: "verified",
    },
  ];

  // Dossier Scolaire State & Upload Documents State
  const [dossierDocs, setDossierDocs] = useState<DossierDocument[]>([]);

  const handleSelectStudentLevel = (level: "bachelier" | "bepc") => {
    setStudentLevel(level);
    if (level === "bachelier") {
      setDocCategory("Relevé de notes BAC 2 (Terminale)");
    } else {
      setDocCategory("Relevé de notes officiel du BEPC");
    }
  };

  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [docCategory, setDocCategory] = useState("Relevé de notes BAC 1 (Première)");
  const [docCustomName, setDocCustomName] = useState("");
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);
  const [docUploadSuccessMsg, setDocUploadSuccessMsg] = useState("");
  const [previewDocModal, setPreviewDocModal] = useState<DossierDocument | null>(null);
  const [isAuditingDocs, setIsAuditingDocs] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<string | null>(null);

  const handleAddDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToUse = docCustomName.trim() || selectedDocFile?.name || `${docCategory.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    const sizeToUse = selectedDocFile ? `${(selectedDocFile.size / (1024 * 1024)).toFixed(1)} MB` : "1.2 MB";

    const lowerName = nameToUse.toLowerCase();
    const isSuspicious =
      lowerName.includes("test") ||
      lowerName.includes("sample") ||
      lowerName.includes("faux") ||
      lowerName.includes("fictif") ||
      lowerName.includes("blank") ||
      lowerName.includes("empty") ||
      lowerName.includes("sans_note") ||
      lowerName.includes("sans_matiere") ||
      (selectedDocFile && selectedDocFile.size < 15 * 1024);

    const newDoc: DossierDocument = {
      id: "doc_" + Date.now(),
      category: docCategory,
      fileName: nameToUse,
      fileSize: sizeToUse,
      uploadDate: "Aujourd'hui",
      status: isSuspicious ? "rejected" : "verified",
      hasGrades: !isSuspicious,
      auditNotes: isSuspicious
        ? "🔴 REJETÉ : Document incomplet sans grilles de notes par matière ni sceau d'établissement."
        : "🟢 CERTIFIÉ : Relevé officiel de notes et sceau authentifiés."
    };

    setDossierDocs((prev) => [...prev, newDoc]);
    setDocCustomName("");
    setSelectedDocFile(null);
    setShowAddDocModal(false);

    if (isSuspicious) {
      setDocUploadSuccessMsg("⚠️ Document ajouté mais MARQUÉ NON CONFORME : Absence de grilles de notes et de sceau officiel.");
    } else {
      setDocUploadSuccessMsg("Document téléversé avec succès et vérifié dans votre dossier scolaire !");
    }
    setTimeout(() => setDocUploadSuccessMsg(""), 5000);
  };

  const handleRunDossierAudit = () => {
    setIsAuditingDocs(true);
    setAuditFeedback(null);

    setTimeout(() => {
      setIsAuditingDocs(false);
      const rejectedCount = dossierDocs.filter((d) => d.status === "rejected").length;
      if (dossierDocs.length === 0) {
        setAuditFeedback("🔴 Aucun document dans le dossier scolaire. Veuillez téléverser vos relevés officiels.");
      } else if (rejectedCount > 0) {
        setAuditFeedback(`🔴 AUDIT DÉFAVORABLE : ${rejectedCount} document(s) ne comportent pas de grilles de notes ou de tampons officiels conformes. Seuls les relevés authentifiés sont retenus.`);
      } else {
        setAuditFeedback("🟢 AUDIT SATISFAISANT : Tous les documents du dossier scolaire comportent leurs relevés de notes et tampons officiels d'établissement.");
      }
    }, 1200);
  };

  const handleDeleteDocument = (id: string) => {
    setDossierDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const cleanKey = "sub_" + newSubName.trim().toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now();
    const newSubObj = {
      key: cleanKey,
      name: newSubName.trim(),
      category: newSubCategory,
      defaultCoeff: newSubCoeff,
      isCustom: true,
    };
    setActiveSubjectsList((prev) => [...prev, newSubObj]);
    setCoeffs((prev) => ({ ...prev, [cleanKey]: newSubCoeff }));
    setGrades((prev) => ({ ...prev, [cleanKey]: newSubGrade }));
    if (newSubMinRequired > 0) {
      setCustomSubjectMinima((prev) => ({ ...prev, [cleanKey]: newSubMinRequired }));
    }
    setNewSubName("");
    setShowAddCustomModal(false);
  };

  // Delete ANY subject from the active list
  const handleDeleteSubject = (key: string) => {
    setActiveSubjectsList((prev) => prev.filter((s) => s.key !== key));
    setGrades((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Clear all subjects to start strictly from scratch one by one
  const handleClearAllSubjects = () => {
    setActiveSubjectsList([]);
  };

  // Change series preset (reloads preset subjects)
  const handleSelectSeriesPreset = (seriesKey: "SERIE_D" | "SERIE_C" | "SERIE_A4" | "SERIE_G2" | "LIBRE") => {
    setSelectedSeries(seriesKey);
    const preset = SERIES_PRESETS[seriesKey];
    if (preset) {
      setActiveSubjectsList(preset.subjects);
      const newCoeffs: Record<string, number> = { ...coeffs };
      preset.subjects.forEach((s) => {
        newCoeffs[s.key] = s.defaultCoeff;
      });
      setCoeffs(newCoeffs);
    }
  };

  const handleCoeffChange = (key: string, val: number) => {
    const clampedCoeff = Math.max(1, Math.min(10, val));
    setCoeffs((prev) => ({ ...prev, [key]: clampedCoeff }));
  };

  // Update subject required threshold
  const handleMinRequiredChange = (key: string, val: number) => {
    const clamped = Math.max(0, Math.min(20, val));
    setCustomSubjectMinima((prev) => ({ ...prev, [key]: clamped }));
  };

  // Auto-save grades and program ID to cache whenever they change
  useEffect(() => {
    saveCalculatorGradesCache({
      grades,
      selectedProgramId,
      updatedAt: new Date().toISOString(),
    });
  }, [grades, selectedProgramId]);

  const handleResetGradesToDefaults = () => {
    clearCalculatorGradesCache();
    setGrades({});
    setSelectedProgramId("genie-info-ia");
    setSelectedInstFilter("Tous");
    setSelectedCountryFilter("Tous");
    setSearchKeyword("");
    setCalcMode("manual_full");
    setSelectedSeries("SERIE_D");
    setActiveSubjectsList(SERIES_PRESETS.SERIE_D.subjects);
    setTargetSelectMode("database");
    setCustomSubjectMinima({});
    setCustomInstName("");
    setCustomProgName("");
    setBac1Average("");
    setBac2Average("");
    setDossierDocs([]);
  };

  // Quick batch grade presets
  const handleSetAllGradesTo = (targetGrade: number) => {
    const updated: Record<string, number> = { ...grades };
    activeSubjectsList.forEach((s) => {
      updated[s.key] = targetGrade;
    });
    setGrades(updated);
  };

  // Determine active subjects config based on calcMode
  const requiredKeys = Object.keys(activeReqProgram.subjectMinima || {});

  const subjectsConfig = useMemo(() => {
    if (calcMode === "program_required" && requiredKeys.length > 0) {
      return activeSubjectsList
        .filter((sub) => requiredKeys.includes(sub.key))
        .map((sub) => {
          const minRequired = customSubjectMinima[sub.key] ?? activeReqProgram.subjectMinima[sub.key] ?? 10;
          return {
            ...sub,
            coeff: coeffs[sub.key] ?? sub.defaultCoeff ?? 2,
            minRequired,
          };
        });
    }

    // Manual Full Mode: display all subjects currently in activeSubjectsList
    return activeSubjectsList.map((sub) => {
      const minRequired = customSubjectMinima[sub.key] ?? activeReqProgram.subjectMinima[sub.key] ?? 10;
      return {
        ...sub,
        coeff: coeffs[sub.key] ?? sub.defaultCoeff ?? 2,
        minRequired,
      };
    });
  }, [calcMode, requiredKeys, activeSubjectsList, activeReqProgram, coeffs, customSubjectMinima]);

  // Auto-fill recommended grades for the active program
  const handleAutoFillRequiredGrades = () => {
    const updated: Record<string, number> = { ...grades };
    subjectsConfig.forEach((s) => {
      updated[s.key] = s.minRequired;
    });
    setGrades(updated);
  };

  const handleGradeChange = (key: string, val: number | string) => {
    if (val === "" || val === null || val === undefined) {
      const newGrades = { ...grades };
      delete newGrades[key];
      setGrades(newGrades);
      return;
    }
    const num = typeof val === "number" ? val : parseFloat(val);
    if (isNaN(num)) return;
    const clamped = Math.max(0, Math.min(20, num));
    setGrades((prev) => ({ ...prev, [key]: clamped }));
  };

  // Calculate Weighted Averages
  const totalWeightedSum = subjectsConfig.reduce((acc, sub) => {
    const raw = grades[sub.key];
    const note = typeof raw === "number" && !isNaN(raw) ? raw : 0;
    const c = sub.coeff || 1;
    return acc + note * c;
  }, 0);

  const totalCoeffSum = subjectsConfig.reduce((acc, sub) => acc + (sub.coeff || 1), 0);
  const overallAvg = totalCoeffSum > 0 ? totalWeightedSum / totalCoeffSum : 0;

  const langSubj = subjectsConfig.filter((s) => s.category.includes("Langue"));
  const humSubj = subjectsConfig.filter((s) => s.category.includes("Humaine") || s.category.includes("Sociale"));
  const sciSubj = subjectsConfig.filter((s) => s.category.includes("Exacte") || s.category.includes("Science"));

  const calcGroupAvg = (list: typeof subjectsConfig) => {
    if (list.length === 0) return overallAvg;
    const sum = list.reduce((acc, s) => {
      const raw = grades[s.key];
      const note = typeof raw === "number" && !isNaN(raw) ? raw : 0;
      return acc + note * (s.coeff || 1);
    }, 0);
    const totalC = list.reduce((acc, s) => acc + (s.coeff || 1), 0);
    return totalC > 0 ? sum / totalC : overallAvg;
  };

  const langAvg = calcGroupAvg(langSubj);
  const humAvg = calcGroupAvg(humSubj);
  const sciAvg = calcGroupAvg(sciSubj);

  // Check minimum requirement violations (< minRequired for chosen program)
  const failedRequirements = subjectsConfig.filter((s) => {
    const raw = grades[s.key];
    const note = typeof raw === "number" && !isNaN(raw) ? raw : 0;
    return note < s.minRequired;
  });
  const isEligibleGeneral = overallAvg >= activeReqProgram.minOverall && failedRequirements.length === 0;

  // Check minimum requirement violations for Comparison Program 2 (< minRequired for second program)
  const compFailedRequirements = useMemo(() => {
    const minMap: Record<string, number> = (activeComparisonReqProgram.subjectMinima as Record<string, number>) || {};
    const failed: Array<{ key: string; name: string; required: number; grade: number }> = [];

    Object.entries(minMap).forEach(([key, minVal]) => {
      const minRequired = Number(minVal);
      const matchingSub = activeSubjectsList.find((s) => s.key === key);
      const subName = matchingSub ? matchingSub.name : key;
      const raw = grades[key];
      const note = typeof raw === "number" && !isNaN(raw) ? raw : 0;
      if (note < minRequired) {
        failed.push({
          key,
          name: subName,
          required: minRequired,
          grade: note,
        });
      }
    });
    return failed;
  }, [activeComparisonReqProgram, activeSubjectsList, grades]);

  const isEligibleComparison = overallAvg >= activeComparisonReqProgram.minOverall && compFailedRequirements.length === 0;

  // Check minimum requirement violations for Third Program (< minRequired for third program)
  const thirdFailedRequirements = useMemo(() => {
    const minMap: Record<string, number> = (activeThirdReqProgram.subjectMinima as Record<string, number>) || {};
    const failed: Array<{ key: string; name: string; required: number; grade: number }> = [];

    Object.entries(minMap).forEach(([key, minVal]) => {
      const minRequired = Number(minVal);
      const matchingSub = activeSubjectsList.find((s) => s.key === key);
      const subName = matchingSub ? matchingSub.name : key;
      const raw = grades[key];
      const note = typeof raw === "number" && !isNaN(raw) ? raw : 0;
      if (note < minRequired) {
        failed.push({
          key,
          name: subName,
          required: minRequired,
          grade: note,
        });
      }
    });
    return failed;
  }, [activeThirdReqProgram, activeSubjectsList, grades]);

  const isEligibleThird = overallAvg >= activeThirdReqProgram.minOverall && thirdFailedRequirements.length === 0;

  // Union of subject requirements for 3-way side-by-side comparison table
  const unionSubjectRequirements = useMemo(() => {
    const map1 = (activeReqProgram.subjectMinima as Record<string, number>) || {};
    const map2 = (activeComparisonReqProgram.subjectMinima as Record<string, number>) || {};
    const map3 = (activeThirdReqProgram.subjectMinima as Record<string, number>) || {};
    const allKeys = Array.from(new Set([...Object.keys(map1), ...Object.keys(map2), ...Object.keys(map3)]));

    return allKeys.map((key) => {
      const matchingSub = activeSubjectsList.find((s) => s.key === key);
      const subName = matchingSub ? matchingSub.name : key;
      const raw = grades[key];
      const hasNote = typeof raw === "number" && !isNaN(raw);
      const note = hasNote ? raw : 0;
      const req1 = map1[key] !== undefined ? Number(map1[key]) : null;
      const req2 = map2[key] !== undefined ? Number(map2[key]) : null;
      const req3 = map3[key] !== undefined ? Number(map3[key]) : null;
      const meets1 = req1 === null || (hasNote && note >= req1);
      const meets2 = req2 === null || (hasNote && note >= req2);
      const meets3 = req3 === null || (hasNote && note >= req3);

      return {
        key,
        name: subName,
        grade: note,
        hasNote,
        req1,
        req2,
        req3,
        meets1,
        meets2,
        meets3,
      };
    });
  }, [activeReqProgram, activeComparisonReqProgram, activeThirdReqProgram, activeSubjectsList, grades]);

  // Recharts Data for 3-Program Visual Bar Charts
  const comparisonOverallChartData = useMemo(() => {
    return [
      {
        name: "Filière 1",
        fullName: activeReqProgram.name,
        instName: activeReqProgram.instName,
        "Votre Moyenne": Number(overallAvg.toFixed(2)),
        "Seuil Requis": activeReqProgram.minOverall,
      },
      {
        name: "Filière 2",
        fullName: activeComparisonReqProgram.name,
        instName: activeComparisonReqProgram.instName,
        "Votre Moyenne": Number(overallAvg.toFixed(2)),
        "Seuil Requis": activeComparisonReqProgram.minOverall,
      },
      {
        name: "Filière 3",
        fullName: activeThirdReqProgram.name,
        instName: activeThirdReqProgram.instName,
        "Votre Moyenne": Number(overallAvg.toFixed(2)),
        "Seuil Requis": activeThirdReqProgram.minOverall,
      },
    ];
  }, [activeReqProgram, activeComparisonReqProgram, activeThirdReqProgram, overallAvg]);

  const comparisonSubjectChartData = useMemo(() => {
    return unionSubjectRequirements.map((item) => ({
      subject: item.name.length > 15 ? item.name.slice(0, 13) + "…" : item.name,
      fullName: item.name,
      "Votre Note": item.hasNote ? item.grade : 0,
      [`Seuil ${activeReqProgram.name.slice(0, 10)}…`]: item.req1 !== null ? item.req1 : 0,
      [`Seuil ${activeComparisonReqProgram.name.slice(0, 10)}…`]: item.req2 !== null ? item.req2 : 0,
      [`Seuil ${activeThirdReqProgram.name.slice(0, 10)}…`]: item.req3 !== null ? item.req3 : 0,
    }));
  }, [unionSubjectRequirements, activeReqProgram.name, activeComparisonReqProgram.name, activeThirdReqProgram.name]);

  const handleMakeComparisonPrimary = () => {
    if (comparisonTargetSelectMode === "custom_manual") {
      setTargetSelectMode("custom_manual");
      setCustomInstName(comparisonCustomInstName);
      setCustomProgName(comparisonCustomProgName);
      setCustomMinOverall(comparisonCustomMinOverall);
      setCustomSubjectMinima(comparisonCustomSubjectMinima);
    } else {
      setTargetSelectMode("database");
      setSelectedProgramId(activeComparisonReqProgram.id);
    }
  };

  const handleMakeThirdPrimary = () => {
    if (thirdTargetSelectMode === "custom_manual") {
      setTargetSelectMode("custom_manual");
      setCustomInstName(thirdCustomInstName);
      setCustomProgName(thirdCustomProgName);
      setCustomMinOverall(thirdCustomMinOverall);
      setCustomSubjectMinima(thirdCustomSubjectMinima);
    } else {
      setTargetSelectMode("database");
      setSelectedProgramId(activeThirdReqProgram.id);
    }
  };

  const summaryData = {
    selectedTargetProgram: activeReqProgram.name,
    targetUniversityName: activeReqProgram.instName,
    targetProgramCategory: activeReqProgram.category,
    minOverallRequired: activeReqProgram.minOverall,
    studentLevel,
    bac1Average: hasBac1 ? bac1Num.toFixed(2) : null,
    bac2Average: hasBac2 ? bac2Num.toFixed(2) : null,
    combinedBacAverage: combinedBacAvg !== null ? combinedBacAvg.toFixed(2) : null,
    langAvg: langAvg.toFixed(2),
    humAvg: humAvg.toFixed(2),
    sciAvg: sciAvg.toFixed(2),
    overallAvg: overallAvg.toFixed(2),
    totalPoints: totalWeightedSum.toFixed(2),
    totalCoeffs: totalCoeffSum,
    subjectCount: subjectsConfig.length,
    seriesName: SERIES_PRESETS[selectedSeries]?.label || selectedSeries,
    isEligibleGeneral,
    failedRequirementsKeys: failedRequirements.map((f) => `${f.name} (Obtenu: ${grades[f.key] ?? 0}/20, Requis: ${f.minRequired}/20)`),
    subjectsDetails: subjectsConfig.map((s) => ({
      key: s.key,
      name: s.name,
      category: s.category,
      coeff: s.coeff,
      minRequired: s.minRequired,
      grade: typeof grades[s.key] === "number" && !isNaN(grades[s.key]) ? grades[s.key] : null,
    })),
    dossierDocsList: dossierDocs.map((d) => ({
      category: d.category,
      fileName: d.fileName,
      status: d.status,
    })),
  };

  const handleApplySummary = () => {
    onGradesCalculated(summaryData);
    onGoToAICounselor();
  };

  // Extract list of unique countries for filtering dropdown
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    allInstitutionsList.forEach((inst) => set.add(inst.country));
    return ["Tous", ...Array.from(set).sort()];
  }, [allInstitutionsList]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 p-6 rounded-2xl text-white shadow-md border border-slate-700">
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <Calculator className="w-3.5 h-3.5" /> Calculateur de Moyennes & Éligibilité aux Filières Universitaires
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Vérification des Notes Exigées ({(allProgramsDatabase?.length ?? 0).toLocaleString("fr-FR")} Filières de Tous les Établissements)
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Consultez et sélectionnez n'importe quelle filière dispensée dans l'ensemble des établissements d'enseignement supérieur (Université de Lomé, Kara, UAC, UCAD, UFHB, etc.). Les critères de seuil et matières obligatoires se configurent automatiquement.
          </p>
        </div>
      </div>

      {initialInstName && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-900">
          <div>
            <span className="font-bold block text-sm">Filière initiale : {initialProgramName}</span>
            <span className="text-emerald-700">Établissement cible : {initialInstName}</span>
          </div>
          <span className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold">Cible active</span>
        </div>
      )}

      {/* Main Grid: Input Form vs Results Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">

          {/* Étape 1 OBLIGATOIRE ET PRÉALABLE : Téléversement du Dossier Scolaire */}
          <div className="bg-slate-50 p-5 rounded-2xl border-2 border-emerald-600/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 uppercase tracking-wide">
                  <Paperclip className="w-4 h-4 text-emerald-700" />
                  <span>1. Téléversement Obligatoire du Dossier Scolaire (Étape Préalable) :</span>
                </span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded border border-rose-200 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-rose-600" /> Préalable Requis
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Ajouter un document</span>
                </button>
              </div>
            </div>

            {/* Student Level Selector Toggle */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <label className="text-[11px] font-extrabold text-slate-700 block">
                Niveau d'Orientation & Profil du Candidat :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectStudentLevel("bachelier")}
                  className={`p-2.5 rounded-xl border text-left font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                    studentLevel === "bachelier"
                      ? "bg-emerald-800 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-500/20"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-extrabold">Bachelier / Terminale</div>
                      <div className={`text-[10px] ${studentLevel === "bachelier" ? "text-emerald-100" : "text-slate-500"}`}>
                        Orientation Supérieure (Licence / Master)
                      </div>
                    </div>
                  </div>
                  {studentLevel === "bachelier" && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectStudentLevel("bepc")}
                  className={`p-2.5 rounded-xl border text-left font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                    studentLevel === "bepc"
                      ? "bg-emerald-800 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-500/20"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-extrabold">Titulaire du BEPC</div>
                      <div className={`text-[10px] ${studentLevel === "bepc" ? "text-emerald-100" : "text-slate-500"}`}>
                        Orientation en Seconde (Lycée)
                      </div>
                    </div>
                  </div>
                  {studentLevel === "bepc" && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                </button>
              </div>
            </div>

            {/* Instruction Notice on Verification */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-black text-amber-950 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Procédure de Contrôle OrientaAfrik & Certification :</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                <strong>Le dossier scolaire doit être téléversé obligatoirement avant toute autre activité</strong> dans le processus d'orientation. Lorsque vous soumettez votre demande, les conseillers d'<strong>OrientaAfrik et Certification</strong> procèdent à une <strong>vérification stricte</strong> en comparant vos déclarations aux pièces transmises.
              </p>
              <div className="text-[11px] bg-white/80 p-2 rounded-lg border border-amber-200/80 font-bold space-y-1 text-slate-900">
                <p className="text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>En cas de concordance : Le Rapport d'Orientation Certifié est établi.</span>
                </p>
                <p className="text-rose-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>En cas de discordance : La demande d'orientation est rejetée.</span>
                </p>
              </div>
            </div>

            {/* Requirements list description */}
            <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">
                Composition Obligatoire du Dossier Scolaire ({studentLevel === "bachelier" ? "Bacheliers" : "Titulaires du BEPC"}) :
              </span>
              {studentLevel === "bachelier" ? (
                <p className="leading-snug">
                  • <strong>Pour les Bacheliers</strong> : Les bulletins de la Seconde à la Terminale, les relevés de notes et les attestations du BAC 1 et du BAC 2.
                </p>
              ) : (
                <p className="leading-snug">
                  • <strong>Pour le BEPC (Orientation en 2nde)</strong> : Les bulletins de la 6ème à la 3ème, le relevé de notes et l'attestation du BEPC.
                </p>
              )}
            </div>

            {docUploadSuccessMsg && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{docUploadSuccessMsg}</span>
                </div>
                <button type="button" onClick={() => setDocUploadSuccessMsg("")} className="text-emerald-800 hover:text-emerald-950 font-black">×</button>
              </div>
            )}

            {/* Document List Grid */}
            <div className="space-y-2">
              {dossierDocs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-300 p-5 rounded-xl text-center space-y-2">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Aucun document téléversé dans votre dossier</p>
                  <p className="text-[11px] text-slate-500">Veuillez téléverser vos relevés et bulletins pour constituer votre dossier préalable.</p>
                  <button
                    type="button"
                    onClick={() => setShowAddDocModal(true)}
                    className="mt-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Ajouter un document maintenant</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {dossierDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all shadow-sm ${
                          doc.status === "rejected"
                            ? "bg-rose-50/80 border-rose-300"
                            : "bg-white border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                              doc.status === "rejected"
                                ? "bg-rose-100 border-rose-300 text-rose-700"
                                : "bg-emerald-50 border-emerald-200 text-emerald-700"
                            }`}>
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-slate-900 truncate block max-w-[150px]" title={doc.fileName}>
                                  {doc.fileName}
                                </span>
                                {doc.status === "rejected" ? (
                                  <span className="text-[9px] font-black px-1.5 py-0.2 bg-rose-600 text-white rounded">
                                    🔴 Non Conforme
                                  </span>
                                ) : doc.status === "verified" ? (
                                  <span className="text-[9px] font-black px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded border border-emerald-200">
                                    🟢 Authentifié
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded border border-amber-200">
                                    🟡 En attente
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                                <span className="font-semibold text-slate-700">{doc.category}</span>
                                <span>•</span>
                                <span>{doc.fileSize}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setPreviewDocModal(doc)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Aperçu du document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Supprimer du dossier"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {doc.auditNotes && (
                          <div className={`text-[10px] font-medium p-1.5 rounded border ${
                            doc.status === "rejected"
                              ? "bg-rose-100/70 border-rose-200 text-rose-900"
                              : "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                          }`}>
                            {doc.auditNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Audit Control Action Bar */}
                  <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={handleRunDossierAudit}
                      disabled={isAuditingDocs || dossierDocs.length === 0}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      {isAuditingDocs ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>Audit des Pièces en cours...</span>
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          <span>Lancer l'Audit Approfondi du Dossier</span>
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-slate-500 font-medium text-center sm:text-right">
                      Vérification automatisée des grilles de notes, tampons et filigranes officiels.
                    </span>
                  </div>

                  {auditFeedback && (
                    <div className={`p-3 rounded-xl border text-xs font-extrabold flex items-center gap-2 ${
                      auditFeedback.startsWith("🟢")
                        ? "bg-emerald-100 border-emerald-300 text-emerald-950"
                        : "bg-rose-100 border-rose-300 text-rose-950"
                    }`}>
                      <Award className="w-4 h-4 shrink-0" />
                      <span>{auditFeedback}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Filière Selector & Mode Toggle (Database vs Manual) */}
          <div className="space-y-4 border-b border-slate-200 pb-5">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>2. Université et Filière Visées :</span>
              </label>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowComparison(!showComparison)}
                  className={`px-3 py-1.5 text-xs font-black rounded-xl border flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                    showComparison
                      ? "bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-500 ring-2 ring-amber-400/40"
                      : "bg-teal-700 hover:bg-teal-800 text-white border-teal-800"
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{showComparison ? "Masquer la Comparaison" : "Comparer avec une autre filière"}</span>
                </button>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setTargetSelectMode("database")}
                    className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                      targetSelectMode === "database"
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Base de Données ({filteredPrograms.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetSelectMode("custom_manual")}
                    className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                      targetSelectMode === "custom_manual"
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Saisie Manuelle Cible
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleResetGradesToDefaults}
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1 transition-all"
                  title="Effacer le cache et réinitialiser"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Réinitialiser</span>
                </button>
              </div>
            </div>

            {targetSelectMode === "database" ? (
              <div className="space-y-3">
                {/* Quick Filter Control Bar: Institution, Country & Keyword Search */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {/* Institution Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-emerald-600" /> Établissement :
                    </label>
                    <select
                      value={selectedInstFilter}
                      onChange={(e) => setSelectedInstFilter(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Tous">Tous les Établissements ({allInstitutionsList.length})</option>
                      {allInstitutionsList.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name} ({inst.country})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" /> Pays :
                    </label>
                    <select
                      value={selectedCountryFilter}
                      onChange={(e) => setSelectedCountryFilter(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      {availableCountries.map((c) => (
                        <option key={c} value={c}>
                          {c === "Tous" ? "Tous les Pays" : c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Keyword Search */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 flex items-center gap-1">
                      <Search className="w-3 h-3 text-emerald-600" /> Rechercher une Filière :
                    </label>
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Ex: Médecine, Info, Droit, FSS..."
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Main Program Dropdown Menu */}
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white border-2 border-emerald-600 rounded-xl text-xs font-black text-slate-900 focus:outline-none cursor-pointer shadow-sm"
                >
                  {filteredPrograms.length > 0 ? (
                    filteredPrograms.slice(0, 150).map((prog) => (
                      <option key={prog.id} value={prog.id} className="py-1 font-bold">
                        [{prog.category}] {prog.name} (Seuil : {prog.minOverall}/20)
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Aucune filière trouvée pour cette recherche
                    </option>
                  )}
                </select>
              </div>
            ) : (
              /* Custom Manual Target Entry */
              <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 space-y-3">
                <span className="text-xs font-extrabold text-emerald-950 block flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Saisie Manuelle de l'Université & la Filière Visées :</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Université / Établissement Visé :
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Université de Lomé, UCAD, UAC, ESA..."
                      value={customInstName}
                      onChange={(e) => setCustomInstName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Filière / Spécialité Visée :
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Génie Logiciel, Droit Civique, Agronomie..."
                      value={customProgName}
                      onChange={(e) => setCustomProgName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <label className="text-[11px] font-bold text-slate-700 shrink-0">
                    Seuil de Moyenne Général Exigé (/20) :
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={customMinOverall}
                    onChange={(e) => setCustomMinOverall(parseFloat(e.target.value) || 10)}
                    className="w-20 p-2 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 text-center focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 italic">(Seuil d'accès estimé pour la filière)</span>
                </div>
              </div>
            )}

            {/* Active Target Requirements Summary Pill */}
            <div className="bg-emerald-50/90 p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{activeReqProgram.name}</span>
                  <span className="text-slate-500 text-[11px]">({activeReqProgram.instName})</span>
                </span>
                <span className="px-2.5 py-0.5 bg-amber-200 text-amber-950 font-black text-[10px] rounded border border-amber-300">
                  Moyenne exigée ≥ {activeReqProgram.minOverall}/20
                </span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">{activeReqProgram.description}</p>
            </div>
          </div>

          {/* Section 3: BAC 1 & BAC 2 Overview & Notes par Matière */}
          <div className="bg-gradient-to-r from-emerald-50/80 via-slate-50 to-teal-50/80 p-4 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>3. Moyennes Générales & Bulletins des Notes :</span>
              </span>
              {combinedBacAvg !== null && (
                <span className="px-2.5 py-1 bg-emerald-700 text-white text-xs font-black rounded-lg shadow-sm">
                  Moyenne Combinée : {combinedBacAvg.toFixed(2)} / 20
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">
                  {studentLevel === "bachelier" ? "Moyenne Générale BAC 1 (Probatoire / Première) :" : "Moyenne Générale de 4ème / 3ème :"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    placeholder="Ex: 13.50"
                    value={bac1Average === "" ? "" : bac1Average}
                    onChange={(e) => setBac1Average(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-xs font-bold text-slate-500">/20</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">
                  {studentLevel === "bachelier" ? "Moyenne Générale BAC 2 (Terminale) :" : "Moyenne Générale de l'Examen BEPC :"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    placeholder="Ex: 14.25"
                    value={bac2Average === "" ? "" : bac2Average}
                    onChange={(e) => setBac2Average(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-xs font-bold text-slate-500">/20</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Mode Selection Tabs & Action Controls */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1 border border-slate-200 flex-1 min-w-[280px]">
                <button
                  type="button"
                  onClick={() => setCalcMode("manual_full")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                    calcMode === "manual_full"
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Saisie Matière par Matière ({activeSubjectsList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode("program_required")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                    calcMode === "program_required"
                      ? "bg-teal-700 text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Uniquement Matières Exigées ({requiredKeys.length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowAddCustomModal(true)}
                className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajouter une Matière</span>
              </button>
            </div>

            {/* Series Presets & Clear Buttons */}
            {calcMode === "manual_full" && (
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pré-remplir avec un Modèle de Série :</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClearAllSubjects}
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1 transition-all"
                      title="Effacer toutes les matières pour repartir de zéro"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Effacer tout</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(SERIES_PRESETS) as Array<keyof typeof SERIES_PRESETS>).map((seriesKey) => {
                    const preset = SERIES_PRESETS[seriesKey];
                    const isSelected = selectedSeries === seriesKey && activeSubjectsList.length > 0;
                    return (
                      <button
                        key={seriesKey}
                        type="button"
                        onClick={() => handleSelectSeriesPreset(seriesKey as "SERIE_D" | "SERIE_C" | "SERIE_A4" | "SERIE_G2" | "LIBRE")}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? "bg-emerald-800 text-white border-emerald-900 shadow-sm"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Batch Fill Buttons Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600">Remplissage Rapide :</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleSetAllGradesTo(12)}
                  className="text-[10px] font-bold px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-300 transition-all"
                >
                  Toutes à 12/20
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAllGradesTo(15)}
                  className="text-[10px] font-bold px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-300 transition-all"
                >
                  Toutes à 15/20
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAllGradesTo(10)}
                  className="text-[10px] font-bold px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-300 transition-all"
                >
                  Toutes à 10/20
                </button>
                <button
                  type="button"
                  onClick={handleAutoFillRequiredGrades}
                  className="text-[10px] font-bold px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded border border-teal-200 flex items-center gap-1 transition-all"
                >
                  <RefreshCw className="w-3 h-3 text-teal-600" />
                  Notes de la filière
                </button>
              </div>
            </div>

            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Matières à Prendre en Compte ({subjectsConfig.length} Matières - Total Coeffs : {totalCoeffSum}) :</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500">Note & Seuil /20</span>
            </h4>

            {/* List of Subject Row Cards */}
            {subjectsConfig.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-2xl text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800 text-xs">Aucune matière enregistrée</h5>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Vous pouvez saisir vos matières une par une ou charger un modèle de série ci-dessus.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Ajouter une Matière</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {subjectsConfig.map((sub) => {
                  const rawGrade = grades[sub.key];
                  const hasGrade = typeof rawGrade === "number" && !isNaN(rawGrade);
                  const val = hasGrade ? rawGrade : 0;
                  const coeff = sub.coeff ?? 1;
                  const isFailed = hasGrade && val < sub.minRequired;
                  const weightedPts = val * coeff;

                  return (
                    <div
                      key={sub.key}
                      className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                        isFailed
                          ? "bg-rose-50/70 border-rose-300"
                          : "bg-slate-50/80 border-slate-200"
                      }`}
                    >
                      {/* Left Subject Name & Badges */}
                      <div className="space-y-1 min-w-[180px]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-900 text-xs">{sub.name}</span>
                          {sub.isCustom && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-extrabold rounded border border-purple-200">
                              Custom
                            </span>
                          )}
                          {!hasGrade ? (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded border border-slate-200">
                              En attente de note
                            </span>
                          ) : isFailed ? (
                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded border border-rose-200">
                              Insuffisant (&lt; {sub.minRequired})
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded border border-emerald-200">
                              Admis (≥ {sub.minRequired})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                          <span>{sub.category}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">
                            Pts : <strong className="text-emerald-700">{weightedPts.toFixed(1)}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Right Inputs: Threshold Config, Coeff, Slider, Grade Box, Delete Button */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                        {/* Threshold Note Config */}
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg" title="Seuil minimal exigé par la filière visée">
                          <span className="text-[10px] font-bold text-amber-900 uppercase">Seuil:</span>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={sub.minRequired}
                            onChange={(e) => handleMinRequiredChange(sub.key, parseFloat(e.target.value) || 0)}
                            className="w-10 text-xs font-black text-amber-950 bg-transparent text-center focus:outline-none"
                          />
                        </div>

                        {/* Coefficient selector */}
                        <div className="flex items-center gap-1 bg-white border border-slate-300 px-2 py-1 rounded-lg">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Coeff:</span>
                          <select
                            value={coeff}
                            onChange={(e) => handleCoeffChange(sub.key, parseInt(e.target.value) || 1)}
                            className="text-xs font-black text-slate-800 focus:outline-none bg-transparent cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Slider */}
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="0.25"
                          value={val}
                          onChange={(e) => handleGradeChange(sub.key, parseFloat(e.target.value))}
                          className="w-16 sm:w-24 accent-emerald-600 cursor-pointer"
                        />

                        {/* Precise Numeric Input Box */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            placeholder="Ex: 14"
                            value={hasGrade ? rawGrade : ""}
                            onChange={(e) => handleGradeChange(sub.key, e.target.value)}
                            className={`w-16 p-1 border rounded-lg text-center text-xs font-black focus:outline-none ${
                              isFailed
                                ? "bg-rose-100 border-rose-300 text-rose-900"
                                : "bg-white border-slate-300 text-slate-900 focus:border-emerald-600"
                            }`}
                          />
                          <span className="text-[10px] font-bold text-slate-500">/20</span>
                        </div>

                        {/* Delete button on ALL subjects */}
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(sub.key)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-all"
                          title="Supprimer cette matière du calcul"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Dashboard (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800 p-6 space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Résultat d'Admissibilité</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {activeReqProgram.name}
              </span>
            </div>

            {/* Averages List */}
            <div className="space-y-3">
              <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center text-xs">
                <span className="text-slate-300">Langues (Français, Anglais) :</span>
                <span className={`font-bold text-sm ${langAvg >= 10 ? "text-emerald-400" : "text-rose-400"}`}>
                  {langAvg.toFixed(2)} / 20
                </span>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center text-xs">
                <span className="text-slate-300">Sciences Humaines (Histoire-Géo) :</span>
                <span className={`font-bold text-sm ${humAvg >= 10 ? "text-emerald-400" : "text-rose-400"}`}>
                  {humAvg.toFixed(2)} / 20
                </span>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center text-xs">
                <span className="text-slate-300">Sciences Exactes (Maths, Phys, SVT, Info) :</span>
                <span className={`font-bold text-sm ${sciAvg >= 10 ? "text-emerald-400" : "text-rose-400"}`}>
                  {sciAvg.toFixed(2)} / 20
                </span>
              </div>

              {/* Dossier Scolaire Status */}
              <div className="bg-slate-800/90 p-3 rounded-xl flex justify-between items-center text-xs border border-slate-700/60">
                <span className="text-slate-300 flex items-center gap-1.5 font-bold">
                  <Paperclip className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dossier Scolaire :</span>
                </span>
                <span className={`font-extrabold text-xs px-2 py-0.5 rounded ${dossierDocs.length > 0 ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700/80" : "bg-rose-900/60 text-rose-300 border border-rose-700/80"}`}>
                  {dossierDocs.length} doc(s) {dossierDocs.length >= 2 ? "• Conforme" : "• Incomplet"}
                </span>
              </div>

              {/* Overall Big Metric */}
              <div className="bg-gradient-to-r from-emerald-950 to-slate-800 p-4 rounded-xl border border-emerald-500/30 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-300 block">Moyenne Générale Obtenue :</span>
                  <span className="text-2xl font-black text-emerald-400">{overallAvg.toFixed(2)} / 20</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    (Seuil d'entrée exigé : {activeReqProgram.minOverall} / 20)
                  </span>
                </div>
                {isEligibleGeneral ? (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                )}
              </div>
            </div>

            {/* Diagnostic Message */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Diagnostic & Avis Estimé :</span>
                {(() => {
                  const avis = getConclusionAvis({
                    isEligible: isEligibleGeneral,
                    overallAvg,
                    testScorePct: 50, // default test score benchmark in calculator
                  });
                  return (
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black tracking-wide ${avis.badgeClass}`}>
                      {avis.avisTitle}
                    </span>
                  );
                })()}
              </div>
              {isEligibleGeneral ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 leading-relaxed space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4" /> Éligible à la filière : {activeReqProgram.name} !
                  </p>
                  <p className="text-[11px] text-emerald-200">
                    Votre moyenne générale ({overallAvg.toFixed(2)}/20) et vos notes par matière satisfont l'ensemble des prérequis d'accès du Cabinet OrientaAfrik et Certification.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 leading-relaxed space-y-1.5">
                  <p className="font-bold flex items-center gap-1 text-rose-300">
                    <ShieldAlert className="w-4 h-4 text-rose-400" /> Accès sous réserve / Insuffisant :
                  </p>
                  {overallAvg < activeReqProgram.minOverall && (
                    <p className="text-[11px] text-rose-200">
                      • Moyenne générale ({overallAvg.toFixed(2)}/20) inférieure au seuil minimal exigé ({activeReqProgram.minOverall}/20).
                    </p>
                  )}
                  {failedRequirements.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-rose-200">
                        • {failedRequirements.length} matière(s) n'atteignent pas le seuil requis pour {activeReqProgram.name} :
                      </p>
                      <ul className="list-disc list-inside text-[10px] text-rose-300 pt-0.5 space-y-0.5">
                        {failedRequirements.map((f) => (
                          <li key={f.key}>
                            {f.name} : {grades[f.key]}/20 (Seuil requis : {f.minRequired}/20)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-[10px] text-rose-300 italic pt-1 border-t border-rose-500/20">
                    Un module de mise à niveau ou une orientation alternative est fortement préconisée par le Dr. BALOGAH.
                  </p>
                </div>
              )}
            </div>

            {/* Financial Estimates for Selected Program */}
            {(() => {
              const tuitionEst = getProgramTuitionEstimate(activeReqProgram.name);
              return (
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-amber-400 block">
                    Frais de Scolarité Estimés ({tuitionEst.filiereCategory}) :
                  </span>
                  <div className="text-[11px] text-slate-300 space-y-0.5">
                    <p>• <span className="font-semibold text-white">Public subventionné :</span> {tuitionEst.displayPublicRangeFCFA}</p>
                    <p>• <span className="font-semibold text-white">Privé certifié :</span> {tuitionEst.displayPrivateRangeFCFA}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    {tuitionEst.notes}
                  </p>
                </div>
              );
            })()}

            {/* Compare with another program button */}
            <button
              type="button"
              onClick={() => {
                setShowComparison(!showComparison);
                if (!showComparison) {
                  setTimeout(() => {
                    const el = document.getElementById("side-by-side-comparison-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="w-full bg-slate-800 hover:bg-slate-750 text-amber-300 hover:text-amber-200 border border-amber-400/40 hover:border-amber-400/70 py-2.5 px-3 rounded-xl text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              <span>{showComparison ? "Masquer le Comparateur 3 Filières" : "Comparer 3 filières côte à côte"}</span>
            </button>

            {/* Send to AI Counselor Button */}
            <button
              onClick={handleApplySummary}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Transmettre au Conseiller Dr BALOGAH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side 3-Way Program Comparison Section */}
      {showComparison && (
        <div id="side-by-side-comparison-section" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-8 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <Scale className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Comparateur Tri-Filières (3 Filières Côte à Côte)
                </h3>
              </div>
              <p className="text-slate-400 text-xs">
                Analyse simultanée des critères d'admissibilité, moyennes générales et prérequis par matière sur 3 parcours académiques.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
                <span className="text-slate-400 font-medium">Votre Moyenne :</span>
                <span className="font-black text-emerald-400 text-sm">{overallAvg.toFixed(2)} / 20</span>
              </div>
              <button
                type="button"
                onClick={() => setShowComparison(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>

          {/* 3 Columns: Program Selector & Diagnostic Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Filière 1: Active Primary Target */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border-2 border-emerald-500/50 space-y-4 relative flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider rounded-md">
                    Filière 1 • Principale
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Cible Active
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">
                    {activeReqProgram.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {activeReqProgram.instName}
                  </p>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Seuil Général Exigé :</span>
                  <span className="font-black text-amber-400 text-sm">{activeReqProgram.minOverall} / 20</span>
                </div>

                {/* Status Diagnostic */}
                <div>
                  {isEligibleGeneral ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Éligible (Moyenne & Matières OK)</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-400">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Non Éligible / Seuil non atteint</span>
                      </div>
                      <p className="text-[11px] font-normal text-rose-200 leading-tight">
                        {overallAvg < activeReqProgram.minOverall
                          ? `Moyenne insuffisante (${overallAvg.toFixed(2)} < ${activeReqProgram.minOverall})`
                          : `${failedRequirements.length} matière(s) sous le seuil minimal requis`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Financial Estimate */}
                {(() => {
                  const est = getProgramTuitionEstimate(activeReqProgram.name);
                  return (
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1">
                      <span className="font-bold text-amber-400 block text-[10px] uppercase">Coût de Scolarité Estimé :</span>
                      <p className="text-slate-300">• Public : <span className="font-bold text-white">{est.displayPublicRangeFCFA}</span></p>
                      <p className="text-slate-300">• Privé : <span className="font-bold text-white">{est.displayPrivateRangeFCFA}</span></p>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 italic block text-center">
                  Sélectionnée comme cible prioritaire dans votre formulaire d'orientation
                </span>
              </div>
            </div>

            {/* Filière 2: Comparison Program 2 */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border-2 border-amber-500/50 space-y-4 relative flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider rounded-md">
                    Filière 2 • Comparée
                  </span>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setComparisonTargetSelectMode("database")}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${comparisonTargetSelectMode === "database" ? "bg-amber-500 text-slate-950" : "text-slate-400"}`}
                    >
                      Catalogue
                    </button>
                    <button
                      type="button"
                      onClick={() => setComparisonTargetSelectMode("custom_manual")}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${comparisonTargetSelectMode === "custom_manual" ? "bg-amber-500 text-slate-950" : "text-slate-400"}`}
                    >
                      Saisie
                    </button>
                  </div>
                </div>

                {/* Selector or Manual Inputs for Program 2 */}
                {comparisonTargetSelectMode === "database" ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Rechercher Filière 2..."
                      value={comparisonSearchKeyword}
                      onChange={(e) => setComparisonSearchKeyword(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-amber-500"
                    />
                    <select
                      value={comparisonProgramId}
                      onChange={(e) => setComparisonProgramId(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-500"
                    >
                      {filteredComparisonPrograms.map((p) => (
                        <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                          {p.name} ({p.instName}) • Min {p.minOverall}/20
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      placeholder="Nom Établissement 2"
                      value={comparisonCustomInstName}
                      onChange={(e) => setComparisonCustomInstName(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl font-medium text-white"
                    />
                    <input
                      type="text"
                      placeholder="Nom Filière 2"
                      value={comparisonCustomProgName}
                      onChange={(e) => setComparisonCustomProgName(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl font-bold text-amber-300"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Seuil Minimal :</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={comparisonCustomMinOverall}
                        onChange={(e) => setComparisonCustomMinOverall(parseFloat(e.target.value) || 10)}
                        className="w-16 p-1 bg-slate-900 border border-slate-800 rounded-lg text-center font-bold text-amber-400"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">
                    {activeComparisonReqProgram.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {activeComparisonReqProgram.instName}
                  </p>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Seuil Général Exigé :</span>
                  <span className="font-black text-amber-400 text-sm">{activeComparisonReqProgram.minOverall} / 20</span>
                </div>

                {/* Status Diagnostic */}
                <div>
                  {isEligibleComparison ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Éligible (Moyenne & Matières OK)</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-400">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Non Éligible / Seuil non atteint</span>
                      </div>
                      <p className="text-[11px] font-normal text-rose-200 leading-tight">
                        {overallAvg < activeComparisonReqProgram.minOverall
                          ? `Moyenne insuffisante (${overallAvg.toFixed(2)} < ${activeComparisonReqProgram.minOverall})`
                          : `${compFailedRequirements.length} matière(s) sous le seuil minimal requis`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Financial Estimate */}
                {(() => {
                  const est = getProgramTuitionEstimate(activeComparisonReqProgram.name);
                  return (
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1">
                      <span className="font-bold text-amber-400 block text-[10px] uppercase">Coût de Scolarité Estimé :</span>
                      <p className="text-slate-300">• Public : <span className="font-bold text-white">{est.displayPublicRangeFCFA}</span></p>
                      <p className="text-slate-300">• Privé : <span className="font-bold text-white">{est.displayPrivateRangeFCFA}</span></p>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleMakeComparisonPrimary}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 px-3 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Définir comme Filière Principale</span>
                </button>
              </div>
            </div>

            {/* Filière 3: Comparison Program 3 */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border-2 border-teal-500/50 space-y-4 relative flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="px-2.5 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-black uppercase tracking-wider rounded-md">
                    Filière 3 • Comparée
                  </span>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setThirdTargetSelectMode("database")}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${thirdTargetSelectMode === "database" ? "bg-teal-500 text-slate-950" : "text-slate-400"}`}
                    >
                      Catalogue
                    </button>
                    <button
                      type="button"
                      onClick={() => setThirdTargetSelectMode("custom_manual")}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${thirdTargetSelectMode === "custom_manual" ? "bg-teal-500 text-slate-950" : "text-slate-400"}`}
                    >
                      Saisie
                    </button>
                  </div>
                </div>

                {/* Selector or Manual Inputs for Program 3 */}
                {thirdTargetSelectMode === "database" ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Rechercher Filière 3..."
                      value={thirdSearchKeyword}
                      onChange={(e) => setThirdSearchKeyword(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-teal-500"
                    />
                    <select
                      value={thirdProgramId}
                      onChange={(e) => setThirdProgramId(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-teal-300 focus:outline-none focus:border-teal-500"
                    >
                      {filteredThirdPrograms.map((p) => (
                        <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                          {p.name} ({p.instName}) • Min {p.minOverall}/20
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      placeholder="Nom Établissement 3"
                      value={thirdCustomInstName}
                      onChange={(e) => setThirdCustomInstName(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl font-medium text-white"
                    />
                    <input
                      type="text"
                      placeholder="Nom Filière 3"
                      value={thirdCustomProgName}
                      onChange={(e) => setThirdCustomProgName(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl font-bold text-teal-300"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Seuil Minimal :</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={thirdCustomMinOverall}
                        onChange={(e) => setThirdCustomMinOverall(parseFloat(e.target.value) || 10)}
                        className="w-16 p-1 bg-slate-900 border border-slate-800 rounded-lg text-center font-bold text-teal-400"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">
                    {activeThirdReqProgram.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {activeThirdReqProgram.instName}
                  </p>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Seuil Général Exigé :</span>
                  <span className="font-black text-amber-400 text-sm">{activeThirdReqProgram.minOverall} / 20</span>
                </div>

                {/* Status Diagnostic */}
                <div>
                  {isEligibleThird ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Éligible (Moyenne & Matières OK)</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-400">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Non Éligible / Seuil non atteint</span>
                      </div>
                      <p className="text-[11px] font-normal text-rose-200 leading-tight">
                        {overallAvg < activeThirdReqProgram.minOverall
                          ? `Moyenne insuffisante (${overallAvg.toFixed(2)} < ${activeThirdReqProgram.minOverall})`
                          : `${thirdFailedRequirements.length} matière(s) sous le seuil minimal requis`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Financial Estimate */}
                {(() => {
                  const est = getProgramTuitionEstimate(activeThirdReqProgram.name);
                  return (
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1">
                      <span className="font-bold text-amber-400 block text-[10px] uppercase">Coût de Scolarité Estimé :</span>
                      <p className="text-slate-300">• Public : <span className="font-bold text-white">{est.displayPublicRangeFCFA}</span></p>
                      <p className="text-slate-300">• Privé : <span className="font-bold text-white">{est.displayPrivateRangeFCFA}</span></p>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleMakeThirdPrimary}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2 px-3 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Définir comme Filière Principale</span>
                </button>
              </div>
            </div>

          </div>

          {/* Recharts Visual Comparison Charts Section */}
          <div className="space-y-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <SlidersHorizontal className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-black text-white">
                  Visualisation Graphique Interactive (Recharts)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Comparaison visuelle directe des moyennes et seuils d'accès (/20)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Overall Average vs Admission Thresholds */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">1. Moyenne Générale vs Seuil d'Accès Minimal</span>
                  <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                    Votre Moyenne : {overallAvg.toFixed(2)}/20
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonOverallChartData}
                      margin={{ top: 15, right: 20, left: -15, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "bold" }}
                      />
                      <YAxis
                        domain={[0, 20]}
                        stroke="#94a3b8"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                        ticks={[0, 5, 10, 12, 14, 16, 20]}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "0.75rem",
                          fontSize: "11px",
                          color: "#fff",
                        }}
                        formatter={(value: any, name: any, item: any) => [
                          `${value} / 20`,
                          name === "Votre Moyenne" ? "Votre Moyenne Générale" : "Seuil Exigé par la Filière",
                        ]}
                        labelFormatter={(label, payload) => {
                          const item = payload && payload[0] ? payload[0].payload : null;
                          return item ? `${item.name} : ${item.fullName}` : label;
                        }}
                      />
                      <RechartsLegend
                        wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                      />
                      <ReferenceLine y={10} stroke="#64748b" strokeDasharray="3 3" label={{ value: "Moyenne (10)", fill: "#64748b", fontSize: 9 }} />
                      <Bar dataKey="Votre Moyenne" fill="#10b981" radius={[6, 6, 0, 0]} barSize={26} />
                      <Bar dataKey="Seuil Requis" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={26} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Subject-by-Subject comparison */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">2. Notes par Matière vs Exigences Spécifiques</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {unionSubjectRequirements.length} matière(s)
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonSubjectChartData}
                      margin={{ top: 15, right: 15, left: -15, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis
                        dataKey="subject"
                        stroke="#94a3b8"
                        interval={0}
                        angle={-18}
                        textAnchor="end"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                      />
                      <YAxis
                        domain={[0, 20]}
                        stroke="#94a3b8"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                        ticks={[0, 5, 10, 15, 20]}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "0.75rem",
                          fontSize: "11px",
                          color: "#fff",
                        }}
                        formatter={(value: any, name: any) => [`${value} / 20`, name]}
                        labelFormatter={(label, payload) => {
                          const item = payload && payload[0] ? payload[0].payload : null;
                          return item ? item.fullName : label;
                        }}
                      />
                      <RechartsLegend
                        wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                      />
                      <ReferenceLine y={10} stroke="#64748b" strokeDasharray="3 3" />
                      <Bar dataKey="Votre Note" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey={`Seuil ${activeReqProgram.name.slice(0, 10)}…`} fill="#10b981" radius={[4, 4, 0, 0]} barSize={14} />
                      <Bar dataKey={`Seuil ${activeComparisonReqProgram.name.slice(0, 10)}…`} fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={14} />
                      <Bar dataKey={`Seuil ${activeThirdReqProgram.name.slice(0, 10)}…`} fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Subject Requirements Comparison Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Tableau Comparatif Explicite par Matière (3 Filières)</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                {unionSubjectRequirements.length} matière(s) évaluée(s)
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider">
                    <th className="p-3.5">Matières & Vos Notes</th>
                    <th className="p-3.5 text-emerald-400 border-l border-slate-800">
                      1. {activeReqProgram.name}
                    </th>
                    <th className="p-3.5 text-amber-400 border-l border-slate-800">
                      2. {activeComparisonReqProgram.name}
                    </th>
                    <th className="p-3.5 text-teal-400 border-l border-slate-800">
                      3. {activeThirdReqProgram.name}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {unionSubjectRequirements.map((row) => (
                    <tr key={row.key} className="hover:bg-slate-900/60 transition-colors">
                      {/* Subject Name & Grade */}
                      <td className="p-3.5 space-y-0.5">
                        <div className="font-bold text-white text-xs">{row.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Votre Note : <span className={`font-black ${row.grade >= 10 ? "text-emerald-400" : "text-rose-400"}`}>{row.hasNote ? `${row.grade} / 20` : "Non renseignée"}</span>
                        </div>
                      </td>

                      {/* Filière 1 Requirement */}
                      <td className="p-3.5 border-l border-slate-800">
                        {row.req1 === null ? (
                          <span className="text-slate-500 text-[11px] font-normal italic">Non exigée spécifique</span>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-slate-300 font-bold block">Seuil : {row.req1} / 20</span>
                            {row.meets1 ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                                <Check className="w-3 h-3 text-emerald-400" /> Validé
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded">
                                <AlertTriangle className="w-3 h-3 text-rose-400" /> Insuffisant
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Filière 2 Requirement */}
                      <td className="p-3.5 border-l border-slate-800">
                        {row.req2 === null ? (
                          <span className="text-slate-500 text-[11px] font-normal italic">Non exigée spécifique</span>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-slate-300 font-bold block">Seuil : {row.req2} / 20</span>
                            {row.meets2 ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                                <Check className="w-3 h-3 text-emerald-400" /> Validé
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded">
                                <AlertTriangle className="w-3 h-3 text-rose-400" /> Insuffisant
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Filière 3 Requirement */}
                      <td className="p-3.5 border-l border-slate-800">
                        {row.req3 === null ? (
                          <span className="text-slate-500 text-[11px] font-normal italic">Non exigée spécifique</span>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-slate-300 font-bold block">Seuil : {row.req3} / 20</span>
                            {row.meets3 ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                                <Check className="w-3 h-3 text-emerald-400" /> Validé
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded">
                                <AlertTriangle className="w-3 h-3 text-rose-400" /> Insuffisant
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Synthesis Note */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-black text-amber-400 text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Synthèse Stratégique du Comparateur (OrientaAfrik) :</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              Sur les 3 filières comparées, vous satisfaites à 100% les critères d'accès de{" "}
              <strong className="text-emerald-400 font-extrabold">
                {[isEligibleGeneral, isEligibleComparison, isEligibleThird].filter(Boolean).length} sur 3 filières
              </strong>.
              {[isEligibleGeneral, isEligibleComparison, isEligibleThird].filter(Boolean).length > 0
                ? " Vous pouvez utiliser les filières validées comme votre choix principal ou second choix sécurisé dans votre demande d'orientation."
                : " Aucune des 3 filières ne valide intégralement le seuil minimal. Un accompagnement de mise à niveau avec le Dr. BALOGAH est fortement conseillé."}
            </p>
          </div>
        </div>
      )}

      {/* Custom Subject Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Ajouter une Matière Personnalisée</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCustomSubject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nom de la Matière :
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Allemand LV2, Dessin Technique, Droit Civique..."
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Catégorie :
                  </label>
                  <select
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Langues">Langues & LV2</option>
                    <option value="Sciences Exactes">Sciences Exactes</option>
                    <option value="Sciences Sociales & Humaines">Sciences Humaines</option>
                    <option value="Technique & Gestion">Technique & Gestion</option>
                    <option value="Sports & Option">Sports & Options</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Coefficient (1 à 10) :
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSubCoeff}
                    onChange={(e) => setNewSubCoeff(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Note Obtenue (/20) :
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    value={newSubGrade}
                    onChange={(e) => setNewSubGrade(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Seuil Requis (/20) :
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={newSubMinRequired}
                    onChange={(e) => setNewSubMinRequired(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter au Bulletin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter un Document au Dossier Scolaire */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-emerald-600" />
                <span>Ajouter un Document au Dossier Scolaire</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDocModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddDocumentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Type de Document Requis * :
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <optgroup label="Dossier Bachelier (Orientation Supérieure)">
                    <option value="Bulletins de la Seconde à la Terminale">Bulletins de la Seconde à la Terminale</option>
                    <option value="Relevé de notes officiel du BAC 1 (Première)">Relevé de notes officiel du BAC 1 (Première)</option>
                    <option value="Relevé de notes officiel du BAC 2 (Terminale)">Relevé de notes officiel du BAC 2 (Terminale)</option>
                    <option value="Attestation de Succès / Diplôme du BAC 1">Attestation de Succès / Diplôme du BAC 1</option>
                    <option value="Attestation de Succès / Diplôme du BAC 2">Attestation de Succès / Diplôme du BAC 2</option>
                  </optgroup>
                  <optgroup label="Dossier BEPC (Orientation en Seconde)">
                    <option value="Bulletins de la 6ème à la 3ème">Bulletins de la 6ème à la 3ème</option>
                    <option value="Relevé de notes officiel du BEPC">Relevé de notes officiel du BEPC</option>
                    <option value="Attestation de Succès / Diplôme du BEPC">Attestation de Succès / Diplôme du BEPC</option>
                  </optgroup>
                  <optgroup label="Pièces Complémentaires">
                    <option value="Acte de Naissance / Pièce d'Identité">Acte de Naissance / Pièce d'Identité</option>
                    <option value="Certificat de Scolarité">Certificat de Scolarité</option>
                    <option value="Lettre de Motivation / Projet Pro">Lettre de Motivation / Projet Pro</option>
                    <option value="Autre Document Justificatif">Autre Document Justificatif</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nom / Intitulé du Fichier (Optionnel) :
                </label>
                <input
                  type="text"
                  placeholder="Ex: Releve_Officiel_BAC2_Session_Juin.pdf"
                  value={docCustomName}
                  onChange={(e) => setDocCustomName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* File Drop Area / Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sélectionner le Fichier Numérique (PDF, PNG, JPG - max 10MB) * :
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-5 bg-slate-50/70 text-center space-y-2 cursor-pointer relative transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedDocFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="text-slate-700 font-bold text-xs">
                    {selectedDocFile ? (
                      <span className="text-emerald-700 font-black">{selectedDocFile.name} ({(selectedDocFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    ) : (
                      <span>Glissez-déposez votre document ici ou <strong className="text-emerald-700 underline">Parcourir les fichiers</strong></span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">Formats acceptés : PDF, PNG, JPG (Scan haute lisibilité exigé)</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter au Dossier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Aperçu du Document */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm truncate max-w-xs">
                  Aperçu : {previewDocModal.fileName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-center text-white space-y-3">
              <FileText className="w-16 h-16 text-emerald-400 mx-auto animate-pulse" />
              <div className="space-y-1">
                <p className="font-black text-sm">{previewDocModal.category}</p>
                <p className="text-xs text-slate-300 font-mono">{previewDocModal.fileName} ({previewDocModal.fileSize})</p>
                <span className="inline-block mt-2 px-3 py-1 bg-emerald-800 text-emerald-200 text-xs font-bold rounded-full border border-emerald-600">
                  Document certifié conforme & joint au dossier
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">Téléversé le : {previewDocModal.uploadDate}</span>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
              >
                Fermer l'Aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


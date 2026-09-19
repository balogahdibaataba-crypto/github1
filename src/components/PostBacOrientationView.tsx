import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  Calculator,
  Compass,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronRight,
  HelpCircle,
  Download,
  Printer,
  RotateCcw,
  Search,
  Filter,
  User,
  School,
  Calendar,
  Layers,
  HeartHandshake,
  TrendingUp,
  BrainCircuit,
  Stethoscope,
  Cpu,
  Landmark,
  Scale,
  Languages,
  Sprout,
  ShieldCheck,
  Zap,
  Eye,
} from "lucide-react";
import {
  PostBacStudentRecords,
  PostBacField,
  PostBacApprenticeshipTrade,
  PostBacOrientationDecision,
  PostBacFieldCategory,
} from "../types";
import {
  POST_BAC_FIELDS,
  POST_BAC_APPRENTICESHIP_TRADES,
  evaluatePostBacOrientation,
} from "../data/postBacData";
import { OfficialCertifiedReport3Pages } from "./OfficialCertifiedReport3Pages";

interface PostBacOrientationViewProps {
  onGoToAICounselor?: () => void;
  onGoToTests?: () => void;
}

const DEFAULT_POST_BAC_RECORDS: PostBacStudentRecords = {
  studentName: "Komi Mensah AGBEKO",
  birthDate: "14/05/2005",
  birthPlace: "Lomé (Togo)",
  nationality: "Togolaise",
  candidateId: "CAND-2026-BAC-8821",
  highSchoolOrigin: "Lycée de Tokoin - Lomé",
  city: "Lomé, Togo",
  bacSerie: "D",
  bacYear: 2026,
  hasObtainedBac: true,
  userWishedPathway: "sciences_sante",
  wishedFieldOrTrade: "Médecine Générale ou Pharmacie",
  userInterests: ["Santé humaine", "Biologie", "Secourisme", "Sciences médicales"],
  careerAspiration: "Devenir Médecin Chef ou Chirurgien dans un CHU",
  grades: {
    francais: {
      grade2nde: { t1: 12.5, t2: 13.0, t3: 12.0 },
      grade1ere: { t1: 11.5, t2: 12.0, t3: 11.5 },
      gradeTle: { t1: 12.0, t2: 11.5, t3: 12.5 },
      gradeBac1: 12.0,
      gradeBac2: 12.5,
    },
    philosophie: {
      grade2nde: { t1: 10.5, t2: 11.0, t3: 10.0 },
      grade1ere: { t1: 11.0, t2: 10.5, t3: 11.0 },
      gradeTle: { t1: 11.5, t2: 11.0, t3: 12.0 },
      gradeBac1: 11.0,
      gradeBac2: 11.5,
    },
    anglais: {
      grade2nde: { t1: 13.0, t2: 13.5, t3: 14.0 },
      grade1ere: { t1: 12.5, t2: 13.0, t3: 12.5 },
      gradeTle: { t1: 13.0, t2: 13.5, t3: 14.0 },
      gradeBac1: 13.0,
      gradeBac2: 13.5,
    },
    histoireGeo: {
      grade2nde: { t1: 11.0, t2: 11.5, t3: 11.0 },
      grade1ere: { t1: 10.5, t2: 11.0, t3: 10.5 },
      gradeTle: { t1: 11.0, t2: 11.5, t3: 11.0 },
      gradeBac1: 11.0,
      gradeBac2: 11.0,
    },
    mathematiques: {
      grade2nde: { t1: 12.0, t2: 11.5, t3: 12.5 },
      grade1ere: { t1: 11.0, t2: 11.5, t3: 12.0 },
      gradeTle: { t1: 11.5, t2: 12.0, t3: 11.5 },
      gradeBac1: 11.5,
      gradeBac2: 12.0,
    },
    physiqueChimie: {
      grade2nde: { t1: 13.0, t2: 13.5, t3: 12.5 },
      grade1ere: { t1: 12.5, t2: 13.0, t3: 13.5 },
      gradeTle: { t1: 13.0, t2: 12.5, t3: 13.0 },
      gradeBac1: 13.0,
      gradeBac2: 13.5,
    },
    svt: {
      grade2nde: { t1: 14.0, t2: 14.5, t3: 14.0 },
      grade1ere: { t1: 13.5, t2: 14.0, t3: 14.5 },
      gradeTle: { t1: 14.0, t2: 14.5, t3: 14.0 },
      gradeBac1: 14.0,
      gradeBac2: 14.5,
    },
    economieCompta: {
      grade2nde: { t1: 10.0, t2: 10.0, t3: 10.5 },
      grade1ere: { t1: 10.0, t2: 10.5, t3: 10.0 },
      gradeTle: { t1: 10.5, t2: 10.0, t3: 10.5 },
      gradeBac1: 10.0,
      gradeBac2: 10.0,
    },
    eps: {
      grade2nde: { t1: 15.0, t2: 15.0, t3: 15.0 },
      grade1ere: { t1: 14.5, t2: 15.0, t3: 15.0 },
      gradeTle: { t1: 15.0, t2: 15.0, t3: 15.0 },
      gradeBac1: 15.0,
      gradeBac2: 15.0,
    },
  },
  psychometrics: {
    dominantRiasec: "IRS",
    riasecScores: { R: 65, I: 92, A: 45, S: 88, E: 55, C: 70 },
    cognitiveIQScore: 124,
    logicScore: 88,
    emotionalResilienceScore: 85,
    interestsSummary: "Forte curiosité biomédicale, sens aigu du service humain et rigueur analytique.",
    testDate: "2026-08-20",
  },
};

export const PostBacOrientationView: React.FC<PostBacOrientationViewProps> = ({
  onGoToAICounselor,
  onGoToTests,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"simulator" | "fields" | "trades" | "guide">("simulator");
  const [studentRecords, setStudentRecords] = useState<PostBacStudentRecords>(DEFAULT_POST_BAC_RECORDS);
  const [gradeInputMode, setGradeInputMode] = useState<"matrix" | "tabs">("matrix");
  const [activeClassTab, setActiveClassTab] = useState<"2nde" | "1ere" | "tle" | "bac">("2nde");
  const [showThreePageReportModal, setShowThreePageReportModal] = useState<boolean>(false);
  const [isReportPreviewMode, setIsReportPreviewMode] = useState<boolean>(false);

  // Filtering for fields & trades
  const [searchFieldQuery, setSearchFieldQuery] = useState("");
  const [selectedFieldCategory, setSelectedFieldCategory] = useState<string>("all");
  const [searchTradeQuery, setSearchTradeQuery] = useState("");

  // Calculate orientation decision dynamically
  const evaluationResult: PostBacOrientationDecision = useMemo(() => {
    return evaluatePostBacOrientation(studentRecords);
  }, [studentRecords]);

  // Preset loaders for quick user testing
  const loadPresetProfile = (preset: "sante" | "ingenierie" | "droit" | "eco" | "apprentissage_excellence" | "apprentissage_reorientation") => {
    if (preset === "sante") {
      setStudentRecords({
        ...studentRecords,
        studentName: "Afi Mawunya DOSSOU",
        bacSerie: "D",
        userWishedPathway: "sciences_sante",
        wishedFieldOrTrade: "Médecine Générale & Chirurgie",
        careerAspiration: "Médecin spécialiste en cardiologie",
        grades: {
          ...studentRecords.grades,
          mathematiques: { grade2nde: { t1: 12, t2: 12.5, t3: 13 }, grade1ere: { t1: 12, t2: 12.5, t3: 12 }, gradeTle: { t1: 12.5, t2: 13, t3: 13 }, gradeBac1: 12.5, gradeBac2: 13 },
          physiqueChimie: { grade2nde: { t1: 13, t2: 13.5, t3: 14 }, grade1ere: { t1: 13.5, t2: 14, t3: 14 }, gradeTle: { t1: 14, t2: 14.5, t3: 14 }, gradeBac1: 14, gradeBac2: 14.5 },
          svt: { grade2nde: { t1: 15, t2: 15.5, t3: 15 }, grade1ere: { t1: 15, t2: 15.5, t3: 16 }, gradeTle: { t1: 15.5, t2: 16, t3: 16 }, gradeBac1: 15.5, gradeBac2: 16 },
          francais: { grade2nde: { t1: 12, t2: 12, t3: 12.5 }, grade1ere: { t1: 12, t2: 12.5, t3: 12 }, gradeTle: { t1: 12, t2: 12, t3: 12.5 }, gradeBac1: 12, gradeBac2: 12.5 },
        },
        psychometrics: {
          dominantRiasec: "ISR",
          riasecScores: { R: 60, I: 95, A: 40, S: 90, E: 50, C: 65 },
          cognitiveIQScore: 126,
          logicScore: 90,
          emotionalResilienceScore: 88,
          interestsSummary: "Biologie médicale, soins cliniques, recherche thérapeutique.",
          testDate: "2026-08-25",
        },
      });
    } else if (preset === "ingenierie") {
      setStudentRecords({
        ...studentRecords,
        studentName: "Kokou Emmanuel LAWSON",
        bacSerie: "C",
        userWishedPathway: "ingenierie_technologie",
        wishedFieldOrTrade: "Génie Logiciel & Intelligence Artificielle",
        careerAspiration: "Architecte Cloud et Ingénieur IA",
        grades: {
          ...studentRecords.grades,
          mathematiques: { grade2nde: { t1: 15, t2: 16, t3: 16.5 }, grade1ere: { t1: 16, t2: 16.5, t3: 17 }, gradeTle: { t1: 16, t2: 17, t3: 17.5 }, gradeBac1: 16.5, gradeBac2: 17 },
          physiqueChimie: { grade2nde: { t1: 14, t2: 15, t3: 15.5 }, grade1ere: { t1: 15, t2: 15.5, t3: 16 }, gradeTle: { t1: 15, t2: 16, t3: 16 }, gradeBac1: 15.5, gradeBac2: 16 },
          anglais: { grade2nde: { t1: 14, t2: 14.5, t3: 15 }, grade1ere: { t1: 14, t2: 15, t3: 15 }, gradeTle: { t1: 15, t2: 15.5, t3: 16 }, gradeBac1: 15, gradeBac2: 15.5 },
          svt: { grade2nde: { t1: 11, t2: 11.5, t3: 12 }, grade1ere: { t1: 11, t2: 11, t3: 11.5 }, gradeTle: { t1: 11.5, t2: 12, t3: 11.5 }, gradeBac1: 11.5, gradeBac2: 12 },
        },
        psychometrics: {
          dominantRiasec: "IRC",
          riasecScores: { R: 85, I: 96, A: 50, S: 45, E: 70, C: 88 },
          cognitiveIQScore: 130,
          logicScore: 95,
          emotionalResilienceScore: 82,
          interestsSummary: "Algorithmique, robotique, systèmes distribués et sécurité réseau.",
          testDate: "2026-08-25",
        },
      });
    } else if (preset === "droit") {
      setStudentRecords({
        ...studentRecords,
        studentName: "Adjoa Reine BATCHASSI",
        bacSerie: "A4",
        userWishedPathway: "droit_sciences_sociales",
        wishedFieldOrTrade: "Droit des Affaires & Magistrature",
        careerAspiration: "Magistrat ou Avocate internationale en droit commercial",
        grades: {
          ...studentRecords.grades,
          francais: { grade2nde: { t1: 14, t2: 14.5, t3: 15 }, grade1ere: { t1: 14.5, t2: 15, t3: 15.5 }, gradeTle: { t1: 15, t2: 15.5, t3: 16 }, gradeBac1: 15, gradeBac2: 15.5 },
          philosophie: { grade2nde: { t1: 13, t2: 13.5, t3: 14 }, grade1ere: { t1: 14, t2: 14.5, t3: 15 }, gradeTle: { t1: 14.5, t2: 15, t3: 15 }, gradeBac1: 14.5, gradeBac2: 15 },
          histoireGeo: { grade2nde: { t1: 13.5, t2: 14, t3: 14 }, grade1ere: { t1: 14, t2: 14.5, t3: 15 }, gradeTle: { t1: 14, t2: 14.5, t3: 15 }, gradeBac1: 14.5, gradeBac2: 15 },
          anglais: { grade2nde: { t1: 13, t2: 13.5, t3: 14 }, grade1ere: { t1: 13.5, t2: 14, t3: 14.5 }, gradeTle: { t1: 14, t2: 14.5, t3: 15 }, gradeBac1: 14, gradeBac2: 14.5 },
          mathematiques: { grade2nde: { t1: 9, t2: 9.5, t3: 10 }, grade1ere: { t1: 9, t2: 9.5, t3: 9.5 }, gradeTle: { t1: 9.5, t2: 10, t3: 9.5 }, gradeBac1: 9.5, gradeBac2: 10 },
        },
        psychometrics: {
          dominantRiasec: "ESA",
          riasecScores: { R: 35, I: 75, A: 80, S: 88, E: 92, C: 70 },
          cognitiveIQScore: 122,
          logicScore: 84,
          emotionalResilienceScore: 90,
          interestsSummary: "Débat juridique, plaidoirie, justice sociale et relations internationales.",
          testDate: "2026-08-25",
        },
      });
    } else if (preset === "apprentissage_excellence") {
      // High grades, but chooses apprenticeship
      setStudentRecords({
        ...studentRecords,
        studentName: "Messan Kévin TOZO",
        bacSerie: "F3",
        userWishedPathway: "apprentissage_metier_postbac",
        wishedFieldOrTrade: "Technicien Supérieur en Systèmes Solaires & Énergies Propres",
        careerAspiration: "Créer une grande entreprise d'installation et de maintenance solaire",
        grades: {
          ...studentRecords.grades,
          mathematiques: { grade2nde: { t1: 13, t2: 13.5, t3: 14 }, grade1ere: { t1: 13.5, t2: 14, t3: 14 }, gradeTle: { t1: 14, t2: 14.5, t3: 15 }, gradeBac1: 14, gradeBac2: 14.5 },
          physiqueChimie: { grade2nde: { t1: 14, t2: 14.5, t3: 15 }, grade1ere: { t1: 14.5, t2: 15, t3: 15.5 }, gradeTle: { t1: 15, t2: 15.5, t3: 16 }, gradeBac1: 15, gradeBac2: 15.5 },
          anglais: { grade2nde: { t1: 12, t2: 12.5, t3: 13 }, grade1ere: { t1: 12.5, t2: 13, t3: 13 }, gradeTle: { t1: 13, t2: 13.5, t3: 14 }, gradeBac1: 13, gradeBac2: 13.5 },
        },
        psychometrics: {
          dominantRiasec: "REC",
          riasecScores: { R: 95, I: 80, A: 45, S: 60, E: 90, C: 78 },
          cognitiveIQScore: 125,
          logicScore: 90,
          emotionalResilienceScore: 86,
          interestsSummary: "Technologie appliquée, énergie solaire, entrepreneuriat et gestion d'équipe.",
          testDate: "2026-08-25",
        },
      });
    } else if (preset === "apprentissage_reorientation") {
      // Lower academic grades -> redirected to high-demand trade
      setStudentRecords({
        ...studentRecords,
        studentName: "Komla Fabrice KPOGO",
        bacSerie: "A4",
        userWishedPathway: "sciences_sante",
        wishedFieldOrTrade: "Médecine (Demande initiale non conforme)",
        careerAspiration: "Devenir professionnel qualifié autonome",
        grades: {
          ...studentRecords.grades,
          mathematiques: { grade2nde: { t1: 7, t2: 7.5, t3: 8 }, grade1ere: { t1: 7.5, t2: 8, t3: 7.5 }, gradeTle: { t1: 8, t2: 8, t3: 8.5 }, gradeBac1: 8, gradeBac2: 8 },
          physiqueChimie: { grade2nde: { t1: 8, t2: 8.5, t3: 8 }, grade1ere: { t1: 8, t2: 8.5, t3: 8.5 }, gradeTle: { t1: 8.5, t2: 8.5, t3: 9 }, gradeBac1: 8.5, gradeBac2: 8.5 },
          svt: { grade2nde: { t1: 9, t2: 9.5, t3: 9 }, grade1ere: { t1: 9, t2: 9.5, t3: 9.5 }, gradeTle: { t1: 9.5, t2: 9, t3: 9.5 }, gradeBac1: 9.5, gradeBac2: 9.5 },
          francais: { grade2nde: { t1: 9.5, t2: 10, t3: 9.5 }, grade1ere: { t1: 9.5, t2: 10, t3: 10 }, gradeTle: { t1: 10, t2: 9.5, t3: 10 }, gradeBac1: 10, gradeBac2: 10 },
        },
        psychometrics: {
          dominantRiasec: "REC",
          riasecScores: { R: 85, I: 55, A: 50, S: 60, E: 80, C: 65 },
          cognitiveIQScore: 102,
          logicScore: 68,
          emotionalResilienceScore: 75,
          interestsSummary: "Pratique manuelle, mécanique, réseaux et commerce de terrain.",
          testDate: "2026-08-25",
        },
      });
    }
  };

  // Reset entire form (civil info + grades)
  const clearEntireForm = () => {
    const emptySub = {
      grade2nde: { t1: undefined, t2: undefined, t3: undefined },
      grade1ere: { t1: undefined, t2: undefined, t3: undefined },
      gradeTle: { t1: undefined, t2: undefined, t3: undefined },
      gradeBac1: undefined,
      gradeBac2: undefined,
    };
    setStudentRecords({
      studentName: "",
      birthDate: "",
      birthPlace: "",
      nationality: "Togolaise",
      candidateId: "",
      highSchoolOrigin: "",
      city: "",
      bacSerie: "D",
      bacYear: new Date().getFullYear(),
      hasObtainedBac: true,
      userWishedPathway: "sciences_sante",
      wishedFieldOrTrade: "",
      userInterests: [],
      careerAspiration: "",
      grades: {
        francais: { ...emptySub },
        philosophie: { ...emptySub },
        anglais: { ...emptySub },
        histoireGeo: { ...emptySub },
        mathematiques: { ...emptySub },
        physiqueChimie: { ...emptySub },
        svt: { ...emptySub },
        economieCompta: { ...emptySub },
        eps: { ...emptySub },
      },
      psychometrics: {
        dominantRiasec: "",
        riasecScores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        cognitiveIQScore: 100,
        logicScore: 50,
        emotionalResilienceScore: 50,
        interestsSummary: "",
        testDate: new Date().toISOString().split("T")[0],
      },
    });
  };

  // Clear only grades
  const clearAllGrades = () => {
    const emptySub = {
      grade2nde: { t1: undefined, t2: undefined, t3: undefined },
      grade1ere: { t1: undefined, t2: undefined, t3: undefined },
      gradeTle: { t1: undefined, t2: undefined, t3: undefined },
      gradeBac1: undefined,
      gradeBac2: undefined,
    };
    setStudentRecords((prev) => ({
      ...prev,
      grades: {
        francais: { ...emptySub },
        philosophie: { ...emptySub },
        anglais: { ...emptySub },
        histoireGeo: { ...emptySub },
        mathematiques: { ...emptySub },
        physiqueChimie: { ...emptySub },
        svt: { ...emptySub },
        economieCompta: { ...emptySub },
        eps: { ...emptySub },
      },
    }));
  };

  // Restore default demo profile
  const resetToDefaultProfile = () => {
    setStudentRecords(DEFAULT_POST_BAC_RECORDS);
  };

  // Helper for updating specific grades
  const handleGradeChange = (
    subjectKey: keyof PostBacStudentRecords["grades"],
    fieldPath: string,
    value: string
  ) => {
    const numVal = value === "" ? undefined : parseFloat(value);
    setStudentRecords((prev) => {
      const currentSubj = { ...(prev.grades[subjectKey] || {}) };

      if (fieldPath.startsWith("2nde.")) {
        const term = fieldPath.split(".")[1] as "t1" | "t2" | "t3";
        currentSubj.grade2nde = { ...(currentSubj.grade2nde || {}), [term]: numVal };
      } else if (fieldPath.startsWith("1ere.")) {
        const term = fieldPath.split(".")[1] as "t1" | "t2" | "t3";
        currentSubj.grade1ere = { ...(currentSubj.grade1ere || {}), [term]: numVal };
      } else if (fieldPath.startsWith("tle.")) {
        const term = fieldPath.split(".")[1] as "t1" | "t2" | "t3";
        currentSubj.gradeTle = { ...(currentSubj.gradeTle || {}), [term]: numVal };
      } else if (fieldPath === "bac1") {
        currentSubj.gradeBac1 = numVal;
      } else if (fieldPath === "bac2") {
        currentSubj.gradeBac2 = numVal;
      }

      return {
        ...prev,
        grades: {
          ...prev.grades,
          [subjectKey]: currentSubj,
        },
      };
    });
  };

  const subjectList: {
    key: keyof PostBacStudentRecords["grades"];
    label: string;
    icon: any;
    accent: string;
    isHealth?: boolean;
    isTech?: boolean;
    isLaw?: boolean;
  }[] = [
    { key: "mathematiques", label: "Mathématiques", icon: Calculator, accent: "emerald", isTech: true, isHealth: true },
    { key: "physiqueChimie", label: "Physique-Chimie (PCT)", icon: Zap, accent: "blue", isTech: true, isHealth: true },
    { key: "svt", label: "Sciences de la Vie & Terre (SVT)", icon: Stethoscope, accent: "teal", isHealth: true },
    { key: "francais", label: "Français & Littérature", icon: BookOpen, accent: "amber", isLaw: true },
    { key: "philosophie", label: "Philosophie", icon: BrainCircuit, accent: "purple", isLaw: true },
    { key: "anglais", label: "Anglais", icon: Languages, accent: "indigo", isLaw: true, isTech: true },
    { key: "histoireGeo", label: "Histoire-Géographie", icon: Landmark, accent: "orange", isLaw: true },
    { key: "economieCompta", label: "Économie / Comptabilité", icon: TrendingUp, accent: "cyan" },
    { key: "eps", label: "Éducation Physique (EPS)", icon: Award, accent: "slate" },
  ];

  // Filtered fields
  const filteredFields = useMemo(() => {
    return POST_BAC_FIELDS.filter((f) => {
      const matchCat = selectedFieldCategory === "all" || f.category === selectedFieldCategory;
      const matchQuery =
        searchFieldQuery === "" ||
        f.name.toLowerCase().includes(searchFieldQuery.toLowerCase()) ||
        f.shortDescription.toLowerCase().includes(searchFieldQuery.toLowerCase()) ||
        f.careerOutcomes.some((c) => c.toLowerCase().includes(searchFieldQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [searchFieldQuery, selectedFieldCategory]);

  // Filtered trades
  const filteredTrades = useMemo(() => {
    return POST_BAC_APPRENTICESHIP_TRADES.filter((t) => {
      return (
        searchTradeQuery === "" ||
        t.title.toLowerCase().includes(searchTradeQuery.toLowerCase()) ||
        t.domain.toLowerCase().includes(searchTradeQuery.toLowerCase()) ||
        t.shortDescription.toLowerCase().includes(searchTradeQuery.toLowerCase()) ||
        t.careerOpportunities.some((c) => c.toLowerCase().includes(searchTradeQuery.toLowerCase()))
      );
    });
  }, [searchTradeQuery]);

  const handlePrintCertificate = () => {
    setIsReportPreviewMode(false);
    setShowThreePageReportModal(true);
  };

  const handlePreviewReport = () => {
    setIsReportPreviewMode(true);
    setShowThreePageReportModal(true);
  };

  // Mapped academic subjects for the 3-page official certified report
  const academicSubjectRows = useMemo(() => {
    return subjectList.map((subj) => {
      const detail = evaluationResult.subjectDetails[subj.key];
      const rec = studentRecords.grades[subj.key];
      
      const p2nde = rec?.grade2nde ? `2nde: [${rec.grade2nde.t1 ?? '-'}/${rec.grade2nde.t2 ?? '-'}/${rec.grade2nde.t3 ?? '-'}]` : '';
      const p1ere = rec?.grade1ere ? `1ère: [${rec.grade1ere.t1 ?? '-'}/${rec.grade1ere.t2 ?? '-'}/${rec.grade1ere.t3 ?? '-'}]` : '';
      const pTle = rec?.gradeTle ? `Tle: [${rec.gradeTle.t1 ?? '-'}/${rec.gradeTle.t2 ?? '-'}/${rec.gradeTle.t3 ?? '-'}]` : '';
      const periods = [p2nde, p1ere, pTle].filter(Boolean).join(" • ");
      const examNote = `BAC1: ${rec?.gradeBac1 ?? '-'} | BAC2: ${rec?.gradeBac2 ?? '-'}`;
      
      return {
        name: subj.label,
        detailsByPeriod: periods || "Notes trimestrielles intégrées",
        examNote: examNote,
        totalPoints: detail ? detail.totalSum.toFixed(1) : 0,
        notesCount: detail ? detail.count : 0,
        calculatedAverage: detail ? detail.calculatedAverage : 0,
        requiredPassingAvg: 10,
        isEligible: detail ? detail.isPassing10 : false,
        tag: subj.isHealth ? "Pôle Santé" : subj.isTech ? "Pôle Ingénierie" : subj.isLaw ? "Pôle Juridique/Littéraire" : undefined
      };
    });
  }, [evaluationResult, studentRecords, subjectList]);

  // Mapped psychometrics for the 3-page official certified report
  const psychometricTestRows = useMemo(() => {
    const p = studentRecords.psychometrics;
    return [
      {
        testName: "Profil Typologique RIASEC de Holland (50 Questions)",
        scorePct: p.logicScore || 85,
        appreciation: p.dominantRiasec ? `Code dominant : ${p.dominantRiasec}` : "Capacité solide",
        keyObservation: p.interestsSummary || "Affinité marquée pour les sciences appliquées et l'analyse méthodique.",
      },
      {
        testName: "Test d'Efficience Cognitive & Raisonnement Logique",
        scorePct: p.logicScore || 88,
        appreciation: (p.logicScore || 88) >= 75 ? "Capacité très solide" : "Capacité solide",
        keyObservation: `Quotient estimé : ${p.cognitiveIQScore || 124} • Aptitude analytique supérieure`,
      },
      {
        testName: "Test d'Intérêts & Motivations Professionnelles",
        scorePct: 90,
        appreciation: "Capacité très solide",
        keyObservation: "Orientation vocationnelle claire et persévérante",
      },
      {
        testName: "Test de Résilience & Autonomie d'Apprentissage",
        scorePct: p.emotionalResilienceScore || 85,
        appreciation: (p.emotionalResilienceScore || 85) >= 75 ? "Capacité très solide" : "Capacité solide",
        keyObservation: "Autonomie intellectuelle conforme aux exigences universitaires LMD",
      }
    ];
  }, [studentRecords.psychometrics]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Système Officiel d'Orientation Post-BAC • Cabinet Dr BALOGAH</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Orientation Post-BAC & Enseignement Supérieur
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
                Calcul précis des moyennes trimestrielles (2nde, 1ère, Tle) + BAC 1 + BAC 2, évaluation d'éligibilité aux filières universitaires (Santé, Ingénierie, Économie, Droit, Lettres), intégration psychométrique RIASEC et réorientation vers les métiers porteurs.
              </p>
            </div>

            {/* Quick Consultation Badge */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:w-80 shrink-0 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow">
                  <Award className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Dr BALOGAH Dibaataba</h4>
                  <p className="text-[11px] text-amber-400">Conseiller d'Orientation Scolaire & Professionnelle</p>
                </div>
              </div>
              <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-snug">
                « Une orientation réussie harmonise l'excellence académique, le potentiel psychologique et les réalités économiques du marché. »
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-8 border-b border-slate-800/80 pb-px">
            <button
              onClick={() => setActiveSubTab("simulator")}
              className={`px-4 py-2.5 rounded-t-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
                activeSubTab === "simulator"
                  ? "bg-slate-800/80 text-blue-400 border-blue-500 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50"
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Simulateur & Décision Officielle Post-BAC</span>
            </button>

            <button
              onClick={() => setActiveSubTab("fields")}
              className={`px-4 py-2.5 rounded-t-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
                activeSubTab === "fields"
                  ? "bg-slate-800/80 text-blue-400 border-blue-500 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50"
              }`}
            >
              <School className="w-4 h-4" />
              <span>Grandes Filières & Facultés ({POST_BAC_FIELDS.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("trades")}
              className={`px-4 py-2.5 rounded-t-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
                activeSubTab === "trades"
                  ? "bg-slate-800/80 text-blue-400 border-blue-500 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Métiers Porteurs & Apprentissages ({POST_BAC_APPRENTICESHIP_TRADES.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("guide")}
              className={`px-4 py-2.5 rounded-t-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
                activeSubTab === "guide"
                  ? "bg-slate-800/80 text-blue-400 border-blue-500 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Guide Réglementaire & Méthodologie LMD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================================= */}
        {/* TAB 1: SIMULATEUR DE DÉCISION POST-BAC                                   */}
        {/* ========================================================================= */}
        {activeSubTab === "simulator" && (
          <div className="space-y-8">
            {/* Quick Profile Loaders */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Charger un Profil Type pour Test Immédiat :</span>
                </span>
                <span className="text-[11px] text-slate-500 font-sans">
                  Pré-remplit les 3 années du lycée + BAC 1 + BAC 2
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                <button
                  onClick={() => loadPresetProfile("sante")}
                  className="px-3 py-2 rounded-xl bg-teal-950/40 hover:bg-teal-900/50 border border-teal-800/50 text-teal-300 text-xs font-semibold transition-all text-left flex flex-col gap-1 shadow-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Santé / Médecine</span>
                  </span>
                  <span className="text-[10px] text-teal-400/80 font-normal">Série D (Excellence)</span>
                </button>

                <button
                  onClick={() => loadPresetProfile("ingenierie")}
                  className="px-3 py-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/50 text-blue-300 text-xs font-semibold transition-all text-left flex flex-col gap-1 shadow-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Ingénierie & IA</span>
                  </span>
                  <span className="text-[10px] text-blue-400/80 font-normal">Série C / E / Ti</span>
                </button>

                <button
                  onClick={() => loadPresetProfile("droit")}
                  className="px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/50 text-purple-300 text-xs font-semibold transition-all text-left flex flex-col gap-1 shadow-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>Droit & Sciences Po</span>
                  </span>
                  <span className="text-[10px] text-purple-400/80 font-normal">Série A4 / G1</span>
                </button>

                <button
                  onClick={() => loadPresetProfile("eco")}
                  className="px-3 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/50 text-cyan-300 text-xs font-semibold transition-all text-left flex flex-col gap-1 shadow-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Éco & Finance</span>
                  </span>
                  <span className="text-[10px] text-cyan-400/80 font-normal">FASEG / G2 / G3</span>
                </button>

                <button
                  onClick={() => loadPresetProfile("apprentissage_excellence")}
                  className="px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-emerald-300 text-xs font-semibold transition-all text-left flex flex-col gap-1 shadow-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Métier + Éligible</span>
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-normal">Apprentissage avec Mention</span>
                </button>

                <button
                  onClick={() => loadPresetProfile("apprentissage_reorientation")}
                  className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 text-xs font-semibold transition-all text-left flex flex-col gap-1 shadow-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réorientation Métier</span>
                  </span>
                  <span className="text-[10px] text-rose-400/80 font-normal">Accès Métier Porteur</span>
                </button>

                <button
                  onClick={clearEntireForm}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all text-left flex flex-col gap-1 shadow-sm cursor-pointer"
                  title="Vider tous les champs du formulaire"
                >
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Vider le Formulaire</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Remise à zéro complète</span>
                </button>

                <button
                  onClick={resetToDefaultProfile}
                  className="px-3 py-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/50 text-blue-300 text-xs font-semibold transition-all text-left flex flex-col gap-1 shadow-sm cursor-pointer"
                  title="Restaurer l'exemple de démonstration"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Exemple Type</span>
                  </span>
                  <span className="text-[10px] text-blue-400/80 font-normal">Komi Mensah AGBEKO</span>
                </button>
              </div>
            </div>

            {/* Candidate Identity & Psychometrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Identity & Background */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>1. Profil Civil & Scolaire du Candidat Post-BAC</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={clearEntireForm}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs font-semibold border border-slate-800 hover:border-rose-800 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 text-rose-400" />
                      <span>Vider les champs</span>
                    </button>
                    <span className="text-xs text-slate-400 font-mono">Dossier Académique</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Nom & Prénoms</label>
                    <input
                      type="text"
                      value={studentRecords.studentName}
                      onChange={(e) => setStudentRecords({ ...studentRecords, studentName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-sans font-bold"
                      placeholder="Ex: Mensah Agbeko"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Lycée d'Origine & Ville</label>
                    <input
                      type="text"
                      value={studentRecords.highSchoolOrigin}
                      onChange={(e) => setStudentRecords({ ...studentRecords, highSchoolOrigin: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-sans"
                      placeholder="Ex: Lycée de Tokoin, Lomé"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Date de Naissance</label>
                    <input
                      type="text"
                      value={studentRecords.birthDate || ""}
                      onChange={(e) => setStudentRecords({ ...studentRecords, birthDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-sans"
                      placeholder="Ex: 14/05/2005"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Lieu de Naissance & Nationalité</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={studentRecords.birthPlace || ""}
                        onChange={(e) => setStudentRecords({ ...studentRecords, birthPlace: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                        placeholder="Ex: Lomé (Togo)"
                      />
                      <input
                        type="text"
                        value={studentRecords.nationality || ""}
                        onChange={(e) => setStudentRecords({ ...studentRecords, nationality: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                        placeholder="Ex: Togolaise"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Série du Baccalauréat Obtenu</label>
                    <select
                      value={studentRecords.bacSerie}
                      onChange={(e) => setStudentRecords({ ...studentRecords, bacSerie: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="D">Série D (Scientifique & Biologie)</option>
                      <option value="C">Série C (Mathématiques & Sciences Physiques)</option>
                      <option value="A4">Série A4 (Littéraire & Philosophie)</option>
                      <option value="G2">Série G2 (Techniques Quantitatives de Gestion)</option>
                      <option value="G3">Série G3 (Techniques Commerciales)</option>
                      <option value="G1">Série G1 (Secrétariat & Bureautique)</option>
                      <option value="F1">Série F1 (Construction Mécanique)</option>
                      <option value="F2">Série F2 (Électronique)</option>
                      <option value="F3">Série F3 (Électrotechnique)</option>
                      <option value="F4">Série F4 (Génie Civil & Bâtiment)</option>
                      <option value="E">Série E (Mathématiques & Technique)</option>
                      <option value="Ti">Série Ti (Technologies Informatiques)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Orientation / Voie Souhaitée</label>
                    <select
                      value={studentRecords.userWishedPathway}
                      onChange={(e) =>
                        setStudentRecords({
                          ...studentRecords,
                          userWishedPathway: e.target.value as PostBacStudentRecords["userWishedPathway"],
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="sciences_sante">Faculté des Sciences de Santé (Médecine, Pharmacie, etc.)</option>
                      <option value="ingenierie_technologie">Ingénierie, Technologies, Informatique & IA</option>
                      <option value="sciences_eco_gestion">Sciences Économiques & Gestion (FASEG, Finance, Audit)</option>
                      <option value="droit_sciences_sociales">Droit, Sciences Politiques & Sciences Humaines</option>
                      <option value="lettres_langues_arts">Lettres Modernes, Langues, Traduction & Communication</option>
                      <option value="apprentissage_metier_postbac">
                        Apprentissage Professionnel d'un Métier Porteur (BTS / CQP Post-BAC)
                      </option>
                      <option value="indecis">Indécis (Demande une recommandation globale objective)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Aspiration Professionnelle & Métier Visé</label>
                  <input
                    type="text"
                    value={studentRecords.careerAspiration}
                    onChange={(e) => setStudentRecords({ ...studentRecords, careerAspiration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ex: Devenir Médecin Cardiologue, Développeur IA, Magistrat, Technicien Solaire..."
                  />
                </div>
              </div>

              {/* Psychometrics & Personality Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-purple-400" />
                      <span>2. Profil Psychométrique & Tests</span>
                    </h3>
                    <span className="text-xs text-purple-300 font-mono bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-800/40">
                      Dr BALOGAH
                    </span>
                  </div>

                  <div className="space-y-3 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Code Typologique RIASEC :</span>
                      <input
                        type="text"
                        value={studentRecords.psychometrics?.dominantRiasec || "IRS"}
                        onChange={(e) =>
                          setStudentRecords({
                            ...studentRecords,
                            psychometrics: {
                              ...studentRecords.psychometrics,
                              dominantRiasec: e.target.value.toUpperCase(),
                            },
                          })
                        }
                        className="w-24 text-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Score Cognitif & Aptitude Logique :</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {studentRecords.psychometrics?.cognitiveIQScore || 115} pts (QI Estimé)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Index de Résilience Psychologique :</span>
                      <span className="text-xs font-mono font-bold text-blue-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {studentRecords.psychometrics?.emotionalResilienceScore || 80}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 leading-snug">
                      {studentRecords.psychometrics?.interestsSummary || "Motivation forte pour les études supérieures."}
                    </p>
                  </div>
                </div>

                {onGoToTests && (
                  <button
                    onClick={onGoToTests}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Passer ou Réviser mes 10 Tests Psychométriques</span>
                  </button>
                )}
              </div>
            </div>

            {/* Academic Grades Input Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    <span>3. Saisie Trimestrielle des Notes (2nde, 1ère, Tle) + Notes Examens BAC 1 & BAC 2</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Conformément aux directives : Saisissez 2 ou 3 trimestres par année (T1, T2, T3) ainsi que les notes d'examens officielles.
                  </p>
                </div>

                {/* Switch view mode */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setGradeInputMode("matrix")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      gradeInputMode === "matrix"
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Vue Tableau Matriciel
                  </button>
                  <button
                    onClick={() => setGradeInputMode("tabs")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      gradeInputMode === "tabs"
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Par Niveau de Classe
                  </button>
                </div>
              </div>

              {/* MATRIX VIEW */}
              {gradeInputMode === "matrix" && (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                  <table className="w-full text-left text-xs border-collapse min-w-[950px]">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                        <th className="py-3 px-3 w-48">Matière Requise</th>
                        <th className="py-3 px-2 text-center bg-slate-900/40" colSpan={3}>
                          Seconde (2nde)
                        </th>
                        <th className="py-3 px-2 text-center bg-slate-900/60" colSpan={3}>
                          Première (1ère)
                        </th>
                        <th className="py-3 px-2 text-center bg-slate-900/40" colSpan={3}>
                          Terminale (Tle)
                        </th>
                        <th className="py-3 px-2 text-center text-amber-300 bg-amber-950/20" colSpan={2}>
                          Examens Officiels
                        </th>
                        <th className="py-3 px-3 text-right bg-blue-950/20 text-blue-300">
                          Moyenne / 20
                        </th>
                      </tr>
                      <tr className="bg-slate-950/90 text-slate-500 border-b border-slate-800 text-[11px] font-mono">
                        <th className="py-1 px-3"></th>
                        <th className="py-1 px-1 text-center w-12">T1</th>
                        <th className="py-1 px-1 text-center w-12">T2</th>
                        <th className="py-1 px-1 text-center w-12">T3</th>
                        <th className="py-1 px-1 text-center w-12">T1</th>
                        <th className="py-1 px-1 text-center w-12">T2</th>
                        <th className="py-1 px-1 text-center w-12">T3</th>
                        <th className="py-1 px-1 text-center w-12">T1</th>
                        <th className="py-1 px-1 text-center w-12">T2</th>
                        <th className="py-1 px-1 text-center w-12">T3</th>
                        <th className="py-1 px-1 text-center w-14 text-amber-400">BAC 1</th>
                        <th className="py-1 px-1 text-center w-14 text-amber-400">BAC 2</th>
                        <th className="py-1 px-3 text-right">Décisionnelle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {subjectList.map((subj) => {
                        const rec = studentRecords.grades[subj.key];
                        const detail = evaluationResult.subjectDetails[subj.key];
                        const isPassing = (detail?.calculatedAverage || 0) >= 10;

                        return (
                          <tr key={subj.key} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full inline-block ${
                                  subj.isHealth ? "bg-teal-400" : subj.isTech ? "bg-blue-400" : subj.isLaw ? "bg-purple-400" : "bg-slate-500"
                                }`}
                              />
                              <span>{subj.label}</span>
                            </td>

                            {/* 2nde */}
                            <td className="py-1 px-1 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.grade2nde?.t1 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "2nde.t1", e.target.value)}
                                className="w-11 text-center bg-slate-900 border border-slate-700/80 rounded py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                                placeholder="-"
                              />
                            </td>
                            <td className="py-1 px-1 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.grade2nde?.t2 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "2nde.t2", e.target.value)}
                                className="w-11 text-center bg-slate-900 border border-slate-700/80 rounded py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                                placeholder="-"
                              />
                            </td>
                            <td className="py-1 px-1 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.grade2nde?.t3 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "2nde.t3", e.target.value)}
                                className="w-11 text-center bg-slate-900 border border-slate-700/80 rounded py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                                placeholder="-"
                              />
                            </td>

                            {/* 1ère */}
                            <td className="py-1 px-1 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.grade1ere?.t1 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "1ere.t1", e.target.value)}
                                className="w-11 text-center bg-slate-900 border border-slate-700/80 rounded py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                                placeholder="-"
                              />
                            </td>
                            <td className="py-1 px-1 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.grade1ere?.t2 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "1ere.t2", e.target.value)}
                                className="w-11 text-center bg-slate-900 border border-slate-700/80 rounded py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                                placeholder="-"
                              />
                            </td>
                            <td className="py-1 px-1 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.grade1ere?.t3 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "1ere.t3", e.target.value)}
                                className="w-11 text-center bg-slate-900 border border-slate-700/80 rounded py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                                placeholder="-"
                              />
                            </td>

                            {/* Terminale */}
                            <td className="py-1 px-1 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.gradeTle?.t1 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "tle.t1", e.target.value)}
                                className="w-11 text-center bg-slate-900 border border-slate-700/80 rounded py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                                placeholder="-"
                              />
                            </td>
                            <td className="py-1 px-1 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.gradeTle?.t2 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "tle.t2", e.target.value)}
                                className="w-11 text-center bg-slate-900 border border-slate-700/80 rounded py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                                placeholder="-"
                              />
                            </td>
                            <td className="py-1 px-1 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.gradeTle?.t3 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "tle.t3", e.target.value)}
                                className="w-11 text-center bg-slate-900 border border-slate-700/80 rounded py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                                placeholder="-"
                              />
                            </td>

                            {/* BAC 1 & BAC 2 */}
                            <td className="py-1 px-1 text-center bg-amber-950/20">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.gradeBac1 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "bac1", e.target.value)}
                                className="w-12 text-center bg-slate-950 border border-amber-500/50 rounded py-1 text-xs text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
                                placeholder="BAC 1"
                              />
                            </td>
                            <td className="py-1 px-1 text-center bg-amber-950/20">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                value={rec?.gradeBac2 ?? ""}
                                onChange={(e) => handleGradeChange(subj.key, "bac2", e.target.value)}
                                className="w-12 text-center bg-slate-950 border border-amber-500/50 rounded py-1 text-xs text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
                                placeholder="BAC 2"
                              />
                            </td>

                            {/* Average */}
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-sm bg-slate-900/30">
                              <span
                                className={`px-2 py-0.5 rounded-lg inline-block ${
                                  isPassing
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                }`}
                              >
                                {detail?.calculatedAverage.toFixed(2) || "0.00"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TABS VIEW */}
              {gradeInputMode === "tabs" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
                    {(["2nde", "1ere", "tle", "bac"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setActiveClassTab(lvl)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                          activeClassTab === lvl
                            ? "bg-blue-600 text-white shadow"
                            : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {lvl === "2nde"
                          ? "Classe de Seconde (2nde)"
                          : lvl === "1ere"
                          ? "Classe de Première (1ère)"
                          : lvl === "tle"
                          ? "Classe de Terminale (Tle)"
                          : "Examens BAC 1 & BAC 2"}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjectList.map((subj) => {
                      const rec = studentRecords.grades[subj.key];
                      const detail = evaluationResult.subjectDetails[subj.key];

                      return (
                        <div
                          key={subj.key}
                          className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3 shadow"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-white">{subj.label}</span>
                            <span className="text-xs font-mono font-bold text-blue-400">
                              Moy: {detail?.calculatedAverage.toFixed(2) || "0.00"}/20
                            </span>
                          </div>

                          {activeClassTab === "2nde" && (
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-500">T1</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.grade2nde?.t1 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "2nde.t1", e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500">T2</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.grade2nde?.t2 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "2nde.t2", e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500">T3</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.grade2nde?.t3 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "2nde.t3", e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
                                />
                              </div>
                            </div>
                          )}

                          {activeClassTab === "1ere" && (
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-500">T1</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.grade1ere?.t1 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "1ere.t1", e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500">T2</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.grade1ere?.t2 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "1ere.t2", e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500">T3</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.grade1ere?.t3 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "1ere.t3", e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
                                />
                              </div>
                            </div>
                          )}

                          {activeClassTab === "tle" && (
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-500">T1</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.gradeTle?.t1 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "tle.t1", e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500">T2</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.gradeTle?.t2 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "tle.t2", e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500">T3</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.gradeTle?.t3 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "tle.t3", e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center"
                                />
                              </div>
                            </div>
                          )}

                          {activeClassTab === "bac" && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-amber-400 font-bold">Note BAC 1</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.gradeBac1 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "bac1", e.target.value)}
                                  className="w-full bg-slate-900 border border-amber-500/50 rounded px-2 py-1 text-xs text-amber-300 font-mono text-center font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-amber-400 font-bold">Note BAC 2</label>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={rec?.gradeBac2 ?? ""}
                                  onChange={(e) => handleGradeChange(subj.key, "bac2", e.target.value)}
                                  className="w-full bg-slate-900 border border-amber-500/50 rounded px-2 py-1 text-xs text-amber-300 font-mono text-center font-bold"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* OFFICIAL EVALUATION & ORIENTATION REPORT                                  */}
            {/* ========================================================================= */}
            <div className="bg-slate-900 border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Official Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-slate-900 flex items-center justify-center text-white font-black text-xl shadow-lg border border-blue-400/30">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                      RÉPUBLIQUE DU TOGO & ESPACE CEDEAO / AFRIQUE
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Décision Officielle d'Orientation Post-BAC
                    </h2>
                    <p className="text-xs text-slate-400">
                      Rapport établi pour <strong>{evaluationResult.studentName}</strong> • Baccalauréat Série <strong>{evaluationResult.bacSerie}</strong> ({studentRecords.bacYear})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handlePreviewReport}
                    className="px-4 py-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 border border-indigo-500/50 text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
                    title="Prévisualiser le rapport officiel A4 et vérifier les sauts de page"
                  >
                    <Eye className="w-4 h-4 text-amber-300" />
                    <span>Prévisualiser le rapport</span>
                  </button>

                  <button
                    onClick={handlePrintCertificate}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>Générer le Rapport Certifié (3 Pages)</span>
                  </button>

                  {onGoToAICounselor && (
                    <button
                      onClick={onGoToAICounselor}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Consulter Dr BALOGAH</span>
                    </button>
                  )}
                </div>
              </div>

              {/* DECISION SUMMARY BANNER */}
              <div
                className={`p-6 rounded-2xl border ${
                  evaluationResult.recommendedDecisionType === "APPRENTISSAGE_EXCELLENCE_AVEC_MENTION_ETUDES_POSSIBLES"
                    ? "bg-emerald-950/50 border-emerald-500/50"
                    : evaluationResult.eligibleFields.length > 0
                    ? "bg-blue-950/40 border-blue-500/40"
                    : "bg-amber-950/40 border-amber-500/40"
                } space-y-4`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0">
                    {evaluationResult.recommendedDecisionType === "APPRENTISSAGE_EXCELLENCE_AVEC_MENTION_ETUDES_POSSIBLES" ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    ) : evaluationResult.eligibleFields.length > 0 ? (
                      <CheckCircle2 className="w-8 h-8 text-blue-400" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-amber-400" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                        Statut de Décision
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Moyenne Cumulative Générale : <strong>{evaluationResult.globalAcademicAverage}/20</strong>
                      </span>
                      <span className="text-xs text-purple-300 font-mono">
                        • RIASEC : <strong>{evaluationResult.psychometricConcordance.dominantRiasec}</strong> ({evaluationResult.psychometricConcordance.alignmentScore}% d'alignement)
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white">
                      {evaluationResult.recommendedDecisionType === "APPRENTISSAGE_EXCELLENCE_AVEC_MENTION_ETUDES_POSSIBLES"
                        ? "ACCORD POUR APPRENTISSAGE MÉTIER PORTEUR • AVEC MENTION D'ÉLIGIBILITÉ AUX ÉTUDES SUPÉRIEURES"
                        : evaluationResult.eligibleFields.length > 0
                        ? `ACCORD FAVORABLE POUR L'ENSEIGNEMENT SUPÉRIEUR (${evaluationResult.eligibleFields.length} Filières Éligibles)`
                        : "REDIRECTION CONSEILLÉE VERS UN APPRENTISSAGE DANS UN MÉTIER PORTEUR POST-BAC"}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {evaluationResult.officialAdviceSummary}
                    </p>
                  </div>
                </div>

                {/* Justification bullets */}
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                  {evaluationResult.decisionJustification.map((justif, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{justif}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DETAILED MATHEMATICAL TABLE (TRIMESTERS + BAC 1 + BAC 2) */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <span>Détail Mathématique du Calcul des Moyennes Décisionnelles</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    Formule : Somme des notes ÷ Total notes saisies
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs border-collapse min-w-[780px]">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 font-semibold">
                        <th className="py-2.5 px-3">Matière</th>
                        <th className="py-2.5 px-2 text-center">2nde (T1|T2|T3)</th>
                        <th className="py-2.5 px-2 text-center">1ère (T1|T2|T3)</th>
                        <th className="py-2.5 px-2 text-center">Tle (T1|T2|T3)</th>
                        <th className="py-2.5 px-2 text-center text-amber-400">BAC 1</th>
                        <th className="py-2.5 px-2 text-center text-amber-400">BAC 2</th>
                        <th className="py-2.5 px-2 text-center">Total / Nb</th>
                        <th className="py-2.5 px-3 text-right">Moyenne Finale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
                      {subjectList.map((subj) => {
                        const rec = studentRecords.grades[subj.key];
                        const detail = evaluationResult.subjectDetails[subj.key];
                        const isPassing = (detail?.calculatedAverage || 0) >= 10;

                        const formatTerms = (yt?: { t1?: number | null; t2?: number | null; t3?: number | null }) => {
                          if (!yt) return "-";
                          return [yt.t1 ?? "•", yt.t2 ?? "•", yt.t3 ?? "•"].join(" | ");
                        };

                        return (
                          <tr key={subj.key} className="hover:bg-slate-900/30">
                            <td className="py-2 px-3 font-sans font-semibold text-white">
                              {subj.label}
                            </td>
                            <td className="py-2 px-2 text-center text-slate-400">
                              {formatTerms(rec?.grade2nde)}
                            </td>
                            <td className="py-2 px-2 text-center text-slate-400">
                              {formatTerms(rec?.grade1ere)}
                            </td>
                            <td className="py-2 px-2 text-center text-slate-400">
                              {formatTerms(rec?.gradeTle)}
                            </td>
                            <td className="py-2 px-2 text-center font-bold text-amber-300">
                              {rec?.gradeBac1 ?? "-"}
                            </td>
                            <td className="py-2 px-2 text-center font-bold text-amber-300">
                              {rec?.gradeBac2 ?? "-"}
                            </td>
                            <td className="py-2 px-2 text-center text-slate-400">
                              {detail?.totalSum} ÷ {detail?.count}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-xs">
                              <span
                                className={`px-2 py-0.5 rounded-lg ${
                                  isPassing
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                }`}
                              >
                                {detail?.calculatedAverage.toFixed(2) || "0.00"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ELIGIBLE HIGHER EDUCATION FIELDS */}
              {evaluationResult.eligibleFields.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <School className="w-4 h-4 text-blue-400" />
                      <span>Filières Universitaires Remplissant Toutes les Conditions ({evaluationResult.eligibleFields.length})</span>
                    </h3>
                    <span className="text-xs text-emerald-400 font-semibold">Conditions 100% Validées</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evaluationResult.eligibleFields.map((field) => (
                      <div
                        key={field.id}
                        className="bg-slate-950 p-5 rounded-2xl border border-blue-500/30 space-y-3 hover:border-blue-400/60 transition-all shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-800/40">
                              {field.categoryLabel}
                            </span>
                            <h4 className="text-base font-bold text-white mt-1">{field.name}</h4>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/40 shrink-0">
                            {field.code}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{field.shortDescription}</p>

                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-[11px]">
                          <span className="font-semibold text-slate-400">Établissements de Référence :</span>
                          <p className="text-slate-200">{field.targetInstitutions.join(" • ")}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                          <span>Perspectives : <strong>{field.employmentProspects}</strong></span>
                          <span className="text-blue-300 font-semibold">{field.careerOutcomes[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INELIGIBLE FIELDS (REASON FOR REJECTION / REDIRECTION) */}
              {evaluationResult.ineligibleFields.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Filières Universitaires Non Éligibles ({evaluationResult.ineligibleFields.length}) & Motifs d'Insuffisance</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evaluationResult.ineligibleFields.slice(0, 4).map(({ field, reasons }) => (
                      <div
                        key={field.id}
                        className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-2 opacity-90"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-200">{field.name}</h4>
                          <span className="text-[10px] text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">
                            Non Recommandé
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {reasons.map((r, i) => (
                            <li key={i} className="text-[11px] text-rose-300/90 flex items-start gap-1.5">
                              <span className="text-rose-500">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RECOMMENDED HIGH-DEMAND APPRENTICESHIP TRADES POST-BAC */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      <span>Métiers Porteurs & Apprentissages Post-BAC à Haut Potentiel</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Parcours d'insertion rapide, certifications professionnelles (BTS / CQP) et entrepreneuriat.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSubTab("trades")}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <span>Voir tout</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluationResult.recommendedApprenticeshipTrades.slice(0, 4).map((trade) => (
                    <div
                      key={trade.id}
                      className="bg-slate-950 p-5 rounded-2xl border border-emerald-800/40 hover:border-emerald-500/60 transition-all space-y-3 shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                            {trade.diplomaOrCert} • {trade.trainingDuration}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1">{trade.title}</h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-800/40 shrink-0">
                          Score Pro: {trade.entrepreneurshipScore}/10
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{trade.shortDescription}</p>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Revenus Estimés :</span>
                          <strong className="text-emerald-300 font-mono">{trade.averageStartingSalaryFCFA}</strong>
                        </div>
                        <div className="text-slate-300">
                          <strong>Débouchés :</strong> {trade.careerOpportunities.slice(0, 2).join(", ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CABINET SEAL & SIGNATURE BLOCK */}
              <div className="pt-6 border-t-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Authentification & Sceau du Cabinet
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Fiche certifiée conforme aux barèmes psychométriques et aux référentiels académiques LMD.
                  </p>
                  <p className="text-[11px] font-mono text-slate-500">
                    Émis le {evaluationResult.date} • Réf: OA-BAC-{studentRecords.bacYear}-{Math.floor(Math.random() * 8999 + 1000)}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-xs font-bold text-amber-400">Cabinet Conseil Dr BALOGAH Dibaataba</div>
                  <div className="text-[11px] text-slate-400">Spécialiste des Sciences de l'Éducation & Orientation</div>
                  <div className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold mt-1">
                    ✓ SIGNÉ & CERTIFIÉ CONFORME
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: RÉPERTOIRE DES GRANDES FILIÈRES POST-BAC                           */}
        {/* ========================================================================= */}
        {activeSubTab === "fields" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchFieldQuery}
                    onChange={(e) => setSearchFieldQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Rechercher une filière (ex: Médecine, Informatique, Droit, FASEG, Génie Civil)..."
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                  {[
                    { id: "all", label: "Toutes les Filières" },
                    { id: "sante_medecine", label: "Santé & Médecine" },
                    { id: "ingenierie_informatique", label: "Ingénierie & Informatique" },
                    { id: "eco_gestion", label: "Économie & Gestion" },
                    { id: "droit_politique_social", label: "Droit & Sciences Po" },
                    { id: "lettres_langues_communication", label: "Lettres & Communication" },
                    { id: "agronomie_environnement", label: "Agronomie & Agro-industrie" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedFieldCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedFieldCategory === cat.id
                          ? "bg-blue-600 text-white shadow"
                          : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFields.map((field) => (
                <div
                  key={field.id}
                  className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 space-y-4 flex flex-col justify-between transition-all shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-800/40">
                        {field.categoryLabel}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {field.code}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-tight">{field.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{field.shortDescription}</p>

                    {/* Dominant subjects & coefficients */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Disciplines Maîtresses & Coefficients :
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {field.dominantSubjects.map((d, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300"
                          >
                            {d.subject} (Coef {d.coefficient})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                      <span className="text-[11px] font-bold text-emerald-400">Conditions Requises :</span>
                      <p className="text-slate-300 text-[11px]">{field.admissionConditions.formulaExplanation}</p>
                    </div>

                    {/* Target Institutions */}
                    <div className="text-[11px] text-slate-400">
                      <strong>Établissements :</strong> {field.targetInstitutions.slice(0, 3).join(", ")}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Débouché n°1 :</span>
                    <span className="text-emerald-300 font-semibold truncate max-w-[180px]">
                      {field.careerOutcomes[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RÉPERTOIRE DES MÉTIERS PORTEURS POST-BAC                           */}
        {/* ========================================================================= */}
        {activeSubTab === "trades" && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchTradeQuery}
                    onChange={(e) => setSearchTradeQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Rechercher un métier (ex: Solaire, Développeur, Climatisation, Paie, Diagnostic)..."
                  />
                </div>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-800/40 shrink-0">
                  {filteredTrades.length} Formations Pratiques Répertoriées
                </span>
              </div>
            </div>

            {/* Trades Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 space-y-4 flex flex-col justify-between transition-all shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
                        {trade.diplomaOrCert} • {trade.trainingDuration}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        Potentiel Entreprise : {trade.entrepreneurshipScore}/10
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-tight">{trade.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{trade.shortDescription}</p>

                    {/* Key skills */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Compétences Techniques Clés :
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {trade.keySkills.map((sk, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300"
                          >
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Salary & Opportunity */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Revenus Mensuels Estimés :</span>
                        <strong className="text-emerald-300 font-mono">{trade.averageStartingSalaryFCFA}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Croissance du Secteur :</span>
                        <span className="text-blue-300 font-semibold">{trade.growthRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 leading-snug">
                    <strong className="text-amber-400">Pourquoi Choisir ce Métier :</strong> {trade.whyRecommended}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GUIDE RÉGLEMENTAIRE & MÉTHODOLOGIE POST-BAC                         */}
        {/* ========================================================================= */}
        {activeSubTab === "guide" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl max-w-5xl mx-auto">
            <div className="space-y-3 pb-6 border-b border-slate-800">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase">
                <BookOpen className="w-4 h-4" />
                <span>Cadre Méthodologique & Réglementaire • Dr BALOGAH Dibaataba</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Les Principes Directeurs de l'Orientation Post-BAC & de l'Enseignement Supérieur
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Guide de référence pour les bacheliers, parents et conseillers d'orientation de l'espace CEDEAO et CAMES.
              </p>
            </div>

            {/* Pillar 1: Calculation formula */}
            <div className="space-y-3 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-emerald-400">
                <Calculator className="w-4 h-4" />
                <span>1. La Formule Mathématique Cumulative Post-BAC</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Le système du Cabinet Dr BALOGAH intègre <strong>tous les trimestres de la Seconde, Première et Terminale (T1, T2, T3)</strong> ainsi que les notes officielles des examens du <strong>BAC 1 (Probatoire)</strong> et du <strong>BAC 2</strong> pour chaque discipline déterminante.
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-center text-emerald-300 space-y-1">
                <div>Moyenne Décisionnelle = ( Σ Notes Trimestrielles [2nde + 1ère + Tle] + Note BAC 1 + Note BAC 2 ) ÷ Nombre Total de Notes Saisies</div>
                <div className="text-[11px] text-slate-400 font-sans">(Soit jusqu'à 11 notes cumulées par matière pour garantir une évaluation robuste et non biaisée par un accident d'examen unique)</div>
              </div>
            </div>

            {/* Pillar 2: LMD System & Conditions */}
            <div className="space-y-3 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-blue-400">
                <GraduationCap className="w-4 h-4" />
                <span>2. Architecture LMD & Conditions de Réussite Universitaire</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Le système <strong>Licence (3 ans) - Master (5 ans) - Doctorat (8 ans)</strong> exige une autonomie intellectuelle stricte. Les facultés de médecine, écoles polytechniques d'ingénieurs et facultés de droit imposent des moyennes seuils rigoureuses pour éviter le taux d'échec massif constaté en 1ère année de fac (souvent supérieur à 60% sans orientation adéquate).
              </p>
            </div>

            {/* Pillar 3: Reorientation & Apprenticeship */}
            <div className="space-y-3 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-amber-400">
                <Briefcase className="w-4 h-4" />
                <span>3. La Règle d'Or de l'Apprentissage & des Métiers Porteurs Post-BAC</span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong>Cas A (Insuffisance de moyennes pour l'université) :</strong> La demande d'accès direct à l'université générale est rejetée avec bienveillance, et l'apprenant est immédiatement guidé vers un métier porteur en tension (BTS, CQP, Titre Pro), lui assurant un emploi concret en 12 à 24 mois.
                </p>
                <p>
                  <strong>Cas B (Choix volontaire d'un métier porteur avec bon dossier scolaire) :</strong> La demande est accordée avec mention d'excellence. L'attestation officielle certifie que le candidat est également éligible aux études supérieures, constituant un profil d'élite combinant maîtrise théorique et leadership technique pratique.
                </p>
              </div>
            </div>

            {/* Pillar 4: Psychometrics */}
            <div className="space-y-3 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-purple-400">
                <BrainCircuit className="w-4 h-4" />
                <span>4. Intégration des Tests Psychométriques & Bilan Holistique</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Les notes scolaires ne représentent qu'une composante du succès. L'évaluation du Dr BALOGAH prend en compte la concordance <strong>RIASEC de Holland</strong> (Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel), l'efficience cognitive, la motivation intrinsèque et la résilience psychologique.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* OFFICIAL 3-PAGE CERTIFIED REPORT MODAL */}
      {showThreePageReportModal && (
        <OfficialCertifiedReport3Pages
          candidate={{
            fullName: studentRecords.studentName || "Le requérant",
            birthDate: studentRecords.birthDate || "14/05/2005",
            birthPlace: studentRecords.birthPlace || "Lomé (Togo)",
            nationality: studentRecords.nationality || "Togolaise",
            candidateId: studentRecords.candidateId || "CAND-2026-BAC-8821",
            schoolOrigin: studentRecords.highSchoolOrigin,
            city: studentRecords.city || "Lomé",
            levelOrSerie: `Baccalauréat Série ${studentRecords.bacSerie} (${studentRecords.bacYear})`,
            orientationType: "POST_BAC",
          }}
          demandSynthesis={{
            requestedPathways: [
              studentRecords.userWishedPathway === "sciences_sante"
                ? "Faculté des Sciences de Santé (Médecine, Pharmacie)"
                : studentRecords.userWishedPathway === "ingenierie_technologie"
                ? "Ingénierie, Technologies & Informatique"
                : studentRecords.userWishedPathway === "sciences_eco_gestion"
                ? "Sciences Économiques & Gestion (FASEG)"
                : studentRecords.userWishedPathway === "droit_sciences_sociales"
                ? "Droit & Sciences Politiques"
                : studentRecords.userWishedPathway === "lettres_langues_arts"
                ? "Lettres Modernes, Langues & Communication"
                : studentRecords.userWishedPathway === "apprentissage_metier_postbac"
                ? "Apprentissage Métier Porteur Post-BAC"
                : "Orientation universitaire générale"
            ],
            primaryAspiration: studentRecords.careerAspiration || "Insertion professionnelle d'excellence",
            wishedTradeOrField: studentRecords.wishedFieldOrTrade || studentRecords.careerAspiration || "Filière universitaire ou métier d'avenir",
            expressedMotivations: `Le requérant ${studentRecords.studentName} sollicite une orientation certifiée post-baccalauréat en adéquation avec son parcours en série ${studentRecords.bacSerie}, ses aptitudes psychométriques et ses aspirations professionnelles.`,
            declaredTalents: studentRecords.userInterests || [],
          }}
          academicRecords={{
            globalAverage: evaluationResult.globalAcademicAverage,
            subjects: academicSubjectRows,
            calculationFormulaExplanation: "Somme cumulée de toutes les notes trimestrielles (2nde, 1ère, Tle) + BAC 1 + BAC 2 divisée par l'effectif de notes saisies.",
          }}
          psychometrics={{
            tests: psychometricTestRows,
            dominantRiasec: studentRecords.psychometrics.dominantRiasec || "IRS",
            psychologicalSummary: `Profil psychologique équilibré de type ${studentRecords.psychometrics.dominantRiasec || "IRS"}. Les tests confirment une aptitude analytique solide (${studentRecords.psychometrics.logicScore || 88}%), une résilience satisfaisante (${studentRecords.psychometrics.emotionalResilienceScore || 85}%) et une motivation intrinsèque adaptée aux cycles universitaires ou d'expertise technique.`,
          }}
          decision={{
            decisionStatus:
              evaluationResult.recommendedDecisionType === "APPRENTISSAGE_EXCELLENCE_AVEC_MENTION_ETUDES_POSSIBLES"
                ? "ACCORD_APPRENTISSAGE_AVEC_MENTION"
                : evaluationResult.eligibleFields.length > 0
                ? "FAVORABLE"
                : "DEFAVORABLE",
            decisionTitle:
              evaluationResult.recommendedDecisionType === "APPRENTISSAGE_EXCELLENCE_AVEC_MENTION_ETUDES_POSSIBLES"
                ? "AVIS TRÈS FAVORABLE • ACCORD APPRENTISSAGE AVEC MENTION D'EXCELLENCE"
                : evaluationResult.eligibleFields.length > 0
                ? `AVIS FAVORABLE • ORIENTATION ENSEIGNEMENT SUPÉRIEUR (${evaluationResult.eligibleFields.length} FILIÈRES ÉLIGIBLES)`
                : "AVIS DÉFAVORABLE POUR L'UNIVERSITÉ GÉNÉRALE • RÉORIENTATION MÉTIER CONSEILLÉE",
            argumentationText: evaluationResult.officialAdviceSummary,
            accessibleStreamsOrFields: evaluationResult.eligibleFields.map((f) => ({
              code: f.code,
              name: f.name,
              category: f.categoryLabel,
              description: f.shortDescription,
              institutionsOrLycees: f.targetInstitutions,
            })),
            alternativeSuggestions: evaluationResult.recommendedApprenticeshipTrades.map((t) => ({
              title: t.title,
              type: t.diplomaOrCert,
              duration: t.trainingDuration,
              incomeEstimate: t.averageStartingSalaryFCFA,
              description: t.shortDescription,
            })),
            documentRef: `OA-CERT-2026-BAC-${Math.floor(Math.random() * 89999 + 10000)}`,
          }}
          initialPreviewMode={isReportPreviewMode}
          onClose={() => {
            setShowThreePageReportModal(false);
            setIsReportPreviewMode(false);
          }}
        />
      )}
    </div>
  );
};

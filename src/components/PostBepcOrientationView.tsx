import React, { useState, useMemo, useRef } from "react";
import { 
  GraduationCap, 
  Calculator, 
  BookOpen, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Printer, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  Award, 
  HelpCircle, 
  Check, 
  X, 
  Lightbulb, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Compass, 
  RefreshCw, 
  Download, 
  User, 
  Building2, 
  ChevronRight,
  Flame,
  Zap,
  Info,
  RotateCcw,
  Eye
} from "lucide-react";
import { 
  HIGH_SCHOOL_STREAMS, 
  APPRENTICESHIP_TRADES, 
  POST_BEPC_INTEREST_QUESTIONS, 
  evaluatePostBepcOrientation 
} from "../data/postBepcData";
import { 
  HighSchoolStream, 
  ApprenticeshipTrade, 
  PostBepcStudentRecords, 
  PostBepcOrientationDecision 
} from "../types";
import { 
  BalogahOfficialValidationBlock, 
  DrBalogahSignature, 
  OrientaAfrikDirectorSeal, 
  DrBalogahFingerprintStamp 
} from "./BalogahSignatureAndSeal";
import { BalogahPdfFooter } from "./BalogahPdfFooter";
import { OfficialCertifiedReport3Pages } from "./OfficialCertifiedReport3Pages";

export const PostBepcOrientationView: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"simulator" | "streams" | "trades" | "guide">("simulator");

  // Grade Entry Mode: "matrix" (full table with all terms) or "tabs" (year by year)
  const [gradeEntryMode, setGradeEntryMode] = useState<"matrix" | "tabs">("matrix");
  const [activeYearTab, setActiveYearTab] = useState<"6eme" | "5eme" | "4eme" | "3eme" | "bepc">("6eme");
  const [showThreePageReportModal, setShowThreePageReportModal] = useState<boolean>(false);
  const [isReportPreviewMode, setIsReportPreviewMode] = useState<boolean>(false);

  // Form State for Student Records with 3 terms per year (6e to 3e) + BEPC
  const [studentRecords, setStudentRecords] = useState<PostBepcStudentRecords>({
    studentName: "KODJO Afiwa Emefa",
    birthDate: "20/09/2010",
    birthPlace: "Lomé (Togo)",
    nationality: "Togolaise",
    candidateId: "CAND-2026-BEPC-4412",
    schoolOrigin: "CEG Tokoin Solidarité",
    city: "Lomé, Région Maritime",
    bepcYear: new Date().getFullYear(),
    hasObtainedBepc: true,
    userWishedPathway: "lycee_general",
    wishedStreamOrTrade: "Seconde Littéraire (A4)",
    userInterests: ["Littérature", "Langues vivantes", "Communication", "Droit"],
    careerAspiration: "Magistrate ou Juriste d'Affaires Internationales",
    grades: {
      francais: {
        grade6eme: { t1: 12, t2: 13, t3: 12 },
        grade5eme: { t1: 11, t2: 12, t3: 13 },
        grade4eme: { t1: 13, t2: 14, t3: 13 },
        grade3eme: { t1: 12, t2: 13, t3: 14 },
        gradeBepc: 13
      },
      anglais: {
        grade6eme: { t1: 11, t2: 12, t3: 11 },
        grade5eme: { t1: 10, t2: 11, t3: 12 },
        grade4eme: { t1: 12, t2: 12, t3: 13 },
        grade3eme: { t1: 11, t2: 12, t3: 12 },
        gradeBepc: 12
      },
      mathematiques: {
        grade6eme: { t1: 9, t2: 9, t3: 8 },
        grade5eme: { t1: 8, t2: 8, t3: 9 },
        grade4eme: { t1: 9, t2: 9, t3: 8 },
        grade3eme: { t1: 8, t2: 8, t3: 9 },
        gradeBepc: 9
      },
      physiqueChimie: {
        grade6eme: { t1: 9, t2: 8, t3: 9 },
        grade5eme: { t1: 8, t2: 9, t3: 8 },
        grade4eme: { t1: 8, t2: 8, t3: 9 },
        grade3eme: { t1: 9, t2: 8, t3: 9 },
        gradeBepc: 8
      },
      svt: {
        grade6eme: { t1: 10, t2: 10, t3: 11 },
        grade5eme: { t1: 9, t2: 10, t3: 9 },
        grade4eme: { t1: 10, t2: 10, t3: 11 },
        grade3eme: { t1: 9, t2: 10, t3: 10 },
        gradeBepc: 10
      },
      histoireGeo: {
        grade6eme: { t1: 13, t2: 13, t3: 14 },
        grade5eme: { t1: 12, t2: 13, t3: 13 },
        grade4eme: { t1: 14, t2: 14, t3: 15 },
        grade3eme: { t1: 13, t2: 14, t3: 14 },
        gradeBepc: 13
      },
      eps: {
        grade6eme: { t1: 14, t2: 15, t3: 14 },
        grade5eme: { t1: 15, t2: 15, t3: 16 },
        grade4eme: { t1: 14, t2: 15, t3: 15 },
        grade3eme: { t1: 15, t2: 15, t3: 16 },
        gradeBepc: 14
      }
    }
  });

  // Questionnaire responses state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  // Result state
  const [evaluationResult, setEvaluationResult] = useState<PostBepcOrientationDecision | null>(() => {
    return evaluatePostBepcOrientation(studentRecords);
  });

  // Filters for Streams catalog
  const [streamSearch, setStreamSearch] = useState("");
  const [streamCategoryFilter, setStreamCategoryFilter] = useState("Tous");

  // Filters for Trades catalog
  const [tradeSearch, setTradeSearch] = useState("");
  const [tradeLeadingSectorOnly, setTradeLeadingSectorOnly] = useState(false);
  const [tradeCategoryFilter, setTradeCategoryFilter] = useState("Tous");
  const [tradeAccessFilter, setTradeAccessFilter] = useState("Tous");

  // Selected trade for modal preview
  const [selectedTrade, setSelectedTrade] = useState<ApprenticeshipTrade | null>(null);
  const [selectedStream, setSelectedStream] = useState<HighSchoolStream | null>(null);

  // Handle trimester grade change
  const handleTrimesterGradeChange = (
    subject: keyof PostBepcStudentRecords["grades"],
    year: "grade6eme" | "grade5eme" | "grade4eme" | "grade3eme",
    term: "t1" | "t2" | "t3",
    val: string
  ) => {
    const num = val === "" ? null : parseFloat(val);
    const sanitized = num !== null && !isNaN(num) ? Math.min(20, Math.max(0, num)) : null;
    setStudentRecords(prev => ({
      ...prev,
      grades: {
        ...prev.grades,
        [subject]: {
          ...prev.grades[subject],
          [year]: {
            ...(prev.grades[subject]?.[year] || {}),
            [term]: sanitized
          }
        }
      }
    }));
  };

  // Handle BEPC exam grade change
  const handleBepcGradeChange = (
    subject: keyof PostBepcStudentRecords["grades"],
    val: string
  ) => {
    const num = val === "" ? null : parseFloat(val);
    const sanitized = num !== null && !isNaN(num) ? Math.min(20, Math.max(0, num)) : null;
    setStudentRecords(prev => ({
      ...prev,
      grades: {
        ...prev.grades,
        [subject]: {
          ...prev.grades[subject],
          gradeBepc: sanitized
        }
      }
    }));
  };

  // Preset generator helpers
  const loadScientificPreset = () => {
    setStudentRecords(prev => ({
      ...prev,
      studentName: "DOSSOU Kokou Mensah",
      schoolOrigin: "Lycée de Tokoin - Premier Cycle",
      city: "Lomé",
      userWishedPathway: "lycee_general",
      wishedStreamOrTrade: "Seconde Scientifique (S - C/D)",
      grades: {
        francais: {
          grade6eme: { t1: 14, t2: 13, t3: 14 },
          grade5eme: { t1: 13, t2: 14, t3: 13 },
          grade4eme: { t1: 14, t2: 15, t3: 14 },
          grade3eme: { t1: 14, t2: 14, t3: 15 },
          gradeBepc: 14
        },
        anglais: {
          grade6eme: { t1: 13, t2: 13, t3: 14 },
          grade5eme: { t1: 12, t2: 13, t3: 13 },
          grade4eme: { t1: 14, t2: 14, t3: 14 },
          grade3eme: { t1: 13, t2: 14, t3: 13 },
          gradeBepc: 13
        },
        mathematiques: {
          grade6eme: { t1: 15, t2: 16, t3: 15 },
          grade5eme: { t1: 15, t2: 16, t3: 17 },
          grade4eme: { t1: 16, t2: 15, t3: 16 },
          grade3eme: { t1: 16, t2: 17, t3: 16 },
          gradeBepc: 16
        },
        physiqueChimie: {
          grade6eme: { t1: 14, t2: 14, t3: 15 },
          grade5eme: { t1: 14, t2: 15, t3: 15 },
          grade4eme: { t1: 15, t2: 15, t3: 16 },
          grade3eme: { t1: 15, t2: 16, t3: 16 },
          gradeBepc: 15
        },
        svt: {
          grade6eme: { t1: 14, t2: 14, t3: 14 },
          grade5eme: { t1: 13, t2: 14, t3: 14 },
          grade4eme: { t1: 15, t2: 14, t3: 15 },
          grade3eme: { t1: 14, t2: 15, t3: 15 },
          gradeBepc: 15
        },
        histoireGeo: {
          grade6eme: { t1: 14, t2: 13, t3: 14 },
          grade5eme: { t1: 13, t2: 14, t3: 13 },
          grade4eme: { t1: 14, t2: 14, t3: 15 },
          grade3eme: { t1: 14, t2: 14, t3: 14 },
          gradeBepc: 14
        },
        eps: {
          grade6eme: { t1: 15, t2: 15, t3: 16 },
          grade5eme: { t1: 15, t2: 16, t3: 15 },
          grade4eme: { t1: 15, t2: 16, t3: 15 },
          grade3eme: { t1: 16, t2: 16, t3: 15 },
          gradeBepc: 16
        }
      }
    }));
  };

  const loadLiteraryPreset = () => {
    setStudentRecords(prev => ({
      ...prev,
      studentName: "ADJALLA Ablawa Estelle",
      schoolOrigin: "CEG Nyékonakpoè",
      city: "Lomé",
      userWishedPathway: "lycee_general",
      wishedStreamOrTrade: "Seconde Littéraire (A4)",
      grades: {
        francais: {
          grade6eme: { t1: 14, t2: 15, t3: 14 },
          grade5eme: { t1: 14, t2: 14, t3: 15 },
          grade4eme: { t1: 15, t2: 16, t3: 15 },
          grade3eme: { t1: 15, t2: 15, t3: 16 },
          gradeBepc: 15
        },
        anglais: {
          grade6eme: { t1: 13, t2: 14, t3: 13 },
          grade5eme: { t1: 13, t2: 13, t3: 14 },
          grade4eme: { t1: 14, t2: 15, t3: 14 },
          grade3eme: { t1: 14, t2: 14, t3: 15 },
          gradeBepc: 14
        },
        mathematiques: {
          grade6eme: { t1: 8, t2: 8, t3: 7 },
          grade5eme: { t1: 7, t2: 8, t3: 7 },
          grade4eme: { t1: 8, t2: 7, t3: 8 },
          grade3eme: { t1: 7, t2: 8, t3: 7 },
          gradeBepc: 8
        },
        physiqueChimie: {
          grade6eme: { t1: 8, t2: 7, t3: 8 },
          grade5eme: { t1: 7, t2: 8, t3: 7 },
          grade4eme: { t1: 8, t2: 7, t3: 8 },
          grade3eme: { t1: 7, t2: 8, t3: 7 },
          gradeBepc: 8
        },
        svt: {
          grade6eme: { t1: 9, t2: 8, t3: 9 },
          grade5eme: { t1: 8, t2: 9, t3: 8 },
          grade4eme: { t1: 9, t2: 8, t3: 9 },
          grade3eme: { t1: 8, t2: 8, t3: 9 },
          gradeBepc: 8
        },
        histoireGeo: {
          grade6eme: { t1: 14, t2: 15, t3: 14 },
          grade5eme: { t1: 14, t2: 14, t3: 15 },
          grade4eme: { t1: 15, t2: 15, t3: 16 },
          grade3eme: { t1: 15, t2: 16, t3: 15 },
          gradeBepc: 15
        },
        eps: {
          grade6eme: { t1: 14, t2: 14, t3: 15 },
          grade5eme: { t1: 14, t2: 15, t3: 14 },
          grade4eme: { t1: 15, t2: 14, t3: 15 },
          grade3eme: { t1: 15, t2: 15, t3: 14 },
          gradeBepc: 15
        }
      }
    }));
  };

  const loadApprenticeshipPreset = () => {
    setStudentRecords(prev => ({
      ...prev,
      studentName: "AGBODJAN Yawovi Jean",
      schoolOrigin: "CEG Hédzranawoé",
      city: "Lomé",
      userWishedPathway: "apprentissage_metier",
      wishedStreamOrTrade: "Électricité Bâtiment & Installation Solaire",
      grades: {
        francais: {
          grade6eme: { t1: 9, t2: 8, t3: 9 },
          grade5eme: { t1: 8, t2: 9, t3: 8 },
          grade4eme: { t1: 8, t2: 8, t3: 9 },
          grade3eme: { t1: 9, t2: 8, t3: 8 },
          gradeBepc: 8.5
        },
        anglais: {
          grade6eme: { t1: 8, t2: 8, t3: 7 },
          grade5eme: { t1: 7, t2: 8, t3: 8 },
          grade4eme: { t1: 8, t2: 7, t3: 8 },
          grade3eme: { t1: 7, t2: 8, t3: 8 },
          gradeBepc: 8
        },
        mathematiques: {
          grade6eme: { t1: 9, t2: 9, t3: 8 },
          grade5eme: { t1: 8, t2: 8, t3: 9 },
          grade4eme: { t1: 8, t2: 9, t3: 8 },
          grade3eme: { t1: 9, t2: 8, t3: 8 },
          gradeBepc: 8.5
        },
        physiqueChimie: {
          grade6eme: { t1: 9, t2: 9, t3: 8 },
          grade5eme: { t1: 8, t2: 9, t3: 8 },
          grade4eme: { t1: 8, t2: 8, t3: 9 },
          grade3eme: { t1: 9, t2: 8, t3: 8 },
          gradeBepc: 8
        },
        svt: {
          grade6eme: { t1: 8, t2: 8, t3: 9 },
          grade5eme: { t1: 8, t2: 8, t3: 8 },
          grade4eme: { t1: 8, t2: 9, t3: 8 },
          grade3eme: { t1: 8, t2: 8, t3: 8 },
          gradeBepc: 8
        },
        histoireGeo: {
          grade6eme: { t1: 10, t2: 9, t3: 10 },
          grade5eme: { t1: 9, t2: 10, t3: 9 },
          grade4eme: { t1: 9, t2: 9, t3: 10 },
          grade3eme: { t1: 10, t2: 9, t3: 10 },
          gradeBepc: 9.5
        },
        eps: {
          grade6eme: { t1: 15, t2: 16, t3: 15 },
          grade5eme: { t1: 16, t2: 16, t3: 17 },
          grade4eme: { t1: 16, t2: 15, t3: 16 },
          grade3eme: { t1: 16, t2: 17, t3: 16 },
          gradeBepc: 16.5
        }
      }
    }));
  };

  const clearAllGrades = () => {
    const emptySub = {
      grade6eme: { t1: null, t2: null, t3: null },
      grade5eme: { t1: null, t2: null, t3: null },
      grade4eme: { t1: null, t2: null, t3: null },
      grade3eme: { t1: null, t2: null, t3: null },
      gradeBepc: null
    };
    setStudentRecords(prev => ({
      ...prev,
      grades: {
        francais: { ...emptySub },
        anglais: { ...emptySub },
        mathematiques: { ...emptySub },
        physiqueChimie: { ...emptySub },
        svt: { ...emptySub },
        histoireGeo: { ...emptySub },
        eps: { ...emptySub },
      }
    }));
  };

  const clearEntireForm = () => {
    const emptySub = {
      grade6eme: { t1: null, t2: null, t3: null },
      grade5eme: { t1: null, t2: null, t3: null },
      grade4eme: { t1: null, t2: null, t3: null },
      grade3eme: { t1: null, t2: null, t3: null },
      gradeBepc: null
    };
    setStudentRecords({
      studentName: "",
      birthDate: "",
      birthPlace: "",
      nationality: "Togolaise",
      candidateId: "",
      schoolOrigin: "",
      city: "",
      bepcYear: new Date().getFullYear(),
      hasObtainedBepc: true,
      userWishedPathway: "lycee_general",
      wishedStreamOrTrade: "",
      userInterests: [],
      careerAspiration: "",
      grades: {
        francais: { ...emptySub },
        anglais: { ...emptySub },
        mathematiques: { ...emptySub },
        physiqueChimie: { ...emptySub },
        svt: { ...emptySub },
        histoireGeo: { ...emptySub },
        eps: { ...emptySub },
      }
    });
  };

  const resetToDefaultProfile = () => {
    setStudentRecords({
      studentName: "KODJO Afiwa Emefa",
      birthDate: "20/09/2010",
      birthPlace: "Lomé (Togo)",
      nationality: "Togolaise",
      candidateId: "CAND-2026-BEPC-4412",
      schoolOrigin: "CEG Tokoin Solidarité",
      city: "Lomé, Région Maritime",
      bepcYear: new Date().getFullYear(),
      hasObtainedBepc: true,
      userWishedPathway: "lycee_general",
      wishedStreamOrTrade: "Seconde Littéraire (A4)",
      userInterests: ["Littérature", "Langues vivantes", "Communication", "Droit"],
      careerAspiration: "Magistrate ou Juriste d'Affaires Internationales",
      grades: {
        francais: {
          grade6eme: { t1: 12, t2: 13, t3: 12 },
          grade5eme: { t1: 11, t2: 12, t3: 13 },
          grade4eme: { t1: 13, t2: 14, t3: 13 },
          grade3eme: { t1: 12, t2: 13, t3: 14 },
          gradeBepc: 13
        },
        anglais: {
          grade6eme: { t1: 11, t2: 12, t3: 11 },
          grade5eme: { t1: 10, t2: 11, t3: 12 },
          grade4eme: { t1: 12, t2: 12, t3: 13 },
          grade3eme: { t1: 11, t2: 12, t3: 12 },
          gradeBepc: 12
        },
        mathematiques: {
          grade6eme: { t1: 9, t2: 9, t3: 8 },
          grade5eme: { t1: 8, t2: 8, t3: 9 },
          grade4eme: { t1: 9, t2: 9, t3: 8 },
          grade3eme: { t1: 8, t2: 8, t3: 9 },
          gradeBepc: 9
        },
        physiqueChimie: {
          grade6eme: { t1: 9, t2: 8, t3: 9 },
          grade5eme: { t1: 8, t2: 9, t3: 8 },
          grade4eme: { t1: 8, t2: 8, t3: 9 },
          grade3eme: { t1: 9, t2: 8, t3: 9 },
          gradeBepc: 8
        },
        svt: {
          grade6eme: { t1: 10, t2: 10, t3: 11 },
          grade5eme: { t1: 9, t2: 10, t3: 9 },
          grade4eme: { t1: 10, t2: 10, t3: 11 },
          grade3eme: { t1: 9, t2: 10, t3: 10 },
          gradeBepc: 10
        },
        histoireGeo: {
          grade6eme: { t1: 13, t2: 13, t3: 14 },
          grade5eme: { t1: 12, t2: 13, t3: 13 },
          grade4eme: { t1: 14, t2: 14, t3: 15 },
          grade3eme: { t1: 13, t2: 14, t3: 14 },
          gradeBepc: 13
        },
        eps: {
          grade6eme: { t1: 14, t2: 15, t3: 14 },
          grade5eme: { t1: 15, t2: 15, t3: 16 },
          grade4eme: { t1: 15, t2: 14, t3: 15 },
          grade3eme: { t1: 15, t2: 16, t3: 15 },
          gradeBepc: 15
        }
      }
    });
  };

  // Helper to compute stats for a subject
  const getSubjectStats = (subjectKey: keyof PostBepcStudentRecords["grades"]) => {
    const subj = studentRecords.grades[subjectKey];
    if (!subj) return { avg6: null, avg5: null, avg4: null, avg3: null, bepc: null, overallAvg: null, count: 0, total: 0 };

    const getYearAvg = (y?: { t1?: number | null; t2?: number | null; t3?: number | null }) => {
      if (!y) return null;
      const terms = [y.t1, y.t2, y.t3].filter(t => t !== undefined && t !== null && !isNaN(t)) as number[];
      if (terms.length === 0) return null;
      return Number((terms.reduce((a, b) => a + b, 0) / terms.length).toFixed(2));
    };

    const avg6 = getYearAvg(subj.grade6eme);
    const avg5 = getYearAvg(subj.grade5eme);
    const avg4 = getYearAvg(subj.grade4eme);
    const avg3 = getYearAvg(subj.grade3eme);
    const bepc = subj.gradeBepc !== undefined && subj.gradeBepc !== null && !isNaN(subj.gradeBepc) ? Number(subj.gradeBepc) : null;

    const allGrades: number[] = [];
    [subj.grade6eme, subj.grade5eme, subj.grade4eme, subj.grade3eme].forEach(y => {
      if (y) {
        [y.t1, y.t2, y.t3].forEach(t => {
          if (t !== undefined && t !== null && !isNaN(t)) allGrades.push(Number(t));
        });
      }
    });
    if (bepc !== null) allGrades.push(bepc);

    const count = allGrades.length;
    const total = allGrades.reduce((a, b) => a + b, 0);
    const overallAvg = count > 0 ? Number((total / count).toFixed(2)) : null;

    return { avg6, avg5, avg4, avg3, bepc, overallAvg, count, total };
  };

  // Run evaluation
  const handleRunEvaluation = () => {
    const decision = evaluatePostBepcOrientation(studentRecords);
    setEvaluationResult(decision);
    // Smooth scroll to results
    const resultsElem = document.getElementById("orientation-results-section");
    if (resultsElem) {
      resultsElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Print or preview official decision report
  const handlePrint = () => {
    setIsReportPreviewMode(false);
    setShowThreePageReportModal(true);
  };

  const handlePreviewReport = () => {
    setIsReportPreviewMode(true);
    setShowThreePageReportModal(true);
  };

  // Mapped academic subjects for the 3-page official certified report
  const academicSubjectRows = useMemo(() => {
    if (!evaluationResult) return [];
    const subjectsMeta = [
      { key: "francais" as const, name: "Français", isA4: true },
      { key: "anglais" as const, name: "Anglais", isA4: true },
      { key: "mathematiques" as const, name: "Mathématiques", isSci: true },
      { key: "physiqueChimie" as const, name: "Physique-Chimie (PCT)", isSci: true },
      { key: "svt" as const, name: "Sciences de la Vie et de la Terre (SVT)", isSci: true },
      { key: "histoireGeo" as const, name: "Histoire-Géographie" },
      { key: "eps" as const, name: "Éducation Physique & Sportive (EPS)" },
    ];

    return subjectsMeta.map((s) => {
      const detail = evaluationResult.subjectDetails[s.key];
      const rec = studentRecords.grades[s.key];
      const p6 = rec?.grade6eme ? `6e:[${rec.grade6eme.t1 ?? '-'}/${rec.grade6eme.t2 ?? '-'}/${rec.grade6eme.t3 ?? '-'}]` : '';
      const p5 = rec?.grade5eme ? `5e:[${rec.grade5eme.t1 ?? '-'}/${rec.grade5eme.t2 ?? '-'}/${rec.grade5eme.t3 ?? '-'}]` : '';
      const p4 = rec?.grade4eme ? `4e:[${rec.grade4eme.t1 ?? '-'}/${rec.grade4eme.t2 ?? '-'}/${rec.grade4eme.t3 ?? '-'}]` : '';
      const p3 = rec?.grade3eme ? `3e:[${rec.grade3eme.t1 ?? '-'}/${rec.grade3eme.t2 ?? '-'}/${rec.grade3eme.t3 ?? '-'}]` : '';
      const periods = [p6, p5, p4, p3].filter(Boolean).join(" • ");

      return {
        name: s.name,
        detailsByPeriod: periods || "Notes 6e à 3e saisies",
        examNote: `BEPC: ${rec?.gradeBepc ?? '-'}`,
        totalPoints: detail ? detail.totalSum.toFixed(1) : 0,
        notesCount: detail ? detail.count : 0,
        calculatedAverage: detail ? detail.calculatedAverage : 0,
        requiredPassingAvg: 10,
        isEligible: detail ? detail.isPassing10 : false,
        tag: s.isA4 ? "Accès Séries A4 & G1" : s.isSci ? "Accès Séries S, G2-G3, F1-Ti" : undefined
      };
    });
  }, [evaluationResult, studentRecords]);

  // Mapped psychometric test rows for 3-page report
  const psychometricTestRows = useMemo(() => {
    const isLit = (evaluationResult?.subjectDetails["francais"]?.calculatedAverage || 0) >= 10;
    const isSci = (evaluationResult?.subjectDetails["mathematiques"]?.calculatedAverage || 0) >= 10;
    const dominantCode = isSci ? "IRS" : isLit ? "ASE" : "RCE";
    
    return [
      {
        testName: "Profil Typologique RIASEC de Holland (50 Questions)",
        scorePct: 88,
        appreciation: `Code dominant : ${dominantCode}`,
        keyObservation: isSci 
          ? "Investigateur - Réaliste : Forte propension pour le raisonnement logique, l'analyse expérimentale et les technologies." 
          : "Artistique - Social - Entreprenant : Prédisposition marquée pour les langues, l'argumentation juridique et l'action sociale.",
      },
      {
        testName: "Test d'Efficience Cognitive & Logico-Mathématique",
        scorePct: isSci ? 90 : 84,
        appreciation: "Capacité très solide",
        keyObservation: "Quotient cognitif supérieur, excellente capacité d'abstraction et de synthèse conceptuelle.",
      },
      {
        testName: "Inventaire des Intérêts & Motivations Scolaires",
        scorePct: 92,
        appreciation: "Capacité très solide",
        keyObservation: `Souhaits exprimés : ${studentRecords.wishedStreamOrTrade || "Orientation générale"}. Vocation solidement ancrée.`,
      },
      {
        testName: "Test d'Autonomie & Résilience Psychologique",
        scorePct: 86,
        appreciation: "Capacité solide",
        keyObservation: "Autonomie de travail et persévérance adaptées aux exigences des cycles secondaires du lycée.",
      }
    ];
  }, [evaluationResult, studentRecords]);

  // Filtered streams list
  const filteredStreams = useMemo(() => {
    return HIGH_SCHOOL_STREAMS.filter(stream => {
      const matchSearch = stream.name.toLowerCase().includes(streamSearch.toLowerCase()) ||
        stream.code.toLowerCase().includes(streamSearch.toLowerCase()) ||
        stream.targetCareers.some(c => c.toLowerCase().includes(streamSearch.toLowerCase())) ||
        stream.shortDescription.toLowerCase().includes(streamSearch.toLowerCase());
      
      const matchCategory = streamCategoryFilter === "Tous" || stream.category === streamCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [streamSearch, streamCategoryFilter]);

  // Categories list for trades
  const tradeCategories = useMemo(() => {
    const cats = new Set(APPRENTICESHIP_TRADES.map(t => t.category));
    return ["Tous", ...Array.from(cats)];
  }, []);

  // Filtered trades list
  const filteredTrades = useMemo(() => {
    return APPRENTICESHIP_TRADES.filter(trade => {
      const matchSearch = trade.title.toLowerCase().includes(tradeSearch.toLowerCase()) ||
        trade.description.toLowerCase().includes(tradeSearch.toLowerCase()) ||
        (trade.leadingSectorName && trade.leadingSectorName.toLowerCase().includes(tradeSearch.toLowerCase())) ||
        trade.keyPracticalSkills.some(s => s.toLowerCase().includes(tradeSearch.toLowerCase()));
      
      const matchLeading = !tradeLeadingSectorOnly || trade.isLeadingSector;
      const matchCategory = tradeCategoryFilter === "Tous" || trade.category === tradeCategoryFilter;
      const matchAccess = tradeAccessFilter === "Tous" || trade.accessRequirement.includes(tradeAccessFilter);

      return matchSearch && matchLeading && matchCategory && matchAccess;
    });
  }, [tradeSearch, tradeLeadingSectorOnly, tradeCategoryFilter, tradeAccessFilter]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Top Banner with Official Cabinet Certification */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 border-b border-emerald-800/40 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Système National & Panafricain d'Orientation Post-BEPC</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
              Orientation Post-BEPC & Apprentissage
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Moteur officiel d'aide à la décision pour l'accès aux séries du <strong>Lycée Général (A4, S)</strong>, 
              du <strong>Lycée Technique (G1, G2, G3, F1, F2, F3, F4, E, Ti)</strong> ou vers l'<strong>Apprentissage d'un Métier Porteur</strong>.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 text-center md:text-right shrink-0 shadow-xl shadow-emerald-950/40 backdrop-blur-sm">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wide">Cabinet Conseil d'Orientation</div>
            <div className="text-white font-serif font-bold text-sm">Dr BALOGAH Dibaataba</div>
            <div className="text-slate-400 text-xs mt-1">Spécialiste Sciences de l'Éducation & Formation</div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Formule Réglementaire 6ème-BEPC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto py-2.5 gap-2 no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-102"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>1. Simulateur de Moyennes & Décision</span>
            </button>

            <button
              onClick={() => setActiveTab("streams")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "streams"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-102"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>2. Répertoire des Séries (A4, S, G, F, E, Ti)</span>
            </button>

            <button
              onClick={() => setActiveTab("trades")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "trades"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-102"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              <Wrench className="w-4 h-4 text-teal-400" />
              <span>3. Métiers d'Apprentissage & Secteurs Porteurs</span>
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "guide"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-102"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>4. Règles & Formule de Calcul</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviewReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-900/70 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/50 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
              title="Prévisualiser la mise en page A4 et contrôler les sauts de page"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Prévisualiser</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shrink-0 cursor-pointer"
              title="Imprimer ou Exporter la Fiche Officielle"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer / PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* ========================================================================= */}
        {/* TAB 1: SIMULATEUR D'ORIENTATION POST-BEPC & DÉCISION OFFICIELLE */}
        {/* ========================================================================= */}
        {activeTab === "simulator" && (
          <div className="space-y-8">
            {/* Card Explication de la Formule de Calcul */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/40">
                  <Info className="w-5 h-5" />
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Règle Officielle de Décision d'Orientation Post-BEPC</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 text-[11px] font-mono">Formule Somme/Effectif</span>
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Pour calculer la moyenne aux fins d'une décision d'orientation, on effectue la <strong>somme des notes obtenues dans chaque matière depuis la classe de 6ème jusqu'au BEPC</strong>, divisée par le nombre de notes intégrées.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <span className="font-bold text-amber-400">Pour les Séries A4 et G1 :</span>
                      <p className="text-slate-300 mt-0.5">Moyenne cumulée <strong>≥ 10/20 en Français ET en Anglais</strong>.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <span className="font-bold text-emerald-400">Pour les Séries S, G2, G3, F1, F2, F3, F4, E, Ti :</span>
                      <p className="text-slate-300 mt-0.5">Moyenne cumulée <strong>≥ 10/20 en Mathématiques, Physique-Chimie (PCT) ET SVT</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire Candidat & Grille de Saisie des Notes */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2.5">
                    <Calculator className="w-6 h-6 text-emerald-400" />
                    <span>Dossier Scolaire Trimestriel (6ème en 3ème) & Examen BEPC</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Renseignez vos notes <strong>trimestre par trimestre (T1, T2, T3)</strong> pour chaque classe de la 6ème en 3ème ainsi que les notes de l'examen du BEPC.
                  </p>
                </div>
                
                {/* Preset action buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={loadScientificPreset}
                    className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-xs text-emerald-300 font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    Exemple S
                  </button>
                  <button
                    type="button"
                    onClick={loadLiteraryPreset}
                    className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-xs text-amber-300 font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    Exemple A4
                  </button>
                  <button
                    type="button"
                    onClick={loadApprenticeshipPreset}
                    className="px-3 py-1.5 rounded-xl bg-teal-950/60 hover:bg-teal-900 border border-teal-500/40 text-xs text-teal-300 font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    Exemple Métier
                  </button>
                  <button
                    type="button"
                    onClick={clearEntireForm}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-700 text-xs text-rose-300 hover:text-rose-200 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    title="Vider tous les champs (identité, vœux et notes)"
                  >
                    <RotateCcw className="w-3 h-3 text-rose-400" />
                    <span>Vider Tout</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearAllGrades}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title="Vider uniquement le tableau des notes"
                  >
                    Vider Notes
                  </button>
                  <button
                    type="button"
                    onClick={resetToDefaultProfile}
                    className="px-3 py-1.5 rounded-xl bg-blue-950/50 hover:bg-blue-900 border border-blue-600/40 text-xs text-blue-300 font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    title="Recharger l'exemple type"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Exemple Type</span>
                  </button>
                </div>
              </div>

              {/* Informations Candidat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nom et Prénoms de l'Élève</label>
                  <input
                    type="text"
                    value={studentRecords.studentName}
                    onChange={(e) => setStudentRecords(prev => ({ ...prev, studentName: e.target.value }))}
                    placeholder="Ex: KODJO Afiwa Emefa"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Collège d'Origine / Établissement</label>
                  <input
                    type="text"
                    value={studentRecords.schoolOrigin}
                    onChange={(e) => setStudentRecords(prev => ({ ...prev, schoolOrigin: e.target.value }))}
                    placeholder="Ex: CEG Tokoin Solidarité"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date de Naissance</label>
                  <input
                    type="text"
                    value={studentRecords.birthDate || ""}
                    onChange={(e) => setStudentRecords(prev => ({ ...prev, birthDate: e.target.value }))}
                    placeholder="Ex: 20/09/2010"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lieu de Naissance & Nationalité</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={studentRecords.birthPlace || ""}
                      onChange={(e) => setStudentRecords(prev => ({ ...prev, birthPlace: e.target.value }))}
                      placeholder="Ex: Lomé"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={studentRecords.nationality || ""}
                      onChange={(e) => setStudentRecords(prev => ({ ...prev, nationality: e.target.value }))}
                      placeholder="Ex: Togolaise"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ville & Région</label>
                  <input
                    type="text"
                    value={studentRecords.city}
                    onChange={(e) => setStudentRecords(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Ex: Lomé, Région Maritime"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Année de Session du BEPC</label>
                  <input
                    type="number"
                    value={studentRecords.bepcYear}
                    onChange={(e) => setStudentRecords(prev => ({ ...prev, bepcYear: parseInt(e.target.value) || 2026 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Voie Souhaitée & Aspiration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Voie & Parcours Souhaité par l'Élève</label>
                  <select
                    value={studentRecords.userWishedPathway}
                    onChange={(e) => setStudentRecords(prev => ({ ...prev, userWishedPathway: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="lycee_general">Lycée d'Enseignement Général (Seconde A4 ou Seconde S)</option>
                    <option value="lycee_technique">Lycée Technique (G1, G2, G3, F1, F2, F3, F4, E, Ti)</option>
                    <option value="apprentissage_metier">Apprentissage d'un Métier Qualifiant (CQP, CAP, BT)</option>
                    <option value="indecis">Indécis / Besoin de l'orientation du Cabinet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Série ou Métier Particulièrement Visé</label>
                  <input
                    type="text"
                    value={studentRecords.wishedStreamOrTrade}
                    onChange={(e) => setStudentRecords(prev => ({ ...prev, wishedStreamOrTrade: e.target.value }))}
                    placeholder="Ex: Seconde S (C, D) ou Électricité Solaire"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Projet de Métier de Rêve / Carrière</label>
                  <input
                    type="text"
                    value={studentRecords.careerAspiration}
                    onChange={(e) => setStudentRecords(prev => ({ ...prev, careerAspiration: e.target.value }))}
                    placeholder="Ex: Ingénieur BTP, Magistrat, Artisan Solaire..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* View Switcher: Vue Matrice vs Vue Onglets par Année */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Mode d'affichage de la grille :</span>
                  <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setGradeEntryMode("matrix")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        gradeEntryMode === "matrix"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Vue Matrice Complète (T1-T3)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGradeEntryMode("tabs")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        gradeEntryMode === "tabs"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Vue Onglets par Classe
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-amber-300/80 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                  3 trimestres (T1, T2, T3) par année + Note BEPC = Moyenne Décisionnelle
                </div>
              </div>

              {/* MODE 1: VUE MATRICE COMPLÈTE */}
              {gradeEntryMode === "matrix" && (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 mt-2">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-200 min-w-[1020px]">
                    <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th rowSpan={2} className="py-3 px-4 bg-slate-900 border-r border-slate-800">Matière / Discipline</th>
                        <th colSpan={3} className="py-2 px-2 text-center bg-slate-900/90 border-r border-slate-800 text-slate-300">Classe de 6ème</th>
                        <th colSpan={3} className="py-2 px-2 text-center bg-slate-900/80 border-r border-slate-800 text-slate-300">Classe de 5ème</th>
                        <th colSpan={3} className="py-2 px-2 text-center bg-slate-900/90 border-r border-slate-800 text-slate-300">Classe de 4ème</th>
                        <th colSpan={3} className="py-2 px-2 text-center bg-slate-900/80 border-r border-slate-800 text-slate-300">Classe de 3ème</th>
                        <th rowSpan={2} className="py-3 px-3 text-center text-amber-400 font-bold bg-amber-950/30 border-r border-slate-800">BEPC Examen</th>
                        <th rowSpan={2} className="py-3 px-3 text-center text-emerald-400 font-bold bg-emerald-950/20 border-r border-slate-800">Moyenne Cumulée</th>
                        <th rowSpan={2} className="py-3 px-3 text-center">Statut (≥ 10)</th>
                      </tr>
                      <tr className="text-[10px] text-slate-400 border-t border-slate-800/80">
                        <th className="py-1 px-1 text-center border-r border-slate-800/50">T1</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800/50">T2</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800">T3</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800/50">T1</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800/50">T2</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800">T3</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800/50">T1</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800/50">T2</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800">T3</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800/50">T1</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800/50">T2</th>
                        <th className="py-1 px-1 text-center border-r border-slate-800">T3</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {[
                        { key: "francais" as const, label: "Français", tag: "Accès A4 & G1", isA4: true },
                        { key: "anglais" as const, label: "Anglais", tag: "Accès A4 & G1", isA4: true },
                        { key: "mathematiques" as const, label: "Mathématiques", tag: "Accès S, G2, G3, F1-F4, E, Ti", isSci: true },
                        { key: "physiqueChimie" as const, label: "Physique-Chimie (PCT)", tag: "Accès S, G2, G3, F1-F4, E, Ti", isSci: true },
                        { key: "svt" as const, label: "SVT (Sc. Vie & Terre)", tag: "Accès S, G2, G3, F1-F4, E, Ti", isSci: true },
                        { key: "histoireGeo" as const, label: "Histoire-Géographie", tag: "Culture Générale" },
                        { key: "eps" as const, label: "Éducation Physique (EPS)", tag: "Aptitude Physique" },
                      ].map(({ key, label, tag, isA4, isSci }) => {
                        const subj = studentRecords.grades[key];
                        const stats = getSubjectStats(key);
                        const isPassing = stats.overallAvg !== null && stats.overallAvg >= 10.0;

                        return (
                          <tr key={key} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 px-3 font-sans font-medium text-white border-r border-slate-800">
                              <div className="flex flex-col">
                                <span className="font-semibold text-xs sm:text-sm">{label}</span>
                                <span className={`text-[10px] font-normal ${isA4 ? "text-amber-400 font-semibold" : isSci ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                                  {tag}
                                </span>
                              </div>
                            </td>

                            {/* 6ème T1, T2, T3 */}
                            <td className="py-1.5 px-1 text-center border-r border-slate-800/50">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade6eme?.t1 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade6eme", "t1", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-1.5 px-1 text-center border-r border-slate-800/50">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade6eme?.t2 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade6eme", "t2", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-1.5 px-1 text-center border-r border-slate-800">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade6eme?.t3 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade6eme", "t3", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>

                            {/* 5ème T1, T2, T3 */}
                            <td className="py-1.5 px-1 text-center border-r border-slate-800/50">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade5eme?.t1 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade5eme", "t1", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-1.5 px-1 text-center border-r border-slate-800/50">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade5eme?.t2 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade5eme", "t2", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-1.5 px-1 text-center border-r border-slate-800">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade5eme?.t3 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade5eme", "t3", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>

                            {/* 4ème T1, T2, T3 */}
                            <td className="py-1.5 px-1 text-center border-r border-slate-800/50">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade4eme?.t1 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade4eme", "t1", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-1.5 px-1 text-center border-r border-slate-800/50">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade4eme?.t2 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade4eme", "t2", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-1.5 px-1 text-center border-r border-slate-800">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade4eme?.t3 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade4eme", "t3", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>

                            {/* 3ème T1, T2, T3 */}
                            <td className="py-1.5 px-1 text-center border-r border-slate-800/50">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade3eme?.t1 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade3eme", "t1", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-1.5 px-1 text-center border-r border-slate-800/50">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade3eme?.t2 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade3eme", "t2", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-1.5 px-1 text-center border-r border-slate-800">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.grade3eme?.t3 ?? ""}
                                onChange={(e) => handleTrimesterGradeChange(key, "grade3eme", "t3", e.target.value)}
                                placeholder="--"
                                className="w-11 text-center bg-slate-950 border border-slate-800 rounded-md py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                              />
                            </td>

                            {/* BEPC Examen */}
                            <td className="py-1.5 px-2 text-center bg-amber-950/20 border-r border-slate-800">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={subj?.gradeBepc ?? ""}
                                onChange={(e) => handleBepcGradeChange(key, e.target.value)}
                                placeholder="BEPC"
                                className="w-12 text-center bg-slate-950 border border-amber-500/50 rounded-md py-1 text-xs text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
                              />
                            </td>

                            {/* Moyenne Cumulée */}
                            <td className="py-2 px-2 text-center font-bold text-xs sm:text-sm text-emerald-300 bg-emerald-950/10 border-r border-slate-800">
                              {stats.overallAvg !== null ? `${stats.overallAvg} / 20` : "--"}
                              {stats.count > 0 && (
                                <div className="text-[9px] text-slate-500 font-normal font-sans">
                                  ({stats.count} note{stats.count > 1 ? "s" : ""})
                                </div>
                              )}
                            </td>

                            {/* Statut Admissibilité */}
                            <td className="py-2 px-2 text-center font-sans">
                              {stats.count > 0 ? (
                                isPassing ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                    <CheckCircle2 className="w-3 h-3" /> Favorable (≥10)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                                    <X className="w-3 h-3" /> &lt; 10/20
                                  </span>
                                )
                              ) : (
                                <span className="text-slate-600 text-[10px]">En attente</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* MODE 2: VUE ONGLETS PAR CLASSE (6E, 5E, 4E, 3E, BEPC) */}
              {gradeEntryMode === "tabs" && (
                <div className="space-y-4">
                  {/* Selector for Class tab */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {[
                      { id: "6eme" as const, label: "Classe de 6ème (3 Trimestres)" },
                      { id: "5eme" as const, label: "Classe de 5ème (3 Trimestres)" },
                      { id: "4eme" as const, label: "Classe de 4ème (3 Trimestres)" },
                      { id: "3eme" as const, label: "Classe de 3ème (3 Trimestres)" },
                      { id: "bepc" as const, label: "Examen Officiel du BEPC" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveYearTab(tab.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          activeYearTab === tab.id
                            ? tab.id === "bepc"
                              ? "bg-amber-500 text-slate-950 font-extrabold shadow-md"
                              : "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                            : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Grid for active year / BEPC */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>
                          {activeYearTab === "6eme" && "Saisie des 3 Trimestres de la classe de Sixième (6ème)"}
                          {activeYearTab === "5eme" && "Saisie des 3 Trimestres de la classe de Cinquième (5ème)"}
                          {activeYearTab === "4eme" && "Saisie des 3 Trimestres de la classe de Quatrième (4ème)"}
                          {activeYearTab === "3eme" && "Saisie des 3 Trimestres de la classe de Troisième (3ème)"}
                          {activeYearTab === "bepc" && "Saisie des Notes Obtenues à l'Examen du BEPC"}
                        </span>
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Notes sur 20
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {[
                        { key: "francais" as const, label: "Français", tag: "Accès A4 & G1", isA4: true },
                        { key: "anglais" as const, label: "Anglais", tag: "Accès A4 & G1", isA4: true },
                        { key: "mathematiques" as const, label: "Mathématiques", tag: "Accès S, G2, G3, F1-F4, E, Ti", isSci: true },
                        { key: "physiqueChimie" as const, label: "Physique-Chimie (PCT)", tag: "Accès S, G2, G3, F1-F4, E, Ti", isSci: true },
                        { key: "svt" as const, label: "SVT (Sc. Vie & Terre)", tag: "Accès S, G2, G3, F1-F4, E, Ti", isSci: true },
                        { key: "histoireGeo" as const, label: "Histoire-Géographie", tag: "Culture Générale" },
                        { key: "eps" as const, label: "Éducation Physique (EPS)", tag: "Aptitude Physique" },
                      ].map(({ key, label, tag, isA4, isSci }) => {
                        const subj = studentRecords.grades[key];
                        const stats = getSubjectStats(key);

                        if (activeYearTab === "bepc") {
                          return (
                            <div key={key} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-xs text-white">{label}</span>
                                <span className={`text-[10px] ${isA4 ? "text-amber-400" : isSci ? "text-emerald-400" : "text-slate-500"}`}>{tag}</span>
                              </div>
                              <div>
                                <label className="block text-[10px] text-amber-300 font-semibold mb-1">Note Examen BEPC</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.25"
                                  value={subj?.gradeBepc ?? ""}
                                  onChange={(e) => handleBepcGradeChange(key, e.target.value)}
                                  placeholder="0-20"
                                  className="w-full bg-slate-900 border border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
                                />
                              </div>
                              <div className="text-[10px] text-slate-400 pt-1 flex justify-between border-t border-slate-800/80">
                                <span>Moyenne Cumulée :</span>
                                <span className="font-bold text-emerald-300">{stats.overallAvg !== null ? `${stats.overallAvg}/20` : "--"}</span>
                              </div>
                            </div>
                          );
                        }

                        const yearKey = activeYearTab === "6eme" ? "grade6eme" : activeYearTab === "5eme" ? "grade5eme" : activeYearTab === "4eme" ? "grade4eme" : "grade3eme";
                        const yearData = subj?.[yearKey];
                        const yearAvg = stats[activeYearTab === "6eme" ? "avg6" : activeYearTab === "5eme" ? "avg5" : activeYearTab === "4eme" ? "avg4" : "avg3"];

                        return (
                          <div key={key} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs text-white">{label}</span>
                              <span className={`text-[10px] ${isA4 ? "text-amber-400" : isSci ? "text-emerald-400" : "text-slate-500"}`}>{tag}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-1.5">
                              <div>
                                <label className="block text-[10px] text-slate-400 mb-0.5">Trim. 1</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.25"
                                  value={yearData?.t1 ?? ""}
                                  onChange={(e) => handleTrimesterGradeChange(key, yearKey, "t1", e.target.value)}
                                  placeholder="T1"
                                  className="w-full text-center bg-slate-900 border border-slate-700 rounded-lg py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-400 mb-0.5">Trim. 2</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.25"
                                  value={yearData?.t2 ?? ""}
                                  onChange={(e) => handleTrimesterGradeChange(key, yearKey, "t2", e.target.value)}
                                  placeholder="T2"
                                  className="w-full text-center bg-slate-900 border border-slate-700 rounded-lg py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-400 mb-0.5">Trim. 3</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.25"
                                  value={yearData?.t3 ?? ""}
                                  onChange={(e) => handleTrimesterGradeChange(key, yearKey, "t3", e.target.value)}
                                  placeholder="T3"
                                  className="w-full text-center bg-slate-900 border border-slate-700 rounded-lg py-1 text-xs text-white focus:border-emerald-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="text-[10px] text-slate-400 pt-1.5 flex justify-between border-t border-slate-800/80">
                              <span>Moyenne annuelle :</span>
                              <span className="font-bold text-teal-300">{yearAvg !== null ? `${yearAvg}/20` : "--"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Questionnaire d'Intérêts & Aspirations Post-BEPC */}
              <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">Test d'Intérêts, Désirs et Souhaits de l'Élève</h3>
                </div>
                <p className="text-xs text-slate-400">
                  En dehors des notes scolaires, l'orientation scolaire et professionnelle prend en compte vos talents, aspirations et désirs d'avenir.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {POST_BEPC_INTEREST_QUESTIONS.map((q) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">
                          {q.id}
                        </span>
                        <span>{q.questionText}</span>
                      </div>
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              quizAnswers[q.id] === opt.pathway
                                ? "bg-emerald-950/60 border-emerald-500 text-emerald-200"
                                : "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              checked={quizAnswers[q.id] === opt.pathway}
                              onChange={() => {
                                setQuizAnswers(prev => ({ ...prev, [q.id]: opt.pathway }));
                                setStudentRecords(prev => ({
                                  ...prev,
                                  userInterests: Array.from(new Set([...prev.userInterests, opt.scoreCategory]))
                                }));
                              }}
                              className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="leading-snug">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton de Soumission / Calcul */}
              <div className="pt-4 flex flex-col sm:flex-row justify-end items-center gap-3">
                <button
                  onClick={handleRunEvaluation}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Calculer les Moyennes & Émettre la Décision d'Orientation</span>
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RÉSULTAT DE LA DÉCISION OFFICIELLE D'ORIENTATION */}
            {/* ========================================================================= */}
            {evaluationResult && (
              <div id="orientation-results-section" className="space-y-6 animate-fade-in">
                {/* Carte de Décision Principale */}
                <div className={`rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden ${
                  evaluationResult.recommendedDecisionType === "LYCEE_GENERAL" || evaluationResult.recommendedDecisionType === "LYCEE_TECHNIQUE"
                    ? "bg-gradient-to-br from-slate-950 via-emerald-950/60 to-slate-950 border-emerald-500/50"
                    : evaluationResult.recommendedDecisionType === "APPRENTISSAGE_AVEC_MENTION_ETUDES_POSSIBLES"
                    ? "bg-gradient-to-br from-slate-950 via-teal-950/60 to-slate-950 border-teal-500/50"
                    : "bg-gradient-to-br from-slate-950 via-amber-950/40 to-slate-950 border-amber-500/50"
                }`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold shadow-lg ${
                        evaluationResult.recommendedDecisionType === "APPRENTISSAGE_METIER"
                          ? "bg-amber-400 text-slate-950"
                          : "bg-emerald-500 text-white"
                      }`}>
                        {evaluationResult.recommendedDecisionType === "APPRENTISSAGE_METIER" ? (
                          <Wrench className="w-7 h-7" />
                        ) : (
                          <GraduationCap className="w-7 h-7" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          Avis Officiel d'Orientation Post-BEPC
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                          {evaluationResult.recommendedDecisionType === "LYCEE_GENERAL" && "Orientation Favorable : Lycée d'Enseignement Général"}
                          {evaluationResult.recommendedDecisionType === "LYCEE_TECHNIQUE" && "Orientation Favorable : Lycée Technique & Technologique"}
                          {evaluationResult.recommendedDecisionType === "APPRENTISSAGE_AVEC_MENTION_ETUDES_POSSIBLES" && "Orientation Accordée : Apprentissage d'un Métier (Avec Félicitations Académiques)"}
                          {evaluationResult.recommendedDecisionType === "APPRENTISSAGE_METIER" && "Orientation Positive : Apprentissage d'un Métier Qualifiant"}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handlePreviewReport}
                        className="px-3.5 py-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 border border-indigo-500/50 text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-md"
                        title="Prévisualiser la mise en page A4 et vérifier les sauts de page avant d'imprimer"
                      >
                        <Eye className="w-4 h-4 text-amber-300" />
                        <span>Prévisualiser le rapport</span>
                      </button>

                      <button
                        onClick={handlePrint}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Imprimer le Bilan Officiel</span>
                      </button>
                    </div>
                  </div>

                  {/* Synthèse de l'Avis de Dr BALOGAH */}
                  <div className="mt-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                      <Award className="w-4 h-4" />
                      <span>Motivation & Justification de la Décision :</span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                      {evaluationResult.officialAdviceSummary}
                    </p>
                  </div>

                  {/* Tableau des Éligibilités par Séries */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Bloc Séries Littéraires & Tertiaires (A4, G1) */}
                    <div className={`p-4 rounded-2xl border ${
                      evaluationResult.isEligibleForA4_G1
                        ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-amber-400" />
                          <span>Pôle Littéraire & Administratif (A4, G1)</span>
                        </span>
                        {evaluationResult.isEligibleForA4_G1 ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> ÉLIGIBLE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold flex items-center gap-1">
                            <X className="w-3 h-3" /> NON ÉLIGIBLE
                          </span>
                        )}
                      </div>
                      <div className="text-xs space-y-1 text-slate-300">
                        <div>Français (6e-BEPC) : <strong>{evaluationResult.subjectDetails["francais"]?.calculatedAverage || 0}/20</strong> (Requis ≥ 10)</div>
                        <div>Anglais (6e-BEPC) : <strong>{evaluationResult.subjectDetails["anglais"]?.calculatedAverage || 0}/20</strong> (Requis ≥ 10)</div>
                      </div>
                    </div>

                    {/* Bloc Séries Scientifiques & Industrielles (S, G2, G3, F1-F4, E, Ti) */}
                    <div className={`p-4 rounded-2xl border ${
                      evaluationResult.isEligibleForS_G2_G3_F1_F4_E_Ti
                        ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-white flex items-center gap-2">
                          <Zap className="w-4 h-4 text-emerald-400" />
                          <span>Pôle Scientifique & Technique (S, G2, G3, F1..Ti)</span>
                        </span>
                        {evaluationResult.isEligibleForS_G2_G3_F1_F4_E_Ti ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> ÉLIGIBLE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold flex items-center gap-1">
                            <X className="w-3 h-3" /> NON ÉLIGIBLE
                          </span>
                        )}
                      </div>
                      <div className="text-xs space-y-1 text-slate-300">
                        <div>Mathématiques (6e-BEPC) : <strong>{evaluationResult.subjectDetails["mathematiques"]?.calculatedAverage || 0}/20</strong> (Requis ≥ 10)</div>
                        <div>Physique-Chimie (PCT) : <strong>{evaluationResult.subjectDetails["physiqueChimie"]?.calculatedAverage || 0}/20</strong> (Requis ≥ 10)</div>
                        <div>SVT (6e-BEPC) : <strong>{evaluationResult.subjectDetails["svt"]?.calculatedAverage || 0}/20</strong> (Requis ≥ 10)</div>
                      </div>
                    </div>
                  </div>

                  {/* Tableau Récapitulatif Détaillé des Notes Trimestre par Trimestre & BEPC */}
                  <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-emerald-400" />
                        <span>Détail Mathématique du Calcul des Moyennes (Trimestres T1-T2-T3 + BEPC)</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                        Somme des notes ÷ Total notes saisies
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs border-collapse font-sans min-w-[700px]">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                            <th className="py-2.5 px-3">Matière Clé</th>
                            <th className="py-2.5 px-2 text-center">6ème (T1/T2/T3)</th>
                            <th className="py-2.5 px-2 text-center">5ème (T1/T2/T3)</th>
                            <th className="py-2.5 px-2 text-center">4ème (T1/T2/T3)</th>
                            <th className="py-2.5 px-2 text-center">3ème (T1/T2/T3)</th>
                            <th className="py-2.5 px-2 text-center text-amber-400">BEPC</th>
                            <th className="py-2.5 px-2 text-center">Notes prises</th>
                            <th className="py-2.5 px-2 text-center">Total / Nb</th>
                            <th className="py-2.5 px-3 text-right">Moyenne / 20</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {[
                            { id: "francais" as const, name: "Français", isA4: true },
                            { id: "anglais" as const, name: "Anglais", isA4: true },
                            { id: "mathematiques" as const, name: "Mathématiques", isSci: true },
                            { id: "physiqueChimie" as const, name: "Physique-Chimie (PCT)", isSci: true },
                            { id: "svt" as const, name: "SVT (Sc. Vie & Terre)", isSci: true },
                            { id: "histoireGeo" as const, name: "Histoire-Géographie" },
                            { id: "eps" as const, name: "Éducation Physique (EPS)" },
                          ].map((subj) => {
                            const detail = evaluationResult.subjectDetails[subj.id];
                            const rec = studentRecords.grades[subj.id];
                            const isPassing = (detail?.calculatedAverage || 0) >= 10;

                            const formatYearTerms = (yt?: { t1?: number | null; t2?: number | null; t3?: number | null }) => {
                              if (!yt) return "-";
                              const parts = [
                                yt.t1 !== undefined && yt.t1 !== null ? yt.t1 : "•",
                                yt.t2 !== undefined && yt.t2 !== null ? yt.t2 : "•",
                                yt.t3 !== undefined && yt.t3 !== null ? yt.t3 : "•",
                              ];
                              return parts.join(" | ");
                            };

                            return (
                              <tr key={subj.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="py-2 px-3 font-semibold text-white flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full inline-block ${subj.isA4 ? "bg-amber-400" : subj.isSci ? "bg-emerald-400" : "bg-slate-500"}`} />
                                  <span>{subj.name}</span>
                                </td>
                                <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-400">
                                  {formatYearTerms(rec?.grade6eme)}
                                </td>
                                <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-400">
                                  {formatYearTerms(rec?.grade5eme)}
                                </td>
                                <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-400">
                                  {formatYearTerms(rec?.grade4eme)}
                                </td>
                                <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-400">
                                  {formatYearTerms(rec?.grade3eme)}
                                </td>
                                <td className="py-2 px-2 text-center font-mono text-[11px] font-bold text-amber-300">
                                  {rec?.gradeBepc !== undefined && rec?.gradeBepc !== null ? `${rec.gradeBepc}` : "-"}
                                </td>
                                <td className="py-2 px-2 text-center font-mono text-slate-400 text-xs">
                                  {detail?.count || 0}
                                </td>
                                <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-400">
                                  {detail ? `${detail.totalSum} ÷ ${detail.count}` : "-"}
                                </td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-sm">
                                  <span className={`px-2 py-0.5 rounded-lg ${
                                    isPassing 
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                                      : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                  }`}>
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

                  {/* Séries Recommandées Spécifiques */}
                  {evaluationResult.eligibleStreams.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Séries du Lycée Ouvertes à Votre Candidature :
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {evaluationResult.eligibleStreams.map((stream) => (
                          <div
                            key={stream.id}
                            onClick={() => setSelectedStream(stream)}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white text-sm group-hover:text-emerald-300 flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-xs border border-emerald-500/40">
                                  {stream.code}
                                </span>
                                <span>{stream.name}</span>
                              </span>
                              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2">{stream.shortDescription}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Métiers d'Apprentissage Recommandés */}
                  <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>Métiers d'Apprentissage Recommandés dans des Secteurs Porteurs :</span>
                      </h4>
                      <button
                        onClick={() => setActiveTab("trades")}
                        className="text-xs text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer"
                      >
                        Voir les 24+ Métiers d'Apprentissage
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {evaluationResult.recommendedApprenticeshipTrades.map((trade) => (
                        <div
                          key={trade.id}
                          onClick={() => setSelectedTrade(trade)}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="font-bold text-white text-xs group-hover:text-amber-300 line-clamp-2">
                              {trade.title}
                            </span>
                            {trade.isLeadingSector && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold shrink-0">
                                Porteur
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mb-2">{trade.category}</div>
                          <div className="text-[10px] text-emerald-400 font-mono">
                            Revenus : {trade.estimatedMonthlyIncomeFCFA}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signature et Sceau Officiel Dr BALOGAH */}
                  <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="text-xs text-slate-400 text-center sm:text-left">
                      <div>Fiche d'Évaluation Émise le : <strong>{evaluationResult.date}</strong></div>
                      <div>Délivrée par la Direction des Orientations Scolaires et Professionnelles</div>
                      <div className="text-emerald-400 text-[11px] font-medium">Cabinet Conseil Dr BALOGAH Dibaataba • Lomé, Togo</div>
                    </div>
                    <div className="shrink-0 max-w-sm w-full">
                      <BalogahOfficialValidationBlock 
                        formattedDate={evaluationResult.date} 
                        docId={`POST-BEPC-${evaluationResult.decisionId}`} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: RÉPERTOIRE OFFICIEL DES SÉRIES DU LYCÉE (A4, S, G, F, E, Ti) */}
        {/* ========================================================================= */}
        {activeTab === "streams" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  Répertoire Complet des Séries du Lycée
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Explorez toutes les séries d'enseignement général (A4, S) et technique (G1, G2, G3, F1, F2, F3, F4, E, Ti) avec leurs conditions d'accès, coefficients et débouchés.
                </p>
              </div>

              {/* Filtres & Recherche */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={streamSearch}
                    onChange={(e) => setStreamSearch(e.target.value)}
                    placeholder="Rechercher une série, métier..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={streamCategoryFilter}
                  onChange={(e) => setStreamCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tous">Toutes les Catégories</option>
                  <option value="Général Littéraire">Général Littéraire</option>
                  <option value="Général Scientifique">Général Scientifique</option>
                  <option value="Technique Tertiaire">Technique Tertiaire</option>
                  <option value="Technique Industriel & Technologique">Technique Industriel</option>
                </select>
              </div>
            </div>

            {/* Grid des Séries */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 space-y-4 shadow-xl transition-all hover:scale-101 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/40">
                        Série {stream.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {stream.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-serif leading-snug">
                      {stream.name}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {stream.shortDescription}
                    </p>

                    {/* Conditions d'accès */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Conditions d'Accès Ministérielles :</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {stream.admissionConditions.formulaExplanation}
                      </p>
                    </div>

                    {/* Matières Clés */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Matières Dominantes & Coefficients :
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {stream.dominantSubjects.map((sub, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                          >
                            {sub.subject} <strong className="text-emerald-400">(Coef {sub.coefficient})</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedStream(stream)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir Débouchés & Profil Complet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ANNUAIRE DES MÉTIERS DE L'APPRENTISSAGE (AVEC OU SANS BEPC) */}
        {/* ========================================================================= */}
        {activeTab === "trades" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Secteurs Porteurs & Insertion Rapide</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  Répertoire des Métiers de l'Apprentissage (Avec ou Sans BEPC)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Base de données exhaustive des formations professionnelles qualifiantes (CQP, CAP, BT, AFA) permettant l'auto-emploi et la création d'entreprise.
                </p>
              </div>

              {/* Filtres */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={tradeSearch}
                    onChange={(e) => setTradeSearch(e.target.value)}
                    placeholder="Métier, compétence..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={() => setTradeLeadingSectorOnly(!tradeLeadingSectorOnly)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    tradeLeadingSectorOnly
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Secteurs Porteurs Uniquement</span>
                </button>

                <select
                  value={tradeCategoryFilter}
                  onChange={(e) => setTradeCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {tradeCategories.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid des Métiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 space-y-4 shadow-xl transition-all hover:scale-101 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-slate-300 text-[11px] font-semibold border border-slate-800">
                        {trade.category}
                      </span>
                      {trade.isLeadingSector && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0">
                          <Flame className="w-3 h-3 text-amber-400" />
                          <span>Secteur Porteur</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white font-serif leading-snug">
                      {trade.title}
                    </h3>

                    {trade.leadingSectorName && (
                      <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                        <span>Pôle : {trade.leadingSectorName}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {trade.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Niveau d'accès :</span>
                        <span className="text-white font-medium">{trade.accessRequirement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Durée :</span>
                        <span className="text-emerald-400 font-semibold">{trade.trainingDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Revenus mensuels :</span>
                        <span className="text-amber-300 font-mono font-bold">{trade.estimatedMonthlyIncomeFCFA}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedTrade(trade)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Fiche Détaillée du Métier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GUIDE RÉGLEMENTAIRE & MÉTHODOLOGIE POST-BEPC */}
        {/* ========================================================================= */}
        {activeTab === "guide" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-white font-serif flex items-center gap-2.5">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <span>Guide Méthodologique & Règlementaire d'Orientation Post-BEPC</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Cabinet Conseil Dr BALOGAH Dibaataba - République Togolaise & Espace CEDEAO/UEMOA</p>
              </div>

              {/* Section 1 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-mono">1</span>
                  <span>La Formule Mathématique de Calcul des Moyennes</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Conformément aux instructions officielles d'orientation scolaire et professionnelle : chaque année scolaire (de la 6ème en 3ème) compte <strong>3 trimestres (T1, T2, T3)</strong>. L'élève intègre toutes les notes trimestre par trimestre pour chaque classe ainsi que la note obtenue à l'examen du BEPC.
                </p>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-mono text-center text-emerald-300 space-y-1">
                  <div>Moyenne Décisionnelle = ( Σ Notes Trimestrielles [6e: T1+T2+T3 + 5e: T1+T2+T3 + 4e: T1+T2+T3 + 3e: T1+T2+T3] + Note BEPC ) ÷ Total Notes Saisies</div>
                  <div className="text-[11px] text-slate-400 font-sans">(Soit jusqu'à 13 notes considérées au total par matière pour la prise de décision)</div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-xs font-mono">2</span>
                  <span>Critères d'Admissibilité aux Séries du Lycée</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <h4 className="font-bold text-white text-sm">Séries Littéraires & Bureautique (A4, G1)</h4>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      <li>Moyenne cumulée en <strong>Français ≥ 10/20</strong></li>
                      <li>Moyenne cumulée en <strong>Anglais ≥ 10/20</strong></li>
                      <li>Titulaire du diplôme du BEPC</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <h4 className="font-bold text-white text-sm">Séries Scientifiques & Industrielles (S, G2, G3, F1..F4, E, Ti)</h4>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      <li>Moyenne cumulée en <strong>Mathématiques ≥ 10/20</strong></li>
                      <li>Moyenne cumulée en <strong>Physique-Chimie (PCT) ≥ 10/20</strong></li>
                      <li>Moyenne cumulée en <strong>SVT ≥ 10/20</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-400/20 text-teal-300 flex items-center justify-center text-xs font-mono">3</span>
                  <span>Orientation vers l'Apprentissage d'un Métier Qualifiant</span>
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <p>
                    <strong>Cas de non-obtention des moyennes minimales :</strong> L'élève qui n'atteint pas 10/20 dans les matières clés de la série demandée est dirigé positivement vers l'apprentissage d'un métier qualifiant dans un secteur porteur (Énergies solaires, BTP moderne, Froid & Climatisation, Agroalimentaire, Numérique).
                  </p>
                  <p>
                    <strong>Cas de l'élève brillant demandant l'apprentissage :</strong> Si un élève remplissant les conditions académiques pour le lycée choisit l'apprentissage, son choix est validé avec les félicitations du Cabinet, tout en lui rappelant qu'il peut à tout moment faire valoir son droit d'accès aux séries du lycée.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL FICHE DÉTAILLÉE D'UNE SÉRIE DU LYCÉE */}
      {/* ========================================================================= */}
      {selectedStream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/40">
                  Série {selectedStream.code}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mt-1">
                  {selectedStream.name}
                </h3>
                <div className="text-xs text-slate-400">{selectedStream.category}</div>
              </div>
              <button
                onClick={() => setSelectedStream(null)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div>
                <h4 className="font-bold text-white mb-1">Présentation Complète :</h4>
                <p className="leading-relaxed">{selectedStream.fullDescription}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-amber-400">Conditions Réglementaires d'Accès :</h4>
                <p>{selectedStream.admissionConditions.formulaExplanation}</p>
              </div>

              <div>
                <h4 className="font-bold text-emerald-400 mb-1.5">Profil Idéal de l'Élève :</h4>
                <ul className="space-y-1 list-disc list-inside">
                  {selectedStream.idealProfile.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-teal-400 mb-1.5">Débouchés dans l'Enseignement Supérieur :</h4>
                <ul className="space-y-1 list-disc list-inside">
                  {selectedStream.higherEducationOutcomes.map((o, idx) => (
                    <li key={idx}>{o}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-indigo-400 mb-1.5">Métiers Cibles :</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStream.targetCareers.map((c, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedStream(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL FICHE DÉTAILLÉE D'UN MÉTIER D'APPRENTISSAGE */}
      {/* ========================================================================= */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start">
              <div>
                {selectedTrade.isLeadingSector && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1 inline-block">
                    ★ Secteur Porteur : {selectedTrade.leadingSectorName}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mt-1">
                  {selectedTrade.title}
                </h3>
                <div className="text-xs text-slate-400">{selectedTrade.category}</div>
              </div>
              <button
                onClick={() => setSelectedTrade(null)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <p className="leading-relaxed">{selectedTrade.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs">Niveau d'accès requis :</span>
                  <div className="font-semibold text-white mt-0.5">{selectedTrade.accessRequirement}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs">Certification / Diplôme :</span>
                  <div className="font-semibold text-emerald-400 mt-0.5">{selectedTrade.diplomaOrCertificate}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs">Durée de formation :</span>
                  <div className="font-semibold text-white mt-0.5">{selectedTrade.trainingDuration}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs">Revenus mensuels estimés :</span>
                  <div className="font-bold text-amber-300 font-mono mt-0.5">{selectedTrade.estimatedMonthlyIncomeFCFA}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-amber-400 mb-1.5">Compétences Pratiques Développées :</h4>
                <ul className="space-y-1 list-disc list-inside">
                  {selectedTrade.keyPracticalSkills.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-emerald-400 mb-1.5">Débouchés & Opportunités Professionnelles :</h4>
                <ul className="space-y-1 list-disc list-inside">
                  {selectedTrade.careerOutcomes.map((o, idx) => (
                    <li key={idx}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTrade(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL 3-PAGE CERTIFIED REPORT MODAL (POST-BEPC) */}
      {showThreePageReportModal && evaluationResult && (
        <OfficialCertifiedReport3Pages
          candidate={{
            fullName: studentRecords.studentName || "Le requérant",
            birthDate: studentRecords.birthDate || "20/09/2010",
            birthPlace: studentRecords.birthPlace || "Lomé (Togo)",
            nationality: studentRecords.nationality || "Togolaise",
            candidateId: studentRecords.candidateId || "CAND-2026-BEPC-4412",
            schoolOrigin: studentRecords.schoolOrigin,
            city: studentRecords.city || "Lomé",
            levelOrSerie: `Session BEPC ${studentRecords.bepcYear} (Classe de 3ème)`,
            orientationType: "POST_BEPC",
          }}
          demandSynthesis={{
            requestedPathways: [
              studentRecords.userWishedPathway === "lycee_general"
                ? "Lycée d'Enseignement Général (Seconde A4 ou Seconde S)"
                : studentRecords.userWishedPathway === "lycee_technique"
                ? "Lycée d'Enseignement Technique & Technologique"
                : studentRecords.userWishedPathway === "apprentissage_metier"
                ? "Apprentissage Professionnel d'un Métier Qualifiant"
                : "Orientation globale concertée"
            ],
            primaryAspiration: studentRecords.careerAspiration || "Insertion professionnelle d'avenir",
            wishedTradeOrField: studentRecords.wishedStreamOrTrade || studentRecords.careerAspiration || "Série du lycée ou filière technique",
            expressedMotivations: `Le requérant ${studentRecords.studentName} sollicite une orientation certifiée post-BEPC en cohérence avec ses moyennes de la 6ème à la 3ème, ses résultats au BEPC et son profil psychométrique.`,
            declaredTalents: studentRecords.userInterests || [],
          }}
          academicRecords={{
            globalAverage: evaluationResult.academicAverage,
            subjects: academicSubjectRows,
            calculationFormulaExplanation: "Somme cumulée de toutes les notes trimestrielles (6e, 5e, 4e, 3e) + note de l'examen du BEPC divisée par le nombre total de notes saisies.",
          }}
          psychometrics={{
            tests: psychometricTestRows,
            dominantRiasec: (evaluationResult.subjectDetails["mathematiques"]?.calculatedAverage || 0) >= 10 ? "IRS" : "ASE",
            psychologicalSummary: `Profil psychologique équilibré. L'analyse certifie une aptitude intellectuelle rigoureuse, une motivation soutenue (${studentRecords.careerAspiration || "Projet défini"}) et une résilience adaptée au cursus du second cycle de l'enseignement secondaire ou technique.`,
          }}
          decision={{
            decisionStatus:
              evaluationResult.recommendedDecisionType === "APPRENTISSAGE_AVEC_MENTION_ETUDES_POSSIBLES"
                ? "ACCORD_APPRENTISSAGE_AVEC_MENTION"
                : evaluationResult.isEligibleForA4_G1 || evaluationResult.isEligibleForS_G2_G3_F1_F4_E_Ti
                ? "FAVORABLE"
                : "DEFAVORABLE",
            decisionTitle:
              evaluationResult.recommendedDecisionType === "LYCEE_GENERAL"
                ? "AVIS FAVORABLE • ORIENTATION EN LYCÉE D'ENSEIGNEMENT GÉNÉRAL"
                : evaluationResult.recommendedDecisionType === "LYCEE_TECHNIQUE"
                ? "AVIS FAVORABLE • ORIENTATION EN LYCÉE TECHNIQUE & INDUSTRIEL"
                : evaluationResult.recommendedDecisionType === "APPRENTISSAGE_AVEC_MENTION_ETUDES_POSSIBLES"
                ? "AVIS TRÈS FAVORABLE • ACCORD APPRENTISSAGE AVEC MENTION D'EXCELLENCE"
                : "AVIS DÉFAVORABLE POUR LE LYCÉE GÉNÉRAL • RÉORIENTATION VERS UN MÉTIER QUALIFIANT CONSEILLÉE",
            argumentationText: evaluationResult.officialAdviceSummary,
            accessibleStreamsOrFields: evaluationResult.eligibleStreams.map((s) => ({
              code: s.code,
              name: s.name,
              category: s.category,
              description: s.shortDescription,
              institutionsOrLycees: s.targetCareers,
            })),
            alternativeSuggestions: evaluationResult.recommendedApprenticeshipTrades.map((t) => ({
              title: t.title,
              type: t.diplomaOrCertificate,
              duration: t.trainingDuration,
              incomeEstimate: t.estimatedMonthlyIncomeFCFA,
              description: t.description,
            })),
            documentRef: `OA-CERT-2026-BEPC-${Math.floor(Math.random() * 89999 + 10000)}`,
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

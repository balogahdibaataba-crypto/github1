export interface CandidateCivilData {
  fullName: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  candidateId?: string;
  schoolOrigin?: string;
  city?: string;
  levelOrSerie?: string;
  orientationType: "POST_BEPC" | "POST_BAC" | "BILAN_COMPETENCES" | "REORIENTATION";
  dateFormatted?: string;
}

export interface OrientationDemandSynthesis {
  requestedPathways: string[];
  primaryAspiration: string;
  wishedTradeOrField: string;
  expressedMotivations: string;
  declaredTalents: string[];
  submissionDate?: string;
  summaryText?: string;
}

export interface AcademicSubjectRow {
  name: string;
  code?: string;
  detailsByPeriod: string; // e.g. "T1: 14 | T2: 15 | T3: 13.5"
  examNote?: string | number; // Note BEPC ou BAC
  totalPoints: number | string;
  notesCount: number;
  calculatedAverage: number;
  requiredPassingAvg: number; // e.g. 10
  isEligible: boolean;
  tag?: string;
  teacherAppreciation?: string;
  globalAverageNote?: number | string;
}

export interface PsychometricTestRow {
  testName: string;
  scorePct: number;
  rawScoreLabel?: string;
  appreciation: string;
  badgeColor?: string;
  keyObservation: string;
}

export interface OfficialDecisionData {
  decisionStatus: "FAVORABLE" | "DEFAVORABLE" | "ACCORD_APPRENTISSAGE_AVEC_MENTION" | "RESERVE";
  decisionTitle: string;
  argumentationText: string;
  accessibleStreamsOrFields: {
    code: string;
    name: string;
    category?: string;
    description?: string;
    institutionsOrLycees?: string[];
  }[];
  alternativeSuggestions: {
    title: string;
    type: string; // "Métier Porteur", "Formation Pro BTS/CQP", "Filière Passerelle"
    duration?: string;
    incomeEstimate?: string;
    description: string;
  }[];
  officialNoticeDate?: string;
  documentRef: string;
}

export type DensityModeType = "ultra_compact" | "compact" | "balanced" | "spacious";
export type TypographyScalePreset = "compact" | "standard" | "spacious" | "large" | "auto";

export interface PageMetric {
  pageNumber: number;
  scrollHeight: number;
  clientHeight: number;
  maxA4Height: number;
  percent: number;
  isOverflow: boolean;
  isWarning: boolean;
  overflowPx: number;
}

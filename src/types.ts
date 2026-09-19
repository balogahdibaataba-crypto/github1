export type Continent = "Afrique" | "Europe" | "Amérique" | "Asie" | "Océanie";

export interface FacultyOrSchoolUnit {
  name: string;
  shortName?: string;
  type: "Faculté" | "École" | "Institut" | "UFR" | "Centre d'Excellence";
  description?: string;
  programCount?: number;
}

export interface Program {
  id: string;
  name: string;
  degree: string; // Licence, Master, Doctorat, BTS, DUT, Diplôme d'Ingénieur, etc.
  duration: string; // e.g., "3 ans", "2 ans", "5 ans"
  admissionConditions: string; // e.g. "BAC C, D, E ou S avec moyenne Math/Physique ≥ 12"
  requiredSubjects: string[]; // e.g. ["Mathématiques", "Physique-Chimie", "Français", "Anglais"]
  targetCareers: string[]; // e.g. ["Ingénieur Développeur", "Chef de projet informatique"]
  annualTuitionFCFA: number; // e.g. 250000 (public) or 850000 (privé)
  facultyOrSchool?: string; // e.g. "Faculté des Sciences de Santé (FSS)" or "École Nationale Supérieure d'Ingénieurs (ENSI)"
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  type: "Public" | "Privé";
  country: string;
  city: string;
  continent: Continent;
  logoUrl?: string;
  imageUrl: string;
  website?: string;
  description: string;
  facultiesAndSchools?: FacultyOrSchoolUnit[];
  programs: Program[];
  livingCostMonthlyFCFA: number; // Coût de la vie mensuel estimé (logement + nourriture + transport)
  livingCostDetails: string;
  searchableText?: string;
}

export interface Career {
  id: string;
  title: string;
  sector: string;
  description: string;
  requiredEducationLevel: "Sans diplôme" | "CAP / BT" | "BAC" | "BAC+2 / BTS / DUT" | "BAC+3 / Licence" | "BAC+5 / Master / Ingénieur" | "BAC+8 / Doctorat";
  diplomasRequired: string[];
  keySkills: string[];
  averageMonthlySalaryFCFA: string;
  topTrainingInstitutions: string[]; // Institution names
  isHighDemand: boolean;
}

export interface TestQuestionOption {
  label: string;
  value: string;
  categoryScore: Record<string, number>;
}

export interface TestQuestion {
  id: number;
  text: string;
  options: TestQuestionOption[];
}

export interface OrientationTest {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
  isRecruitmentTest?: boolean;
  targetAudience?: "Orientation Étudiante" | "Recrutement Candidat RH" | "IQ & Psychotechnique" | "Tous Publics";
  questions: TestQuestion[];
  interpretResult: (scores: Record<string, number>) => {
    primaryCategory: string;
    scoreSummary: Record<string, number>;
    description: string;
    recommendedFields: string[];
    recommendedCareers: string[];
    hrRecommendation?: string;
    suitabilityScore?: number;
    appreciation?: string;
  };
}

export interface SubjectGrade {
  subject: string;
  category: "Language" | "Humanities" | "Science";
  grade: number; // 0 to 20
  isRequiredMin10: boolean;
}

export interface OrientationService {
  id: string;
  title: string;
  description: string;
  priceFCFA: number;
  priceEUR: number;
  priceUSD: number;
  features: string[];
  popular?: boolean;
}

export interface PaymentReceipt {
  receiptHash: string;
  serviceId: string;
  serviceTitle: string;
  amount: number;
  currency: string;
  phone: string;
  provider: "mixx" | "moov" | "card";
  date: string;
}

export interface TrainingModulePracticeQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface TrainingModuleResearchAssignment {
  id: string;
  title: string;
  instructions: string;
  evaluationCriteria: string[];
  expectedDeliverable: string;
}

export interface TrainingProgramModule {
  id: string;
  title: string;
  description: string;
  keyTopics: string[];
  durationHours?: number;
  unNormsReference?: string;
  lessonContentText?: string;
  bibliographicReferences?: string[];
  researchAssignment?: TrainingModuleResearchAssignment;
  practiceQuestions?: TrainingModulePracticeQuestion[];
}

export interface TrainingExamQuestion {
  id: number;
  type: "closed" | "open"; // 50% closed MCQ, 50% open analytical
  questionText: string;
  options?: string[]; // for closed questions
  correctOptionIndex?: number; // for closed questions
  discipline: string; // e.g., "Mathématiques appliquées", "Gestion de projets", "Cyber-sécurité", "Stage & Expériences"
  modelAnswerText?: string; // for open questions evaluation
  points: number; // 1 point per question = 100 points total
}

export interface TrainingProgram {
  id: string;
  title: string;
  category: 
    | "Nations Unies & Action Humanitaire"
    | "Management & Projets"
    | "Technologies & IA"
    | "Finance & Comptabilité"
    | "Ressources Humaines"
    | "Santé, Hygiène & Environnement"
    | "Droit & Governance"
    | "Développement Durable"
    | "Logistique & Supply Chain"
    | "Communication & Relations Int."
    | "Santé & Hygiène"
    | "Droit & Conformité";
  level: "Certificat Professionnel Supérieur" | "Certificat d'Excellence Métier" | "Spécialisation VAE sur Titres";
  durationHours: number;
  description: string;
  careerOutcomes: string[];
  modules: TrainingProgramModule[];
  sampleQuestions: TrainingExamQuestion[];
  examFeeFCFA: number;
  isUNFavored?: boolean;
  targetOrganizations?: string[];
  isHighDemandJob?: boolean;
}

export interface CandidateDocumentUpload {
  id: string;
  type: "ACTE_NAISSANCE" | "NATIONALITE" | "CARTE_IDENTITE_ETUDIANT_FONCTIONNAIRE" | "RELEVE_NOTES" | "ATTESTATION_DIPLOME" | "ATTESTATION_STAGE_TRAVAIL" | "CV" | "RECU_PAIEMENT";
  label: string;
  fileName: string;
  fileDataUrl?: string;
  fileSizeMb?: number;
  uploadedAt: string;
  aiAuditStatus: "EN_ATTENTE" | "VALIDE_AUTHENTIQUE" | "REJETE_FRAUDULEUX";
  aiAuditNotes?: string;
  signatureAnalysis?: {
    status: "VALIDE" | "SUSPECT" | "ABSENT";
    authorityName: string;
    details: string;
  };
  institutionAnalysis?: {
    status: "CONFORME" | "SUSPECT" | "NON_RECONNU";
    institutionName: string;
    registryStatus: string;
    details: string;
  };
  sealAnalysis?: {
    status: "CONFORME" | "ALTERE" | "ABSENT";
    sealType: string;
    details: string;
  };
  logoAnalysis?: {
    status: "DETECTE" | "NON_CONFORME" | "ABSENT";
    logoName: string;
    details: string;
  };
  qrCodeAnalysis?: {
    status: "VALIDE" | "NON_LISIBLE" | "ABSENT";
    qrCodeRef: string;
    details: string;
  };
}

export interface CertificationApplication {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  selectedProgramId: string;
  uploadedDocuments: CandidateDocumentUpload[];
  auditOverallStatus: "EN_COURS" | "TOUT_VALIDE" | "REJETE";
  auditSummaryMessage: string;
  examGenerated: boolean;
  examScore?: number; // out of 100
  isPassed?: boolean; // score >= 80
  certificateCode?: string;
  certifiedDate?: string;
}

export interface HighSchoolStream {
  id: string;
  code: string; // "A4", "S (C, D)", "G1", "G2", "G3", "F1", "F2", "F3", "F4", "E", "Ti"
  name: string;
  category: "Général Littéraire" | "Général Scientifique" | "Technique Tertiaire" | "Technique Industriel & Technologique";
  shortDescription: string;
  fullDescription: string;
  admissionConditions: {
    requiredSubjects: string[];
    minAverageRequired: number; // usually 10/20
    formulaExplanation: string;
    bepcRequired: boolean;
  };
  dominantSubjects: { subject: string; coefficient: number }[];
  idealProfile: string[];
  higherEducationOutcomes: string[]; // Licences, BTS, DUT, Écoles d'ingénieurs
  targetCareers: string[];
  isHighDemand: boolean;
}

export interface ApprenticeshipTrade {
  id: string;
  title: string;
  category: string; // e.g. "BTP & Construction", "Énergies & Électricité", "Mécanique & Maintenance", "Agroalimentaire & Élevage", "Numérique & Électronique", "Artisanat d'Art & Décoration", "Mode & Stylisme", "Beauté & Bien-être", "Restauration & Hôtellerie", "Bois & Métal"
  description: string;
  accessRequirement: "Accessible sans le BEPC (Tous niveaux)" | "Accessible avec ou sans le BEPC" | "BEPC recommandé ou niveau 3ème";
  diplomaOrCertificate: string; // e.g. "CQP (Certificat de Qualification Professionnelle)", "CAP", "BT", "Attestation de fin d'apprentissage (AFA)"
  trainingDuration: string; // e.g. "12 à 24 mois", "2 à 3 ans", "6 à 12 mois"
  keyPracticalSkills: string[];
  careerOutcomes: string[];
  isLeadingSector: boolean; // Relève d'un secteur porteur (OUI/NON)
  leadingSectorName?: string; // e.g. "Énergies Renouvelables & Transition Énergétique", "BTP Moderne & Éco-construction"
  estimatedMonthlyIncomeFCFA: string;
  entrepreneurshipPotential: "Très Élevé" | "Élevé" | "Moyen";
}

export interface PostBepcYearTerms {
  t1?: number | null;
  t2?: number | null;
  t3?: number | null;
}

export interface PostBepcSubjectGrades {
  grade6eme?: PostBepcYearTerms;
  grade5eme?: PostBepcYearTerms;
  grade4eme?: PostBepcYearTerms;
  grade3eme?: PostBepcYearTerms;
  gradeBepc?: number | null;
}

export interface PostBepcStudentRecords {
  studentName: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  candidateId?: string;
  schoolOrigin: string;
  city: string;
  bepcYear: number;
  hasObtainedBepc: boolean;
  userWishedPathway: "lycee_general" | "lycee_technique" | "apprentissage_metier" | "indecis";
  wishedStreamOrTrade: string;
  userInterests: string[];
  careerAspiration: string;
  grades: {
    francais: PostBepcSubjectGrades;
    anglais: PostBepcSubjectGrades;
    mathematiques: PostBepcSubjectGrades;
    physiqueChimie: PostBepcSubjectGrades;
    svt: PostBepcSubjectGrades;
    histoireGeo?: PostBepcSubjectGrades;
    eps?: PostBepcSubjectGrades;
  };
  testScores?: Record<string, number>;
}

export interface SubjectCalculationDetail {
  subjectName: string;
  gradesList: { level: string; term?: string; grade: number }[];
  totalSum: number;
  count: number;
  calculatedAverage: number; // rounded to 2 decimals
  isPassing10: boolean;
  annualAverages?: {
    avg6eme?: number | null;
    avg5eme?: number | null;
    avg4eme?: number | null;
    avg3eme?: number | null;
    gradeBepc?: number | null;
  };
}

export interface PostBepcOrientationDecision {
  studentName: string;
  date: string;
  subjectDetails: Record<string, SubjectCalculationDetail>;
  isEligibleForA4_G1: boolean;
  isEligibleForS_G2_G3_F1_F4_E_Ti: boolean;
  eligibleStreams: HighSchoolStream[];
  ineligibleStreams: { stream: HighSchoolStream; reasons: string[] }[];
  recommendedDecisionType: "LYCEE_GENERAL" | "LYCEE_TECHNIQUE" | "APPRENTISSAGE_METIER" | "APPRENTISSAGE_AVEC_MENTION_ETUDES_POSSIBLES";
  officialAdviceSummary: string;
  recommendedApprenticeshipTrades: ApprenticeshipTrade[];
  decisionJustification: string[];
  counselorSignatureDate: string;
}

// ==========================================
// TYPES ORIENTATION POST-BAC (Cabinet Dr BALOGAH)
// ==========================================

export interface PostBacTrimesters {
  t1?: number | null;
  t2?: number | null;
  t3?: number | null;
}

export interface PostBacSubjectGrades {
  grade2nde?: PostBacTrimesters;
  grade1ere?: PostBacTrimesters;
  gradeTle?: PostBacTrimesters;
  gradeBac1?: number | null; // Probatoire / BAC 1
  gradeBac2?: number | null; // Examen BAC 2 (Terminale)
}

export interface PostBacPsychometricProfile {
  riasecScores?: {
    R: number; // Réaliste
    I: number; // Investigateur
    A: number; // Artistique
    S: number; // Social
    E: number; // Entreprenant
    C: number; // Conventionnel
  };
  dominantRiasec?: string; // e.g. "IRS", "ECS", "RIE"
  cognitiveIQScore?: number; // e.g. 115
  logicScore?: number; // e.g. 85 (%)
  emotionalResilienceScore?: number; // e.g. 80 (%)
  interestsSummary?: string;
  testDate?: string;
}

export interface PostBacStudentRecords {
  studentName: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  candidateId?: string;
  highSchoolOrigin: string;
  city: string;
  bacSerie: string; // e.g. "C", "D", "A4", "G2", "G3", "F1", "F2", "F3", "F4", "E", "Ti"
  bacYear: number;
  hasObtainedBac: boolean;
  userWishedPathway:
    | "universite_grandes_ecoles"
    | "sciences_sante"
    | "ingenierie_technologie"
    | "sciences_eco_gestion"
    | "droit_sciences_sociales"
    | "lettres_langues_arts"
    | "apprentissage_metier_postbac"
    | "indecis";
  wishedFieldOrTrade: string;
  userInterests: string[];
  careerAspiration: string;
  grades: {
    francais: PostBacSubjectGrades;
    philosophie: PostBacSubjectGrades;
    anglais: PostBacSubjectGrades;
    histoireGeo: PostBacSubjectGrades;
    mathematiques: PostBacSubjectGrades;
    physiqueChimie: PostBacSubjectGrades;
    svt: PostBacSubjectGrades;
    economieCompta: PostBacSubjectGrades;
    eps: PostBacSubjectGrades;
  };
  psychometrics: PostBacPsychometricProfile;
}

export type PostBacFieldCategory =
  | "sante_medecine"
  | "ingenierie_informatique"
  | "sciences_exactes"
  | "eco_gestion"
  | "droit_politique_social"
  | "lettres_langues_communication"
  | "agronomie_environnement";

export interface PostBacField {
  id: string;
  code: string;
  name: string;
  category: PostBacFieldCategory;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  dominantSubjects: { subject: string; coefficient: number }[];
  admissionConditions: {
    requiredSubjects: { subjectKey: string; subjectLabel: string; minScore: number }[];
    globalMinAvg: number;
    recommendedBacSeries: string[];
    formulaExplanation: string;
  };
  idealProfile: string[];
  riasecMatch: string[]; // e.g. ["I", "R", "C"]
  degreeLevels: ("Licence LMD" | "Master Professionnel" | "Doctorat / PhD" | "Diplôme d'État de Docteur en Médecine" | "Diplôme d'Ingénieur" | "DUT / BTS")[];
  targetInstitutions: string[];
  careerOutcomes: string[];
  employmentProspects: "Très Élevé" | "Élevé" | "Moyen" | "Spécialisé";
  isHighDemand?: boolean;
}

export interface PostBacApprenticeshipTrade {
  id: string;
  title: string;
  domain: string;
  diplomaOrCert: "CQP Post-BAC" | "BTS Professionnel" | "Titre Pro Certifié" | "Master Pro Métier" | "Certificat d'Expertise Technique";
  trainingDuration: string;
  shortDescription: string;
  keySkills: string[];
  entryRequirements: string;
  averageStartingSalaryFCFA: string;
  growthRate: string;
  careerOpportunities: string[];
  entrepreneurshipScore: number; // 1 to 10
  whyRecommended: string;
}

export interface PostBacOrientationDecision {
  studentName: string;
  date: string;
  bacSerie: string;
  subjectDetails: Record<string, SubjectCalculationDetail>;
  globalAcademicAverage: number;
  eligibleFields: PostBacField[];
  ineligibleFields: { field: PostBacField; reasons: string[] }[];
  eligibleCategories: string[];
  recommendedDecisionType:
    | "UNIVERSITE_GRANDES_ECOLES"
    | "SCIENCES_SANTE"
    | "INGENIERIE_TECH"
    | "DROIT_SOCIAL"
    | "ECO_GESTION"
    | "APPRENTISSAGE_REORIENTATION_CONSEILLEE"
    | "APPRENTISSAGE_EXCELLENCE_AVEC_MENTION_ETUDES_POSSIBLES";
  officialAdviceSummary: string;
  recommendedApprenticeshipTrades: PostBacApprenticeshipTrade[];
  decisionJustification: string[];
  psychometricConcordance: {
    dominantRiasec: string;
    alignmentScore: number;
    matchDescription: string;
    cognitiveAptitude: string;
  };
  counselorSignatureDate: string;
}

export interface ClientProfile {
  fullName: string;
  email: string;
  phone: string;
  currentLevel: string; // Terminale A4, Terminale C, Terminale D, Licence 2, Professionnel, etc.
  targetCountry: string;
  budgetFCFA: number;
}

export interface JobOffer {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string; // e.g. "Lomé, Togo", "Abidjan, Côte d'Ivoire", "Télétravail"
  contractType: "CDI" | "CDD" | "Stage" | "Freelance / Prestation";
  sector: string;
  description: string;
  requirements: string[];
  minPsychometricScore: number; // e.g. 75 (%)
  minIQ?: number; // e.g. 110
  requiredTestIds?: string[];
  salaryRangeFCFA: string;
  contactEmail: string;
  contactPhone: string;
  postedDate: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  title: string;
  degreeLevel: string;
  location: string;
  email: string;
  phone: string;
  psychometricScoreAvg: number; // e.g. 88%
  estimatedIQ: number; // e.g. 125
  completedTestCount: number;
  topSkills: string[];
  verifiedCertification: boolean;
  isAvailable: boolean;
  preferredSectors: string[];
}

export interface CareerEvent {
  id: string;
  title: string;
  category: "Webinaire" | "Salon Étudiant" | "Date Limite Recrutement" | "Atelier & Masterclass";
  organizer: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  location: string;
  description: string;
  speakers?: string[];
  targetAudience: string;
  registrationUrl?: string;
  isFeatured?: boolean;
}



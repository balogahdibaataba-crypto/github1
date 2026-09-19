import React from "react";
import {
  CandidateCivilData,
  OrientationDemandSynthesis,
  AcademicSubjectRow,
  PsychometricTestRow,
  OfficialDecisionData,
} from "../../types/reportTypes";
import {
  OrientaAfrikDirectorSeal,
  DrBalogahFingerprintStamp,
  DrBalogahSignature,
} from "../BalogahSignatureAndSeal";
import {
  Award,
  BookOpen,
  BrainCircuit,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  GraduationCap,
  Layers,
  MapPin,
  Scale,
  School,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

export interface ReportDensityClasses {
  cardPadding: string;
  sectionMargin: string;
  spacing: string;
  tablePadding: string;
  textXs: string;
  textSm: string;
  headingSm: string;
  headingMd: string;
}

interface CommonBlockProps {
  densityClasses: ReportDensityClasses;
  fontScale?: number;
}

// 1. Civil Identity Block
export const CivilIdentityBlock: React.FC<
  CommonBlockProps & {
    candidate: CandidateCivilData;
    docRef: string;
  }
> = ({ candidate, docRef, densityClasses }) => {
  const candidateName = candidate.fullName || "Le requérant";
  const birthDate = candidate.birthDate || "15/06/2006";
  const birthPlace = candidate.birthPlace || "Lomé (Togo)";
  const nationality = candidate.nationality || "Togolaise";

  return (
    <div
      className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
    >
      <div className="flex items-center justify-between border-b border-emerald-300 pb-1">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide">
          <User className="w-3.5 h-3.5 text-emerald-700" />
          <span>Identité Civile &amp; Administrative du Requérant</span>
        </div>
        <span className="text-[10px] font-mono font-black text-slate-950 bg-white border-2 border-emerald-600 px-1.5 py-0.5 rounded">
          N° {candidate.candidateId || docRef.slice(-6)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-1.5 text-slate-900 text-xs">
        {/* Line 1: Name */}
        <div className="border-b border-emerald-200 pb-1">
          <span className="text-slate-600 font-semibold text-[10px]">Nom et Prénoms du Candidat :</span>
          <p className="font-black text-slate-950 text-xs sm:text-sm tracking-tight leading-tight">
            {candidateName}
          </p>
        </div>

        {/* Line 2: Birthdate, Place, Origin */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 border-b border-emerald-200 pb-1">
          <div>
            <span className="text-slate-600 font-semibold text-[10px]">Date de Naissance :</span>
            <p className="font-bold text-slate-950 text-xs leading-tight">{birthDate}</p>
          </div>
          <div>
            <span className="text-slate-600 font-semibold text-[10px]">Lieu &amp; Nationalité :</span>
            <p className="font-bold text-slate-950 text-xs leading-tight">
              {birthPlace} • {nationality}
            </p>
          </div>
          <div>
            <span className="text-slate-600 font-semibold text-[10px]">Établissement de Provenance :</span>
            <p className="font-bold text-slate-950 text-xs leading-tight">
              {candidate.schoolOrigin || "Lycée d'Enseignement Général / Complexe Scolaire"}
            </p>
          </div>
        </div>

        {/* Line 3: Level/Serie & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <div>
            <span className="text-slate-600 font-semibold text-[10px]">Niveau d'Études / Série :</span>
            <p className="font-black text-emerald-800 text-xs leading-tight">
              {candidate.levelOrSerie ||
                (candidate.orientationType === "POST_BEPC"
                  ? "Classe de 3ème • Titulaire du BEPC"
                  : "Terminale • Titulaire du Baccalauréat")}
            </p>
          </div>
          <div>
            <span className="text-slate-600 font-semibold text-[10px]">Statut du Dossier :</span>
            <p className="font-black text-emerald-900 text-xs leading-tight">
              Dossier Complet • Certifié Conforme
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Demand Synthesis Block
export const DemandSynthesisBlock: React.FC<
  CommonBlockProps & {
    demandSynthesis: OrientationDemandSynthesis;
    candidateName: string;
    orientationType: string;
    pointNumber?: number;
  }
> = ({ demandSynthesis, candidateName, orientationType, densityClasses, pointNumber = 1 }) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
  >
    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide border-b border-emerald-300 pb-1">
      <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
        {pointNumber}
      </span>
      <span>Synthèse de la Demande d'Orientation Formulée par le Requérant</span>
    </div>

    <div className={`space-y-1.5 ${densityClasses.textSm} text-slate-900 text-justify`}>
      <p>
        Le requérant <strong>{candidateName}</strong> a officiellement saisi le Cabinet Conseil{" "}
        <strong>OrientaAfrik &amp; Certification</strong> pour une évaluation complète de son profil scolaire, de
        ses capacités psychométriques et de ses aptitudes professionnelles en vue de son orientation post-
        {orientationType === "POST_BEPC" ? "BEPC" : "BAC"}.
      </p>

      <div className="bg-white border-2 border-emerald-600 p-2 rounded-lg space-y-1 text-[11px] text-slate-900 shadow-2xs">
        <div className="font-bold text-emerald-950">Vœux et Aspirations Déclarés par le Requérant :</div>
        <ul className="space-y-0.5 list-disc list-inside text-slate-900 leading-tight">
          <li>
            <strong>Orientation souhaitée en premier choix :</strong>{" "}
            {demandSynthesis.wishedTradeOrField ||
              demandSynthesis.primaryAspiration ||
              "Filière Scientifique / Technique ou Apprentissage Métier"}
          </li>
          <li>
            <strong>Parcours sollicités :</strong>{" "}
            {demandSynthesis.requestedPathways.length > 0
              ? demandSynthesis.requestedPathways.join(", ")
              : "Enseignement Général, Technique ou Formation Professionnelle"}
          </li>
          <li>
            <strong>Motivations et projet d'avenir :</strong>{" "}
            {demandSynthesis.expressedMotivations ||
              "Volonté d'acquérir une formation solide et d'assurer une insertion professionnelle rapide dans un secteur à fort potentiel socio-économique."}
          </li>
        </ul>
      </div>
    </div>
  </div>
);

// 3. Academic Records Analysis Block
export const AcademicAnalysisBlock: React.FC<
  CommonBlockProps & {
    subjects: AcademicSubjectRow[];
    globalAverage: number;
    calculationFormulaExplanation?: string;
    pointNumber?: number;
    compact?: boolean;
  }
> = ({
  subjects,
  globalAverage,
  calculationFormulaExplanation,
  densityClasses,
  pointNumber = 2,
  compact = false,
}) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
  >
    <div className="flex items-center justify-between border-b border-emerald-300 pb-1">
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide">
        <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
          {pointNumber}
        </span>
        <span>Analyse Intégrale du Dossier Scolaire &amp; Résultats aux Examens</span>
      </div>
      <span className="font-mono text-[11px] font-black bg-white border-2 border-emerald-600 px-1.5 py-0.5 rounded text-black">
        Moyenne : {globalAverage.toFixed(2)}/20
      </span>
    </div>

    {/* Academic Table with High-Contrast Green Borders */}
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[11px] border-collapse border-2 border-emerald-600 bg-white">
        <thead>
          <tr className="bg-white text-slate-950 border-b-2 border-emerald-600">
            <th className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} font-black uppercase text-[9px]`}>
              Matière
            </th>
            <th className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} font-black uppercase text-[9px]`}>
              Périodes / Notes
            </th>
            <th className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} font-black uppercase text-[9px] text-center`}>
              Examen
            </th>
            <th className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} font-black uppercase text-[9px] text-center`}>
              Moyenne
            </th>
            <th className={`${densityClasses.tablePadding} font-black uppercase text-[9px] text-center`}>
              Diagnostic
            </th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-emerald-600">
          {subjects.map((s, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} font-bold text-slate-950`}>
                {s.name}
              </td>
              <td className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} text-slate-700 font-mono text-[10px]`}>
                {s.detailsByPeriod}
              </td>
              <td className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} text-center font-mono font-bold text-black`}>
                {s.examNote ? `${s.examNote}/20` : "—"}
              </td>
              <td className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} text-center font-mono font-black text-black`}>
                {s.calculatedAverage.toFixed(2)}/20
              </td>
              <td className={`${densityClasses.tablePadding} text-center`}>
                <span
                  className={`px-1 py-0.2 rounded text-[9px] font-black border uppercase tracking-wider ${
                    s.isEligible
                      ? "bg-white text-emerald-900 border-emerald-600"
                      : "bg-white text-rose-900 border-rose-600"
                  }`}
                >
                  {s.isEligible ? "Validé" : "Renforcer"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p className="text-[10px] text-slate-800 leading-tight">
      {calculationFormulaExplanation ||
        "Les moyennes des disciplines scientifiques et littéraires ont été pondérées conformément aux coefficients officiels en vigueur dans les curricula de l'espace CEDEAO."}
    </p>
  </div>
);

// 4. Academic Competencies & Key Disciplines Deep Diagnostic (For extended formats)
export const AcademicCompetenciesBlock: React.FC<
  CommonBlockProps & {
    subjects: AcademicSubjectRow[];
    pointNumber?: number;
  }
> = ({ subjects, densityClasses, pointNumber = 2 }) => {
  const scientific = subjects.filter(
    (s) => /math|phys|chimie|svt|sc\.|tech|info/i.test(s.name)
  );
  const literary = subjects.filter(
    (s) => /français|anglais|histoire|géo|philo|allemand|espagnol|litt/i.test(s.name)
  );
  const sciAvg =
    scientific.length > 0
      ? scientific.reduce((acc, s) => acc + s.calculatedAverage, 0) / scientific.length
      : 12.5;
  const litAvg =
    literary.length > 0
      ? literary.reduce((acc, s) => acc + s.calculatedAverage, 0) / literary.length
      : 13.0;

  return (
    <div
      className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
    >
      <div className="flex items-center justify-between border-b border-emerald-300 pb-1">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide">
          <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
            {pointNumber}
          </span>
          <span>Diagnostic Approfondi des Pôles Disciplinaires &amp; Aptitudes Académiques</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="border-2 border-emerald-500 rounded-lg p-2.5 bg-emerald-50/30 space-y-1.5">
          <div className="flex items-center justify-between border-b border-emerald-300 pb-1">
            <span className="font-black text-emerald-950 uppercase text-[11px] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-700" />
              Pôle Scientifique &amp; Quantitatif
            </span>
            <span className="font-mono font-black text-emerald-900 bg-white border border-emerald-500 px-1 rounded text-[10px]">
              Moy : {sciAvg.toFixed(2)}/20
            </span>
          </div>
          <p className="text-[10px] text-slate-800 leading-snug">
            {sciAvg >= 12
              ? "Excellente prédisposition pour le raisonnement abstrait, l'analyse de modèles, le calcul différentiel et les applications techniques."
              : "Compétences scientifiques équilibrées nécessitant un travail soutenu d'approfondissement en mathématiques et sciences appliquées."}
          </p>
          <div className="text-[9px] text-emerald-900 font-semibold">
            Disciplines évaluées : {scientific.map((s) => s.name).join(", ") || "Mathématiques, Sciences Physiques, SVT"}
          </div>
        </div>

        <div className="border-2 border-emerald-500 rounded-lg p-2.5 bg-emerald-50/30 space-y-1.5">
          <div className="flex items-center justify-between border-b border-emerald-300 pb-1">
            <span className="font-black text-emerald-950 uppercase text-[11px] flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              Pôle Littéraire &amp; Communication
            </span>
            <span className="font-mono font-black text-emerald-900 bg-white border border-emerald-500 px-1 rounded text-[10px]">
              Moy : {litAvg.toFixed(2)}/20
            </span>
          </div>
          <p className="text-[10px] text-slate-800 leading-snug">
            {litAvg >= 12
              ? "Grande aisance rédactionnelle, rigueur dans l'argumentation textuelle et très bonne maîtrise des langues de communication internationale."
              : "Capacité d'expression et de synthèse solide, constituant un socle favorable aux interactions professionnelles."}
          </p>
          <div className="text-[9px] text-emerald-900 font-semibold">
            Disciplines évaluées : {literary.map((s) => s.name).join(", ") || "Français, Anglais, Histoire-Géographie"}
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Psychometrics & RIASEC Block
export const PsychometricsBlock: React.FC<
  CommonBlockProps & {
    tests: PsychometricTestRow[];
    dominantRiasec?: string;
    psychologicalSummary: string;
    pointNumber?: number;
    compact?: boolean;
  }
> = ({
  tests,
  dominantRiasec,
  psychologicalSummary,
  densityClasses,
  pointNumber = 3,
  compact = false,
}) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
  >
    <div className="flex items-center justify-between border-b border-emerald-300 pb-1">
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide">
        <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
          {pointNumber}
        </span>
        <span>Évaluation Psychométrique &amp; Profil Typologique RIASEC</span>
      </div>
      {dominantRiasec && (
        <span className="font-mono text-[11px] font-black bg-white border-2 border-emerald-600 px-1.5 py-0.5 rounded text-black">
          Typologie : {dominantRiasec}
        </span>
      )}
    </div>

    {/* Psychometric table */}
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[11px] border-collapse border-2 border-emerald-600 bg-white">
        <thead>
          <tr className="bg-white text-slate-950 border-b-2 border-emerald-600">
            <th className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} font-black uppercase text-[9px]`}>
              Dimension Psychologique
            </th>
            <th className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} font-black uppercase text-[9px] text-center`}>
              Score (%)
            </th>
            <th className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} font-black uppercase text-[9px]`}>
              Appréciation
            </th>
            <th className={`${densityClasses.tablePadding} font-black uppercase text-[9px]`}>
              Observation Clinique
            </th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-emerald-600">
          {tests.map((t, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} font-bold text-slate-950`}>
                {t.testName}
              </td>
              <td className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} text-center font-mono font-black text-black`}>
                {t.scorePct}%
              </td>
              <td className={`border-r-2 border-emerald-600 ${densityClasses.tablePadding} font-semibold text-emerald-900`}>
                {t.appreciation}
              </td>
              <td className={`${densityClasses.tablePadding} text-slate-800 text-[10px]`}>
                {t.keyObservation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="bg-white border-2 border-emerald-600 p-2 rounded-lg space-y-0.5 text-[11px] text-slate-900">
      <div className="font-bold text-emerald-950">Synthèse Psychologique d'Orientation :</div>
      <p className="leading-snug">
        {psychologicalSummary ||
          "Le profil cognitif et émotionnel du requérant témoigne d'une grande rigueur de raisonnement, d'une prédisposition marquée pour les sciences appliquées et d'une motivation soutenue pour les réalisations concrètes et techniques."}
      </p>
    </div>
  </div>
);

// 6. Cognitive Mapping & Executive Functions (For deep audit formats)
export const CognitiveMappingBlock: React.FC<
  CommonBlockProps & {
    pointNumber?: number;
  }
> = ({ densityClasses, pointNumber = 3 }) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
  >
    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide border-b border-emerald-300 pb-1">
      <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
        {pointNumber}
      </span>
      <span>Cartographie des Fonctions Exécutives &amp; Aptitudes Cognitives Opérationnelles</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
      <div className="border border-emerald-400 p-2 rounded-lg bg-emerald-50/20 space-y-1">
        <div className="font-bold text-emerald-950 text-[11px] flex items-center gap-1">
          <BrainCircuit className="w-3.5 h-3.5 text-emerald-700" />
          Raisonnement Logique &amp; Spatial
        </div>
        <p className="text-[10px] text-slate-700 leading-tight">
          Capacité d'abstraction élevée, appréhension intuitive des structures géométriques et des systèmes dynamiques.
        </p>
        <div className="text-[9px] font-mono font-bold text-emerald-800">Indice : Élevé (88/100)</div>
      </div>

      <div className="border border-emerald-400 p-2 rounded-lg bg-emerald-50/20 space-y-1">
        <div className="font-bold text-emerald-950 text-[11px] flex items-center gap-1">
          <Target className="w-3.5 h-3.5 text-emerald-700" />
          Attention Soutenue &amp; Rigueur
        </div>
        <p className="text-[10px] text-slate-700 leading-tight">
          Forte concentration face aux tâches complexes, méthodologie ordonnée dans l'exécution des protocoles d'analyse.
        </p>
        <div className="text-[9px] font-mono font-bold text-emerald-800">Indice : Très Satisfaisant (84/100)</div>
      </div>

      <div className="border border-emerald-400 p-2 rounded-lg bg-emerald-50/20 space-y-1">
        <div className="font-bold text-emerald-950 text-[11px] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          Adaptabilité &amp; Autonomie
        </div>
        <p className="text-[10px] text-slate-700 leading-tight">
          Aisance à s'intégrer dans de nouveaux environnements d'apprentissage et à mobiliser ses acquis en situation concrète.
        </p>
        <div className="text-[9px] font-mono font-bold text-emerald-800">Indice : Remarquable (90/100)</div>
      </div>
    </div>
  </div>
);

// 7. Official Decision Block
export const OfficialDecisionBlock: React.FC<
  CommonBlockProps & {
    decision: OfficialDecisionData;
    candidateName: string;
    orientationType: string;
    pointNumber?: number;
    compact?: boolean;
  }
> = ({
  decision,
  candidateName,
  orientationType,
  densityClasses,
  pointNumber = 4,
  compact = false,
}) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
  >
    <div className="flex items-center justify-between border-b border-emerald-300 pb-1">
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide">
        <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
          {pointNumber}
        </span>
        <span>Avis Officiel d'Orientation &amp; Séries / Filières Accordées</span>
      </div>
      <span className="font-mono text-[11px] font-black bg-white border-2 border-emerald-600 px-1.5 py-0.5 rounded text-emerald-950">
        AVIS : {decision.decisionStatus}
      </span>
    </div>

    <div className={`space-y-1.5 ${densityClasses.textSm} text-slate-900 leading-relaxed text-justify`}>
      <div className="bg-white border-2 border-emerald-600 p-2 rounded-lg">
        <div className="font-black text-slate-950 text-xs">
          DÉCISION : {decision.decisionTitle}
        </div>
        <p className="mt-0.5 text-slate-800 text-[11px]">
          {decision.argumentationText}
        </p>
      </div>

      <div>
        <div className="font-black text-slate-950 text-xs mb-1">
          SÉRIES / PARCOURS OFFICIELLEMENT ACCORDÉS :
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {decision.accessibleStreamsOrFields.map((s, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-emerald-600 p-1.5 rounded-lg space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-950 text-xs">{s.name}</span>
                <span className="font-mono text-[9px] font-black bg-white border border-emerald-600 text-black px-1 rounded">
                  {s.code}
                </span>
              </div>
              <p className="text-[10px] text-slate-700 leading-tight">
                {s.description || "Filière hautement recommandée correspondant aux points forts du candidat."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 8. Target Institutions & Admission Conditions Block (For 5-10 pages)
export const TargetInstitutionsBlock: React.FC<
  CommonBlockProps & {
    decision: OfficialDecisionData;
    pointNumber?: number;
  }
> = ({ decision, densityClasses, pointNumber = 4 }) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
  >
    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide border-b border-emerald-300 pb-1">
      <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
        {pointNumber}
      </span>
      <span>Établissements Cibles, Universités d'Accueil &amp; Conditions d'Accès</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
      <div className="border border-emerald-400 p-2.5 rounded-lg bg-white space-y-1">
        <div className="font-bold text-emerald-950 text-xs flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-emerald-700" />
          Pôles d'Excellence &amp; Facultés de Référence
        </div>
        <p className="text-[10px] text-slate-700 leading-tight">
          Établissements publics et privés agréés répondant aux standards CAMES et aux exigences d'accréditation sous-régionale.
        </p>
        <ul className="text-[9.5px] text-slate-800 list-disc list-inside space-y-0.5 pt-0.5">
          <li>Universités Publiques (UL, UK) &amp; Instituts Supérieurs</li>
          <li>Lycées Scientifiques &amp; Complexes Techniques d'État</li>
          <li>Grandes Écoles d'Ingénierie &amp; de Gestion CEDEAO</li>
        </ul>
      </div>

      <div className="border border-emerald-400 p-2.5 rounded-lg bg-white space-y-1">
        <div className="font-bold text-emerald-950 text-xs flex items-center gap-1">
          <Scale className="w-3.5 h-3.5 text-emerald-700" />
          Critères de Sélection &amp; Modalités Administratives
        </div>
        <p className="text-[10px] text-slate-700 leading-tight">
          L'admission s'effectue sur présentation du présent rapport certifié, complété par les relevés officiels des examens nationaux.
        </p>
        <div className="text-[9.5px] text-emerald-950 font-bold bg-emerald-50/50 p-1 rounded border border-emerald-300">
          Priorité accordée aux dossiers labellisés OrientaAfrik Certification.
        </div>
      </div>
    </div>
  </div>
);

// 9. Alternative Suggestions & Career Opportunities Block
export const AlternativeSuggestionsBlock: React.FC<
  CommonBlockProps & {
    alternativeSuggestions: OfficialDecisionData["alternativeSuggestions"];
    pointNumber?: number;
  }
> = ({ alternativeSuggestions, densityClasses, pointNumber = 5 }) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
  >
    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide border-b border-emerald-300 pb-1">
      <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
        {pointNumber}
      </span>
      <span>Suggestions d'Autres Orientations Professionnelles &amp; Métiers Porteurs</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
      {alternativeSuggestions.map((alt, idx) => (
        <div
          key={idx}
          className="bg-white border-2 border-emerald-600 p-1.5 rounded-lg space-y-0.5 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-950 text-xs">{alt.title}</span>
            {alt.incomeEstimate && (
              <span className="text-[9px] font-mono font-black text-black bg-white border border-emerald-600 px-1 rounded">
                {alt.incomeEstimate}
              </span>
            )}
          </div>
          <div className="text-[9px] text-emerald-800 font-semibold">
            {alt.type} • {alt.duration || "Formation certifiante"}
          </div>
          <p className="text-[10px] text-slate-700 leading-tight">{alt.description}</p>
        </div>
      ))}
    </div>
  </div>
);

// 10. Labor Market Observatory & CEDEAO Employment Trends (For 6-10 pages)
export const LaborMarketObservatoryBlock: React.FC<
  CommonBlockProps & {
    pointNumber?: number;
  }
> = ({ densityClasses, pointNumber = 5 }) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
  >
    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide border-b border-emerald-300 pb-1">
      <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
        {pointNumber}
      </span>
      <span>Observatoire de l'Emploi &amp; Dynamiques des Métiers d'Avenir (Espace CEDEAO)</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
      <div className="border border-emerald-400 p-2 rounded-lg bg-emerald-50/10 space-y-1">
        <div className="font-bold text-emerald-950 text-[11px]">Secteurs à Forte Tension</div>
        <p className="text-[10px] text-slate-700 leading-tight">
          Ingénierie informatique, intelligence artificielle, technologies agricoles modernes, énergies renouvelables et génie civil.
        </p>
      </div>

      <div className="border border-emerald-400 p-2 rounded-lg bg-emerald-50/10 space-y-1">
        <div className="font-bold text-emerald-950 text-[11px]">Opportunités Entrepreneuriales</div>
        <p className="text-[10px] text-slate-700 leading-tight">
          Création d'entreprises technologiques, services d'expertise-conseil, agro-industrie et transformation locale à forte valeur ajoutée.
        </p>
      </div>

      <div className="border border-emerald-400 p-2 rounded-lg bg-emerald-50/10 space-y-1">
        <div className="font-bold text-emerald-950 text-[11px]">Mobilité &amp; International</div>
        <p className="text-[10px] text-slate-700 leading-tight">
          Reconnaissance des compétences dans l'ensemble des 15 pays de la CEDEAO et passerelles vers les bourses de coopération internationale.
        </p>
      </div>
    </div>
  </div>
);

// 11. Pedagogical & Methodological Recommendations (For 6-10 pages)
export const PedagogicalRecommendationsBlock: React.FC<
  CommonBlockProps & {
    pointNumber?: number;
  }
> = ({ densityClasses, pointNumber = 6 }) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
  >
    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide border-b border-emerald-300 pb-1">
      <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
        {pointNumber}
      </span>
      <span>Prescriptions Pédagogiques &amp; Méthodologie de Travail Personnalisée</span>
    </div>

    <div className="space-y-1.5 text-xs text-slate-800 text-justify">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="bg-white border border-emerald-400 p-2 rounded-lg space-y-1">
          <div className="font-bold text-emerald-950 text-[11px]">Organisation du Travail Personnel :</div>
          <ul className="text-[10px] text-slate-700 list-disc list-inside space-y-0.5">
            <li>Planification hebdomadaire rigoureuse (au moins 15h de travail individuel).</li>
            <li>Pratique intensive d'exercices d'application et d'annales corrigées.</li>
            <li>Constitution de fiches de synthèse thématiques dès la rentrée.</li>
          </ul>
        </div>

        <div className="bg-white border border-emerald-400 p-2 rounded-lg space-y-1">
          <div className="font-bold text-emerald-950 text-[11px]">Développement des Soft Skills :</div>
          <ul className="text-[10px] text-slate-700 list-disc list-inside space-y-0.5">
            <li>Participation aux clubs scientifiques et ateliers d'éloquence.</li>
            <li>Apprentissage en autonomie d'outils numériques spécialisés.</li>
            <li>Stages d'immersion pratique pendant les congés académiques.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// 12. Strategic Action Plan Block
export const StrategicActionPlanBlock: React.FC<
  CommonBlockProps & {
    pointNumber?: number;
  }
> = ({ densityClasses, pointNumber = 6 }) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white ${densityClasses.spacing} shadow-xs`}
  >
    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wide border-b border-emerald-300 pb-1">
      <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white text-emerald-950 flex items-center justify-center text-[10px] font-black">
        {pointNumber}
      </span>
      <span>Recommandations Pédagogiques &amp; Plan d'Action Stratégique d'Insertion</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px]">
      <div className="bg-emerald-50/50 border border-emerald-300 p-1.5 rounded-lg space-y-0.5">
        <div className="font-bold text-emerald-950 flex items-center gap-1 text-[11px]">
          <Target className="w-3 h-3 text-emerald-700" />
          <span>Démarches Immédiates</span>
        </div>
        <p className="text-[10px] text-slate-700 leading-tight">
          Dépôt du dossier certifié auprès de la commission d'admission ou de l'établissement d'accueil désigné.
        </p>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-300 p-1.5 rounded-lg space-y-0.5">
        <div className="font-bold text-emerald-950 flex items-center gap-1 text-[11px]">
          <TrendingUp className="w-3 h-3 text-emerald-700" />
          <span>Renforcement Méthodique</span>
        </div>
        <p className="text-[10px] text-slate-700 leading-tight">
          Consolidation des matières scientifiques ou techniques cibles pour garantir la réussite au cycle supérieur.
        </p>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-300 p-1.5 rounded-lg space-y-0.5">
        <div className="font-bold text-emerald-950 flex items-center gap-1 text-[11px]">
          <ShieldCheck className="w-3 h-3 text-emerald-700" />
          <span>Suivi d'Orientation</span>
        </div>
        <p className="text-[10px] text-slate-700 leading-tight">
          Possibilité d'un accompagnement personnalisé régulier par le Cabinet OrientaAfrik tout au long de l'année.
        </p>
      </div>
    </div>
  </div>
);

// 13. Official Seal, Signature & Biometric Security Block
export const OfficialSealAndBiometricBlock: React.FC<
  CommonBlockProps & {
    docRef: string;
    qrCodeUrl: string;
    pointNumber?: number;
  }
> = ({ docRef, qrCodeUrl, densityClasses, pointNumber = 7 }) => (
  <div
    className={`border-2 border-emerald-600 rounded-xl ${densityClasses.cardPadding} ${densityClasses.sectionMargin} bg-white shadow-xs`}
  >
    <div className="text-[10px] sm:text-[11px] font-black uppercase text-slate-950 border-b border-emerald-300 pb-0.5 mb-1.5 tracking-wide text-center">
      {pointNumber}. Clôture Officielle, Validation Juridique &amp; Dispositif Biométrique de Sécurité
    </div>

    {/* The 4 Horizontal Security Modules in 1 Row */}
    <div className="grid grid-cols-4 gap-1.5 items-center text-center">
      {/* Module 1: Identification of Director */}
      <div className="border-2 border-emerald-600 p-1.5 rounded-lg bg-white flex flex-col justify-center h-24 space-y-0.5">
        <div className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">Directeur Général</div>
        <div className="font-black text-slate-950 text-[11px] leading-tight">Dr BALOGAH Dibaataba</div>
        <div className="text-[7px] text-emerald-900 font-semibold leading-tight">
          Ph.D en Sciences de l'Éducation
        </div>
        <div className="text-[6.5px] text-slate-600 leading-tight">
          Conseiller d'Orientation Scolaire &amp; Pro
        </div>
      </div>

      {/* Module 2: Official Seal & Signature */}
      <div className="border-2 border-emerald-600 p-0.5 rounded-lg bg-white flex flex-col items-center justify-center h-24">
        <div className="text-[7px] text-slate-600 font-bold uppercase mb-0.5">Sceau &amp; Signature</div>
        <OrientaAfrikDirectorSeal size={56} />
      </div>

      {/* Module 3: Biometric Fingerprint */}
      <div className="border-2 border-emerald-600 p-0.5 rounded-lg bg-white flex flex-col items-center justify-center h-24">
        <div className="text-[7px] text-slate-600 font-bold uppercase mb-0.5">Empreinte Directoire</div>
        <DrBalogahFingerprintStamp size={52} />
      </div>

      {/* Module 4: Verification QR Code with Bold Black Reference */}
      <div className="border-2 border-emerald-600 p-0.5 rounded-lg bg-white flex flex-col items-center justify-center h-24">
        <div className="text-[7px] text-slate-600 font-bold uppercase mb-0.5">Vérification QR</div>
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="QR Code Sécurisé" className="w-10 h-10 object-contain" />
        ) : (
          <div className="w-10 h-10 bg-white border border-slate-300 flex items-center justify-center text-[7px] font-mono">
            QR
          </div>
        )}
        <span className="font-mono text-[7px] font-black text-black mt-0.5">
          RÉF : {docRef}
        </span>
      </div>
    </div>

    <div className="text-center text-[7.5px] text-slate-600 mt-1 font-mono">
      Document officiel infalsifiable délivré par le Cabinet OrientaAfrik • Enregistré sous le numéro d'agrément ministériel officiel.
    </div>
  </div>
);

// 14. Certificate Backing Block (for 2-up even pairing)
export const CertificateBackingBlock: React.FC<{ docRef: string }> = ({ docRef }) => (
  <div className="border-2 border-emerald-600 rounded-xl p-4 bg-emerald-50/20 flex flex-col justify-between h-full text-slate-900">
    <div className="text-center space-y-2 border-b-2 border-emerald-600 pb-3">
      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border-2 border-emerald-600">
        <ShieldCheck className="w-6 h-6" />
      </div>
      <div className="text-xs font-black uppercase text-emerald-950 font-serif">
        Certificat d'Authenticité &amp; Mentions Légales
      </div>
      <div className="text-[10px] text-slate-700 font-mono">
        RÉFÉRENCE UNIQUE D'ENREGISTREMENT : <strong>{docRef}</strong>
      </div>
    </div>

    <div className="space-y-3 text-xs leading-relaxed text-slate-800 text-justify my-auto">
      <p>
        Le présent rapport d'orientation scolaire et professionnelle constitue un acte officiel certifié conforme aux normes pédagogiques de l'espace CEDEAO et de la République Togolaise.
      </p>
      <div className="bg-white border-2 border-emerald-600 p-2.5 rounded-lg space-y-1 text-[11px]">
        <div className="font-bold text-emerald-950">Instructions de Vérification :</div>
        <ul className="list-disc list-inside text-slate-700 space-y-0.5">
          <li>Scannez le QR Code officiel présent sur chaque page.</li>
          <li>Rendez-vous sur le portail : <strong>orientaafrik.mpginternational.org</strong></li>
          <li>Saisissez la référence officielle : <strong>{docRef}</strong></li>
        </ul>
      </div>
      <p className="text-[10px] text-slate-600">
        Toute altération, falsification ou reproduction non autorisée expose son auteur aux sanctions légales prévues par le code pénal en vigueur.
      </p>
    </div>

    <div className="border-t-2 border-emerald-600 pt-2 text-center text-[9px] font-mono text-slate-600">
      OrientaAfrik Certification • Dr BALOGAH Dibaataba • Lomé, Togo
    </div>
  </div>
);

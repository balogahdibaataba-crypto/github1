import React, { useMemo } from "react";
import {
  CandidateCivilData,
  OrientationDemandSynthesis,
  AcademicSubjectRow,
  PsychometricTestRow,
  OfficialDecisionData,
  PageMetric,
} from "../../types/reportTypes";
import {
  CivilIdentityBlock,
  DemandSynthesisBlock,
  AcademicAnalysisBlock,
  AcademicCompetenciesBlock,
  PsychometricsBlock,
  CognitiveMappingBlock,
  OfficialDecisionBlock,
  TargetInstitutionsBlock,
  AlternativeSuggestionsBlock,
  LaborMarketObservatoryBlock,
  PedagogicalRecommendationsBlock,
  StrategicActionPlanBlock,
  OfficialSealAndBiometricBlock,
  ReportDensityClasses,
} from "./ReportBlocks";
import {
  BlockPageAssignment,
  BlockFontScales,
  ReportBlockId,
  DEFAULT_BLOCK_ORDER,
  REPORT_BLOCK_DEFINITIONS,
  calculateDynamicPointNumbers,
  getDocumentOptionForPageCount,
} from "../../types/reportCustomizerTypes";
import { GraduationCap } from "lucide-react";

export interface ReportLayoutProps {
  pageNum: number;
  totalPages: number;
  candidate: CandidateCivilData;
  demandSynthesis: OrientationDemandSynthesis;
  academicRecords: {
    subjects: AcademicSubjectRow[];
    globalAverage: number;
    calculationFormulaExplanation?: string;
  };
  psychometrics: {
    tests: PsychometricTestRow[];
    dominantRiasec?: string;
    psychologicalSummary: string;
  };
  decision: OfficialDecisionData;
  docRef: string;
  formattedDate: string;
  qrCodeUrl: string;
  densityClasses: ReportDensityClasses;
  pageMetrics: PageMetric[];
  fontScale: number;
  is2UpCompact?: boolean;
  blockAssignment?: BlockPageAssignment;
  blockOrder?: ReportBlockId[];
  blockFontScales?: BlockFontScales;
}

export const ReportPageLayout: React.FC<ReportLayoutProps> = ({
  pageNum,
  totalPages,
  candidate,
  demandSynthesis,
  academicRecords,
  psychometrics,
  decision,
  docRef,
  formattedDate,
  qrCodeUrl,
  densityClasses,
  pageMetrics,
  fontScale,
  is2UpCompact = false,
  blockAssignment,
  blockOrder,
  blockFontScales,
}) => {
  const candidateName = candidate.fullName || "Le requérant";

  // Calculate dynamic sequential point numbers according to actual visual block order across pages
  const dynamicPointNumbers = useMemo(() => {
    if (!blockAssignment) return {} as Record<ReportBlockId, number>;
    return calculateDynamicPointNumbers(
      totalPages,
      blockAssignment,
      blockOrder || DEFAULT_BLOCK_ORDER
    );
  }, [totalPages, blockAssignment, blockOrder]);

  // Official Page Header (Rendered ONLY on Page 1)
  const renderOfficialHeader = () => (
    <div
      className={`border-b-2 border-emerald-600 pb-2 ${densityClasses.sectionMargin} flex justify-between items-center bg-white`}
    >
      {/* Left Corner: Official Logo & Institution Name */}
      <div className="flex items-center gap-2.5 max-w-[65%]">
        {/* Official Logo Badge */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-950 border-2 border-emerald-500 flex flex-col items-center justify-center text-white shadow-md shrink-0">
          <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          <span className="text-[6.5px] font-black tracking-widest text-emerald-200 uppercase">
            AFRIK
          </span>
        </div>

        {/* Institution Titles */}
        <div className="space-y-0.5">
          <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-950 font-serif leading-tight">
            OrientaAfrik &amp; Certification
          </div>
          <div className="text-[11px] sm:text-xs font-black text-slate-950 tracking-tight leading-tight">
            Cabinet Conseil Dr BALOGAH Dibaataba
          </div>
          <div className="text-[8px] sm:text-[9px] text-slate-700 leading-snug">
            Spécialiste des sciences de l'éducation et de la formation • Conseiller d'orientation scolaire et professionnelle
          </div>
          <div className="text-[7.5px] sm:text-[8px] text-emerald-800 font-bold font-mono">
            orientaafrik.mpginternational.org • Agrément Ministériel Officiel
          </div>
        </div>
      </div>

      {/* Right Corner: Prominent Bold Reference & Date */}
      <div className="text-right space-y-1 shrink-0">
        <div className="inline-flex flex-col items-end px-3 py-1 bg-white border-2 border-emerald-700 rounded-xl shadow-xs">
          <span className="text-[7.5px] sm:text-[8px] text-slate-600 font-bold uppercase tracking-wider">
            RÉFÉRENCE OFFICIELLE DU RAPPORT
          </span>
          <span className="text-slate-950 font-mono text-xs sm:text-sm font-black tracking-wider">
            RÉF : {docRef}
          </span>
        </div>
        <div className="text-[8.5px] sm:text-[9px] text-slate-800 font-mono font-bold">
          Lomé, le {formattedDate}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="inline-flex items-center gap-1 bg-emerald-900 text-white border border-emerald-700 text-[8px] sm:text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
            ★ FEUILLE 1 SUR {totalPages} ★
          </div>
          <div
            className={`inline-flex items-center gap-1 text-[7.5px] sm:text-[8px] font-mono font-black px-2 py-0.5 rounded-full border shadow-2xs ${
              totalPages <= 2
                ? "bg-amber-100 text-amber-950 border-amber-500"
                : totalPages === 3
                ? "bg-emerald-100 text-emerald-950 border-emerald-600"
                : totalPages <= 5
                ? "bg-blue-100 text-blue-950 border-blue-600"
                : "bg-purple-100 text-purple-950 border-purple-600"
            }`}
          >
            {getDocumentOptionForPageCount(totalPages).badge}
          </div>
        </div>
      </div>
    </div>
  );

  // Official Page Footer
  const renderFooter = (stepSummary?: string) => {
    const metric = pageMetrics[pageNum - 1];
    const docOption = getDocumentOptionForPageCount(totalPages);

    return (
      <div className="mt-auto pt-1.5">
        {/* Real-time A4 In-page Indicator (Screen Only) */}
        {metric && (
          <div className="print-hidden-element mb-1 flex items-center justify-between text-[9px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
            <span className="flex items-center gap-1 font-bold">
              <span
                className={`w-2 h-2 rounded-full ${
                  metric.isOverflow
                    ? "bg-rose-500 animate-pulse"
                    : metric.isWarning
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />
              <span
                className={
                  metric.isOverflow
                    ? "text-rose-700 font-black"
                    : metric.isWarning
                    ? "text-amber-700 font-bold"
                    : "text-emerald-700 font-bold"
                }
              >
                {metric.isOverflow
                  ? `⚠️ Dépassement A4 (+${metric.overflowPx}px)`
                  : metric.isWarning
                  ? `⚠️ Limite A4 atteinte (${metric.percent}%)`
                  : `✓ Zone A4 conforme (${metric.percent}%)`}
              </span>
            </span>
            <span className="text-slate-500">
              {metric.scrollHeight}px / {metric.maxA4Height}px
            </span>
          </div>
        )}

        <div className="pt-1.5 border-t-2 border-emerald-600 flex justify-between items-end text-xs">
          <div className="text-[8px] sm:text-[9px] text-slate-700 font-mono space-y-0.5">
            <div>
              Rapport Certifié • {candidateName} • <strong className="text-emerald-950 font-bold">{docOption.shortLabel}</strong>
            </div>
            <div>
              RÉFÉRENCE OFFICIELLE :{" "}
              <strong className="text-black font-mono font-black">RÉF : {docRef}</strong>
            </div>
            <div className="text-[8px] text-emerald-800 font-bold">orientaafrik.mpginternational.org</div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-white font-mono font-black text-[9px] sm:text-[10px] shadow-sm border border-emerald-600">
              PAGE {pageNum} SUR {totalPages}
            </div>
            <div className="text-[7px] sm:text-[8px] text-slate-500 font-mono mt-0.5">
              {stepSummary || `Document Officiel • Feuille ${pageNum}/${totalPages}`}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white border-2 border-emerald-600 px-2 py-1 rounded-lg shadow-2xs">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code Vérification"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-slate-200 flex items-center justify-center text-[7px] font-mono">
                QR
              </div>
            )}
            <div className="text-left text-[7px] sm:text-[8px] font-mono leading-tight">
              <div className="font-black text-black">RÉF : {docRef}</div>
              <div className="text-emerald-900 font-bold">Vérification</div>
              <div className="text-slate-500">Scan QR Code</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Big Document Title Box for Page 1
  const renderDocumentTitleBox = (formatSubtitle?: string) => (
    <div
      className={`text-center ${densityClasses.sectionMargin} py-1.5 px-3 bg-white border-2 border-emerald-600 rounded-xl shadow-xs`}
    >
      <div className="text-[9px] sm:text-[10px] font-black tracking-widest text-emerald-800 uppercase">
        {candidate.orientationType === "POST_BEPC"
          ? "COMMISSION NATIONALE D'ORIENTATION POST-BEPC & APPRENTISSAGE"
          : "COMMISSION NATIONALE D'ORIENTATION POST-BAC & ENSEIGNEMENT SUPÉRIEUR"}
      </div>
      <h1 className="text-sm sm:text-base font-black font-serif tracking-tight text-slate-950 mt-0.5">
        RAPPORT CERTIFIÉ D'ORIENTATION SCOLAIRE ET PROFESSIONNELLE
      </h1>
      {formatSubtitle && (
        <div className="text-[9px] font-bold text-emerald-900 uppercase tracking-wide">
          {formatSubtitle}
        </div>
      )}
      <div className="text-[10px] sm:text-xs font-mono font-black text-black mt-0.5">
        DOSSIER RÉFÉRENCE : <strong className="text-black font-black font-mono">{docRef}</strong>
      </div>
    </div>
  );

  // Check if a block belongs to this page
  const hasBlock = (blockId: string): boolean => {
    if (blockAssignment && blockAssignment[blockId as keyof BlockPageAssignment] !== undefined) {
      return blockAssignment[blockId as keyof BlockPageAssignment] === pageNum;
    }
    return false;
  };

  // Render specific individual block component with section-level font scale and dynamic sequential point number
  const renderBlockById = (blockId: string) => {
    const customScale = blockFontScales?.[blockId as keyof BlockFontScales];
    const pointNum = dynamicPointNumbers[blockId as ReportBlockId] || 1;
    let content: React.ReactNode = null;

    switch (blockId) {
      case "title_box":
        content = renderDocumentTitleBox();
        break;
      case "civil_identity":
        content = (
          <CivilIdentityBlock
            candidate={candidate}
            docRef={docRef}
            densityClasses={densityClasses}
            fontScale={fontScale}
          />
        );
        break;
      case "demand_synthesis":
        content = (
          <DemandSynthesisBlock
            demandSynthesis={demandSynthesis}
            candidateName={candidateName}
            orientationType={candidate.orientationType}
            densityClasses={densityClasses}
            pointNumber={pointNum}
          />
        );
        break;
      case "academic_analysis":
        content = (
          <AcademicAnalysisBlock
            subjects={academicRecords.subjects}
            globalAverage={academicRecords.globalAverage}
            calculationFormulaExplanation={academicRecords.calculationFormulaExplanation}
            densityClasses={densityClasses}
            pointNumber={pointNum}
            compact={totalPages === 1}
          />
        );
        break;
      case "academic_competencies":
        content = (
          <AcademicCompetenciesBlock
            subjects={academicRecords.subjects}
            densityClasses={densityClasses}
            pointNumber={pointNum}
          />
        );
        break;
      case "psychometrics_riasec":
        content = (
          <PsychometricsBlock
            tests={psychometrics.tests}
            dominantRiasec={psychometrics.dominantRiasec}
            psychologicalSummary={psychometrics.psychologicalSummary}
            densityClasses={densityClasses}
            pointNumber={pointNum}
            compact={totalPages === 1}
          />
        );
        break;
      case "cognitive_mapping":
        content = <CognitiveMappingBlock densityClasses={densityClasses} pointNumber={pointNum} />;
        break;
      case "official_decision":
        content = (
          <OfficialDecisionBlock
            decision={decision}
            candidateName={candidateName}
            orientationType={candidate.orientationType}
            densityClasses={densityClasses}
            pointNumber={pointNum}
            compact={totalPages === 1}
          />
        );
        break;
      case "target_institutions":
        content = <TargetInstitutionsBlock decision={decision} densityClasses={densityClasses} pointNumber={pointNum} />;
        break;
      case "alternative_suggestions":
        content = (
          <AlternativeSuggestionsBlock
            alternativeSuggestions={decision.alternativeSuggestions}
            densityClasses={densityClasses}
            pointNumber={pointNum}
          />
        );
        break;
      case "labor_market":
        content = <LaborMarketObservatoryBlock densityClasses={densityClasses} pointNumber={pointNum} />;
        break;
      case "pedagogical_recommendations":
        content = <PedagogicalRecommendationsBlock densityClasses={densityClasses} pointNumber={pointNum} />;
        break;
      case "action_plan":
        content = <StrategicActionPlanBlock densityClasses={densityClasses} pointNumber={pointNum} />;
        break;
      case "official_seal":
        content = (
          <OfficialSealAndBiometricBlock
            docRef={docRef}
            qrCodeUrl={qrCodeUrl}
            densityClasses={densityClasses}
            pointNumber={pointNum}
          />
        );
        break;
      default:
        return null;
    }

    if (customScale && customScale !== 100) {
      return (
        <div style={{ fontSize: `${customScale}%` }} className="transition-all duration-150">
          {content}
        </div>
      );
    }

    return content;
  };

  // If dynamic block assignment is present, render all blocks assigned to this page in sequential order
  if (blockAssignment) {
    const activeOrder = blockOrder || DEFAULT_BLOCK_ORDER;
    const assignedBlockIds = activeOrder.filter(
      (id) => blockAssignment[id] === pageNum
    );

    return (
      <div className="flex flex-col justify-between h-full min-h-0 flex-1">
        <div className="space-y-2">
          {/* ONLY Page 1 gets the official header */}
          {pageNum === 1 && renderOfficialHeader()}

          {assignedBlockIds.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-xl text-slate-500 text-xs">
              Cette page est actuellement vide. Vous pouvez y déplacer des points depuis le panneau "Organiser les Points".
            </div>
          ) : (
            assignedBlockIds.map((blockId) => (
              <React.Fragment key={blockId}>{renderBlockById(blockId)}</React.Fragment>
            ))
          )}
        </div>

        {renderFooter(`Feuille ${pageNum} sur ${totalPages}`)}
      </div>
    );
  }

  // Fallback direct rendering for default 1-10 pages
  return (
    <div className="flex flex-col justify-between h-full min-h-0 flex-1">
      <div className="space-y-2">
        {pageNum === 1 && renderOfficialHeader()}
        {pageNum === 1 && renderDocumentTitleBox()}
        {pageNum === 1 && (
          <CivilIdentityBlock
            candidate={candidate}
            docRef={docRef}
            densityClasses={densityClasses}
            fontScale={fontScale}
          />
        )}
        {pageNum === 1 && (
          <DemandSynthesisBlock
            demandSynthesis={demandSynthesis}
            candidateName={candidateName}
            orientationType={candidate.orientationType}
            densityClasses={densityClasses}
            pointNumber={1}
          />
        )}
        {pageNum === 2 && (
          <AcademicAnalysisBlock
            subjects={academicRecords.subjects}
            globalAverage={academicRecords.globalAverage}
            calculationFormulaExplanation={academicRecords.calculationFormulaExplanation}
            densityClasses={densityClasses}
            pointNumber={2}
          />
        )}
        {pageNum === 2 && (
          <PsychometricsBlock
            tests={psychometrics.tests}
            dominantRiasec={psychometrics.dominantRiasec}
            psychologicalSummary={psychometrics.psychologicalSummary}
            densityClasses={densityClasses}
            pointNumber={3}
          />
        )}
        {pageNum === totalPages && (
          <OfficialSealAndBiometricBlock
            docRef={docRef}
            qrCodeUrl={qrCodeUrl}
            densityClasses={densityClasses}
            pointNumber={12}
          />
        )}
      </div>
      {renderFooter(`Feuille ${pageNum} sur ${totalPages}`)}
    </div>
  );
};

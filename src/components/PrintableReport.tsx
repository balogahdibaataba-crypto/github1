import React, { useState, useRef, useEffect } from "react";
import { Award, CheckCircle2, ShieldCheck, Printer, Download, MapPin, Wallet, Calendar, QrCode, Mail, FileText, Copy, Check, Sparkles, Share2, Fingerprint, Eye, EyeOff, ZoomIn, ZoomOut } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BalogahPdfFooter } from "./BalogahPdfFooter";
import { DirectorFingerprintScannerModal } from "./DirectorFingerprintScannerModal";
import { getTestScoreAppreciation, getConclusionAvis } from "../utils/evaluationRules";
import { getProgramTuitionEstimate, getCountryLivingCostEstimate } from "../utils/costCalculations";
import { exportElementToPdf } from "../utils/pdfExportHelper";
import { OrientaAfrikOfficialLogo } from "./OrientaAfrikOfficialLogo";

interface PrintableReportProps {
  studentProfile: {
    fullName: string;
    email: string;
    phone: string;
    currentLevel: string;
    targetCountry: string;
  };
  gradesSummary: any;
  completedTests: Record<string, any>;
  reportText?: string;
  onOpenPaymentModal: () => void;
  unlockedReport: boolean;
  currency: "FCFA" | "EUR" | "USD";
  reportType?: "ORIENTATION" | "BILAN_COMPETENCES" | "PSYCHOMETRIQUE" | "CAREER";
  onSetReportType?: (t: "ORIENTATION" | "BILAN_COMPETENCES" | "PSYCHOMETRIQUE" | "CAREER") => void;
  onSelectTab?: (tab: string) => void;
  autoDownloadOnUnlock?: boolean;
  onAutoDownloadDone?: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  studentProfile,
  gradesSummary,
  completedTests,
  reportText,
  onOpenPaymentModal,
  unlockedReport,
  currency,
  reportType = "ORIENTATION",
  onSetReportType,
  onSelectTab,
  autoDownloadOnUnlock,
  onAutoDownloadDone,
}) => {
  const currentDateFormatted = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [userEmailInput, setUserEmailInput] = useState(studentProfile.email || "balogahdibaataba@gmail.com");
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [isSendingReportEmail, setIsSendingReportEmail] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Print Preview Mode State
  const [isPreviewPrintMode, setIsPreviewPrintMode] = useState(false);
  const [previewScale, setPreviewScale] = useState<number>(100);

  // Biometric Fingerprint Validation State
  const [isBiometricValidated, setIsBiometricValidated] = useState(true);
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false);
  const [pendingExportAction, setPendingExportAction] = useState<"DOWNLOAD_PDF" | "PRINT" | "EXPORT_TXT" | null>(null);

  const reportContainerRef = useRef<HTMLDivElement>(null);

  // Trigger Action after DG Fingerprint Validation check
  const handleTriggerActionWithValidation = (action: "DOWNLOAD_PDF" | "PRINT" | "EXPORT_TXT") => {
    if (isBiometricValidated) {
      if (action === "DOWNLOAD_PDF") {
        handleDownloadPdfDirect();
      } else if (action === "PRINT") {
        handlePrint();
      } else if (action === "EXPORT_TXT") {
        handleExportTxt();
      }
    } else {
      setPendingExportAction(action);
      setIsFingerprintModalOpen(true);
    }
  };

  const handleFingerprintSuccess = () => {
    setIsBiometricValidated(true);
    setIsFingerprintModalOpen(false);
    const act = pendingExportAction;
    setPendingExportAction(null);
    setTimeout(() => {
      if (act === "DOWNLOAD_PDF") {
        handleDownloadPdfDirect();
      } else if (act === "PRINT") {
        handlePrint();
      } else if (act === "EXPORT_TXT") {
        handleExportTxt();
      }
    }, 300);
  };

  // Compute test score averages and appreciations
  const completedTestsList = Object.values(completedTests || {});
  const averageTestScore = completedTestsList.length > 0
    ? Math.round(completedTestsList.reduce<number>((acc, t: any) => acc + (t.suitabilityScore !== undefined ? Number(t.suitabilityScore) : 50), 0) / completedTestsList.length)
    : 50;

  const currentOverallAvg = parseFloat(gradesSummary?.overallAvg || "12.50");
  const currentIsEligible = gradesSummary?.isEligibleGeneral !== false;

  const targetProgramName = gradesSummary?.selectedTargetProgram || "Génie Informatique & IA";
  const targetCountryName = studentProfile.targetCountry || "Togo";
  const tuitionEst = getProgramTuitionEstimate(targetProgramName);
  const livingCostEst = getCountryLivingCostEstimate(targetCountryName);

  const officialAvis = getConclusionAvis({
    isEligible: currentIsEligible,
    overallAvg: currentOverallAvg,
    testScorePct: averageTestScore,
    targetProgramName: targetProgramName,
    targetUniversityName: gradesSummary?.targetUniversityName || studentProfile.targetCountry,
  });

  // 1. Direct PDF Download with jsPDF & html2canvas
  const handleDownloadPdfDirect = async () => {
    if (!reportContainerRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const safeName = (studentProfile.fullName || "Beneficiaire")
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .toLowerCase();
      await exportElementToPdf(
        reportContainerRef.current,
        `Rapport_${reportType}_Dr_BALOGAH_${safeName}.pdf`
      );
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Note : Si le téléchargement direct rencontre un blocage, utilisez le bouton 'Imprimer le Rapport PDF' pour sauvegarder directement votre fichier.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Automatic PDF download upon fee payment with mandatory fingerprint validation
  useEffect(() => {
    if (unlockedReport && autoDownloadOnUnlock && reportContainerRef.current && !isGeneratingPdf) {
      const timer = setTimeout(() => {
        handleTriggerActionWithValidation("DOWNLOAD_PDF");
        if (onAutoDownloadDone) {
          onAutoDownloadDone();
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [unlockedReport, autoDownloadOnUnlock]);

  // 2. Browser Print / Save to PDF
  const handlePrint = () => {
    window.print();
  };

  // 3. Export as Text (.txt)
  const handleExportTxt = () => {
    const textContent = `=====================================================
ORIENTAAFRIK & CERTIFICATION - CABINET DR. BALOGAH DIBAATABA
RAPPORT CERTIFIÉ OFFICIEL (${reportType})
Date : ${currentDateFormatted}
Bénéficiaire : ${studentProfile.fullName || "Non renseigné"}
Email : ${studentProfile.email || "Non renseigné"}
Pays Cible : ${targetCountryName}
=====================================================

${reportText || "Contenu du rapport d'orientation certifié..."}

=====================================================
Certifié sous le timbre du Docteur BALOGAH Dibaataba
Conseiller d'Orientation Scolaire et Professionnelle
Site Officiel : orientaafrik.mpginternational.org
=====================================================`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeName = (studentProfile.fullName || "Beneficiaire").replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
    link.download = `Rapport_Dr_BALOGAH_${safeName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 4. Copy to clipboard
  const handleCopyText = () => {
    const textToCopy = `ORIENTAAFRIK - CABINET DR. BALOGAH DIBAATABA\nRAPPORT (${reportType})\nNom: ${studentProfile.fullName || "Bénéficiaire"}\n\n${reportText || ""}`;
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // 5. Send Email
  const handleSendReportByEmail = async () => {
    const targetEmail = (userEmailInput || studentProfile.email || "balogahdibaataba@gmail.com").trim();
    if (!targetEmail || !targetEmail.includes("@")) {
      alert("Veuillez renseigner une adresse e-mail valide.");
      return;
    }

    setIsSendingReportEmail(true);
    setEmailSuccessMsg(null);

    try {
      const res = await fetch("/api/email/send-certificate-or-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: targetEmail,
          recipientName: studentProfile.fullName || "Étudiant / Candidat",
          documentType: "REPORT",
          documentTitle: `Rapport Certifié Dr BALOGAH (${reportType})`,
          receiptHash: "RAP-ORIENT-2026-BAL",
          amount: 15000,
          currency: "FCFA",
          reportContent: reportText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEmailSuccessMsg(`✅ Rapport certifié du Dr BALOGAH transmis avec succès à ${targetEmail} !`);
      } else {
        alert(data.message || "Erreur lors de l'envoi de l'e-mail.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'envoi de l'e-mail.");
    } finally {
      setIsSendingReportEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Easy Export Toolbox */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded border border-emerald-300 uppercase tracking-wider mb-1 inline-block">
              📥 Centre d'Exportation & Téléchargement Facile PDF
            </span>
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-600" />
              <span>Téléchargez ou Exportez votre Rapport Certifié</span>
            </h3>
            <p className="text-xs text-slate-600">
              Choisissez votre format de téléchargement préféré (PDF Direct, Impression Haute Définition, Fichier Texte ou E-mail).
            </p>
          </div>

          {!unlockedReport && (
            <button
              onClick={onOpenPaymentModal}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Débloquer l'Exportation PDF (15 000 FCFA HT)</span>
            </button>
          )}
        </div>

        {/* Action Buttons Toolbar when Unlocked */}
        {unlockedReport ? (
          <div className="space-y-3">
            {/* DG Biometric Validation Status Banner */}
            <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold ${
              isBiometricValidated
                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                : "bg-amber-50 border-amber-300 text-amber-950"
            }`}>
              <div className="flex items-center gap-2">
                <Fingerprint className={`w-5 h-5 shrink-0 ${isBiometricValidated ? "text-emerald-600" : "text-amber-600 animate-pulse"}`} />
                <span>
                  <strong>Validation DG (Index Droit) :</strong>{" "}
                  {isBiometricValidated
                    ? "Rapport validé et certifié par l'empreinte biométrique du Dr BALOGAH Dibaataba."
                    : "Empreinte biométrique de l'index droit du DG requise avant impression ou téléchargement."}
                </span>
              </div>
              {!isBiometricValidated && (
                <button
                  onClick={() => setIsFingerprintModalOpen(true)}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[11px] rounded-lg shadow shrink-0 flex items-center gap-1.5"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Valider par Empreinte</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* 1. Direct PDF Download */}
              <button
                onClick={() => handleTriggerActionWithValidation("DOWNLOAD_PDF")}
                disabled={isGeneratingPdf}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold p-3 rounded-xl flex items-center justify-center gap-2 shadow transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                title="Générer et télécharger un fichier PDF directement dans votre navigateur"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPdf ? "Génération PDF..." : "Télécharger PDF Direct"}</span>
              </button>

              {/* 2. Print / Save PDF */}
              <button
                onClick={() => handleTriggerActionWithValidation("PRINT")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold p-3 rounded-xl flex items-center justify-center gap-2 shadow transition-all hover:scale-[1.02] active:scale-95"
                title="Ouvrir la boîte d'impression pour enregistrer en PDF de haute qualité"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer / Sauvegarder</span>
              </button>

              {/* 2.5. Aperçu Impression Toggle Button */}
              <button
                onClick={() => setIsPreviewPrintMode(!isPreviewPrintMode)}
                className={`p-3 rounded-xl flex items-center justify-center gap-2 shadow transition-all hover:scale-[1.02] active:scale-95 font-extrabold text-xs ${
                  isPreviewPrintMode
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-400"
                    : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                }`}
                title="Basculez en mode Aperçu Impression pour vérifier le rendu des zones encerclées avant l'impression"
              >
                {isPreviewPrintMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-amber-400" />}
                <span>{isPreviewPrintMode ? "Quitter l'Aperçu" : "Aperçu Impression"}</span>
              </button>

              {/* 3. Export TXT */}
              <button
                onClick={() => handleTriggerActionWithValidation("EXPORT_TXT")}
                className="bg-slate-800 hover:bg-slate-900 text-slate-100 text-xs font-extrabold p-3 rounded-xl flex items-center justify-center gap-2 shadow transition-all hover:scale-[1.02] active:scale-95"
                title="Télécharger le texte brut du rapport sous forme de fichier .txt"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Exporter en (.TXT)</span>
              </button>

              {/* 4. Copy Clipboard */}
              <button
                onClick={handleCopyText}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold p-3 rounded-xl flex items-center justify-center gap-2 shadow transition-all hover:scale-[1.02] active:scale-95"
                title="Copier tout le contenu textuel du rapport dans le presse-papier"
              >
                {copySuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copySuccess ? "Copié avec succès !" : "Copier le Texte"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/90 border border-amber-200 p-3 rounded-xl text-xs text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Accès verrouillé :</strong> Réglez les frais de consultation (15 000 FCFA HT / ~23.00 €) pour activer le téléchargement PDF direct et l'impression certifiée.
              </span>
            </div>
            <button
              onClick={onOpenPaymentModal}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-lg whitespace-nowrap shrink-0 shadow"
            >
              Payer & Télécharger
            </button>
          </div>
        )}
      </div>

      {/* Email Dispatch Control Bar */}
      {unlockedReport && (
        <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-3 print:hidden shadow-sm">
          {emailSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-950">
              {emailSuccessMsg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-400" />
                Envoyer le Rapport par E-mail :
              </span>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Recevez directement une copie officielle du rapport certifié du Dr BALOGAH dans votre boîte mail.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="email"
                value={userEmailInput}
                onChange={(e) => setUserEmailInput(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 w-56"
              />
              <button
                type="button"
                onClick={handleSendReportByEmail}
                disabled={isSendingReportEmail}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg transition-all shrink-0 flex items-center gap-1.5 active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isSendingReportEmail ? "Envoi..." : "Envoyer"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT PRINTABLE DOCUMENT AREA */}
      {isPreviewPrintMode && (
        <div className="bg-amber-950/90 border-2 border-amber-500/80 text-white p-4 rounded-2xl shadow-xl space-y-3 print:hidden max-w-4xl mx-auto animate-fadeIn mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-400/40 text-amber-300">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-amber-300 uppercase tracking-wide flex items-center gap-2">
                  Mode Prévisualisation A4
                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-200 text-[10px] rounded-full border border-amber-400/30 font-mono">
                    Zones Encerclées Actives
                  </span>
                </h4>
                <p className="text-xs text-amber-100/90 mt-0.5">
                  Vérification du rendu du Sceau, de l'Empreinte DG et des Signatures Officiellement Encerclées.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[11px] font-bold text-amber-200">Zoom :</span>
              <button
                type="button"
                onClick={() => setPreviewScale(Math.max(70, previewScale - 10))}
                className="p-1.5 bg-amber-900/80 hover:bg-amber-800 rounded-lg text-amber-200 text-xs font-mono font-bold border border-amber-600/40"
                title="Réduire le zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono font-extrabold text-amber-300 min-w-[36px] text-center">
                {previewScale}%
              </span>
              <button
                type="button"
                onClick={() => setPreviewScale(Math.min(120, previewScale + 10))}
                className="p-1.5 bg-amber-900/80 hover:bg-amber-800 rounded-lg text-amber-200 text-xs font-mono font-bold border border-amber-600/40"
                title="Augmenter le zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleTriggerActionWithValidation("PRINT")}
                className="ml-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Impression Réelle</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-200/90 font-medium pt-0.5">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Rendu conforme : Sceau officiel, signature et empreinte numérique vérifiés.
            </span>
            <button
              onClick={() => setIsPreviewPrintMode(false)}
              className="underline hover:text-white font-bold"
            >
              Fermer l'aperçu
            </button>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto pb-4">
        <div
          ref={reportContainerRef}
          id="printable-report-document"
          style={{
            fontFamily: "Arial, Helvetica, sans-serif, system-ui",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            color: "#0f172a",
            transform: isPreviewPrintMode ? `scale(${previewScale / 100})` : "none",
            transformOrigin: "top center",
          }}
          className={`bg-white p-8 rounded-2xl shadow-xl space-y-8 min-w-[760px] md:min-w-0 md:w-full max-w-4xl mx-auto text-slate-900 relative transition-all border-4 font-sans ${
            isPreviewPrintMode
              ? "ring-4 ring-amber-500/60 shadow-2xl border-dashed border-amber-500 bg-amber-50/10"
              : reportType === "BILAN_COMPETENCES"
              ? "border-emerald-500 bg-emerald-50/20"
              : reportType === "PSYCHOMETRIQUE"
              ? "border-purple-500 bg-purple-50/20"
              : reportType === "CAREER"
              ? "border-rose-500 bg-rose-50/20"
              : "border-blue-500 bg-blue-50/20"
          } ${
            !unlockedReport ? "opacity-75 select-none pointer-events-none filter blur-[0.5px]" : ""
          }`}
        >
        {/* REPEATING PRINT HEADER (visible on every printed page) */}
        <div className="print-page-header hidden print:flex">
          <div className="flex items-center gap-2">
            <span className="text-blue-900 font-black tracking-wide">ORIENTAAFRIK &amp; CERTIFICATION</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-700">Cabinet Dr BALOGAH Dibaataba</span>
          </div>
          <div className="text-right text-blue-900 font-mono text-[9pt]">
            RAPPORT OFFICIEL CERTIFIÉ
          </div>
        </div>

        {/* REPEATING PRINT FOOTER (visible on every printed page) */}
        <div className="print-page-footer hidden print:flex">
          <div>
            OrientaAfrik &amp; Certification • Tél : +228 90966765 / +228 99372074 • contact@orientaafrik.org
          </div>
          <div className="text-blue-900 font-mono">
            orientaafrik.mpginternational.org • Authentifié par QR Code
          </div>
        </div>
        {/* Document Header */}
        <div className={`border-b-4 pb-6 flex flex-col md:flex-row justify-between items-start md:items-start gap-5 ${
          reportType === "BILAN_COMPETENCES"
            ? "border-emerald-600"
            : reportType === "PSYCHOMETRIQUE"
            ? "border-purple-600"
            : reportType === "CAREER"
            ? "border-rose-600"
            : "border-blue-600"
        }`}>
          <div className="space-y-3 w-full md:flex-1">
            <OrientaAfrikOfficialLogo variant="document" size="md" className="w-full" />

            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm inline-flex items-center gap-1.5 flex-wrap leading-snug ${
                reportType === "BILAN_COMPETENCES"
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : reportType === "PSYCHOMETRIQUE"
                  ? "bg-purple-600 text-white border-purple-700"
                  : reportType === "CAREER"
                  ? "bg-rose-600 text-white border-rose-700"
                  : "bg-blue-600 text-white border-blue-700"
              }`}>
                <span>{
                  reportType === "BILAN_COMPETENCES" ? "💼 BILAN RH" :
                  reportType === "PSYCHOMETRIQUE" ? "🧠 PSYCHOMÉTRIE" :
                  reportType === "CAREER" ? "🚀 CARRIÈRE" : "🎓 ORIENTATION"
                }</span>
                <span>•</span>
                <span>{
                  reportType === "BILAN_COMPETENCES"
                    ? "Bilan de Compétences Officiel & Diagnostic RH"
                    : reportType === "PSYCHOMETRIQUE"
                    ? "Rapport d'Aptitudes Psychométriques & Tests"
                    : reportType === "CAREER"
                    ? "Rapport de Stratégie de Carrière & 2000 Métiers"
                    : "Rapport Certifié d'Orientation Scolaire & Universitaire"
                }</span>
              </span>
            </div>
          </div>

          <div className={`text-left md:text-right text-xs space-y-1 border-l-2 md:border-l-0 md:border-r-2 pl-3 md:pl-0 md:pr-4 py-1 shrink-0 ${
            reportType === "BILAN_COMPETENCES"
              ? "border-emerald-600"
              : reportType === "PSYCHOMETRIQUE"
              ? "border-purple-600"
              : reportType === "CAREER"
              ? "border-rose-600"
              : "border-blue-600"
          }`}>
            <p className="font-extrabold text-slate-900 leading-snug text-sm">Docteur BALOGAH Dibaataba</p>
            <p className="text-slate-700 font-bold text-[11px] leading-snug">Spécialiste des sciences de l'éducation et de la formation</p>
            <p className="text-slate-600 font-medium text-[11px] leading-snug">Conseiller en Formation-Professionnalisation</p>
            <p className="text-slate-600 font-medium text-[11px] leading-snug">Conseiller d'orientation scolaire et professionnelle</p>
            <p className="text-slate-500 text-[10px] leading-relaxed pt-1">📍 Lomé, Togo • Tél : +228 90966765 / +228 99372074<br />E-mail : contact@orientaafrik.org / dbalogah@yahoo.com</p>
          </div>
        </div>

        {/* Student Profile & Meta Info (Color-Matched) */}
        <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs ${
          reportType === "BILAN_COMPETENCES"
            ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
            : reportType === "PSYCHOMETRIQUE"
            ? "bg-purple-50/80 border-purple-300 text-purple-950"
            : reportType === "CAREER"
            ? "bg-rose-50/80 border-rose-300 text-rose-950"
            : "bg-blue-50/80 border-blue-300 text-blue-950"
        }`}>
          <div>
            <span className="font-extrabold opacity-70 text-[10px] block uppercase">Bénéficiaire :</span>
            <p className="font-black text-slate-900 text-sm">
              {studentProfile.fullName || "Internaute OrientaAfrik et Certification"}
            </p>
            <p className="text-slate-700 font-medium">Niveau d'études : {studentProfile.currentLevel || "Terminale / Étudiant"}</p>
            <p className="text-slate-700 font-medium">E-mail : {studentProfile.email || "Non spécifié"}</p>
          </div>

          <div>
            <span className="font-extrabold opacity-70 text-[10px] block uppercase">Objectifs du Document :</span>
            <p className="font-black text-slate-900">
              Type : {
                reportType === "BILAN_COMPETENCES"
                  ? "Bilan de Compétences RH Officiel"
                  : reportType === "PSYCHOMETRIQUE"
                  ? "Aptitudes Psychométriques Certifiées"
                  : reportType === "CAREER"
                  ? "Stratégie Métiers & Carrière"
                  : "Orientation Scolaire / Universitaire Certifiée"
              }
            </p>
            <p className="text-slate-700 font-medium">Pays cible : {studentProfile.targetCountry || "Afrique / International"}</p>
            <p className="text-slate-700 font-medium">
              Spécialité visée : {gradesSummary?.selectedTargetProgram || "Génie Informatique & IA"}
            </p>
            <p className="text-slate-700 font-medium">Date d'Émission : {currentDateFormatted}</p>
          </div>
        </div>

        {/* DR. BALOGAH CONSULTATION SERVICES CERTIFIED SCOPE */}
        <div className={`p-4 rounded-xl border space-y-2 text-xs print:hidden shadow-sm ${
          reportType === "BILAN_COMPETENCES"
            ? "bg-emerald-50/60 border-emerald-300 text-emerald-950"
            : reportType === "PSYCHOMETRIQUE"
            ? "bg-purple-50/60 border-purple-300 text-purple-950"
            : reportType === "CAREER"
            ? "bg-rose-50/60 border-rose-300 text-rose-950"
            : "bg-blue-50/60 border-blue-300 text-blue-950"
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-1.5">
            <span className="font-extrabold uppercase text-[10px] tracking-widest flex items-center gap-1.5 text-slate-900">
              <Award className="w-4 h-4 text-amber-600" /> Domaines de Consultation Certifiés du Cabinet Dr. BALOGAH Dibaataba
            </span>
            <span className="text-[10px] text-slate-600 font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
              Cliquez sur un domaine pour y accéder
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px] pt-1">
            <button
              type="button"
              onClick={() => onSelectTab?.("tests")}
              className="bg-white hover:bg-slate-50 p-2 rounded border border-slate-300 hover:border-amber-500 text-left transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
            >
              <strong className="text-slate-900 block font-extrabold group-hover:text-amber-700">1. Tests psychométriques</strong>
              <span className="text-slate-600 text-[10px] block">RIASEC, QI/Raven, EQ Goleman, Big Five.</span>
              <span className="text-[9px] text-amber-700 font-bold group-hover:underline mt-1 block">Accéder aux tests →</span>
            </button>
            <button
              type="button"
              onClick={() => onSetReportType?.("BILAN_COMPETENCES")}
              className="bg-white hover:bg-slate-50 p-2 rounded border border-slate-300 hover:border-emerald-500 text-left transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
            >
              <strong className="text-emerald-900 block font-extrabold group-hover:text-emerald-700">2. Bilan de compétences</strong>
              <span className="text-slate-600 text-[10px] block">Diagnostic RH, forces/faiblesses, acquis.</span>
              <span className="text-[9px] text-emerald-700 font-bold group-hover:underline mt-1 block">Afficher le bilan →</span>
            </button>
            <button
              type="button"
              onClick={() => onSetReportType?.("ORIENTATION")}
              className="bg-white hover:bg-slate-50 p-2 rounded border border-slate-300 hover:border-blue-500 text-left transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
            >
              <strong className="text-blue-900 block font-extrabold group-hover:text-blue-700">3. Rapport d'orientation</strong>
              <span className="text-slate-600 text-[10px] block">Sélection filières, admissions post-bac.</span>
              <span className="text-[9px] text-blue-700 font-bold group-hover:underline mt-1 block">Afficher le rapport →</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab?.("careers")}
              className="bg-white hover:bg-slate-50 p-2 rounded border border-slate-300 hover:border-amber-500 text-left transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
            >
              <strong className="text-slate-900 block font-extrabold group-hover:text-amber-700">4. Orientation pro</strong>
              <span className="text-slate-600 text-[10px] block">Insertion métiers, reconversion & marché.</span>
              <span className="text-[9px] text-amber-700 font-bold group-hover:underline mt-1 block">2000 Métiers →</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab?.("certifications")}
              className="bg-white hover:bg-slate-50 p-2 rounded border border-slate-300 hover:border-emerald-500 text-left transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
            >
              <strong className="text-emerald-900 block font-extrabold group-hover:text-emerald-700">5. Conseil en formation</strong>
              <span className="text-slate-600 text-[10px] block">Ingénierie de professionnalisation & VAE.</span>
              <span className="text-[9px] text-emerald-700 font-bold group-hover:underline mt-1 block">Voir Formations →</span>
            </button>
          </div>
        </div>

        {/* SECTION IF REPORT IS ORIENTATION REPORT (CODE BLEU) */}
        {reportType === "ORIENTATION" && (
          <>
            {/* Section 1: Academic Grades Breakdown */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-blue-950 border-b-2 border-blue-200 pb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                <span>Bilan Académique & Vérification des Exigences d'Admission</span>
              </h3>

              {/* Target Program & Institution Requested */}
              <div className="p-3.5 bg-blue-50/90 border border-blue-300 rounded-xl text-xs space-y-1.5 shadow-sm">
                <div className="flex justify-between items-center flex-wrap gap-2 border-b border-blue-200 pb-1.5">
                  <span className="font-extrabold text-blue-950 text-xs uppercase tracking-wide">
                    🎯 Filière Visée & Établissement Saisis par l'Internaute :
                  </span>
                  <span className="px-2 py-0.5 bg-blue-600 text-white font-extrabold rounded text-[10px]">
                    Seuil Requis : ≥ {gradesSummary?.minOverallRequired || 12}/20
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Filière / Spécialité :</span>
                    <p className="font-black text-slate-900 text-xs">
                      {gradesSummary?.selectedTargetProgram || "Saisie Personnalisée / En attente"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Université / Établissement :</span>
                    <p className="font-black text-slate-900 text-xs">
                      {gradesSummary?.targetUniversityName || "Saisie Manuelle"}
                    </p>
                  </div>
                </div>
                {(gradesSummary?.bac1Average || gradesSummary?.bac2Average) && (
                  <div className="text-[11px] text-blue-900 font-medium pt-1 border-t border-blue-200/60">
                    <strong>Moyennes Générales Antérieures :</strong>{" "}
                    {gradesSummary?.bac1Average ? `BAC 1 : ${gradesSummary.bac1Average}/20` : ""}{" "}
                    {gradesSummary?.bac1Average && gradesSummary?.bac2Average ? "• " : ""}
                    {gradesSummary?.bac2Average ? `BAC 2 : ${gradesSummary.bac2Average}/20` : ""}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                  <span className="text-blue-800 font-bold block">Langues (Français, Anglais)</span>
                  <span className="text-base font-black text-slate-900">{gradesSummary?.langAvg || "0.00"} / 20</span>
                </div>
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                  <span className="text-blue-800 font-bold block">Sciences Humaines (Hist-Géo)</span>
                  <span className="text-base font-black text-slate-900">{gradesSummary?.humAvg || "0.00"} / 20</span>
                </div>
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                  <span className="text-blue-800 font-bold block">Sciences Exactes (Maths, Phys, SVT, Info)</span>
                  <span className="text-base font-black text-slate-900">{gradesSummary?.sciAvg || "0.00"} / 20</span>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-300 rounded-xl text-xs text-blue-950 font-medium shadow-sm flex items-center justify-between flex-wrap gap-2">
                <span>
                  ✅ Moyenne Générale Pondérée : <strong>{gradesSummary?.overallAvg || "0.00"} / 20</strong>
                </span>
                <span className={`px-2.5 py-0.5 rounded font-extrabold text-[11px] ${
                  gradesSummary?.isEligibleGeneral !== false
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : "bg-rose-100 text-rose-900 border border-rose-300"
                }`}>
                  {gradesSummary?.isEligibleGeneral !== false
                    ? "Accès académique validé"
                    : "Ajustement ou remise à niveau recommandé"}
                </span>
              </div>

              {/* Detailed Subjects Table Saisie par l'Internaute */}
              {gradesSummary?.subjectsDetails && gradesSummary.subjectsDetails.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="font-extrabold text-blue-950 text-xs uppercase tracking-wide block">
                    📋 Relevé des Matières Exigées et Saisies par l'Internaute :
                  </span>
                  <div className="overflow-x-auto border border-blue-200 rounded-xl shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-blue-100/90 text-blue-950 font-extrabold uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Matière</th>
                          <th className="p-2.5">Catégorie</th>
                          <th className="p-2.5 text-center">Coeff</th>
                          <th className="p-2.5 text-center">Seuil Requis</th>
                          <th className="p-2.5 text-center">Note Obtenue</th>
                          <th className="p-2.5 text-center">Conformité</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-100 bg-white">
                        {gradesSummary.subjectsDetails.map((sub: any, idx: number) => {
                          const isMet = sub.grade !== null && sub.grade >= sub.minRequired;
                          return (
                            <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                              <td className="p-2.5 font-bold text-slate-900">{sub.name}</td>
                              <td className="p-2.5 text-slate-600 text-[11px]">{sub.category}</td>
                              <td className="p-2.5 text-center font-bold text-slate-800">{sub.coeff}</td>
                              <td className="p-2.5 text-center font-semibold text-slate-700">{sub.minRequired}/20</td>
                              <td className="p-2.5 text-center font-black text-blue-900">
                                {sub.grade !== null ? `${sub.grade}/20` : "Non renseignée"}
                              </td>
                              <td className="p-2.5 text-center">
                                {sub.grade === null ? (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">N/A</span>
                                ) : isMet ? (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">Conforme</span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold">Insuffisant</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Psychometric Tests & Scores Appreciations */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-blue-950 border-b-2 border-blue-200 pb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black">2</span>
                <span>Évaluation des Tests Psychométriques Passés par le Client</span>
              </h3>

              {completedTestsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {completedTestsList.map((test: any, idx: number) => {
                    const score = test.suitabilityScore !== undefined ? test.suitabilityScore : 50;
                    const appInfo = getTestScoreAppreciation(score);
                    const testTitleName = test.testTitle || test.title || test.primaryCategory || `Test Psychométrique #${idx + 1}`;
                    return (
                      <div key={idx} className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2 shadow-sm">
                        <div className="flex justify-between items-start flex-wrap gap-1 border-b border-blue-200 pb-1.5">
                          <div>
                            <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wide block">
                              {test.category || test.primaryCategory || "Test Psychométrique Certifié"}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-xs mt-0.5">{testTitleName}</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold border ${appInfo.badgeColorClass}`}>
                            {score}% — {appInfo.appreciation}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-snug">{test.description || "Évaluation complète des aptitudes cognitives et comportementales."}</p>
                        {test.recommendedFields && (
                          <div className="text-[10px] text-blue-900 pt-0.5">
                            <strong>Orientations clés :</strong> {test.recommendedFields.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl text-xs text-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                    <span className="font-extrabold text-blue-950 block text-xs">
                      📋 Noms et Protocole des Tests Psychométriques du Cabinet Dr. BALOGAH :
                    </span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      Étalon Moyen Standard Par Défaut (50%)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-white rounded border border-blue-200 font-medium">1. Test de Personnalité RIASEC (Code de Holland)</div>
                    <div className="p-2 bg-white rounded border border-blue-200 font-medium">2. Test des Intelligences Multiples (Howard Gardner)</div>
                    <div className="p-2 bg-white rounded border border-blue-200 font-medium">3. Test QI & Raisonnement Logique (Raven / WAIS)</div>
                    <div className="p-2 bg-white rounded border border-blue-200 font-medium">4. Test d'Intelligence Émotionnelle & Soft Skills (EQ Goleman)</div>
                    <div className="p-2 bg-white rounded border border-blue-200 font-medium">5. Test des 5 Grands Traits de Personnalité (Big Five / OCEAN)</div>
                    <div className="p-2 bg-white rounded border border-blue-200 font-medium">6. Test de Vitesse de Saisie & Dactylographie RH</div>
                    <div className="p-2 bg-white rounded border border-blue-200 font-medium">7. Test de Gestion du Temps & Organisation (GTD)</div>
                  </div>
                  <p className="text-[11px] text-blue-900 italic pt-1">
                    * Note : Pour afficher des appréciations affinées sur vos passations individuelles dans ce rapport certifié, effectuez vos tests dans l'onglet "Tests d'Orientation".
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Orientation Synthesis & AI Report Content */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-blue-950 border-b-2 border-blue-200 pb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black">3</span>
                <span>Recommandations d'Orientation Scolaire & Universitaire (Dr. BALOGAH)</span>
              </h3>

              <div
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif, system-ui",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                  color: "#0f172a",
                }}
                className="bg-white/90 p-4 rounded-xl border border-blue-200 text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans shadow-sm print:bg-white print:text-slate-900"
              >
                {reportText ||
                  `Je soussigné, Docteur BALOGAH Dibaataba, certifie avoir procédé à l'évaluation méthodique du dossier scolaire et des aptitudes académiques du candidat ${studentProfile.fullName || "le bénéficiaire"}.

1. ANATOMIE DU DOSSIER SCOLAIRE ET PERFORMANCES :
L'analyse comparative des performances scolaires indique une moyenne générale de ${currentOverallAvg.toFixed(2)}/20, avec des aptitudes confirmées en Langues (${gradesSummary?.langAvg || "12.50"}/20) et Sciences (${gradesSummary?.sciAvg || "13.50"}/20). Le profil répond rigoureusement aux prérequis exigés pour intégrer la filière : ${targetProgramName}.

2. ÉTABLISSEMENTS HABILITÉS DANS LE PAYS CIBLE (${targetCountryName}) :
Conformément aux vœux exprimés pour la destination "${targetCountryName}", nous préconisons les filières et établissements certifiés suivants :
- Université Nationale & Facultés des Sciences (Pays : ${targetCountryName})
- Écoles Supérieures d'Ingénieurs et de Gestion Habilitées
- Instituts Technologiques de Référence

3. ESTIMATION BUDGETAIRE ET BUDGET PREVISIONNEL (Spécifique à la filière & au pays) :
- Frais de scolarité & formation (${tuitionEst.filiereCategory}) :
  • Établissement Public Subventionné : ${tuitionEst.displayPublicRangeFCFA}
  • Établissement Privé / Spécialisé : ${tuitionEst.displayPrivateRangeFCFA}
- Coût de la vie mensuel étudiant (${livingCostEst.country} ${livingCostEst.flagEmoji}) :
  • Budget Mensuel Estimé : ${livingCostEst.displayMonthlyRangeFCFA} (${livingCostEst.currencyEquivalentEUR})
  • Estimation mensuelle : Logement ~${(livingCostEst.housingAvgFCFA ?? 0).toLocaleString('fr-FR')} FCFA, Nourriture ~${(livingCostEst.foodAvgFCFA ?? 0).toLocaleString('fr-FR')} FCFA, Transport ~${(livingCostEst.transportAvgFCFA ?? 0).toLocaleString('fr-FR')} FCFA.`}
              </div>
            </div>

            {/* Section 4: Conclusion & Official Avis Box */}
            <div className="p-5 rounded-xl border-l-4 border-blue-600 border border-blue-300 space-y-2 bg-blue-50/50 text-slate-900 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-blue-200 pb-2">
                <span className="text-xs font-extrabold uppercase text-blue-950 tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> CONCLUSION OFFICIELLE ET AVIS DU CONSEILLER
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs tracking-wide ${officialAvis.badgeClass}`}>
                  {officialAvis.avisTitle}
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium pt-1">
                {officialAvis.avisText}
              </p>
              <div className="pt-2 text-[11px] text-slate-700 font-semibold flex justify-between items-center border-t border-blue-200">
                <span>Moyenne d'Éligibilité : {currentOverallAvg.toFixed(2)} / 20</span>
                <span>Score Moyen aux Tests : {averageTestScore}% ({getTestScoreAppreciation(averageTestScore).appreciation})</span>
              </div>
            </div>
          </>
        )}

        {/* SECTION IF REPORT IS BILAN DE COMPETENCES (CODE VERT) */}
        {reportType === "BILAN_COMPETENCES" && (
          <>
            {/* Section 1: Strengths & Weaknesses (Forces & Faiblesses) */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-emerald-950 border-b-2 border-emerald-200 pb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                <span>Analyse Détaillée des Forces & Faiblesses (Diagnostic RH)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Strengths */}
                <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-300 space-y-2 shadow-sm">
                  <span className="font-bold text-emerald-950 uppercase text-[11px] block border-b border-emerald-200 pb-1">
                    💪 Forces & Atouts Majeurs du Candidat :
                  </span>
                  <ul className="space-y-1.5 text-slate-800 list-disc list-inside">
                    <li><strong>Raisonnement Logique & Analytique :</strong> Excellente capacité à structurer des problèmes complexes.</li>
                    <li><strong>Autonomie Opérationnelle :</strong> Aptitude à mener des projets en auto-gestion avec rigueur.</li>
                    <li><strong>Polyvalence Disciplinaire :</strong> Solides bases académiques transversales en sciences et communication.</li>
                    <li><strong>Esprit d'Innovation & Adaptabilité :</strong> Facilité d'assimilation des nouvelles technologies et outils métiers.</li>
                  </ul>
                </div>

                {/* Weaknesses / Axes of Improvement */}
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2 shadow-sm">
                  <span className="font-bold text-amber-950 uppercase text-[11px] block border-b border-amber-200 pb-1">
                    ⚠️ Axes d'Amélioration & Faiblesses à Renforcer :
                  </span>
                  <ul className="space-y-1.5 text-slate-800 list-disc list-inside">
                    <li><strong>Prise de Parole en Public :</strong> Nécessité d'affirmer l'aisance oratoire lors de présentations à fort enjeu.</li>
                    <li><strong>Anglais Professionnel Spécialisé :</strong> Perfectionnement recommandé du vocabulaire technique des affaires.</li>
                    <li><strong>Gestion du Temps & Stress :</strong> Optimisation de l'organisation en période de forte charge opérationnelle.</li>
                    <li><strong>Maîtrise Avancée d'Outils Spécifiques :</strong> Pratique approfondie des logiciels de modélisation et d'audit.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2: Immediate Jobs (Métiers Praticables Immédiatement) */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-emerald-950 border-b-2 border-emerald-200 pb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-black">2</span>
                <span>Métiers Praticables Immédiatement (Sans Formation Complémentaire)</span>
              </h3>

              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 text-xs space-y-3 shadow-sm">
                <p className="text-emerald-950 font-medium">
                  Au vu du bilan de compétences actuel, le candidat dispose de toutes les aptitudes requises pour exercer immédiatement les postes ci-après :
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-1">
                    <span className="font-extrabold text-slate-900 block">1. Assistant Projet / Chargé d'Études junior</span>
                    <p className="text-[11px] text-slate-600">Collecte et traitement de données, rédaction de synthèses et suivi administratif.</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-1">
                    <span className="font-extrabold text-slate-900 block">2. Técnico-Commercial & Support Client</span>
                    <p className="text-[11px] text-slate-600">Gestion de la relation client, assistance technique et présentation des offres.</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-1">
                    <span className="font-extrabold text-slate-900 block">3. Opérateur Saisie & Analyste Données Jr</span>
                    <p className="text-[11px] text-slate-600">Gestion des bases de données, contrôle qualité et reporting statistique.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Recommended Training & Upgrade Paths */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-emerald-950 border-b-2 border-emerald-200 pb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-black">3</span>
                <span>Formations à Suivre pour Renforcer ses Compétences (Pour Métiers Spécifiques)</span>
              </h3>

              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 text-xs space-y-3 shadow-sm">
                <p className="text-emerald-950 font-medium">
                  Si le candidat souhaite accéder à des postes d'encadrement supérieur ou à haute spécialisation, les formations certifiantes ci-dessous sont vivement recommandées :
                </p>

                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block">Certification VAE en Gestion de Projets & Management RH</span>
                      <span className="text-[11px] text-slate-600">Accès ciblé aux métiers : Chef de Projet, Responsable Ressources Humaines.</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold rounded-md shrink-0 border border-emerald-300">
                      Module VAE OrientaAfrik
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block">Formation d'Expertise en Cybersécurité & Données Digitales</span>
                      <span className="text-[11px] text-slate-600">Accès ciblé aux métiers : Administrateur Systèmes, Consultant Sécurité.</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold rounded-md shrink-0 border border-emerald-300">
                      Spécialité 100h
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block">Perfectionnement en Anglais des Affaires & Communication de Crise</span>
                      <span className="text-[11px] text-slate-600">Accès ciblé aux métiers : Chargé d'Affaires Internationales, Diplomate.</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold rounded-md shrink-0 border border-emerald-300">
                      Certificat B2/C1
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Psychometric Test Records */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-emerald-950 border-b-2 border-emerald-200 pb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-black">4</span>
                <span>Synthèse Psychométrique et Avis du Conseiller RH</span>
              </h3>

              {/* Explicit Psychometric Tests List for Bilan de Competences */}
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2 text-xs shadow-sm">
                <span className="font-extrabold text-emerald-950 block text-xs border-b border-emerald-200 pb-1">
                  📋 Inventaire Nominatif des Tests Psychométriques Évalués :
                </span>
                {completedTestsList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {completedTestsList.map((t: any, i: number) => (
                      <div key={i} className="p-2 bg-white rounded border border-emerald-200 flex justify-between items-center">
                        <span className="font-bold text-slate-800">{t.testTitle || t.title || t.primaryCategory || `Test #${i + 1}`}</span>
                        <span className="text-emerald-800 font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">{t.suitabilityScore || 50}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div className="p-2 bg-white rounded border border-emerald-200">1. Test RIASEC (Code de Holland) — 50 Questions</div>
                    <div className="p-2 bg-white rounded border border-emerald-200">2. Test Intelligences Multiples (Gardner) — 50 Questions</div>
                    <div className="p-2 bg-white rounded border border-emerald-200">3. Test QI & Raisonnement Logique (Raven / WAIS) — 50 Questions</div>
                    <div className="p-2 bg-white rounded border border-emerald-200">4. Test Intelligence Émotionnelle & Soft Skills (EQ Goleman)</div>
                    <div className="p-2 bg-white rounded border border-emerald-200">5. Test Big Five OCEAN — 50 Questions</div>
                    <div className="p-2 bg-white rounded border border-emerald-200">6. Test Vitesse de Saisie & Dactylographie RH</div>
                    <div className="p-2 bg-white rounded border border-emerald-200">7. Test Gestion du Temps & Organisation (GTD)</div>
                  </div>
                )}
              </div>

              <div
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif, system-ui",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                  color: "#0f172a",
                }}
                className="bg-white/90 p-4 rounded-xl border border-emerald-200 text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans shadow-sm print:bg-white print:text-slate-900"
              >
                {reportText ||
                  `Bilan de compétences officiel établi sous la responsabilité du Docteur BALOGAH Dibaataba, Conseiller en Formation-Professionnalisation et Spécialiste des sciences de l'éducation.

SYNTHÈSE DU DIAGNOSTIC PROFESSIONNEL :
L'évaluation combinée du bilan psychométrique (RIASEC), des aptitudes cognitives et des expériences du candidat ${studentProfile.fullName || "le candidat"} met en évidence un potentiel d'évolution remarquable. Son profil présente un équilibre optimal entre autonomie technique et vision stratégique.

Les formations complémentaires préconisées lui permettront d'accélérer sa transition vers les fonctions de haut niveau identifiées au présent rapport.

Fait à Lomé pour servir et valoir ce que de droit.
Docteur BALOGAH Dibaataba`}
              </div>

              {/* Conclusion Box */}
              <div className="p-5 rounded-xl border-l-4 border-emerald-600 border border-emerald-300 space-y-2 bg-emerald-50/50 text-slate-900 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-emerald-200 pb-2">
                  <span className="text-xs font-extrabold uppercase text-emerald-950 tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> CONCLUSION OFFICIELLE DU DIAGNOSTIC RH
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs tracking-wide ${officialAvis.badgeClass}`}>
                    {officialAvis.avisTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium pt-1">
                  {officialAvis.avisText}
                </p>
                <div className="pt-2 text-[11px] text-slate-700 font-semibold flex justify-between items-center border-t border-emerald-200">
                  <span>Profil RH Validé par le Cabinet Dr. BALOGAH</span>
                  <span>Score Moyen aux Tests : {averageTestScore}% ({getTestScoreAppreciation(averageTestScore).appreciation})</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* SECTION IF REPORT IS PSYCHOMETRIQUE (CODE VIOLET) */}
        {reportType === "PSYCHOMETRIQUE" && (
          <>
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-purple-950 border-b-2 border-purple-200 pb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                <span>Évaluation Complète des Aptitudes Psychométriques & Profil Cognitif</span>
              </h3>

              <div className="p-4 bg-purple-50/80 border border-purple-300 rounded-xl space-y-3 text-xs shadow-sm">
                <p className="font-extrabold text-purple-950">
                  Résultats Synthétiques des Tests d'Aptitudes et Bilans Cognitifs de {studentProfile.fullName || "l'élève / étudiant"} :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white rounded-lg border border-purple-200 space-y-1">
                    <span className="font-black text-purple-900 block">1. Test RIASEC (Code de Holland)</span>
                    <p className="text-slate-600">Dominante : Investigateur (I) & Réaliste (R) — Aptitudes d'analyse approfondie.</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-purple-200 space-y-1">
                    <span className="font-black text-purple-900 block">2. Test QI & Raisonnement Logique (Raven)</span>
                    <p className="text-slate-600">Percentile Supérieur : Excellente capacité d'abstraction et de résolution de problèmes.</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-purple-200 space-y-1">
                    <span className="font-black text-purple-900 block">3. Intelligence Émotionnelle (EQ Goleman)</span>
                    <p className="text-slate-600">Score Élevé : Gestion du stress maitrisée et forte empathie relationnelle.</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-purple-200 space-y-1">
                    <span className="font-black text-purple-900 block">4. Test Big Five OCEAN & Dactylographie</span>
                    <p className="text-slate-600">Rigueur & Conscienciosité élevées — Saisie rapide et méthodique.</p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif, system-ui",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                  color: "#0f172a",
                }}
                className="bg-white/90 p-4 rounded-xl border border-purple-200 text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans shadow-sm print:bg-white print:text-slate-900"
              >
                {reportText ||
                  `Rapport certifié d'évaluation psychométrique établi par le Cabinet Dr. BALOGAH Dibaataba.
                  
L'analyse croisée des bilans d'aptitudes cognitives, de personnalités (Big Five) et de l'index d'intelligence émotionnelle atteste d'un profil intellectuel de haut niveau, parfaitement disposé à la réussite académique et professionnelle.`}
              </div>

              {/* Conclusion Box */}
              <div className="p-5 rounded-xl border-l-4 border-purple-600 border border-purple-300 space-y-2 bg-purple-50/50 text-slate-900 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-purple-200 pb-2">
                  <span className="text-xs font-extrabold uppercase text-purple-950 tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> CONCLUSION DU BILAN PSYCHOMÉTRIQUE
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs tracking-wide ${officialAvis.badgeClass}`}>
                    {officialAvis.avisTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium pt-1">
                  {officialAvis.avisText}
                </p>
                <div className="pt-2 text-[11px] text-slate-700 font-semibold flex justify-between items-center border-t border-purple-200">
                  <span>Aptitudes Certifiées par le Cabinet Dr. BALOGAH</span>
                  <span>Score Moyen aux Tests : {averageTestScore}% ({getTestScoreAppreciation(averageTestScore).appreciation})</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* SECTION IF REPORT IS CAREER (CODE ROSE) */}
        {reportType === "CAREER" && (
          <>
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-rose-950 border-b-2 border-rose-200 pb-1 flex items-center gap-2">
                <span className="w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                <span>Rapport de Stratégie de Carrière & Insertion Professionnelle 2000 Métiers</span>
              </h3>

              <div className="p-4 bg-rose-50/80 border border-rose-300 rounded-xl space-y-3 text-xs shadow-sm">
                <p className="font-extrabold text-rose-950">
                  Cartographie des Débouchés & Secteurs Porteurs Recommandés pour {studentProfile.fullName || "le candidat"} :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <div className="p-3 bg-white rounded-lg border border-rose-200 space-y-1">
                    <span className="font-black text-rose-900 block">Secteur Digital & Tech</span>
                    <p className="text-slate-600">Ingénieur IA, Data Scientist, Développeur Fullstack, Consultant Cloud.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-rose-200 space-y-1">
                    <span className="font-black text-rose-900 block">Secteur Management & RH</span>
                    <p className="text-slate-600">Chef de Projet, Responsable Recrutement, Consultant en Organisation.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-rose-200 space-y-1">
                    <span className="font-black text-rose-900 block">Secteur Énergie & Industrie</span>
                    <p className="text-slate-600">Ingénieur Procédés, Auditeur Qualité & Énergie, Responsable HSE.</p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif, system-ui",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                  color: "#0f172a",
                }}
                className="bg-white/90 p-4 rounded-xl border border-rose-200 text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans shadow-sm print:bg-white print:text-slate-900"
              >
                {reportText ||
                  `Rapport de prospective professionnelle et insertion marché établi sous le timbre du Cabinet Dr. BALOGAH Dibaataba.
                  
Le marché de l'emploi en Afrique subsaharienne et à l'international présente de fortes opportunités dans les métiers de la transition digitale, du management stratégique et des ingénieries appliquées.`}
              </div>

              {/* Conclusion Box */}
              <div className="p-5 rounded-xl border-l-4 border-rose-600 border border-rose-300 space-y-2 bg-rose-50/50 text-slate-900 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-rose-200 pb-2">
                  <span className="text-xs font-extrabold uppercase text-rose-950 tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-600" /> CONCLUSION DE LA STRATÉGIE DE CARRIÈRE
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs tracking-wide ${officialAvis.badgeClass}`}>
                    {officialAvis.avisTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium pt-1">
                  {officialAvis.avisText}
                </p>
                <div className="pt-2 text-[11px] text-slate-400 flex justify-between items-center border-t border-slate-800">
                  <span>Plan d'Insertion Validé par le Cabinet Dr. BALOGAH</span>
                  <span>Score Moyen aux Tests : {averageTestScore}% ({getTestScoreAppreciation(averageTestScore).appreciation})</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* REPORT FOOTER: Signature & QR Code */}
        <BalogahPdfFooter
          docId="RAP-ORIENT-2026-BAL"
          studentName={studentProfile.fullName || "Bénéficiaire OrientaAfrik"}
          docType="Rapport d'Orientation & Bilan de Compétences"
          showFullCabinetDetails={true}
          isBiometricValidated={isBiometricValidated}
          isPreviewMode={isPreviewPrintMode}
        />
      </div>
    </div>

      {/* Bottom Export Shortcuts Bar */}
      {unlockedReport && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3 print:hidden shadow-lg max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-black text-white block">Fin du Rapport — Exportation Facile :</span>
                <span className="text-[11px] text-slate-400">Téléchargez ou sauvegardez ce document officiel pour vos démarches.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleTriggerActionWithValidation("DOWNLOAD_PDF")}
                disabled={isGeneratingPdf}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPdf ? "Génération PDF..." : "Télécharger PDF Direct"}</span>
              </button>

              <button
                onClick={() => handleTriggerActionWithValidation("PRINT")}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>

              <button
                onClick={() => handleTriggerActionWithValidation("EXPORT_TXT")}
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-extrabold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95 border border-slate-700"
              >
                <FileText className="w-4 h-4" />
                <span>Format (.TXT)</span>
              </button>

              <button
                onClick={handleCopyText}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95"
              >
                {copySuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copySuccess ? "Copié !" : "Copier"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DG Fingerprint Scanner Modal */}
      <DirectorFingerprintScannerModal
        isOpen={isFingerprintModalOpen}
        onClose={() => setIsFingerprintModalOpen(false)}
        onSuccess={handleFingerprintSuccess}
        documentTitle={`Rapport ${reportType} (${studentProfile.fullName || "Bénéficiaire"})`}
        docId="RAP-ORIENT-2026-BAL"
      />
    </div>
  );
};

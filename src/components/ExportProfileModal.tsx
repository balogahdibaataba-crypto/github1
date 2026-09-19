import React, { useState, useRef } from "react";
import {
  FileText,
  Download,
  Printer,
  Mail,
  X,
  CheckCircle2,
  Award,
  ShieldCheck,
  User,
  Calculator,
  Compass,
  Sparkles,
  BookOpen,
  GraduationCap,
  Building2,
  Lock,
  Copy,
  Check,
  Fingerprint,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BalogahPdfFooter } from "./BalogahPdfFooter";
import { DirectorFingerprintScannerModal } from "./DirectorFingerprintScannerModal";
import { getTestScoreAppreciation, getConclusionAvis } from "../utils/evaluationRules";
import { getProgramTuitionEstimate, getCountryLivingCostEstimate } from "../utils/costCalculations";
import { exportElementToPdf } from "../utils/pdfExportHelper";
import { OrientaAfrikOfficialLogo } from "./OrientaAfrikOfficialLogo";

interface ExportProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: {
    fullName: string;
    email: string;
    phone: string;
    currentLevel: string;
    targetCountry: string;
  };
  setStudentProfile?: React.Dispatch<React.SetStateAction<any>>;
  gradesSummary: any;
  completedTests: Record<string, any>;
  unlockedReport: boolean;
  onOpenPaymentModal: () => void;
  currency: "FCFA" | "EUR" | "USD";
  onSelectTab?: (tab: string) => void;
}

export const ExportProfileModal: React.FC<ExportProfileModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  setStudentProfile,
  gradesSummary,
  completedTests,
  unlockedReport,
  onOpenPaymentModal,
  currency,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);

  // Print Preview Mode State
  const [isPreviewPrintMode, setIsPreviewPrintMode] = useState(false);
  const [previewScale, setPreviewScale] = useState<number>(100);

  // Biometric Fingerprint Validation State
  const [isBiometricValidated, setIsBiometricValidated] = useState(true);
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false);
  const [pendingExportAction, setPendingExportAction] = useState<"DOWNLOAD_PDF" | "PRINT" | "EXPORT_TXT" | null>(null);

  const documentRef = useRef<HTMLDivElement | null>(null);

  const handleTriggerActionWithValidation = (action: "DOWNLOAD_PDF" | "PRINT" | "EXPORT_TXT") => {
    if (isBiometricValidated) {
      if (action === "DOWNLOAD_PDF") handleDownloadDirectPdf();
      else if (action === "PRINT") handlePrintWindow();
      else if (action === "EXPORT_TXT") handleExportTxt();
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
      if (act === "DOWNLOAD_PDF") handleDownloadDirectPdf();
      else if (act === "PRINT") handlePrintWindow();
      else if (act === "EXPORT_TXT") handleExportTxt();
    }, 300);
  };

  const completedTestsList = Object.values(completedTests || {});
  const averageTestScore =
    completedTestsList.length > 0
      ? Math.round(
          completedTestsList.reduce<number>(
            (acc, t: any) =>
              acc + (t.suitabilityScore !== undefined ? Number(t.suitabilityScore) : 50),
            0
          ) / completedTestsList.length
        )
      : 50;

  const currentOverallAvg = parseFloat(gradesSummary?.overallAvg || "12.50");
  const currentIsEligible = gradesSummary?.isEligibleGeneral !== false;
  const targetProgramName = gradesSummary?.selectedTargetProgram || "Génie Informatique & IA";
  const targetCountryName = studentProfile.targetCountry || "Togo / Afrique";

  const tuitionEst = getProgramTuitionEstimate(targetProgramName);
  const livingCostEst = getCountryLivingCostEstimate(targetCountryName);

  const officialAvis = getConclusionAvis({
    isEligible: currentIsEligible,
    overallAvg: currentOverallAvg,
    testScorePct: averageTestScore,
  });

  const currentDateFormatted = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // 1. Direct Download PDF Generator
  const handleDownloadDirectPdf = async () => {
    if (!documentRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const safeName = (studentProfile.fullName || "Etudiant")
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .toLowerCase();
      await exportElementToPdf(
        documentRef.current,
        `Profil_OrientaAfrik_Dr_BALOGAH_${safeName}.pdf`
      );
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Erreur lors de la génération du document PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. Native Print / Save to PDF
  const handlePrintWindow = () => {
    window.print();
  };

  // 3. Email Dispatch
  const handleSendReportByEmail = async () => {
    const targetEmail = (studentProfile.email || "balogahdibaataba@gmail.com").trim();
    if (!targetEmail || !targetEmail.includes("@")) {
      alert("Veuillez saisir une adresse e-mail valide dans votre profil.");
      return;
    }

    setIsSendingEmail(true);
    setEmailStatusMsg(null);

    try {
      const res = await fetch("/api/email/send-certificate-or-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: targetEmail,
          recipientName: studentProfile.fullName || "Étudiant / Candidat",
          documentType: "REPORT",
          documentTitle: "Profil & Rapport Certifié d'Orientation - Dr BALOGAH",
          receiptHash: "PROF-ORIENT-2026-BAL",
          amount: 15000,
          currency: "FCFA",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEmailStatusMsg(`✅ Votre profil et rapport certifié ont été envoyés avec succès à ${targetEmail} !`);
      } else {
        alert(data.message || "Erreur lors de l'envoi de l'e-mail.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'envoi de l'e-mail.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // 4. Export TXT
  const [copySuccess, setCopySuccess] = useState(false);

  const handleExportTxt = () => {
    const textContent = `=====================================================
ORIENTAAFRIK & CERTIFICATION - CABINET DR. BALOGAH DIBAATABA
DOSSIER DU BÉNÉFICIAIRE & RAPPORT CERTIFIÉ
Date : ${currentDateFormatted}
Nom : ${studentProfile.fullName || "Non renseigné"}
Email : ${studentProfile.email || "Non renseigné"}
Téléphone : ${studentProfile.phone || "Non renseigné"}
Niveau Actuel : ${studentProfile.currentLevel || "Non renseigné"}
Pays Cible : ${targetCountryName}
=====================================================

SYNTHÈSE DU PROFIL & RECOMMANDATIONS :
Moyenne Générale Académique : ${currentOverallAvg}/20
Score Moyen Tests d'Aptitudes : ${averageTestScore}%
Filière / Spécialité Cible : ${targetProgramName}
Avis Officiel du Conseiller : ${officialAvis.avisTitle}

=====================================================
Certifié sous le timbre du Docteur BALOGAH Dibaataba
Conseiller d'Orientation Scolaire et Professionnelle
Site Officiel : orientaafrik.mpginternational.org
=====================================================`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeName = (studentProfile.fullName || "Etudiant").replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
    link.download = `Profil_Dr_BALOGAH_${safeName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 5. Copy text
  const handleCopyText = () => {
    const textToCopy = `ORIENTAAFRIK - CABINET DR. BALOGAH\nNom: ${studentProfile.fullName || "Bénéficiaire"}\nMoyenne: ${currentOverallAvg}/20\nTests: ${averageTestScore}%\nAvis: ${officialAvis.avisTitle}`;
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black">
              <FileText className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-extrabold uppercase">
                  Export Officiel PDF
                </span>
                <h2 className="text-base font-black text-white">
                  Exporter le Profil & Rapport Certifié Dr BALOGAH
                </h2>
              </div>
              <p className="text-slate-300 text-xs">
                Tests effectués, moyennes académiques calculées et recommandations d'orientation du Dr BALOGAH.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL ACTION CONTROL BAR */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Quick Info & Lock notice */}
          <div className="text-xs text-slate-700">
            {unlockedReport ? (
              <span className="font-extrabold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Document Officiel Débloqué & Prêt pour l'Exportation PDF
              </span>
            ) : (
              <span className="font-bold text-amber-800 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-600" />
                Aperçu du Profil (Impression réservée avec le Rapport Débloqué)
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {unlockedReport ? (
              <>
                <button
                  type="button"
                  onClick={() => handleTriggerActionWithValidation("DOWNLOAD_PDF")}
                  disabled={isGeneratingPdf}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? "Génération PDF..." : "Télécharger PDF"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerActionWithValidation("PRINT")}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewPrintMode(!isPreviewPrintMode)}
                  className={`px-3.5 py-2 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                    isPreviewPrintMode
                      ? "bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-400"
                      : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 border border-amber-500/40"
                  }`}
                  title="Basculez en mode Aperçu Impression pour vérifier le rendu des zones encerclées avant l'impression"
                >
                  {isPreviewPrintMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-amber-600" />}
                  <span>{isPreviewPrintMode ? "Quitter Aperçu" : "Aperçu Impression"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerActionWithValidation("EXPORT_TXT")}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-slate-100 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Format (.TXT)</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copySuccess ? "Copié !" : "Copier"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSendReportByEmail}
                  disabled={isSendingEmail}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isSendingEmail ? "Envoi..." : "Envoyer Email"}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Débloquer le PDF Officiel (15 000 FCFA HT)</span>
              </button>
            )}
          </div>
        </div>

        {emailStatusMsg && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-xs font-bold text-emerald-950 px-6">
            {emailStatusMsg}
          </div>
        )}

        {/* PROFILE PREVIEW & EDIT BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-100">
          {/* Editable Student Profile Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wide flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" /> Informations du Bénéficiaire sur le Document
              </span>
              <span className="text-[10px] font-bold text-slate-400">Vous pouvez modifier vos identifiants ci-dessous</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Nom complet & Prénoms :</label>
                <input
                  type="text"
                  value={studentProfile.fullName}
                  onChange={(e) =>
                    setStudentProfile &&
                    setStudentProfile((prev: any) => ({ ...prev, fullName: e.target.value }))
                  }
                  placeholder="Ex: BALOGAH Yao Jean"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Adresse E-mail :</label>
                <input
                  type="email"
                  value={studentProfile.email}
                  onChange={(e) =>
                    setStudentProfile &&
                    setStudentProfile((prev: any) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="votre.email@exemple.com"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Niveau d'études actuel :</label>
                <input
                  type="text"
                  value={studentProfile.currentLevel}
                  onChange={(e) =>
                    setStudentProfile &&
                    setStudentProfile((prev: any) => ({ ...prev, currentLevel: e.target.value }))
                  }
                  placeholder="Terminale D / BAC / Licence"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Pays d'études ciblé :</label>
                <input
                  type="text"
                  value={studentProfile.targetCountry}
                  onChange={(e) =>
                    setStudentProfile &&
                    setStudentProfile((prev: any) => ({ ...prev, targetCountry: e.target.value }))
                  }
                  placeholder="Togo / France / Canada"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* DOCUMENT PRINT CONTAINER (HTML TO CANVAS & PRINT TARGET) */}
          {isPreviewPrintMode && (
            <div className="bg-amber-950/90 border-2 border-amber-500/80 text-white p-4 rounded-2xl shadow-xl space-y-3 print:hidden max-w-4xl mx-auto animate-fadeIn mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-400/40 text-amber-300">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-300 uppercase tracking-wide flex items-center gap-2">
                      Mode Prévisualisation Impression A4
                      <span className="px-2 py-0.5 bg-amber-400/20 text-amber-200 text-[10px] rounded-full border border-amber-400/30 font-mono">
                        Zones Encerclées Actives
                      </span>
                    </h4>
                    <p className="text-xs text-amber-100/90 mt-0.5">
                      Vérification du Sceau officiel, de l'Empreinte DG et des Signatures encerclées.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-[11px] font-bold text-amber-200">Zoom :</span>
                  <button
                    type="button"
                    onClick={() => setPreviewScale(Math.max(70, previewScale - 10))}
                    className="p-1.5 bg-amber-900/80 hover:bg-amber-800 rounded-lg text-amber-200 text-xs font-mono font-bold border border-amber-600/40"
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
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerActionWithValidation("PRINT")}
                    className="ml-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Lancer l'Impression</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-200/90 font-medium pt-0.5">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Rendu certifié : Le document est prêt pour impression ou sauvegarde PDF.
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
              id="export-profile-pdf-document"
              ref={documentRef}
              style={{
                transform: isPreviewPrintMode ? `scale(${previewScale / 100})` : "none",
                transformOrigin: "top center",
              }}
              className={`print-container printable-area bg-white border border-slate-300 p-8 rounded-2xl shadow-xl space-y-8 min-w-[760px] md:min-w-0 md:w-full max-w-4xl mx-auto text-slate-900 relative transition-all ${
                isPreviewPrintMode ? "ring-4 ring-amber-500/60 shadow-2xl border-dashed border-amber-500 bg-amber-50/10" : ""
              } ${
                !unlockedReport ? "opacity-90" : ""
              }`}
            >
            {/* Header: Cabinet Dr BALOGAH Official Banner */}
            <div className="border-b-2 border-slate-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-start gap-5">
              <div className="space-y-3 w-full md:flex-1">
                <OrientaAfrikOfficialLogo variant="document" size="md" className="w-full" />
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block leading-snug">
                  Document Officiel Certifié d'Orientation & Bilan de Compétences
                </span>
              </div>

              <div className="text-left md:text-right text-xs space-y-1 border-l-2 md:border-l-0 md:border-r-2 border-emerald-600 pl-3 md:pl-0 md:pr-4 py-1 shrink-0">
                <p className="font-extrabold text-slate-900 text-sm leading-snug">Docteur BALOGAH Dibaataba</p>
                <p className="text-slate-700 font-bold text-[11px] leading-snug">Spécialiste des sciences de l'éducation et de la formation</p>
                <p className="text-slate-600 font-medium text-[11px] leading-snug">Conseiller d'orientation scolaire et professionnelle</p>
                <p className="text-slate-500 text-[10px] pt-1 leading-relaxed">📍 Lomé, Togo • Tél : +228 90966765 / +228 99372074<br />E-mail : contact@orientaafrik.org / dbalogah@yahoo.com</p>
              </div>
            </div>

            {/* Profile Meta Cards */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 text-[10px] block uppercase">Bénéficiaire du Bilan :</span>
                <p className="font-extrabold text-slate-900 text-sm">
                  {studentProfile.fullName || "Étudiant / Bénéficiaire OrientaAfrik"}
                </p>
                <p className="text-slate-600">Niveau d'études : {studentProfile.currentLevel || "Terminale / BAC"}</p>
                <p className="text-slate-600">E-mail : {studentProfile.email || "Non spécifié"}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 text-[10px] block uppercase">Objectifs d'Orientation :</span>
                <p className="font-bold text-slate-800">
                  Spécialité visée : {gradesSummary?.selectedTargetProgram || "Génie Informatique & IA"}
                </p>
                <p className="text-slate-600">Pays d'études ciblé : {studentProfile.targetCountry || "Togo / Afrique"}</p>
                <p className="text-slate-600">Date d'émission : {currentDateFormatted}</p>
              </div>
            </div>

            {/* SECTION 1: TESTS PSYCHOMÉTRIQUES & SCORES */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-700 text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                <span>Bilan des Tests Psychométriques & Aptitudes Évaluées ({completedTestsList.length} / 10 Tests Effectués)</span>
              </h3>

              {completedTestsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {completedTestsList.map((test: any, idx: number) => {
                    const score = test.suitabilityScore !== undefined ? test.suitabilityScore : 50;
                    const appInfo = getTestScoreAppreciation(score);
                    const testTitleName = test.testTitle || test.title || test.primaryCategory || `Test #${idx + 1}`;
                    return (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-start flex-wrap gap-1 border-b border-slate-200 pb-1.5">
                          <div>
                            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide block">
                              {test.category || test.primaryCategory || "Test Psychométrique Certifié"}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-xs mt-0.5">{testTitleName}</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold border ${appInfo.badgeColorClass}`}>
                            {score}% — {appInfo.appreciation}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {test.description || "Évaluation des aptitudes cognitives, comportements et profil de réussite."}
                        </p>
                        {test.recommendedFields && (
                          <div className="text-[10px] text-slate-500 pt-0.5">
                            <strong>Filières recommandées :</strong> {test.recommendedFields.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-extrabold text-slate-900 block text-xs">
                      📋 Protocole des 10 Tests Psychométriques du Cabinet Dr. BALOGAH :
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      Score Moyen Étalon Standard (50%)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-white rounded border border-slate-200 font-medium">1. Test RIASEC (Code de Holland) — 50 Questions</div>
                    <div className="p-2 bg-white rounded border border-slate-200 font-medium">2. Test Intelligences Multiples (Gardner) — 50 Questions</div>
                    <div className="p-2 bg-white rounded border border-slate-200 font-medium">3. Test QI & Raisonnement Logique (Raven / WAIS)</div>
                    <div className="p-2 bg-white rounded border border-slate-200 font-medium">4. Test Intelligence Émotionnelle & Soft Skills (EQ Goleman)</div>
                    <div className="p-2 bg-white rounded border border-slate-200 font-medium">5. Test des 5 Grands Traits de Personnalité (Big Five / OCEAN)</div>
                    <div className="p-2 bg-white rounded border border-slate-200 font-medium">6. Test Vitesse de Saisie & Dactylographie RH</div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: MOYENNES CALCULÉES & ÉLIGIBILITÉ BAC */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-700 text-white rounded-full flex items-center justify-center text-xs font-black">2</span>
                <span>Moyennes Calculées & Vérification de l'Éligibilité Académique</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Langues (Français, Anglais)</span>
                  <span className="text-base font-bold text-slate-900">{gradesSummary?.langAvg || "12.50"} / 20</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Sciences Humaines (Hist-Géo, Philo)</span>
                  <span className="text-base font-bold text-slate-900">{gradesSummary?.humAvg || "11.50"} / 20</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Sciences Exactes (Maths, Phys, SVT, Info)</span>
                  <span className="text-base font-bold text-slate-900">{gradesSummary?.sciAvg || "13.50"} / 20</span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium flex justify-between items-center">
                <div>
                  ✅ Moyenne Générale Pondérée : <strong>{currentOverallAvg.toFixed(2)} / 20</strong>
                </div>
                <span className="px-2.5 py-1 bg-emerald-600 text-white rounded font-extrabold text-[11px]">
                  Règle Note ≥ 10/20 : {currentIsEligible ? "Validée" : "À renforcer"}
                </span>
              </div>
            </div>

            {/* SECTION 3: RECOMMANDATIONS DU DR BALOGAH */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-700 text-white rounded-full flex items-center justify-center text-xs font-black">3</span>
                <span>Recommandations d'Orientation Personnalisées (Dr. BALOGAH)</span>
              </h3>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 space-y-3 font-sans">
                <p className="font-semibold">
                  Je soussigné, Docteur BALOGAH Dibaataba, Conseiller d'orientation scolaire et professionnelle, certifie avoir examiné les résultats académiques et les tests psychométriques de l'étudiant <strong>{studentProfile.fullName || "le bénéficiaire"}</strong>.
                </p>
                <div className="space-y-1">
                  <strong className="text-slate-900 block">1. Diagnostic d'Orientation Académique :</strong>
                  <p>
                    Au vu de la moyenne générale de {currentOverallAvg.toFixed(2)}/20 et des aptitudes attestées aux tests, le profil démontre les capacités requises pour réussir dans la spécialité : <strong>{targetProgramName}</strong>.
                  </p>
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 block">2. Établissements Préconisés dans le Pays Cible ({targetCountryName}) :</strong>
                  <p>
                    - Universités Publiques & Facultés des Sciences / Droit / Gestion
                    <br />
                    - Écoles Supérieures d'Ingénieurs & Instituts Technologiques Certifiés (LMD)
                  </p>
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 block">3. Budget Prévisionnel Estimé :</strong>
                  <p>
                    - Scolarité publique : {tuitionEst.displayPublicRangeFCFA} | Privé : {tuitionEst.displayPrivateRangeFCFA}
                    <br />
                    - Coût de la vie mensuel estimé : {livingCostEst.displayMonthlyRangeFCFA} ({livingCostEst.currencyEquivalentEUR})
                  </p>
                </div>
              </div>

              {/* Conclusion Official Avis Box */}
              <div className="p-4 rounded-xl border border-emerald-300 space-y-2 bg-emerald-50/50 text-slate-900">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-emerald-200 pb-2">
                  <span className="text-xs font-extrabold uppercase text-emerald-950 tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> AVIS ET CONCLUSION OFFICIELLE DU CONSEILLER
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-black ${officialAvis.badgeClass}`}>
                    {officialAvis.avisTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium pt-1">
                  {officialAvis.avisText}
                </p>
              </div>
            </div>

            {/* Official Signature & QR Code Footer */}
            <BalogahPdfFooter
              docId="PROF-ORIENT-2026-BAL"
              studentName={studentProfile.fullName || "Bénéficiaire OrientaAfrik"}
              docType="Profil d'Orientation & Bilan de Compétences"
              showFullCabinetDetails={true}
              isBiometricValidated={isBiometricValidated}
              isPreviewMode={isPreviewPrintMode}
            />
          </div>
        </div>
      </div>
      </div>

      {/* Director Fingerprint Scanner Modal */}
      <DirectorFingerprintScannerModal
        isOpen={isFingerprintModalOpen}
        onClose={() => setIsFingerprintModalOpen(false)}
        onSuccess={handleFingerprintSuccess}
        documentTitle={`Profil & Rapport d'Orientation (${studentProfile.fullName || "Bénéficiaire"})`}
        docId="PROF-ORIENT-2026-BAL"
      />
    </div>
  );
};

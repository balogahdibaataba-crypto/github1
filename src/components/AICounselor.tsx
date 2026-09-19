import React, { useState, useEffect } from "react";
import { Bot, Send, Sparkles, User, FileText, Lock, ShieldCheck, Printer, CheckCircle2, RotateCcw, AlertTriangle, ArrowRight, ShieldAlert, Download } from "lucide-react";
import { PrintableReport } from "./PrintableReport";
import {
  getStudentProfileCache,
  saveStudentProfileCache,
} from "../utils/localStorageCache";

interface AICounselorProps {
  gradesSummary: any;
  completedTests: Record<string, any>;
  onOpenPaymentModal: () => void;
  unlockedReport: boolean;
  currency: "FCFA" | "EUR" | "USD";
  onGoToTests?: () => void;
  onSelectTab?: (tab: string) => void;
  onOpenExportProfileModal?: () => void;
  autoDownloadPending?: boolean;
  onAutoDownloadDone?: () => void;
}

export const AICounselor: React.FC<AICounselorProps> = ({
  gradesSummary,
  completedTests,
  onOpenPaymentModal,
  unlockedReport,
  currency,
  onGoToTests,
  onSelectTab,
  onOpenExportProfileModal,
  autoDownloadPending,
  onAutoDownloadDone,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"chat" | "report">("chat");
  const [reportType, setReportType] = useState<"ORIENTATION" | "BILAN_COMPETENCES" | "PSYCHOMETRIQUE" | "CAREER">("ORIENTATION");

  useEffect(() => {
    if (autoDownloadPending) {
      setActiveSubTab("report");
    }
  }, [autoDownloadPending]);

  const [studentProfile, setStudentProfile] = useState(() => {
    const cached = getStudentProfileCache();
    return (
      cached || {
        fullName: "",
        email: "",
        phone: "",
        currentLevel: "Terminale D",
        targetCountry: "Togo / Afrique de l'Ouest",
      }
    );
  });

  useEffect(() => {
    saveStudentProfileCache(studentProfile);
  }, [studentProfile]);

  const numTestsPassed = Object.keys(completedTests).length;

  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; content: string }>>([
    {
      sender: "bot",
      content:
        "Bonjour ! Je suis le Dr. BALOGAH Dibaataba, Conseiller d'orientation scolaire et professionnelle. Je suis à votre écoute pour vous orienter vers les meilleures universités d'Afrique (Togo, Bénin, Côte d'Ivoire, Sénégal, Maroc...) et du monde, analyser vos notes, et vous recommander les métiers d'avenir. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  const [generatedReportText, setGeneratedReportText] = useState<string>("");
  const [loadingReport, setLoadingReport] = useState(false);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loadingChat) return;

    const userMsg = inputMessage;
    setInputMessage("");
    setMessages((prev) => [...prev, { sender: "user", content: userMsg }]);
    setLoadingChat(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { sender: "user", content: userMsg }],
          userContext: {
            studentProfile,
            gradesSummary,
            completedTestsCount: Object.keys(completedTests).length,
          },
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content: data.response || "Désolé, je n'ai pas pu traiter votre message.",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content:
            "Une erreur réseau est survenue. Veuillez vérifier votre connexion ou votre clé API Gemini.",
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const res = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentProfile,
          grades: gradesSummary,
          testResults: completedTests,
          targetProgram: gradesSummary?.selectedTargetProgram,
          reportType,
        }),
      });

      const data = await res.json();
      if (data.reportText) {
        setGeneratedReportText(data.reportText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-900 p-6 rounded-2xl text-white shadow-md border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Cabinet OrientaAfrik et Certification • Dr BALOGAH
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Consultation Dr BALOGAH & Émission de Rapports Certifiés
          </h2>
          <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
            Consultez en direct le Cabinet du Dr. BALOGAH Dibaataba. Éditez votre <strong>Rapport Certifié d'Orientation</strong> ou votre <strong>Bilan de Compétences Officiel</strong>.
          </p>
        </div>

        {/* Sub-Tab Selector & Export Profile Button */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenExportProfileModal && (
            <button
              onClick={onOpenExportProfileModal}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Exporter le profil (PDF)</span>
            </button>
          )}

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab("chat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === "chat"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Espace de Dialogue</span>
            </button>
            <button
              onClick={() => setActiveSubTab("report")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === "report"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Rapport Imprimable</span>
            </button>
          </div>
        </div>
      </div>

      {/* DR. BALOGAH CONSULTATION SERVICES CERTIFIED SCOPE */}
      {/* 4-Step Guided Orientation Banner requested by user */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-4 rounded-2xl text-white shadow-md border border-slate-700 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              Procédure Officielle d'Orientation
            </span>
            <h3 className="text-sm font-extrabold text-white">
              Le Parcours OrientaAfrik en 4 Étapes Clés
            </h3>
          </div>
          <span className="text-[11px] text-slate-300">
            Suivez ce parcours guidé pour réussir votre orientation scolaire et professionnelle.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("institutions")}
            className="p-3 bg-slate-950/80 hover:bg-slate-800/90 rounded-xl border border-slate-700 text-left space-y-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Étape 1
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-emerald-300">1. Répertoire des Établissements</h4>
            <p className="text-[10px] text-slate-300 leading-snug">
              Explorer les universités & grandes écoles publiques et privées d'Afrique et du monde.
            </p>
          </button>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("institutions")}
            className="p-3 bg-slate-950/80 hover:bg-slate-800/90 rounded-xl border border-slate-700 text-left space-y-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Étape 2
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-emerald-300">2. Choisir une Filière</h4>
            <p className="text-[10px] text-slate-300 leading-snug">
              Sélectionner la filière d'avenir parmi les 30 filières répertoriées par université.
            </p>
          </button>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("calculator")}
            className="p-3 bg-slate-950/80 hover:bg-slate-800/90 rounded-xl border border-slate-700 text-left space-y-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Étape 3
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-emerald-300">3. Calculer sa Moyenne Exigée</h4>
            <p className="text-[10px] text-slate-300 leading-snug">
              Tester vos notes pour les matières exigées uniquement par la filière choisie.
            </p>
          </button>

          {/* Step 4 */}
          <button
            type="button"
            onClick={() => {
              if (onGoToTests) onGoToTests();
              else if (onSelectTab) onSelectTab("tests");
            }}
            className="p-3 bg-slate-950/80 hover:bg-slate-800/90 rounded-xl border border-slate-700 text-left space-y-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Étape 4
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-emerald-300">4. Tests Psychométriques</h4>
            <p className="text-[10px] text-slate-300 leading-snug">
              Passer les épreuves RIASEC, WAIS/Raven, EQ Goleman et Big Five pour valider votre profil.
            </p>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Cabinet Dr. BALOGAH Dibaataba • Consultations Officielles Habilitées
            </span>
            <h3 className="font-extrabold text-slate-900 text-sm mt-1 flex items-center gap-1.5">
              <span>Les 5 Types de Consultations Proposées (Cliquez pour accéder directement) :</span>
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Navigation Directe Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          {/* 1. Tests Psychométriques */}
          <button
            type="button"
            onClick={() => {
              if (onGoToTests) onGoToTests();
              else if (onSelectTab) onSelectTab("tests");
            }}
            className="p-2.5 bg-emerald-50/70 hover:bg-emerald-100/90 rounded-xl border border-emerald-300 space-y-1.5 text-left transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500 flex flex-col justify-between"
            title="Cliquer pour accéder directement aux Tests d'Orientation Psychométriques"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 bg-emerald-700 group-hover:bg-emerald-800 text-white rounded-md flex items-center justify-center font-extrabold text-xs shadow-sm">
                  1
                </div>
                <span className="text-[9px] font-extrabold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200 group-hover:border-emerald-400">
                  Activité Test
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs group-hover:text-emerald-950">Tests Psychométriques</h4>
              <p className="text-[10px] text-slate-600 leading-snug">
                Évaluation RIASEC, QI Raven, Intelligence émotionnelle, Big Five & Dactylographie.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-300 group-hover:bg-emerald-700 group-hover:text-white transition-all w-fit mt-1">
              <span>Lancer les tests</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* 2. Bilan de Compétences */}
          <button
            type="button"
            onClick={() => {
              setActiveSubTab("report");
              setReportType("BILAN_COMPETENCES");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-2.5 bg-teal-50/70 hover:bg-teal-100/90 rounded-xl border border-teal-300 space-y-1.5 text-left transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-teal-500 flex flex-col justify-between"
            title="Cliquer pour afficher le Rapport de Bilan de Compétences"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 bg-teal-700 group-hover:bg-teal-800 text-white rounded-md flex items-center justify-center font-extrabold text-xs shadow-sm">
                  2
                </div>
                <span className="text-[9px] font-extrabold text-teal-800 bg-white px-1.5 py-0.5 rounded border border-teal-200 group-hover:border-teal-400">
                  Rapport Bilan
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs group-hover:text-teal-950">Bilan de Compétences</h4>
              <p className="text-[10px] text-slate-600 leading-snug">
                Diagnostic RH approfondi, cartographie des acquis & trajectoires professionnelles.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-teal-700 bg-white px-2 py-0.5 rounded-lg border border-teal-300 group-hover:bg-teal-700 group-hover:text-white transition-all w-fit mt-1">
              <span>Générer le Bilan</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* 3. Rapport Certifié d'Orientation Scolaire */}
          <button
            type="button"
            onClick={() => {
              setActiveSubTab("report");
              setReportType("ORIENTATION");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-2.5 bg-blue-50/70 hover:bg-blue-100/90 rounded-xl border border-blue-300 space-y-1.5 text-left transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col justify-between"
            title="Cliquer pour consulter le Rapport Certifié d'Orientation Scolaire"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 bg-blue-700 group-hover:bg-blue-800 text-white rounded-md flex items-center justify-center font-extrabold text-xs shadow-sm">
                  3
                </div>
                <span className="text-[9px] font-extrabold text-blue-800 bg-white px-1.5 py-0.5 rounded border border-blue-200 group-hover:border-blue-400">
                  Rapport Scolaire
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs group-hover:text-blue-950">Rapport Certifié d'Orientation</h4>
              <p className="text-[10px] text-slate-600 leading-snug">
                Orientation post-bac, sélection des filières universitaires & dossiers d'admission.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-blue-300 group-hover:bg-blue-700 group-hover:text-white transition-all w-fit mt-1">
              <span>Voir le Rapport</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* 4. Orientation Professionnelle */}
          <button
            type="button"
            onClick={() => {
              if (onSelectTab) onSelectTab("careers");
            }}
            className="p-2.5 bg-amber-50/70 hover:bg-amber-100/90 rounded-xl border border-amber-300 space-y-1.5 text-left transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-amber-500 flex flex-col justify-between"
            title="Cliquer pour accéder à la Répertoire de 2000 Métiers et Orientation Professionnelle"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 bg-amber-700 group-hover:bg-amber-800 text-white rounded-md flex items-center justify-center font-extrabold text-xs shadow-sm">
                  4
                </div>
                <span className="text-[9px] font-extrabold text-amber-900 bg-white px-1.5 py-0.5 rounded border border-amber-200 group-hover:border-amber-400">
                  Métiers & Carrières
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs group-hover:text-amber-950">Orientation Professionnelle</h4>
              <p className="text-[10px] text-slate-600 leading-snug">
                Insertion sur le marché du travail, stratégie de carrière & reconversion sectorielle.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-300 group-hover:bg-amber-700 group-hover:text-white transition-all w-fit mt-1">
              <span>2000 Métiers</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* 5. Conseil en Formation */}
          <button
            type="button"
            onClick={() => {
              if (onSelectTab) onSelectTab("certifications");
            }}
            className="p-2.5 bg-indigo-50/70 hover:bg-indigo-100/90 rounded-xl border border-indigo-300 space-y-1.5 text-left transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500 flex flex-col justify-between"
            title="Cliquer pour consulter les Formations, Certifications et modules VAE"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 bg-indigo-700 group-hover:bg-indigo-800 text-white rounded-md flex items-center justify-center font-extrabold text-xs shadow-sm">
                  5
                </div>
                <span className="text-[9px] font-extrabold text-indigo-800 bg-white px-1.5 py-0.5 rounded border border-indigo-200 group-hover:border-indigo-400">
                  Certifications
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs group-hover:text-indigo-950">Conseil en Formation</h4>
              <p className="text-[10px] text-slate-600 leading-snug">
                Ingénierie de professionnalisation, choix des diplômes & modules VAE.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-300 group-hover:bg-indigo-700 group-hover:text-white transition-all w-fit mt-1">
              <span>Voir Formations</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* Mandatory Tests Alert Banner */}
      {numTestsPassed < 3 && (
        <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs text-amber-950">
              <span className="font-extrabold text-amber-900 block text-sm">
                ⚠️ Passation des Tests d'Orientation Obligatoire ({numTestsPassed}/10 test(s) effectué(s))
              </span>
              <p className="text-amber-900 leading-relaxed">
                Conformément aux protocoles d'orientation du Dr. BALOGAH, toute demande d'orientation certifiée ou de bilan de compétences nécessite de passer vos tests d'orientation (RIASEC, Aptitudes logiques, Personnalité) afin de fonder les recommandations sur des données probantes.
              </p>
            </div>
          </div>

          {onGoToTests && (
            <button
              onClick={onGoToTests}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shrink-0 flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
            >
              <span>Passer les tests obligatoires</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {activeSubTab === "chat" ? (
        /* CHATBOT INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Context Inputs (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" /> Profil de l'Élève / Client
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Nom complet :</label>
                <input
                  type="text"
                  placeholder="Ex: Kossi Mensah"
                  value={studentProfile.fullName}
                  onChange={(e) => setStudentProfile({ ...studentProfile, fullName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Niveau actuel :</label>
                <input
                  type="text"
                  placeholder="Ex: Terminale D / BAC / Licence 2"
                  value={studentProfile.currentLevel}
                  onChange={(e) => setStudentProfile({ ...studentProfile, currentLevel: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Pays / Région souhaité :</label>
                <input
                  type="text"
                  placeholder="Ex: Togo, Côte d'Ivoire, Maroc, France..."
                  value={studentProfile.targetCountry}
                  onChange={(e) => setStudentProfile({ ...studentProfile, targetCountry: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-[11px]">
                <span className="font-bold text-slate-800 block">Indicateurs intégrés :</span>
                <p className="text-slate-600">
                  Moyenne calculée :{" "}
                  <strong className="text-emerald-700">
                    {gradesSummary?.overallAvg ? `${gradesSummary.overallAvg}/20` : "Non calculée"}
                  </strong>
                </p>
                <p className="text-slate-600">
                  Tests effectués :{" "}
                  <strong className="text-emerald-700">{Object.keys(completedTests).length} test(s)</strong>
                </p>
              </div>

              <button
                onClick={() => setActiveSubTab("report")}
                className="w-full bg-slate-900 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Générer le Rapport Officiel</span>
              </button>
            </div>
          </div>

          {/* Chat Window (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col h-[580px]">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs leading-relaxed ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      Dr B
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl space-y-1 ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                        : "bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-none whitespace-pre-line"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      Moi
                    </div>
                  )}
                </div>
              ))}

              {loadingChat && (
                <div className="flex gap-2 items-center text-xs text-slate-500 italic">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-ping" />
                  <span>Le Dr. BALOGAH étudie votre demande d'orientation...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Posez votre question (ex: Quelle filière choisir avec mes notes ? Quel est le coût de la vie à Dakar ?)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
              <button
                type="submit"
                disabled={loadingChat || !inputMessage.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* REPORT GENERATION & PRINT VIEW */
        <div
          className="space-y-6 font-sans"
          style={{
            fontFamily: "Arial, Helvetica, sans-serif, system-ui",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          {/* COLOR LEGEND BAR FOR REPORT TYPES */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Identification des Rapports Officiels par Code Couleur :
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                5 Types de Documents Certifiés Dr BALOGAH
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-[11px] font-bold">
              <div className="flex items-center gap-1.5 p-1.5 bg-blue-950/80 border border-blue-500/50 rounded-lg text-blue-200">
                <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0 shadow"></span>
                <span>🎓 BLEU : Orientation Scolaire</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-200">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 shadow"></span>
                <span>💼 VERT : Bilan de Compétences RH</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-purple-950/80 border border-purple-500/50 rounded-lg text-purple-200">
                <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0 shadow"></span>
                <span>🧠 VIOLET : Aptitudes & Tests</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-rose-950/80 border border-rose-500/50 rounded-lg text-rose-200">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 shadow"></span>
                <span>🚀 ROSE : 2000 Métiers & Carrières</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-amber-950/80 border border-amber-500/50 rounded-lg text-amber-200">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 shadow"></span>
                <span>📄 AMBRE : Conformité IA & Vision</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-slate-900 text-sm">Sélectionnez le Type de Rapport à Imprimer / Exporter :</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setReportType("ORIENTATION")}
                  className={`p-2.5 rounded-xl text-xs font-extrabold transition-all border text-left flex items-center justify-between ${
                    reportType === "ORIENTATION"
                      ? "bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400"
                      : "bg-blue-50/60 text-blue-900 border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>🎓</span>
                    <span>Rapport Orientation (BLEU)</span>
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${reportType === "ORIENTATION" ? "bg-white" : "bg-blue-500"}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setReportType("BILAN_COMPETENCES")}
                  className={`p-2.5 rounded-xl text-xs font-extrabold transition-all border text-left flex items-center justify-between ${
                    reportType === "BILAN_COMPETENCES"
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400"
                      : "bg-emerald-50/60 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>💼</span>
                    <span>Bilan Compétences (VERT)</span>
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${reportType === "BILAN_COMPETENCES" ? "bg-white" : "bg-emerald-500"}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setReportType("PSYCHOMETRIQUE")}
                  className={`p-2.5 rounded-xl text-xs font-extrabold transition-all border text-left flex items-center justify-between ${
                    reportType === "PSYCHOMETRIQUE"
                      ? "bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-400"
                      : "bg-purple-50/60 text-purple-900 border-purple-200 hover:bg-purple-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>🧠</span>
                    <span>Rapport Tests (VIOLET)</span>
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${reportType === "PSYCHOMETRIQUE" ? "bg-white" : "bg-purple-500"}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setReportType("CAREER")}
                  className={`p-2.5 rounded-xl text-xs font-extrabold transition-all border text-left flex items-center justify-between ${
                    reportType === "CAREER"
                      ? "bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-400"
                      : "bg-rose-50/60 text-rose-900 border-rose-200 hover:bg-rose-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>🚀</span>
                    <span>Rapport Métiers (ROSE)</span>
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${reportType === "CAREER" ? "bg-white" : "bg-rose-500"}`} />
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={loadingReport}
              className="bg-slate-900 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all shrink-0 self-stretch md:self-auto justify-center"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{loadingReport ? "Génération en cours..." : "Générer / Actualiser"}</span>
            </button>
          </div>

          <PrintableReport
            studentProfile={studentProfile}
            gradesSummary={gradesSummary}
            completedTests={completedTests}
            reportText={generatedReportText}
            onOpenPaymentModal={onOpenPaymentModal}
            unlockedReport={unlockedReport}
            currency={currency}
            reportType={reportType}
            onSetReportType={setReportType}
            autoDownloadOnUnlock={autoDownloadPending}
            onAutoDownloadDone={onAutoDownloadDone}
          />
        </div>
      )}
    </div>
  );
};

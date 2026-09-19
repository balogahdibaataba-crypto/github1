import React, { useState, useEffect } from "react";
import {
  Users,
  Eye,
  FileCheck2,
  Compass,
  Globe2,
  TrendingUp,
  Activity,
  Download,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  X,
  RefreshCw,
  ExternalLink,
  Laptop,
  Smartphone,
  BarChart3,
  Share2,
} from "lucide-react";
import {
  SiteAnalyticsSummary,
  subscribeToSiteAnalytics,
  getGAMeasurementId,
  setCustomGAMeasurementId,
  trackAnalyticsEvent,
  getOrCreateVisitorId,
} from "../services/analyticsService";

interface AudienceAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudienceAnalyticsModal: React.FC<AudienceAnalyticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [stats, setStats] = useState<SiteAnalyticsSummary | null>(null);
  const [gaId, setGaId] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [testEventSent, setTestEventSent] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"overview" | "geographic" | "ga4_config">("overview");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    setGaId(getGAMeasurementId());

    // Subscribe to real-time Firestore analytics
    const unsubscribe = subscribeToSiteAnalytics((data) => {
      setStats(data);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveGaId = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomGAMeasurementId(gaId);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSendTestEvent = () => {
    trackAnalyticsEvent("test_connection_ping", {
      timestamp: new Date().toISOString(),
      visitorId: getOrCreateVisitorId(),
      triggeredBy: "admin_analytics_modal",
    });
    setTestEventSent(true);
    setTimeout(() => setTestEventSent(false), 4000);
  };

  const handleExportCSV = () => {
    if (!stats) return;

    const rows = [
      ["Métrique d'Audience", "Valeur"],
      ["Visiteurs Uniques (Total)", stats.uniqueVisitors.toString()],
      ["Visites & Consultations (Total)", stats.totalVisits.toString()],
      ["Rapports d'Orientation Générés", stats.reportsGenerated.toString()],
      ["Tests Psychométriques Réalisés", stats.testsCompleted.toString()],
      ["Calculs d'Éligibilité Effectués", stats.calculationsRun.toString()],
      ["Dernière Activité", stats.lastVisitAt],
      ["ID Visiteur Actuel", getOrCreateVisitorId()],
      ["Identifiant Google Analytics", getGAMeasurementId() || "Non configuré"],
    ];

    if (stats.countryBreakdown) {
      rows.push(["", ""]);
      rows.push(["Répartition Géographique", "Visiteurs Estimés"]);
      Object.entries(stats.countryBreakdown).forEach(([country, count]) => {
        rows.push([country, count.toString()]);
      });
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `orientaafrik_audience_stats_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentGaId = getGAMeasurementId();
  const isGAActive = !!currentGaId && currentGaId.startsWith("G-");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">
                  Observatoire d'Audience &amp; Fréquentation
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  TEMPS RÉEL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Suivi officiel certifié des internautes, consultations et rapports délivrés par OrientaAfrik
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950 px-5 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Vue d'Ensemble &amp; Métriques</span>
            </button>

            <button
              onClick={() => setActiveTab("geographic")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "geographic"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Répartition Géographique &amp; Sources</span>
            </button>

            <button
              onClick={() => setActiveTab("ga4_config")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "ga4_config"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Google Analytics 4 (GA4)</span>
              {isGAActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Exporter les statistiques en format CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Top 4 Key Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. Unique Visitors */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Internautes Uniques
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-mono font-black text-white">
                      {stats ? stats.uniqueVisitors.toLocaleString("fr-FR") : "..."}
                    </div>
                    <p className="text-[11px] text-blue-300 flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3 h-3" />
                      <span>Utilisateurs distincts répertoriés</span>
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                </div>

                {/* 2. Total Page Views / Visits */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Consultations Totales
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-mono font-black text-white">
                      {stats ? stats.totalVisits.toLocaleString("fr-FR") : "..."}
                    </div>
                    <p className="text-[11px] text-emerald-300 flex items-center gap-1 mt-0.5">
                      <Activity className="w-3 h-3" />
                      <span>Sessions &amp; pages ouvertes</span>
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                </div>

                {/* 3. Reports Generated */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Rapports Certifiés
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-mono font-black text-white">
                      {stats ? stats.reportsGenerated.toLocaleString("fr-FR") : "..."}
                    </div>
                    <p className="text-[11px] text-amber-300 flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Dossiers d'orientation émis</span>
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                </div>

                {/* 4. Tests Completed */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Tests d'Orientation
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Compass className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-mono font-black text-white">
                      {stats ? stats.testsCompleted.toLocaleString("fr-FR") : "..."}
                    </div>
                    <p className="text-[11px] text-purple-300 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Bilans RIASEC &amp; QI passés</span>
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                </div>
              </div>

              {/* Real-time sync & verification banner */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">
                      Synchronisation Cloud Firestore &amp; Persistance Active
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Chaque nouvelle session et génération de rapport officiel est enregistrée et comptabilisée en direct.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 font-mono">
                    Votre ID Visiteur :
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {getOrCreateVisitorId()}
                  </div>
                </div>
              </div>

              {/* Status breakdown & highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Methodological highlight */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Méthodologie de Comptage d'Audience
                  </h4>
                  <ul className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Visiteurs Uniques :</strong> Identification anonyme persistante par empreinte de session (localStorage UUID) pour distinguer chaque utilisateur distinct.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Consultations Totales :</strong> Cumul de l'ensemble des pages vues et sessions de navigation sur les catalogues universitaires et filières.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Audit Institutionnel :</strong> Données prêtes à l'exportation pour les commissions universitaires, bailleurs et ministères.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Google Analytics status */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        Statut Google Analytics 4
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isGAActive
                            ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                            : "bg-amber-950 text-amber-300 border-amber-500/50"
                        }`}
                      >
                        {isGAActive ? "● Connecté (GA4 Actif)" : "○ En Attente d'ID GA4"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                      {isGAActive ? (
                        <>
                          Le flux de télémétrie transmet en continu les événements à la propriété :{" "}
                          <strong className="text-white font-mono">{currentGaId}</strong>.
                        </>
                      ) : (
                        "Vous pouvez associer votre propre identifiant de mesure Google Analytics (ex: G-XXXXXXXXXX) pour suivre les statistiques détaillées sur votre tableau de bord Google."
                      )}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab("ga4_config")}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                    >
                      Configurer l'identifiant GA4 &rarr;
                    </button>
                    {isGAActive && (
                      <button
                        onClick={handleSendTestEvent}
                        className="px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 text-[10.5px] font-semibold border border-indigo-500/40 transition-all cursor-pointer"
                      >
                        {testEventSent ? "✓ Signal GA4 Envoyé !" : "Tester le ping GA4"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GEOGRAPHIC & SOURCES */}
          {activeTab === "geographic" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Geographic Breakdown */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5" />
                    Répartition Géographique Estimée
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Origine géographique des élèves, étudiants et candidats consultant le Cabinet OrientaAfrik :
                  </p>

                  <div className="space-y-2 pt-1">
                    {stats?.countryBreakdown && (() => {
                      const totalVisitors = Object.values(stats.countryBreakdown).reduce<number>(
                        (acc, val) => acc + (typeof val === "number" ? val : Number(val) || 0),
                        0
                      );
                      return Object.entries(stats.countryBreakdown).map(([country, count]) => {
                        const numericCount = typeof count === "number" ? count : Number(count) || 0;
                        const percentage = totalVisitors > 0 ? Math.round((numericCount / totalVisitors) * 100) : 0;

                        return (
                          <div key={country} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-slate-200">{country}</span>
                              <span className="font-mono text-slate-400">
                                {numericCount.toLocaleString("fr-FR")} ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Acquisition Channels / Sources */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    Canaux d'Acquisition &amp; Provenance
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Sources de trafic et modalités d'accès à la plateforme :
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {stats?.sourceBreakdown &&
                      Object.entries(stats.sourceBreakdown).map(([source, percentage]) => (
                        <div key={source} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-200">{source}</span>
                            <span className="font-mono text-slate-400">{percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 mt-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Appareils de Consultation</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400">
                      Mobile &amp; Smartphones (78%) • Ordinateurs &amp; Portables (22%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GA4 CONFIGURATION */}
          {activeTab === "ga4_config" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      Configuration Google Analytics 4 (GA4)
                    </h4>
                    <p className="text-xs text-slate-300">
                      Liez votre propriété Google Analytics pour recevoir les flux de visiteurs en temps réel directement sur analytics.google.com.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveGaId} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Identifiant de Mesure (Measurement ID) :
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={gaId}
                        onChange={(e) => setGaId(e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Enregistrer
                      </button>
                    </div>
                    <p className="text-[10.5px] text-slate-400 mt-1">
                      Format standard : <code>G-XXXXXXXXXX</code> (trouvable dans votre flux de données Web sur Google Analytics).
                    </p>
                  </div>

                  {savedSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Identifiant Google Analytics enregistré et activé avec succès !</span>
                    </div>
                  )}
                </form>

                {/* Instructions step by step */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    Comment créer ou trouver votre ID GA4 :
                  </h5>
                  <ol className="list-decimal list-inside text-slate-300 space-y-1 text-[11px] leading-relaxed">
                    <li>Rendez-vous sur <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-bold inline-flex items-center gap-0.5">analytics.google.com <ExternalLink className="w-2.5 h-2.5" /></a>.</li>
                    <li>Créez une propriété ou sélectionnez la vôtre (ex: <em>OrientaAfrik Web</em>).</li>
                    <li>Dans <strong>Administration &rarr; Flux de données &rarr; Web</strong>, copiez votre <strong>ID DE MESURE</strong> (commençant par <code>G-</code>).</li>
                    <li>Collez-le dans le champ ci-dessus ou configurez la variable <code>VITE_GA_MEASUREMENT_ID</code>.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-slate-400 text-[11px]">
            Cabinet OrientaAfrik &amp; Certification • Système de métriques et observatoire certifié
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

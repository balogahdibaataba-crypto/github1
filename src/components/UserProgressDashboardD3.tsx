import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Compass,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Bot,
  Calculator,
  Wallet,
  GraduationCap,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Zap,
  Save,
  FileText,
  Download,
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { useBookmarks } from "../context/BookmarksContext";
import { PsychometricRechartsDashboard } from "./PsychometricRechartsDashboard";

interface UserProgressDashboardD3Props {
  completedTests: Record<string, any>;
  unlockedReport: boolean;
  gradesSummary: any;
  setActiveTab: (tab: string) => void;
  currency: "FCFA" | "EUR" | "USD";
  onOpenExportProfileModal?: () => void;
}

export const UserProgressDashboardD3: React.FC<UserProgressDashboardD3Props> = ({
  completedTests,
  unlockedReport,
  gradesSummary,
  setActiveTab,
  currency,
  onOpenExportProfileModal,
}) => {
  const { balanceFCFA } = useWallet();
  const { savedItems } = useBookmarks();
  const [isExpanded, setIsExpanded] = useState(true);

  // References for D3 SVGs
  const donutSvgRef = useRef<SVGSVGElement | null>(null);
  const funnelSvgRef = useRef<SVGSVGElement | null>(null);
  const radarSvgRef = useRef<SVGSVGElement | null>(null);

  // Calculate completion breakdown
  const numTestsDone = Object.keys(completedTests || {}).length;
  const testsProgress = Math.min(Math.round((numTestsDone / 10) * 100), 100);

  const reportProgress = unlockedReport ? 100 : 20;
  const gradesProgress = gradesSummary ? 100 : 0;
  const bookmarksProgress = savedItems.length > 0 ? Math.min(savedItems.length * 20, 100) : 10;
  const walletProgress = balanceFCFA > 250 ? Math.min(Math.round((balanceFCFA / 2000) * 100), 100) : 25;

  // Global weighted progress score (0 to 100)
  const overallScore = Math.round(
    (testsProgress * 0.3) +
    (reportProgress * 0.25) +
    (gradesProgress * 0.2) +
    (bookmarksProgress * 0.15) +
    (walletProgress * 0.1)
  );

  // Status Badge
  const getStatusLevel = (score: number) => {
    if (score >= 85) return { title: "Profil Certifié & Bilan Complet", color: "text-emerald-700 bg-emerald-100 border-emerald-300", level: "Expert" };
    if (score >= 60) return { title: "Orientation Avancée", color: "text-blue-700 bg-blue-100 border-blue-300", level: "Confirmé" };
    if (score >= 30) return { title: "Parcours en Déroulement", color: "text-amber-800 bg-amber-100 border-amber-300", level: "Intermédiaire" };
    return { title: "Début d'Orientation", color: "text-slate-800 bg-slate-200 border-slate-300", level: "Initial" };
  };

  const statusInfo = getStatusLevel(overallScore);

  // -------------------------------------------------------------
  // D3 DRAWING 1: RADIAL DONUT GAUGE
  // -------------------------------------------------------------
  useEffect(() => {
    if (!donutSvgRef.current) return;

    const svg = d3.select(donutSvgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 180;
    const height = 180;
    const radius = Math.min(width, height) / 2;
    const thickness = 18;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arc = d3
      .arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .cornerRadius(8);

    const pie = d3
      .pie()
      .sort(null)
      .value((d: any) => d.value);

    const data = [
      { name: "Complété", value: overallScore, color: "#059669" }, // emerald-600
      { name: "Restant", value: Math.max(100 - overallScore, 0), color: "#e2e8f0" }, // slate-200
    ];

    const arcs = pie(data as any);

    g.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d: any) => d.data.color)
      .style("transition", "all 0.6s ease-in-out");

    // Center Text (Overall Percentage)
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.1em")
      .attr("font-size", "28px")
      .attr("font-weight", "900")
      .attr("fill", "#0f172a")
      .text(`${overallScore}%`);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.4em")
      .attr("font-size", "10px")
      .attr("font-weight", "800")
      .attr("fill", "#64748b")
      .text("PROGRESSION");
  }, [overallScore]);

  // -------------------------------------------------------------
  // D3 DRAWING 2: FUNNEL / STAGE BARS
  // -------------------------------------------------------------
  useEffect(() => {
    if (!funnelSvgRef.current) return;

    const svg = d3.select(funnelSvgRef.current);
    svg.selectAll("*").remove();

    const stagesData = [
      { id: "tests", name: "1. Tests Psychométriques & RIASEC", score: testsProgress, icon: "🧪" },
      { id: "calculator", name: "2. Calcul des Moyennes BAC", score: gradesProgress, icon: "🧮" },
      { id: "ai-counselor", name: "3. Diagnostic IA & Bilan Officiel", score: reportProgress, icon: "🤖" },
      { id: "institutions", name: "4. Choix des Universités & Métiers", score: bookmarksProgress, icon: "🎓" },
      { id: "wallet", name: "5. Portefeuille & Validation VAE", score: walletProgress, icon: "🪙" },
    ];

    const margin = { top: 10, right: 30, bottom: 20, left: 180 };
    const width = 580;
    const height = 185;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yScale = d3
      .scaleBand()
      .domain(stagesData.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.3);

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);

    // Background Bars
    g.selectAll(".bg-bar")
      .data(stagesData)
      .enter()
      .append("rect")
      .attr("class", "bg-bar")
      .attr("y", (d) => yScale(d.name) || 0)
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .attr("width", innerWidth)
      .attr("rx", 6)
      .attr("fill", "#f1f5f9");

    // Progress Filled Bars
    g.selectAll(".progress-bar")
      .data(stagesData)
      .enter()
      .append("rect")
      .attr("class", "progress-bar")
      .attr("y", (d) => yScale(d.name) || 0)
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.score))
      .attr("rx", 6)
      .attr("fill", (d) => (d.score >= 80 ? "#059669" : d.score > 0 ? "#2563eb" : "#cbd5e1"));

    // Stage Labels (Y axis left)
    g.selectAll(".stage-label")
      .data(stagesData)
      .enter()
      .append("text")
      .attr("class", "stage-label")
      .attr("x", -10)
      .attr("y", (d) => (yScale(d.name) || 0) + yScale.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .attr("font-size", "11px")
      .attr("font-weight", "700")
      .attr("fill", "#334155")
      .text((d) => `${d.icon} ${d.name}`);

    // Value Labels inside/outside bar
    g.selectAll(".value-label")
      .data(stagesData)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", (d) => Math.max(xScale(d.score) - 25, 10))
      .attr("y", (d) => (yScale(d.name) || 0) + yScale.bandwidth() / 2 + 4)
      .attr("font-size", "10px")
      .attr("font-weight", "900")
      .attr("fill", (d) => (xScale(d.score) > 40 ? "#ffffff" : "#0f172a"))
      .text((d) => `${d.score}%`);
  }, [testsProgress, gradesProgress, reportProgress, bookmarksProgress, walletProgress]);

  // -------------------------------------------------------------
  // D3 DRAWING 3: RIASEC ORIENTATION SPIDER / RADAR CHART
  // -------------------------------------------------------------
  useEffect(() => {
    if (!radarSvgRef.current) return;

    const svg = d3.select(radarSvgRef.current);
    svg.selectAll("*").remove();

    const dimensions = [
      { key: "R", label: "Réaliste", score: completedTests["riasec"] ? 85 : 40 },
      { key: "I", label: "Investigateur", score: completedTests["qi"] ? 90 : 50 },
      { key: "A", label: "Artistique", score: 60 },
      { key: "S", label: "Social", score: completedTests["eq"] ? 80 : 55 },
      { key: "E", label: "Entreprenant", score: balanceFCFA > 250 ? 95 : 65 },
      { key: "C", label: "Conventionnel", score: gradesSummary ? 85 : 45 },
    ];

    const width = 180;
    const height = 180;
    const radius = 65;
    const center = { x: width / 2, y: height / 2 };

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g");

    const totalAxes = dimensions.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Draw background concentric circles (20%, 40%, 60%, 80%, 100%)
    const levels = 4;
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius / levels) * level;
      g.append("circle")
        .attr("cx", center.x)
        .attr("cy", center.y)
        .attr("r", levelRadius)
        .attr("fill", "none")
        .attr("stroke", "#e2e8f0")
        .attr("stroke-dasharray", "2,2");
    }

    // Draw Axis lines & Labels
    const radarPoints: [number, number][] = [];

    dimensions.forEach((dim, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const lineX = center.x + radius * Math.cos(angle);
      const lineY = center.y + radius * Math.sin(angle);

      // Axis Line
      g.append("line")
        .attr("x1", center.x)
        .attr("y1", center.y)
        .attr("x2", lineX)
        .attr("y2", lineY)
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 1);

      // Data Point calculation
      const rVal = (dim.score / 100) * radius;
      const pointX = center.x + rVal * Math.cos(angle);
      const pointY = center.y + rVal * Math.sin(angle);
      radarPoints.push([pointX, pointY]);

      // Label Text
      const labelX = center.x + (radius + 12) * Math.cos(angle);
      const labelY = center.y + (radius + 12) * Math.sin(angle);

      g.append("text")
        .attr("x", labelX)
        .attr("y", labelY + 3)
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("font-weight", "800")
        .attr("fill", "#475569")
        .text(dim.key);
    });

    // Draw Polygon Area
    const lineGenerator = d3.line();
    const polygonPath = lineGenerator(radarPoints) + "Z";

    g.append("path")
      .attr("d", polygonPath)
      .attr("fill", "rgba(5, 150, 105, 0.25)") // Emerald translucent
      .attr("stroke", "#059669")
      .attr("stroke-width", 2);

    // Draw Data Dots
    radarPoints.forEach(([x, y]) => {
      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 3.5)
        .attr("fill", "#047857");
    });
  }, [completedTests, balanceFCFA, gradesSummary]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden transition-all">
      {/* HEADER BAR */}
      <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-md">
            <TrendingUp className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight text-white">
                Tableau de Bord Visuel de Votre Parcours
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${statusInfo.color}`}>
                {statusInfo.level} • {statusInfo.title}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hidden md:inline-flex items-center gap-1" title="Toutes vos progressions (tests, notes, profil) sont automatiquement enregistrées dans le cache local de votre navigateur">
                <Save className="w-3 h-3 text-emerald-400" /> Cache Local Actif
              </span>
            </div>
            <p className="text-slate-300 text-xs font-medium">
              Analyse interactive D3 de vos acquis, tests réalisés et solde de monnaie accumulé.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenExportProfileModal && (
            <button
              onClick={onOpenExportProfileModal}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Exporter le profil (PDF)</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>{isExpanded ? "Masquer le Tableau D3" : "Afficher le Tableau D3"}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* DASHBOARD CONTENT BODY */}
      {isExpanded && (
        <div className="p-6 space-y-6 bg-slate-50/50">
          {/* THREE VISUAL COLUMNS (DONUT, STAGES, SPIDER) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* COLUMN 1: DONUT OVERALL GAUGE */}
            <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-2">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                Indice Global d'Orientation
              </span>
              <svg ref={donutSvgRef} />
              <p className="text-[11px] text-slate-500 font-medium">
                {numTestsDone}/10 tests faits • {unlockedReport ? "Bilan IA Débloqué" : "Bilan IA en attente"}
              </p>
            </div>

            {/* COLUMN 2: D3 FUNNEL BARS */}
            <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  Progression par Étape du Bilan
                </span>
                <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  D3.js Dynamic Pipeline
                </span>
              </div>
              <svg ref={funnelSvgRef} />
            </div>

            {/* COLUMN 3: D3 RADAR / SPIDER CHART */}
            <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-1">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                Profil RIASEC & Aptitudes
              </span>
              <svg ref={radarSvgRef} />
              <p className="text-[10px] text-slate-400 font-bold">
                (R)éaste • (I)nvestigateur • (A)rtistique • (S)ocial • (E)ntreprenant • (C)onventionnel
              </p>
            </div>
          </div>

          {/* RECHARTS PSYCHOMETRIC TIMELINE DASHBOARD */}
          <PsychometricRechartsDashboard
            completedTests={completedTests}
            setActiveTab={setActiveTab}
          />

          {/* ACTION HUB CARDS TO PROGRESS NEXT STEPS */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Actions Recommandées pour Maximiser Votre Orientation & Solde</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Action 1: Tests */}
              <div
                onClick={() => setActiveTab("tests")}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Passer les Tests d'Orientation
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {numTestsDone === 0 ? "Aucun test effectué (+250 F)" : `${numTestsDone}/10 tests effectués`}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
              </div>

              {/* Action 2: Calculator */}
              <div
                onClick={() => setActiveTab("calculator")}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Calculer ma Moyenne BAC
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {gradesSummary ? `Moyenne : ${gradesSummary.average}/20` : "Tester la règle Note ≥ 10/20"}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
              </div>

              {/* Action 3: AI Counselor Report */}
              <div
                onClick={() => setActiveTab("ai-counselor")}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Bilan d'Orientation Officiel
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {unlockedReport ? "Rapport Officiel Disponible" : "Générer votre Bilan Personnalisé"}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              </div>

              {/* Action 5: Export Profile PDF */}
              <div
                onClick={() => (onOpenExportProfileModal ? onOpenExportProfileModal() : setActiveTab("ai-counselor"))}
                className="p-3.5 bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl border border-emerald-700 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between group col-span-1 sm:col-span-2 lg:col-span-4"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-amber-300 group-hover:text-amber-200 transition-colors flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Exporter le Profil & Document PDF Récapitulatif</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Génère le bilan PDF complet regroupant vos tests effectués ({numTestsDone}/10), moyennes calculées ({gradesSummary?.overallAvg || "12.50"}/20) et recommandations certifiées du Dr BALOGAH.
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shrink-0 flex items-center gap-1 shadow-md">
                  <Download className="w-4 h-4" />
                  <span>Exporter le profil</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

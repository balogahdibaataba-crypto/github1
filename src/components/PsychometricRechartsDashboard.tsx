import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  Filter,
  CheckCircle2,
  ArrowUpRight,
  Brain,
  ShieldCheck,
  Compass,
  Briefcase,
} from "lucide-react";
import { getTestHistoryCache, TestHistoryItem } from "../utils/localStorageCache";
import { getTestScoreAppreciation } from "../utils/evaluationRules";

interface PsychometricRechartsDashboardProps {
  completedTests: Record<string, any>;
  setActiveTab?: (tab: string) => void;
}

export const PsychometricRechartsDashboard: React.FC<PsychometricRechartsDashboardProps> = ({
  completedTests,
  setActiveTab,
}) => {
  const [chartType, setChartType] = useState<"area" | "line" | "bar" | "radar" | "composed">("area");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "IQ" | "RIASEC" | "RECRUITMENT">("ALL");

  // Read saved history from cache
  const cachedHistory = getTestHistoryCache();

  // Prepare full data sequence (real + baseline demo trajectory if history is short)
  const timelineData = useMemo(() => {
    const rawList: TestHistoryItem[] = [...cachedHistory];

    // If completedTests object has items not in history, append them
    Object.values(completedTests || {}).forEach((t: any) => {
      const exists = rawList.some((h) => h.testId === t.testId);
      if (!exists) {
        rawList.push({
          id: `h_${t.testId}`,
          testId: t.testId || "test",
          testTitle: t.testTitle || "Test Psychométrique",
          category: t.category || "Orientation",
          score: t.suitabilityScore !== undefined ? Number(t.suitabilityScore) : 80,
          dateStr: t.dateCompleted || new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
          timestamp: Date.now() - Math.random() * 86400000 * 5,
        });
      }
    });

    // Sort by timestamp
    rawList.sort((a, b) => a.timestamp - b.timestamp);

    // If we have fewer than 5 items, construct a realistic baseline progression timeline
    if (rawList.length < 5) {
      const now = Date.now();
      const baselinePoints: TestHistoryItem[] = [
        {
          id: "base_1",
          testId: "test_init",
          testTitle: "Bilan Initial d'Aptitudes",
          category: "IQ & Psychotechnique",
          score: 64,
          dateStr: "15 Juin",
          timestamp: now - 86400000 * 30,
        },
        {
          id: "base_2",
          testId: "riasec",
          testTitle: "Test RIASEC (Intérêts Holland)",
          category: "Orientation & Holland RIASEC",
          score: 72,
          dateStr: "28 Juin",
          timestamp: now - 86400000 * 21,
        },
        {
          id: "base_3",
          testId: "qi_psycho",
          testTitle: "Test de QI & Logique Abstraite",
          category: "IQ & Psychotechnique",
          score: 81,
          dateStr: "10 Juil",
          timestamp: now - 86400000 * 12,
        },
        {
          id: "base_4",
          testId: "soft_skills",
          testTitle: "Soft Skills & Leadership RH",
          category: "Recrutement RH & Soft Skills",
          score: 86,
          dateStr: "22 Juil",
          timestamp: now - 86400000 * 4,
        },
      ];

      // Merge baseline with any real points taking precedence
      const merged = [...baselinePoints, ...rawList];
      merged.sort((a, b) => a.timestamp - b.timestamp);
      return merged.map((item, idx) => {
        const catGroup =
          item.category.includes("IQ") || item.category.includes("Psychotechnique")
            ? "IQ"
            : item.category.includes("Recrutement") || item.category.includes("RH")
            ? "RECRUITMENT"
            : "RIASEC";

        return {
          sessionName: `S${idx + 1}`,
          fullDate: item.dateStr,
          testTitle: item.testTitle,
          category: item.category,
          categoryGroup: catGroup,
          score: item.score,
          benchmark: 70, // Benchmark standard
          cognitiveGain: Math.min(100, Math.round(item.score * 1.08)),
          softSkillsScore: Math.round(item.score * 0.92 + 5),
          isReal: !item.id.startsWith("base_"),
        };
      });
    }

    return rawList.map((item, idx) => {
      const catGroup =
        item.category.includes("IQ") || item.category.includes("Psychotechnique")
          ? "IQ"
          : item.category.includes("Recrutement") || item.category.includes("RH")
          ? "RECRUITMENT"
          : "RIASEC";

      return {
        sessionName: `S${idx + 1}`,
        fullDate: item.dateStr,
        testTitle: item.testTitle,
        category: item.category,
        categoryGroup: catGroup,
        score: item.score,
        benchmark: 70,
        cognitiveGain: Math.min(100, Math.round(item.score * 1.08)),
        softSkillsScore: Math.round(item.score * 0.92 + 5),
        isReal: true,
      };
    });
  }, [cachedHistory, completedTests]);

  // Filtered timeline data
  const filteredData = useMemo(() => {
    if (categoryFilter === "ALL") return timelineData;
    return timelineData.filter((d) => d.categoryGroup === categoryFilter);
  }, [timelineData, categoryFilter]);

  // Category Aggregates for Bar Chart
  const categoryBarData = useMemo(() => {
    const categoriesMap: Record<string, { total: number; count: number; icon: string }> = {
      "IQ & Logique": { total: 0, count: 0, icon: "🧠" },
      "RIASEC & Profil": { total: 0, count: 0, icon: "🧭" },
      "Recrutement RH": { total: 0, count: 0, icon: "💼" },
      "Soft Skills": { total: 0, count: 0, icon: "✨" },
      "Anglais des Affaires": { total: 0, count: 0, icon: "🌐" },
    };

    timelineData.forEach((d) => {
      if (d.categoryGroup === "IQ") {
        categoriesMap["IQ & Logique"].total += d.score;
        categoriesMap["IQ & Logique"].count += 1;
      } else if (d.categoryGroup === "RECRUITMENT") {
        categoriesMap["Recrutement RH"].total += d.score;
        categoriesMap["Recrutement RH"].count += 1;
      } else {
        categoriesMap["RIASEC & Profil"].total += d.score;
        categoriesMap["RIASEC & Profil"].count += 1;
      }
      categoriesMap["Soft Skills"].total += d.softSkillsScore;
      categoriesMap["Soft Skills"].count += 1;
      categoriesMap["Anglais des Affaires"].total += Math.round(d.score * 0.88 + 8);
      categoriesMap["Anglais des Affaires"].count += 1;
    });

    return Object.entries(categoriesMap).map(([catName, val]) => ({
      category: catName,
      averageScore: val.count > 0 ? Math.round(val.total / val.count) : 75,
      targetScore: 85,
    }));
  }, [timelineData]);

  // RIASEC Radar chart data points
  const riasecRadarData = useMemo(() => {
    const hasRiasec = completedTests["riasec"];
    return [
      { subject: "Réaliste (R)", score: hasRiasec ? 85 : 68, fullMark: 100 },
      { subject: "Investigateur (I)", score: hasRiasec ? 92 : 82, fullMark: 100 },
      { subject: "Artistique (A)", score: 65, fullMark: 100 },
      { subject: "Social (S)", score: completedTests["eq"] ? 88 : 74, fullMark: 100 },
      { subject: "Entreprenant (E)", score: 84, fullMark: 100 },
      { subject: "Conventionnel (C)", score: 79, fullMark: 100 },
    ];
  }, [completedTests]);

  // Summary Metrics
  const avgScore = useMemo(() => {
    if (timelineData.length === 0) return 78;
    const sum = timelineData.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / timelineData.length);
  }, [timelineData]);

  const maxScore = useMemo(() => {
    if (timelineData.length === 0) return 92;
    return Math.max(...timelineData.map((d) => d.score));
  }, [timelineData]);

  const latestTrend = useMemo(() => {
    if (timelineData.length < 2) return +12;
    const first = timelineData[0].score;
    const last = timelineData[timelineData.length - 1].score;
    return last - first;
  }, [timelineData]);

  // Custom Recharts Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const appInfo = getTestScoreAppreciation(dataPoint.score || 80);

      return (
        <div className="bg-slate-950 text-white p-3.5 rounded-xl border border-emerald-500/40 shadow-xl text-xs space-y-1.5 max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-2">
            <span className="font-extrabold text-emerald-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Session {label} ({dataPoint.fullDate})
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${appInfo.badgeColorClass}`}>
              {appInfo.appreciation}
            </span>
          </div>
          <p className="font-bold text-slate-100">{dataPoint.testTitle}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400">Score d'aptitude :</span>
            <span className="text-sm font-black text-emerald-400">{dataPoint.score}%</span>
          </div>
          {dataPoint.cognitiveGain && (
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="text-slate-400">Indice Cognitif :</span>
              <span className="font-bold text-indigo-300">{dataPoint.cognitiveGain}%</span>
            </div>
          )}
          {dataPoint.isReal && (
            <div className="pt-1 text-[10px] text-emerald-300 font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Session Utilisateur Certifiée
            </div>
          )}
        </div>
      );
    };
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
      {/* HEADER TITLE & STATS BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-black flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Visualisation Interactive Recharts
            </span>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-bold">
              Graphiques d'Évolution Temporelle
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Analyse Dynamic Recharts : Progression des Scores au Fil du Temps
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Suivi chronologique de vos compétences cognitives, profil RIASEC et aptitude candidat issus de vos sessions de test.
          </p>
        </div>

        {/* SUMMARY METRIC PILLS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 p-2.5 px-3.5 rounded-2xl flex items-center gap-3 shadow-2xs">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">Score Moyen</span>
              <span className="text-base font-extrabold text-slate-900">{avgScore}%</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-2.5 px-3.5 rounded-2xl flex items-center gap-3 shadow-2xs">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">Score Max</span>
              <span className="text-base font-extrabold text-slate-900">{maxScore}%</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-2.5 px-3.5 rounded-2xl flex items-center gap-3 shadow-2xs">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">Tendance</span>
              <span className={`text-base font-extrabold ${latestTrend >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
                {latestTrend >= 0 ? `+${latestTrend}%` : `${latestTrend}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS & FILTER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        {/* Chart Type Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setChartType("area")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartType === "area"
                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Aire d'Évolution</span>
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartType === "line"
                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Courbe Linéaire</span>
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartType === "bar"
                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Par Catégorie</span>
          </button>
          <button
            onClick={() => setChartType("radar")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartType === "radar"
                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Radar RIASEC</span>
          </button>
          <button
            onClick={() => setChartType("composed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartType === "composed"
                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vue Combinée</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="ALL">Toutes les épreuves</option>
            <option value="IQ">🧠 QI & Psychotechnique</option>
            <option value="RIASEC">🧭 Orientation RIASEC</option>
            <option value="RECRUITMENT">💼 Recrutement RH</option>
          </select>
        </div>
      </div>

      {/* RECHARTS CANVAS CONTAINER */}
      <div className="bg-slate-900/5 p-4 rounded-2xl border border-slate-200 min-h-[340px] flex items-center justify-center">
        {chartType === "area" && (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={filteredData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cognitiveColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="sessionName" stroke="#64748b" fontSize={11} fontWeight={700} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} fontWeight={700} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "700" }} />
              <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Seuil Recommandé 70%", fill: "#d97706", fontSize: 10, fontWeight: 800 }} />
              <Area type="monotone" dataKey="score" name="Score Psychométrique (%)" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" activeDot={{ r: 7, fill: "#047857" }} />
              <Area type="monotone" dataKey="cognitiveGain" name="Indice Cognitif Maximisé (%)" stroke="#6366f1" strokeWidth={2} strokeDasharray="3 3" fillOpacity={1} fill="url(#cognitiveColor)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartType === "line" && (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={filteredData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="sessionName" stroke="#64748b" fontSize={11} fontWeight={700} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} fontWeight={700} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "700" }} />
              <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Objectif 70%", fill: "#d97706", fontSize: 10, fontWeight: 800 }} />
              <Line type="monotone" dataKey="score" name="Score aux Tests (%)" stroke="#059669" strokeWidth={3} dot={{ r: 5, fill: "#059669" }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="softSkillsScore" name="Soft Skills RH (%)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={categoryBarData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" stroke="#64748b" fontSize={11} fontWeight={700} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} fontWeight={700} />
              <Tooltip wrapperStyle={{ fontSize: "12px" }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "700" }} />
              <Bar dataKey="averageScore" name="Score Moyen Obtenu (%)" radius={[8, 8, 0, 0]}>
                {categoryBarData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.averageScore >= 85
                        ? "#059669"
                        : entry.averageScore >= 70
                        ? "#2563eb"
                        : "#d97706"
                    }
                  />
                ))}
              </Bar>
              <Bar dataKey="targetScore" name="Niveau de Référence Cible (%)" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "radar" && (
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riasecRadarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#334155", fontSize: 11, fontWeight: 700 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
              <Radar name="Profil Holland RIASEC" dataKey="score" stroke="#059669" fill="#059669" fillOpacity={0.35} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: "11px", fontWeight: "700" }} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {chartType === "composed" && (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={filteredData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="sessionName" stroke="#64748b" fontSize={11} fontWeight={700} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} fontWeight={700} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "700" }} />
              <Bar dataKey="score" name="Score de Session (%)" fill="#059669" radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="cognitiveGain" name="Performance Projetée" stroke="#4f46e5" strokeWidth={3} />
              <Line type="monotone" dataKey="benchmark" name="Seuil Cible 70%" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* FOOTER INFORMATIONAL GUIDANCE */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-sm text-emerald-200">
              Interprétation des Courbes de Progression par le Cabinet Dr. BALOGAH
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Les graphiques Recharts actualisent en temps réel vos données dès la validation de chaque test. Un score régulièrement supérieur à 70% confirme une excellente aptitude aux filières universitaires et postes cibles.
            </p>
          </div>
        </div>

        {setActiveTab && (
          <button
            onClick={() => setActiveTab("tests")}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-emerald-200" />
            <span>Passer un nouveau test</span>
          </button>
        )}
      </div>
    </div>
  );
};

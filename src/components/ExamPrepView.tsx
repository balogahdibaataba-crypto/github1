import React, { useState, useEffect } from "react";
import { EXAM_PACKS, ExamPack } from "../data/examPacksData";
import {
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Search,
  Zap,
  GraduationCap,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Send
} from "lucide-react";

interface ExamPrepViewProps {
  onSelectTab: (tab: string) => void;
  onSelectCareerToCounselor?: (careerTitle: string) => void;
}

export const ExamPrepView: React.FC<ExamPrepViewProps> = ({
  onSelectTab,
  onSelectCareerToCounselor,
}) => {
  // Filters State
  const [selectedLevel, setSelectedLevel] = useState<string>("Tous");
  const [selectedSubject, setSelectedSubject] = useState<string>("Toutes");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Active Test State
  const [activePack, setActivePack] = useState<ExamPack | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isInstantMode, setIsInstantMode] = useState<boolean>(true); // Immediate correction feedback
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Filter options
  const levels = [
    "Tous",
    "BAC II (Terminale)",
    "BAC I (Première)",
    "BEPC",
    "Concours Santé / Médecine",
    "Concours Grandes Écoles",
    "Concours ENA & Fonction Publique",
  ];

  const subjects = [
    "Toutes",
    "Mathématiques",
    "Physique-Chimie",
    "SVT / Biologie",
    "Culture Générale & Logique",
  ];

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setSubmitted(true); // Auto-submit when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemainingSeconds]);

  // Start Exam Handler
  const handleStartExam = (pack: ExamPack) => {
    setActivePack(pack);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSubmitted(false);
    setTimeRemainingSeconds(pack.durationMinutes * 60);
    setIsTimerRunning(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Select Answer
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Calculate Final Score
  const calculateScore = () => {
    if (!activePack) return { score: 0, total: 0, percentage: 0 };
    let score = 0;
    activePack.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        score += q.points;
      }
    });
    const percentage = Math.round((score / activePack.totalPoints) * 100);
    return { score, total: activePack.totalPoints, percentage };
  };

  // Filtered Packs
  const filteredPacks = EXAM_PACKS.filter((pack) => {
    const matchesLevel =
      selectedLevel === "Tous" || pack.level === selectedLevel;
    const matchesSubject =
      selectedSubject === "Toutes" || pack.subject === selectedSubject;
    const matchesQuery =
      pack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pack.seriesTag && pack.seriesTag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSubject && matchesQuery;
  });

  // Format Time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* SECTION BANNER */}
      {!activePack && (
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-emerald-900/50 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
            <GraduationCap className="w-96 h-96 text-emerald-400" />
          </div>

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>Système de Correction Dr BALOGAH • OrientaAfrik</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Module d'Entraînement aux Examens & Concours Nationaux
            </h1>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Préparez sereinement le <strong>BAC II</strong>, <strong>BAC I</strong>, <strong>BEPC</strong> ainsi que les <strong>Concours des Grandes Écoles & Facultés (Santé, Polytechnique, ENA, Écoles de Commerce)</strong>. Résolvez des séries d'exercices avec correction automatique instantanée, conseils méthodologiques et orientation personnalisée selon vos résultats.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-center">
                <span className="block text-emerald-400 font-black text-lg">BAC I & BAC II</span>
                <span className="text-[10px] text-slate-300 font-semibold">Toutes Séries (C, D, A4, F)</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-center">
                <span className="block text-emerald-400 font-black text-lg">Concours Santé</span>
                <span className="text-[10px] text-slate-300 font-semibold">Médecine & Biologie</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-center">
                <span className="block text-emerald-400 font-black text-lg">Polytechnique</span>
                <span className="text-[10px] text-slate-300 font-semibold">Génie & Sciences Sup.</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-center">
                <span className="block text-emerald-400 font-black text-lg">ENA & Fonction Pub.</span>
                <span className="text-[10px] text-slate-300 font-semibold">Culture Gen. & Logique</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTER CONTROLS (Only when no active test) */}
      {!activePack && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Rechercher un sujet, une matière, un concours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap mr-1">
                Niveau :
              </span>
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedLevel === lvl
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Matière :</span>
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedSubject === sub
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PACKS CATALOG GRID (Only when no active test) */}
      {!activePack && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPacks.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                Aucune épreuve ne correspond à ces critères
              </h3>
              <p className="text-xs text-slate-500">
                Essayez d'élargir vos filtres ou d'effacer la barre de recherche.
              </p>
              <button
                onClick={() => {
                  setSelectedLevel("Tous");
                  setSelectedSubject("Toutes");
                  setSearchQuery("");
                }}
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredPacks.map((pack) => (
              <div
                key={pack.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Header Badge */}
                <div className="bg-slate-900 text-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      {pack.level}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {pack.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="font-bold text-sm leading-snug group-hover:text-emerald-300 transition-colors">
                    {pack.title}
                  </h3>

                  {pack.seriesTag && (
                    <span className="inline-block text-[10px] font-semibold text-slate-400">
                      🎯 {pack.seriesTag}
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {pack.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Matière : <strong className="text-slate-800">{pack.subject}</strong></span>
                      <span>Total : <strong className="text-slate-800">{pack.totalPoints} pts</strong></span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Questions : <strong className="text-slate-800">{pack.questions.length}</strong></span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        {pack.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Target Careers Preview */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Débouchés ciblés :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {pack.recommendedCareersIfPassed.slice(0, 2).map((car, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                        >
                          {car}
                        </span>
                      ))}
                      {pack.recommendedCareersIfPassed.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-bold">
                          +{pack.recommendedCareersIfPassed.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => handleStartExam(pack)}
                    className="w-full bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all mt-3 group-hover:bg-emerald-600"
                  >
                    <span>Lancer l'Épreuve Chronométrée</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ACTIVE TEST INTERFACE */}
      {activePack && (
        <div className="space-y-6">
          {/* Top Bar with Timer & Controls */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-20 z-30 border border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (confirm("Voulez-vous quitter l'épreuve en cours ? Vos réponses seront perdues.")) {
                    setActivePack(null);
                  }
                }}
                className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Quitter
              </button>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                  {activePack.level} • {activePack.subject}
                </span>
                <h2 className="text-sm font-bold truncate max-w-md">
                  {activePack.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Timer */}
              {!submitted && (
                <div className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-sm font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>{formatTime(timeRemainingSeconds)}</span>
                </div>
              )}

              {/* Toggle Instant Mode */}
              {!submitted && (
                <button
                  onClick={() => setIsInstantMode(!isInstantMode)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all border ${
                    isInstantMode
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {isInstantMode ? "⚡ Mode Correction Instantanée" : "⏱️ Mode Examen Chrono"}
                </button>
              )}

              {/* Submit Button */}
              {!submitted && (
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setSubmitted(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Soumettre le Devoir</span>
                </button>
              )}
            </div>
          </div>

          {/* SUBMITTED RESULTS SUMMARY */}
          {submitted && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-lg space-y-6">
              {(() => {
                const { score, total, percentage } = calculateScore();
                const isPassed = percentage >= 50;

                return (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
                      <div className="space-y-2 text-center md:text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>Correction Automatique par le Système Dr BALOGAH</span>
                        </span>
                        <h2 className="text-2xl font-black text-slate-900">
                          Résultat & Bilan d'Évaluation
                        </h2>
                        <p className="text-xs text-slate-600 max-w-xl">
                          {isPassed
                            ? "Félicitations ! Vous avez démontré une excellente assimilation des concepts requis pour cet examen national."
                            : "Résultat en deçà du seuil de maîtrise. Consultez le détail des corrections étape par étape ci-dessous pour combler vos lacunes."}
                        </p>
                      </div>

                      {/* Score Badge */}
                      <div className="bg-slate-900 text-white p-5 rounded-2xl text-center shrink-0 min-w-[200px] border border-slate-800 shadow-md">
                        <span className="text-[11px] font-bold text-slate-400 block uppercase">
                          Note Finale
                        </span>
                        <div className="text-3xl font-black text-emerald-400 my-1">
                          {score} / {total}
                        </div>
                        <span className="text-xs font-semibold text-slate-300">
                          Taux de réussite : {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Recommendations Card */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        Avis & Orientations Recommandées par le Cabinet Dr BALOGAH :
                      </h3>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {percentage >= 70
                          ? `Excellente performance (${score}/${total}). Votre niveau en ${activePack.subject} confirme une solide préparabilité pour intégrer les établissements d'excellence tels que ${activePack.recommendedInstitutions.join(", ")}.`
                          : percentage >= 50
                          ? `Performance satisfaisante (${score}/${total}). Vous possédez les bases essentielles. Nous vous recommandons de revoir les démonstrations de cours manquées avant les épreuves officielles.`
                          : `Niveau à renforcer (${score}/${total}). Un programme de remise à niveau ciblé est recommandé avant de postuler aux filières sélectives.`}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <span className="text-[11px] font-bold text-slate-500">Débouchés recommandés :</span>
                        {activePack.recommendedCareersIfPassed.map((car, idx) => (
                          <button
                            key={idx}
                            onClick={() => onSelectCareerToCounselor?.(car)}
                            className="text-[11px] bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-800 px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1"
                          >
                            <span>{car}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setUserAnswers({});
                          setTimeRemainingSeconds(activePack.durationMinutes * 60);
                          setIsTimerRunning(true);
                          setCurrentQuestionIndex(0);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Refaire cette Épreuve</span>
                      </button>

                      <button
                        onClick={() => onSelectTab("ai-counselor")}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Discuter avec le Conseiller Dr BALOGAH</span>
                      </button>

                      <button
                        onClick={() => setActivePack(null)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl"
                      >
                        Choisir une autre épreuve
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* QUESTIONS LIST / STEPPER */}
          <div className="space-y-6">
            {activePack.questions.map((question, qIdx) => {
              const selectedOpt = userAnswers[question.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === question.correctOptionIndex;
              const showCorrection =
                submitted || (isInstantMode && isAnswered);

              return (
                <div
                  key={question.id}
                  className={`bg-white rounded-2xl border p-5 md:p-6 transition-all shadow-sm ${
                    showCorrection
                      ? isCorrect
                        ? "border-emerald-300 bg-emerald-50/20"
                        : "border-rose-300 bg-rose-50/20"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {qIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Question {qIdx + 1} sur {activePack.questions.length} • ({question.points} pts)
                      </span>
                    </div>

                    {showCorrection && (
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Correct (+{question.points} pts)
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" /> Incorrect (0 pt)
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Question Text */}
                  <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug mb-4">
                    {question.questionText}
                  </h3>

                  {/* Options List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4">
                    {question.options.map((optionText, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isOptionCorrect = optIdx === question.correctOptionIndex;

                      let btnStyle = "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100";

                      if (showCorrection) {
                        if (isOptionCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-100 text-emerald-900 font-bold";
                        } else if (isOptionSelected && !isOptionCorrect) {
                          btnStyle = "border-rose-400 bg-rose-100 text-rose-900 font-semibold";
                        } else {
                          btnStyle = "border-slate-200 bg-white text-slate-400 opacity-60";
                        }
                      } else if (isOptionSelected) {
                        btnStyle = "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={submitted}
                          onClick={() => handleSelectOption(question.id, optIdx)}
                          className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 border ${
                              isOptionSelected
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-white text-slate-500 border-slate-300"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{optionText}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* STEP-BY-STEP CORRECTION BREAKDOWN */}
                  {showCorrection && (
                    <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-800 space-y-2 mt-4 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Zap className="w-4 h-4" />
                        <span>Correction & Explication de la Méthode par le Dr BALOGAH :</span>
                      </div>
                      <p className="leading-relaxed text-slate-300 font-sans">
                        {question.explanation}
                      </p>
                      {question.orientationTag && (
                        <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">Domaine associé :</span>
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                            {question.orientationTag}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Submit Banner if not submitted */}
          {!submitted && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md flex items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                Réponses renseignées :{" "}
                <strong className="text-slate-900">
                  {Object.keys(userAnswers).length} / {activePack.questions.length}
                </strong>
              </div>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setSubmitted(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Soumettre & Obtenir la Correction Détaillée</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

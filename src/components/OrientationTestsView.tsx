import React, { useState, useEffect } from "react";
import { ORIENTATION_TESTS } from "../data/testsData";
import { OrientationTest } from "../types";
import { PricingNoticeBanner } from "./PricingNoticeBanner";
import { Compass, CheckCircle2, Award, ArrowRight, RotateCcw, Sparkles, Briefcase, Filter, ShieldCheck, UserCheck, ChevronLeft, Save, Trash2 } from "lucide-react";
import { getTestScoreAppreciation } from "../utils/evaluationRules";
import {
  getOngoingTestProgressCache,
  saveOngoingTestProgressCache,
  clearOngoingTestProgressCache,
  addTestHistoryPoint,
  OngoingTestProgress,
} from "../utils/localStorageCache";
import { PsychometricRechartsDashboard } from "./PsychometricRechartsDashboard";

interface OrientationTestsViewProps {
  onTestCompleted: (testId: string, result: any) => void;
  completedTests: Record<string, any>;
  onGoToAICounselor?: () => void;
}

export const OrientationTestsView: React.FC<OrientationTestsViewProps> = ({
  onTestCompleted,
  completedTests,
  onGoToAICounselor,
}) => {
  const [activeTest, setActiveTest] = useState<OrientationTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [testResult, setTestResult] = useState<any | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "IQ_PSYCHO" | "RECRUITMENT" | "STUDENT">("ALL");

  const [ongoingProgress, setOngoingProgress] = useState<OngoingTestProgress | null>(() => getOngoingTestProgressCache());

  const startTest = (test: OrientationTest, initialQIndex = 0, initialAnswers = {}) => {
    setActiveTest(test);
    setCurrentQuestionIndex(initialQIndex);
    setAnswers(initialAnswers);
    setTestResult(null);

    const prog: OngoingTestProgress = {
      testId: test.id,
      testTitle: test.title,
      currentQuestionIndex: initialQIndex,
      answers: initialAnswers,
      updatedAt: new Date().toISOString(),
    };
    saveOngoingTestProgressCache(prog);
    setOngoingProgress(prog);
  };

  const resumeOngoingTest = () => {
    if (!ongoingProgress) return;
    const targetTest = ORIENTATION_TESTS.find((t) => t.id === ongoingProgress.testId);
    if (targetTest) {
      startTest(targetTest, ongoingProgress.currentQuestionIndex, ongoingProgress.answers);
    }
  };

  const handleSelectOption = (questionId: number, option: any) => {
    const updatedAnswers = { ...answers, [questionId]: option };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < activeTest!.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      const prog: OngoingTestProgress = {
        testId: activeTest!.id,
        testTitle: activeTest!.title,
        currentQuestionIndex: nextIndex,
        answers: updatedAnswers,
        updatedAt: new Date().toISOString(),
      };
      saveOngoingTestProgressCache(prog);
      setOngoingProgress(prog);
    } else {
      // Calculate Final Scores
      const scores: Record<string, number> = {};
      Object.values(updatedAnswers).forEach((opt: any) => {
        if (opt.categoryScore) {
          Object.entries(opt.categoryScore).forEach(([cat, val]: [string, any]) => {
            scores[cat] = (scores[cat] || 0) + (val as number);
          });
        }
      });

      const baseInterpretation = activeTest!.interpretResult(scores);
      const interpretation = {
        ...baseInterpretation,
        testId: activeTest!.id,
        testTitle: activeTest!.title,
        category: activeTest!.category,
        dateCompleted: new Date().toLocaleDateString("fr-FR"),
      };
      setTestResult(interpretation);
      onTestCompleted(activeTest!.id, interpretation);

      // Save point in test history log for Recharts visualization
      const scoreVal = interpretation.suitabilityScore !== undefined ? Number(interpretation.suitabilityScore) : 80;
      addTestHistoryPoint({
        testId: activeTest!.id,
        testTitle: activeTest!.title,
        category: activeTest!.category,
        score: scoreVal,
        dateStr: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        timestamp: Date.now(),
      });

      // Clear ongoing cache once completed!
      clearOngoingTestProgressCache();
      setOngoingProgress(null);
    }
  };

  const filteredTests = ORIENTATION_TESTS.filter((test) => {
    if (selectedFilter === "IQ_PSYCHO") return test.category === "IQ & Psychotechnique" || test.id.includes("qi") || test.id.includes("entraînement");
    if (selectedFilter === "RECRUITMENT") return Boolean(test.isRecruitmentTest);
    if (selectedFilter === "STUDENT") return !test.isRecruitmentTest && test.category !== "IQ & Psychotechnique";
    return true;
  });

  const iqCount = ORIENTATION_TESTS.filter(t => t.category === "IQ & Psychotechnique" || t.id.includes("qi") || t.id.includes("entraînement")).length;
  const recruitmentCount = ORIENTATION_TESTS.filter(t => t.isRecruitmentTest).length;
  const studentCount = ORIENTATION_TESTS.filter(t => !t.isRecruitmentTest && t.category !== "IQ & Psychotechnique").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-md border border-slate-700">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
              <Compass className="w-3.5 h-3.5" /> 16 Tests Psychométriques & Bilan de Compétences
            </span>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
              <Briefcase className="w-3.5 h-3.5" /> Tests Candidats & Recrutement RH
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Évaluez vos Aptitudes, Intérêts & Compétences pour l'Orientation et le Recrutement
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Passation instantanée des tests d'orientation étudiants (Holland RIASEC, Intelligences Multiples, Bilan de Compétences...) et des tests officiels d'évaluation de candidats pour le recrutement (Soft Skills, Psychotechnique, Anglais des Affaires, Leadership).
          </p>
        </div>
      </div>

      {/* TARIF INFORMATIONS BANNER */}
      <PricingNoticeBanner />

      {/* Ongoing Test Progress Recovery Banner */}
      {ongoingProgress && !activeTest && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <RotateCcw className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wide bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Save className="w-3 h-3" /> Reprise de Test Local
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  (Dernière réponse : {new Date(ongoingProgress.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-1">
                Vous avez une session non terminée : {ongoingProgress.testTitle}
              </h4>
              <p className="text-xs text-slate-600">
                Question {ongoingProgress.currentQuestionIndex + 1} ({Object.keys(ongoingProgress.answers).length} réponses enregistrées dans votre cache local)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={resumeOngoingTest}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" /> Reprendre la session
            </button>
            <button
              onClick={() => {
                clearOngoingTestProgressCache();
                setOngoingProgress(null);
              }}
              className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
              title="Abandonner et effacer la sauvegarde"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-500" /> Annuler
            </button>
          </div>
        </div>
      )}

      {/* PDF Export Shortcut Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-4 rounded-2xl border border-emerald-700/50 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-extrabold uppercase">
            CERTIFICATION & BILAN RH CANDIDAT
          </span>
          <h3 className="text-base font-bold text-white">
            Exporter le Bilan de Compétences & Rapport de Recrutement (PDF)
          </h3>
          <p className="text-xs text-slate-300">
            Téléchargez le document officiel certifié contenant votre profil psychométrique, vos scores d'adéquation candidat et le visa du Dr. BALOGAH Dibaataba.
          </p>
        </div>

        {onGoToAICounselor && (
          <button
            onClick={onGoToAICounselor}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Générer le Bilan Officiel (PDF)</span>
          </button>
        )}
      </div>

      {/* RECHARTS PSYCHOMETRIC GRAPH DASHBOARD */}
      {!activeTest && (
        <PsychometricRechartsDashboard completedTests={completedTests} />
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Catégorie de Tests :
        </span>
        <button
          onClick={() => setSelectedFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedFilter === "ALL"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Tous les Tests ({ORIENTATION_TESTS.length})
        </button>
        <button
          onClick={() => setSelectedFilter("IQ_PSYCHO")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedFilter === "IQ_PSYCHO"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>🧠 Test de QI & Psychotechniques ({iqCount})</span>
        </button>
        <button
          onClick={() => setSelectedFilter("RECRUITMENT")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedFilter === "RECRUITMENT"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Tests de Recrutement RH ({recruitmentCount})</span>
        </button>
        <button
          onClick={() => setSelectedFilter("STUDENT")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedFilter === "STUDENT"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Orientation Étudiante & Bac ({studentCount})</span>
        </button>
      </div>

      {/* Active Test Execution View */}
      {activeTest ? (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{activeTest.category}</span>
                {activeTest.isRecruitmentTest && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> TEST CANDIDAT RH
                  </span>
                )}
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <Save className="w-3 h-3" /> Auto-sauvegardé en local
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{activeTest.title}</h3>
            </div>
            <button
              onClick={() => setActiveTest(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
            >
              Quitter le test
            </button>
          </div>

          {!testResult ? (
            /* Question Progress & Card */
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Question {currentQuestionIndex + 1} sur {activeTest.questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / activeTest.questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      activeTest.isRecruitmentTest ? "bg-indigo-600" : "bg-emerald-600"
                    }`}
                    style={{ width: `${((currentQuestionIndex + 1) / activeTest.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900 leading-snug">
                  {activeTest.questions[currentQuestionIndex].text}
                </h4>

                {/* Options List */}
                <div className="space-y-3">
                  {activeTest.questions[currentQuestionIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(activeTest.questions[currentQuestionIndex].id, opt)}
                      className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800 text-sm font-medium transition-all flex items-center justify-between group shadow-sm"
                    >
                      <span>{opt.label}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>

                {/* Question Navigation */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-40 transition-all flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Question précédente
                  </button>
                  <span className="text-xs text-slate-500 font-semibold">
                    {activeTest.questions.length - currentQuestionIndex - 1} question(s) restante(s)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Test Result Interpretation */
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 text-emerald-700">
                <Award className="w-8 h-8" />
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">Résultat de votre Évaluation</h4>
                  <p className="text-xs text-slate-600">
                    {activeTest.isRecruitmentTest ? "Résultat certifié candidat RH enregistré" : "Test enregistré dans votre dossier d'orientation"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    {testResult.primaryCategory}
                  </span>
                  {testResult.suitabilityScore !== undefined && (() => {
                    const appInfo = getTestScoreAppreciation(testResult.suitabilityScore);
                    return (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-extrabold">
                          Score : {testResult.suitabilityScore}%
                        </span>
                        <span className={`px-3 py-1 text-xs font-black rounded-full border ${appInfo.badgeColorClass}`}>
                          Appréciation : {appInfo.appreciation}
                        </span>
                      </div>
                    );
                  })()}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{testResult.description}</p>
              </div>

              {/* RICH DETAILED PROFILING (RIASEC HOLLAND & GARDNER MULTIPLE INTELLIGENCES RESTITUTION) */}
              {testResult.detailedProfiling && (
                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-5 rounded-xl border border-blue-800 space-y-4 shadow-md text-xs">
                  <div className="flex items-center justify-between border-b border-blue-700/60 pb-2">
                    <span className="font-extrabold text-amber-300 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />{" "}
                      {testResult.detailedProfiling.titleHeader ||
                        (testResult.detailedProfiling.hollandCode
                          ? `Profil Restitution RIASEC (Code : ${testResult.detailedProfiling.hollandCode})`
                          : `Profil Restitution : ${testResult.detailedProfiling.primaryTitle || "Intelligences Multiples"}`)}
                    </span>
                    <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      Protocole Dr BALOGAH
                    </span>
                  </div>

                  {/* Secondary Dominance Tag if any */}
                  {testResult.detailedProfiling.secondaryTitle && (
                    <div className="text-slate-300 text-[11px] font-medium">
                      Dominance secondaire : <span className="text-amber-200 font-bold">{testResult.detailedProfiling.secondaryTitle}</span>
                    </div>
                  )}

                  {/* Traits Badges */}
                  {testResult.detailedProfiling.traits && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-300 block">Caractéristique & Traits clés :</span>
                      <div className="flex flex-wrap gap-1.5">
                        {testResult.detailedProfiling.traits.map((trait: string, idx: number) => (
                          <span key={idx} className="bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-medium">
                            ✓ {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1">
                      <span className="font-bold text-amber-200 block text-[11px]">🏢 Univers de Travail & Métiers :</span>
                      <p className="text-slate-200 leading-snug text-[11px]">{testResult.detailedProfiling.workEnvironment}</p>
                    </div>

                    <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1">
                      <span className="font-bold text-emerald-200 block text-[11px]">📖 Stratégies d'Étude & Apprentissage :</span>
                      <p className="text-slate-200 leading-snug text-[11px]">
                        {testResult.detailedProfiling.studyStrategies || testResult.detailedProfiling.valuesAndGoals}
                      </p>
                    </div>

                    <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1">
                      <span className="font-bold text-blue-200 block text-[11px]">💡 Contributions & Forces Majeures :</span>
                      <p className="text-slate-200 leading-snug text-[11px]">{testResult.detailedProfiling.contributions}</p>
                    </div>

                    <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1">
                      <span className="font-bold text-purple-200 block text-[11px]">🎓 Activités de Développement & Progrès :</span>
                      <p className="text-slate-200 leading-snug text-[11px]">
                        {testResult.detailedProfiling.developmentActivities || testResult.detailedProfiling.trainingNeeds}
                      </p>
                    </div>
                  </div>

                  {testResult.detailedProfiling.potentialRisks && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg space-y-1">
                      <span className="font-bold text-amber-300 block text-[11px]">⚠️ Points de Vigilance & Évolution du Profil :</span>
                      <p className="text-amber-100 leading-snug text-[11px]">{testResult.detailedProfiling.potentialRisks}</p>
                    </div>
                  )}

                  {testResult.detailedProfiling.advisorMotivation && (
                    <div className="bg-emerald-950/80 border border-emerald-500/40 p-3 rounded-lg text-emerald-100 text-[11px] leading-relaxed italic">
                      {testResult.detailedProfiling.advisorMotivation}
                    </div>
                  )}
                </div>
              )}

              {/* HR Recommendation box if recruitment test */}
              {testResult.hrRecommendation && (
                <div className="bg-indigo-950 text-white p-4 rounded-xl border border-indigo-800 space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-wide flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ÉVALUATION RECRUTEMENT RH & AVIS CONSEILLER
                  </span>
                  <p className="text-xs font-bold text-amber-300">
                    {testResult.hrRecommendation}
                  </p>
                </div>
              )}

              {/* Recommended Fields & Careers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Secteurs & Postes recommandés :</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {testResult.recommendedFields?.map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Métiers cibles :</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {testResult.recommendedCareers?.map((c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => startTest(activeTest)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Repasser le test
                </button>
                <button
                  onClick={() => setActiveTest(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg"
                >
                  Voir les autres tests
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* List of Tests */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTests.map((test) => {
            const isDone = Boolean(completedTests[test.id]);
            return (
              <div
                key={test.id}
                className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col justify-between hover:shadow-md transition-all space-y-4 ${
                  test.isRecruitmentTest ? "border-indigo-200 hover:border-indigo-400" : "border-slate-200 hover:border-emerald-300"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded ${
                      test.isRecruitmentTest
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {test.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {test.isRecruitmentTest && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-purple-600" /> Candidat RH
                        </span>
                      )}
                      {isDone && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Complété
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{test.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{test.subtitle}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {test.durationMinutes} min • {test.questionCount} questions
                  </span>
                  <button
                    onClick={() => startTest(test)}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                      isDone
                        ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                        : test.isRecruitmentTest
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    }`}
                  >
                    <span>{isDone ? "Voir / Repasser" : "Démarrer le Test"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

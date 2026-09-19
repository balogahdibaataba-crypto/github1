/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  getCompletedTestsCache,
  saveCompletedTestsCache,
  getGradesSummaryCache,
  saveGradesSummaryCache,
  getCalcTargetProgramCache,
  saveCalcTargetProgramCache,
  getStudentProfileCache,
  saveStudentProfileCache,
} from "./utils/localStorageCache";
import { Header } from "./components/Header";
import { InstitutionsCatalog } from "./components/InstitutionsCatalog";
import { Careers1000 } from "./components/Careers1000";
import { OrientationTestsView } from "./components/OrientationTestsView";
import { GradeCalculator } from "./components/GradeCalculator";
import { AICounselor } from "./components/AICounselor";
import { ExportProfileModal } from "./components/ExportProfileModal";
import { ServicesCatalog } from "./components/ServicesCatalog";
import { Testimonials } from "./components/Testimonials";
import { CostOfLivingComparator } from "./components/CostOfLivingComparator";
import { CareerRoadmapD3 } from "./components/CareerRoadmapD3";
import { FAQ } from "./components/FAQ";
import { AdSpace } from "./components/AdSpace";
import { PaymentModal } from "./components/PaymentModal";
import { SavedBookmarksView } from "./components/SavedBookmarksView";
import { MobileMoneySessionWidget } from "./components/MobileMoneySessionWidget";
import { FreeAccessDonationBanner } from "./components/FreeAccessDonationBanner";
import { RecruitmentHubView } from "./components/RecruitmentHubView";
import { MyTransactionsView } from "./components/MyTransactionsView";
import { ExamPrepView } from "./components/ExamPrepView";
import { ReferralProgramView } from "./components/ReferralProgramView";
import { CertificationsAndTrainingView } from "./components/CertificationsAndTrainingView";
import { PaidOnlineCommunicationsView } from "./components/PaidOnlineCommunicationsView";
import { DocumentAnalyzer } from "./components/DocumentAnalyzer";
import { MyWalletView } from "./components/MyWalletView";
import { AboutView } from "./components/AboutView";
import { ContactsView } from "./components/ContactsView";
import { CareerEventsView } from "./components/CareerEventsView";
import { UserProgressDashboardD3 } from "./components/UserProgressDashboardD3";
import { OrientationService, PaymentReceipt } from "./types";
import { SERVICES } from "./data/servicesData";
import { Award, Phone, Mail, GraduationCap, Compass, Calculator, CheckCircle2, Download, Sparkles, X, Globe, Share2, FileArchive } from "lucide-react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { BookmarksProvider } from "./context/BookmarksContext";
import { WalletProvider } from "./context/WalletContext";
import { AuthProvider } from "./context/AuthContext";
import { UserWorkspaceView } from "./components/UserWorkspaceView";
import { AppInstallModal } from "./components/AppInstallModal";
import { DownloadSourceCodeModal } from "./components/DownloadSourceCodeModal";
import { SocialShareModal } from "./components/SocialShareModal";
import { PostBepcOrientationView } from "./components/PostBepcOrientationView";
import { PostBacOrientationView } from "./components/PostBacOrientationView";
import { AudienceAnalyticsModal } from "./components/AudienceAnalyticsModal";
import { UsageObservatory } from "./components/UsageObservatory";
import {
  initGoogleAnalytics,
  recordVisitorSession,
  subscribeToSiteAnalytics,
  SiteAnalyticsSummary,
  trackPageView,
} from "./services/analyticsService";


const sectionSEO: Record<string, { title: string; description: string; keywords: string }> = {
  "post-bac": {
    title: "Orientation Post-BAC : Universités, Grandes Écoles, Santé, Ingénierie & Métiers | OrientaAfrik",
    description: "Système officiel d'orientation post-BAC du Cabinet Dr BALOGAH : calcul des moyennes 2nde à Tle (T1, T2, T3) + BAC 1 + BAC 2, éligibilité aux filières (Santé, Ingénierie, Économie, Droit, Lettres) et réorientation vers les métiers porteurs.",
    keywords: "orientation post bac, facultés sciences de santé, médecine, pharmacie, ingénierie, FASEG, droit, IA informatique, BTS CQP post-bac, Dr BALOGAH, Togo, CEDEAO",
  },
  "post-bepc": {
    title: "Orientation Post-BEPC : Séries Générales (A4, S), Techniques (G, F, E, Ti) & Métiers | OrientaAfrik",
    description: "Système officiel d'orientation post-BEPC : calcul des moyennes 6ème à BEPC, évaluation d'éligibilité aux séries du Lycée Général, Technique ou vers l'apprentissage d'un métier porteur.",
    keywords: "orientation post bepc, seconde A4, seconde S, séries G1 G2 G3, séries F1 F2 F3 F4, série E, série Ti, apprentissage métiers, Togo, CEDEAO, Dr BALOGAH",
  },
  "user-workspace": {
    title: "Mon Espace de Travail Personnel & Documents | OrientaAfrik",
    description: "Espace personnel pour la rédaction de vos CVs, lettres de motivation, plans de carrière, suivi d'orientation et gestion de vos dossiers académiques et professionnels.",
    keywords: "espace personnel, gestionnaire cv, lettre de motivation, plan de carrière, cloud étudiant, Dr BALOGAH",
  },
  "usage-observatory": {
    title: "Observatoire des Usages & Comptes Personnels Créés | OrientaAfrik",
    description: "Statistiques officielles en temps réel : nombre total d'internautes ayant créé un compte personnel, répartition des profils étudiants, lycéens et professionnels sur Firestore.",
    keywords: "observatoire usages, comptes utilisateurs, statistiques orientaafrik, adoption numérique, étudiants togo afrique, Dr BALOGAH",
  },
  wallet: {
    title: "Mon Portefeuille & Solde d'Activité | OrientaAfrik - Cabinet Dr BALOGAH",
    description: "Consultez votre solde accumulé grâce au temps de navigation et aux activités d'orientation. Effectuez un transfert instantané vers Mobile Money (Mixx ou Moov).",
    keywords: "portefeuille orientaafrik, gains navigation, transfert mobile money, mixx, moov money, récompenses",
  },
  institutions: {
    title: "Établissements, Universités & Facultés | OrientaAfrik - Cabinet Dr BALOGAH",
    description: "Explorez la cartographie complète des universités publiques et privées, grandes écoles et facultés au Togo, en Afrique et dans le monde, avec conditions d'accès et frais de scolarité.",
    keywords: "universités Togo, facultés Lomé, enseignement supérieur Afrique, grandes écoles, diplômes LMD",
  },
  "roadmap-d3": {
    title: "Cartographie D3 des Parcours Académiques | OrientaAfrik - Cabinet Dr BALOGAH",
    description: "Visualisez les parcours académiques, passerelles d'études et trajectoires de carrière grâce à l'arbre interactif D3 du Cabinet OrientaAfrik.",
    keywords: "roadmap d3, parcours académique, trajectoire de carrière, orientation interactive",
  },
  careers: {
    title: "2000 Métiers Porteurs & Opportunités | OrientaAfrik - Cabinet Dr BALOGAH",
    description: "Répertoire complet des 2000 métiers d'avenir en Afrique et à l'international : compétences requises, débouchés, formations recommandées et salaires.",
    keywords: "2000 métiers, métiers d'avenir Afrique, compétences, débouchés professionnels, carrières",
  },
  saved: {
    title: "Mes Favoris & Métiers Enregistrés | OrientaAfrik - Cabinet Dr BALOGAH",
    description: "Consultez vos universités, métiers, formations et opportunités sauvegardés dans votre espace personnel OrientaAfrik.",
    keywords: "mes favoris, marque-pages, opportunités sauvegardées, orientation",
  },
  tests: {
    title: "Tests Psychométriques, QI & Bilan de Compétences | OrientaAfrik",
    description: "Passez nos 10 tests d'orientation psychométriques et de QI gratuits pour évaluer votre profil RIASEC, vos aptitudes cognitives et vos domaines de réussite.",
    keywords: "tests psychométriques, test de QI, profil RIASEC, bilan de compétences, orientation scolaire",
  },
  "exam-prep": {
    title: "Entraînement aux Examens & Concours Nationaux (BAC, BEPC, Santé, ENA, Polytech) | OrientaAfrik",
    description: "Séries d'exercices et épreuves types d'examens et concours nationaux avec correction automatique instantanée, explications méthodologiques et orientation par le Système Dr BALOGAH.",
    keywords: "bac Togo, bepc, concours santé médecine, polytechnique, ENA, annales corrigées, exercices bac, orientation",
  },
  "recruitment-hub": {
    title: "Espace Recrutement & Insertion Professionnelle | OrientaAfrik",
    description: "Portail de recrutement, offres de stages, emplois et accompagnement à la professionnalisation pour diplômés et cadres.",
    keywords: "recrutement Togo, offres d'emploi Afrique, stages, insertion professionnelle, bilan de compétences",
  },
  calculator: {
    title: "Calculateur de Moyennes & Éligibilité aux Filières | OrientaAfrik",
    description: "Calculez votre moyenne générale, vérifiez la règle de la note ≥ 10/20 dans les matières clés et évaluez votre éligibilité immédiate aux filières universitaires.",
    keywords: "calculateur de moyenne, éligibilité université, notes bac, coefficients, orientation",
  },
  "cost-of-living": {
    title: "Comparateur du Coût de la Vie & Logement Étudiant | OrientaAfrik",
    description: "Comparez le coût de la vie, le logement, le transport et le budget mensuel étudiant dans les grandes villes universitaires d'Afrique et du monde.",
    keywords: "coût de la vie étudiant, budget université, logement étudiant Lomé, études à l'étranger",
  },
  "ai-counselor": {
    title: "Consultation Dr BALOGAH & Rapport Certifié | OrientaAfrik",
    description: "Consultez directement le Cabinet du Dr BALOGAH Dibaataba, obtenez des conseils personnalisés d'orientation et générez votre Rapport Officiel Certifié imprimable.",
    keywords: "consultation orientation, Dr BALOGAH, rapport d'orientation certifié, avis d'orientation, Lomé",
  },
  services: {
    title: "Espace Client, Services & Tarifs Officiels | OrientaAfrik",
    description: "Découvrez nos prestations de conseil en orientation scolaire et professionnelle, bilans de compétences, accompagnement au recrutement et tarifs officiels.",
    keywords: "tarifs orientation, services cabinet Dr BALOGAH, bilan de compétences, rapport 15000 FCFA",
  },
  transactions: {
    title: "Mes Transactions & Reçus Officiels | OrientaAfrik",
    description: "Consultez l'historique de vos paiements Mobile Money (Mixx, Moov Money), téléchargez vos reçus et accédez à vos rapports d'orientation certifiés.",
    keywords: "reçus de paiement, transactions Mobile Money, rapport certifié, espace client",
  },
  testimonials: {
    title: "Témoignages & Success Stories | OrientaAfrik - Cabinet Dr BALOGAH",
    description: "Lisez les retours d'expérience et témoignages certifiés d'étudiants, parents et professionnels orientés par le Cabinet du Dr BALOGAH.",
    keywords: "témoignages orientation, avis Dr BALOGAH, réussite universitaire, success stories",
  },
  faq: {
    title: "Foire Aux Questions (FAQ) & Guide d'Orientation | OrientaAfrik",
    description: "Questions fréquentes sur la procédure d'orientation scolaire et professionnelle, la certification des rapports, les notes minimales et les services du Cabinet.",
    keywords: "FAQ orientation, aide Dr BALOGAH, explications rapport certifié, questions récurrentes",
  },
  ads: {
    title: "Partenaires & Annonces Éducatives | OrientaAfrik",
    description: "Espace d'annonces certifiées, opportunités de bourses et offres d'études proposées par nos établissements et partenaires.",
    keywords: "bourses d'études, annonces universitaires, partenaires OrientaAfrik",
  },
  about: {
    title: "À Propos | OrientaAfrik - Cabinet Dr BALOGAH Dibaataba",
    description: "Découvrez l'histoire, la vision et la méthodologie scientifique du Cabinet International d'Orientation OrientaAfrik dirigé par le Dr BALOGAH.",
    keywords: "à propos orientaafrik, vision Dr BALOGAH, cabinet d'orientation Togo Afrique, expertise RH",
  },
  contacts: {
    title: "Contacts & Support | OrientaAfrik - Cabinet Dr BALOGAH",
    description: "Contactez le Cabinet OrientaAfrik pour toute demande d'orientation, bilan de compétences ou rendez-vous. Téléphones Mixx, Moov et email officiel.",
    keywords: "contact orientaafrik, téléphone Dr BALOGAH, Mixx Togocom, Moov Africa, rendez-vous orientation",
  },
  events: {
    title: "Activités & Événements d'Orientation | OrientaAfrik - Cabinet Dr BALOGAH",
    description: "Agenda des salons d'orientation, webinaires, forums métiers, concours et ateliers de professionnalisation en Afrique.",
    keywords: "activités orientation, événements métiers, webinaires universités, salons étudiants, forums emploi",
  },
};

function AppContent() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("institutions");
  const [currency, setCurrency] = useState<"FCFA" | "EUR" | "USD">("FCFA");

  // LocalStorage cached states
  const [calcTargetProgram, setCalcTargetProgram] = useState<{ name: string; inst?: string } | null>(() => getCalcTargetProgramCache());
  const [gradesSummary, setGradesSummary] = useState<any>(() => getGradesSummaryCache());
  const [completedTests, setCompletedTests] = useState<Record<string, any>>(() => getCompletedTestsCache());

  useEffect(() => {
    saveCompletedTestsCache(completedTests);
  }, [completedTests]);

  useEffect(() => {
    if (gradesSummary) {
      saveGradesSummaryCache(gradesSummary);
    }
  }, [gradesSummary]);

  useEffect(() => {
    saveCalcTargetProgramCache(calcTargetProgram);
  }, [calcTargetProgram]);

  const [unlockedReport, setUnlockedReport] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [isExportProfileModalOpen, setIsExportProfileModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState<boolean>(false);
  const [isDownloadZipModalOpen, setIsDownloadZipModalOpen] = useState<boolean>(false);
  const [audienceStats, setAudienceStats] = useState<SiteAnalyticsSummary | null>(null);

  // Initialize Google Analytics & Session Recording in Firestore on Mount
  useEffect(() => {
    initGoogleAnalytics();
    recordVisitorSession();
    const unsubscribe = subscribeToSiteAnalytics((stats) => {
      setAudienceStats(stats);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Track page view changes in Google Analytics
  useEffect(() => {
    trackPageView(currentSEO.title, "/" + activeTab);
  }, [activeTab]);

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

  const [selectedServiceToPay, setSelectedServiceToPay] = useState<OrientationService | undefined>(undefined);
  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceipt[]>([]);

  const currentSEO = sectionSEO[activeTab] || sectionSEO["institutions"];

  const handleSelectProgramForCalc = (progName: string, instName: string) => {
    setCalcTargetProgram({ name: progName, inst: instName });
    setActiveTab("calculator");
  };

  const [activePromoCodeForModal, setActivePromoCodeForModal] = useState<string>("");

  const handleTestCompleted = (testId: string, result: any) => {
    setCompletedTests((prev) => ({ ...prev, [testId]: result }));
  };

  const handleOpenPaymentForService = (serv?: OrientationService | string, promoCode?: string) => {
    let targetService: OrientationService | undefined;
    if (typeof serv === "string") {
      targetService = SERVICES.find((s) => s.id === serv);
    } else {
      targetService = serv;
    }
    setSelectedServiceToPay(targetService);
    setActivePromoCodeForModal(promoCode || "");
    setPaymentModalOpen(true);
  };

  const [autoDownloadPending, setAutoDownloadPending] = useState<boolean>(false);
  const [lastPaymentSuccessMsg, setLastPaymentSuccessMsg] = useState<string | null>(null);

  const handlePaymentSuccess = (receipt: PaymentReceipt) => {
    setPaymentReceipts((prev) => [receipt, ...prev]);
    // Unlock report automatically upon any successful service or fee payment
    setUnlockedReport(true);

    // Navigate immediately to the AI Counselor / Report tab
    setActiveTab("ai-counselor");

    // Signal automatic PDF report download
    setAutoDownloadPending(true);

    setLastPaymentSuccessMsg(
      `Paiement de ${receipt.amount.toLocaleString("fr-FR")} ${receipt.currency} validé avec succès (${receipt.receiptHash}) ! Votre rapport officiel certifié est débloqué et son téléchargement PDF a démarré automatiquement.`
    );
  };

  return (
    <>
      <Helmet>
        <title>{currentSEO.title}</title>
        <meta name="description" content={currentSEO.description} />
        <meta name="keywords" content={currentSEO.keywords} />
        <meta property="og:title" content={currentSEO.title} />
        <meta property="og:description" content={currentSEO.description} />
        <meta name="twitter:title" content={currentSEO.title} />
        <meta name="twitter:description" content={currentSEO.description} />
      </Helmet>

      <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
          {/* App Header & Navigation */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currency={currency}
            setCurrency={setCurrency}
            unlockedReport={unlockedReport}
            onOpenExportProfileModal={() => setIsExportProfileModalOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
            onOpenShareModal={() => setIsSocialShareModalOpen(true)}
            onOpenDownloadZipModal={() => setIsDownloadZipModalOpen(true)}
            audienceStats={audienceStats}
          />

          {/* Main Container - Full PC Screen Optimized (max-w-[1700px]) */}
          <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            {/* Special Free Access & Donation Banner (01/09 au 31/10/2026) */}
            <FreeAccessDonationBanner
              onOpenShareModal={() => setIsSocialShareModalOpen(true)}
            />

            {/* Payment Success & Auto Download Notification Banner */}
            {lastPaymentSuccessMsg && (
              <div className="bg-emerald-950 text-white p-4 md:p-5 rounded-2xl border-2 border-emerald-500/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/50 shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm md:text-base text-emerald-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Paiement Confirmé & Rapport Débloqué
                    </h4>
                    <p className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed">
                      {lastPaymentSuccessMsg}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setActiveTab("ai-counselor");
                      setAutoDownloadPending(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger à nouveau le PDF
                  </button>
                  <button
                    onClick={() => setLastPaymentSuccessMsg(null)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900/80"
                    title="Fermer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {/* Callout Banner: Orientation Search & Grade Calculator Encouragement */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-4 md:p-5 rounded-2xl border border-emerald-500/30 shadow-md flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/40 shrink-0 mt-0.5">
                  <Compass className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="font-extrabold text-sm md:text-base text-emerald-300 flex items-center gap-2">
                    Orientation Scolaire & Universitaire — Recommandation du Dr BALOGAH
                  </h3>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                    Nous invitons tous les élèves, étudiants et candidats à effectuer leurs recherches ciblées sur les <strong>Établissements d'Enseignement Supérieur</strong> et les <strong>Filières d'études visées</strong> dans notre annuaire et sur Google, puis à renseigner soigneusement le <strong>Calculateur de Moyenne</strong> pour évaluer leur éligibilité académique.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto justify-end">
                <button
                  onClick={() => setActiveTab("institutions")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" /> Rechercher des Établissements & Filières
                </button>
                <button
                  onClick={() => setActiveTab("calculator")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" /> Renseigner le Calculateur de Moyenne
                </button>
              </div>
            </div>
            {activeTab === "wallet" && (
              <MyWalletView
                setActiveTab={setActiveTab}
                currency={currency}
              />
            )}

            {activeTab === "institutions" && (
              <div className="space-y-6">
                <UserProgressDashboardD3
                  completedTests={completedTests}
                  unlockedReport={unlockedReport}
                  gradesSummary={gradesSummary}
                  setActiveTab={setActiveTab}
                  currency={currency}
                  onOpenExportProfileModal={() => setIsExportProfileModalOpen(true)}
                />
                <InstitutionsCatalog
                  currency={currency}
                  onSelectProgramForCalc={handleSelectProgramForCalc}
                />
              </div>
            )}

            {activeTab === "roadmap-d3" && (
              <CareerRoadmapD3
                setActiveTab={setActiveTab}
                currency={currency}
              />
            )}

            {activeTab === "careers" && (
              <Careers1000
                currency={currency}
                onSelectCareerToCounselor={(career) => {
                  setActiveTab("ai-counselor");
                }}
              />
            )}

            {activeTab === "saved" && (
              <SavedBookmarksView
                setActiveTab={setActiveTab}
                currency={currency}
              />
            )}

          {activeTab === "tests" && (
            <OrientationTestsView
              onTestCompleted={handleTestCompleted}
              completedTests={completedTests}
              onGoToAICounselor={() => setActiveTab("ai-counselor")}
            />
          )}

          {activeTab === "certifications" && (
            <CertificationsAndTrainingView
              currency={currency}
              onOpenPaymentModal={(serviceId) => handleOpenPaymentForService(serviceId || "serv-examen-certification")}
            />
          )}

          {activeTab === "paid-communications" && (
            <PaidOnlineCommunicationsView
              currency={currency}
              onOpenPaymentModal={(serviceId) => handleOpenPaymentForService(serviceId || "serv-consultation-dibaataba")}
            />
          )}

          {activeTab === "referral" && (
            <ReferralProgramView
              currency={currency}
              onOpenPaymentModal={(promoCode) => handleOpenPaymentForService(undefined, promoCode)}
            />
          )}

          {activeTab === "exam-prep" && (
            <ExamPrepView
              onSelectTab={setActiveTab}
              onSelectCareerToCounselor={(career) => {
                setActiveTab("ai-counselor");
              }}
            />
          )}

          {activeTab === "post-bepc" && <PostBepcOrientationView />}

          {activeTab === "post-bac" && (
            <PostBacOrientationView
              onGoToAICounselor={() => setActiveTab("ai-counselor")}
              onGoToTests={() => setActiveTab("tests")}
            />
          )}

          {activeTab === "doc-analyzer" && <DocumentAnalyzer />}

          {activeTab === "recruitment-hub" && <RecruitmentHubView />}

          {activeTab === "calculator" && (
            <GradeCalculator
              initialProgramName={calcTargetProgram?.name}
              initialInstName={calcTargetProgram?.inst}
              onGradesCalculated={(summary) => setGradesSummary(summary)}
              onGoToAICounselor={() => setActiveTab("ai-counselor")}
            />
          )}

          {activeTab === "cost-of-living" && (
            <CostOfLivingComparator
              setActiveTab={setActiveTab}
              currency={currency}
            />
          )}

          {activeTab === "ai-counselor" && (
            <AICounselor
              gradesSummary={gradesSummary}
              completedTests={completedTests}
              onOpenPaymentModal={() => handleOpenPaymentForService()}
              unlockedReport={unlockedReport}
              currency={currency}
              onGoToTests={() => setActiveTab("tests")}
              onSelectTab={setActiveTab}
              onOpenExportProfileModal={() => setIsExportProfileModalOpen(true)}
              autoDownloadPending={autoDownloadPending}
              onAutoDownloadDone={() => setAutoDownloadPending(false)}
            />
          )}

          {activeTab === "services" && (
            <ServicesCatalog
              currency={currency}
              onSelectServiceToPay={(serv) => handleOpenPaymentForService(serv)}
              paymentReceipts={paymentReceipts}
            />
          )}

          {activeTab === "transactions" && (
            <MyTransactionsView
              receipts={paymentReceipts}
              currency={currency}
              onOpenPaymentModal={() => handleOpenPaymentForService()}
              onGoToServices={() => setActiveTab("services")}
            />
          )}

          {activeTab === "testimonials" && (
            <Testimonials
              setActiveTab={setActiveTab}
              onOpenPaymentModal={() => handleOpenPaymentForService()}
            />
          )}

          {activeTab === "faq" && (
            <FAQ
              setActiveTab={setActiveTab}
              onOpenPaymentModal={() => handleOpenPaymentForService()}
            />
          )}

          {activeTab === "ads" && <AdSpace />}

          {activeTab === "about" && (
            <AboutView
              setActiveTab={setActiveTab}
              currency={currency}
            />
          )}

          {activeTab === "contacts" && (
            <ContactsView
              setActiveTab={setActiveTab}
              currency={currency}
            />
          )}

          {activeTab === "user-workspace" && <UserWorkspaceView setActiveTab={setActiveTab} />}

          {activeTab === "usage-observatory" && (
            <UsageObservatory
              setActiveTab={setActiveTab}
              onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
            />
          )}

          {activeTab === "events" && <CareerEventsView />}
        </main>

        {/* Modal for PWA App Installation on Mobile, Tablet & PC */}
        <AppInstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />

        {/* Modal for Payment */}
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          service={selectedServiceToPay}
          onPaymentSuccess={handlePaymentSuccess}
          currency={currency}
          initialPromoCode={activePromoCodeForModal}
        />

        {/* Modal for Exporting Profile & PDF Report */}
        <ExportProfileModal
          isOpen={isExportProfileModalOpen}
          onClose={() => setIsExportProfileModalOpen(false)}
          studentProfile={studentProfile}
          setStudentProfile={setStudentProfile}
          gradesSummary={gradesSummary}
          completedTests={completedTests}
          unlockedReport={unlockedReport}
          onOpenPaymentModal={() => {
            setIsExportProfileModalOpen(false);
            handleOpenPaymentForService();
          }}
          currency={currency}
          onSelectTab={setActiveTab}
        />

        {/* Mobile Money Session Retribution Widget */}
        <MobileMoneySessionWidget
          onOpenShareModal={() => setIsSocialShareModalOpen(true)}
        />

        {/* Global Footer */}
        <footer className="bg-slate-950 text-white border-t border-slate-800 py-8 px-4 md:px-8 mt-12">
          <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            {/* Col 1: Branding & Vision */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-base text-white">Cabinet OrientaAfrik et Certification</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                <strong>Activités :</strong> Information et Orientation scolaires et professionnelles • Formation-Professionnalisation • Conseil en formation-Professionnalisation • Bilan de compétences • Aide au recrutement et autres.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Services & Formations</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>• Rapport d'Orientation Officiel Certifié : 15 000 FCFA HT</li>
                <li>• Consultation & Bilan de Compétences : dès 1000 FCFA</li>
                <li>• Passation des Tests Psychométriques & QI</li>
                <li>• Calculateur d'Éligibilité aux Filières (Notes ≥ 10)</li>
                <li className="pt-1">
                  <a
                    href="https://jesus-christ-gipie.ai.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[11px] transition-all"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>GIPIE - Ultime Combat: Prière et évangélisation.</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Prominent Contacts (Mes Contacts) */}
            <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Cabinet du Conseiller d'Orientation
              </h4>
              <div className="space-y-0.5">
                <p className="font-extrabold text-white text-xs md:text-sm">
                  Docteur BALOGAH Dibaataba, Spécialiste des sciences de l'éducation et de la formation,
                </p>
                <p className="text-[11px] text-amber-300 font-semibold leading-tight">
                  Conseiller en Formation-Professionnalisation, Conseiller d'orientation scolaire et professionnelle.
                </p>
              </div>
              <div className="space-y-1 text-slate-300 pt-1 text-[11px]">
                <p>📍 <strong>Adresse :</strong> Lomé, Togo • Afrique de l'Ouest</p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Mixx by Yass : <strong>+228 90966765</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Moov Money : <strong>+228 99372074</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>E-mail Pro : <strong>contact@orientaafrik.org</strong></span>
                </p>
                <p className="text-[10px] text-slate-400 pl-5">
                  E-mail secondaire : dbalogah@yahoo.com
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-[1700px] mx-auto pt-6 mt-6 border-t border-slate-900 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p>© {new Date().getFullYear()} OrientaAfrik et Certification • Conception Docteur BALOGAH Dibaataba. Tous droits réservés.</p>
            
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Partager l'Application sur les Réseaux Sociaux */}
              <button
                onClick={() => setIsSocialShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-black transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                title="Partager l'application sur WhatsApp, Facebook, X, Telegram, SMS..."
              >
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Partager sur les Réseaux</span>
              </button>

              {/* Télécharger Code Source ZIP */}
              <button
                onClick={() => setIsDownloadZipModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-sm"
                title="Télécharger l'archive ZIP du code source complet"
              >
                <FileArchive className="w-3.5 h-3.5 text-indigo-400" />
                <span>Télécharger Code ZIP</span>
              </button>

              {/* Live Audience Badge in Footer */}
              <button
                onClick={() => setIsAnalyticsModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-sm"
                title="Consulter l'observatoire officiel d'audience OrientaAfrik & Google Analytics"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Observatoire d'Audience :</span>
                <span className="font-mono text-white font-black">
                  {audienceStats ? audienceStats.uniqueVisitors.toLocaleString("fr-FR") : "4 210"}
                </span>
                <span className="text-slate-400">visiteurs</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-emerald-200 font-bold">
                  {audienceStats ? audienceStats.totalVisits.toLocaleString("fr-FR") : "14 850"}
                </span>
                <span className="text-slate-400">consultations</span>
              </button>
            </div>

            <p className="flex items-center gap-1">
              <span>Orientation, Éducation & Avenir pour l'Afrique et le Monde</span>
            </p>
          </div>
        </footer>

        {/* Modal Observatoire d'Audience & Google Analytics 4 */}
        <AudienceAnalyticsModal
          isOpen={isAnalyticsModalOpen}
          onClose={() => setIsAnalyticsModalOpen(false)}
        />

        {/* Modal de Partage sur les Réseaux Sociaux */}
        <SocialShareModal
          isOpen={isSocialShareModalOpen}
          onClose={() => setIsSocialShareModalOpen(false)}
        />

        {/* Modal de Téléchargement du Code Source ZIP */}
        <DownloadSourceCodeModal
          isOpen={isDownloadZipModalOpen}
          onClose={() => setIsDownloadZipModalOpen(false)}
        />
      </div>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <BookmarksProvider>
            <WalletProvider>
              <AppContent />
            </WalletProvider>
          </BookmarksProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

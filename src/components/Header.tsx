import React, { useState, useRef } from "react";
import {
  Home,
  Info,
  Briefcase,
  Building2,
  ShieldCheck,
  PhoneCall,
  GraduationCap,
  Phone,
  Mail,
  Award,
  BookOpen,
  Compass,
  Calculator,
  Bot,
  CreditCard,
  Megaphone,
  HelpCircle,
  Star,
  Wallet,
  Network,
  Globe,
  Bookmark,
  Receipt,
  Calendar,
  FileCheck2,
  Gift,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Video,
  Download,
  UserCheck,
  User,
  Sparkles,
  BarChart3,
  TrendingUp,
  Users,
  Share2,
  FileArchive,
} from "lucide-react";
import { GlobalSearchBar } from "./GlobalSearchBar";
import { useLanguage, LANGUAGE_OPTIONS, Language } from "../context/LanguageContext";
import { useBookmarks } from "../context/BookmarksContext";
import { useWallet } from "../context/WalletContext";
import { useAuth } from "../context/AuthContext";
import { OrientaAfrikOfficialLogo } from "./OrientaAfrikOfficialLogo";
import { SiteAnalyticsSummary } from "../services/analyticsService";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: "FCFA" | "EUR" | "USD";
  setCurrency: (currency: "FCFA" | "EUR" | "USD") => void;
  unlockedReport: boolean;
  onOpenExportProfileModal?: () => void;
  onOpenInstallModal?: () => void;
  onOpenAnalyticsModal?: () => void;
  onOpenShareModal?: () => void;
  onOpenDownloadZipModal?: () => void;
  audienceStats?: SiteAnalyticsSummary | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  unlockedReport,
  onOpenExportProfileModal,
  onOpenInstallModal,
  onOpenAnalyticsModal,
  onOpenShareModal,
  onOpenDownloadZipModal,
  audienceStats,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { savedItems } = useBookmarks();
  const { balanceFCFA } = useWallet();
  const { currentUser } = useAuth();

  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);
  const subMenuRef = useRef<HTMLDivElement>(null);

  const scrollSubMenu = (direction: "left" | "right") => {
    if (subMenuRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      subMenuRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Reorganized Menu Structure: Accueil, A propos, Services, Activités, Partenaires, Administration, Contacts
  const mainCategories = [
    {
      id: "accueil",
      label: t.catHome,
      icon: Home,
      defaultTab: "institutions",
      subTabs: [
        { id: "institutions", label: t.navInstitutions, icon: GraduationCap },
        { id: "post-bepc", label: "Orientation Post-BEPC", icon: Compass, badge: "Nouveau" },
        { id: "post-bac", label: "Orientation Post-BAC", icon: GraduationCap, badge: "Nouveau" },
        { id: "roadmap-d3", label: t.navRoadmapD3, icon: Network },
        { id: "careers", label: t.navCareers, icon: BookOpen },
      ],
    },
    {
      id: "about",
      label: t.catAbout,
      icon: Info,
      defaultTab: "about",
      subTabs: [
        { id: "about", label: t.navAboutPresentation, icon: Info },
        { id: "certifications", label: t.navCertifications, icon: Award, badge: t.newBadge },
        { id: "testimonials", label: t.navTestimonials, icon: Star },
        { id: "faq", label: t.navFaq, icon: HelpCircle },
      ],
    },
    {
      id: "services",
      label: t.catServices,
      icon: Briefcase,
      defaultTab: "services",
      subTabs: [
        { id: "services", label: t.navServices, icon: CreditCard },
        { id: "post-bepc", label: "Orientation Post-BEPC & Séries", icon: Compass, badge: "BEPC" },
        { id: "post-bac", label: "Orientation Post-BAC & Supérieur", icon: GraduationCap, badge: "BAC" },
        { id: "paid-communications", label: t.navPaidComms, icon: Video, badge: t.liveBadge },
        { id: "tests", label: t.navTests, icon: Compass },
        { id: "doc-analyzer", label: t.navDocAnalyzer, icon: FileCheck2, badge: "Vision AI" },
        { id: "calculator", label: t.navCalculator, icon: Calculator },
        { id: "exam-prep", label: t.navExamPrep, icon: FileCheck2 },
        { id: "cost-of-living", label: t.navCostOfLiving, icon: Wallet },
      ],
    },
    {
      id: "activites",
      label: t.catActivities,
      icon: Calendar,
      defaultTab: "events",
      subTabs: [
        { id: "events", label: t.navEvents, icon: Calendar, badge: t.newBadge },
        { id: "post-bepc", label: "Orientation Post-BEPC & Métiers", icon: Compass, badge: "Post-BEPC" },
        { id: "post-bac", label: "Orientation Post-BAC & Métiers", icon: GraduationCap, badge: "Post-BAC" },
        { id: "paid-communications", label: t.navPaidComms, icon: Video, badge: t.liveBadge },
        { id: "tests", label: t.navTests, icon: Compass },
        { id: "exam-prep", label: t.navExamPrep, icon: FileCheck2 },
        { id: "referral", label: t.navReferral, icon: Gift },
      ],
    },
    {
      id: "partenaires",
      label: t.catPartners,
      icon: Building2,
      defaultTab: "ads",
      subTabs: [
        { id: "ads", label: t.navAds, icon: Megaphone },
        { id: "referral", label: t.navReferral, icon: Gift, badge: t.freeBadge },
      ],
    },
    {
      id: "administration",
      label: t.catAdmin,
      icon: ShieldCheck,
      defaultTab: "user-workspace",
      subTabs: [
        { id: "user-workspace", label: currentUser ? "Mon Espace Perso" : "Créer Compte / Espace", icon: UserCheck, badge: currentUser ? "Connecté" : "Gratuit" },
        { id: "usage-observatory", label: "Observatoire des Usages", icon: Users, badge: "Comptes" },
        { id: "audience-stats", label: "Audience & Statistiques", icon: BarChart3, badge: "Live" },
        { id: "recruitment-hub", label: t.navRecruitmentHub, icon: Briefcase },
        { id: "wallet", label: t.navWallet, icon: Wallet, badge: `${balanceFCFA} F` },
        { id: "transactions", label: t.navTransactions, icon: Receipt },
        { id: "saved", label: t.navSaved, icon: Bookmark, badge: savedItems.length > 0 ? savedItems.length.toString() : undefined },
      ],
    },
    {
      id: "contacts",
      label: t.catContacts,
      icon: PhoneCall,
      defaultTab: "contacts",
      subTabs: [
        { id: "contacts", label: t.navContactsDetails, icon: PhoneCall },
        { id: "faq", label: t.navFaqSupport, icon: HelpCircle },
      ],
    },
  ];

  // Determine active main category based on activeTab
  const activeCategory =
    mainCategories.find(
      (cat) => cat.id === activeTab || cat.subTabs.some((sub) => sub.id === activeTab)
    ) || mainCategories[0];

  // Helper to find label of current active sub-tab
  const allSubTabs = mainCategories.flatMap((cat) => cat.subTabs);
  const activeSubTabObj = allSubTabs.find((item) => item.id === activeTab);

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40 transition-all">
      {/* Top Contact & Currency Bar - Hidden when header is collapsed */}
      {!isHeaderCollapsed && (
        <div className="bg-slate-950 border-b border-slate-800 text-xs py-2 px-4 transition-all">
          <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div className="flex flex-col gap-1 text-slate-300">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-1.5 font-bold text-amber-400 text-[11px] leading-tight">
                    <Award className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                    <div className="flex flex-col">
                      <span>Docteur BALOGAH Dibaataba, Spécialiste des sciences de l'éducation et de la formation,</span>
                      <span className="text-amber-300">Conseiller en Formation-Professionnalisation, Conseiller d'orientation scolaire et professionnelle.</span>
                    </div>
                  </div>
                </div>
                <a
                  href="https://jesus-christ-gipie.ai.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-[10px] tracking-wide shadow transition-all hover:scale-105"
                  title="GIPIE - Ultime Combat: Prière et évangélisation."
                >
                  <Globe className="w-3 h-3 text-slate-950" />
                  <span>GIPIE - Ultime Combat: Prière et évangélisation.</span>
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-200">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-extrabold text-[10px] border border-emerald-500/40">
                  🎁 Accès 100% Gratuit (01/09 au 31/10/2026)
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <a href="tel:+22890966765" className="flex items-center gap-1 hover:text-white transition-colors font-medium" title="Faire un don via Mixx by Yas">
                  <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" /> +228 90966765 (Mixx by Yas)
                </a>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <a href="tel:+22899372074" className="flex items-center gap-1 hover:text-white transition-colors font-medium" title="Faire un don via Flooz">
                  <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" /> +228 99372074 (Flooz)
                </a>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <a href="mailto:dbalogah@yahoo.com" className="flex items-center gap-1 hover:text-white transition-colors font-medium">
                  <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" /> dbalogah@yahoo.com
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 ml-auto justify-end">
              {/* Live Audience & Visitors Badge */}
              <button
                onClick={onOpenAnalyticsModal}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-mono text-[10.5px] font-bold transition-all hover:scale-105 cursor-pointer shadow-xs"
                title="Consulter l'observatoire d'audience, le nombre d'internautes et les statistiques en temps réel"
              >
                <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0 animate-pulse" />
                <span className="font-extrabold text-white">
                  {audienceStats ? audienceStats.uniqueVisitors.toLocaleString("fr-FR") : "4 210"}
                </span>
                <span className="text-emerald-300 hidden xl:inline">Internautes</span>
                <span className="text-slate-500 hidden xl:inline">•</span>
                <span className="text-emerald-200 hidden xl:inline">
                  {audienceStats ? audienceStats.totalVisits.toLocaleString("fr-FR") : "14 850"} Vues
                </span>
              </button>

              {/* Multi-Currency Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-sans">{t.currency}</span>
                <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
                  {(["FCFA", "EUR", "USD"] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                        currency === curr
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 hidden xl:inline">
                  (1 EUR = 655,95 FCFA • 1 USD = ~600 FCFA)
                </span>
              </div>

              {/* Global Languages Switcher */}
              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                <span className="text-slate-400 font-sans flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  {t.language}
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-slate-800 text-white border border-slate-700 rounded-md px-2 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div
            onClick={() => setActiveTab("institutions")}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            title="OrientaAfriK & Certification - Accueil"
          >
            <OrientaAfrikOfficialLogo variant="full" size="md" darkBackground={true} />
          </div>

          {/* Collapsible Toggle Button on Mobile */}
          <button
            onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
            className="md:hidden flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-amber-300 transition-all shrink-0"
            title={isHeaderCollapsed ? "Déplier la barre de menu" : "Plier la barre de menu"}
          >
            {isHeaderCollapsed ? (
              <>
                <ChevronDown className="w-4 h-4 text-amber-400" />
                <span>Déplier Menu</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4 text-amber-400" />
                <span>Plier Menu</span>
              </>
            )}
          </button>
        </div>

        {/* Centered Global Search Bar */}
        <div className="w-full md:flex-1 md:max-w-2xl mx-auto flex justify-center px-0 md:px-4">
          <div className="w-full">
            <GlobalSearchBar
              onSelectTab={setActiveTab}
              currency={currency}
            />
          </div>
        </div>

        {/* Quick CTA & Toggle Button */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Statistiques d'Audience */}
          <button
            onClick={onOpenAnalyticsModal}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
            title="Consulter l'observatoire d'audience, le nombre d'utilisateurs et de visites"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Audience & Stats</span>
            <span className="sm:hidden">Stats</span>
          </button>

          {/* Partager l'Application sur les Réseaux Sociaux */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            title="Partager l'application sur WhatsApp, Facebook, X, Telegram, SMS..."
          >
            <Share2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Partager</span>
          </button>

          {/* Installer l'application sur PC, Tablette ou Téléphone */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 hover:border-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
            title="Installer l'application sur Ordinateur, Tablette ou Téléphone"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Installer l'App</span>
          </button>

          {/* Télécharger Code Source ZIP */}
          <button
            onClick={onOpenDownloadZipModal}
            className="flex items-center gap-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/50 hover:border-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
            title="Télécharger l'archive ZIP du code source complet"
          >
            <FileArchive className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Code ZIP</span>
            <span className="sm:hidden">ZIP</span>
          </button>

          {/* Mon Espace Personnel */}
          <button
            onClick={() => setActiveTab("user-workspace")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 ${
              activeTab === "user-workspace"
                ? "bg-amber-500 text-slate-950 font-black ring-2 ring-amber-300"
                : "bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200"
            }`}
            title="Accéder à mon espace de travail et mes documents"
          >
            <User className="w-3.5 h-3.5 text-amber-300" />
            <span>{currentUser ? "Mon Espace" : "Créer un Compte"}</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-counselor")}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
          >
            <Bot className="w-4 h-4" />
            <span>{t.aiConsultationCta}</span>
          </button>

          <button
            onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-amber-500/40 hover:border-amber-400 rounded-xl text-xs font-extrabold text-amber-300 transition-all shadow-sm"
            title={isHeaderCollapsed ? "Déplier la barre de navigation" : "Plier la barre de navigation"}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHeaderCollapsed ? "Déplier" : "Plier"}</span>
            {isHeaderCollapsed ? (
              <ChevronDown className="w-4 h-4 text-amber-400 ml-0.5" />
            ) : (
              <ChevronUp className="w-4 h-4 text-amber-400 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* COMPACT ACTIVE TAB INDICATOR BAR (Shown when header is folded/collapsed) */}
      {isHeaderCollapsed && (
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center justify-between gap-2 max-w-[1700px] mx-auto text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold truncate">
            <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Menu Actif
            </span>
            <span className="text-white font-bold">{activeCategory.label}</span>
            {activeSubTabObj && (
              <>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <activeSubTabObj.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {activeSubTabObj.label}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => setIsHeaderCollapsed(false)}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 shrink-0"
          >
            <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Déplier le Menu</span>
          </button>
        </div>
      )}

      {/* REORGANIZED NAVIGATION MENU BAR (LEVEL 1: MAIN CATEGORIES & LEVEL 2: SUB-TABS) */}
      {!isHeaderCollapsed && (
        <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 space-y-2">
          {/* LEVEL 1: MAIN MENUS — Accueil, A propos, Services, Activités, Partenaires, Administration, Contacts */}
          <div className="w-full max-w-[1700px] mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 md:gap-2 py-1 border-b border-slate-800/80">
            {mainCategories.map((category) => {
              const CategoryIcon = category.icon;
              const isCatActive = activeCategory.id === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.defaultTab)}
                  className={`flex items-center justify-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm w-full text-center ${
                    isCatActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white ring-2 ring-emerald-400/50 shadow-md scale-[1.01]"
                      : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60"
                  }`}
                >
                  <CategoryIcon className={`w-4 h-4 shrink-0 ${isCatActive ? "text-amber-300" : "text-emerald-400"}`} />
                  <span className="truncate">{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* LEVEL 2: SUB-MENU BAR FOR THE SELECTED MAIN CATEGORY */}
          <div className="max-w-[1700px] mx-auto flex items-center gap-1.5 pt-0.5">
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase text-amber-300 bg-amber-500/10 rounded border border-amber-500/20 shrink-0 mr-1">
              {activeCategory.label}
            </span>

            {/* Left scroll arrow */}
            <button
              onClick={() => scrollSubMenu("left")}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg shrink-0 transition-all active:scale-95"
              title="Défiler vers la gauche"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Sub-tabs list */}
            <div ref={subMenuRef} className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none scroll-smooth py-0.5">
              {activeCategory.subTabs.map((subItem) => {
                const SubIcon = subItem.icon;
                const isSubActive = activeTab === subItem.id;
                return (
                  <button
                    key={subItem.id}
                    onClick={() => {
                      if (subItem.id === "audience-stats" && onOpenAnalyticsModal) {
                        onOpenAnalyticsModal();
                      } else {
                        setActiveTab(subItem.id);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      isSubActive
                        ? "bg-amber-600 text-white font-extrabold shadow-sm ring-1 ring-amber-400/50"
                        : "bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/40"
                    }`}
                  >
                    <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? "text-white" : "text-amber-400"}`} />
                    <span>{subItem.label}</span>
                    {subItem.badge && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded font-black bg-amber-500/30 text-amber-200 border border-amber-400/30">
                        {subItem.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right scroll arrow */}
            <button
              onClick={() => scrollSubMenu("right")}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg shrink-0 transition-all active:scale-95"
              title="Défiler vers la droite"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

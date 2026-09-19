import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, GraduationCap, BookOpen, Compass, ArrowRight, Sparkles, MapPin, Building2, Briefcase, Clock, ChevronRight, Check, Globe, ExternalLink } from "lucide-react";
import { INSTITUTIONS } from "../data/institutionsData";
import { CAREERS_1000 } from "../data/careersData";
import { ORIENTATION_TESTS } from "../data/testsData";
import { Institution, Career, OrientationTest } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface GlobalSearchBarProps {
  onSelectTab: (tab: string) => void;
  currency: "FCFA" | "EUR" | "USD";
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onSelectTab, currency }) => {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "institutions" | "careers" | "tests">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  // Search Logic with useMemo
  const matchingInstitutions = useMemo(() => {
    if (cleanQuery.length < 2) return [];
    return INSTITUTIONS.filter((inst) => {
      const nameMatch = inst.name.toLowerCase().includes(cleanQuery) || inst.shortName.toLowerCase().includes(cleanQuery);
      const locationMatch = inst.country.toLowerCase().includes(cleanQuery) || inst.city.toLowerCase().includes(cleanQuery);
      const descMatch = inst.description.toLowerCase().includes(cleanQuery);
      const programMatch = inst.programs.some(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.requiredSubjects.some((s) => s.toLowerCase().includes(cleanQuery)) ||
          p.targetCareers.some((c) => c.toLowerCase().includes(cleanQuery))
      );
      return nameMatch || locationMatch || descMatch || programMatch;
    }).slice(0, 6);
  }, [cleanQuery]);

  const matchingCareers = useMemo(() => {
    if (cleanQuery.length < 2) return [];
    return CAREERS_1000.filter((c) => {
      const titleMatch = c.title.toLowerCase().includes(cleanQuery);
      const sectorMatch = c.sector.toLowerCase().includes(cleanQuery);
      const descMatch = c.description.toLowerCase().includes(cleanQuery);
      const skillMatch = c.keySkills.some((s) => s.toLowerCase().includes(cleanQuery));
      const diplomaMatch = c.diplomasRequired.some((d) => d.toLowerCase().includes(cleanQuery));
      return titleMatch || sectorMatch || descMatch || skillMatch || diplomaMatch;
    }).slice(0, 6);
  }, [cleanQuery]);

  const matchingTests = useMemo(() => {
    if (cleanQuery.length < 2) return [];
    return ORIENTATION_TESTS.filter((t) => {
      const titleMatch = t.title.toLowerCase().includes(cleanQuery);
      const subtitleMatch = t.subtitle.toLowerCase().includes(cleanQuery);
      const categoryMatch = t.category.toLowerCase().includes(cleanQuery);
      const descMatch = t.description.toLowerCase().includes(cleanQuery);
      return titleMatch || subtitleMatch || categoryMatch || descMatch;
    }).slice(0, 6);
  }, [cleanQuery]);

  const totalResultsCount = matchingInstitutions.length + matchingCareers.length + matchingTests.length;

  const handleSelectInstitution = (inst: Institution) => {
    setIsOpen(false);
    onSelectTab("institutions");
  };

  const handleSelectCareer = (career: Career) => {
    setIsOpen(false);
    onSelectTab("careers");
  };

  const handleSelectTest = (test: OrientationTest) => {
    setIsOpen(false);
    onSelectTab("tests");
  };

  const handleGoogleSearch = (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(q.trim())}`;
    window.open(googleUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto z-30">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
          <Search className="w-4 h-4 text-emerald-500" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              handleGoogleSearch();
            }
          }}
          placeholder={
            language === "EN"
              ? "Global & Google Search: universities, 1000 careers, Holland tests, scholarships... (Press Enter to search Google)"
              : "Recherche globale & Google : universités, filières, 1000 métiers, bourses... (Entrée pour lancer Google)"
          }
          className="w-full pl-10 pr-28 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-lg transition-all font-medium"
        />

        {query ? (
          <div className="absolute right-3 flex items-center gap-1">
            <button
              onClick={() => handleGoogleSearch()}
              className="px-2 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] font-black rounded-lg transition-all shadow flex items-center gap-1 shrink-0"
              title="Lancer la recherche Google"
            >
              <Globe className="w-3 h-3" />
              <span className="hidden sm:inline">Google</span>
            </button>
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
              title="Effacer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="absolute right-3.5 hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-semibold rounded-lg border border-slate-700">
            <Globe className="w-3 h-3 text-blue-400" />
            <span>Recherche & Google</span>
          </div>
        )}
      </div>

      {/* Real-Time Live Suggestions Overlay / Modal */}
      {isOpen && cleanQuery.length >= 1 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header Bar with Filter Tabs */}
          <div className="p-3 bg-slate-950 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Suggestions en temps réel</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px]">
                {totalResultsCount} résultat(s)
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 text-[11px] flex-wrap">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeFilter === "all" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Tous ({totalResultsCount})
              </button>
              <button
                onClick={() => setActiveFilter("institutions")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeFilter === "institutions" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                🎓 Établissements ({matchingInstitutions.length})
              </button>
              <button
                onClick={() => setActiveFilter("careers")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeFilter === "careers" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                💼 Métiers ({matchingCareers.length})
              </button>
              <button
                onClick={() => setActiveFilter("tests")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeFilter === "tests" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                🧩 Tests ({matchingTests.length})
              </button>
              <button
                onClick={() => handleGoogleSearch()}
                className="px-2.5 py-1 bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white rounded-lg font-semibold transition-all border border-blue-500/40 flex items-center gap-1"
                title="Lancer sur Google Search"
              >
                <Globe className="w-3 h-3 text-blue-400" />
                <span>Google</span>
              </button>
            </div>
          </div>

          {/* Results Scroll Container */}
          <div className="max-h-[480px] overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
            
            {/* Direct Google Search Callout Banner */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-md">
              <div className="flex items-center gap-2.5 text-xs font-bold text-white">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 shrink-0">
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <span className="text-blue-300 font-extrabold flex items-center gap-1.5">
                    Rechercher "{query}" sur Google Search
                  </span>
                  <p className="text-[10px] text-slate-300 font-normal">
                    Étendre la recherche aux universités, filières et bourses internationales sur Google
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleGoogleSearch(`${query} université filière orientation`)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black rounded-lg transition-all shadow-md flex items-center gap-1.5"
                  title="Ouvrir les résultats Google pour cette recherche"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Rechercher sur Google</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </button>
              </div>
            </div>

            {totalResultsCount === 0 ? (
              <div className="p-6 text-center space-y-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                <Globe className="w-8 h-8 text-blue-400 mx-auto animate-pulse" />
                <p className="text-sm font-semibold text-slate-200">
                  Aucun résultat interne direct dans l'annuaire pour "{query}"
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Utilisez Google Search pour trouver directement des établissements, formations ou opportunités de bourses liées à votre requête :
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleGoogleSearch(`${query} université enseignement supérieur`)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Globe className="w-3.5 h-3.5" /> Établissements & Universités sur Google
                  </button>
                  <button
                    onClick={() => handleGoogleSearch(`${query} bourse études concours orientation`)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Globe className="w-3.5 h-3.5" /> Bourses d'études sur Google
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1. ÉTABLISSEMENTS SECTION */}
                {(activeFilter === "all" || activeFilter === "institutions") && matchingInstitutions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400 px-1 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" />
                        Établissements & Universités ({matchingInstitutions.length})
                      </span>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onSelectTab("institutions");
                        }}
                        className="text-[11px] text-slate-400 hover:text-white hover:underline lowercase font-normal"
                      >
                        voir l'annuaire complet →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {matchingInstitutions.map((inst) => (
                        <div
                          key={inst.id}
                          onClick={() => handleSelectInstitution(inst)}
                          className="bg-slate-800/80 hover:bg-slate-800 p-3 rounded-xl border border-slate-700/80 hover:border-emerald-500/60 transition-all cursor-pointer group flex items-start justify-between gap-2"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-white text-xs group-hover:text-emerald-300 transition-colors">
                                {inst.name}
                              </span>
                              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                                {inst.type}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-rose-400" />
                                {inst.city}, {inst.country}
                              </span>
                              <span>•</span>
                              <span>{inst.programs.length} filière(s)</span>
                            </p>

                            {/* Matching program snippet if any */}
                            {inst.programs.some((p) => p.name.toLowerCase().includes(cleanQuery)) && (
                              <p className="text-[10px] text-emerald-400/90 font-medium italic line-clamp-1">
                                Filière correspondante : {inst.programs.find((p) => p.name.toLowerCase().includes(cleanQuery))?.name}
                              </p>
                            )}
                          </div>

                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. MÉTIERS & CARRIÈRES SECTION */}
                {(activeFilter === "all" || activeFilter === "careers") && matchingCareers.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400 px-1 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        1000 Métiers & Formations ({matchingCareers.length})
                      </span>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onSelectTab("careers");
                        }}
                        className="text-[11px] text-slate-400 hover:text-white hover:underline lowercase font-normal"
                      >
                        voir tous les métiers →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {matchingCareers.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => handleSelectCareer(c)}
                          className="bg-slate-800/80 hover:bg-slate-800 p-3 rounded-xl border border-slate-700/80 hover:border-amber-500/60 transition-all cursor-pointer group flex items-start justify-between gap-2"
                        >
                          <div className="space-y-1">
                            <span className="font-extrabold text-white text-xs group-hover:text-amber-300 transition-colors block">
                              {c.title}
                            </span>

                            <div className="flex items-center gap-2 flex-wrap text-[10px]">
                              <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 font-medium">
                                {c.sector}
                              </span>
                              <span className="text-slate-400 flex items-center gap-1">
                                <Briefcase className="w-3 h-3 text-slate-400" />
                                {c.requiredEducationLevel}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-300 line-clamp-1">
                              {c.description}
                            </p>
                          </div>

                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. TESTS D'ORIENTATION SECTION */}
                {(activeFilter === "all" || activeFilter === "tests") && matchingTests.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-400 px-1 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Compass className="w-4 h-4" />
                        Tests Psychométriques & Bilans ({matchingTests.length})
                      </span>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onSelectTab("tests");
                        }}
                        className="text-[11px] text-slate-400 hover:text-white hover:underline lowercase font-normal"
                      >
                        voir les 10 tests →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {matchingTests.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleSelectTest(t)}
                          className="bg-slate-800/80 hover:bg-slate-800 p-3 rounded-xl border border-slate-700/80 hover:border-indigo-500/60 transition-all cursor-pointer group flex items-start justify-between gap-2"
                        >
                          <div className="space-y-1">
                            <span className="font-extrabold text-white text-xs group-hover:text-indigo-300 transition-colors block">
                              {t.title}
                            </span>

                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 font-medium">
                                {t.category}
                              </span>
                              <span className="text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-indigo-400" />
                                {t.durationMinutes} min ({t.questionCount} questions)
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-300 line-clamp-1">
                              {t.subtitle}
                            </p>
                          </div>

                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Callout */}
          <div className="p-3 bg-slate-950 flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-800">
            <span>💡 Astuce : Tapez un pays, une matière, un diplôme ou un nom de métier.</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white font-semibold"
            >
              Fermer (Échap)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import { useBookmarks, SavedType, SavedItem } from "../context/BookmarksContext";
import { useLanguage } from "../context/LanguageContext";
import { Bookmark, Heart, Trash2, ArrowRight, School, BookOpen, MapPin, Sparkles, Search, ExternalLink } from "lucide-react";

interface SavedBookmarksViewProps {
  setActiveTab: (tab: string) => void;
  currency: string;
}

export const SavedBookmarksView: React.FC<SavedBookmarksViewProps> = ({
  setActiveTab,
  currency,
}) => {
  const { savedItems, removeSaved, clearAllSaved } = useBookmarks();
  const { t } = useLanguage();

  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = savedItems.filter((item) => {
    const matchesType = activeTypeFilter === "all" || item.type === activeTypeFilter;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesQuery;
  });

  const getIconForType = (type: SavedType) => {
    switch (type) {
      case "institution":
        return <School className="w-5 h-5 text-emerald-500" />;
      case "career":
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case "cost_city":
        return <MapPin className="w-5 h-5 text-amber-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-teal-500" />;
    }
  };

  const getBadgeColor = (type: SavedType) => {
    switch (type) {
      case "institution":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "career":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      case "cost_city":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-teal-500/10 text-teal-600 border-teal-500/20";
    }
  };

  const getTypeLabel = (type: SavedType) => {
    switch (type) {
      case "institution":
        return t.filterInstitutions;
      case "career":
        return t.filterCareers;
      case "cost_city":
        return "Ville / Logement";
      default:
        return "Filière";
    }
  };

  const handleNavigate = (item: SavedItem) => {
    if (item.linkTab) {
      setActiveTab(item.linkTab);
    } else if (item.type === "institution") {
      setActiveTab("institutions");
    } else if (item.type === "career") {
      setActiveTab("careers");
    } else if (item.type === "cost_city") {
      setActiveTab("cost-of-living");
    } else {
      setActiveTab("institutions");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
              {savedItems.length} {t.savedCount}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500/20 shrink-0" />
            {t.savedTitle}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {t.savedSubtitle}
          </p>
        </div>

        {/* Toolbar controls */}
        {savedItems.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveTypeFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTypeFilter === "all"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {t.filterAll} ({savedItems.length})
              </button>
              <button
                onClick={() => setActiveTypeFilter("institution")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTypeFilter === "institution"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {t.filterInstitutions} ({savedItems.filter((i) => i.type === "institution").length})
              </button>
              <button
                onClick={() => setActiveTypeFilter("career")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTypeFilter === "career"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {t.filterCareers} ({savedItems.filter((i) => i.type === "career").length})
              </button>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir supprimer tous vos favoris ?")) {
                  clearAllSaved();
                }
              }}
              className="text-slate-400 hover:text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors self-end sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearAll}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {savedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 md:p-14 text-center border border-slate-200/80 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center border border-indigo-100 shadow-inner">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-900">{t.noSavedTitle}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{t.noSavedDesc}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab("institutions")}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <School className="w-4 h-4" />
              <span>{t.navInstitutions}</span>
            </button>
            <button
              onClick={() => setActiveTab("careers")}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.navCareers}</span>
            </button>
            <button
              onClick={() => setActiveTab("roadmap-d3")}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.navRoadmapD3}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search bar inside favorites */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer mes favoris enregistrés..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-sm"
            />
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              Aucun favori ne correspond à votre recherche "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          {getIconForType(item.type)}
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeColor(item.type)}`}>
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      <button
                        onClick={() => removeSaved(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        title={t.removeFromFavorites}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-2">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    {item.extraInfo && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium">
                        {item.extraInfo}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      Enregistré le {new Date(item.savedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleNavigate(item)}
                      className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>Consulter</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo, useRef } from "react";
import { INSTITUTIONS, getInstitutionFacultiesAndSchools, inferFacultyOrSchool } from "../data/institutionsData";
import { Continent, Institution } from "../types";
import { Search, MapPin, Globe, School, BookOpen, DollarSign, Wallet, ArrowRight, CheckCircle2, Bookmark, Heart, ChevronLeft, ChevronRight, Building2, GraduationCap, Layers, Wifi, WifiOff, ExternalLink, Info, Zap } from "lucide-react";
import { useBookmarks } from "../context/BookmarksContext";
import { useOfflineStatus } from "../registerServiceWorker";

interface InstitutionsCatalogProps {
  currency: "FCFA" | "EUR" | "USD";
  onSelectProgramForCalc: (progName: string, instName: string) => void;
}

export const InstitutionsCatalog: React.FC<InstitutionsCatalogProps> = ({
  currency,
  onSelectProgramForCalc,
}) => {
  const { isSaved, toggleSave } = useBookmarks();
  const { isOffline, isSWRegistered } = useOfflineStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string>("Tous");
  const [selectedCountry, setSelectedCountry] = useState<string>("Tous");
  const [selectedType, setSelectedType] = useState<string>("Tous");
  const [activeModalInst, setActiveModalInst] = useState<Institution | null>(null);
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState<string>("Tous");

  // Pagination state (Default strategy for maximum reactivity & low RAM)
  const [renderMode, setRenderMode] = useState<"paginated" | "virtual">("paginated");
  const [columns, setColumns] = useState<number>(3);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [viewportHeight, setViewportHeight] = useState<number>(800);
  const virtualContainerRef = useRef<HTMLDivElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(24);

  // Deferred search term to prevent UI freeze during typing
  const deferredSearchTerm = React.useDeferredValue(searchTerm);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(3);
      setViewportHeight(window.innerHeight);
    };
    handleResize();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (virtualContainerRef.current) {
            const rect = virtualContainerRef.current.getBoundingClientRect();
            setScrollTop(Math.max(0, -rect.top));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const container = document.getElementById("institutions-catalog-top");
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, selectedContinent, selectedCountry, selectedType, itemsPerPage]);

  useEffect(() => {
    setSelectedFacultyFilter("Tous");
  }, [activeModalInst]);

  const formatMoney = (amountFCFA?: number) => {
    if (amountFCFA === undefined || amountFCFA === null || isNaN(amountFCFA)) {
      return "Sur devis / Variable";
    }
    if (amountFCFA === 0) return "Gratuit";
    if (currency === "EUR") {
      return `${(amountFCFA / 655.957).toFixed(0)} €`;
    }
    if (currency === "USD") {
      return `$ ${(amountFCFA / 600).toFixed(0)}`;
    }
    return `${amountFCFA.toLocaleString("fr-FR")} FCFA`;
  };

  const getAvgTuition = (i: Institution) => {
    if (!i.programs || i.programs.length === 0) return 0;
    const total = i.programs.reduce((acc, p) => acc + (p.annualTuitionFCFA || 0), 0);
    return Math.round(total / i.programs.length);
  };

  const [selectedDegree, setSelectedDegree] = useState<string>("Tous");

  const countriesList = useMemo(() => {
    return Array.from(
      new Set(
        INSTITUTIONS.filter(
          (i) => selectedContinent === "Tous" || i.continent === selectedContinent
        ).map((i) => i.country)
      )
    ).sort();
  }, [selectedContinent]);

  const filteredInstitutions = useMemo(() => {
    const searchLower = deferredSearchTerm.toLowerCase().trim();
    const degreeLower = selectedDegree.toLowerCase().trim();

    return INSTITUTIONS.filter((inst) => {
      const matchesSearch =
        !searchLower ||
        (inst.searchableText
          ? inst.searchableText.includes(searchLower)
          : inst.name.toLowerCase().includes(searchLower) ||
            inst.city.toLowerCase().includes(searchLower) ||
            inst.country.toLowerCase().includes(searchLower));

      const matchesDegree =
        selectedDegree === "Tous" ||
        (inst.searchableText
          ? inst.searchableText.includes(degreeLower)
          : inst.programs.some((p) => p.degree && p.degree.toLowerCase().includes(degreeLower)));

      const matchesContinent = selectedContinent === "Tous" || inst.continent === selectedContinent;
      const matchesCountry = selectedCountry === "Tous" || inst.country === selectedCountry;
      const matchesType = selectedType === "Tous" || inst.type === selectedType;

      return matchesSearch && matchesDegree && matchesContinent && matchesCountry && matchesType;
    });
  }, [deferredSearchTerm, selectedDegree, selectedContinent, selectedCountry, selectedType]);

  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage);
  const paginatedInstitutions = filteredInstitutions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const ROW_HEIGHT = 480;
  const OVERSCAN = 2;

  const virtualRange = useMemo(() => {
    if (renderMode !== "virtual") return { visibleInstitutions: [], paddingTop: 0, paddingBottom: 0, startIndex: 0, endIndex: 0 };

    const totalItems = filteredInstitutions.length;
    if (totalItems === 0) return { visibleInstitutions: [], paddingTop: 0, paddingBottom: 0, startIndex: 0, endIndex: 0 };

    const totalRows = Math.ceil(totalItems / columns);
    const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
    const endRow = Math.min(totalRows, Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + OVERSCAN);

    const startIndex = startRow * columns;
    const endIndex = Math.min(totalItems, endRow * columns);

    const visibleInstitutions = filteredInstitutions.slice(startIndex, endIndex);
    const paddingTop = startRow * ROW_HEIGHT;
    const paddingBottom = Math.max(0, (totalRows - endRow) * ROW_HEIGHT);

    return {
      visibleInstitutions,
      paddingTop,
      paddingBottom,
      startIndex,
      endIndex,
    };
  }, [renderMode, filteredInstitutions, columns, scrollTop, viewportHeight]);

  const itemsToRender = renderMode === "virtual" ? virtualRange.visibleInstitutions : paginatedInstitutions;

  return (
    <div id="institutions-catalog-top" className="space-y-6">
      {/* Search & Filters Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 rounded-2xl text-white shadow-md border border-slate-700">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> Annuaire Établissements
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold">
              {INSTITUTIONS.length} Établissements Intégrés
            </span>
            {isOffline && (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" /> Mode Hors-Ligne
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Universités & Grandes Écoles d'Afrique et du Monde
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Consultez et recherchez des filières par <strong>Diplôme visé</strong> (Licence, Master, BTS...), par <strong>Métier visé</strong>, par ville ou par établissement.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Diplôme, métier visé, université, filière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Degree Filter */}
          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="Tous">Tous Diplômes (Licence, Master, BTS...)</option>
            <option value="Licence">Licence / Bachelor</option>
            <option value="Master">Master / Maîtrise</option>
            <option value="Doctorat">Doctorat / PhD</option>
            <option value="Ingénieur">Diplôme d'Ingénieur</option>
            <option value="BTS">BTS / DUT / Diplôme Court</option>
          </select>

          {/* Continent Filter */}
          <select
            value={selectedContinent}
            onChange={(e) => {
              setSelectedContinent(e.target.value);
              setSelectedCountry("Tous");
            }}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="Tous">Tous les continents</option>
            <option value="Afrique">Afrique</option>
            <option value="Europe">Europe</option>
            <option value="Amérique">Amérique</option>
            <option value="Asie">Asie</option>
            <option value="Océanie">Océanie</option>
          </select>

          {/* Country Filter */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="Tous">Tous les pays ({countriesList.length})</option>
            {countriesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="Tous">Tous les statuts (Public / Privé)</option>
            <option value="Public">Établissements Publics</option>
            <option value="Privé">Établissements Privés</option>
          </select>
        </div>

        {searchTerm.trim().length > 0 && (
          <div className="mt-4 p-3 bg-slate-950/90 border border-emerald-500/40 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <Search className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Accéder directement aux résultats de recherche Google pour <strong className="text-emerald-300">"{searchTerm}"</strong> :
              </span>
            </div>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${searchTerm} universite ecole site officiel admission filieres`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Recherche Google Directe</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* TOP PAGINATION & VIRTUAL SCROLL TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-bold">
          <span>Affichage de <span className="text-slate-900 font-black">{filteredInstitutions.length} universités & écoles</span></span>
          {renderMode === "virtual" && (
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Fluidité 60 FPS • {virtualRange.visibleInstitutions.length} cartes dans le DOM</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Render Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setRenderMode("virtual")}
              className={`px-3 py-1.5 rounded-lg font-extrabold transition-all flex items-center gap-1.5 ${
                renderMode === "virtual"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>⚡ Virtualisation 2000 Items</span>
            </button>
            <button
              onClick={() => setRenderMode("paginated")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                renderMode === "paginated"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>📄 Mode Pagination</span>
            </button>
          </div>

          {renderMode === "paginated" && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <span>Par page :</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              >
                <option value={12}>12 par page</option>
                <option value={24}>24 par page</option>
                <option value={48}>48 par page</option>
                <option value={96}>96 par page</option>
              </select>
            </div>
          )}

          {renderMode === "paginated" && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-800 flex items-center gap-0.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Préc
              </button>

              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-black">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-800 flex items-center gap-0.5"
              >
                Suiv <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 text-slate-600 text-xs font-medium">
        <div>
          Affichage de <span className="font-bold text-slate-900">{itemsToRender.length}</span> sur <span className="font-bold text-slate-900">{filteredInstitutions.length}</span> établissements trouvés
          {filteredInstitutions.length < INSTITUTIONS.length && ` (filtrés sur ${INSTITUTIONS.length})`}
        </div>
        {renderMode === "paginated" && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span>Page {currentPage} sur {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1 rounded bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-100 text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1 rounded bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-100 text-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Institutions (Virtual Container or Standard Grid) */}
      <div ref={virtualContainerRef} className="relative min-h-[300px]">
        <div
          style={
            renderMode === "virtual"
              ? {
                  paddingTop: `${virtualRange.paddingTop}px`,
                  paddingBottom: `${virtualRange.paddingBottom}px`,
                }
              : undefined
          }
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {itemsToRender.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-all group"
            >
              {/* Card Image Header */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={inst.imageUrl}
                  alt={inst.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm ${
                      inst.type === "Public"
                        ? "bg-emerald-600 text-white"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {inst.type}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/80 text-white backdrop-blur-sm">
                    {inst.continent}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave({
                      id: `inst_${inst.id}`,
                      type: "institution",
                      title: inst.name,
                      subtitle: `${inst.city}, ${inst.country}`,
                      badge: `${inst.type} • ${inst.continent}`,
                      extraInfo: `${inst.programs.length} filières répertoriées • Coût de la vie: ${formatMoney(inst.livingCostMonthlyFCFA)}/mois`,
                      linkTab: "institutions",
                      data: inst,
                    });
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                    isSaved(`inst_${inst.id}`)
                      ? "bg-rose-500 text-white"
                      : "bg-slate-900/70 text-slate-200 hover:bg-slate-900 hover:text-white"
                  }`}
                  title={isSaved(`inst_${inst.id}`) ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart className={`w-4 h-4 ${isSaved(`inst_${inst.id}`) ? "fill-white" : ""}`} />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{inst.city}, {inst.country}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-emerald-700 transition-colors">
                    {inst.name}
                  </h3>
                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {inst.description}
                  </p>
                </div>

                {/* Financial & Location quick metrics */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1 font-medium text-[11px]">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" /> Statut :
                    </span>
                    <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Établissement {inst.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 text-[11px]">
                    <span className="flex items-center gap-1 font-medium">
                      <Wallet className="w-3.5 h-3.5 text-emerald-600" /> Coût de vie :
                    </span>
                    <span className="font-bold text-emerald-700">{formatMoney(inst.livingCostMonthlyFCFA)} / mois</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 text-[11px]">
                    <span className="flex items-center gap-1 font-medium">
                      <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Scolarité estimée :
                    </span>
                    <span className="font-extrabold text-slate-800">{formatMoney(getAvgTuition(inst))} / an</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setActiveModalInst(inst)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-lg text-xs font-semibold transition-all shadow-sm"
                  >
                    <span>Fiche Établissement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {inst.website && (
                    <a
                      href={inst.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow-2xs shrink-0"
                      title={`Accéder au site officiel de ${inst.name}`}
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Site Officiel</span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer (Only in paginated mode) */}
      {renderMode === "paginated" && totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 py-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold disabled:opacity-40 hover:bg-slate-200 flex items-center gap-1 shadow-sm text-slate-800"
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          
          {/* Page Number Buttons */}
          <div className="flex flex-wrap items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="px-1 text-slate-400 font-bold text-xs">...</span>}
                    <button
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                        p === currentPage
                          ? "bg-emerald-700 text-white shadow-md ring-2 ring-emerald-500/30"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold disabled:opacity-40 hover:bg-slate-200 flex items-center gap-1 shadow-sm text-slate-800"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {filteredInstitutions.length === 0 && (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-inner">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-xl font-extrabold text-slate-800">
              Rechercher "{searchTerm || "cet établissement"}" sur Google Search
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Aucun établissement ne correspond exactement à vos filtres actuels. Grâce à la recherche universelle Google Search, accédez instantanément au portail officiel, aux modalités d'admission et aux offres de cours de tout établissement supérieur dans le monde.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${searchTerm || "universite grandes ecoles"} site officiel admission filieres`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-xl text-xs transition-all shadow-md hover:shadow-lg"
            >
              <Globe className="w-4 h-4 text-emerald-300" />
              <span>Lancer la Recherche Google pour "{searchTerm || "Établissement"}"</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Detailed Modal view for selected Institution */}
      {activeModalInst && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="relative h-48 bg-slate-900 text-white p-6 flex flex-col justify-end">
              <img
                src={activeModalInst.imageUrl}
                alt={activeModalInst.name}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 space-y-2">
                <span className="px-2.5 py-0.5 bg-emerald-500 text-white text-[11px] font-bold rounded">
                  {activeModalInst.type} • {activeModalInst.country} ({activeModalInst.continent})
                </span>
                <h3 className="text-2xl font-bold">{activeModalInst.name}</h3>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {activeModalInst.city}, {activeModalInst.country}
                </p>
              </div>
              <button
                onClick={() => setActiveModalInst(null)}
                className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-slate-800">
              {/* Site Officiel Direct Access Banner */}
              {activeModalInst.website && (
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-md">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400 shrink-0">
                      <Globe className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-emerald-200">Portail Web Officiel de l'Établissement</h4>
                        <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-300 rounded text-[10px] font-bold uppercase border border-emerald-500/40">
                          Lien Direct
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                        Visitez le portail officiel de <strong>{activeModalInst.name}</strong> pour découvrir directement l'offre de formation, les facultés, instituts, conditions de candidature et actualités.
                      </p>
                    </div>
                  </div>
                  <a
                    href={activeModalInst.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-3 rounded-xl text-xs shadow-lg transition-all border border-emerald-400/50 hover:scale-105"
                  >
                    <Globe className="w-4 h-4 text-white" />
                    <span>Aller sur le Site Officiel</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>
              )}

              {/* Description & Financial Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="md:col-span-2 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    <span>À propos de l'établissement</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{activeModalInst.description}</p>
                </div>
                <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200">
                  <div className="space-y-1 border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-1">
                      <Wallet className="w-4 h-4 text-emerald-600" /> Coût de vie estimé
                    </h4>
                    <p className="text-lg font-extrabold text-emerald-700">{formatMoney(activeModalInst.livingCostMonthlyFCFA)} <span className="text-xs font-normal text-slate-500">/ mois</span></p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-amber-600" /> Scolarité estimée
                    </h4>
                    <p className="text-base font-extrabold text-slate-900">{formatMoney(getAvgTuition(activeModalInst))} <span className="text-xs font-normal text-slate-500">/ an</span></p>
                  </div>
                </div>
              </div>

              {/* Informational Guidance Box */}
              <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <School className="w-5 h-5 text-emerald-400" />
                  <span>Consultation des Offres Académiques & Candidatures</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Conformément aux directives d'orientation, l'application répertorie l'ensemble des établissements d'enseignement supérieur (publics et privés). Pour consulter la liste complète des facultés, instituts, écoles, filières spécifiques et procédures d'inscription, nous invitons les étudiants à se rendre directement sur le site web officiel ou le portail d'admission de l'établissement.
                </p>
                {activeModalInst.website && (
                  <div className="pt-1">
                    <a
                      href={activeModalInst.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                    >
                      <span>Consulter le Portail / Site Officiel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from "react";
import { CAREERS_1000, CAREER_SECTORS } from "../data/careersData";
import { Career } from "../types";
import { Search, Briefcase, GraduationCap, Award, DollarSign, Sparkles, Filter, ChevronLeft, ChevronRight, Heart, Bookmark } from "lucide-react";
import { useBookmarks } from "../context/BookmarksContext";

interface Careers1000Props {
  currency: "FCFA" | "EUR" | "USD";
  onSelectCareerToCounselor: (careerTitle: string) => void;
}

export const Careers1000: React.FC<Careers1000Props> = ({
  currency,
  onSelectCareerToCounselor,
}) => {
  const { isSaved, toggleSave } = useBookmarks();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("Tous les secteurs");
  const [selectedEducation, setSelectedEducation] = useState("Tous les niveaux");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const el = document.getElementById("careers-catalog-top");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredCareers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return CAREERS_1000.filter((c) => {
      const matchesSearch =
        !term ||
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.keySkills.some((s) => s.toLowerCase().includes(term));

      const matchesSector =
        selectedSector === "Tous les secteurs" || c.sector === selectedSector;

      const matchesEducation =
        selectedEducation === "Tous les niveaux" || c.requiredEducationLevel === selectedEducation;

      return matchesSearch && matchesSector && matchesEducation;
    });
  }, [searchTerm, selectedSector, selectedEducation]);

  const totalPages = Math.ceil(filteredCareers.length / itemsPerPage);
  const currentItems = filteredCareers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div id="careers-catalog-top" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-900 p-6 rounded-2xl text-white shadow-md border border-slate-700">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 2000 Métiers Porteurs en Afrique & Monde
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Répertoire des Métiers d'Avenir, Formations & Compétences
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Explorez les métiers à fort potentiel de recrutement. Découvrez les niveaux d'éducation exigés (avec ou sans diplôme, BAC+2 à BAC+8), les compétences indispensables et les écoles d'excellence qui y forment.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Rechercher un métier, compétence..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedSector}
            onChange={(e) => {
              setSelectedSector(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {CAREER_SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedEducation}
            onChange={(e) => {
              setSelectedEducation(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="Tous les niveaux">Tous les niveaux d'éducation</option>
            <option value="Sans diplôme">Sans diplôme</option>
            <option value="CAP / BT">CAP / BT</option>
            <option value="BAC">BAC</option>
            <option value="BAC+2 / BTS / DUT">BAC+2 / BTS / DUT</option>
            <option value="BAC+3 / Licence">BAC+3 / Licence</option>
            <option value="BAC+5 / Master / Ingénieur">BAC+5 / Master / Ingénieur</option>
            <option value="BAC+8 / Doctorat">BAC+8 / Doctorat</option>
          </select>
        </div>
      </div>

      {/* TOP PAGINATION TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600 font-bold">
          Affichage de <span className="text-slate-900 font-extrabold">{filteredCareers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> à{" "}
          <span className="text-slate-900 font-extrabold">{Math.min(currentPage * itemsPerPage, filteredCareers.length)}</span> sur{" "}
          <span className="text-emerald-700 font-black">{filteredCareers.length} métiers répertoriés</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <span>Par page :</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
            >
              <option value={12}>12 métiers</option>
              <option value={24}>24 métiers</option>
              <option value={48}>48 métiers</option>
              <option value={96}>96 métiers</option>
            </select>
          </div>

          {totalPages > 1 && (
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

      {/* Grid of Careers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((career) => (
          <div
            key={career.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                    {career.sector}
                  </span>
                  {career.isHighDemand && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded flex items-center gap-1 border border-amber-200">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Forte Demande
                    </span>
                  )}
                </div>
                <button
                  onClick={() =>
                    toggleSave({
                      id: `car_${career.id}`,
                      type: "career",
                      title: career.title,
                      subtitle: `${career.sector} • Exigence : ${career.requiredEducationLevel}`,
                      badge: career.sector,
                      extraInfo: `Salaire : ${career.averageMonthlySalaryFCFA} • ${career.diplomasRequired.slice(0, 2).join(", ")}`,
                      linkTab: "careers",
                      data: career,
                    })
                  }
                  className={`p-1.5 rounded-lg border transition-all ${
                    isSaved(`car_${career.id}`)
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-slate-50 text-slate-400 hover:text-rose-500 border-slate-200 hover:bg-rose-50"
                  }`}
                  title={isSaved(`car_${career.id}`) ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart className={`w-4 h-4 ${isSaved(`car_${career.id}`) ? "fill-white" : ""}`} />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{career.title}</h3>
                <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{career.description}</p>
              </div>

              {/* Education Level & Diplomas */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Niveau exigé : {career.requiredEducationLevel}</span>
                </div>
                <div className="text-slate-600 space-y-1">
                  <span className="font-semibold text-[11px] text-slate-700">Diplômes requis :</span>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    {career.diplomasRequired.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Compétences clés :</span>
                <div className="flex flex-wrap gap-1">
                  {career.keySkills.map((sk) => (
                    <span key={sk} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Training Institutions */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Établissements de formation :</span>
                <p className="text-xs text-slate-600 italic">
                  {career.topTrainingInstitutions.join(", ")}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Salaire estimé :</span>
                <span className="text-xs font-bold text-emerald-700">{career.averageMonthlySalaryFCFA}</span>
              </div>
              <button
                onClick={() => onSelectCareerToCounselor(career.title)}
                className="bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Plan de formation Dr BALOGAH
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 py-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>

          {/* Page Numbers */}
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
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

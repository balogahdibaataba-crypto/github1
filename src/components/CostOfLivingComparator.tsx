import React, { useState } from "react";
import { Building2, MapPin, Calculator, ArrowRightLeft, Sparkles, CheckCircle2, AlertTriangle, XCircle, ChevronRight, DollarSign, Wallet, ShieldCheck, Home, Utensils, Bus, Wifi, ShoppingBag, GraduationCap, ArrowRight, HelpCircle, Phone, Heart } from "lucide-react";
import { CITIES_COST_DATA, CityCostOfLiving, convertFromFcfa } from "../data/costOfLivingData";
import { useBookmarks } from "../context/BookmarksContext";

interface CostOfLivingComparatorProps {
  setActiveTab: (tab: string) => void;
  currency: "FCFA" | "EUR" | "USD";
}

export const CostOfLivingComparator: React.FC<CostOfLivingComparatorProps> = ({ setActiveTab, currency }) => {
  const { isSaved, toggleSave } = useBookmarks();
  // Comparative State
  const [cityAId, setCityAId] = useState<string>("lome");
  const [cityBId, setCityBId] = useState<string>("paris");

  // Budget Planner State
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState<number>(150000); // 150k FCFA
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("Tous");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const cityA = CITIES_COST_DATA.find((c) => c.id === cityAId) || CITIES_COST_DATA[0];
  const cityB = CITIES_COST_DATA.find((c) => c.id === cityBId) || CITIES_COST_DATA[6];

  // Price Difference Calculations
  const diffBudgetMonthly = cityB.avgMonthlyBudgetFcfa - cityA.avgMonthlyBudgetFcfa;
  const percentDiffMonthly = Math.round((diffBudgetMonthly / cityA.avgMonthlyBudgetFcfa) * 100);

  const filteredCities = CITIES_COST_DATA.filter((c) => {
    const matchesRegion = selectedRegionFilter === "Tous" || c.region === selectedRegionFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      c.cityName.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q);
    return matchesRegion && matchesSearch;
  });

  const regions = [
    "Tous",
    "Afrique de l'Ouest",
    "Afrique du Nord",
    "Europe",
    "Amérique du Nord",
  ];

  // Helper for budget feasibility
  const getBudgetStatus = (city: CityCostOfLiving, userBudgetFcfa: number) => {
    if (userBudgetFcfa >= city.avgMonthlyBudgetFcfa) {
      return {
        label: "Budget Amplement Suffisant",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: CheckCircle2,
        desc: "Vous pourrez couvrir sereinement vos frais de logement, nourriture et loisirs.",
      };
    } else if (userBudgetFcfa >= city.minMonthlyBudgetFcfa) {
      return {
        label: "Budget Serré mais Faisable",
        badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
        icon: AlertTriangle,
        desc: "Faisable avec une gestion stricte (Cité U, Resto U, pas de superflu) ou un job étudiant.",
      };
    } else {
      return {
        label: "Budget Insuffisant",
        badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
        icon: XCircle,
        desc: "Nécessitera l'obtention d'une bourse d'études ou un soutien familial complémentaire.",
      };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-2xl text-white shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <Wallet className="w-3.5 h-3.5 text-indigo-400" /> Planification Budgétaire & Coût de la Vie Étudiante
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Comparateur du Coût de la Vie Étudiante par Ville & Pays
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Anticipez précisément vos dépenses mensuelles (logement, nourriture, transport, abonnements et frais de scolarité) avant de valider votre choix d'établissement d'enseignement supérieur en Afrique ou à l'International.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-indigo-900/40 p-3 rounded-xl border border-indigo-500/30">
              <span className="font-bold text-amber-300 block mb-0.5">🎓 Variation des Frais de Scolarité :</span>
              <p className="text-slate-300 text-[11px] leading-snug">
                Les droits universitaires et frais de formation dépendent directement de la <strong>filière choisie</strong> (Médecine, Ingénierie/IA, Polytechnique ont des coûts plus élevés que le Droit ou les Lettres).
              </p>
            </div>
            <div className="bg-indigo-900/40 p-3 rounded-xl border border-indigo-500/30">
              <span className="font-bold text-emerald-300 block mb-0.5">🌍 Variation du Coût de la Vie :</span>
              <p className="text-slate-300 text-[11px] leading-snug">
                Le budget mensuel (logement, nourriture, transport) varie en fonction du <strong>pays d'études</strong> (ex: Togo/Bénin ~ 50.000-85.000 FCFA/mois; Sénégal/Côte d'Ivoire ~ 85.000-150.000 FCFA/mois; France/Canada ~ 450.000-880.000 FCFA/mois).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: SIDE-BY-SIDE CITY COMPARISON TOOL */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded border border-emerald-200 uppercase tracking-wider">
              OUTIL INTERACTIF DE COMPARAISON
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
              Comparer 2 Villes d'Études en Direct
            </h3>
          </div>

          {/* Ratio Badge */}
          <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm">
            Différence Moyenne :{" "}
            <span className={percentDiffMonthly > 0 ? "text-rose-400 font-extrabold" : "text-emerald-400 font-extrabold"}>
              {percentDiffMonthly > 0 ? `+${percentDiffMonthly}%` : `${percentDiffMonthly}%`}
            </span>
          </div>
        </div>

        {/* City Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* City A Selector */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-extrabold text-slate-700 block uppercase tracking-wider">
              Ville Origine / Référence (A) :
            </label>
            <select
              value={cityAId}
              onChange={(e) => setCityAId(e.target.value)}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
            >
              {CITIES_COST_DATA.map((c) => (
                <option key={`a-${c.id}`} value={c.id}>
                  {c.flagEmoji} {c.cityName} ({c.country}) — ~{convertFromFcfa(c.avgMonthlyBudgetFcfa, currency)}/mois
                </option>
              ))}
            </select>
          </div>

          {/* City B Selector */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-extrabold text-slate-700 block uppercase tracking-wider">
              Ville Cible / Envisagée (B) :
            </label>
            <select
              value={cityBId}
              onChange={(e) => setCityBId(e.target.value)}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
            >
              {CITIES_COST_DATA.map((c) => (
                <option key={`b-${c.id}`} value={c.id}>
                  {c.flagEmoji} {c.cityName} ({c.country}) — ~{convertFromFcfa(c.avgMonthlyBudgetFcfa, currency)}/mois
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Side-By-Side Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card City A */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-800 shadow-sm">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-2xl mr-2">{cityA.flagEmoji}</span>
                <h4 className="inline text-xl font-extrabold text-white">{cityA.cityName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{cityA.country} • {cityA.region}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget Mensuel Moyen</span>
                <span className="text-lg font-extrabold text-emerald-400">
                  {convertFromFcfa(cityA.avgMonthlyBudgetFcfa, currency)}
                </span>
              </div>
            </div>

            {/* Breakdown per category */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/80">
                <span className="flex items-center gap-2 text-slate-300">
                  <Home className="w-3.5 h-3.5 text-blue-400" /> Logement :
                </span>
                <span className="font-bold text-white">{convertFromFcfa(cityA.housing.avgFcfa, currency)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/80">
                <span className="flex items-center gap-2 text-slate-300">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" /> Nourriture :
                </span>
                <span className="font-bold text-white">{convertFromFcfa(cityA.food.avgFcfa, currency)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/80">
                <span className="flex items-center gap-2 text-slate-300">
                  <Bus className="w-3.5 h-3.5 text-emerald-400" /> Transport :
                </span>
                <span className="font-bold text-white">{convertFromFcfa(cityA.transport.avgFcfa, currency)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/80">
                <span className="flex items-center gap-2 text-slate-300">
                  <Wifi className="w-3.5 h-3.5 text-indigo-400" /> Internet & Énergie :
                </span>
                <span className="font-bold text-white">{convertFromFcfa(cityA.utilities.avgFcfa, currency)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/80">
                <span className="flex items-center gap-2 text-slate-300">
                  <ShoppingBag className="w-3.5 h-3.5 text-rose-400" /> Divers & Fournitures :
                </span>
                <span className="font-bold text-white">{convertFromFcfa(cityA.miscellaneous.avgFcfa, currency)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800 border border-slate-700">
                <span className="flex items-center gap-2 text-amber-300 font-bold">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> Scolarité Publique / an :
                </span>
                <span className="font-extrabold text-amber-300">{convertFromFcfa(cityA.publicTuitionYearFcfa, currency)}</span>
              </div>
            </div>
          </div>

          {/* Card City B */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-800 shadow-sm">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-2xl mr-2">{cityB.flagEmoji}</span>
                <h4 className="inline text-xl font-extrabold text-white">{cityB.cityName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{cityB.country} • {cityB.region}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget Mensuel Moyen</span>
                <span className="text-lg font-extrabold text-emerald-400">
                  {convertFromFcfa(cityB.avgMonthlyBudgetFcfa, currency)}
                </span>
              </div>
            </div>

            {/* Breakdown per category */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/80">
                <span className="flex items-center gap-2 text-slate-300">
                  <Home className="w-3.5 h-3.5 text-blue-400" /> Logement :
                </span>
                <span className="font-bold text-white">{convertFromFcfa(cityB.housing.avgFcfa, currency)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/80">
                <span className="flex items-center gap-2 text-slate-300">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" /> Nourriture :
                </span>
                <span className="font-bold text-white">{convertFromFcfa(cityB.food.avgFcfa, currency)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/80">
                <span className="flex items-center gap-2 text-slate-300">
                  <Bus className="w-3.5 h-3.5 text-emerald-400" /> Transport :
                </span>
                <span className="font-bold text-white">{convertFromFcfa(cityB.transport.avgFcfa, currency)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/80">
                <span className="flex items-center gap-2 text-slate-300">
                  <Wifi className="w-3.5 h-3.5 text-indigo-400" /> Internet & Énergie :
                </span>
                <span className="font-bold text-white">{convertFromFcfa(cityB.utilities.avgFcfa, currency)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/80">
                <span className="flex items-center gap-2 text-slate-300">
                  <ShoppingBag className="w-3.5 h-3.5 text-rose-400" /> Divers & Fournitures :
                </span>
                <span className="font-bold text-white">{convertFromFcfa(cityB.miscellaneous.avgFcfa, currency)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800 border border-slate-700">
                <span className="flex items-center gap-2 text-amber-300 font-bold">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> Scolarité Publique / an :
                </span>
                <span className="font-extrabold text-amber-300">{convertFromFcfa(cityB.publicTuitionYearFcfa, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Synthesis Banner */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <h4 className="font-extrabold flex items-center gap-1.5 text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Analyse d'impact financier ({cityA.cityName} ➔ {cityB.cityName}) :
          </h4>
          <p className="leading-relaxed">
            Pour maintenir un niveau de vie équivalent à {cityA.cityName} ({convertFromFcfa(cityA.avgMonthlyBudgetFcfa, currency)}/mois), vous devrez prévoir un budget d'environ <strong>{convertFromFcfa(cityB.avgMonthlyBudgetFcfa, currency)}/mois</strong> à {cityB.cityName}. 
            {cityB.studentJobOpportunity === "Excellente" || cityB.studentJobOpportunity === "Bonne" ? (
              <span> La ville de {cityB.cityName} offre toutefois de <strong>très bonnes opportunités de jobs étudiants</strong> permettant de couvrir jusqu'à 60% des charges mensuelles.</span>
            ) : null}
          </p>
        </div>
      </div>

      {/* SECTION 2: PERSONAL BUDGET FEASIBILITY CALCULATOR */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-extrabold uppercase">
            SIMULATEUR DE FAISABILITÉ
          </span>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            Tester votre Budget Mensuel Disponible
          </h3>
          <p className="text-xs text-slate-300">
            Saisissez le montant mensuel garanti par votre famille ou vos bourses d'études pour évaluer automatiquement les destinations académiques accessibles.
          </p>
        </div>

        {/* Budget Input Controls */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-xl space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            Votre Budget Mensuel Estimé (en FCFA) :
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step={5000}
              min={20000}
              max={2000000}
              value={monthlyBudgetInput}
              onChange={(e) => setMonthlyBudgetInput(Number(e.target.value) || 0)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-lg font-extrabold text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-xs font-bold text-slate-400 shrink-0">
              ~ {convertFromFcfa(monthlyBudgetInput, currency)}
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            {[50000, 100000, 150000, 250000, 500000].map((amt) => (
              <button
                key={amt}
                onClick={() => setMonthlyBudgetInput(amt)}
                className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                  monthlyBudgetInput === amt
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
                }`}
              >
                {convertFromFcfa(amt, currency)}
              </button>
            ))}
          </div>
        </div>

        {/* Feasibility Grid across all cities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CITIES_COST_DATA.map((city) => {
            const status = getBudgetStatus(city, monthlyBudgetInput);
            const StatusIcon = status.icon;

            return (
              <div
                key={`feasibility-${city.id}`}
                className="bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{city.flagEmoji}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{city.country}</span>
                      <button
                        onClick={() =>
                          toggleSave({
                            id: `city_${city.id}`,
                            type: "cost_city",
                            title: `Budget de vie : ${city.cityName} (${city.country})`,
                            subtitle: `Coût moyen mensuel : ${convertFromFcfa(city.avgMonthlyBudgetFcfa, currency)}`,
                            badge: city.country,
                            extraInfo: `Logement : ${convertFromFcfa(city.housing.avgFcfa, currency)}/mois • Nourriture : ${convertFromFcfa(city.food.avgFcfa, currency)}/mois`,
                            linkTab: "cost-of-living",
                            data: city,
                          })
                        }
                        className={`p-1 rounded transition-colors ${
                          isSaved(`city_${city.id}`)
                            ? "text-rose-500"
                            : "text-slate-400 hover:text-rose-400"
                        }`}
                        title={isSaved(`city_${city.id}`) ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved(`city_${city.id}`) ? "fill-rose-500" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-white text-base">{city.cityName}</h4>

                  <div className="text-xs text-slate-300 space-y-1 border-t border-slate-700/60 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Budget Min :</span>
                      <span className="font-bold">{convertFromFcfa(city.minMonthlyBudgetFcfa, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Budget Moyen :</span>
                      <span className="font-extrabold text-emerald-400">{convertFromFcfa(city.avgMonthlyBudgetFcfa, currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`p-2 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 ${status.badgeColor}`}>
                  <StatusIcon className="w-4 h-4 shrink-0" />
                  <span>{status.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: FULL CITY DIRECTORY & TIPS FROM DR. BALOGAH */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Répertoire des Villes Étudiantes ({filteredCities.length})
          </h3>

          {/* Region Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full text-xs">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                  selectedRegionFilter === reg
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* City Detailed Cards */}
        <div className="space-y-4">
          {filteredCities.map((city) => (
            <div
              key={`dir-${city.id}`}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{city.flagEmoji}</span>
                  <div>
                    <h4 className="text-xl font-extrabold text-slate-900">
                      {city.cityName}, {city.country}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      Région : {city.region} • Opportunités jobs étudiants : <strong className="text-slate-800">{city.studentJobOpportunity}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("institutions")}
                    className="bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Voir Établissements</span>
                  </button>
                </div>
              </div>

              {/* Grid of 5 cost components */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                {/* 1. Housing */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-blue-500" /> Logement
                  </span>
                  <div className="text-sm font-extrabold text-slate-900">
                    {convertFromFcfa(city.housing.avgFcfa, currency)}/m
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">
                    {city.housing.description}
                  </p>
                </div>

                {/* 2. Food */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-amber-500" /> Nourriture
                  </span>
                  <div className="text-sm font-extrabold text-slate-900">
                    {convertFromFcfa(city.food.avgFcfa, currency)}/m
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">
                    {city.food.description}
                  </p>
                </div>

                {/* 3. Transport */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5 text-emerald-500" /> Transport
                  </span>
                  <div className="text-sm font-extrabold text-slate-900">
                    {convertFromFcfa(city.transport.avgFcfa, currency)}/m
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">
                    {city.transport.description}
                  </p>
                </div>

                {/* 4. Utilities */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-indigo-500" /> Internet & Énergie
                  </span>
                  <div className="text-sm font-extrabold text-slate-900">
                    {convertFromFcfa(city.utilities.avgFcfa, currency)}/m
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">
                    {city.utilities.description}
                  </p>
                </div>

                {/* 5. Tuition */}
                <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 space-y-1">
                  <span className="text-amber-800 font-bold flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600" /> Scolarité / An
                  </span>
                  <div className="text-sm font-extrabold text-amber-900">
                    {convertFromFcfa(city.publicTuitionYearFcfa, currency)}
                  </div>
                  <p className="text-[10px] text-amber-800">
                    Scolarité publique moyenne
                  </p>
                </div>
              </div>

              {/* Tips from Cabinet Dr. BALOGAH */}
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-xs space-y-1.5">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Conseils d'Optimisation Budgétaire du Dr. BALOGAH Dibaataba :
                </span>
                <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1">
                  {city.livingTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Counseling Contact Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
            CONSEIL SUR MESURE EN FINANCEMENT D'ÉTUDES
          </span>
          <h3 className="text-xl font-extrabold text-white">
            Besoin d'un montage financier pour votre dossier de visa étudiant ?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Le Docteur BALOGAH Dibaataba vous aide à construire votre plan de financement, vos garanties bancaires et vos demandes de bourses d'études internationales.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("ai-counselor")}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Consulter Dr BALOGAH & Financement</span>
        </button>
      </div>
    </div>
  );
};

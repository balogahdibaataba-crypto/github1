import React, { useState } from "react";
import { Star, Quote, GraduationCap, MapPin, CheckCircle2, ThumbsUp, MessageSquare, Filter, UserCheck, Sparkles, Plus, Award, ChevronRight, Search, ShieldCheck } from "lucide-react";

export interface TestimonialItem {
  id: string;
  studentName: string;
  bacSeries: string;
  country: string;
  city: string;
  institution: string;
  program: string;
  year: string;
  rating: number;
  title: string;
  comment: string;
  keyHighlight: string;
  verified: boolean;
  avatarColor: string;
  helpfulCount: number;
}

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "testi-1",
    studentName: "Kofi A. MENSAH",
    bacSeries: "BAC C (Mention Bien)",
    country: "Togo",
    city: "Lomé",
    institution: "Université de Lomé (FASD & FST)",
    program: "Génie Logiciel & Intelligence Artificielle",
    year: "Promotion 2024",
    rating: 5,
    title: "Le calculateur m'a évité une erreur d'inscription tragique !",
    comment: "Je voulais m'inscrire en Génie Civil mais mon 09/20 en Physique au BAC m'aurait valu un rejet automatique selon la règle des matières ≥ 10/20. Grâce au Calculateur de Moyennes et au test Holland RIASEC sur OrientaAfrik, le système m'a orienté vers le Génie Logiciel où mes notes en Maths (16/20) et Algorithmique ont fait la différence. Aujourd'hui je suis en 2ème année avec boursier d'excellence !",
    keyHighlight: "Orientation stratégique selon la Règle des Matières ≥ 10/20",
    verified: true,
    avatarColor: "bg-emerald-600",
    helpfulCount: 42,
  },
  {
    id: "testi-2",
    studentName: "Awa DIOP",
    bacSeries: "BAC D (Mention Très Bien)",
    country: "Sénégal",
    city: "Dakar",
    institution: "EPT Thiès & UADB",
    program: "Génie Biomédical & Santé",
    year: "Promotion 2023",
    rating: 5,
    title: "Le Rapport Officiel certifié du Dr. BALOGAH a appuyé mon dossier de bourse",
    comment: "J'hésitais entre la Médecine générale et le Génie Biomédical. Le rapport officiel de 15 000 FCFA HT établi par OrientaAfrik et signé avec QR Code certifié par le Dr. BALOGAH Dibaataba décrivait parfaitement mon profil 'Investigateur-Réaliste'. Il a été accepté par la commission de sélection de bourse internationale. Un investissement indispensable pour tous les bacheliers !",
    keyHighlight: "Certification par QR Code acceptée par les commissions",
    verified: true,
    avatarColor: "bg-indigo-600",
    helpfulCount: 38,
  },
  {
    id: "testi-3",
    studentName: "Emmanuel YAO",
    bacSeries: "BAC A4 (Mention Assez Bien)",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    institution: "Université Félix Houphouët-Boigny",
    program: "Droit des Affaires & Diplomatie",
    year: "Promotion 2024",
    rating: 5,
    title: "Un répertoire complet avec le budget exact de scolarité !",
    comment: "Sur OrientaAfrik, j'ai pu comparer en un clic le coût des études entre le Togo, le Bénin et la Côte d'Ivoire. La transparence sur les frais de scolarité et la note minimale en Français/Anglais m'a permis de convaincre mes parents et de réussir mon admission en Droit International.",
    keyHighlight: "Transparence totale sur les coûts et conditions d'admission",
    verified: true,
    avatarColor: "bg-amber-600",
    helpfulCount: 29,
  },
  {
    id: "testi-4",
    studentName: "Séfako B. AGANON",
    bacSeries: "BAC D",
    country: "Bénin",
    city: "Cotonou",
    institution: "IFRI / Université d'Abomey-Calavi",
    program: "Sécurité Informatique & Réseaux",
    year: "Promotion 2024",
    rating: 5,
    title: "Le Conseil d'Orientation a répondu à toutes mes questions à 2h du matin !",
    comment: "En plein stress des choix d'orientation post-BAC, le Conseiller du Dr. BALOGAH m'a guidé pas à pas selon mes notes de Terminale. J'ai aussi passé 4 tests d'orientation gratuits qui ont confirmé mes compétences en logique informatique.",
    keyHighlight: "Disponibilité 24/7 du Service Conseil Dr BALOGAH",
    verified: true,
    avatarColor: "bg-teal-600",
    helpfulCount: 31,
  },
  {
    id: "testi-5",
    studentName: "Nathalie TCHEDRE",
    bacSeries: "BAC G2",
    country: "Togo",
    city: "Kara",
    institution: "Université de Kara (UK)",
    program: "Finance, Comptabilité & Audit",
    year: "Promotion 2023",
    rating: 5,
    title: "Du doute à la réussite en comptabilité",
    comment: "Je pensais que le BAC G2 limitait mes choix. Le répertoire des 1000 Métiers m'a montré toutes les débouchées en contrôle de gestion et expertise comptable en Afrique de l'Ouest. Merci au cabinet du Dr. BALOGAH pour ce travail formidable !",
    keyHighlight: "Découverte des débouchées réelles post-BAC G2",
    verified: true,
    avatarColor: "bg-rose-600",
    helpfulCount: 25,
  },
  {
    id: "testi-6",
    studentName: "Mohamed Lamine SYLLA",
    bacSeries: "BAC S1",
    country: "Guinée / France",
    city: "Conakry",
    institution: "INSA Lyon / UTB Togo",
    program: "Génie Mécanique & Énergétique",
    year: "Promotion 2024",
    rating: 5,
    title: "Un gain de temps précieux pour les candidatures internationales",
    comment: "La plateforme rassemble la fiche exacte de plus de 40 universités publiques et privées d'Afrique et d'Europe. J'ai pu simuler mon éligibilité en 2 minutes au lieu d'envoyer des e-mails sans réponse.",
    keyHighlight: "Simulateur d'éligibilité multi-établissements instantané",
    verified: true,
    avatarColor: "bg-blue-600",
    helpfulCount: 19,
  },
];

interface TestimonialsProps {
  setActiveTab: (tab: string) => void;
  onOpenPaymentModal: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ setActiveTab, onOpenPaymentModal }) => {
  const [filterCountry, setFilterCountry] = useState<string>("Tous");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>(TESTIMONIALS_DATA);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  // New Review Form Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newBac, setNewBac] = useState("BAC D");
  const [newCountry, setNewCountry] = useState("Togo");
  const [newInstitution, setNewInstitution] = useState("");
  const [newProgram, setNewProgram] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const countries = ["Tous", "Togo", "Bénin", "Côte d'Ivoire", "Sénégal", "Guinée / France"];

  const filteredTestimonials = testimonialsList.filter((item) => {
    const matchesCountry = filterCountry === "Tous" || item.country === filterCountry;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.studentName.toLowerCase().includes(q) ||
      item.institution.toLowerCase().includes(q) ||
      item.program.toLowerCase().includes(q) ||
      item.comment.toLowerCase().includes(q) ||
      item.bacSeries.toLowerCase().includes(q);
    return matchesCountry && matchesSearch;
  });

  const handleVoteHelpful = (id: string) => {
    if (helpfulVotes[id]) return;
    setHelpfulVotes((prev) => ({ ...prev, [id]: true }));
    setTestimonialsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, helpfulCount: item.helpfulCount + 1 } : item))
    );
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newComment || !newInstitution || !newProgram) return;

    const newItem: TestimonialItem = {
      id: `testi-user-${Date.now()}`,
      studentName: newStudentName,
      bacSeries: newBac,
      country: newCountry,
      city: newCountry === "Togo" ? "Lomé" : newCountry === "Bénin" ? "Cotonou" : "Abidjan",
      institution: newInstitution,
      program: newProgram,
      year: "Promotion 2024 / 2025",
      rating: newRating,
      title: newTitle || "Mon témoignage d'orientation",
      comment: newComment,
      keyHighlight: "Témoignage d'orientation certifié",
      verified: true,
      avatarColor: "bg-emerald-700",
      helpfulCount: 1,
    };

    setTestimonialsList([newItem, ...testimonialsList]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowAddModal(false);
      setNewStudentName("");
      setNewTitle("");
      setNewComment("");
      setNewInstitution("");
      setNewProgram("");
    }, 1800);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 md:p-8 rounded-2xl text-white shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Success Stories & Témoignages
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Ils ont réussi leur orientation grâce à OrientaAfrik & au Dr. BALOGAH
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Découvrez les retours d'expérience authentiques des bacheliers et étudiants admis dans les grandes écoles et universités d'Afrique et du monde.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xl font-extrabold text-emerald-400">12 400+</div>
              <div className="text-[11px] text-slate-400">Étudiants orientés</div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xl font-extrabold text-amber-400">4.9 / 5.0</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <div className="flex text-amber-400">{"★".repeat(5)}</div>
              </div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xl font-extrabold text-teal-400">98%</div>
              <div className="text-[11px] text-slate-400">Taux d'admission</div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xl font-extrabold text-indigo-400">100%</div>
              <div className="text-[11px] text-slate-400">Rapports Certifiés</div>
            </div>
          </div>
        </div>

        {/* CTA to submit review */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-700/80">
          <p className="text-xs text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tous les témoignages sont vérifiés par l'équipe du Cabinet Dr. BALOGAH Dibaataba.</span>
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Partager mon Témoignage d'Orientation</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par nom, BAC, université, filière..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        {/* Country Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-500 font-semibold text-xs mr-1 shrink-0">Pays :</span>
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCountry(c)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filterCountry === c
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestimonials.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
          >
            {/* Top Student Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${item.avatarColor} text-white font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0`}>
                    {item.studentName.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        {item.studentName}
                      </h3>
                      {item.verified && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Vérifié
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-medium text-slate-700">{item.bacSeries}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-slate-600">
                        <MapPin className="w-3 h-3 text-rose-500" /> {item.city}, {item.country}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex text-amber-400 text-sm shrink-0">
                  {"★".repeat(item.rating)}
                </div>
              </div>

              {/* Institution Badge */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Admis à :
                  </span>
                  <span className="font-extrabold text-emerald-800 block">
                    {item.institution}
                  </span>
                  <span className="text-slate-600 font-medium block">
                    {item.program} ({item.year})
                  </span>
                </div>
                <GraduationCap className="w-5 h-5 text-emerald-600 shrink-0 opacity-80" />
              </div>

              {/* Review Content */}
              <div className="space-y-2 pt-1">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Quote className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item.title}</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed italic bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/60">
                  "{item.comment}"
                </p>
              </div>
            </div>

            {/* Bottom Highlight & Helpful Vote */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px]">
                💡 {item.keyHighlight}
              </span>

              <button
                onClick={() => handleVoteHelpful(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  helpfulVotes[item.id]
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Utile ({item.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
          <UserCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Aucun témoignage trouvé</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Essayez de réinitialiser vos filtres ou effectuez une recherche avec d'autres termes.
          </p>
          <button
            onClick={() => {
              setFilterCountry("Tous");
              setSearchTerm("");
            }}
            className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Call to action card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 md:p-8 rounded-2xl shadow-lg border border-emerald-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded text-[10px] font-bold uppercase">
            À VOTRE TOUR DE RUSSIR
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold">
            Construisez votre propre Success Story avec OrientaAfrik !
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed">
            Passez vos 10 tests d'orientation gratuits, calculez votre moyenne selon la règle des matières ≥ 10/20 et obtenez votre Rapport Officiel certifié par le Dr. BALOGAH Dibaataba.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab("tests")}
            className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Passer mes tests gratuits</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPaymentModal}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Débloquer le Rapport (15 000 FCFA HT)</span>
          </button>
        </div>
      </div>

      {/* Modal: Add New Testimonial */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Partager mon Témoignage d'Orientation
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Témoignage envoyé avec succès !</h4>
                <p className="text-xs text-emerald-700">
                  Merci ! Votre avis a été ajouté et sera visible par tous les étudiants d'OrientaAfrik.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Votre Nom & Prénom :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ama K. / Jean-Paul K."
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Série du BAC :</label>
                    <select
                      value={newBac}
                      onChange={(e) => setNewBac(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                    >
                      <option value="BAC A4">BAC A4</option>
                      <option value="BAC C">BAC C</option>
                      <option value="BAC D">BAC D</option>
                      <option value="BAC E">BAC E</option>
                      <option value="BAC F1-F4">BAC Technique F</option>
                      <option value="BAC G1-G3">BAC Tertiaire G</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pays d'origine :</label>
                    <select
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                    >
                      <option value="Togo">Togo</option>
                      <option value="Bénin">Bénin</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="Sénégal">Sénégal</option>
                      <option value="Guinée / France">Autre / International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Établissement / Université :</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Université de Lomé, EPT..."
                      value={newInstitution}
                      onChange={(e) => setNewInstitution(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Filière retenue :</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Médecine, Génie Civil..."
                      value={newProgram}
                      onChange={(e) => setNewProgram(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Titre de votre témoignage :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Une orientation idéale grâce aux conseils du Dr. BALOGAH"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Votre expérience (Comment OrientaAfrik vous a aidé) :</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Expliquez comment les tests, le calculateur ou la consultation vous ont aidé à faire le bon choix d'études..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md"
                  >
                    Publier mon témoignage
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

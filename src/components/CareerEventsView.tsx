import React, { useState } from "react";
import { CareerEvent } from "../types";
import {
  Calendar as CalendarIcon,
  Video,
  Building,
  Clock,
  MapPin,
  Users,
  Download,
  ExternalLink,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Share2,
  Bell,
  Award,
  Globe,
  UserCheck,
  Megaphone,
  ChevronRight,
  BookOpen,
} from "lucide-react";

// Sample Career Events Data relevant to West Africa & International Academic Deadlines
const SAMPLE_EVENTS: CareerEvent[] = [
  {
    id: "evt-1",
    title: "Webinaire : Réussir son Orientation Post-Bac & Choix des Filières UEMOA (2026)",
    category: "Webinaire",
    organizer: "Cabinet OrientaAfrik & Dr. BALOGAH Dibaataba",
    startDate: "2026-08-10T15:00:00Z",
    endDate: "2026-08-10T17:00:00Z",
    location: "En Ligne (Google Meet & Direct Facebook)",
    description:
      "Session interactive guidée par le Dr. BALOGAH Dibaataba sur les stratégies de choix des filières d'avenir en Afrique de l'Ouest, l'évaluation des débouchés du Bac A, C, D, E, F, G et l'accès aux bourses universitaires.",
    speakers: ["Dr. BALOGAH Dibaataba (Enseignant-Chercheur UL)", "Mme KOUASSI Nadège (Spécialiste Bourses Campus France)"],
    targetAudience: "Nouveaux Bacheliers, Élèves de Terminale & Parents d'Élèves",
    registrationUrl: "https://meet.google.com/orienta-afrik-2026",
    isFeatured: true,
  },
  {
    id: "evt-2",
    title: "Grand Salon Annuel des Universités & Grandes Écoles de Lomé",
    category: "Salon Étudiant",
    organizer: "Ministère de l'Enseignement Supérieur & OrientaAfrik",
    startDate: "2026-08-20T09:00:00Z",
    endDate: "2026-08-22T18:00:00Z",
    location: "Palais des Congrès de Lomé, Togo",
    description:
      "Le plus grand rassemblement universitaire du Togo. Plus de 40 universités publiques et instituts privés (UL, UK, ESGIS, IAEC, Formatec, CIEEE) présents pour conseiller les bacheliers et enregistrer les pré-inscriptions directes.",
    speakers: ["Représentants Université de Lomé", "Doyens de Facultés & Directeurs d'Instituts"],
    targetAudience: "Élèves, Étudiants, Professionnels en Reconversion",
    registrationUrl: "https://salon-universites.togo-edu.org",
    isFeatured: true,
  },
  {
    id: "evt-3",
    title: "Date Limite : Candidatures Bourses d'Excellence Master & Doctorat UEMOA",
    category: "Date Limite Recrutement",
    organizer: "Commission UEMOA & Banque Ouest Africaine de Développement (BOAD)",
    startDate: "2026-08-31T23:59:00Z",
    endDate: "2026-08-31T23:59:00Z",
    location: "Soumission en Ligne (Portail Candidatures UEMOA)",
    description:
      "Dernier jour pour soumettre votre dossier de candidature au programme de Bourses Régionales UEMOA pour les Masters Scientifiques, Technologies du Numérique et Ingéniorat.",
    targetAudience: "Étudiants diplômés de Licence / BAC+3 (Mention Bien ou Très Bien)",
    registrationUrl: "https://bourses.uemoa.int",
    isFeatured: false,
  },
  {
    id: "evt-4",
    title: "Atelier Pratique : Rédaction de CV Impactant & Réussite des Tests Psychotechniques",
    category: "Atelier & Masterclass",
    organizer: "OrientaAfrik Talent Hub",
    startDate: "2026-09-05T14:00:00Z",
    endDate: "2026-09-05T17:00:00Z",
    location: "Agora Senghor de Lomé & Live Zoom",
    description:
      "Masterclass intensive sur l'optimisation des CV aux normes des recruteurs africains et internationaux, la préparation mentale aux tests de logique / QI et la simulation d'entretiens d'embauche.",
    speakers: ["M. EKLOU Kodjo (Directeur RH Banque)", "Dr. BALOGAH Dibaataba"],
    targetAudience: "Étudiants en fin de cycle, Demandeurs d'emploi & Jeunes Diplômés",
    isFeatured: false,
  },
  {
    id: "evt-5",
    title: "Forfait Recrutement Jeunes Talents Informatique & Banque WAP",
    category: "Date Limite Recrutement",
    organizer: "Réseau Inter-Entreprises WAEMU",
    startDate: "2026-09-15T18:00:00Z",
    endDate: "2026-09-15T18:00:00Z",
    location: "Guichet Unique OrientaAfrik",
    description:
      "Clôture du dépôt des profils ayant validé les tests psychotechniques pour le recrutement groupé de 50 jeunes diplômés en Développeurs Web, Analystes Financiers et Juristes d'Entreprises.",
    targetAudience: "Candidats inscrits sur la CVthèque OrientaAfrik",
    isFeatured: false,
  },
];

export const CareerEventsView: React.FC = () => {
  const [events, setEvents] = useState<CareerEvent[]>(SAMPLE_EVENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<CareerEvent | null>(null);

  // New Event Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<CareerEvent["category"]>("Webinaire");
  const [newOrganizer, setNewOrganizer] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAudience, setNewAudience] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const categories = [
    "ALL",
    "Webinaire",
    "Salon Étudiant",
    "Date Limite Recrutement",
    "Atelier & Masterclass",
  ];

  // ICS Calendar Generator
  const downloadICS = (event: CareerEvent) => {
    const formatDateToICS = (isoStr: string) => {
      const date = new Date(isoStr);
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const startICS = formatDateToICS(event.startDate);
    const endICS = formatDateToICS(event.endDate);

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//OrientaAfrik//Career Events//FR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:evt-${event.id}@orientaafrik.org`,
      `DTSTAMP:${startICS}`,
      `DTSTART:${startICS}`,
      `DTEND:${endICS}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, " ")} | Organisé par: ${event.organizer}`,
      `LOCATION:${event.location}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Evenement_${event.id}_OrientaAfrik.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Google Calendar Link Generator
  const getGoogleCalendarUrl = (event: CareerEvent) => {
    const formatDate = (isoStr: string) => {
      return new Date(isoStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
    };
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\n\nOrganisateur: ${event.organizer}`);
    const location = encodeURIComponent(event.location);
    const dates = `${formatDate(event.startDate)}/${formatDate(event.endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const toggleRegistration = (eventId: string) => {
    setRegisteredEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newOrganizer || !newStartDate) return;

    const created: CareerEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      organizer: newOrganizer,
      startDate: newStartDate,
      endDate: newEndDate || newStartDate,
      location: newLocation || "En ligne / À préciser",
      description: newDescription,
      targetAudience: newAudience || "Étudiants & Jeunes Professionnels",
      registrationUrl: newUrl,
      isFeatured: false,
    };

    setEvents([created, ...events]);
    setShowCreateModal(false);

    // Reset form
    setNewTitle("");
    setNewOrganizer("");
    setNewStartDate("");
    setNewEndDate("");
    setNewLocation("");
    setNewDescription("");
    setNewAudience("");
    setNewUrl("");
  };

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "ALL" || evt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* HEADER HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-indigo-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <CalendarIcon className="w-3.5 h-3.5" /> Agenda de l'Orientation & Recrutement 2026
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Événements Académiques & Salons d'Orientation
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Ne manquez aucun webinaire d'orientation, salon universitaire, atelier de rédaction de CV ou date limite de bourses. Ajoutez les événements directement à votre agenda Google ou iCal.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publier un Événement / Salon</span>
        </button>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat === "ALL" && <Globe className="w-3.5 h-3.5" />}
                {cat === "Webinaire" && <Video className="w-3.5 h-3.5" />}
                {cat === "Salon Étudiant" && <Building className="w-3.5 h-3.5" />}
                {cat === "Date Limite Recrutement" && <Clock className="w-3.5 h-3.5" />}
                {cat === "Atelier & Masterclass" && <Users className="w-3.5 h-3.5" />}
                <span>{cat === "ALL" ? "Tous les Événements" : cat}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher salon, webinaire, ville..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* EVENTS LIST GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => {
          const startDateObj = new Date(event.startDate);
          const isRegistered = registeredEventIds.includes(event.id);

          return (
            <div
              key={event.id}
              className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-between transition-all space-y-4 ${
                event.isFeatured
                  ? "border-amber-300 ring-1 ring-amber-200 bg-gradient-to-br from-amber-50/20 via-white to-white"
                  : "border-slate-200 hover:border-indigo-300"
              }`}
            >
              <div className="space-y-3">
                {/* Top Badge & Date Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Date Block */}
                    <div className="bg-indigo-900 text-white p-2.5 rounded-xl text-center shrink-0 min-w-[54px] shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-indigo-300">
                        {startDateObj.toLocaleDateString("fr-FR", { month: "short" })}
                      </span>
                      <span className="text-xl font-black leading-none block">
                        {startDateObj.getDate()}
                      </span>
                    </div>

                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border flex items-center gap-1 w-fit mb-1 bg-indigo-50 text-indigo-800 border-indigo-200">
                        {event.category === "Webinaire" && <Video className="w-3 h-3 text-indigo-600" />}
                        {event.category === "Salon Étudiant" && <Building className="w-3 h-3 text-emerald-600" />}
                        {event.category === "Date Limite Recrutement" && <Clock className="w-3 h-3 text-red-600" />}
                        {event.category === "Atelier & Masterclass" && <Users className="w-3 h-3 text-purple-600" />}
                        <span>{event.category}</span>
                      </span>

                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {startDateObj.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          (GMT)
                        </span>
                      </span>
                    </div>
                  </div>

                  {event.isFeatured && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded-full border border-amber-300 flex items-center gap-1 shrink-0">
                      <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" /> Vedette
                    </span>
                  )}
                </div>

                {/* Event Title & Organizer */}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs font-bold text-indigo-700 mt-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{event.organizer}</span>
                  </p>
                </div>

                {/* Location & Target */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-900">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Cible : {event.targetAudience}</span>
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {event.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {/* Calendar Add Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => downloadICS(event)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200"
                      title="Télécharger le fichier .ics pour Outlook, Apple Calendar, Thunderbird"
                    >
                      <Download className="w-3 h-3 text-indigo-600" />
                      <span>Fichier .ICS</span>
                    </button>

                    <a
                      href={getGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 border border-blue-200"
                      title="Ajouter directement à votre agenda Google Calendar"
                    >
                      <CalendarIcon className="w-3 h-3 text-blue-600" />
                      <span>Google Agenda</span>
                    </a>
                  </div>

                  <button
                    onClick={() => toggleRegistration(event.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                      isRegistered
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isRegistered ? "text-emerald-600" : ""}`} />
                    <span>{isRegistered ? "Rappel Activé" : "S'inscrire / Rappel"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE EVENT MODAL FOR PARTNERS */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase border border-amber-200">
                  Guichet Événements Académiques
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  Publier un Événement ou un Salon d'Orientation
                </h3>
                <p className="text-xs text-slate-500">
                  Annoncez vos webinaires, salons d'étudiants ou concours à la communauté estudiantine UEMOA.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-800 text-sm font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Intitulé de l'Événement *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex: Salon de l'Enseignement Supérieur de Niamey 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Catégorie *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Webinaire">Webinaire</option>
                    <option value="Salon Étudiant">Salon Étudiant</option>
                    <option value="Date Limite Recrutement">Date Limite Recrutement</option>
                    <option value="Atelier & Masterclass">Atelier & Masterclass</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Organisateur *</label>
                  <input
                    type="text"
                    required
                    value={newOrganizer}
                    onChange={(e) => setNewOrganizer(e.target.value)}
                    placeholder="ex: Université de Kara / Campus France"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Date & Heure Début *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Date & Heure Fin</label>
                  <input
                    type="datetime-local"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Lieu / Lien Virtuel</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="ex: Palais des Congrès de Cotonou OR Lien Zoom"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Public Cible</label>
                <input
                  type="text"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  placeholder="ex: Bacheliers 2026, Étudiants Master, Chercheurs"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Lien d'Inscription (Optionnel)</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Description Détaillée</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Présentez les objectifs, intervenants et modalités de l'événement..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  Publier l'Événement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

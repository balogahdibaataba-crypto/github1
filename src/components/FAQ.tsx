import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, HelpCircle, GraduationCap, Compass, Calculator, CreditCard, Award, Phone, Mail, Sparkles, MessageSquare, ArrowRight } from "lucide-react";

interface FAQItem {
  id: string;
  category: "Orientation & Tests" | "Candidatures & Établissements" | "Calculateur & Exigences" | "Paiement & Rapport Officiel" | "Cabinet Dr. BALOGAH";
  question: string;
  answer: string;
  tags: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "Orientation & Tests",
    question: "Comment fonctionne le bilan d'orientation et les tests psychométriques sur OrientaAfrik ?",
    answer: "OrientaAfrik met à votre disposition 10 tests scientifiques certifiés (Holland RIASEC, Intelligences Multiples, Aptitudes Scientifiques et Littéraires, Bilan de Compétences...). Chaque test évalue un aspect spécifique de vos aptitudes et centres d'intérêt. À la fin de chaque test, un diagnostic instantané est généré et sauvegardé automatiquement dans votre dossier pour alimenter votre Rapport Officiel d'Orientation.",
    tags: ["Tests", "Bilan", "RIASEC", "Gratuit"],
  },
  {
    id: "faq-2",
    category: "Orientation & Tests",
    question: "Les 10 tests d'orientation sont-ils entièrement gratuits ?",
    answer: "Oui, la passation de l'ensemble des 10 tests psychométriques et bilans de compétences est 100% gratuite et accessible sans limite. Vous pouvez repasser les tests autant de fois que vous le désirez afin d'affiner votre profil.",
    tags: ["Gratuit", "Passation", "Bilan"],
  },
  {
    id: "faq-3",
    category: "Candidatures & Établissements",
    question: "Comment choisir un établissement et consulter les conditions d'admission ?",
    answer: "Rendez-vous dans l'onglet 'Établissements' de l'application. Vous y trouverez un annuaire international recensant les universités et grandes écoles publiques et privées d'Afrique (Togo, Bénin, Côte d'Ivoire, Sénégal, Maroc...) et du monde. Vous pouvez filtrer par pays, continent, statut (public/privé) et cliquer sur 'Voir les Filières & Conditions' pour consulter les matières clés requises, la scolarité et le budget de vie estimé.",
    tags: ["Universités", "Admission", "Scolarité", "Afrique"],
  },
  {
    id: "faq-4",
    category: "Candidatures & Établissements",
    question: "Comment tester la compatibilité de mes notes avec une filière spécifique ?",
    answer: "Sur la fiche de chaque établissement ou filière, cliquez sur le bouton 'Tester mes notes pour cette filière'. Vous serez automatiquement redirigé vers le Calculateur de Moyennes pré-rempli avec la filière sélectionnée.",
    tags: ["Moyenne", "Filières", "Éligibilité"],
  },
  {
    id: "faq-5",
    category: "Calculateur & Exigences",
    question: "Qu'est-ce que la 'Règle des Matières ≥ 10/20' dans le Calculateur de Moyennes ?",
    answer: "Dans la majorité des systèmes universitaires et grandes écoles, l'admission dans une filière spécialisée exige non seulement une moyenne générale suffisante (≥ 10/20), mais également une note minimale de 10/20 dans les matières fondamentales de la discipline (ex: Mathématiques et Physique pour le Génie Civil, Français et Anglais pour la Diplomatie). Notre calculateur vérifie en temps réel le respect strict de cette règle et signale toute note insuffisante.",
    tags: ["Calculateur", "Exigences", "Règle 10/20", "Admission"],
  },
  {
    id: "faq-6",
    category: "Calculateur & Exigences",
    question: "Que faire si ma moyenne dans une matière clé est inférieure à 10/20 ?",
    answer: "Si le calculateur détecte une note inférieure à 10/20 dans une matière exigée, la plateforme vous recommande un programme de remise à niveau ou un soutien ciblé. Vous pouvez également consulter le Conseiller Dr BALOGAH qui vous proposera des filières alternatives parfaitement adaptées à la répartition réelle de vos notes.",
    tags: ["Remise à niveau", "Filières alternatives", "Notes"],
  },
  {
    id: "faq-7",
    category: "Paiement & Rapport Officiel",
    question: "Pourquoi le Rapport Officiel d'Orientation imprimable coûte-t-il 15 000 FCFA HT ?",
    answer: "La consultation d'orientation complète et l'établissement du document officiel certifié par le Docteur BALOGAH Dibaataba constituent un service d'expertise professionnelle. Les frais de 15 000 FCFA HT (~23.00 € / $25.00) permettent de couvrir les coûts d'analyse d'orientation spécialisée et l'authentification officielle par QR Code certifié.",
    tags: ["Rapport", "Paiement", "15000 FCFA", "Certification"],
  },
  {
    id: "faq-8",
    category: "Paiement & Rapport Officiel",
    question: "Quels sont les modes de paiement disponibles sur OrientaAfrik ?",
    answer: "Nous acceptons les paiements Mobile Money directs en Afrique : Mixx by Yass (+228 90966765) et Moov Money (+228 99372074). Pour la diaspora et l'international, les paiements par Carte Bancaire Visa / Mastercard en EUR ou USD sont également intégrés et sécurisés.",
    tags: ["Mixx by Yass", "Moov Money", "Carte Visa", "Mobile Money"],
  },
  {
    id: "faq-9",
    category: "Paiement & Rapport Officiel",
    question: "Comment vérifier l'authenticité de mon Rapport d'Orientation imprimé ?",
    answer: "Chaque rapport officiel comporte au bas de sa dernière page un QR Code unique d'authentification lié au hash de vérification (VERIFIED-BAL78Dib0102). La mention 'Signé et certifié par OrientaAfrik et Certification' et la signature officielle du Docteur BALOGAH Dibaataba attestent de sa validité auprès des établissements d'enseignement.",
    tags: ["QR Code", "Authentification", "Signature", "Validité"],
  },
  {
    id: "faq-10",
    category: "Cabinet Dr. BALOGAH",
    question: "Qui est le Docteur BALOGAH Dibaataba ?",
    answer: "Le Docteur BALOGAH Dibaataba est Conseiller d'Orientation Scolaire et Professionnelle reconnu, spécialiste des systèmes éducatifs africains et internationaux. Il accompagne les élèves, étudiants et professionnels dans la structuration de leur projet académique et de carrière.",
    tags: ["Dr. BALOGAH", "Expertise", "Conseiller"],
  },
  {
    id: "faq-11",
    category: "Cabinet Dr. BALOGAH",
    question: "Comment solliciter une consultation directe ou un accompagnement personnalisé ?",
    answer: "Vous pouvez contacter directement le cabinet du Dr. BALOGAH Dibaataba par téléphone au +228 90966765 (Mixx by Yass) / +228 99372074 (Moov Money) ou par e-mail à dbalogah@yahoo.com. Vous pouvez aussi réserver des prestations personnalisées (révision de CV, montage de dossier de candidature, coaching individuel) dans l'onglet 'Espace Client & Tarifs'.",
    tags: ["Consultation", "Contact", "Coaching", "Dossier"],
  },
];

interface FAQProps {
  setActiveTab: (tab: string) => void;
  onOpenPaymentModal: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ setActiveTab, onOpenPaymentModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  const categories = [
    "Toutes",
    "Orientation & Tests",
    "Candidatures & Établissements",
    "Calculateur & Exigences",
    "Paiement & Rapport Officiel",
    "Cabinet Dr. BALOGAH",
  ];

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === "Toutes" || item.category === selectedCategory;

    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md border border-slate-700">
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <HelpCircle className="w-3.5 h-3.5" /> Centre d'Aide & Questions Fréquentes
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Foire Aux Questions (FAQ) - OrientaAfrik
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Retrouvez rapidement toutes les réponses concernant l'orientation scolaire, la passation des tests, les règles d'admission en université, les tarifs et l'obtention de votre Rapport Officiel d'Orientation certifié par le Dr. BALOGAH Dibaataba.
          </p>
        </div>

        {/* Search Bar & Category Selectors */}
        <div className="mt-6 space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Rechercher une question (ex: rapport, 15000 FCFA, tests, filières, paiement)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex justify-between items-center text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200">
        <span className="font-semibold text-slate-800">
          Questions trouvées : <strong className="text-emerald-700">{filteredFAQs.length}</strong> réponse(s)
        </span>
        <span className="text-slate-500">
          Catégorie active : <strong>{selectedCategory}</strong>
        </span>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq) => {
          const isOpen = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className={`bg-white rounded-xl border transition-all overflow-hidden ${
                isOpen ? "border-emerald-500 shadow-sm ring-1 ring-emerald-500/20" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-3 bg-white hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold rounded">
                      {faq.category}
                    </span>
                    {faq.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {faq.question}
                  </h3>
                </div>

                <div className="p-1 rounded-lg bg-slate-100 text-slate-600 shrink-0 mt-1">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Answer Content */}
              {isOpen && (
                <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 text-slate-700 text-xs leading-relaxed space-y-3">
                  <p className="whitespace-pre-line text-slate-800 font-medium pt-3">
                    {faq.answer}
                  </p>

                  {/* Contextual Action Shortcut */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {faq.category === "Orientation & Tests" && (
                      <button
                        onClick={() => setActiveTab("tests")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Passer un test d'orientation gratuit</span>
                      </button>
                    )}

                    {faq.category === "Candidatures & Établissements" && (
                      <button
                        onClick={() => setActiveTab("institutions")}
                        className="bg-slate-900 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Consulter le répertoire des établissements</span>
                      </button>
                    )}

                    {faq.category === "Calculateur & Exigences" && (
                      <button
                        onClick={() => setActiveTab("calculator")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Ouvrir le Calculateur de Moyennes</span>
                      </button>
                    )}

                    {faq.category === "Paiement & Rapport Officiel" && (
                      <button
                        onClick={onOpenPaymentModal}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Payer et débloquer le Rapport (15 000 FCFA HT)</span>
                      </button>
                    )}

                    {faq.category === "Cabinet Dr. BALOGAH" && (
                      <button
                        onClick={() => setActiveTab("ai-counselor")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Poser une question au Conseiller Dr BALOGAH</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredFAQs.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">Aucune question ne correspond à votre recherche</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Essayez de modifier vos termes de recherche ou de changer de catégorie. Vous pouvez aussi poser directement votre question au Conseiller Dr BALOGAH.
            </p>
            <button
              onClick={() => setActiveTab("ai-counselor")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consulter Dr BALOGAH</span>
            </button>
          </div>
        )}
      </div>

      {/* Direct Contact Support Box */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-bold">
            SUPPORT DIREC• CABINET DR. BALOGAH
          </span>
          <h3 className="text-xl font-extrabold text-white">
            Une question spécifique sur votre projet d'études ?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Le Docteur BALOGAH Dibaataba et son équipe vous assistent directement par Téléphone / WhatsApp ou par E-mail.
          </p>
        </div>

        <div className="space-y-2 text-xs w-full md:w-auto">
          <a
            href="tel:+22890966765"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Mixx by Yass : +228 90966765</span>
          </a>
          <a
            href="tel:+22899372074"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Moov Money : +228 99372074</span>
          </a>
          <a
            href="mailto:dbalogah@yahoo.com"
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 px-4 rounded-xl transition-all border border-slate-700"
          >
            <Mail className="w-4 h-4 text-rose-400" />
            <span>dbalogah@yahoo.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

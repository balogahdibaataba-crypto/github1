import React from "react";
import { Award, GraduationCap, ShieldCheck, CheckCircle2, ArrowRight, Star, HelpCircle, FileText, Phone, Mail, Globe } from "lucide-react";
import { OrientaAfrikOfficialLogo } from "./OrientaAfrikOfficialLogo";

interface AboutViewProps {
  setActiveTab: (tab: string) => void;
  currency: "FCFA" | "EUR" | "USD";
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveTab, currency }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4">
          <OrientaAfrikOfficialLogo variant="document" size="lg" className="mb-2" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-400" />
            Cabinet International d'Orientation & d'Expertise RH
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            À Propos d'OrientaAfrik & du Cabinet Dr BALOGAH Dibaataba
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            OrientaAfrik est la plateforme leader en Afrique dédiée à l'orientation scolaire, universitaire et professionnelle. Pilotée par l'expertise du Dr BALOGAH Dibaataba, notre mission est d'accompagner chaque élève, étudiant et professionnel vers l'excellence et la réussite de sa carrière.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab("services")}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all"
          >
            Découvrir nos Services <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
          >
            Voir les Témoignages <Star className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Key Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Orientation Scientifique</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Évaluation basée sur des batteries de tests psychométriques certifiés (RIASEC, MBTI, QI) et l'algorithme IA de correspondance avec les filières universitaires.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Rapports Officiels Certifiés</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Délivrance de rapports officiels d'orientation et de bilans de compétences signés et authentifiés par QR Code sécurisé pour les dossiers académiques et RH.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Accompagnement VAE & RH</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Conseil en Validation des Acquis de l'Expérience (VAE), bilans de carrière, recrutement stratégique et mise en relation avec le marché de l'emploi en Afrique.
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-xl font-extrabold text-white">Sections & Informations Complémentaires</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab("certifications")}
            className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-2xl text-left space-y-2 transition-all group"
          >
            <div className="flex justify-between items-center text-emerald-400 font-bold text-sm">
              <span>Formations & VAE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-400">Certifications professionnelles et dossiers de VAE.</p>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-2xl text-left space-y-2 transition-all group"
          >
            <div className="flex justify-between items-center text-amber-400 font-bold text-sm">
              <span>Témoignages Candidats</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-400">Découvrez les retours d'expériences de nos usagers.</p>
          </button>

          <button
            onClick={() => setActiveTab("faq")}
            className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-2xl text-left space-y-2 transition-all group"
          >
            <div className="flex justify-between items-center text-indigo-400 font-bold text-sm">
              <span>Foire Aux Questions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-400">Toutes les réponses à vos questions courantes.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

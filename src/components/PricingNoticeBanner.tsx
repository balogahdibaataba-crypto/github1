import React from "react";
import { CreditCard, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

interface PricingNoticeBannerProps {
  currency?: "FCFA" | "EUR" | "USD";
  onOpenPaymentModal?: (serviceId?: string) => void;
  compact?: boolean;
}

export const PricingNoticeBanner: React.FC<PricingNoticeBannerProps> = ({
  currency = "FCFA",
  onOpenPaymentModal,
  compact = false,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-5 md:p-6 text-white shadow-lg border border-emerald-500/30 space-y-4">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black flex items-center gap-1.5 uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Tous les services sont facturés
          </span>
          <span className="hidden sm:inline-flex px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[11px] font-bold">
            Tarifs Transparents & Unifiés
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-300 font-bold bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cabinet Dr. BALOGAH Dibaataba</span>
        </div>
      </div>

      {/* Main Text */}
      <div className="space-y-1">
        <h3 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2">
          <span>Tarification des Prestations & Modalités de Réglement</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Tous les services de la plateforme OrientaAfrik sont facturés. Choisissez votre prestation ci-dessous et effectuez votre règlement sécurisé par Mobile Money (Mixx by Yass, Moov Money) ou Carte Bancaire.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* Card 1: Test 1000 FCFA */}
        <div
          onClick={() => onOpenPaymentModal && onOpenPaymentModal("serv-test-unit")}
          className="bg-slate-800/90 hover:bg-slate-800 cursor-pointer p-4 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-2 transition-all group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              1. Test d'Orientation
            </span>
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
              Passation d'un Test Psychométrique
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Évaluation instantanée RIASEC, QI ou Soft Skills avec recommandations.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-700/80 flex items-baseline justify-between">
            <span className="text-sm font-black text-emerald-400">1 000 FCFA</span>
            <span className="text-[10px] text-slate-400 font-medium">1.50 € / $1.80</span>
          </div>
        </div>

        {/* Card 2: Bilan 5000 FCFA */}
        <div
          onClick={() => onOpenPaymentModal && onOpenPaymentModal("serv-bilan-competences")}
          className="bg-slate-800/90 hover:bg-slate-800 cursor-pointer p-4 rounded-2xl border border-emerald-500/40 flex flex-col justify-between space-y-2 transition-all group shadow-sm"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              2. Bilan de Compétences
            </span>
            <h4 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
              Suggestion des Métiers & Professions Adéquats
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Diagnostic complet des aptitudes et liste des métiers/formations ciblés.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-700/80 flex items-baseline justify-between">
            <span className="text-sm font-black text-teal-300">5 000 FCFA</span>
            <span className="text-[10px] text-slate-400 font-medium">7.50 € / $8.50</span>
          </div>
        </div>

        {/* Card 3: Conseils + Rapport Certifié 15000 FCFA */}
        <div
          onClick={() => onOpenPaymentModal && onOpenPaymentModal("serv-rapport-certifie")}
          className="bg-slate-800/90 hover:bg-slate-800 cursor-pointer p-4 rounded-2xl border border-indigo-500/40 flex flex-col justify-between space-y-2 transition-all group shadow-sm"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              3. Conseils & Rapport
            </span>
            <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
              Conseils d'Orientation + Rapport Certifié
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Document officiel signé et tamponné par le Dr BALOGAH avec Code QR.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-700/80 flex items-baseline justify-between">
            <span className="text-sm font-black text-indigo-300">15 000 FCFA</span>
            <span className="text-[10px] text-slate-400 font-medium">23.00 € / $25.00</span>
          </div>
        </div>

        {/* Card 4: Examen Certification 55000 FCFA HT */}
        <div
          onClick={() => onOpenPaymentModal && onOpenPaymentModal("serv-examen-certification")}
          className="bg-slate-800/90 hover:bg-slate-800 cursor-pointer p-4 rounded-2xl border border-amber-500/40 flex flex-col justify-between space-y-2 transition-all group shadow-sm"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              4. Certification VAE
            </span>
            <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              Examen de Certification Professionnelle
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Audit de documents, examen 100 Qs & délivrance du Certificat Officiel.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-700/80 flex items-baseline justify-between">
            <span className="text-sm font-black text-amber-400">55 000 FCFA HT</span>
            <span className="text-[10px] text-slate-400 font-medium">84.00 € / $92.00</span>
          </div>
        </div>
      </div>

      {onOpenPaymentModal && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          <span className="text-[11px] text-amber-200/90 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Tous les frais d'examen de certification sont harmonisés à 55 000 FCFA Hors Taxes.
          </span>
          <button
            onClick={() => onOpenPaymentModal("serv-examen-certification")}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all self-end"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payer les Frais d'Examen (55 000 FCFA)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import {
  Sparkles,
  Heart,
  Copy,
  Check,
  Phone,
  Gift,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
  CreditCard,
  QrCode,
  ArrowRight,
  Share2,
  MessageCircle,
} from "lucide-react";

interface FreeAccessDonationBannerProps {
  onOpenDonationModal?: () => void;
  onOpenShareModal?: () => void;
}

export const FreeAccessDonationBanner: React.FC<FreeAccessDonationBannerProps> = ({
  onOpenDonationModal,
  onOpenShareModal,
}) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const copyToClipboard = (number: string, label: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(label);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  if (isDismissed) {
    return (
      <div className="bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-indigo-900/90 text-white px-4 py-2 rounded-xl border border-emerald-500/40 shadow-sm flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="font-semibold text-emerald-200">
            Offre spéciale : L'accès à l'application est gratuite du 01/09 au 31/10/2026.
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="text-[11px] text-amber-300 hover:text-amber-200 font-bold underline shrink-0 cursor-pointer"
        >
          Afficher les détails & dons
        </button>
      </div>
    );
  }

  return (
    <section
      aria-label="Annonce officielle d'accès gratuit et dons"
      className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 border-2 border-emerald-400/60 text-white shadow-xl p-4 md:p-6 transition-all"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-10 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Période Exceptionnelle d'Accès Gratuit
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold">
              01/09/2026 au 31/10/2026
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10.5px]">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Sans forfait • Accès illimité
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
              title={isExpanded ? "Réduire les détails" : "Afficher les instructions de transfert"}
            >
              <span>{isExpanded ? "Moins de détails" : "Instructions de don"}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Masquer temporairement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Exact User-Requested Message Display */}
        <div className="space-y-3">
          <div className="bg-slate-900/80 border border-emerald-500/40 rounded-xl p-4 md:p-5 shadow-inner">
            <p className="text-sm md:text-base lg:text-lg font-bold text-white leading-relaxed font-sans">
              "L'accès à l'application est gratuite du 01/09 au 31/10/2026. Faites vos dons pour le développement de l'application au numéros suivants:{" "}
              <span className="text-amber-300 font-extrabold whitespace-nowrap">+22890966765</span> (Mixx by Yas) ou{" "}
              <span className="text-emerald-300 font-extrabold whitespace-nowrap">+22899372074</span> (Flooz)"
            </p>
          </div>

          {/* Quick Copy & Action Buttons for Both Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Number 1: Mixx by Yas */}
            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/50 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center font-black text-xs shrink-0 border border-purple-500/40">
                  <Phone className="w-4 h-4 text-purple-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10.5px] uppercase font-bold text-purple-300 tracking-wider">
                    Mixx by Yas (Togocom)
                  </div>
                  <div className="text-sm font-black font-mono text-white truncate">
                    +228 90 96 67 65
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => copyToClipboard("+22890966765", "mixx")}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Copier le numéro Mixx by Yas"
                >
                  {copiedNumber === "mixx" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-emerald-200">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
                <a
                  href="tel:+22890966765"
                  className="p-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs transition-colors"
                  title="Appeler directement"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Number 2: Flooz */}
            <div className="p-3 rounded-xl bg-teal-950/60 border border-teal-500/50 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-teal-600/30 text-teal-300 flex items-center justify-center font-black text-xs shrink-0 border border-teal-500/40">
                  <Phone className="w-4 h-4 text-teal-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10.5px] uppercase font-bold text-teal-300 tracking-wider">
                    Flooz (Moov Africa)
                  </div>
                  <div className="text-sm font-black font-mono text-white truncate">
                    +228 99 37 20 74
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => copyToClipboard("+22899372074", "flooz")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Copier le numéro Flooz"
                >
                  {copiedNumber === "flooz" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-emerald-200">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
                <a
                  href="tel:+22899372074"
                  className="p-1.5 rounded-lg bg-teal-900/80 hover:bg-teal-800 text-teal-200 text-xs transition-colors"
                  title="Appeler directement"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Social Networks Sharing Call-To-Action */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                <Share2 className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <span className="font-extrabold text-white block">
                  Aidez vos camarades et proches à en profiter !
                </span>
                <span className="text-[11px] text-slate-400">
                  Partagez l'annonce de gratuité sur WhatsApp, Facebook, X, LinkedIn, Telegram...
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              {onOpenShareModal && (
                <button
                  onClick={onOpenShareModal}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Partager sur les Réseaux</span>
                </button>
              )}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent("https://orientation-et-certification.ai.studio")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                title="Partager directement sur WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Collapsible Guidance & USSD details */}
        {isExpanded && (
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 animate-in fade-in duration-200">
            <div className="space-y-1.5 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Pourquoi soutenir OrientaAfrik par vos dons ?</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Vos dons libres permettent de financer l'hébergement serveur haute performance, la maintenance des bases de données universitaires, l'intelligence artificielle d'orientation et la gratuité continue des outils pour des milliers d'élèves et étudiants vulnérables au Togo et en Afrique.
              </p>
            </div>

            <div className="space-y-1.5 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Syntaxes USSD recommandées</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                <li>
                  <strong>Mixx by Yas (T-Money / Togocom) :</strong> Composez <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">*145#</code>, choisissez Transfert d'argent vers le <span className="font-bold text-white">90966765</span>.
                </li>
                <li>
                  <strong>Flooz (Moov Africa) :</strong> Composez <code className="bg-slate-800 px-1 py-0.5 rounded text-teal-300">*155#</code>, choisissez Transfert vers le <span className="font-bold text-white">99372074</span>.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

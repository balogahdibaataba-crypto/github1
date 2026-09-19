import React from "react";
import { SERVICES } from "../data/servicesData";
import { OrientationService, PaymentReceipt } from "../types";
import { PricingNoticeBanner } from "./PricingNoticeBanner";
import { CheckCircle2, CreditCard, Sparkles, ShieldCheck, Download, Award, ArrowRight } from "lucide-react";

interface ServicesCatalogProps {
  currency: "FCFA" | "EUR" | "USD";
  onSelectServiceToPay: (service: OrientationService) => void;
  paymentReceipts: PaymentReceipt[];
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({
  currency,
  onSelectServiceToPay,
  paymentReceipts,
}) => {
  const formatPrice = (serv: OrientationService) => {
    if (currency === "EUR") return `${(serv.priceEUR ?? 0).toFixed(2)} €`;
    if (currency === "USD") return `$ ${(serv.priceUSD ?? 0).toFixed(2)}`;
    return `${(serv.priceFCFA ?? 0).toLocaleString("fr-FR")} FCFA`;
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-purple-950 p-6 rounded-2xl text-white shadow-md border border-slate-700">
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <CreditCard className="w-3.5 h-3.5" /> Espace Internautes & Tarifs des Services
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Services d'Orientation Scolaire & Accompagnement (dès 1000 FCFA)
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Commandez vos bilans sur-mesure, révision de CV, dossiers d'admission et rapports certifiés avec paiement instantané par Mobile Money (Mixx by Yass, Moov Money) ou Carte Bancaire.
          </p>
        </div>
      </div>

      {/* PRICING NOTICE BANNER */}
      <PricingNoticeBanner currency={currency} />

      {/* REFERRAL DISCOUNT PROMO CARD */}
      <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 p-5 rounded-2xl text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-white text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              🎁 Bon Plan Parrainage
            </span>
            <span className="text-amber-200 font-extrabold text-xs">Jusqu'à 100% GRATUIT</span>
          </div>
          <h3 className="font-extrabold text-white text-base">
            Obtenez jusqu'à 100% de réduction sur votre Rapport Certifié du Dr BALOGAH
          </h3>
          <p className="text-xs text-emerald-100 max-w-2xl">
            Invitez vos amis à passer leurs tests d'orientation sur OrientaAfrik. Cumulez des réductions de 15%, 35%, 50% et recevez votre Rapport Certifié offert dès 10 filleuls !
          </p>
        </div>
        <button
          onClick={() => {
            // Scroll or navigate to referral
            const navBtn = document.querySelector('button[id="referral"]') as HTMLButtonElement;
            if (navBtn) navBtn.click();
          }}
          className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs rounded-xl shadow-lg shrink-0 flex items-center gap-1.5 transition-all border border-amber-400/40"
        >
          <span>Activer mon Parrainage</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((serv) => (
          <div
            key={serv.id}
            className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between transition-all hover:shadow-md relative ${
              serv.popular
                ? "border-emerald-500 ring-2 ring-emerald-500/20"
                : "border-slate-200"
            }`}
          >
            {serv.popular && (
              <span className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-sm">
                LE PLUS DEMANDÉ
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{serv.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{serv.description}</p>
              </div>

              <div className="py-2 border-y border-slate-100 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{formatPrice(serv)}</span>
                <span className="text-xs text-slate-500 font-medium">/ prestation</span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block uppercase">Inclus dans la formule :</span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {serv.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onSelectServiceToPay(serv)}
                className="w-full bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Commander ce Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Receipts / User Orders Section */}
      {paymentReceipts.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Vos Recettes & Services Débloqués ({paymentReceipts.length})
          </h3>

          <div className="space-y-3">
            {paymentReceipts.map((rec, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                    PAIEMENT VALIDÉ
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{rec.serviceTitle}</h4>
                  <p className="text-slate-500 text-[11px]">Réf. Reçu : {rec.receiptHash} • {new Date(rec.date).toLocaleString("fr-FR")}</p>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-slate-900 text-sm block">{rec.amount} {rec.currency}</span>
                  <span className="text-[11px] text-slate-500 uppercase">Via {rec.provider.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

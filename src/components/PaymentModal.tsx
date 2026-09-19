import React, { useState, useEffect } from "react";
import { OrientationService, PaymentReceipt } from "../types";
import { Phone, CreditCard, CheckCircle2, ShieldCheck, Copy, DollarSign, Wallet, Tag, Sparkles } from "lucide-react";
import { validatePromoCode, loadReferralState } from "../utils/referralUtils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: OrientationService;
  onPaymentSuccess: (receipt: PaymentReceipt) => void;
  currency: "FCFA" | "EUR" | "USD";
  initialPromoCode?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  service,
  onPaymentSuccess,
  currency,
  initialPromoCode = "",
}) => {
  const [provider, setProvider] = useState<"mixx" | "flooz" | "virement" | "card">("mixx");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNum, setCopiedNum] = useState<string | null>(null);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string | null>(null);

  // Promo / Referral Code State
  const [promoCodeInput, setPromoCodeInput] = useState(initialPromoCode);
  const [appliedDiscountPct, setAppliedDiscountPct] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ isSuccess: boolean; text: string } | null>(null);

  useEffect(() => {
    if (initialPromoCode) {
      setPromoCodeInput(initialPromoCode);
      handleApplyPromo(initialPromoCode);
    }
  }, [initialPromoCode, isOpen]);

  if (!isOpen) return null;

  const defaultServiceTitle = service?.title || "Frais de Rapport d'Orientation Officiel (Imprimable)";
  const baseAmountFCFA = service?.priceFCFA || 15000;
  const baseAmountEUR = service?.priceEUR || 23.00;
  const baseAmountUSD = service?.priceUSD || 25.00;

  const finalAmountFCFA = Math.round(baseAmountFCFA * (1 - appliedDiscountPct / 100));
  const finalAmountEUR = Math.round(baseAmountEUR * (1 - appliedDiscountPct / 100) * 100) / 100;
  const finalAmountUSD = Math.round(baseAmountUSD * (1 - appliedDiscountPct / 100) * 100) / 100;

  const displayBaseAmount =
    currency === "EUR"
      ? `${(baseAmountEUR ?? 0).toFixed(2)} €`
      : currency === "USD"
      ? `$ ${(baseAmountUSD ?? 0).toFixed(2)}`
      : `${(baseAmountFCFA ?? 0).toLocaleString("fr-FR")} FCFA`;

  const displayFinalAmount =
    finalAmountFCFA === 0
      ? "0 FCFA (GRATUIT)"
      : currency === "EUR"
      ? `${(finalAmountEUR ?? 0).toFixed(2)} €`
      : currency === "USD"
      ? `$ ${(finalAmountUSD ?? 0).toFixed(2)}`
      : `${(finalAmountFCFA ?? 0).toLocaleString("fr-FR")} FCFA`;

  const handleApplyPromo = (codeToTest?: string) => {
    const code = codeToTest !== undefined ? codeToTest : promoCodeInput;
    const refState = loadReferralState();
    const result = validatePromoCode(code, refState);

    if (result.isValid) {
      setAppliedDiscountPct(result.discountPct);
      setPromoMessage({ isSuccess: true, text: result.message });
    } else {
      setAppliedDiscountPct(0);
      setPromoMessage({ isSuccess: false, text: result.message });
    }
  };

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNum(num);
    setTimeout(() => setCopiedNum(null), 2000);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          phone: phone || "+228 90966765",
          amount: finalAmountFCFA,
          currency: "FCFA",
          serviceId: service?.id || "serv-rapport-imprimable",
          transactionRef: transactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const receipt: PaymentReceipt = {
          receiptHash: data.receiptHash,
          serviceId: service?.id || "serv-rapport-imprimable",
          serviceTitle: `${defaultServiceTitle}${appliedDiscountPct > 0 ? ` (Réduction ${appliedDiscountPct}%)` : ""}`,
          amount: finalAmountFCFA,
          currency: "FCFA",
          phone: phone || "+228 90966765",
          provider,
          date: new Date().toISOString(),
        };

        // Dispatch automatic email if recipient email provided
        const userEmail = email.trim() || "client@orientaafrik.org";
        try {
          await fetch("/api/email/send-certificate-or-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipientEmail: userEmail,
              recipientName: "Client OrientaAfrik",
              documentType: service?.id === "serv-examen-certification" ? "CERTIFICATE" : "REPORT",
              documentTitle: receipt.serviceTitle,
              receiptHash: receipt.receiptHash,
              amount: finalAmountFCFA,
              currency: "FCFA"
            }),
          });
        } catch (mailErr) {
          console.error("Auto email error:", mailErr);
        }

        onPaymentSuccess(receipt);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Paiement Sécurisé OrientaAfrik</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleConfirmPayment} className="p-6 space-y-5 text-slate-800">
          {/* Service Summary Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-500 font-medium block">Service sélectionné :</span>
              <p className="font-extrabold text-slate-900">{defaultServiceTitle}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Montant :</span>
              {appliedDiscountPct > 0 ? (
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400 line-through font-bold">{displayBaseAmount}</span>
                  <span className="text-lg font-black text-emerald-700">{displayFinalAmount}</span>
                </div>
              ) : (
                <span className="text-lg font-black text-emerald-700">{displayBaseAmount}</span>
              )}
            </div>
          </div>

          {/* Promo Code & Referral Code Section */}
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-amber-950 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-600" />
                <span>Code Promo ou de Parrainage :</span>
              </label>
              {appliedDiscountPct > 0 && (
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-black text-[10px] rounded uppercase tracking-wide">
                  -{appliedDiscountPct}% Appliqué
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: BALOGAH-8A4F, PARRAIN15..."
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className="flex-1 p-2 bg-white border border-amber-300 rounded-lg font-mono font-bold text-xs uppercase focus:outline-none focus:border-amber-600"
              />
              <button
                type="button"
                onClick={() => handleApplyPromo()}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-lg shrink-0 flex items-center gap-1 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Appliquer</span>
              </button>
            </div>

            {promoMessage && (
              <p
                className={`text-[11px] font-bold ${
                  promoMessage.isSuccess ? "text-emerald-800" : "text-rose-700"
                }`}
              >
                {promoMessage.text}
              </p>
            )}
          </div>

          {/* Provider Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Choisissez le Mode de Paiement :</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setProvider("mixx")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  provider === "mixx"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm ring-1 ring-emerald-500"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Mixx by Yas</span>
                <span className="text-[9px] text-emerald-700 font-mono font-bold">+228 90966765</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider("flooz")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  provider === "flooz"
                    ? "bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-500"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Flooz (Moov)</span>
                <span className="text-[9px] text-blue-700 font-mono font-bold">+228 99372074</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider("virement")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  provider === "virement"
                    ? "bg-amber-50 border-amber-600 text-amber-900 shadow-sm ring-1 ring-amber-500"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Virement Bancaire</span>
                <span className="text-[9px] text-amber-800 font-mono font-bold">Banque Atlantique</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider("card")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  provider === "card"
                    ? "bg-purple-50 border-purple-600 text-purple-900 shadow-sm ring-1 ring-purple-500"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Carte / Int.</span>
                <span className="text-[9px] text-purple-700 font-sans font-bold">Visa / Master</span>
              </button>
            </div>
          </div>

          {/* Instructions Box */}
          {provider === "mixx" && (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-2 text-xs text-emerald-950">
              <span className="font-bold block flex items-center gap-1">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Instruction Mixx by Yas (Togocom & Afrique) :</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                Effectuez un transfert direct du montant officiel de <strong>{displayFinalAmount}</strong> vers le compte Mixx officiel ci-dessous :
              </p>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-300 font-mono font-bold text-sm">
                <span>+228 90966765</span>
                <button
                  type="button"
                  onClick={() => handleCopy("+22890966765")}
                  className="text-emerald-700 hover:text-emerald-800 text-xs flex items-center gap-1 font-sans bg-emerald-50 px-2 py-1 rounded border border-emerald-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedNum === "+22890966765" ? "Copié !" : "Copier"}
                </button>
              </div>
              <p className="text-[10px] text-emerald-800">
                Bénéficiaire : Cabinet Conseil OrientaAfrik / Dr BALOGAH Dibaataba
              </p>
            </div>
          )}

          {provider === "flooz" && (
            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl space-y-2 text-xs text-blue-950">
              <span className="font-bold block flex items-center gap-1">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Instruction Flooz (Moov Africa) :</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                Effectuez un transfert direct du montant officiel de <strong>{displayFinalAmount}</strong> vers le compte Flooz officiel ci-dessous :
              </p>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-blue-300 font-mono font-bold text-sm">
                <span>+228 99372074</span>
                <button
                  type="button"
                  onClick={() => handleCopy("+22899372074")}
                  className="text-blue-700 hover:text-blue-800 text-xs flex items-center gap-1 font-sans bg-blue-50 px-2 py-1 rounded border border-blue-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedNum === "+22899372074" ? "Copié !" : "Copier"}
                </button>
              </div>
              <p className="text-[10px] text-blue-800">
                Bénéficiaire : Cabinet Conseil OrientaAfrik / Dr BALOGAH Dibaataba
              </p>
            </div>
          )}

          {provider === "virement" && (
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl space-y-2 text-xs text-amber-950">
              <span className="font-bold block flex items-center gap-1">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>Instruction Virement Bancaire (Banque Atlantique Togo) :</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                Effectuez votre virement ou dépôt direct de <strong>{displayFinalAmount}</strong> sur le compte bancaire officiel :
              </p>
              <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-amber-300 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Banque :</span>
                  <strong className="text-slate-900">Banque Atlantique Togo</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-sans">N° de Compte :</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-blue-900 font-bold text-sm">41438840008</strong>
                    <button
                      type="button"
                      onClick={() => handleCopy("41438840008")}
                      className="text-amber-800 hover:text-amber-900 text-[11px] flex items-center gap-1 font-sans bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedNum === "41438840008" ? "Copié !" : "Copier"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Intitulé du compte :</span>
                  <strong className="text-slate-900">Dr BALOGAH Dibaataba / OrientaAfrik</strong>
                </div>
              </div>
              <p className="text-[10px] text-amber-900">
                Indiquez votre nom en référence de virement et saisissez le numéro de bordereau / reçu ci-dessous.
              </p>
            </div>
          )}

          {provider === "card" && (
            <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-xl space-y-2 text-xs text-purple-950">
              <span className="font-bold block">Paiement International par Carte Visa / Mastercard :</span>
              <p className="text-[11px] leading-relaxed">
                Réglez en toute sécurité avec votre carte bancaire internationale en EUR ou USD.
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Adresse E-mail pour Réception du Document Certifié :
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Ex: balogahdibaataba@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                📧 Envoi automatique instantané du document / rapport certifié du Dr BALOGAH dès validation du paiement.
              </p>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Votre Numéro de Téléphone (Mobile Money) :
              </label>
              <input
                type="text"
                placeholder="Ex: +228 90 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Référence / ID de Transaction Mobile Money :
              </label>
              <input
                type="text"
                placeholder="Ex: TXN-982341 (ou laissez vide pour simulation)"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? "Validation..." : "Valider le Paiement"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

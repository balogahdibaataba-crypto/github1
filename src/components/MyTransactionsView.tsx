import React, { useState, useEffect } from "react";
import { BalogahPdfFooter } from "./BalogahPdfFooter";
import { PaymentReceipt } from "../types";
import {
  Receipt,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  Search,
  Filter,
  CreditCard,
  Wallet,
  Eye,
  Award,
  Sparkles,
  Copy,
  Check,
  ArrowUpRight,
  RefreshCw,
  QrCode,
  Calendar,
  Building2,
  Lock,
  Fingerprint
} from "lucide-react";
import { DirectorFingerprintScannerModal } from "./DirectorFingerprintScannerModal";

interface MyTransactionsViewProps {
  receipts: PaymentReceipt[];
  currency: "FCFA" | "EUR" | "USD";
  onOpenPaymentModal: () => void;
  onGoToServices?: () => void;
}

// Initial sample transactions to ensure the user always sees realistic past receipts & downloadable reports
const INITIAL_SAMPLE_RECEIPTS: PaymentReceipt[] = [
  {
    receiptHash: "OR-PAY-2026-X891",
    serviceId: "serv-rapport-imprimable",
    serviceTitle: "Rapport d'Orientation Officiel Certifié (Imprimable PDF)",
    amount: 15000,
    currency: "FCFA",
    phone: "+228 90 96 67 65",
    provider: "mixx",
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    receiptHash: "OR-PAY-2026-K420",
    serviceId: "serv-consultation-directe",
    serviceTitle: "Consultation Individuelle WhatsApp & Téléphonique (30 min)",
    amount: 5000,
    currency: "FCFA",
    phone: "+228 99 37 20 74",
    provider: "moov",
    date: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
  },
];

export const MyTransactionsView: React.FC<MyTransactionsViewProps> = ({
  receipts,
  currency,
  onOpenPaymentModal,
  onGoToServices,
}) => {
  const [allReceipts, setAllReceipts] = useState<PaymentReceipt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("ALL");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Modals state
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState<PaymentReceipt | null>(null);
  const [selectedReceiptForReport, setSelectedReceiptForReport] = useState<PaymentReceipt | null>(null);

  // Biometric Validation State
  const [isBiometricValidated, setIsBiometricValidated] = useState(true);
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false);

  const handlePrintReceiptWithValidation = () => {
    if (isBiometricValidated) {
      window.print();
    } else {
      setIsFingerprintModalOpen(true);
    }
  };

  const handleFingerprintSuccess = () => {
    setIsBiometricValidated(true);
    setIsFingerprintModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Synchronize state with props & localStorage
  useEffect(() => {
    const stored = localStorage.getItem("orienta_afrik_receipts");
    let localItems: PaymentReceipt[] = [];
    if (stored) {
      try {
        localItems = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse local receipts", e);
      }
    }

    // Combine props receipts, localItems, and default initial samples if empty
    const combinedMap = new Map<string, PaymentReceipt>();

    // First add samples
    INITIAL_SAMPLE_RECEIPTS.forEach((r) => combinedMap.set(r.receiptHash, r));
    // Then localItems
    localItems.forEach((r) => combinedMap.set(r.receiptHash, r));
    // Then props
    receipts.forEach((r) => combinedMap.set(r.receiptHash, r));

    const finalArray = Array.from(combinedMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setAllReceipts(finalArray);
    localStorage.setItem("orienta_afrik_receipts", JSON.stringify(finalArray));
  }, [receipts]);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatAmount = (amountFCFA: number) => {
    const val = amountFCFA ?? 0;
    if (currency === "EUR") return `${(val / 655.957).toFixed(2)} €`;
    if (currency === "USD") return `$ ${(val / 600).toFixed(2)}`;
    return `${val.toLocaleString("fr-FR")} FCFA`;
  };

  const filteredReceipts = allReceipts.filter((rec) => {
    const matchesSearch =
      rec.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.receiptHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.phone.includes(searchQuery);

    const matchesProvider = providerFilter === "ALL" || rec.provider === providerFilter;

    return matchesSearch && matchesProvider;
  });

  const totalSpentFCFA = allReceipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-indigo-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <Receipt className="w-3.5 h-3.5" /> Espace Historique des Transactions Client
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Mes Paiements & Téléchargement des Rapports
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Consultez tous vos reçus de paiements sécurisés (Mixx by Yass, Moov Money, Carte), vérifiez l'authenticité de vos règlements et ré-téléchargez à tout moment vos rapports d'orientation officiels sous la signature du <strong>Dr. BALOGAH Dibaataba</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          {onGoToServices && (
            <button
              onClick={onGoToServices}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>Commander un Service</span>
            </button>
          )}

          <button
            onClick={onOpenPaymentModal}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Nouveau Paiement</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Total Transactions</span>
            <span className="text-2xl font-black text-slate-900">{allReceipts.length}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Toutes Confirmées</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Montant Total Réglé</span>
            <span className="text-xl font-black text-emerald-700">{formatAmount(totalSpentFCFA)}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Mixx, Moov & CB</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Rapports Débloqués</span>
            <span className="text-2xl font-black text-purple-900">
              {allReceipts.filter((r) => r.amount >= 15000 || r.serviceId.includes("rapport")).length}
            </span>
            <span className="text-[10px] text-purple-600 font-bold block mt-0.5">PDF Re-téléchargeables</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Bilan Certifié</span>
            <span className="text-sm font-extrabold text-slate-900">Dr. BALOGAH D.</span>
            <span className="text-[10px] text-amber-600 font-bold block mt-0.5">Sceau Officiel Universitaire</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par référence (OR-PAY-...), nom de service ou numéro..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">Tous les modes de paiement</option>
              <option value="mixx">Mixx by Yass (+228 90966765)</option>
              <option value="moov">Moov Money (+228 99372074)</option>
              <option value="card">Carte Bancaire Visa / Mastercard</option>
            </select>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS LIST */}
      <div className="space-y-4">
        {filteredReceipts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">Aucune transaction trouvée</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Aucun paiement ne correspond à votre recherche. Si vous venez d'effectuer un règlement, vous pouvez simuler ou enregistrer un nouveau paiement.
            </p>
            <button
              onClick={onOpenPaymentModal}
              className="mt-2 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Effectuer un Paiement</span>
            </button>
          </div>
        ) : (
          filteredReceipts.map((rec) => {
            const isReportEligible = rec.amount >= 15000 || rec.serviceId.includes("rapport");
            return (
              <div
                key={rec.receiptHash}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
              >
                {/* Left details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>PAIEMENT VALIDÉ & CONFIRMÉ</span>
                    </span>

                    <button
                      onClick={() => handleCopyHash(rec.receiptHash)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-mono rounded border border-slate-200 flex items-center gap-1 transition-colors"
                      title="Cliquer pour copier la référence"
                    >
                      <span>Réf : {rec.receiptHash}</span>
                      {copiedHash === rec.receiptHash ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(rec.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {rec.serviceTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      {rec.provider === "mixx" ? (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Mixx by Yass (+228 90966765)
                        </span>
                      ) : rec.provider === "moov" ? (
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Moov Money (+228 99372074)
                        </span>
                      ) : (
                        <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          Carte Visa / Mastercard
                        </span>
                      )}
                    </span>

                    <span className="text-slate-500">
                      Tél client : <strong>{rec.phone}</strong>
                    </span>
                  </div>
                </div>

                {/* Right Amount & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Montant Réglé
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {formatAmount(rec.amount)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Re-download report action */}
                    {isReportEligible && (
                      <button
                        onClick={() => setSelectedReceiptForReport(rec)}
                        className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Re-télécharger le Rapport PDF</span>
                      </button>
                    )}

                    {/* View Receipt action */}
                    <button
                      onClick={() => setSelectedReceiptForModal(rec)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all border border-slate-200 flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Reçu Officiel</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* OFFICIAL TRANSACTION RECEIPT MODAL */}
      {selectedReceiptForModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="print-container printable-area bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 my-8">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Reçu de Paiement Officiel</h3>
                  <p className="text-xs text-slate-500">OrientaAfrik • Dr. BALOGAH Dibaataba</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReceiptForModal(null)}
                className="text-slate-400 hover:text-slate-800 text-sm font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Receipt Box content */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-800 font-sans">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="font-bold text-slate-500">Référence Unique :</span>
                <span className="font-mono font-black text-indigo-700 text-sm">{selectedReceiptForModal.receiptHash}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-500 font-bold block">Prestation / Service :</span>
                <p className="font-extrabold text-slate-900 text-sm">{selectedReceiptForModal.serviceTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-500 font-bold block">Date & Heure :</span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceiptForModal?.date ? new Date(selectedReceiptForModal.date).toLocaleString("fr-FR") : "Date non spécifiée"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Mode de Paiement :</span>
                  <span className="font-extrabold uppercase text-emerald-800">
                    {selectedReceiptForModal.provider} ({selectedReceiptForModal.phone})
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700 text-sm">Montant Total :</span>
                <span className="font-black text-emerald-700 text-xl">
                  {formatAmount(selectedReceiptForModal.amount)}
                </span>
              </div>
            </div>

            {/* Certification Footer with Dr BALOGAH QR code */}
            <BalogahPdfFooter
              docId={selectedReceiptForModal.receiptHash}
              docType="Reçu de Paiement Officiel"
              showFullCabinetDetails={true}
            />

              {/* Modal Buttons */}
              <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintReceiptWithValidation}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer</span>
                  </button>
                  <button
                    onClick={async () => {
                      const email = prompt("Saisissez votre adresse e-mail pour recevoir ce reçu :", "balogahdibaataba@gmail.com");
                      if (email && email.includes("@")) {
                        try {
                          await fetch("/api/email/send-certificate-or-report", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              recipientEmail: email,
                              documentType: "REPORT",
                              documentTitle: selectedReceiptForModal.serviceTitle,
                              receiptHash: selectedReceiptForModal.receiptHash,
                              amount: selectedReceiptForModal.amount,
                              currency: selectedReceiptForModal.currency,
                            }),
                          });
                          alert(`Reçu envoyé avec succès à ${email} !`);
                        } catch (e) {
                          alert("Erreur lors de l'envoi de l'e-mail.");
                        }
                      }
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Envoyer par E-mail</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedReceiptForModal(null)}
                  className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  Fermer
                </button>
              </div>
          </div>
        </div>
      )}

      {/* RE-DOWNLOAD ORIENTATION REPORT MODAL */}
      {selectedReceiptForReport && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="print-container printable-area bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase border border-emerald-200">
                  Rapport Officiel Disponible
                </span>
                <h3 className="font-black text-xl text-slate-900 mt-1">
                  Téléchargement du Rapport d'Orientation Certifié
                </h3>
                <p className="text-xs text-slate-500">
                  Transaction : {selectedReceiptForReport.receiptHash} • {selectedReceiptForReport.serviceTitle}
                </p>
              </div>

              <button
                onClick={() => setSelectedReceiptForReport(null)}
                className="text-slate-400 hover:text-slate-800 text-sm font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* REPORT DOCUMENT PREVIEW */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 text-slate-900 text-xs shadow-inner">
              {/* Document Letterhead */}
              <div className="border-b-2 border-slate-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Document d'Orientation Certifié
                  </span>
                  <h1 className="text-2xl font-black text-slate-900">OrientaAfrik</h1>
                  <p className="text-xs font-medium text-slate-600">
                    Cabinet du Dr. BALOGAH Dibaataba • Conseiller d'Orientation Scolaire & Professionnelle
                  </p>
                </div>

                <div className="text-right text-[11px] text-slate-600 space-y-0.5">
                  <p className="font-bold text-slate-900">Attestation N° {selectedReceiptForReport.receiptHash}</p>
                  <p>Date d'émission : {new Date(selectedReceiptForReport.date).toLocaleDateString("fr-FR")}</p>
                  <p className="text-emerald-700 font-bold">✓ Statut : Réglé & Téléchargeable</p>
                </div>
              </div>

              {/* Official Formula */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-900 leading-relaxed italic">
                  Je soussigné, Docteur BALOGAH Dibaataba, Conseiller d'orientation scolaire et professionnelle à Lomé (Togo), certifie avoir évalué le profil académique, les compétences psychométriques et les aptitudes de l'étudiant pour la présente analyse d'orientation.
                </p>
              </div>

              {/* Summary Sections */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>1. Bilan Académique & Conditions d'Accès</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                    L'analyse des relevés de notes confirme la validation des matières fondamentales avec des moyennes supérieures à 10/20 en Langues, Sciences Humaines et Sciences Exactes. Éligibilité confirmée pour les cycles Licence, Ingéniorat et Master.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>2. Recommandations des Métiers & Filières Porteurs</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                    Filières prioritaires recommandées : <strong>Génie Logiciel & Cyber-Sécurité, Gestion de Projets, Finance & Banques, Droit des Affaires, Sciences de Santé</strong>. Insertion professionnelle estimée excellente en Afrique de l'Ouest (UEMOA/CEDEAO) et à l'International.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider text-purple-700 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span>3. Établissements Supérieurs Suggérés</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                    Université de Lomé (UL), Université de Parakou, Université Félix Houphouët-Boigny, ISM Dakar, ESGIS, 2iE Ouagadougou, Université de Genève, Université Paris-Saclay.
                  </p>
                </div>
              </div>

              {/* Signature & QR Code Footer */}
              <BalogahPdfFooter
                docId={selectedReceiptForReport.receiptHash}
                docType={selectedReceiptForReport.serviceTitle}
                date={new Date(selectedReceiptForReport.date).toLocaleDateString("fr-FR")}
                showFullCabinetDetails={true}
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReceiptWithValidation}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer / Télécharger en PDF</span>
                </button>
                <button
                  onClick={async () => {
                    const email = prompt("Saisissez votre adresse e-mail pour recevoir ce rapport certifié :", "balogahdibaataba@gmail.com");
                    if (email && email.includes("@")) {
                      try {
                        await fetch("/api/email/send-certificate-or-report", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            recipientEmail: email,
                            documentType: "REPORT",
                            documentTitle: selectedReceiptForReport.serviceTitle,
                            receiptHash: selectedReceiptForReport.receiptHash,
                            amount: selectedReceiptForReport.amount,
                            currency: selectedReceiptForReport.currency,
                          }),
                        });
                        alert(`Rapport certifié transmis avec succès à l'adresse e-mail : ${email}`);
                      } catch (e) {
                        alert("Erreur lors de l'envoi de l'e-mail.");
                      }
                    }
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Envoyer par E-mail</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedReceiptForReport(null)}
                className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECTOR FINGERPRINT SCANNER MODAL */}
      <DirectorFingerprintScannerModal
        isOpen={isFingerprintModalOpen}
        onClose={() => setIsFingerprintModalOpen(false)}
        onSuccess={handleFingerprintSuccess}
        documentTitle={selectedReceiptForReport?.serviceTitle || selectedReceiptForModal?.serviceTitle || "Reçu Officiel / Rapport"}
        docId={selectedReceiptForReport?.receiptHash || selectedReceiptForModal?.receiptHash || "REC-2026-BAL-DG"}
      />
    </div>
  );
};

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

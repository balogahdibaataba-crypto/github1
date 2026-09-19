import React, { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  Sparkles,
  Clock,
  Phone,
  Gift,
  CheckCircle2,
  TrendingUp,
  Printer,
  Mail,
  HelpCircle,
  Award,
  Zap,
  ArrowDownLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Fingerprint
} from "lucide-react";
import { useWallet, WalletTransaction } from "../context/WalletContext";
import { DirectorFingerprintScannerModal } from "./DirectorFingerprintScannerModal";

interface MyWalletViewProps {
  setActiveTab: (tab: string) => void;
  currency: "FCFA" | "EUR" | "USD";
}

export const MyWalletView: React.FC<MyWalletViewProps> = ({ setActiveTab, currency }) => {
  const {
    balanceFCFA,
    totalEarnedFCFA,
    totalWithdrawnFCFA,
    activeSecondsToday,
    transactions,
    claimDailyBonus,
    requestMobileMoneyTransfer,
    lastDailyClaimDate,
  } = useWallet();

  // Mobile Money Transfer Form State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"MIXX" | "MOOV" | "WAVE" | "MTN" | "ORANGE">("MIXX");
  const [phoneNumber, setPhoneNumber] = useState("90966765");
  const [recipientName, setRecipientName] = useState("");
  const [transferAmount, setTransferAmount] = useState<number>(balanceFCFA > 0 ? Math.min(balanceFCFA, 500) : 100);

  // Status & Receipt Modal
  const [transferFeedback, setTransferFeedback] = useState<{
    type: "SUCCESS" | "ERROR";
    message: string;
  } | null>(null);

  const [receiptTx, setReceiptTx] = useState<WalletTransaction | null>(null);

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

  // Currency Conversions
  const formatCurrency = (amountFCFA: number) => {
    const val = amountFCFA ?? 0;
    if (currency === "EUR") {
      return `${(val / 655.95).toFixed(2)} €`;
    }
    if (currency === "USD") {
      return `$ ${(val / 600).toFixed(2)}`;
    }
    return `${val.toLocaleString("fr-FR")} FCFA`;
  };

  const handleClaimBonus = () => {
    const success = claimDailyBonus();
    if (success) {
      setTransferFeedback({
        type: "SUCCESS",
        message: "🎉 Félicitations ! Votre bonus quotidien de 150 FCFA a été crédité sur votre portefeuille.",
      });
    } else {
      setTransferFeedback({
        type: "ERROR",
        message: "Vous avez déjà réclamé votre bonus quotidien aujourd'hui. Revenez demain pour le suivant !",
      });
    }
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferFeedback(null);

    const fullPhone = phoneNumber.startsWith("+228") ? phoneNumber : `+228 ${phoneNumber}`;
    const result = requestMobileMoneyTransfer({
      amount: Number(transferAmount),
      provider: selectedProvider,
      phoneNumber: fullPhone,
      recipientName: recipientName.trim() || "Utilisateur OrientaAfrik",
    });

    if (result.success) {
      setTransferFeedback({
        type: "SUCCESS",
        message: result.message,
      });
      if (result.transaction) {
        setReceiptTx(result.transaction);
      }
      setShowTransferModal(false);
    } else {
      setTransferFeedback({
        type: "ERROR",
        message: result.message,
      });
    }
  };

  // Convert active seconds to readable time string
  const formatTimeSpent = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const isBonusClaimedToday = lastDailyClaimDate === todayStr;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER HERO SECTION */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span>Mon Portefeuille de Récompenses Actives</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Gagnez de la Monnaie Réelle en Naviguant
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                Chaque seconde passée à explorer les formations, universités et métiers sur OrientaAfrik vous génère du solde réel, transférable instantanément par <strong>Mobile Money (Mixx ou Moov)</strong>.
              </p>
            </div>

            {/* Daily Claim CTA */}
            <button
              onClick={handleClaimBonus}
              disabled={isBonusClaimedToday}
              className={`px-5 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shrink-0 ${
                isBonusClaimedToday
                  ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 ring-4 ring-amber-500/20"
              }`}
            >
              <Gift className="w-4 h-4 text-slate-950" />
              <span>{isBonusClaimedToday ? "Bonus Quotidien Réclamé" : "Réclamer Bonus Quotidien (+150 FCFA)"}</span>
            </button>
          </div>

          {/* MAIN WALLET CARD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            {/* Balance Widget */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solde Disponible</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Actif
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-emerald-400 tracking-tight">
                  {formatCurrency(balanceFCFA)}
                </div>
                <div className="text-[11px] font-semibold text-slate-400">
                  ≈ {balanceFCFA} FCFA disponible pour retrait
                </div>
              </div>

              <button
                onClick={() => setShowTransferModal(true)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Transfert Mobile Money (Mixx / Moov)</span>
              </button>
            </div>

            {/* Active Time Ticker */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Temps de Navigation</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {formatTimeSpent(activeSecondsToday)}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Taux d'incitation : <strong className="text-amber-300">+1 FCFA toutes les 3s</strong> de consultation active.
              </p>
            </div>

            {/* Total Earned & Withdrawn Stats */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Flux du Portefeuille</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-bold">Total Cumulé</span>
                  <span className="font-extrabold text-amber-400">{formatCurrency(totalEarnedFCFA)}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-bold">Total Retiré</span>
                  <span className="font-extrabold text-blue-400">{formatCurrency(totalWithdrawnFCFA)}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Garantie de transfert direct sous 5 minutes par le système Dr BALOGAH.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {transferFeedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn ${
            transferFeedback.type === "SUCCESS"
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-rose-50 border-rose-300 text-rose-950"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-5 h-5 shrink-0 ${transferFeedback.type === "SUCCESS" ? "text-emerald-700" : "text-rose-700"}`} />
            <span>{transferFeedback.message}</span>
          </div>
          <button
            onClick={() => setTransferFeedback(null)}
            className="text-slate-500 hover:text-slate-900 text-xs underline font-bold"
          >
            Fermer
          </button>
        </div>
      )}

      {/* HOW TO EARN COINS / OPPORTUNITIES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Comment Accumuler Plus de FCFA ?</span>
            </h3>
            <p className="text-slate-500 text-xs font-medium">
              Réalisez des activités d'orientation sur le site pour débloquer des crédits instantanés.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab("tests")}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                🧪
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                +250 FCFA
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs group-hover:text-emerald-700 transition-colors">
              Passez un Test Psychométrique / QI
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              Répondez aux 10 tests d'orientation pour qualifier votre profil RIASEC.
            </p>
          </div>

          <div
            onClick={() => setActiveTab("calculator")}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                🧮
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                +150 FCFA
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs group-hover:text-emerald-700 transition-colors">
              Calculez Vos Moyennes & Éligibilité
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              Testez la règle de la note ≥ 10/20 pour valider l'accès aux facultés.
            </p>
          </div>

          <div
            onClick={() => setActiveTab("certifications")}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                📜
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                +200 FCFA
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs group-hover:text-emerald-700 transition-colors">
              Explorez les 200 Formations VAE
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              Découvrez les parcours certifiants prisés par les Nations Unies & ONG.
            </p>
          </div>

          <div
            onClick={() => setActiveTab("referral")}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                🤝
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                +1000 FCFA
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs group-hover:text-emerald-700 transition-colors">
              Parrainez vos Amis & Étudiants
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              Partagez votre lien de parrainage et gagnez un bonus sur chaque inscription.
            </p>
          </div>
        </div>
      </div>

      {/* TRANSACTION & WITHDRAWAL HISTORY */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span>Historique des Mouvements du Portefeuille</span>
            </h3>
            <p className="text-slate-500 text-xs font-medium">
              Gain de navigation, bonus d'activités et demandes de transferts Mobile Money.
            </p>
          </div>

          <button
            onClick={() => setShowTransferModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nouveau Transfert Mobile Money</span>
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-bold">
            Aucun mouvement enregistré pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Opération</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Montant FCFA</th>
                  <th className="py-3 px-3">Statut</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-slate-500 font-semibold whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      <div>{tx.title}</div>
                      {tx.referenceCode && (
                        <div className="text-[10px] text-slate-400 font-mono">Réf: {tx.referenceCode}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {tx.type === "EARN" ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md inline-flex items-center gap-1">
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> Crédit
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-md inline-flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3 text-blue-600" /> Retrait MM
                        </span>
                      )}
                    </td>
                    <td className={`py-3 px-3 font-black whitespace-nowrap ${tx.type === "EARN" ? "text-emerald-700" : "text-blue-700"}`}>
                      {tx.type === "EARN" ? "+" : "-"}{(tx.amountFCFA ?? 0).toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-md flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Effectué
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {tx.type === "WITHDRAWAL" && (
                        <button
                          onClick={() => setReceiptTx(tx)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 ml-auto"
                        >
                          <Printer className="w-3 h-3" /> Reçu
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TRANSFER MODAL */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Transfert Mobile Money</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Retrait de votre solde accumulé sur le site</p>
                </div>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              {/* Solde rappel */}
              <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Solde actuellement disponible :</span>
                <span className="text-emerald-400 font-black text-sm">{(balanceFCFA ?? 0).toLocaleString("fr-FR")} FCFA</span>
              </div>

              {/* Choix de l'opérateur */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Choisissez l'Opérateur Mobile Money :</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedProvider("MIXX"); setPhoneNumber("90966765"); }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition-all ${
                      selectedProvider === "MIXX"
                        ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400/30 text-amber-950"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <div className="font-extrabold text-xs">Mixx par Yas (Togocom)</div>
                      <div className="text-[10px] text-slate-500 font-mono">+228 90 96 67 65</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedProvider("MOOV"); setPhoneNumber("99372074"); }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition-all ${
                      selectedProvider === "MOOV"
                        ? "bg-blue-50 border-blue-500 ring-2 ring-blue-400/30 text-blue-950"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                    <div>
                      <div className="font-extrabold text-xs">Moov Money Togo</div>
                      <div className="text-[10px] text-slate-500 font-mono">+228 99 37 20 74</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedProvider("WAVE"); setPhoneNumber("90000000"); }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition-all ${
                      selectedProvider === "WAVE"
                        ? "bg-cyan-50 border-cyan-500 ring-2 ring-cyan-400/30 text-cyan-950"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-cyan-500 shrink-0" />
                    <div>
                      <div className="font-extrabold text-xs">Wave Digital</div>
                      <div className="text-[10px] text-slate-500">Afrique de l'Ouest</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedProvider("MTN"); setPhoneNumber("90000000"); }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition-all ${
                      selectedProvider === "MTN"
                        ? "bg-yellow-50 border-yellow-500 ring-2 ring-yellow-400/30 text-yellow-950"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" />
                    <div>
                      <div className="font-extrabold text-xs">MTN / Orange Money</div>
                      <div className="text-[10px] text-slate-500">Région UEMOA / CEMAC</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Champ téléphone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Numéro de Téléphone Bénéficiaire :</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">+228</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="90966765 ou 99372074"
                    className="w-full pl-14 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Nom du titulaire */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Nom & Prénom du Titulaire :</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Ex: BALOGAH Koffi / Votre Nom"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Montant à transférer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">Montant à Transférer (FCFA) :</label>
                  <button
                    type="button"
                    onClick={() => setTransferAmount(balanceFCFA)}
                    className="text-[10px] font-black text-emerald-700 hover:underline"
                  >
                    Tout retirer ({balanceFCFA} FCFA)
                  </button>
                </div>
                <input
                  type="number"
                  min={10}
                  max={balanceFCFA}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-emerald-800 focus:outline-none focus:border-emerald-600"
                />

                <div className="flex items-center gap-1.5 pt-1">
                  {[100, 250, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={preset > balanceFCFA}
                      onClick={() => setTransferAmount(preset)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-[11px] font-extrabold rounded-lg transition-all"
                    >
                      {preset} F
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={balanceFCFA <= 0 || transferAmount > balanceFCFA}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Valider le Transfert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {receiptTx && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="print-container printable-area bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="text-center space-y-1 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2 font-black">
                ✓
              </div>
              <h3 className="font-black text-slate-900 text-base">Reçu Officiel de Transfert Mobile Money</h3>
              <p className="text-xs text-slate-500">Cabinet Dr BALOGAH - OrientaAfrik Togo</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-bold">Code Référence :</span>
                <span className="font-mono font-black text-slate-900">{receiptTx.referenceCode || receiptTx.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-bold">Montant Transféré :</span>
                <span className="font-black text-emerald-800 text-sm">{(receiptTx.amountFCFA ?? 0).toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-bold">Opérateur :</span>
                <span className="font-bold text-slate-800">{receiptTx.provider || "Mobile Money"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-bold">Bénéficiaire :</span>
                <span className="font-bold text-slate-900">{receiptTx.recipientName || "Utilisateur"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-bold">Téléphone :</span>
                <span className="font-bold text-slate-900">{receiptTx.phoneNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-bold">Horodatage :</span>
                <span className="text-slate-700">{receiptTx.date}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                onClick={handlePrintReceiptWithValidation}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>

              <button
                onClick={async () => {
                  const email = prompt("Saisissez votre e-mail pour recevoir une copie du reçu :", "balogahdibaataba@gmail.com");
                  if (email && email.includes("@")) {
                    try {
                      await fetch("/api/email/send-certificate-or-report", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          recipientEmail: email,
                          documentType: "REPORT",
                          documentTitle: `Reçu de Transfert Mobile Money (${receiptTx.amountFCFA} FCFA)`,
                          receiptHash: receiptTx.referenceCode,
                          amount: receiptTx.amountFCFA,
                          currency: "FCFA",
                        }),
                      });
                      alert(`Reçu de transfert transmis à ${email}`);
                    } catch (e) {
                      alert("Erreur lors de l'envoi de l'e-mail.");
                    }
                  }
                }}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>E-mail</span>
              </button>

              <button
                onClick={() => setReceiptTx(null)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
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
        documentTitle={receiptTx ? `Reçu de Transfert (${receiptTx.type})` : "Reçu de Portefeuille"}
        docId={receiptTx?.referenceCode || "WAL-2026-BAL-DG"}
      />
    </div>
  );
};

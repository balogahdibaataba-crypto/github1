import React, { useState, useEffect } from "react";
import {
  Users,
  Share2,
  Copy,
  CheckCircle2,
  Gift,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageSquare,
  Mail,
  UserPlus,
  Percent,
  ChevronRight,
  HelpCircle,
  Clock,
  Ticket
} from "lucide-react";
import {
  ReferralState,
  loadReferralState,
  saveReferralState,
  calculateReferralTier,
  ReferredFriend,
  getInitialReferralCode
} from "../utils/referralUtils";
import { DR_BALOGAH_INFO } from "../utils/qrCodeUtils";

interface ReferralProgramViewProps {
  onOpenPaymentModal: (promoCode?: string) => void;
  currency: "FCFA" | "EUR" | "USD";
}

export const ReferralProgramView: React.FC<ReferralProgramViewProps> = ({
  onOpenPaymentModal,
  currency,
}) => {
  const [refState, setRefState] = useState<ReferralState>(loadReferralState());
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);

  // Simulation form states
  const [simName, setSimName] = useState("");
  const [simContact, setSimContact] = useState("");
  const [showSimModal, setShowSimModal] = useState(false);

  // Custom user code state
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [customCodeInput, setCustomCodeInput] = useState(refState.userCode);

  useEffect(() => {
    saveReferralState(refState);
  }, [refState]);

  const activeCompletedFriends = refState.referredFriends.filter(
    (f) => f.testsPassed >= 1
  ).length;

  const tierInfo = calculateReferralTier(activeCompletedFriends);

  const referralLink = `https://orientation-et-certification.ai.studio/?ref=${refState.userCode}`;

  const shareTextWhatsApp = `Bonjour ! 🎓 Je t'invite à passer tes tests d'orientation scolaire et de QI certifiés par le Dr BALOGAH Dibaataba sur OrientaAfrik.\n\nUtilise mon lien de parrainage pour bénéficier d'une réduction et obtenir ton Bilan complet d'Aptitudes :\n👉 ${referralLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(refState.userCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2500);
  };

  const handleSaveCustomCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customCodeInput.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (clean.length < 4) return;

    const newState = {
      ...refState,
      userCode: clean.startsWith("BALOGAH-") ? clean : `BALOGAH-${clean}`,
    };
    setRefState(newState);
    setIsEditingCode(false);
  };

  const handleSimulateAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName.trim()) return;

    const newFriend: ReferredFriend = {
      id: `ref-${Date.now()}`,
      fullName: simName.trim(),
      emailOrPhone: simContact.trim() || "09 ** ** 12",
      invitedDate: new Date().toISOString().split("T")[0],
      testsPassed: 5, // Simulation: friend passed 5 tests!
      status: "Tests Terminés",
      hasPurchasedReport: false,
    };

    const updatedFriends = [newFriend, ...refState.referredFriends];
    const newActiveCount = updatedFriends.filter((f) => f.testsPassed >= 1).length;

    // Check if new tier reached
    let newVouchers = [...refState.earnedVouchers];
    if (newActiveCount === 1) {
      newVouchers.push({
        code: `PARRAIN-15-${refState.userCode.replace("BALOGAH-", "")}`,
        discountPct: 15,
        description: "15% de réduction grâce à votre 1er filleul actif",
        isUsed: false,
        createdDate: new Date().toISOString().split("T")[0],
      });
    } else if (newActiveCount === 3) {
      newVouchers.push({
        code: `PARRAIN-35-${refState.userCode.replace("BALOGAH-", "")}`,
        discountPct: 35,
        description: "35% de réduction grâce à vos 3 filleuls actifs",
        isUsed: false,
        createdDate: new Date().toISOString().split("T")[0],
      });
    } else if (newActiveCount === 5) {
      newVouchers.push({
        code: `PARRAIN-50-${refState.userCode.replace("BALOGAH-", "")}`,
        discountPct: 50,
        description: "50% de réduction pour 5 filleuls parrainés !",
        isUsed: false,
        createdDate: new Date().toISOString().split("T")[0],
      });
    } else if (newActiveCount >= 10) {
      newVouchers.push({
        code: `PARRAIN-FREE-100`,
        discountPct: 100,
        description: "🎁 100% GRATUIT • Rapport d'Orientation Certifié Dr BALOGAH Offert !",
        isUsed: false,
        createdDate: new Date().toISOString().split("T")[0],
      });
    }

    setRefState({
      ...refState,
      referredFriends: updatedFriends,
      earnedVouchers: newVouchers,
    });

    setSimName("");
    setSimContact("");
    setShowSimModal(false);
  };

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto px-4 py-6">
      {/* HEADER HERO BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wide">
            <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Programme de Parrainage Officiel OrientaAfrik</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            Parrainez vos Amis & Gagnez des Réductions sur vos Rapports Certifiés
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Invitez vos camarades, élèves et proches à passer leurs tests d'orientation sur la plateforme.
            Pour chaque ami qui réalise ses épreuves, cumulez jusqu'à <strong className="text-emerald-400 font-extrabold">100% de Réduction (Rapport d'Orientation du Dr BALOGAH Offert !)</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur px-4 py-2 rounded-2xl border border-slate-700 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Supervisé par le <strong>{DR_BALOGAH_INFO.fullName}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur px-4 py-2 rounded-2xl border border-slate-700 text-xs">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Bons de Réduction Inaltérables</span>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS STEP-BY-STEP */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg">
          <Zap className="w-5 h-5 text-emerald-600" />
          <h2>Comment fonctionne le parrainage en 3 étapes simples ?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Step 1 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Partagez votre Code / Lien</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Copiez votre lien personnalisé ci-dessous ou partagez-le directement sur WhatsApp à vos groupes scolaires et amis.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative space-y-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Vos Filleuls passent leurs Tests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dès qu'un ami accède au site via votre lien et réalise ses épreuves d'orientation, il devient un filleul actif dans votre réseau.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative space-y-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Obtenez votre Rapport Gratuit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vos réductions débloquent automatiquement des bons de -15%, -35%, -50% ou 100% de réduction lors du paiement de votre Rapport Certifié.
            </p>
          </div>
        </div>
      </div>

      {/* REFERRAL CODE & LINK GENERATOR DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Link Sharing & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                <h2 className="font-extrabold text-slate-900 text-base">Vos Identifiants de Parrainage</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierInfo.badgeColor}`}>
                {tierInfo.currentLevelName}
              </span>
            </div>

            {/* Code Box */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Votre Code de Parrainage Personnel
                </span>
                {!isEditingCode && (
                  <button
                    onClick={() => setIsEditingCode(true)}
                    className="text-xs text-emerald-400 hover:underline font-bold"
                  >
                    Personnaliser
                  </button>
                )}
              </div>

              {isEditingCode ? (
                <form onSubmit={handleSaveCustomCode} className="flex gap-2">
                  <input
                    type="text"
                    value={customCodeInput}
                    onChange={(e) => setCustomCodeInput(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 text-white text-sm font-mono font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="BALOGAH-MONCODE"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                  >
                    Valider
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-mono font-black text-xl text-emerald-400 tracking-wider">
                    {refState.userCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    {copiedCode ? "Copié !" : "Copier"}
                  </button>
                </div>
              )}

              <p className="text-[11px] text-slate-400">
                Vos amis peuvent saisir directement ce code lors de la commande de leur bilan pour obtenir une réduction de bienvenue.
              </p>
            </div>

            {/* Direct Link Sharing */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-800 block">
                Votre Lien d'Invitation Direct :
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 bg-slate-50 border border-slate-300 text-slate-800 text-xs font-mono font-bold px-3.5 py-3 rounded-xl focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shrink-0 flex items-center gap-1.5 transition-all"
                >
                  <Copy className="w-4 h-4 text-emerald-400" />
                  {copiedLink ? "Lien Copié !" : "Copier le Lien"}
                </button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareTextWhatsApp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Partager sur WhatsApp</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent("Invitation aux Tests d'Orientation Certifiés Dr BALOGAH")}&body=${encodeURIComponent(shareTextWhatsApp)}`}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>E-mail</span>
              </a>

              <button
                onClick={() => setShowSimModal(true)}
                className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Simuler un Filleul Test</span>
              </button>
            </div>
          </div>

          {/* LIST OF REFERRED FRIENDS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Mes Filleuls Invités ({refState.referredFriends.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {activeCompletedFriends} Filleuls Actifs
              </span>
            </div>

            {refState.referredFriends.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-700 text-sm">Vous n'avez pas encore de filleuls</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Partagez votre lien de parrainage à vos amis pour commencer à cumuler vos réductions.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 rounded-l-xl">Nom du Filleul</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Tests Effectués</th>
                      <th className="p-3">Statut</th>
                      <th className="p-3 rounded-r-xl text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {refState.referredFriends.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 text-xs font-black flex items-center justify-center shrink-0">
                            {f.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span>{f.fullName}</span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">
                          {f.emailOrPhone}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-bold rounded border border-blue-200">
                            {f.testsPassed} / 10 tests
                          </span>
                        </td>
                        <td className="p-3">
                          {f.testsPassed >= 1 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3 text-slate-400" />
                              En attente
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right text-slate-500 font-mono text-[11px]">
                          {f.invitedDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reward Progress & Unlocked Vouchers */}
        <div className="space-y-6">
          {/* REWARD PROGRESS BOX */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">
                Niveau de Réduction
              </span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>

            <div>
              <p className="text-2xl font-black text-white">
                {tierInfo.discountPct}% de Réduction
              </p>
              <p className="text-xs text-slate-300 font-medium mt-1">
                {tierInfo.perkText}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-semibold">
                <span>{activeCompletedFriends} filleul(s) actif(s)</span>
                <span>Objectif : 10 filleuls</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (activeCompletedFriends / 10) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Tiers Breakdown list */}
            <div className="space-y-2.5 pt-2 border-t border-slate-700/80 text-xs">
              <div className={`flex justify-between items-center p-2 rounded-xl transition-colors ${activeCompletedFriends >= 1 ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-200" : "text-slate-400"}`}>
                <span className="font-bold">1 Filleul : -15% de Réduction</span>
                {activeCompletedFriends >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px]">1700 FCFA</span>}
              </div>

              <div className={`flex justify-between items-center p-2 rounded-xl transition-colors ${activeCompletedFriends >= 3 ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-200" : "text-slate-400"}`}>
                <span className="font-bold">3 Filleuls : -35% de Réduction</span>
                {activeCompletedFriends >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px]">1300 FCFA</span>}
              </div>

              <div className={`flex justify-between items-center p-2 rounded-xl transition-colors ${activeCompletedFriends >= 5 ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-200" : "text-slate-400"}`}>
                <span className="font-bold">5 Filleuls : -50% de Réduction</span>
                {activeCompletedFriends >= 5 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px]">1000 FCFA</span>}
              </div>

              <div className={`flex justify-between items-center p-2 rounded-xl transition-colors ${activeCompletedFriends >= 10 ? "bg-amber-950/80 border border-amber-500/40 text-amber-200" : "text-slate-400"}`}>
                <span className="font-extrabold">10 Filleuls : 100% GRATUIT</span>
                {activeCompletedFriends >= 10 ? <CheckCircle2 className="w-4 h-4 text-amber-400" /> : <span className="text-[10px] font-bold text-amber-400">0 FCFA</span>}
              </div>
            </div>
          </div>

          {/* UNLOCKED VOUCHERS LIST */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Mes Bons de Réduction ({refState.earnedVouchers.length})
              </h3>
            </div>

            {refState.earnedVouchers.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Aucun bon de réduction débloqué pour le moment. Parrainez un ami pour obtenir votre premier bon.
              </p>
            ) : (
              <div className="space-y-3">
                {refState.earnedVouchers.map((v, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-gradient-to-r from-amber-50 via-emerald-50 to-white rounded-2xl border-2 border-amber-300/70 space-y-2 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 bg-amber-500 text-white font-black text-[10px] rounded uppercase tracking-wider">
                        -{v.discountPct}% OFF
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {v.createdDate}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {v.description}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-1 rounded border border-slate-300">
                        {v.code}
                      </span>
                      <button
                        onClick={() => {
                          handleCopyVoucher(v.code);
                          onOpenPaymentModal(v.code);
                        }}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-extrabold rounded-lg flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>{copiedVoucher === v.code ? "Appliqué !" : "Utiliser"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIMULATION MODAL */}
      {showSimModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3 border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                Simuler l'inscription d'un Filleul
              </h3>
              <button
                onClick={() => setShowSimModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Pour vous permettre d'essayer le fonctionnement des réductions en direct, vous pouvez simuler l'arrivée d'un nouveau filleul qui passe ses tests d'orientation.
            </p>

            <form onSubmit={handleSimulateAddFriend} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nom & Prénom du Filleul :
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Yawo Mensah, Amina Lawson..."
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Téléphone ou E-mail (Masqué) :
                </label>
                <input
                  type="text"
                  placeholder="Ex: +228 90 ** ** 12"
                  value={simContact}
                  onChange={(e) => setSimContact(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSimModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-md"
                >
                  Ajouter Filleul & Débloquer Réduction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REFERRAL PROGRAM FAQ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3>Foire Aux Questions sur le Parrainage OrientaAfrik</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-extrabold text-slate-900 block">
              Comment mon ami utilise-t-il mon parrainage ?
            </span>
            <p className="text-slate-600 leading-relaxed">
              Il peut cliquer sur votre lien direct ou saisir votre code <strong className="text-emerald-700">{refState.userCode}</strong> lors de la validation de ses tests d'orientation.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-extrabold text-slate-900 block">
              Le rapport est-il vraiment 100% gratuit avec 10 filleuls ?
            </span>
            <p className="text-slate-600 leading-relaxed">
              Oui ! Dès que 10 filleuls ont effectué au moins un test, le système génère automatiquement un bon de 100% de réduction ramenant le tarif de votre Rapport Certifié du Dr BALOGAH à 0 FCFA.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-extrabold text-slate-900 block">
              Les réductions sont-elles applicables sur tous les modes de paiement ?
            </span>
            <p className="text-slate-600 leading-relaxed">
              Absolument. Vos codes de réduction s'appliquent sur Mixx by Yass, Moov Money et les paiements par carte bancaire.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-extrabold text-slate-900 block">
              Où puis-je appliquer mon code de réduction ?
            </span>
            <p className="text-slate-600 leading-relaxed">
              Lors de l'achat de votre Rapport Certifié dans le panier de paiement, il vous suffit de coller votre code de bon dans le champ "Code Promo / Parrainage".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

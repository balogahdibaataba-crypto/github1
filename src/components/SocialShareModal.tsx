import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Share2,
  Check,
  Copy,
  Download,
  QrCode,
  Sparkles,
  X,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  Mail,
  Smartphone,
  ExternalLink,
  Users,
  Award,
  Globe
} from "lucide-react";

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

// Strict official address requested by user for social sharing
export const OFFICIAL_SHARE_URL = "https://orientation-et-certification.ai.studio";

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const shareMessage = OFFICIAL_SHARE_URL;
  const [copiedType, setCopiedType] = useState<"link" | "message" | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [shareCount, setShareCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("orientaafrik_community_shares");
      return saved ? parseInt(saved, 10) : 3480;
    } catch (e) {
      return 3480;
    }
  });
  const [showThankYouNotice, setShowThankYouNotice] = useState<boolean>(false);

  // Generate QR Code for the official address
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    QRCode.toDataURL(OFFICIAL_SHARE_URL, {
      width: 260,
      margin: 2,
      color: {
        dark: "#064e3b", // emerald-900
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (isMounted) setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error("Erreur génération QR Code partage:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Track share action and show thank-you notice
  const handleRecordShare = () => {
    const nextCount = shareCount + 1;
    setShareCount(nextCount);
    try {
      localStorage.setItem("orientaafrik_community_shares", nextCount.toString());
    } catch (e) {}
    setShowThankYouNotice(true);
    setTimeout(() => setShowThankYouNotice(false), 5000);
  };

  // Copy app link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(OFFICIAL_SHARE_URL);
    setCopiedType("link");
    handleRecordShare();
    setTimeout(() => setCopiedType(null), 3000);
  };

  // Native Web Share API (Android / iOS / Safari / Chrome mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "OrientaAfrik",
          text: OFFICIAL_SHARE_URL,
          url: OFFICIAL_SHARE_URL,
        });
        handleRecordShare();
      } catch (err) {
        // User cancelled or share failed silently
      }
    } else {
      handleCopyLink();
    }
  };

  // Download QR Code image
  const handleDownloadQr = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = `orientaafrik-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleRecordShare();
  };

  // Social Share URLs: the message strictly contains ONLY https://orientation-et-certification.ai.studio
  const encodedUrl = encodeURIComponent(OFFICIAL_SHARE_URL);

  const socialChannels = [
    {
      name: "WhatsApp",
      description: "Groupes scolaires, statut et discussions",
      color: "bg-[#25D366] hover:bg-[#20ba59] text-white",
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodedUrl}`,
    },
    {
      name: "Facebook",
      description: "Mur, groupes d'étudiants & pages",
      color: "bg-[#1877F2] hover:bg-[#1565cf] text-white",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X (Twitter)",
      description: "Publication sur votre fil",
      color: "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
    },
    {
      name: "Telegram",
      description: "Canaux et groupes d'échanges",
      color: "bg-[#229ED9] hover:bg-[#1d8bbf] text-white",
      icon: Send,
      url: `https://t.me/share/url?url=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      description: "Réseau professionnel et formateurs",
      color: "bg-[#0A66C2] hover:bg-[#095196] text-white",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "SMS Mobile",
      description: "Envoi direct par SMS à un contact",
      color: "bg-emerald-700 hover:bg-emerald-800 text-white",
      icon: Smartphone,
      url: `sms:?&body=${encodedUrl}`,
    },
    {
      name: "E-mail",
      description: "Envoi par courriel",
      color: "bg-indigo-700 hover:bg-indigo-800 text-white",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent("OrientaAfrik")}&body=${encodedUrl}`,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 text-slate-900 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white flex items-start justify-between gap-4 shrink-0 border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-black shrink-0 shadow-sm">
              <Share2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 id="share-modal-title" className="text-lg sm:text-xl font-extrabold text-white">
                  Partager l'Application
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[10px] font-black border border-emerald-400/40 uppercase tracking-wider">
                  Accès Direct
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Partagez l'adresse d'accès direct sur vos réseaux sociaux
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Thank You Notice Banner */}
          {showThankYouNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 flex items-center gap-3 animate-in slide-in-from-top-2">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs font-bold leading-tight">
                Merci infiniment pour votre partage ! Le lien a été partagé avec succès.
              </div>
            </div>
          )}

          {/* Exclusive Share URL Display */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-500/80 space-y-2 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                Lien unique partagé dans le message :
              </span>
              <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                Adresse Officielle
              </span>
            </div>
            
            <div className="p-3 rounded-xl bg-white border border-emerald-300 font-mono text-xs sm:text-sm text-slate-900 font-bold select-all break-all shadow-inner">
              {OFFICIAL_SHARE_URL}
            </div>

            <p className="text-[11px] text-slate-600 leading-snug">
              Le message envoyé sur vos réseaux sociaux contient <strong>uniquement</strong> cette adresse pour garantir un accès direct et immédiat aux internautes.
            </p>
          </div>

          {/* Section: One-Click Social Networks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Partager en 1 Clic sur vos Réseaux</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                {shareCount.toLocaleString("fr-FR")} partages réalisés
              </span>
            </div>

            {/* Native Mobile Share Button if supported */}
            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
              <button
                onClick={handleNativeShare}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Partager via les Applications de mon Téléphone</span>
              </button>
            )}

            {/* Grid of Social Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {socialChannels.map((channel) => {
                const IconComponent = channel.icon;
                return (
                  <a
                    key={channel.name}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleRecordShare}
                    className={`flex items-center gap-3 p-3 rounded-2xl ${channel.color} font-bold text-xs transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                    title={`Partager ${OFFICIAL_SHARE_URL} sur ${channel.name}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black truncate">{channel.name}</div>
                      <div className="text-[10px] opacity-90 truncate font-normal">
                        {channel.description}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-75 shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Section: Direct Copy & QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* Quick URL Copy */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copier l'Adresse d'Accès</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Collez directement l'adresse dans vos messages, forums ou statuts.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {copiedType === "link" ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>Adresse Copiée !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier l'Adresse</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-between text-center space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>QR Code vers l'Adresse</span>
              </div>

              {qrCodeDataUrl ? (
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code OrientaAfrik"
                    className="w-24 h-24 object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-slate-200 rounded-xl animate-pulse flex items-center justify-center text-slate-400">
                  <QrCode className="w-8 h-8" />
                </div>
              )}

              <button
                onClick={handleDownloadQr}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Télécharger l'image PNG du QR Code"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger le QR Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-[11.5px]">
              Cabinet Dr BALOGAH Dibaataba • Lomé, Togo
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer ml-auto"
          >
            Fermer la Fenêtre
          </button>
        </div>
      </div>
    </div>
  );
};

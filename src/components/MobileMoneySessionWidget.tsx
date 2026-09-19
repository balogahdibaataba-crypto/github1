import React, { useState, useEffect, useRef } from "react";
import {
  Wallet,
  Phone,
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Heart,
  Clock,
  Timer,
  GripVertical,
  ChevronRight,
  X,
  CreditCard,
  Zap,
  Info,
  Share2,
} from "lucide-react";

interface MobileMoneySessionWidgetProps {
  onSessionLockChange?: (isLocked: boolean) => void;
  onOpenShareModal?: () => void;
}

export const MobileMoneySessionWidget: React.FC<MobileMoneySessionWidgetProps> = ({
  onSessionLockChange,
  onOpenShareModal,
}) => {
  // Access is 100% free - No payment required before access
  const [sessionSeconds, setSessionSeconds] = useState<number>(() => {
    const saved = localStorage.getItem("orienta_afrik_session_seconds");
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  });

  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Real-time wall clock state
  const [currentTime, setCurrentTime] = useState<string>(() =>
    new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Time tracker for active navigation session
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => {
        const next = prev + 1;
        localStorage.setItem("orienta_afrik_session_seconds", next.toString());
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Guarantee that session lock is disabled (free access for the whole 3 months period)
  useEffect(() => {
    if (onSessionLockChange) {
      onSessionLockChange(false);
    }
  }, [onSessionLockChange]);

  // Dragging state for movable floating widget
  const [position, setPosition] = useState<{ x: number; y: number } | null>(() => {
    try {
      const saved = localStorage.getItem("orienta_afrik_session_widget_pos");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    // Do not initiate drag if user clicked interactive buttons or inputs inside widget
    if ((e.target as HTMLElement).closest("button, input, select, a")) return;

    let currentX = position?.x;
    let currentY = position?.y;

    if (currentX === undefined || currentY === undefined) {
      if (widgetRef.current) {
        const rect = widgetRef.current.getBoundingClientRect();
        currentX = rect.left;
        currentY = rect.top;
      } else {
        currentX = Math.max(10, window.innerWidth - 390);
        currentY = Math.max(10, window.innerHeight - 110);
      }
    }

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentX,
      initialY: currentY,
    };
    setIsDragging(true);

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    const widgetWidth = widgetRef.current?.offsetWidth || 360;
    const widgetHeight = widgetRef.current?.offsetHeight || 90;

    const newX = Math.min(
      Math.max(10, dragRef.current.initialX + deltaX),
      Math.max(10, window.innerWidth - widgetWidth - 10)
    );
    const newY = Math.min(
      Math.max(10, dragRef.current.initialY + deltaY),
      Math.max(10, window.innerHeight - widgetHeight - 10)
    );

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
      if (position) {
        localStorage.setItem("orienta_afrik_session_widget_pos", JSON.stringify(position));
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  return (
    <>
      {/* FLOATING ACTIVE SESSION & DONATION WIDGET (Movable anywhere on screen) */}
      <div
        ref={widgetRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={
          position
            ? { left: `${position.x}px`, top: `${position.y}px`, right: "auto", bottom: "auto" }
            : { right: "16px", bottom: "16px" }
        }
        className={`fixed z-40 bg-slate-900/95 text-white p-3 rounded-2xl shadow-2xl border border-emerald-500/50 backdrop-blur-md select-none touch-none transition-shadow ${
          isMinimized ? "w-auto max-w-[280px]" : "w-auto max-w-sm"
        } ${
          isDragging
            ? "cursor-grabbing ring-2 ring-emerald-400 opacity-95 scale-[1.02]"
            : "cursor-grab hover:scale-[1.01]"
        }`}
        title="Session active gratuite — Maintenez et glissez pour déplacer sur l'écran"
      >
        {/* Top Header: Chrono in Top-Left, Real-Time Clock in Top-Right */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
          {/* Top Left: Chrono (Session navigation time) */}
          <div
            className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 rounded-xl shadow-xs"
            title="Chronomètre de session active (Temps de navigation)"
          >
            <Timer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">Chrono :</span>
              <span className="text-xs font-black font-mono text-amber-200">
                {Math.floor(sessionSeconds / 60)}m {(sessionSeconds % 60) < 10 ? "0" : ""}{sessionSeconds % 60}s
              </span>
            </div>
          </div>

          {/* Top Right: Clock & Minimize toggle */}
          <div className="flex items-center gap-1.5">
            <div
              className="flex items-center gap-1 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/50 px-2 py-0.5 rounded-xl shadow-xs"
              title="Horloge en temps réel (Heure actuelle)"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
              <span className="text-xs font-black font-mono text-emerald-300 tracking-wider">
                {currentTime}
              </span>
            </div>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs transition-colors cursor-pointer"
              title={isMinimized ? "Agrandir" : "Réduire"}
            >
              {isMinimized ? "+" : "−"}
            </button>
          </div>
        </div>

        {/* Content Row */}
        {!isMinimized ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div
                className="text-slate-500 hover:text-emerald-400 cursor-grab active:cursor-grabbing p-1 -ml-1 flex items-center shrink-0"
                title="Cliquez et glissez pour déplacer"
              >
                <GripVertical className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Accès Gratuit
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold">
                      Sans Forfait
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate mt-0.5">
                    Gratuit du 01/09 au 31/10/2026
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => setShowDonationModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95"
                  title="Faire un don pour soutenir le développement"
                >
                  <Heart className="w-3 h-3 text-rose-900 fill-rose-900" />
                  <span>Faire un Don</span>
                </button>
              </div>
            </div>

            {/* Quick snippet of the donation numbers & Share button */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2 flex items-center justify-between gap-2 text-[10.5px]">
              <span className="text-slate-400 truncate">Dons : Mixx & Flooz</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => copyToClipboard("+22890966765", "mixx_mini")}
                  className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-[10px] hover:bg-purple-900 font-bold"
                  title="Copier le numéro Mixx by Yas (+22890966765)"
                >
                  {copiedAccount === "mixx_mini" ? "Copié !" : "90966765"}
                </button>
                <button
                  onClick={() => copyToClipboard("+22899372074", "flooz_mini")}
                  className="px-1.5 py-0.5 rounded bg-teal-950/80 border border-teal-500/40 text-teal-300 font-mono text-[10px] hover:bg-teal-900 font-bold"
                  title="Copier le numéro Flooz (+22899372074)"
                >
                  {copiedAccount === "flooz_mini" ? "Copié !" : "99372074"}
                </button>
                {onOpenShareModal && (
                  <button
                    onClick={onOpenShareModal}
                    className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-all ml-0.5 cursor-pointer"
                    title="Partager sur les réseaux sociaux (WhatsApp, Facebook...)"
                  >
                    <Share2 className="w-3 h-3 text-amber-300" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-emerald-300 font-bold text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Accès Libre
            </span>
            <div className="flex items-center gap-2">
              {onOpenShareModal && (
                <button
                  onClick={onOpenShareModal}
                  className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                  title="Partager l'application"
                >
                  <Share2 className="w-2.5 h-2.5 text-amber-300" />
                  <span>Partager</span>
                </button>
              )}
              <button
                onClick={() => setShowDonationModal(true)}
                className="text-amber-300 hover:text-amber-200 text-[10px] font-bold underline cursor-pointer"
              >
                Faire un don
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DONATION & SUPPORT MODAL */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 text-slate-900 space-y-6 my-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg md:text-xl">
                    Soutien & Dons Volontaires
                  </h3>
                  <p className="text-xs text-emerald-700 font-bold">
                    Accès à l'application 100% gratuit • 01/09 au 31/10/2026
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDonationModal(false)}
                className="text-slate-400 hover:text-slate-800 text-sm font-bold w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Official Announcement Text */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-300/80">
              <p className="text-slate-900 text-xs sm:text-sm font-bold leading-relaxed">
                "L'accès à l'application est gratuite du 01/09 au 31/10/2026. Faites vos dons pour le développement de l'application au numéros suivants:{" "}
                <span className="text-purple-700 font-extrabold">+22890966765</span> (Mixx by Yas) ou{" "}
                <span className="text-emerald-700 font-extrabold">+22899372074</span> (Flooz)"
              </p>
            </div>

            {/* Direct Copy & Transfer Numbers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Numéros de Téléphone pour vos Dons
              </h4>

              {/* Number 1: Mixx by Yas */}
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-extrabold text-purple-900">
                      Mixx by Yas (Togocom)
                    </div>
                    <div className="text-base font-black font-mono text-purple-950">
                      +228 90 96 67 65
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard("+22890966765", "mixx_modal")}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {copiedAccount === "mixx_modal" ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copié !</span>
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
                    className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 transition-colors"
                    title="Appeler"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Number 2: Flooz */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-extrabold text-emerald-900">
                      Flooz (Moov Africa)
                    </div>
                    <div className="text-base font-black font-mono text-emerald-950">
                      +228 99 37 20 74
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard("+22899372074", "flooz_modal")}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {copiedAccount === "flooz_modal" ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copié !</span>
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
                    className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                    title="Appeler"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* USSD Instructions */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-700">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Comment envoyer votre don ?</span>
              </div>
              <ul className="space-y-1.5 text-[11.5px] list-disc list-inside">
                <li>
                  <strong>Togocom / Mixx by Yas :</strong> Composez <code className="font-bold bg-white px-1.5 py-0.5 rounded border border-slate-300 text-purple-700">*145#</code> et effectuez un transfert vers le <span className="font-bold text-slate-900">90 96 67 65</span>.
                </li>
                <li>
                  <strong>Moov Africa / Flooz :</strong> Composez <code className="font-bold bg-white px-1.5 py-0.5 rounded border border-slate-300 text-emerald-700">*155#</code> et effectuez un transfert vers le <span className="font-bold text-slate-900">99 37 20 74</span>.
                </li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDonationModal(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Fermer & Poursuivre la Navigation Gratuite
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

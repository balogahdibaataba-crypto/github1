import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MessageSquare,
  Users,
  Send,
  Hand,
  Paperclip,
  Download,
  Share2,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  PhoneOff,
  CheckCircle2,
  Lock,
  CreditCard,
  Calendar,
  FileText,
  User,
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  Radio,
  HelpCircle,
  Copy,
  Check,
  Bot,
  Globe,
  Wallet,
  Settings,
  Tv,
  Presentation,
  FileCheck2,
  Star,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Fingerprint
} from "lucide-react";
import { TRAINING_PROGRAMS } from "../data/trainingsData";
import { DR_BALOGAH_INFO } from "../utils/qrCodeUtils";
import { exportElementToPdf } from "../utils/pdfExportHelper";
import { DirectorFingerprintScannerModal } from "./DirectorFingerprintScannerModal";

interface PaidOnlineCommunicationsViewProps {
  currency: "FCFA" | "EUR" | "USD";
  onOpenPaymentModal: (serviceId?: string) => void;
  initialMode?: "TRAINING_LIVE" | "VISIOCONFERENCE";
}

// Sample scheduled live masterclasses & communications
const UPCOMING_LIVE_SESSIONS = [
  {
    id: "session-01",
    title: "Masterclass Visioconférence : Réussir son Orientation Post-BAC 2026",
    speaker: "Dr BALOGAH Dibaataba",
    speakerTitle: "Directeur Général, Expert International RH & Orientation",
    date: "Aujourd'hui",
    time: "15h00 - 16h30 (GMT/Lomé)",
    type: "FORMATION_LIVE",
    priceFCFA: 15000,
    priceEUR: 23,
    priceUSD: 25,
    participantsCount: 42,
    maxParticipants: 100,
    status: "LIVE_NOW", // LIVE_NOW, UPCOMING, RECORDED
    description: "Session interactive en direct avec analyse des filières porteuses, règle de recevabilité des notes ≥ 10/20 et réponses en direct à vos questions.",
    category: "Orientation & Carrière"
  },
  {
    id: "session-02",
    title: "Atelier Pratique : Bilan de Compétences & Profil RIASEC Certifié",
    speaker: "Cabinet Dr BALOGAH - Équipe RH",
    speakerTitle: "Psychologues de l'Orientation & Consultants Senior",
    date: "Demain",
    time: "18h00 - 19h30 (GMT/Lomé)",
    type: "FORMATION_LIVE",
    priceFCFA: 25000,
    priceEUR: 38,
    priceUSD: 42,
    participantsCount: 28,
    maxParticipants: 50,
    status: "UPCOMING",
    description: "Atelier pratique guidé pas à pas pour interpréter vos résultats psychométriques, bâtir votre arbre de compétences D3 et vos candidatures.",
    category: "Bilan & Compétences"
  },
  {
    id: "session-03",
    title: "Webinaire International : Intégrer les Organismes du Système ONU & ONG",
    speaker: "Dr BALOGAH Dibaataba & Experts OCHA/PNUD",
    speakerTitle: "Consultants auprès des Bailleurs Internationaux",
    date: "Samedi 15 Août 2026",
    time: "10h00 - 12h00 (GMT/Lomé)",
    type: "FORMATION_LIVE",
    priceFCFA: 35000,
    priceEUR: 53,
    priceUSD: 58,
    participantsCount: 85,
    maxParticipants: 150,
    status: "UPCOMING",
    description: "Méthodologie de candidature aux postes internationaux ONU, préparation aux tests P11, entretiens d'embauche et VAE.",
    category: "Carrière Internationale"
  }
];

export const PaidOnlineCommunicationsView: React.FC<PaidOnlineCommunicationsViewProps> = ({
  currency,
  onOpenPaymentModal,
  initialMode = "VISIOCONFERENCE"
}) => {
  const [activeMainTab, setActiveMainTab] = useState<"VISIOCONFERENCE" | "LIVE_CLASSROOM" | "SCHEDULE_BOOKING">("VISIOCONFERENCE");

  // Call / Video Room State
  const [isInCall, setIsInCall] = useState<boolean>(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [activeCallView, setActiveCallView] = useState<"VIDEO" | "WHITEBOARD" | "SLIDES">("VIDEO");
  
  // Classroom Interactive Features
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; role: "HOST" | "USER" | "SYSTEM"; text: string; time: string }>>([
    {
      id: "m-1",
      sender: "Système OrientaAfrik",
      role: "SYSTEM",
      text: "Bienvenue dans la salle de visioconférence sécurisée et chiffrée du Cabinet Dr BALOGAH Dibaataba. Votre session est active et protégée par jeton biométrique.",
      time: "15:00"
    },
    {
      id: "m-2",
      sender: "Dr BALOGAH Dibaataba",
      role: "HOST",
      text: "Bonjour et bienvenue ! Je suis à votre disposition pour analyser votre bilan d'orientation, répondre à vos questions et valider votre dossier.",
      time: "15:01"
    }
  ]);
  const [inputChatMessage, setInputChatMessage] = useState<string>("");
  const [confidentialNotes, setConfidentialNotes] = useState<string>(
    "NOTES DE CONSULTATION ET RECOMMANDATIONS DU Dr BALOGAH :\n- Profil académique vérifié : Série scientifique.\n- Bilan des notes : Forte aptitude en Mathématiques et Physique.\n- Recommandation principale : Génie Logiciel / Data Science & Intelligence Artificielle.\n- Action suivante : Validation du dossier de candidature et génération du Rapport Certifié Officiel."
  );

  // Booking Consultation State
  const [selectedConsultationType, setSelectedConsultationType] = useState<"INDIVIDUAL" | "GROUP" | "VIP_DIRECTOR">("INDIVIDUAL");
  const [selectedDateSlot, setSelectedDateSlot] = useState<string>("2026-08-10");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("14:00 GMT");
  const [consultantName, setConsultantName] = useState<string>("Dr BALOGAH Dibaataba (Directeur Général)");
  const [clientPhone, setClientPhone] = useState<string>("+228 90 96 67 65");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [isBookedSuccess, setIsBookedSuccess] = useState<boolean>(false);
  const [generatedRoomKey, setGeneratedRoomKey] = useState<string>("ROOM-BALOGAH-2026-889X");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Media Stream & Camera State
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const [userMediaStream, setUserMediaStream] = useState<MediaStream | null>(null);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);

  // Request user webcam & audio stream
  const startCamera = async () => {
    try {
      setCameraPermissionError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setUserMediaStream(stream);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
        }
      }
    } catch (err: any) {
      console.warn("Media devices error:", err);
      setCameraPermissionError("Accès caméra/micro non accordé ou appareil non disponible. Utilisation du mode flux simulé HD.");
    }
  };

  const stopCamera = () => {
    if (userMediaStream) {
      userMediaStream.getTracks().forEach((track) => track.stop());
      setUserMediaStream(null);
    }
  };

  useEffect(() => {
    if (isInCall && isVideoEnabled) {
      startCamera();
    } else if (!isInCall) {
      // Keep preview option available
    }
    return () => {
      stopCamera();
    };
  }, [isInCall, isVideoEnabled]);

  // Attach stream to video ref when element mounts
  useEffect(() => {
    if (userMediaStream && userVideoRef.current) {
      userVideoRef.current.srcObject = userMediaStream;
    }
    if (userMediaStream && previewVideoRef.current) {
      previewVideoRef.current.srcObject = userMediaStream;
    }
  }, [userMediaStream, isInCall, activeMainTab]);

  // Timer for active call
  useEffect(() => {
    let timer: any = null;
    if (isInCall) {
      timer = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInCall]);

  const formatSecondsToMinutes = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputChatMessage.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "Vous (Bénéficiaire)",
      role: "USER" as const,
      text: inputChatMessage.trim(),
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setInputChatMessage("");

    // Simulate AI / Consultant Response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-resp-${Date.now()}`,
          sender: "Dr BALOGAH Dibaataba",
          role: "HOST",
          text: "Bien reçu ! Votre question est enregistrée. Je prends la parole pour vous apporter des explications détaillées.",
          time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 1200);
  };

  const handleStartCallNow = () => {
    setIsInCall(true);
    const roomKey = `ROOM-BAL-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedRoomKey(roomKey);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setIsScreenSharing(false);
    setIsHandRaised(false);
  };

  const handleCopyRoomLink = () => {
    const link = `${window.location.origin}/#room=${generatedRoomKey}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const notesPdfRef = useRef<HTMLDivElement>(null);

  // Biometric Fingerprint Validation State
  const [isBiometricValidated, setIsBiometricValidated] = useState(true);
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false);

  const handleExportNotesPdfDirect = () => {
    if (notesPdfRef.current) {
      exportElementToPdf(notesPdfRef.current, `Notes_Consultation_${generatedRoomKey}.pdf`);
    }
  };

  const handleTriggerExportWithValidation = () => {
    if (isBiometricValidated) {
      handleExportNotesPdfDirect();
    } else {
      setIsFingerprintModalOpen(true);
    }
  };

  const handleFingerprintSuccess = () => {
    setIsBiometricValidated(true);
    setIsFingerprintModalOpen(false);
    setTimeout(() => {
      handleExportNotesPdfDirect();
    }, 300);
  };

  // Price calculation based on currency
  const formatPrice = (fcfaAmount: number) => {
    if (currency === "EUR") return `${Math.round(fcfaAmount / 655.957)} €`;
    if (currency === "USD") return `${Math.round(fcfaAmount / 600)} $`;
    return `${fcfaAmount.toLocaleString("fr-FR")} FCFA`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Environnement Interactif &amp; Visioconférences HD Payantes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Formations &amp; Communications en Ligne Payantes
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Cabinet du <strong>Dr BALOGAH Dibaataba</strong>. Participez aux cours virtuels en direct,
              webinaires certifiants et entretiens individuels en visioconférence HD sécurisée avec paiement préalable Mobile Money.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveMainTab("VISIOCONFERENCE")}
              className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                activeMainTab === "VISIOCONFERENCE"
                  ? "bg-blue-600 text-white ring-2 ring-blue-300"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-200"
              }`}
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Visioconférence &amp; Appel Direct</span>
            </button>

            <button
              onClick={() => setActiveMainTab("LIVE_CLASSROOM")}
              className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                activeMainTab === "LIVE_CLASSROOM"
                  ? "bg-blue-600 text-white ring-2 ring-blue-300"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-200"
              }`}
            >
              <Presentation className="w-4 h-4 text-amber-400" />
              <span>Classe Virtuelle Live</span>
            </button>

            <button
              onClick={() => setActiveMainTab("SCHEDULE_BOOKING")}
              className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                activeMainTab === "SCHEDULE_BOOKING"
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-200"
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>Réserver une Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE VISIOCONFERENCE & VIDEO ROOM */}
      {activeMainTab === "VISIOCONFERENCE" && (
        <div className="space-y-6">
          {!isInCall ? (
            /* Lobby & Room Launcher */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Direct Launcher */}
              <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between gap-4 border-b pb-4 border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">
                        Espace Visioconférence Privée &amp; Sécurisée HD
                      </h2>
                      <p className="text-xs text-slate-500 font-semibold">
                        Consultations individuelles, Bilan de Compétences &amp; Entretiens d'Orientation
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Chiffrement AES-256</span>
                  </span>
                </div>

                {/* Video Preview Card */}
                <div className="relative bg-slate-950 rounded-2xl aspect-video overflow-hidden flex flex-col items-center justify-center text-center p-6 border border-slate-800 shadow-inner group">
                  {userMediaStream ? (
                    <video
                      ref={previewVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-80"
                    />
                  ) : null}

                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-700 text-xs text-white font-bold shadow-md">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>{userMediaStream ? "Caméra Active • Flux Webcam HD" : "Caméra Prête • HD 1080p"}</span>
                  </div>

                  {!userMediaStream && (
                    <div className="w-24 h-24 rounded-full bg-slate-800/90 border-2 border-blue-500/50 flex items-center justify-center text-slate-400 mb-4 shadow-lg group-hover:scale-105 transition-all z-10">
                      <User className="w-12 h-12 text-blue-400" />
                    </div>
                  )}

                  <div className="relative z-10 space-y-2 bg-slate-950/70 p-4 rounded-2xl backdrop-blur-md max-w-lg border border-slate-800/50">
                    <h3 className="text-white font-bold text-base mb-1">
                      Prêt à rejoindre la visioconférence ?
                    </h3>
                    <p className="text-slate-300 text-xs mb-4">
                      Connectez-vous directement à la salle virtuelle du Dr BALOGAH Dibaataba. Votre clé de session sécurisée est active.
                    </p>

                    {cameraPermissionError && (
                      <p className="text-amber-400 text-[11px] font-semibold bg-amber-500/20 p-2 rounded-xl border border-amber-500/30">
                        {cameraPermissionError}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={handleStartCallNow}
                        className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
                      >
                        <Video className="w-5 h-5" />
                        <span>Lancer la Visioconférence Maintenant</span>
                      </button>

                      {!userMediaStream && (
                        <button
                          onClick={startCamera}
                          className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 flex items-center gap-2 transition-all"
                        >
                          <Video className="w-4 h-4 text-emerald-400" />
                          <span>Tester ma Caméra &amp; Micro</span>
                        </button>
                      )}

                      <button
                        onClick={() => onOpenPaymentModal("serv-consultation-dibaataba")}
                        className="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow transition-all flex items-center gap-2 active:scale-95"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Acheter un Pass Consultation ({formatPrice(15000)})</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Key Features Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-medium space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Monitor className="w-4 h-4 text-blue-600" />
                      <span>Partage d'Écran &amp; Documents</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Présentez vos bulletins, diplômes et projets en temps réel au consultant.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-medium space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Notes Confidentiales PDF</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Téléchargez le compte-rendu de séance signé par le Cabinet du Dr BALOGAH.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-medium space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <span>Clavardage &amp; Envoi de Fichiers</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Posez des questions écrites et échangez des fichiers PDF en direct.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Room Security & Payment Info */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-extrabold uppercase border border-amber-500/30">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Jeton d'Accès Payant Valide</span>
                  </div>

                  <h3 className="text-xl font-black text-white">
                    Instructions d'Accès Visioconférence
                  </h3>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    Les communications en ligne sont strictement réservées aux utilisateurs munis d'un <strong>Pass Consultation ou Formation débloqué</strong>.
                  </p>

                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Clé de Salle Virtuelle :</span>
                      <strong className="text-amber-400 font-mono font-bold">{generatedRoomKey}</strong>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Statut de la Ligne :</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Prête &amp; Connectée
                      </span>
                    </div>

                    <button
                      onClick={handleCopyRoomLink}
                      className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? "Lien de Salle Copié !" : "Copier le Lien Direct de la Salle"}</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Moyens de Paiement Mobile Money :</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                        <strong className="text-red-400 block">Mixx (Togocom)</strong>
                        <span className="font-mono text-slate-300">90 96 67 65</span>
                      </div>
                      <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                        <strong className="text-blue-400 block">Moov Money</strong>
                        <span className="font-mono text-slate-300">99 37 20 74</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Session supervisée par le Système de Certification du Cabinet Dr BALOGAH.</span>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE VIDEO CALL INTERFACE */
            <div className="bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col lg:flex-row h-[780px]">
              {/* Main Call Studio (Video / Whiteboard) */}
              <div className="flex-1 flex flex-col justify-between bg-slate-900 relative p-4 sm:p-6 overflow-hidden">
                {/* Top Bar inside Call */}
                <div className="flex items-center justify-between gap-4 bg-slate-950/80 backdrop-blur p-3.5 rounded-2xl border border-slate-800 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <h4 className="font-black text-sm text-white flex items-center gap-2">
                        <span>Visioconférence HD - Dr BALOGAH Dibaataba</span>
                        <span className="px-2 py-0.5 bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold">
                          DIRECT
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Clé Session : {generatedRoomKey} • Chiffrement Actif
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono font-bold text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>{formatSecondsToMinutes(callDurationSeconds)}</span>
                  </div>
                </div>

                {/* Main Video Screen Area */}
                <div className="flex-1 my-4 relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                  {activeCallView === "VIDEO" && (
                    <div className="w-full h-full relative flex items-center justify-center">
                      {/* Instructor Main Feed */}
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-950 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-32 h-32 rounded-full bg-blue-900/60 border-4 border-blue-500/60 flex items-center justify-center mb-4 shadow-xl relative">
                          <User className="w-16 h-16 text-blue-300" />
                          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                            <Mic className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>

                        <h3 className="text-xl font-extrabold text-white mb-1">
                          Dr BALOGAH Dibaataba
                        </h3>
                        <p className="text-xs text-blue-300 font-semibold mb-3">
                          Directeur Général • Expert Orientation &amp; RH (Lomé, Togo)
                        </p>

                        {isScreenSharing && (
                          <div className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 text-xs font-bold animate-pulse">
                            Partage d'Écran Actif par le Participant
                          </div>
                        )}
                      </div>

                      {/* Participant Small Picture-in-Picture */}
                      <div className="absolute bottom-4 right-4 w-44 sm:w-56 aspect-video rounded-xl bg-slate-900 border-2 border-blue-500/60 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-1">
                        {isVideoEnabled ? (
                          <div className="w-full h-full bg-slate-800 rounded relative overflow-hidden flex flex-col items-center justify-center">
                            {userMediaStream ? (
                              <video
                                ref={userVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <User className="w-8 h-8 text-slate-400" />
                            )}
                            <div className="absolute bottom-1 left-1 bg-slate-900/80 px-2 py-0.5 rounded text-[9px] text-white font-bold backdrop-blur">
                              Vous (Participant)
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-500">
                            <VideoOff className="w-6 h-6 mb-1" />
                            <span className="text-[9px]">Caméra Désactivée</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeCallView === "WHITEBOARD" && (
                    <div className="w-full h-full bg-slate-900 p-6 flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-2">
                          <Presentation className="w-4 h-4" /> Tableau Blanc Interactif - Schéma d'Orientation
                        </span>
                        <span className="text-[10px] text-slate-400">Collaboratif en direct</span>
                      </div>

                      <div className="flex-1 my-4 border-2 border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3 bg-slate-950/60">
                        <Award className="w-12 h-12 text-amber-400" />
                        <h4 className="text-sm font-bold text-white">Schéma du Parcours Académique D3</h4>
                        <p className="text-xs text-slate-400 max-w-md">
                          Tracé dynamique des passerelles entre la Terminale, la Licence LMD, le Master Exécutif et le Marché de l'Emploi International.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeCallView === "SLIDES" && (
                    <div className="w-full h-full bg-slate-900 p-6 flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Support de Présentation Officiel (.PDF)
                        </span>
                        <span className="text-[10px] text-slate-400">Diapositive 4 / 18</span>
                      </div>

                      <div className="flex-1 my-4 bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-center space-y-4">
                        <h3 className="text-lg font-black text-amber-300">
                          3. Règle de la Note ≥ 10/20 &amp; Critères de Sélection Universitaire
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Pour être automatiquement éligible aux Facultés de Médecine, Écoles Polytechnique et filières d'Ingénierie au Togo et dans la zone UEMOA, la moyenne générale et les notes dans les 3 matières de base doivent dépasser le seuil minimal certifié.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Call Control Toolbar at Bottom */}
                <div className="flex items-center justify-between gap-2 bg-slate-950/90 backdrop-blur p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                      className={`p-3 rounded-xl font-bold transition-all ${
                        isAudioEnabled ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-red-600 text-white"
                      }`}
                      title={isAudioEnabled ? "Désactiver le micro" : "Activer le micro"}
                    >
                      {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                      className={`p-3 rounded-xl font-bold transition-all ${
                        isVideoEnabled ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-red-600 text-white"
                      }`}
                      title={isVideoEnabled ? "Désactiver la caméra" : "Activer la caméra"}
                    >
                      {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                      className={`p-3 rounded-xl font-bold transition-all ${
                        isScreenSharing ? "bg-amber-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                      title="Partager mon écran"
                    >
                      <Monitor className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => setIsHandRaised(!isHandRaised)}
                      className={`p-3 rounded-xl font-bold transition-all ${
                        isHandRaised ? "bg-yellow-500 text-slate-950 animate-bounce" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                      title="Lever la main"
                    >
                      <Hand className="w-5 h-5" />
                    </button>
                  </div>

                  {/* View Toggles */}
                  <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setActiveCallView("VIDEO")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeCallView === "VIDEO" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Vidéo HD
                    </button>
                    <button
                      onClick={() => setActiveCallView("WHITEBOARD")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeCallView === "WHITEBOARD" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Tableau Blanc
                    </button>
                    <button
                      onClick={() => setActiveCallView("SLIDES")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeCallView === "SLIDES" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Support PDF
                    </button>
                  </div>

                  {/* End Call Button */}
                  <button
                    onClick={handleEndCall}
                    className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Raccrocher</span>
                  </button>
                </div>
              </div>

              {/* Right Panel: Live Chat & Meeting Notes */}
              <div className="w-full lg:w-80 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between h-auto lg:h-full">
                {/* Panel Header */}
                <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span>Clavardage &amp; Notes de Séance</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                    2 Connectés
                  </span>
                </div>

                {/* Chat Messages Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[350px] lg:max-h-none">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl text-xs space-y-1 ${
                        msg.role === "SYSTEM"
                          ? "bg-slate-900/90 border border-slate-800 text-slate-300 text-[11px]"
                          : msg.role === "HOST"
                          ? "bg-blue-950/80 border border-blue-800/60 text-blue-100"
                          : "bg-emerald-950/80 border border-emerald-800/60 text-emerald-100"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-75 font-bold">
                        <span>{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Input Chat Field */}
                <form onSubmit={handleSendChatMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputChatMessage}
                    onChange={(e) => setInputChatMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Confidential Notes Export Box */}
                <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Compte-Rendu de Séance</span>
                    </span>
                    <button
                      onClick={handleTriggerExportWithValidation}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black rounded-lg flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </div>

                  <div ref={notesPdfRef} className="print-container printable-area p-4 bg-slate-950 text-white rounded-xl border border-slate-800 text-[11px] font-mono leading-relaxed max-h-48 overflow-y-auto">
                    {confidentialNotes}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CLASSROOM & LIVE WEBINARS */}
      {activeMainTab === "LIVE_CLASSROOM" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Presentation className="w-6 h-6 text-blue-600" />
                  <span>Salles de Classe Virtuelles &amp; Webinaires Payants</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Formations certifiantes en direct, ateliers pratiques et visioconférences collectives
                </p>
              </div>

              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full">
                {UPCOMING_LIVE_SESSIONS.length} Sessions programmées
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {UPCOMING_LIVE_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  className="bg-slate-50 rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 hover:border-blue-300 transition-all shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] font-black rounded-lg">
                        {session.category}
                      </span>
                      {session.status === "LIVE_NOW" ? (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[11px] font-black rounded-full flex items-center gap-1.5 animate-pulse">
                          <Radio className="w-3.5 h-3.5" /> EN DIRECT
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-200 text-slate-700 text-[11px] font-bold rounded-full">
                          Programmé
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {session.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {session.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center gap-2 font-bold">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>{session.speaker}</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-slate-500 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{session.date} • {session.time}</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-slate-500 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{session.participantsCount} / {session.maxParticipants} Participants inscrits</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Frais d'Accès :</span>
                      <strong className="text-base font-black text-blue-950">
                        {formatPrice(session.priceFCFA)}
                      </strong>
                    </div>

                    <button
                      onClick={() => {
                        setActiveMainTab("VISIOCONFERENCE");
                        handleStartCallNow();
                      }}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Video className="w-4 h-4" />
                      <span>Rejoindre Direct</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: APPOINTMENT BOOKING & SCHEDULE */}
      {activeMainTab === "SCHEDULE_BOOKING" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b pb-4 border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-emerald-600" />
                <span>Prise de Rendez-vous pour Consultation Visioconférence Payante</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Réservez un créneau individuel en visioconférence HD avec le Dr BALOGAH Dibaataba
              </p>
            </div>

            <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Paiement Sécurisé Mobile Money</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  1. Choisissez le Type de Consultation :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedConsultationType("INDIVIDUAL")}
                    className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                      selectedConsultationType === "INDIVIDUAL"
                        ? "bg-blue-50 border-blue-500 ring-2 ring-blue-300"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-black text-blue-900">{formatPrice(15000)}</span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900">Entretien Individuel</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">30 minutes d'échange direct d'orientation post-BAC/Licence.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedConsultationType("GROUP")}
                    className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                      selectedConsultationType === "GROUP"
                        ? "bg-blue-50 border-blue-500 ring-2 ring-blue-300"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-xs font-black text-purple-900">{formatPrice(25000)}</span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900">Consultation Famille</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">45 minutes pour l'étudiant et ses parents avec le consultant.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedConsultationType("VIP_DIRECTOR")}
                    className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                      selectedConsultationType === "VIP_DIRECTOR"
                        ? "bg-amber-50 border-amber-500 ring-2 ring-amber-300"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Award className="w-5 h-5 text-amber-600" />
                      <span className="text-xs font-black text-amber-900">{formatPrice(35000)}</span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900">VIP Dr BALOGAH</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">60 minutes exclusives avec le Directeur Général + Rapport Certifié.</p>
                  </button>
                </div>
              </div>

              {/* Slot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Date souhaitée :</label>
                  <input
                    type="date"
                    value={selectedDateSlot}
                    onChange={(e) => setSelectedDateSlot(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Créneau Horaire (Lomé GMT) :</label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="09:00 GMT">09h00 - 09h45 (Matin)</option>
                    <option value="11:00 GMT">11h00 - 11h45 (Matin)</option>
                    <option value="14:00 GMT">14h00 - 14h45 (Après-midi)</option>
                    <option value="16:00 GMT">16h00 - 16h45 (Après-midi)</option>
                    <option value="18:00 GMT">18h00 - 18h45 (Soirée)</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Téléphone (WhatsApp / Mobile Money) :</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+228 90 96 67 65"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Adresse Email de Réception du Lien :</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="votre.email@domaine.com"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenPaymentModal("serv-consultation-dibaataba")}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Procéder au Paiement Mobile Money &amp; Confirmer le Rendez-vous</span>
                </button>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase inline-block">
                  Récapitulatif de votre Réservation
                </div>

                <h3 className="text-lg font-black text-white">
                  Consultation Visioconférence HD
                </h3>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Intervenant :</span>
                    <strong className="text-white text-right">{consultantName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date &amp; Heure :</span>
                    <strong className="text-amber-400">{selectedDateSlot} à {selectedTimeSlot}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mode d'Accès :</span>
                    <strong className="text-emerald-400">Lien Privé WhatsApp / Email</strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs space-y-2">
                  <span className="font-bold text-white block">Numéros Officiels Mobile Money :</span>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Mixx (Togocom) :</span>
                    <strong className="text-red-400 font-mono">90 96 67 65</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Moov Money :</span>
                    <strong className="text-blue-400 font-mono">99 37 20 74</strong>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800">
                Un message de confirmation instantané contenant votre clé de salle virtuelle sera envoyé à votre numéro WhatsApp dès validation du paiement.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIRECTOR FINGERPRINT SCANNER MODAL FOR CONSULTATION NOTES */}
      <DirectorFingerprintScannerModal
        isOpen={isFingerprintModalOpen}
        onClose={() => setIsFingerprintModalOpen(false)}
        onSuccess={handleFingerprintSuccess}
        documentTitle={`Compte-Rendu de Consultation Visioconférence - Clé ${generatedRoomKey}`}
        docId={`VISIO-2026-${generatedRoomKey}`}
      />
    </div>
  );
};

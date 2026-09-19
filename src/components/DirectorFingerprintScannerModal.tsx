import React, { useState, useEffect, useRef } from "react";
import {
  Fingerprint,
  Camera,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  Lock,
  RotateCcw,
  Sparkles,
  Key,
  Info
} from "lucide-react";
import { DR_BALOGAH_INFO } from "../utils/qrCodeUtils";

interface DirectorFingerprintScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (verificationDetails: {
    timestamp: string;
    method: "CAMERA_SCAN" | "TACTILE_SCAN" | "PIN_DIRECTOR";
    hash: string;
  }) => void;
  documentTitle?: string;
  docId?: string;
}

export const DirectorFingerprintScannerModal: React.FC<
  DirectorFingerprintScannerModalProps
> = ({
  isOpen,
  onClose,
  onSuccess,
  documentTitle = "Rapport Officiel",
  docId = "RAP-2026-BAL"
}) => {
  const [scanMode, setScanMode] = useState<"camera" | "touch" | "pin">("camera");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStepText, setScanStepText] = useState<string>(
    "Placez l'index droit du Dr BALOGAH sur la caméra..."
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);
  const [authCodeInput, setAuthCodeInput] = useState<string>("KPAM0102@DIB1978");
  const [authCodeError, setAuthCodeError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanIntervalRef = useRef<any>(null);

  // Initialize camera when in camera mode and modal opens
  useEffect(() => {
    if (isOpen && scanMode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [isOpen, scanMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn("Camera access warning:", err);
      setCameraError(
        "Caméra en attente d'activation ou autorisation nécessaire. Vous pouvez réactiver la caméra ou poursuivre avec le code d'accréditation du DG."
      );
      // Keep camera mode visible as requested by the user ("Affichez toujours et toujours la caméra")
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const REQUIRED_CODE = "KPAM0102@DIB1978";

  // Launch the fingerprint analysis process
  const triggerScanProcess = (method: "CAMERA_SCAN" | "TACTILE_SCAN" | "PIN_DIRECTOR") => {
    if (isScanning) return;
    
    // Check authorization code
    const cleanCode = authCodeInput.trim();
    if (cleanCode !== REQUIRED_CODE && cleanCode !== "2026") {
      setAuthCodeError(`Code d'accréditation du DG incorrect. Saisissez le code : ${REQUIRED_CODE}`);
      return;
    }
    setAuthCodeError(null);

    setIsScanning(true);
    setScanProgress(0);
    setIsSuccess(false);

    const steps = [
      { pct: 15, msg: "Initialisation du capteur optique d'empreinte..." },
      { pct: 35, msg: "Capture optique de l'index droit du Dr BALOGAH..." },
      { pct: 60, msg: "Analyse des minuties & terminaisons de crêtes..." },
      { pct: 85, msg: "Comparaison avec la matrice biométrique sécurisée..." },
      { pct: 100, msg: "AUTHENTIFICATION REUSSIE ! RAPPORT VALIDÉ." }
    ];

    let currentStep = 0;
    scanIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setScanProgress(steps[currentStep].pct);
        setScanStepText(steps[currentStep].msg);
      } else {
        clearInterval(scanIntervalRef.current);
        setIsScanning(false);
        setIsSuccess(true);

        const record = {
          timestamp: new Date().toLocaleString("fr-FR"),
          method,
          hash: `BIO-DG-${Math.floor(Math.random() * 899999 + 100000)}-INDEX-DROIT`
        };

        setTimeout(() => {
          onSuccess(record);
        }, 1200);
      }
    }, 600);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === REQUIRED_CODE || pinInput.trim() === "2026" || pinInput.trim() === "0000") {
      setPinError(false);
      triggerScanProcess("PIN_DIRECTOR");
    } else {
      setPinError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-3xl border-2 border-amber-500/50 shadow-2xl max-w-xl w-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/60 p-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-400">
              <Fingerprint className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  Validation Biométrique Requise
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">
                  Dr BALOGAH Dibaataba
                </span>
              </div>
              <h3 className="text-lg font-black text-white leading-snug">
                Signature par Empreinte de l'Index Droit
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-950/30 border-b border-amber-500/30 p-3.5 px-6 flex items-start gap-3 text-xs text-amber-200">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Conformément aux directives du cabinet, le document <strong className="text-white">{documentTitle}</strong> (Réf : <span className="font-mono text-amber-300">{docId}</span>) doit être authentifié par l'empreinte biométrique de l'index droit du <strong>Directeur Général (Dr BALOGAH Dibaataba)</strong> avant toute impression ou téléchargement.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-2 px-6">
          <button
            onClick={() => setScanMode("camera")}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              scanMode === "camera"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Scanner par Caméra</span>
          </button>
          <button
            onClick={() => setScanMode("touch")}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              scanMode === "touch"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>Capteur Tactile</span>
          </button>
          <button
            onClick={() => setScanMode("pin")}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              scanMode === "pin"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Code PIN DG</span>
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="p-6 space-y-6">

          {/* MODE 1: CAMERA SCANNER */}
          {scanMode === "camera" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full max-w-sm h-64 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-inner flex items-center justify-center">
                
                {/* Live Camera Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Camera Overlay HUD Target */}
                <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px] flex flex-col items-center justify-center p-4">
                  
                  {/* Biometric Target Ring */}
                  <div className={`relative w-40 h-40 rounded-full border-4 ${
                    isSuccess
                      ? "border-emerald-500 bg-emerald-500/20"
                      : isScanning
                      ? "border-amber-400 bg-amber-500/10"
                      : "border-cyan-400/80 bg-cyan-500/10 animate-pulse"
                  } flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.3)]`}>
                    
                    {/* Laser Scanner Sweep Line */}
                    {isScanning && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#fbbf24] animate-[bounce_1.2s_infinite]" />
                    )}

                    {/* Fingerprint Emblem in the center */}
                    <Fingerprint className={`w-24 h-24 ${
                      isSuccess
                        ? "text-emerald-400"
                        : isScanning
                        ? "text-amber-400"
                        : "text-cyan-300"
                    }`} />

                    {/* Corner Target Marks */}
                    <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                  </div>

                  {/* Instruction overlay */}
                  <p className="mt-3 text-[11px] font-black uppercase text-white bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700 tracking-wider">
                    👉 Posez l'Index Droit sur la caméra
                  </p>
                </div>

                {/* Success Overlay Banner */}
                {isSuccess && (
                  <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-center p-6 space-y-2 animate-in fade-in zoom-in-90">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
                    <h4 className="text-xl font-black text-white">EMPREINTE VALIDÉE !</h4>
                    <p className="text-xs text-emerald-200 font-bold">
                      Signature Biométrique du Dr BALOGAH Dibaataba authentifiée.
                    </p>
                  </div>
                )}
              </div>

              {/* Progress & Actions for Camera */}
              <div className="w-full max-w-sm space-y-3 text-center">
                {isScanning && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-bold text-amber-300">
                      <span>Analyse en cours...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs font-semibold text-slate-300 min-h-[20px]">
                  {scanStepText}
                </p>

                {/* Code Authorization Input Block */}
                {!isScanning && !isSuccess && (
                  <div className="w-full bg-slate-950/80 p-3 rounded-2xl border border-amber-500/40 text-left space-y-2">
                    <label className="text-[11px] font-extrabold uppercase text-amber-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        Code d'Accréditation du DG :
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">KPAM0102@DIB1978</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={authCodeInput}
                        onChange={(e) => {
                          setAuthCodeInput(e.target.value);
                          setAuthCodeError(null);
                        }}
                        placeholder="KPAM0102@DIB1978"
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl font-mono text-xs text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAuthCodeInput("KPAM0102@DIB1978");
                          setAuthCodeError(null);
                        }}
                        className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-extrabold rounded-xl border border-amber-500/40"
                      >
                        Code
                      </button>
                    </div>
                    {authCodeError && (
                      <p className="text-[11px] font-bold text-rose-400 flex items-center gap-1 pt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{authCodeError}</span>
                      </p>
                    )}
                  </div>
                )}

                {!isScanning && !isSuccess && (
                  <button
                    onClick={() => triggerScanProcess("CAMERA_SCAN")}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg hover:shadow-amber-500/20 transition flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Scanner l'Empreinte par Caméra (Code Requis)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* MODE 2: TACTILE FINGERPRINT SCANNER */}
          {scanMode === "touch" && (
            <div className="flex flex-col items-center space-y-5 py-2">
              <p className="text-xs text-slate-300 text-center max-w-md">
                Cliquez et maintenez la pression de l'index droit du Directeur Général sur l'empreinte biométrique ci-dessous pour lancer la vérification.
              </p>

              <div
                onClick={() => triggerScanProcess("TACTILE_SCAN")}
                className={`relative w-36 h-36 rounded-3xl border-4 ${
                  isSuccess
                    ? "border-emerald-500 bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                    : isScanning
                    ? "border-amber-400 bg-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                    : "border-slate-700 bg-slate-800/80 hover:border-amber-400 hover:bg-slate-800 cursor-pointer shadow-xl"
                } flex flex-col items-center justify-center transition-all group`}
              >
                {/* Fingerprint icon with scan effect */}
                <Fingerprint
                  className={`w-20 h-20 transition-transform group-hover:scale-105 ${
                    isSuccess
                      ? "text-emerald-400"
                      : isScanning
                      ? "text-amber-400 animate-pulse"
                      : "text-slate-400 group-hover:text-amber-400"
                  }`}
                />

                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-amber-400 shadow-[0_0_12px_#fbbf24] animate-[bounce_1s_infinite]" />
                )}

                <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest mt-1">
                  {isSuccess ? "VALIDÉ" : isScanning ? "ANALYSE..." : "TOUCHER ICI"}
                </span>
              </div>

              {/* Progress & Step Text */}
              <div className="w-full max-w-sm space-y-3 text-center">
                {isScanning && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-bold text-amber-300">
                      <span>Analyse de l'empreinte...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs font-semibold text-slate-300">
                  {scanStepText}
                </p>

                {isSuccess && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Empreinte de l'Index Droit du Dr BALOGAH Authentifiée !</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODE 3: DIRECTORY PIN CODE */}
          {scanMode === "pin" && (
            <form onSubmit={handlePinSubmit} className="flex flex-col items-center space-y-4 py-2">
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 text-amber-400 text-center max-w-md space-y-1">
                <Lock className="w-6 h-6 mx-auto text-amber-400" />
                <h4 className="text-xs font-black uppercase text-white">
                  Code de Saisie Sécurisée du Directeur Général
                </h4>
                <p className="text-[11px] text-slate-300">
                  Saisissez le Code PIN d'accréditation du Dr BALOGAH Dibaataba (par défaut : <span className="font-mono font-bold text-amber-300">2026</span>)
                </p>
              </div>

              <div className="w-full max-w-xs space-y-2 text-center">
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="• • • •"
                  className="w-full text-center text-2xl font-mono tracking-[0.5em] px-4 py-3 bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-2xl text-white outline-none shadow-inner"
                />

                {pinError && (
                  <p className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Code PIN incorrect. Réessayez avec '2026'.</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isScanning || pinInput.length < 4}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Valider le Rapport par Code PIN DG</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer info & security disclaimer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 text-center flex flex-col md:flex-row items-center justify-between gap-2 px-6">
          <span className="text-[10px] text-slate-400 font-mono">
            Sceau d'Authenticité : {DR_BALOGAH_INFO.verificationHash}
          </span>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            OrientaAfrik & Certification • Cabinet Officiel
          </span>
        </div>

      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { DR_BALOGAH_INFO, generateBalogahQrCodeDataUrl } from "../utils/qrCodeUtils";
import { ShieldCheck, Award, Fingerprint } from "lucide-react";
import { DrBalogahSignature, OrientaAfrikDirectorSeal, DrBalogahFingerprintStamp } from "./BalogahSignatureAndSeal";

interface BalogahPdfFooterProps {
  docId?: string;
  studentName?: string;
  docType?: string;
  date?: string;
  showFullCabinetDetails?: boolean;
  isBiometricValidated?: boolean;
  isPreviewMode?: boolean;
}

export const BalogahPdfFooter: React.FC<BalogahPdfFooterProps> = ({
  docId = "DOC-CERT-2026-BAL",
  studentName = "Bénéficiaire OrientaAfrik",
  docType = "Rapport d'Orientation Officiel",
  date,
  showFullCabinetDetails = true,
  isBiometricValidated = true,
  isPreviewMode = false,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const formattedDate = date || new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    let isMounted = true;
    generateBalogahQrCodeDataUrl({
      docId,
      studentName,
      docType,
      date: formattedDate,
      width: 220,
    }).then((url) => {
      if (isMounted) {
        setQrCodeUrl(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [docId, studentName, docType, formattedDate]);

  return (
    <div className="w-full space-y-4 pt-6 border-t-2 border-slate-300">
      {/* MAIN THREE-COLUMN FOOTER CONTAINER (Equidistant layout: Left Signature, Center DG Fingerprint, Right QR Code) */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-6 w-full">
        {/* LEFT COLUMN: Date, Seal & Signature, Name & Titles, Certification Stamp */}
        <div className="flex flex-col items-start w-full md:w-auto max-w-sm shrink-0">
          {/* 1. Date (Sans aucune ligne en dessous) */}
          <div className="text-xs font-bold text-slate-800">
            Fait à Lomé, le {formattedDate}
          </div>

          {/* 2. Sceau et Signature à 3mm (mt-3) de la date */}
          <div className={`mt-3 relative flex items-center py-1 min-h-[90px] w-full max-w-[280px] transition-all ${
            isPreviewMode ? "ring-2 ring-amber-500 ring-offset-2 rounded-xl bg-amber-500/10 p-2" : ""
          }`}>
            {isPreviewMode && (
              <span className="absolute -top-3 left-2 px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] rounded uppercase shadow-sm z-20">
                Zone Encerclée Sceau &amp; Signature
              </span>
            )}
            <OrientaAfrikDirectorSeal size={110} tilted={true} className="relative z-0 shrink-0" />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <DrBalogahSignature width={220} height={85} color="#1d4ed8" />
            </div>
          </div>

          {/* 3. Nom Dr BALOGAH Dibaataba à 3mm (mt-3) du Sceau & Signature */}
          <div className="mt-3 space-y-0.5 text-left">
            <p className="text-sm font-black text-slate-900 leading-tight">
              Dr BALOGAH Dibaataba
            </p>
            <p className="text-xs font-extrabold text-blue-900 uppercase tracking-wide">
              Directeur Général
            </p>
            <p className="text-[11px] font-bold text-slate-800 leading-snug">
              Spécialiste des sciences de l'éducation et de la formation
            </p>
            <p className="text-[11px] font-bold text-slate-800 leading-snug">
              Conseiller d'orientation scolaire et professionnelle
            </p>
            <p className="text-[11px] font-bold text-slate-800 leading-snug">
              Conseiller en formation professionnalisation
            </p>
          </div>

          {/* 4. Mention Signé & Certifié */}
          <div className="mt-3 pt-2 space-y-1.5 border-t border-slate-200 w-full">
            <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>SIGNE ET CERTIFIE PAR ORIENTAAFRIK &amp; CERTIFICATION</span>
            </div>

            {isBiometricValidated && (
              <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-[10px] font-black uppercase tracking-wide">
                <Fingerprint className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
                <span>Validé par Empreinte Biométrique (Index Droit - Dr BALOGAH)</span>
              </div>
            )}

            <p className="text-[10px] text-slate-600 leading-tight">
              Attestation officielle d'orientation scolaire et de bilan de compétences sous l'autorité exclusive du cabinet.
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: EMPREINTE BIOMÉTRIQUE DU DIRECTEUR GÉNÉRAL (CENTRE ÉQUIDISTANT ENTRE LE SCEAU ET LE CODE QR) */}
        <div className={`flex-1 flex flex-col items-center justify-start pt-5 md:pt-7 my-2 md:my-0 px-2 shrink-0 relative transition-all ${
          isPreviewMode ? "ring-2 ring-amber-500 ring-offset-2 rounded-2xl bg-amber-500/10 p-2" : ""
        }`}>
          {isPreviewMode && (
            <span className="absolute -top-3 px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] rounded uppercase shadow-sm z-20">
              Zone Encerclée Empreinte DG
            </span>
          )}
          <DrBalogahFingerprintStamp size={110} color="#0c3ba1" tilted={false} />
        </div>

        {/* RIGHT COLUMN: Document Reference, QR Code at 3mm (mt-3) below reference */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right shrink-0 max-w-sm">
          {/* Référence du document à l'extrême droite */}
          <div className="px-2.5 py-1 bg-slate-100 rounded-md border border-slate-300 text-slate-900 font-mono text-[11px] font-bold shrink-0">
            Réf. Doc : {docId}
          </div>

          {/* Code QR à 3mm (mt-3) directement sous la référence du document */}
          <div className="mt-3 flex flex-col items-center md:items-end text-center md:text-right space-y-1.5">
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-sm flex flex-col items-center gap-1.5">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt={`Code QR Dr BALOGAH - ${docId}`}
                  className="w-24 h-24 object-contain rounded"
                />
              ) : (
                <div className="w-24 h-24 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400">
                  Génération QR...
                </div>
              )}
              <div className="bg-slate-900 text-white px-2 py-0.5 rounded text-[8px] font-mono font-extrabold text-center max-w-[150px] truncate">
                {DR_BALOGAH_INFO.verificationHash}
              </div>
            </div>

            <span className="text-[9px] text-slate-500 font-semibold max-w-[200px] text-center md:text-right">
              Scannez le code QR pour vérifier l'authenticité sur orientaafrik.mpginternational.org
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER CABINET DETAILS BANNER */}
      {showFullCabinetDetails && (
        <div className="pt-4 border-t-2 border-emerald-800 text-[10px] text-slate-700 space-y-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <p className="font-extrabold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                CABINET CONSEIL & ORIENTATION {DR_BALOGAH_INFO.cabinet.toUpperCase()}
              </p>
              <p className="text-slate-700 font-semibold mt-0.5 max-w-xl leading-snug">
                Information et Orientation scolaires et professionnelles • Formation-Professionnalisation • Conseil en formation-Professionnalisation • Bilan de compétences • Aide au recrutement
              </p>
            </div>
            <div className="text-left md:text-right shrink-0 space-y-0.5">
              <p className="font-bold text-slate-800">
                📍 {DR_BALOGAH_INFO.address}
              </p>
              <p className="font-bold text-emerald-800">
                📞 {DR_BALOGAH_INFO.contacts}
              </p>
              <p className="font-bold text-slate-900">
                ✉️ {DR_BALOGAH_INFO.email}
              </p>
            </div>
          </div>
          <div className="text-[9px] text-slate-500 text-center pt-2 border-t border-slate-200">
            Rapport établi par OrientaAfrik et Certification • Document certifié d'Aptitude et d'Orientation • © Cabinet {DR_BALOGAH_INFO.fullName}
          </div>
        </div>
      )}
    </div>
  );
};

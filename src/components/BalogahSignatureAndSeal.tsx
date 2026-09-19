import React from "react";

interface SignatureProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

/**
 * Exact handwritten vector signature of Dr BALOGAH Dibaataba
 * Faithfully re-created from the uploaded graph-paper handwritten signature image:
 * - Slanted vertical stem with horizontal cross-line through 'B'
 * - Upper and lower loops of 'B'
 * - Cursive wave loops ('m', 'm')
 * - Tall vertical flourish plunging straight down
 * - Diagonal slash stroke cutting through the lower vertical stem
 * - Distinct numeral '3' at the bottom right
 */
export const DrBalogahSignature: React.FC<SignatureProps> = ({
  className = "",
  width = 230,
  height = 95,
  color = "#1d4ed8", // Deep royal blue ink
}) => {
  return (
    <svg
      viewBox="0 0 250 170"
      width={width}
      height={height}
      className={`inline-block filter drop-shadow-[0_1px_1px_rgba(29,78,216,0.12)] ${className}`}
      style={{ overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
        {/* 1. Main slanted stem of 'B' going from bottom-left to top */}
        <path
          d="M 28 155 L 72 32"
          strokeWidth="3.2"
        />

        {/* 2. Horizontal stroke crossing through middle of 'B' */}
        <path
          d="M 40 82 L 80 82"
          strokeWidth="2.8"
        />

        {/* 3. Upper loop of 'B' */}
        <path
          d="M 72 32 C 92 34, 98 55, 78 78 C 68 88, 56 82, 54 82"
          strokeWidth="3.0"
        />

        {/* 4. Lower loop of 'B' */}
        <path
          d="M 54 82 C 78 84, 92 108, 72 132 C 58 145, 40 138, 42 128"
          strokeWidth="3.0"
        />

        {/* 5. Cursive wave loops ('m' / 'm' / 'o') */}
        <path
          d="M 42 128 C 50 102, 62 100, 72 118 C 82 134, 92 102, 102 118 C 112 134, 122 102, 132 118 C 142 134, 154 100, 168 116 C 178 126, 185 110, 192 90"
          strokeWidth="2.7"
        />

        {/* 6. Tall vertical flourish line rising high and plunging straight down */}
        <path
          d="M 192 90 L 202 42 L 192 160"
          strokeWidth="3.2"
        />

        {/* 7. Diagonal slash stroke cutting through the lower part of the tall vertical bar */}
        <path
          d="M 165 142 L 218 106"
          strokeWidth="2.9"
        />

        {/* 8. Distinct numeral '3' at the bottom right */}
        {/* Upper arc of 3 */}
        <path
          d="M 205 116 C 215 114, 226 120, 218 130 C 212 136, 206 132, 205 132"
          strokeWidth="2.8"
        />
        {/* Lower arc of 3 */}
        <path
          d="M 205 132 C 218 132, 228 142, 216 154 C 208 160, 200 156, 198 152"
          strokeWidth="2.8"
        />
      </g>
    </svg>
  );
};

/**
 * Official Stamp / Seal of the Director General for OrientaAfrik & Certification
 * Circular rubber stamp design in deep blue ink
 */
export const OrientaAfrikDirectorSeal: React.FC<{
  size?: number;
  className?: string;
  color?: string;
  tilted?: boolean;
}> = ({
  size = 140,
  className = "",
  color = "#0c3ba1",
  tilted = true,
}) => {
  return (
    <div
      className={`inline-block select-none ${tilted ? "-rotate-6" : ""} ${className}`}
      style={{ width: size, height: size }}
      title="Sceau Officiel - OrientaAfrik & Certification"
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-sm opacity-95"
      >
        <defs>
          <path
            id="topTextPath"
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
          />
          <path
            id="bottomTextPath"
            d="M 175 100 A 75 75 0 0 1 25 100"
            fill="none"
          />
        </defs>

        {/* Outer Double Rings */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke={color}
          strokeWidth="3.5"
        />
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        <circle
          cx="100"
          cy="100"
          r="66"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />

        {/* Circular Curved Text Top */}
        <text
          fill={color}
          fontSize="10.5"
          fontWeight="900"
          letterSpacing="1.8"
          fontFamily="Arial, sans-serif"
        >
          <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
            ★ ORIENTAAFRIK &amp; CERTIFICATION ★
          </textPath>
        </text>

        {/* Circular Curved Text Bottom */}
        <text
          fill={color}
          fontSize="10"
          fontWeight="900"
          letterSpacing="1.5"
          fontFamily="Arial, sans-serif"
        >
          <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
            * DIRECTION GÉNÉRALE • LOMÉ - TOGO *
          </textPath>
        </text>

        {/* Center Emblem Content */}
        <g textAnchor="middle" fill={color} fontFamily="Arial, sans-serif">
          {/* Top Star */}
          <text x="100" y="58" fontSize="12" fontWeight="bold">
            ★ ★ ★
          </text>

          {/* Center Title Lines */}
          <text x="100" y="78" fontSize="11" fontWeight="900" letterSpacing="0.5">
            LE DIRECTEUR
          </text>
          <text x="100" y="93" fontSize="11" fontWeight="900" letterSpacing="0.5">
            GÉNÉRAL
          </text>

          {/* Divider line */}
          <line x1="50" y1="100" x2="150" y2="100" stroke={color} strokeWidth="1.5" />

          {/* Doctor Name */}
          <text x="100" y="118" fontSize="10" fontWeight="900">
            Dr. BALOGAH
          </text>
          <text x="100" y="132" fontSize="9" fontWeight="800">
            Dibaataba
          </text>

          {/* Certificate Badge */}
          <rect
            x="48"
            y="140"
            width="104"
            height="15"
            rx="3"
            fill={color}
          />
          <text x="100" y="151" fill="#ffffff" fontSize="8" fontWeight="900" letterSpacing="0.8">
            CERTIFIÉ CONFORME
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * Combined Official Signature & Seal Block
 * Renders next to the QR code on PDF documents and reports
 */
export const DrBalogahFingerprintStamp: React.FC<{
  size?: number;
  className?: string;
  color?: string;
  tilted?: boolean;
}> = ({
  size = 110,
  className = "",
  color = "#0c3ba1", // Official royal blue stamp ink
  tilted = false, // Perfectly straight by default
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${tilted ? "rotate-3" : "rotate-0"} ${className}`}
      style={{ width: size, minWidth: size }}
      title="Empreinte Biométrique - Dr BALOGAH Dibaataba"
    >
      <svg
        viewBox="0 0 120 140"
        width={size}
        height={size * 1.16}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto filter drop-shadow-xs opacity-95"
      >
        {/* Clean biometric fingerprint pad contour - ZERO text */}
        <ellipse
          cx="60"
          cy="70"
          rx="52"
          ry="62"
          fill="#f8fafc"
          stroke={color}
          strokeWidth="2"
        />
        <ellipse
          cx="60"
          cy="70"
          rx="47"
          ry="57"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          strokeDasharray="2 2"
          opacity="0.5"
        />

        {/* Detailed Right Index Fingerprint Ridge Lines */}
        <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="2.2" transform="translate(10, 15)">
          {/* Core Whorls and Loops */}
          <path d="M 50 55 A 5 5 0 1 1 50 54" strokeWidth="2.5" />
          <path d="M 50 47 C 60 47, 60 63, 50 63 C 40 63, 40 47, 50 47" />
          <path d="M 50 39 C 68 39, 68 71, 50 71 C 32 71, 32 39, 50 39" />
          <path d="M 50 31 C 76 31, 76 79, 50 79 C 24 79, 24 31, 50 31" />
          <path d="M 50 23 C 84 23, 84 87, 50 87 C 16 87, 16 23, 50 23" />
          <path d="M 50 15 C 92 15, 92 95, 50 95 C 8 95, 8 15, 50 15" />
          {/* Ridge minutiae & base lines */}
          <path d="M 22 95 C 22 103, 34 109, 50 109 C 66 109, 78 103, 78 95" strokeWidth="2" />
          <path d="M 14 92 C 14 110, 30 117, 50 117 C 70 117, 86 110, 86 92" strokeWidth="2" />
          <path d="M 36 28 C 42 20, 58 20, 64 28" strokeWidth="1.8" />
          <path d="M 30 36 C 38 28, 62 28, 70 36" strokeWidth="1.8" />
          <path d="M 44 73 C 48 76, 52 76, 56 73" strokeWidth="1.8" />
        </g>
      </svg>
    </div>
  );
};

export const BalogahOfficialValidationBlock: React.FC<{
  formattedDate?: string;
  docId?: string;
}> = ({ formattedDate, docId = "RAP-2026-BAL" }) => {
  const dateStr = formattedDate || new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col space-y-3 p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-200/80 shadow-sm my-4 text-left">
      {/* 1. Lieu et date de production du rapport */}
      <div className="text-xs font-bold text-slate-800 border-b border-blue-200 pb-1.5 flex justify-between items-center">
        <span>Fait à Lomé, le {dateStr}</span>
        <span className="font-mono text-[10px] text-blue-900 font-extrabold">Réf : {docId}</span>
      </div>

      <div className="flex flex-col items-start space-y-2">
        {/* 2. Signature fraîche directement sur le sceau */}
        <div className="relative flex items-center py-1 min-h-[90px] w-full max-w-[280px]">
          <OrientaAfrikDirectorSeal size={105} tilted={true} className="relative z-0 shrink-0" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <DrBalogahSignature width={210} height={80} color="#1d4ed8" />
          </div>
        </div>

        {/* 3. Identité officielle */}
        <div className="space-y-0.5">
          <p className="text-sm font-black text-slate-900 leading-tight">Dr BALOGAH Dibaataba</p>
          <p className="text-xs font-extrabold text-blue-900 uppercase">Directeur Général</p>
          <p className="text-[11px] font-semibold text-slate-800">Spécialiste des sciences de l'éducation et de la formation</p>
          <p className="text-[11px] font-semibold text-slate-800">Conseiller d'orientation scolaire et professionnelle</p>
          <p className="text-[11px] font-semibold text-slate-800">Conseiller en formation professionnalisation</p>
        </div>

        {/* 3.5 Empreinte du Directeur Général à équidistance */}
        <div className="my-2 p-1.5 flex items-center justify-center">
          <DrBalogahFingerprintStamp size={85} color="#0c3ba1" tilted={false} />
        </div>

        {/* 4. En bas de l'identité officielle */}
        <p className="text-xs font-black text-emerald-950 uppercase tracking-wide pt-1 border-t border-blue-200/60 w-full">
          SIGNE ET CERTIFIE PAR ORIENTAAFRIK &amp; CERTIFICATION
        </p>
      </div>
    </div>
  );
};

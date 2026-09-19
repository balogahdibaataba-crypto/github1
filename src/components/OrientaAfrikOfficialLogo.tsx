import React from "react";
import logoImg from "../assets/images/orientaafrik_logo_1786020848177.jpg";

interface OrientaAfrikOfficialLogoProps {
  variant?: "full" | "icon" | "document" | "image" | "seal";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  darkBackground?: boolean;
}

export const OrientaAfrikOfficialLogo: React.FC<OrientaAfrikOfficialLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  darkBackground = true,
}) => {
  // Size mapping
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg md:text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  // Render Image Variant
  if (variant === "image") {
    return (
      <div className={`inline-flex items-center gap-3 shrink-0 ${className}`}>
        <img
          src={logoImg}
          alt="Logo Officiel OrientaAfriK & Certification"
          className={`${iconSizes[size]} object-contain rounded-xl shadow-md border border-amber-500/30 bg-white p-0.5 shrink-0`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Vector SVG Emblem Logo Icon
  const LogoEmblem = (
    <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-slate-950 via-emerald-950 to-slate-900 border border-amber-500/40 shadow-lg p-1 group`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Crest Shield Outer Border */}
        <path
          d="M 50 8 C 75 8, 88 18, 88 38 C 88 68, 50 92, 50 92 C 50 92, 12 68, 12 38 C 12 18, 25 8, 50 8 Z"
          fill="url(#crestGrad)"
          stroke="#f59e0b"
          strokeWidth="3"
        />

        {/* African Continent Inner Silhouette */}
        <path
          d="M 42 28 C 48 27, 58 30, 62 36 C 65 42, 60 50, 56 54 C 54 58, 56 64, 52 68 C 48 72, 45 68, 43 62 C 40 56, 36 50, 38 42 C 39 36, 38 32, 42 28 Z"
          fill="#059669"
          opacity="0.85"
        />

        {/* Graduation Cap in Center Top */}
        <polygon points="50,22 74,32 50,42 26,32" fill="#f59e0b" />
        <polygon points="36,37 36,48 50,54 64,48 64,37 50,42" fill="#d97706" />
        {/* Tassel */}
        <path d="M 68 33 L 72 44 L 72 50" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />

        {/* Compass Star / Rays in Center */}
        <polygon points="50,44 53,52 62,55 53,58 50,66 47,58 38,55 47,52" fill="#ffffff" />
        <circle cx="50" cy="55" r="2.5" fill="#f59e0b" />

        {/* Certificate Golden Ribbon / Seal */}
        <circle cx="50" cy="74" r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M 45 80 L 41 90 L 48 87 L 50 80 Z" fill="#d97706" />
        <path d="M 55 80 L 59 90 L 52 87 L 50 80 Z" fill="#b45309" />

        {/* Gradients */}
        <defs>
          <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (variant === "icon") {
    return LogoEmblem;
  }

  if (variant === "seal") {
    return (
      <div className={`flex items-center gap-2.5 p-2 rounded-xl border border-amber-500/30 bg-slate-900 text-white shadow-md ${className}`}>
        {LogoEmblem}
        <div className="flex flex-col text-left space-y-0.5 leading-tight min-w-0">
          <span className="text-xs font-black text-white whitespace-nowrap">Orienta<span className="text-emerald-400">AfriK</span></span>
          <span className="text-[10px] font-bold text-amber-400 whitespace-nowrap">&amp; CERTIFICATION</span>
        </div>
      </div>
    );
  }

  if (variant === "document") {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl border border-emerald-800/20 bg-slate-900 text-white shadow-md ${className}`}>
        {LogoEmblem}
        <div className="flex flex-col text-left space-y-0.5 min-w-0">
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
            Orienta<span className="text-emerald-400">AfriK</span>
          </h2>
          <div className="text-xs sm:text-sm font-black text-amber-400 tracking-wider uppercase">
            &amp; CERTIFICATION
          </div>
        </div>
      </div>
    );
  }

  // Default "full" variant (Header & General App Placement)
  return (
    <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      {LogoEmblem}
      <div className="flex flex-col text-left space-y-0.5 leading-tight">
        <h1 className={`font-black tracking-tight ${textSizes[size]} ${darkBackground ? "text-white" : "text-slate-900"}`}>
          Orienta<span className="text-emerald-400">AfriK</span>
        </h1>
        <div className="text-[10px] md:text-[11px] font-black tracking-widest uppercase text-amber-400">
          &amp; CERTIFICATION
        </div>
      </div>
    </div>
  );
};

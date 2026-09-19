import React, { useState } from "react";
import {
  FileArchive,
  Download,
  Terminal,
  CheckCircle2,
  Copy,
  Sparkles,
  Code2,
  X,
  ExternalLink,
  Layers,
  FolderArchive,
  Check,
  Cpu,
  Info
} from "lucide-react";

interface DownloadSourceCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadSourceCodeModal: React.FC<DownloadSourceCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    // Trigger direct browser download from our server endpoint
    const link = document.createElement("a");
    link.href = "/api/download-zip";
    link.setAttribute("download", "orientaafrik-source-code.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
      setHasDownloaded(true);
    }, 1500);
  };

  const copyCommand = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-source-modal-title"
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 text-slate-900 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-emerald-950 to-indigo-950 text-white flex items-start justify-between gap-4 shrink-0 border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-black shrink-0 shadow-sm">
              <FileArchive className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 id="download-source-modal-title" className="text-lg sm:text-xl font-extrabold text-white">
                  Télécharger le Code Source ZIP
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[10px] font-black border border-emerald-400/40 uppercase tracking-wider">
                  Archive .ZIP Complète
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Projet complet OrientaAfrik & Certification (React 19 + TypeScript + Express)
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Main Action Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-500/80 space-y-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-emerald-950 text-sm sm:text-base flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Archive ZIP du Code Source</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Contient l'intégralité du code source propre, les composants React, les feuilles de style Tailwind v4, les données métiers et la configuration du serveur Node.js.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800 shrink-0">
                ~1.25 Mo
              </span>
            </div>

            {/* Direct Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all cursor-pointer disabled:opacity-75"
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Génération de l'archive en cours...</span>
                </>
              ) : hasDownloaded ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <span>Téléchargement Lancé ! (Cliquez pour re-télécharger)</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-amber-300" />
                  <span>Télécharger orientaafrik-source-code.zip</span>
                </>
              )}
            </button>

            {hasDownloaded && (
              <div className="p-3 rounded-xl bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Le fichier <strong>orientaafrik-source-code.zip</strong> a été transmis à votre navigateur.</span>
              </div>
            )}
          </div>

          {/* Included Files Details */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Contenu de l'Archive Téléchargeable</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Frontend React 19 & TypeScript</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dossier <code className="font-mono text-emerald-700">src/</code> avec tous les tests, simulateurs, graphiques D3.js et composants UI.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Serveur Express & Intégration</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fichier <code className="font-mono text-indigo-700">server.ts</code>, routes API, intégration Gemini et configuration Vite middleware.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Base de Données & Règles Firebase</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  <code className="font-mono text-amber-700">firestore.rules</code>, schémas de base et configuration client Firestore.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-700" />
                  <span>Guides & Configuration</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  <code className="font-mono text-slate-700">README.md</code> complet, <code className="font-mono text-slate-700">package.json</code>, Tailwind CSS v4.
                </p>
              </div>
            </div>
          </div>

          {/* Quickstart Instructions */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Comment Lancer le Projet sur votre Ordinateur</span>
            </h4>

            <div className="space-y-2">
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11.5px] flex items-center justify-between gap-2 overflow-x-auto">
                <div>
                  <span className="text-emerald-400 font-bold"># 1. Décompresser l'archive et accéder au dossier</span>
                  <div className="text-white mt-0.5">unzip orientaafrik-source-code.zip && cd react-example</div>
                </div>
                <button
                  onClick={() => copyCommand("unzip orientaafrik-source-code.zip && cd react-example", "cmd1")}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                  title="Copier la commande"
                >
                  {copiedCmd === "cmd1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11.5px] flex items-center justify-between gap-2 overflow-x-auto">
                <div>
                  <span className="text-emerald-400 font-bold"># 2. Installer les dépendances</span>
                  <div className="text-white mt-0.5">npm install</div>
                </div>
                <button
                  onClick={() => copyCommand("npm install", "cmd2")}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                  title="Copier la commande"
                >
                  {copiedCmd === "cmd2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11.5px] flex items-center justify-between gap-2 overflow-x-auto">
                <div>
                  <span className="text-emerald-400 font-bold"># 3. Lancer le serveur local</span>
                  <div className="text-white mt-0.5">npm run dev</div>
                </div>
                <button
                  onClick={() => copyCommand("npm run dev", "cmd3")}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                  title="Copier la commande"
                >
                  {copiedCmd === "cmd3" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* AI Studio Alternative Export Method */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>Autre méthode : Exportation directe depuis l'interface Google AI Studio</span>
            </div>
            <p className="text-[11.5px] text-slate-600 leading-relaxed">
              Vous pouvez également exporter le projet à tout moment directement depuis le menu supérieur de <strong>Google AI Studio</strong> : cliquez sur l'icône de paramètres (ou les trois points <strong>⋮</strong> en haut à droite), puis sélectionnez <strong>« Export to ZIP »</strong> ou <strong>« Export to GitHub »</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-[11.5px]">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Archive prête pour hébergement local ou déploiement Cloud (Vercel, Cloud Run, VPS)</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Download, Monitor, Smartphone, Tablet, CheckCircle, Info, Share2, Sparkles, ShieldCheck, RefreshCw, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const AppInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'pc' | 'tablet'>('mobile');
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      } finally {
        setIsInstalling(false);
        setDeferredPrompt(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center border border-emerald-300/40">
              <img src="/icon.svg" alt="OrientaAfrik App" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Application PWA Multi-Supports</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-serif text-white">Installer OrientaAfrik</h2>
              <p className="text-emerald-100/90 text-sm">Cabinet Conseil Dr BALOGAH Dibaataba</p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Status / One-Click Install */}
          {isInstalled ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3 text-emerald-800">
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-emerald-900">Application déjà installée !</h4>
                <p className="text-xs text-emerald-700">OrientaAfrik est active sur votre appareil avec accès rapide et hors-ligne.</p>
              </div>
            </div>
          ) : deferredPrompt ? (
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/40 rounded-2xl p-5 text-center space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Installation Instantanée Détectée</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Votre navigateur supporte l'installation directe en 1 clic sur votre écran d'accueil ou bureau.
              </p>
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>{isInstalling ? 'Installation en cours...' : 'Installer sur cet appareil maintenant'}</span>
              </button>
            </div>
          ) : null}

          {/* Device Tabs */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Guide d'installation pas-à-pas selon votre équipement :
            </h3>
            
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('mobile')}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'mobile'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Téléphone (Android/iOS)</span>
              </button>

              <button
                onClick={() => setActiveTab('pc')}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'pc'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-4 h-4 text-emerald-600" />
                <span>Ordinateur (PC/Mac)</span>
              </button>

              <button
                onClick={() => setActiveTab('tablet')}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'tablet'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tablet className="w-4 h-4 text-emerald-600" />
                <span>Tablette (iPad/Android)</span>
              </button>
            </div>
          </div>

          {/* Guide Steps */}
          {activeTab === 'mobile' && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Sur Android (Chrome, Edge, Samsung Internet)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Appuyez sur le menu des <strong>trois points (⋮)</strong> en haut à droite, puis sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Sur iPhone / iOS (Safari)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Appuyez sur le bouton de <strong>Partage (<Share2 className="w-3.5 h-3.5 inline mx-1 text-emerald-700" />)</strong> en bas de l'écran, faites défiler puis touchez <strong>« Sur l'écran d'accueil »</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pc' && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Google Chrome / Microsoft Edge / Brave</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Regardez dans la <strong>barre d'adresse (URL)</strong> tout à droite : cliquez sur la petite icône d'ordinateur ou d'installation (<Download className="w-3.5 h-3.5 inline mx-1 text-emerald-600" />) puis validez <strong>« Installer »</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Raccourci Bureau & Barre des tâches</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    L'icône officielle <strong>OrientaAfrik</strong> sera placée directement sur votre bureau Windows/Mac pour un lancement ultra-rapide en plein écran.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tablet' && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">iPad (Safari iPadOS)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Cliquez sur le carré avec flèche montante <strong>(Partager)</strong> dans la barre supérieure, puis choisissez <strong>« Ajouter sur l'écran d'accueil »</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Tablette Android</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Dans Chrome ou Samsung Internet, touchez le menu ⋮ puis <strong>« Installer l'application »</strong>. L'interface s'adapte automatiquement au grand écran.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Avantages de l'application installée */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-slate-900">Hors-ligne & rapide</h5>
                <p className="text-[11px] text-slate-600 leading-tight">Consultez les 2000 métiers et universités même avec un faible réseau.</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start space-x-2.5">
              <RefreshCw className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-slate-900">Mises à jour directes</h5>
                <p className="text-[11px] text-slate-600 leading-tight">Mises à jour instantanées sans passer par des magasins d'applications.</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start space-x-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-slate-900">Plein écran immersif</h5>
                <p className="text-[11px] text-slate-600 leading-tight">Expérience fluide sans barre d'adresse gênante.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
          <div className="text-xs text-slate-500 flex items-center space-x-1">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>PWA certifiée Cabinet Dr BALOGAH • Sans publicité</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

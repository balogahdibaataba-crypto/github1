import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  FileArchive, 
  Download, 
  CheckCircle, 
  HelpCircle, 
  FolderArchive, 
  Layers, 
  Code, 
  Globe, 
  Sparkles, 
  X, 
  FileText, 
  ExternalLink,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ZipExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipExportModal: React.FC<ZipExportModalProps> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { currentUser, userProfile, documents } = useAuth();

  if (!isOpen) return null;

  const handleGenerateZip = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const zip = new JSZip();

      // 1. Root README and presentation
      zip.file(
        "README.md",
        `# OrientaAfrik - Plateforme Panafricaine d'Information et d'Orientation Scolaire & Professionnelle
Cabinet Conseil Dr BALOGAH Dibaataba
Site Officiel : orientaafrik.mpginternational.org

## Description
OrientaAfrik est la plateforme d'orientation scolaire et professionnelle de référence en Afrique :
- Répertoire exhaustif de plus de 2000 métiers porteurs et émergents.
- Cartographie des universités et grandes écoles (Togo, Afrique, International).
- Tests psychométriques RIASEC complets avec calcul automatique des profils.
- Simulateur de calcul de moyennes et d'éligibilité aux filières universitaires.
- Espace de travail personnel pour la rédaction de CVs, lettres et plans de carrière.

## Mode Hors-Ligne & Installation
Ouvrez le fichier \`index.html\` dans n'importe quel navigateur (Chrome, Firefox, Safari, Edge) pour accéder à la version portable de secours ou connectez-vous directement sur l'application en ligne.`
      );

      // 2. Offline index launcher
      zip.file(
        "index.html",
        `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OrientaAfrik - Cabinet Dr BALOGAH</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card {
      background: white;
      border-radius: 24px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      width: 100%;
      padding: 40px;
      border: 1px solid #e2e8f0;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: #ecfdf5;
      color: #047857;
      font-weight: 700;
      font-size: 12px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 26px;
      color: #064e3b;
      margin-top: 0;
      margin-bottom: 12px;
    }
    p {
      color: #475569;
      line-height: 1.6;
      font-size: 15px;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      background: #059669;
      color: white;
      font-weight: bold;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 16px;
      box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.3);
      transition: background 0.2s;
    }
    .btn:hover {
      background: #047857;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Archive Hors-Ligne & Accès Direct</div>
    <h1>OrientaAfrik Portable Package</h1>
    <p>Vous consultez le package officiel de l'application <strong>OrientaAfrik</strong> (Cabinet Dr BALOGAH Dibaataba).</p>
    <p>Pour bénéficier de l'ensemble des modules interactifs en temps réel (2000 Métiers, Calculateur de Moyennes, Tests RIASEC, Espace de Travail), cliquez ci-dessous pour ouvrir l'application web certifiée :</p>
    <a href="https://orientaafrik.mpginternational.org" target="_blank" class="btn">Lancer OrientaAfrik en Ligne</a>
    <div class="footer">Cabinet Conseil Dr BALOGAH Dibaataba • Lomé, Togo • Tous droits réservés</div>
  </div>
</body>
</html>`
      );

      // 3. User documents if available
      if (documents && documents.length > 0) {
        const docsFolder = zip.folder("mes-documents-orientaafrik");
        documents.forEach((doc, idx) => {
          const safeTitle = (doc.title || `document_${idx + 1}`).replace(/[^a-z0-9]/gi, '_').toLowerCase();
          docsFolder?.file(
            `${safeTitle}.txt`,
            `ORIENTAAFRIK - ESPACE PERSONNEL DE TRAVAIL\n` +
            `Titre: ${doc.title}\n` +
            `Type: ${doc.type}\n` +
            `Statut: ${doc.status}\n` +
            `Date de mise à jour: ${new Date(doc.updatedAt).toLocaleString('fr-FR')}\n` +
            `Auteur: ${userProfile?.displayName || currentUser?.email || 'Utilisateur OrientaAfrik'}\n` +
            `------------------------------------------------------------\n\n` +
            `CONTENU DU DOCUMENT:\n\n${doc.content}\n\n` +
            `NOTES & STRATÉGIE:\n${doc.notes || 'Aucune note.'}`
          );
        });
      }

      // 4. Student guide and career sheets
      const guidesFolder = zip.folder("guides-orientation");
      guidesFolder?.file(
        "guide_orientation_post_bac.txt",
        `GUIDE D'ORIENTATION POST-BAC - CABINET DR BALOGAH DIBAATABA\n` +
        `------------------------------------------------------------\n\n` +
        `1. LES 6 ÉTAPES CLÉS D'UNE ORIENTATION RÉUSSIE :\n` +
        `- Étape 1 : Bilan de compétences & profil psychométrique (Test RIASEC)\n` +
        `- Étape 2 : Vérification des séries de BAC compatibles et des prérequis de moyennes\n` +
        `- Étape 3 : Exploration des débouchés concrets parmi les 2000 métiers porteurs\n` +
        `- Étape 4 : Choix des universités et instituts reconnus (CAMES, Ministère)\n` +
        `- Étape 5 : Préparation du dossier de candidature (CV, lettre de motivation)\n` +
        `- Étape 6 : Entretien et validation avec un conseiller d'orientation certifié\n\n` +
        `2. CONTACT CABINET DR BALOGAH :\n` +
        `- Lomé, Togo\n` +
        `- Email : balogahdibaataba@gmail.com\n` +
        `- Plateforme : orientaafrik.mpginternational.org`
      );

      // Generate the ZIP blob
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orientaafrik_application_package_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
    } catch (error) {
      console.error("Erreur lors de la création du fichier ZIP:", error);
      alert("Une erreur est survenue lors de la création de l'archive ZIP.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg flex-shrink-0">
              <FileArchive className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Exportation & Sauvegarde</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white">Télécharger l'Application en ZIP</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {/* Option 1: Direct In-App ZIP Download */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2.5">
              <FolderArchive className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-base">Package Portable & Documents (.ZIP)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Téléchargez immédiatement une archive ZIP contenant le lanceur portable, les guides d'orientation, la documentation de secours et vos documents de travail créés dans votre compte personnel.
            </p>

            <button
              onClick={handleGenerateZip}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <span>Génération du fichier ZIP en cours...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Télécharger l'archive ZIP (.zip) maintenant</span>
                </>
              )}
            </button>

            {downloadSuccess && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>Le fichier ZIP a été généré et téléchargé avec succès sur votre appareil !</span>
              </div>
            )}
          </div>

          {/* Option 2: Full Source Code Export (Google AI Studio) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2.5">
              <Code className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-slate-900 text-base">Code Source Complet du Projet (Full-Stack)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pour télécharger l'intégralité du code source (React 19, TypeScript, Tailwind CSS, Express, Firestore, 2000 Métiers) :
            </p>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span>Cliquez sur l'icône des <strong>Paramètres (⚙️)</strong> ou le menu en haut à droite de l'interface Google AI Studio.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span>Sélectionnez l'option <strong>« Export to ZIP »</strong> ou <strong>« Download Code »</strong>.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span>Vous obtiendrez l'archive ZIP exhaustive prête pour GitHub, un serveur dédié ou Cloud Run.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
          <div className="text-xs text-slate-500 flex items-center space-x-1">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Format standard .ZIP universel</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

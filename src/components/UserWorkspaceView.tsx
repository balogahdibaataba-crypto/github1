import React, { useState } from 'react';
import { 
  User, 
  Users,
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Download, 
  Upload, 
  Briefcase, 
  GraduationCap, 
  Award, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  LogOut, 
  LogIn, 
  UserPlus, 
  FolderPlus, 
  ShieldAlert, 
  Sparkles,
  FileCheck,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  Laptop,
  Compass,
  Calculator,
  Wallet,
  Building2,
  FileCheck2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth, UserWorkspaceDocument } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface UserWorkspaceViewProps {
  setActiveTab?: (tab: string) => void;
}

export const UserWorkspaceView: React.FC<UserWorkspaceViewProps> = ({ setActiveTab }) => {
  const { 
    currentUser, 
    userProfile, 
    documents, 
    loading, 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    logout, 
    updateUserProfileData,
    saveDocument,
    deleteDocument
  } = useAuth();
  const { language, t } = useLanguage();

  // Auth UI state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editLevel, setEditLevel] = useState('');
  const [editTargetCareer, setEditTargetCareer] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editBio, setEditBio] = useState('');

  // Document Editor State
  const [selectedDoc, setSelectedDoc] = useState<UserWorkspaceDocument | null>(null);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<UserWorkspaceDocument['type']>('CV');
  const [docContent, setDocContent] = useState('');
  const [docNotes, setDocNotes] = useState('');
  const [docStatus, setDocStatus] = useState<UserWorkspaceDocument['status']>('BROUILLON');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterType, setSelectedFilterType] = useState<string>('ALL');

  // Sync profile editing values when modal opens
  const openEditProfile = () => {
    if (userProfile) {
      setEditName(userProfile.displayName || '');
      setEditPhone(userProfile.phone || '');
      setEditStatus(userProfile.professionOrStudentStatus || '');
      setEditLevel(userProfile.educationLevel || '');
      setEditTargetCareer(userProfile.targetCareer || '');
      setEditCity(userProfile.city || '');
      setEditCountry(userProfile.country || '');
      setEditBio(userProfile.bio || '');
    }
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfileData({
        displayName: editName,
        phone: editPhone,
        professionOrStudentStatus: editStatus,
        educationLevel: editLevel,
        targetCareer: editTargetCareer,
        city: editCity,
        country: editCountry,
        bio: editBio
      });
      setIsEditingProfile(false);
    } catch (err: any) {
      alert('Erreur lors de la mise à jour du profil : ' + err.message);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!fullName.trim()) throw new Error('Veuillez renseigner votre nom complet');
        await registerWithEmail(email, password, fullName);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Échec de connexion');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Connexion Google annulée');
    }
  };

  const openNewDocModal = (presetType?: UserWorkspaceDocument['type']) => {
    setSelectedDoc(null);
    setDocTitle(presetType ? `Mon ${presetType}` : 'Nouveau document de travail');
    setDocType(presetType || 'CV');
    setDocContent('');
    setDocNotes('');
    setDocStatus('BROUILLON');
    setIsCreatingDoc(true);
  };

  const openEditDocModal = (d: UserWorkspaceDocument) => {
    setSelectedDoc(d);
    setDocTitle(d.title);
    setDocType(d.type);
    setDocContent(d.content);
    setDocNotes(d.notes || '');
    setDocStatus(d.status);
    setIsCreatingDoc(true);
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      alert('Veuillez saisir un titre pour le document.');
      return;
    }
    try {
      await saveDocument({
        title: docTitle,
        type: docType,
        content: docContent,
        notes: docNotes,
        status: docStatus
      }, selectedDoc?.id);
      setIsCreatingDoc(false);
      setSelectedDoc(null);
    } catch (err: any) {
      alert('Erreur lors de l\'enregistrement : ' + err.message);
    }
  };

  const handleDeleteDoc = async (docId: string, title: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le document « ${title} » ?`)) {
      await deleteDocument(docId);
      if (selectedDoc?.id === docId) {
        setIsCreatingDoc(false);
        setSelectedDoc(null);
      }
    }
  };

  const handleExportTextDoc = (d: UserWorkspaceDocument) => {
    const blob = new Blob([
      `ORIENTAAFRIK - ESPACE PERSONNEL DE TRAVAIL\n`,
      `Document: ${d.title}\n`,
      `Type: ${d.type}\n`,
      `Statut: ${d.status}\n`,
      `Date de mise à jour: ${new Date(d.updatedAt).toLocaleString('fr-FR')}\n`,
      `Auteur: ${userProfile?.displayName || currentUser?.email}\n`,
      `------------------------------------------------------------\n\n`,
      `CONTENU DU DOCUMENT:\n\n`,
      d.content,
      `\n\n------------------------------------------------------------\n`,
      `NOTES & STRATÉGIE PROFESSIONNELLE:\n`,
      d.notes || 'Aucune note particulière.'
    ], { type: 'text/plain;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${d.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_orientaafrik.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredDocs = documents.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (doc.notes && doc.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFilter = selectedFilterType === 'ALL' || doc.type === selectedFilterType;
    return matchSearch && matchFilter;
  });

  // Non-authenticated View: Login / Register Box
  if (!currentUser) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espace Personnel Dédié</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight leading-tight">
              Mon Espace de Travail & de Carrière
            </h1>
            <p className="mt-3 text-emerald-100 text-base leading-relaxed">
              Créez votre compte personnel sécurisé pour rédiger vos CVs, préparer vos lettres de motivation, consigner vos bilans d'orientation, stocker vos diplômes et suivre vos projets professionnels.
            </p>
          </div>
        </div>

        {/* Auth Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left features highlights */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold text-slate-800 font-serif">
              Pourquoi ouvrir votre espace de travail personnel ?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Gestionnaire de Documents</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Rédigez, modifiez et téléchargez vos CVs, lettres et plans de formation à tout moment.
                  </p>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-3 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Synchronisation Cloud
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-3">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Plan de Carrière Personnalisé</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Définissez vos objectifs d'études, vos compétences cibles et suivez votre évolution.
                  </p>
                </div>
                <span className="text-[11px] text-teal-700 font-semibold mt-3 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Recommandations Cabinet
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Dossiers d'Admission</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Préparez vos candidatures pour les universités au Togo, en Afrique et à l'international.
                  </p>
                </div>
                <span className="text-[11px] text-amber-700 font-semibold mt-3 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> 2000 Métiers & Écoles
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Certifications & Attestations</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Archivez vos rapports psychométriques certifiés et reçus de consultation.
                  </p>
                </div>
                <span className="text-[11px] text-blue-700 font-semibold mt-3 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Sécurisé & Confidentiel
                </span>
              </div>
            </div>

            {/* Link to Observatoire des Usages */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-4 rounded-2xl border border-indigo-500/30 text-white flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Observatoire des Usages & Inscriptions</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Consultez en direct le nombre total d'internautes ayant créé un compte personnel.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (setActiveTab) setActiveTab("usage-observatory");
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>Voir les Stats</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Sign in / Register Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-4 h-4 inline mr-1.5" />
                Connexion
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-4 h-4 inline mr-1.5" />
                Créer un compte
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Koffi Mensah KOUASSI"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                {authLoading ? (
                  <span>Traitement en cours...</span>
                ) : authMode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Accéder à mon espace de travail</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Créer mon compte de travail</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Ou continuer avec</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Connexion avec compte Google</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated View: Active Personal Workspace Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Workspace Top Banner & User Profile Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-700 border-2 border-emerald-400/40 flex items-center justify-center text-2xl font-bold text-emerald-100 shadow-inner flex-shrink-0">
            {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : currentUser.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
                {userProfile?.displayName || 'Mon Espace de Travail'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold border border-emerald-400/30">
                Compte Actif
              </span>
            </div>
            <p className="text-emerald-200 text-sm mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1 opacity-80" /> {currentUser.email}
              </span>
              {userProfile?.phone && (
                <span className="flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 opacity-80" /> {userProfile.phone}
                </span>
              )}
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 opacity-80" /> {userProfile?.city || 'Lomé'}, {userProfile?.country || 'Togo'}
              </span>
            </p>
            <p className="text-emerald-100/80 text-xs mt-2 italic max-w-xl">
              "{userProfile?.bio || 'Espace de travail et de suivi de mes objectifs professionnels.'}"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-end">
          <button
            onClick={openEditProfile}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier mon profil</span>
          </button>

          <button
            onClick={() => openNewDocModal()}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Document</span>
          </button>

          <button
            onClick={() => logout()}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Quick Access Action Bar for Standard Work Tools */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => openNewDocModal('CV')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white transition-colors flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Rédiger un CV</h4>
          <p className="text-xs text-slate-500 mt-1">Conforme aux standards RH africains & internationaux</p>
        </button>

        <button
          onClick={() => openNewDocModal('LETTRE_MOTIVATION')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white transition-colors flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Lettre de Motivation</h4>
          <p className="text-xs text-slate-500 mt-1">Pour stage, emploi ou admission universitaire</p>
        </button>

        <button
          onClick={() => openNewDocModal('PLAN_CARRIERE')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-600 text-amber-700 group-hover:text-white transition-colors flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Plan de Carrière</h4>
          <p className="text-xs text-slate-500 mt-1">Objectifs à 1, 3 et 5 ans selon vos filières cibles</p>
        </button>

        <button
          onClick={() => openNewDocModal('NOTE_DE_TRAVAIL')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white transition-colors flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Notes & Projets</h4>
          <p className="text-xs text-slate-500 mt-1">Fiches de révision, devoirs et comptes-rendus</p>
        </button>
      </div>

      {/* Portails & Espaces de Travail Spécialisés */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1 border border-emerald-400/30">
              <Zap className="w-3.5 h-3.5" />
              <span>Accès Multi-Espaces Inclus</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2">
              <span>Portail de Tous Vos Espaces de Travail</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Votre compte personnel vous donne un accès intégral et synchronisé à tous les modules d'orientation et d'évaluation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Espace Post-BAC */}
          <div 
            onClick={() => setActiveTab && setActiveTab('post-bac')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                Espace Post-BAC & Supérieur
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calcul des moyennes 2nde à Tle (T1, T2, T3) + BAC 1/BAC 2, éligibilité aux facultés, grandes écoles et métiers.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
              <span>Ouvrir le simulateur Post-BAC</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Espace Post-BEPC */}
          <div 
            onClick={() => setActiveTab && setActiveTab('post-bepc')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                Espace Post-BEPC & Séries
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Formule officielle Somme/Effectif (6e à 3e + BEPC) pour Séries A4, S, Techniques (G, F, E, Ti) et Métiers.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Ouvrir le simulateur Post-BEPC</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Tests Psychométriques & RIASEC */}
          <div 
            onClick={() => setActiveTab && setActiveTab('tests')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                Bilan & Tests Psychométriques
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test RIASEC de Holland, efficience cognitive, quotient logique, et inventaire d'intérêts professionnels.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-purple-300">
              <span>Passer mes tests</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Répertoire des 2000 Métiers */}
          <div 
            onClick={() => setActiveTab && setActiveTab('careers')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                2000 Métiers Porteurs & Opportunités
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fiches métiers détaillées, compétences requises, grilles de salaires et perspectives d'emploi.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
              <span>Explorer les 2000 métiers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Cartographie des Établissements */}
          <div 
            onClick={() => setActiveTab && setActiveTab('institutions')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition-colors">
                Établissements & Universités
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cartographie des universités publiques et privées, instituts et grandes écoles au Togo et en Afrique.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300">
              <span>Voir les universités</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Portefeuille & Rémunération */}
          <div 
            onClick={() => setActiveTab && setActiveTab('wallet')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                Mon Portefeuille & Retraits
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solde accumulé par votre activité et retraits directs par Mixx by Yas ou Flooz (+228).
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Consulter mon solde</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Area: Documents Management */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">Mes Documents & Travaux Personnels</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {documents.length} document(s) sauvegardé(s) dans votre cloud sécurisé
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un document..."
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none w-56"
              />
            </div>

            {/* Filter */}
            <select
              value={selectedFilterType}
              onChange={(e) => setSelectedFilterType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">Tous les types</option>
              <option value="CV">CVs</option>
              <option value="LETTRE_MOTIVATION">Lettres de motivation</option>
              <option value="PLAN_CARRIERE">Plans de carrière</option>
              <option value="RELEVE_NOTES">Relevés de notes</option>
              <option value="DIPLOME_ATTESTATION">Diplômes & Attestations</option>
              <option value="NOTE_DE_TRAVAIL">Notes de travail</option>
            </select>
          </div>
        </div>

        {/* Documents Grid / List */}
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <FolderPlus className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Aucun document trouvé</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Commencez par rédiger votre premier CV, lettre de motivation ou plan de carrière en cliquant sur le bouton ci-dessous.
            </p>
            <button
              onClick={() => openNewDocModal()}
              className="mt-5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Créer mon premier document</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      doc.type === 'CV' ? 'bg-emerald-100 text-emerald-800' :
                      doc.type === 'LETTRE_MOTIVATION' ? 'bg-teal-100 text-teal-800' :
                      doc.type === 'PLAN_CARRIERE' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {doc.type.replace('_', ' ')}
                    </span>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      doc.status === 'VALIDE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      doc.status === 'EN_COURS' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{doc.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-[11px]">
                    {doc.content || 'Document vierge...'}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(doc.updatedAt).toLocaleDateString('fr-FR')}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleExportTextDoc(doc)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition-colors"
                      title="Télécharger / Exporter"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditDocModal(doc)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.id, doc.title)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-emerald-800 text-white p-5">
              <h3 className="font-bold font-serif text-lg">Mettre à jour mon profil de travail</h3>
              <p className="text-emerald-200 text-xs mt-0.5">Ces informations adaptent vos recommandations de filières et métiers.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nom complet</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Téléphone / WhatsApp</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+228 90 00 00 00"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Statut actuel</label>
                  <input
                    type="text"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    placeholder="Étudiant, Salarié, En recherche..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Niveau d'études</label>
                  <input
                    type="text"
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    placeholder="Terminale, BAC+3, Master..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Métier ou filière visée</label>
                  <input
                    type="text"
                    value={editTargetCareer}
                    onChange={(e) => setEditTargetCareer(e.target.value)}
                    placeholder="Ex: Ingénieur Logiciel, Médecin..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Ville</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Pays</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Objectif professionnel / Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Create/Edit Modal */}
      {isCreatingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold font-serif text-lg">
                  {selectedDoc ? 'Éditer le document de travail' : 'Nouveau document professionnel'}
                </h3>
                <p className="text-emerald-200 text-xs">Sauvegarde automatique dans votre compte OrientaAfrik.</p>
              </div>
            </div>

            <form onSubmit={handleSaveDoc} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Titre du document *
                  </label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Ex: CV Développeur Web 2026"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Type de document
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="CV">CV / Curriculum Vitae</option>
                    <option value="LETTRE_MOTIVATION">Lettre de Motivation</option>
                    <option value="PLAN_CARRIERE">Plan de Carrière</option>
                    <option value="RELEVE_NOTES">Relevé de Notes</option>
                    <option value="DIPLOME_ATTESTATION">Diplôme / Attestation</option>
                    <option value="NOTE_DE_TRAVAIL">Note de travail / Fiche</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contenu rédigé du document
                  </label>
                  <span className="text-[11px] text-slate-400">Texte structuré</span>
                </div>
                <textarea
                  rows={9}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder={`Rédigez ici le contenu de votre ${docType}...\n\nExemple de structure :\n1. Objectif professionnel\n2. Formations et diplômes\n3. Expériences et stages\n4. Compétences clés\n5. Langues & Centres d'intérêt`}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Statut du document
                  </label>
                  <select
                    value={docStatus}
                    onChange={(e) => setDocStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="BROUILLON">Brouillon en cours</option>
                    <option value="EN_COURS">En cours de révision</option>
                    <option value="VALIDE">Validé & Prêt à envoyer</option>
                    <option value="ARCHIVE">Archivé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Notes & Stratégie personnelle
                  </label>
                  <input
                    type="text"
                    value={docNotes}
                    onChange={(e) => setDocNotes(e.target.value)}
                    placeholder="Ex: Destiné au concours d'entrée à l'ENSI"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-200">
                {selectedDoc ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteDoc(selectedDoc.id, selectedDoc.title)}
                    className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                ) : <div />}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatingDoc(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

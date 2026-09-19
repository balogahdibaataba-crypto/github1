import React, { useState } from "react";
import { BalogahPdfFooter } from "./BalogahPdfFooter";
import { JobOffer, CandidateProfile } from "../types";
import {
  Briefcase,
  UserCheck,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Award,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Mail,
  Phone,
  ArrowRight,
  Brain,
  Sliders,
  Send,
  Download,
  BadgeCheck,
  FileText,
  Fingerprint
} from "lucide-react";
import { DirectorFingerprintScannerModal } from "./DirectorFingerprintScannerModal";

const INITIAL_JOB_OFFERS: JobOffer[] = [
  {
    id: "job-1",
    title: "Ingénieur Concepteur Logiciel & Cloud (Sénior)",
    companyName: "AfriTech Innovations Togocom & WAEMU",
    location: "Lomé, Togo (Hybride)",
    contractType: "CDI",
    sector: "Informatique & NTIC",
    description: "Nous recherchons un Ingénieur logiciel chevronné pour concevoir l'architecture de nos plateformes financières et applicatives. Le candidat retenu dirigera une équipe de 6 développeurs.",
    requirements: [
      "BAC+5 Diplôme d'Ingénieur ou Master informatique",
      "Maîtrise de TypeScript, Node.js, Python, PostgreSQL & Docker",
      "Excellentes capacités logiques et de résolution de problèmes complexes"
    ],
    minPsychometricScore: 80,
    minIQ: 115,
    salaryRangeFCFA: "1 200 000 - 1 800 000 FCFA / mois",
    contactEmail: "recrutement@afritech-innovations.com",
    contactPhone: "+228 90 96 67 65",
    postedDate: "24/07/2026"
  },
  {
    id: "job-2",
    title: "Chef de Projet Finance & Stratégie Bancaire",
    companyName: "Banque Ouest Africaine de Développement (BOAD)",
    location: "Abidjan, Côte d'Ivoire",
    contractType: "CDI",
    sector: "Banque & Finance",
    description: "Pilotage des projets d'investissement structurants dans la zone UEMOA. Analyse financière prospective, audit d'impact et négociation internationale.",
    requirements: [
      "BAC+5 Master Finance, Économie ou diplôme Grande École",
      "Minimum 3 ans d'expérience en gestion de portefeuille ou banque",
      "Aptitude élevée en raisonnement numérique et pensée stratégique"
    ],
    minPsychometricScore: 85,
    minIQ: 120,
    salaryRangeFCFA: "1 800 000 - 2 500 000 FCFA / mois",
    contactEmail: "rh@boad-recrutement.org",
    contactPhone: "+225 07 08 09 10 11",
    postedDate: "22/07/2026"
  },
  {
    id: "job-3",
    title: "Auditeur Comptable & Contrôleur de Gestion Junior",
    companyName: "KPMG Afrique de l'Ouest",
    location: "Cotonou, Bénin",
    contractType: "CDD",
    sector: "Gestion & Comptabilité",
    description: "Exécution des missions d'audit légal et contractuel auprès de grands comptes industriels et bancaires régionaux.",
    requirements: [
      "BAC+3 / BAC+5 CCA, Finance, Audit ou DCG",
      "Rigueur mathématique irréprochable et éthique professionnelle",
      "Bonne maîtrise du SYSCOHADA révisé"
    ],
    minPsychometricScore: 75,
    minIQ: 105,
    salaryRangeFCFA: "650 000 - 950 000 FCFA / mois",
    contactEmail: "talent@kpmg-benin.com",
    contactPhone: "+229 21 30 00 11",
    postedDate: "25/07/2026"
  },
  {
    id: "job-4",
    title: "Responsable Marketing Digital & Growth Hacker",
    companyName: "Moov Africa Togo",
    location: "Lomé, Togo",
    contractType: "CDI",
    sector: "Commerce & Marketing",
    description: "Conception et déploiement des campagnes digitales nationales, acquisition d'utilisateurs Mobile Money et analyse des parcours clients.",
    requirements: [
      "BAC+3 / BAC+5 Marketing Digital, Communication ou Commerce",
      "Solides compétences en analyse de données et créativité",
      "Maîtrise des outils Google Ads, Meta Ads et Analytics"
    ],
    minPsychometricScore: 70,
    minIQ: 100,
    salaryRangeFCFA: "800 000 - 1 200 000 FCFA / mois",
    contactEmail: "jobs@moov-africa.tg",
    contactPhone: "+228 99 37 20 74",
    postedDate: "20/07/2026"
  }
];

const INITIAL_CANDIDATES: CandidateProfile[] = [
  {
    id: "cand-1",
    fullName: "Koffi Amégan ABLODE",
    title: "Ingénieur Système & Développeur Fullstack",
    degreeLevel: "BAC+5 / Ingénieur Génie Informatique",
    location: "Lomé, Togo",
    email: "koffi.ablode@gmail.com",
    phone: "+228 91 22 33 44",
    psychometricScoreAvg: 92,
    estimatedIQ: 128,
    completedTestCount: 6,
    topSkills: ["Logique-Mathématique (95%)", "Soft Skills Leadership (90%)", "Anglais des Affaires (88%)"],
    verifiedCertification: true,
    isAvailable: true,
    preferredSectors: ["Informatique & NTIC", "Banque & Finance"]
  },
  {
    id: "cand-2",
    fullName: "Amina Charlotte DIOP",
    title: "Analyste Financière & Contrôle de Gestion",
    degreeLevel: "BAC+5 / Master Finance & Audit",
    location: "Dakar, Sénégal",
    email: "amina.diop@yahoo.fr",
    phone: "+221 77 654 32 10",
    psychometricScoreAvg: 88,
    estimatedIQ: 122,
    completedTestCount: 5,
    topSkills: ["Raisonnement Numérique (92%)", "Gestion de Projet (85%)", "Integrité & Éthique RH (94%)"],
    verifiedCertification: true,
    isAvailable: true,
    preferredSectors: ["Banque & Finance", "Gestion & Comptabilité"]
  },
  {
    id: "cand-3",
    fullName: "Yao Franck KOUASSI",
    title: "Chef de Produit Marketing & Relation Client",
    degreeLevel: "BAC+3 / Licence professionnelle Commerce",
    location: "Abidjan, Côte d'Ivoire",
    email: "franck.kouassi@hotmail.com",
    phone: "+225 05 44 55 66 77",
    psychometricScoreAvg: 82,
    estimatedIQ: 114,
    completedTestCount: 4,
    topSkills: ["Intelligence Interpersonnelle (90%)", "Négociation Commerciale (86%)", "Créativité (80%)"],
    verifiedCertification: true,
    isAvailable: true,
    preferredSectors: ["Commerce & Marketing", "Communication"]
  },
  {
    id: "cand-4",
    fullName: "Dr. Sokhna Aïda MBACKE",
    title: "Data Scientist & Chercheure en IA",
    degreeLevel: "BAC+8 / Doctorat Mathématiques Appliquées",
    location: "Lomé / Paris",
    email: "s.mbacke@ai-research.org",
    phone: "+228 90 11 22 33",
    psychometricScoreAvg: 96,
    estimatedIQ: 138,
    completedTestCount: 8,
    topSkills: ["Raisonnement Abstrait (98%)", "Algorithmique Avancée (96%)", "Anglais Bilingue (92%)"],
    verifiedCertification: true,
    isAvailable: true,
    preferredSectors: ["Informatique & NTIC", "Recherche & Innovation"]
  },
  {
    id: "cand-5",
    fullName: "Emmanuel Edem DOGBE",
    title: "Juriste d'Affaires & Compliance Officer",
    degreeLevel: "BAC+5 / Master Droit Privé des Affaires",
    location: "Cotonou, Bénin",
    email: "e.dogbe@juridique-afrik.org",
    phone: "+229 97 12 34 56",
    psychometricScoreAvg: 87,
    estimatedIQ: 120,
    completedTestCount: 5,
    topSkills: ["Raisonnement Verbal & Logique (94%)", "Conformité Réglementaire (90%)", "Négociation de Contrats (88%)"],
    verifiedCertification: true,
    isAvailable: true,
    preferredSectors: ["Droit & Justice", "Banque & Finance"]
  },
  {
    id: "cand-6",
    fullName: "Dr. Marc-Aurèle KOUAME",
    title: "Chirurgien Généraliste & Manager de Santé",
    degreeLevel: "BAC+8 / Doctorat d'État en Médecine",
    location: "Lomé, Togo",
    email: "dr.kouame@sante-waemu.org",
    phone: "+228 90 88 77 66",
    psychometricScoreAvg: 94,
    estimatedIQ: 132,
    completedTestCount: 7,
    topSkills: ["Aptitude Spatiale 3D (96%)", "Gestion du Stress sous Pression (94%)", "Précision Visuo-motrice (95%)"],
    verifiedCertification: true,
    isAvailable: true,
    preferredSectors: ["Médecine & Santé", "Recherche & Innovation"]
  }
];

export const RecruitmentHubView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"JOBS" | "CANDIDATES" | "CREATE_JOB">("JOBS");
  
  // Job Board filters & state
  const [jobOffers, setJobOffers] = useState<JobOffer[]>(INITIAL_JOB_OFFERS);
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [selectedJobSector, setSelectedJobSector] = useState("ALL");
  const [selectedContract, setSelectedContract] = useState("ALL");

  // Candidates database filters & state
  const [candidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [candSearchQuery, setCandSearchQuery] = useState("");
  const [minScoreFilter, setMinScoreFilter] = useState<number>(60);
  const [minIQFilter, setMinIQFilter] = useState<number>(90);
  const [selectedCandSector, setSelectedCandSector] = useState("ALL");
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(["cand-1", "cand-4"]);
  const [onlyShortlistedFilter, setOnlyShortlistedFilter] = useState<boolean>(false);
  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<CandidateProfile | null>(null);

  const toggleShortlist = (candId: string) => {
    setShortlistedIds((prev) =>
      prev.includes(candId) ? prev.filter((id) => id !== candId) : [...prev, candId]
    );
  };

  // New Job Offer Form state
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newContractType, setNewContractType] = useState<JobOffer["contractType"]>("CDI");
  const [newSector, setNewSector] = useState("Informatique & NTIC");
  const [newDescription, setNewDescription] = useState("");
  const [newRequirements, setNewRequirements] = useState("");
  const [newMinScore, setNewMinScore] = useState(75);
  const [newMinIQ, setNewMinIQ] = useState(110);
  const [newSalary, setNewSalary] = useState("800 000 FCFA / mois");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Application Modal state
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobOffer | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  // Biometric Validation State
  const [isBiometricValidated, setIsBiometricValidated] = useState(true);
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false);

  const handlePrintCandidateWithValidation = () => {
    if (isBiometricValidated) {
      window.print();
    } else {
      setIsFingerprintModalOpen(true);
    }
  };

  const handleFingerprintSuccess = () => {
    setIsBiometricValidated(true);
    setIsFingerprintModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Filtered Job Offers
  const filteredJobs = jobOffers.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(jobSearchQuery.toLowerCase());
    const matchesSector = selectedJobSector === "ALL" || job.sector === selectedJobSector;
    const matchesContract = selectedContract === "ALL" || job.contractType === selectedContract;
    return matchesSearch && matchesSector && matchesContract;
  });

  // Filtered Candidates
  const filteredCandidates = candidates.filter((cand) => {
    const matchesSearch =
      cand.fullName.toLowerCase().includes(candSearchQuery.toLowerCase()) ||
      cand.title.toLowerCase().includes(candSearchQuery.toLowerCase()) ||
      cand.location.toLowerCase().includes(candSearchQuery.toLowerCase());
    const matchesScore = cand.psychometricScoreAvg >= minScoreFilter;
    const matchesIQ = cand.estimatedIQ >= minIQFilter;
    const matchesSector =
      selectedCandSector === "ALL" || cand.preferredSectors.includes(selectedCandSector);
    const matchesShortlist = !onlyShortlistedFilter || shortlistedIds.includes(cand.id);
    return matchesSearch && matchesScore && matchesIQ && matchesSector && matchesShortlist;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newCompanyName || !newEmail) return;

    const reqArray = newRequirements
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const createdJob: JobOffer = {
      id: `job-${Date.now()}`,
      title: newJobTitle,
      companyName: newCompanyName,
      location: newLocation || "Lomé, Togo",
      contractType: newContractType,
      sector: newSector,
      description: newDescription,
      requirements: reqArray.length > 0 ? reqArray : ["Expérience et compétences adéquates requises."],
      minPsychometricScore: Number(newMinScore),
      minIQ: Number(newMinIQ),
      salaryRangeFCFA: newSalary,
      contactEmail: newEmail,
      contactPhone: newPhone || "+228 90 96 67 65",
      postedDate: new Date().toLocaleDateString("fr-FR")
    };

    setJobOffers([createdJob, ...jobOffers]);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveSubTab("JOBS");
    }, 2000);
  };

  const handleApplyToJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) return;
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedJobForApply(null);
      setApplicantName("");
      setApplicantPhone("");
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
              <Briefcase className="w-3.5 h-3.5" /> Espace Recrutement Entreprises & RH
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" /> Candidats Certifiés Psychotechniques & QI
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Plateforme de Recrutement Intelligente Basée sur les Tests Psychométriques
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Entreprises et cabinets RH : publiez vos offres d'emploi et accédez à une CVthèque qualifiée par leurs scores officiels d'aptitude, bilans de compétences et quotient intellectuel délivrés par le Dr. BALOGAH Dibaataba.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveSubTab("JOBS")}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === "JOBS"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Offres d'Emploi ({jobOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("CANDIDATES")}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === "CANDIDATES"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>CVthèque & Filtrage Tests RH ({candidates.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("CREATE_JOB")}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === "CREATE_JOB"
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>Publier une Offre d'Emploi</span>
        </button>
      </div>

      {/* TAB 1: JOB BOARD VIEW */}
      {activeSubTab === "JOBS" && (
        <div className="space-y-6">
          {/* Search & Filters for Jobs */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative col-span-1 sm:col-span-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Poste, entreprise, ville..."
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={selectedJobSector}
                onChange={(e) => setSelectedJobSector(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ALL">Tous les Secteurs d'Activité</option>
                <option value="Informatique & NTIC">Informatique & NTIC</option>
                <option value="Banque & Finance">Banque & Finance</option>
                <option value="Gestion & Comptabilité">Gestion & Comptabilité</option>
                <option value="Commerce & Marketing">Commerce & Marketing</option>
              </select>

              <select
                value={selectedContract}
                onChange={(e) => setSelectedContract(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ALL">Tous les Contrats (CDI, CDD, Stage...)</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Freelance / Prestation">Freelance / Prestation</option>
              </select>
            </div>
          </div>

          {/* Job Offers Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded-full">
                        {job.sector}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">{job.title}</h3>
                      <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.companyName}</span>
                      </p>
                    </div>

                    <span className="px-2.5 py-1 bg-slate-900 text-white text-xs font-extrabold rounded-lg shrink-0">
                      {job.contractType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      💰 {job.salaryRangeFCFA}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  {/* Required Psychometric Threshold */}
                  <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-bold text-indigo-950">Seuil Psychotechnique Exigé :</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-600 text-white font-extrabold text-[10px] rounded-full">
                        ≥ {job.minPsychometricScore}% Score RH
                      </span>
                      {job.minIQ && (
                        <span className="px-2 py-0.5 bg-purple-600 text-white font-extrabold text-[10px] rounded-full">
                          QI ≥ {job.minIQ}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Requirements list */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Exigences du Poste :</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400 font-mono">Publié le {job.postedDate}</span>

                  <button
                    onClick={() => setSelectedJobForApply(job)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Postuler avec mes Tests</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATES DATABASE (CVTHÈQUE) */}
      {activeSubTab === "CANDIDATES" && (
        <div className="space-y-6">
          {/* Advanced Filter Box for Recruiters */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Filtres de Sélection Candidats (Aptitudes Psychométriques & QI)</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOnlyShortlistedFilter(!onlyShortlistedFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    onlyShortlistedFilter
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Pré-sélectionnés ({shortlistedIds.length})</span>
                </button>
                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                  {filteredCandidates.length} candidat(s)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mots-clés / Candidat / Poste :
                </label>
                <input
                  type="text"
                  placeholder="Nom, domaine, ville..."
                  value={candSearchQuery}
                  onChange={(e) => setCandSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Secteur d'Activité :
                </label>
                <select
                  value={selectedCandSector}
                  onChange={(e) => setSelectedCandSector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">Tous les Secteurs</option>
                  <option value="Informatique & NTIC">Informatique & NTIC</option>
                  <option value="Banque & Finance">Banque & Finance</option>
                  <option value="Gestion & Comptabilité">Gestion & Comptabilité</option>
                  <option value="Commerce & Marketing">Commerce & Marketing</option>
                  <option value="Droit & Justice">Droit & Justice</option>
                  <option value="Médecine & Santé">Médecine & Santé</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Score Psychotechnique ≥ <span className="text-indigo-600">{minScoreFilter}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={minScoreFilter}
                  onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Quotient Intellectuel ≥ <span className="text-purple-600">{minIQFilter}</span>
                </label>
                <input
                  type="range"
                  min="90"
                  max="135"
                  step="5"
                  value={minIQFilter}
                  onChange={(e) => setMinIQFilter(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Candidate Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCandidates.map((cand) => {
              const isShortlisted = shortlistedIds.includes(cand.id);
              return (
                <div
                  key={cand.id}
                  className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-between transition-all space-y-4 ${
                    isShortlisted ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900">{cand.fullName}</h3>
                          {cand.verifiedCertification && (
                            <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Bilan & Tests Certifiés Dr. BALOGAH" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-indigo-700">{cand.title}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{cand.location} • {cand.degreeLevel}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => toggleShortlist(cand.id)}
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full flex items-center gap-1 shrink-0 transition-all ${
                          isShortlisted
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        <Award className={`w-3 h-3 ${isShortlisted ? "text-amber-600 fill-amber-500" : ""}`} />
                        <span>{isShortlisted ? "Pré-sélectionné" : "Pré-sélectionner"}</span>
                      </button>
                    </div>

                    {/* Psychometric Scores & IQ Box */}
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-3.5 rounded-xl border border-indigo-800/50 flex items-center justify-between gap-3 shadow-inner">
                      <div>
                        <span className="text-[10px] text-slate-300 font-bold uppercase block">Score Psychotechnique</span>
                        <span className="text-xl font-black text-emerald-400">{cand.psychometricScoreAvg}%</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-300 font-bold uppercase block">Quotient Intellectuel</span>
                        <span className="text-xl font-black text-purple-300">QI {cand.estimatedIQ}</span>
                      </div>

                      <div className="text-right border-l border-slate-700 pl-3">
                        <span className="text-[10px] text-slate-300 font-bold uppercase block">Tests Validés</span>
                        <span className="text-sm font-extrabold text-white">{cand.completedTestCount} tests</span>
                      </div>
                    </div>

                    {/* Top Skills Tags */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Principales Aptitudes Évaluées :</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cand.topSkills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-semibold rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedCandidateForDetail(cand)}
                      className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 underline underline-offset-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Dossier Évaluation Détaillé</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${cand.email}`}
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title={cand.email}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://wa.me/${cand.phone.replace(/[^0-9]/g, "")}?text=Bonjour%20${encodeURIComponent(cand.fullName)},%20nous%20avons%20vu%20votre%20profil%20sur%20OrientaAfrik.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Contacter</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CREATE JOB OFFER FORM */}
      {activeSubTab === "CREATE_JOB" && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 md:p-8 max-w-3xl mx-auto space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Espace Entreprise</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">Publier une Offre d'Emploi ou de Stage</h3>
            <p className="text-xs text-slate-600 mt-1">
              Complétez le formulaire ci-dessous pour publier votre offre d'emploi. Votre annonce exigera un score minimal aux tests psychotechniques et de QI d'OrientaAfrik.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold">Votre offre d'emploi a été publiée avec succès !</h4>
              <p className="text-xs text-slate-600">Redirection automatique vers le tableau des offres d'emploi...</p>
            </div>
          ) : (
            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Intitulé du Poste * :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ingénieur Développeur, Chef Comptable..."
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Nom de l'Entreprise / Organisation * :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Togocom, BOAD, Groupe Ecobank..."
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Ville & Pays :</label>
                  <input
                    type="text"
                    placeholder="Ex: Lomé, Togo"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Type de Contrat :</label>
                  <select
                    value={newContractType}
                    onChange={(e) => setNewContractType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance / Prestation">Freelance / Prestation</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Secteur d'Activité :</label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Informatique & NTIC">Informatique & NTIC</option>
                    <option value="Banque & Finance">Banque & Finance</option>
                    <option value="Gestion & Comptabilité">Gestion & Comptabilité</option>
                    <option value="Commerce & Marketing">Commerce & Marketing</option>
                  </select>
                </div>
              </div>

              {/* Thresholds Requirements */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-indigo-950 block mb-1">
                    Score Psychotechnique Minimal Requis : <span className="text-indigo-600">{newMinScore}%</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={newMinScore}
                    onChange={(e) => setNewMinScore(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="font-bold text-indigo-950 block mb-1">
                    Seuil de Quotient Intellectuel (QI) Requis : <span className="text-purple-600">QI {newMinIQ}</span>
                  </label>
                  <input
                    type="range"
                    min="90"
                    max="135"
                    step="5"
                    value={newMinIQ}
                    onChange={(e) => setNewMinIQ(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Fourchette Salariale Proposée (FCFA / mois) :</label>
                <input
                  type="text"
                  placeholder="Ex: 800 000 - 1 200 000 FCFA / mois"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Description du Poste :</label>
                <textarea
                  rows={3}
                  placeholder="Décrivez les missions principales et responsabilités du poste..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Exigences & Diplômes (Un critère par ligne) :</label>
                <textarea
                  rows={3}
                  placeholder="Ex: BAC+5 Diplôme d'Ingénieur&#10;3 ans d'expérience au poste&#10;Anglais professionnel courant"
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Email de Réception des Candidatures * :</label>
                  <input
                    type="email"
                    required
                    placeholder="recrutement@votre-entreprise.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Téléphone RH de Contact :</label>
                  <input
                    type="tel"
                    placeholder="+228 90 96 67 65"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm pt-3"
              >
                <Send className="w-4 h-4" />
                <span>Publier l'Offre sur OrientaAfrik</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* CANDIDATE APPLY MODAL */}
      {selectedJobForApply && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Candidature Instantanée</span>
                <h3 className="font-bold text-base text-slate-900">{selectedJobForApply.title}</h3>
                <p className="text-xs text-slate-500">{selectedJobForApply.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedJobForApply(null)}
                className="text-slate-400 hover:text-slate-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {applySuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">Votre dossier avec vos résultats de tests OrientaAfrik a été transmis au recruteur !</p>
              </div>
            ) : (
              <form onSubmit={handleApplyToJob} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Votre Nom & Prénoms :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Koffi Mensah"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Téléphone / WhatsApp :</label>
                  <input
                    type="tel"
                    required
                    placeholder="+228 90 00 00 00"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                  <span className="font-bold block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Vos scores certifiés seront joints :
                  </span>
                  <p className="text-slate-600">
                    Sera transmis : Vos tests de compétences complétés, votre bilan psychotechnique et votre certification Dr. BALOGAH.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Envoyer ma Candidature au Recruteur
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CANDIDATE EVALUATION DETAIL MODAL FOR RECRUITERS */}
      {selectedCandidateForDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="print-container printable-area bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase">
                  Dossier de Candidature RH Certifié
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-1 flex items-center gap-2">
                  <span>{selectedCandidateForDetail.fullName}</span>
                  {selectedCandidateForDetail.verifiedCertification && (
                    <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" title="Bilan Certifié Dr. BALOGAH" />
                  )}
                </h3>
                <p className="text-xs font-semibold text-indigo-700">{selectedCandidateForDetail.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCandidateForDetail.degreeLevel} • {selectedCandidateForDetail.location}
                </p>
              </div>

              <button
                onClick={() => setSelectedCandidateForDetail(null)}
                className="text-slate-400 hover:text-slate-800 p-2 text-sm font-bold rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Top Score Summary Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-800/40 grid grid-cols-3 gap-4 shadow-lg text-center">
              <div>
                <span className="text-[10px] text-slate-300 font-bold uppercase block">Moyenne RH Global</span>
                <span className="text-2xl font-black text-emerald-400">{selectedCandidateForDetail.psychometricScoreAvg}%</span>
              </div>
              <div className="border-x border-slate-800 px-2">
                <span className="text-[10px] text-slate-300 font-bold uppercase block">Quotient Intellectuel</span>
                <span className="text-2xl font-black text-purple-300">QI {selectedCandidateForDetail.estimatedIQ}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 font-bold uppercase block">Tests Réalisés</span>
                <span className="text-2xl font-black text-indigo-300">{selectedCandidateForDetail.completedTestCount}</span>
              </div>
            </div>

            {/* Psychometric Sub-scores Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>Bilan Métrique par Domaine d'Aptitude :</span>
              </h4>

              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Raisonnement Logique & Analyse Complexe</span>
                    <span className="text-indigo-600 font-extrabold">95% (Excellent)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: "95%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Raisonnement Numérique & Modélisation</span>
                    <span className="text-indigo-600 font-extrabold">92% (Très Élevé)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Aptitude Interpersonnelle & Leadership RH</span>
                    <span className="text-emerald-600 font-extrabold">90% (Supérieur)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Compréhension Verbale & Rédaction Stratégique</span>
                    <span className="text-purple-600 font-extrabold">88% (Très Bon)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: "88%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Verified Competencies */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Compétences Clés Certifiées :</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCandidateForDetail.topSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Official Certification Seal */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 space-y-1">
                <span className="font-extrabold block">Certification d'Authenticité OrientaAfrik</span>
                <p className="text-amber-900 leading-relaxed">
                  Ce bilan psychométrique et le score de ce candidat ont été supervisés et validés scientifiquement sous la responsabilité du <strong>Dr. BALOGAH Dibaataba</strong>.
                </p>
              </div>
            </div>

            {/* Dynamic PDF Footer with Dr BALOGAH QR Code */}
            <div className="pt-2">
              <BalogahPdfFooter
                docId={`RH-CAND-${selectedCandidateForDetail.id.toUpperCase()}`}
                studentName={selectedCandidateForDetail.fullName}
                docType="Bilan de Compétences RH & Fiche Candidat"
                showFullCabinetDetails={true}
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => toggleShortlist(selectedCandidateForDetail.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  shortlistedIds.includes(selectedCandidateForDetail.id)
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                <Award className="w-4 h-4" />
                <span>
                  {shortlistedIds.includes(selectedCandidateForDetail.id)
                    ? "Retirer de la Sélection"
                    : "Ajouter aux Pré-sélectionnés"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCandidateWithValidation}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Imprimer le Bilan PDF</span>
                </button>

                <a
                  href={`https://wa.me/${selectedCandidateForDetail.phone.replace(/[^0-9]/g, "")}?text=Bonjour%20${encodeURIComponent(selectedCandidateForDetail.fullName)},%20votre%20profil%20psychométrique%20sur%20OrientaAfrik%20a%20retenu%20notre%20attention.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contacter via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIRECTOR FINGERPRINT SCANNER MODAL */}
      <DirectorFingerprintScannerModal
        isOpen={isFingerprintModalOpen}
        onClose={() => setIsFingerprintModalOpen(false)}
        onSuccess={handleFingerprintSuccess}
        documentTitle={selectedCandidateForDetail ? `Fiche de Bilan Psychométrique - ${selectedCandidateForDetail.fullName}` : "Fiche Candidat RH"}
        docId={selectedCandidateForDetail?.id || "RH-2026-BAL-DG"}
      />
    </div>
  );
};

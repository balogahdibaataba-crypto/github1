import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "FR" | "EN" | "ES" | "ZH" | "AR" | "PT" | "DE" | "RU" | "HI" | "SW";

export const LANGUAGE_OPTIONS: { code: Language; name: string; flag: string }[] = [
  { code: "FR", name: "Français", flag: "🇫🇷" },
  { code: "EN", name: "English", flag: "🇬🇧" },
  { code: "ES", name: "Español", flag: "🇪🇸" },
  { code: "ZH", name: "中文 (Mandarin)", flag: "🇨🇳" },
  { code: "AR", name: "العربية (Arabic)", flag: "🇸🇦" },
  { code: "PT", name: "Português", flag: "🇵🇹" },
  { code: "DE", name: "Deutsch", flag: "🇩🇪" },
  { code: "RU", name: "Русский", flag: "🇷🇺" },
  { code: "HI", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "SW", name: "Kiswahili", flag: "🇹🇿" },
];

export interface TranslationSchema {
  // Top Bar & Advisor Info
  advisorName: string;
  advisorRole1: string;
  advisorRole2: string;
  advisorTitle: string;
  currency: string;
  language: string;
  appTitle: string;
  appSubtitle: string;
  aiConsultationCta: string;
  
  // Main Categories
  catHome: string;
  catAbout: string;
  catServices: string;
  catActivities: string;
  catPartners: string;
  catAdmin: string;
  catContacts: string;

  // Nav Sub-Items
  navInstitutions: string;
  navRoadmapD3: string;
  navCareers: string;
  navSaved: string;
  navTests: string;
  navCalculator: string;
  navCostOfLiving: string;
  navAiCounselor: string;
  navTestimonials: string;
  navServices: string;
  navTransactions: string;
  navEvents: string;
  navFaq: string;
  navAds: string;
  navAboutPresentation: string;
  navCertifications: string;
  navPaidComms: string;
  navDocAnalyzer: string;
  navExamPrep: string;
  navReferral: string;
  navRecruitmentHub: string;
  navWallet: string;
  navContactsDetails: string;
  navFaqSupport: string;

  // Badges & Actions
  paidBadge: string;
  newBadge: string;
  liveBadge: string;
  freeBadge: string;
  verifiedBadge: string;
  viewDetails: string;
  applyNow: string;
  contactAdvisor: string;
  filterByRegion: string;
  filterBySector: string;
  all: string;
  reset: string;
  close: string;
  searchPlaceholder: string;
  searchGlobal: string;
  back: string;
  continueBtn: string;
  downloadPdf: string;
  printReport: string;
  calculate: string;
  saveItem: string;
  removeItem: string;
  share: string;
  copyLink: string;

  // Callout Banner
  calloutTitle: string;
  calloutDesc: string;
  calloutBtnInstitutions: string;
  calloutBtnCalc: string;

  // Common Sections
  secInstitutionsTitle: string;
  secInstitutionsSubtitle: string;
  secCareersTitle: string;
  secCareersSubtitle: string;
  secTestsTitle: string;
  secTestsSubtitle: string;
  secCalculatorTitle: string;
  secCalculatorSubtitle: string;
  secServicesTitle: string;
  secServicesSubtitle: string;
  secAboutTitle: string;
  secAboutSubtitle: string;
  secContactsTitle: string;
  secContactsSubtitle: string;
  secFaqTitle: string;
  secFaqSubtitle: string;
  secTestimonialsTitle: string;
  secTestimonialsSubtitle: string;
  secEventsTitle: string;
  secEventsSubtitle: string;
  secRecruitmentTitle: string;
  secRecruitmentSubtitle: string;
  secWalletTitle: string;
  secWalletSubtitle: string;
  secTransactionsTitle: string;
  secTransactionsSubtitle: string;
  secCostOfLivingTitle: string;
  secCostOfLivingSubtitle: string;
  secExamPrepTitle: string;
  secExamPrepSubtitle: string;
  secCertificationsTitle: string;
  secCertificationsSubtitle: string;
  secPaidCommsTitle: string;
  secPaidCommsSubtitle: string;

  // Saved Bookmarks
  savedTitle: string;
  savedSubtitle: string;
  savedCount: string;
  noSavedTitle: string;
  noSavedDesc: string;
  filterAll: string;
  filterInstitutions: string;
  filterCareers: string;
  clearAll: string;
  removeFromFavorites: string;
  saveToFavorites: string;
}

const baseFR: TranslationSchema = {
  advisorName: "Docteur BALOGAH Dibaataba",
  advisorRole1: "Spécialiste des sciences de l'éducation et de la formation,",
  advisorRole2: "Conseiller en Formation-Professionnalisation, Conseiller d'orientation scolaire et professionnelle.",
  advisorTitle: "Docteur BALOGAH Dibaataba, Spécialiste des sciences de l'éducation et de la formation,\nConseiller en Formation-Professionnalisation, Conseiller d'orientation scolaire et professionnelle.",
  currency: "Monnaie :",
  language: "Langue :",
  appTitle: "OrientaAfrik et Certification",
  appSubtitle: "Information, Orientation scolaires et professionnelles, Certifications VAE • Formation-Professionnalisation • Conseil en formation-Professionnalisation • Bilan de compétences • Aide au recrutement",
  aiConsultationCta: "Consultation Dr BALOGAH et rapport certifié",
  
  catHome: "Accueil",
  catAbout: "À propos",
  catServices: "Services",
  catActivities: "Activités",
  catPartners: "Partenaires",
  catAdmin: "Administration",
  catContacts: "Contacts",

  navInstitutions: "Établissements & Facultés",
  navRoadmapD3: "Roadmap Métiers D3",
  navCareers: "2000 Métiers",
  navSaved: "Mes Favoris",
  navTests: "Tests, QI & Bilan",
  navCalculator: "Calculateur Moyennes",
  navCostOfLiving: "Coût de la Vie",
  navAiCounselor: "Consultation Dr BALOGAH et rapport certifié",
  navTestimonials: "Témoignages",
  navServices: "Espace Client & Tarifs",
  navTransactions: "Mes Transactions & Rapports",
  navEvents: "Agenda & Événements",
  navFaq: "FAQ & Aide",
  navAds: "Espace Pub",
  navAboutPresentation: "Présentation & Vision",
  navCertifications: "Formations & VAE",
  navPaidComms: "Visioconférences & Direct",
  navDocAnalyzer: "Analyseur IA",
  navExamPrep: "Examens & Concours",
  navReferral: "Programme Parrainage",
  navRecruitmentHub: "Recrutement RH",
  navWallet: "Mon Portefeuille",
  navContactsDetails: "Contacts & Coordonnées",
  navFaqSupport: "Support & FAQ",

  paidBadge: "Payé",
  newBadge: "Nouveau",
  liveBadge: "Direct HD",
  freeBadge: "Gratuit",
  verifiedBadge: "Certifié",
  viewDetails: "Voir Détails",
  applyNow: "Postuler / En Savoir Plus",
  contactAdvisor: "Contacter le Conseiller Dr BALOGAH",
  filterByRegion: "Filtrer par Région",
  filterBySector: "Filtrer par Secteur",
  all: "Tous",
  reset: "Réinitialiser",
  close: "Fermer",
  searchPlaceholder: "Rechercher un établissement, faculté, 2000 métiers, ville ou filière...",
  searchGlobal: "Recherche Globale",
  back: "Retour",
  continueBtn: "Continuer",
  downloadPdf: "Télécharger le Rapport PDF",
  printReport: "Imprimer le Rapport",
  calculate: "Calculer mon Éligibilité",
  saveItem: "Enregistrer",
  removeItem: "Supprimer",
  share: "Partager",
  copyLink: "Copier le lien",

  calloutTitle: "Orientation Scolaire & Universitaire — Recommandation du Dr BALOGAH",
  calloutDesc: "Nous invitons tous les élèves, étudiants et candidats à effectuer leurs recherches ciblées sur les Établissements d'Enseignement Supérieur et les Filières d'études visées dans notre annuaire et sur Google, puis à renseigner soigneusement le Calculateur de Moyenne pour évaluer leur éligibilité académique.",
  calloutBtnInstitutions: "Rechercher des Établissements & Filières",
  calloutBtnCalc: "Renseigner le Calculateur de Moyenne",

  secInstitutionsTitle: "Annuaire des Universités, Établissements & Facultés",
  secInstitutionsSubtitle: "Explorez la cartographie complète des universités et grandes écoles au Togo, en Afrique et dans le monde.",
  secCareersTitle: "Répertoire des 2000 Métiers Porteurs",
  secCareersSubtitle: "Découvrez les métiers d'avenir, compétences requises, salaires indicatifs et formations recommandées.",
  secTestsTitle: "Tests Psychométriques, RIASEC & Bilan de Compétences",
  secTestsSubtitle: "Évaluez votre profil d'intérêts, vos aptitudes cognitives et découvrez vos filières de prédilection.",
  secCalculatorTitle: "Calculateur de Moyennes & Éligibilité aux Filières",
  secCalculatorSubtitle: "Vérifiez vos notes du BAC/Lycée, comparez jusqu'à 3 filières simultanément et visualisez les seuils requis.",
  secServicesTitle: "Espace Client, Prestations & Tarifs Officiels",
  secServicesSubtitle: "Découvrez nos offres d'accompagnement individuel, bilans certifiés et services d'orientation.",
  secAboutTitle: "À Propos d'OrientaAfrik & du Cabinet Dr BALOGAH",
  secAboutSubtitle: "Cabinet International d'Orientation scolaire et professionnelle, VAE, bilans et conseil RH.",
  secContactsTitle: "Contactez le Cabinet OrientaAfrik et Certification",
  secContactsSubtitle: "Notre équipe d'experts est à votre entière disposition pour répondre à toutes vos demandes.",
  secFaqTitle: "Foire Aux Questions & Guide d'Orientation",
  secFaqSubtitle: "Trouvez des réponses claires sur nos services, la validation des notes et le rapport certifié.",
  secTestimonialsTitle: "Témoignages & Retours d'Expérience",
  secTestimonialsSubtitle: "Découvrez les parcours inspirants d'élèves, étudiants et professionnels accompagnés avec succès.",
  secEventsTitle: "Agenda des Salons & Événements d'Orientation",
  secEventsSubtitle: "Participez aux salons étudiants, webinaires, forums métiers et journées portes ouvertes.",
  secRecruitmentTitle: "Espace Recrutement & Insertion Professionnelle",
  secRecruitmentSubtitle: "Offres d'emploi, stages, programmes d'insertion et mise en relation avec les recruteurs.",
  secWalletTitle: "Mon Portefeuille & Solde d'Activité",
  secWalletSubtitle: "Consultez vos gains d'activité et transférez vos fonds vers Mixx ou Moov Money.",
  secTransactionsTitle: "Mes Transactions & Reçus Officiels",
  secTransactionsSubtitle: "Consultez l'historique de vos paiements sécurisés et téléchargez vos reçus fiscaux.",
  secCostOfLivingTitle: "Comparateur du Coût de la Vie Étudiante",
  secCostOfLivingSubtitle: "Comparez les budgets mensuels, logements et transports dans les grandes villes universitaires.",
  secExamPrepTitle: "Entraînement aux Examens & Concours Nationaux",
  secExamPrepSubtitle: "Épreuves types corrigées, méthodologie et préparation intensive au BAC, BEPC et concours.",
  secCertificationsTitle: "Certifications VAE & Formations Professionnalisantes",
  secCertificationsSubtitle: "Validez vos acquis de l'expérience et accélérez votre évolution professionnelle.",
  secPaidCommsTitle: "Visioconférences & Rendez-vous Directs en Ligne",
  secPaidCommsSubtitle: "Échangez en direct vidéo HD avec le Dr BALOGAH et nos conseillers experts.",

  savedTitle: "Mes Favoris & Éléments Enregistrés",
  savedSubtitle: "Consultez, comparez et accédez rapidement à vos universités, facultés, filières et métiers enregistrés.",
  savedCount: "élément(s) enregistré(s)",
  noSavedTitle: "Aucun élément dans vos favoris",
  noSavedDesc: "Explorez les établissements, les 2000 métiers ou le calculateur et cliquez sur le cœur ❤️ ou le marque-page 🔖 pour enregistrer un élément ici.",
  filterAll: "Tous les favoris",
  filterInstitutions: "Établissements",
  filterCareers: "2000 Métiers",
  clearAll: "Tout effacer",
  removeFromFavorites: "Retirer des favoris",
  saveToFavorites: "Ajouter aux favoris",
};

const baseEN: TranslationSchema = {
  advisorName: "Dr. BALOGAH Dibaataba",
  advisorRole1: "Education and Training Science Specialist,",
  advisorRole2: "Training-Professionalization Advisor, Academic & Career Guidance Counselor.",
  advisorTitle: "Dr. BALOGAH Dibaataba, Education & Training Specialist,\nTraining-Professionalization Advisor, Academic & Career Guidance Counselor.",
  currency: "Currency:",
  language: "Language:",
  appTitle: "OrientaAfrik & Certification",
  appSubtitle: "Academic & Career Information, Guidance, VAE Certifications • Training-Professionalization • Skill Assessments • Recruitment Assistance",
  aiConsultationCta: "Dr BALOGAH Consultation & Certified Report",

  catHome: "Home",
  catAbout: "About Us",
  catServices: "Services",
  catActivities: "Activities",
  catPartners: "Partners",
  catAdmin: "Administration",
  catContacts: "Contacts",

  navInstitutions: "Institutions & Faculties",
  navRoadmapD3: "D3 Career Roadmap",
  navCareers: "2000 Careers",
  navSaved: "My Bookmarks",
  navTests: "IQ & Assessment Tests",
  navCalculator: "GPA Calculator",
  navCostOfLiving: "Cost of Living",
  navAiCounselor: "Dr BALOGAH Consultation & Certified Report",
  navTestimonials: "Testimonials",
  navServices: "Client Space & Pricing",
  navTransactions: "My Transactions & Reports",
  navEvents: "Events & Agenda",
  navFaq: "FAQ & Help",
  navAds: "Ad Space",
  navAboutPresentation: "Presentation & Vision",
  navCertifications: "Trainings & VAE",
  navPaidComms: "Video Calls & Live",
  navDocAnalyzer: "AI Doc Analyzer",
  navExamPrep: "Exams & Contests",
  navReferral: "Referral Program",
  navRecruitmentHub: "HR Recruitment",
  navWallet: "My Wallet",
  navContactsDetails: "Contacts & Address",
  navFaqSupport: "Support & FAQ",

  paidBadge: "Paid",
  newBadge: "New",
  liveBadge: "Live HD",
  freeBadge: "Free",
  verifiedBadge: "Verified",
  viewDetails: "View Details",
  applyNow: "Apply / Learn More",
  contactAdvisor: "Contact Dr. BALOGAH",
  filterByRegion: "Filter by Region",
  filterBySector: "Filter by Sector",
  all: "All",
  reset: "Reset",
  close: "Close",
  searchPlaceholder: "Search institution, faculty, 2000 careers, city or field...",
  searchGlobal: "Global Search",
  back: "Back",
  continueBtn: "Continue",
  downloadPdf: "Download PDF Report",
  printReport: "Print Report",
  calculate: "Check My Eligibility",
  saveItem: "Save",
  removeItem: "Remove",
  share: "Share",
  copyLink: "Copy Link",

  calloutTitle: "Academic & University Orientation — Dr BALOGAH Recommendation",
  calloutDesc: "We invite all pupils, students, and applicants to conduct targeted searches for Higher Education Institutions and target degree programs in our directory and on Google, then fill out the GPA Calculator to evaluate their academic eligibility.",
  calloutBtnInstitutions: "Search Institutions & Programs",
  calloutBtnCalc: "Open GPA Calculator",

  secInstitutionsTitle: "Directory of Universities, Colleges & Faculties",
  secInstitutionsSubtitle: "Explore the comprehensive mapping of higher education institutions across Africa and the world.",
  secCareersTitle: "Directory of 2,000 Promising Careers",
  secCareersSubtitle: "Discover future jobs, required skills, indicative salary ranges, and recommended pathways.",
  secTestsTitle: "Psychometric Tests, RIASEC & Skills Assessment",
  secTestsSubtitle: "Evaluate your interest profile, cognitive abilities, and discover your best matching study paths.",
  secCalculatorTitle: "GPA Calculator & Academic Eligibility Check",
  secCalculatorSubtitle: "Enter your high school grades, compare up to 3 programs simultaneously, and review minimum grade requirements.",
  secServicesTitle: "Client Space, Official Services & Pricing",
  secServicesSubtitle: "Explore our personalized advisory packages, certified reports, and career counseling services.",
  secAboutTitle: "About OrientaAfrik & Dr. BALOGAH's Office",
  secAboutSubtitle: "International Academic & Career Guidance firm, VAE certifications, and HR consulting.",
  secContactsTitle: "Contact OrientaAfrik & Certification Office",
  secContactsSubtitle: "Our team of guidance and recruitment experts is here to assist your educational and career journey.",
  secFaqTitle: "Frequently Asked Questions & Guidance Handbook",
  secFaqSubtitle: "Find clear answers about our services, grade evaluations, and certified official reports.",
  secTestimonialsTitle: "Testimonials & Success Stories",
  secTestimonialsSubtitle: "Discover inspiring journeys from students and professionals guided to academic and career success.",
  secEventsTitle: "Career Fairs & Academic Events Calendar",
  secEventsSubtitle: "Join student fairs, webinars, career forums, and open campus days across Africa.",
  secRecruitmentTitle: "Recruitment Portal & Career Insertion Hub",
  secRecruitmentSubtitle: "Job openings, internships, professional insertion programs, and direct employer networking.",
  secWalletTitle: "My Wallet & Navigation Earnings",
  secWalletSubtitle: "View accumulated activity rewards and withdraw instantly via Mixx or Moov Money.",
  secTransactionsTitle: "My Transactions & Official Receipts",
  secTransactionsSubtitle: "Track your secure payment history, download official invoices and access certified reports.",
  secCostOfLivingTitle: "Student Cost of Living & Housing Comparator",
  secCostOfLivingSubtitle: "Compare monthly living expenses, student housing, and transportation across top university cities.",
  secExamPrepTitle: "National Exams & Competitive Contests Preparation",
  secExamPrepSubtitle: "Sample exam tests, methodological solutions, and preparation for BAC, BEPC, and university entrance contests.",
  secCertificationsTitle: "VAE Certifications & Professional Training",
  secCertificationsSubtitle: "Validate your prior work experience and accelerate your professional advancement.",
  secPaidCommsTitle: "High-Definition Video Consultations & Live Sessions",
  secPaidCommsSubtitle: "Connect in 1-on-1 HD video conferences directly with Dr. BALOGAH and our senior advisors.",

  savedTitle: "My Bookmarks & Saved Items",
  savedSubtitle: "View, compare, and quickly access your bookmarked universities, faculties, programs, and careers.",
  savedCount: "saved item(s)",
  noSavedTitle: "No saved items in your bookmarks",
  noSavedDesc: "Explore institutions, 2000 careers, or the GPA calculator and click the heart ❤️ or bookmark 🔖 icon to save items here.",
  filterAll: "All Favorites",
  filterInstitutions: "Institutions",
  filterCareers: "2000 Careers",
  clearAll: "Clear All",
  removeFromFavorites: "Remove from favorites",
  saveToFavorites: "Bookmark item",
};

const baseES: TranslationSchema = {
  ...baseEN,
  advisorTitle: "Dr. BALOGAH Dibaataba, Especialista en Ciencias de la Educación, Asesor de Formación y Orientación Académica.",
  currency: "Moneda:",
  language: "Idioma:",
  appTitle: "OrientaAfrik y Certificación",
  appSubtitle: "Información y Orientación Académica y Profesional • Certificaciones VAE • Evaluación de Competencias • Asistencia de Reclutamiento",
  aiConsultationCta: "Consulta con el Dr. BALOGAH y Reporte Certificado",

  catHome: "Inicio",
  catAbout: "Nosotros",
  catServices: "Servicios",
  catActivities: "Actividades",
  catPartners: "Socios",
  catAdmin: "Administración",
  catContacts: "Contactos",

  navInstitutions: "Instituciones y Facultades",
  navRoadmapD3: "Mapa de Carreras D3",
  navCareers: "2000 Carreras",
  navSaved: "Mis Favoritos",
  navTests: "Pruebas de CI y Evaluación",
  navCalculator: "Calculadora de Promedio",
  navCostOfLiving: "Costo de Vida",
  navAiCounselor: "Consulta Dr. BALOGAH y Reporte",
  navTestimonials: "Testimonios",
  navServices: "Espacio Cliente y Precios",
  navTransactions: "Mis Transacciones",
  navEvents: "Eventos y Agenda",
  navFaq: "Preguntas Frecuentes",
  navAds: "Publicidad",
  navAboutPresentation: "Presentación y Visión",
  navCertifications: "Formaciones y VAE",
  navPaidComms: "Videollamadas en Vivo",
  navDocAnalyzer: "Analizador IA",
  navExamPrep: "Exámenes y Concursos",
  navReferral: "Programa de Afiliados",
  navRecruitmentHub: "Reclutamiento RH",
  navWallet: "Mi Billetera",
  navContactsDetails: "Contacto Directo",
  navFaqSupport: "Soporte y FAQ",

  paidBadge: "Pagado",
  newBadge: "Nuevo",
  liveBadge: "En Directo",
  freeBadge: "Gratis",
  verifiedBadge: "Certificado",
  viewDetails: "Ver Detalles",
  applyNow: "Postular / Saber Más",
  contactAdvisor: "Contactar al Dr. BALOGAH",
  filterByRegion: "Filtrar por Región",
  filterBySector: "Filtrar por Sector",
  all: "Todos",
  reset: "Restablecer",
  close: "Cerrar",
  searchPlaceholder: "Buscar universidad, facultad, 2000 carreras, ciudad...",
  searchGlobal: "Búsqueda Global",
  back: "Volver",
  continueBtn: "Continuar",
  downloadPdf: "Descargar Reporte PDF",
  printReport: "Imprimir Reporte",
  calculate: "Calcular Elegibilidad",
  saveItem: "Guardar",
  removeItem: "Eliminar",
  share: "Compartir",
  copyLink: "Copiar Enlace",

  calloutTitle: "Orientación Académica y Universitaria — Recomendación del Dr. BALOGAH",
  calloutDesc: "Invitamos a estudiantes y postulantes a buscar instituciones y carreras en nuestro directorio y en Google, luego completar la calculadora para validar su elegibilidad.",
  calloutBtnInstitutions: "Buscar Instituciones y Carreras",
  calloutBtnCalc: "Abrir Calculadora de Promedio",

  secInstitutionsTitle: "Directorio de Universidades y Facultades",
  secInstitutionsSubtitle: "Explore la cartografía de centros de educación superior en África y el mundo.",
  secCareersTitle: "Repertorio de 2000 Carreras de Futuro",
  secCareersSubtitle: "Conozca profesiones emergentes, competencias requeridas y salarios orientativos.",
  secTestsTitle: "Pruebas Psicométricas y Evaluación de Competencias",
  secTestsSubtitle: "Evalúe su perfil RIASEC y habilidades cognitivas para su futuro profesional.",
  secCalculatorTitle: "Calculadora de Promedio y Elegibilidad",
  secCalculatorSubtitle: "Ingrese sus notas, compare 3 carreras y conozca los requisitos mínimos.",
  secServicesTitle: "Servicios Oficiales y Tarifas",
  secServicesSubtitle: "Asesoramiento personalizado, reportes oficiales y orientación académica experta.",
  secAboutTitle: "Acerca de OrientaAfrik y el Gabinete Dr. BALOGAH",
  secAboutSubtitle: "Consultoría internacional en orientación académica, laboral y certificaciones VAE.",
  secContactsTitle: "Contacto y Asistencia Directa",
  secContactsSubtitle: "Nuestro equipo de expertos está a su disposición para guiarle.",

  savedTitle: "Mis Favoritos Guardados",
  savedSubtitle: "Consulte y compare rápidamente sus universidades y carreras guardadas.",
  savedCount: "elemento(s) guardado(s)",
  noSavedTitle: "No tiene elementos en sus favoritos",
  noSavedDesc: "Explore las universidades o carreras y haga clic en guardar para verlos aquí.",
  filterAll: "Todos los Favoritos",
  filterInstitutions: "Instituciones",
  filterCareers: "2000 Carreras",
  clearAll: "Borrar Todo",
  removeFromFavorites: "Quitar de favoritos",
  saveToFavorites: "Añadir a favoritos",
};

const baseZH: TranslationSchema = {
  ...baseEN,
  advisorTitle: "BALOGAH Dibaataba 博士 • 教育与培训科学专家、学业与职业规划高级顾问。",
  currency: "货币：",
  language: "语言：",
  appTitle: "OrientaAfrik 升学与职业认证",
  appSubtitle: "学业与职业规划信息 • 经验认证 VAE • 职业技能评估 • 招聘咨询服务",
  aiConsultationCta: "BALOGAH 博士咨询与官方认证报告",

  catHome: "首页",
  catAbout: "关于我们",
  catServices: "服务项目",
  catActivities: "活动安排",
  catPartners: "合作伙伴",
  catAdmin: "管理中心",
  catContacts: "联系我们",

  navInstitutions: "院校与学院",
  navRoadmapD3: "D3 职业路径图",
  navCareers: "2000 热门职业",
  navSaved: "我的收藏",
  navTests: "智商与潜能测评",
  navCalculator: "成绩与录取计算器",
  navCostOfLiving: "留学生活成本",
  navAiCounselor: "BALOGAH 博士咨询与认证报告",
  navTestimonials: "成功学员案例",
  navServices: "客户中心与官方资费",
  navTransactions: "我的订单与发票",
  navEvents: "升学展与学术日程",
  navFaq: "常见问题解答",
  navAds: "合作广告专区",
  navAboutPresentation: "机构介绍与愿景",
  navCertifications: "职业培训与 VAE 认证",
  navPaidComms: "高清视频在线咨询",
  navDocAnalyzer: "AI 智能文档分析",
  navExamPrep: "考试与竞赛题库",
  navReferral: "推荐奖励计划",
  navRecruitmentHub: "人才招聘中心",
  navWallet: "我的电子钱包",
  navContactsDetails: "联系电话与地址",
  navFaqSupport: "帮助与客户支持",

  paidBadge: "已支付",
  newBadge: "最新",
  liveBadge: "高清直播",
  freeBadge: "免费",
  verifiedBadge: "官方认证",
  viewDetails: "查看详情",
  applyNow: "立即申请 / 了解更多",
  contactAdvisor: "联系 BALOGAH 博士",
  filterByRegion: "按地区筛选",
  filterBySector: "按行业领域筛选",
  all: "全部",
  reset: "重置",
  close: "关闭",
  searchPlaceholder: "搜索大学、专业、2000 职业、城市...",
  searchGlobal: "全局搜索",
  back: "返回",
  continueBtn: "继续",
  downloadPdf: "下载 PDF 官方报告",
  printReport: "打印报告",
  calculate: "测评录取资格",
  saveItem: "收藏",
  removeItem: "删除",
  share: "分享",
  copyLink: "复制链接",

  calloutTitle: "升学与职业规划建议 — BALOGAH 博士",
  calloutDesc: "建议所有学生及求职者在平台或 Google 深入调研目标院校与专业，并使用成绩计算器评估学术录取资格。",
  calloutBtnInstitutions: "查找高等院校与专业",
  calloutBtnCalc: "进入成绩计算器",

  secInstitutionsTitle: "高等院校与学院名录",
  secInstitutionsSubtitle: "探索非洲及全球高等学府全景地图、录取条件与学费概况。",
  secCareersTitle: "2000 热门职业与行业前景库",
  secCareersSubtitle: "了解未来发展趋势、核心技能要求、参考薪资与推荐学业路径。",
  secTestsTitle: "心理测评、RIASEC 兴趣量表与技能分析",
  secTestsSubtitle: "评估认知潜能与兴趣模型，精准匹配最适合您的大学专业。",
  secCalculatorTitle: "成绩计算器与专业录取评估",
  secCalculatorSubtitle: "输入高中阶段成绩，同时对比 3 所目标专业，查看单科最低分数门槛。",
  secServicesTitle: "官方咨询服务与收费标准",
  secServicesSubtitle: "一对一个性化升学指导、官方认证评估报告与专业就业咨询。",
  secAboutTitle: "关于 OrientaAfrik 与 BALOGAH 博士事务所",
  secAboutSubtitle: "国际化教育升学、职业生涯规划与人力资源专业咨询机构。",
  secContactsTitle: "联系 OrientaAfrik 专家团队",
  secContactsSubtitle: "我们的专家顾问竭诚为您提供升学与职业发展全程支持。",

  savedTitle: "我的收藏与保存清单",
  savedSubtitle: "快速查看、对比您收藏的大学、学院与职业信息。",
  savedCount: "个已收藏项目",
  noSavedTitle: "暂无收藏内容",
  noSavedDesc: "浏览院校或职业时，点击爱心 ❤️ 或书签 🔖 即可在此快速查阅。",
  filterAll: "全部收藏",
  filterInstitutions: "院校",
  filterCareers: "2000 职业",
  clearAll: "清空全部",
  removeFromFavorites: "移出收藏",
  saveToFavorites: "加入收藏",
};

const baseAR: TranslationSchema = {
  ...baseEN,
  advisorTitle: "الدكتور بالوغاه ديباتابا • خبير علوم التربية والتدريب، مستشار التوجيه الأكاديمي والمهني.",
  currency: "العملة:",
  language: "اللغة:",
  appTitle: "أورينتا أفريك والشهادات المعتمدة",
  appSubtitle: "الإعلام والتوجيه الأكاديمي والمهني • شهادات الخبرة VAE • تقييم المهارات • المساعدة في التوظيف",
  aiConsultationCta: "استشارة الدكتور بالوغاه والتقرير المعتمد",

  catHome: "الرئيسية",
  catAbout: "من نحن",
  catServices: "الخدمات",
  catActivities: "الأنشطة",
  catPartners: "الشركاء",
  catAdmin: "الإدارة",
  catContacts: "اتصل بنا",

  navInstitutions: "المؤسسات والجامعات",
  navRoadmapD3: "خريطة المهن التفاعلية D3",
  navCareers: "2000 مهنة واعدة",
  navSaved: "قائمتي المفضلة",
  navTests: "اختبارات الذكاء وتقييم المهارات",
  navCalculator: "حاسبة المعدل والقبول",
  navCostOfLiving: "تكاليف المعيشة للطلاب",
  navAiCounselor: "استشارة الدكتور بالوغاه والتقرير",
  navTestimonials: "تجارب وقصص النجاح",
  navServices: "فضاء العملاء والأسعار",
  navTransactions: "معاملاتي وإيصالاتي",
  navEvents: "الأجندة والفعاليات",
  navFaq: "الأسئلة الشائعة",
  navAds: "مساحة الإعلانات",
  navAboutPresentation: "التعريف والرؤية",
  navCertifications: "التدريب وشهادات VAE",
  navPaidComms: "استشارات فيديو مباشرة",
  navDocAnalyzer: "محلل الوثائق بالذكاء الاصطناعي",
  navExamPrep: "التحضير للامتحانات والمباريات",
  navReferral: "برنامج الإحالة والمكافآت",
  navRecruitmentHub: "منصة التوظيف",
  navWallet: "محفظتي الإلكترونية",
  navContactsDetails: "بيانات الاتصال",
  navFaqSupport: "الدعم والمساعدة",

  paidBadge: "مدفوع",
  newBadge: "جديد",
  liveBadge: "مباشر عالي الدقة",
  freeBadge: "مجاني",
  verifiedBadge: "معتمد رسميًا",
  viewDetails: "عرض التفاصيل",
  applyNow: "تقديم الطلب / المزيد",
  contactAdvisor: "تواصل مع د. بالوغاه",
  filterByRegion: "تصفية حسب المنطقة",
  filterBySector: "تصفية حسب القطاع",
  all: "الكل",
  reset: "إعادة ضبط",
  close: "إغلاق",
  searchPlaceholder: "ابحث عن جامعة، كلية، 2000 مهنة، مدينة أو تخصص...",
  searchGlobal: "بحث شامل",
  back: "رجوع",
  continueBtn: "متابعة",
  downloadPdf: "تحميل التقرير الرسمي PDF",
  printReport: "طباعة التقرير",
  calculate: "فحص الأهلية الأكاديمية",
  saveItem: "حفظ",
  removeItem: "حذف",
  share: "مشاركة",
  copyLink: "نسخ الرابط",

  calloutTitle: "توصية التوجيه الأكاديمي والجامعي من الدكتور بالوغاه",
  calloutDesc: "ندعو جميع الطلاب والمترشحين للبحث في دليل المؤسسات والشعب المستهدفة، ثم استخدام حاسبة المعدل لتقييم أهليتهم.",
  calloutBtnInstitutions: "استكشاف الجامعات والشعب",
  calloutBtnCalc: "فتح حاسبة المعدل",

  secInstitutionsTitle: "دليل الجامعات والكليات والمعاهد العليا",
  secInstitutionsSubtitle: "استكشف الخريطة الشاملة لمؤسسات التعليم العالي في إفريقيا والعالم مع شروط القبول.",
  secCareersTitle: "دليل 2000 مهنة واعدة لمستقبل مهني ناجح",
  secCareersSubtitle: "تعرف على مهن المستقبل، المهارات المطلوبة، الأجور التقديرية والمسارات الدراسية.",
  secTestsTitle: "الاختبارات النفسية وتقييم الكفاءات RIASEC",
  secTestsSubtitle: "اكتشف ميولك وقدراتك المعرفية لاختيار المسار الجامعي والمهني الأنسب لك.",
  secCalculatorTitle: "حاسبة المعدلات وفحص الأهلية للشعب",
  secCalculatorSubtitle: "أدخل درجاتك وقارن بين 3 تخصصات في نفس الوقت مع معرفة العتبات المطلوبة.",
  secServicesTitle: "خدمات الاستشارة والتعريفات الرسمية",
  secServicesSubtitle: "استشارات فردية متخصصة وتقارير رسمية معتمدة للتوجيه الأكاديمي والمهني.",
  secAboutTitle: "عن مكتب أورينتا أفريك والدكتور بالوغاه",
  secAboutSubtitle: "مكتب دولي رائد في التوجيه الأكاديمي والمهني وتصديق الخبرات وتنمية الموارد البشرية.",
  secContactsTitle: "تواصل مع مكتب أورينتا أفريك",
  secContactsSubtitle: "فريق خبرائنا في خدمتكم للإجابة على استفساراتكم ومرافقتكم نحو التميز.",

  savedTitle: "قائمة المفضلة والمحفوظات",
  savedSubtitle: "تصفح وقارن بسهولة الجامعات والتخصصات والمهن التي قمت بحفظها.",
  savedCount: "عنصر محفوظ",
  noSavedTitle: "لا توجد عناصر في المفضلة",
  noSavedDesc: "تصفح الجامعات أو المهن وانقر على أيقونة الحفظ ❤️ لتظهر هنا.",
  filterAll: "جميع المفضلة",
  filterInstitutions: "المؤسسات",
  filterCareers: "2000 مهنة",
  clearAll: "مسح الكل",
  removeFromFavorites: "إزالة من المفضلة",
  saveToFavorites: "إضافة للمفضلة",
};

const basePT: TranslationSchema = {
  ...baseEN,
  advisorTitle: "Dr. BALOGAH Dibaataba, Especialista em Ciências da Educação, Orientador Académico e Profissional.",
  currency: "Moeda:",
  language: "Idioma:",
  appTitle: "OrientaAfrik e Certificação",
  appSubtitle: "Informação e Orientação Académica e Profissional • Certificações VAE • Avaliação de Competências",
  aiConsultationCta: "Consulta Dr. BALOGAH e Relatório Certificado",

  catHome: "Início",
  catAbout: "Sobre Nós",
  catServices: "Serviços",
  catActivities: "Atividades",
  catPartners: "Parceiros",
  catAdmin: "Administração",
  catContacts: "Contatos",

  navInstitutions: "Instituições e Faculdades",
  navRoadmapD3: "Roteiro de Carreiras D3",
  navCareers: "2000 Carreiras",
  navSaved: "Meus Favoritos",
  navTests: "Testes de QI e Avaliação",
  navCalculator: "Calculadora de Médias",
  navCostOfLiving: "Custo de Vida",
  navAiCounselor: "Consulta Dr. BALOGAH",
  navTestimonials: "Depoimentos",
  navServices: "Espaço Cliente e Tarifas",
  navTransactions: "Minhas Transações",
  navEvents: "Eventos e Agenda",
  navFaq: "Perguntas Frequentes",
  navAds: "Espaço Publicitário",
  navAboutPresentation: "Apresentação e Visão",
  navCertifications: "Formações e VAE",
  navPaidComms: "Vídeo Chamadas ao Vivo",
  navDocAnalyzer: "Analisador IA",
  navExamPrep: "Exames e Concursos",
  navReferral: "Programa de Indicação",
  navRecruitmentHub: "Recrutamento RH",
  navWallet: "Minha Carteira",
  navContactsDetails: "Contatos e Endereço",
  navFaqSupport: "Suporte e FAQ",

  paidBadge: "Pago",
  newBadge: "Novo",
  liveBadge: "Direto HD",
  freeBadge: "Grátis",
  verifiedBadge: "Certificado",
  viewDetails: "Ver Detalhes",
  applyNow: "Candidatar-se",
  contactAdvisor: "Contatar Dr. BALOGAH",
  filterByRegion: "Filtrar por Região",
  filterBySector: "Filtrar por Setor",
  all: "Todos",
  reset: "Redefinir",
  close: "Fechar",
  searchPlaceholder: "Pesquisar universidade, faculdade, 2000 carreiras, cidade...",
  searchGlobal: "Pesquisa Global",
  back: "Voltar",
  continueBtn: "Continuar",
  downloadPdf: "Baixar Relatório PDF",
  printReport: "Imprimir Relatório",
  calculate: "Verificar Elegibilidade",
  saveItem: "Salvar",
  removeItem: "Remover",
  share: "Compartilhar",
  copyLink: "Copiar Link",

  calloutTitle: "Orientação Académica — Recomendação do Dr. BALOGAH",
  calloutDesc: "Convidamos todos os estudantes a pesquisar cursos e instituições e utilizar a calculadora para validar a elegibilidade.",
  calloutBtnInstitutions: "Explorar Instituições e Cursos",
  calloutBtnCalc: "Abrir Calculadora de Médias",

  secInstitutionsTitle: "Diretório de Universidades e Faculdades",
  secInstitutionsSubtitle: "Explore o mapa completo de instituições de ensino superior em África e no mundo.",
  secCareersTitle: "Repertório de 2000 Carreiras Promissoras",
  secCareersSubtitle: "Descubra as profissões do futuro, competências exigidas e salários de referência.",
  secTestsTitle: "Testes Psicométricos e Balanço de Competências",
  secTestsSubtitle: "Avalie o seu perfil de interesses e aptidões para escolher a carreira certa.",
  secCalculatorTitle: "Calculadora de Médias e Elegibilidade",
  secCalculatorSubtitle: "Insira as suas notas e compare 3 cursos simultaneamente.",
  secServicesTitle: "Serviços Oficiais e Tarifas",
  secServicesSubtitle: "Consultoria personalizada e relatórios oficiais certificados.",
  secAboutTitle: "Sobre a OrientaAfrik e o Gabinete Dr. BALOGAH",
  secAboutSubtitle: "Consultoria internacional em orientação académica e profissional.",
  secContactsTitle: "Contate a Equipa OrientaAfrik",
  secContactsSubtitle: "Os nossos consultores especialistas estão prontos para ajudar.",

  savedTitle: "Meus Favoritos Salvos",
  savedSubtitle: "Aceda e compare facilmente os seus cursos e universidades guardados.",
  savedCount: "item(ns) salvo(s)",
  noSavedTitle: "Nenhum item salvo",
  noSavedDesc: "Explore instituições ou carreiras e salve aqui os seus favoritos.",
  filterAll: "Todos os Favoritos",
  filterInstitutions: "Instituições",
  filterCareers: "2000 Carreiras",
  clearAll: "Limpar Tudo",
  removeFromFavorites: "Remover dos favoritos",
  saveToFavorites: "Salvar nos favoritos",
};

const baseDE: TranslationSchema = {
  ...baseEN,
  advisorTitle: "Dr. BALOGAH Dibaataba, Spezialist für Erziehungswissenschaften, Berufs- und Studienberater.",
  currency: "Währung:",
  language: "Sprache:",
  appTitle: "OrientaAfrik & Zertifizierung",
  appSubtitle: "Information & Studienberatung • Berufsberatung • VAE-Zertifizierungen • Kompetenzbilanz",
  aiConsultationCta: "Beratung Dr. BALOGAH & Zertifizierter Bericht",

  catHome: "Startseite",
  catAbout: "Über Uns",
  catServices: "Dienstleistungen",
  catActivities: "Aktivitäten",
  catPartners: "Partner",
  catAdmin: "Verwaltung",
  catContacts: "Kontakt",

  navInstitutions: "Hochschulen & Fakultäten",
  navRoadmapD3: "D3 Karriere-Roadmap",
  navCareers: "2000 Zukunftsberufe",
  navSaved: "Meine Favoriten",
  navTests: "IQ & Potenzialtests",
  navCalculator: "Notenrechner & Zulassung",
  navCostOfLiving: "Lebenshaltungskosten",
  navAiCounselor: "Dr. BALOGAH Beratung & Bericht",
  navTestimonials: "Erfolgsgeschichten",
  navServices: "Kundenbereich & Preise",
  navTransactions: "Meine Transaktionen",
  navEvents: "Veranstaltungskalender",
  navFaq: "Häufige Fragen (FAQ)",
  navAds: "Anzeigenbereich",
  navAboutPresentation: "Präsentation & Vision",
  navCertifications: "Weiterbildung & VAE",
  navPaidComms: "Live-Videogespräche",
  navDocAnalyzer: "KI-Dokumentenanalyse",
  navExamPrep: "Prüfungsvorbereitung",
  navReferral: "Empfehlungsprogramm",
  navRecruitmentHub: "Personalrekrutierung",
  navWallet: "Meine Geldbörse",
  navContactsDetails: "Kontaktdaten",
  navFaqSupport: "Support & FAQ",

  paidBadge: "Bezahlt",
  newBadge: "Neu",
  liveBadge: "Live HD",
  freeBadge: "Kostenlos",
  verifiedBadge: "Zertifiziert",
  viewDetails: "Details ansehen",
  applyNow: "Jetzt bewerben",
  contactAdvisor: "Dr. BALOGAH kontaktieren",
  filterByRegion: "Nach Region filtern",
  filterBySector: "Nach Branche filtern",
  all: "Alle",
  reset: "Zurücksetzen",
  close: "Schließen",
  searchPlaceholder: "Hochschule, Studiengang, 2000 Berufe suchen...",
  searchGlobal: "Globale Suche",
  back: "Zurück",
  continueBtn: "Weiter",
  downloadPdf: "PDF-Bericht herunterladen",
  printReport: "Bericht drucken",
  calculate: "Zulassung berechnen",
  saveItem: "Speichern",
  removeItem: "Entfernen",
  share: "Teilen",
  copyLink: "Link kopieren",

  calloutTitle: "Studien- & Berufsberatungsempfehlung von Dr. BALOGAH",
  calloutDesc: "Recherchieren Sie gezielt nach Studiengängen und Hochschulen und prüfen Sie Ihre Noten mit dem Notenrechner.",
  calloutBtnInstitutions: "Hochschulen & Studiengänge suchen",
  calloutBtnCalc: "Notenrechner öffnen",

  secInstitutionsTitle: "Verzeichnis der Hochschulen und Universitäten",
  secInstitutionsSubtitle: "Übersicht über Hochschulen in Afrika und weltweit mit Zulassungskriterien.",
  secCareersTitle: "2000 Zukunftsfähige Berufe",
  secCareersSubtitle: "Entdecken Sie Karrierechancen, Gehälter und empfohlene Ausbildungswege.",
  secTestsTitle: "Psychometrische Tests und Potenzialanalyse",
  secTestsSubtitle: "Finden Sie Ihre kognitiven Stärken und optimalen Studienrichtungen.",
  secCalculatorTitle: "Noten- und Zulassungsrechner",
  secCalculatorSubtitle: "Vergleichen Sie 3 Studiengänge und Mindestanforderungen gleichzeitig.",
  secServicesTitle: "Offizielle Dienstleistungen & Tarife",
  secServicesSubtitle: "Individuelle Studienberatung und zertifizierte Orientierungsberichte.",
  secAboutTitle: "Über OrientaAfrik & Dr. BALOGAH",
  secAboutSubtitle: "Internationale Studien- und Berufsberatung sowie HR-Expertise.",
  secContactsTitle: "Kontaktieren Sie uns",
  secContactsSubtitle: "Unser Beratungsteam steht Ihnen gerne zur Seite.",

  savedTitle: "Meine gespeicherten Favoriten",
  savedSubtitle: "Vergleichen und öffnen Sie schnell Ihre gemerkten Universitäten und Berufe.",
  savedCount: "gespeicherte(s) Element(e)",
  noSavedTitle: "Keine Favoriten vorhanden",
  noSavedDesc: "Klicken Sie bei Hochschulen oder Berufen auf das Lesezeichen, um sie hier zu speichern.",
  filterAll: "Alle Favoriten",
  filterInstitutions: "Hochschulen",
  filterCareers: "2000 Berufe",
  clearAll: "Alles löschen",
  removeFromFavorites: "Aus Favoriten entfernen",
  saveToFavorites: "Zu Favoriten hinzufügen",
};

const baseRU: TranslationSchema = {
  ...baseEN,
  advisorTitle: "Д-р БАЛОГА Дибаатаба, Специалист по педагогическим наукам, Эксперт по профориентации.",
  currency: "Валюта:",
  language: "Язык:",
  appTitle: "OrientaAfrik и Сертификация",
  appSubtitle: "Академическая и профессиональная ориентация • Сертификация VAE • Оценка компетенций • Рекрутинг",
  aiConsultationCta: "Консультация д-ра БАЛОГА и Сертифицированный отчет",

  catHome: "Главная",
  catAbout: "О нас",
  catServices: "Услуги",
  catActivities: "Мероприятия",
  catPartners: "Партнеры",
  catAdmin: "Администрация",
  catContacts: "Контакты",

  navInstitutions: "Вузы и Факультеты",
  navRoadmapD3: "D3 Карта Карьеры",
  navCareers: "2000 Профессий",
  navSaved: "Мои Закладки",
  navTests: "Тесты IQ и Профориентации",
  navCalculator: "Калькулятор Среднего Балла",
  navCostOfLiving: "Стоимость Жизни",
  navAiCounselor: "Консультация д-ра БАЛОГА",
  navTestimonials: "Отзывы и Истории",
  navServices: "Тарифы и Услуги",
  navTransactions: "Мои Транзакции",
  navEvents: "События и Ярмарки",
  navFaq: "Частые Вопросы (FAQ)",
  navAds: "Рекламный Раздел",
  navAboutPresentation: "Презентация и Миссия",
  navCertifications: "Обучение и VAE",
  navPaidComms: "Видеоконсультации Онлайн",
  navDocAnalyzer: "ИИ Анализ Документов",
  navExamPrep: "Подготовка к Экзаменам",
  navReferral: "Партнерская Программа",
  navRecruitmentHub: "HR Рекрутинг",
  navWallet: "Мой Кошелек",
  navContactsDetails: "Контакты и Адрес",
  navFaqSupport: "Поддержка и FAQ",

  paidBadge: "Оплачено",
  newBadge: "Новое",
  liveBadge: "Прямой Эфир",
  freeBadge: "Бесплатно",
  verifiedBadge: "Сертифицировано",
  viewDetails: "Подробнее",
  applyNow: "Подать заявку",
  contactAdvisor: "Связаться с д-ром БАЛОГА",
  filterByRegion: "Фильтр по Региону",
  filterBySector: "Фильтр по Отрасли",
  all: "Все",
  reset: "Сброс",
  close: "Закрыть",
  searchPlaceholder: "Поиск вуза, факультета, 2000 профессий, города...",
  searchGlobal: "Глобальный Поиск",
  back: "Назад",
  continueBtn: "Продолжить",
  downloadPdf: "Скачать Отчет PDF",
  printReport: "Печать Отчета",
  calculate: "Проверить Баллы",
  saveItem: "Сохранить",
  removeItem: "Удалить",
  share: "Поделиться",
  copyLink: "Копировать ссылку",

  calloutTitle: "Рекомендация по профориентации от д-ра БАЛОГА",
  calloutDesc: "Изучите каталог учебных заведений и используйте калькулятор для оценки шансов на поступление.",
  calloutBtnInstitutions: "Найти Вузы и Специальности",
  calloutBtnCalc: "Открыть Калькулятор Баллов",

  secInstitutionsTitle: "Каталог Университетов и Высших Школ",
  secInstitutionsSubtitle: "Полная карта высшего образования в Африке и мире с условиями поступления.",
  secCareersTitle: "Справочник 2000 Перспективных Профессий",
  secCareersSubtitle: "Востребованные специальности, уровень зарплат и необходимые навыки.",
  secTestsTitle: "Психометрические Тесты и Оценка Способностей",
  secTestsSubtitle: "Определите свои сильные стороны для выбора успешного карьерного пути.",
  secCalculatorTitle: "Калькулятор Среднего Балла и Шансов",
  secCalculatorSubtitle: "Сравните требования сразу для 3 выбранных специальностей.",
  secServicesTitle: "Официальные Услуги и Тарифы",
  secServicesSubtitle: "Индивидуальные консультации и сертифицированные отчеты по профориентации.",
  secAboutTitle: "О кабинете OrientaAfrik и д-ре БАЛОГА",
  secAboutSubtitle: "Международный центр профориентации, сертификации и кадрового консалтинга.",
  secContactsTitle: "Свяжитесь с Нами",
  secContactsSubtitle: "Наши специалисты всегда готовы ответить на ваши вопросы.",

  savedTitle: "Мои Сохраненные Закладки",
  savedSubtitle: "Быстрый доступ к сохраненным университетам и профессиям.",
  savedCount: "сохраненных элементов",
  noSavedTitle: "В закладках пока пусто",
  noSavedDesc: "Нажмите на сердечко ❤️ или значок закладки, чтобы сохранить элементы сюда.",
  filterAll: "Все Закладки",
  filterInstitutions: "Вузы",
  filterCareers: "2000 Профессий",
  clearAll: "Очистить все",
  removeFromFavorites: "Удалить из закладок",
  saveToFavorites: "Добавить в закладки",
};

const baseHI: TranslationSchema = {
  ...baseEN,
  advisorTitle: "डॉ. बाλογाह डिबाटाबा • शिक्षा विज्ञान विशेषज्ञ, शैक्षणिक एवं करियर परामर्शदाता।",
  currency: "मुद्रा:",
  language: "भाषा:",
  appTitle: "OrientaAfrik एवं प्रमाणन",
  appSubtitle: "शैक्षणिक एवं करियर मार्गदर्शन • VAE प्रमाणन • कौशल मूल्यांकन • भर्ती सहायता",
  aiConsultationCta: "डॉ. बाλογाह परामर्श एवं प्रमाणित रिपोर्ट",

  catHome: "होम",
  catAbout: "हमारे बारे में",
  catServices: "सेवाएं",
  catActivities: "गतिविधियां",
  catPartners: "भागीदार",
  catAdmin: "प्रशासन",
  catContacts: "संपर्क",

  navInstitutions: "विश्वविद्यालय एवं संकाय",
  navRoadmapD3: "D3 करियर रोडमैप",
  navCareers: "2000 करियर विकल्प",
  navSaved: "मेरे पसंदीदा",
  navTests: "आईक्यू एवं अभिरुचि टेस्ट",
  navCalculator: "जीपीए एवं पात्रता कैलकुलेटर",
  navCostOfLiving: "रहने का खर्च",
  navAiCounselor: "डॉ. बाλογाह परामर्श रिपोर्ट",
  navTestimonials: "सफलता की कहानियां",
  navServices: "ग्राहक कक्ष एवं शुल्क",
  navTransactions: "मेरे लेनदेन व रसीदें",
  navEvents: "कार्यक्रम एवं मेला",
  navFaq: "अक्सर पूछे जाने वाले प्रश्न",
  navAds: "विज्ञापन क्षेत्र",
  navAboutPresentation: "परिचय एवं दृष्टिकोण",
  navCertifications: "प्रशिक्षण एवं VAE",
  navPaidComms: "लाइव वीडियो परामर्श",
  navDocAnalyzer: "एआई दस्तावेज विश्लेषक",
  navExamPrep: "परीक्षा तैयारी",
  navReferral: "रेफरल कार्यक्रम",
  navRecruitmentHub: "एचआर भर्ती केंद्र",
  navWallet: "मेरा वॉलेट",
  navContactsDetails: "संपर्क विवरण",
  navFaqSupport: "सहायता एवं FAQ",

  paidBadge: "भुगतान किया गया",
  newBadge: "नया",
  liveBadge: "लाइव एचडी",
  freeBadge: "निःशुल्क",
  verifiedBadge: "प्रमाणित",
  viewDetails: "विवरण देखें",
  applyNow: "आवेदन करें / जानें",
  contactAdvisor: "डॉ. बाλογाह से संपर्क करें",
  filterByRegion: "क्षेत्र अनुसार फ़िल्टर",
  filterBySector: "उद्योग अनुसार फ़िल्टर",
  all: "सभी",
  reset: "रीसेट",
  close: "बंद करें",
  searchPlaceholder: "विश्वविद्यालय, कॉलेज, 2000 करियर, शहर खोजें...",
  searchGlobal: "वैश्विक खोज",
  back: "पीछे",
  continueBtn: "जारी रखें",
  downloadPdf: "पीडीएफ रिपोर्ट डाउनलोड करें",
  printReport: "रिपोर्ट प्रिंट करें",
  calculate: "पात्रता जांचें",
  saveItem: "सहेजें",
  removeItem: "हटाएं",
  share: "साझा करें",
  copyLink: "लिंक कॉपी करें",

  calloutTitle: "शैक्षणिक मार्गदर्शन सलाह — डॉ. बाλογाह",
  calloutDesc: "सभी छात्रों से अनुरोध है कि वे संस्थानों व पाठ्यक्रमों को खोजें और पात्रता जांचने के लिए कैलकुलेटर का उपयोग करें।",
  calloutBtnInstitutions: "संस्थान एवं पाठ्यक्रम खोजें",
  calloutBtnCalc: "कैलकुलेटर खोलें",

  secInstitutionsTitle: "विश्वविद्यालयों एवं उच्च शिक्षण संस्थानों की निर्देशिका",
  secInstitutionsSubtitle: "अफ्रीका एवं विश्व भर के विश्वविद्यालयों का व्यापक विवरण एवं प्रवेश नियम।",
  secCareersTitle: "2000 भविष्योन्मुखी करियर विकल्पों की सूची",
  secCareersSubtitle: "भविष्य के प्रमुख पेशे, आवश्यक कौशल, वेतन स्तर एवं अध्ययन मार्ग।",
  secTestsTitle: "मनोवैज्ञानिक परीक्षण एवं कौशल मूल्यांकन",
  secTestsSubtitle: "अपनी बौद्धिक क्षमताओं एवं रुचियों के अनुसार सर्वश्रेष्ठ संकाय का चयन करें।",
  secCalculatorTitle: "जीपीए कैलकुलेटर एवं संकाय पात्रता",
  secCalculatorSubtitle: "अपने अंक दर्ज करें और एक साथ 3 पाठ्यक्रमों की न्यूनतम आवश्यकताओं की तुलना करें।",
  secServicesTitle: "आधिकारिक सेवाएं एवं शुल्क",
  secServicesSubtitle: "व्यक्तिगत मार्गदर्शन, प्रमाणित रिपोर्ट एवं करियर काउंसलिंग।",
  secAboutTitle: "OrientaAfrik एवं डॉ. बाλογाह कार्यालय के बारे में",
  secAboutSubtitle: "अंतर्राष्ट्रीय करियर एवं शैक्षणिक मार्गदर्शन संस्था।",
  secContactsTitle: "हमसे संपर्क करें",
  secContactsSubtitle: "हमारी विशेषज्ञ टीम आपकी सहायता के लिए सदैव उपलब्ध है।",

  savedTitle: "मेरे सहेजे गए पसंदीदा",
  savedSubtitle: "अपने पसंदीदा विश्वविद्यालयों और करियर विकल्पों को तुरंत देखें और तुलना करें।",
  savedCount: "सहेजी गई वस्तुएं",
  noSavedTitle: "कोई सहेजा गया आइटम नहीं है",
  noSavedDesc: "संस्थानों या करियर को सहेजने के लिए बुकमार्क 🔖 पर क्लिक करें।",
  filterAll: "सभी पसंदीदा",
  filterInstitutions: "संस्थान",
  filterCareers: "2000 करियर",
  clearAll: "सभी साफ़ करें",
  removeFromFavorites: "पसंदीदा से हटाएं",
  saveToFavorites: "पसंदीदा में जोड़ें",
};

const baseSW: TranslationSchema = {
  ...baseEN,
  advisorTitle: "Dkt. BALOGAH Dibaataba, Mtaalamu wa Sayansi ya Elimu na Mafunzo, Mshauri wa Masomo na Kazi.",
  currency: "Sarafu:",
  language: "Lugha:",
  appTitle: "OrientaAfrik na Vyeti",
  appSubtitle: "Habari na Mwongozo wa Masomo na Kazi • Vyeti vya VAE • Tathmini ya Ujuzi • Msaada wa Ajira",
  aiConsultationCta: "Ushauri wa Dkt. BALOGAH na Ripoti Iliyoidhinishwa",

  catHome: "Mwanzo",
  catAbout: "Kuhusu Sisi",
  catServices: "Huduma",
  catActivities: "Shughuli",
  catPartners: "Washirika",
  catAdmin: "Utawala",
  catContacts: "Mawasiliano",

  navInstitutions: "Vyuo Vikuu na Vitivo",
  navRoadmapD3: "Ramani ya Kazi D3",
  navCareers: "Kazi 2000 za Baadaye",
  navSaved: "Vipendwa Vyangu",
  navTests: "Vipimo vya IQ na Tathmini",
  navCalculator: "Kikokotoo cha Wastani wa Alama",
  navCostOfLiving: "Gharama ya Maisha",
  navAiCounselor: "Ushauri wa Dkt. BALOGAH",
  navTestimonials: "Ushuhuda wa Mafanikio",
  navServices: "Eneo la Mteja na Bei Rasmi",
  navTransactions: "Miamala na Risiti Zangu",
  navEvents: "Matukio na Maonyesho",
  navFaq: "Maswali Yanayoulizwa Sana",
  navAds: "Matangazo",
  navAboutPresentation: "Utangulizi na Dira",
  navCertifications: "Mafunzo na VAE",
  navPaidComms: "Mikutano ya Video Moja kwa Moja",
  navDocAnalyzer: "Uchambuzi wa Nyaraka wa AI",
  navExamPrep: "Maandalizi ya Mitihani",
  navReferral: "Mpango wa Rufaa",
  navRecruitmentHub: "Kituo cha Ajira na HR",
  navWallet: "Pochi Yangu",
  navContactsDetails: "Mawasiliano na Anwani",
  navFaqSupport: "Msaada na Maswali",

  paidBadge: "Imelipwa",
  newBadge: "Mpya",
  liveBadge: "Mubashara HD",
  freeBadge: "Bure",
  verifiedBadge: "Imeidhinishwa",
  viewDetails: "Angalia Maelezo",
  applyNow: "Omba / Fahamu Zaidi",
  contactAdvisor: "Wasiliana na Dkt. BALOGAH",
  filterByRegion: "Chuja kwa Mkoa",
  filterBySector: "Chuja kwa Sekta",
  all: "Zote",
  reset: "Weka Upya",
  close: "Funga",
  searchPlaceholder: "Tafuta chuo kikuu, kitivo, kazi 2000, mji...",
  searchGlobal: "Utafutaji Mkuu",
  back: "Rudi",
  continueBtn: "Endelea",
  downloadPdf: "Pakua Ripoti ya PDF",
  printReport: "Chapa Ripoti",
  calculate: "Kagua Vigezo vya Kujiunga",
  saveItem: "Hifadhi",
  removeItem: "Ondoa",
  share: "Shiriki",
  copyLink: "Nakili Kiungo",

  calloutTitle: "Mwongozo wa Masomo — Ushauri kutoka kwa Dkt. BALOGAH",
  calloutDesc: "Tunawakaribisha wanafunzi na waombaji wote kutafiti vyuo na kozi, kisha kutumia kikokotoo cha alama kukagua sifa zao za kujiunga.",
  calloutBtnInstitutions: "Tafuta Vyuo na Kozi",
  calloutBtnCalc: "Fungua Kikokotoo cha Alama",

  secInstitutionsTitle: "Orodha ya Vyuo Vikuu na Taasisi za Elimu ya Juu",
  secInstitutionsSubtitle: "Chunguza ramani kamili ya vyuo vikuu barani Afrika na duniani kote pamoja na vigezo vya kujiunga.",
  secCareersTitle: "Kazi 2000 Zenye Fursa Nyingi za Ajira",
  secCareersSubtitle: "Gundua kazi za baadaye, ujuzi unaohitajika, mishahara na njia za masomo.",
  secTestsTitle: "Vipimo vya Saikolojia na Tathmini ya Uwezo",
  secTestsSubtitle: "Tathmini vipaji vyako na uchague kozi sahihi ya chuo kikuu inayokufaa.",
  secCalculatorTitle: "Kikokotoo cha Wastani na Vigezo vya Kujiunga",
  secCalculatorSubtitle: "Weka alama zako na ulinganishe kozi 3 kwa wakati mmoja.",
  secServicesTitle: "Huduma Rasmi na Bei",
  secServicesSubtitle: "Ushauri wa kibinafsi na ripoti zilizoidhinishwa za mwongozo wa masomo.",
  secAboutTitle: "Kuhusu OrientaAfrik na Ofisi ya Dkt. BALOGAH",
  secAboutSubtitle: "Taasisi ya kimataifa ya mwongozo wa masomo, kazi na vyeti vya VAE.",
  secContactsTitle: "Wasiliana Nasi",
  secContactsSubtitle: "Wataalamu wetu wako tayari kukusaidia katika safari yako ya masomo na kazi.",

  savedTitle: "Vipendwa Vyangu Vilivyohifadhiwa",
  savedSubtitle: "Angalia na ulinganishe kwa urahisi vyuo na kazi ulizohifadhi.",
  savedCount: "vitu vilivyohifadhiwa",
  noSavedTitle: "Hakuna vitu kwenye vipendwa",
  noSavedDesc: "Chunguza vyuo au kazi na ubofye alama ya alamisho ili kuhifadhi hapa.",
  filterAll: "Vipendwa Vyote",
  filterInstitutions: "Vyuo",
  filterCareers: "Kazi 2000",
  clearAll: "Futa Zote",
  removeFromFavorites: "Ondoa kwenye vipendwa",
  saveToFavorites: "Hifadhi kwenye vipendwa",
};

export const translations: Record<Language, TranslationSchema> = {
  FR: baseFR,
  EN: baseEN,
  ES: baseES,
  ZH: baseZH,
  AR: baseAR,
  PT: basePT,
  DE: baseDE,
  RU: baseRU,
  HI: baseHI,
  SW: baseSW,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
  translateText: (text: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("orientaafrik_selected_lang") as Language;
      if (saved && translations[saved]) {
        return saved;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    return "FR";
  });

  const isRTL = language === "AR";

  // Automatically update HTML tag attributes on language change
  useEffect(() => {
    try {
      localStorage.setItem("orientaafrik_selected_lang", language);
    } catch (e) {
      // Ignore
    }
    document.documentElement.lang = language.toLowerCase();
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [language, isRTL]);

  const t = translations[language] || baseFR;

  // Intelligent text translator for arbitrary UI phrases
  const translateText = (text: string): string => {
    if (!text || language === "FR") return text;

    // Search in current translation schema values
    const frKeys = Object.keys(baseFR) as (keyof TranslationSchema)[];
    for (const key of frKeys) {
      if (baseFR[key] === text) {
        return t[key] || text;
      }
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateText, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

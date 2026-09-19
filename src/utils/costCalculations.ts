/**
 * TARIFAIRE DE FORMATION PAR FILIÈRE ET COÛTS DE VIE PAR PAYS
 * ORIENTAAFRIK & CERTIFICATION - CABINET DR. BALOGAH DIBAATABA
 */

export interface ProgramTuitionEstimate {
  filiereCategory: string;
  publicTuitionMinFCFA: number;
  publicTuitionMaxFCFA: number;
  privateTuitionMinFCFA: number;
  privateTuitionMaxFCFA: number;
  displayPublicRangeFCFA: string;
  displayPrivateRangeFCFA: string;
  notes: string;
}

export interface CountryLivingCostEstimate {
  country: string;
  region: string;
  flagEmoji: string;
  monthlyMinFCFA: number;
  monthlyAvgFCFA: number;
  monthlyMaxFCFA: number;
  housingAvgFCFA: number;
  foodAvgFCFA: number;
  transportAvgFCFA: number;
  displayMonthlyRangeFCFA: string;
  currencyEquivalentEUR: string;
  currencyEquivalentUSD: string;
  livingTips: string;
}

/**
 * 1. Outil d'estimation des frais de scolarité selon la FILIÈRE choisie
 */
export function getProgramTuitionEstimate(programName: string): ProgramTuitionEstimate {
  const p = (programName || "").toLowerCase();

  if (p.includes("médecine") || p.includes("chirurgie") || p.includes("santé") || p.includes("pharmacie") || p.includes("odonto")) {
    return {
      filiereCategory: "Médecine, Pharmacie & Sciences de la Santé",
      publicTuitionMinFCFA: 75000,
      publicTuitionMaxFCFA: 250000,
      privateTuitionMinFCFA: 1200000,
      privateTuitionMaxFCFA: 3500000,
      displayPublicRangeFCFA: "75.000 à 250.000 FCFA / an (Public subventionné)",
      displayPrivateRangeFCFA: "1.200.000 à 3.500.000 FCFA / an (Privé spécialisé)",
      notes: "Matériel médical, blouses, stages cliniques et manuels anatomiques inclus ou en sus selon les facultés.",
    };
  }

  if (p.includes("informatique") || p.includes("intelligence artificielle") || p.includes("ia") || p.includes("cyber") || p.includes("data") || p.includes("logiciel") || p.includes("réseau")) {
    return {
      filiereCategory: "Génie Informatique, IA, Data & Cybersécurité",
      publicTuitionMinFCFA: 85000,
      publicTuitionMaxFCFA: 200000,
      privateTuitionMinFCFA: 650000,
      privateTuitionMaxFCFA: 1800000,
      displayPublicRangeFCFA: "85.000 à 200.000 FCFA / an (Écoles publiques / ENSI)",
      displayPrivateRangeFCFA: "650.000 à 1.800.000 FCFA / an (Instituts privés certifiés)",
      notes: "Prévoir l'achat d'un ordinateur portable performant (Intel i7/M2, 16Go RAM) pour les travaux pratiques et devops.",
    };
  }

  if (p.includes("génie civil") || p.includes("polytechnique") || p.includes("électrique") || p.includes("mécanique") || p.includes("mines") || p.includes("industrie") || p.includes("ingénieur")) {
    return {
      filiereCategory: "Ingénierie, Génie Civil & Sciences Industrielles",
      publicTuitionMinFCFA: 85000,
      publicTuitionMaxFCFA: 300000,
      privateTuitionMinFCFA: 750000,
      privateTuitionMaxFCFA: 2200000,
      displayPublicRangeFCFA: "85.000 à 300.000 FCFA / an (Universités / Écoles Polytechnique)",
      displayPrivateRangeFCFA: "750.000 à 2.200.000 FCFA / an (Écoles d'Ingénieurs privées)",
      notes: "Frais de laboratoire, tenues de chantier et logiciels de CAO/DAO (AutoCAD, REVIT) inclus selon les formations.",
    };
  }

  if (p.includes("droit") || p.includes("juridique") || p.includes("science politique") || p.includes("relations int")) {
    return {
      filiereCategory: "Droit, Sciences Politiques & Administration",
      publicTuitionMinFCFA: 50000,
      publicTuitionMaxFCFA: 120000,
      privateTuitionMinFCFA: 450000,
      privateTuitionMaxFCFA: 1200000,
      displayPublicRangeFCFA: "50.000 à 120.000 FCFA / an (Facultés de Droit)",
      displayPrivateRangeFCFA: "450.000 à 1.200.000 FCFA / an (Instituts de Droit & Diplomas)",
      notes: "Achats de codes juridiques annotés et accès aux bases de données juridiques en ligne.",
    };
  }

  if (p.includes("économie") || p.includes("finance") || p.includes("comptabilité") || p.includes("gestion") || p.includes("marketing") || p.includes("commerce") || p.includes("banque")) {
    return {
      filiereCategory: "Sciences Économiques, Finance, Gestion & Business",
      publicTuitionMinFCFA: 50000,
      publicTuitionMaxFCFA: 150000,
      privateTuitionMinFCFA: 500000,
      privateTuitionMaxFCFA: 1500000,
      displayPublicRangeFCFA: "50.000 à 150.000 FCFA / an (FASEG / Universités publiques)",
      displayPrivateRangeFCFA: "500.000 à 1.500.000 FCFA / an (Business Schools & Sup de Co)",
      notes: "Certifications comptables (OHADA, CIMA, CFA) et logiciels de gestion financière (Sage, SAP).",
    };
  }

  if (p.includes("agronomie") || p.includes("agro") || p.includes("environnement") || p.includes("eau") || p.includes("biologie")) {
    return {
      filiereCategory: "Agronomie, Agroalimentaire & Environnement",
      publicTuitionMinFCFA: 50000,
      publicTuitionMaxFCFA: 120000,
      privateTuitionMinFCFA: 450000,
      privateTuitionMaxFCFA: 1100000,
      displayPublicRangeFCFA: "50.000 à 120.000 FCFA / an (ESA / Facultés d'Agronomie)",
      displayPrivateRangeFCFA: "450.000 à 1.100.000 FCFA / an (Centres privés agro-pastoraux)",
      notes: "Sorties pédagogiques sur le terrain et fermes d'application incluses dans la formation.",
    };
  }

  if (p.includes("architecture") || p.includes("urbanisme") || p.includes("design")) {
    return {
      filiereCategory: "Architecture, Urbanisme & Design EAMAU",
      publicTuitionMinFCFA: 150000,
      publicTuitionMaxFCFA: 500000,
      privateTuitionMinFCFA: 1100000,
      privateTuitionMaxFCFA: 2800000,
      displayPublicRangeFCFA: "150.000 à 500.000 FCFA / an (EAMAU & Écoles régionales)",
      displayPrivateRangeFCFA: "1.100.000 à 2.800.000 FCFA / an (Écoles d'Architecture privées)",
      notes: "Table à dessin, matériel de maquette et stations de travail informatiques 3D nécessaires.",
    };
  }

  if (p.includes("aviation") || p.includes("pilote") || p.includes("aéronautique")) {
    return {
      filiereCategory: "Aviation Civile, Pilotage & Aéronautique",
      publicTuitionMinFCFA: 800000,
      publicTuitionMaxFCFA: 2500000,
      privateTuitionMinFCFA: 5000000,
      privateTuitionMaxFCFA: 18000000,
      displayPublicRangeFCFA: "800.000 à 2.500.000 FCFA / an (Académies d'État / EAMAC)",
      displayPrivateRangeFCFA: "5.000.000 à 18.000.000 FCFA / an (Écoles de pilotage privées)",
      notes: "Comprend les heures de vol sur simulateur et avions-écoles, la visite médicale de classe 1 et les licences de vol.",
    };
  }

  // Fallback Général (Lettres, Langues, Sciences Humaines, etc.)
  return {
    filiereCategory: "Sciences Humaines, Lettres, Langues & Arts",
    publicTuitionMinFCFA: 50000,
    publicTuitionMaxFCFA: 90000,
    privateTuitionMinFCFA: 350000,
    privateTuitionMaxFCFA: 850000,
    displayPublicRangeFCFA: "50.000 à 90.000 FCFA / an (Facultés publiques LMD)",
    displayPrivateRangeFCFA: "350.000 à 850.000 FCFA / an (Instituts privés de Lettres & Com)",
    notes: "Abonnement bibliothèque et polycopies d'études.",
  };
}

/**
 * 2. Outil d'estimation du coût de la vie mensuel selon le PAYS choisi
 */
export function getCountryLivingCostEstimate(countryName: string): CountryLivingCostEstimate {
  const c = (countryName || "").toLowerCase();

  if (c.includes("togo")) {
    return {
      country: "Togo",
      region: "Afrique de l'Ouest",
      flagEmoji: "🇹🇬",
      monthlyMinFCFA: 50000,
      monthlyAvgFCFA: 85000,
      monthlyMaxFCFA: 140000,
      housingAvgFCFA: 30000,
      foodAvgFCFA: 35000,
      transportAvgFCFA: 12000,
      displayMonthlyRangeFCFA: "50.000 FCFA à 85.000 FCFA / mois",
      currencyEquivalentEUR: "~ 76 € à 130 € / mois",
      currencyEquivalentUSD: "~ $82 à $140 / mois",
      livingTips: "Logement en Cité U (Université de Lomé/Kara) ou studio à proximité. Resto U très accessible (300-500 FCFA/repas).",
    };
  }

  if (c.includes("bénin") || c.includes("benin")) {
    return {
      country: "Bénin",
      region: "Afrique de l'Ouest",
      flagEmoji: "🇧🇯",
      monthlyMinFCFA: 55000,
      monthlyAvgFCFA: 90000,
      monthlyMaxFCFA: 150000,
      housingAvgFCFA: 35000,
      foodAvgFCFA: 38000,
      transportAvgFCFA: 13000,
      displayMonthlyRangeFCFA: "55.000 FCFA à 90.000 FCFA / mois",
      currencyEquivalentEUR: "~ 84 € à 137 € / mois",
      currencyEquivalentUSD: "~ $90 à $148 / mois",
      livingTips: "Chambres abordables à Abomey-Calavi (Campus UAC) ou Zogbadjè. Transports Zémidjan.",
    };
  }

  if (c.includes("côte d'ivoire") || c.includes("cote d'ivoire") || c.includes("abidjan")) {
    return {
      country: "Côte d'Ivoire",
      region: "Afrique de l'Ouest",
      flagEmoji: "🇨🇮",
      monthlyMinFCFA: 85000,
      monthlyAvgFCFA: 140000,
      monthlyMaxFCFA: 230000,
      housingAvgFCFA: 60000,
      foodAvgFCFA: 50000,
      transportAvgFCFA: 20000,
      displayMonthlyRangeFCFA: "85.000 FCFA à 140.000 FCFA / mois",
      currencyEquivalentEUR: "~ 130 € à 213 € / mois",
      currencyEquivalentUSD: "~ $140 à $230 / mois",
      livingTips: "SOTRA Carte Étudiante recommandée. Cités U de Cocody/Yopougon ou colocation.",
    };
  }

  if (c.includes("sénégal") || c.includes("senegal") || c.includes("dakar")) {
    return {
      country: "Sénégal",
      region: "Afrique de l'Ouest",
      flagEmoji: "🇸🇳",
      monthlyMinFCFA: 90000,
      monthlyAvgFCFA: 150000,
      monthlyMaxFCFA: 240000,
      housingAvgFCFA: 65000,
      foodAvgFCFA: 55000,
      transportAvgFCFA: 18000,
      displayMonthlyRangeFCFA: "90.000 FCFA à 150.000 FCFA / mois",
      currencyEquivalentEUR: "~ 137 € à 228 € / mois",
      currencyEquivalentUSD: "~ $148 à $246 / mois",
      livingTips: "Pavillon UCAD ou colocation à Fann/Fass/Médina. Repas subventionnés au COUD.",
    };
  }

  if (c.includes("burkina")) {
    return {
      country: "Burkina Faso",
      region: "Afrique de l'Ouest",
      flagEmoji: "🇧🇫",
      monthlyMinFCFA: 55000,
      monthlyAvgFCFA: 90000,
      monthlyMaxFCFA: 145000,
      housingAvgFCFA: 32000,
      foodAvgFCFA: 38000,
      transportAvgFCFA: 12000,
      displayMonthlyRangeFCFA: "55.000 FCFA à 90.000 FCFA / mois",
      currencyEquivalentEUR: "~ 84 € à 137 € / mois",
      currencyEquivalentUSD: "~ $90 à $148 / mois",
      livingTips: "Cités U de l'Université Joseph Ki-Zerbo (Ouagadougou) et transports à moto.",
    };
  }

  if (c.includes("maroc") || c.includes("rabat") || c.includes("casablanca")) {
    return {
      country: "Maroc",
      region: "Afrique du Nord",
      flagEmoji: "🇲🇦",
      monthlyMinFCFA: 150000,
      monthlyAvgFCFA: 260000,
      monthlyMaxFCFA: 400000,
      housingAvgFCFA: 110000,
      foodAvgFCFA: 80000,
      transportAvgFCFA: 25000,
      displayMonthlyRangeFCFA: "150.000 FCFA à 260.000 FCFA / mois (2.500 à 4.200 DH)",
      currencyEquivalentEUR: "~ 230 € à 400 € / mois",
      currencyEquivalentUSD: "~ $245 à $430 / mois",
      livingTips: "Résidences AMCI pour boursiers ou colocation meublée. Tramway abonnement étudiant.",
    };
  }

  if (c.includes("tunisie") || c.includes("tunis")) {
    return {
      country: "Tunisie",
      region: "Afrique du Nord",
      flagEmoji: "🇹🇳",
      monthlyMinFCFA: 140000,
      monthlyAvgFCFA: 240000,
      monthlyMaxFCFA: 380000,
      housingAvgFCFA: 100000,
      foodAvgFCFA: 75000,
      transportAvgFCFA: 22000,
      displayMonthlyRangeFCFA: "140.000 FCFA à 240.000 FCFA / mois (700 à 1.200 TND)",
      currencyEquivalentEUR: "~ 213 € à 365 € / mois",
      currencyEquivalentUSD: "~ $230 à $395 / mois",
      livingTips: "Foyers universitaires de l'OOUS ou appartements partagés à Tunis/Sousse.",
    };
  }

  if (c.includes("france") || c.includes("paris") || c.includes("lyon")) {
    return {
      country: "France",
      region: "Europe",
      flagEmoji: "🇫🇷",
      monthlyMinFCFA: 450000,
      monthlyAvgFCFA: 700000,
      monthlyMaxFCFA: 1100000,
      housingAvgFCFA: 400000,
      foodAvgFCFA: 160000,
      transportAvgFCFA: 25000,
      displayMonthlyRangeFCFA: "450.000 FCFA à 700.000 FCFA / mois (680 € à 1.070 €)",
      currencyEquivalentEUR: "680 € à 1.070 € / mois",
      currencyEquivalentUSD: "$740 à $1,150 / mois",
      livingTips: "Demande d'Aide Personnalisée au Logement (APL auprès de la CAF) + Resto U à 3,30 €.",
    };
  }

  if (c.includes("canada") || c.includes("montréal") || c.includes("quebec") || c.includes("québec")) {
    return {
      country: "Canada",
      region: "Amérique du Nord",
      flagEmoji: "🇨🇦",
      monthlyMinFCFA: 550000,
      monthlyAvgFCFA: 880000,
      monthlyMaxFCFA: 1400000,
      housingAvgFCFA: 480000,
      foodAvgFCFA: 220000,
      transportAvgFCFA: 30000,
      displayMonthlyRangeFCFA: "550.000 FCFA à 880.000 FCFA / mois (1.200 à 2.000 CAD)",
      currencyEquivalentEUR: "840 € à 1.340 € / mois",
      currencyEquivalentUSD: "$900 à $1,450 / mois",
      livingTips: "Inscription RAMQ gratuite + autorisation de travail 20h/semaine durant les cours.",
    };
  }

  if (c.includes("chine") || c.includes("china")) {
    return {
      country: "Chine",
      region: "Asie",
      flagEmoji: "🇨🇳",
      monthlyMinFCFA: 200000,
      monthlyAvgFCFA: 350000,
      monthlyMaxFCFA: 550000,
      housingAvgFCFA: 180000,
      foodAvgFCFA: 110000,
      transportAvgFCFA: 20000,
      displayMonthlyRangeFCFA: "200.000 FCFA à 350.000 FCFA / mois (2.200 à 4.000 RMB)",
      currencyEquivalentEUR: "300 € à 530 € / mois",
      currencyEquivalentUSD: "$330 à $570 / mois",
      livingTips: "Dortoirs universitaires réservés aux étudiants internationaux fortement subventionnés.",
    };
  }

  if (c.includes("cameroun") || c.includes("douala") || c.includes("yaoundé")) {
    return {
      country: "Cameroun",
      region: "Afrique Centrale",
      flagEmoji: "🇨🇲",
      monthlyMinFCFA: 65000,
      monthlyAvgFCFA: 110000,
      monthlyMaxFCFA: 180000,
      housingAvgFCFA: 45000,
      foodAvgFCFA: 42000,
      transportAvgFCFA: 15000,
      displayMonthlyRangeFCFA: "65.000 FCFA à 110.000 FCFA / mois",
      currencyEquivalentEUR: "~ 100 € à 168 € / mois",
      currencyEquivalentUSD: "~ $107 à $180 / mois",
      livingTips: "Mini-cités autour des campus de Yaoundé I (Ngoa-Ekellé) ou Douala (Ndongbong).",
    };
  }

  if (c.includes("gabon") || c.includes("libreville")) {
    return {
      country: "Gabon",
      region: "Afrique Centrale",
      flagEmoji: "🇬🇦",
      monthlyMinFCFA: 140000,
      monthlyAvgFCFA: 220000,
      monthlyMaxFCFA: 350000,
      housingAvgFCFA: 100000,
      foodAvgFCFA: 80000,
      transportAvgFCFA: 25000,
      displayMonthlyRangeFCFA: "140.000 FCFA à 220.000 FCFA / mois",
      currencyEquivalentEUR: "~ 213 € à 335 € / mois",
      currencyEquivalentUSD: "~ $230 à $360 / mois",
      livingTips: "Coût de la vie plus élevé en Afrique centrale. Logement partagé conseillé.",
    };
  }

  if (c.includes("rwanda") || c.includes("kigali")) {
    return {
      country: "Rwanda",
      region: "Afrique de l'Est",
      flagEmoji: "🇷🇼",
      monthlyMinFCFA: 110000,
      monthlyAvgFCFA: 180000,
      monthlyMaxFCFA: 280000,
      housingAvgFCFA: 80000,
      foodAvgFCFA: 60000,
      transportAvgFCFA: 20000,
      displayMonthlyRangeFCFA: "110.000 FCFA à 180.000 FCFA / mois",
      currencyEquivalentEUR: "~ 168 € à 275 € / mois",
      currencyEquivalentUSD: "~ $180 à $295 / mois",
      livingTips: "Ville de Kigali très sûre et très propre. Excellent réseau informatique.",
    };
  }

  // Fallback Afrique de l'Ouest / Continent
  return {
    country: countryName || "Pays d'Afrique",
    region: "Afrique",
    flagEmoji: "🌍",
    monthlyMinFCFA: 65000,
    monthlyAvgFCFA: 110000,
    monthlyMaxFCFA: 180000,
    housingAvgFCFA: 45000,
    foodAvgFCFA: 45000,
    transportAvgFCFA: 15000,
    displayMonthlyRangeFCFA: "65.000 FCFA à 110.000 FCFA / mois",
    currencyEquivalentEUR: "~ 100 € à 168 € / mois",
    currencyEquivalentUSD: "~ $107 à $180 / mois",
    livingTips: "Budget moyen estimé pour un étudiant universitaire dans les sous-régions d'Afrique.",
  };
}

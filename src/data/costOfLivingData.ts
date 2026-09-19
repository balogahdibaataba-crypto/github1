export interface CostCategory {
  title: string;
  lowFcfa: number;
  avgFcfa: number;
  highFcfa: number;
  description: string;
}

export interface CityCostOfLiving {
  id: string;
  cityName: string;
  country: string;
  region: "Afrique de l'Ouest" | "Afrique Centrale" | "Afrique du Nord" | "Europe" | "Amérique du Nord";
  flagEmoji: string;
  isPopularHub: boolean;
  
  // Costs in FCFA (XOF/XAF base)
  housing: CostCategory;
  food: CostCategory;
  transport: CostCategory;
  utilities: CostCategory;
  miscellaneous: CostCategory;

  // Average Tuition per year in FCFA
  publicTuitionYearFcfa: number;
  privateTuitionYearFcfa: number;

  // Total estimated monthly student budget (min & avg)
  minMonthlyBudgetFcfa: number;
  avgMonthlyBudgetFcfa: number;

  // Student lifestyle notes & Dr. BALOGAH's advice
  livingTips: string[];
  safetyRating: number; // out of 5
  studentJobOpportunity: "Faible" | "Moyenne" | "Bonne" | "Excellente";
}

export const CITIES_COST_DATA: CityCostOfLiving[] = [
  {
    id: "lome",
    cityName: "Lomé",
    country: "Togo",
    region: "Afrique de l'Ouest",
    flagEmoji: "🇹🇬",
    isPopularHub: true,
    housing: {
      title: "Logement Étudiant",
      lowFcfa: 15000, // Cité U / Chambre simple
      avgFcfa: 35000, // Studio sanitaire
      highFcfa: 65000, // Appartement 2 pièces
      description: "Chambre universitaire ou studio sanitaire meublé à proximité de l'Université de Lomé (Campus Nord / Sud).",
    },
    food: {
      title: "Restauration & Nourriture",
      lowFcfa: 25000, // Resto U + cuisine perso
      avgFcfa: 45000, // Resto U + cafétéria + marché
      highFcfa: 75000, // Cafétérias & restaurants
      description: "Repas au Restaurant Universitaire (300-500 FCFA/plat) et achats au marché local (Adawlato, Cacaveli).",
    },
    transport: {
      title: "Transport (Zémidjan / Bus)",
      lowFcfa: 8000, // Marche + Zémidjan occasionnel
      avgFcfa: 18000, // Zémidjan quotidien / Moto perso (essence)
      highFcfa: 30000, // Taxi-course & fréquentes navettes
      description: "Moto-taxi (Zémidjan 200-500 FCFA/trajet) ou essence pour moto personnelle.",
    },
    utilities: {
      title: "Internet & Factures (Eau/Électricité)",
      lowFcfa: 5000, // Forfait Mobile data
      avgFcfa: 12000, // Fibre Togocom/Moov + Électricité CEET
      highFcfa: 20000, // Fibre haut débit + Climatisation
      description: "Abonnement Forfait Data Mixx par Yass / Moov + recharge CEET CashPower.",
    },
    miscellaneous: {
      title: "Fournitures & Loisirs",
      lowFcfa: 7000,
      avgFcfa: 15000,
      highFcfa: 25000,
      description: "Polycopies de cours, fournitures académiques, sorties et loisirs de fin de semaine.",
    },
    publicTuitionYearFcfa: 50000, // Droits d'inscription LMD UL
    privateTuitionYearFcfa: 450000, // Écoles privées moyennes
    minMonthlyBudgetFcfa: 60000,
    avgMonthlyBudgetFcfa: 125000,
    livingTips: [
      "Privilégiez les logements dans les quartiers Tokoin, Nukafu ou Hedzranawoé pour réduire les trajets vers l'Université de Lomé.",
      "Le Restaurant Universitaire propose des repas équilibrés à des tarifs fortement subventionnés.",
      "Rechargez votre compteur CEET CashPower en début de mois pour éviter toute coupure en période de révision.",
    ],
    safetyRating: 4.5,
    studentJobOpportunity: "Moyenne",
  },
  {
    id: "kara",
    cityName: "Kara",
    country: "Togo",
    region: "Afrique de l'Ouest",
    flagEmoji: "🇹🇬",
    isPopularHub: true,
    housing: {
      title: "Logement Étudiant",
      lowFcfa: 10000,
      avgFcfa: 22000,
      highFcfa: 40000,
      description: "Chambres abordables autour du Campus de l'Université de Kara (Château, Pya, Dongoyo).",
    },
    food: {
      title: "Restauration & Nourriture",
      lowFcfa: 20000,
      avgFcfa: 35000,
      highFcfa: 55000,
      description: "Marché local de Kara à coût très accessible et Resto U subventionné.",
    },
    transport: {
      title: "Transport",
      lowFcfa: 5000,
      avgFcfa: 10000,
      highFcfa: 18000,
      description: "Déplacements courts, vélo ou moto-taxi très bon marché.",
    },
    utilities: {
      title: "Internet & Factures",
      lowFcfa: 4000,
      avgFcfa: 9000,
      highFcfa: 15000,
      description: "Connexion mobile 4G & frais d'énergie restreints.",
    },
    miscellaneous: {
      title: "Fournitures & Loisirs",
      lowFcfa: 5000,
      avgFcfa: 10000,
      highFcfa: 18000,
      description: "Documents d'études et loisirs sportifs universitaires.",
    },
    publicTuitionYearFcfa: 50000,
    privateTuitionYearFcfa: 350000,
    minMonthlyBudgetFcfa: 44000,
    avgMonthlyBudgetFcfa: 86000,
    livingTips: [
      "Kara offre l'un des coûts de vie étudiants les plus bas d'Afrique de l'Ouest.",
      "L'ambiance d'études y est particulièrement calme et propice à la concentration académique.",
    ],
    safetyRating: 4.8,
    studentJobOpportunity: "Faible",
  },
  {
    id: "cotonou",
    cityName: "Cotonou / Abomey-Calavi",
    country: "Bénin",
    region: "Afrique de l'Ouest",
    flagEmoji: "🇧🇯",
    isPopularHub: true,
    housing: {
      title: "Logement Étudiant",
      lowFcfa: 18000,
      avgFcfa: 40000,
      highFcfa: 80000,
      description: "Chambre à Calavi près de l'UAC ou studio meublé à Cotonou (Haie Vive, Akpakpa).",
    },
    food: {
      title: "Restauration & Nourriture",
      lowFcfa: 28000,
      avgFcfa: 50000,
      highFcfa: 85000,
      description: "Resto U de l'UAC, maquis locaux et marchés de Dantokpa ou Calavi.",
    },
    transport: {
      title: "Transport (Kéké-Zémidjan)",
      lowFcfa: 10000,
      avgFcfa: 22000,
      highFcfa: 40000,
      description: "Zémidjan et tricycles de transport en commun.",
    },
    utilities: {
      title: "Internet & Factures",
      lowFcfa: 6000,
      avgFcfa: 14000,
      highFcfa: 25000,
      description: "Internet fibre MTN/Moov Benin & factures SNEE/SBEE.",
    },
    miscellaneous: {
      title: "Fournitures & Loisirs",
      lowFcfa: 8000,
      avgFcfa: 18000,
      highFcfa: 30000,
      description: "Impressions de mémoires et vie culturelle béninoise.",
    },
    publicTuitionYearFcfa: 55000,
    privateTuitionYearFcfa: 500000,
    minMonthlyBudgetFcfa: 70000,
    avgMonthlyBudgetFcfa: 144000,
    livingTips: [
      "Pour les étudiants de l'UAC, privilégiez les logements à Zogbadjè ou Tankpè pour éviter les embouteillages de la route inter-états.",
      "L'UAC dispose d'infrastructures de recherche avancées (IFRI, ENEAM).",
    ],
    safetyRating: 4.4,
    studentJobOpportunity: "Bonne",
  },
  {
    id: "abidjan",
    cityName: "Abidjan",
    country: "Côte d'Ivoire",
    region: "Afrique de l'Ouest",
    flagEmoji: "🇨🇮",
    isPopularHub: true,
    housing: {
      title: "Logement Étudiant",
      lowFcfa: 35000, // Cité U Cocody
      avgFcfa: 85000, // Studio privé Abidjan
      highFcfa: 160000, // Appartement Cocody / Deux Plateaux
      description: "Cités universitaires (Cocody, Mermoz, Riviera) ou appartements en colocation.",
    },
    food: {
      title: "Restauration & Nourriture",
      lowFcfa: 35000,
      avgFcfa: 70000,
      highFcfa: 120000,
      description: "Resto U (Garba, Allocodrome) et marchés locaux d'Adjamé ou Cocody.",
    },
    transport: {
      title: "Transport (Gbaka, Wôrô-wôrô, SOTRA)",
      lowFcfa: 15000,
      avgFcfa: 30000,
      highFcfa: 60000,
      description: "Carte SOTRA étudiante ou taxis inter-communaux Wôrô-wôrô.",
    },
    utilities: {
      title: "Internet & Factures",
      lowFcfa: 8000,
      avgFcfa: 18000,
      highFcfa: 32000,
      description: "Fibre Orange CI / Wave data + Électricité CIE.",
    },
    miscellaneous: {
      title: "Fournitures & Loisirs",
      lowFcfa: 10000,
      avgFcfa: 25000,
      highFcfa: 45000,
      description: "Manuels académiques et sorties culturelles à Abidjan.",
    },
    publicTuitionYearFcfa: 60000,
    privateTuitionYearFcfa: 750000,
    minMonthlyBudgetFcfa: 103000,
    avgMonthlyBudgetFcfa: 228000,
    livingTips: [
      "Procurez-vous la carte de transport SOTRA Étudiant dés le début de l'année pour diviser par 3 votre budget transport.",
      "Abidjan offre d'excellentes opportunités de stages et petits boulots étudiants dans le numérique et le commerce.",
    ],
    safetyRating: 4.2,
    studentJobOpportunity: "Excellente",
  },
  {
    id: "dakar",
    cityName: "Dakar",
    country: "Sénégal",
    region: "Afrique de l'Ouest",
    flagEmoji: "🇸🇳",
    isPopularHub: true,
    housing: {
      title: "Logement Étudiant",
      lowFcfa: 30000, // Pavillon UCAD
      avgFcfa: 75000, // Colocation Fann / Fass / Medina
      highFcfa: 140000, // Studio Mermoz / Ouakam
      description: "Cité U de l'UCAD ou appartements partagés à Fass, Fann-Hock, Médina.",
    },
    food: {
      title: "Restauration & Nourriture",
      lowFcfa: 30000,
      avgFcfa: 65000,
      highFcfa: 110000,
      description: "Resto U du COUD (100 FCFA/repas) et gargottes locales (Thieboudienne).",
    },
    transport: {
      title: "Transport (Dakar Dem Dikk, Tata)",
      lowFcfa: 10000,
      avgFcfa: 25000,
      highFcfa: 50000,
      description: "Bus DDD abonnement étudiant ou bus Tata.",
    },
    utilities: {
      title: "Internet & Factures",
      lowFcfa: 7000,
      avgFcfa: 16000,
      highFcfa: 28000,
      description: "Orange Sénégal / Free + Senelec Woyofal.",
    },
    miscellaneous: {
      title: "Fournitures & Loisirs",
      lowFcfa: 10000,
      avgFcfa: 22000,
      highFcfa: 40000,
      description: "Fournitures pédagogiques et activités estudiantines.",
    },
    publicTuitionYearFcfa: 50000,
    privateTuitionYearFcfa: 800000,
    minMonthlyBudgetFcfa: 87000,
    avgMonthlyBudgetFcfa: 203000,
    livingTips: [
      "Les repas au COUD de l'UCAD sont très accessibles pour les boursiers.",
      "Recherchez votre colocation au moins 2 mois avant la rentrée académique d'octobre.",
    ],
    safetyRating: 4.5,
    studentJobOpportunity: "Bonne",
  },
  {
    id: "casablanca",
    cityName: "Casablanca / Rabat",
    country: "Maroc",
    region: "Afrique du Nord",
    flagEmoji: "🇲🇦",
    isPopularHub: true,
    housing: {
      title: "Logement Étudiant",
      lowFcfa: 50000, // Cité universitaire publique
      avgFcfa: 120000, // Studio meublé
      highFcfa: 220000, // Appartement centre-ville
      description: "Cités universitaires de l'AMCI / Cité U publique ou appartements en colocation.",
    },
    food: {
      title: "Restauration & Nourriture",
      lowFcfa: 40000,
      avgFcfa: 75000,
      highFcfa: 130000,
      description: "Cuisine personnelle + restaurants universitaires et souks.",
    },
    transport: {
      title: "Transport (Tramway & Bus)",
      lowFcfa: 12000,
      avgFcfa: 25000,
      highFcfa: 45000,
      description: "Abonnement mensuel Tramway de Casablanca / Rabat.",
    },
    utilities: {
      title: "Internet & Factures",
      lowFcfa: 10000,
      avgFcfa: 20000,
      highFcfa: 35000,
      description: "Fibre Maroc Telecom / Inwi / Orange + Électricité REDAL/LYDEC.",
    },
    miscellaneous: {
      title: "Fournitures & Loisirs",
      lowFcfa: 12000,
      avgFcfa: 25000,
      highFcfa: 50000,
      description: "Livres, assurance maladie obligatoire et déplacements de vacances.",
    },
    publicTuitionYearFcfa: 150000, // Pour étudiants étrangers boursiers/AMCI
    privateTuitionYearFcfa: 1800000, // Grandes écoles privées
    minMonthlyBudgetFcfa: 124000,
    avgMonthlyBudgetFcfa: 265000,
    livingTips: [
      "Les boursiers AMCI disposent de logements subventionnés en cité universitaire.",
      "Prévoyez un budget vêtement d'hiver car le climat marocain entre novembre et février est frais.",
    ],
    safetyRating: 4.6,
    studentJobOpportunity: "Moyenne",
  },
  {
    id: "paris",
    cityName: "Paris / Île-de-France",
    country: "France",
    region: "Europe",
    flagEmoji: "🇫🇷",
    isPopularHub: true,
    housing: {
      title: "Logement Étudiant (CROUS / Privé)",
      lowFcfa: 230000, // ~350 EUR Cité U CROUS
      avgFcfa: 420000, // ~640 EUR Studio Île-de-France après APL
      highFcfa: 650000, // ~1000 EUR Studio Paris intra-muros
      description: "Résidence CROUS (avec aide APL) ou studio privé meublé en banlieue parisienne.",
    },
    food: {
      title: "Restauration & Courses",
      lowFcfa: 95000, // ~145 EUR Resto U 1€ / 3.30€
      avgFcfa: 160000, // ~240 EUR
      highFcfa: 250000, // ~380 EUR
      description: "Restos U du CROUS (3,30 € le repas complet) et supermarchés discount (Lidl, ALDI).",
    },
    transport: {
      title: "Pass Navigo Imagine R",
      lowFcfa: 24000, // ~37 EUR/mois (Tarif étudiant annuel étalé)
      avgFcfa: 24000,
      highFcfa: 35000,
      description: "Forfait annuel Navigo Imagine R Étudiant (Toutes zones Île-de-France).",
    },
    utilities: {
      title: "Internet & Énergie",
      lowFcfa: 18000, // ~27 EUR (Mobile Free 5G + Électricité)
      avgFcfa: 35000, // ~53 EUR
      highFcfa: 60000,
      description: "Abonnement Mobile + Box Fibre + Électricité/Chauffage.",
    },
    miscellaneous: {
      title: "Assurances & Loisirs",
      lowFcfa: 30000,
      avgFcfa: 65000,
      highFcfa: 120000,
      description: "Mutuelle santé complémentaire, titre de séjour préfecture et fournitures.",
    },
    publicTuitionYearFcfa: 1800000, // ~2770 EUR Licence publique pour non-UE
    privateTuitionYearFcfa: 6500000, // ~10 000 EUR Grandes écoles de commerce/ingénieur
    minMonthlyBudgetFcfa: 397000, // ~600 EUR
    avgMonthlyBudgetFcfa: 704000, // ~1070 EUR
    livingTips: [
      "Faites impérativement votre demande APL (Aide Personnalisée au Logement) auprès de la CAF dès votre arrivée.",
      "Le travail étudiant est autorisé jusqu'à 60% de la durée annuelle légale du travail (964 heures/an).",
      "Le repas Resto U à 1€ ou 3,30€ représente la plus grande économie pour un étudiant africain en France.",
    ],
    safetyRating: 4.3,
    studentJobOpportunity: "Excellente",
  },
  {
    id: "montreal",
    cityName: "Montréal",
    country: "Canada",
    region: "Amérique du Nord",
    flagEmoji: "🇨🇦",
    isPopularHub: true,
    housing: {
      title: "Logement Étudiant (Résidence / Coloc)",
      lowFcfa: 260000, // ~600 CAD
      avgFcfa: 480000, // ~1100 CAD
      highFcfa: 750000, // ~1700 CAD
      description: "Chambre en colocation ou résidence universitaire UdeM / UQAM / McGill.",
    },
    food: {
      title: "Épicerie & Restauration",
      lowFcfa: 130000, // ~300 CAD
      avgFcfa: 220000, // ~500 CAD
      highFcfa: 350000,
      description: "Achats en supermarché (Super C, Maxi) et repas de campus.",
    },
    transport: {
      title: "Carte STM Étudiant",
      lowFcfa: 26000, // ~60 CAD
      avgFcfa: 26000,
      highFcfa: 35000,
      description: "Pass mensuel bus/métro STM tarif réduit étudiant.",
    },
    utilities: {
      title: "Chauffage & Télécoms",
      lowFcfa: 25000,
      avgFcfa: 50000, // Hydro-Québec + Cellulaire + Wi-Fi
      highFcfa: 90000,
      description: "Hydro-Québec (électricité & chauffage indispensable en hiver) + forfait mobile.",
    },
    miscellaneous: {
      title: "Équipement Hiver & Assurance",
      lowFcfa: 40000,
      avgFcfa: 80000,
      highFcfa: 150000,
      description: "Assurance maladie obligatoire universitaire (RAMQ / Desjardins) + vêtements d'hiver grand froid.",
    },
    publicTuitionYearFcfa: 9500000, // ~21 000 CAD / an universités québécoises
    privateTuitionYearFcfa: 16000000,
    minMonthlyBudgetFcfa: 481000, // ~1100 CAD
    avgMonthlyBudgetFcfa: 856000, // ~1950 CAD
    livingTips: [
      "Inscrivez-vous à la RAMQ dès votre arrivée pour bénéficier de la couverture santé gratuite grâce aux ententes internationales.",
      "Le permis d'études autorise le travail hors campus jusqu'à 20 heures par semaine durant les sessions de cours.",
      "Achetez vos manteaux et bottes d'hiver sur place à Montréal (normes -25°C).",
    ],
    safetyRating: 4.9,
    studentJobOpportunity: "Excellente",
  },
];

// Exchange Rates relative to 1 FCFA (XOF)
export const EXCHANGE_RATES = {
  FCFA: 1,
  EUR: 0.00152449, // 1 EUR = 655.957 FCFA
  USD: 0.00165,    // 1 USD ~ 606 FCFA
};

export const convertFromFcfa = (
  amountFcfa: number,
  targetCurrency: "FCFA" | "EUR" | "USD"
): string => {
  if (targetCurrency === "EUR") {
    const val = amountFcfa * EXCHANGE_RATES.EUR;
    return `${val.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €`;
  }
  if (targetCurrency === "USD") {
    const val = amountFcfa * EXCHANGE_RATES.USD;
    return `$${val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `${amountFcfa.toLocaleString("fr-FR")} FCFA`;
};

export type ReportBlockId =
  | "title_box"
  | "civil_identity"
  | "demand_synthesis"
  | "academic_analysis"
  | "academic_competencies"
  | "psychometrics_riasec"
  | "cognitive_mapping"
  | "official_decision"
  | "target_institutions"
  | "alternative_suggestions"
  | "labor_market"
  | "pedagogical_recommendations"
  | "action_plan"
  | "official_seal";

export type CustomizerMode = "auto" | "manual";

export interface ReportBlockMeta {
  id: ReportBlockId;
  label: string;
  shortLabel: string;
  pointNumber?: number;
  defaultPage: number;
  category: "civil" | "academic" | "psychometric" | "decision" | "strategic" | "legal";
  description: string;
}

export const DEFAULT_BLOCK_ORDER: ReportBlockId[] = [
  "title_box",
  "civil_identity",
  "demand_synthesis",
  "academic_analysis",
  "academic_competencies",
  "psychometrics_riasec",
  "cognitive_mapping",
  "official_decision",
  "target_institutions",
  "alternative_suggestions",
  "labor_market",
  "pedagogical_recommendations",
  "action_plan",
  "official_seal",
];

export const NUMBERED_POINT_BLOCK_IDS: ReportBlockId[] = [
  "demand_synthesis",
  "academic_analysis",
  "academic_competencies",
  "psychometrics_riasec",
  "cognitive_mapping",
  "official_decision",
  "target_institutions",
  "alternative_suggestions",
  "labor_market",
  "pedagogical_recommendations",
  "action_plan",
  "official_seal",
];

export function isNumberedBlock(blockId: ReportBlockId): boolean {
  return blockId !== "title_box" && blockId !== "civil_identity";
}

export const REPORT_BLOCK_DEFINITIONS: ReportBlockMeta[] = [
  {
    id: "title_box",
    label: "Bannière Officielle & Titre du Document",
    shortLabel: "Bannière & Titre",
    defaultPage: 1,
    category: "civil",
    description: "En-tête ministériel, titre certifié et référence du dossier",
  },
  {
    id: "civil_identity",
    label: "Identité Civile & Administrative du Requérant",
    shortLabel: "Identité Civile",
    defaultPage: 1,
    category: "civil",
    description: "Nom complet, date de naissance, série, établissement et statut",
  },
  {
    id: "demand_synthesis",
    label: "Point 1 : Synthèse de la Demande & Aspirations",
    shortLabel: "1. Demande & Vœux",
    pointNumber: 1,
    defaultPage: 1,
    category: "civil",
    description: "Vœux prioritaires, motivations exprimées et aspirations professionnelles",
  },
  {
    id: "academic_analysis",
    label: "Point 2 : Analyse Intégrale des Notes & Moyenne",
    shortLabel: "2. Relevé Notes",
    pointNumber: 2,
    defaultPage: 1,
    category: "academic",
    description: "Tableau exhaustif des matières, coefficients, notes et moyenne générale",
  },
  {
    id: "academic_competencies",
    label: "Point 3 : Pôles Disciplinaires & Compétences Clés",
    shortLabel: "3. Pôles Académiques",
    pointNumber: 3,
    defaultPage: 2,
    category: "academic",
    description: "Pôle scientifique, littéraire, langues et compétences transversales",
  },
  {
    id: "psychometrics_riasec",
    label: "Point 4 : Diagnostic Psychométrique RIASEC",
    shortLabel: "4. Profil RIASEC",
    pointNumber: 4,
    defaultPage: 2,
    category: "psychometric",
    description: "Profil dominant Holland RIASEC, radar des intérêts et traits comportementaux",
  },
  {
    id: "cognitive_mapping",
    label: "Point 5 : Cartographie Cognitive & Exécutive",
    shortLabel: "5. Aptitudes Cognitives",
    pointNumber: 5,
    defaultPage: 2,
    category: "psychometric",
    description: "Raisonnement logique, mémoire de travail, abstraction et vitesse d'assimilation",
  },
  {
    id: "official_decision",
    label: "Point 6 : Décision Officielle & Avis Conforme",
    shortLabel: "6. Décision Officielle",
    pointNumber: 6,
    defaultPage: 2,
    category: "decision",
    description: "Filière homologuée, mention d'orientation et avis de conformité du directoire",
  },
  {
    id: "target_institutions",
    label: "Point 7 : Établissements Publics & Cibles",
    shortLabel: "7. Établissements",
    pointNumber: 7,
    defaultPage: 3,
    category: "strategic",
    description: "Universités publiques, grandes écoles, instituts partenaires et critères d'admission",
  },
  {
    id: "alternative_suggestions",
    label: "Point 8 : Débouchés & Filières Alternatives",
    shortLabel: "8. Débouchés Métiers",
    pointNumber: 8,
    defaultPage: 3,
    category: "strategic",
    description: "Options de réorientation de secours et passerelles académiques certifiées",
  },
  {
    id: "labor_market",
    label: "Point 9 : Observatoire de l'Emploi CEDEAO",
    shortLabel: "9. Marché Emploi",
    pointNumber: 9,
    defaultPage: 3,
    category: "strategic",
    description: "Taux d'insertion, dynamisme sectoriel et perspectives d'embauche en Afrique de l'Ouest",
  },
  {
    id: "pedagogical_recommendations",
    label: "Point 10 : Recommandations Pédagogiques",
    shortLabel: "10. Recommandations",
    pointNumber: 10,
    defaultPage: 3,
    category: "strategic",
    description: "Conseils méthodologiques, renforcement académique et coaching d'excellence",
  },
  {
    id: "action_plan",
    label: "Point 11 : Plan d'Action Stratégique & Calendrier",
    shortLabel: "11. Plan d'Action",
    pointNumber: 11,
    defaultPage: 3,
    category: "strategic",
    description: "Chronogramme des démarches, dates clés d'inscription et étapes préparatoires",
  },
  {
    id: "official_seal",
    label: "Point 12 : Sceau, Empreinte & QR Code Biométrique",
    shortLabel: "12. Sceau & QR Code",
    pointNumber: 12,
    defaultPage: 3,
    category: "legal",
    description: "Signature du Dr BALOGAH, cachet humide officiel, QR Code et clé cryptographique",
  },
];

export type BlockPageAssignment = Record<ReportBlockId, number>;
export type BlockFontScales = Record<ReportBlockId, number>;
export type DynamicPointNumberMap = Record<ReportBlockId, number>;

/**
 * Computes dynamic point numbers for all blocks according to their sequential visual appearance
 * across pages (Page 1 -> Page N) and within each page based on the current block order.
 */
export function calculateDynamicPointNumbers(
  totalPages: number,
  blockAssignment: BlockPageAssignment,
  blockOrder: ReportBlockId[] = DEFAULT_BLOCK_ORDER
): DynamicPointNumberMap {
  const pointNumbers: Partial<DynamicPointNumberMap> = {};
  let currentNum = 1;

  for (let p = 1; p <= totalPages; p++) {
    const pageBlocks = blockOrder.filter((id) => blockAssignment[id] === p);
    for (const blockId of pageBlocks) {
      if (isNumberedBlock(blockId)) {
        pointNumbers[blockId] = currentNum;
        currentNum++;
      }
    }
  }

  // Fallback for any unassigned numbered blocks
  for (const blockId of blockOrder) {
    if (pointNumbers[blockId] === undefined && isNumberedBlock(blockId)) {
      pointNumbers[blockId] = currentNum++;
    }
  }

  return pointNumbers as DynamicPointNumberMap;
}

/**
 * Returns dynamic localized display strings for a given block reflecting its current dynamic point number.
 */
export function getBlockDisplayInfo(
  blockId: ReportBlockId,
  dynamicPointNumber?: number
): { label: string; shortLabel: string; baseTitle: string; category: string; description: string } {
  const meta = REPORT_BLOCK_DEFINITIONS.find((b) => b.id === blockId);
  const baseMap: Record<ReportBlockId, { title: string; short: string }> = {
    title_box: {
      title: "Bannière Officielle & Titre du Document",
      short: "Bannière & Titre",
    },
    civil_identity: {
      title: "Identité Civile & Administrative du Requérant",
      short: "Identité Civile",
    },
    demand_synthesis: {
      title: "Synthèse de la Demande & Aspirations",
      short: "Demande & Vœux",
    },
    academic_analysis: {
      title: "Analyse Intégrale des Notes & Moyenne",
      short: "Relevé Notes",
    },
    academic_competencies: {
      title: "Pôles Disciplinaires & Compétences Clés",
      short: "Pôles Académiques",
    },
    psychometrics_riasec: {
      title: "Diagnostic Psychométrique RIASEC",
      short: "Profil RIASEC",
    },
    cognitive_mapping: {
      title: "Cartographie Cognitive & Exécutive",
      short: "Aptitudes Cognitives",
    },
    official_decision: {
      title: "Décision Officielle & Avis Conforme",
      short: "Décision Officielle",
    },
    target_institutions: {
      title: "Établissements Publics & Cibles",
      short: "Établissements",
    },
    alternative_suggestions: {
      title: "Débouchés & Filières Alternatives",
      short: "Débouchés Métiers",
    },
    labor_market: {
      title: "Observatoire de l'Emploi CEDEAO",
      short: "Marché Emploi",
    },
    pedagogical_recommendations: {
      title: "Recommandations Pédagogiques",
      short: "Recommandations",
    },
    action_plan: {
      title: "Plan d'Action Stratégique & Calendrier",
      short: "Plan d'Action",
    },
    official_seal: {
      title: "Sceau, Empreinte & QR Code Biométrique",
      short: "Sceau & QR Code",
    },
  };

  const info = baseMap[blockId] || { title: blockId, short: blockId };
  const category = meta?.category || "strategic";
  const description = meta?.description || "";

  if (isNumberedBlock(blockId) && dynamicPointNumber !== undefined) {
    return {
      label: `Point ${dynamicPointNumber} : ${info.title}`,
      shortLabel: `${dynamicPointNumber}. ${info.short}`,
      baseTitle: info.title,
      category,
      description,
    };
  }

  return {
    label: info.title,
    shortLabel: info.short,
    baseTitle: info.title,
    category,
    description,
  };
}

/**
 * Re-orders a block within the page list or moves it to a target page at a specific position.
 */
export function reorderBlockInList(
  currentOrder: ReportBlockId[],
  currentAssignment: BlockPageAssignment,
  blockId: ReportBlockId,
  targetPage: number,
  targetPlacement?: { relativeToBlockId: ReportBlockId; position: "before" | "after" }
): { newOrder: ReportBlockId[]; newAssignment: BlockPageAssignment } {
  const newAssignment = { ...currentAssignment, [blockId]: targetPage };
  const filteredOrder = currentOrder.filter((id) => id !== blockId);

  if (targetPlacement) {
    const targetIdx = filteredOrder.indexOf(targetPlacement.relativeToBlockId);
    if (targetIdx !== -1) {
      const insertIdx = targetPlacement.position === "before" ? targetIdx : targetIdx + 1;
      const newOrder = [...filteredOrder];
      newOrder.splice(insertIdx, 0, blockId);
      return { newOrder, newAssignment };
    }
  }

  // If moving across pages without specific placement, group it nicely into the target page section
  const pageBlocks = filteredOrder.filter((id) => newAssignment[id] === targetPage);
  if (pageBlocks.length > 0) {
    const lastBlockOfPage = pageBlocks[pageBlocks.length - 1];
    const insertIdx = filteredOrder.indexOf(lastBlockOfPage) + 1;
    const newOrder = [...filteredOrder];
    newOrder.splice(insertIdx, 0, blockId);
    return { newOrder, newAssignment };
  }

  // Target page was empty, insert at relative page index
  let insertIdx = 0;
  for (let i = 0; i < filteredOrder.length; i++) {
    const assigned = newAssignment[filteredOrder[i]];
    if (assigned < targetPage) {
      insertIdx = i + 1;
    }
  }
  const newOrder = [...filteredOrder];
  newOrder.splice(insertIdx, 0, blockId);
  return { newOrder, newAssignment };
}

/**
 * Swaps a block up or down within its current page.
 */
export function moveBlockWithinPage(
  currentOrder: ReportBlockId[],
  currentAssignment: BlockPageAssignment,
  blockId: ReportBlockId,
  direction: "up" | "down"
): ReportBlockId[] {
  const page = currentAssignment[blockId];
  const pageBlocks = currentOrder.filter((id) => currentAssignment[id] === page);
  const idxInPage = pageBlocks.indexOf(blockId);

  if (direction === "up" && idxInPage > 0) {
    const swapTargetId = pageBlocks[idxInPage - 1];
    const globalIdxA = currentOrder.indexOf(blockId);
    const globalIdxB = currentOrder.indexOf(swapTargetId);
    const newOrder = [...currentOrder];
    newOrder[globalIdxA] = swapTargetId;
    newOrder[globalIdxB] = blockId;
    return newOrder;
  }

  if (direction === "down" && idxInPage < pageBlocks.length - 1) {
    const swapTargetId = pageBlocks[idxInPage + 1];
    const globalIdxA = currentOrder.indexOf(blockId);
    const globalIdxB = currentOrder.indexOf(swapTargetId);
    const newOrder = [...currentOrder];
    newOrder[globalIdxA] = swapTargetId;
    newOrder[globalIdxB] = blockId;
    return newOrder;
  }

  return currentOrder;
}

/**
 * Initializes font scale for every block (defaulting to 100%)
 */
export function getDefaultBlockFontScales(defaultScale: number = 100): BlockFontScales {
  const scales: Partial<BlockFontScales> = {};
  REPORT_BLOCK_DEFINITIONS.forEach((block) => {
    scales[block.id] = defaultScale;
  });
  return scales as BlockFontScales;
}

/**
 * Returns default block distribution given a target page count (1 to 10)
 */
export function getDefaultBlockAssignment(pageCount: number): BlockPageAssignment {
  const safeCount = Math.max(1, Math.min(10, pageCount));

  if (safeCount === 1) {
    return {
      title_box: 1,
      civil_identity: 1,
      demand_synthesis: 1,
      academic_analysis: 1,
      academic_competencies: 1,
      psychometrics_riasec: 1,
      cognitive_mapping: 1,
      official_decision: 1,
      target_institutions: 1,
      alternative_suggestions: 1,
      labor_market: 1,
      pedagogical_recommendations: 1,
      action_plan: 1,
      official_seal: 1,
    };
  }

  if (safeCount === 2) {
    return {
      title_box: 1,
      civil_identity: 1,
      demand_synthesis: 1,
      academic_analysis: 1,
      academic_competencies: 1,
      psychometrics_riasec: 2,
      cognitive_mapping: 2,
      official_decision: 2,
      target_institutions: 2,
      alternative_suggestions: 2,
      labor_market: 2,
      pedagogical_recommendations: 2,
      action_plan: 2,
      official_seal: 2,
    };
  }

  if (safeCount === 3) {
    return {
      title_box: 1,
      civil_identity: 1,
      demand_synthesis: 1,
      academic_analysis: 1,
      academic_competencies: 2,
      psychometrics_riasec: 2,
      cognitive_mapping: 2,
      official_decision: 2,
      target_institutions: 3,
      alternative_suggestions: 3,
      labor_market: 3,
      pedagogical_recommendations: 3,
      action_plan: 3,
      official_seal: 3,
    };
  }

  if (safeCount === 4) {
    return {
      title_box: 1,
      civil_identity: 1,
      demand_synthesis: 1,
      academic_analysis: 2,
      academic_competencies: 2,
      psychometrics_riasec: 3,
      cognitive_mapping: 3,
      official_decision: 3,
      target_institutions: 4,
      alternative_suggestions: 4,
      labor_market: 4,
      pedagogical_recommendations: 4,
      action_plan: 4,
      official_seal: 4,
    };
  }

  if (safeCount === 5) {
    return {
      title_box: 1,
      civil_identity: 1,
      demand_synthesis: 1,
      academic_analysis: 2,
      academic_competencies: 2,
      psychometrics_riasec: 3,
      cognitive_mapping: 3,
      official_decision: 4,
      target_institutions: 4,
      alternative_suggestions: 4,
      labor_market: 5,
      pedagogical_recommendations: 5,
      action_plan: 5,
      official_seal: 5,
    };
  }

  if (safeCount === 6) {
    return {
      title_box: 1,
      civil_identity: 1,
      demand_synthesis: 1,
      academic_analysis: 2,
      academic_competencies: 2,
      psychometrics_riasec: 3,
      cognitive_mapping: 3,
      official_decision: 4,
      target_institutions: 4,
      alternative_suggestions: 5,
      labor_market: 5,
      pedagogical_recommendations: 6,
      action_plan: 6,
      official_seal: 6,
    };
  }

  if (safeCount === 7) {
    return {
      title_box: 1,
      civil_identity: 1,
      demand_synthesis: 1,
      academic_analysis: 2,
      academic_competencies: 2,
      psychometrics_riasec: 3,
      cognitive_mapping: 4,
      official_decision: 4,
      target_institutions: 5,
      alternative_suggestions: 5,
      labor_market: 6,
      pedagogical_recommendations: 6,
      action_plan: 7,
      official_seal: 7,
    };
  }

  if (safeCount === 8) {
    return {
      title_box: 1,
      civil_identity: 1,
      demand_synthesis: 1,
      academic_analysis: 2,
      academic_competencies: 3,
      psychometrics_riasec: 4,
      cognitive_mapping: 5,
      official_decision: 5,
      target_institutions: 6,
      alternative_suggestions: 6,
      labor_market: 7,
      pedagogical_recommendations: 7,
      action_plan: 8,
      official_seal: 8,
    };
  }

  if (safeCount === 9) {
    return {
      title_box: 1,
      civil_identity: 1,
      demand_synthesis: 1,
      academic_analysis: 2,
      academic_competencies: 3,
      psychometrics_riasec: 4,
      cognitive_mapping: 5,
      official_decision: 6,
      target_institutions: 6,
      alternative_suggestions: 7,
      labor_market: 8,
      pedagogical_recommendations: 8,
      action_plan: 9,
      official_seal: 9,
    };
  }

  // 10 pages
  return {
    title_box: 1,
    civil_identity: 1,
    demand_synthesis: 1,
    academic_analysis: 2,
    academic_competencies: 3,
    psychometrics_riasec: 4,
    cognitive_mapping: 5,
    official_decision: 6,
    target_institutions: 7,
    alternative_suggestions: 8,
    labor_market: 8,
    pedagogical_recommendations: 9,
    action_plan: 10,
    official_seal: 10,
  };
}

export interface LayoutSnapshot {
  blockAssignment: BlockPageAssignment;
  blockOrder: ReportBlockId[];
  blockFontScales: BlockFontScales;
  timestamp?: number;
  description?: string;
}

export type DocumentCharacterType = "synthetique" | "standard" | "developpe" | "exhaustif";

export type DocumentOptionId =
  | "synthetique_1p"
  | "synthetique_2p"
  | "standard_3p"
  | "developpe_4p"
  | "developpe_5p"
  | "exhaustif_6p"
  | "exhaustif_8p"
  | "exhaustif_10p";

export interface DocumentOptionMeta {
  id: DocumentOptionId;
  character: DocumentCharacterType;
  label: string;
  shortLabel: string;
  badge: string;
  pageCount: number;
  description: string;
  detailLevelDescription: string;
  recommendedFor: string;
  iconType: "zap" | "fileText" | "award" | "layers" | "bookOpen";
}

export const DOCUMENT_OPTIONS_LIST: DocumentOptionMeta[] = [
  {
    id: "synthetique_1p",
    character: "synthetique",
    label: "Synthétique Express (1 Page A4)",
    shortLabel: "1P Synthétique",
    badge: "⚡ Synthétique Express",
    pageCount: 1,
    description: "Fiche résumé dense et condensée avec les points clés et l'avis officiel direct.",
    detailLevelDescription: "Condensation maximale des données, vue d'ensemble instantanée et décision finale.",
    recommendedFor: "Consultation rapide, transmission directe aux jurys ou affichage résumé.",
    iconType: "zap",
  },
  {
    id: "synthetique_2p",
    character: "synthetique",
    label: "Synthétique Exécutif (2 Pages A4)",
    shortLabel: "2P Exécutif",
    badge: "📑 Synthétique Exécutif",
    pageCount: 2,
    description: "Synthèse décisionnelle équilibrée sur 2 pages (idéal pour tirage 2-en-1 recto-verso).",
    detailLevelDescription: "Répartition claire en 2 volets : Dossier scolaire & Diagnostic complet.",
    recommendedFor: "Impression recto-verso ou mode livret 2 pages par feuille A4.",
    iconType: "fileText",
  },
  {
    id: "standard_3p",
    character: "standard",
    label: "Standard Homologué (3 Pages A4 - Référence)",
    shortLabel: "3P Standard Officiel",
    badge: "📜 Standard Officiel (3P)",
    pageCount: 3,
    description: "Format certifié ministériel de référence équilibrant l'ensemble des 12 points d'expertise.",
    detailLevelDescription: "Déploiement complet des 12 points : Identité, Notes, RIASEC, Décision, Marché & Sceau.",
    recommendedFor: "Dossier d'orientation certifié officiel pour universités et grandes écoles.",
    iconType: "award",
  },
  {
    id: "developpe_4p",
    character: "developpe",
    label: "Développé & Approfondi (4 Pages A4)",
    shortLabel: "4P Développé",
    badge: "🔍 Développé (4P)",
    pageCount: 4,
    description: "Analyse approfondie avec aération visuelle et développement des compétences clés.",
    detailLevelDescription: "Espace généreux pour les analyses de compétences et les filières cibles.",
    recommendedFor: "Bilans d'orientation approfondis et entretiens personnalisés.",
    iconType: "layers",
  },
  {
    id: "developpe_5p",
    character: "developpe",
    label: "Développé Stratégique (5 Pages A4)",
    shortLabel: "5P Développé+",
    badge: "📊 Développé Stratégique (5P)",
    pageCount: 5,
    description: "Rapport étendu avec développement des recommandations pédagogiques et perspectives.",
    detailLevelDescription: "Détails renforcés sur les instituts partenaires et les passerelles d'études.",
    recommendedFor: "Conseils d'orientation stratégiques post-bac et reconversions.",
    iconType: "layers",
  },
  {
    id: "exhaustif_6p",
    character: "exhaustif",
    label: "Exhaustif & Intégral (6 Pages A4)",
    shortLabel: "6P Exhaustif",
    badge: "📚 Exhaustif (6P)",
    pageCount: 6,
    description: "Dossier exhaustif d'expertise avec analyse psychométrique et marché de l'emploi détaillé.",
    detailLevelDescription: "Grand format complet déployant l'intégralité des analyses et chronogrammes.",
    recommendedFor: "Dossiers d'excellence, bourses internationales et commissions ministérielles.",
    iconType: "bookOpen",
  },
  {
    id: "exhaustif_8p",
    character: "exhaustif",
    label: "Grand Dossier Exhaustif (8 Pages A4)",
    shortLabel: "8P Grand Dossier",
    badge: "🎓 Grand Dossier (8P)",
    pageCount: 8,
    description: "Master dossier complet avec détails approfondis de chaque pôle disciplinaire.",
    detailLevelDescription: "Analyse ultra-détaillée avec mise en page spacieuse de chaque section.",
    recommendedFor: "Bilans de compétences cadres et orientation grandes écoles internationales.",
    iconType: "bookOpen",
  },
  {
    id: "exhaustif_10p",
    character: "exhaustif",
    label: "Master Dossier Intégral (10 Pages A4)",
    shortLabel: "10P Master Intégral",
    badge: "🏆 Master Intégral (10P)",
    pageCount: 10,
    description: "Dossier d'expertise intégrale maximale avec plan d'action pluriannuel complet.",
    detailLevelDescription: "Déploiement volumétrique maximal avec une section maîtresse par page A4.",
    recommendedFor: "Audits d'orientation institutionnels et bilans pluriannuels complets.",
    iconType: "bookOpen",
  },
];

export function getDocumentCharacterFromPageCount(pageCount: number): DocumentCharacterType {
  if (pageCount <= 2) return "synthetique";
  if (pageCount === 3) return "standard";
  if (pageCount <= 5) return "developpe";
  return "exhaustif";
}

export function getDocumentOptionForPageCount(pageCount: number): DocumentOptionMeta {
  const match = DOCUMENT_OPTIONS_LIST.find((opt) => opt.pageCount === pageCount);
  if (match) return match;

  const character = getDocumentCharacterFromPageCount(pageCount);
  if (character === "synthetique") {
    return pageCount <= 1 ? DOCUMENT_OPTIONS_LIST[0] : DOCUMENT_OPTIONS_LIST[1];
  }
  if (character === "standard") {
    return DOCUMENT_OPTIONS_LIST[2];
  }
  if (character === "developpe") {
    return pageCount === 4 ? DOCUMENT_OPTIONS_LIST[3] : DOCUMENT_OPTIONS_LIST[4];
  }
  if (pageCount <= 6) return DOCUMENT_OPTIONS_LIST[5];
  if (pageCount <= 8) return DOCUMENT_OPTIONS_LIST[6];
  return DOCUMENT_OPTIONS_LIST[7];
}

export function getDocumentCharacterBadge(character: DocumentCharacterType): {
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  description: string;
} {
  switch (character) {
    case "synthetique":
      return {
        label: "Option Synthétique",
        colorClass: "text-amber-300",
        bgClass: "bg-amber-950/80",
        borderClass: "border-amber-500/50",
        description: "Format condensé et synthétique (1 à 2 pages A4)",
      };
    case "standard":
      return {
        label: "Option Standard Homologué",
        colorClass: "text-emerald-300",
        bgClass: "bg-emerald-950/80",
        borderClass: "border-emerald-500/50",
        description: "Format officiel de référence (3 pages A4)",
      };
    case "developpe":
      return {
        label: "Option Développé",
        colorClass: "text-blue-300",
        bgClass: "bg-blue-950/80",
        borderClass: "border-blue-500/50",
        description: "Format développé et approfondi (4 à 5 pages A4)",
      };
    case "exhaustif":
      return {
        label: "Option Exhaustif",
        colorClass: "text-purple-300",
        bgClass: "bg-purple-950/80",
        borderClass: "border-purple-500/50",
        description: "Master dossier intégral et complet (6 à 10 pages A4)",
      };
  }
}

export function areLayoutsEqual(a: LayoutSnapshot, b: LayoutSnapshot): boolean {
  if (!a || !b) return false;

  // Check block assignments
  for (const block of REPORT_BLOCK_DEFINITIONS) {
    if (a.blockAssignment[block.id] !== b.blockAssignment[block.id]) {
      return false;
    }
  }

  // Check block order
  if (a.blockOrder.length !== b.blockOrder.length) return false;
  for (let i = 0; i < a.blockOrder.length; i++) {
    if (a.blockOrder[i] !== b.blockOrder[i]) {
      return false;
    }
  }

  // Check font scales
  for (const block of REPORT_BLOCK_DEFINITIONS) {
    const scaleA = a.blockFontScales[block.id] || 100;
    const scaleB = b.blockFontScales[block.id] || 100;
    if (scaleA !== scaleB) {
      return false;
    }
  }

  return true;
}

export function countLayoutDifferences(current: LayoutSnapshot, reference: LayoutSnapshot): number {
  if (!current || !reference) return 0;
  let diffCount = 0;

  for (const block of REPORT_BLOCK_DEFINITIONS) {
    if (current.blockAssignment[block.id] !== reference.blockAssignment[block.id]) {
      diffCount++;
    }
  }

  let orderDiff = 0;
  for (let i = 0; i < current.blockOrder.length; i++) {
    if (current.blockOrder[i] !== reference.blockOrder[i]) {
      orderDiff++;
    }
  }
  if (orderDiff > 0) {
    diffCount += Math.ceil(orderDiff / 2);
  }

  for (const block of REPORT_BLOCK_DEFINITIONS) {
    const scaleA = current.blockFontScales[block.id] || 100;
    const scaleB = reference.blockFontScales[block.id] || 100;
    if (scaleA !== scaleB) {
      diffCount++;
    }
  }

  return diffCount;
}

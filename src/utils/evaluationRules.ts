/**
 * RÈGLES DE CALCUL ET D'APPRÉCIATIONS D'ORIENTATION ET RECRUTEMENT
 * ORIENTAAFRIK & CERTIFICATION - CABINET DU DR. BALOGAH DIBAATABA
 */

export interface TestAppreciationResult {
  scorePct: number;
  appreciation: "Très faible capacité" | "Faible capacité" | "Capacité moyenne" | "Capacité solide" | "Capacité très solide";
  scoreRangeLabel: string;
  badgeColorClass: string;
}

export interface ConclusionAvisResult {
  avisCode: "DEFAVORABLE" | "RESERVE" | "FAVORABLE" | "TRES_FAVORABLE" | "TRES_TRES_FAVORABLE";
  avisTitle: string;
  avisShort: string;
  avisText: string;
  badgeClass: string;
}

/**
 * Règle 1 : Évaluation des résultats aux tests selon les tranches de score
 * - De 0 à 25,99% = Très faible capacité
 * - De 26 à 49,99% = Faible capacité
 * - De 50 à 50,99% = Capacité moyenne
 * - De 51 à 75,99% = Capacité solide
 * - De 76 à 100% = Capacité très solide
 */
export function getTestScoreAppreciation(scorePct: number): TestAppreciationResult {
  const score = Math.min(100, Math.max(0, scorePct));

  if (score <= 25.99) {
    return {
      scorePct: score,
      appreciation: "Très faible capacité",
      scoreRangeLabel: "Score 0% - 25.99% (Très faible capacité)",
      badgeColorClass: "bg-red-100 text-red-800 border-red-300",
    };
  } else if (score <= 49.99) {
    return {
      scorePct: score,
      appreciation: "Faible capacité",
      scoreRangeLabel: "Score 26% - 49.99% (Faible capacité)",
      badgeColorClass: "bg-orange-100 text-orange-800 border-orange-300",
    };
  } else if (score <= 50.99) {
    return {
      scorePct: score,
      appreciation: "Capacité moyenne",
      scoreRangeLabel: "Score 50% - 50.99% (Capacité moyenne)",
      badgeColorClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
    };
  } else if (score <= 75.99) {
    return {
      scorePct: score,
      appreciation: "Capacité solide",
      scoreRangeLabel: "Score 51% - 75.99% (Capacité solide)",
      badgeColorClass: "bg-blue-100 text-blue-800 border-blue-300",
    };
  } else {
    return {
      scorePct: score,
      appreciation: "Capacité très solide",
      scoreRangeLabel: "Score 76% - 100% (Capacité très solide)",
      badgeColorClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    };
  }
}

/**
 * Règle 2 : Détermination de l'Avis en conclusion du rapport
 * - Avis défavorable : Candidats ne remplissant pas les conditions d'accès aux filières visées
 * - Avis réservé : Moyenne d'éligibilité 12 - 13.99 avec mauvais score aux tests (< 50%)
 * - Avis favorable : Moyenne d'éligibilité 14 - 15.99 avec score aux tests < 50%
 * - Avis très favorable :
 *     - Moyenne d'éligibilité 14 - 15.99 avec score aux tests >= 50%
 *     - ET Moyenne d'éligibilité 16 - 17.99 avec score aux tests < 50%
 * - Avis très très favorable et forte recommandation du dossier :
 *     - Moyenne d'éligibilité 16 - 17.99 avec score aux tests >= 50%
 *     - ET Moyenne d'éligibilité 18 - 19.99 (ou 20) avec score aux tests < 50% ou >= 50%
 */
export function getConclusionAvis({
  isEligible,
  overallAvg,
  testScorePct,
  targetProgramName,
  targetUniversityName,
}: {
  isEligible: boolean;
  overallAvg: number;
  testScorePct: number;
  targetProgramName?: string;
  targetUniversityName?: string;
}): ConclusionAvisResult {
  const avg = Math.round(overallAvg * 100) / 100;
  const score = Math.round(testScorePct * 100) / 100;

  const targetSuffix =
    targetProgramName || targetUniversityName
      ? ` pour la candidature en ${targetProgramName || "la filière sélectionnée"}${
          targetUniversityName ? ` à ${targetUniversityName}` : ""
        }`
      : "";

  // 1. Non éligible (conditions d'accès non remplies)
  if (!isEligible) {
    return {
      avisCode: "DEFAVORABLE",
      avisTitle: "AVIS DÉFAVORABLE",
      avisShort: "Avis Défavorable",
      avisText: `Avis défavorable délivré${targetSuffix} : Le candidat ne remplit pas l'ensemble des conditions d'accès et prérequis académiques exigés.`,
      badgeClass: "bg-red-100 text-red-900 border border-red-300 font-extrabold",
    };
  }

  // Si moyenne < 12/20
  if (avg < 12) {
    if (score < 50) {
      return {
        avisCode: "DEFAVORABLE",
        avisTitle: "AVIS DÉFAVORABLE",
        avisShort: "Avis Défavorable",
        avisText: `Avis défavorable délivré${targetSuffix} : Moyenne d'éligibilité insuffisante (${avg}/20 < 12/20) combinée à un résultat faible aux tests d'aptitudes (${score}% < 50%).`,
        badgeClass: "bg-red-100 text-red-900 border border-red-300 font-extrabold",
      };
    } else {
      return {
        avisCode: "RESERVE",
        avisTitle: "AVIS RÉSERVÉ",
        avisShort: "Avis Réservé",
        avisText: `Avis sous réserve délivré${targetSuffix} : Moyenne académique de ${avg}/20 (< 12/20). Remise à niveau fortement recommandée malgré une capacité démontrée aux tests (${score}%).`,
        badgeClass: "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold",
      };
    }
  }

  // 2. Moyenne d'éligibilité entre 12 et 13,99
  if (avg >= 12 && avg <= 13.99) {
    if (score < 50) {
      return {
        avisCode: "RESERVE",
        avisTitle: "AVIS RÉSERVÉ",
        avisShort: "Avis Réservé",
        avisText: `Avis réservé délivré${targetSuffix} : Le candidat présente une moyenne d'éligibilité de ${avg}/20 (tranche 12.00 - 13.99/20) avec un score aux tests de ${score}% (< 50%).`,
        badgeClass: "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold",
      };
    } else {
      return {
        avisCode: "FAVORABLE",
        avisTitle: "AVIS FAVORABLE",
        avisShort: "Avis Favorable",
        avisText: `Avis favorable délivré${targetSuffix} : Moyenne d'éligibilité de ${avg}/20 (tranche 12.00 - 13.99/20) consolidée par un score satisfaisant aux tests (${score}% >= 50%).`,
        badgeClass: "bg-blue-100 text-blue-900 border border-blue-300 font-extrabold",
      };
    }
  }

  // 3. Moyenne d'éligibilité entre 14 et 15,99
  if (avg >= 14 && avg <= 15.99) {
    if (score < 50) {
      return {
        avisCode: "FAVORABLE",
        avisTitle: "AVIS FAVORABLE",
        avisShort: "Avis Favorable",
        avisText: `Avis favorable délivré${targetSuffix} : Le candidat présente une moyenne d'éligibilité solide de ${avg}/20 (tranche 14.00 - 15.99/20) malgré un score aux tests de ${score}% (< 50%).`,
        badgeClass: "bg-blue-100 text-blue-900 border border-blue-300 font-extrabold",
      };
    } else {
      return {
        avisCode: "TRES_FAVORABLE",
        avisTitle: "AVIS TRÈS FAVORABLE",
        avisShort: "Avis Très Favorable",
        avisText: `Avis très favorable délivré${targetSuffix} : Le candidat combine une excellente moyenne d'éligibilité de ${avg}/20 (tranche 14.00 - 15.99/20) et un score supérieur à 50% aux tests (${score}%).`,
        badgeClass: "bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold",
      };
    }
  }

  // 4. Moyenne d'éligibilité entre 16 et 17,99
  if (avg >= 16 && avg <= 17.99) {
    if (score < 50) {
      return {
        avisCode: "TRES_FAVORABLE",
        avisTitle: "AVIS TRÈS FAVORABLE",
        avisShort: "Avis Très Favorable",
        avisText: `Avis très favorable délivré${targetSuffix} : Le candidat détient une moyenne d'éligibilité supérieure de ${avg}/20 (tranche 16.00 - 17.99/20) avec un score aux tests de ${score}% (< 50%).`,
        badgeClass: "bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold",
      };
    } else {
      return {
        avisCode: "TRES_TRES_FAVORABLE",
        avisTitle: "AVIS TRÈS TRÈS FAVORABLE & FORTE RECOMMANDATION DU DOSSIER",
        avisShort: "Avis Très Très Favorable et Forte Recommandation du Dossier",
        avisText: `Avis très très favorable et forte recommandation du dossier${targetSuffix} : Le candidat associe une moyenne d'éligibilité d'excellence de ${avg}/20 (tranche 16.00 - 17.99/20) et un score d'aptitudes aux tests de ${score}% (>= 50%).`,
        badgeClass: "bg-purple-100 text-purple-950 border border-purple-300 font-extrabold",
      };
    }
  }

  // 5. Moyenne d'éligibilité entre 18 et 20 (score aux tests < 50% ou >= 50%)
  if (avg >= 18) {
    return {
      avisCode: "TRES_TRES_FAVORABLE",
      avisTitle: "AVIS TRÈS TRÈS FAVORABLE & FORTE RECOMMANDATION DU DOSSIER",
      avisShort: "Avis Très Très Favorable et Forte Recommandation du Dossier",
      avisText: `Avis très très favorable et forte recommandation du dossier${targetSuffix} : Le candidat détient une moyenne d'éligibilité exceptionnelle de ${avg}/20 (tranche 18.00 - 20.00/20) attestant d'une maîtrise absolue du socle académique.`,
      badgeClass: "bg-purple-100 text-purple-950 border border-purple-300 font-extrabold",
    };
  }

  // Fallback
  return {
    avisCode: "FAVORABLE",
    avisTitle: "AVIS FAVORABLE",
    avisShort: "Avis Favorable",
    avisText: `Avis favorable délivré${targetSuffix} pour la candidature de l'étudiant.`,
    badgeClass: "bg-blue-100 text-blue-900 border border-blue-300 font-extrabold",
  };
}

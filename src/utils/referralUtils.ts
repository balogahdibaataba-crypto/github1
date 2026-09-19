export interface ReferredFriend {
  id: string;
  fullName: string;
  emailOrPhone: string;
  invitedDate: string;
  testsPassed: number; // e.g. 0 to 10
  status: "Inscrit" | "Tests en cours" | "Tests Terminés";
  hasPurchasedReport: boolean;
}

export interface ReferralState {
  userCode: string;
  referredFriends: ReferredFriend[];
  earnedVouchers: Array<{
    code: string;
    discountPct: number;
    description: string;
    isUsed: boolean;
    createdDate: string;
  }>;
}

const STORAGE_KEY = "orientaafrik_referral_data_v1";

export function getInitialReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BALOGAH-${random}`;
}

export function loadReferralState(): ReferralState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to load referral state", e);
  }

  // Default initial mock state with 2 friends so user sees immediate activity
  const defaultCode = getInitialReferralCode();
  const initialState: ReferralState = {
    userCode: defaultCode,
    referredFriends: [
      {
        id: "ref-1",
        fullName: "Kofi Mensah",
        emailOrPhone: "+228 91 ** ** 34",
        invitedDate: "2026-07-20",
        testsPassed: 5,
        status: "Tests Terminés",
        hasPurchasedReport: true,
      },
      {
        id: "ref-2",
        fullName: "Aïcha Bamba",
        emailOrPhone: "aicha.b@gmail.com",
        invitedDate: "2026-07-24",
        testsPassed: 3,
        status: "Tests en cours",
        hasPurchasedReport: false,
      },
    ],
    earnedVouchers: [
      {
        code: `PARRAIN-15-${defaultCode.split("-")[1] || "A8F"}`,
        discountPct: 15,
        description: "15% de réduction grâce à votre 1er filleul actif",
        isUsed: false,
        createdDate: "2026-07-21",
      },
    ],
  };

  saveReferralState(initialState);
  return initialState;
}

export function saveReferralState(state: ReferralState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save referral state", e);
  }
}

/**
 * Calculates current reward level and next tier threshold
 */
export function calculateReferralTier(activeFriendsCount: number) {
  if (activeFriendsCount >= 10) {
    return {
      currentLevelName: "Parrain Or (Top Bâtisseur)",
      discountPct: 100,
      nextTierCount: 10,
      friendsNeededForNext: 0,
      badgeColor: "bg-amber-500 text-white",
      perkText: "100% GRATUIT • Tous vos rapports certifiés offerts !",
    };
  } else if (activeFriendsCount >= 5) {
    return {
      currentLevelName: "Parrain Argent",
      discountPct: 50,
      nextTierCount: 10,
      friendsNeededForNext: 10 - activeFriendsCount,
      badgeColor: "bg-purple-600 text-white",
      perkText: "50% de réduction sur les rapports certifiés du Dr BALOGAH",
    };
  } else if (activeFriendsCount >= 3) {
    return {
      currentLevelName: "Parrain Bronze",
      discountPct: 35,
      nextTierCount: 5,
      friendsNeededForNext: 5 - activeFriendsCount,
      badgeColor: "bg-blue-600 text-white",
      perkText: "35% de réduction sur tous vos bilans certifiés",
    };
  } else if (activeFriendsCount >= 1) {
    return {
      currentLevelName: "Parrain Débutant",
      discountPct: 15,
      nextTierCount: 3,
      friendsNeededForNext: 3 - activeFriendsCount,
      badgeColor: "bg-emerald-600 text-white",
      perkText: "15% de réduction immédiate",
    };
  }

  return {
    currentLevelName: "Nouveau Membre",
    discountPct: 0,
    nextTierCount: 1,
    friendsNeededForNext: 1,
    badgeColor: "bg-slate-500 text-white",
    perkText: "Invitez un 1er ami pour débloquer 15% de réduction !",
  };
}

/**
 * Validates promo / referral codes applied at checkout
 */
export function validatePromoCode(
  code: string,
  userState?: ReferralState
): { isValid: boolean; discountPct: number; message: string; codeType?: string } {
  const cleanCode = code.trim().toUpperCase();

  if (!cleanCode) {
    return { isValid: false, discountPct: 0, message: "Veuillez saisir un code promo ou de parrainage." };
  }

  // Check if code matches standard referral discount triggers
  if (cleanCode.startsWith("PARRAIN-100") || cleanCode === "BALOGAHFREE" || cleanCode === "GRATUIT100") {
    return {
      isValid: true,
      discountPct: 100,
      message: "🎉 Code Parrain d'Excellence appliqué : 100% GRATUIT (Rapport Certifié offert) !",
      codeType: "SPECIAL_100",
    };
  }

  if (cleanCode.startsWith("PARRAIN-50") || cleanCode === "PARRAIN50") {
    return {
      isValid: true,
      discountPct: 50,
      message: "🎉 Code Parrain 50% appliqué : -50% de réduction immédiate sur le tarif officiel.",
      codeType: "PARRAIN_50",
    };
  }

  if (cleanCode.startsWith("PARRAIN-35") || cleanCode === "PARRAIN35") {
    return {
      isValid: true,
      discountPct: 35,
      message: "🎉 Code Parrain 35% appliqué : -35% de réduction immédiate.",
      codeType: "PARRAIN_35",
    };
  }

  if (cleanCode.startsWith("PARRAIN-15") || cleanCode === "PARRAIN15") {
    return {
      isValid: true,
      discountPct: 15,
      message: "🎉 Code Parrainage 15% appliqué : -15% de réduction sur votre commande.",
      codeType: "PARRAIN_15",
    };
  }

  // Check user's earned vouchers
  if (userState) {
    const voucher = userState.earnedVouchers.find(
      (v) => v.code.toUpperCase() === cleanCode && !v.isUsed
    );
    if (voucher) {
      return {
        isValid: true,
        discountPct: voucher.discountPct,
        message: `🎉 Bon de réduction personnel valide : -${voucher.discountPct}% sur votre Rapport Certifié Dr BALOGAH !`,
        codeType: "PERSONAL_VOUCHER",
      };
    }
  }

  // Generic referral code matching BALOGAH-XXXX
  if (cleanCode.startsWith("BALOGAH-") || cleanCode.startsWith("REF-")) {
    return {
      isValid: true,
      discountPct: 15,
      message: "🎉 Code Parrainage valide : Vous bénéficiez de 15% de réduction de bienvenue !",
      codeType: "FRIEND_REFERRAL",
    };
  }

  return {
    isValid: false,
    discountPct: 0,
    message: "Code invalide ou expiré. Vérifiez la syntaxe ou votre espace parrainage.",
  };
}

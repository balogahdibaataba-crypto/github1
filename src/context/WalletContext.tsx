import React, { createContext, useContext, useState, useEffect } from "react";

export interface WalletTransaction {
  id: string;
  type: "EARN" | "WITHDRAWAL";
  title: string;
  amountFCFA: number;
  date: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  provider?: "MIXX" | "MOOV" | "WAVE" | "MTN" | "ORANGE";
  phoneNumber?: string;
  recipientName?: string;
  referenceCode?: string;
}

interface WalletContextType {
  balanceFCFA: number;
  totalEarnedFCFA: number;
  totalWithdrawnFCFA: number;
  activeSecondsToday: number;
  transactions: WalletTransaction[];
  addReward: (amount: number, reason: string) => void;
  claimDailyBonus: () => boolean;
  requestMobileMoneyTransfer: (params: {
    amount: number;
    provider: "MIXX" | "MOOV" | "WAVE" | "MTN" | "ORANGE";
    phoneNumber: string;
    recipientName: string;
  }) => { success: boolean; message: string; transaction?: WalletTransaction };
  lastDailyClaimDate: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "orientaafrik_wallet_data_v2";

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balanceFCFA, setBalanceFCFA] = useState<number>(250); // Seed bonus 250 FCFA
  const [totalEarnedFCFA, setTotalEarnedFCFA] = useState<number>(250);
  const [totalWithdrawnFCFA, setTotalWithdrawnFCFA] = useState<number>(0);
  const [activeSecondsToday, setActiveSecondsToday] = useState<number>(0);
  const [lastDailyClaimDate, setLastDailyClaimDate] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: "tx-welcome",
      type: "EARN",
      title: "Bonus d'Accueil OrientaAfrik & Navigation Initialisée",
      amountFCFA: 250,
      date: new Date().toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      status: "COMPLETED",
    },
  ]);

  // Load from local storage & listen for live cross-tab updates
  useEffect(() => {
    const loadWalletData = () => {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.balanceFCFA === "number") setBalanceFCFA(parsed.balanceFCFA);
          if (typeof parsed.totalEarnedFCFA === "number") setTotalEarnedFCFA(parsed.totalEarnedFCFA);
          if (typeof parsed.totalWithdrawnFCFA === "number") setTotalWithdrawnFCFA(parsed.totalWithdrawnFCFA);
          if (typeof parsed.activeSecondsToday === "number") setActiveSecondsToday(parsed.activeSecondsToday);
          if (Array.isArray(parsed.transactions)) setTransactions(parsed.transactions);
          if (parsed.lastDailyClaimDate) setLastDailyClaimDate(parsed.lastDailyClaimDate);
        }
      } catch (e) {
        console.error("Erreur de chargement du portefeuille :", e);
      }
    };

    loadWalletData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        loadWalletData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      const dataToSave = {
        balanceFCFA,
        totalEarnedFCFA,
        totalWithdrawnFCFA,
        activeSecondsToday,
        transactions,
        lastDailyClaimDate,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Erreur de sauvegarde du portefeuille :", e);
    }
  }, [balanceFCFA, totalEarnedFCFA, totalWithdrawnFCFA, activeSecondsToday, transactions, lastDailyClaimDate]);

  // Passive Browsing Time Accrual Engine: Every 3 seconds of active session -> 1 FCFA added
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSecondsToday((prev) => prev + 3);
      setBalanceFCFA((prevBal) => prevBal + 1);
      setTotalEarnedFCFA((prevEarned) => prevEarned + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const addReward = (amount: number, reason: string) => {
    if (amount <= 0) return;
    setBalanceFCFA((prev) => prev + amount);
    setTotalEarnedFCFA((prev) => prev + amount);

    const newTx: WalletTransaction = {
      id: `tx-earn-${Date.now()}`,
      type: "EARN",
      title: reason,
      amountFCFA: amount,
      date: new Date().toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      status: "COMPLETED",
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  const claimDailyBonus = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (lastDailyClaimDate === todayStr) {
      return false; // Already claimed today
    }

    const bonusAmount = 150; // 150 FCFA daily check-in
    setLastDailyClaimDate(todayStr);
    addReward(bonusAmount, "🎁 Bonus Quotidien de Présence & Navigation");
    return true;
  };

  const requestMobileMoneyTransfer = ({
    amount,
    provider,
    phoneNumber,
    recipientName,
  }: {
    amount: number;
    provider: "MIXX" | "MOOV" | "WAVE" | "MTN" | "ORANGE";
    phoneNumber: string;
    recipientName: string;
  }) => {
    if (amount <= 0) {
      return { success: false, message: "Le montant du transfert doit être supérieur à 0 FCFA." };
    }
    if (amount > balanceFCFA) {
      return {
        success: false,
        message: `Solde insuffisant ! Votre solde disponible est de ${balanceFCFA.toLocaleString("fr-FR")} FCFA.`,
      };
    }
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      return { success: false, message: "Veuillez fournir un numéro de téléphone Mobile Money valide." };
    }

    const refCode = `TRF-${provider}-${Date.now().toString(36).toUpperCase()}`;
    const providerName =
      provider === "MIXX"
        ? "Mixx par Yas (Togocom)"
        : provider === "MOOV"
        ? "Moov Money"
        : provider === "WAVE"
        ? "Wave Digital"
        : provider === "MTN"
        ? "MTN Mobile Money"
        : "Orange Money";

    const newTx: WalletTransaction = {
      id: `tx-out-${Date.now()}`,
      type: "WITHDRAWAL",
      title: `Transfert Mobile Money vers ${recipientName || "Bénéficiaire"} (${providerName})`,
      amountFCFA: amount,
      date: new Date().toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      status: "COMPLETED",
      provider,
      phoneNumber,
      recipientName,
      referenceCode: refCode,
    };

    setBalanceFCFA((prev) => prev - amount);
    setTotalWithdrawnFCFA((prev) => prev + amount);
    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      message: `✅ Transfert de ${amount.toLocaleString("fr-FR")} FCFA effectué avec succès vers ${providerName} (${phoneNumber}) !`,
      transaction: newTx,
    };
  };

  return (
    <WalletContext.Provider
      value={{
        balanceFCFA,
        totalEarnedFCFA,
        totalWithdrawnFCFA,
        activeSecondsToday,
        transactions,
        addReward,
        claimDailyBonus,
        requestMobileMoneyTransfer,
        lastDailyClaimDate,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

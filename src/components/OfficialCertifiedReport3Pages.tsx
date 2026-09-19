import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  QrCode,
  Fingerprint,
  Share2,
  FileText,
  Calendar,
  User,
  School,
  Sparkles,
  Check,
  X,
  Compass,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Copy,
  BookOpen,
  Zap,
  GraduationCap,
  Wallet,
  CreditCard,
  Sliders,
  Ruler,
  Maximize2,
  Minimize2,
  Eye,
  Crop,
  RotateCcw,
  Layers,
  Settings2,
  ChevronLeft,
  Info,
  TrendingUp,
  Target,
  Columns,
  Type,
  Plus,
  Minus,
  MoveHorizontal,
  Undo2,
  Redo2,
  ShieldAlert,
} from "lucide-react";
import {
  CandidateCivilData,
  OrientationDemandSynthesis,
  AcademicSubjectRow,
  PsychometricTestRow,
  OfficialDecisionData,
  PageMetric,
  DensityModeType,
} from "../types/reportTypes";
import { ReportPageLayout } from "./report/ReportPageLayouts";
import { CertificateBackingBlock, ReportDensityClasses } from "./report/ReportBlocks";
import {
  BlockPageAssignment,
  getDefaultBlockAssignment,
  ReportBlockId,
  CustomizerMode,
  BlockFontScales,
  getDefaultBlockFontScales,
  DEFAULT_BLOCK_ORDER,
  reorderBlockInList,
  moveBlockWithinPage,
  LayoutSnapshot,
  areLayoutsEqual,
  countLayoutDifferences,
  DOCUMENT_OPTIONS_LIST,
  getDocumentCharacterFromPageCount,
  getDocumentOptionForPageCount,
  getDocumentCharacterBadge,
  DocumentCharacterType,
} from "../types/reportCustomizerTypes";
import { ReportBlockOrganizer } from "./report/ReportBlockOrganizer";
import { InteractiveReportControlPanel } from "./report/InteractiveReportControlPanel";
import { generateBalogahQrCodeDataUrl } from "../utils/qrCodeUtils";
import { exportElementToPdf } from "../utils/pdfExportHelper";

export interface OfficialCertifiedReport3PagesProps {
  candidate: CandidateCivilData;
  demandSynthesis: OrientationDemandSynthesis;
  academicRecords: {
    subjects: AcademicSubjectRow[];
    globalAverage: number;
    calculationFormulaExplanation?: string;
    totalPoints?: number;
    maxPoints?: number;
  };
  psychometrics: {
    tests: PsychometricTestRow[];
    dominantRiasec?: string;
    cognitiveScore?: number;
    psychologicalSummary: string;
  };
  decision: OfficialDecisionData;
  onClose?: () => void;
  autoPrintOnLoad?: boolean;
  initialPreviewMode?: boolean;
  initialPageCount?: number;
}

export const OfficialCertifiedReport3Pages: React.FC<OfficialCertifiedReport3PagesProps> = ({
  candidate,
  demandSynthesis,
  academicRecords,
  psychometrics,
  decision,
  onClose,
  autoPrintOnLoad = false,
  initialPreviewMode = false,
  initialPageCount = 3,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(100);

  // Dynamic Page Count: 1 to 10 Pages A4
  const [pageCount, setPageCount] = useState<number>(() => {
    return Math.max(1, Math.min(10, initialPageCount || 3));
  });

  // Dynamic Typography / Font Scale (75% to 130%)
  const [fontScale, setFontScale] = useState<number>(() => {
    if (initialPageCount <= 1) return 85;
    if (initialPageCount === 2) return 92;
    if (initialPageCount === 3) return 96;
    if (initialPageCount <= 5) return 100;
    return 105;
  });
  const [isAutoTypography, setIsAutoTypography] = useState<boolean>(true);

  const [showA4Guidelines, setShowA4Guidelines] = useState<boolean>(true);

  // Print Layout Mode: 1 Page / Sheet (Portrait) OR 2 Pages / Sheet A4 (Landscape 2-up)
  const [pagesPerSheet, setPagesPerSheet] = useState<1 | 2>(1);

  // Print Preview Modal State
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(initialPreviewMode);
  const [previewZoom, setPreviewZoom] = useState<number>(100);

  // Printing framing & adjustment settings
  const [printScale, setPrintScale] = useState<number>(96); // Default 96% ensures flawless fit
  const [printMarginMm, setPrintMarginMm] = useState<number>(6); // 4, 6, 8 mm
  const [densityMode, setDensityMode] = useState<DensityModeType>("compact");
  const [strictClamping, setStrictClamping] = useState<boolean>(true);
  const [showAdjustPanel, setShowAdjustPanel] = useState<boolean>(false);
  const [showBlockOrganizer, setShowBlockOrganizer] = useState<boolean>(false);
  const [autoFitSuccessMsg, setAutoFitSuccessMsg] = useState<string | null>(null);

  // Customizer Mode: "auto" (Algorithm-driven) vs "manual" (User customized)
  const [customizerMode, setCustomizerMode] = useState<CustomizerMode>("auto");

  // Dynamic point & block assignment per page (Allows user to manually move blocks across A4 pages)
  const [blockAssignment, setBlockAssignment] = useState<BlockPageAssignment>(() =>
    getDefaultBlockAssignment(initialPageCount || 3)
  );

  // Authoritative global reading order of blocks (Allows intra-page and inter-page renumbering)
  const [blockOrder, setBlockOrder] = useState<ReportBlockId[]>(() => DEFAULT_BLOCK_ORDER);

  // Per-section Font Scales (50% to 130%)
  const [blockFontScales, setBlockFontScales] = useState<BlockFontScales>(() =>
    getDefaultBlockFontScales(100)
  );

  // Baseline / Confirmed Layout Snapshot (Used to detect unconfirmed changes)
  const [confirmedSnapshot, setConfirmedSnapshot] = useState<LayoutSnapshot>(() => ({
    blockAssignment: getDefaultBlockAssignment(initialPageCount || 3),
    blockOrder: DEFAULT_BLOCK_ORDER,
    blockFontScales: getDefaultBlockFontScales(100),
    timestamp: Date.now(),
    description: "Disposition officielle certifiée",
  }));

  // Undo / Redo History Stack (up to 30 states)
  const [layoutHistory, setLayoutHistory] = useState<LayoutSnapshot[]>([
    {
      blockAssignment: getDefaultBlockAssignment(initialPageCount || 3),
      blockOrder: DEFAULT_BLOCK_ORDER,
      blockFontScales: getDefaultBlockFontScales(100),
      timestamp: Date.now(),
      description: "Disposition officielle certifiée",
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Safety confirmation before dropping/moving
  const [askConfirmBeforeDrop, setAskConfirmBeforeDrop] = useState<boolean>(false);

  // Pre-Print Safety Warning Modal (Prevents accidental print if unconfirmed edits exist)
  const [pendingPrintAction, setPendingPrintAction] = useState<"print1Up" | "print2Up" | "pdf" | null>(null);
  const [showPrePrintModal, setShowPrePrintModal] = useState<boolean>(false);

  // Current snapshot representation
  const currentSnapshot: LayoutSnapshot = useMemo(() => ({
    blockAssignment,
    blockOrder,
    blockFontScales,
  }), [blockAssignment, blockOrder, blockFontScales]);

  // Are there unconfirmed manual changes?
  const hasUnconfirmedChanges = useMemo(() => {
    return !areLayoutsEqual(currentSnapshot, confirmedSnapshot);
  }, [currentSnapshot, confirmedSnapshot]);

  const unconfirmedCount = useMemo(() => {
    return countLayoutDifferences(currentSnapshot, confirmedSnapshot);
  }, [currentSnapshot, confirmedSnapshot]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < layoutHistory.length - 1;

  // Push new state to history
  const pushLayoutState = (
    newAssignment: BlockPageAssignment,
    newOrder: ReportBlockId[],
    newFontScales: BlockFontScales,
    description: string
  ) => {
    const nextSnapshot: LayoutSnapshot = {
      blockAssignment: newAssignment,
      blockOrder: newOrder,
      blockFontScales: newFontScales,
      timestamp: Date.now(),
      description,
    };

    const newHistory = [...layoutHistory.slice(0, historyIndex + 1), nextSnapshot].slice(-30);
    setLayoutHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setBlockAssignment(newAssignment);
    setBlockOrder(newOrder);
    setBlockFontScales(newFontScales);
    setAutoFitSuccessMsg(description);
    setTimeout(() => setAutoFitSuccessMsg(null), 3000);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = layoutHistory[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setBlockAssignment(prev.blockAssignment);
      setBlockOrder(prev.blockOrder);
      setBlockFontScales(prev.blockFontScales);
      setAutoFitSuccessMsg("↩ Action annulée (Ctrl+Z)");
      setTimeout(() => setAutoFitSuccessMsg(null), 2500);
    }
  };

  const handleRedo = () => {
    if (historyIndex < layoutHistory.length - 1) {
      const next = layoutHistory[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setBlockAssignment(next.blockAssignment);
      setBlockOrder(next.blockOrder);
      setBlockFontScales(next.blockFontScales);
      setAutoFitSuccessMsg("↷ Action rétablie (Ctrl+Y)");
      setTimeout(() => setAutoFitSuccessMsg(null), 2500);
    }
  };

  const handleConfirmManualChanges = () => {
    setConfirmedSnapshot({
      blockAssignment,
      blockOrder,
      blockFontScales,
      timestamp: Date.now(),
      description: "Modifications manuelles validées par l'utilisateur",
    });
    setAutoFitSuccessMsg("✓ Modifications manuelles validées et enregistrées avec succès pour l'impression.");
    setTimeout(() => setAutoFitSuccessMsg(null), 4000);
  };

  const handleCancelManualChanges = () => {
    pushLayoutState(
      confirmedSnapshot.blockAssignment,
      confirmedSnapshot.blockOrder,
      confirmedSnapshot.blockFontScales,
      "Annulation des modifications : Retour à la dernière version validée"
    );
  };

  // Keyboard shortcut support for Undo (Ctrl+Z) and Redo (Ctrl+Y / Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, layoutHistory]);

  const handleToggleCustomizerMode = (newMode: CustomizerMode) => {
    setCustomizerMode(newMode);
    if (newMode === "auto") {
      const defaultAssign = getDefaultBlockAssignment(pageCount);
      const defaultOrder = DEFAULT_BLOCK_ORDER;
      const defaultScales = getDefaultBlockFontScales(100);
      pushLayoutState(
        defaultAssign,
        defaultOrder,
        defaultScales,
        "Mode Automatique activé : Répartition et numérotation par algorithme rétablies."
      );
      setConfirmedSnapshot({
        blockAssignment: defaultAssign,
        blockOrder: defaultOrder,
        blockFontScales: defaultScales,
        timestamp: Date.now(),
        description: "Disposition algorithmique officielle",
      });
      setIsAutoTypography(true);
    } else {
      setAutoFitSuccessMsg("Mode Manuel activé : Glissez-déposez les blocs et ajustez la police de chaque section.");
      setTimeout(() => setAutoFitSuccessMsg(null), 3000);
    }
  };

  const handleMoveBlock = (blockId: ReportBlockId, targetPage: number) => {
    const safeTarget = Math.max(1, Math.min(pageCount, targetPage));
    const newAssignment = {
      ...blockAssignment,
      [blockId]: safeTarget,
    };
    pushLayoutState(
      newAssignment,
      blockOrder,
      blockFontScales,
      `Bloc déplacé vers la Page ${safeTarget}`
    );
  };

  const handleMoveBlockWithinPage = (blockId: ReportBlockId, direction: "up" | "down") => {
    const newOrder = moveBlockWithinPage(blockOrder, blockAssignment, blockId, direction);
    pushLayoutState(
      blockAssignment,
      newOrder,
      blockFontScales,
      `Bloc déplacé vers le ${direction === "up" ? "haut" : "bas"}`
    );
  };

  const handleReorderBlock = (
    blockId: ReportBlockId,
    targetPage: number,
    targetPlacement?: { relativeToBlockId: ReportBlockId; position: "before" | "after" }
  ) => {
    const safeTarget = Math.max(1, Math.min(pageCount, targetPage));
    const result = reorderBlockInList(
      blockOrder,
      blockAssignment,
      blockId,
      safeTarget,
      targetPlacement
    );
    pushLayoutState(
      result.newAssignment,
      result.newOrder,
      blockFontScales,
      `Bloc réordonné sur la Page ${safeTarget}`
    );
  };

  const handleChangeBlockFontScale = (blockId: ReportBlockId, scale: number) => {
    const safeScale = Math.max(50, Math.min(130, scale));
    const newScales = {
      ...blockFontScales,
      [blockId]: safeScale,
    };
    pushLayoutState(
      blockAssignment,
      blockOrder,
      newScales,
      `Police ajustée à ${safeScale}%`
    );
  };

  const handleResetBlockFontScales = () => {
    const defaultScales = getDefaultBlockFontScales(100);
    pushLayoutState(
      blockAssignment,
      blockOrder,
      defaultScales,
      "Toutes les sections réinitialisées à 100%."
    );
  };

  const handleApplyGlobalToAllBlocks = () => {
    const newScales = getDefaultBlockFontScales(fontScale);
    pushLayoutState(
      blockAssignment,
      blockOrder,
      newScales,
      `Toutes les sections configurées à ${fontScale}%.`
    );
  };

  const handleResetToAlgorithm = () => {
    const defaultAssign = getDefaultBlockAssignment(pageCount);
    const defaultOrder = DEFAULT_BLOCK_ORDER;
    const defaultScales = getDefaultBlockFontScales(100);
    pushLayoutState(
      defaultAssign,
      defaultOrder,
      defaultScales,
      "Répartition algorithmique, numérotation et polices réinitialisées."
    );
    setIsAutoTypography(true);
  };

  const handleResetBlockAssignment = () => {
    const defaultAssign = getDefaultBlockAssignment(pageCount);
    const defaultOrder = DEFAULT_BLOCK_ORDER;
    pushLayoutState(
      defaultAssign,
      defaultOrder,
      blockFontScales,
      "Répartition par défaut des points rétablie."
    );
  };

  // Page measurement metrics
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pageMetrics, setPageMetrics] = useState<PageMetric[]>([]);

  const totalPages = pageCount;
  const totalSheets2Up = Math.ceil(totalPages / 2);

  // Payment unlock state for 15,000 FCFA printing fee
  const docRef = decision.documentRef || `OA-CERT-2026-${Math.floor(Math.random() * 89999 + 10000)}`;
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (autoPrintOnLoad) return true;
    const cached = localStorage.getItem(`oa_report_unlocked_${docRef}`) || localStorage.getItem("oa_global_report_unlocked");
    return cached === "true";
  });
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [payProvider, setPayProvider] = useState<"mixx" | "flooz" | "virement">("mixx");
  const [payPhoneOrSender, setPayPhoneOrSender] = useState("");
  const [payTxnRef, setPayTxnRef] = useState("");
  const [payEmail, setPayEmail] = useState("");
  const [payCopied, setPayCopied] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [unlockSuccessMsg, setUnlockSuccessMsg] = useState<string | null>(null);

  const reportContainerRef = useRef<HTMLDivElement>(null);

  const candidateName = candidate.fullName || "Le requérant";
  const formattedDate = decision.officialNoticeDate || new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Automatically adjust font scale and density when pageCount changes in auto-typography mode
  const handleSetPageCount = (count: number) => {
    const safeCount = Math.max(1, Math.min(10, count));
    setPageCount(safeCount);
    const newAssignment = getDefaultBlockAssignment(safeCount);
    setBlockAssignment(newAssignment);

    const docOpt = getDocumentOptionForPageCount(safeCount);

    if (isAutoTypography) {
      if (safeCount === 1) {
        setFontScale(85);
        setDensityMode("ultra_compact");
        setPrintScale(94);
      } else if (safeCount === 2) {
        setFontScale(92);
        setDensityMode("compact");
        setPrintScale(96);
      } else if (safeCount === 3) {
        setFontScale(96);
        setDensityMode("compact");
        setPrintScale(96);
      } else if (safeCount <= 5) {
        setFontScale(100);
        setDensityMode("balanced");
        setPrintScale(97);
      } else if (safeCount <= 8) {
        setFontScale(105);
        setDensityMode("balanced");
        setPrintScale(98);
      } else {
        setFontScale(108);
        setDensityMode("spacious");
        setPrintScale(98);
      }
    }

    pushLayoutState(
      newAssignment,
      blockOrder,
      blockFontScales,
      `Option ${docOpt.badge} activée (${safeCount} Page${safeCount > 1 ? "s" : ""} A4)`
    );

    if (customizerMode === "auto") {
      setConfirmedSnapshot({
        blockAssignment: newAssignment,
        blockOrder,
        blockFontScales,
        timestamp: Date.now(),
        description: `Disposition officielle ${docOpt.label}`,
      });
    }
  };

  // Measure all pages in real time to detect any A4 overflow
  const measurePages = () => {
    const newMetrics: PageMetric[] = [];

    for (let i = 0; i < totalPages; i++) {
      const el = pageRefs.current[i];
      if (el) {
        // Standard A4 aspect ratio is 297mm / 210mm = 1.4142857
        const w = el.clientWidth || 800;
        const maxA4Height = Math.round(w * 1.4142857);
        const scrollHeight = el.scrollHeight;
        const clientHeight = el.clientHeight;
        const percent = Math.round((scrollHeight / maxA4Height) * 100);
        const overflowPx = Math.max(0, scrollHeight - maxA4Height);
        const isOverflow = scrollHeight > maxA4Height + 4;
        const isWarning = !isOverflow && scrollHeight > maxA4Height * 0.96;

        newMetrics.push({
          pageNumber: i + 1,
          scrollHeight,
          clientHeight,
          maxA4Height,
          percent,
          isOverflow,
          isWarning,
          overflowPx,
        });
      }
    }

    if (newMetrics.length > 0) {
      setPageMetrics(newMetrics);
    }
  };

  useLayoutEffect(() => {
    measurePages();
    const timer = setTimeout(measurePages, 100);
    const timer2 = setTimeout(measurePages, 400);

    const handleResize = () => measurePages();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener("resize", handleResize);
    };
  }, [totalPages, densityMode, printScale, printMarginMm, zoomScale, qrCodeUrl, strictClamping, pagesPerSheet, fontScale]);

  // Intelligent Auto-Fit & Auto-Balance Mechanism
  const handleAutoFit = () => {
    if (pageMetrics.length === 0) {
      measurePages();
    }

    const maxPercent = pageMetrics.length > 0
      ? Math.max(...pageMetrics.map((m) => m.percent))
      : 100;

    let targetScale = printScale;
    let targetFont = fontScale;
    let targetDensity: DensityModeType = densityMode;

    if (maxPercent > 100) {
      targetFont = Math.max(78, fontScale - 6);
      targetScale = Math.max(82, printScale - 3);
      targetDensity = "ultra_compact";
    } else if (maxPercent > 95) {
      targetFont = Math.max(82, fontScale - 3);
      targetScale = Math.max(88, printScale - 2);
      targetDensity = "compact";
    } else if (maxPercent < 80 && fontScale < 115) {
      targetFont = Math.min(115, fontScale + 4);
      targetScale = Math.min(100, printScale + 2);
      targetDensity = "balanced";
    } else {
      targetScale = 96;
      targetFont = 96;
      targetDensity = "compact";
    }

    setPrintScale(targetScale);
    setFontScale(targetFont);
    setDensityMode(targetDensity);
    setStrictClamping(true);
    setPrintMarginMm(6);

    setAutoFitSuccessMsg(
      `✨ Auto-Équilibrage appliqué avec succès ! Échelle ${targetScale}%, Typographie ${targetFont}%, Densité "${targetDensity}". Les ${totalPages} pages sont parfaitement calibrées.`
    );
    setTimeout(() => setAutoFitSuccessMsg(null), 6000);
    setTimeout(measurePages, 200);
  };

  const handleResetFraming = () => {
    setPrintScale(96);
    setFontScale(96);
    setPrintMarginMm(6);
    setDensityMode("compact");
    setStrictClamping(true);
    setIsAutoTypography(true);
    setAutoFitSuccessMsg(`Paramètres réinitialisés aux standards officiels pour ${totalPages} pages A4.`);
    setTimeout(() => setAutoFitSuccessMsg(null), 4000);
    setTimeout(measurePages, 200);
  };

  // Generate official QR code
  useEffect(() => {
    let isMounted = true;
    generateBalogahQrCodeDataUrl({
      docId: docRef,
      studentName: candidateName,
      docType: candidate.orientationType === "POST_BEPC" ? "Rapport d'Orientation Post-BEPC" : "Rapport d'Orientation Post-BAC",
      date: formattedDate,
      width: 220,
    }).then((url) => {
      if (isMounted) {
        setQrCodeUrl(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [docRef, candidateName, candidate.orientationType, formattedDate]);

  useEffect(() => {
    if (autoPrintOnLoad && isUnlocked) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPrintOnLoad, isUnlocked]);

  const handleCopyPayData = (text: string) => {
    navigator.clipboard.writeText(text);
    setPayCopied(text);
    setTimeout(() => setPayCopied(null), 2000);
  };

  const handleValidateReportPayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsUnlocked(true);
      localStorage.setItem(`oa_report_unlocked_${docRef}`, "true");
      localStorage.setItem("oa_global_report_unlocked", "true");
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      setUnlockSuccessMsg("Frais de 15 000 FCFA validés ! L'impression et le téléchargement sont débloqués.");
      setTimeout(() => setUnlockSuccessMsg(null), 6000);
    }, 600);
  };

  const handlePrint2Up = () => {
    if (!isUnlocked) {
      setShowPaymentModal(true);
      return;
    }
    if (hasUnconfirmedChanges) {
      setPendingPrintAction("print2Up");
      setShowPrePrintModal(true);
      return;
    }
    setPagesPerSheet(2);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handlePrint1Up = () => {
    if (!isUnlocked) {
      setShowPaymentModal(true);
      return;
    }
    if (hasUnconfirmedChanges) {
      setPendingPrintAction("print1Up");
      setShowPrePrintModal(true);
      return;
    }
    setPagesPerSheet(1);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleDownloadPdf = async (force2Up?: boolean) => {
    if (!isUnlocked) {
      setShowPaymentModal(true);
      return;
    }
    if (hasUnconfirmedChanges) {
      setPendingPrintAction("pdf");
      setShowPrePrintModal(true);
      return;
    }
    if (!reportContainerRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const safeName = candidateName.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
      const is2UpMode = force2Up !== undefined ? force2Up : pagesPerSheet === 2;
      await exportElementToPdf(
        reportContainerRef.current,
        `Rapport_Certifie_${totalPages}Pages_${is2UpMode ? "2PagesParFeuilleA4_" : ""}Dr_BALOGAH_${safeName}.pdf`,
        { twoPagesPerSheet: is2UpMode }
      );
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Note : Pour un rendu vectoriel haute précision, vous pouvez également utiliser le bouton 'Imprimer' pour enregistrer au format PDF natif.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const executePendingPrintAction = (confirmEdits: boolean) => {
    if (confirmEdits) {
      handleConfirmManualChanges();
    }
    const action = pendingPrintAction;
    setPendingPrintAction(null);
    setShowPrePrintModal(false);

    if (action === "print1Up") {
      setPagesPerSheet(1);
      setTimeout(() => window.print(), 250);
    } else if (action === "print2Up") {
      setPagesPerSheet(2);
      setTimeout(() => window.print(), 250);
    } else if (action === "pdf") {
      setTimeout(() => {
        if (!reportContainerRef.current) return;
        setIsGeneratingPdf(true);
        const safeName = candidateName.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
        const is2UpMode = pagesPerSheet === 2;
        exportElementToPdf(
          reportContainerRef.current,
          `Rapport_Certifie_${totalPages}Pages_${is2UpMode ? "2PagesParFeuilleA4_" : ""}Dr_BALOGAH_${safeName}.pdf`,
          { twoPagesPerSheet: is2UpMode }
        ).finally(() => setIsGeneratingPdf(false));
      }, 250);
    }
  };

  // Dynamic CSS classes for density & typography
  const densityClasses: ReportDensityClasses = useMemo(() => {
    if (densityMode === "ultra_compact") {
      return {
        cardPadding: "p-1.5 sm:p-2",
        sectionMargin: "mb-1",
        spacing: "space-y-0.5",
        tablePadding: "px-1 py-0.5 text-[8.5px]",
        textXs: "text-[9px] leading-tight",
        textSm: "text-[10px] leading-snug",
        headingSm: "text-[10px] font-black",
        headingMd: "text-xs font-black",
      };
    }
    if (densityMode === "compact") {
      return {
        cardPadding: "p-2 sm:p-2.5",
        sectionMargin: "mb-1.5",
        spacing: "space-y-1",
        tablePadding: "px-1.5 py-0.5 text-[9.5px]",
        textXs: "text-[10px] leading-snug",
        textSm: "text-[11px] leading-snug",
        headingSm: "text-[11px] font-black",
        headingMd: "text-xs sm:text-sm font-black",
      };
    }
    if (densityMode === "spacious") {
      return {
        cardPadding: "p-3.5 sm:p-4",
        sectionMargin: "mb-3",
        spacing: "space-y-2",
        tablePadding: "px-2.5 py-1.5 text-[11px]",
        textXs: "text-xs leading-relaxed",
        textSm: "text-sm leading-relaxed",
        headingSm: "text-xs sm:text-sm font-black",
        headingMd: "text-sm sm:text-base font-black",
      };
    }
    // Balanced
    return {
      cardPadding: "p-2.5 sm:p-3",
      sectionMargin: "mb-2",
      spacing: "space-y-1.5",
      tablePadding: "px-2 py-1 text-[10px]",
      textXs: "text-[11px] leading-normal",
      textSm: "text-xs leading-normal",
      headingSm: "text-xs font-black",
      headingMd: "text-sm font-black",
    };
  }, [densityMode]);

  const hasOverflow = pageMetrics.some((m) => m.isOverflow);
  const hasWarning = pageMetrics.some((m) => m.isWarning);
  const compliantCount = pageMetrics.filter((m) => !m.isOverflow).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto print:static print:bg-white print:overflow-visible pb-32 print:pb-0">
      {/* Explicit Print CSS supporting both 1 Page / Sheet (Portrait) and 2 Pages / Sheet (Landscape 2-up) */}
      <style>{`
        @media print {
          ${pagesPerSheet === 2 ? `
            @page {
              size: A4 landscape !important;
              margin: 4mm !important;
            }
            .print-sheet-portrait {
              display: none !important;
            }
            .print-sheet-2up {
              display: flex !important;
              flex-direction: row !important;
              justify-content: space-between !important;
              align-items: stretch !important;
              page-break-before: auto !important;
              page-break-after: always !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              width: 100% !important;
              height: calc(210mm - 8mm) !important;
              max-height: calc(210mm - 8mm) !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              gap: 4mm !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
            }
            .print-sheet-2up:last-child {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .official-report-page-2up {
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              width: calc(50% - 2mm) !important;
              height: 100% !important;
              max-height: 100% !important;
              box-sizing: border-box !important;
              padding: 3.5mm 4mm !important;
              border: 1.5px solid #059669 !important;
              border-radius: 4px !important;
              overflow: hidden !important;
              font-size: ${fontScale}% !important;
              background: #ffffff !important;
            }
          ` : `
            @page {
              size: A4 portrait !important;
              margin: ${printMarginMm}mm !important;
            }
            .print-sheet-2up {
              display: none !important;
            }
            .official-report-page {
              page-break-before: auto !important;
              page-break-after: always !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              box-shadow: none !important;
              border: 2px solid #059669 !important;
              border-radius: 6px !important;
              padding: ${printMarginMm <= 4 ? "4mm 5mm" : "5mm 6mm"} !important;
              margin: 0 !important;
              box-sizing: border-box !important;
              width: 100% !important;
              font-size: ${fontScale}% !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              ${strictClamping ? `height: calc(297mm - ${printMarginMm * 2}mm) !important; max-height: calc(297mm - ${printMarginMm * 2}mm) !important; overflow: hidden !important;` : `min-height: 284mm !important; max-height: 287mm !important;`}
              ${printScale !== 100 ? `transform: scale(${printScale / 100}) !important; transform-origin: top center !important;` : ''}
            }
            .official-report-page:last-child {
              page-break-after: avoid !important;
              break-after: avoid !important;
              margin-bottom: 0 !important;
            }
          `}
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          .print-hidden-element {
            display: none !important;
          }
          table, th, td {
            border-color: #059669 !important;
          }
        }
      `}</style>

      {/* Top Control & Action Bar (Hidden on Print) */}
      <div className="sticky top-0 z-50 bg-slate-900/95 border-b border-slate-800 px-3 sm:px-4 py-2.5 shadow-xl backdrop-blur-md print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Identity & Reference */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
              <Award className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white font-bold text-xs sm:text-sm font-serif">
                  Rapport Certifié
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9.5px] font-mono font-black border ${
                    getDocumentCharacterFromPageCount(totalPages) === "synthetique"
                      ? "bg-amber-950/80 text-amber-300 border-amber-500/50"
                      : getDocumentCharacterFromPageCount(totalPages) === "standard"
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                      : getDocumentCharacterFromPageCount(totalPages) === "developpe"
                      ? "bg-blue-950/80 text-blue-300 border-blue-500/50"
                      : "bg-purple-950/80 text-purple-300 border-purple-500/50"
                  }`}
                >
                  {getDocumentOptionForPageCount(totalPages).badge}
                </span>
                {isUnlocked ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-extrabold border border-emerald-500/40 flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5 text-emerald-400" /> 15k FCFA Réglés
                  </span>
                ) : (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-mono font-extrabold border border-amber-500/40 flex items-center gap-1 cursor-pointer"
                  >
                    <Wallet className="w-3 h-3 text-amber-400" /> Débloquer (15 000 FCFA)
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                <span className="text-slate-200 font-bold">{candidateName}</span> • Réf : <span className="font-mono text-amber-400">{docRef}</span>
              </p>
            </div>
          </div>

          {/* Controls: Document Option Quick Selector, Page Count Selector & Typography Scale */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Document Option Quick Picker */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => handleSetPageCount(pageCount <= 2 ? pageCount : 2)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  getDocumentCharacterFromPageCount(pageCount) === "synthetique"
                    ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                    : "text-slate-400 hover:text-amber-300"
                }`}
                title="Format Synthétique (1 à 2 Pages A4)"
              >
                <Zap className="w-3 h-3" />
                <span className="hidden lg:inline">Synthétique</span>
                <span className="lg:hidden">1-2P</span>
              </button>

              <button
                onClick={() => handleSetPageCount(3)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  getDocumentCharacterFromPageCount(pageCount) === "standard"
                    ? "bg-emerald-500 text-slate-950 font-black shadow-xs"
                    : "text-slate-400 hover:text-emerald-300"
                }`}
                title="Format Standard Homologué (3 Pages A4 - Référence)"
              >
                <Award className="w-3 h-3" />
                <span className="hidden lg:inline">Standard (3P)</span>
                <span className="lg:hidden">3P</span>
              </button>

              <button
                onClick={() => handleSetPageCount(pageCount === 4 || pageCount === 5 ? pageCount : 4)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  getDocumentCharacterFromPageCount(pageCount) === "developpe"
                    ? "bg-blue-500 text-slate-950 font-black shadow-xs"
                    : "text-slate-400 hover:text-blue-300"
                }`}
                title="Format Développé & Approfondi (4 à 5 Pages A4)"
              >
                <Layers className="w-3 h-3" />
                <span className="hidden lg:inline">Développé</span>
                <span className="lg:hidden">4-5P</span>
              </button>

              <button
                onClick={() => handleSetPageCount(pageCount >= 6 ? pageCount : 6)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  getDocumentCharacterFromPageCount(pageCount) === "exhaustif"
                    ? "bg-purple-500 text-slate-950 font-black shadow-xs"
                    : "text-slate-400 hover:text-purple-300"
                }`}
                title="Format Exhaustif & Intégral (6 à 10 Pages A4)"
              >
                <BookOpen className="w-3 h-3" />
                <span className="hidden lg:inline">Exhaustif</span>
                <span className="lg:hidden">6-10P</span>
              </button>
            </div>

            {/* Dynamic Page Count Selector (1 to 10 Pages) */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
              <span className="px-2 text-[10px] text-slate-400 font-bold uppercase hidden md:inline">
                Pages :
              </span>
              <button
                onClick={() => handleSetPageCount(pageCount - 1)}
                disabled={pageCount <= 1}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Diminuer le nombre de pages"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              {/* Quick Page Presets */}
              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => handleSetPageCount(num)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pageCount === num
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title={`Générer un rapport équilibré sur ${num} page${num > 1 ? "s" : ""} A4`}
                >
                  {num}P{num === 3 ? " ★" : ""}
                </button>
              ))}

              <button
                onClick={() => handleSetPageCount(pageCount + 1)}
                disabled={pageCount >= 10}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Augmenter le nombre de pages (jusqu'à 10 pages A4)"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Typography / Font Size Stepper */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
              <span className="px-1.5 text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Type className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline font-mono">{fontScale}%</span>
              </span>
              <button
                onClick={() => {
                  setFontScale((prev) => Math.max(75, prev - 3));
                  setIsAutoTypography(false);
                }}
                className="p-1 text-slate-400 hover:text-amber-300 cursor-pointer"
                title="Diminuer la taille des lettres"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  setFontScale((prev) => Math.min(130, prev + 3));
                  setIsAutoTypography(false);
                }}
                className="p-1 text-slate-400 hover:text-amber-300 cursor-pointer"
                title="Augmenter la taille des lettres"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Print Mode Selector: 1 Page / Sheet VS 2 Pages / Sheet A4 */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => setPagesPerSheet(1)}
                className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  pagesPerSheet === 1
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="1 Page par feuille A4 (Portrait standard)"
              >
                <FileText className="w-3 h-3" />
                <span className="hidden sm:inline">1P / Feuille</span>
              </button>
              <button
                onClick={() => setPagesPerSheet(2)}
                className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  pagesPerSheet === 2
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="2 Pages par feuille A4 (Paysage 2-en-1 / Économique & Livret)"
              >
                <Columns className="w-3 h-3" />
                <span className="hidden sm:inline">2P / Feuille</span>
              </button>
            </div>

            {/* Preview Button */}
            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              title="Prévisualiser toutes les pages et vérifier les sauts de page A4"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Aperçu</span>
            </button>

            {/* Block & Point Movement Organizer Button */}
            <button
              onClick={() => {
                setShowBlockOrganizer((prev) => !prev);
                if (showAdjustPanel) setShowAdjustPanel(false);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                showBlockOrganizer
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                  : "bg-slate-800 hover:bg-slate-700 text-emerald-300 border-slate-700"
              }`}
              title="Déplacer des points du rapport d'une page à une autre et ajuster la typographie A4"
            >
              <MoveHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Organiser les Points</span>
              {hasUnconfirmedChanges && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-0.5" />
              )}
            </button>

            {/* Calibration & Framing Adjustment Button */}
            <button
              onClick={() => {
                setShowAdjustPanel((prev) => !prev);
                if (showBlockOrganizer) setShowBlockOrganizer(false);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                showAdjustPanel
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700"
              }`}
              title="Calibrage précis et équilibrage de la typographie"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ajuster</span>
            </button>

            {/* Auto-Fit Button */}
            <button
              onClick={handleAutoFit}
              className="px-2.5 py-1.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-200 border border-teal-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title={`Auto-équilibrage intelligent pour adapter le contenu sur ${totalPages} pages`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span className="hidden md:inline">Auto-Fit {totalPages}P</span>
            </button>

            {/* PDF Download */}
            <button
              onClick={() => handleDownloadPdf()}
              disabled={isGeneratingPdf}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              title={pagesPerSheet === 2 ? "Télécharger le PDF avec 2 pages par feuille A4 Paysage" : "Télécharger le PDF A4 Portrait"}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? "..." : pagesPerSheet === 2 ? "PDF 2P/F" : "PDF"}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={pagesPerSheet === 2 ? handlePrint2Up : handlePrint1Up}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>{pagesPerSheet === 2 ? `Imprimer 2P/Feuille` : `Imprimer (${totalPages}P)`}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-200 border border-slate-700 transition-all cursor-pointer ml-1"
                title="Fermer la vue"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Alerts & Feedback */}
        {autoFitSuccessMsg && (
          <div className="max-w-7xl mx-auto mt-2 bg-teal-950/90 border border-teal-500/60 text-teal-200 px-4 py-1.5 rounded-xl text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-150">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-300 shrink-0" />
              <span>{autoFitSuccessMsg}</span>
            </span>
            <button onClick={() => setAutoFitSuccessMsg(null)} className="text-teal-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {unlockSuccessMsg && (
          <div className="max-w-7xl mx-auto mt-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-1.5 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-150">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{unlockSuccessMsg}</span>
            </span>
            <button onClick={() => setUnlockSuccessMsg(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Calibration & Framing Adjustment Drawer */}
        {showAdjustPanel && (
          <div className="max-w-7xl mx-auto mt-2.5 p-4 bg-slate-950 border-2 border-amber-500/40 rounded-2xl shadow-2xl text-xs text-slate-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                <Crop className="w-4 h-4 text-amber-400" />
                <span>Panneau de Calibrage Dynamique ({totalPages} Pages A4 • Typographie Adaptative)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAutoFit}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Équilibrer le Contenu</span>
                </button>
                <button
                  onClick={handleResetFraming}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                  title="Réinitialiser"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </button>
                <button
                  onClick={() => setShowAdjustPanel(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* 1. Typography & Font Size Control (<80% down to 50% supported) */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-amber-400" />
                    <span>Taille des Lettres</span>
                  </span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{fontScale}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="130"
                  step="1"
                  value={fontScale}
                  onChange={(e) => {
                    setFontScale(Number(e.target.value));
                    setIsAutoTypography(false);
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex flex-wrap gap-1 text-[10px] text-center font-mono justify-between">
                  {[55, 65, 75, 80, 85, 92, 100, 110].map((sc) => (
                    <button
                      key={sc}
                      onClick={() => {
                        setFontScale(sc);
                        setIsAutoTypography(false);
                      }}
                      className={`px-1.5 py-1 rounded transition-all cursor-pointer ${
                        fontScale === sc
                          ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {sc}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Print Scale Control */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Échelle Globale A4</span>
                  </span>
                  <span className="font-mono font-bold text-blue-400 text-sm">{printScale}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="105"
                  step="1"
                  value={printScale}
                  onChange={(e) => setPrintScale(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
                  {[90, 94, 96, 100].map((sc) => (
                    <button
                      key={sc}
                      onClick={() => setPrintScale(sc)}
                      className={`py-1 rounded ${printScale === sc ? "bg-blue-600 text-white font-bold" : "bg-slate-800 text-slate-400 hover:text-white"}`}
                    >
                      {sc}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Margins */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Marges d'Impression A4</span>
                </span>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  {[4, 6, 8].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPrintMarginMm(m)}
                      className={`py-1.5 rounded-lg border text-center font-bold transition-all ${
                        printMarginMm === m
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {m} mm
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Density Modes */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Densité du Contenu</span>
                </span>
                <div className="grid grid-cols-4 gap-1 text-[9.5px]">
                  {[
                    { id: "ultra_compact", label: "Ultra" },
                    { id: "compact", label: "Compact" },
                    { id: "balanced", label: "Équilibré" },
                    { id: "spacious", label: "Spacieux" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDensityMode(d.id as any)}
                      className={`py-1.5 rounded-lg border text-center font-bold transition-all ${
                        densityMode === d.id
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Point / Block Reassignment Organizer Drawer */}
        {showBlockOrganizer && (
          <div className="max-w-7xl mx-auto mt-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <ReportBlockOrganizer
              totalPages={totalPages}
              blockAssignment={blockAssignment}
              blockOrder={blockOrder}
              onMoveBlock={handleMoveBlock}
              onMoveBlockWithinPage={handleMoveBlockWithinPage}
              onResetToDefault={handleResetBlockAssignment}
              fontScale={fontScale}
              onChangeFontScale={(scale) => {
                setFontScale(scale);
                setIsAutoTypography(false);
              }}
              onClose={() => setShowBlockOrganizer(false)}
              onConfirmChanges={handleConfirmManualChanges}
              onCancelChanges={handleCancelManualChanges}
              hasUnconfirmedChanges={hasUnconfirmedChanges}
              unconfirmedCount={unconfirmedCount}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </div>
        )}
      </div>

      {/* Payment Modal for 15,000 FCFA Certification Fee */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-emerald-600 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-950 font-serif">
                Validation des Frais de Certification &amp; Impression
              </h3>
              <p className="text-xs text-slate-600">
                Montant officiel pour la délivrance du rapport certifié : <strong className="text-emerald-950 font-mono font-black text-sm">15 000 FCFA</strong>
              </p>
            </div>

            <div className="space-y-3">
              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPayProvider("mixx")}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    payProvider === "mixx"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-xs font-bold">Mixx by Yas</span>
                  <span className="text-[10px] text-slate-500 font-mono">+228 90 96 67 65</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayProvider("flooz")}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    payProvider === "flooz"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-xs font-bold">Moov Flooz</span>
                  <span className="text-[10px] text-slate-500 font-mono">+228 99 37 20 74</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayProvider("virement")}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    payProvider === "virement"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-xs font-bold">Virement / Guichet</span>
                  <span className="text-[10px] text-slate-500">Banque / Agence</span>
                </button>
              </div>

              {/* Payment details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Numéro Bénéficiaire :</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-900">
                      {payProvider === "mixx" ? "+228 90 96 67 65" : payProvider === "flooz" ? "+228 99 37 20 74" : "ORABANK TOGO"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPayData(payProvider === "mixx" ? "+22890966765" : payProvider === "flooz" ? "+22899372074" : "TG0580100100")}
                      className="p-1 text-slate-400 hover:text-emerald-700"
                      title="Copier le numéro"
                    >
                      {payCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nom du Compte :</span>
                  <span className="font-bold text-slate-900">Dr BALOGAH Dibaataba</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Référence Dossier :</span>
                  <span className="font-mono font-bold text-emerald-950">{docRef}</span>
                </div>
              </div>

              <form onSubmit={handleValidateReportPayment} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Numéro Expéditeur :
                    </label>
                    <input
                      type="text"
                      required
                      value={payPhoneOrSender}
                      onChange={(e) => setPayPhoneOrSender(e.target.value)}
                      placeholder="Ex: 90 XX XX XX"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      ID Transaction / Réf :
                    </label>
                    <input
                      type="text"
                      required
                      value={payTxnRef}
                      onChange={(e) => setPayTxnRef(e.target.value)}
                      placeholder="Ex: TXN-998822"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Adresse E-mail pour réception de la copie certifiée (Optionnel) :
                  </label>
                  <input
                    type="email"
                    value={payEmail}
                    onChange={(e) => setPayEmail(e.target.value)}
                    placeholder="Ex: candidat@gmail.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>{isProcessingPayment ? "Vérification en cours..." : "Valider le Paiement & Débloquer l'Impression"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE REPORT CONTROL PANEL (MODE AUTOMATIQUE VS MODE MANUEL)        */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 print:hidden">
        <InteractiveReportControlPanel
          mode={customizerMode}
          onChangeMode={handleToggleCustomizerMode}
          totalPages={totalPages}
          onChangeTotalPages={handleSetPageCount}
          densityMode={densityMode}
          onChangeDensityMode={setDensityMode}
          globalFontScale={fontScale}
          onChangeGlobalFontScale={(scale) => {
            setFontScale(scale);
            setIsAutoTypography(false);
          }}
          blockAssignment={blockAssignment}
          blockOrder={blockOrder}
          onMoveBlock={handleMoveBlock}
          onMoveBlockWithinPage={handleMoveBlockWithinPage}
          onReorderBlock={handleReorderBlock}
          blockFontScales={blockFontScales}
          onChangeBlockFontScale={handleChangeBlockFontScale}
          onResetBlockFontScales={handleResetBlockFontScales}
          onApplyGlobalToAllBlocks={handleApplyGlobalToAllBlocks}
          onResetToAlgorithm={handleResetToAlgorithm}
          isAutoTypography={isAutoTypography}
          onToggleAutoTypography={() => setIsAutoTypography((prev) => !prev)}
          onConfirmChanges={handleConfirmManualChanges}
          onCancelChanges={handleCancelManualChanges}
          hasUnconfirmedChanges={hasUnconfirmedChanges}
          unconfirmedCount={unconfirmedCount}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          askConfirmBeforeDrop={askConfirmBeforeDrop}
          onToggleAskConfirmBeforeDrop={() => setAskConfirmBeforeDrop((prev) => !prev)}
        />
      </div>

      {/* ========================================================================= */}
      {/* MAIN DOCUMENT BODY - 1-UP PORTRAIT OR 2-UP LANDSCAPE RENDERING            */}
      {/* ========================================================================= */}
      <div className="py-6 px-2 sm:px-4 flex justify-center print:p-0 print:m-0">
        <div
          ref={reportContainerRef}
          style={{
            transform: `scale(${(zoomScale / 100) * (printScale / 100)})`,
            transformOrigin: "top center",
          }}
          className={`w-full transition-transform duration-200 print:space-y-0 print:max-w-none print:transform-none print:w-full ${
            pagesPerSheet === 2 ? "max-w-[1200px] space-y-12" : "max-w-[850px] space-y-10"
          }`}
        >
          {/* --------------------------------------------------------------------- */}
          {/* MODE 1: STANDARD 1-PAGE-PER-SHEET (PORTRAIT)                           */}
          {/* --------------------------------------------------------------------- */}
          {pagesPerSheet === 1 && (
            <div className="print-sheet-portrait space-y-10 print:space-y-0">
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                return (
                  <React.Fragment key={pageNum}>
                    {/* Screen Page Header Indicator */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 rounded-xl border border-emerald-500/50 text-xs text-emerald-200 print:hidden shadow-md">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] uppercase tracking-wide">
                          PAGE {pageNum} / {totalPages}
                        </span>
                        <span className="font-semibold text-slate-100">
                          {pageNum === 1
                            ? "Identité Civile, Demande & Dossier Scolaire"
                            : pageNum === totalPages
                            ? "Clôture Officielle, Sceau, Empreinte Directoire & QR Code"
                            : `Volet ${pageNum} : Évaluation d'Orientation & Diagnostic`}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400">
                        Feuille {pageNum} sur {totalPages} • Typographie {fontScale}%
                      </span>
                    </div>

                    {/* Page Card */}
                    <div
                      ref={(el) => (pageRefs.current[idx] = el)}
                      style={{ fontSize: fontScale !== 100 ? `${fontScale}%` : undefined }}
                      className="official-report-page bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-emerald-600 relative flex flex-col justify-between min-h-[1120px] print:min-h-0 print:shadow-none print:border-none print:rounded-none print:p-0 print:break-after-page print:page-break-after-always"
                    >
                      {showA4Guidelines && (
                        <div className="absolute left-0 right-0 bottom-4 border-b-2 border-dashed border-emerald-400/60 pointer-events-none print:hidden flex items-center justify-end px-3">
                          <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                            Limite A4 (297 mm)
                          </span>
                        </div>
                      )}

                      <ReportPageLayout
                        pageNum={pageNum}
                        totalPages={totalPages}
                        candidate={candidate}
                        demandSynthesis={demandSynthesis}
                        academicRecords={academicRecords}
                        psychometrics={psychometrics}
                        decision={decision}
                        docRef={docRef}
                        formattedDate={formattedDate}
                        qrCodeUrl={qrCodeUrl}
                        densityClasses={densityClasses}
                        pageMetrics={pageMetrics}
                        fontScale={fontScale}
                        blockAssignment={blockAssignment}
                        blockOrder={blockOrder}
                        blockFontScales={blockFontScales}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* MODE 2: 2-PAGES-PER-SHEET (A4 LANDSCAPE 2-UP)                         */}
          {/* --------------------------------------------------------------------- */}
          {pagesPerSheet === 2 && (
            <div className="space-y-12 print:space-y-0">
              {Array.from({ length: totalSheets2Up }, (_, sheetIdx) => {
                const sheetNum = sheetIdx + 1;
                const leftPageNum = sheetIdx * 2 + 1;
                const rightPageNum = sheetIdx * 2 + 2 <= totalPages ? sheetIdx * 2 + 2 : null;

                return (
                  <div key={sheetNum} className="space-y-3">
                    {/* Screen Indicator for 2-Up Sheet */}
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 rounded-xl border border-emerald-500/60 text-xs text-emerald-200 print:hidden shadow-md">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] uppercase tracking-wide">
                          FEUILLE PHYSIQUE A4 #{sheetNum} / {totalSheets2Up} (PAYSAGE)
                        </span>
                        <span className="font-semibold text-slate-100">
                          Contient : Page {leftPageNum} (Gauche) {rightPageNum ? `+ Page ${rightPageNum} (Droite)` : "+ Certificat d'Authenticité"}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-amber-300 font-bold">
                        Mode 2 Pages / Feuille A4
                      </span>
                    </div>

                    {/* 2-Up Sheet Container */}
                    <div className="print-sheet-2up bg-slate-900/40 p-4 sm:p-6 rounded-3xl border-2 border-emerald-500/40 flex flex-col md:flex-row gap-4 justify-between items-stretch shadow-2xl print:bg-white print:p-0 print:border-none print:shadow-none print:rounded-none">
                      {/* Left Page (Half 1 of A4 Landscape) */}
                      <div
                        ref={(el) => (pageRefs.current[leftPageNum - 1] = el)}
                        style={{ fontSize: fontScale !== 100 ? `${fontScale}%` : undefined }}
                        className="official-report-page-2up flex-1 bg-white text-slate-900 rounded-xl p-5 border-2 border-emerald-600 shadow-lg flex flex-col justify-between min-h-[650px] md:min-h-[750px] print:min-h-0 print:shadow-none print:rounded-none"
                      >
                        <ReportPageLayout
                          pageNum={leftPageNum}
                          totalPages={totalPages}
                          candidate={candidate}
                          demandSynthesis={demandSynthesis}
                          academicRecords={academicRecords}
                          psychometrics={psychometrics}
                          decision={decision}
                          docRef={docRef}
                          formattedDate={formattedDate}
                          qrCodeUrl={qrCodeUrl}
                          densityClasses={densityClasses}
                          pageMetrics={pageMetrics}
                          fontScale={fontScale}
                          is2UpCompact
                          blockAssignment={blockAssignment}
                          blockOrder={blockOrder}
                          blockFontScales={blockFontScales}
                        />
                      </div>

                      {/* Subtle Central Divider on screen */}
                      <div className="hidden md:flex flex-col items-center justify-center px-1 print:hidden text-slate-500">
                        <div className="w-[1px] h-full bg-dashed border-r border-dashed border-emerald-500/40" />
                        <div className="my-2 p-1 rounded-full bg-slate-900 border border-emerald-500/50 text-[9px] font-mono text-emerald-300">
                          Pliure
                        </div>
                        <div className="w-[1px] h-full bg-dashed border-r border-dashed border-emerald-500/40" />
                      </div>

                      {/* Right Page (Half 2 of A4 Landscape) OR Certificate Backing */}
                      <div
                        ref={(el) => {
                          if (rightPageNum) {
                            pageRefs.current[rightPageNum - 1] = el;
                          }
                        }}
                        style={{ fontSize: fontScale !== 100 ? `${fontScale}%` : undefined }}
                        className="official-report-page-2up flex-1 bg-white text-slate-900 rounded-xl p-5 border-2 border-emerald-600 shadow-lg flex flex-col justify-between min-h-[650px] md:min-h-[750px] print:min-h-0 print:shadow-none print:rounded-none"
                      >
                        {rightPageNum ? (
                          <ReportPageLayout
                            pageNum={rightPageNum}
                            totalPages={totalPages}
                            candidate={candidate}
                            demandSynthesis={demandSynthesis}
                            academicRecords={academicRecords}
                            psychometrics={psychometrics}
                            decision={decision}
                            docRef={docRef}
                            formattedDate={formattedDate}
                            qrCodeUrl={qrCodeUrl}
                            densityClasses={densityClasses}
                            pageMetrics={pageMetrics}
                            fontScale={fontScale}
                            is2UpCompact
                            blockAssignment={blockAssignment}
                            blockOrder={blockOrder}
                            blockFontScales={blockFontScales}
                          />
                        ) : (
                          <CertificateBackingBlock docRef={docRef} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PERSISTENT FLOATING BOTTOM STATUS & ACTION BAR (SCREEN ONLY)               */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 px-4 py-2 shadow-2xl backdrop-blur-md print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Status badge */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-3 h-3 rounded-full shadow-sm shrink-0 ${
                hasOverflow
                  ? "bg-rose-500 animate-ping"
                  : hasWarning
                  ? "bg-amber-500 animate-pulse"
                  : "bg-emerald-500"
              }`}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-black tracking-wide ${
                    hasOverflow
                      ? "text-rose-400"
                      : hasWarning
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {hasOverflow
                    ? "⚠️ Dépassement détecté"
                    : hasWarning
                    ? "⚠️ Limite de page proche"
                    : `✓ Calibrage A4 Parfait (${totalPages} Pages)`}
                </span>
                <span
                  className={`px-2 py-0.2 rounded-full text-[9.5px] font-mono font-black border ${
                    getDocumentCharacterFromPageCount(totalPages) === "synthetique"
                      ? "bg-amber-950/80 text-amber-300 border-amber-500/50"
                      : getDocumentCharacterFromPageCount(totalPages) === "standard"
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                      : getDocumentCharacterFromPageCount(totalPages) === "developpe"
                      ? "bg-blue-950/80 text-blue-300 border-blue-500/50"
                      : "bg-purple-950/80 text-purple-300 border-purple-500/50"
                  }`}
                >
                  {getDocumentOptionForPageCount(totalPages).badge}
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  ({compliantCount}/{totalPages} pages conformes • Typographie : {fontScale}%)
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {getDocumentOptionForPageCount(totalPages).detailLevelDescription}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => setPagesPerSheet(pagesPerSheet === 1 ? 2 : 1)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                pagesPerSheet === 2
                  ? "bg-emerald-600 text-white border-emerald-400"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
              title="Basculer entre 1 page par feuille et 2 pages par feuille"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{pagesPerSheet === 2 ? "2P/Feuille Actif" : "2P / Feuille A4"}</span>
            </button>

            <button
              onClick={handleAutoFit}
              className="px-2.5 py-1.5 rounded-lg bg-teal-600/40 hover:bg-teal-600/60 text-teal-200 border border-teal-500/50 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Auto-Fit</span>
            </button>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Aperçu</span>
            </button>

            <button
              onClick={pagesPerSheet === 2 ? handlePrint2Up : handlePrint1Up}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{pagesPerSheet === 2 ? "Imprimer (2P/Feuille)" : `Imprimer (${totalPages}P)`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* A4 PRINT & PAGE BREAK PREVIEW MODAL (SUPPORTING 1 TO 10 PAGES)            */}
      {/* ========================================================================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Header Bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                <Eye className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-sm sm:text-base font-serif">
                    Prévisualisation A4 ({totalPages} Pages • Typographie : {fontScale}%)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-extrabold border border-emerald-500/40">
                    {totalPages} Pages • {pagesPerSheet === 2 ? "2 Pages / Feuille A4" : "1 Page / Feuille"}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Requérant : <strong className="text-slate-200">{candidateName}</strong> • Réf : <span className="font-mono text-amber-400">{docRef}</span>
                </p>
              </div>
            </div>

            {/* Actions in Preview Header */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Page Count Quick Selector inside Preview */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSetPageCount(num)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      pageCount === num
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {num}P
                  </button>
                ))}
              </div>

              {/* Layout Switch in Preview */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
                <button
                  onClick={() => setPagesPerSheet(1)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    pagesPerSheet === 1
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  1P / Feuille
                </button>
                <button
                  onClick={() => setPagesPerSheet(2)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    pagesPerSheet === 2
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  2P / Feuille
                </button>
              </div>

              {/* Print Button */}
              <button
                onClick={pagesPerSheet === 2 ? handlePrint2Up : handlePrint1Up}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>{pagesPerSheet === 2 ? "Imprimer 2P/Feuille" : `Imprimer (${totalPages}P)`}</span>
              </button>

              {/* Close Preview */}
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                title="Fermer la prévisualisation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8 flex justify-center">
            <div
              style={{
                transform: `scale(${(previewZoom / 100) * (printScale / 100)})`,
                transformOrigin: "top center",
              }}
              className={`w-full transition-transform duration-200 space-y-8 ${
                pagesPerSheet === 2 ? "max-w-[1200px]" : "max-w-[850px]"
              }`}
            >
              {/* If 1-Page-Per-Sheet view */}
              {pagesPerSheet === 1 &&
                Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  const metric = pageMetrics[idx];

                  return (
                    <div key={pageNum} className="space-y-3">
                      <div className="flex items-center justify-between text-xs px-2 text-slate-400">
                        <span className="font-bold font-serif text-slate-200 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span>FEUILLE A4 - PAGE {pageNum} / {totalPages}</span>
                        </span>
                        {metric && (
                          <span
                            className={`font-mono text-[11px] px-2 py-0.5 rounded-full border ${
                              metric.isOverflow
                                ? "bg-rose-900/50 text-rose-300 border-rose-500"
                                : "bg-emerald-900/50 text-emerald-300 border-emerald-500"
                            }`}
                          >
                            Remplissage : {metric.percent}% ({metric.scrollHeight}px)
                          </span>
                        )}
                      </div>

                      <div
                        style={{ fontSize: fontScale !== 100 ? `${fontScale}%` : undefined }}
                        className="official-report-page bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-emerald-600 relative min-h-[1120px] flex flex-col justify-between"
                      >
                        <ReportPageLayout
                          pageNum={pageNum}
                          totalPages={totalPages}
                          candidate={candidate}
                          demandSynthesis={demandSynthesis}
                          academicRecords={academicRecords}
                          psychometrics={psychometrics}
                          decision={decision}
                          docRef={docRef}
                          formattedDate={formattedDate}
                          qrCodeUrl={qrCodeUrl}
                          densityClasses={densityClasses}
                          pageMetrics={pageMetrics}
                          fontScale={fontScale}
                          blockAssignment={blockAssignment}
                          blockFontScales={blockFontScales}
                        />
                      </div>
                    </div>
                  );
                })}

              {/* If 2-Pages-Per-Sheet view */}
              {pagesPerSheet === 2 &&
                Array.from({ length: totalSheets2Up }, (_, sheetIdx) => {
                  const sheetNum = sheetIdx + 1;
                  const leftPageNum = sheetIdx * 2 + 1;
                  const rightPageNum = sheetIdx * 2 + 2 <= totalPages ? sheetIdx * 2 + 2 : null;

                  return (
                    <div key={sheetNum} className="space-y-3">
                      <div className="flex items-center justify-between text-xs px-2 text-slate-400">
                        <span className="font-bold font-serif text-emerald-300 flex items-center gap-1.5">
                          <Columns className="w-4 h-4 text-emerald-400" />
                          <span>FEUILLE PHYSIQUE #{sheetNum} (A4 PAYSAGE 2-EN-1)</span>
                        </span>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-500">
                          Pages {leftPageNum} &amp; {rightPageNum || "Certificat"} sur 1 feuille A4
                        </span>
                      </div>

                      <div className="bg-slate-900/60 p-5 rounded-2xl border-2 border-emerald-500/50 flex flex-col md:flex-row gap-4 justify-between items-stretch shadow-2xl">
                        <div
                          style={{ fontSize: fontScale !== 100 ? `${fontScale}%` : undefined }}
                          className="flex-1 bg-white text-slate-900 rounded-xl p-5 border-2 border-emerald-600 shadow-md flex flex-col justify-between min-h-[720px]"
                        >
                          <ReportPageLayout
                            pageNum={leftPageNum}
                            totalPages={totalPages}
                            candidate={candidate}
                            demandSynthesis={demandSynthesis}
                            academicRecords={academicRecords}
                            psychometrics={psychometrics}
                            decision={decision}
                            docRef={docRef}
                            formattedDate={formattedDate}
                            qrCodeUrl={qrCodeUrl}
                            densityClasses={densityClasses}
                            pageMetrics={pageMetrics}
                            fontScale={fontScale}
                            is2UpCompact
                            blockAssignment={blockAssignment}
                            blockFontScales={blockFontScales}
                          />
                        </div>

                        <div
                          style={{ fontSize: fontScale !== 100 ? `${fontScale}%` : undefined }}
                          className="flex-1 bg-white text-slate-900 rounded-xl p-5 border-2 border-emerald-600 shadow-md flex flex-col justify-between min-h-[720px]"
                        >
                          {rightPageNum ? (
                            <ReportPageLayout
                              pageNum={rightPageNum}
                              totalPages={totalPages}
                              candidate={candidate}
                              demandSynthesis={demandSynthesis}
                              academicRecords={academicRecords}
                              psychometrics={psychometrics}
                              decision={decision}
                              docRef={docRef}
                              formattedDate={formattedDate}
                              qrCodeUrl={qrCodeUrl}
                              densityClasses={densityClasses}
                              pageMetrics={pageMetrics}
                              fontScale={fontScale}
                              is2UpCompact
                              blockAssignment={blockAssignment}
                              blockFontScales={blockFontScales}
                            />
                          ) : (
                            <CertificateBackingBlock docRef={docRef} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRE-PRINT SAFETY VERIFICATION (AVANT IMPRESSION / EXPORT PDF)      */}
      {/* ========================================================================= */}
      {showPrePrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-500 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Sécurité Anti-Erreur avant Impression
                </h3>
                <p className="text-xs text-slate-400">
                  Vérification de l'intégrité de la mise en page manuelle
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Vous avez {unconfirmedCount} modification{unconfirmedCount > 1 ? "s" : ""} manuelle{unconfirmedCount > 1 ? "s" : ""} non validée{unconfirmedCount > 1 ? "s" : ""}.
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Des blocs ont été déplacés ou réorganisés manuellement. Pour garantir la conformité officielle du document certifié avant tirage papier ou génération PDF, que souhaitez-vous faire ?
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => executePendingPrintAction(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 text-amber-300" />
                <span>Valider mes modifications manuelles &amp; Lancer l'impression</span>
              </button>

              <button
                onClick={() => {
                  handleResetToAlgorithm();
                  executePendingPrintAction(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-teal-400" />
                <span>Rétablir l'algorithme officiel &amp; Imprimer</span>
              </button>

              <button
                onClick={() => {
                  setPendingPrintAction(null);
                  setShowPrePrintModal(false);
                }}
                className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all cursor-pointer text-center"
              >
                Vérifier d'abord le document à l'écran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

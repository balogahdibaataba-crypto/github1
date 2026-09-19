import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Sliders,
  MoveHorizontal,
  Type,
  RotateCcw,
  Plus,
  Minus,
  Layers,
  GripVertical,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Info,
  Maximize2,
  Zap,
  Check,
  Undo2,
  Redo2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Award,
  BookOpen,
} from "lucide-react";
import {
  ReportBlockId,
  BlockPageAssignment,
  BlockFontScales,
  DEFAULT_BLOCK_ORDER,
  REPORT_BLOCK_DEFINITIONS,
  CustomizerMode,
  calculateDynamicPointNumbers,
  getBlockDisplayInfo,
  DOCUMENT_OPTIONS_LIST,
  getDocumentCharacterFromPageCount,
  getDocumentOptionForPageCount,
  getDocumentCharacterBadge,
  DocumentCharacterType,
} from "../../types/reportCustomizerTypes";
import { DensityModeType } from "../../types/reportTypes";

export interface InteractiveReportControlPanelProps {
  mode: CustomizerMode;
  onChangeMode: (mode: CustomizerMode) => void;
  totalPages: number;
  onChangeTotalPages: (pages: number) => void;
  densityMode: DensityModeType;
  onChangeDensityMode: (density: DensityModeType) => void;
  globalFontScale: number;
  onChangeGlobalFontScale: (scale: number) => void;
  blockAssignment: BlockPageAssignment;
  blockOrder?: ReportBlockId[];
  onMoveBlock: (blockId: ReportBlockId, targetPage: number) => void;
  onMoveBlockWithinPage?: (blockId: ReportBlockId, direction: "up" | "down") => void;
  onReorderBlock?: (
    blockId: ReportBlockId,
    targetPage: number,
    targetPlacement?: { relativeToBlockId: ReportBlockId; position: "before" | "after" }
  ) => void;
  blockFontScales: BlockFontScales;
  onChangeBlockFontScale: (blockId: ReportBlockId, scale: number) => void;
  onResetBlockFontScales: () => void;
  onApplyGlobalToAllBlocks: () => void;
  onResetToAlgorithm: () => void;
  isAutoTypography: boolean;
  onToggleAutoTypography: () => void;
  onConfirmChanges?: () => void;
  onCancelChanges?: () => void;
  hasUnconfirmedChanges?: boolean;
  unconfirmedCount?: number;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  askConfirmBeforeDrop?: boolean;
  onToggleAskConfirmBeforeDrop?: () => void;
}

export const InteractiveReportControlPanel: React.FC<InteractiveReportControlPanelProps> = ({
  mode,
  onChangeMode,
  totalPages,
  onChangeTotalPages,
  densityMode,
  onChangeDensityMode,
  globalFontScale,
  onChangeGlobalFontScale,
  blockAssignment,
  blockOrder = DEFAULT_BLOCK_ORDER,
  onMoveBlock,
  onMoveBlockWithinPage,
  onReorderBlock,
  blockFontScales,
  onChangeBlockFontScale,
  onResetBlockFontScales,
  onApplyGlobalToAllBlocks,
  onResetToAlgorithm,
  isAutoTypography,
  onToggleAutoTypography,
  onConfirmChanges,
  onCancelChanges,
  hasUnconfirmedChanges = false,
  unconfirmedCount = 0,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  askConfirmBeforeDrop = false,
  onToggleAskConfirmBeforeDrop,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [manualSubTab, setManualSubTab] = useState<"drag_drop" | "font_sliders">("drag_drop");
  const [draggedBlockId, setDraggedBlockId] = useState<ReportBlockId | null>(null);
  const [dragOverPage, setDragOverPage] = useState<number | null>(null);
  const [dragOverCardTarget, setDragOverCardTarget] = useState<{
    blockId: ReportBlockId;
    position: "before" | "after";
  } | null>(null);

  // Safety confirmation dialog state for manual moves
  const [pendingMove, setPendingMove] = useState<{
    blockId: ReportBlockId;
    sourcePage: number;
    targetPage: number;
    targetPlacement?: { relativeToBlockId: ReportBlockId; position: "before" | "after" };
    isDirectionMove?: "up" | "down";
  } | null>(null);

  // Compute dynamic point numbers in real time reflecting exact visual reading order
  const dynamicPointNumbers = useMemo(() => {
    return calculateDynamicPointNumbers(totalPages, blockAssignment, blockOrder);
  }, [totalPages, blockAssignment, blockOrder]);

  const requestMoveBlock = (blockId: ReportBlockId, targetPage: number) => {
    const sourcePage = blockAssignment[blockId] || 1;
    if (askConfirmBeforeDrop && sourcePage !== targetPage) {
      setPendingMove({ blockId, sourcePage, targetPage });
      return;
    }
    onMoveBlock(blockId, targetPage);
  };

  const requestReorderBlock = (
    blockId: ReportBlockId,
    targetPage: number,
    targetPlacement?: { relativeToBlockId: ReportBlockId; position: "before" | "after" }
  ) => {
    const sourcePage = blockAssignment[blockId] || 1;
    if (askConfirmBeforeDrop) {
      setPendingMove({ blockId, sourcePage, targetPage, targetPlacement });
      return;
    }
    if (onReorderBlock) {
      onReorderBlock(blockId, targetPage, targetPlacement);
    } else {
      onMoveBlock(blockId, targetPage);
    }
  };

  const confirmPendingMove = () => {
    if (!pendingMove) return;
    const { blockId, targetPage, targetPlacement, isDirectionMove } = pendingMove;
    if (isDirectionMove && onMoveBlockWithinPage) {
      onMoveBlockWithinPage(blockId, isDirectionMove);
    } else if (onReorderBlock) {
      onReorderBlock(blockId, targetPage, targetPlacement);
    } else {
      onMoveBlock(blockId, targetPage);
    }
    setPendingMove(null);
  };

  const cancelPendingMove = () => {
    setPendingMove(null);
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, blockId: ReportBlockId) => {
    e.dataTransfer.setData("text/plain", blockId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedBlockId(blockId);
  };

  const handleDragOverColumn = (e: React.DragEvent, pageNum: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverPage !== pageNum) {
      setDragOverPage(pageNum);
    }
  };

  const handleDragOverCard = (e: React.DragEvent, targetBlockId: ReportBlockId) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? "before" : "after";

    setDragOverCardTarget({ blockId: targetBlockId, position });
  };

  const handleCardDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setDragOverCardTarget(null);
  };

  const handleColumnDragLeave = () => {
    setDragOverPage(null);
  };

  const handleDropOnColumn = (e: React.DragEvent, targetPage: number) => {
    e.preventDefault();
    setDragOverPage(null);
    setDragOverCardTarget(null);
    const blockId = (e.dataTransfer.getData("text/plain") || draggedBlockId) as ReportBlockId;
    if (blockId) {
      if (onReorderBlock) {
        onReorderBlock(blockId, targetPage);
      } else {
        onMoveBlock(blockId, targetPage);
      }
      setDraggedBlockId(null);
    }
  };

  const handleDropOnCard = (e: React.DragEvent, targetBlockId: ReportBlockId, targetPage: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPage(null);
    const activeTarget = dragOverCardTarget;
    setDragOverCardTarget(null);
    const blockId = (e.dataTransfer.getData("text/plain") || draggedBlockId) as ReportBlockId;

    if (blockId && blockId !== targetBlockId) {
      if (onReorderBlock) {
        onReorderBlock(blockId, targetPage, activeTarget || { relativeToBlockId: targetBlockId, position: "before" });
      } else {
        onMoveBlock(blockId, targetPage);
      }
      setDraggedBlockId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
    setDragOverPage(null);
    setDragOverCardTarget(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "civil":
        return "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
      case "academic":
        return "bg-blue-950/60 border-blue-500/40 text-blue-300";
      case "psychometric":
        return "bg-purple-950/60 border-purple-500/40 text-purple-300";
      case "decision":
        return "bg-amber-950/60 border-amber-500/40 text-amber-300";
      case "strategic":
        return "bg-teal-950/60 border-teal-500/40 text-teal-300";
      case "legal":
        return "bg-rose-950/60 border-rose-500/40 text-rose-300";
      default:
        return "bg-slate-900 border-slate-700 text-slate-300";
    }
  };

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md border-2 border-emerald-600/70 rounded-2xl shadow-2xl p-3 sm:p-4 mb-6 transition-all text-slate-100">
      {/* ------------------------------------------------------------------- */}
      {/* TOP HEADER: Mode Toggle Switch & Quick Summary                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md border border-emerald-400/50">
            {mode === "auto" ? <Sparkles className="w-5 h-5" /> : <Sliders className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Panneau de Contrôle &amp; Mise en Page A4
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  mode === "auto"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}
              >
                {mode === "auto" ? "Mode Automatique (Algorithme)" : "Mode Manuel (Personnalisé)"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {mode === "auto"
                ? "L'algorithme équilibre automatiquement la répartition des points et la typographie sur chaque page A4."
                : "Glissez-déposez les blocs entre les pages et ajustez la taille de police individuelle de chaque section."}
            </p>
          </div>
        </div>

        {/* Primary Mode Toggle Button Group */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onChangeMode("auto")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === "auto"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mode Automatique</span>
          </button>

          <button
            onClick={() => onChangeMode("manual")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === "manual"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30 border border-amber-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Mode Manuel</span>
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors ml-1 cursor-pointer"
            title={isCollapsed ? "Déplier le panneau" : "Replier le panneau"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* EXPANDED PANEL CONTENT                                               */}
      {/* ------------------------------------------------------------------- */}
      {!isCollapsed && (
        <div className="mt-3 space-y-4 animate-in fade-in duration-200">
          {/* =============================================================== */}
          {/* SECTION : OPTIONS DU DOCUMENT (SYNTHÉTIQUE / STANDARD / DÉVELOPPÉ) */}
          {/* =============================================================== */}
          <div className="bg-slate-950/90 border-2 border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-100">
                      Options &amp; Formats de Document d'Orientation
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
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
                  </div>
                  <p className="text-[10.5px] text-slate-400">
                    Sélectionnez le degré de développement du rapport. La structure, la densité et la répartition s'adaptent instantanément au nombre de pages.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  Volume actuel : <strong>{totalPages} Page{totalPages > 1 ? "s" : ""} A4</strong>
                </span>
              </div>
            </div>

            {/* 4 Interactive Option Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              {/* Option 1: Synthétique (1-2 P) */}
              <div
                className={`rounded-xl p-2.5 transition-all border flex flex-col justify-between ${
                  getDocumentCharacterFromPageCount(totalPages) === "synthetique"
                    ? "bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-950/50 ring-1 ring-amber-500/40"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>1. Synthétique</span>
                    </div>
                    <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-200 border border-amber-600/40">
                      1 à 2 Pages
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug line-clamp-2">
                    Fiche résumé &amp; synthèse décisionnelle express. Condensation maximale pour consultation rapide.
                  </p>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                  <span className="text-[9.5px] text-slate-400 font-medium">Pages :</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onChangeTotalPages(1)}
                      className={`px-2 py-1 rounded text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                        totalPages === 1
                          ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                      title="Format Synthétique 1 Page A4 (Fiche Express)"
                    >
                      1P Flash
                    </button>
                    <button
                      onClick={() => onChangeTotalPages(2)}
                      className={`px-2 py-1 rounded text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                        totalPages === 2
                          ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                      title="Format Synthétique 2 Pages A4 (Synthèse Exécutive)"
                    >
                      2P Exécutif
                    </button>
                  </div>
                </div>
              </div>

              {/* Option 2: Standard Homologué (3 P) */}
              <div
                className={`rounded-xl p-2.5 transition-all border flex flex-col justify-between ${
                  getDocumentCharacterFromPageCount(totalPages) === "standard"
                    ? "bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/40"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>2. Standard Homologué</span>
                    </div>
                    <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-200 border border-emerald-600/40">
                      ★ Référence (3P)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug line-clamp-2">
                    Format officiel certifié de référence (Dr BALOGAH). Équilibre parfait des 12 points et décision d'homologation.
                  </p>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                  <span className="text-[9.5px] text-slate-400 font-medium">Pages :</span>
                  <button
                    onClick={() => onChangeTotalPages(3)}
                    className={`w-full px-2.5 py-1 rounded text-[10.5px] font-mono font-bold transition-all cursor-pointer text-center ${
                      totalPages === 3
                        ? "bg-emerald-500 text-slate-950 font-black shadow-xs"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                    title="Format Standard Homologué 3 Pages A4"
                  >
                    3P Standard Officiel
                  </button>
                </div>
              </div>

              {/* Option 3: Développé (4-5 P) */}
              <div
                className={`rounded-xl p-2.5 transition-all border flex flex-col justify-between ${
                  getDocumentCharacterFromPageCount(totalPages) === "developpe"
                    ? "bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-950/50 ring-1 ring-blue-500/40"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <span>3. Développé</span>
                    </div>
                    <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-blue-950/70 text-blue-200 border border-blue-600/40">
                      4 à 5 Pages
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug line-clamp-2">
                    Analyse approfondie des compétences, filières cibles détaillées et recommandations pédagogiques enrichies.
                  </p>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                  <span className="text-[9.5px] text-slate-400 font-medium">Pages :</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onChangeTotalPages(4)}
                      className={`px-2 py-1 rounded text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                        totalPages === 4
                          ? "bg-blue-500 text-slate-950 font-black shadow-xs"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                      title="Format Développé 4 Pages A4 (Approfondi)"
                    >
                      4P Développé
                    </button>
                    <button
                      onClick={() => onChangeTotalPages(5)}
                      className={`px-2 py-1 rounded text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                        totalPages === 5
                          ? "bg-blue-500 text-slate-950 font-black shadow-xs"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                      title="Format Développé 5 Pages A4 (Stratégique)"
                    >
                      5P Stratégique
                    </button>
                  </div>
                </div>
              </div>

              {/* Option 4: Exhaustif & Intégral (6-10 P) */}
              <div
                className={`rounded-xl p-2.5 transition-all border flex flex-col justify-between ${
                  getDocumentCharacterFromPageCount(totalPages) === "exhaustif"
                    ? "bg-purple-950/40 border-purple-500/80 shadow-lg shadow-purple-950/50 ring-1 ring-purple-500/40"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                      <span>4. Exhaustif</span>
                    </div>
                    <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-purple-950/70 text-purple-200 border border-purple-600/40">
                      6 à 10 Pages
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug line-clamp-2">
                    Master dossier complet avec observatoire de l'emploi détaillé, chronogrammes et plan pluriannuel.
                  </p>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                  <span className="text-[9.5px] text-slate-400 font-medium">Pages :</span>
                  <div className="flex items-center gap-1">
                    {[6, 8, 10].map((pCnt) => (
                      <button
                        key={pCnt}
                        onClick={() => onChangeTotalPages(pCnt)}
                        className={`px-1.5 py-1 rounded text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                          totalPages === pCnt
                            ? "bg-purple-500 text-slate-950 font-black shadow-xs"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                        title={`Format Exhaustif ${pCnt} Pages A4`}
                      >
                        {pCnt}P
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* =============================================================== */}
          {/* VIEW 1: MODE AUTOMATIQUE                                        */}
          {/* =============================================================== */}
          {mode === "auto" && (
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-300">
                    Répartition intelligente active sur {totalPages} page{totalPages > 1 ? "s" : ""} A4
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    (Densité {densityMode} • Typo {globalFontScale}%)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Page Count Stepper */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                    <span className="text-[11px] text-slate-400 font-semibold">Pages :</span>
                    {[1, 2, 3, 4, 5].map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() => onChangeTotalPages(cnt)}
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                          totalPages === cnt
                            ? "bg-emerald-600 text-white font-black shadow-xs"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {cnt}P
                      </button>
                    ))}
                  </div>

                  {/* Density Mode */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
                    {(["ultra", "compact", "standard"] as DensityModeType[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => onChangeDensityMode(d)}
                        className={`px-2 py-1 rounded capitalize font-medium transition-all cursor-pointer ${
                          densityMode === d
                            ? "bg-emerald-600 text-white font-bold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {d === "ultra_compact"
                          ? "Ultra-Compact"
                          : d === "compact"
                          ? "Compact"
                          : d === "balanced"
                          ? "Équilibré"
                          : "Spacieux"}
                      </button>
                    ))}
                  </div>

                  {/* Switch to Manual CTA */}
                  <button
                    onClick={() => onChangeMode("manual")}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Personnaliser manuellement</span>
                  </button>
                </div>
              </div>

              {/* Automatic Distribution Visual Preview Pill Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
                {Array.from({ length: totalPages }, (_, idx) => {
                  const pNum = idx + 1;
                  const blocksOnPage = REPORT_BLOCK_DEFINITIONS.filter(
                    (b) => blockAssignment[b.id] === pNum
                  );
                  return (
                    <div
                      key={pNum}
                      className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-800 text-[11px]">
                        <span className="font-bold text-emerald-400 font-mono">Page A4 #{pNum}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {blocksOnPage.length} section{blocksOnPage.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {blocksOnPage.map((blk) => (
                          <div
                            key={blk.id}
                            className="text-[10px] truncate px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-medium"
                            title={blk.label}
                          >
                            {blk.shortLabel}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 2: MODE MANUEL                                             */}
          {/* =============================================================== */}
          {mode === "manual" && (
            <div className="space-y-3">
              {/* =========================================================== */}
              {/* BARRE DE VALIDATION & ANNULATION DES MODIFICATIONS MANUELLES */}
              {/* =========================================================== */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  {hasUnconfirmedChanges ? (
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Modifications manuelles en cours ({unconfirmedCount} modif{unconfirmedCount > 1 ? "s" : ""})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          N'oubliez pas de valider vos changements pour les verrouiller avant l'impression officielle.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-300">
                          Disposition actuelle validée et prête pour l'impression
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Toutes les positions de points et polices sont conformes et prêtes.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Safety Actions: Undo / Redo / Revert / Confirm */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {onUndo && (
                    <button
                      onClick={onUndo}
                      disabled={!canUndo}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title="Annuler la dernière action de déplacement (Ctrl+Z)"
                    >
                      <Undo2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Annuler (Ctrl+Z)</span>
                    </button>
                  )}

                  {onRedo && (
                    <button
                      onClick={onRedo}
                      disabled={!canRedo}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title="Rétablir l'action (Ctrl+Y)"
                    >
                      <Redo2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rétablir (Ctrl+Y)</span>
                    </button>
                  )}

                  {hasUnconfirmedChanges && onCancelChanges && (
                    <button
                      onClick={onCancelChanges}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      title="Annuler toutes les modifications non validées et rétablir la dernière version confirmée"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                      <span>Annuler les modifications</span>
                    </button>
                  )}

                  {hasUnconfirmedChanges && onConfirmChanges && (
                    <button
                      onClick={onConfirmChanges}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer animate-pulse"
                      title="Valider et verrouiller cette disposition pour l'impression"
                    >
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>Valider &amp; Verrouiller</span>
                    </button>
                  )}

                  {onToggleAskConfirmBeforeDrop && (
                    <button
                      onClick={onToggleAskConfirmBeforeDrop}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 transition-all cursor-pointer ${
                        askConfirmBeforeDrop
                          ? "bg-indigo-950/80 border-indigo-500/50 text-indigo-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                      title="Demander une confirmation explicite avant de déplacer un bloc"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{askConfirmBeforeDrop ? "Sécurité active" : "Sécurité anti-erreur"}</span>
                    </button>
                  )}

                  <button
                    onClick={onResetToAlgorithm}
                    className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                    title="Réinitialiser l'attribution des blocs et la taille des polices selon l'algorithme"
                  >
                    <RotateCcw className="w-3 h-3 text-teal-400" />
                    <span>Rétablir l'Algorithme</span>
                  </button>
                </div>
              </div>

              {/* Sub-Tabs: 1. Drag & Drop Pages vs 2. Font Sliders */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setManualSubTab("drag_drop")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      manualSubTab === "drag_drop"
                        ? "bg-emerald-600 text-white shadow-xs border border-emerald-400"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    <MoveHorizontal className="w-3.5 h-3.5" />
                    <span>1. Glisser-Déposer les Blocs entre Pages A4</span>
                  </button>

                  <button
                    onClick={() => setManualSubTab("font_sliders")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      manualSubTab === "font_sliders"
                        ? "bg-amber-500 text-slate-950 font-black shadow-xs border border-amber-400"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>2. Curseurs de Taille de Police par Section</span>
                  </button>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* SUBTAB A: INTERACTIVE DRAG & DROP MULTI-COLUMN BOARD        */}
              {/* ----------------------------------------------------------- */}
              {manualSubTab === "drag_drop" && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1 gap-2">
                    <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <strong>Numérotation Automatique :</strong> Déplacez un point vers le haut ou une autre page, les numéros (Point 1, 2, 3...) s'adaptent instantanément !
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {totalPages} Pages A4 Disponibles
                    </span>
                  </div>

                  {/* Multi-Column Drag & Drop Canvas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {Array.from({ length: totalPages }, (_, idx) => {
                      const pageNum = idx + 1;
                      const pageBlockIds = blockOrder.filter(
                        (id) => blockAssignment[id] === pageNum
                      );
                      const isColumnDropTarget = dragOverPage === pageNum;

                      return (
                        <div
                          key={pageNum}
                          onDragOver={(e) => handleDragOverColumn(e, pageNum)}
                          onDragLeave={handleColumnDragLeave}
                          onDrop={(e) => handleDropOnColumn(e, pageNum)}
                          className={`rounded-xl border-2 transition-all p-3 flex flex-col min-h-[240px] ${
                            isColumnDropTarget
                              ? "bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.01]"
                              : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          {/* Column Header */}
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="font-mono font-black text-xs text-slate-200">
                                Page A4 #{pageNum}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono">
                              {pageBlockIds.length} point{pageBlockIds.length > 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* Block Cards Container */}
                          <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[320px] pr-0.5">
                            {pageBlockIds.length === 0 ? (
                              <div className="h-full flex items-center justify-center p-4 border-2 border-dashed border-slate-800 rounded-lg text-slate-500 text-[11px] text-center">
                                Déposez un bloc ici pour l'afficher sur la page #{pageNum}
                              </div>
                            ) : (
                              pageBlockIds.map((blockId, indexOnPage) => {
                                const isBeingDragged = draggedBlockId === blockId;
                                const customScale = blockFontScales[blockId] || globalFontScale;
                                const dynPoint = dynamicPointNumbers[blockId];
                                const displayInfo = getBlockDisplayInfo(blockId, dynPoint);
                                const isDropTargetCard = dragOverCardTarget?.blockId === blockId;
                                const dropPos = dragOverCardTarget?.position;

                                return (
                                  <div
                                    key={blockId}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, blockId)}
                                    onDragOver={(e) => handleDragOverCard(e, blockId)}
                                    onDragLeave={handleCardDragLeave}
                                    onDrop={(e) => handleDropOnCard(e, blockId, pageNum)}
                                    onDragEnd={handleDragEnd}
                                    className={`relative p-2 rounded-lg border flex flex-col gap-1 cursor-grab active:cursor-grabbing transition-all ${
                                      isBeingDragged
                                        ? "opacity-40 scale-95 border-dashed border-amber-400 bg-amber-950/20"
                                        : `${getCategoryColor(displayInfo.category)} hover:shadow-md`
                                    } ${
                                      isDropTargetCard && dropPos === "before"
                                        ? "border-t-2 border-t-emerald-400 pt-3"
                                        : ""
                                    } ${
                                      isDropTargetCard && dropPos === "after"
                                        ? "border-b-2 border-b-emerald-400 pb-3"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <div className="flex items-center gap-1.5 overflow-hidden">
                                        <GripVertical className="w-3.5 h-3.5 opacity-60 shrink-0" />
                                        {dynPoint !== undefined && (
                                          <span className="px-1.5 py-0.2 rounded bg-emerald-900/90 text-emerald-200 font-mono text-[9px] font-black border border-emerald-400/50 shrink-0">
                                            P#{dynPoint}
                                          </span>
                                        )}
                                        <span className="text-[11px] font-bold truncate">
                                          {displayInfo.shortLabel}
                                        </span>
                                      </div>

                                      {/* Intra-page (Up/Down) & Inter-page (Left/Right) controls */}
                                      <div className="flex items-center gap-0.5 shrink-0">
                                        {onMoveBlockWithinPage && (
                                          <>
                                            <button
                                              disabled={indexOnPage === 0}
                                              onClick={() => onMoveBlockWithinPage(blockId, "up")}
                                              className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-amber-300 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                                              title="Monter (Prendra un numéro de point inférieur)"
                                            >
                                              <ArrowUp className="w-2.5 h-2.5" />
                                            </button>
                                            <button
                                              disabled={indexOnPage === pageBlockIds.length - 1}
                                              onClick={() => onMoveBlockWithinPage(blockId, "down")}
                                              className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-amber-300 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                                              title="Descendre (Prendra un numéro de point supérieur)"
                                            >
                                              <ArrowDown className="w-2.5 h-2.5" />
                                            </button>
                                          </>
                                        )}
                                        <button
                                          disabled={pageNum <= 1}
                                          onClick={() => onMoveBlock(blockId, pageNum - 1)}
                                          className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ml-0.5"
                                          title="Déplacer vers la page précédente"
                                        >
                                          <ChevronLeft className="w-3 h-3" />
                                        </button>
                                        <span className="text-[9px] font-mono text-slate-400 px-0.5">
                                          P{pageNum}
                                        </span>
                                        <button
                                          disabled={pageNum >= totalPages}
                                          onClick={() => onMoveBlock(blockId, pageNum + 1)}
                                          className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                          title="Déplacer vers la page suivante"
                                        >
                                          <ChevronRight className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Typography Badge for this block */}
                                    <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                                      <span className="truncate">{displayInfo.description}</span>
                                      <span className="font-mono font-bold text-amber-300 shrink-0">
                                        {customScale}%
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* SUBTAB B: PER-SECTION FONT SIZE SLIDERS                     */}
              {/* ----------------------------------------------------------- */}
              {manualSubTab === "font_sliders" && (
                <div className="space-y-3 bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
                  {/* Global & Multi-Section Controls Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-bold text-slate-200">
                          Curseurs de Taille de Police par Section (de 50% à 130%)
                        </span>
                        <p className="text-[10px] text-slate-400">
                          Diminuez une section trop longue en dessous de 80% pour la faire rentrer sans déborder.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={onApplyGlobalToAllBlocks}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-600/30 text-amber-300 border border-slate-700 text-xs font-bold cursor-pointer transition-colors"
                        title="Appliquer la taille globale (actuelle) à toutes les sections"
                      >
                        Appliquer Typo Globale ({globalFontScale}%) Partout
                      </button>

                      <button
                        onClick={onResetBlockFontScales}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium cursor-pointer transition-colors"
                        title="Remettre toutes les sections à 100%"
                      >
                        Toutes à 100%
                      </button>
                    </div>
                  </div>

                  {/* Section Sliders Grid (In sequential reading order) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
                    {blockOrder.map((blockId) => {
                      const scale = blockFontScales[blockId] || 100;
                      const assignedPage = blockAssignment[blockId] || 1;
                      const dynPoint = dynamicPointNumbers[blockId];
                      const displayInfo = getBlockDisplayInfo(blockId, dynPoint);

                      return (
                        <div
                          key={blockId}
                          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-2.5 space-y-2 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  scale < 80
                                    ? "bg-amber-400"
                                    : scale > 105
                                    ? "bg-blue-400"
                                    : "bg-emerald-400"
                                }`}
                              />
                              {dynPoint !== undefined && (
                                <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">
                                  P#{dynPoint}
                                </span>
                              )}
                              <span className="text-xs font-bold text-slate-200 truncate">
                                {displayInfo.shortLabel}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 font-mono text-emerald-300 border border-slate-800">
                                Page {assignedPage}
                              </span>
                              <span className="text-xs font-mono font-black text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30 min-w-[48px] text-center">
                                {scale}%
                              </span>
                            </div>
                          </div>

                          {/* Range Slider */}
                          <div className="space-y-1">
                            <input
                              type="range"
                              min="50"
                              max="130"
                              step="1"
                              value={scale}
                              onChange={(e) =>
                                onChangeBlockFontScale(blockId, parseInt(e.target.value, 10))
                              }
                              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                              <span>50% (Ultra-compact)</span>
                              <span>100%</span>
                              <span>130%</span>
                            </div>
                          </div>

                          {/* Quick Step Buttons & Presets */}
                          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/80">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  onChangeBlockFontScale(blockId, Math.max(50, scale - 5))
                                }
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold cursor-pointer"
                                title="Diminuer de 5%"
                              >
                                -5%
                              </button>
                              <button
                                onClick={() =>
                                  onChangeBlockFontScale(blockId, Math.max(50, scale - 2))
                                }
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold cursor-pointer"
                                title="Diminuer de 2%"
                              >
                                -2%
                              </button>
                              <button
                                onClick={() =>
                                  onChangeBlockFontScale(blockId, Math.min(130, scale + 2))
                                }
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold cursor-pointer"
                                title="Augmenter de 2%"
                              >
                                +2%
                              </button>
                              <button
                                onClick={() =>
                                  onChangeBlockFontScale(blockId, Math.min(130, scale + 5))
                                }
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold cursor-pointer"
                                title="Augmenter de 5%"
                              >
                                +5%
                              </button>
                            </div>

                            {/* Preset Pills */}
                            <div className="flex items-center gap-1">
                              {[60, 75, 90, 100].map((preset) => (
                                <button
                                  key={preset}
                                  onClick={() => onChangeBlockFontScale(blockId, preset)}
                                  className={`px-1 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-colors ${
                                    scale === preset
                                      ? "bg-amber-500 text-slate-950 font-bold"
                                      : "bg-slate-800 text-slate-400 hover:text-white"
                                  }`}
                                >
                                  {preset}%
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ANTI-ERROR MOVE CONFIRMATION PROMPT                          */}
      {/* =================================================================== */}
      {pendingMove && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-5 max-w-md w-full shadow-2xl text-white space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">
                  Confirmation du déplacement
                </h4>
                <p className="text-xs text-slate-400">
                  Sécurité active contre les manipulations accidentelles
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
              <div className="text-slate-300">
                Voulez-vous déplacer le point / bloc :
              </div>
              <div className="font-bold text-emerald-300 text-sm">
                {getBlockDisplayInfo(pendingMove.blockId).baseTitle}
              </div>
              <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Page {pendingMove.sourcePage}
                </span>
                <span className="text-amber-400 font-bold">➔</span>
                <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 font-bold border border-emerald-500/40">
                  Page {pendingMove.targetPage}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                La numérotation automatique des points (Point 1, 2, 3...) s'adaptera immédiatement dans le nouvel ordre de lecture.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={cancelPendingMove}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-all"
              >
                Annuler
              </button>
              <button
                onClick={confirmPendingMove}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4 text-amber-300" />
                <span>Confirmer le déplacement</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

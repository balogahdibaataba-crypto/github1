import React, { useMemo } from "react";
import {
  ReportBlockId,
  DEFAULT_BLOCK_ORDER,
  BlockPageAssignment,
  calculateDynamicPointNumbers,
  getBlockDisplayInfo,
} from "../../types/reportCustomizerTypes";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Minus,
  MoveHorizontal,
  Plus,
  RotateCcw,
  Sparkles,
  Type,
  X,
  Check,
  Undo2,
  Redo2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface ReportBlockOrganizerProps {
  totalPages: number;
  blockAssignment: BlockPageAssignment;
  blockOrder?: ReportBlockId[];
  onMoveBlock: (blockId: ReportBlockId, targetPage: number) => void;
  onMoveBlockWithinPage?: (blockId: ReportBlockId, direction: "up" | "down") => void;
  onResetToDefault: () => void;
  fontScale: number;
  onChangeFontScale: (scale: number) => void;
  onClose?: () => void;
  onConfirmChanges?: () => void;
  onCancelChanges?: () => void;
  hasUnconfirmedChanges?: boolean;
  unconfirmedCount?: number;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const ReportBlockOrganizer: React.FC<ReportBlockOrganizerProps> = ({
  totalPages,
  blockAssignment,
  blockOrder = DEFAULT_BLOCK_ORDER,
  onMoveBlock,
  onMoveBlockWithinPage,
  onResetToDefault,
  fontScale,
  onChangeFontScale,
  onClose,
  onConfirmChanges,
  onCancelChanges,
  hasUnconfirmedChanges = false,
  unconfirmedCount = 0,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  const dynamicPointNumbers = useMemo(() => {
    return calculateDynamicPointNumbers(totalPages, blockAssignment, blockOrder);
  }, [totalPages, blockAssignment, blockOrder]);

  return (
    <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 text-white shadow-2xl space-y-4">
      {/* Header with Title and Close */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
            <MoveHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-emerald-400 font-serif flex items-center gap-1.5">
              Organiseur &amp; Répartition Manuelle des Points du Rapport
            </h3>
            <p className="text-[11px] text-slate-300">
              Déplacez les points d'une page à une autre et réordonnez-les : la numérotation des points (Point 1, 2, 3...) se met à jour automatiquement !
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetToDefault}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
            title="Rétablir la répartition et l'ordre recommandés par l'algorithme"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Répartition par Défaut</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation & Cancellation Bar (Anti-Error Safety) */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          {hasUnconfirmedChanges ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{unconfirmedCount} modification(s) en attente de confirmation</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mise en page validée et prête pour l'impression</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onUndo && (
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs text-slate-300 font-semibold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
              title="Annuler le dernier déplacement (Ctrl+Z)"
            >
              <Undo2 className="w-3 h-3 text-amber-400" />
              <span>Annuler (Ctrl+Z)</span>
            </button>
          )}

          {onRedo && (
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs text-slate-300 font-semibold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
              title="Rétablir l'action (Ctrl+Y)"
            >
              <Redo2 className="w-3 h-3 text-amber-400" />
              <span>Rétablir (Ctrl+Y)</span>
            </button>
          )}

          {hasUnconfirmedChanges && onCancelChanges && (
            <button
              onClick={onCancelChanges}
              className="px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 border border-rose-600/60 text-rose-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Annuler toutes les modifications manuelles non confirmées"
            >
              <RotateCcw className="w-3 h-3 text-rose-400" />
              <span>Annuler les modifications</span>
            </button>
          )}

          {hasUnconfirmedChanges && onConfirmChanges && (
            <button
              onClick={onConfirmChanges}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              title="Valider et verrouiller cette disposition pour l'impression"
            >
              <Check className="w-3.5 h-3.5 text-amber-300" />
              <span>Confirmer &amp; Valider</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Point Numbering Explanatory Banner */}
      <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-200">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Numérotation Automatique Dynamique :</strong> Dès qu'un point est déplacé vers le haut ou vers une page antérieure, tous les numéros de points s'adaptent immédiatement dans le nouvel ordre de lecture.
        </span>
      </div>


      {/* Font Size Fine Stepper Row with Extended Range (<80% supported down to 50%) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-200">
              Ajustement de la Taille des Lettres (Typographie de 50% à 130%) :
            </span>
            <p className="text-[10px] text-slate-400">
              Vous pouvez diminuer la taille en dessous de 80% (jusqu'à 50%) pour compacter le texte et éviter tout débordement A4.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => onChangeFontScale(Math.max(50, fontScale - 5))}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-600/30 text-amber-300 border border-slate-700 flex items-center gap-0.5 text-xs font-bold transition-all cursor-pointer"
              title="Diminuer fortement (-5%)"
            >
              <Minus className="w-3 h-3" />
              <span>-5%</span>
            </button>

            <button
              onClick={() => onChangeFontScale(Math.max(50, fontScale - 2))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600/30 text-amber-300 border border-slate-700 flex items-center gap-0.5 text-xs font-bold transition-all cursor-pointer"
              title="Diminuer la taille des lettres (-2%)"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>-2%</span>
            </button>

            <span className="px-3 py-1 bg-slate-900 border border-amber-500/40 rounded-lg text-amber-300 font-mono font-black text-xs min-w-[54px] text-center">
              {fontScale}%
            </span>

            <button
              onClick={() => onChangeFontScale(Math.min(130, fontScale + 2))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600/30 text-amber-300 border border-slate-700 flex items-center gap-0.5 text-xs font-bold transition-all cursor-pointer"
              title="Augmenter la taille des lettres (+2%)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+2%</span>
            </button>

            <button
              onClick={() => onChangeFontScale(Math.min(130, fontScale + 5))}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-600/30 text-amber-300 border border-slate-700 flex items-center gap-0.5 text-xs font-bold transition-all cursor-pointer"
              title="Augmenter fortement (+5%)"
            >
              <Plus className="w-3 h-3" />
              <span>+5%</span>
            </button>
          </div>

          {/* Quick Preset Buttons (including < 80% options) */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[9px] text-slate-400 mr-1">Raccourcis :</span>
            {[55, 65, 70, 75, 80, 85, 92, 100].map((preset) => (
              <button
                key={preset}
                onClick={() => onChangeFontScale(preset)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                  fontScale === preset
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-xs"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white"
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Pages and Assigned Blocks in Sequential Order */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
        {Array.from({ length: totalPages }, (_, idx) => {
          const pageNum = idx + 1;
          const pageBlockIds = blockOrder.filter(
            (id) => (blockAssignment[id] || 1) === pageNum
          );

          return (
            <div
              key={pageNum}
              className="bg-slate-950 border-2 border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2"
            >
              {/* Page Title */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider">
                  Feuille A4 #{pageNum}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {pageBlockIds.length} point{pageBlockIds.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Block List inside this Page */}
              <div className="space-y-1.5 min-h-[140px] flex-1">
                {pageBlockIds.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-3 text-center border-2 border-dashed border-slate-800 rounded-lg text-slate-500 text-[11px]">
                    Feuille vide (Déplacez des points ici)
                  </div>
                ) : (
                  pageBlockIds.map((blockId, blockIndexOnPage) => {
                    const dynPoint = dynamicPointNumbers[blockId];
                    const displayInfo = getBlockDisplayInfo(blockId, dynPoint);

                    return (
                      <div
                        key={blockId}
                        className="bg-slate-900 hover:bg-slate-850 border border-slate-700/80 rounded-lg p-2 flex items-center justify-between gap-1.5 transition-all text-xs"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <GripVertical className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <div className="flex items-center gap-1 overflow-hidden">
                            {dynPoint !== undefined && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40 shrink-0">
                                P#{dynPoint}
                              </span>
                            )}
                            <span className="font-semibold text-slate-200 truncate text-[11px]">
                              {displayInfo.shortLabel}
                            </span>
                          </div>
                        </div>

                        {/* Intra-page reordering (Up/Down) & Inter-page moving (Left/Right) */}
                        <div className="flex items-center gap-1 shrink-0">
                          {onMoveBlockWithinPage && (
                            <>
                              <button
                                onClick={() => onMoveBlockWithinPage(blockId, "up")}
                                disabled={blockIndexOnPage === 0}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-amber-300 cursor-pointer transition-colors"
                                title="Monter dans cette page (Prendra un numéro de point inférieur)"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onMoveBlockWithinPage(blockId, "down")}
                                disabled={blockIndexOnPage === pageBlockIds.length - 1}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-amber-300 cursor-pointer transition-colors"
                                title="Descendre dans cette page (Prendra un numéro de point supérieur)"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => onMoveBlock(blockId, pageNum - 1)}
                            disabled={pageNum <= 1}
                            className="p-1 rounded bg-slate-800 hover:bg-emerald-700 disabled:opacity-20 text-slate-300 hover:text-white cursor-pointer transition-colors"
                            title="Déplacer vers la page précédente"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onMoveBlock(blockId, pageNum + 1)}
                            disabled={pageNum >= totalPages}
                            className="p-1 rounded bg-slate-800 hover:bg-emerald-700 disabled:opacity-20 text-slate-300 hover:text-white cursor-pointer transition-colors"
                            title="Déplacer vers la page suivante"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
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
  );
};

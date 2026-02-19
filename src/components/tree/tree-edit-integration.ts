export interface HistoryAPI {
  back: () => void;
  forward: () => void;
  canBack: () => boolean;
  canForward: () => boolean;
}

export interface EditTreeInstance {
  updateHistory: () => void;
  destroy: () => void;
  history: HistoryAPI;
  setNoEdit: () => EditTreeInstance;
}

interface ChartWithEditTree {
  editTree: () => EditTreeInstance;
}

// Uses library's editTree() only for undo/redo history; React sidebar handles all editing
export function initEditTree(chart: ChartWithEditTree): EditTreeInstance {
  const et = chart.editTree();
  et.setNoEdit();
  return et;
}

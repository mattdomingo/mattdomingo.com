// GlassFolder's 340 × 326 layout includes the headroom above its back panel.
export function fitFolderWidth(width: number, height: number, columns: number, gap: number) {
  // Desktop leaves columns unset so a previous mobile size cannot constrain its auto-height grid.
  if (!columns || width <= 0 || height <= 0) return 340;
  const rows = 3 / columns;
  const columnWidth = (width - gap * (columns - 1)) / columns;
  const rowHeight = (height - gap * (rows - 1)) / rows;
  return Math.max(1, Math.min(340, columnWidth, rowHeight * 340 / 326));
}

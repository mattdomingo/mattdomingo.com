export type CardBounds = { x: number; y: number; width: number; height: number };

export function createCardReturn(from: CardBounds, bounds: CardBounds, cardSize: { width: number; height: number }, transform: string) {
  const matrix = /^matrix\(([^)]+)\)$/.exec(transform)?.[1].split(",").map(Number);
  const radians = matrix ? Math.atan2(matrix[1], matrix[0]) : 0;
  const rotate = radians * 180 / Math.PI;
  // DOM bounds include rotation. Recover the actual card size before calculating its final scale.
  const scale = bounds.width / (cardSize.width * Math.abs(Math.cos(radians)) + cardSize.height * Math.abs(Math.sin(radians)));
  const to = { x: bounds.x + (bounds.width - cardSize.width * scale) / 2, y: bounds.y + (bounds.height - cardSize.height * scale) / 2, width: cardSize.width * scale, height: cardSize.height * scale };
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;
  return {
    to, cardSize,
    start: { x: from.x + (from.width - cardSize.width) / 2, y: from.y + (from.height - cardSize.height) / 2, scaleX: from.width / cardSize.width, scaleY: from.height / cardSize.height, rotate: 0 },
    end: { x: centerX - cardSize.width / 2, y: centerY - cardSize.height / 2, scaleX: scale, scaleY: scale, rotate },
    viewer: { x: centerX - from.x - from.width / 2, y: centerY - from.y - from.height / 2, scaleX: to.width / from.width, scaleY: to.height / from.height, rotate },
  };
}

// Rotate the already-scaled surface so the popup and thumbnail stay aligned while crossfading.
export function cardReturnTransform(values: { x?: string | number; y?: string | number; rotate?: string | number; scaleX?: string | number; scaleY?: string | number }) {
  const unit = (value: string | number | undefined, suffix: string) => typeof value === "string" ? value : `${value ?? 0}${suffix}`;
  return `translate(${unit(values.x, "px")}, ${unit(values.y, "px")}) rotate(${unit(values.rotate, "deg")}) scale(${values.scaleX ?? 1}, ${values.scaleY ?? 1})`;
}

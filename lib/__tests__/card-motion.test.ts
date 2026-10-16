import { expect, test } from "@jest/globals";
import { cardReturnTransform, createCardReturn } from "@/lib/card-motion";

test.each([[-6, 1], [9, .78], [-12, .66], [0, 1]])("lands on the rotated card at %s degrees and %s scale", (angle, scale) => {
  const radians = angle * Math.PI / 180;
  const width = 272, height = 184;
  const bounds = { x: 100, y: 200, width: (width * Math.abs(Math.cos(radians)) + height * Math.abs(Math.sin(radians))) * scale, height: (width * Math.abs(Math.sin(radians)) + height * Math.abs(Math.cos(radians))) * scale };
  const motion = createCardReturn({ x: 208, y: 18, width: 864, height: 684 }, bounds, { width, height }, `matrix(${Math.cos(radians)}, ${Math.sin(radians)}, ${-Math.sin(radians)}, ${Math.cos(radians)}, -30, -90)`);
  expect(motion.end.rotate).toBeCloseTo(angle, 5);
  expect(motion.end.scaleX).toBeCloseTo(scale, 5);
  expect(motion.end.scaleY).toBeCloseTo(scale, 5);
  const centerX = motion.end.x + width / 2;
  const centerY = motion.end.y + height / 2;
  expect(centerX - bounds.width / 2).toBeCloseTo(bounds.x, 5);
  expect(centerY - bounds.height / 2).toBeCloseTo(bounds.y, 5);
  expect(motion.start.scaleX * width).toBeCloseTo(864, 5);
  expect(motion.start.scaleY * height).toBeCloseTo(684, 5);
  expect(motion.viewer.x).toBeCloseTo(centerX - 208 - 864 / 2, 5);
  expect(motion.viewer.y).toBeCloseTo(centerY - 18 - 684 / 2, 5);
});


test("return rotation is applied after scaling for consistent popup and card geometry", () => {
  expect(cardReturnTransform({ x: 20, y: "30px", rotate: -6, scaleX: .7, scaleY: .6 })).toBe("translate(20px, 30px) rotate(-6deg) scale(0.7, 0.6)");
  expect(cardReturnTransform({})).toBe("translate(0px, 0px) rotate(0deg) scale(1, 1)");
});

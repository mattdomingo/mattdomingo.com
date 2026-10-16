import { fitFolderWidth } from "@/lib/folder-layout";

test.each([
  [320, 568, 1], [375, 667, 1], [390, 844, 1], [430, 932, 1],
  [568, 320, 3], [667, 375, 3], [844, 390, 3], [932, 430, 3],
])("all three folders fit within a %i × %i screen with %i columns", (width, height, columns) => {
  const portrait = columns === 1;
  const header = portrait ? Math.min(104, Math.max(80, height * .12)) : Math.min(128, Math.max(104, height * .32));
  const footer = portrait ? 64 : Math.min(56, Math.max(44, height * .14));
  const availableWidth = width - 32;
  const availableHeight = height - header - footer;
  const folderWidth = fitFolderWidth(availableWidth, availableHeight, columns, 8);
  const rows = 3 / columns;
  expect(folderWidth * columns + 8 * (columns - 1)).toBeLessThanOrEqual(availableWidth + .01);
  expect(folderWidth * 326 / 340 * rows + 8 * (rows - 1)).toBeLessThanOrEqual(availableHeight + .01);
  expect(166 * folderWidth / 340).toBeGreaterThanOrEqual(44);
});

test("desktop folders keep their original size and unmeasured layouts use a safe initial size", () => {
  expect(fitFolderWidth(1180, 326, 3, 64)).toBe(340);
  expect(fitFolderWidth(1180, 136, 0, 64)).toBe(340);
  expect(fitFolderWidth(0, 0, 3, 8)).toBe(340);
});

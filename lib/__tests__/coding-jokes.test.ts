import { CODING_JOKES, getRandomCodingJoke } from "@/lib/coding-jokes";

test("every joke is reachable, and the current joke is excluded from either end of the random range", () => {
  const random = jest.spyOn(Math, "random");
  try {
    const seen = new Set(CODING_JOKES.map((_, index) => {
      random.mockReturnValue((index + .5) / CODING_JOKES.length);
      return getRandomCodingJoke();
    }));
    expect(seen).toEqual(new Set(CODING_JOKES));
    for (const previous of CODING_JOKES) {
      for (const value of [0, 1 - Number.EPSILON]) {
        random.mockReturnValue(value);
        const next = getRandomCodingJoke(previous);
        expect(CODING_JOKES).toContain(next);
        expect(next).not.toBe(previous);
      }
    }
  } finally {
    random.mockRestore();
  }
});

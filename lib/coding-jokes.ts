export const CODING_JOKES = [
  "I have a joke about UDP, but you might not get it.",
  "A SQL query walks into a bar, sees two tables, and asks: “Can I join you?”",
  "To understand recursion, you must first understand recursion.",
  "Programmers prefer dark mode because light attracts bugs.",
  "There are 10 types of people: those who understand binary and those who don’t.",
  "I told my computer I needed a break. It froze.",
  "My code has no bugs. It just develops random features.",
  "I tried to write a joke about null, but came up with nothing.",
];

export function getRandomCodingJoke(previous?: string) {
  const choices = CODING_JOKES.filter((joke) => joke !== previous);
  return choices[Math.floor(Math.random() * choices.length)];
}

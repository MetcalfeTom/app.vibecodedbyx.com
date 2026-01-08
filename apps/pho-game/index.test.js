import { describe, test, expect } from "bun:test";
import { readFileSync } from "fs";
import { runInNewContext } from "vm";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

function extractUnlocks(documentHtml) {
  const match = documentHtml.match(/const\s+UNLOCKS\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error("UNLOCKS block not found in pho game");
  }
  const sandbox = { result: null };
  runInNewContext(`result = ${match[1]};`, sandbox);
  if (!Array.isArray(sandbox.result)) {
    throw new Error("UNLOCKS data is not an array");
  }
  return sandbox.result;
}

describe("Pho Slurp configuration", () => {
  test("start button is present", () => {
    expect(html).toContain('id="start"');
    expect(html).toContain("Start Slurping");
  });

  test("unlock tiers are ordered by score", () => {
    const unlocks = extractUnlocks(html);
    expect(unlocks.length).toBeGreaterThan(0);
    const scores = unlocks.map((entry) => entry.score);
    const sortedScores = [...scores].sort((a, b) => a - b);
    expect(scores).toEqual(sortedScores);
  });

  test("unlock entries include required fields", () => {
    const unlocks = extractUnlocks(html);
    for (const entry of unlocks) {
      expect(entry).toHaveProperty("score");
      expect(entry).toHaveProperty("icon");
      expect(entry).toHaveProperty("title");
      expect(entry).toHaveProperty("detail");
      expect(typeof entry.score).toBe("number");
      expect(typeof entry.icon).toBe("string");
      expect(typeof entry.title).toBe("string");
      expect(typeof entry.detail).toBe("string");
    }
  });
});

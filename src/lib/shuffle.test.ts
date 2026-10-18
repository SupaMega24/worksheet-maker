import { describe, it, expect } from "vitest";
import {
    shuffleArray,
    scrambleWord,
    scrambleSentence,
    pickDistractors,
    canScrambleWord,
} from "@/lib/shuffle";

describe("shuffleArray", () => {
    it("keeps the same items and doesn't mutate the original", () => {
        const original = [1, 2, 3, 4, 5];
        const result = shuffleArray(original);
        expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
        expect(original).toEqual([1, 2, 3, 4, 5]);
    });
});

describe("scrambleWord", () => {
    it("never returns the original word", () => {
        for (let i = 0; i < 200; i++) {
            expect(scrambleWord("table")).not.toBe("table");
        }
    });
    it("leaves unscrambleable words alone", () => {
        expect(scrambleWord("go")).toBe("go");
        expect(scrambleWord("aaa")).toBe("aaa");
    });
    it("flags short words", () => {
        expect(canScrambleWord("at")).toBe(false);
        expect(canScrambleWord("cat")).toBe(true);
    });
});

describe("scrambleSentence", () => {
    it("never returns the original order", () => {
        for (let i = 0; i < 200; i++) {
            const result = scrambleSentence("The cat sat on the mat.");
            expect(result.join(" ")).not.toBe("the cat sat on the mat");
        }
    });
    it("strips final punctuation and lowercases the first word", () => {
        const result = scrambleSentence("Dogs love bones!");
        expect(result.sort()).toEqual(["bones", "dogs", "love"]);
    });
});

describe("pickDistractors", () => {
    const list = [
        { id: "1", definition: "a" },
        { id: "2", definition: "b" },
        { id: "3", definition: "c" },
        { id: "4", definition: "d" },
    ];
    it("never includes the correct definition", () => {
        const result = pickDistractors("1", list);
        expect(result).not.toContain("a");
        expect(result).toHaveLength(3);
    });
});
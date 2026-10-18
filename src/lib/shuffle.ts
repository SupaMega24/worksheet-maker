// Fisher-Yates shuffle: returns a new array, never changes the original
export function shuffleArray<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Returns true if a word has enough variety to scramble meaningfully
export function canScrambleWord(word: string): boolean {
    const letters = word.trim().toLowerCase().replace(/\s+/g, "");
    if (letters.length < 3) return false;
    // all the same letter (e.g. "aaa") can't be scrambled
    return new Set(letters).size > 1;
}

// Scrambles the letters of a word so the result never equals the original
export function scrambleWord(word: string): string {
    const trimmed = word.trim();
    if (!canScrambleWord(trimmed)) return trimmed;

    const letters = trimmed.split("");
    let scrambled = trimmed;
    // retry until different (the guard above guarantees this can succeed)
    while (scrambled === trimmed) {
        scrambled = shuffleArray(letters).join("");
    }
    return scrambled;
}

// Splits a sentence into shuffled words, never matching the original order
export function scrambleSentence(sentence: string): string[] {
    const words = sentence
        .trim()
        .replace(/[.!?]+$/, "") // strip final punctuation
        .split(/\s+/)
        .filter(Boolean);

    if (words.length < 3) return words;

    // lowercase the first word so capitalization doesn't give it away,
    // unless it's "I" or looks like a proper noun we can't detect (kept simple for v1)
    const prepared = words.map((w, i) =>
        i === 0 && w !== "I" ? w.charAt(0).toLowerCase() + w.slice(1) : w
    );

    // only retry if a different order is actually possible
    const hasVariety = new Set(prepared).size > 1;
    let shuffled = prepared;
    while (hasVariety && shuffled.join(" ") === prepared.join(" ")) {
        shuffled = shuffleArray(prepared);
    }
    return shuffled;
}

// Picks `count` wrong answers from the other words' definitions
export function pickDistractors(
    correctId: string,
    all: { id: string; definition: string }[],
    count = 3
): string[] {
    const correct = all.find((w) => w.id === correctId);
    const pool = all.filter(
        (w) => w.id !== correctId && w.definition !== correct?.definition
    );
    return shuffleArray(pool).slice(0, count).map((w) => w.definition);
}
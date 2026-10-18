import type { Word } from "@/lib/types";

export function newWord(partial: Partial<Omit<Word, "id">> = {}): Word {
    return { id: crypto.randomUUID(), word: "", definition: "", sentence: "", ...partial };
}

// Turns text pasted from a spreadsheet (tab-separated columns) into Word rows.
// Column order: word, definition, sentence.
export function parsePastedRows(text: string): Word[] {
    const rows = text
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "")
        .map((line) => {
            const [word = "", definition = "", sentence = ""] = line.split("\t");
            return newWord({
                word: word.trim(),
                definition: definition.trim(),
                sentence: sentence.trim(),
            });
        });

    // If the first row looks like a header ("Word", "Definition"...), drop it
    if (rows.length > 0 && rows[0].word.toLowerCase() === "word") {
        rows.shift();
    }
    return rows;
}
"use client";

import { useState } from "react";
import type { WorksheetData } from "@/lib/useWorksheetData";
import { newWord, parsePastedRows } from "@/lib/parse";

type Props = {
    data: WorksheetData;
    onChange: (data: WorksheetData) => void;
};

export default function WordListEditor({ data, onChange }: Props) {
    const [pasteText, setPasteText] = useState("");

    function updateRow(id: string, field: "word" | "definition" | "sentence", value: string) {
        onChange({
            ...data,
            words: data.words.map((w) => (w.id === id ? { ...w, [field]: value } : w)),
        });
    }

    function deleteRow(id: string) {
        onChange({ ...data, words: data.words.filter((w) => w.id !== id) });
    }

    function addRow() {
        onChange({ ...data, words: [...data.words, newWord()] });
    }

    function addPasted() {
        const parsed = parsePastedRows(pasteText);
        if (parsed.length === 0) return;
        // drop completely empty rows so pasted data doesn't land below blanks
        const kept = data.words.filter((w) => w.word || w.definition || w.sentence);
        onChange({ ...data, words: [...kept, ...parsed] });
        setPasteText("");
    }

    function clearAll() {
        if (window.confirm("Clear the whole word list?")) {
            onChange({ ...data, words: [newWord(), newWord(), newWord(), newWord()] });
        }
    }

    const filled = data.words.filter((w) => w.word.trim()).length;

    return (
        <section className="editor">
            <div className="fields">
                <label>
                    Worksheet title
                    <input
                        value={data.title}
                        onChange={(e) => onChange({ ...data, title: e.target.value })}
                        placeholder="Unit 5 Vocabulary"
                    />
                </label>
                <label>
                    Class
                    <input
                        value={data.className}
                        onChange={(e) => onChange({ ...data, className: e.target.value })}
                        placeholder="Grade 6 – Class B"
                    />
                </label>
            </div>

            <details className="paste-box">
                <summary>Paste from a spreadsheet</summary>
                <p>
                    Copy three columns (word, definition, sentence) from Excel or Google
                    Sheets and paste them here.
                </p>
                <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    rows={5}
                />
                <button onClick={addPasted}>Add these rows</button>
            </details>

            <table>
                <thead>
                    <tr>
                        <th>Word</th>
                        <th>Definition</th>
                        <th>Example sentence (optional)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.words.map((w) => (
                        <tr key={w.id}>
                            <td>
                                <input value={w.word} onChange={(e) => updateRow(w.id, "word", e.target.value)} />
                            </td>
                            <td>
                                <input
                                    value={w.definition}
                                    onChange={(e) => updateRow(w.id, "definition", e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    value={w.sentence}
                                    onChange={(e) => updateRow(w.id, "sentence", e.target.value)}
                                />
                            </td>
                            <td>
                                <button onClick={() => deleteRow(w.id)} aria-label="Delete row">
                                    ✕
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="actions">
                <button onClick={addRow}>+ Add row</button>
                <button onClick={clearAll}>Clear all</button>
                <span>{filled} words · saved automatically in this browser</span>
            </div>
        </section>
    );
}
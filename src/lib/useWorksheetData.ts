"use client";

import { useEffect, useState } from "react";
import type { Word } from "@/lib/types";
import { newWord } from "@/lib/parse";

export type WorksheetData = {
    title: string;
    className: string;
    words: Word[];
};

const STORAGE_KEY = "worksheet-maker:v1";

function defaultData(): WorksheetData {
    return { title: "", className: "", words: [newWord(), newWord(), newWord(), newWord()] };
}

// Returns [data, setData]. data is null until the browser has loaded
// the saved list (localStorage doesn't exist on the server).
export function useWorksheetData() {
    const [data, setData] = useState<WorksheetData | null>(null);

    // Load once when the page opens
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            setData(saved ? (JSON.parse(saved) as WorksheetData) : defaultData());
        } catch {
            setData(defaultData());
        }
    }, []);

    // Save whenever the data changes
    useEffect(() => {
        if (data === null) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
            // storage full or blocked: the app still works, it just won't remember
        }
    }, [data]);

    return [data, setData] as const;
}
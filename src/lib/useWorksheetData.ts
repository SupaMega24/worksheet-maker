"use client";

import { useMemo, useSyncExternalStore } from "react";
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

// --- A tiny store around localStorage ---

const listeners = new Set<() => void>();
let memory: string | null = null; // backup if localStorage is blocked

function subscribe(callback: () => void) {
    listeners.add(callback);
    window.addEventListener("storage", callback); // changes from other tabs
    return () => {
        listeners.delete(callback);
        window.removeEventListener("storage", callback);
    };
}

// Returns the saved text, or "" if nothing is saved yet
function getSnapshot(): string | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) return saved;
    } catch {
        // blocked: fall through to the in-memory copy
    }
    return memory ?? "";
}

// On the server there is no localStorage, so we report "not loaded yet"
function getServerSnapshot(): string | null {
    return null;
}

function setData(next: WorksheetData) {
    const json = JSON.stringify(next);
    memory = json;
    try {
        localStorage.setItem(STORAGE_KEY, json);
    } catch {
        // storage full or blocked: the app still works, it just won't remember
    }
    listeners.forEach((listener) => listener());
}

// Returns [data, setData]. data is null until the browser has loaded
// the saved list.
export function useWorksheetData() {
    const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const data = useMemo<WorksheetData | null>(() => {
        if (raw === null) return null;
        if (raw === "") return defaultData();
        try {
            return JSON.parse(raw) as WorksheetData;
        } catch {
            return defaultData();
        }
    }, [raw]);

    return [data, setData] as const;
}
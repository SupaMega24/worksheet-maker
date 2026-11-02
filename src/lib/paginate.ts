export function chunk<T>(items: T[], size: number): T[][] {
    const pages: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        pages.push(items.slice(i, i + size));
    }
    return pages;
}

// How many lines `text` needs when wrapped at `charsPerLine` characters
export function estimateLines(text: string, charsPerLine: number): number {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return 1;

    let lines = 1;
    let current = 0;
    for (const word of words) {
        if (current > 0 && current + 1 + word.length <= charsPerLine) {
            current += 1 + word.length;
        } else {
            if (current > 0) lines++;
            current = word.length;
        }
        // a single very long word wraps by itself
        while (current > charsPerLine) {
            lines++;
            current -= charsPerLine;
        }
    }
    return lines;
}

// Fills each page until its height budget is used up.
// The first page has a smaller budget because it holds the header.
export function chunkByHeight<T>(
    items: T[],
    heightOf: (item: T) => number,
    firstBudget: number,
    restBudget: number,
    maxItems: number
): T[][] {
    const pages: T[][] = [];
    let current: T[] = [];
    let used = 0;
    let budget = firstBudget;

    for (const item of items) {
        const height = heightOf(item);
        const full = current.length >= maxItems || used + height > budget;
        if (current.length > 0 && full) {
            pages.push(current);
            current = [];
            used = 0;
            budget = restBudget;
        }
        current.push(item);
        used += height;
    }
    if (current.length > 0) pages.push(current);

    // Avoid a lonely single item on the last page (a one-item matching is silly)
    const last = pages[pages.length - 1];
    const prev = pages[pages.length - 2];
    if (last && prev && last.length === 1 && prev.length > 2) {
        last.unshift(prev.pop()!);
    }
    return pages;
}
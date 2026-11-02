import type { Word } from "@/lib/types";
import { seededRandom, shuffleArray } from "@/lib/shuffle";
import { chunkByHeight, estimateLines } from "@/lib/paginate";
import SheetHeader from "@/components/SheetHeader";

// Page geometry in mm. A4 minus the 12mm print margins is 273. For Letter use 255.
const PAGE_HEIGHT = 273;
const HEADER_HEIGHT = 45; // title, name/date line and instructions on page 1
const SAFETY = 8; // spare space so a page never overflows
const LINE_HEIGHT = 8.9; // 14pt x 1.8 line spacing
const ITEM_GAP = 3.2; // the space under each item
const DEF_CHARS = 34; // characters that fit on one line of a definition
const WORD_CHARS = 24; // characters that fit on one line of a word
const MAX_PER_PAGE = 15; // never more than this, even if short items would fit
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Props = {
    words: Word[];
    title: string;
    className: string;
    showAnswers: boolean;
    seed: number;
};

export default function Matching({ words, title, className, showAnswers, seed }: Props) {
    const usable = words.filter((w) => w.word.trim() && w.definition.trim());
    const skipped = words.filter((w) => w.word.trim() && !w.definition.trim()).length;

    if (usable.length < 2) {
        return <p className="notice">Add at least 2 words with definitions to make a matching worksheet.</p>;
    }

    const random = seededRandom(seed);
    const itemHeight = (w: Word) =>
        Math.max(estimateLines(w.word, WORD_CHARS), estimateLines(w.definition, DEF_CHARS)) *
        LINE_HEIGHT +
        ITEM_GAP;

    const chunks = chunkByHeight(
        usable,
        itemHeight,
        PAGE_HEIGHT - HEADER_HEIGHT - SAFETY,
        PAGE_HEIGHT - SAFETY,
        MAX_PER_PAGE
    );
    const pages = chunks.map((items, i) => {
        // how many items came on the pages before this one
        const start = chunks.slice(0, i).reduce((sum, c) => sum + c.length, 0);
        const defs = shuffleArray(items, random);
        const key = items.map((w) => LETTERS[defs.indexOf(w)]);
        return { items, defs, key, start };
    });

    return (
        <>
            {skipped > 0 && (
                <p className="notice no-print">
                    {skipped} word{skipped > 1 ? "s were" : " was"} skipped because{" "}
                    {skipped > 1 ? "they have" : "it has"} no definition.
                </p>
            )}

            {pages.map((page, pageIndex) => (
                <section className="sheet" key={pageIndex}>
                    {pageIndex === 0 && (
                        <>
                            <SheetHeader title={title} className={className} subtitle="Matching" />
                            <p className="instructions">
                                Write the letter of the correct definition next to each word.
                            </p>
                        </>
                    )}
                    <div className="matching">
                        <ol
                            className="match-words"
                            style={{ counterReset: `item ${page.start}` }}
                        >
                            {page.items.map((w) => (
                                <li key={w.id}>
                                    <span className="blank">____</span> {w.word}
                                </li>
                            ))}
                        </ol>
                        <ul className="match-defs">
                            {page.defs.map((w, i) => (
                                <li key={w.id}>
                                    <strong>{LETTERS[i]}.</strong> {w.definition}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            ))}

            {showAnswers && (
                <section className="sheet answer-key">
                    <SheetHeader title={title} className={className} subtitle="Matching – Answer Key" />
                    {pages.map((page, pageIndex) => (
                        <div key={pageIndex}>
                            {pages.length > 1 && <h3>Page {pageIndex + 1}</h3>}
                            <ol start={page.start + 1}>
                                {page.items.map((w, i) => (
                                    <li key={w.id}>
                                        {w.word} → <strong>{page.key[i]}</strong>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </section>
            )}
        </>
    );
}
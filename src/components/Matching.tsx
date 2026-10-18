import type { Word } from "@/lib/types";
import { seededRandom, shuffleArray } from "@/lib/shuffle";
import { chunk } from "@/lib/paginate";
import SheetHeader from "@/components/SheetHeader";

const PER_PAGE = 8;
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
    const pages = chunk(usable, PER_PAGE).map((items) => {
        const defs = shuffleArray(items, random);
        const key = items.map((w) => LETTERS[defs.indexOf(w)]);
        return { items, defs, key };
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
                    <SheetHeader title={title} className={className} subtitle="Matching" />
                    <p className="instructions">Write the letter of the correct definition next to each word.</p>
                    <div className="matching">
                        <ol className="match-words"
                            style={{ counterReset: `item ${pageIndex * PER_PAGE}` }}
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
                            <ol start={pageIndex * PER_PAGE + 1}>
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
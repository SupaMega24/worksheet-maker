"use client";

import { useState } from "react";
import WordListEditor from "@/components/WordListEditor";
import Matching from "@/components/Matching";
import { useWorksheetData } from "@/lib/useWorksheetData";

export default function Home() {
  const [data, setData] = useWorksheetData();
  const [seed, setSeed] = useState(1);
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <main className="page">
      <div className="no-print">
        <h1>Worksheet Maker</h1>
        {data === null ? (
          <p>Loading…</p>
        ) : (
          <WordListEditor data={data} onChange={setData} />
        )}

        <div className="toolbar">
          <strong>Matching</strong>
          <button onClick={() => setSeed(Date.now())}>🔀 Reshuffle</button>
          <label>
            <input
              type="checkbox"
              checked={showAnswers}
              onChange={(e) => setShowAnswers(e.target.checked)}
            />{" "}
            Include answer key
          </label>
          <button onClick={() => window.print()}>🖨 Print</button>
        </div>
      </div>

      {data !== null && (
        <div className="sheets">
          <Matching
            words={data.words}
            title={data.title}
            className={data.className}
            showAnswers={showAnswers}
            seed={seed}
          />
        </div>
      )}
    </main>
  );
}
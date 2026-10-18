"use client";

import WordListEditor from "@/components/WordListEditor";
import { useWorksheetData } from "@/lib/useWorksheetData";

export default function Home() {
  const [data, setData] = useWorksheetData();

  return (
    <main className="page">
      <h1>Worksheet Maker</h1>
      {data === null ? (
        <p>Loading…</p>
      ) : (
        <WordListEditor data={data} onChange={setData} />
      )}
    </main>
  );
}
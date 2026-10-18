type Props = { title: string; className: string; subtitle?: string };

export default function SheetHeader({ title, className, subtitle }: Props) {
    return (
        <header className="sheet-header">
            <h2>{title || "Vocabulary"}{subtitle ? ` – ${subtitle}` : ""}</h2>
            <div className="sheet-meta">
                <span>Name: ______________________</span>
                <span>Date: ______________</span>
                {className && <span>Class: {className}</span>}
            </div>
        </header>
    );
}
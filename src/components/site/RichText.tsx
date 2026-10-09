import { Fragment } from "react";

/**
 * Rendu sûr d'un texte légèrement balisé (## titre, - liste, > encadré, paragraphes).
 * Aucun HTML n'est interprété : tout passe par React, qui échappe le contenu.
 */
export function RichText({ text, className = "prose-legal" }: { text: string; className?: string }) {
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/);
  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim() !== "");
        if (!lines.length) return null;
        if (lines.every((l) => l.startsWith("- ")))
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => l.startsWith("> ")))
          return <blockquote key={i}>{lines.map((l) => l.slice(2)).join(" ")}</blockquote>;
        return (
          <Fragment key={i}>
            {lines.map((l, j) =>
              l.startsWith("## ") ? (
                <h2 key={j}>{l.slice(3)}</h2>
              ) : l.startsWith("- ") ? (
                <ul key={j}>
                  <li>{l.slice(2)}</li>
                </ul>
              ) : (
                <p key={j} className="mt-3">
                  {l}
                </p>
              ),
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

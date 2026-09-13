import type { Metadata } from "next";
import Link from "next/link";
import { GraphFrame } from "@/components/graph/GraphFrame";
import { getGraphStats } from "@/lib/graph-stats";
import { formatCount } from "@/lib/utils";

/**
 * The root layout applies the `%s | Software Discovery` title template, so this
 * must stay a bare page name. Repeating the brand here rendered
 * "Codebase graph — Software Discovery | Software Discovery", which this page
 * was the only route to do.
 */
export const metadata: Metadata = {
  title: "Codebase graph",
  description:
    "Interactive knowledge graph of this project's source, generated offline by Graphify with tree-sitter.",
  /**
   * A viewer for this project's own source, not catalogue content — it should not
   * compete with the product pages in an index. It stays crawlable (`follow`) so
   * the footer link still passes through, but it is excluded from the index, the
   * same treatment /search, /vendor and /admin already get.
   *
   * This was previously inherited from the root layout as `index, follow`, which
   * made /graph indexable while it appeared in neither sitemap.xml nor
   * robots.txt. /admin/seo reported a clean bill of health regardless, because
   * its consistency check compared hand-written constants rather than the real
   * artifacts — see the note on that page.
   */
  robots: { index: false, follow: true },
};

const GRAPH_SRC = "/graphify/graph.html";

/**
 * Graphify paints its own canvas on #0f0f1a. Matching it here means the pane is
 * already the right colour before the frame's document loads, instead of
 * flashing white inside a light page.
 */
const CANVAS_BG = "#0f0f1a";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background px-4 py-3.5">
      <dt className="text-2xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 font-mono text-xl font-semibold leading-none tabular-nums">
        {formatCount(value)}
      </dd>
    </div>
  );
}

/**
 * How to read the viewer. Deliberately factual: these three sentences describe
 * what Graphify actually emits (nodes carry `source_file` and `community`,
 * links carry a `relation`) rather than a generic "explore the graph" pitch.
 */
const READING_NOTES = [
  {
    term: "A node",
    detail: "is one definition in the source — a component, a function, a type, or a named concept.",
  },
  {
    term: "An edge",
    detail: "is a relationship between two of them: a call, an import, a re-export, a subclass.",
  },
  {
    term: "Colour",
    detail:
      "groups nodes into communities — clusters that reference each other more than they reference the rest.",
  },
];

export default function GraphPage() {
  const stats = getGraphStats();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:py-9">
      {/*
        Deliberately compact. The graph is the content of this page, so the
        framing above it is kept to a title, one sentence and the exit link —
        every extra row here pushes the thing the reader came for further below
        the fold. The numbers and the legend live underneath it instead.
      */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-2xl">
          <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Project source
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            Codebase knowledge graph
          </h1>
          <p className="mt-2 text-13 leading-relaxed text-muted-foreground sm:text-body">
            Every module, export and call site in this project, laid out by how they reference
            each other — built offline by{" "}
            <a
              href="https://github.com/Graphify-Labs/graphify"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary hover:text-primary-hover"
            >
              Graphify
            </a>{" "}
            with tree-sitter, so rendering it makes no third-party request.
          </p>
        </div>

        <Link
          href={GRAPH_SRC}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-lg border border-border px-3.5 py-2 text-13 font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          Open in new tab ↗
        </Link>
      </div>

      {/*
        A definite height rather than a full-viewport one. This route renders
        inside the root layout's `flex-1` column with the site footer after it,
        so a `100dvh` viewer always overshoots the fold and drags the footer into
        a scroll the user did not ask for. This pane is sized to clear the fold
        at a typical desktop height, and "Open in new tab" is the full-screen path.
      */}
      <div
        className="mt-5 overflow-hidden rounded-xl border border-border"
        style={{ backgroundColor: CANVAS_BG }}
      >
        <div className="relative h-[68dvh] max-h-[720px] min-h-[440px]">
          <GraphFrame src={GRAPH_SRC} title="Codebase knowledge graph — interactive view" />
        </div>
      </div>

      <p className="mt-3 text-13 text-muted-foreground">
        {stats?.builtAtCommit ? (
          <>
            A point-in-time snapshot, built from commit{" "}
            <code className="font-mono text-foreground">{stats.builtAtCommit}</code>.{" "}
          </>
        ) : null}
        Regenerate it with{" "}
        <code className="font-mono text-foreground">scripts/graphify-build.sh</code>. Drag to
        pan, scroll to zoom, and select a node to see where it is defined.
      </p>

      {stats ? (
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="Nodes" value={stats.nodes} />
          <Stat label="Edges" value={stats.edges} />
          <Stat label="Communities" value={stats.communities} />
          <Stat label="Source files" value={stats.sourceFiles} />
          <Stat label="Relation types" value={stats.relationTypes} />
        </dl>
      ) : null}

      <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-3">
        {READING_NOTES.map((note) => (
          <div key={note.term}>
            <dt className="text-13 font-semibold text-foreground">{note.term}</dt>
            <dd className="mt-1 text-13 leading-relaxed text-muted-foreground">{note.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

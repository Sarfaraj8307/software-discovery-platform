import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Summary statistics for the published knowledge graph, derived from the
 * artifact Graphify emits rather than from a hand-written list of numbers.
 *
 * WHY THIS READS THE FILE INSTEAD OF IMPORTING IT
 * `public/graphify/graph.json` is roughly 950 KB. A static `import` would fold
 * that into the module graph, where any client component could accidentally
 * pull it across the network boundary. Reading it here keeps the file a
 * build-time detail: the page ships five integers, not a megabyte of JSON.
 *
 * WHY IT RETURNS null INSTEAD OF THROWING
 * The artifact is generated, and `public/graphify/` is committed — but a
 * contributor who has not run `scripts/graphify-build.sh` should still get a
 * working build. A missing graph is a reason to render the page without the
 * summary, not a reason to fail the build.
 */

export interface GraphStats {
  nodes: number;
  edges: number;
  communities: number;
  sourceFiles: number;
  relationTypes: number;
  /** Short SHA of the commit the graph was built from, if recorded. */
  builtAtCommit: string | null;
}

interface RawGraph {
  nodes?: Array<{ community?: number; source_file?: string }>;
  links?: Array<{ relation?: string }>;
  built_at_commit?: string;
}

/** Distinct count, ignoring undefined and empty values. */
function distinctCount<T>(values: Array<T | undefined | null>): number {
  const seen = new Set<T>();
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") seen.add(value);
  }
  return seen.size;
}

export function getGraphStats(): GraphStats | null {
  try {
    const file = path.join(process.cwd(), "public", "graphify", "graph.json");
    const raw = JSON.parse(readFileSync(file, "utf8")) as RawGraph;

    const nodes = raw.nodes ?? [];
    const links = raw.links ?? [];
    // An empty node list means the artifact is present but unusable — treat it
    // the same as a missing file rather than printing a page of zeroes.
    if (nodes.length === 0) return null;

    return {
      nodes: nodes.length,
      edges: links.length,
      communities: distinctCount(nodes.map((n) => n.community)),
      sourceFiles: distinctCount(nodes.map((n) => n.source_file)),
      relationTypes: distinctCount(links.map((l) => l.relation)),
      builtAtCommit: raw.built_at_commit ? raw.built_at_commit.slice(0, 7) : null,
    };
  } catch {
    return null;
  }
}

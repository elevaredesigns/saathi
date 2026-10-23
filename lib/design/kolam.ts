/**
 * Kolam generator — mirror curves on a pulli (dot) grid.
 *
 * Kolam is drawn across South India as a continuous line woven around a grid
 * of dots. Mathematically these are "mirror curves": a line travels diagonally
 * between the dots and bounces off the border and off small mirrors placed on
 * the edges between dots. Every such line closes on itself, so the result is
 * always a set of complete loops — never a loose end.
 *
 * Coordinates are "doubled": cell (i, j) spans [2i, 2i+2] × [2j, 2j+2], its dot
 * sits at (2i+1, 2j+1), and edge midpoints are the points with exactly one odd
 * coordinate. The curve hops between edge midpoints along cell diagonals.
 */
import { mulberry32 } from "./random";

export interface KolamOptions {
  cols: number;
  rows: number;
  /** Pixel size of one cell (distance between neighbouring dots). */
  cell?: number;
  seed?: number;
  /** Probability that an internal edge carries a mirror (0 = fewest loops). */
  density?: number;
  /** "mirror" repeats every mirror across both axes for a composed look. */
  symmetry?: "none" | "mirror";
}

export interface Kolam {
  width: number;
  height: number;
  dots: { x: number; y: number }[];
  /** One closed SVG path per loop. */
  loops: string[];
  /** Diagonal segments on the grid (4 per cell). */
  segmentCount: number;
  /** Segments traversed while tracing — equals segmentCount when complete. */
  traversed: number;
}

type Pt = { x: number; y: number };

const key = (x: number, y: number) => `${x},${y}`;
const round = (v: number) => Math.round(v * 100) / 100;

export function generateKolam({
  cols,
  rows,
  cell = 24,
  seed = 1,
  density = 0.6,
  symmetry = "mirror",
}: KolamOptions): Kolam {
  const W2 = cols * 2;
  const H2 = rows * 2;
  const rand = mulberry32(seed);

  /* ---- mirrors on internal edges ---- */
  const mirrors = new Set<string>();
  const decided = new Set<string>();
  const candidates: Pt[] = [];
  for (let y = 2; y <= H2 - 2; y += 2) for (let x = 1; x <= W2 - 1; x += 2) candidates.push({ x, y }); // horizontal
  for (let y = 1; y <= H2 - 1; y += 2) for (let x = 2; x <= W2 - 2; x += 2) candidates.push({ x, y }); // vertical

  for (const c of candidates) {
    const k = key(c.x, c.y);
    if (decided.has(k)) continue;
    const orbit =
      symmetry === "mirror"
        ? [c, { x: W2 - c.x, y: c.y }, { x: c.x, y: H2 - c.y }, { x: W2 - c.x, y: H2 - c.y }]
        : [c];
    const on = rand() < density;
    for (const o of orbit) {
      const ok = key(o.x, o.y);
      decided.add(ok);
      if (on) mirrors.add(ok);
    }
  }

  /* ---- tracing ---- */
  const horizontal = (p: Pt) => p.y % 2 === 0;
  const blocked = (p: Pt) =>
    horizontal(p)
      ? p.y === 0 || p.y === H2 || mirrors.has(key(p.x, p.y))
      : p.x === 0 || p.x === W2 || mirrors.has(key(p.x, p.y));

  const segKey = (a: Pt, b: Pt) => {
    const ka = key(a.x, a.y);
    const kb = key(b.x, b.y);
    return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
  };

  const used = new Set<string>();
  const s = cell / 2;
  const loops: string[] = [];
  let traversed = 0;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const T = { x: 2 * i + 1, y: 2 * j };
      const R = { x: 2 * i + 2, y: 2 * j + 1 };
      const B = { x: 2 * i + 1, y: 2 * j + 2 };
      const L = { x: 2 * i, y: 2 * j + 1 };
      const diamond: [Pt, Pt][] = [
        [T, R],
        [R, B],
        [B, L],
        [L, T],
      ];

      for (const [a, b] of diamond) {
        if (used.has(segKey(a, b))) continue;

        const start = { x: a.x, y: a.y, dx: b.x - a.x, dy: b.y - a.y };
        const points: Pt[] = [{ x: a.x, y: a.y }];
        let cur = start;
        // Bounded: a loop can never be longer than the total segment count.
        for (let guard = 0; guard <= 4 * cols * rows; guard++) {
          const q = { x: cur.x + cur.dx, y: cur.y + cur.dy };
          used.add(segKey(cur, q));
          traversed++;
          let { dx, dy } = cur;
          if (blocked(q)) {
            if (horizontal(q)) dy = -dy;
            else dx = -dx;
          }
          const next = { x: q.x, y: q.y, dx, dy };
          if (next.x === start.x && next.y === start.y && next.dx === start.dx && next.dy === start.dy) break;
          points.push(q);
          cur = next;
        }

        loops.push(toPath(points, s));
      }
    }
  }

  const dots: Pt[] = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) dots.push({ x: round((2 * i + 1) * s), y: round((2 * j + 1) * s) });

  return { width: cols * cell, height: rows * cell, dots, loops, segmentCount: 4 * cols * rows, traversed };
}

/** Closed quadratic B-spline: controls = edge points, anchors = their midpoints. */
function toPath(points: Pt[], s: number): string {
  const n = points.length;
  const mid = (k: number) => {
    const a = points[k];
    const b = points[(k + 1) % n];
    return `${round(((a.x + b.x) / 2) * s)} ${round(((a.y + b.y) / 2) * s)}`;
  };
  let d = `M${mid(n - 1)}`;
  for (let k = 0; k < n; k++) {
    d += ` Q${round(points[k].x * s)} ${round(points[k].y * s)} ${mid(k)}`;
  }
  return `${d} Z`;
}

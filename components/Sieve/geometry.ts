import type { Sieve } from "@/lib/content";
import { TIMING } from "./timing";

// Geometry of the two sieve compositions, in SVG user units. Everything is derived from the
// counts in content/projects.json, so a new run only needs new numbers.

export interface Point {
  x: number;
  y: number;
}

export interface Box extends Point {
  width: number;
  height: number;
}

/**
 * One company of the run. (x, y) is where it rests at the end; the s and g pairs are offsets
 * from there to its spot in the source field and to where it crosses the gate.
 */
export interface Traveler extends Point {
  sx: number;
  sy: number;
  gx: number;
  gy: number;
  /** Start of its move, in ms. */
  delay: number;
  /** Index of the bin it falls into, or -1 if it passes. */
  bin: number;
}

export interface SieveLayout {
  width: number;
  height: number;
  dot: number;
  field: { x: number; y: number; pitch: number; cols: number; fullRows: number; rest: Point[] };
  gate: { x1: number; y1: number; x2: number; y2: number }[];
  /** Bins as drawn: columns (wide) or bars (narrow). Rendered in HTML so the halftone stays crisp. */
  bins: Box[];
  cluster: Point;
  /** Where the passed companies rest in the final state. */
  clusterDots: Point[];
  path: (Point & { t: number })[];
  stages: (Point & { t: number })[];
  mark: Point;
  /** Every company's path, for the animation. Computed on demand: only the client needs it. */
  travelers: () => Traveler[];
}

const FIELD_COLS = 29;
const CLUSTER_COLS = 5;
/** Companies in one wave leave up to this many ms apart, so bins fill dot by dot. */
const JITTER = 90;

const round = (value: number) => Math.round(value * 10) / 10;

/** mulberry32: a small seeded generator, so every build draws the same picture. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** For each company in the field, the index of the bin it falls into, or -1 if it passes. */
function outcomes(sieve: Sieve): number[] {
  const list = [
    ...Array<number>(sieve.passed.value).fill(-1),
    ...sieve.rejected.flatMap((bin, index) => Array<number>(bin.count).fill(index)),
  ];
  const random = seeded(377);
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/** Square-root scale, so the bins of 2 and 5 stay visible next to 234. */
function binLengths(sieve: Sieve, max: number, min: number): number[] {
  const largest = Math.max(...sieve.rejected.map((bin) => bin.count));
  return sieve.rejected.map((bin) => Math.max(min, max * Math.sqrt(bin.count / largest)));
}

interface Spec {
  pitch: number;
  origin: Point;
  wave: (col: number, row: number, rows: number) => number;
  gate: (source: Point) => Point;
  land: (bin: number, random: () => number) => Point;
  slot: (index: number) => Point;
}

function travelers(sieve: Sieve, spec: Spec): Traveler[] {
  const random = seeded(23);
  const results = outcomes(sieve);
  const rows = Math.ceil(results.length / FIELD_COLS);
  const entries = results.map((bin, index) => {
    const col = index % FIELD_COLS;
    const row = Math.floor(index / FIELD_COLS);
    const source = { x: spec.origin.x + col * spec.pitch, y: spec.origin.y + row * spec.pitch };
    const delay = TIMING.moveStart + spec.wave(col, row, rows) * TIMING.waveGap + Math.round(random() * JITTER);
    return { bin, source, delay };
  });

  // Passed companies take the cluster slots in the order they arrive.
  let slot = 0;
  return [...entries]
    .sort((a, b) => a.delay - b.delay)
    .map(({ bin, source, delay }) => {
      const end = bin === -1 ? spec.slot(slot++) : spec.land(bin, random);
      const gate = spec.gate(source);
      return {
        x: round(end.x),
        y: round(end.y),
        sx: round(source.x - end.x),
        sy: round(source.y - end.y),
        gx: round(gate.x - end.x),
        gy: round(gate.y - end.y),
        delay,
        bin,
      };
    });
}

function field(sieve: Sieve, origin: Point, pitch: number) {
  const fullRows = Math.floor(sieve.input.value / FIELD_COLS);
  const rest = Array.from({ length: sieve.input.value % FIELD_COLS }, (_, col) => ({
    x: origin.x + col * pitch,
    y: origin.y + fullRows * pitch,
  }));
  return { x: origin.x, y: origin.y, pitch, cols: FIELD_COLS, fullRows, rest };
}

function clusterSlot(origin: Point, pitch: number) {
  return (index: number) => ({
    x: origin.x + (index % CLUSTER_COLS) * pitch,
    y: origin.y + Math.floor(index / CLUSTER_COLS) * pitch,
  });
}

/** A dotted line from `from` to `to`, each dot timed to appear as the line draws. */
function dottedPath(from: Point, to: Point, step: number, timeAt: (p: Point) => number) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const dots: (Point & { t: number })[] = [];
  for (let d = 0; d <= length; d += step) {
    const point = { x: from.x + ((to.x - from.x) * d) / length, y: from.y + ((to.y - from.y) * d) / length };
    dots.push({ x: round(point.x), y: round(point.y), t: Math.round(timeAt(point)) });
  }
  return dots;
}

function pathTime(from: number, to: number) {
  return (value: number) =>
    TIMING.pathStart + ((value - from) / (to - from)) * (TIMING.pathEnd - TIMING.pathStart);
}

/** Desktop: the run flows left to right, bins hang under the gate. */
export function wideLayout(sieve: Sieve): SieveLayout {
  const width = 1240;
  const pitch = 10;
  const origin = { x: 3, y: 124 };
  const rows = Math.ceil(sieve.input.value / FIELD_COLS);
  const midY = origin.y + ((rows - 1) * pitch) / 2;
  const gateX = 341;

  // The largest bin hangs straight off the gate.
  const floor = 384;
  const binWidth = 56;
  const binPitch = 180;
  const bins = binLengths(sieve, 100, 8).map((height, index) => ({
    x: gateX - binWidth / 2 + index * binPitch,
    y: floor - height,
    width: binWidth,
    height,
  }));

  const clusterRows = Math.ceil(sieve.passed.value / CLUSTER_COLS);
  const cluster = { x: 424, y: midY - ((clusterRows - 1) * pitch) / 2 };
  const slot = clusterSlot(cluster, pitch);

  // The review mark sits flush with the right edge (see .sieve-wide .sieve-mark).
  const pathFrom = { x: 488, y: midY };
  const pathTo = { x: 1150, y: midY };
  const mark = { x: width - 28, y: midY };
  const time = pathTime(pathFrom.x, pathTo.x);
  const stageCount = sieve.next.length - 1;
  const stages = Array.from({ length: stageCount }, (_, index) => {
    const x = pathFrom.x + ((index + 1) * (mark.x - pathFrom.x)) / (stageCount + 1);
    return { x: round(x), y: midY, t: Math.round(time(x)) };
  });

  return {
    width,
    height: floor + 4,
    dot: 3,
    field: field(sieve, origin, pitch),
    gate: [gateX - 5, gateX + 5].map((x) => ({ x1: x, y1: 112, x2: x, y2: origin.y + (rows - 1) * pitch + 12 })),
    bins,
    cluster,
    clusterDots: Array.from({ length: sieve.passed.value }, (_, index) => slot(index)),
    path: dottedPath(pathFrom, pathTo, 8, (p) => time(p.x)),
    stages,
    mark,
    travelers: () =>
      travelers(sieve, {
        pitch,
        origin,
        wave: (col) => Math.floor(((FIELD_COLS - 1 - col) * TIMING.waves) / FIELD_COLS),
        gate: (source) => ({ x: gateX, y: source.y }),
        land: (bin, random) => {
          const box = bins[bin];
          return {
            x: box.x + 6 + random() * (box.width - 12),
            y: box.y + 3 + random() * Math.max(0, Math.min(box.height - 6, 28)),
          };
        },
        slot,
      }),
  };
}

/** Mobile and tablet: the run flows top to bottom, bins are bars under the gate. */
export function narrowLayout(sieve: Sieve): SieveLayout {
  const width = 320;
  const pitch = 8;
  const origin = { x: 2, y: 60 };
  const rows = Math.ceil(sieve.input.value / FIELD_COLS);
  const fieldBottom = origin.y + (rows - 1) * pitch;
  const gateY = fieldBottom + 24;

  const binTop = gateY + 20;
  const binPitch = 46;
  const bins = binLengths(sieve, 120, 8).map((length, index) => ({
    x: 0,
    y: binTop + index * binPitch + 3,
    width: length,
    height: 12,
  }));
  const binsBottom = binTop + sieve.rejected.length * binPitch;

  const cluster = { x: 12, y: binsBottom + 6 };
  const slot = clusterSlot(cluster, pitch);
  const clusterRows = Math.ceil(sieve.passed.value / CLUSTER_COLS);
  const stagePitch = 34;
  const pathFrom = { x: 28, y: cluster.y + (clusterRows - 1) * pitch + 8 };
  const stageCount = sieve.next.length - 1;
  const mark = { x: 28, y: pathFrom.y + (stageCount + 1) * stagePitch + 22 };
  const time = pathTime(pathFrom.y, mark.y - 28);
  const stages = Array.from({ length: stageCount }, (_, index) => {
    const y = pathFrom.y + (index + 1) * stagePitch;
    return { x: 28, y, t: Math.round(time(y)) };
  });

  return {
    width,
    height: mark.y + 30,
    dot: 2,
    field: field(sieve, origin, pitch),
    gate: [gateY - 3, gateY + 3].map((y) => ({ x1: 0, y1: y, x2: 228, y2: y })),
    bins,
    cluster,
    clusterDots: Array.from({ length: sieve.passed.value }, (_, index) => slot(index)),
    path: dottedPath(pathFrom, { x: 28, y: mark.y - 34 }, 8, (p) => time(p.y)),
    stages,
    mark,
    travelers: () =>
      travelers(sieve, {
        pitch,
        origin,
        wave: (_, row, total) => Math.floor(((total - 1 - row) * TIMING.waves) / total),
        gate: (source) => ({ x: source.x, y: gateY }),
        land: (bin, random) => {
          const box = bins[bin];
          return { x: box.x + 2 + random() * Math.max(0, box.width - 4), y: box.y + 3 + random() * 6 };
        },
        slot,
      }),
  };
}

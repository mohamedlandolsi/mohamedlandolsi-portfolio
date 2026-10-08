import type { ComponentType } from "react";
import * as GtmEngine from "./GtmEngineOverview";
import * as JobRadar from "./JobRadarOverview";
import * as Wavess from "./WavessArchitecture";

export const diagrams = {
  "gtm-engine-overview": { Drawing: GtmEngine.GtmEngineOverview, caption: GtmEngine.caption },
  "job-radar-overview": { Drawing: JobRadar.JobRadarOverview, caption: JobRadar.caption },
  "wavess-architecture": { Drawing: Wavess.WavessArchitecture, caption: Wavess.caption },
} satisfies Record<string, { Drawing: ComponentType; caption: string }>;

export type DiagramName = keyof typeof diagrams;

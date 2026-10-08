import claimsJson from "@/content/claims.json";
import decisionsJson from "@/content/decisions.json";
import experienceJson from "@/content/experience.json";
import profileJson from "@/content/profile.json";
import projectsJson from "@/content/projects.json";
import skillsJson from "@/content/skills.json";

// Types: one per file in content/

export interface Profile {
  name: string;
  role: string;
  role_short: string;
  positioning: string;
  /** The tools named in the hero, in order. */
  tools: string[];
  hero_headline_options: string[];
  hero_headline_default: number;
  location: string;
  timezone: string;
  availability: { status: string; short: string; text: string; relocation: string };
  links: {
    email: string;
    linkedin: string;
    github: string;
    cv_pdf: string;
    loom_gtm_engine: string;
    site_repo: string;
  };
  languages: { name: string; level: string }[];
  education: { school: string; degree: string; start: string; end: string }[];
  about: string[];
  /** "How I work" on the home page: each ends with a link to the decision that shows it. */
  principles: { title: string; text: string; decision: string }[];
  never_publish: string[];
}

export interface ExperienceHighlight {
  text: string;
  claims: string[];
  verify?: string;
}

export interface Experience {
  id: string;
  company: string;
  company_context?: string;
  title: string;
  type: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  highlights: ExperienceHighlight[];
  stack: string[];
  case_study?: string;
  show_on_home?: boolean;
}

export interface ProjectMetric {
  claim: string;
  value: string;
  label: string;
}

export interface SieveBin {
  reason: string;
  /** Lower-case name used inside a sentence ("timezone 234"). */
  short: string;
  count: number;
  rule: string;
}

export interface Sieve {
  claim: string;
  date: string;
  input: { value: number; label: string };
  gate_label: string;
  rejected: SieveBin[];
  passed: { value: number; label: string };
  next: string[];
  caption: string;
}

export interface Project {
  slug: string;
  title: string;
  one_liner: string;
  role: string;
  period: string;
  status: string;
  stack: string[];
  metrics: ProjectMetric[];
  sieve?: Sieve;
  links: { repo?: string; loom?: string };
  featured: boolean;
  order: number;
  notes?: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface Skills {
  groups: SkillGroup[];
}

export type DecisionStatus = "accepted" | "superseded";

export interface Decision {
  id: string;
  project: string;
  title: string;
  status: DecisionStatus;
  superseded_by: string | null;
  context: string;
  decision: string;
  tradeoffs: string;
  source_internal: string;
}

export type ClaimStatus = "verified" | "self-reported" | "target";

export interface Claim {
  id: string;
  value: string;
  label: string;
  inline: string;
  source: string;
  date: string;
  status: ClaimStatus;
}

// Loaders

const profile: Profile = profileJson;
const experience: Experience[] = experienceJson;
const projects = (projectsJson as Project[]).toSorted((a, b) => a.order - b.order);
const skills: Skills = skillsJson;
const decisions = decisionsJson as Decision[];
const claims = claimsJson as Claim[];

const claimsById = new Map(claims.map((claim) => [claim.id, claim]));
const decisionsById = new Map(decisions.map((decision) => [decision.id, decision]));

export function getProfile(): Profile {
  return profile;
}

export function getExperience(): Experience[] {
  return experience;
}

export function getProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getProject(slug: string): Project {
  const project = projects.find((candidate) => candidate.slug === slug);
  if (!project) throw new Error(`Unknown project "${slug}" (content/projects.json)`);
  return project;
}

export function getSkills(): Skills {
  return skills;
}

export function getDecisions(): Decision[] {
  return decisions;
}

export function getDecision(id: string): Decision {
  const decision = decisionsById.get(id);
  if (!decision) throw new Error(`Unknown decision "${id}" (content/decisions.json)`);
  return decision;
}

export function getClaims(): Claim[] {
  return claims;
}

/** Every number on the site goes through here. An unknown ID fails the build. */
export function getClaim(id: string): Claim {
  const claim = claimsById.get(id);
  if (!claim) throw new Error(`Unknown claim "${id}" (content/claims.json)`);
  return claim;
}

/** The sieve data of a project. Fails the build if the counts do not add up. */
export function getSieve(slug: string): Sieve {
  const { sieve } = getProject(slug);
  if (!sieve) throw new Error(`Project "${slug}" has no sieve (content/projects.json)`);
  const rejected = sieve.rejected.reduce((sum, bin) => sum + bin.count, 0);
  if (rejected + sieve.passed.value !== sieve.input.value) {
    throw new Error(
      `Sieve counts for "${slug}" do not add up: ${rejected} rejected + ${sieve.passed.value} passed is not ${sieve.input.value}`,
    );
  }
  return sieve;
}

/** Placeholder facts start with "TODO" in content/. They are never rendered. */
export function isTodo(value: string | undefined | null): boolean {
  return !value || value.trim().toUpperCase().startsWith("TODO");
}

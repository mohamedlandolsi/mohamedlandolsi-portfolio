"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState, useSyncExternalStore } from "react";
import { DecisionBody, type DecisionRef, type DecisionText } from "@/components/DecisionBody/DecisionBody";
import type { DecisionStatus } from "@/lib/content";
import "./decision-log.css";

export interface LogDecision extends DecisionText {
  status: DecisionStatus;
  replacement: DecisionRef | null;
}

export interface DecisionGroup {
  slug: string;
  title: string;
  /** Path of the case study, when it is published. */
  caseStudy: string | null;
  decisions: LogDecision[];
}

const ALL = "all";

const plural = (count: number) => `${count} decision${count === 1 ? "" : "s"}`;
const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// The URL hash names the decision a link points at.
function subscribeToHash(notify: () => void) {
  window.addEventListener("hashchange", notify);
  return () => window.removeEventListener("hashchange", notify);
}
function readHash() {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return "";
  }
}
const noHash = () => "";

function Segmented({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="tool-group">
      <legend className="spec-label">{legend}</legend>
      <div className="seg">
        {options.map((option) => (
          <label key={option.value} className="seg-option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function DecisionRow({ decision, current }: { decision: LogDecision; current: boolean }) {
  return (
    // The inline script on the page may open the linked row before hydration: the DOM wins.
    <details
      id={decision.id}
      className="decision decision-row"
      data-current={current ? "" : undefined}
      // A link moves focus to the row itself, so the next Tab continues from here.
      tabIndex={-1}
      suppressHydrationWarning
    >
      <summary>
        <span className="decision-id">{decision.id}</span>
        <span className="decision-title">
          {decision.title}
          {decision.status === "superseded" && (
            <>
              {" "}
              <span className="decision-status">Superseded</span>
            </>
          )}
        </span>
      </summary>
      <div className="decision-content">
        <DecisionBody decision={decision} replacement={decision.replacement} inLog />
        <p className="type-meta mt-4">
          <a href={`#${decision.id}`}>Link to {decision.id}</a>
        </p>
      </div>
    </details>
  );
}

/**
 * Every decision is in the server-rendered HTML as a details row, so the log reads without
 * JavaScript. Search and filters only hide rows; a link to a decision opens it and scrolls to it.
 */
export function DecisionLog({ groups }: { groups: DecisionGroup[] }) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [project, setProject] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  // Search covers the ID, title, context and decision of each row.
  const haystacks = useMemo(
    () =>
      new Map(
        groups.flatMap((group) =>
          group.decisions.map((item) => [item.id, `${item.id} ${item.title} ${item.context} ${item.decision}`.toLowerCase()]),
        ),
      ),
    [groups],
  );
  const statuses = useMemo(() => [...new Set(groups.flatMap((group) => group.decisions.map((item) => item.status)))], [groups]);
  const total = haystacks.size;

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (slug: string, item: LogDecision) =>
    (project === ALL || project === slug) &&
    (status === ALL || status === item.status) &&
    terms.every((term) => haystacks.get(item.id)?.includes(term));

  const hash = useSyncExternalStore(subscribeToHash, readHash, noHash);
  const targetGroup = groups.find((group) => group.decisions.some((item) => item.id === hash));
  const target = targetGroup?.decisions.find((item) => item.id === hash);
  const current = target ? target.id : null;

  // A link to a decision wins over the filters: clear them when they would hide it.
  const [handledHash, setHandledHash] = useState("");
  if (hash !== handledHash) {
    setHandledHash(hash);
    if (targetGroup && target && !matches(targetGroup.slug, target)) {
      setQuery("");
      setProject(ALL);
      setStatus(ALL);
    }
  }

  useEffect(() => {
    if (!current) return;
    const row = document.getElementById(current);
    if (!(row instanceof HTMLDetailsElement)) return;
    // Opened by a link, not toggled by the reader: skip the height transition.
    row.dataset.instant = "";
    row.open = true;
    row.scrollIntoView({ block: "start" });
    row.focus({ preventScroll: true });
    const timer = setTimeout(() => delete row.dataset.instant, 120);
    return () => {
      clearTimeout(timer);
      delete row.dataset.instant;
    };
  }, [current]);

  const visible = groups.map((group) => group.decisions.filter((item) => matches(group.slug, item)));
  const shown = visible.reduce((sum, items) => sum + items.length, 0);

  function reset() {
    setQuery("");
    setProject(ALL);
    setStatus(ALL);
  }

  return (
    <div className="decision-log">
      <form role="search" aria-label="Decisions" className="decision-tools" onSubmit={(event) => event.preventDefault()}>
        <div>
          <label htmlFor={searchId} className="spec-label block">
            Search
          </label>
          <input
            id={searchId}
            type="search"
            className="tool-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, context or decision"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="tool-filters">
          <Segmented
            legend="Project"
            name="project"
            value={project}
            onChange={setProject}
            options={[{ value: ALL, label: "All" }, ...groups.map((group) => ({ value: group.slug, label: group.title }))]}
          />
          <Segmented
            legend="Status"
            name="status"
            value={status}
            onChange={setStatus}
            options={[{ value: ALL, label: "All" }, ...statuses.map((value) => ({ value, label: upperFirst(value) }))]}
          />
        </div>
        {/* The group tags show the counts; this line is for screen readers. */}
        <p role="status" className="sr-only">
          {shown === total ? plural(total) : `${shown} of ${plural(total)}`}
        </p>
      </form>

      {groups.map((group, index) => {
        const inGroup = visible[index];
        const headingId = `log-${group.slug}`;
        return (
          <section key={group.slug} className="decision-group" aria-labelledby={headingId} hidden={inGroup.length === 0}>
            <div className="sec-head">
              <h2 id={headingId} className="sec-title">
                {group.title}
              </h2>
              <span className="sec-tag">
                {inGroup.length === group.decisions.length ? plural(group.decisions.length) : `${inGroup.length} of ${plural(group.decisions.length)}`}
              </span>
            </div>
            {group.caseStudy && (
              <p className="decision-group-link">
                <Link href={group.caseStudy}>Read the case study</Link>
              </p>
            )}
            <ul className="cells decision-list">
              {group.decisions.map((item) => (
                <li key={item.id} className="cell" hidden={inGroup.includes(item) ? undefined : true}>
                  <DecisionRow decision={item} current={item.id === current} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <div className="panel decision-empty" hidden={shown > 0}>
        <p>No decision matches this search and these filters.</p>
        <button type="button" className="button mt-4" onClick={reset}>
          Clear search and filters
        </button>
      </div>
    </div>
  );
}

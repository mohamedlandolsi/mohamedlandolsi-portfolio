/** Section title on the left, a short mono tag on the right. */
export function SectionHead({ id, title, tag }: { id: string; title: string; tag?: string }) {
  return (
    <div className="sec-head">
      <h2 id={id} className="sec-title">
        {title}
      </h2>
      {tag && <span className="sec-tag">{tag}</span>}
    </div>
  );
}

const RAAHBAN_URL = "https://raahban.com/";

/** Promotes Raahban for Pakistani admissions & career guidance. */
export function RaahbanCareerCard() {
  return (
    <section className="card overflow-hidden">
      <div
        className="relative p-6 sm:p-8"
        style={{
          background:
            "linear-gradient(145deg, rgb(var(--accent) / 0.12), rgb(var(--accent-soft) / 0.35))",
        }}
      >
        <span className="chip text-[10px]">Career & admissions</span>
        <h2 className="mt-3 text-xl font-bold sm:text-2xl">
          Need career or university guidance?
        </h2>
        <p className="muted mt-2 max-w-2xl text-sm leading-relaxed">
          After Hifz and studies, plan your future with{" "}
          <strong className="text-wabil-600">Raahban</strong> — MDCAT, ECAT &amp; FSc admissions
          help for Pakistani students: merit calculator, 150+ universities, scholarships, and a
          bilingual AI counselor.
        </p>

        <ul className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          {["Merit calculator", "University shortlists", "Scholarships", "AI counselor"].map(
            (item) => (
              <li
                key={item}
                className="rounded-full border px-3 py-1"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                {item}
              </li>
            ),
          )}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={RAAHBAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Visit Raahban.com
          </a>
          <a
            href={`${RAAHBAN_URL}#faq`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm"
          >
            Learn more
          </a>
        </div>

        <p className="muted mt-4 text-[11px]">
          Built by Ahmad Yaseen ·{" "}
          <a
            href={RAAHBAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-wabil-600 hover:underline"
          >
            raahban.com
          </a>
        </p>
      </div>
    </section>
  );
}

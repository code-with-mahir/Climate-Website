export default function MethodologyPage() {
    return (
        <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:px-12">
            <div className="glass-panel rounded-3xl p-8 sm:p-12">
                <p className="text-sm uppercase tracking-[0.28em] text-orange-300/80">
                    Methodology
                </p>
                <h1 className="heading-font mt-3 text-4xl font-semibold text-white sm:text-5xl">
                    How EcoPulse AI builds each briefing
                </h1>
                <p className="mt-5 text-base leading-8 text-slate-300">
                    EcoPulse AI uses Gemini 1.5 Flash to synthesize the most recent climate updates
                    from NASA and IPCC RSS feeds. The model clusters overlapping signals, validates
                    the narrative against source citations, and generates structured climate
                    briefings designed for fast executive review.
                </p>

                <div className="mt-10 space-y-6">
                    <section>
                        <h2 className="heading-font text-2xl font-semibold text-white">
                            Pipeline overview
                        </h2>
                        <p className="mt-3 text-base leading-7 text-slate-300">
                            The portal continuously ingests RSS headlines, normalizes the articles
                            into a unified schema, and prepares a context bundle for Gemini 1.5
                            Flash. The model outputs a JSON feed that powers the dashboard, archive,
                            and article pages, ensuring consistent metadata across the experience.
                        </p>
                    </section>

                    <section>
                        <h2 className="heading-font text-2xl font-semibold text-white">
                            Data integrity
                        </h2>
                        <p className="mt-3 text-base leading-7 text-slate-300">
                            We anchor every generated report to the RSS source context and preserve
                            original titles, sources, and timestamps wherever possible. Automated
                            validations prevent malformed output and ensure the portal reflects
                            official NASA and IPCC reporting before publication.
                        </p>
                    </section>

                    <section>
                        <h2 className="heading-font text-2xl font-semibold text-white">
                            Human review
                        </h2>
                        <p className="mt-3 text-base leading-7 text-slate-300">
                            Editorial oversight audits the feed daily, with escalation workflows for
                            sensitive policy or hazard updates. This blend of automation and
                            governance keeps EcoPulse transparent, accountable, and aligned with
                            scientific consensus.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

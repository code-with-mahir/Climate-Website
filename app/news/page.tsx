import Link from 'next/link';

const newsItems = [
    {
        id: 'nasa-heat-1',
        title: 'NASA updates seasonal heat anomaly outlook',
        summary: 'Early indicators point to persistent heat belts across the Northern Hemisphere.',
        source: 'NASA Climate',
        time: '2 hours ago',
    },
    {
        id: 'ipcc-policy-1',
        title: 'IPCC synthesis memo highlights adaptation gaps',
        summary: 'New policy briefing calls for faster resilience funding pathways.',
        source: 'IPCC Brief',
        time: 'Yesterday',
    },
    {
        id: 'nasa-ocean-1',
        title: 'Ocean heat content rises again in latest data pull',
        summary: 'Surface and deep ocean metrics show continued accumulation of heat.',
        source: 'NASA Ocean',
        time: '2 days ago',
    },
    {
        id: 'ipcc-regions-1',
        title: 'Regional impact reports emphasize coastal pressure',
        summary: 'Latest assessments underscore sea level risk for critical ports.',
        source: 'IPCC Regional',
        time: '3 days ago',
    },
];

export default async function NewsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q?.toLowerCase().trim() ?? '';
    const filtered = query
        ? newsItems.filter((item) =>
              `${item.title} ${item.summary} ${item.source}`.toLowerCase().includes(query),
          )
        : newsItems;

    return (
        <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
            <div className="mb-10">
                <p className="text-sm uppercase tracking-[0.28em] text-orange-300/80">
                    Recent Reports & News
                </p>
                <h1 className="heading-font mt-3 text-4xl font-semibold text-white sm:text-5xl">
                    Short-form intelligence feed
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                    Rapid climate updates sorted by time, built for quick scanning.
                </p>
            </div>

            <div className="space-y-6">
                {filtered.map((item) => (
                    <div key={item.id} className="relative pl-8">
                        <div className="absolute left-2 top-2 h-full w-px bg-white/10" />
                        <div className="absolute left-0 top-2 h-4 w-4 rounded-full border border-orange-300/40 bg-orange-400/20" />
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-orange-200/80">
                                    {item.source}
                                </p>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    {item.time}
                                </p>
                            </div>
                            <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
                            <p className="mt-3 text-sm leading-7 text-slate-300">{item.summary}</p>
                            <div className="mt-4">
                                <Link
                                    href="/archive"
                                    className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200/80">
                                    View source archive
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

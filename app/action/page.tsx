'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = [
    {
        id: 'individual',
        label: 'Individual Action',
        items: [
            'Switch to clean power',
            'Shift to low-carbon travel',
            'Cut household waste',
            'Support local climate initiatives',
        ],
    },
    {
        id: 'community',
        label: 'Community Projects',
        items: [
            'Neighborhood solar co-ops',
            'Urban tree canopy expansion',
            'Community cooling centers',
            'Resilience training drills',
        ],
    },
    {
        id: 'policy',
        label: 'Policy Updates',
        items: [
            'City-level net-zero ordinances',
            'Grid decarbonization targets',
            'Heat response funding',
            'Coastal protection mandates',
        ],
    },
];

const policyFeed = [
    {
        region: 'EU',
        title: 'Fit for 55 acceleration package renewed',
        summary: 'Member states align timelines for emissions reductions.',
    },
    {
        region: 'India',
        title: 'National Mission on Green Hydrogen expanded',
        summary: 'New funding unlocks large-scale pilot clusters.',
    },
    {
        region: 'Brazil',
        title: 'Amazon protection enforcement widened',
        summary: 'Surveillance and enforcement budgets increased.',
    },
    {
        region: 'USA',
        title: 'Federal clean grid procurement updated',
        summary: 'Agencies prioritize clean energy supply agreements.',
    },
];

export default function ActionCenterPage() {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

    return (
        <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-3xl p-6 sm:p-10">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.28em] text-orange-300/80">
                        Action Center
                    </p>
                    <h1 className="heading-font mt-3 text-4xl font-semibold text-white sm:text-5xl">
                        Turn climate intelligence into collective action
                    </h1>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                        Curate tangible steps for individuals, neighborhoods, and policymakers with
                        clear next moves.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                            Checklist Workflow
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            {tabs.map((tab) => {
                                const isActive = tab.id === activeTab;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                                            isActive
                                                ? 'border-orange-300/40 bg-orange-400/15 text-white'
                                                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                                        }`}>
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 grid gap-3">
                            {active.items.map((item) => (
                                <label
                                    key={item}
                                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-white/30 bg-black/40 text-orange-300"
                                    />
                                    {item}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                            Global Policy Tracker
                        </p>
                        <div className="mt-4 grid gap-4">
                            {policyFeed.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-orange-200/80">
                                        {item.region}
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-white">
                                        {item.title}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-300">
                                        {item.summary}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

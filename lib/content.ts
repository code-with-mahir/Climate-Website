export type ClimateStat = {
    label: string;
    value: string;
    delta: string;
    note: string;
};

export type ClimateArticle = {
    title: string;
    full_article_markdown: string;
    meta_description: string;
    suggested_image_query: string;
    image_url?: string;
    source_title?: string;
    source_link?: string;
    published_at?: string;
};

export type SolutionStep = {
    title: string;
    description: string;
    outcomes: string[];
};

export const defaultClimateStats: ClimateStat[] = [
    {
        label: 'Atmospheric CO2',
        value: '426.8 ppm',
        delta: '+2.9 ppm YoY',
        note: 'Latest global trend signal',
    },
    {
        label: 'Global Temperature',
        value: '+1.47°C',
        delta: 'Above pre-industrial',
        note: 'Rolling 12-month average',
    },
    {
        label: 'Arctic Sea Ice',
        value: '-12.8%',
        delta: 'From 2000 baseline',
        note: 'Summer minimum change',
    },
];

export const defaultArticles: ClimateArticle[] = [
    {
        title: 'Heat amplification is now a city design problem',
        full_article_markdown: [
            '## Why',
            'Dense urban surfaces trap heat faster than surrounding rural areas, creating dangerous overnight warmth and compounding exposure during heat waves.',
            '',
            '## Impact',
            'Health systems face higher heat stress admissions, energy demand spikes, and infrastructure strain across urban cores.',
            '',
            '## Solutions',
            '- Prioritize cool roofs, shade corridors, and tree canopy expansion in high-exposure districts.',
            '- Build neighborhood heat-response plans with stronger public alerts.',
            '- Upgrade buildings for passive cooling and lower energy stress.',
        ].join('\n'),
        meta_description:
            'Urban heat is becoming a core design challenge for cities that need to stay livable under rising temperatures.',
        suggested_image_query: 'urban heat climate adaptation city',
        image_url:
            'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    },
    {
        title: 'Ocean warming is reordering coastal economies',
        full_article_markdown: [
            '## Why',
            'Marine heat waves alter fisheries, storm intensity, and insurance pricing at the shoreline, changing how coastal economies function.',
            '',
            '## Impact',
            'Ports, tourism, and food supply chains absorb direct losses and long-tail adaptation costs.',
            '',
            '## Solutions',
            '- Invest in resilient port infrastructure, early-warning systems, and diversified coastal livelihoods.',
            '- Strengthen marine monitoring and emergency response.',
            '- Use climate projections in coastal planning and investment decisions.',
        ].join('\n'),
        meta_description:
            'Ocean warming is reshaping coastal infrastructure, fisheries, and the economics of shoreline resilience.',
        suggested_image_query: 'ocean warming coastal resilience',
        image_url:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    },
    {
        title: 'Climate migration is becoming a planning input',
        full_article_markdown: [
            '## Why',
            'Water stress, food insecurity, and repeated disasters are pushing households toward safer regions and making migration a planning variable.',
            '',
            '## Impact',
            'Cities and services face rapid housing, healthcare, and employment pressure without preparation.',
            '',
            '## Solutions',
            '- Use anticipatory zoning, social protection, and climate-resilient public service expansion.',
            '- Invest in receiving-city infrastructure before pressure peaks.',
            '- Improve data sharing between local, regional, and national agencies.',
        ].join('\n'),
        meta_description:
            'Climate migration is becoming a real planning input for cities, services, and regional resilience.',
        suggested_image_query: 'climate migration resilience planning',
        image_url:
            'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
    },
];

export const defaultReports = defaultArticles;

export const solutionSteps: SolutionStep[] = [
    {
        title: 'Reduce',
        description:
            'Cut emissions where the curve is steepest and the policy response is already available.',
        outcomes: ['Electrify mobility', 'Retrofit buildings', 'Switch to clean power'],
    },
    {
        title: 'Adapt',
        description:
            'Design communities that keep functioning during heat, flood, and drought pressure.',
        outcomes: ['Heat action plans', 'Flood buffers', 'Water security upgrades'],
    },
    {
        title: 'Restore',
        description:
            'Strengthen natural systems that stabilize climate and absorb shocks over time.',
        outcomes: ['Wetland recovery', 'Forest regeneration', 'Soil carbon programs'],
    },
];

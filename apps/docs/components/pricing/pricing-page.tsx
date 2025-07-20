"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info as InfoIcon, Calculator as CalculatorIcon } from "@phosphor-icons/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Slider } from "@/components/ui/slider";

const DATABUDDY_PLANS = [
    { name: "Free", price: 0, events: 25000 },
    { name: "Pro", price: 15, events: 60000 },
    { name: "Scale", price: 40, events: 300000 },
    { name: "Buddy", price: 100, events: 1000000 },
];

const PLAUSIBLE_TIERS = [
    { max: 10_000, price: 14, features: "1 website, core features" },
    { max: 100_000, price: 29, features: "3 websites, custom events, goal tracking" },
    { max: 1_000_000, price: 104, features: "10 websites, team support" },
    { max: 2_000_000, price: 134, features: "20 websites, full features" },
    { max: 5_000_000, price: 194, features: "Starter: 1 site, 3yr retention, GA import, events, segments, email/slack reports" },
    { max: 10_000_000, price: 254, features: "Growth: 3 sites, 3 users, shared links, team mgmt, embedded dashboards" },
    { max: Number.POSITIVE_INFINITY, price: 'Custom', features: "Contact for Enterprise pricing" },
];

const COMPETITORS = [
    {
        name: "Databuddy",
        plans: DATABUDDY_PLANS,
        overage: true,
        overageTooltip: true,
        calc: (events: number) => calculateDatabuddyCost(events),
    },
    {
        name: "Google Analytics",
        plans: [
            { name: "Free", price: 0, events: 1000000 },
        ],
        overage: false,
        overageTooltip: false,
        calc: (events: number) => 0,
    },
    {
        name: "Plausible",
        plans: PLAUSIBLE_TIERS,
        overage: false,
        overageTooltip: false,
        calc: (events: number) => calculatePlausibleCost(events),
    },
    {
        name: "Fathom",
        plans: [
            { name: "Starter", price: 14, events: 100000 },
            { name: "Business", price: 44, events: 1000000 },
        ],
        overage: true,
        overageTooltip: false,
        overageRate: 0.0004,
        calc: (events: number) => calculateFlatOverage(events, [
            { price: 14, events: 100000 },
            { price: 44, events: 1000000 },
        ], 0.0004),
    },
    {
        name: "PostHog",
        plans: [
            { name: "Analytics", price: 0, events: 1_000_000 },
        ],
        overage: true,
        overageTooltip: true,
        calc: (events: number) => calculatePosthogCost(events),
    },
];

const DATABUDDY_TIERS = [
    { to: 2_000_000, rate: 0.000035 },
    { to: 10_000_000, rate: 0.000030 },
    { to: 50_000_000, rate: 0.000020 },
    { to: 250_000_000, rate: 0.000015 },
    { to: "inf", rate: 0.000010 },
];

const POSTHOG_TIERS = [
    { to: 1_000_000, rate: 0 },
    { to: 2_000_000, rate: 0.00005 },
    { to: 15_000_000, rate: 0.0000343 },
    { to: 50_000_000, rate: 0.0000295 },
    { to: 100_000_000, rate: 0.0000218 },
    { to: 250_000_000, rate: 0.0000150 },
    { to: "inf", rate: 0.000009 },
];

const FATHOM_TIERS = [
    { max: 100_000, price: 14 },
    { max: 200_000, price: 24 },
    { max: 500_000, price: 44 },
    { max: 1_000_000, price: 74 },
    { max: 2_000_000, price: 114 },
    { max: 5_000_000, price: 184 },
    { max: 10_000_000, price: 274 },
    { max: Number.POSITIVE_INFINITY, price: 'Custom' },
];

function calculateDatabuddyCost(events: number) {
    let cost = 0;
    let remaining = events;
    let prev = 0;
    for (const tier of DATABUDDY_TIERS) {
        const max = tier.to === "inf" ? Number.POSITIVE_INFINITY : Number(tier.to);
        const tierEvents = Math.max(Math.min(remaining, max - prev), 0);
        if (tierEvents > 0) {
            cost += tierEvents * tier.rate;
            remaining -= tierEvents;
        }
        prev = max;
        if (remaining <= 0) break;
    }
    return cost;
}

function calculateFlatOverage(events: number, plans: { price: number; events: number }[], overage: number) {
    let plan = plans[0];
    for (let i = plans.length - 1; i >= 0; i--) {
        if (events > plans[i].events) {
            plan = plans[i];
            break;
        }
    }
    if (events <= plan.events) return plan.price;
    return plan.price + (events - plan.events) * overage;
}

function calculatePosthogCost(events: number) {
    let cost = 0;
    let remaining = events;
    let prev = 0;
    for (const tier of POSTHOG_TIERS) {
        const max = tier.to === "inf" ? Number.POSITIVE_INFINITY : Number(tier.to);
        const tierEvents = Math.max(Math.min(remaining, max - prev), 0);
        if (tierEvents > 0) {
            cost += tierEvents * tier.rate;
            remaining -= tierEvents;
        }
        prev = max;
        if (remaining <= 0) break;
    }
    return cost;
}

function calculatePlausibleCost(events: number) {
    for (const tier of PLAUSIBLE_TIERS) {
        if (typeof tier.price === 'number' && events <= tier.max) return tier.price;
    }
    return 'Contact Sales';
}

function calculateFathomCost(events: number) {
    for (const tier of FATHOM_TIERS) {
        if (typeof tier.price === 'number' && events <= tier.max) return tier.price;
    }
    return 'Contact Sales';
}

function DatabuddyOverageTooltip() {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground cursor-help hover:text-foreground">
                    <InfoIcon size={12} />
                    <span>Tiered</span>
                </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="top" align="start">
                <div className="space-y-3">
                    <div>
                        <h4 className="font-semibold text-sm">Tiered Pricing Structure</h4>
                        <p className="text-xs text-muted-foreground">Lower rates for higher usage volumes</p>
                    </div>
                    <div className="space-y-2">
                        {DATABUDDY_TIERS.map((tier, i) => {
                            const from = i === 0 ? 0 : (typeof DATABUDDY_TIERS[i - 1].to === 'number' ? Number(DATABUDDY_TIERS[i - 1].to) + 1 : 0);
                            const to = tier.to === "inf" ? "∞" : Number(tier.to).toLocaleString();
                            return (
                                <div key={tier.to} className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">{from.toLocaleString()} - {to} events</span>
                                    <span className="font-mono font-medium">${tier.rate.toFixed(6)} each</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="pt-2 border-t text-xs text-muted-foreground">
                        You only pay the tier rate for usage within that range
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

function PosthogOverageTooltip() {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground cursor-help hover:text-foreground">
                    <InfoIcon size={12} />
                    <span>Tiered</span>
                </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="top" align="start">
                <div className="space-y-3">
                    <div>
                        <h4 className="font-semibold text-sm">PostHog Analytics Tiers</h4>
                        <p className="text-xs text-muted-foreground">Lower rates for higher usage volumes</p>
                    </div>
                    <div className="space-y-2">
                        {POSTHOG_TIERS.map((tier, i) => {
                            const from = i === 0 ? 0 : (typeof POSTHOG_TIERS[i - 1].to === 'number' ? Number(POSTHOG_TIERS[i - 1].to) + 1 : 0);
                            const to = tier.to === "inf" ? "∞" : Number(tier.to).toLocaleString();
                            return (
                                <div key={tier.to} className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">{from.toLocaleString()} - {to} events</span>
                                    <span className="font-mono font-medium">${tier.rate.toFixed(6)} each</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="pt-2 border-t text-xs text-muted-foreground">
                        First 1M events free. You only pay the tier rate for usage within that range.
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

function DataSoldMeter({ events }: { events: number }) {
    const mb = events * 0.002;
    let display = '';
    if (mb < 1000) {
        display = `${mb.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MB`;
    } else if (mb < 1_000_000) {
        const gb = mb / 1000;
        display = `${gb.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GB`;
    } else {
        const pb = mb / 1_000_000;
        display = `${pb.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PB`;
    }
    return (
        <span className="text-xs text-muted-foreground">Data sold to advertisers: {display}</span>
    );
}

export default function PricingPageContent() {
    const [events, setEvents] = useState(25000);

    return (
        <div className="min-h-screen relative overflow-x-hidden font-geist">
            {/* Layered background gradients */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-background" />
                <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-muted/50" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.08)_0%,transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary),0.06)_0%,transparent_60%)]" />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12 px-2 sm:px-4 md:px-8">
                <div className="w-full max-w-3xl space-y-10 bg-card/70 border border-border rounded-xl shadow-lg backdrop-blur-sm p-6 md:p-10">
                    <h1 className="text-3xl font-bold mb-2">Analytics Pricing Comparison</h1>
                    <p className="text-muted-foreground mb-6">
                        Compare analytics pricing at a glance. All prices are public and for self-serve plans.
                    </p>

                    {/* Concise Comparison Table */}
                    <Card className="bg-transparent border-none shadow-none p-0">
                        <CardHeader>
                            <CardTitle>Pricing Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded border border-border bg-background">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Provider</TableHead>
                                            <TableHead>Included Events</TableHead>
                                            <TableHead>Monthly Price</TableHead>
                                            <TableHead>Overage</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Databuddy */}
                                        <TableRow>
                                            <TableCell className="font-medium text-primary">Databuddy</TableCell>
                                            <TableCell className="text-foreground">25,000+</TableCell>
                                            <TableCell className="text-foreground">Free, then from $15/mo</TableCell>
                                            <TableCell className="text-foreground"><DatabuddyOverageTooltip /></TableCell>
                                        </TableRow>
                                        {/* Plausible */}
                                        <TableRow>
                                            <TableCell className="font-medium text-primary">Plausible</TableCell>
                                            <TableCell className="text-foreground">10,000+</TableCell>
                                            <TableCell className="text-foreground">from $9/mo</TableCell>
                                            <TableCell className="text-foreground text-center text-lg">✗</TableCell>
                                        </TableRow>
                                        {/* Fathom */}
                                        <TableRow>
                                            <TableCell className="font-medium text-primary">Fathom</TableCell>
                                            <TableCell className="text-foreground">100,000+</TableCell>
                                            <TableCell className="text-foreground">from $14/mo</TableCell>
                                            <TableCell className="text-foreground text-center text-lg">✗</TableCell>
                                        </TableRow>
                                        {/* PostHog */}
                                        <TableRow>
                                            <TableCell className="font-medium text-primary">PostHog</TableCell>
                                            <TableCell className="text-foreground">1,000,000+</TableCell>
                                            <TableCell className="text-foreground">Free, then usage-based</TableCell>
                                            <TableCell className="text-foreground"><PosthogOverageTooltip /></TableCell>
                                        </TableRow>
                                        {/* Google Analytics always last */}
                                        <TableRow key="Google Analytics">
                                            <TableCell className="font-medium text-primary">Google Analytics</TableCell>
                                            <TableCell className="text-foreground">1,000,000</TableCell>
                                            <TableCell className="text-foreground">
                                                <DataSoldMeter events={events} />
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">N/A</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="text-xs text-muted-foreground mt-4">
                                For higher volumes or enterprise, contact each provider for a custom quote.
                            </div>
                        </CardContent>
                    </Card>

                    {/* Calculator */}
                    <Card className="bg-transparent border-none shadow-none p-0 mt-10">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <CalculatorIcon size={20} weight="duotone" />
                            <CardTitle>Event-based Cost Calculator</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6 items-center w-full">
                                <div className="text-center">
                                    <span className="text-sm text-muted-foreground">Monthly Events</span>
                                    <div className="text-3xl font-bold text-primary mt-1" data-testid="event-count">{events.toLocaleString()}</div>
                                </div>
                                <Slider
                                    min={0}
                                    max={100_000_000}
                                    step={1000}
                                    value={[events]}
                                    onValueChange={([val]) => setEvents(val)}
                                    className="w-full sm:w-96"
                                    aria-label="Monthly events slider"
                                />
                            </div>
                            <div className="mt-10">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Provider</TableHead>
                                            <TableHead>Est. Monthly Cost</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {COMPETITORS.filter(p => p.name !== "Google Analytics").map((provider) => (
                                            <TableRow key={provider.name}>
                                                <TableCell className="font-medium text-primary text-lg">{provider.name}</TableCell>
                                                <TableCell className="text-foreground font-bold text-xl">{
                                                    provider.name === "Fathom"
                                                        ? (typeof calculateFathomCost(events) === 'number' ? `$${Number(calculateFathomCost(events)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : calculateFathomCost(events))
                                                        : provider.name === "Plausible"
                                                            ? (typeof calculatePlausibleCost(events) === 'number' ? `$${Number(calculatePlausibleCost(events)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : calculatePlausibleCost(events))
                                                            : typeof provider.calc(events) === 'number'
                                                                ? `$${(provider.calc(events) as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                                : provider.calc(events)
                                                }</TableCell>
                                            </TableRow>
                                        ))}
                                        {/* Google Analytics always last */}
                                        <TableRow key="Google Analytics">
                                            <TableCell className="font-medium text-primary text-lg">Google Analytics</TableCell>
                                            <TableCell className="text-foreground font-bold text-xl">
                                                <DataSoldMeter events={events} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-xs text-muted-foreground mt-8 text-center">
                        Pricing data as of 2024. For full details, see each provider’s website. This calculator is for estimation only.
                    </div>
                </div>
            </div>
        </div>
    );
} 
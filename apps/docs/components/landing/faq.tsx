import { MessageSquareText, HelpCircle, ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "Does it support edge runtimes?",
        answer: "Yes. It auto-detects the runtime and adjusts behavior. Fully tested on Cloudflare, Vercel, Deno, and Bun."
    },
    {
        question: "Can I use it in client-side apps?",
        answer: "Yes. You can use the in-memory adapter in Electron or browser contexts to rate-limit local actions."
    },
    {
        question: "Is it open source?",
        answer: "Yes. MIT licensed. Use it commercially, fork it, contribute back, or run it however you want."
    },
    {
        question: "How do I track or visualize usage?",
        answer: "The core does not include analytics by default. You can plug in any logging system, or send events to your preferred monitoring tools."
    }
]

export default function FAQ() {
    return (
        <div className="md:w-10/12 mx-auto font-geist relative md:border-l-0 md:border-b-0 md:border-[1.2px] border-border rounded-none -pr-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full md:mx-0">
                {/* FAQ Header */}
                <div className="border-l-[1.2px] border-t-[1.2px] border-border md:border-t-0 p-12 pb-6">
                    <div className="flex items-center gap-3 my-2">
                        <HelpCircle className="w-5 h-5 text-blue-500" />
                        <p className="text-muted-foreground font-medium">
                            Frequently Asked Questions
                        </p>
                    </div>
                    <div className="mt-4">
                        <div className="max-w-full">
                            <div className="flex gap-3">
                                <p className="max-w-lg text-2xl font-normal tracking-tighter md:text-3xl text-foreground">
                                    Everything you need to know about better-ratelimit
                                </p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-left text-muted-foreground leading-relaxed">
                            Can't find the answer you're looking for? Reach out to our team and we'll get back to you within 24 hours.
                        </p>
                    </div>
                </div>

                {/* FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-b-[1.2px] border-border">
                    {faqs.map((faq, index) => (
                        <div
                            key={faq.question}
                            className="border-l-[1.2px] border-t-[1.2px] border-border p-10 hover:bg-muted/30 transition-colors duration-200 group"
                        >
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight flex items-start gap-3">
                                    <span className="text-sm text-muted-foreground font-mono mt-1">Q{index + 1}</span>
                                    {faq.question}
                                </h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </p>
                            <div className="mt-6 pt-4 border-t border-border/30">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        Question {index + 1} of {faqs.length}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 
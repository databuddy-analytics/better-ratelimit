import { MessageSquareText, HelpCircle } from "lucide-react"

const faqs = [
    {
        question: "How is Databuddy different from Google Analytics?",
        answer: "Databuddy is built for privacy-first analytics with no cookies required, making it GDPR and CCPA compliant out of the box. Our script is 65x faster than GA4, with a <1KB footprint that won't impact your Core Web Vitals."
    },
    {
        question: "Do I need to add cookie consent banners?",
        answer: "No. Databuddy's analytics are completely cookieless, using privacy-preserving techniques to provide accurate analytics without tracking individual users. Our customers typically see a 30% increase in conversion rates after removing those intrusive cookie banners."
    },
    {
        question: "What's included in the free plan?",
        answer: "Our free plan includes up to 50,000 monthly pageviews, real-time analytics, basic event tracking, and 30-day data retention. It's perfect for small websites, personal projects, or to test Databuddy before upgrading."
    },
    {
        question: "How easy is it to implement Databuddy?",
        answer: "Implementation takes less than 5 minutes for most websites. Simply add our lightweight script to your site (we provide easy integrations for Next.js, React, WordPress, Shopify, and more), and you'll start seeing data immediately."
    }
]

export default function FAQ() {
    return (
        <div className="md:w-10/12 mx-auto font-geist relative md:border-l-0 md:border-b-0 md:border-[1.2px] border-border rounded-none -pr-2 bg-background/95">
            <div className="w-full md:mx-0">
                {/* FAQ Header */}
                <div className="border-l-[1.2px] border-t-[1.2px] border-border md:border-t-0 p-10 pb-2">
                    <div className="flex items-center gap-2 my-1">
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            Frequently Asked Questions
                        </p>
                    </div>
                    <div className="mt-2">
                        <div className="max-w-full">
                            <div className="flex gap-3">
                                <p className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl text-foreground">
                                    Everything you need to know about Databuddy
                                </p>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-left text-muted-foreground">
                            Can't find the answer you're looking for? Reach out to our team and we'll get back to you within 24 hours.
                        </p>
                    </div>
                </div>

                {/* FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-b-[1.2px] border-border">
                    {faqs.map((faq, index) => (
                        <div
                            key={faq.question}
                            className="border-l-[1.2px] border-t-[1.2px] border-border p-8 hover:bg-muted/30 transition-colors group"
                        >
                            <div className="mb-4">
                                <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                                    {faq.question}
                                </h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </p>
                            <div className="mt-4 pt-4 border-t border-border/50">
                                <span className="text-xs text-muted-foreground">
                                    Question {index + 1} of {faqs.length}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 
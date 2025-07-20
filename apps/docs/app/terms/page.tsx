import { Scale, FileText, Shield, AlertTriangle, CreditCard, Users, Clock, HelpCircle } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service | Databuddy',
    description: 'Databuddy\'s terms of service governing the use of our privacy-first analytics platform. Clear, fair terms that protect both our users and service.',
};

export default function TermsPage() {
    const lastUpdated = "June 23rd, 2025";

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-5 border border-primary/20">
                    <Scale className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Terms of Service
                </h1>
                <p className="text-muted-foreground mb-4">
                    Last Updated: <span className="text-foreground font-medium">{lastUpdated}</span>
                </p>
                <p className="max-w-2xl mx-auto text-muted-foreground">
                    Clear and fair terms that govern your use of Databuddy's analytics platform.
                    We believe in transparency and straightforward language.
                </p>
            </div>

            {/* Fair terms highlight */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold mb-3 flex items-center text-primary">
                    <Shield className="h-5 w-5 mr-2" />
                    Fair & Transparent Terms
                </h2>
                <p className="text-muted-foreground mb-4">
                    Our terms are designed to be fair, clear, and protect both our users and our service.
                    We avoid confusing legal jargon and focus on what really matters.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-primary">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm">Plain Language</span>
                    </div>
                    <div className="flex items-center text-primary">
                        <Scale className="h-4 w-4 mr-2" />
                        <span className="text-sm">Fair Terms</span>
                    </div>
                    <div className="flex items-center text-primary">
                        <Shield className="h-4 w-4 mr-2" />
                        <span className="text-sm">User Protection</span>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="lead text-lg text-muted-foreground mb-8">
                    These Terms of Service ("Terms") govern your access to and use of Databuddy's analytics platform
                    ("Service"). By using our Service, you agree to be bound by these Terms.
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                    <p className="mb-4">
                        Welcome to Databuddy ("we," "our," or "us"). These Terms of Service govern your access to and use of
                        our privacy-first analytics platform available at databuddy.cc and our related services.
                    </p>
                    <p className="mb-4">
                        By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any
                        part of these terms, then you may not access the Service.
                    </p>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 my-4">
                        <p className="text-sm">
                            <strong className="text-primary">Quick Summary:</strong> These terms cover how you can use our service,
                            your responsibilities, our responsibilities, and what happens if things go wrong.
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">2. Definitions</h2>
                    <p className="mb-4">To make these terms clear, here are some key definitions:</p>
                    <ul className="space-y-3 mb-4">
                        <li><strong>Account:</strong> Your unique account created to access our Service</li>
                        <li><strong>Service:</strong> Databuddy's analytics platform and related services</li>
                        <li><strong>User/You:</strong> The person or organization using our Service</li>
                        <li><strong>Website:</strong> The Databuddy website at databuddy.cc</li>
                        <li><strong>Content:</strong> Any data, text, or information you provide to our Service</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>
                    <p className="mb-4">
                        To use our Service, you need to create an account. When you register, you agree to:
                    </p>
                    <ul className="space-y-2 mb-4">
                        <li>Provide accurate, current, and complete information</li>
                        <li>Keep your account information up to date</li>
                        <li>Maintain the security of your password</li>
                        <li>Accept responsibility for all activities under your account</li>
                        <li>Notify us immediately of any unauthorized use</li>
                    </ul>
                    <p className="mb-4">
                        You must be at least 18 years old to create an account. If you're creating an account on behalf
                        of an organization, you must have the authority to bind that organization to these Terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>

                    <h3 className="text-xl font-semibold mb-3">What You Can Do</h3>
                    <p className="mb-3">You may use our Service to:</p>
                    <ul className="space-y-2 mb-6">
                        <li>Track analytics for websites you own or have permission to track</li>
                        <li>Generate reports and insights from your analytics data</li>
                        <li>Export your data for your own use</li>
                        <li>Use our API within reasonable limits</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3">What You Cannot Do</h3>
                    <p className="mb-3">You may not:</p>
                    <ul className="space-y-2 mb-4">
                        <li>Track websites you don't own without permission</li>
                        <li>Use the Service for illegal activities</li>
                        <li>Attempt to reverse engineer or hack our Service</li>
                        <li>Share your account credentials with others</li>
                        <li>Use the Service to collect personal information without consent</li>
                        <li>Overload our servers or interfere with other users</li>
                        <li>Violate any applicable laws or regulations</li>
                    </ul>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 my-4">
                        <p className="text-sm flex items-start">
                            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-400 flex-shrink-0" />
                            <span><strong className="text-amber-400">Important:</strong> We may suspend or terminate accounts that violate these terms.</span>
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">5. Privacy and Data</h2>
                    <p className="mb-4">
                        Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect
                        your information. By using our Service, you consent to our data practices as described in our
                        <a href="/privacy" className="text-primary hover:text-primary/80 ml-2">Privacy Policy</a>.
                    </p>
                    <p className="mb-4">Key points about data:</p>
                    <ul className="space-y-2 mb-4">
                        <li>We use privacy-first analytics that don't track individual users</li>
                        <li>You own your analytics data and can export it anytime</li>
                        <li>We don't sell your data to third parties</li>
                        <li>We comply with GDPR, CCPA, and other privacy regulations</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">6. Billing and Payments</h2>

                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-primary" />
                        Subscription Plans
                    </h3>
                    <p className="mb-4">
                        We offer various subscription plans with different features and usage limits.
                        Current pricing is available on our website.
                    </p>
                    <ul className="space-y-2 mb-6">
                        <li>Subscriptions are billed monthly or annually</li>
                        <li>All fees are non-refundable except as required by law</li>
                        <li>We may change pricing with 30 days notice</li>
                        <li>You can cancel your subscription at any time</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3">Payment Terms</h3>
                    <ul className="space-y-2 mb-4">
                        <li>Payment is due at the beginning of each billing cycle</li>
                        <li>We accept major credit cards and other payment methods</li>
                        <li>Failed payments may result in service suspension</li>
                        <li>You're responsible for all taxes and fees</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">7. Service Availability</h2>
                    <p className="mb-4">
                        We strive to provide reliable service, but we cannot guarantee 100% uptime.
                        We aim for 99.9% uptime and will notify you of planned maintenance.
                    </p>
                    <ul className="space-y-2 mb-4">
                        <li>We may temporarily suspend service for maintenance</li>
                        <li>We're not liable for service interruptions beyond our control</li>
                        <li>We'll make reasonable efforts to minimize downtime</li>
                        <li>Status updates are available on our status page</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
                    <p className="mb-4">
                        The Service and its original content, features, and functionality are owned by Databuddy
                        and are protected by copyright, trademark, and other laws.
                    </p>
                    <ul className="space-y-2 mb-4">
                        <li>You retain ownership of your data and content</li>
                        <li>We grant you a limited license to use our Service</li>
                        <li>You cannot copy, modify, or distribute our Service</li>
                        <li>Our trademarks and logos are our property</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
                    <p className="mb-4">
                        To the maximum extent permitted by law, Databuddy shall not be liable for any indirect,
                        incidental, special, consequential, or punitive damages.
                    </p>
                    <p className="mb-4">
                        Our total liability to you for any claims arising from these Terms or the Service shall not
                        exceed the amount you paid us in the 12 months preceding the claim.
                    </p>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 my-4">
                        <p className="text-sm">
                            <strong className="text-primary">Note:</strong> Some jurisdictions don't allow limitations on liability.
                            These limitations may not apply to you.
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">10. Termination</h2>

                    <h3 className="text-xl font-semibold mb-3">Your Right to Cancel</h3>
                    <p className="mb-3">You may cancel your account at any time by:</p>
                    <ul className="space-y-2 mb-6">
                        <li>Using the cancellation option in your account settings</li>
                        <li>Contacting our support team</li>
                        <li>Following the cancellation process in your billing settings</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3">Our Right to Terminate</h3>
                    <p className="mb-3">We may suspend or terminate your account if you:</p>
                    <ul className="space-y-2 mb-4">
                        <li>Violate these Terms of Service</li>
                        <li>Fail to pay fees when due</li>
                        <li>Use the Service in a way that harms us or other users</li>
                        <li>Provide false information</li>
                    </ul>
                    <p className="mb-4">
                        We'll provide reasonable notice before termination unless immediate termination is necessary
                        to protect the Service or other users.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
                    <p className="mb-4">
                        We may update these Terms from time to time. We'll notify you of material changes by:
                    </p>
                    <ul className="space-y-2 mb-4">
                        <li>Posting the updated Terms on our website</li>
                        <li>Sending you an email notification</li>
                        <li>Providing notice through our Service</li>
                    </ul>
                    <p className="mb-4">
                        Your continued use of the Service after changes become effective constitutes acceptance
                        of the new Terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
                    <p className="mb-4">
                        These Terms are governed by and construed in accordance with the laws of the jurisdiction
                        where Databuddy is incorporated, without regard to conflict of law principles.
                    </p>
                    <p className="mb-4">
                        Any disputes arising from these Terms or the Service will be resolved through binding arbitration
                        or in the courts of our jurisdiction.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <HelpCircle className="h-6 w-6 mr-2 text-primary" />
                        13. Contact Information
                    </h2>
                    <p className="mb-4">
                        If you have questions about these Terms of Service, please contact us:
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <ul className="space-y-2 mb-0">
                            <li><strong>Email:</strong> legal@databuddy.cc</li>
                            <li><strong>Support:</strong> support@databuddy.cc</li>
                            <li><strong>Website:</strong> databuddy.cc/contact</li>
                        </ul>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">14. Severability</h2>
                    <p className="mb-4">
                        If any provision of these Terms is found to be unenforceable, the remaining provisions
                        will continue in full force and effect.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">15. Entire Agreement</h2>
                    <p className="mb-4">
                        These Terms, together with our Privacy Policy, constitute the entire agreement between
                        you and Databuddy regarding the Service.
                    </p>
                </section>

                {/* Footer */}
                <div className="border-t border-border pt-8 mt-12">
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-2 text-primary">Thank You</h3>
                        <p className="text-sm text-muted-foreground mb-0">
                            Thank you for using Databuddy. We're committed to providing a fair, transparent, and
                            privacy-first analytics service. If you have any questions about these terms,
                            please don't hesitate to contact us.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 
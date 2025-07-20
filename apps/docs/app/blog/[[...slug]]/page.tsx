import { blogSource } from '@/lib/blog-source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { formatDistanceToNow } from 'date-fns';
import { StructuredData } from '@/components/structured-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function BlogPage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const publishedDate = new Date(page.data.publishedAt);
  const lastModified = page.data.lastModified ? new Date(page.data.lastModified) : null;

  // Calculate reading time (rough estimate)
  const wordsPerMinute = 200;
  const wordCount = page.data.description?.split(' ').length || 0;
  const readingTime = Math.ceil(wordCount / wordsPerMinute) || 1;

  // Safely extract string values with fallbacks
  const title = String(page.data.title || 'Databuddy Blog');
  const description = String(page.data.description || 'Privacy-first analytics insights');
  const author = String(page.data.author || 'izadoesdev');
  const category = String(page.data.category || 'General');
  const url = `https://www.databuddy.cc/blog/${params.slug?.join('/') || ''}`;

  return (
    <>
      <StructuredData
        type="article"
        title={title}
        description={description}
        url={url}
        datePublished={page.data.publishedAt}
        dateModified={page.data.lastModified || page.data.publishedAt}
      />
      <DocsPage toc={page.data.toc} full={page.data.full}>
        {/* Enhanced header with better visual hierarchy */}
        <div className="mb-12">
          <DocsTitle className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            {title}
          </DocsTitle>
          <DocsDescription className="text-xl text-muted-foreground leading-relaxed mb-8">
            {description}
          </DocsDescription>

          {/* Enhanced metadata section with better styling */}
          <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl p-6 border">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {/* Author info with avatar placeholder */}
              <div className="flex items-center gap-3">
                <Avatar className="flex items-center gap-3">
                  <AvatarImage src="/blog-photo.png" />
                  <AvatarFallback>IZ</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{author}</div>
                  <div className="text-xs text-muted-foreground">Author</div>
                </div>
              </div>

              {/* Publication date */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <div className="font-medium text-foreground">
                    {publishedDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(publishedDate, { addSuffix: true })}
                  </div>
                </div>
              </div>

              {/* Reading time */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-medium text-foreground">{readingTime} min read</div>
                  <div className="text-xs text-muted-foreground">Reading time</div>
                </div>
              </div>

              {/* Last modified */}
              {lastModified && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div>
                    <div className="font-medium text-foreground">
                      {lastModified.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">Last updated</div>
                  </div>
                </div>
              )}
            </div>

            {/* Category and tags section */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-border/50">
              {/* Category badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Category:</span>
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                  {category}
                </span>
                {page.data.featured && (
                  <span className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-sm font-semibold border border-yellow-200 dark:border-yellow-800">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Tags */}
              {page.data.tags && page.data.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-muted-foreground">Tags:</span>
                  {page.data.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors cursor-pointer border border-border/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content with improved styling */}
        <DocsBody className="prose prose-lg dark:prose-invert max-w-none">
          <MDXContent
            components={getMDXComponents({
              a: createRelativeLink(blogSource, page),
            })}
          />
        </DocsBody>

        {/* Enhanced footer section */}
        <div className="mt-16 space-y-8">
          {/* Engagement section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl p-8 border border-blue-200/50 dark:border-blue-800/50">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">
                Found this helpful?
              </h3>
              <p className="text-blue-800 dark:text-blue-200 mb-6 max-w-2xl mx-auto">
                Share this article with others who might benefit from privacy-first analytics insights.
              </p>

              {/* Enhanced sharing buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=databuddyps`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Share on Twitter
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Share on LinkedIn
                </a>

              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl p-8 border border-green-200/50 dark:border-green-800/50 text-center">
            <h3 className="text-2xl font-bold mb-4 text-green-900 dark:text-green-100">
              Ready to try privacy-first analytics?
            </h3>
            <p className="text-green-800 dark:text-green-200 mb-6 max-w-2xl mx-auto">
              Get started with Databuddy today. No consent banners, no cookies, just powerful insights that respect your users' privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.databuddy.cc/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚀 Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </DocsPage>
    </>
  );
}

export async function generateStaticParams() {
  return blogSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);
  if (!page) notFound();

  const title = `${String(page.data.title || 'Databuddy Blog')} | Databuddy Blog`;
  const description = String(page.data.description || 'Privacy-first analytics insights and industry expertise from the Databuddy team.');
  const author = String(page.data.author || 'izadoesdev');
  const url = `https://www.databuddy.cc/blog/${params.slug?.join('/') || ''}`;
  const category = String(page.data.category || 'Analytics');

  return {
    title,
    description,
    keywords: [
      ...(page.data.tags || []),
      'databuddy',
      'analytics',
      'privacy-first',
      'web analytics',
      'GDPR compliant',
      category.toLowerCase(),
      'blog',
      'insights',
    ],
    authors: [{ name: author }],
    creator: 'Databuddy',
    publisher: 'Databuddy',
    category,
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      siteName: 'Databuddy Blog',
      locale: 'en_US',
      publishedTime: page.data.publishedAt,
      modifiedTime: page.data.lastModified || page.data.publishedAt,
      authors: [author],
      section: category,
      tags: page.data.tags,
      images: [
        {
          url: '/og-blog.webp',
          width: 1200,
          height: 630,
          alt: `${page.data.title} - Databuddy Blog`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-blog.webp'],
      site: '@databuddyps',
      creator: '@databuddyps',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'article:author': author,
      'article:section': category,
      'article:published_time': page.data.publishedAt,
      'article:modified_time': page.data.lastModified || page.data.publishedAt,
      'article:tag': page.data.tags?.join(', ') || '',
    },
  };
} 
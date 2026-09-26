import Link from 'next/link';
import type { Metadata } from 'next';
import { sanitizeHtml } from '@/lib/sanitize';
import { BRAND_NAME, APP_TITLE } from '@/lib/brand';
import { SITE_URL, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';

const BLOG_POST_META: Record<string, { title: string; excerpt: string; image: string; category: string; date: string; isoDate: string; author: string }> = {
  '1': {
    title: 'How to brew Green Cup teas — hot or iced',
    excerpt:
      'One bag, freshly boiled water, three to five minutes. Here is the simple ritual for every Green Cup infusion.',
    image: '/products/guava-green-brew-v4.jpg',
    category: 'Brewing',
    date: 'September 20, 2026',
    isoDate: '2026-09-20',
    author: 'Green Cup',
  },
  '2': {
    title: 'Why FDA registration matters for herbal teas in Ghana',
    excerpt:
      'The herbal aisle is crowded. FDA registration is how Green Cup proves what is in the pack — and that it was made in Ghana.',
    image: '/products/soursop-brew-v4.jpg',
    category: 'Quality',
    date: 'September 18, 2026',
    isoDate: '2026-09-18',
    author: 'Green Cup',
  },
  '3': {
    title: 'A guide to our blends',
    excerpt:
      'Soursop, lemon-ginger, guava, papaya-cinnamon, beetroot, and dried lemon — what each cup is for.',
    image: '/products/natural-lemon-ginger-v4.jpg',
    category: 'Blends',
    date: 'September 16, 2026',
    isoDate: '2026-09-16',
    author: 'Green Cup',
  },
};

export async function generateStaticParams() {
  return Object.keys(BLOG_POST_META).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = BLOG_POST_META[id];
  if (!post) {
    return {
      title: `Journal | ${APP_TITLE}`,
      description: `Brewing notes and blend guides from ${BRAND_NAME}.`,
    };
  }

  const canonical = `${SITE_URL}/blog/${id}`;
  const title = `${post.title} | ${BRAND_NAME}`;

  return {
    title,
    description: post.excerpt,
    keywords: [post.category, 'Green Cup blog', 'Ghanaian tea', BRAND_NAME],
    authors: [{ name: post.author }],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      siteName: APP_TITLE,
      title,
      description: post.excerpt,
      locale: 'en_GH',
      publishedTime: new Date(post.isoDate).toISOString(),
      authors: [post.author],
      tags: [post.category],
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const meta = BLOG_POST_META[id] || BLOG_POST_META['1'];
  const articleLd = articleJsonLd({
    title: meta.title,
    description: meta.excerpt,
    image: meta.image,
    path: `/blog/${id}`,
    author: meta.author,
    datePublished: new Date(meta.isoDate).toISOString(),
    category: meta.category,
  });
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/blog' },
    { name: meta.title, path: `/blog/${id}` },
  ]);

  const posts: Record<string, { title: string; image: string; category: string; date: string; readTime: string; author: string; content: string }> = {
    '1': {
      title: meta.title,
      image: '/products/guava-green-brew-v4.jpg',
      category: 'Brewing',
      date: 'September 20, 2026',
      readTime: '4 min read',
      author: 'Green Cup',
      content: `
        <p>Every Green Cup tea bag is meant for a simple cup — no ceremony kit required. Use freshly boiled water, one bag, and three to five minutes.</p>
        <h2>Hot brew</h2>
        <p>Pour just-boiled water over one bag. Cover the cup if you can, then steep 3–5 minutes. Lift the bag and drink. Lemon-ginger and beetroot-ginger can take the full five minutes if you like more heat.</p>
        <h2>Iced brew</h2>
        <p>Steep as usual, let the cup cool, then pour over ice. Guava Green Brew and lemon-ginger stay bright when chilled.</p>
        <h2>Keep the pack fresh</h2>
        <p>Seal the pouch, keep it cool and dry, and store it away from sunlight and strong kitchen smells. The leaves stay cleaner that way.</p>
      `,
    },
    '2': {
      title: 'Why FDA registration matters for herbal teas in Ghana',
      image: '/products/soursop-brew-v4.jpg',
      category: 'Quality',
      date: 'September 18, 2026',
      readTime: '4 min read',
      author: 'Green Cup',
      content: `
        <p>Ghana’s herbal market is full of packs that do not say who made them or what is inside. Green Cup blends are FDA-registered and made in Ghana by Shapes Pro Ltd.</p>
        <h2>What registration means for you</h2>
        <p>You can read the ingredients, bag count, and net weight on each product page. We do not add flavourings that do not belong in the cup.</p>
        <h2>Made here, sent across Ghana</h2>
        <p>Order online, pick up at Spintex after you confirm a time, or have a pack sent by rider or bus station. This is a fulfillment point, not a walk-in shop.</p>
      `,
    },
    '3': {
      title: 'A guide to our blends',
      image: '/products/natural-lemon-ginger-v4.jpg',
      category: 'Blends',
      date: 'September 16, 2026',
      readTime: '5 min read',
      author: 'Green Cup',
      content: `
        <p>Green Cup is a short list of FDA-registered infusions. Pick by taste.</p>
        <ul>
          <li><strong>Soursop Brew</strong> — earthy, smooth, and grounding. A gentle daily leaf tea.</li>
          <li><strong>Guava Green Brew</strong> — crisp, herbaceous, and lightly tannic, like a fine green tea.</li>
          <li><strong>Natural Lemon Ginger</strong> — sun-dried citrus and real ginger heat. Bright hot or iced.</li>
          <li><strong>Papaya Cinnamon</strong> — earthy papaya leaf rounded by sweet cinnamon.</li>
          <li><strong>Beetroot Ginger</strong> — earthy-sweet beetroot with fiery ginger.</li>
          <li><strong>Dehydrated Green Lemon Slices</strong> — dried lemon to steep or drop in water. No invented flavour story — just lemon.</li>
        </ul>
        <p>Every blend page lists ingredients, bag count, and brewing notes. Shop the range when you are ready.</p>
      `,
    },
  };

  const post = posts[id] || posts['1'];

  const relatedPosts = [
    {
      id: id === '1' ? '2' : '1',
      title: id === '1' ? BLOG_POST_META['2'].title : BLOG_POST_META['1'].title,
      image: id === '1' ? BLOG_POST_META['2'].image : BLOG_POST_META['1'].image,
      category: id === '1' ? 'Quality' : 'Brewing',
    },
    {
      id: id === '3' ? '2' : '3',
      title: id === '3' ? BLOG_POST_META['2'].title : BLOG_POST_META['3'].title,
      image: id === '3' ? BLOG_POST_META['2'].image : BLOG_POST_META['3'].image,
      category: id === '3' ? 'Quality' : 'Blends',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="relative h-96 bg-gray-900">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-brand-espresso text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-5xl font-bold text-white mb-6">{post.title}</h1>
            <div className="flex items-center justify-center gap-6 text-brand-nude/90">
              <span className="flex items-center gap-2">
                <i className="ri-user-line"></i>
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <i className="ri-calendar-line"></i>
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <i className="ri-time-line"></i>
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose prose-lg max-w-none">
          <div
            className="text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.8'
            }}
          />
        </article>

        <div className="mt-12 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">Written by</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-nude/50 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-brand-espresso text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">Green Cup</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-3">Share this article</p>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-nude/40 transition-colors cursor-pointer">
                  <i className="ri-facebook-fill text-gray-600"></i>
                </button>
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-nude/40 transition-colors cursor-pointer">
                  <i className="ri-twitter-fill text-gray-600"></i>
                </button>
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-nude/40 transition-colors cursor-pointer">
                  <i className="ri-linkedin-fill text-gray-600"></i>
                </button>
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-nude/40 transition-colors cursor-pointer">
                  <i className="ri-whatsapp-line text-gray-600"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.id}`}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-brand-espresso text-white px-3 py-1 rounded-full text-xs font-medium">
                    {relatedPost.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {relatedPost.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-brand-espresso to-brand-cocoa rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for a better cup?</h2>
          <p className="text-brand-nude/90 mb-8 text-lg">
            Shop FDA-registered Ghanaian teas — or join the list for brewing notes.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-brand-espresso px-8 py-4 rounded-full font-medium hover:bg-brand-nude/30 transition-colors whitespace-nowrap"
          >
            Shop blends
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-espresso font-medium hover:gap-3 transition-all"
          >
            <i className="ri-arrow-left-line"></i>
            Back to Journal
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function BlogPage() {
  const featuredPost = {
    id: '1',
    title: 'How to brew Green Cup teas — hot or iced',
    excerpt: 'One bag, freshly boiled water, three to five minutes. Here is the simple ritual for every Green Cup infusion.',
    image: '/products/guava-green-brew-v4.jpg',
    category: 'Brewing',
    date: 'September 20, 2026',
    readTime: '4 min read',
    author: 'Green Cup'
  };

  const posts = [
    {
      id: '2',
      title: 'Why FDA registration matters for herbal teas in Ghana',
      excerpt: 'The herbal aisle is crowded. FDA registration is how Green Cup proves what is in the pack — and that it was made in Ghana.',
      image: '/products/soursop-brew-v4.jpg',
      category: 'Quality',
      date: 'September 18, 2026',
      readTime: '4 min read',
      author: 'Green Cup'
    },
    {
      id: '3',
      title: 'A guide to our blends',
      excerpt: 'Soursop, lemon-ginger, guava, papaya-cinnamon, beetroot, and dried lemon — what each cup is for.',
      image: '/products/natural-lemon-ginger-v4.jpg',
      category: 'Blends',
      date: 'September 16, 2026',
      readTime: '5 min read',
      author: 'Green Cup'
    },
    {
      id: '1',
      title: 'How to brew Green Cup teas — hot or iced',
      excerpt: 'One bag, freshly boiled water, three to five minutes. Here is the simple ritual for every Green Cup infusion.',
      image: '/products/guava-green-brew-v4.jpg',
      category: 'Brewing',
      date: 'September 20, 2026',
      readTime: '4 min read',
      author: 'Green Cup'
    }
  ];

  const categories = [
    { name: 'All Posts', count: 3, icon: 'ri-article-line' },
    { name: 'Brewing', count: 1, icon: 'ri-cup-line' },
    { name: 'Quality', count: 1, icon: 'ri-shield-check-line' },
    { name: 'Blends', count: 1, icon: 'ri-leaf-line' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-brand-cream via-white to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Blog</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Brewing notes, blend guides, and why FDA-registered Ghanaian teas belong in a daily cup.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href={`/blog/${featuredPost.id}`} className="block mb-16 hover:opacity-90 transition-opacity cursor-pointer">
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-96 md:h-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-brand-espresso text-white px-4 py-2 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                    {featuredPost.category}
                  </span>
                  <span>{featuredPost.date}</span>
                  <span className="flex items-center gap-1">
                    <i className="ri-time-line"></i>
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-nude/50 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-brand-espresso"></i>
                  </div>
                  <span className="text-gray-900 font-medium">{featuredPost.author}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="relative h-64">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium text-xs">
                        {post.category}
                      </span>
                      <span className="text-xs">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-gray-600 text-sm"></i>
                        </div>
                        <span className="text-sm text-gray-900 font-medium">{post.author}</span>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <i className="ri-time-line"></i>
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <i className="ri-arrow-left-s-line text-gray-600"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-brand-espresso text-white rounded-lg cursor-pointer">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  3
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <i className="ri-arrow-right-s-line text-gray-600"></i>
                </button>
              </nav>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Categories</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <i className={`${category.icon} text-brand-espresso`}></i>
                      <span className="text-gray-900 font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{category.count}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Newsletter</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Get the latest articles and shopping tips delivered to your inbox weekly.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-mauve/40 focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full bg-brand-espresso text-white py-3 rounded-xl font-medium hover:bg-brand-cocoa transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Tea', 'Brewing', 'FDA', 'Ghana', 'Soursop', 'Guava', 'Lemon-ginger', 'Wellbeing'].map((tag, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-brand-espresso hover:text-brand-mauve transition-colors cursor-pointer whitespace-nowrap"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-espresso to-brand-cocoa py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready for a better cup?</h2>
          <p className="text-xl text-brand-nude/90 mb-8 leading-relaxed">
            Shop FDA-registered Ghanaian teas — soursop, lemon-ginger, guava, and more.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-brand-espresso px-8 py-4 rounded-full font-medium hover:bg-brand-nude/30 transition-colors whitespace-nowrap"
          >
            Explore Products
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

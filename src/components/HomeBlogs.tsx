'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  colors: {
    category: string;
    date: string;
    title: string;
    excerpt: string;
    readMore: string;
    cardGradient: string;
  };
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Art of Cupcake Decoration",
    excerpt: "Master the techniques of professional cupcake decoration with these expert tips and tricks.",
    image: "/images/blog-decoration.jpg",
    category: "Decorating Tips",
    date: "Feb 12, 2024",
    readTime: "5 min read",
    colors: {
      category: "text-[#FF6B8B]",
      date: "text-[#718096]",
      title: "text-[#2D3748]",
      excerpt: "text-[#4A5568]",
      readMore: "text-[#FF6B8B] hover:text-[#FF4D6D]",
      cardGradient: "from-[#FFF5F5] to-[#FFF0F0]"
    }
  },
  {
    id: 2,
    title: "Perfect Buttercream Recipe",
    excerpt: "Create silky smooth buttercream that's perfect for frosting and decorating your cupcakes.",
    image: "/images/blog-buttercream.jpg",
    category: "Recipes",
    date: "Feb 10, 2024",
    readTime: "7 min read",
    colors: {
      category: "text-[#4299E1]",
      date: "text-[#718096]",
      title: "text-[#2D3748]",
      excerpt: "text-[#4A5568]",
      readMore: "text-[#4299E1] hover:text-[#2B6CB0]",
      cardGradient: "from-[#EBF8FF] to-[#E6F6FF]"
    }
  },
  {
    id: 3,
    title: "Wedding Cupcake Trends 2024",
    excerpt: "Discover the latest trends in wedding cupcakes and innovative presentation ideas.",
    image: "/images/blog-wedding.jpg",
    category: "Wedding",
    date: "Feb 8, 2024",
    readTime: "6 min read",
    colors: {
      category: "text-[#9F7AEA]",
      date: "text-[#718096]",
      title: "text-[#2D3748]",
      excerpt: "text-[#4A5568]",
      readMore: "text-[#9F7AEA] hover:text-[#805AD5]",
      cardGradient: "from-[#F8F4FF] to-[#F3EAFF]"
    }
  },
  {
    id: 4,
    title: "Vegan Cupcake Revolution",
    excerpt: "Explore delicious vegan cupcake recipes that everyone will love.",
    image: "/images/blog-vegan.jpg",
    category: "Vegan",
    date: "Feb 6, 2024",
    readTime: "8 min read",
    colors: {
      category: "text-[#48BB78]",
      date: "text-[#718096]",
      title: "text-[#2D3748]",
      excerpt: "text-[#4A5568]",
      readMore: "text-[#48BB78] hover:text-[#38A169]",
      cardGradient: "from-[#F0FFF4] to-[#EBFAEB]"
    }
  },
  {
    id: 5,
    title: "Seasonal Flavor Guide",
    excerpt: "Learn how to incorporate seasonal ingredients for unique cupcake flavors.",
    image: "/images/blog-seasonal.jpg",
    category: "Seasonal",
    date: "Feb 4, 2024",
    readTime: "5 min read",
    colors: {
      category: "text-[#F6AD55]",
      date: "text-[#718096]",
      title: "text-[#2D3748]",
      excerpt: "text-[#4A5568]",
      readMore: "text-[#F6AD55] hover:text-[#ED8936]",
      cardGradient: "from-[#FFFAF0] to-[#FFF5EB]"
    }
  },
  {
    id: 6,
    title: "Storage & Freshness Tips",
    excerpt: "Expert advice on keeping your cupcakes fresh and maintaining their quality.",
    image: "/images/blog-storage.jpg",
    category: "Tips & Tricks",
    date: "Feb 2, 2024",
    readTime: "4 min read",
    colors: {
      category: "text-[#63B3ED]",
      date: "text-[#718096]",
      title: "text-[#2D3748]",
      excerpt: "text-[#4A5568]",
      readMore: "text-[#63B3ED] hover:text-[#4299E1]",
      cardGradient: "from-[#EBF8FF] to-[#E6F6FF]"
    }
  }
];

const BlogsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blogsRef = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    blogsRef.current.forEach((blog, index) => {
      if (!blog) return;

      gsap.set(blog, {
        opacity: 0,
        y: 50,
      });

      gsap.to(blog, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: blog,
          start: "top bottom-=100",
          end: "top center",
          toggleActions: "play none none reverse",
        },
        delay: index * 0.2
      });
    });
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-4 bg-[#E6F7FF] relative overflow-hidden min-h-screen"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="pt-12 pb-16 flex-shrink-0">
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-center text-[#2B4C7E] uppercase tracking-tight leading-none font-black"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            Latest Blogs
          </h1>
          <div 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-center mt-4 text-[#4A739B] tracking-wider font-medium"
            style={{ fontFamily: 'Barlow, sans-serif' }}
          >
            DISCOVER OUR CUPCAKE STORIES
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              ref={(el) => {
                blogsRef.current[index] = el || null;
              }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="group cursor-pointer"
            >
              <div className={`bg-gradient-to-b ${post.colors.cardGradient} rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl`}>
                <div className="relative h-64">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`${post.colors.category} text-sm font-semibold`}>
                      {post.category}
                    </span>
                    <span className={`${post.colors.date} text-sm`}>
                      {post.date} · {post.readTime}
                    </span>
                  </div>

                  <h3 
                    className={`text-xl font-bold ${post.colors.title} mb-3 group-hover:text-[#2B4C7E] transition-colors duration-300`}
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {post.title}
                  </h3>

                  <p className={`${post.colors.excerpt} mb-4 line-clamp-2`}>
                    {post.excerpt}
                  </p>

                  <div className={`${post.colors.readMore} font-semibold inline-flex items-center transition-all duration-300`}>
                    Read More
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default BlogsSection;
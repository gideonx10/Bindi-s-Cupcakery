'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
    {
      question: "How do I place an order for cupcakes?",
      answer: "You can place your order through our website's ordering system, by calling us directly, or visiting our store. For custom orders or large quantities, we recommend placing your order at least 48 hours in advance. Special designs and wedding orders should be placed 2-3 weeks ahead."
    },
    {
      question: "What flavors and dietary options do you offer?",
      answer: "We offer a wide variety of classic and seasonal flavors including Vanilla Bean, Double Chocolate, Red Velvet, and our signature Bindi's Special. We also cater to dietary restrictions with gluten-free, vegan, and nut-free options. All our ingredients are clearly labeled, and we're happy to discuss any specific dietary requirements."
    },
    {
      question: "Do you deliver, and what are your delivery areas?",
      answer: "Yes, we offer delivery services within a 15-mile radius of our bakery. Delivery fees vary based on distance and order size. We also offer special delivery arrangements for large events and weddings. For orders outside our standard delivery area, please contact us to discuss options."
    },
    {
      question: "Can you accommodate large orders or events?",
      answer: "Absolutely! We specialize in catering for events of all sizes - from small gatherings to large corporate events and weddings. We offer special pricing for bulk orders and can create custom displays and designs to match your event theme. Contact us for a personalized quote."
    },
    {
      question: "What are your most popular cupcake flavors?",
      answer: "Our most beloved flavors include our Classic Red Velvet with cream cheese frosting, Salted Caramel, Dark Chocolate Ganache, and our seasonal Strawberry Fresh Cream. We also have monthly special flavors that often become customer favorites!"
    },
    {
      question: "Do you offer custom designs or personalization?",
      answer: "Yes! We love creating custom designs. From corporate logos to personal messages, we can personalize cupcakes for any occasion. We also offer various decorating styles, edible prints, and custom toppers. Please provide design details when placing your order."
    }
  ];

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
  
    const toggleFAQ = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    return (
      <section className="min-h-screen bg-[#FFF0F7] pt-24 pb-32 md:pt-32 md:pb-40 lg:pt-40">
        <div className="flex flex-col gap-16 md:gap-20 max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="text-center">
              <h1 
                className="text-7xl sm:text-8xl md:text-9xl text-[#9B2C5D] uppercase tracking-tight leading-[1.1] font-black mb-6"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                FAQs
              </h1>
              <div 
                className="text-xl sm:text-2xl md:text-3xl text-[#B13D73] tracking-wider font-medium"
                style={{ fontFamily: 'Barlow, sans-serif' }}
              >
                Got Questions? We&apos;ve Got Answers! 🎯
              </div>
            </div>
          </motion.div>
  
          {/* FAQs Section */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.1
                }}
              >
                <div className={`rounded-lg overflow-hidden ${openIndex === index ? 'bg-[#FFE4F0]' : 'bg-[#FFF0F7]'}`}>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-8 py-6 flex justify-between items-center gap-4 text-left"
                  >
                    <span 
                      className="text-xl md:text-2xl text-[#9B2C5D] font-medium tracking-wide"
                      style={{ fontFamily: 'Barlow, sans-serif' }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ 
                        rotate: openIndex === index ? 180 : 0
                      }}
                      transition={{ 
                        duration: 0.3,
                        ease: "easeInOut"
                      }}
                      className="text-[#B13D73] flex-shrink-0"
                    >
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M6 9L12 15L18 9" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: "auto", 
                          opacity: 1,
                          transition: {
                            height: {
                              duration: 0.3,
                              ease: "easeOut"
                            },
                            opacity: { 
                              duration: 0.2, 
                              delay: 0.1 
                            }
                          }
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: {
                            height: { duration: 0.3 },
                            opacity: { duration: 0.2 }
                          }
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ 
                            y: 0, 
                            opacity: 1,
                            transition: {
                              duration: 0.3,
                              ease: "easeOut"
                            }
                          }}
                          className="px-8 pb-6"
                        >
                          <p 
                            className="text-lg md:text-xl text-[#872650] leading-relaxed"
                            style={{ fontFamily: 'Barlow, sans-serif' }}
                          >
                            {faq.answer}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default FAQs;
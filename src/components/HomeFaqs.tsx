'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Where is Bindi’s Cupcakery located?",
    answer:
      "Bindi’s Cupcakery operates as a cloud kitchen in Parle Point, Surat. Since we do not have a physical storefront, customers can place their orders online and pick them up from our location. Our focus is on providing fresh, homemade, and preservative-free desserts while ensuring a seamless ordering and pickup experience.",
  },
  {
    question: "Are all the products eggless and preservative-free?",
    answer:
      "Yes! At Bindi’s Cupcakery, we take pride in offering 100% vegetarian, eggless, and preservative-free desserts. Every treat is carefully crafted with high-quality, natural ingredients to ensure both great taste and a healthier alternative to conventional bakery products. Our commitment is to provide fresh, homemade desserts without any artificial additives.",
  },
  {
    question: "How can I place an order?",
    answer:
      "Placing an order is simple! You can visit our website and customize your selection of desserts. Once you confirm your order, the details will be automatically sent to the owner’s WhatsApp for quick processing. This ensures a smooth and personalized experience for every customer. For special bulk orders, we recommend reaching out to us in advance to ensure availability.",
  },
  {
    question: "Can I customize my order?",
    answer:
      "Absolutely! We offer a variety of customization options for our desserts, especially for special occasions like birthdays, weddings, and festivals. You can create personalized dessert hampers with your favorite cupcakes, brownies, cakes, and ice creams. If you have any special requests regarding flavors, themes, or decorations, feel free to let us know while placing your order.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We provide two easy payment options: QR-based UPI payments for quick and secure transactions and a 'Pay on Takeaway' option for those who prefer to pay upon collecting their order. Our QR-based payment system ensures a smooth, contactless transaction experience, while the Pay on Takeaway option offers flexibility to our customers.",
  },
  {
    question: "Do you offer home delivery?",
    answer:
      "Currently, we operate as a cloud kitchen and do not provide home delivery. Customers are required to pick up their orders from our kitchen in Parle Point, Surat. However, we aim to offer a hassle-free pickup experience. If you're placing a bulk order and require delivery arrangements, you can contact us in advance to discuss possible options.",
  },
];


const FAQs = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
  
    const toggleFAQ = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    return (
      <section className="min-h-screen bg-[#FFF0F7] pt-5 md:pt-10 lg:pt-12 pb-[7rem]">
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
                className="text-xl sm:text-2xl md:text-3xl text-[#B13D73] tracking-wider font-medium font-ancient"
                
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
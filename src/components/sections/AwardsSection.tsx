import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';

const awards = [
  {
    year: "2024",
    title: "Best Crime Series",
    event: "Digital Film Awards",
    work: "Murshid",
    icon: "🏆"
  },
  {
    year: "2023",
    title: "Official Selection",
    event: "International Thriller Fest",
    work: "Aazam",
    icon: "🎬"
  },
  {
    year: "2021",
    title: "Critics Choice Award",
    event: "OTT Excellence",
    work: "Kamathipura",
    icon: "🌟"
  },
  {
    year: "2019",
    title: "Best Supernatural Noir",
    event: "Indie Cinema Awards",
    work: "706",
    icon: "🎭"
  }
];

export const AwardsSection = () => {
  const containerRef = useRef(null);
  
  // Scroll-linked line animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="awards" className="py-24 bg-[#0A0A0F] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        
        <div className="text-center mb-20">
          <span className="label-bebas text-[#C9A84C] tracking-[0.4em] text-sm">Milestones</span>
          <h2 className="heading-serif text-5xl md:text-6xl text-[#F5F0E8] mt-4">Recognition</h2>
        </div>

        <div ref={containerRef} className="relative">
          {/* Animated Vertical Line */}
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="absolute left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#C9A84C]/40 z-0 hidden md:block"
          />

          <div className="space-y-24">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`relative flex items-center justify-between w-full ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                } flex-col gap-8 md:gap-0`}
              >
                {/* Content Card */}
                <div className="w-full md:w-[42%]">
                  <div className={`p-8 bg-[#111118] border border-[#2A2A3A] hover:border-[#C9A84C]/30 transition-all duration-500 shadow-xl group ${
                    index % 2 === 0 ? 'text-left' : 'md:text-right text-left'
                  }`}>
                    <div className="text-3xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                      {award.icon}
                    </div>
                    <h3 className="heading-serif text-2xl text-[#C9A84C] mb-2">{award.title}</h3>
                    <p className="label-bebas text-[#F5F0E8] text-sm tracking-widest mb-1">{award.event}</p>
                    <p className="text-[#8A8A9A] text-xs italic">For the film: {award.work}</p>
                  </div>
                </div>

                {/* Center Badge */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#0A0A0F] border-2 border-[#C9A84C] flex items-center justify-center text-[#C9A84C] label-bebas text-xs font-bold shadow-[0_0_15px_rgba(201,168,76,0.3)]">
                    {award.year}
                  </div>
                </div>

                {/* Spacer for layout */}
                <div className="w-full md:w-[42%] hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] bg-[#8B1A1A]/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};
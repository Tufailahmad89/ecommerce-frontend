import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=2000" 
          alt="Indian Fashion Hero"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl text-white"
        >
          <span className="text-sm uppercase tracking-[0.3em] font-medium mb-4 block">
            The Heritage Collection
          </span>
          <h2 className="text-6xl md:text-8xl font-serif leading-tight mb-8">
            Elegance in <br />
            <span className="italic">Every Thread</span>
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-lg leading-relaxed">
            Discover our curated selection of premium Indian ethnic wear, 
            where traditional craftsmanship meets contemporary design.
          </p>
          <button 
            onClick={onExplore}
            className="group flex items-center space-x-4 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300"
          >
            <span>Explore Collection</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-12 right-12 hidden lg:block">
        <div className="flex items-center space-x-4 text-white/50 text-xs tracking-widest uppercase vertical-text rotate-180">
          <span>Est. 2024</span>
          <div className="w-px h-12 bg-white/30" />
          <span>Handcrafted in India</span>
        </div>
      </div>
    </section>
  );
};

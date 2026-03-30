import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenMenu: () => void;
  onSearch: (term: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenMenu, onSearch, onOpenAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          className="p-2 hover:opacity-60 transition-opacity"
          onClick={onOpenMenu}
        >
          <Menu className={isScrolled ? 'text-black' : 'text-white'} />
        </button>

        {/* Logo */}
        <div className="flex-1 text-center">
          <h1 className={`text-2xl font-serif tracking-widest uppercase cursor-pointer ${
            isScrolled ? 'text-black' : 'text-white'
          }`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Vastra
          </h1>
        </div>

        {/* Icons */}
        <div className={`flex items-center space-x-4 md:space-x-6 ${
          isScrolled ? 'text-black' : 'text-white'
        }`}>
          <div className="relative flex items-center">
            <motion.div
              initial={false}
              animate={{ 
                width: isSearchOpen ? (window.innerWidth < 640 ? '160px' : '240px') : '40px',
                backgroundColor: isSearchOpen 
                  ? (isScrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.15)') 
                  : 'rgba(0,0,0,0)'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center rounded-full overflow-hidden"
            >
              <button 
                className="p-2 hover:opacity-60 transition-opacity flex-shrink-0"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (isSearchOpen) {
                    setSearchTerm('');
                    onSearch('');
                  }
                }}
              >
                {isSearchOpen ? <X size={18} /> : <Search size={20} />}
              </button>
              
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm pr-4 w-full placeholder:text-stone-400 font-sans"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      onSearch(e.target.value);
                    }}
                    autoFocus
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <button 
            className="hover:opacity-60 transition-opacity flex-shrink-0"
            onClick={onOpenAuth}
          >
            <User size={20} />
          </button>
          <button 
            className="relative hover:opacity-60 transition-opacity flex-shrink-0"
            onClick={onOpenCart}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

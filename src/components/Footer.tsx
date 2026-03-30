import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div>
          <h2 className="text-2xl font-serif tracking-widest uppercase mb-6">Vastra</h2>
          <p className="text-stone-400 text-sm leading-relaxed mb-8">
            Celebrating the timeless beauty of Indian textiles. Our pieces are crafted by master artisans, 
            bringing centuries of heritage into the modern wardrobe.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-stone-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-stone-400 hover:text-white transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-stone-400 hover:text-white transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-medium mb-8">Shop</h3>
          <ul className="space-y-4 text-sm text-stone-400">
            <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sarees</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Kurtas</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Lehengas</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-medium mb-8">Support</h3>
          <ul className="space-y-4 text-sm text-stone-400">
            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-medium mb-8">Contact</h3>
          <ul className="space-y-6 text-sm text-stone-400">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="mt-0.5 flex-shrink-0" />
              <span>123 Heritage Lane, <br />New Delhi, India 110001</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="flex-shrink-0" />
              <span>+91 11 2345 6789</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="flex-shrink-0" />
              <span>hello@vastra.in</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-stone-500 text-[10px] uppercase tracking-widest">
          © 2024 Vastra Heritage Pvt. Ltd. All Rights Reserved.
        </p>
        <div className="flex space-x-8 text-[10px] uppercase tracking-widest text-stone-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

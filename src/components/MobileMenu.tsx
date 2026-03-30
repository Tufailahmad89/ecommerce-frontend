import React from 'react';
import { motion } from 'motion/react';
import { X, LogIn, User, ShoppingBag, Package } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrders: () => void;
  onOpenAuth: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onOpenOrders, onOpenAuth }) => {
  const [user] = useAuthState(auth);

  const handleLogout = () => signOut(auth);

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
    >
      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-xl font-serif tracking-widest uppercase">Vastra</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* User Section */}
        <div className="pb-8 border-b border-gray-100">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-stone-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{user.displayName || user.email || user.phoneNumber}</p>
                <button onClick={handleLogout} className="text-xs text-red-500 uppercase tracking-widest mt-1">Logout</button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => { onOpenAuth(); onClose(); }}
              className="flex items-center space-x-3 text-stone-600 hover:text-black transition-colors"
            >
              <LogIn size={20} />
              <span className="text-sm uppercase tracking-widest font-medium">Login / Sign Up</span>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-6 text-lg font-serif">
          <a href="#" className="block hover:translate-x-2 transition-transform">Sarees</a>
          <a href="#" className="block hover:translate-x-2 transition-transform">Kurtas</a>
          <a href="#" className="block hover:translate-x-2 transition-transform">Lehengas</a>
          <a href="#" className="block hover:translate-x-2 transition-transform">Fusion</a>
        </nav>

        {/* Account Links */}
        <div className="pt-8 space-y-4">
          <button 
            onClick={() => { onOpenOrders(); onClose(); }}
            className="flex items-center space-x-3 text-stone-600 hover:text-black w-full"
          >
            <Package size={18} />
            <span className="text-xs uppercase tracking-widest">My Orders</span>
          </button>
          <button className="flex items-center space-x-3 text-stone-600 hover:text-black w-full">
            <User size={18} />
            <span className="text-xs uppercase tracking-widest">Profile Settings</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

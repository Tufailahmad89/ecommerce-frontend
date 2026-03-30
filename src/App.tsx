import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Footer } from './components/Footer';
import { MobileMenu } from './components/MobileMenu';
import { OrderHistory } from './components/OrderHistory';
import { AuthModal } from './components/AuthModal';
import { products, Product } from './data/products';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function App() {
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [user] = useAuthState(auth);

  // Sync user to Firestore
  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user'
      }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, 'users'));
    }
  }, [user]);

  // Fix: Prevent background scroll when overlays are open
  useEffect(() => {
    if (isCartOpen || isMenuOpen || isOrdersOpen || isAuthOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, isMenuOpen, isOrdersOpen, isAuthOpen]);

  const categories = ['All', 'Saree', 'Kurta', 'Lehenga', 'Fusion'];

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemsList = cartItems
      .map((item) => `- ${item.product.name} (Qty: ${item.quantity}) - ₹${item.product.price * item.quantity}`)
      .join('\n');

    // Save to Firestore if logged in
    if (user) {
      try {
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          items: cartItems,
          total: total,
          status: 'pending',
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'orders');
      }
    }

    const message = `*New Order from Vastra*\n\nItems:\n${itemsList}\n\n*Total: ₹${total.toLocaleString()}*\n\nPlease confirm my order.`;
    
    // WhatsApp Notification
    const whatsappNumber = '911234567890';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    setCartItems([]);
    setIsCartOpen(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-stone-900">
      <Navbar 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenMenu={() => setIsMenuOpen(true)}
        onSearch={setSearchQuery}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      
      <main>
        <Hero onExplore={scrollToCollection} />

        {/* Categories Section */}
        <section id="collection" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-4 block">
                Curated Selection
              </span>
              <h2 className="text-4xl md:text-5xl font-serif">
                Shop by <span className="italic">Category</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 border ${
                    activeCategory === cat 
                      ? 'bg-black text-white border-black' 
                      : 'bg-transparent text-stone-500 border-stone-200 hover:border-black hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-stone-400 italic">
                No products found matching your search.
              </div>
            )}
          </div>
        </section>

        {/* Featured Banner */}
        <section className="relative h-[60vh] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1595910194003-99937395c0f0?auto=format&fit=crop&q=80&w=2000" 
            alt="Featured Collection"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl text-white"
            >
              <h3 className="text-4xl md:text-6xl font-serif mb-6">The Wedding Edit</h3>
              <p className="text-lg text-white/80 mb-8 uppercase tracking-widest">
                Discover the perfect ensemble for your special day
              </p>
              <button className="border border-white px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300">
                View Lookbook
              </button>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-6 bg-stone-50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center space-y-4">
              <h4 className="text-xs uppercase tracking-[0.3em] font-semibold">Artisan Crafted</h4>
              <p className="text-sm text-stone-500 leading-relaxed">
                Every piece is handcrafted by master artisans using traditional techniques passed down through generations.
              </p>
            </div>
            <div className="text-center space-y-4">
              <h4 className="text-xs uppercase tracking-[0.3em] font-semibold">Ethical Sourcing</h4>
              <p className="text-sm text-stone-500 leading-relaxed">
                We work directly with weaving clusters to ensure fair wages and sustainable practices across our supply chain.
              </p>
            </div>
            <div className="text-center space-y-4">
              <h4 className="text-xs uppercase tracking-[0.3em] font-semibold">Timeless Design</h4>
              <p className="text-sm text-stone-500 leading-relaxed">
                Our designs transcend seasons, focusing on quality and elegance that lasts a lifetime.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <OrderHistory 
        isOpen={isOrdersOpen} 
        onClose={() => setIsOrdersOpen(false)} 
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

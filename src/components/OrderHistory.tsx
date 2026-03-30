import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Order {
  id: string;
  items: any[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: any;
}

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ isOpen, onClose }) => {
  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'confirmed': return <CheckCircle size={16} className="text-blue-500" />;
      case 'shipped': return <Truck size={16} className="text-indigo-500" />;
      case 'delivered': return <CheckCircle size={16} className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-[101] flex flex-col shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Package size={20} />
                <h2 className="text-lg font-serif uppercase tracking-widest">Order History</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!user ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
                  <p className="text-sm uppercase tracking-widest">Please login to view your orders</p>
                </div>
              ) : loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
                  <Package size={48} strokeWidth={1} className="mb-4" />
                  <p className="text-sm uppercase tracking-widest">No orders found</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-stone-100 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Order ID: {order.id.slice(0, 8)}</p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className="text-xs font-medium uppercase tracking-widest">{order.status}</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">₹{order.total.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-stone-600">
                          <span>{item.product.name} x {item.quantity}</span>
                          <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

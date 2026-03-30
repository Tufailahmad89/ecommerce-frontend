import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Phone, ArrowRight, Github, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'phone';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent!');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if ((window as any).recaptchaVerifier) return;
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      setupRecaptcha();
      const verifier = (window as any).recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setVerificationId(confirmationResult);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verificationId.confirm(otp);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8 pt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif mb-2 uppercase tracking-widest">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Reset Password'}
                {mode === 'phone' && 'Phone Login'}
              </h2>
              <p className="text-stone-500 text-sm">
                {mode === 'login' && 'Enter your details to access your account'}
                {mode === 'signup' && 'Join Vastra to track your orders'}
                {mode === 'forgot' && 'We will send you a reset link'}
                {mode === 'phone' && 'Enter your number to receive an OTP'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 italic">
                {error}
              </div>
            )}

            {mode !== 'phone' ? (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    required
                    className="w-full bg-stone-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-black outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {mode !== 'forgot' && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input 
                      type="password" 
                      placeholder="Password"
                      required
                      className="w-full bg-stone-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-black outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}

                {mode === 'login' && (
                  <div className="text-right">
                    <button 
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-stone-400 hover:text-black transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-2xl text-sm font-medium uppercase tracking-[0.2em] hover:bg-stone-800 transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Link'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                {!verificationId ? (
                  <form onSubmit={handlePhoneSignIn} className="space-y-4">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210"
                        required
                        className="w-full bg-stone-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-black outline-none"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div id="recaptcha-container"></div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white py-4 rounded-2xl text-sm font-medium uppercase tracking-[0.2em] hover:bg-stone-800 transition-all flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send OTP</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Enter 6-digit OTP"
                        required
                        className="w-full bg-stone-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-black outline-none"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white py-4 rounded-2xl text-sm font-medium uppercase tracking-[0.2em] hover:bg-stone-800 transition-all flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Verify OTP</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-100"></div>
                </div>
                <span className="relative px-4 bg-white text-xs text-stone-400 uppercase tracking-widest">Or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center space-x-2 py-3 border border-stone-100 rounded-2xl hover:bg-stone-50 transition-colors"
                >
                  <Chrome size={18} />
                  <span className="text-xs font-medium">Google</span>
                </button>
                <button 
                  onClick={() => setMode(mode === 'phone' ? 'login' : 'phone')}
                  className="flex items-center justify-center space-x-2 py-3 border border-stone-100 rounded-2xl hover:bg-stone-50 transition-colors"
                >
                  <Phone size={18} />
                  <span className="text-xs font-medium">{mode === 'phone' ? 'Email' : 'Phone'}</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="text-xs text-stone-500"
              >
                {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                <span className="text-black font-semibold uppercase tracking-widest ml-1">
                  {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login, isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in as admin
    if (isLoggedIn && user?.role === 'admin') {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const loggedInUser = await login(email, password);

            if (loggedInUser.role !== 'admin') {
                setError('Access denied. Administrative privileges required.');
                return;
            }

            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary grain-texture flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl">
                        <ShieldCheck className="w-10 h-10 text-accent-gold" />
                    </div>
                    <h1 className="text-4xl font-sans font-black text-white tracking-tighter uppercase mb-2">
                        Easy Shop <span className="text-accent-gold italic">and Customer Service. Admin</span>
                    </h1>
                    <p className="text-white/40 font-black tracking-[0.3em] text-[9px] uppercase">
                        Authorized Personnel Access Only
                    </p>
                </div>

                <div className="bg-primary/95 border border-white/10 p-10 rounded-sm shadow-2xl grain-texture relative">
                    <div className="absolute inset-0 bg-white/[0.02] z-0 pointer-events-none"></div>
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
                                Registry ID
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-accent-gold transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ADMIN@EASYSHOP.COM"
                                    className="w-full bg-white/[0.03] border border-white/10 focus:border-accent-gold p-5 pl-14 rounded-sm outline-none text-white text-xs tracking-widest transition-all placeholder:text-white/20 uppercase"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
                                Security Key
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-accent-gold transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/[0.03] border border-white/10 focus:border-accent-gold p-5 pl-14 rounded-sm outline-none text-white text-xs tracking-widest transition-all placeholder:text-white/20 uppercase"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent-gold text-primary p-5 font-black uppercase text-[11px] tracking-[0.5em] hover:bg-white transition-all shadow-lg active:scale-[0.98] mt-4 flex items-center justify-center space-x-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Initialize Console</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-12 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    System.v1.0.42 // Encrypted Connection
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;

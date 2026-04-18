import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { X, Mail, Lock, Eye, EyeOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LoginFormProps {
    onClose: () => void;
    onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSwitchToRegister }) => {
    const { login, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const [emailNotVerified, setEmailNotVerified] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setEmailNotVerified(false);

        try {
            await login(email, password);
            onClose();
        } catch (err: any) {
            // Check if the error response has emailNotVerified flag
            const responseData = err.response?.data?.data;
            if (responseData?.emailNotVerified) {
                setEmailNotVerified(true);
            } else {
                const errorMessage = err.response?.data?.message || err.message || 'Login failed';
                setLocalError(errorMessage);
            }
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error('Please enter your email above first');
            return;
        }
        setResendLoading(true);
        try {
            await authService.resendVerification(email);
            toast.success('Verification email sent! Check your inbox.');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend. Try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 transition-colors p-1"
                >
                    <X size={22} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-400 text-sm mt-1">Sign in to your Avenly account</p>
                </div>

                {emailNotVerified && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-amber-800 font-medium text-sm">Email not verified</p>
                            <p className="text-amber-700 text-xs mt-0.5">Please check your inbox and click the verification link.</p>
                            <button
                                onClick={handleResend}
                                disabled={resendLoading}
                                className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2 disabled:opacity-50"
                            >
                                <RefreshCw size={12} className={resendLoading ? 'animate-spin' : ''} />
                                {resendLoading ? 'Sending...' : 'Resend verification email'}
                            </button>
                        </div>
                    </div>
                )}

                {localError && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 mb-4">
                        <span>⚠️</span>{localError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                                placeholder="you@example.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link
                                to="/forgot-password"
                                onClick={onClose}
                                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                                placeholder="Your password"
                                required
                                disabled={loading}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Signing in...
                            </span>
                        ) : 'Log In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Don't have an account?{' '}
                        <button onClick={onSwitchToRegister} className="text-purple-600 hover:text-purple-700 font-semibold">
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

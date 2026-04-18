import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Lock, Eye, EyeOff, CheckCircle, User } from 'lucide-react';

interface RegisterFormProps {
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onClose, onSwitchToLogin }) => {
    const { register, loading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [localError, setLocalError] = useState('');
    const [success, setSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        try {
            await register(name, email, password);
            setRegisteredEmail(email);
            setSuccess(true);
        } catch (err: any) {
            setLocalError(err.message || 'Registration failed');
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white rounded-2xl max-w-md w-full p-10 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail size={36} className="text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Inbox!</h2>
                    <p className="text-gray-500 mb-2 text-sm leading-relaxed">
                        We've sent a verification link to
                    </p>
                    <p className="font-semibold text-purple-700 text-base mb-6 bg-purple-50 px-4 py-2 rounded-lg inline-block">
                        {registeredEmail}
                    </p>
                    <p className="text-gray-400 text-sm mb-8">
                        Click the link in the email to activate your account. The link expires in 24 hours.
                    </p>
                    <button
                        onClick={onSwitchToLogin}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        Go to Login
                    </button>
                    <p className="text-xs text-gray-400 mt-4">
                        Didn't receive it? Check your spam folder.
                    </p>
                </div>
            </div>
        );
    }

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
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-400 text-sm mt-1">Join Avenly and start shopping</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {localError && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                            <span>⚠️</span>{localError}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                                placeholder="Your full name"
                                required
                                disabled={loading}
                                minLength={2}
                            />
                        </div>
                    </div>

                    {/* Email */}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                                placeholder="At least 6 characters"
                                required
                                disabled={loading}
                                minLength={6}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                                placeholder="Repeat your password"
                                required
                                disabled={loading}
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            {confirmPassword && (
                                <span className="absolute right-10 top-1/2 -translate-y-1/2">
                                    <CheckCircle size={16} className={password === confirmPassword ? 'text-green-500' : 'text-red-400'} />
                                </span>
                            )}
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
                                Creating account...
                            </span>
                        ) : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="text-purple-600 hover:text-purple-700 font-semibold">
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

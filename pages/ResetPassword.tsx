import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (!token) {
            setError('Invalid or missing reset token. Please use the link from your email.');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Your password has been updated successfully. You can now log in with your new password.
                    </p>
                    <Link
                        to="/"
                        className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        Go to Homepage & Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={36} className="text-purple-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h1>
                    <p className="text-gray-500 text-sm">Choose a strong password for your account.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm mb-4">
                        {error}
                    </div>
                )}

                {!token && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-xl text-sm mb-4">
                        ⚠️ Invalid reset link. Please use the link from your email.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                required
                                disabled={loading || !token}
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
                                placeholder="Repeat new password"
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                required
                                disabled={loading || !token}
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Resetting…' : 'Reset Password'}
                    </button>
                </form>

                <Link to="/" className="inline-flex items-center gap-1.5 mt-6 text-sm text-gray-400 hover:text-gray-600">
                    <ArrowLeft size={14} /> Back to Homepage
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;

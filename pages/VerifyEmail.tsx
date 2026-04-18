import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { CheckCircle, XCircle, Loader, RefreshCw, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const [resendEmail, setResendEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);

    const hasCalled = useRef(false);

    useEffect(() => {
        const verify = async () => {
            if (hasCalled.current) return; // Prevent double-call in React StrictMode
            hasCalled.current = true;

            if (!token) {
                setStatus('error');
                return;
            }
            try {
                const data = await authService.verifyEmail(token);
                setVerifiedEmail(data?.email || '');
                setStatus('success');
            } catch (err: any) {
                setStatus('error');
            }
        };
        verify();
    }, [token]);

    const handleResend = async () => {
        if (!resendEmail) {
            toast.error('Please enter your email address');
            return;
        }
        setResendLoading(true);
        try {
            await authService.resendVerification(resendEmail);
            toast.success('New verification link sent! Check your inbox.');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend email');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10 text-center">
                {status === 'loading' && (
                    <>
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader size={36} className="text-purple-600 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email…</h1>
                        <p className="text-gray-500 text-sm">Please wait a moment.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
                        {verifiedEmail && (
                            <p className="text-purple-700 font-medium text-sm bg-purple-50 px-3 py-1.5 rounded-lg inline-block mb-3">
                                {verifiedEmail}
                            </p>
                        )}
                        <p className="text-gray-500 text-sm mb-8">
                            Your account is now active. You can log in and start shopping.
                        </p>
                        <Link
                            to="/"
                            className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Go to Homepage
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle size={40} className="text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired or Invalid</h1>
                        <p className="text-gray-500 text-sm mb-8">
                            This verification link has expired or is invalid. Enter your email to get a new one.
                        </p>
                        <div className="text-left space-y-3">
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={resendEmail}
                                    onChange={(e) => setResendEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                            </div>
                            <button
                                onClick={handleResend}
                                disabled={resendLoading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={16} className={resendLoading ? 'animate-spin' : ''} />
                                {resendLoading ? 'Sending…' : 'Resend Verification Email'}
                            </button>
                        </div>
                        <Link to="/" className="inline-block mt-4 text-sm text-gray-400 hover:text-gray-600">
                            Back to Homepage
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [email, setEmail] = useState('');
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        // Get email from location state or redirect to register
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            navigate('/register');
        }
    }, [location, navigate]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (code.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/auth/verify-email', {
                email,
                code,
            });

            if (response.success) {
                toast.success('Email verified successfully!');

                // Store token and user
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Redirect to home or dashboard
                navigate('/');
                window.location.reload(); // Refresh to update auth state
            }
        } catch (error) {
            console.error('Verification error:', error);
            toast.error(error.response?.data?.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            const response = await api.post('/auth/resend-verification', { email });

            if (response.success) {
                toast.success('New verification code sent!');
                setCountdown(60); // 60 second cooldown
            }
        } catch (error) {
            console.error('Resend error:', error);
            toast.error('Failed to resend code');
        } finally {
            setResending(false);
        }
    };

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setCode(value);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <Mail size={40} className="text-green-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Verify Your Email
                        </h2>
                        <p className="text-gray-600">
                            We've sent a 6-digit code to
                        </p>
                        <p className="text-green-600 font-semibold mt-1">{email}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleVerify} className="space-y-6">
                        {/* Code Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={handleCodeChange}
                                placeholder="000000"
                                maxLength="6"
                                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Code expires in 15 minutes
                            </p>
                        </div>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={loading || code.length !== 6}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    Verify Email
                                </>
                            )}
                        </button>
                    </form>

                    {/* Resend Code */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 mb-3">
                            Didn't receive the code?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={resending || countdown > 0}
                            className="text-green-600 hover:text-green-700 font-semibold flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw size={16} className={resending ? 'animate-spin' : ''} />
                            {countdown > 0
                                ? `Resend in ${countdown}s`
                                : 'Resend Code'
                            }
                        </button>
                    </div>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;

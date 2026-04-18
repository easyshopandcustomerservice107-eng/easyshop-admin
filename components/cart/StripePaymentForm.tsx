import React, { useState } from 'react';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { Lock, Loader2, ShieldCheck, CreditCard, Calendar, Hash } from 'lucide-react';

interface StripePaymentFormProps {
    total: number;
    clientSecret: string;
    onSuccess: (paymentIntent: any) => Promise<void>;
    onError: (message: string) => void;
    isProcessing: boolean;
    setIsProcessing: (loading: boolean) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
    total,
    clientSecret,
    onSuccess,
    onError,
    isProcessing,
    setIsProcessing
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const elementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#212121',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                '::placeholder': {
                    color: '#cbd5e1',
                },
            },
            invalid: {
                color: '#f85606',
            },
        },
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const cardNumberElement = elements.getElement(CardNumberElement);

        if (!cardNumberElement) {
            setIsProcessing(false);
            return;
        }

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumberElement as any,
                },
            });

            if (error) {
                onError(error.message || 'Payment failed');
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                await onSuccess(paymentIntent);
            } else {
                onError('Payment not completed successfully');
                setIsProcessing(false);
            }
        } catch (err: any) {
            onError(err.message || 'Payment failed');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50/50 p-4 md:p-6 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tight">
                        <Lock className="h-4 w-4 text-[#f85606]" />
                        <span>Secure Card Payment</span>
                    </h4>
                </div>

                <div className="space-y-5">
                    {/* Card Number */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                            <CreditCard className="w-3 h-3" />
                            Card Number
                        </label>
                        <div className="p-4 bg-white border border-gray-200 rounded-xl focus-within:ring-1 focus-within:ring-[#f85606] focus-within:border-[#f85606] transition-all shadow-sm">
                            <CardNumberElement options={elementOptions} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Expiry Date */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <Calendar className="w-3 h-3" />
                                Expiry
                            </label>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl focus-within:ring-1 focus-within:ring-[#f85606] focus-within:border-[#f85606] transition-all shadow-sm">
                                <CardExpiryElement options={elementOptions} />
                            </div>
                        </div>

                        {/* CVC */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <Hash className="w-3 h-3" />
                                CVC
                            </label>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl focus-within:ring-1 focus-within:ring-[#f85606] focus-within:border-[#f85606] transition-all shadow-sm">
                                <CardCvcElement options={elementOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-[10px] text-gray-400 font-medium text-center italic">
                    Payments are highly secured by Stripe Encrypted Protocols
                </p>
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-[#f85606] text-white py-5 rounded-2xl font-extrabold text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-100/50 hover:bg-[#d04a05] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
                {isProcessing ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span className="text-[11px] font-bold">Safely Processing...</span>
                    </div>
                ) : (
                    <>
                        <ShieldCheck className="h-5 w-5" />
                        <span>Pay ${total.toFixed(2)} Now</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default StripePaymentForm;

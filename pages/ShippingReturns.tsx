import React from 'react';
import { Package, Truck, RotateCcw, Shield } from 'lucide-react';

const ShippingReturns: React.FC = () => {
    return (
        <div className="bg-sand min-h-screen">
            {/* Hero Section */}
            <section className="bg-sage/10 py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl md:text-6xl font-sans text-primary mb-6">
                        Shipping & Returns
                    </h1>
                    <p className="text-lg text-primary/70">
                        We want you to love your purchase. Here's everything you need to know about delivery and returns.
                    </p>
                </div>
            </section>

            {/* Quick Info Cards */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8 text-sage" />
                            </div>
                            <h3 className="font-sans font-medium text-primary mb-2">Free Shipping</h3>
                            <p className="text-sm text-primary/60">On orders over $150</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-sage" />
                            </div>
                            <h3 className="font-sans font-medium text-primary mb-2">Fast Processing</h3>
                            <p className="text-sm text-primary/60">Ships within 1-2 business days</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <RotateCcw className="w-8 h-8 text-sage" />
                            </div>
                            <h3 className="font-sans font-medium text-primary mb-2">30-Day Returns</h3>
                            <p className="text-sm text-primary/60">Easy returns & exchanges</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-sage" />
                            </div>
                            <h3 className="font-sans font-medium text-primary mb-2">Secure Packaging</h3>
                            <p className="text-sm text-primary/60">Eco-friendly materials</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Information */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        {/* Shipping Policy */}
                        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
                            <h2 className="text-3xl font-sans text-primary mb-6">Shipping Policy</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-sans text-primary mb-3">Domestic Shipping (US)</h3>
                                    <ul className="space-y-2 text-primary/70">
                                        <li>• <strong>Standard Shipping:</strong> 5-7 business days - $9.95 (FREE on orders $150+)</li>
                                        <li>• <strong>Express Shipping:</strong> 2-3 business days - $24.95</li>
                                        <li>• <strong>Next Day:</strong> 1 business day - $39.95</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-sans text-primary mb-3">International Shipping</h3>
                                    <ul className="space-y-2 text-primary/70">
                                        <li>• <strong>Canada:</strong> 7-10 business days - Starting at $19.95</li>
                                        <li>• <strong>Europe:</strong> 10-15 business days - Starting at $29.95</li>
                                        <li>• <strong>Rest of World:</strong> 12-20 business days - Starting at $39.95</li>
                                        <li className="mt-4 text-sm italic">
                                            * International orders may be subject to import duties and taxes, which are the responsibility of the recipient.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-sans text-primary mb-3">Order Processing</h3>
                                    <p className="text-primary/70 leading-relaxed">
                                        Orders are processed within 1-2 business days (Monday-Friday, excluding holidays).
                                        You'll receive a confirmation email with tracking information once your order ships.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Return Policy */}
                        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
                            <h2 className="text-3xl font-sans text-primary mb-6">Return & Exchange Policy</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-sans text-primary mb-3">30-Day Satisfaction Guarantee</h3>
                                    <p className="text-primary/70 leading-relaxed mb-4">
                                        We want you to absolutely love your purchase. If you're not completely satisfied,
                                        you may return unwashed and unused items within 30 days of delivery for a full refund.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-sans text-primary mb-3">How to Return</h3>
                                    <ol className="space-y-2 text-primary/70 list-decimal list-inside">
                                        <li>Contact our customer service team at support@yumeko.com</li>
                                        <li>Include your order number and reason for return</li>
                                        <li>We'll send you a prepaid return label (US only) within 24 hours</li>
                                        <li>Pack items securely in original packaging</li>
                                        <li>Drop off at any authorized shipping location</li>
                                        <li>Refund processed within 5-7 business days of receiving your return</li>
                                    </ol>
                                </div>

                                <div>
                                    <h3 className="text-xl font-sans text-primary mb-3">Important Notes</h3>
                                    <ul className="space-y-2 text-primary/70">
                                        <li>• Items must be unwashed, unused, and in original packaging</li>
                                        <li>• Original shipping costs are non-refundable</li>
                                        <li>• International customers are responsible for return shipping costs</li>
                                        <li>• Exchanges follow the same process - return the original item and place a new order</li>
                                        <li>• Sale items can be returned for store credit only</li>
                                    </ul>
                                </div>

                                <div className="bg-sage/10 p-6 rounded-lg mt-6">
                                    <h4 className="font-sans font-medium text-primary mb-2">Damaged or Defective Items?</h4>
                                    <p className="text-sm text-primary/70">
                                        If you receive a damaged or defective item, please contact us immediately with photos.
                                        We'll arrange for a replacement or full refund at no cost to you, including return shipping.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="text-center p-8 bg-sage/10 rounded-lg">
                            <h3 className="text-2xl font-sans text-primary mb-4">
                                Questions about your order?
                            </h3>
                            <p className="text-primary/70 mb-6">
                                Our customer service team is here to help.
                            </p>
                            <a
                                href="/#/contact"
                                className="inline-block bg-primary text-white px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-sage transition-colors"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShippingReturns;

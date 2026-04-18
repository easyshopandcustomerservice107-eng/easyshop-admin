import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: 'What makes your linens eco-friendly?',
            answer: 'Our linens are crafted from 100% organic, sustainably sourced materials. We use GOTS-certified organic cotton and European flax, ensuring no harmful chemicals are used in cultivation or processing. Every step of our production adheres to strict environmental standards.'
        },
        {
            question: 'How do I care for my linen bedding?',
            answer: 'Machine wash in cold water on a gentle cycle. Use mild, eco-friendly detergent and avoid bleach. Tumble dry on low or line dry for best results. Linen becomes softer with each wash and doesn\'t require ironing - the natural texture is part of its charm.'
        },
        {
            question: 'Do you offer international shipping?',
            answer: 'Yes! We ship worldwide. Shipping costs and delivery times vary by location. Free shipping is available for orders over $150 within the continental US. International orders may be subject to import duties and taxes.'
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely satisfied with your purchase, you can return unwashed and unused items for a full refund. Original shipping costs are non-refundable. Please see our Shipping & Returns page for complete details.'
        },
        {
            question: 'Are your products ethically made?',
            answer: 'Absolutely. We partner with Fair Trade Certified factories that ensure safe working conditions, fair wages, and sustainable practices. We visit our production facilities regularly and maintain transparent relationships with all our suppliers.'
        },
        {
            question: 'How long will my order take to arrive?',
            answer: 'Standard shipping within the US takes 5-7 business days. Express shipping (2-3 business days) is available. International orders typically arrive within 10-15 business days. You\'ll receive tracking information once your order ships.'
        },
        {
            question: 'Do your linens come in different sizes?',
            answer: 'Yes! We offer all standard sizes: Twin, Twin XL, Full, Queen, King, and California King. Custom sizes are available upon request - please contact us for a quote.'
        },
        {
            question: 'What thread count are your sheets?',
            answer: 'Thread count is less meaningful for linen than for cotton. Our linens are measured by weight (GSM - grams per square meter). We use premium 180-220 GSM fabric that provides the perfect balance of breathability, durability, and softness.'
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-sand min-h-screen">
            {/* Hero Section */}
            <section className="bg-sage/10 py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl md:text-6xl font-sans text-primary mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-primary/70">
                        Everything you need to know about our sustainable luxury linens
                    </p>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-3xl">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
                                >
                                    <h3 className="text-lg font-sans font-medium text-primary pr-4">
                                        {faq.question}
                                    </h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-sage flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                        }`}
                                >
                                    <div className="px-8 pb-6 pt-2">
                                        <p className="text-primary/70 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-16 text-center p-8 bg-sage/10 rounded-lg">
                        <h3 className="text-2xl font-sans text-primary mb-4">
                            Still have questions?
                        </h3>
                        <p className="text-primary/70 mb-6">
                            Our team is here to help you find the perfect sustainable bedding.
                        </p>
                        <a
                            href="/#/contact"
                            className="inline-block bg-primary text-white px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-sage transition-colors"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;

import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import Loader from '../components/common/Loader';
import { Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await contentService.getContent('privacy_policy');
                setContent(data);
            } catch (err) {
                console.error('Failed to fetch Privacy Policy');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) return <Loader fullPage color="#4A5D4E" />;

    return (
        <div className="bg-sand min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-sm shadow-sm">
                <div className="flex items-center space-x-4 mb-10 border-b border-sage/10 pb-8">
                    <div className="bg-sage/10 p-4 rounded-full text-sage">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-sans text-primary">Privacy Policy</h1>
                        <p className="text-primary/50 text-sm mt-1 uppercase tracking-widest">Effective Date: {content?.effectiveDate || new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="prose prose-sage max-w-none prose-headings:font-sans prose-headings:font-medium prose-p:text-primary/70 prose-p:leading-relaxed">
                    {content?.body ? (
                        <div dangerouslySetInnerHTML={{ __html: content.body }} />
                    ) : (
                        <div className="space-y-8">
                            <p>We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website.</p>
                            <h2 className="text-2xl font-sans text-primary mt-8">1. Information Collection</h2>
                            <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or sign up for our newsletter.</p>
                            <h2 className="text-2xl font-sans text-primary mt-8">2. Use of Information</h2>
                            <p>We use your information to provide and improve our services, process transactions, and communicate with you about your orders and promotional offers.</p>
                            <h2 className="text-2xl font-sans text-primary mt-8">3. Data Security</h2>
                            <p>We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure.</p>
                            {/* Fallback text if no backend content exists yet */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

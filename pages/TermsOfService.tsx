import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import Loader from '../components/common/Loader';
import { FileText } from 'lucide-react';

const TermsOfService: React.FC = () => {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await contentService.getContent('terms_service');
                setContent(data);
            } catch (err) {
                console.error('Failed to fetch Terms of Service');
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
                        <FileText className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-sans text-primary">Terms of Service</h1>
                        <p className="text-primary/50 text-sm mt-1 uppercase tracking-widest">Last Updated: {content?.lastUpdated || new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="prose prose-sage max-w-none prose-headings:font-sans prose-headings:font-medium prose-p:text-primary/70 prose-p:leading-relaxed">
                    {content?.body ? (
                        <div dangerouslySetInnerHTML={{ __html: content.body }} />
                    ) : (
                        <div className="space-y-8">
                            <p>Welcome to Easy Shop and Customer Service. By accessing our website, you agree to comply with and be bound by the following terms and conditions of use.</p>
                            <h2 className="text-2xl font-sans text-primary mt-8">1. Acceptance of Terms</h2>
                            <p>By using this site, you signify your acceptance of these terms. If you do not agree, please do not use our site.</p>
                            <h2 className="text-2xl font-sans text-primary mt-8">2. Intellectual Property</h2>
                            <p>All content on this site, including text, graphics, logos, and images, is the property of Easy Shop and Customer Service and protected by copyright laws.</p>
                            <h2 className="text-2xl font-sans text-primary mt-8">3. Limitation of Liability</h2>
                            <p>Easy Shop and Customer Service shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our products or website.</p>
                            {/* Fallback text if no backend content exists yet */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;

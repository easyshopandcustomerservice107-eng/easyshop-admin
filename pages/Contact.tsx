import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Gem } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real implementation, this would send to a backend endpoint
        toast.success('Message sent! We\'ll get back to you within 24 hours.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="bg-sand min-h-screen">
            <SEO 
                title="Contact the Vault" 
                description="Contact Easy Shop and Customer Service for inquiries about rare gemstones, mineral specimens, or wholesale opportunities. Our gemologists are here to help."
            />
            {/* Hero Section */}
            <section className="bg-primary/5 py-12 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl md:text-6xl font-sans text-primary mb-6">
                        Contact the Vault
                    </h1>
                    <p className="text-lg text-primary/70">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
                            <h2 className="text-3xl font-sans text-primary mb-6">Send us a message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-sage"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-sage"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-sage"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-sage resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white px-8 py-4 text-sm uppercase tracking-widest font-bold hover:bg-sage transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-sans text-primary mb-6">Contact Information</h2>
                                <p className="text-primary/70 leading-relaxed mb-8">
                                    Whether you have a question about our products, sustainability practices, or need assistance with an order, our team is ready to answer all your questions.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-sans font-medium text-primary mb-1">Email</h3>
                                        <p className="text-primary/70">support@easyshop.com</p>
                                        <p className="text-sm text-primary/50 mt-1">Our team responds within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-sans font-medium text-primary mb-1">Phone</h3>
                                        <p className="text-primary/70">+1 (800) GEMS-NOR</p>
                                        <p className="text-sm text-primary/50 mt-1">Mon-Fri, 8am-5pm MST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-sans font-medium text-primary mb-1">Headquarters</h3>
                                        <p className="text-primary/70">
                                            452 Mineral Range Road<br />
                                            Yellowknife, NT X1A 2P7<br />
                                            Canada
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            {/* Business Hours */}
                            <div className="bg-accent/5 p-6 rounded-lg mt-8">
                                <h3 className="font-sans font-medium text-primary mb-4">Business Hours</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-primary/70">Monday - Friday</span>
                                        <span className="text-primary font-medium">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-primary/70">Saturday</span>
                                        <span className="text-primary font-medium">10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-primary/70">Sunday</span>
                                        <span className="text-primary font-medium">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;

import React from 'react';
import { Gem, Heart, Users, Award, Mountain } from 'lucide-react';
import SEO from '../components/common/SEO';

const About: React.FC = () => {
    return (
        <div className="bg-sand min-h-screen">
            <SEO 
                title="Our Story" 
                description="Learn about the origins of Easy Shop and Customer Service. From the heart of the earth to your collection, we specialize in ethically sourced gemstones."
            />
            {/* Hero Section */}
            <section className="relative h-[60vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1515555233972-7bc928c60a11?q=80&w=2457&auto=format&fit=crop"
                    alt="Gemstone Mining"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white px-6">
                        <h1 className="text-5xl md:text-7xl font-sans mb-4">Our Legacy</h1>
                        <p className="text-xl md:text-2xl tracking-wide">Excellence in Mining Since 1995</p>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl md:text-5xl font-sans text-primary mb-8">
                        Forged in Earth, Perfected for You
                    </h2>
                    <p className="text-lg text-primary/70 leading-relaxed">
                        We believe that every gemstone tells a story. Founded in 1995,
                        Easy Shop and Customer Service was born from a passion for geological wonders and
                        a commitment to ethical excavation. What started as a small exploration team
                        has grown into a premier source for rare minerals and high-quality gems.
                    </p>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-16 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-sans text-primary text-center mb-12">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mountain className="w-10 h-10 text-accent" />
                            </div>
                            <h3 className="text-xl font-sans text-primary mb-3">Responsible Mining</h3>
                            <p className="text-primary/60 text-sm leading-relaxed">
                                100% reclamation of mining sites, zero toxic run-off, and low-impact extraction
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-10 h-10 text-sage" />
                            </div>
                            <h3 className="text-xl font-sans text-primary mb-3">Quality</h3>
                            <p className="text-primary/60 text-sm leading-relaxed">
                                Premium fabrics that last for years, becoming softer with every wash
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-sage" />
                            </div>
                            <h3 className="text-xl font-sans text-primary mb-3">Ethics</h3>
                            <p className="text-primary/60 text-sm leading-relaxed">
                                Fair Trade partnerships ensuring dignity and living wages for all workers
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-10 h-10 text-sage" />
                            </div>
                            <h3 className="text-xl font-sans text-primary mb-3">Transparency</h3>
                            <p className="text-primary/60 text-sm leading-relaxed">
                                Full supply chain visibility - we know where every thread comes from
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-sans text-primary mb-6">Our Origins</h2>
                            <p className="text-primary/70 leading-relaxed mb-4">
                                Our founder, inspired by a childhood exploration of local markets, recognized that
                                the gemstone industry needed a more transparent and ethical approach. Rare minerals
                                were often sourced from conflict zones or through methods that devastated the environment.
                            </p>
                            <p className="text-primary/70 leading-relaxed">
                                After decades of establishing direct relationships with verified mines and developing
                                proprietary sorting technologies, Easy Shop and Customer Service was established to provide collectors
                                with peace of mind and unparalleled quality.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-sans text-primary mb-6">Our Promise</h2>
                            <p className="text-primary/70 leading-relaxed mb-4">
                                Today, we are proud to be a global leader in ethical gemstone sourcing. We continuously invest 
                                in gemological research, support local mining communities, and push for international
                                conflict-free standards.
                            </p>
                            <p className="text-primary/70 leading-relaxed">
                                Every acquisition supports responsible excavation, environmental restoration, and 
                                fair labor practices. When you choose Easy Shop and Customer Service, you're not just
                                acquiring a gem—you're preserving a piece of the earth's history.
                            </p>
                        </div>

                        {/* Impact Stats */}
                        <div className="bg-accent/10 p-8 md:p-12 rounded-lg">
                            <h3 className="text-2xl font-sans text-primary mb-8 text-center">Our Heritage</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div>
                                    <div className="text-4xl font-sans text-accent mb-2">25+ Years</div>
                                    <p className="text-primary/60 text-sm uppercase tracking-wider">Expertise</p>
                                </div>
                                <div>
                                    <div className="text-4xl font-sans text-emerald mb-2">1,000+</div>
                                    <p className="text-primary/60 text-sm uppercase tracking-wider">Verified Stones</p>
                                </div>
                                <div>
                                    <div className="text-4xl font-sans text-ruby mb-2">Global</div>
                                    <p className="text-primary/60 text-sm uppercase tracking-wider">Direct Sourcing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-primary text-white">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-4xl font-sans mb-6">
                        Discover the Vault
                    </h2>
                    <p className="text-white/80 mb-8 leading-relaxed">
                        Begin your journey into the world of rare gemstones and minerals. Your treasure awaits.
                    </p>
                    <a
                        href="/#/products"
                        className="inline-block bg-white text-primary px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-sand transition-colors"
                    >
                        Shop Our Collection
                    </a>
                </div>
            </section>
        </div>
    );
};

export default About;

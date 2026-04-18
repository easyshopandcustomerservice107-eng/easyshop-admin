import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    X,
    Star,
    MessageSquare
} from 'lucide-react';
import { testimonialService, Testimonial } from '../../services/testimonialService';

const TestimonialManagement: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        content: '',
        rating: 5,
        avatar: '',
        isActive: true
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const data = await testimonialService.getTestimonials();
            setTestimonials(data);
        } catch (err: any) {
            console.error('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    };

    const filteredTestimonials = testimonials.filter(t =>
        (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.company || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (testimonial: Testimonial | null = null) => {
        if (testimonial) {
            setSelectedTestimonial(testimonial);
            setFormData({
                name: testimonial.name,
                role: testimonial.role,
                company: testimonial.company || '',
                content: testimonial.content,
                rating: testimonial.rating,
                avatar: testimonial.avatar || '',
                isActive: testimonial.isActive
            });
        } else {
            setSelectedTestimonial(null);
            setFormData({
                name: '',
                role: '',
                company: '',
                content: '',
                rating: 5,
                avatar: '',
                isActive: true
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedTestimonial) {
                await testimonialService.updateTestimonial(selectedTestimonial._id, formData);
            } else {
                await testimonialService.createTestimonial(formData);
            }
            setModalOpen(false);
            fetchTestimonials();
        } catch (err: any) {
            alert('Action failed: ' + err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            try {
                await testimonialService.deleteTestimonial(id);
                setTestimonials(prev => prev.filter(t => t._id !== id));
            } catch (err: any) {
                alert('Failed to delete testimonial: ' + err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-accent-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Testimonials</h1>
                    <p className="text-slate-400 text-sm font-medium">Manage customer reviews and feedback.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Testimonial</span>
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search testimonials..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Author</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Content</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTestimonials.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No testimonials found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTestimonials.map((testimonial) => (
                                    <tr key={testimonial._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-4">
                                                {testimonial.avatar && (
                                                    <img
                                                        src={testimonial.avatar}
                                                        alt={testimonial.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
                                                    <p className="text-xs text-slate-400 line-clamp-1">
                                                        {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <p className="text-sm text-slate-600 line-clamp-2 max-w-md">
                                                {testimonial.content}
                                            </p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            {testimonial.isActive ? (
                                                <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 uppercase tracking-widest">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 uppercase tracking-widest">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(testimonial)}
                                                    className="p-2 text-slate-400 hover:text-accent-gold transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(testimonial._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                                {selectedTestimonial ? 'Edit Testimonial' : 'New Testimonial'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. John Doe"
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. CEO"
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="e.g. Acme Corp"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content *</label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Testimonial content..."
                                    rows={4}
                                    maxLength={500}
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all resize-none"
                                />
                                <p className="text-xs text-slate-400 text-right">{formData.content.length}/500</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rating *</label>
                                    <select
                                        value={formData.rating}
                                        onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all cursor-pointer"
                                    >
                                        {[5, 4, 3, 2, 1].map(num => (
                                            <option key={num} value={num}>{num} Star{num !== 1 && 's'}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                    <select
                                        value={formData.isActive ? 'active' : 'inactive'}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all cursor-pointer"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Avatar URL</label>
                                <input
                                    type="url"
                                    value={formData.avatar}
                                    onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all font-mono text-xs"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-accent-gold text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all mt-4"
                            >
                                {selectedTestimonial ? 'Update' : 'Create'} Testimonial
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialManagement;

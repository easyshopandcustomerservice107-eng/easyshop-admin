import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Plus } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/productService';

interface ProductModalProps {
    product?: Product | null;
    onClose: () => void;
    onSave: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        brand: '',
        isHero: false,
        discount: '0',
        specifications: [] as { key: string; value: string }[]
    });

    const [specInput, setSpecInput] = useState({ key: '', value: '' });

    useEffect(() => {
        fetchCategories();
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: typeof product.category === 'string' ? product.category : product.category?._id || '',
                stock: product.stock.toString(),
                brand: product.brand || '',
                isHero: product.isHero || false,
                discount: (product.discount || 0).toString(),
                specifications: product.specifications || []
            });
            if (product.images) {
                setPreviews(product.images.map(img => img.url));
            }
        }
    }, [product]);

    const fetchCategories = async () => {
        try {
            const cats = await productService.getCategories();
            setCategories(cats);
        } catch (err) {
            console.error('Failed to fetch categories');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);

        selectedFiles.forEach((file: File) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleAddSpec = () => {
        if (specInput.key && specInput.value) {
            setFormData(prev => ({
                ...prev,
                specifications: [...prev.specifications, specInput]
            }));
            setSpecInput({ key: '', value: '' });
        }
    };

    const handleRemoveSpec = (index: number) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'specifications') {
                    data.append(key, JSON.stringify(value));
                } else {
                    data.append(key, value.toString());
                }
            });

            files.forEach(file => {
                data.append('images', file);
            });

            if (product) {
                await productService.updateProduct(product._id, data);
            } else {
                await productService.createProduct(data);
            }
            onSave();
            onClose();
        } catch (err: any) {
            alert('Failed to save artifact: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-accent-gold uppercase tracking-widest block mb-1">
                            Product Editor
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tighter">
                            {product ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl transition-all">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-12">
                    {/* Visual Assets */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <div className="w-1 h-3 bg-accent-gold/100"></div>
                            Visual Assets
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {previews.map((url, i) => (
                                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 relative group">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviews(prev => prev.filter((_, idx) => idx !== i));
                                            setFiles(prev => prev.filter((_, idx) => idx !== i));
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-accent-gold/10 transition-all text-slate-400 hover:text-accent-gold">
                                <Upload className="w-6 h-6 mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
                                <input type="file" multiple onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                    </section>

                    {/* Core Metadata */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-slate-300 pl-3">Product Name</h3>
                            <input
                                required
                                type="text"
                                placeholder="Product Name"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <textarea
                                required
                                placeholder="Product Description"
                                rows={4}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-slate-300 pl-3">Specifications</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    required
                                    type="number"
                                    placeholder="Base Price (PKR)"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                                <input
                                    required
                                    type="number"
                                    placeholder="Stock (Units)"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Discount (%)"
                                    min="0"
                                    max="100"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all font-bold text-rose-600"
                                    value={formData.discount}
                                    onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                />
                            </div>
                            <select
                                required
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all cursor-pointer"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Brand / Origin"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all"
                                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                            />

                            <div className="flex items-center space-x-3 p-4 bg-slate-50 border-none rounded-2xl">
                                <input
                                    type="checkbox"
                                    id="isHero"
                                    className="w-5 h-5 text-accent-gold rounded border-gray-300 focus:ring-accent-gold/100"
                                    checked={formData.isHero}
                                    onChange={e => setFormData({ ...formData, isHero: e.target.checked })}
                                />
                                <label htmlFor="isHero" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                                    Feature as Hero Product
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Detailed Specifications */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <div className="w-1 h-3 bg-accent-gold/100"></div>
                            Detailed Specifications
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Spec Name (e.g. Material)"
                                    className="flex-1 p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold placeholder:font-medium transition-all"
                                    value={specInput.key}
                                    onChange={e => setSpecInput({ ...specInput, key: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Value (e.g. 100% Cotton)"
                                    className="flex-1 p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold placeholder:font-medium transition-all"
                                    value={specInput.value}
                                    onChange={e => setSpecInput({ ...specInput, value: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSpec}
                                    className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {formData.specifications.length === 0 && (
                                    <p className="text-xs text-slate-400 italic font-medium p-2">No specifications added yet.</p>
                                )}
                                {formData.specifications.map((spec, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-all">
                                        <div className="flex gap-2">
                                            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">{spec.key}:</span>
                                            <span className="text-slate-900 font-bold text-sm">{spec.value}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpec(index)}
                                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </form>

                <div className="p-8 bg-slate-50 flex items-center justify-end space-x-6">
                    <button onClick={onClose} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                        Discard Changes
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        <span>{product ? 'Save Changes' : 'Create Product'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Loader2
} from 'lucide-react';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import ProductModal from '../../components/admin/ProductModal';

const ProductManagement: React.FC = () => {
    const location = useLocation();
    const isInventoryView = location.pathname === '/admin/inventory';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts({ limit: 100 });
            setProducts(data.products);
        } catch (err: any) {
            setError(err.message || 'Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (p: Product | null = null) => {
        setSelectedProduct(p);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSaveSuccess = () => {
        fetchProducts(); // Re-fetch products to update the list
        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                setProducts(prev => prev.filter(p => p._id !== id));
            } catch (err: any) {
                alert('Action failed: ' + err.message);
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
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase">
                        {isInventoryView ? 'Inventory' : 'Products'}
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">
                        {isInventoryView
                            ? 'Monitor and manage stock levels.'
                            : 'Manage your store\'s product catalog.'}
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-accent-gold text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center space-x-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200"
                >
                    <Plus className="w-4 h-4" />
                    <span>{isInventoryView ? 'Add New Stock' : 'Add New Product'}</span>
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter by ID or Name..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-3 text-slate-400 hover:text-accent-gold hover:bg-accent-gold/10 rounded-xl transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="card-premium grain-texture overflow-hidden border border-accent/10">
                <div className="px-8 py-6 border-b border-accent/10 bg-primary/5 flex items-center justify-between">
                    <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Product Inventory</h3>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{products.length} Items Total</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#FAF9F6] border-b border-accent/10">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-accent uppercase tracking-widest">Product</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-accent uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-accent uppercase tracking-widest">Price</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-accent uppercase tracking-widest">Stock</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-accent uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-accent/5">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-accent/10 group-hover:border-accent/40 transition-all">
                                                <img src={product.images?.[0]?.url || product.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-sans font-black text-primary uppercase tracking-tight">{product.name}</div>
                                                <div className="text-[9px] font-black text-primary/40 uppercase tracking-widest mt-0.5">SKU: {product._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest border border-accent/20">
                                            {typeof product.category === 'string' ? product.category : product.category?.name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-sans font-black text-primary">${product.price.toFixed(2)}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                            <span className="text-[11px] font-black text-primary/60">{product.stock} in Vault</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button 
                                                onClick={() => handleOpenModal(product)}
                                                className="p-3 text-primary/40 hover:text-accent hover:bg-accent/10 rounded-xl transition-all border border-transparent hover:border-accent/20"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product._id)}
                                                className="p-3 text-primary/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>

            {modalOpen && (
                <ProductModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onSave={handleSaveSuccess}
                />
            )}
        </div>
    );
};

export default ProductManagement;

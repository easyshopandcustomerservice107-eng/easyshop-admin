import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { Product } from '../types';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';

const normalizeProduct = (product: Product): Product => ({
  ...product,
  id: product._id,
  image: product.images?.[0]?.url || product.image || '',
  secondaryImage: product.images?.[1]?.url || product.secondaryImage || '',
  reviewsCount: product.numOfReviews || 0,
  category: typeof product.category === 'string' ? product.category : product.category?.name || 'All',
});

const ProductListing: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: any = {
          limit: 100
        };
        if (initialCategory !== 'All') {
          params.category = initialCategory;
        }
        if (initialQuery) {
          params.search = initialQuery;
        }

        const response = await productService.getProducts(params);
        setProducts(response.products);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialCategory, initialQuery]);

  const normalizedProducts = products.map(normalizeProduct);


  if (loading) return <Loader fullPage color="#4A5D4E" />;

  if (error) {
    return (
      <div className="bg-white min-h-screen pt-24 flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title={initialCategory === 'All' ? 'Treasures' : initialCategory}
        description={`Explore our ${initialCategory.toLowerCase()} collection at Easy Shop and Customer Service. Premium gemstones and rare minerals.`}
      />
      <main className="p-6 lg:p-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-24">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-9xl font-black text-gray-950 tracking-tighter leading-none mb-4 sm:mb-6">
              {initialCategory === 'All' ? 'Complete' : initialCategory}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="h-1 w-12 bg-black"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
                {normalizedProducts.length} Results in Vault
              </p>
            </div>
          </div>

          {initialQuery && (
            <div className="mt-8 md:mt-0 text-[10px] font-black text-accent-gold uppercase tracking-[0.3em] bg-accent-gold/10 px-6 py-2 rounded-full">
              Query: {initialQuery}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {normalizedProducts.length === 0 ? (
            <div className="col-span-full py-40 text-center">
              <p className="text-2xl font-black text-gray-200 uppercase tracking-[0.5em]">No entries found in vault</p>
              <Link to="/products" className="mt-8 inline-block text-black font-black border-b-2 border-black pb-1">RESET FILTERS</Link>
            </div>
          ) : (
            normalizedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductListing;

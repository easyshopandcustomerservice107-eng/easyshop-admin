import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, Heart, Share2, ChevronRight, Camera, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product, Review as ProductReview } from '../types';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { wishlistService } from '../services/wishlistService';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';

const normalizeProduct = (product: Product): Product => ({
  ...product,
  id: product._id,
  image: product.images?.[0]?.url || product.image || '',
  secondaryImage: product.images?.[1]?.url || product.secondaryImage || '',
  reviewsCount: product.numOfReviews || 0,
  rating: product.rating || (product as any).ratings || 0,
  category: typeof product.category === 'string' ? product.category : product.category?.name || 'All',
  specifications: product.specifications || []
});

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isLoggedIn, user, refreshUser } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const productData = await productService.getProduct(id);
        const reviewsData = await reviewService.getProductReviews(productData._id);

        setProduct(normalizeProduct(productData));
        setReviews(reviewsData);

        // Check if user has already reviewed
        if (user) {
          const userReview = reviewsData.find((r: any) =>
            (typeof r.user === 'string' ? r.user === user._id : r.user._id === user._id)
          );
          if (userReview) setHasReviewed(true);

          // Check wishlist
          if (user.wishlist) {
            const wishIds = (user.wishlist as any[]).map(item => typeof item === 'string' ? item : item._id);
            setIsWishlisted(wishIds.includes(productData._id));
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) return <Loader fullPage color="#4A5D4E" />;

  if (error || !product) return (
    <div className="min-h-screen bg-[#eff0f5] py-4 font-sans text-[#212121]">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Product not found'}</h2>
      <Link to="/products" className="text-accent-gold font-bold hover:underline">Back to Products</Link>
    </div>
  );


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
      <SEO 
        title={product.name} 
        description={product.description}
        keywords={`${product.name}, ${product.category}, gemstone, easy shop and customer service`}
      />
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-gray-900 transition-colors">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-100 cursor-pointer hover:ring-2 hover:ring-accent-gold/100 transition-all">
                  <img src={img.url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-300 text-[10px] font-bold uppercase tracking-widest">
                No Gallery
              </div>
            )}
          </div>

        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="mb-8">
            <span className="inline-block bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">{product.rating}</span>
              </div>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <button className="text-sm font-bold text-accent-gold hover:underline">
                {product.reviewsCount} verified reviews
              </button>
            </div>
          </div>

          <div className="flex flex-col mb-4">
            {product.discount && product.discount > 0 ? (
              <div className="flex items-center gap-4">
                <p className="text-4xl font-bold text-rose-600">${(product.price * (1 - product.discount / 100)).toFixed(2)}</p>
                <div className="flex flex-col">
                  <p className="text-lg font-bold text-gray-400 line-through decoration-rose-400/30">${product.price.toFixed(2)}</p>
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">-{product.discount}% OFF</span>
                </div>
              </div>
            ) : (
              <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
            )}
          </div>

          {/* Stock Availability Indicator */}
          <div className="mb-8">
            {product.stock > 0 ? (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${product.stock > 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {product.stock > 10 ? 'In Stock' : `Limited Stock: ${product.stock} Units Remaining`}
                </p>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600">Treasure Currently Departed (Out of Stock)</p>
              </div>
            )}
          </div>

          <p className="text-gray-500 leading-relaxed mb-10 text-lg">
            {product.description}
          </p>

          <div className="space-y-8 pb-10 border-b border-gray-100">
            <div className="flex items-center space-x-6">
              <div className="flex items-center border-2 border-gray-100 rounded-2xl px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                  className="text-gray-400 hover:text-gray-900 p-2 font-bold disabled:opacity-20"
                >-</button>
                <span className="w-12 text-center font-bold text-gray-900">{product.stock === 0 ? 0 : quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0 || quantity >= product.stock}
                  className="text-gray-400 hover:text-gray-900 p-2 font-bold disabled:opacity-20"
                >+</button>
              </div>
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className="flex-1 bg-accent-gold text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
              >
                <ShoppingCart className="h-6 w-6" />
                <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={async () => {
                  if (!isLoggedIn) {
                    toast.error('Please login to use wishlist');
                    return;
                  }
                  try {
                    await wishlistService.toggleWishlist(product._id);
                    setIsWishlisted(!isWishlisted);
                    await refreshUser();  // Sync user data
                    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                  } catch (err) {
                    toast.error('Failed to update wishlist');
                  }
                }}
                className={`flex-1 flex items-center justify-center space-x-2 border-2 py-3 rounded-2xl font-bold transition-colors ${isWishlisted ? 'border-red-100 bg-red-50 text-red-600' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>
              <button className="p-3 border-2 border-gray-100 rounded-2xl text-gray-400 hover:bg-gray-50 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ... (Shipping icons remain unchanged) ... */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            <div className="flex items-start space-x-3">
              <Truck className="h-5 w-5 text-accent-gold flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm">Free Delivery</h5>
                <p className="text-xs text-gray-400 mt-1">Orders over $100</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldCheck className="h-5 w-5 text-accent-gold flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm">2 Year Warranty</h5>
                <p className="text-xs text-gray-400 mt-1">On all electronics</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <RefreshCw className="h-5 w-5 text-accent-gold flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm">Easy Returns</h5>
                <p className="text-xs text-gray-400 mt-1">30 days period</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-100 sm:pt-16 md:pt-2">
        <div className="flex flex-wrap gap-4 sm:gap-6 md:space-x-8 mb-6 sm:mb-8 md:mb-10 border-b border-gray-100 pb-2">
          {['Description', 'Specifications', 'Reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-2 sm:pb-3 md:pb-4 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.toLowerCase() ? 'text-accent-gold' : 'text-gray-400 hover:text-gray-900'}`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-accent-gold rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="max-w-4xl leading-relaxed text-gray-500 text-sm sm:text-base md:text-lg mb-10">
          {activeTab === 'description' && (
            <div className="space-y-6">
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-gray-50">
                    <span className="font-bold text-gray-900">{spec.key}</span>
                    <span>{spec.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">No specifications available for this product.</p>
              )}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-12">
              {/* Review Submission Form */}
              {isLoggedIn && !hasReviewed && (
                <div>
                  {!showReviewForm ? (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-accent-gold text-white px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      Write a Review
                    </button>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 max-w-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Submit Review</h3>
                        <button onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-gray-900">
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!product?._id) return;
                        try {
                          setSubmittingReview(true);
                          const formData = new FormData();
                          formData.append('product', product._id);
                          formData.append('rating', rating.toString());
                          formData.append('comment', comment);
                          images.forEach(img => formData.append('images', img));

                          await reviewService.createReview(formData);
                          toast.success('Review published');

                          // Refresh data
                          const updatedReviews = await reviewService.getProductReviews(product._id);
                          setReviews(updatedReviews);
                          setHasReviewed(true);
                          setShowReviewForm(false);

                          if (product) {
                            const newCount = updatedReviews.length;
                            const newRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / newCount;
                            setProduct({ ...product, rating: newRating, reviewsCount: newCount });
                          }
                        } catch (err: any) {
                          toast.error(err.message || 'Submission failed');
                        } finally {
                          setSubmittingReview(false);
                        }
                      }} className="space-y-6">
                        <div className="flex flex-wrap items-center gap-8">
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Rating</label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className="focus:outline-none transition-transform hover:scale-110"
                                >
                                  <Star className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Photos (Max 3)</label>
                            <div className="flex gap-2">
                              {imagePreviews.map((preview, i) => (
                                <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden group">
                                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newImages = [...images];
                                      const newPreviews = [...imagePreviews];
                                      newImages.splice(i, 1);
                                      newPreviews.splice(i, 1);
                                      setImages(newImages);
                                      setImagePreviews(newPreviews);
                                    }}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-4 w-4 text-white" />
                                  </button>
                                </div>
                              ))}
                              {images.length < 3 && (
                                <label className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-accent-gold/10 transition-all text-gray-300 hover:text-accent-gold/100">
                                  <Camera className="h-4 w-4" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files || []);
                                      if (files.length + images.length > 3) {
                                        toast.error('Limit 3 images');
                                        return;
                                      }
                                      setImages([...images, ...files]);
                                      const newPreviews = files.map(file => URL.createObjectURL(file as Blob));
                                      setImagePreviews([...imagePreviews, ...newPreviews]);
                                    }}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Comment</label>
                          <textarea
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your perspective..."
                            className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-accent-gold/100/10 outline-none min-h-[100px]"
                          />
                        </div>

                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all"
                          >
                            Discard
                          </button>
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-accent-gold transition-all disabled:opacity-50 shadow-xl shadow-slate-100"
                          >
                            {submittingReview ? 'Submitting...' : 'Publish Review'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {!isLoggedIn && (
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 text-center">
                  <p className="text-gray-500 font-bold mb-4">Want to share your thoughts?</p>
                  <Link to="/login" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all">
                    Sign in to Review
                  </Link>
                </div>
              )}

              {hasReviewed && (
                <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 flex items-center space-x-4">
                  <div className="bg-green-500 rounded-full p-2">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-green-800 font-bold">You've already contributed your perspective on this treasure.</p>
                </div>
              )}

              <div className="space-y-8">
                {reviews.length === 0 ? (
                  <p className="text-gray-400 italic">No reviews yet for this product.</p>
                ) : (
                  reviews.map(review => (
                    <div key={review._id} className="bg-gray-50 p-8 rounded-3xl">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-accent-gold overflow-hidden">
                            {review.user.avatar ? (
                              <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                            ) : (
                              review.user.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <h6 className="font-bold text-gray-900 text-sm">{review.user.name}</h6>
                            <span className="text-xs text-gray-400">Verified Purchaser • {new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">{review.comment}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-3">
                          {review.images.map((img, i) => (
                            <img key={i} src={img.url} alt="Review" className="w-24 h-24 object-cover rounded-2xl border border-gray-100" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

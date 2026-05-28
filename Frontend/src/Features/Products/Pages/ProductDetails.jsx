import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../Cart/Hook/useCart";
import { useWishlist } from "../../Wishlist/Hook/useWishlist";
import Footer from "../../shared/Footer";
import Navbar from "../../shared/Navbar";


/* ── Icons ── */
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

/* ── Toast Notification ── */
const Toast = ({ show, message, type, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const isError = type === "error";

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
      <div className="flex items-center gap-3 bg-neutral-900 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-neutral-900/30 backdrop-blur-xl">
        <span className={`w-7 h-7 rounded-full ${isError ? 'bg-red-500' : 'bg-emerald-500'} flex items-center justify-center shrink-0`}>
          {isError ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <span className="text-sm font-medium tracking-wide">{message}</span>
        <button onClick={onClose} className="ml-2 text-white/60 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const { handleGetProductById, handleAddProductReview } = useProduct();
  const { handleAddToCart } = useCart();
  const { isLiked, handleToggleWishlist, handleGetWishlist } = useWishlist();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (user) {
      handleGetWishlist();
    }
  }, [user]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Review states
  const [newRating, setNewRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const reviewsContainerRef = useRef(null);

  const slideLeft = () => {
    if (reviewsContainerRef.current) {
      reviewsContainerRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (reviewsContainerRef.current) {
      reviewsContainerRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  const onToggleWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const result = await handleToggleWishlist({
        productId: product._id,
        variantId: selectedVariant?._id
      });
      if (result?.success) {
        setToastType("success");
        setToastMessage(result.message);
      } else {
        setToastType("error");
        setToastMessage(result?.message || "Failed to update wishlist");
      }
    } catch (err) {
      setToastType("error");
      setToastMessage("Something went wrong");
    }
    setToastShow(true);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await handleGetProductById(id);
      setProduct(data);
      if (data?.variants?.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <h1 className="font-serif text-3xl text-neutral-900 mb-6">Product Not Found</h1>
        <button onClick={() => navigate("/")} className="text-sm font-medium border border-neutral-900 text-neutral-900 px-8 py-3 rounded-md hover:bg-neutral-900 hover:text-white transition-colors">
          Return to Collection
        </button>
      </div>
    );
  }

  // Fallback logic: Use selected variant values, otherwise fallback to main product
  const images = (selectedVariant?.images && selectedVariant.images.length > 0) ? selectedVariant.images : (product.images || []);
  const hasMultiple = images.length > 1;
  const currency = selectedVariant?.price?.currency || product.price?.currency || "INR";
  const amount = selectedVariant?.price?.amount ?? product.price?.amount;

  const formattedPrice = amount != null ? new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount) : "—";
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;

  // Stock Calculation
  let stockNumber = undefined;
  let isOutOfStock = false;

  if (hasVariants) {
    if (selectedVariant) {
      stockNumber = selectedVariant.stock;
      isOutOfStock = stockNumber === 0;
    } else {
      stockNumber = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      isOutOfStock = stockNumber === 0;
    }
  } else {
    stockNumber = product.stock;
    isOutOfStock = stockNumber === 0; // If undefined, it's in stock
  }

  const prev = () => setImgIdx(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setImgIdx(i => (i === images.length - 1 ? 0 : i + 1));

  // Reset image index when variant changes to ensure we show the first image of the new variant
  const handleVariantSelect = (variant) => {
    setSelectedVariant(selectedVariant?._id === variant._id ? null : variant);
    setImgIdx(0);
  };

  const onAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      const result = await handleAddToCart({
        productId: product._id,
        variantId: selectedVariant?._id
      });
      if (result?.success) {
        setToastType("success");
        setToastMessage("Added to bag — View cart");
      } else {
        setToastType("error");
        setToastMessage(result?.message || "Could not add to bag");
      }
    } catch (err) {
      setToastType("error");
      setToastMessage("Something went wrong");
    }
    setToastShow(true);
    setAdding(false);
  };

  const onSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!newComment.trim()) {
      setToastType("error");
      setToastMessage("Please enter a comment");
      setToastShow(true);
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await handleAddProductReview(product._id, {
        rating: newRating,
        comment: newComment
      });
      if (res?.success) {
        setToastType("success");
        setToastMessage("Thank you! Review added successfully.");
        const updatedProduct = await handleGetProductById(id);
        setProduct(updatedProduct);
        setNewComment("");
        setNewRating(5);
        setShowReviewForm(false);
      } else {
        setToastType("error");
        setToastMessage(res?.message || "Could not submit review");
      }
    } catch (err) {
      setToastType("error");
      setToastMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setToastShow(true);
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-200">
      {/* Navbar Minimal */}
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 pt-16 pb-24 lg:pt-28 lg:pb-32">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[45%] xl:w-[40%] max-w-xl mx-auto lg:mx-0 flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-neutral-50 rounded-md overflow-hidden group">
              {images.length > 0 && images[imgIdx] ? (
                <img src={images[imgIdx].url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-4xl">
                  🖼
                </div>
              )}

              {/* Navigation Arrows */}
              {hasMultiple && (
                <>
                  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 text-neutral-900 rounded-full backdrop-blur-md shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                    <ChevronLeftIcon />
                  </button>
                  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 text-neutral-900 rounded-full backdrop-blur-md shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                    <ChevronRightIcon />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {hasMultiple && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative w-20 h-24 shrink-0 overflow-hidden rounded-md transition-all duration-200 ${i === imgIdx ? 'opacity-100 ring-2 ring-neutral-900 ring-offset-2' : 'opacity-40 hover:opacity-80'}`}
                  >
                    <img src={img.url} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-[55%] xl:w-[60%]">
            <div className="flex flex-col">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-6">
                Premium Collection
              </p>

              <h1 className="font-serif text-4xl sm:text-5xl text-neutral-900 leading-tight mb-4 tracking-[-0.02em]">
                {product.title}
              </h1>

              <div className="text-2xl font-medium text-neutral-900 mb-2">
                {formattedPrice}
              </div>

              {/* Stock Status */}
              <div className="mb-8">
                {!isOutOfStock ? (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60 tracking-wide">
                    {stockNumber > 0 ? `In Stock (${stockNumber})` : "In Stock"}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1.5 rounded-full border border-red-200/60 tracking-wide">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="h-px bg-neutral-200 mb-8" />

              {/* Variant Selector */}
              {variants.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-4">Select Option</h3>
                  <div className="flex flex-wrap gap-3">

                    {variants.map((variant) => {
                      // Generate a label from attributes, e.g., "Red / M"
                      const label = variant.attributes && Object.keys(variant.attributes).length > 0
                        ? Object.entries(variant.attributes).map(([k, v]) => `${v}`).join(' / ')
                        : `Variant`;

                      const isSelected = selectedVariant?._id === variant._id;

                      return (
                        <button
                          key={variant._id}
                          onClick={() => handleVariantSelect(variant)}
                          className={`px-5 py-2.5 text-sm font-medium rounded-md border transition-all ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white shadow-md' : 'border-neutral-200 text-neutral-700 hover:border-neutral-900 bg-white'}`}
                        >
                          <span className="capitalize">{isSelected ? `✓${label}` : label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-4">DETAILS</h3>
                <p className="text-neutral-500 leading-relaxed text-sm whitespace-pre-wrap">
                  {product.description || "No description provided."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  disabled={isOutOfStock || adding}
                  className="flex-1 flex items-center justify-center gap-3 bg-white border border-neutral-900 text-neutral-900 px-8 py-4 rounded-md font-semibold text-xs tracking-[0.15em] uppercase hover:bg-neutral-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={onAddToCart}
                >
                  {adding ? (
                    <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
                  ) : (
                    <CartIcon />
                  )}
                  {adding ? "Adding..." : "Add to Bag"}
                </button>
                <button
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-md font-semibold text-xs tracking-[0.15em] uppercase hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-900/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <BoltIcon /> Buy Now
                </button>
                <button
                  onClick={onToggleWishlist}
                  title={product && isLiked(product._id, selectedVariant?._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  className={`h-14 w-full sm:w-14 border rounded-md transition-all duration-300 active:scale-95 flex items-center justify-center shrink-0
                    ${product && isLiked(product._id, selectedVariant?._id) 
                      ? 'border-red-100 bg-red-50 text-red-500 hover:bg-red-100/70 shadow-sm shadow-red-100/30' 
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:bg-neutral-50'}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    fill={product && isLiked(product._id, selectedVariant?._id) ? "currentColor" : "none"} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={1.8}
                    className={product && isLiked(product._id, selectedVariant?._id) ? "scale-110" : ""}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-col gap-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-[0.2em] text-neutral-400 font-semibold">LISTED ON</span>
                  <span className="font-medium text-neutral-700">{new Date(product.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-[0.2em] text-neutral-400 font-semibold">SELLER ID</span>
                  <span className="font-mono text-[10px] text-neutral-400 tracking-wider truncate max-w-[150px]">{product.seller}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Reviews Section */}
        {(() => {
          const getMockReviews = () => {
            const title = product.title || "";
            return [
              {
                _id: "mock1",
                name: "Saurabh Rajput",
                rating: 5,
                comment: `Excellent design! The ${title} fits perfectly. The material feels extremely premium and holds up well. Worth every rupee!`,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                _id: "mock2",
                name: "Rohan Sharma",
                rating: 4,
                comment: `Very comfortable and matches the pictures exactly. Great craftsmanship on this ${title}. Just wish the shipping was slightly faster, but overall a solid 4 stars.`,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                _id: "mock3",
                name: "Anjali Gupta",
                rating: 5,
                comment: `Absolutely love this product! The quality of ${title} is outstanding, very soft fabric and sophisticated details. Highly recommend this brand!`,
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                _id: "mock4",
                name: "Vikram Malhotra",
                rating: 5,
                comment: `I am super impressed with the packaging and the delivery speed. The color of ${title} is gorgeous, and it feels very luxurious to wear.`,
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                _id: "mock5",
                name: "Neha Kapoor",
                rating: 4,
                comment: `Perfect fit! I was skeptical about ordering online but the size chart is very accurate for this ${title}. The design is superb.`,
                createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
              }
            ];
          };

          const reviews = (product.reviews && product.reviews.length > 0) ? product.reviews : getMockReviews();
          const totalReviews = reviews.length;
          const avgRating = totalReviews > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
            : "0.0";

          const starCounts = [0, 0, 0, 0, 0];
          reviews.forEach(r => {
            const ratingVal = Math.round(Number(r.rating));
            if (ratingVal >= 1 && ratingVal <= 5) {
              starCounts[ratingVal - 1]++;
            }
          });

          return (
            <div className="max-w-4xl mx-auto font-sans mt-24 pt-16 border-t border-neutral-100" id="reviews-section">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl text-neutral-900 tracking-tight">Customer Reviews</h2>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={slideLeft} 
                    className="p-2.5 rounded-full border border-neutral-200 hover:border-neutral-900 transition-colors bg-white text-neutral-600 hover:text-neutral-900 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    type="button"
                    onClick={slideRight} 
                    className="p-2.5 rounded-full border border-neutral-200 hover:border-neutral-900 transition-colors bg-white text-neutral-600 hover:text-neutral-900 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
                {/* Left: Overall score */}
                <div className="md:col-span-4 bg-neutral-50/50 border border-neutral-100 p-6 rounded-xl text-center flex flex-col items-center justify-center">
                  <span className="text-5xl font-serif text-neutral-900 mb-2">{avgRating}</span>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(Number(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-neutral-200 fill-neutral-200'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-400 font-medium tracking-wide uppercase">
                    Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </p>
                </div>

                {/* Middle: Rating bars */}
                <div className="md:col-span-5 flex flex-col gap-2.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = starCounts[star - 1];
                    const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3 text-sm">
                        <span className="w-3 text-neutral-600 font-medium text-right">{star}</span>
                        <svg className="w-3.5 h-3.5 text-neutral-400 fill-neutral-400 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-neutral-900 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-neutral-400 text-xs text-right font-mono">{pct.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Write review trigger */}
                <div className="md:col-span-3 flex justify-end md:justify-center md:h-full md:items-center">
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate("/login");
                      } else {
                        setShowReviewForm(!showReviewForm);
                      }
                    }}
                    className="text-xs font-semibold uppercase tracking-wider border border-neutral-900 text-neutral-900 px-6 py-3.5 rounded-md hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    {showReviewForm ? "Close Form" : "Write a Review"}
                  </button>
                </div>
              </div>

              {/* Write review form */}
              {showReviewForm && (
                <form onSubmit={onSubmitReview} className="mb-12 border border-neutral-200/80 p-6 rounded-xl bg-white shadow-sm transition-all duration-300">
                  <h3 className="font-serif text-lg text-neutral-900 mb-6">Share your feedback</h3>
                  
                  {/* Interactive Stars */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-2">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = hoveredRating ? star <= hoveredRating : star <= newRating;
                        return (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="focus:outline-none transition-transform active:scale-90"
                          >
                            <svg
                              className={`w-7 h-7 transition-colors duration-150 ${isFilled ? 'text-amber-400 fill-amber-400' : 'text-neutral-200 fill-neutral-200'}`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comment area */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-2">Review Comment</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="What did you like or dislike? How was the fit and quality?"
                      rows={4}
                      className="w-full border border-neutral-200 rounded-md p-3.5 text-sm focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-300"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center justify-center gap-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </form>
              )}

              {/* Review list */}
              <div 
                ref={reviewsContainerRef}
                className="flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {reviews.map((review) => {
                  const initials = review.name
                    ? review.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                    : "U";
                  
                  const colors = [
                    'bg-blue-50 text-blue-700 border-blue-100',
                    'bg-emerald-50 text-emerald-700 border-emerald-100',
                    'bg-amber-50 text-amber-700 border-amber-100',
                    'bg-purple-50 text-purple-700 border-purple-100',
                    'bg-rose-50 text-rose-700 border-rose-100',
                    'bg-indigo-50 text-indigo-700 border-indigo-100'
                  ];
                  const colorIdx = (review.name ? review.name.length : 0) % colors.length;
                  const avatarColorClass = colors[colorIdx];

                  return (
                    <div 
                      key={review._id} 
                      className="w-[280px] sm:w-[350px] shrink-0 snap-start flex flex-col justify-between p-6 rounded-xl border border-neutral-100 hover:border-neutral-200/80 hover:shadow-md transition-all duration-300 bg-white text-left min-h-[220px]"
                    >
                      <div>
                        {/* Header: Avatar, Name, Date */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 select-none ${avatarColorClass}`}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-neutral-900 capitalize truncate">{review.name}</div>
                            <div className="text-[10px] font-mono text-neutral-400">
                              {new Date(review.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          </div>
                        </div>

                        {/* Stars & Verified */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-200 fill-neutral-200'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            Verified
                          </span>
                        </div>

                        {/* Review Text */}
                        <p className="text-neutral-500 leading-relaxed text-xs line-clamp-4 hover:line-clamp-none transition-all duration-300">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Toast */}
      <Toast
        show={toastShow}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastShow(false)}
      />

      <Footer />
    </div>
  );
};

export default ProductDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";

/* ── Icons ── */
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13" />
    <circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
  </svg>
);
const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await handleGetProductById(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffd700", fontFamily: "Manrope, sans-serif", fontSize: "24px" }}>
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#e5e2e1", fontFamily: "Manrope, sans-serif" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>Product Not Found</h1>
        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "1px solid #ffd700", color: "#ffd700", padding: "10px 24px", borderRadius: "40px", cursor: "pointer", fontWeight: 600 }}>
          Back to Home
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const hasMultiple = images.length > 1;
  const currency = product.price?.currency || "INR";
  const amount = product.price?.amount;
  const formattedPrice = amount != null ? new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount) : "—";

  const prev = () => setImgIdx(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setImgIdx(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", fontFamily: "'Inter', sans-serif", color: "#e5e2e1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #2a2920; border-radius: 3px; }
      `}</style>

      {/* Navbar Minimal */}
      <nav style={{ padding: "20px 32px", borderBottom: "1px solid rgba(77,71,50,0.2)" }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "none", color: "#d0c6ab", cursor: "pointer", fontSize: "14px", fontWeight: 600, letterSpacing: "0.05em", transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#ffd700"}
          onMouseLeave={e => e.currentTarget.style.color = "#d0c6ab"}
        >
          <BackIcon /> Back
        </button>
      </nav>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 32px", display: "flex", flexWrap: "wrap", gap: "64px" }}>
        
        {/* Left: Image Gallery */}
        <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Main Image */}
          <div style={{ position: "relative", aspectRatio: "4/5", background: "#1a1a18", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(77,71,50,0.3)" }}>
            {images.length > 0 ? (
              <img src={images[imgIdx]?.url} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#4d4732" }}>
                No Image Available
              </div>
            )}

            {/* Navigation Arrows */}
            {hasMultiple && (
              <>
                <button onClick={prev} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(19,19,19,0.78)", border: "none", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", color: "#d0c6ab", cursor: "pointer", backdropFilter: "blur(4px)", transition: "background 0.2s, color 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,215,0,0.2)"; e.currentTarget.style.color = "#ffd700"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(19,19,19,0.78)"; e.currentTarget.style.color = "#d0c6ab"; }}>
                  <ChevronLeftIcon />
                </button>
                <button onClick={next} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(19,19,19,0.78)", border: "none", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", color: "#d0c6ab", cursor: "pointer", backdropFilter: "blur(4px)", transition: "background 0.2s, color 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,215,0,0.2)"; e.currentTarget.style.color = "#ffd700"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(19,19,19,0.78)"; e.currentTarget.style.color = "#d0c6ab"; }}>
                  <ChevronRightIcon />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {hasMultiple && (
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
              {images.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setImgIdx(i)}
                  style={{ width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden", border: `2px solid ${i === imgIdx ? "#ffd700" : "transparent"}`, cursor: "pointer", transition: "border-color 0.2s", opacity: i === imgIdx ? 1 : 0.6 }}
                >
                  <img src={img.url} alt={`Thumbnail ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#4d4732", marginBottom: "16px" }}>
            Premium Product
          </p>
          <h1 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.02em", color: "#e5e2e1", lineHeight: 1.1, marginBottom: "24px" }}>
            {product.title}
          </h1>
          
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#ffd700", fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em", marginBottom: "32px" }}>
            {formattedPrice}
          </div>

          <div style={{ height: "1px", background: "rgba(77,71,50,0.2)", marginBottom: "32px" }} />

          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#e5e2e1", marginBottom: "12px", fontFamily: "Manrope, sans-serif" }}>Description</h3>
            <p style={{ fontSize: "15px", color: "#d0c6ab", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {product.description || "No description provided."}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "16px", marginTop: "auto", flexWrap: "wrap" }}>
            <button style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "transparent", border: "1px solid rgba(255,215,0,0.5)", borderRadius: "40px", padding: "18px 24px", color: "#ffd700", fontWeight: 700, fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,215,0,0.1)"; e.currentTarget.style.borderColor = "#ffd700"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,215,0,0.5)"; }}>
              <CartIcon /> Add to Cart
            </button>
            <button style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "linear-gradient(90deg,#ffd700,#e9c400)", border: "none", borderRadius: "40px", padding: "18px 24px", color: "#3a3000", fontWeight: 800, fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,215,0,0.3)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
              <BoltIcon /> Buy Now
            </button>
          </div>

          {/* Additional Info */}
          <div style={{ marginTop: "32px", padding: "24px", background: "rgba(26,26,24,0.5)", border: "1px solid rgba(77,71,50,0.2)", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "#6b6658" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Listed On</span>
              <span style={{ color: "#d0c6ab", fontWeight: 600 }}>{new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div style={{ height: "1px", background: "rgba(77,71,50,0.1)" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Seller ID</span>
              <span style={{ color: "#d0c6ab", fontWeight: 600, fontFamily: "monospace" }}>{product.seller}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

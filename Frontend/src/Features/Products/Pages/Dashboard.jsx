import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                           */
/* ------------------------------------------------------------------ */
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  ProductCard — with mini image carousel                             */
/* ------------------------------------------------------------------ */
const ProductCard = ({ product }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const images = product.images || [];
  const hasMultiple = images.length > 1;

  const prev = (e) => {
    e.stopPropagation();
    setImgIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e) => {
    e.stopPropagation();
    setImgIdx((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const currency = product.price?.currency || "INR";
  const amount = product.price?.amount;
  const formatted =
    amount != null
      ? new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount)
      : "—";

  return (
    <div
      style={{
        background: "linear-gradient(160deg, #1a1a18 0%, #111110 100%)",
        border: "1px solid rgba(77,71,50,0.3)",
        borderRadius: "20px",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.15)";
        e.currentTarget.style.borderColor = "rgba(255,215,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(77,71,50,0.3)";
      }}
    >
      {/* Image Area */}
      <div style={{ position: "relative", aspectRatio: "4/3", background: "#0e0e0e", overflow: "hidden" }}>
        {images.length > 0 ? (
          <img
            src={images[imgIdx]?.url}
            alt={product.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.3s ease",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#4d4732" }}>
            <ImageIcon />
          </div>
        )}

        {/* Carousel controls */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              style={{
                position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
                background: "rgba(19,19,19,0.75)", border: "none", borderRadius: "50%",
                width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#d0c6ab", cursor: "pointer", backdropFilter: "blur(4px)",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,215,0,0.15)"; e.currentTarget.style.color = "#ffd700"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(19,19,19,0.75)"; e.currentTarget.style.color = "#d0c6ab"; }}
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={next}
              style={{
                position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                background: "rgba(19,19,19,0.75)", border: "none", borderRadius: "50%",
                width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#d0c6ab", cursor: "pointer", backdropFilter: "blur(4px)",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,215,0,0.15)"; e.currentTarget.style.color = "#ffd700"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(19,19,19,0.75)"; e.currentTarget.style.color = "#d0c6ab"; }}
            >
              <ChevronRightIcon />
            </button>

            {/* Dot indicators */}
            <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px" }}>
              {images.map((_, i) => (
                <span
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                  style={{
                    width: i === imgIdx ? "18px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: i === imgIdx ? "#ffd700" : "rgba(255,255,255,0.35)",
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Image count badge */}
        {images.length > 0 && (
          <span style={{
            position: "absolute", top: "10px", right: "10px",
            background: "rgba(19,19,19,0.8)", backdropFilter: "blur(4px)",
            color: "#d0c6ab", fontSize: "11px", fontWeight: 600,
            padding: "3px 8px", borderRadius: "20px", letterSpacing: "0.05em",
          }}>
            {imgIdx + 1}/{images.length}
          </span>
        )}
      </div>

      {/* Card Info */}
      <div style={{ padding: "18px 20px 20px" }}>
        <h3 style={{
          margin: 0, fontSize: "17px", fontWeight: 700,
          color: "#e5e2e1", fontFamily: "Manrope, sans-serif",
          letterSpacing: "-0.01em", whiteSpace: "nowrap",
          overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {product.title}
        </h3>

        {product.description && (
          <p style={{
            margin: "8px 0 0", fontSize: "13px", color: "#6b6658",
            lineHeight: 1.5, display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {product.description}
          </p>
        )}

        {/* Divider */}
        <div style={{ margin: "14px 0 12px", height: "1px", background: "rgba(77,71,50,0.2)" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#ffd700", fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}>
            {formatted}
          </span>
          <span style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#4d4732",
            border: "1px solid rgba(77,71,50,0.35)", borderRadius: "20px",
            padding: "3px 10px",
          }}>
            {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Empty State                                                         */
/* ------------------------------------------------------------------ */
const EmptyState = ({ onAdd }) => (
  <div style={{
    gridColumn: "1 / -1",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "80px 20px", textAlign: "center",
  }}>
    <div style={{
      width: "80px", height: "80px", borderRadius: "50%",
      background: "rgba(77,71,50,0.12)", border: "1px dashed rgba(77,71,50,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#4d4732", marginBottom: "24px",
    }}>
      <ImageIcon />
    </div>
    <h3 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 700, color: "#e5e2e1", fontFamily: "Manrope, sans-serif" }}>
      No products yet
    </h3>
    <p style={{ margin: "0 0 28px", color: "#4d4732", fontSize: "14px" }}>
      Start selling by listing your first product.
    </p>
    <button
      onClick={onAdd}
      style={{
        background: "linear-gradient(90deg,#ffd700,#e9c400)",
        border: "none", borderRadius: "40px",
        padding: "13px 32px", fontWeight: 700, fontSize: "13px",
        letterSpacing: "0.15em", textTransform: "uppercase",
        color: "#3a3000", cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(255,215,0,0.25)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      + List a Product
    </button>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                      */
/* ------------------------------------------------------------------ */
const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const totalValue = (sellerProducts || []).reduce((sum, p) => sum + (p.price?.amount || 0), 0);
  const totalImages = (sellerProducts || []).reduce((sum, p) => sum + (p.images?.length || 0), 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#131313",
      fontFamily: "'Inter', sans-serif",
      color: "#e5e2e1",
    }}>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #131313; }
        ::-webkit-scrollbar-thumb { background: #2a2920; border-radius: 3px; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <span style={{ color: "#4d4732" }}><GridIcon /></span>
              <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4d4732" }}>
                Seller Dashboard
              </span>
            </div>
            <h1 style={{
              margin: 0, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800,
              fontFamily: "Manrope, sans-serif", letterSpacing: "-0.03em",
              color: "#e5e2e1", lineHeight: 1.05,
            }}>
              Your Products
            </h1>
            <div style={{ marginTop: "12px", width: "40px", height: "2px", background: "linear-gradient(90deg,#ffd700,#e9c400)" }} />
          </div>

          <button
            id="create-product-btn"
            onClick={() => navigate("/seller/products/create")}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "linear-gradient(90deg,#ffd700,#e9c400)",
              border: "none", borderRadius: "40px",
              padding: "14px 28px", fontWeight: 700, fontSize: "13px",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#3a3000", cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(255,215,0,0.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <PlusIcon /> New Product
          </button>
        </div>

        {/* ── Stats Bar ── */}
        {sellerProducts?.length > 0 && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px", marginBottom: "48px",
          }}>
            {[
              { label: "Total Listings", value: sellerProducts.length },
              {
                label: "Portfolio Value",
                value: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(totalValue),
              },
              { label: "Total Photos", value: totalImages },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: "linear-gradient(160deg,#1a1a18,#111110)",
                border: "1px solid rgba(77,71,50,0.25)",
                borderRadius: "16px", padding: "20px 24px",
              }}>
                <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4d4732" }}>
                  {label}
                </p>
                <p style={{ margin: 0, fontSize: "26px", fontWeight: 800, fontFamily: "Manrope, sans-serif", color: "#ffd700", letterSpacing: "-0.02em" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Products Grid ── */}
        {sellerProducts === undefined || sellerProducts === null ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#4d4732", fontSize: "14px" }}>
            Loading products…
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}>
            {sellerProducts.length === 0 ? (
              <EmptyState onAdd={() => navigate("/seller/products/create")} />
            ) : (
              sellerProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
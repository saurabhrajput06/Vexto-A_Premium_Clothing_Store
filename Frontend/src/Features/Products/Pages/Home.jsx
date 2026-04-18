import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAuth } from "../../Auth/Hook/UseAuth";

/* ── Icons ── */
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13" />
    <circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

/* ── Product Card ── */
const ProductCard = ({ product, onClick }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const images = product.images || [];
  const hasMultiple = images.length > 1;

  const prev = (e) => { e.stopPropagation(); setImgIdx(i => (i === 0 ? images.length - 1 : i - 1)); };
  const next = (e) => { e.stopPropagation(); setImgIdx(i => (i === images.length - 1 ? 0 : i + 1)); };

  const currency = product.price?.currency || "INR";
  const amount = product.price?.amount;
  const formatted = amount != null
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount)
    : "—";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "linear-gradient(160deg,#1a1a18 0%,#111110 100%)",
        border: `1px solid ${hovered ? "rgba(255,215,0,0.28)" : "rgba(77,71,50,0.3)"}`,
        borderRadius: "20px",
        overflow: "hidden",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 24px 56px rgba(0,0,0,0.55),0 0 0 1px rgba(255,215,0,0.1)" : "none",
        transition: "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", background: "#0e0e0e", overflow: "hidden" }}>
        {images.length > 0 ? (
          <img
            src={images[imgIdx]?.url}
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", transform: hovered ? "scale(1.04)" : "scale(1)" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#4d4732", fontSize: "32px" }}>
            🖼
          </div>
        )}

        {/* Carousel controls */}
        {hasMultiple && (
          <>
            <button onClick={prev} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(19,19,19,0.78)", border: "none", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", color: "#d0c6ab", cursor: "pointer", backdropFilter: "blur(4px)" }}>
              <ChevronLeftIcon />
            </button>
            <button onClick={next} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(19,19,19,0.78)", border: "none", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", color: "#d0c6ab", cursor: "pointer", backdropFilter: "blur(4px)" }}>
              <ChevronRightIcon />
            </button>
            <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px" }}>
              {images.map((_, i) => (
                <span key={i} onClick={e => { e.stopPropagation(); setImgIdx(i); }} style={{ width: i === imgIdx ? "18px" : "6px", height: "6px", borderRadius: "3px", background: i === imgIdx ? "#ffd700" : "rgba(255,255,255,0.35)", transition: "all 0.25s ease", cursor: "pointer" }} />
              ))}
            </div>
          </>
        )}

        {/* Badge */}
        {images.length > 0 && (
          <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(19,19,19,0.82)", backdropFilter: "blur(4px)", color: "#d0c6ab", fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "20px", letterSpacing: "0.05em" }}>
            {imgIdx + 1}/{images.length}
          </span>
        )}

        {/* Hover overlay CTA */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "16px", opacity: hovered ? 1 : 0, transition: "opacity 0.28s ease" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(90deg,#ffd700,#e9c400)", border: "none", borderRadius: "40px", padding: "10px 22px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#3a3000", cursor: "pointer" }}>
            <CartIcon /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#e5e2e1", fontFamily: "Manrope, sans-serif", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {product.title}
        </h3>
        {product.description && (
          <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#6b6658", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
            {product.description}
          </p>
        )}
        <div style={{ margin: "14px 0 12px", height: "1px", background: "rgba(77,71,50,0.2)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#ffd700", fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}>
            {formatted}
          </span>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4d4732", border: "1px solid rgba(77,71,50,0.35)", borderRadius: "20px", padding: "3px 10px" }}>
            {product.images?.length || 0} photos
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Navbar ── */
const Navbar = ({ navigate, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { handleLogout } = useAuth();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(13,13,13,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(77,71,50,0.2)", padding: "0 32px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.03em", color: "#ffd700" }}>
          VEXTO
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", background: "rgba(77,71,50,0.15)", border: "1px solid rgba(77,71,50,0.3)", borderRadius: "40px", padding: "6px 16px", color: "#e5e2e1", fontWeight: 600, fontSize: "13px" }}>
                <span style={{ color: "#ffd700", display: "flex" }}><UserIcon /></span>
                <span style={{ letterSpacing: "0.02em", userSelect: "none" }}>{user.fullname || "User"}</span>
              </div>
              {dropdownOpen && (
                <div style={{ position: "absolute", top: "100%", right: 0, marginTop: "8px", background: "#1a1a18", border: "1px solid rgba(77,71,50,0.3)", borderRadius: "12px", padding: "8px", width: "160px", boxShadow: "0 10px 24px rgba(0,0,0,0.5)" }}>
                  <button onClick={onLogout} style={{ width: "100%", background: "transparent", border: "none", color: "#e5e2e1", padding: "10px", textAlign: "left", cursor: "pointer", borderRadius: "8px", fontSize: "13px", fontWeight: 600, transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(77,71,50,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => navigate("/login")} style={{ background: "transparent", border: "1px solid rgba(77,71,50,0.5)", borderRadius: "40px", padding: "9px 22px", color: "#d0c6ab", fontWeight: 600, fontSize: "13px", cursor: "pointer", letterSpacing: "0.05em", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,215,0,0.5)"; e.currentTarget.style.color = "#ffd700"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(77,71,50,0.5)"; e.currentTarget.style.color = "#d0c6ab"; }}>
                Login
              </button>
              <button onClick={() => navigate("/register")} style={{ background: "linear-gradient(90deg,#ffd700,#e9c400)", border: "none", borderRadius: "40px", padding: "9px 22px", color: "#3a3000", fontWeight: 700, fontSize: "13px", cursor: "pointer", letterSpacing: "0.05em", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(255,215,0,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

/* ── Hero ── */
const Hero = () => (
  <div style={{ position: "relative", padding: "96px 32px 80px", textAlign: "center", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,215,0,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
    <p style={{ margin: "0 0 16px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#4d4732" }}>
      ✦ Curated Collection
    </p>
    <h1 style={{ margin: "0 0 20px", fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "clamp(40px,7vw,80px)", letterSpacing: "-0.04em", color: "#e5e2e1", lineHeight: 1.02 }}>
      Discover <span style={{ background: "linear-gradient(90deg,#ffd700,#e9c400)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Premium</span>
      <br />Products
    </h1>
    <p style={{ margin: "0 auto", maxWidth: "480px", fontSize: "16px", color: "#6b6658", lineHeight: 1.7 }}>
      Shop the finest listings curated by top sellers — quality you can trust, style you'll love.
    </p>
    <div style={{ marginTop: "16px", width: "40px", height: "2px", background: "linear-gradient(90deg,#ffd700,#e9c400)", margin: "28px auto 0" }} />
  </div>
);

/* ── Home Page ── */
const Home = () => {
  const { handleGetAllProducts } = useProduct();
  const products = useSelector(state => state.product.products);
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => { handleGetAllProducts(); }, []);

  const filtered = (products || [])
    .filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "price-asc") return (a.price?.amount || 0) - (b.price?.amount || 0);
      if (sort === "price-desc") return (b.price?.amount || 0) - (a.price?.amount || 0);
      return 0;
    });

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", fontFamily: "'Inter', sans-serif", color: "#e5e2e1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #2a2920; border-radius: 3px; }
        input, select { outline: none; }
      `}</style>

      <Navbar navigate={navigate} user={user} />
      <Hero />

      {/* Search & Sort Bar */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px 40px", display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#4d4732" }}>
            <SearchIcon />
          </span>
          <input
            id="search-products"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", background: "rgba(26,26,24,0.9)", border: "1px solid rgba(77,71,50,0.35)", borderRadius: "40px", padding: "13px 20px 13px 44px", color: "#e5e2e1", fontSize: "14px", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = "rgba(255,215,0,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(77,71,50,0.35)"}
          />
        </div>
        <select
          id="sort-products"
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ background: "rgba(26,26,24,0.9)", border: "1px solid rgba(77,71,50,0.35)", borderRadius: "40px", padding: "13px 20px", color: "#d0c6ab", fontSize: "13px", cursor: "pointer", fontWeight: 600, letterSpacing: "0.05em" }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
        <span style={{ fontSize: "12px", color: "#4d4732", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </span>
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px 96px" }}>
        {products === null || products === undefined ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#4d4732", fontSize: "15px" }}>
            Loading products…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</p>
            <h3 style={{ fontFamily: "Manrope, sans-serif", fontSize: "22px", color: "#e5e2e1", marginBottom: "8px" }}>No products found</h3>
            <p style={{ color: "#4d4732", fontSize: "14px" }}>Try adjusting your search query.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "28px" }}>
            {filtered.map(product => (
              <ProductCard key={product._id} product={product} onClick={() => navigate(`/product/${product._id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(77,71,50,0.2)", padding: "32px", textAlign: "center", color: "#4d4732", fontSize: "13px", letterSpacing: "0.08em" }}>
        © 2026 VEXTO — Curated Marketplace
      </div>
    </div>
  );
};

export default Home;
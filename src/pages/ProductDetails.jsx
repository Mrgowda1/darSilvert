import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import {
    FaHome, FaChevronRight, FaShoppingCart,
    FaHeart, FaMinus, FaPlus, FaSearchPlus,
    FaTimes, FaStar, FaTruck, FaShieldAlt
} from "react-icons/fa";

// ── Quantity selector ──────────────────────────────────────────────────────
function QtySelector({ value, onChange }) {
    const [input, setInput] = useState(String(value));
    useEffect(() => setInput(String(value)), [value]);

    const handleBlur = () => {
        const n = parseInt(input, 10);
        if (!n || n < 1) { setInput("1"); onChange(1); }
        else onChange(n);
    };

    return (
        <div className="flex items-center border border-white/20 rounded-xl overflow-hidden">
            <button
                onClick={() => { const n = Math.max(1, value - 1); onChange(n); setInput(String(n)); }}
                disabled={value <= 1}
                className="px-4 py-3 bg-white/8 hover:bg-[#b11226]/60 disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
            >
                <FaMinus size={10} />
            </button>
            <input
                type="text"
                value={input}
                onChange={e => { const v = e.target.value; if (/^[0-9]*$/.test(v)) { setInput(v); const n = parseInt(v,10); if (n >= 1) onChange(n); } }}
                onBlur={handleBlur}
                className="w-14 text-center text-sm font-semibold bg-transparent text-white outline-none py-3"
            />
            <button
                onClick={() => { const n = value + 1; onChange(n); setInput(String(n)); }}
                className="px-4 py-3 bg-white/8 hover:bg-[#b11226]/60 transition text-white"
            >
                <FaPlus size={10} />
            </button>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════
export default function ProductDetails() {
    const { id }       = useParams();
    const navigate     = useNavigate();
    const { addToCart }                          = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, inWishlist } = useContext(WishlistContext);

    const [product, setProduct]     = useState(null);
    const [related, setRelated]     = useState([]);
    const [qty, setQty]             = useState(1);
    const [zoom, setZoom]           = useState(false);
    const [added, setAdded]         = useState(false);
    const [selectedImg, setSelectedImg] = useState(0);

    // Fetch product
    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(`http://localhost:5000/products/${id}`)
            .then(res => setProduct(res.data));
    }, [id]);

    // Fetch related
    useEffect(() => {
        if (!product) return;
        axios.get("http://localhost:5000/products")
            .then(res => {
                setRelated(
                    res.data
                        .filter(p => p.category === product.category && p.id !== product.id)
                        .slice(0, 4)
                );
            });
    }, [product]);

    if (!product) return (
        <div className="bg-[#060f1e] min-h-screen flex items-center justify-center">
            <div className="space-y-4 w-80">
                {[1,2,3].map(i => <div key={i} className={`rounded-2xl bg-white/5 border border-white/8 animate-pulse h-${i === 1 ? 64 : 8}`} />)}
            </div>
        </div>
    );

    // Build gallery — use main image + duplicates as placeholders until real gallery data
    const gallery = [product.image, product.image, product.image].filter(Boolean);

    const wishlisted = inWishlist(product.id);

    const handleAddToCart = () => {
        addToCart(product, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
    };

    const toggleWishlist = () => {
        wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
    };

    return (
        <div className="relative bg-[#060f1e] text-white min-h-screen">

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#b11226]/8 blur-[140px] rounded-full" />
                <div className="absolute bottom-40 right-1/4 w-[400px] h-[400px] bg-blue-600/8 blur-[140px] rounded-full" />
            </div>

            {/* ── Zoom overlay ── */}
            {zoom && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
                    onClick={() => setZoom(false)}
                >
                    <button className="absolute top-6 right-6 text-white/60 hover:text-white transition">
                        <FaTimes size={22} />
                    </button>
                    <img
                        src={gallery[selectedImg]}
                        alt={product.name}
                        className="max-w-3xl max-h-[85vh] object-contain rounded-2xl"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">

                {/* ── Breadcrumb ── */}
                <div className="inline-flex items-center gap-2 text-xs bg-white/8 border border-white/12 rounded-xl px-4 py-2 mb-8">
                    <FaHome className="cursor-pointer hover:text-[#b11226] transition" onClick={() => navigate("/")} />
                    <FaChevronRight className="text-white/25" size={9} />
                    <span className="cursor-pointer hover:text-[#b11226] transition" onClick={() => navigate("/products")}>Products</span>
                    {product.category && (
                        <>
                            <FaChevronRight className="text-white/25" size={9} />
                            <span
                                className="cursor-pointer hover:text-[#b11226] transition capitalize"
                                onClick={() => navigate(`/products?category=${product.category}`)}
                            >
                                {product.category}
                            </span>
                        </>
                    )}
                    <FaChevronRight className="text-white/25" size={9} />
                    <span className="text-white/60 line-clamp-1 max-w-[180px]">{product.name}</span>
                </div>

                {/* ── Main content ── */}
                <div className="flex flex-col lg:flex-row gap-10 mb-16">

                    {/* ── Image gallery ── */}
                    <div className="lg:w-[480px] shrink-0 space-y-3">

                        {/* Main image */}
                        <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                            <img
                                src={gallery[selectedImg]}
                                alt={product.name}
                                className="w-full h-[380px] object-cover"
                            />
                            {/* Zoom btn */}
                            <button
                                onClick={() => setZoom(true)}
                                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-[#060f1e]/80 border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#060f1e] transition opacity-0 group-hover:opacity-100"
                            >
                                <FaSearchPlus size={13} />
                            </button>
                            {/* Wishlist btn */}
                            <button
                                onClick={toggleWishlist}
                                className={`absolute top-4 left-4 w-9 h-9 rounded-xl border flex items-center justify-center transition
                                    ${wishlisted
                                    ? "bg-[#b11226]/30 border-[#b11226]/50 text-[#b11226]"
                                    : "bg-[#060f1e]/80 border-white/15 text-white/40 hover:text-[#b11226] hover:border-[#b11226]/40"}`}
                            >
                                <FaHeart size={13} />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        {gallery.length > 1 && (
                            <div className="flex gap-3">
                                {gallery.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImg(i)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0
                                            ${selectedImg === i ? "border-[#b11226]" : "border-white/10 hover:border-white/30"}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Product info ── */}
                    <div className="flex-1">

                        {/* Category tag */}
                        {product.category && (
                            <span className="inline-block text-[10px] uppercase tracking-[2px] text-[#b11226] font-bold mb-3">
                                {product.category}
                            </span>
                        )}

                        <h1 className="text-3xl font-black leading-tight mb-3" style={{ fontFamily: "'Georgia', serif" }}>
                            {product.name}
                        </h1>

                        {/* Stars (decorative) */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                    <FaStar key={i} size={13} className={i <= 4 ? "text-amber-400" : "text-white/15"} />
                                ))}
                            </div>
                            <span className="text-xs text-white/30">4.0 · 24 reviews</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-4xl font-black text-[#b11226]">₹ {product.price}</span>
                            <span className="text-sm text-white/30">per unit</span>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-sm text-white/50 leading-relaxed mb-6 border-l-2 border-[#b11226]/30 pl-4">
                                {product.description}
                            </p>
                        )}

                        {/* Divider */}
                        <div className="border-t border-white/8 mb-6" />

                        {/* Qty + actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <QtySelector value={qty} onChange={setQty} />
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm tracking-widest transition
                                    ${added
                                    ? "bg-green-500/20 border border-green-500/40 text-green-400"
                                    : "bg-[#b11226] hover:bg-red-700 text-white shadow-[0_4px_20px_rgba(177,18,38,0.4)]"}`}
                            >
                                <FaShoppingCart size={14} />
                                {added ? "Added to Cart!" : `Add to Cart · ₹${(product.price * qty).toFixed(2)}`}
                            </button>
                            <button
                                onClick={toggleWishlist}
                                className={`w-12 flex items-center justify-center rounded-xl border transition
                                    ${wishlisted
                                    ? "bg-[#b11226]/20 border-[#b11226]/40 text-[#b11226]"
                                    : "border-white/15 text-white/30 hover:text-[#b11226] hover:border-[#b11226]/40"}`}
                            >
                                <FaHeart size={15} />
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: FaTruck,     text: "Free delivery over ₹500" },
                                { icon: FaShieldAlt, text: "Quality guaranteed"       },
                            ].map(b => (
                                <div key={b.text} className="flex items-center gap-2.5 bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                                    <b.icon size={13} className="text-[#b11226] shrink-0" />
                                    <span className="text-xs text-white/50">{b.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Related products ── */}
                {related.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black" style={{ fontFamily: "'Georgia', serif" }}>
                                You May Also Like
                            </h2>
                            <Link
                                to={`/products?category=${product.category}`}
                                className="text-sm text-white/30 hover:text-white transition"
                            >
                                View all →
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {related.map(p => (
                                <Link
                                    key={p.id}
                                    to={`/product/${p.id}`}
                                    className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#b11226]/30 hover:shadow-[0_0_20px_rgba(177,18,38,0.15)] transition-all duration-300"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col">
                                        <h3 className="text-xs font-semibold line-clamp-2 mb-1 flex-1">{p.name}</h3>
                                        <p className="text-[#b11226] font-black text-sm mt-1">₹ {p.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
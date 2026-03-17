// Products.jsx — Version B: Modal Popup cart preview
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import {
    FaHome, FaChevronRight, FaChevronDown,
    FaShoppingCart, FaTimes, FaTrash, FaMinus, FaPlus
} from "react-icons/fa";

const CATEGORIES = [
    { slug: "meat",     label: "Meat & Poultry",       subs: [{ slug: "carved", label: "Carved Meat" }, { slug: "beef", label: "Beef" }, { slug: "wagyu", label: "Wagyu" }, { slug: "pork", label: "Pork" }] },
    { slug: "dairy",    label: "Dairy & Eggs",          subs: [{ slug: "butter", label: "Butter" }, { slug: "eggs", label: "Eggs" }, { slug: "cream", label: "Cream" }] },
    { slug: "cheese",   label: "Cheese & Charcuterie",  subs: [{ slug: "blue", label: "Blue Cheese" }, { slug: "aged", label: "Aged Cheese" }, { slug: "cured", label: "Cured Meats" }] },
    { slug: "oil",      label: "Oils & Vinegars",       subs: [] },
    { slug: "baking",   label: "Baking & Pastry",       subs: [] },
    { slug: "produce",  label: "Produce",               subs: [] },
    { slug: "frozen",   label: "Frozen",                subs: [] },
    { slug: "seafood",  label: "Seafood",               subs: [] },
    { slug: "pantry",   label: "Pantry",                subs: [] },
    { slug: "supplies", label: "Supplies",              subs: [] },
];

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map(c => [c.slug, c.label]));

function buildQuery({ cat, sub, min, max }) {
    const p = new URLSearchParams();
    if (cat !== "all") p.set("category", cat);
    if (sub !== "all") p.set("sub", sub);
    if (min > 0)       p.set("min", min);
    if (max < 1000)    p.set("max", max);
    return p.toString();
}

function sortList(list, sort) {
    if (sort === "low")  return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
}

// ── Quantity Selector ──────────────────────────────────────────────────────
function QtySelector({ value, onChange }) {
    const [input, setInput] = useState(String(value));

    useEffect(() => { setInput(String(value)); }, [value]);

    const handleBlur = () => {
        const n = parseInt(input, 10);
        if (!n || n < 1) { setInput("1"); onChange(1); }
        else { onChange(n); }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^[0-9]+$/.test(val)) {
            setInput(val);
            const n = parseInt(val, 10);
            if (n >= 1) onChange(n);
        }
    };

    return (
        <div className="flex items-center gap-0 border border-white/20 rounded-lg overflow-hidden">
            <button
                onClick={() => { const n = Math.max(1, value - 1); onChange(n); setInput(String(n)); }}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-[#b11226]/60 transition text-white text-sm"
            >
                <FaMinus size={9} />
            </button>
            <input
                type="text"
                value={input}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-10 text-center text-sm bg-transparent text-white outline-none py-1"
            />
            <button
                onClick={() => { const n = value + 1; onChange(n); setInput(String(n)); }}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-[#b11226]/60 transition text-white text-sm"
            >
                <FaPlus size={9} />
            </button>
        </div>
    );
}

// ── Cart Modal ─────────────────────────────────────────────────────────────
function CartModal({ open, onClose, lastAdded }) {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);
    const navigate = useNavigate();

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-[#0b1f3a] border border-[#b11226]/40 rounded-2xl shadow-[0_0_60px_rgba(177,18,38,0.3)] overflow-hidden">

                {/* Red top stripe */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#b11226]" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 mt-[3px]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#b11226]/20 border border-[#b11226]/40 flex items-center justify-center">
                            <FaShoppingCart className="text-[#b11226]" size={13} />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm tracking-widest uppercase">Cart Updated</h2>
                            <p className="text-xs text-white/40">{cart.reduce((s, i) => s + i.quantity, 0)} items in cart</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition p-1">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Last added highlight */}
                {lastAdded && (
                    <div className="mx-4 mt-4 flex gap-3 bg-[#b11226]/10 border border-[#b11226]/30 rounded-xl p-3">
                        <img src={lastAdded.image} alt={lastAdded.name} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#b11226] font-semibold tracking-widest uppercase mb-0.5">Just added</p>
                            <p className="text-sm font-semibold line-clamp-1">{lastAdded.name}</p>
                            <p className="text-sm text-white/60">
                                {lastAdded.quantity} × ₹{lastAdded.price}
                                <span className="text-white font-bold ml-2">= ₹{(lastAdded.quantity * lastAdded.price).toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                )}

                {/* All cart items */}
                <div className="px-4 pt-3 pb-2 max-h-60 overflow-y-auto space-y-2">
                    {cart.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-white/5 border border-white/10 rounded-xl p-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold line-clamp-1 mb-1">{item.name}</p>
                                <p className="text-[#b11226] font-bold text-xs">
                                    ₹ {(item.price * item.quantity).toFixed(2)}
                                    <span className="text-white/30 font-normal ml-1">@ ₹{item.price}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <QtySelector
                                    value={item.quantity}
                                    onChange={(q) => updateQuantity(idx, q)}
                                />
                                <button onClick={() => removeFromCart(idx)} className="text-white/30 hover:text-[#b11226] transition ml-1">
                                    <FaTrash size={11} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 mt-2">
                    <div className="flex justify-between text-sm mb-4">
                        <span className="text-white/50">Total</span>
                        <span className="font-bold text-lg">₹ {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { onClose(); navigate("/cart"); }}
                            className="flex-1 py-2.5 border border-white/20 hover:bg-white/10 text-white text-sm rounded-xl transition"
                        >
                            View Cart
                        </button>
                        <button
                            onClick={() => { onClose(); navigate("/checkout"); }}
                            className="flex-1 py-2.5 bg-[#b11226] hover:bg-red-700 text-white font-bold text-sm rounded-xl transition"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════
export default function Products() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useContext(CartContext);
    const { search }    = useContext(SearchContext);

    const [products, setProducts]     = useState([]);
    const [sort, setSort]             = useState("none");
    const [openMenu, setOpenMenu]     = useState("");
    const [quantities, setQuantities] = useState({});
    const [modalOpen, setModalOpen]   = useState(false);
    const [lastAdded, setLastAdded]   = useState(null);

    const getParams = () => {
        const p = new URLSearchParams(location.search);
        return {
            cat: p.get("category") || "all",
            sub: p.get("sub")      || "all",
            min: Number(p.get("min") || 0),
            max: Number(p.get("max") || 1000),
        };
    };
    const { cat, sub, min, max } = getParams();

    useEffect(() => { if (cat !== "all") setOpenMenu(cat); }, [cat]);

    useEffect(() => {
        axios.get("http://localhost:5000/products")
            .then(res => setProducts(res.data));
    }, []);

    const goTo = (newCat, newSub = "all") => {
        navigate(`/products?${buildQuery({ cat: newCat, sub: newSub, min, max })}`);
    };

    const getQty = (id) => quantities[id] || 1;
    const setQty = (id, q) => setQuantities(prev => ({ ...prev, [id]: q }));

    const handleAddToCart = (p) => {
        const qty = getQty(p.id);
        addToCart(p, qty);
        setLastAdded({ ...p, quantity: qty });
        setModalOpen(true);
    };

    const visible = sortList(
        products.filter(p =>
            (cat === "all" || p.category === cat) &&
            (sub === "all" || p.subcategory === sub) &&
            Number(p.price) >= min &&
            Number(p.price) <= max &&
            p.name.toLowerCase().includes(search.toLowerCase())
        ),
        sort
    );

    return (
        <div className="relative bg-[#0b1f3a] text-white min-h-screen">

            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-red-700/15 blur-[160px] rounded-full" />
                <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-blue-500/15 blur-[160px] rounded-full" />
            </div>

            <CartModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                lastAdded={lastAdded}
            />

            <div className="relative z-10 flex flex-col min-h-screen">

                {/* Breadcrumb */}
                <div className="px-8 pt-6 pb-2">
                    <div className="inline-flex items-center gap-2 text-sm backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-2 shadow-lg">
                        <FaHome className="cursor-pointer hover:text-[#b11226] transition" onClick={() => navigate("/")} />
                        <FaChevronRight className="text-white/40 text-xs" />
                        <span className="cursor-pointer hover:text-[#b11226] transition" onClick={() => navigate("/products")}>Products</span>
                        {cat !== "all" && (<><FaChevronRight className="text-white/40 text-xs" /><span className="font-semibold">{CATEGORY_LABELS[cat] || cat}</span></>)}
                        {sub !== "all" && (<><FaChevronRight className="text-white/40 text-xs" /><span className="text-white/70">{sub}</span></>)}
                    </div>
                </div>

                {/* Page header */}
                <div className="relative mx-8 mt-4 mb-6 h-20 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#10294d] to-[#0b1f3a] border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-baseline gap-4">
                        <h1 className="text-2xl font-extrabold tracking-[6px] text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">PRODUCTS</h1>
                        {cat !== "all" && <span className="text-sm text-white/50 tracking-widest uppercase">/ {CATEGORY_LABELS[cat]}</span>}
                    </div>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                        <button onClick={() => setModalOpen(true)} className="text-white/70 hover:text-white transition mr-2">
                            <FaShoppingCart size={18} />
                        </button>
                        <span className="text-xs text-white/50 tracking-widest uppercase">Sort</span>
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            className="bg-white/10 backdrop-blur border border-white/20 text-white text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:bg-white/15 transition"
                        >
                            <option value="none"  className="bg-[#0b1f3a]">Default</option>
                            <option value="low"   className="bg-[#0b1f3a]">Price: Low → High</option>
                            <option value="high"  className="bg-[#0b1f3a]">Price: High → Low</option>
                            <option value="name"  className="bg-[#0b1f3a]">Name: A → Z</option>
                        </select>
                    </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 gap-6 px-8 pb-10">

                    {/* Sidebar */}
                    <aside className="w-56 shrink-0 self-start sticky top-24">
                        <div className="backdrop-blur-lg bg-white/8 border border-white/15 rounded-2xl shadow-xl overflow-hidden">
                            <button
                                onClick={() => goTo("all")}
                                className={`w-full text-left px-5 py-3 text-sm font-semibold tracking-widest uppercase transition
                                    ${cat === "all" ? "bg-[#b11226]/30 text-white border-l-2 border-[#b11226]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                            >
                                All Products
                            </button>
                            <div className="border-t border-white/10" />
                            {CATEGORIES.map((c, i) => (
                                <div key={c.slug}>
                                    <button
                                        onClick={() => { goTo(c.slug); setOpenMenu(openMenu === c.slug ? "" : c.slug); }}
                                        className={`w-full flex items-center justify-between px-5 py-3 text-sm transition
                                            ${cat === c.slug ? "bg-[#b11226]/20 text-white border-l-2 border-[#b11226] font-semibold" : "text-white/70 hover:text-white hover:bg-white/5"}`}
                                    >
                                        <span>{c.label}</span>
                                        {c.subs.length > 0 && <FaChevronDown className={`text-xs transition-transform duration-300 ${openMenu === c.slug ? "rotate-180" : ""}`} />}
                                    </button>
                                    {c.subs.length > 0 && openMenu === c.slug && (
                                        <div className="bg-black/20">
                                            {c.subs.map(s => (
                                                <button
                                                    key={s.slug}
                                                    onClick={() => goTo(c.slug, s.slug)}
                                                    className={`w-full text-left pl-9 pr-5 py-2 text-xs transition
                                                        ${sub === s.slug ? "text-[#b11226] font-semibold" : "text-white/50 hover:text-white"}`}
                                                >
                                                    — {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {i < CATEGORIES.length - 1 && <div className="border-t border-white/5 mx-4" />}
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Grid */}
                    <main className="flex-1">
                        <p className="text-xs text-white/40 tracking-widest uppercase mb-5">
                            {visible.length} {visible.length === 1 ? "product" : "products"} found
                        </p>

                        {visible.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-60 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl">
                                <p className="text-white/40 text-lg tracking-widest">No products found</p>
                                <button onClick={() => goTo("all")} className="mt-4 text-sm text-[#b11226] hover:underline">Clear filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {visible.map(p => (
                                    <div key={p.id} className="group relative flex flex-col backdrop-blur-md bg-white/8 border border-white/15 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_24px_rgba(177,18,38,0.35)] hover:border-[#b11226]/40 transition-all duration-300">
                                        <Link to={`/product/${p.id}`} className="block overflow-hidden">
                                            <img src={p.image} alt={p.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#b11226]/20 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
                                        </Link>
                                        <div className="flex flex-col flex-1 p-4">
                                            <Link to={`/product/${p.id}`}>
                                                <h2 className="text-sm font-semibold leading-snug mb-1 hover:text-red-300 transition line-clamp-2">{p.name}</h2>
                                            </Link>
                                            {p.category && (
                                                <span className="text-[10px] uppercase tracking-widest text-white/40 mb-2">{CATEGORY_LABELS[p.category] || p.category}</span>
                                            )}
                                            <p className="text-[#b11226] font-bold text-base mt-auto mb-3">₹ {p.price}</p>

                                            {/* Quantity selector */}
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs text-white/40">Qty</span>
                                                <QtySelector
                                                    value={getQty(p.id)}
                                                    onChange={(q) => setQty(p.id, q)}
                                                />
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(p)}
                                                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#b11226]/20 border border-[#b11226]/40 text-white text-xs font-semibold tracking-wide hover:bg-[#b11226] hover:border-[#b11226] transition-all duration-200"
                                            >
                                                <FaShoppingCart size={12} />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
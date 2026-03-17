import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaStar, FaShieldAlt, FaTruck, FaAward, FaLeaf } from "react-icons/fa";

// ── Data ───────────────────────────────────────────────────────────────────
const BANNERS = [
    {
        img:     "https://my.juliussilvert.com/media/wysiwyg/Spring_Arrivals_Artichoke_banner_Magento_Curved.png",
        tag:     "New Arrivals",
        title:   "Spring\nCollection",
        sub:     "Fresh seasonal produce & specialty ingredients",
        cta:     "Shop Now",
        link:    "/products?category=produce",
    },
    {
        img:     "https://my.juliussilvert.com/media/.renditions/wysiwyg/Compart_Pork_Banner_Magento_Curved.png",
        tag:     "Premium Selection",
        title:   "Heritage\nMeats",
        sub:     "Artisan cuts from the finest farms",
        cta:     "Explore Meats",
        link:    "/products?category=meat",
    },
];

const CATEGORIES = [
    { name: "Meat & Poultry",       slug: "meat",     img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80",  emoji: "🥩" },
    { name: "Dairy & Eggs",         slug: "dairy",    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",  emoji: "🥛" },
    { name: "Cheese & Charcuterie", slug: "cheese",   img: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&q=80",  emoji: "🧀" },
    { name: "Oils & Vinegars",      slug: "oil",      img: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&q=80",  emoji: "🫙" },
    { name: "Baking & Pastry",      slug: "baking",   img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",  emoji: "🥐" },
    { name: "Produce",              slug: "produce",  img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",  emoji: "🥦" },
    { name: "Seafood",              slug: "seafood",  img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",  emoji: "🦞" },
    { name: "Pantry",               slug: "pantry",   img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&q=80",  emoji: "🥫" },
    { name: "Frozen",               slug: "frozen",   img: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80",  emoji: "❄️" },
    { name: "Supplies",             slug: "supplies", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80",  emoji: "📦" },
];

const TRUST_ITEMS = [
    { icon: FaTruck,    title: "Free Shipping",    sub: "On orders over ₹500"         },
    { icon: FaShieldAlt,title: "Quality Assured",  sub: "100% premium sourced"         },
    { icon: FaAward,    title: "Since 1915",        sub: "Over a century of excellence" },
    { icon: FaLeaf,     title: "Fresh Daily",       sub: "Farm to table guaranteed"     },
];

const TESTIMONIALS = [
    { name: "Chef Marco R.",    role: "Executive Chef, The Grand Hotel",    stars: 5, text: "Julius Silvert has been our go-to supplier for over a decade. The quality of their meats and specialty cheeses is simply unmatched in the industry." },
    { name: "Sarah K.",         role: "Owner, La Petite Bakery",            stars: 5, text: "Their baking supplies and dairy products are consistently exceptional. Fast delivery and impeccable freshness every single time." },
    { name: "David M.",         role: "Head Buyer, Gourmet Bistro Group",   stars: 5, text: "From artisan cheeses to heritage pork, their catalogue covers everything we need. The team is knowledgeable and always reliable." },
];

// ── Hero Slider ────────────────────────────────────────────────────────────
function HeroSlider() {
    const [idx, setIdx]     = useState(0);
    const [prev, setPrev]   = useState(null);
    const [dir, setDir]     = useState(1);
    const timer             = useRef();

    const go = (next, d = 1) => {
        setDir(d);
        setPrev(idx);
        setIdx(next);
        clearInterval(timer.current);
        startTimer();
    };

    const startTimer = () => {
        timer.current = setInterval(() => {
            setIdx(i => { setPrev(i); setDir(1); return (i + 1) % BANNERS.length; });
        }, 5000);
    };

    useEffect(() => { startTimer(); return () => clearInterval(timer.current); }, []);

    const b = BANNERS[idx];

    return (
        <section className="relative h-[80vh] overflow-hidden bg-[#060f1e]">

            {/* Background image */}
            <div className="absolute inset-0">
                <img src={b.img} alt="" className="w-full h-full object-cover opacity-50 scale-105 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060f1e] via-[#060f1e]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060f1e] via-transparent to-transparent" />
            </div>

            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-[#b11226]/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-10 right-20 w-80 h-80 bg-blue-600/15 blur-[120px] rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center px-12 md:px-20">
                <div className="max-w-xl">

                    {/* Tag */}
                    <div className="inline-flex items-center gap-2 bg-[#b11226]/20 border border-[#b11226]/40 rounded-full px-4 py-1.5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b11226] animate-pulse" />
                        <span className="text-xs font-semibold tracking-[2px] uppercase text-[#b11226]">{b.tag}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-6xl md:text-7xl font-black tracking-[-1px] leading-none text-white mb-4"
                        style={{ fontFamily: "'Georgia', serif", whiteSpace: "pre-line" }}>
                        {b.title}
                    </h1>

                    <p className="text-lg text-white/60 mb-8 leading-relaxed">{b.sub}</p>

                    <div className="flex items-center gap-4">
                        <Link to={b.link}>
                            <button className="px-8 py-3.5 bg-[#b11226] hover:bg-red-700 text-white font-bold text-sm tracking-widest rounded-xl transition shadow-[0_4px_20px_rgba(177,18,38,0.5)] hover:shadow-[0_4px_30px_rgba(177,18,38,0.7)]">
                                {b.cta}
                            </button>
                        </Link>
                        <Link to="/products" className="text-sm text-white/50 hover:text-white transition font-medium">
                            Browse all →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-8 left-20 flex items-center gap-2 z-20">
                {BANNERS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => go(i, i > idx ? 1 : -1)}
                        className={`rounded-full transition-all duration-300 ${i === idx ? "w-8 h-2 bg-[#b11226]" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
                    />
                ))}
            </div>

            {/* Arrows */}
            <button
                onClick={() => go(idx === 0 ? BANNERS.length - 1 : idx - 1, -1)}
                className="absolute right-20 top-1/2 -translate-y-1/2 -translate-x-14 z-20 w-11 h-11 rounded-full bg-white/10 border border-white/15 hover:bg-[#b11226]/80 hover:border-[#b11226] flex items-center justify-center text-white transition"
            >
                <FaChevronLeft size={13} />
            </button>
            <button
                onClick={() => go((idx + 1) % BANNERS.length, 1)}
                className="absolute right-20 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 border border-white/15 hover:bg-[#b11226]/80 hover:border-[#b11226] flex items-center justify-center text-white transition"
            >
                <FaChevronRight size={13} />
            </button>
        </section>
    );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({ children, className = "" }) {
    return (
        <section className={`relative py-20 ${className}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                {children}
            </div>
        </section>
    );
}

function SectionTitle({ tag, title, sub }) {
    return (
        <div className="text-center mb-12">
            {tag && (
                <span className="inline-block text-[10px] uppercase tracking-[3px] text-[#b11226] font-bold mb-3">
                    {tag}
                </span>
            )}
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                {title}
            </h2>
            {sub && <p className="text-white/40 mt-3 text-sm max-w-md mx-auto">{sub}</p>}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════
export default function GuestHome() {
    const [products, setProducts] = useState([]);
    const navigate                = useNavigate();
    const catRef                  = useRef();

    useEffect(() => {
        axios.get("http://localhost:5000/products")
            .then(res => setProducts(res.data))
            .catch(() => {});
    }, []);

    const scrollCat = (dir) => {
        if (catRef.current) catRef.current.scrollBy({ left: dir * 260, behavior: "smooth" });
    };

    return (
        <div className="bg-[#060f1e] text-white">

            {/* ── Hero ── */}
            <HeroSlider />

            {/* ── Trust bar ── */}
            <div className="bg-[#0b1f3a] border-y border-white/8">
                <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TRUST_ITEMS.map(t => (
                        <div key={t.title} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#b11226]/15 border border-[#b11226]/25 flex items-center justify-center shrink-0">
                                <t.icon size={14} className="text-[#b11226]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">{t.title}</p>
                                <p className="text-xs text-white/40">{t.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Categories ── */}
            <Section>
                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#b11226]/8 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <SectionTitle tag="Browse" title="Shop by Category" sub="From premium proteins to artisan pantry staples" />

                    <div className="relative">
                        <button
                            onClick={() => scrollCat(-1)}
                            className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#0b1f3a] border border-white/15 hover:bg-[#b11226]/80 hover:border-[#b11226] flex items-center justify-center text-white transition shadow-xl"
                        >
                            <FaChevronLeft size={12} />
                        </button>
                        <button
                            onClick={() => scrollCat(1)}
                            className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#0b1f3a] border border-white/15 hover:bg-[#b11226]/80 hover:border-[#b11226] flex items-center justify-center text-white transition shadow-xl"
                        >
                            <FaChevronRight size={12} />
                        </button>

                        <div
                            ref={catRef}
                            className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
                        >
                            {CATEGORIES.map(c => (
                                <div
                                    key={c.slug}
                                    onClick={() => navigate(`/products?category=${c.slug}`)}
                                    className="group shrink-0 w-48 cursor-pointer"
                                >
                                    <div className="relative h-36 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#b11226]/50 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(177,18,38,0.25)]">
                                        <img
                                            src={c.img}
                                            alt={c.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#060f1e]/90 via-[#060f1e]/30 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <p className="text-xs font-bold text-white leading-tight">{c.name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* ── Promo banner ── */}
            <section className="mx-6 md:mx-10 rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#b11226] via-[#8b0d1c] to-[#6b0916] my-4">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]" />
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-black/30 to-transparent" />
                <div className="relative z-10 px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] uppercase tracking-[3px] text-white/60 font-bold mb-2">Limited Time</p>
                        <h3 className="text-3xl font-black text-white" style={{ fontFamily: "'Georgia', serif" }}>
                            Free Shipping on<br />Your First Order
                        </h3>
                        <p className="text-white/70 text-sm mt-2">Use code <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded">WELCOME</span> at checkout</p>
                    </div>
                    <Link to="/products">
                        <button className="px-8 py-3.5 bg-white text-[#b11226] font-black text-sm tracking-widest rounded-xl hover:bg-white/90 transition shadow-xl shrink-0">
                            Shop Now
                        </button>
                    </Link>
                </div>
            </section>

            {/* ── Featured products ── */}
            <Section>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/8 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-[10px] uppercase tracking-[3px] text-[#b11226] font-bold block mb-3">Handpicked</span>
                            <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "'Georgia', serif" }}>
                                Featured Products
                            </h2>
                        </div>
                        <Link to="/products" className="text-sm text-white/40 hover:text-white transition hidden md:block">
                            View all →
                        </Link>
                    </div>

                    {products.length === 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-72 rounded-2xl bg-white/5 border border-white/8 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {products.slice(0, 4).map(p => (
                                <Link
                                    key={p.id}
                                    to={`/product/${p.id}`}
                                    className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#b11226]/40 hover:shadow-[0_0_24px_rgba(177,18,38,0.2)] transition-all duration-300"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#060f1e]/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">{p.category}</p>
                                        <h3 className="text-sm font-semibold text-white line-clamp-2 flex-1 mb-3">{p.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#b11226] font-black text-base">₹ {p.price}</span>
                                            <span className="text-xs text-white/30 group-hover:text-white transition">View →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-8 md:hidden">
                        <Link to="/products">
                            <button className="px-8 py-3 border border-white/15 text-white text-sm rounded-xl hover:bg-white/8 transition">
                                View all products →
                            </button>
                        </Link>
                    </div>
                </div>
            </Section>

            {/* ── Testimonials ── */}
            <Section className="bg-[#0b1f3a]/50">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

                <SectionTitle
                    tag="Trusted by Chefs"
                    title="What Our Clients Say"
                    sub="Over a century of serving the finest restaurants and food businesses"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#b11226]/30 hover:bg-white/7 transition-all duration-300"
                        >
                            {/* Quote mark */}
                            <div className="absolute top-4 right-5 text-5xl text-white/5 font-black leading-none select-none">"</div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array(t.stars).fill(0).map((_, j) => (
                                    <FaStar key={j} size={12} className="text-amber-400" />
                                ))}
                            </div>

                            <p className="text-sm text-white/60 leading-relaxed mb-5 italic">
                                "{t.text}"
                            </p>

                            <div className="flex items-center gap-3 border-t border-white/8 pt-4">
                                <div className="w-9 h-9 rounded-full bg-[#b11226]/20 border border-[#b11226]/30 flex items-center justify-center text-xs font-bold text-[#b11226]">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{t.name}</p>
                                    <p className="text-xs text-white/30">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── CTA ── */}
            <Section>
                <div className="text-center">
                    <span className="text-[10px] uppercase tracking-[3px] text-[#b11226] font-bold block mb-4">Get Started</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Georgia', serif" }}>
                        Ready to Order?
                    </h2>
                    <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
                        Join thousands of chefs and food businesses who trust Julius Silvert.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to="/products">
                            <button className="px-8 py-3.5 bg-[#b11226] hover:bg-red-700 text-white font-bold text-sm tracking-widest rounded-xl transition shadow-[0_4px_20px_rgba(177,18,38,0.4)]">
                                Browse Products
                            </button>
                        </Link>
                        <Link to="/contact">
                            <button className="px-8 py-3.5 border border-white/15 hover:bg-white/8 text-white text-sm font-medium rounded-xl transition">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </Section>
        </div>
    );
}
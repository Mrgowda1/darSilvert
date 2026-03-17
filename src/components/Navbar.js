import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { SearchContext } from "../context/SearchContext";
import {
    FaShoppingCart, FaUser, FaSearch, FaHeart,
    FaChevronDown, FaTimes, FaBars, FaSignOutAlt,
    FaBoxOpen, FaUserCircle
} from "react-icons/fa";

const PRODUCT_COLS = [
    { heading: "Proteins",   items: [{ label: "Meat & Poultry", slug: "meat" }, { label: "Seafood", slug: "seafood" }, { label: "Frozen", slug: "frozen" }] },
    { heading: "Dairy",      items: [{ label: "Dairy & Eggs", slug: "dairy" }, { label: "Cheese & Charcuterie", slug: "cheese" }] },
    { heading: "Pantry",     items: [{ label: "Oils & Vinegars", slug: "oil" }, { label: "Baking & Pastry", slug: "baking" }, { label: "Pantry", slug: "pantry" }] },
    { heading: "Fresh",      items: [{ label: "Produce", slug: "produce" }, { label: "Supplies", slug: "supplies" }] },
];

export default function Navbar() {
    const { cart }             = useContext(CartContext);
    const { search, setSearch } = useContext(SearchContext);
    const navigate              = useNavigate();
    const token                 = localStorage.getItem("token");

    const [prodOpen, setProdOpen]     = useState(false);
    const [profileOpen, setProfile]   = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileOpen, setMobile]     = useState(false);
    const searchRef                   = useRef();

    const totalItems = cart.reduce((s, i) => s + (i.quantity || 1), 0);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest("[data-dropdown]")) {
                setProdOpen(false);
                setProfile(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    return (
        <>
            {/* ── Promo banner ── */}
            <div className="bg-[#b11226] text-white text-center text-xs py-2 tracking-widest font-semibold uppercase">
                Free shipping on orders over ₹500 &nbsp;·&nbsp; Premium Wholesale & Specialty Foods since 1915
            </div>

            {/* ── Main navbar ── */}
            <nav className="sticky top-0 z-50 bg-[#071528]/95 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">

                    {/* Logo */}
                    <Link to="/" className="shrink-0">
                        <img
                            src="https://my.juliussilvert.com/media/logo/websites/1/Resized_Silvert-White_with_1915_.png"
                            className="h-8 object-contain"
                            alt="Julius Silvert"
                        />
                    </Link>

                    {/* ── Desktop nav links ── */}
                    <div className="hidden md:flex items-center gap-1 ml-2">

                        {/* Products dropdown */}
                        <div className="relative" data-dropdown>
                            <button
                                onClick={() => { setProdOpen(p => !p); setProfile(false); }}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition
                                    ${prodOpen ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/8"}`}
                            >
                                Products
                                <FaChevronDown size={10} className={`transition-transform duration-200 ${prodOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Mega dropdown */}
                            {prodOpen && (
                                <div className="absolute left-0 top-full mt-2 w-[520px] bg-[#0b1f3a]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-6 z-50">
                                    {/* Red top accent */}
                                    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#b11226] to-transparent rounded-full" />

                                    <div className="grid grid-cols-4 gap-6">
                                        {PRODUCT_COLS.map(col => (
                                            <div key={col.heading}>
                                                <p className="text-[10px] uppercase tracking-[2px] text-[#b11226] font-bold mb-3">
                                                    {col.heading}
                                                </p>
                                                <div className="space-y-1">
                                                    {col.items.map(item => (
                                                        <Link
                                                            key={item.slug}
                                                            to={`/products?category=${item.slug}`}
                                                            onClick={() => setProdOpen(false)}
                                                            className="block text-sm text-white/60 hover:text-white hover:translate-x-1 transition-all duration-150 py-0.5"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between">
                                        <p className="text-xs text-white/30">Browse our full catalogue</p>
                                        <Link
                                            to="/products"
                                            onClick={() => setProdOpen(false)}
                                            className="text-xs font-semibold text-[#b11226] hover:text-red-400 transition flex items-center gap-1"
                                        >
                                            View all products →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/contact" className="px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/8 transition font-medium">
                            Contact
                        </Link>
                    </div>

                    {/* ── Search bar ── */}
                    <div className={`hidden md:flex items-center gap-2 flex-1 max-w-xs bg-white/8 border rounded-xl px-4 py-2 transition-all duration-200
                        ${searchOpen ? "border-[#b11226]/50 bg-white/12 shadow-[0_0_0_3px_rgba(177,18,38,0.15)]" : "border-white/10 hover:border-white/20"}`}
                    >
                        <FaSearch size={13} className="text-white/30 shrink-0" />
                        <input
                            ref={searchRef}
                            placeholder="Search products..."
                            className="bg-transparent text-sm text-white placeholder:text-white/25 outline-none w-full"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={() => setSearchOpen(true)}
                            onBlur={() => setSearchOpen(false)}
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="text-white/30 hover:text-white transition">
                                <FaTimes size={11} />
                            </button>
                        )}
                    </div>

                    {/* ── Right icons ── */}
                    <div className="flex items-center gap-1 ml-auto">

                        {/* Wishlist */}
                        <button
                            onClick={() => token ? navigate("/wishlist") : navigate("/auth?type=wishlist")}
                            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition"
                            title="Wishlist"
                        >
                            <FaHeart size={16} />
                        </button>

                        {/* Cart */}
                        <Link
                            to={token ? "/cart" : "/auth?type=cart"}
                            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition"
                            title="Cart"
                        >
                            <FaShoppingCart size={16} />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#b11226] rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                                    {totalItems > 9 ? "9+" : totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Profile dropdown */}
                        <div className="relative" data-dropdown>
                            <button
                                onClick={() => { setProfile(p => !p); setProdOpen(false); }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ml-1
                                    ${profileOpen ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/8"}`}
                            >
                                <FaUserCircle size={17} />
                                <span className="hidden md:inline">
                                    {token ? "Account" : "Login"}
                                </span>
                                <FaChevronDown size={9} className={`hidden md:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-[#0b1f3a] backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-50">
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b11226] to-transparent" />

                                    {/* Header */}
                                    <div className="px-5 py-4 border-b border-white/8">
                                        <p className="font-bold text-sm">Welcome back</p>
                                        <p className="text-xs text-white/40 mt-0.5">
                                            {token ? "Manage your account" : "Sign in to access your account"}
                                        </p>
                                    </div>

                                    {/* Auth buttons */}
                                    {!token && (
                                        <div className="px-4 py-3 space-y-2">
                                            <button
                                                onClick={() => { navigate("/login"); setProfile(false); }}
                                                className="w-full py-2 bg-[#b11226] hover:bg-red-700 text-white text-sm font-bold rounded-xl transition"
                                            >
                                                Sign In
                                            </button>
                                            <button
                                                onClick={() => { navigate("/register"); setProfile(false); }}
                                                className="w-full py-2 bg-white/8 hover:bg-white/15 text-white text-sm rounded-xl transition border border-white/10"
                                            >
                                                Create Account
                                            </button>
                                        </div>
                                    )}

                                    {/* Menu items */}
                                    <div className="px-2 py-2">
                                        {[
                                            { icon: FaBoxOpen,    label: "My Orders",  path: token ? "/orders"  : "/auth?type=orders"  },
                                            { icon: FaHeart,      label: "Wishlist",   path: token ? "/wishlist": "/auth?type=wishlist" },
                                            { icon: FaUser,       label: "Profile",    path: token ? "/profile" : "/login"              },
                                        ].map(item => (
                                            <button
                                                key={item.label}
                                                onClick={() => { navigate(item.path); setProfile(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/8 transition"
                                            >
                                                <item.icon size={13} className="text-white/40" />
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Logout */}
                                    {token && (
                                        <div className="px-2 pb-2 border-t border-white/8 pt-2">
                                            <button
                                                onClick={logout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition"
                                            >
                                                <FaSignOutAlt size={13} />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobile(m => !m)}
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition ml-1"
                        >
                            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile menu ── */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-white/8 bg-[#071528] px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 mb-3">
                            <FaSearch size={13} className="text-white/30" />
                            <input
                                placeholder="Search products..."
                                className="bg-transparent text-sm text-white placeholder:text-white/25 outline-none w-full"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        {PRODUCT_COLS.flatMap(col => col.items).map(item => (
                            <Link
                                key={item.slug}
                                to={`/products?category=${item.slug}`}
                                onClick={() => setMobile(false)}
                                className="block px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="border-t border-white/8 pt-2 mt-2">
                            {!token ? (
                                <>
                                    <button onClick={() => { navigate("/login"); setMobile(false); }} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition">Sign In</button>
                                    <button onClick={() => { navigate("/register"); setMobile(false); }} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition">Register</button>
                                </>
                            ) : (
                                <button onClick={logout} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition">Sign Out</button>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
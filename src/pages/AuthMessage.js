import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaLock, FaShoppingCart, FaHeart, FaBoxOpen } from "react-icons/fa";

const CONFIG = {
    wishlist: { icon: FaHeart,       title: "Save Your Favourites", message: "Sign in to view and manage your wishlist."         },
    orders:   { icon: FaBoxOpen,     title: "View Your Orders",     message: "Sign in to track and manage your orders."          },
    cart:     { icon: FaShoppingCart,title: "Access Your Cart",     message: "Sign in to view the items in your cart."           },
    default:  { icon: FaLock,        title: "Sign In Required",     message: "Please sign in to continue."                       },
};

export default function AuthMessage() {
    const location = useLocation();
    const navigate = useNavigate();
    const type     = new URLSearchParams(location.search).get("type") || "default";
    const { icon: Icon, title, message } = CONFIG[type] || CONFIG.default;

    return (
        <div className="relative bg-[#060f1e] min-h-screen flex items-center justify-center px-4">

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#b11226]/12 blur-[140px] rounded-full" />
                <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-blue-600/8 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-sm text-center">

                {/* Logo */}
                <Link to="/">
                    <img
                        src="https://my.juliussilvert.com/media/logo/websites/1/Resized_Silvert-White_with_1915_.png"
                        className="h-7 mx-auto mb-10 object-contain"
                        alt="Julius Silvert"
                    />
                </Link>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-[#b11226]/15 border border-[#b11226]/30 flex items-center justify-center mx-auto mb-6">
                    <Icon size={24} className="text-[#b11226]" />
                </div>

                <h1 className="text-2xl font-black text-white mb-3 tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                    {title}
                </h1>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">{message}</p>

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-3.5 bg-[#b11226] hover:bg-red-700 text-white font-bold text-sm tracking-widest rounded-xl transition shadow-[0_4px_20px_rgba(177,18,38,0.35)]"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-xl transition"
                    >
                        Create Account
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-2.5 text-white/30 hover:text-white text-sm transition"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
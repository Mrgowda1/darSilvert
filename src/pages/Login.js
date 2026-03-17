import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd]   = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const redirect = new URLSearchParams(location.search).get("redirect");

    const login = async () => {
        if (!username || !password) { setError("Please fill in all fields."); return; }
        setLoading(true); setError("");
        try {
            const res = await axios.post("http://localhost:5000/login", { username, password });
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                if (redirect === "orders")   navigate("/orders");
                else if (redirect === "cart") navigate("/cart");
                else if (redirect === "wishlist") navigate("/wishlist");
                else navigate("/");
            } else {
                setError(res.data.message || "Invalid credentials.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-[#060f1e] min-h-screen flex items-center justify-center px-4">

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#b11226]/12 blur-[140px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/">
                        <img
                            src="https://my.juliussilvert.com/media/logo/websites/1/Resized_Silvert-White_with_1915_.png"
                            className="h-8 mx-auto mb-6 object-contain"
                            alt="Julius Silvert"
                        />
                    </Link>
                    <h1 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                        Welcome back
                    </h1>
                    <p className="text-white/40 text-sm mt-2">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

                    {/* Top accent */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#b11226] to-transparent rounded-full" />

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-1.5">Username</label>
                        <div className="relative">
                            <FaUser size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && login()}
                                className="w-full bg-white/5 border border-white/12 focus:border-[#b11226]/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(177,18,38,0.15)]"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-1.5">Password</label>
                        <div className="relative">
                            <FaLock size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                            <input
                                type={showPwd ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && login()}
                                className="w-full bg-white/5 border border-white/12 focus:border-[#b11226]/60 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(177,18,38,0.15)]"
                            />
                            <button
                                onClick={() => setShowPwd(s => !s)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition"
                            >
                                {showPwd ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={login}
                        disabled={loading}
                        className="w-full py-3.5 bg-[#b11226] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-widest rounded-xl transition shadow-[0_4px_20px_rgba(177,18,38,0.35)]"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="text-center text-sm text-white/30 mt-5">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-[#b11226] hover:text-red-400 font-semibold transition">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
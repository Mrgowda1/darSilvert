import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const LINKS = {
    "Shop":    [{ label: "All Products", to: "/products" }, { label: "Meat & Poultry", to: "/products?category=meat" }, { label: "Dairy & Eggs", to: "/products?category=dairy" }, { label: "Seafood", to: "/products?category=seafood" }, { label: "Produce", to: "/products?category=produce" }],
    "Company": [{ label: "About Us", to: "/" }, { label: "Contact", to: "/contact" }, { label: "Support", to: "/support" }],
    "Legal":   [{ label: "Terms of Service", to: "/terms" }, { label: "Privacy Policy", to: "/privacy" }],
};

export default function Footer() {
    return (
        <footer className="relative bg-[#040d18] border-t border-white/8 text-white">

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b11226] to-transparent" />

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-[#b11226]/8 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-600/8 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-8">

                {/* Main grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

                    {/* Brand col */}
                    <div className="md:col-span-2">
                        <img
                            src="https://my.juliussilvert.com/media/logo/websites/1/Resized_Silvert-White_with_1915_.png"
                            className="h-8 mb-4 object-contain"
                            alt="Julius Silvert"
                        />
                        <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-6">
                            Premium wholesale & specialty food distributor serving the finest restaurants and food businesses since 1916.
                        </p>

                        {/* Contact */}
                        <div className="space-y-2">
                            {[
                                { icon: FaPhone,        text: "215-455-1600"          },
                                { icon: FaEnvelope,     text: "info@juliussilvert.com" },
                                { icon: FaMapMarkerAlt, text: "Philadelphia, PA"       },
                            ].map(c => (
                                <div key={c.text} className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white/70 transition">
                                    <c.icon size={12} className="text-[#b11226] shrink-0" />
                                    {c.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Link cols */}
                    {Object.entries(LINKS).map(([heading, links]) => (
                        <div key={heading}>
                            <p className="text-[10px] uppercase tracking-[2px] text-[#b11226] font-bold mb-4">{heading}</p>
                            <ul className="space-y-2.5">
                                {links.map(l => (
                                    <li key={l.label}>
                                        <Link to={l.to} className="text-sm text-white/40 hover:text-white transition">
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/25">
                        © 2026 Julius Silvert, Inc. All rights reserved.
                    </p>

                    {/* Social icons */}
                    <div className="flex items-center gap-3">
                        {[
                            { icon: FaInstagram, href: "#" },
                            { icon: FaFacebook,  href: "#" },
                            { icon: FaLinkedin,  href: "#" },
                        ].map(({ icon: Icon, href }, i) => (
                            <a
                                key={i}
                                href={href}
                                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#b11226]/20 hover:border-[#b11226]/40 transition"
                            >
                                <Icon size={13} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
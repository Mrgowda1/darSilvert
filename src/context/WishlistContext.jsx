import { createContext, useState } from "react";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);

    const addToWishlist = (product) => {
        setWishlist(prev =>
            prev.find(p => p.id === product.id) ? prev : [...prev, product]
        );
    };

    const removeFromWishlist = (id) =>
        setWishlist(prev => prev.filter(p => p.id !== id));

    const inWishlist = (id) => wishlist.some(p => p.id === id);

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, inWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
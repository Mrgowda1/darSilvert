import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {

    const [cart, setCart] = useState([]);

    // Add product with quantity — if already in cart, increment qty
    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.findIndex(i => i.id === product.id);
            if (existing !== -1) {
                const updated = [...prev];
                updated[existing] = {
                    ...updated[existing],
                    quantity: updated[existing].quantity + quantity,
                };
                return updated;
            }
            return [...prev, { ...product, quantity }];
        });
    };

    // Remove one item by index
    const removeFromCart = (index) => {
        setCart(prev => {
            const updated = [...prev];
            updated.splice(index, 1);
            return updated;
        });
    };

    // Update quantity of an item by index
    const updateQuantity = (index, quantity) => {
        if (quantity < 1) return;
        setCart(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], quantity };
            return updated;
        });
    };

    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            totalItems,
            totalPrice,
        }}>
            {children}
        </CartContext.Provider>
    );
}
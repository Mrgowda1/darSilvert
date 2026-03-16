import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <SearchProvider>
        <CartProvider>
            <WishlistProvider>
                <App />
            </WishlistProvider>
        </CartProvider>
    </SearchProvider>
);
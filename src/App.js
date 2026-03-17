import Navbar from "./components/Navbar";

import Home from "./pages/home/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import AuthMessage from "./pages/AuthMessage";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ProtectedRoute from "./components/ProtectedRoute";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";

import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

    return (

        <BrowserRouter>

            {/* MAIN LAYOUT */}

            <div className="bg-[#0b1f3a] min-h-screen flex flex-col">


                {/* NAVBAR */}

                <Navbar />


                {/* PAGE CONTENT */}

                <div className="flex-1">

                    <Routes>

                        <Route path="/" element={<Home />} />

                        <Route path="/login" element={<Login />} />

                        <Route path="/register" element={<Register />} />

                        <Route path="/products" element={<Products />} />

                        <Route path="/auth" element={<AuthMessage />} />

                        <Route path="/product/:id" element={<ProductDetails />} />

                        <Route path="/profile"  element={<ProtectedRoute><Account /></ProtectedRoute>} />
                        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <Orders />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <Checkout />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/contact" element={<Contact />} />

                        <Route path="/terms" element={<Terms />} />

                        <Route path="/privacy" element={<Privacy />} />

                    </Routes>

                </div>


                {/* FOOTER */}

                <Footer />

            </div>

        </BrowserRouter>

    );

}

export default App;
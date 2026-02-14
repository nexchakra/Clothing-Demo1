"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  category: 'Men' | 'Women' | 'Kids' | 'Accessories';
  image: string;
  description: string;
  inStock: boolean;
  rating: number;
  colors: string[];
  discount?: number;
  reviews?: number;
  featured?: boolean;
}

interface User {
  name: string;
  email: string;
}

interface CartItem extends Product {
  size: string;
  color: string;
  quantity: number;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

// --- Verified Stable Mock Data ---
const CATEGORIES = [
  { name: 'Women', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
  { name: 'Men', img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80' },
  { name: 'Kids', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80' },
  { name: 'Accessories', img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80' },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "Silk Blend Dress", price: 24999, category: 'Women', image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80", description: "Ethically sourced silk with a tailored finish.", inStock: true, rating: 4.5, colors: ['Black', 'Navy', 'Burgundy'], discount: 15, reviews: 234, featured: true },
  { id: 2, name: "Tech Trench Coat", price: 37999, category: 'Women', image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80", description: "Waterproof fabric with modular storage pockets.", inStock: true, rating: 4.8, colors: ['Khaki', 'Black', 'Navy'], reviews: 456, featured: true },
  { id: 3, name: "Mini Denim Set", price: 7199, category: 'Kids', image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80", description: "Durable, soft-wash denim for active play.", inStock: true, rating: 4.3, colors: ['Light Blue', 'Dark Blue'], reviews: 189 },
  { id: 4, name: "Cashmere Scarf", price: 8099, category: 'Accessories', image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80", description: "100% pure cashmere, hand-woven.", inStock: true, rating: 4.8, colors: ['Camel', 'Grey', 'Black'], discount: 10, reviews: 432, featured: true },
  { id: 5, name: "Oversized Knit", price: 10199, category: 'Women', image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80", description: "Hand-knitted wool blend.", inStock: true, rating: 4.7, colors: ['Cream', 'Charcoal', 'Olive'], discount: 20, reviews: 567 },
  { id: 6, name: "Leather Bomber", price: 32199, category: 'Men', image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", description: "Premium leather with quilted lining.", inStock: true, rating: 4.9, colors: ['Brown', 'Black'], reviews: 789, featured: true },
  { id: 7, name: "Pleated Midi Skirt", price: 12299, category: 'Women', image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80", description: "Flowing silhouette with metallic finish.", inStock: false, rating: 4.4, colors: ['Gold', 'Silver', 'Bronze'], reviews: 143 },
  { id: 8, name: "Crossbody Bag", price: 18599, category: 'Accessories', image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80", description: "Italian leather with adjustable strap.", inStock: true, rating: 4.6, colors: ['Tan', 'Black', 'Burgundy'], reviews: 376 },
  { id: 9, name: "Cargo Joggers", price: 8299, category: 'Men', image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80", description: "Technical fabric with multiple pockets.", inStock: true, rating: 4.5, colors: ['Olive', 'Black', 'Stone'], reviews: 298 },
  { id: 10, name: "Rainbow Sneakers", price: 5499, category: 'Kids', image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80", description: "Light-up soles with cushioned inserts.", inStock: true, rating: 4.7, colors: ['Multi', 'White', 'Pink'], reviews: 512 },
  { id: 11, name: "Leather Watch", price: 27999, category: 'Accessories', image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80", description: "Swiss movement with genuine leather strap.", inStock: true, rating: 4.9, colors: ['Brown', 'Black'], discount: 30, reviews: 891 },
  { id: 12, name: "Blazer Dress", price: 23299, category: 'Women', image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80", description: "Sharp tailoring meets feminine silhouette.", inStock: true, rating: 4.8, colors: ['Black', 'Pinstripe', 'White'], discount: 25, reviews: 654 },
  { id: 13, name: "Oxford Shirt", price: 6999, category: 'Men', image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", description: "Classic fit with premium cotton.", inStock: true, rating: 4.4, colors: ['White', 'Blue', 'Pink'], reviews: 421 },
  { id: 14, name: "Hooded Parka", price: 9899, category: 'Kids', image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80", description: "Water-resistant with fleece lining.", inStock: true, rating: 4.6, colors: ['Navy', 'Red', 'Green'], reviews: 267 },
  { id: 15, name: "Chrome Sunglasses", price: 15199, category: 'Accessories', image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80", description: "UV400 protection with titanium frame.", inStock: true, rating: 4.6, colors: ['Silver', 'Gold', 'Black'], reviews: 321 },
  { id: 16, name: "Wool Coat", price: 28999, category: 'Women', image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", description: "Double-breasted wool blend coat.", inStock: true, rating: 4.7, colors: ['Camel', 'Black', 'Grey'], reviews: 445 },
  { id: 17, name: "Denim Jacket", price: 9999, category: 'Men', image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80", description: "Classic vintage-wash denim.", inStock: true, rating: 4.5, colors: ['Light Blue', 'Dark Blue', 'Black'], reviews: 389 },
  { id: 18, name: "Graphic Tee", price: 2499, category: 'Kids', image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80", description: "100% organic cotton with fun prints.", inStock: true, rating: 4.4, colors: ['White', 'Black', 'Navy'], reviews: 234 },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=2000&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=2000&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=2000&q=80",
];

const SIZES = ["XS", "S", "M", "L", "XL"];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest", "Best Rating"];

const SAMPLE_REVIEWS: Review[] = [
  { id: 1, author: "Sarah M.", rating: 5, comment: "Absolutely love this! The quality is outstanding and fits perfectly.", date: "2026-02-05" },
  { id: 2, author: "Michael K.", rating: 4, comment: "Great product, worth the price. Shipping was fast too.", date: "2026-02-08" },
  { id: 3, author: "Emily R.", rating: 5, comment: "Best purchase I've made this year. Highly recommend!", date: "2026-02-10" },
];

const NEWSLETTER_BENEFITS = [
  "Early access to new collections",
  "Exclusive member-only discounts",
  "Free shipping on first order",
  "Birthday month special offers"
];

export default function NexCDemo() {
  const [activeTab, setActiveTab] = useState<Product['category']>('Women');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [showInStock, setShowInStock] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [notification, setNotification] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedColor(selectedProduct.colors[0]);
      // Add to recently viewed
      if (!recentlyViewed.includes(selectedProduct.id)) {
        setRecentlyViewed([selectedProduct.id, ...recentlyViewed.slice(0, 4)]);
      }
    }
  }, [selectedProduct]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'NEXC10') {
      setDiscount(10);
      showNotification("Promo code applied! 10% off");
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(20);
      showNotification("Promo code applied! 20% off");
    } else if (promoCode.toUpperCase() === 'FIRST25') {
      setDiscount(25);
      showNotification("Welcome! 25% off your first order");
    } else {
      showNotification("Invalid promo code");
    }
  };

  const addToCompare = (productId: number) => {
    if (compareList.includes(productId)) {
      setCompareList(compareList.filter(id => id !== productId));
      showNotification("Removed from compare");
    } else if (compareList.length < 3) {
      setCompareList([...compareList, productId]);
      showNotification("Added to compare");
    } else {
      showNotification("Maximum 3 items for comparison");
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(
      item => item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.size === selectedSize && item.color === selectedColor
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, size: selectedSize, color: selectedColor, quantity: 1 }]);
    }
    
    setSelectedProduct(null);
    showNotification(`${product.name} added to bag!`);
    setTimeout(() => setIsCartOpen(true), 500);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
    showNotification("Item removed from bag");
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(cart.map((item, i) => {
      if (i === index) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showNotification("Removed from wishlist");
    } else {
      setWishlist([...wishlist, productId]);
      showNotification("Added to wishlist ❤️");
    }
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUser({
      name: formData.get('name') as string || 'Guest',
      email: formData.get('email') as string
    });
    setIsSignInOpen(false);
    showNotification("Welcome back!");
  };

  const handleSignOut = () => {
    setUser(null);
    setIsAccountOpen(false);
    showNotification("Signed out successfully");
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showNotification("Thank you for subscribing!");
    setIsNewsletterOpen(false);
  };

  const getFilteredProducts = () => {
    let filtered = PRODUCTS.filter(p => p.category === activeTab);
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (showInStock) {
      filtered = filtered.filter(p => p.inStock);
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch(sortBy) {
      case "Price: Low to High":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "Best Rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "Newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "Featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (totalPrice * discount) / 100;
  const finalPrice = totalPrice - discountAmount;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filteredProducts = getFilteredProducts();
  const wishlistProducts = PRODUCTS.filter(p => wishlist.includes(p.id));
  const recentlyViewedProducts = PRODUCTS.filter(p => recentlyViewed.includes(p.id));

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      
      {/* --- Notification Toast --- */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-black text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase shadow-2xl"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Scroll to Top Button --- */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:bg-zinc-800 transition"
            aria-label="Scroll to top"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- Main Navbar --- */}
      <nav className="flex justify-between items-center px-8 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b border-zinc-100">
        <h1 className="text-2xl font-black tracking-tighter uppercase cursor-pointer">NexC</h1>
        
        <div className="flex gap-8 items-center">
          <button onClick={() => setIsSearchOpen(true)} className="text-[10px] font-black tracking-widest uppercase hover:text-zinc-500 transition">Search</button>
          
          <button 
            onClick={() => setIsWishlistOpen(true)}
            className="text-[10px] font-black tracking-widest uppercase hover:text-zinc-500 transition relative"
          >
            Wishlist
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {compareList.length > 0 && (
            <button 
              onClick={() => showNotification(`Comparing ${compareList.length} items`)}
              className="text-[10px] font-black tracking-widest uppercase hover:text-zinc-500 transition relative"
            >
              Compare
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                {compareList.length}
              </span>
            </button>
          )}
          
          {user ? (
            <button onClick={() => setIsAccountOpen(true)} className="text-[10px] font-black tracking-widest uppercase hover:text-zinc-500 transition">
              Hi, {user.name.split(' ')[0]}
            </button>
          ) : (
            <button onClick={() => setIsSignInOpen(true)} className="text-[10px] font-black tracking-widest uppercase hover:text-zinc-500 transition">Sign In</button>
          )}
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black tracking-widest hover:bg-zinc-800 transition relative"
          >
            BAG ({totalItems})
          </button>
        </div>
      </nav>

      {/* --- Newsletter Modal --- */}
      <AnimatePresence>
        {isNewsletterOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsNewsletterOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-white w-full max-w-lg p-12 shadow-2xl rounded-sm z-10"
            >
              <button onClick={() => setIsNewsletterOpen(false)} className="absolute top-6 right-6 text-xl hover:text-zinc-500 transition" aria-label="Close newsletter modal">✕</button>
              
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Join NexC</h2>
              <p className="text-xs text-zinc-400 uppercase tracking-widest mb-8">Subscribe for exclusive benefits</p>
              
              <div className="space-y-3 mb-8">
                {NEWSLETTER_BENEFITS.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-green-500 text-sm">✓</span>
                    <span className="text-xs text-zinc-600">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-6">
                <div>
                  <label htmlFor="newsletter-email" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Email Address</label>
                  <input 
                    id="newsletter-email"
                    type="email" 
                    name="email"
                    required
                    className="w-full border-b-2 border-zinc-200 py-3 text-sm focus:outline-none focus:border-black transition"
                    placeholder="your@email.com"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-black text-white py-5 font-black tracking-widest text-[10px] hover:bg-zinc-800 transition"
                >
                  SUBSCRIBE NOW
                </button>
              </form>
              
              <p className="text-center text-[9px] text-zinc-400 mt-6">
                Get 15% off your first order with code: FIRST25
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Sign In Modal --- */}
      <AnimatePresence>
        {isSignInOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSignInOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-white w-full max-w-md p-12 shadow-2xl rounded-sm z-10"
            >
              <button onClick={() => setIsSignInOpen(false)} className="absolute top-6 right-6 text-xl hover:text-zinc-500 transition" aria-label="Close sign in modal">✕</button>
              
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Welcome</h2>
              <p className="text-xs text-zinc-400 uppercase tracking-widest mb-10">Sign in to your account</p>
              
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <label htmlFor="signin-name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Full Name</label>
                  <input 
                    id="signin-name"
                    type="text" 
                    name="name"
                    required
                    className="w-full border-b-2 border-zinc-200 py-3 text-sm focus:outline-none focus:border-black transition"
                    placeholder="Jane Smith"
                  />
                </div>
                
                <div>
                  <label htmlFor="signin-email" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Email Address</label>
                  <input 
                    id="signin-email"
                    type="email" 
                    name="email"
                    required
                    className="w-full border-b-2 border-zinc-200 py-3 text-sm focus:outline-none focus:border-black transition"
                    placeholder="jane@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="signin-password" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Password</label>
                  <input 
                    id="signin-password"
                    type="password" 
                    name="password"
                    required
                    className="w-full border-b-2 border-zinc-200 py-3 text-sm focus:outline-none focus:border-black transition"
                    placeholder="••••••••"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-black text-white py-5 font-black tracking-widest text-[10px] hover:bg-zinc-800 transition mt-8"
                >
                  SIGN IN
                </button>
              </form>
              
              <p className="text-center text-xs text-zinc-400 mt-8">
                New to NexC? <button className="text-black font-bold underline">Create Account</button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Reviews Modal --- */}
      <AnimatePresence>
        {isReviewsOpen && selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsReviewsOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-white w-full max-w-2xl p-12 shadow-2xl rounded-sm z-10 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setIsReviewsOpen(false)} className="absolute top-6 right-6 text-xl hover:text-zinc-500 transition" aria-label="Close reviews modal">✕</button>
              
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">{selectedProduct.name}</h2>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-500' : 'text-zinc-300'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm font-bold">{selectedProduct.rating}</span>
                <span className="text-xs text-zinc-400">({selectedProduct.reviews} reviews)</span>
              </div>
              
              <div className="space-y-6">
                {SAMPLE_REVIEWS.map(review => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-sm">{review.author}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < review.rating ? 'text-yellow-500' : 'text-zinc-300'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-zinc-400">{review.date}</span>
                    </div>
                    <p className="text-sm text-zinc-600">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-8 bg-black text-white py-4 font-black tracking-widest text-[10px] hover:bg-zinc-800 transition">
                WRITE A REVIEW
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Wishlist Sidebar --- */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsWishlistOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Wishlist</h2>
                <button onClick={() => setIsWishlistOpen(false)} className="text-xl hover:text-zinc-500 transition" aria-label="Close wishlist">✕</button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-6">
                {wishlistProducts.length === 0 ? (
                  <div className="text-center mt-20">
                    <p className="text-zinc-300 uppercase tracking-widest text-xs mb-6">Your wishlist is empty</p>
                    <button 
                      onClick={() => setIsWishlistOpen(false)}
                      className="text-xs font-black uppercase tracking-widest underline hover:no-underline"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  wishlistProducts.map(product => (
                    <div key={product.id} className="border-b pb-6">
                      <div className="flex gap-4">
                        <div className="relative h-32 w-28 shrink-0 bg-zinc-50 rounded-sm overflow-hidden cursor-pointer" onClick={() => {
                          setSelectedProduct(product);
                          setIsWishlistOpen(false);
                        }}>
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold uppercase mb-2">{product.name}</h4>
                          <p className="text-xs text-zinc-500 mb-3">{product.description}</p>
                          <p className="text-sm font-black">{formatPrice(product.price)}</p>
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsWishlistOpen(false);
                              }}
                              className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-black text-white rounded-full hover:bg-zinc-800 transition"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => toggleWishlist(product.id)}
                              className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-zinc-200 rounded-full hover:border-black transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Account Sidebar --- */}
      <AnimatePresence>
        {isAccountOpen && user && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAccountOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Account</h2>
                <button onClick={() => setIsAccountOpen(false)} className="text-xl hover:text-zinc-500 transition" aria-label="Close account">✕</button>
              </div>
              
              <div className="space-y-8 flex-1">
                <div className="pb-8 border-b border-zinc-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Name</p>
                  <p className="text-xl font-bold">{user.name}</p>
                </div>
                
                <div className="pb-8 border-b border-zinc-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                
                <div className="pb-8 border-b border-zinc-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Quick Stats</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-50 p-4 rounded-sm">
                      <p className="text-2xl font-black">{totalItems}</p>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-400 mt-1">In Bag</p>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-sm">
                      <p className="text-2xl font-black">{wishlist.length}</p>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-400 mt-1">Wishlist</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full text-left text-xs font-bold uppercase tracking-widest hover:text-zinc-500 transition py-2">Order History</button>
                  <button className="w-full text-left text-xs font-bold uppercase tracking-widest hover:text-zinc-500 transition py-2">Saved Addresses</button>
                  <button className="w-full text-left text-xs font-bold uppercase tracking-widest hover:text-zinc-500 transition py-2">Payment Methods</button>
                  <button className="w-full text-left text-xs font-bold uppercase tracking-widest hover:text-zinc-500 transition py-2">Preferences</button>
                </div>
              </div>
              
              <button 
                onClick={handleSignOut}
                className="w-full bg-zinc-100 text-black py-5 font-black tracking-widest text-[10px] hover:bg-zinc-200 transition mt-8"
              >
                SIGN OUT
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Search Overlay --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-start pt-32 px-6"
          >
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-10 right-10 text-xl font-light hover:text-zinc-500 transition" aria-label="Close search">✕ CLOSE</button>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-3xl"
            >
              <label htmlFor="search-input" className="sr-only">Search for items</label>
              <input 
                id="search-input"
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH FOR ITEMS..." 
                className="w-full bg-transparent border-b-2 border-black py-4 text-4xl md:text-6xl font-black tracking-tighter uppercase focus:outline-none"
              />
              <div className="mt-8 flex gap-4 text-xs font-bold uppercase text-zinc-400">
                <span>Trending:</span>
                <button onClick={() => setSearchQuery("Dress")} className="hover:text-black transition">Dress</button>
                <button onClick={() => setSearchQuery("Leather")} className="hover:text-black transition">Leather</button>
                <button onClick={() => setSearchQuery("Watch")} className="hover:text-black transition">Watch</button>
              </div>
              
              {searchQuery && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 grid grid-cols-2 gap-6">
                  {PRODUCTS.filter(p => 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase())
                  ).slice(0, 4).map(product => (
                    <div 
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="cursor-pointer group"
                    >
                      <div className="relative h-64 mb-3 overflow-hidden bg-zinc-100 rounded-sm">
                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition duration-500" />
                      </div>
                      <p className="text-xs font-bold uppercase">{product.name}</p>
                      <p className="text-xs text-zinc-400">{formatPrice(product.price)}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Slider --- */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-zinc-900">
        <AnimatePresence mode="wait">
          <motion.div 
            key={heroIndex} 
            initial={{ opacity: 0, scale: 1.1 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 1.5 }} 
            className="absolute inset-0"
          >
            <Image src={HERO_IMAGES[heroIndex]} alt={`Hero image ${heroIndex + 1}`} fill className="object-cover brightness-75" priority />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 text-center px-4">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-9xl font-black tracking-tighter uppercase mb-4 leading-none"
          >
            NexC 26
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="tracking-[0.5em] uppercase text-sm font-light mb-8"
          >
            The Nomad Collection
          </motion.p>
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => document.getElementById('arrivals')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-black px-10 py-4 text-[10px] font-black tracking-widest uppercase hover:bg-zinc-100 transition"
          >
            Shop Now
          </motion.button>
        </div>
        
        {/* Hero Navigation Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {HERO_IMAGES.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`h-2 rounded-full transition-all ${idx === heroIndex ? 'bg-white w-8' : 'bg-white/50 w-2'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* --- Shop by Category --- */}
      <section className="py-20 px-4 max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat, idx) => (
          <motion.div 
            key={cat.name} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative h-[600px] group overflow-hidden cursor-pointer rounded-sm"
          >
            <Image src={cat.img} alt={`${cat.name} category`} fill className="object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-colors" />
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-2">{cat.name}</h3>
              <button 
                onClick={() => {
                  setActiveTab(cat.name as any);
                  document.getElementById('arrivals')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[10px] font-black tracking-widest uppercase border-b border-white pb-1 hover:border-white/50 transition"
              >
                Explore Section +
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* --- New Arrivals Filtered Section --- */}
      <section id="arrivals" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-zinc-100 pb-12">
          <div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400">New arrivals</span>
            <h3 className="text-5xl font-black tracking-tighter uppercase mt-2">Recently Added</h3>
          </div>
          <div className="flex gap-8 text-[10px] font-black tracking-widest uppercase text-zinc-400">
            {['Women', 'Men', 'Kids', 'Accessories'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)}
                className={`${activeTab === tab ? "text-black border-b-2 border-black pb-1" : "hover:text-zinc-600 transition"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- Filters & Sort Bar --- */}
        <div className="mb-12 flex flex-wrap gap-4 items-center justify-between bg-zinc-50 p-6 rounded-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <button 
              onClick={() => setShowInStock(!showInStock)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition ${showInStock ? 'bg-black text-white' : 'bg-white border border-zinc-200 hover:border-black'}`}
            >
              In Stock Only
            </button>
            
            <div className="flex items-center gap-3">
              <label htmlFor="price-filter" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Price:</label>
              <select 
                id="price-filter"
                onChange={(e) => {
                  const val = e.target.value.split('-');
                  setPriceRange([parseInt(val[0]), parseInt(val[1])]);
                }}
                className="px-4 py-2 text-[10px] font-bold uppercase border border-zinc-200 rounded-full bg-white hover:border-black transition"
              >
                <option value="0-50000">All Prices</option>
                <option value="0-10000">Under ₹10,000</option>
                <option value="10000-25000">₹10,000 - ₹25,000</option>
                <option value="25000-50000">₹25,000+</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-4 py-2">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`text-[10px] font-bold ${viewMode === 'grid' ? 'text-black' : 'text-zinc-400'}`}
                aria-label="Grid view"
              >
                ⊞
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`text-[10px] font-bold ${viewMode === 'list' ? 'text-black' : 'text-zinc-400'}`}
                aria-label="List view"
              >
                ☰
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <label htmlFor="sort-select" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sort:</label>
            <select 
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 text-[10px] font-bold uppercase border border-zinc-200 rounded-full bg-white hover:border-black transition"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12' : 'grid-cols-1 gap-6'}`}>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id} 
                layout 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                transition={{ duration: 0.3 }}
                className={`group cursor-pointer relative ${viewMode === 'list' ? 'flex gap-6 border-b pb-6' : ''}`}
              >
                <div onClick={() => setSelectedProduct(product)} className={viewMode === 'list' ? 'flex gap-6 flex-1' : ''}>
                  <div className={`relative overflow-hidden bg-zinc-100 rounded-sm ${viewMode === 'list' ? 'h-48 w-40 shrink-0' : 'h-[500px] mb-4'}`}>
                    <Image src={product.image} alt={product.name} fill className="object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition duration-500" />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-white px-4 py-2 text-[9px] font-black uppercase tracking-widest">Out of Stock</span>
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
                        {product.discount}% OFF
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-black uppercase tracking-widest">New Drop</div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-[12px] font-bold uppercase tracking-tight">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-zinc-900 text-[13px] font-bold">{formatPrice(product.price)}</p>
                      {product.discount && (
                        <p className="text-zinc-400 text-[11px] line-through">{formatPrice(Math.round(product.price / (1 - product.discount/100)))}</p>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setIsReviewsOpen(true);
                      }}
                      className="flex items-center gap-1 mt-1 hover:underline"
                    >
                      <span className="text-yellow-500 text-xs">★</span>
                      <span className="text-[10px] text-zinc-400">{product.rating} ({product.reviews})</span>
                    </button>
                    
                    {viewMode === 'list' && (
                      <div className="mt-3 flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                          className="text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-black text-white rounded-full hover:bg-zinc-800 transition"
                        >
                          Quick View
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCompare(product.id);
                          }}
                          className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition ${
                            compareList.includes(product.id) 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border border-zinc-200 hover:border-black'
                          }`}
                        >
                          Compare
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={`absolute ${viewMode === 'list' ? 'top-0 right-0' : 'top-4 right-4'} w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-lg`}
                  aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <motion.span 
                    whileTap={{ scale: 1.2 }}
                    className={`text-lg ${wishlist.includes(product.id) ? 'text-red-500' : 'text-zinc-400'}`}
                  >
                    {wishlist.includes(product.id) ? '♥' : '♡'}
                  </motion.span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-300 uppercase tracking-widest text-xs mb-6">No products found</p>
            <button 
              onClick={() => {
                setShowInStock(false);
                setPriceRange([0, 50000]);
                setSearchQuery("");
              }}
              className="mt-6 text-xs font-black uppercase tracking-widest underline hover:no-underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* --- Recently Viewed Section --- */}
      {recentlyViewedProducts.length > 0 && (
        <section className="py-16 px-8 max-w-7xl mx-auto bg-zinc-50">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Recently Viewed</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {recentlyViewedProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="cursor-pointer group"
              >
                <div className="relative h-64 mb-3 overflow-hidden bg-white rounded-sm">
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <p className="text-xs font-bold uppercase">{product.name}</p>
                <p className="text-xs text-zinc-400">{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Cart Sidebar --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Your Bag</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-xl hover:text-zinc-500 transition" aria-label="Close cart">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-8">
                {cart.length === 0 ? ( 
                  <div className="text-center mt-20">
                    <p className="text-zinc-300 uppercase tracking-widest text-xs mb-6">Bag is empty.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs font-black uppercase tracking-widest underline hover:no-underline"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-6 border-b pb-8 border-zinc-100 relative"
                    >
                      <div className="relative h-32 w-28 shrink-0 bg-zinc-50 rounded-sm overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <h4 className="text-[11px] font-black uppercase mb-1">{item.name}</h4>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Size: {item.size}</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2">Color: {item.color}</p>
                        <p className="text-sm font-bold mb-3">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(idx, -1)}
                            className="w-6 h-6 flex items-center justify-center border border-zinc-300 rounded-full hover:border-black transition text-xs"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(idx, 1)}
                            className="w-6 h-6 flex items-center justify-center border border-zinc-300 rounded-full hover:border-black transition text-xs"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(idx)}
                        className="absolute top-0 right-0 text-zinc-400 hover:text-black transition text-sm"
                        aria-label="Remove item from cart"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="pt-10 border-t border-zinc-100">
                  {/* Promo Code Section */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo Code"
                        className="flex-1 px-4 py-2 text-xs border border-zinc-200 rounded-full focus:outline-none focus:border-black"
                      />
                      <button 
                        onClick={applyPromoCode}
                        className="px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-zinc-100 rounded-full hover:bg-zinc-200 transition"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-[9px] text-zinc-400 mt-2 uppercase tracking-widest">Try: NEXC10, SAVE20, or FIRST25</p>
                  </div>
                  
                  <div className="space-y-3 mb-6 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>Discount ({discount}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-400">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold">Free</span>
                    </div>
                    <div className="flex justify-between font-black uppercase text-sm pt-3 border-t">
                      <span>Total</span>
                      <span>{formatPrice(finalPrice)}</span>
                    </div>
                  </div>
                  <button className="w-full bg-black text-white py-5 font-black tracking-[0.2em] text-[10px] hover:bg-zinc-800 transition mb-3">CHECKOUT NOW</button>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-zinc-100 text-black py-5 font-black tracking-[0.2em] text-[10px] hover:bg-zinc-200 transition"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Quick View Modal --- */}
      <AnimatePresence>
        {selectedProduct && !isReviewsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedProduct(null)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-white w-full max-w-5xl grid md:grid-cols-2 overflow-hidden shadow-2xl rounded-sm max-h-[90vh] z-10"
            >
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-8 right-8 z-10 text-xl font-light bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-zinc-100 transition"
                aria-label="Close quick view"
              >
                ✕
              </button>
              
              <div className="relative h-[400px] md:h-auto bg-zinc-50">
                <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
                {!selectedProduct.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-white px-6 py-3 text-xs font-black uppercase tracking-widest">Out of Stock</span>
                  </div>
                )}
                {selectedProduct.discount && (
                  <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 text-xs font-black uppercase tracking-widest rounded-full">
                    {selectedProduct.discount}% OFF
                  </div>
                )}
              </div>
              
              <div className="p-8 md:p-12 overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">NexC Collection</span>
                    <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mt-2">{selectedProduct.name}</h3>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 1.2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(selectedProduct.id);
                    }}
                    className="text-2xl"
                    aria-label={wishlist.includes(selectedProduct.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {wishlist.includes(selectedProduct.id) ? <span className="text-red-500">♥</span> : '♡'}
                  </motion.button>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-2xl font-black">{formatPrice(selectedProduct.price)}</p>
                  {selectedProduct.discount && (
                    <p className="text-base text-zinc-400 line-through">{formatPrice(Math.round(selectedProduct.price / (1 - selectedProduct.discount/100)))}</p>
                  )}
                  <button 
                    onClick={() => setIsReviewsOpen(true)}
                    className="flex items-center gap-1 bg-zinc-100 px-3 py-1 rounded-full hover:bg-zinc-200 transition"
                  >
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-xs font-bold">{selectedProduct.rating}</span>
                    <span className="text-[10px] text-zinc-400">({selectedProduct.reviews})</span>
                  </button>
                </div>
                
                <p className="text-sm text-zinc-600 mb-6 leading-relaxed">{selectedProduct.description}</p>
                
                <div className="mb-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-zinc-400">Select Color</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProduct.colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase border rounded-full transition-all ${selectedColor === color ? "bg-black text-white border-black" : "border-zinc-200 hover:border-black"}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-zinc-400">Select Size</p>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 text-[10px] font-bold border transition-all ${selectedSize === size ? "bg-black text-white border-black shadow-lg scale-110" : "border-zinc-200 hover:border-black hover:scale-105"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(selectedProduct)}
                  disabled={!selectedProduct.inStock}
                  className={`w-full py-5 font-black tracking-widest text-xs shadow-xl uppercase transition ${
                    selectedProduct.inStock 
                      ? "bg-black text-white hover:bg-zinc-800" 
                      : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  {selectedProduct.inStock ? "Confirm & Add to Bag" : "Out of Stock"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Newsletter Banner --- */}
      <section className="py-24 px-8 bg-black text-white text-center">
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Stay Connected</h2>
        <p className="text-sm tracking-widest uppercase text-zinc-400 mb-8">Subscribe for exclusive offers & early access</p>
        <button 
          onClick={() => setIsNewsletterOpen(true)}
          className="bg-white text-black px-12 py-4 text-[10px] font-black tracking-widest uppercase hover:bg-zinc-100 transition"
        >
          Join Newsletter
        </button>
      </section>

      <footer className="py-32 text-center border-t mt-20 bg-zinc-50">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">NexC Collective</h2>
        <div className="flex justify-center gap-10 text-[10px] font-black tracking-widest text-zinc-400 uppercase mb-12">
          <a href="#" className="hover:text-black transition">Instagram</a>
          <a href="#" className="hover:text-black transition">Archive</a>
          <a href="#" className="hover:text-black transition">Ethics</a>
          <a href="#" className="hover:text-black transition">Contact</a>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-xs text-zinc-500 mb-8">
          <a href="#" className="hover:text-black transition">Privacy Policy</a>
          <a href="#" className="hover:text-black transition">Terms of Service</a>
          <a href="#" className="hover:text-black transition">Shipping Info</a>
          <a href="#" className="hover:text-black transition">Returns</a>
        </div>
        
        <p className="text-[10px] font-bold tracking-[0.5em] text-zinc-300 uppercase">© 2026 Crafted for the Future</p>
      </footer>
    </div>
  );
}
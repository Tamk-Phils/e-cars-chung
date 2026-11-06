import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Vehicle, Post, Review, Order, FilterState, VehicleCondition } from '../types';
import { INITIAL_VEHICLES, INITIAL_POSTS, INITIAL_REVIEWS } from '../data/initialData';
import {
  checkSupabaseHealth,
  fetchVehiclesFromSupabase,
  fetchPostsFromSupabase,
  fetchReviewsFromSupabase,
  fetchOrdersFromSupabase,
  insertOrderToSupabase,
  updateOrderStatusInSupabase,
  insertVehicleToSupabase,
  updateVehicleInSupabase,
  deleteVehicleInSupabase,
  insertReviewToSupabase,
  type SupabaseHealth,
} from '../services/supabaseClient';

export type Currency = 'USD' | 'EUR' | 'GBP';

interface StoreContextType {
  vehicles: Vehicle[];
  posts: Post[];
  reviews: Review[];
  orders: Order[];
  wishlist: string[];
  compareList: string[];
  currency: Currency;
  theme: 'dark' | 'light';
  isAdmin: boolean;
  filters: FilterState;
  supabaseHealth: SupabaseHealth | null;
  isSupabaseLoading: boolean;

  // Modals & Navigation
  selectedVehicle: Vehicle | null;
  checkoutVehicle: Vehicle | null;
  selectedPost: Post | null;
  isCompareOpen: boolean;
  isWishlistOpen: boolean;
  isAdminOpen: boolean;
  activeTab: 'inventory' | 'brand-new' | 'used' | 'hot-deals' | 'blog' | 'reviews' | 'finance' | 'about';

  // Actions
  setCurrency: (c: Currency) => void;
  toggleTheme: () => void;
  formatPrice: (amount: number | null | undefined) => string;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;

  setSelectedVehicle: (v: Vehicle | null) => void;
  setCheckoutVehicle: (v: Vehicle | null) => void;
  setSelectedPost: (p: Post | null) => void;
  setIsCompareOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setActiveTab: (tab: 'inventory' | 'brand-new' | 'used' | 'hot-deals' | 'blog' | 'reviews' | 'finance' | 'about') => void;

  // Admin & Data Mutations
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  addVehicle: (v: Omit<Vehicle, 'id' | 'created_at'>) => Promise<void>;
  updateVehicle: (id: string, v: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  toggleVehicleSold: (id: string) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  addPost: (p: Omit<Post, 'id' | 'published_at'>) => void;
  updatePost: (id: string, p: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addReview: (r: Omit<Review, 'id' | 'created_at'>) => Promise<Review>;
  deleteReview: (id: string) => void;
  resetAllData: () => void;
  refreshSupabaseStatus: () => Promise<void>;
}

const defaultFilters: FilterState = {
  search: '',
  condition: 'all',
  make: 'all',
  bodyType: 'all',
  minPrice: 0,
  maxPrice: 300000,
  minYear: 1970,
  maxYear: 2026,
  transmission: 'all',
  fuelType: 'all',
  sortBy: 'featured',
  onlyHotDeals: false,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const version = localStorage.getItem('uc_inventory_version');
    const saved = localStorage.getItem('uc_vehicles');
    if (saved && version === 'bankrepossessedautos_v1') {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === INITIAL_VEHICLES.length) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse cached vehicles', e);
      }
    }
    // Set strictly to bankrepossessedautos.com inventory
    localStorage.setItem('uc_inventory_version', 'bankrepossessedautos_v1');
    localStorage.setItem('uc_vehicles', JSON.stringify(INITIAL_VEHICLES));
    return INITIAL_VEHICLES;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('uc_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('uc_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('uc_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('uc_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem('uc_compare');
    return saved ? JSON.parse(saved) : [];
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('uc_currency') as Currency) || 'USD';
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('uc_theme') as 'dark' | 'light') || 'dark';
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('uc_is_admin') === 'true';
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [checkoutVehicle, setCheckoutVehicle] = useState<Vehicle | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'brand-new' | 'used' | 'hot-deals' | 'blog' | 'reviews' | 'finance' | 'about'>('inventory');

  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealth | null>(null);
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);

  // Check Supabase health and fetch live records if available
  const refreshSupabaseStatus = async () => {
    setIsSupabaseLoading(true);
    try {
      const health = await checkSupabaseHealth();
      setSupabaseHealth(health);

      if (health.connected && health.vehicleCount > 0) {
        const liveVehicles = await fetchVehiclesFromSupabase();
        if (liveVehicles && liveVehicles.length > 0) {
          setVehicles(liveVehicles);
        }
      }

      if (health.connected && health.postCount > 0) {
        const livePosts = await fetchPostsFromSupabase();
        if (livePosts && livePosts.length > 0) {
          setPosts(livePosts);
        }
      }

      if (health.connected && health.reviewCount > 0) {
        const liveReviews = await fetchReviewsFromSupabase();
        if (liveReviews && liveReviews.length > 0) {
          setReviews(liveReviews);
        }
      }

      if (health.connected && health.orderCount > 0) {
        const liveOrders = await fetchOrdersFromSupabase();
        if (liveOrders) {
          setOrders(liveOrders);
        }
      }
    } catch {
      // Keep local state
    } finally {
      setIsSupabaseLoading(false);
    }
  };

  useEffect(() => {
    refreshSupabaseStatus();
  }, []);

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem('uc_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('uc_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('uc_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('uc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('uc_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('uc_compare', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('uc_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('uc_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('uc_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
  };

  const formatPrice = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return 'Inquire for Price';
    const rateInfo = CURRENCY_RATES[currency];
    const converted = Math.round(amount * rateInfo.rate);
    return `${rateInfo.symbol}${converted.toLocaleString()}`;
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 vehicles at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const isInCompare = (id: string) => compareList.includes(id);

  const clearCompare = () => setCompareList([]);

  const loginAdmin = (user: string, pass: string): boolean => {
    if (user.trim() === 'admin' && pass.trim() === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  // Vehicle mutations
  const addVehicle = async (v: Omit<Vehicle, 'id' | 'created_at'>) => {
    const newVehicle: Vehicle = {
      ...v,
      id: 'car-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setVehicles(prev => [newVehicle, ...prev]);
    await insertVehicleToSupabase(newVehicle);
  };

  const updateVehicle = async (id: string, updatedFields: Partial<Vehicle>) => {
    setVehicles(prev =>
      prev.map(v => (v.id === id ? { ...v, ...updatedFields, updated_at: new Date().toISOString() } : v))
    );
    if (selectedVehicle?.id === id) {
      setSelectedVehicle(prev => (prev ? { ...prev, ...updatedFields } : null));
    }
    await updateVehicleInSupabase(id, updatedFields);
  };

  const deleteVehicle = async (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    setWishlist(prev => prev.filter(wId => wId !== id));
    setCompareList(prev => prev.filter(cId => cId !== id));
    if (selectedVehicle?.id === id) setSelectedVehicle(null);
    await deleteVehicleInSupabase(id);
  };

  const toggleVehicleSold = async (id: string) => {
    const current = vehicles.find(v => v.id === id);
    if (!current) return;
    const newSold = !current.is_sold;
    setVehicles(prev =>
      prev.map(v => (v.id === id ? { ...v, is_sold: newSold } : v))
    );
    await updateVehicleInSupabase(id, { is_sold: newSold });
  };

  // Orders
  const createOrder = async (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      order_number: 'UC-' + Math.floor(100000 + Math.random() * 900000),
      created_at: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    await insertOrderToSupabase(newOrder);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
    await updateOrderStatusInSupabase(orderId, status);
  };

  // Posts mutations
  const addPost = (p: Omit<Post, 'id' | 'published_at'>) => {
    const newPost: Post = {
      ...p,
      id: 'post-' + Date.now(),
      published_at: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (id: string, p: Partial<Post>) => {
    setPosts(prev =>
      prev.map(post => (post.id === id ? { ...post, ...p } : post))
    );
    if (selectedPost?.id === id) {
      setSelectedPost(prev => (prev ? { ...prev, ...p } : null));
    }
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    if (selectedPost?.id === id) setSelectedPost(null);
  };

  // Reviews mutations
  const addReview = async (r: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
    const newRev: Review = {
      ...r,
      id: 'rev-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setReviews(prev => [newRev, ...prev]);
    await insertReviewToSupabase(newRev);
    return newRev;
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const resetAllData = () => {
    localStorage.removeItem('uc_vehicles');
    localStorage.removeItem('uc_posts');
    localStorage.removeItem('uc_reviews');
    localStorage.removeItem('uc_orders');
    localStorage.removeItem('uc_wishlist');
    localStorage.removeItem('uc_compare');
    setVehicles(INITIAL_VEHICLES);
    setPosts(INITIAL_POSTS);
    setReviews(INITIAL_REVIEWS);
    setOrders([]);
    setWishlist([]);
    setCompareList([]);
    setFilters(defaultFilters);
  };

  return (
    <StoreContext.Provider
      value={{
        vehicles,
        posts,
        reviews,
        orders,
        wishlist,
        compareList,
        currency,
        theme,
        isAdmin,
        filters,
        supabaseHealth,
        isSupabaseLoading,
        selectedVehicle,
        checkoutVehicle,
        selectedPost,
        isCompareOpen,
        isWishlistOpen,
        isAdminOpen,
        activeTab,
        setCurrency,
        toggleTheme,
        formatPrice,
        setFilters,
        resetFilters,
        toggleWishlist,
        isInWishlist,
        toggleCompare,
        isInCompare,
        clearCompare,
        setSelectedVehicle,
        setCheckoutVehicle,
        setSelectedPost,
        setIsCompareOpen,
        setIsWishlistOpen,
        setIsAdminOpen,
        setActiveTab,
        loginAdmin,
        logoutAdmin,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        toggleVehicleSold,
        createOrder,
        updateOrderStatus,
        addPost,
        updatePost,
        deletePost,
        addReview,
        deleteReview,
        resetAllData,
        refreshSupabaseStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

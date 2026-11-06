import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Vehicle, Post, Review, Order, FilterState, VehicleCondition, User, ChatMessage } from '../types';
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

  // User Authentication & Management
  currentUser: User | null;
  users: User[];
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  loginUser: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (name: string, email: string, phone?: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logoutUser: () => void;
  addUser: (u: Omit<User, 'id' | 'created_at'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;

  // Live Chat System
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (message: string, overrideSender?: 'user' | 'admin', targetUserId?: string) => void;
  markChatRead: (userId: string) => void;
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

const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Michael Reed',
    email: 'michael.reed@example.com',
    phone: '(555) 234-5678',
    role: 'user',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    last_login: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '(555) 876-5432',
    role: 'user',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    last_login: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'usr-3',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '(555) 432-1098',
    role: 'user',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    last_login: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'usr-admin',
    name: 'Chung Motors Admin',
    email: 'admin@chungmotors.com',
    phone: '(800) 845-2886',
    role: 'admin',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    last_login: new Date().toISOString(),
  },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat-1',
    userId: 'usr-1',
    userName: 'Michael Reed',
    userEmail: 'michael.reed@example.com',
    sender: 'user',
    message: 'Hello, is the 2024 Porsche 911 GT3 RS still available for nationwide enclosed transport to Texas?',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    read: true,
  },
  {
    id: 'chat-2',
    userId: 'usr-1',
    userName: 'Chung Motors Concierge',
    userEmail: 'sales@chungmotors.com',
    sender: 'admin',
    message: 'Hello Michael! Yes, the 911 GT3 RS is in our Beverly Hills VIP showroom with a clean title. Enclosed transport to Texas takes approximately 3-4 business days. Would you like to lock in a 72-hour hold reservation?',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: true,
  },
  {
    id: 'chat-3',
    userId: 'usr-1',
    userName: 'Michael Reed',
    userEmail: 'michael.reed@example.com',
    sender: 'user',
    message: 'That sounds perfect. What payment methods are accepted for the $500 reservation hold?',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    read: false,
  },
];

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

  // Users state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('uc_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('uc_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Live Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('uc_chat_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [isChatOpen, setIsChatOpen] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('uc_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('uc_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('uc_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('uc_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const loginUser = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'Account not found with this email. Please create an account.' };
    }
    if (user.status === 'suspended') {
      return { success: false, message: 'Your account is suspended. Please contact support.' };
    }
    const updatedUser: User = { ...user, last_login: new Date().toISOString() };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const registerUser = async (name: string, email: string, phone?: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim() || '',
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const addUser = (u: Omit<User, 'id' | 'created_at'>) => {
    const newUser: User = {
      ...u,
      id: 'usr-' + Date.now(),
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser?.id === id) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const sendChatMessage = (message: string, overrideSender?: 'user' | 'admin', targetUserId?: string) => {
    const sender = overrideSender || (isAdmin ? 'admin' : 'user');
    const uId = targetUserId || currentUser?.id || 'guest';
    const uName = currentUser ? currentUser.name : sender === 'admin' ? 'Chung Motors Concierge' : 'Customer';
    const uEmail = currentUser ? currentUser.email : sender === 'admin' ? 'sales@chungmotors.com' : 'customer@example.com';

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      userId: uId,
      userName: uName,
      userEmail: uEmail,
      sender,
      message: message.trim(),
      created_at: new Date().toISOString(),
      read: sender === 'admin',
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Simulated automated concierge response if regular user sent message
    if (sender === 'user') {
      const existingUserMsgs = chatMessages.filter(m => m.userId === uId);
      if (existingUserMsgs.length === 0 || Math.random() > 0.5) {
        setTimeout(() => {
          const automatedReply: ChatMessage = {
            id: 'msg-' + (Date.now() + 1),
            userId: uId,
            userName: 'Chung Motors Concierge',
            userEmail: 'sales@chungmotors.com',
            sender: 'admin',
            message: `Hello ${uName}! Thank you for your inquiry. A senior dealership concierge is reviewing your request and will provide all specific details, shipping schedule, or hold options right away.`,
            created_at: new Date().toISOString(),
            read: false,
          };
          setChatMessages(prev => [...prev, automatedReply]);
        }, 1200);
      }
    }
  };

  const markChatRead = (userId: string) => {
    setChatMessages(prev => prev.map(m => (m.userId === userId ? { ...m, read: true } : m)));
  };

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
    localStorage.removeItem('uc_users');
    localStorage.removeItem('uc_current_user');
    localStorage.removeItem('uc_chat_messages');
    setVehicles(INITIAL_VEHICLES);
    setPosts(INITIAL_POSTS);
    setReviews(INITIAL_REVIEWS);
    setOrders([]);
    setWishlist([]);
    setCompareList([]);
    setUsers(INITIAL_USERS);
    setCurrentUser(null);
    setChatMessages(INITIAL_CHAT_MESSAGES);
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

        // User Auth & Management
        currentUser,
        users,
        isAuthModalOpen,
        authModalMode,
        setIsAuthModalOpen,
        setAuthModalMode,
        openLoginModal,
        openRegisterModal,
        loginUser,
        registerUser,
        logoutUser,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,

        // Live Chat System
        isChatOpen,
        setIsChatOpen,
        chatMessages,
        sendChatMessage,
        markChatRead,
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

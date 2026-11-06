export type VehicleCondition = 'Brand New' | 'Certified Pre-Owned' | 'Used' | 'Bank Seized / Repo';

export type Currency = 'USD' | 'EUR' | 'GBP';

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  condition: VehicleCondition;
  make: string;
  model: string;
  year: number;
  price: number;
  sale_price: number | null;
  down_payment: number | null;
  mileage: string;
  transmission: string;
  exterior_color: string;
  interior_color: string;
  fuel_type: string;
  body_type: string;
  engine?: string;
  drivetrain?: string;
  vin: string;
  title_status: string;
  trim: string;
  description: string;
  features: string[];
  images: string[];
  is_hot_deal: boolean;
  is_sold: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  keywords: string[];
  author: string;
  read_minutes: number;
  is_published: boolean;
  published_at: string;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  body: string;
  vehicle_bought?: string;
  date?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export type PaymentMethod =
  | 'Zelle'
  | 'Cash App'
  | 'PayPal'
  | 'Apple Pay'
  | 'Chime'
  | 'Crypto (USDC/BTC)';

export interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: 'Pending' | 'Confirmed' | 'Deposit Paid' | 'Delivered' | 'Cancelled';
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  vehicle: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    condition: VehicleCondition;
    year: number;
  };
  type: 'Full Payment' | 'Reservation Deposit' | 'Finance Application';
  amount: number;
  paymentMethod: PaymentMethod | string;
  deliveryOption: 'Nationwide Home Delivery' | 'Showroom Pickup';
  hasTradeIn: boolean;
  tradeInDetails?: string;
  notes?: string;
}

export interface FilterState {
  search: string;
  condition: string;
  make: string;
  bodyType: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  transmission: string;
  fuelType: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc';
  onlyHotDeals: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  created_at: string;
  last_login?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  sender: 'user' | 'admin';
  message: string;
  created_at: string;
  read: boolean;
}

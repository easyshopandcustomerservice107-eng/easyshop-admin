
export interface Product {
  _id: string;
  id?: string; // For backward compatibility
  slug?: string;
  name: string;
  price: number;
  category: string | { _id: string; name: string };
  description: string;
  images: { public_id: string; url: string }[];
  image?: string; // Computed from images[0]
  secondaryImage?: string; // Computed from images[1]
  rating: number;
  numOfReviews: number;
  reviewsCount?: number; // Alias for numOfReviews
  stock: number;
  featured?: boolean;
  isHero?: boolean;
  brand?: string;
  discount?: number;
  variants?: { size?: string; color?: string; price?: number; stock?: number }[];
  specifications?: { key: string; value: string }[];
}

export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface User {
  _id: string;
  id?: string; // For backward compatibility
  name?: string | null;
  email: string;
  avatar?: string | null;
  phone?: string | null;
  role?: 'user' | 'admin';
  isVerified?: boolean;
  wishlist?: string[] | Product[];
}

export interface Address {
  _id: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  _id: string;
  id?: string; // For backward compatibility
  user: string | User;
  items: {
    product: string | Product;
    quantity: number;
    price: number;
  }[];
  shippingAddress: string | Address;
  paymentMethod: 'Stripe' | 'COD';
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  createdAt: Date;
  date?: string; // Alias for createdAt
  total?: number; // Alias for totalPrice
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface Review {
  _id: string;
  user: User;
  product: string;
  rating: number;
  comment: string;
  images?: { public_id: string; url: string }[];
  helpfulVotes: number;
  createdAt: Date;
}

export interface GatewaySetting {
  _id?: string;
  gateway: 'stripe' | 'paypal' | 'cod';
  mode: 'test' | 'live';
  isActive: boolean;
  testSecretKey?: string;
  testPublishableKey?: string;
  liveSecretKey?: string;
  livePublishableKey?: string;
}


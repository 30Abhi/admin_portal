// Central app-wide type definitions

export type Dermatologist = {
  id: string;
  name: string;
  imageUrl: string;
  clinicName: string;
  addressCity: string;
  addressState: string;
  addressCountry: string;
  qualifications: string;
  experienceYears: number;
  contactNumber: string;
  couponCode: string;
};

export type Product = {
  id: string;
  productId: string;
  name: string;
  company: string;
  price: number;
  rating: number;
  link: string;
  imageUrl: string;
  category: string;
  skinTypes: string[];
  concernsTargeted: string[];
  regionMarket: string;
  keyIngredient: string;
};

// Ad slot types for backend integration
export type AdSlotShape = "square" | "banner-wide" | "banner-medium" | "poster";

export type AdSlot = {
  id: string;
  adNumber: number; // 1-6 for the 6 specific ad slots
  section: "questionnaire" | "loading" | "dashboard";
  shape: AdSlotShape;
  imageUrl?: string;
  targetUrl?: string;
  order: number;
  countclick?: number; // New field for tracking click counts
  createdAt?: Date;
  updatedAt?: Date;
};

// Form state for ad management
export type AdFormState = {
  adNumber: number;
  imageUrl: string;
  targetUrl: string;
};

export type ProtectedRouteProps = {
  children: React.ReactNode;
};

export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  verifyToken: () => Promise<boolean>;
  logout: () => void;
};

// Sidebar
export type SidebarProps = {
  onItemClick?: () => void;
};

// Product form state used in `ProductModal`
export type ProductFormState = {
  productId: string;
  name: string;
  company: string;
  price: string;
  rating: string;
  link: string;
  imageUrl: string;
  category: string;
  skinTypes: string[];
  concernsTargeted: string[];
  regionMarket: string;
  keyIngredient: string;
};

// Dermatologist form state used in `DermModal`
export type DermFormState = {
  name: string;
  imageUrl: string;
  clinicName: string;
  addressCity: string;
  addressState: string;
  addressCountry: string;
  qualifications: string;
  experienceYears: string;
  contactNumber: string;
  couponCode: string;
};

// PillSelect props
export type PillSelectProps = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
};



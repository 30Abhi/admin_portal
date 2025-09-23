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

// Optional: basic ad slot types for future backend integration
export type AdSlotShape = "square" | "banner-wide" | "banner-medium" | "poster";

export type AdSlot = {
  id: string;
  section: "questionnaire" | "loading" | "dashboard";
  shape: AdSlotShape;
  imageUrl?: string;
  targetUrl?: string;
  order: number;
};



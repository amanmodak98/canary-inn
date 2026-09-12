// Shared type definitions across components.

export type RoomSeed = {
  slug: string;
  name: string;
  description: string;
  basePricePaise: number | null;
  maxGuests: number | null;
  sizeSqft: number | null;
  bedType: string | null;
  heroImage: string;
  images: string[];
  amenities: string[];
  bookingCta: string;
  externalBooking: { label: string; url: string }[];
};

export type MenuCategorySeed = {
  slug: string;
  name: string;
  description: string | null;
  displayOrder: number;
};

export type MenuItemSeed = {
  category: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  imageUrl?: string;
};

export type HotelAmenitySeed = {
  name: string;
  icon: string;
  description: string;
};

export type GallerySeed = {
  caption: string;
  imageUrl: string;
  category: string;
};
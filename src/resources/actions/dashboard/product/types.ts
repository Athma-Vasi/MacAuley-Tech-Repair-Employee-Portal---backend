import { Types } from 'mongoose';

type DimensionUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';
type WeightUnit = 'g' | 'kg' | 'lb';

type ProductReview = {
  userId: Types.ObjectId;
  username: string;
  rating: number;
  review: string;
};
type ProductCategory =
  | 'Desktop Computers'
  | 'Laptops'
  | 'Central Processing Units (CPUs)'
  | 'Graphics Processing Units (GPUs)'
  | 'Motherboards'
  | 'Memory (RAM)'
  | 'Storage'
  | 'Power Supplies'
  | 'Computer Cases'
  | 'Monitors'
  | 'Keyboards'
  | 'Mice'
  | 'Headphones'
  | 'Speakers'
  | 'Smartphones'
  | 'Tablets'
  | 'Accessories';
type ProductAvailability = 'In Stock' | 'Out of Stock' | 'Pre-order' | 'Discontinued' | 'Other';
type MemoryType = 'DDR5' | 'DDR4' | 'DDR3' | 'DDR2' | 'DDR';
type MemoryUnit = 'KB' | 'MB' | 'GB' | 'TB';
type PeripheralsInterface = 'USB' | 'Bluetooth' | 'Other';

export type {
  DimensionUnit,
  WeightUnit,
  ProductReview,
  ProductCategory,
  ProductAvailability,
  MemoryType,
  MemoryUnit,
  PeripheralsInterface,
};

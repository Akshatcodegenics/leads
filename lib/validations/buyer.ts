import { z } from 'zod';

// Enum schemas matching database enums
export const citySchema = z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']);
export const propertyTypeSchema = z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']);
export const bhkSchema = z.enum(['1', '2', '3', '4', 'Studio']);
export const purposeSchema = z.enum(['Buy', 'Rent']);
export const timelineSchema = z.enum(['0-3m', '3-6m', '>6m', 'Exploring']);
export const sourceSchema = z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']);
export const statusSchema = z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']);

// Phone validation (10-15 digits)
const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;

// Base buyer schema
export const buyerSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name must not exceed 80 characters')
    .trim(),
  
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .regex(phoneRegex, 'Phone number must be 10-15 digits')
    .trim(),
  
  city: citySchema,
  
  propertyType: propertyTypeSchema,
  
  bhk: bhkSchema.optional(),
  
  purpose: purposeSchema,
  
  budgetMin: z.number()
    .int('Budget must be a whole number')
    .min(0, 'Budget cannot be negative')
    .optional(),
  
  budgetMax: z.number()
    .int('Budget must be a whole number')
    .min(0, 'Budget cannot be negative')
    .optional(),
  
  timeline: timelineSchema,
  
  source: sourceSchema,
  
  status: statusSchema.default('New'),
  
  notes: z.string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  
  tags: z.array(z.string().trim().min(1))
    .default([])
    .optional(),
}).refine((data) => {
  // BHK is required for residential properties
  const residentialTypes = ['Apartment', 'Villa'];
  if (residentialTypes.includes(data.propertyType) && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for residential properties (Apartment/Villa)',
  path: ['bhk']
}).refine((data) => {
  // Budget max must be >= budget min if both are provided
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax']
});

// Schema for creating new buyer
export const createBuyerSchema = buyerSchema;

// Schema for updating buyer (all fields optional except id)
export const updateBuyerSchema = z.object({
  id: z.string().uuid('Invalid buyer ID'),
  fullName: z.string().min(2).max(80).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10).max(15).optional(),
  city: citySchema.optional(),
  propertyType: propertyTypeSchema.optional(),
  bhk: bhkSchema.optional(),
  purpose: purposeSchema.optional(),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  timeline: timelineSchema.optional(),
  source: sourceSchema.optional(),
  status: statusSchema.optional(),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  updatedAt: z.date().optional(), // For concurrency control
});

// Schema for buyer filters
export const buyerFiltersSchema = z.object({
  search: z.string().optional(),
  city: citySchema.optional(),
  propertyType: propertyTypeSchema.optional(),
  status: statusSchema.optional(),
  timeline: timelineSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['updatedAt', 'createdAt', 'fullName']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// CSV import schema (more lenient for bulk operations)
export const csvBuyerSchema = z.object({
  fullName: z.string().min(2).max(80).trim(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(phoneRegex).trim(),
  city: citySchema,
  propertyType: propertyTypeSchema,
  bhk: bhkSchema.optional().or(z.literal('')),
  purpose: purposeSchema,
  budgetMin: z.string().transform(val => val ? parseInt(val) : undefined).optional(),
  budgetMax: z.string().transform(val => val ? parseInt(val) : undefined).optional(),
  timeline: timelineSchema,
  source: sourceSchema,
  status: statusSchema.default('New'),
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.string().transform(val => val ? val.split(',').map(t => t.trim()).filter(Boolean) : []).optional(),
});

// Types
export type BuyerFormData = z.infer<typeof buyerSchema>;
export type CreateBuyerData = z.infer<typeof createBuyerSchema>;
export type UpdateBuyerData = z.infer<typeof updateBuyerSchema>;
export type BuyerFilters = z.infer<typeof buyerFiltersSchema>;
export type CsvBuyerData = z.infer<typeof csvBuyerSchema>;

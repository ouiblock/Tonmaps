import { z } from 'zod';

export const rideSchema = z.object({
  from: z.string().min(1, 'Departure location is required'),
  to: z.string().min(1, 'Destination is required'),
  date: z.string().min(1, 'Date is required').refine(
    (date) => new Date(date) > new Date(),
    'Date must be in the future'
  ),
  time: z.string().min(1, 'Time is required'),
  seats: z.number()
    .int('Must be a whole number')
    .min(1, 'Must have at least 1 seat')
    .max(8, 'Maximum 8 seats allowed'),
  price: z.number()
    .min(0, 'Price cannot be negative')
    .max(1000, 'Price cannot exceed 1000 TON'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});

export const parcelSchema = z.object({
  from: z.string().min(1, 'Pickup location is required'),
  to: z.string().min(1, 'Delivery location is required'),
  deadline: z.string().min(1, 'Deadline is required').refine(
    (date) => new Date(date) > new Date(),
    'Deadline must be in the future'
  ),
  time: z.string().min(1, 'Time is required'),
  size: z.enum(['small', 'medium', 'large']),
  weight: z.number()
    .min(0.1, 'Weight must be at least 0.1 kg')
    .max(30, 'Weight cannot exceed 30 kg'),
  reward: z.number()
    .min(1, 'Reward must be at least 1 TON')
    .max(1000, 'Reward cannot exceed 1000 TON'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});

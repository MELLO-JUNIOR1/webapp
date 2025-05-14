import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const serviceCategories = [
  'Electrical',
  'Plumbing',
  'Carpentry',
  'Cleaning',
  'Painting',
  'Gardening',
  'Moving',
  'Appliance Repair',
  'HVAC',
  'General Maintenance',
] as const

export type ServiceCategory = typeof serviceCategories[number] 
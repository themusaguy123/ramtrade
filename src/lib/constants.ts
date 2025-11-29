// Categories for listings
export const CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Kitchen & Dining',
  'Transportation',
  'Appliances',
  'School Supplies',
  'Other',
] as const;

// Condition options
export const CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
] as const;

// Maximum number of images per listing
export const MAX_IMAGES = 5;

// Maximum file size (5MB in bytes)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
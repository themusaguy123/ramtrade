// Simple validation functions (no external libraries needed)

export function validateListingForm(data: {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  locationHint: string;
  images: File[];
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Description validation
  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  // Price validation
  const price = parseFloat(data.price);
  if (!data.price || isNaN(price)) {
    errors.price = 'Price is required';
  } else if (price < 0) {
    errors.price = 'Price must be positive';
  } else if (price > 10000) {
    errors.price = 'Price must be less than $10,000';
  }

  // Category validation
  if (!data.category) {
    errors.category = 'Category is required';
  }

  // Condition validation
  if (!data.condition) {
    errors.condition = 'Condition is required';
  }

  // Location validation
  if (!data.locationHint.trim()) {
    errors.locationHint = 'Location hint is required';
  } else if (data.locationHint.length > 100) {
    errors.locationHint = 'Location hint must be less than 100 characters';
  }

  // Images validation
  if (data.images.length === 0) {
    errors.images = 'At least one image is required';
  } else if (data.images.length > 5) {
    errors.images = 'Maximum 5 images allowed';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
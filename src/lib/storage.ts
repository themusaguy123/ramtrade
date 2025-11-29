import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from './constants';

// Validate image file
export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload JPG, PNG, or WebP images.' 
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` 
    };
  }

  return { valid: true };
}

// Upload a single image
export async function uploadImage(
  file: File, 
  userId: string, 
  listingId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate first
    const validation = validateImage(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const filePath = `listings/${userId}/${listingId}/${filename}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);

    // Get download URL
    const url = await getDownloadURL(storageRef);

    return { success: true, url };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
}

// Upload multiple images
export async function uploadImages(
  files: File[], 
  userId: string, 
  listingId: string
): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    const urls: string[] = [];

    for (const file of files) {
      const result = await uploadImage(file, userId, listingId);
      
      if (result.success && result.url) {
        urls.push(result.url);
      } else {
        // If any upload fails, return error
        return { success: false, error: result.error };
      }
    }

    return { success: true, urls };
  } catch (error: any) {
    console.error('Error uploading images:', error);
    return { success: false, error: error.message };
  }
}
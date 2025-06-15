export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  folder: 'shopO',
  apiUrl: 'https://api.cloudinary.com/v1_1/'
} as const;

export const CLOUDINARY_FOLDERS = {
  PRODUCTS: 'products',
  USERS: 'users',
  LOGOS: 'logos',
  BANNERS: 'banners',
  SELLERS: 'sellers'
} as const;

export const CLOUDINARY_DEFAULT_TRANSFORMATIONS = {
  quality: 'auto',
  fetch_format: 'auto',
  crop: 'limit'
} as const;

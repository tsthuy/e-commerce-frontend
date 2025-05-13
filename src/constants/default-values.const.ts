import { Gift, Shield, ShoppingCart, Wallet } from 'lucide-react';

export const SEO_TITLE = 'ShopO';
export const SEO_DESCRIPTION = 'ShopO';
export const SEO_AUTHOR = 'ShopO';
export const SEO_KEYWORD = 'ShopO';
export const SEO_TYPE = 'website';
export const SEO_FAVICON = '/favicon.ico';
export const SEO_QUOTE = ' Your Destination for Modern Tech and Information Solutions';
export const SEO_GUARANTEES = [
  {
    icon: ShoppingCart,
    title: 'Free Shipping',
    description: 'From all orders over 100$'
  },
  {
    icon: Gift,
    title: 'Daily Surprise Offers',
    description: 'Save up to 25% off'
  },
  {
    icon: Wallet,
    title: 'Affordable Prices',
    description: 'Get Factory direct price'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: '100% protected payments'
  }
] as const;

export const SEO_CATEGORY = [
  {
    id: 1,
    title: 'Computers and Laptops',
    subTitle: '',
    image_Url: '/images/category/laptop.webp'
  },
  {
    id: 2,
    title: 'cosmetics and body care',
    subTitle: '',
    image_Url: '/images/category/bodycare.png'
  },
  {
    id: 3,
    title: 'Accesories',
    subTitle: '',
    image_Url: '/images/category/accesories.avif'
  },
  {
    id: 4,
    title: 'Cloths',
    subTitle: '',
    image_Url: '/images/category/cloths.webp'
  },
  {
    id: 5,
    title: 'Shoes',
    subTitle: '',
    image_Url: '/images/category/shoes.jpg'
  },
  {
    id: 6,
    title: 'Gifts',
    subTitle: '',
    image_Url: '/images/category/gifts.jpg'
  },
  {
    id: 7,
    title: 'Pet Care',
    subTitle: '',
    image_Url: '/images/category/petcare.webp'
  },
  {
    id: 8,
    title: 'Mobile and Tablets',
    subTitle: '',
    image_Url: '/images/category/mobile.webp'
  },
  {
    id: 9,
    title: 'Music and Gaming',
    subTitle: '',
    image_Url: '/images/category/music.webp'
  },
  {
    id: 10,
    title: 'Others',
    subTitle: '',
    image_Url: '/images/category/other.webp'
  }
];

export const LOGO = '/images/logo/logo.svg';
export const BG = '/images/bg.avif';
export const DEFAULT_IMG_BANNER = '/images/common/banner.svg';
export const DEFAULT_IMG_AVATAR = '/images/common/no-avatar.webp';
export const DEFAULT_IMG_EMPTY = '/gifs/empty.gif';
export const DEFAULT_IMG_SEARCHING = '/gifs/searching.gif';
export const DEFAULT_IMG_SKELETONS = '/gifs/skeletons.gif';
export const DEFAULT_IMG_PLACEHOLDER = '/images/common/placeholder.webp';

export const MAX_PRICE_VALUE = 1000000;

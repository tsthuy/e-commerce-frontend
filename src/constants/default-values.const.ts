import { Gift, Shield, ShoppingCart, Wallet } from 'lucide-react';

export const SEO_TITLE = 'ShopO';
export const SEO_DESCRIPTION = 'ShopO';
export const SEO_AUTHOR = 'ShopO';
export const SEO_KEYWORD = 'ShopO';
export const SEO_TYPE = 'website';
export const SEO_FAVICON = '/favicon.ico';
export const SEO_QUOTE = '"Wear the Past, Own the Style"';
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
export const SEO_SECTION_HEADINGS = {
  BEST_DEALS: 'Product For You',
  POPULAR_EVENTS: 'Popular Events',
  FEATURED_PRODUCTS: 'Featured Products',
  SPONSOR: 'Our Trusted Partners'
} as const;

export const LOGO = '/images/logo/logo.svg';
export const BG = '/images/bg.avif';
export const DEFAULT_IMG_BANNER = '/images/common/banner.svg';
export const DEFAULT_IMG_AVATAR = '/images/common/no-avatar.webp';
export const DEFAULT_ADMIN_AVATAR = '/admin.png';
export const DEFAULT_IMG_SAMPLE = '/images/sample.jpg';
export const DEFAULT_IMG_EMPTY = '/gifs/empty.gif';
export const DEFAULT_IMG_SEARCHING = '/gifs/searching.gif';
export const DEFAULT_IMG_SKELETONS = '/gifs/skeletons.gif';
export const DEFAULT_IMG_PLACEHOLDER = '/images/common/placeholder.webp';
export const DEFAULT_IMG_PAYMENT = '/images/footer/payment.webp';

export const MAX_PRICE_VALUE = 1000000;

export const FAQ_DATA = [
  {
    questionKey: 'FAQ.questions.returnPolicy.question',
    answerKey: 'FAQ.questions.returnPolicy.answer'
  },
  {
    questionKey: 'FAQ.questions.trackOrder.question',
    answerKey: 'FAQ.questions.trackOrder.answer'
  },
  {
    questionKey: 'FAQ.questions.customerSupport.question',
    answerKey: 'FAQ.questions.customerSupport.answer'
  },
  {
    questionKey: 'FAQ.questions.changeOrder.question',
    answerKey: 'FAQ.questions.changeOrder.answer'
  },
  {
    questionKey: 'FAQ.questions.internationalShipping.question',
    answerKey: 'FAQ.questions.internationalShipping.answer'
  },
  {
    questionKey: 'FAQ.questions.paymentMethods.question',
    answerKey: 'FAQ.questions.paymentMethods.answer'
  }
] as const;

export const SPONSORS = [
  {
    id: 1,
    name: 'Nike',
    logoUrl: '/images/sponsor/nike.jpg',
    translationKey: 'nike'
  },
  {
    id: 2,
    name: 'Adidas',
    logoUrl: '/images/sponsor/adidas.webp',
    translationKey: 'adidas'
  },
  {
    id: 3,
    name: 'Gucci',
    logoUrl: '/images/sponsor/gucci.avif',
    translationKey: 'gucci'
  },
  {
    id: 4,
    name: 'Louis Vuitton',
    logoUrl: '/images/sponsor/louis-vuitton.jpg',
    translationKey: 'louisVuitton'
  },
  {
    id: 5,
    name: 'Chanel',
    logoUrl: '/images/sponsor/chanel.png',
    translationKey: 'chanel'
  },
  {
    id: 6,
    name: 'Prada',
    logoUrl: '/images/sponsor/prada.png',
    translationKey: 'prada'
  },
  {
    id: 7,
    name: 'Jordan',
    logoUrl: '/images/sponsor/jordan.png',
    translationKey: 'jordan'
  },
  {
    id: 8,
    name: 'Supreme',
    logoUrl: '/images/sponsor/supreme.png',
    translationKey: 'supremeNy'
  }
] as const;

export const FOOTER_SECTIONS = [
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Store Locations', href: '#' },
      { label: 'Our Blog', href: '#' },
      { label: 'Reviews', href: '#' }
    ]
  },
  {
    title: 'Shop',
    links: [
      { label: 'Game & Video', href: '#' },
      { label: 'Phone & Tablets', href: '#' },
      { label: 'Computers & Laptop', href: '#' },
      { label: 'Sport Watches', href: '#' },
      { label: 'Events', href: '#' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '#' },
      { label: 'Reviews', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Shipping', href: '#' },
      { label: 'Live chat', href: '#' }
    ]
  }
] as const;

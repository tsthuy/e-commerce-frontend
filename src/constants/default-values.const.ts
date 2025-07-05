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
  BEST_DEALS: 'Best Deals',
  POPULAR_EVENTS: 'Popular Events',
  FEATURED_PRODUCTS: 'Featured Products',
  SPONSOR: 'Our Trusted Partners'
} as const;

export const LOGO = '/images/logo/logo.svg';
export const BG = '/images/bg.avif';
export const DEFAULT_IMG_BANNER = '/images/common/banner.svg';
export const DEFAULT_IMG_AVATAR = '/images/common/no-avatar.webp';
export const DEFAULT_IMG_SAMPLE = '/images/sample.jpg';
export const DEFAULT_IMG_EMPTY = '/gifs/empty.gif';
export const DEFAULT_IMG_SEARCHING = '/gifs/searching.gif';
export const DEFAULT_IMG_SKELETONS = '/gifs/skeletons.gif';
export const DEFAULT_IMG_PLACEHOLDER = '/images/common/placeholder.webp';
export const DEFAULT_IMG_PAYMENT = '/images/footer/payment.webp';

export const MAX_PRICE_VALUE = 1000000;

export const FAQ_DATA = [
  {
    question: 'What is your return policy?',
    answer:
      "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To initiate a return, please email us at support@myecommercestore.com with your order number and a brief explanation of why you're returning the item."
  },
  {
    question: 'How do I track my order?',
    answer: 'You can track your order by clicking the tracking link in your shipping confirmation email, or by logging into your account on our website and viewing the order details.'
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can contact our customer support team by emailing us at support@myecommercestore.com, or by calling us at (555) 123-4567 between the hours of 9am and 5pm EST, Monday through Friday.'
  },
  {
    question: 'Can I change or cancel my order?',
    answer:
      "Unfortunately, once an order has been placed, we are not able to make changes or cancellations. If you no longer want the items you've ordered, you can return them for a refund within 30 days of delivery."
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Currently, we only offer shipping within the United States.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept visa, mastercard, paypal payment method also we have cash on delivery system.'
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

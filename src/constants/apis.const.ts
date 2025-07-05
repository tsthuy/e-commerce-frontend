const API_PREFIX_GENERAL = '/general';
const API_PREFIX_AUTH = '/auth';
const API_PREFIX_SELLER = '/seller';
export const API_HAVE_SLASH_IN_END = false;

export const API_URLS = {
  general: {
    upload: {
      single: {
        getPreSignLink: '/upload-policy'
      }
    }
  },
  auth: {
    signupAsCustomer: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/signup`,
    signupAsSeller: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}${API_PREFIX_SELLER}/signup`,
    login: {
      email: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/login/customer`,
      social: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/login-social`
    },
    logout: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/logout`,
    refreshToken: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/refresh-token`,
    changePassword: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/change-password`
  },
  profile: {
    getProfile: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/profile`,
    updateProfile: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/profile/update`,
    createAddress: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/profile/address`,
    deleteAddress: (addressId: string): string => `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/profile/address/${addressId}`
  },
  category: {
    getAll: '/api/categories',
    getAllPaged: '/api/categories/paged',
    create: '/api/categories',
    update: (id: string): string => `/api/categories/${id}`,
    delete: (id: string): string => `/api/categories/${id}`,
    detail: (id: string): string => `/api/categories/${id}`
  },
  product: {
    getAll: '/api/products',
    getAllPaged: '/api/products/paged',
    getSellerPaged: '/api/products/seller/paged',
    create: '/api/products',
    update: (id: string): string => `/api/products/${id}`,
    delete: (id: string): string => `/api/products/${id}`,
    detail: (id: string): string => `/api/products/${id}`
  },
  cart: {
    list: '/api/cart',
    add: '/api/cart/add',
    updateItem: (itemId: string): string => `/api/cart/items/${itemId}`,
    removeItem: (itemId: string): string => `/api/cart/items/${itemId}`,
    clear: '/api/cart/clear'
  },
  wishlist: {
    list: '/api/v1/wishlist',
    toggle: '/api/v1/wishlist/toggle',
    removeItem: (productId: string): string => `/api/v1/wishlist/items/${productId}`,
    check: (productId: string): string => `/api/v1/wishlist/check?productId=${productId}`,
    clear: '/api/v1/wishlist/clear'
  },
  order: {
    // Customer endpoints
    list: '/api/orders',
    create: '/api/orders',
    detail: (orderId: string): string => `/api/orders/${orderId}`,
    cancel: (orderId: string): string => `/api/orders/${orderId}/cancel`,

    // Seller endpoints
    sellerList: '/api/orders/seller',
    sellerDetail: (orderId: string): string => `/api/orders/seller/${orderId}`,
    updateStatus: (orderId: string): string => `/api/orders/seller/${orderId}/status`,
    statusTransitions: (orderId: string): string => `/api/orders/seller/${orderId}/status-transitions`
  }
};

export const API_ENDPOINTS = {
  // Sao chép từ API_URLS cho tương thích
  AUTH: API_URLS.auth,
  PROFILE: API_URLS.profile,
  CATEGORY: API_URLS.category,
  PRODUCT: API_URLS.product,
  CART: API_URLS.cart,
  WISHLIST: API_URLS.wishlist,
  ORDER: API_URLS.order,
  GENERAL: API_URLS.general
};

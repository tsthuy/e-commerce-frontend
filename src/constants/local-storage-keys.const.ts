const VERSION_KEY = 'V1';
const ROLE = 'ADMIN';

export const LOCAL_STORAGE_KEYS = {
  firebase: {
    fcmToken: `FCM_TOKEN_${ROLE}_${VERSION_KEY}`,
    meid: `MEID_${ROLE}_${VERSION_KEY}`
  },
  mockData: {
    products: 'PRODUCTS'
  }
};

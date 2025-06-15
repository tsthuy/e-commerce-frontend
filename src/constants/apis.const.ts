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
  }
};

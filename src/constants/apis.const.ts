const API_PREFIX_GENERAL = '/general';
const API_PREFIX_AUTH = '/auth';
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
    signup: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/signup`,
    login: {
      email: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/login`,
      social: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/login-social`
    },
    logout: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/logout`,
    refreshToken: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/refresh-token`
  },
  profile: {
    getProfile: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/profile`,
    updateProfile: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/profile/update`
  }
};

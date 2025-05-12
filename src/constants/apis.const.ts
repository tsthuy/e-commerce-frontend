const API_PREFIX_GENERAL = '/general';
const API_PREFIX_AUTH = '/authentication';
export const API_HAVE_SLASH_IN_END = true;

export const API_URLS = {
  general: {
    upload: {
      single: {
        getPreSignLink: '/upload-policy'
      }
    }
  },
  auth: {
    getStarted: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/get-started`,
    login: {
      email: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/login`,
      social: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/login-social`
    },
    logout: '/logout',
    refreshToken: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/refresh-token`
  },
  profile: {
    getProfile: `${API_PREFIX_GENERAL}${API_PREFIX_AUTH}/profile`
  }
};

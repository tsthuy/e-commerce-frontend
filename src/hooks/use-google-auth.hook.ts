/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useState } from 'react';

import { signInWithPopup } from 'firebase/auth';
import Cookie from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { toast } from 'sonner';

import { COOKIE_KEYS, COOKIE_OPTIONS } from '~/constants';

import type { GoogleOAuthRequest } from '~/types';

import { authApi } from '~/services';

import { getErrorMessage } from '~/utils';

import { PUBLIC_ROUTES, SELLER_ROUTES } from '~/routes';

import { auth, googleProvider } from '~/libs/firebase';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useHistory();

  const loginWithGoogle = async (
    authenticationType: 'CUSTOMER' | 'SELLER',
    additionalData?: {
      fullName?: string;
      shopName?: string;
      phone?: string;
    }
  ) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Firebase Google Sign In
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Prepare request data
      const requestData: GoogleOAuthRequest = {
        idToken,
        authenticationType,
        ...additionalData
      };

      // Call backend API
      const response = await authApi.loginWithGoogle({ data: requestData });

      // Backend returns: { code: 1000, result: { accessToken, refreshToken, ... } }
      if (response.data?.result) {
        const { accessToken, refreshToken, isNewUser, message } = response.data.result;

        // Save tokens
        Cookie.set(COOKIE_KEYS.accessToken, accessToken, COOKIE_OPTIONS);
        Cookie.set(COOKIE_KEYS.refreshToken, refreshToken, COOKIE_OPTIONS);

        // Show success message
        toast.success(message || 'Login successful!');

        // Redirect based on authentication type
        if (authenticationType === 'CUSTOMER') {
          push(PUBLIC_ROUTES.index.path());
        } else {
          push(SELLER_ROUTES.dashboard.path());
        }

        return { success: true, isNewUser };
      } else {
        throw new Error('Login failed - Invalid response format');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(getErrorMessage(error, 'Google login failed'));
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginWithGoogle,
    isLoading
  };
};

import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js';

import { LOCAL_STORAGE_KEYS } from '~/constants';

/**
 * Generates a unique device ID by retrieving it from local storage or creating a new one using the browser fingerprint.
 * This function is useful for identifying devices uniquely in a web application.
 *
 * @returns {Promise<string>} - A promise that resolves to the device ID.
 *                             If an existing ID is found in local storage, it returns that; otherwise, it generates a new ID.
 *
 * Example usage:
 *
 * const deviceId = await generateDeviceId();
 * log(deviceId); // Unique device ID, either from local storage or a newly generated fingerprint
 */

export async function generateDeviceId(): Promise<string> {
  const meid = localStorage.getItem(LOCAL_STORAGE_KEYS.firebase.meid);

  if (meid) return meid;

  const fingerPrint = await getCurrentBrowserFingerPrint();
  localStorage.setItem(LOCAL_STORAGE_KEYS.firebase.meid, fingerPrint);

  return fingerPrint.toString();
}

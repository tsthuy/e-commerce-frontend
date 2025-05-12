/**
 * Constructs a storage URL by concatenating the base storage URL from environment variables
 * with an optional relative URL. This function is useful for generating URLs for accessing resources
 * stored in a specified location.
 *
 * @param {string} [url] - Optional. A relative URL to append to the base storage URL.
 *                         If provided, it will be formatted to ensure it starts with a '/'.
 *
 * @returns {string} - The constructed full URL for accessing the storage resource.
 *
 * Example usage:
 *
 * const storageLink = getLinkStorage('images/photo.jpg');
 * log(storageLink); // "https://your-storage-url.com/images/photo.jpg"
 *
 * const storageLinkWithRoot = getLinkStorage('/images/photo.jpg');
 * log(storageLinkWithRoot); // "https://your-storage-url.com/images/photo.jpg"
 *
 * const storageLinkWithoutUrl = getLinkStorage();
 * log(storageLinkWithoutUrl); // "https://your-storage-url.com"
 */

export function getLinkStorage(url?: string): string {
  return `${import.meta.env.VITE_STORAGE_URL}${url ? (url.startsWith('/') ? url : `/${url}`) : ''}`;
}

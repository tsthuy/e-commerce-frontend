/**
 * Retrieves the value of a specific cookie from a cookie string.
 * This function is useful for extracting the value of a named cookie from a given cookie string, typically in a browser or server environment.
 *
 * @param {string} cookie - The full cookie string, usually from `document.cookie` or request headers.
 * @param {string} cname - The name of the cookie to retrieve.
 *
 * @returns {string} - The value of the specified cookie, or an empty string if the cookie is not found.
 *
 * Example usage:
 *
 * const cookieString = "username=JohnDoe; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/";
 * const cookieValue = getCookie(cookieString, "username");
 * log(cookieValue); // "JohnDoe"
 */

export function getCookie(cookie: string, cname: string): string {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

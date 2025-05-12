/**
 * Copies the provided content to the clipboard and optionally displays a success notification.
 * This function is useful for copying text to the clipboard programmatically in web applications.
 *
 * @param {string} content - The content to be copied to the clipboard. This can be of any type that can be converted to text.
 * @param {Function} [onSuccess] - An optional callback function that is invoked after the content is successfully
 *                                 copied to the clipboard. If not provided, no action will be taken after the copy.
 *
 * @returns {Promise<void>} - A promise that resolves once the copy operation completes, or catches any errors that occur.
 *
 * Example usage:
 *
 * copyToClipboard('Hello, world!', () => {
 *   log('Content copied successfully!');
 * });
 */

export async function copyToClipboard(content: string, onSuccess?: () => void): Promise<void> {
  try {
    navigator.clipboard.writeText(content);
    onSuccess && onSuccess();
  } catch (error) {
    console.error('copyToClipboard: ', error);
    throw error;
  }
}

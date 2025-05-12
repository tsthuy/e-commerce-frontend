import mime from 'mime-types';

/**
 * Determines the MIME type of a given file based on its filename.
 * This function is useful for identifying the type of content being handled in file uploads or downloads.
 *
 * @param {File} file - The file for which to determine the MIME type.
 *                      It should be a File object that includes a name property.
 *
 * @returns {string} - The MIME type of the file. If the type cannot be determined,
 *                    it defaults to 'application/octet-stream'.
 *
 * Example usage:
 *
 * const file = new File(['content'], 'example.png');
 * const mimeType = getMimeType(file);
 * log(mimeType); // "image/png"
 *
 * const unknownFile = new File(['content'], 'unknownfile');
 * const unknownMimeType = getMimeType(unknownFile);
 * log(unknownMimeType); // "application/octet-stream"
 */

export function getMimeType(file: File): string {
  const fileName = file.name;
  const contentType = mime.lookup(fileName);

  return contentType ? contentType : 'application/octet-stream';
}

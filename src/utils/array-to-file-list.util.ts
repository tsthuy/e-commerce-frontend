/**
 * Converts an array of Blob objects into a FileList.
 * This is useful for programmatically creating a FileList from Blob data to mimic file inputs.
 *
 * @param {Blob[]} array - An array of Blob objects to be converted into a FileList.
 *                         Each Blob can optionally have a `name` property to specify the file name.
 *
 * @returns {FileList} - A FileList object containing the files created from the Blob array.
 *
 * Example usage:
 *
 * const blob1 = new Blob(['Hello world'], { type: 'text/plain' });
 * blob1.name = 'hello.txt';
 *
 * const fileList = arrayToFileList([blob1]);
 * log(fileList); // FileList with 'hello.txt'
 */

export function arrayToFileList(array: Blob[]): FileList {
  const dataTransfer = new DataTransfer();

  array.forEach((blob: Blob & { name?: string }) => {
    const file = new File([blob], blob?.name || `file-${new Date().getTime()}`, {
      lastModified: new Date().getTime(),
      type: 'image/png'
    });

    dataTransfer.items.add(file);
  });

  return dataTransfer.files;
}

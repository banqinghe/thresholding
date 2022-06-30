/**
 * get file handle
 */
export async function getFileHandle(types: any[]) {
  const [fileHandle] = await window.showOpenFilePicker({
    types: types ?? [{ description: 'All', accept: { '*/*': ['*'] } }],
    excludeAcceptAllOption: true,
  });
  return fileHandle;
}

/**
 * verify handle read permission
 */
export async function verifyReadPermission(fileHandle: FileSystemFileHandle) {
  const options: { mode: 'read' | 'readwrite' } = { mode: 'read' };
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true;
  }
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return true;
  }
  return false;
}

/**
 * get file url
 */
async function getFileUrl(handle: FileSystemFileHandle) {
  await verifyReadPermission(handle);
  const file = await handle.getFile();
  return URL.createObjectURL(file);
}

/**
 * get image file url
 */
export async function getImageUrl() {
  const types = [
    {
      description: 'Image',
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      },
    },
  ];

  if ('showOpenFilePicker' in window) {
    const fileHandle = await getFileHandle(types);
    return getFileUrl(fileHandle);
  }

  // compatible with devices unsupported File System Access API
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = types
    .map(type =>
      Object.values(type.accept['image/*'])
        .map(v => 'image/' + v.slice(1))
        .join(',')
    )
    .join(',');

  return new Promise<string>((resolve, reject) => {
    input.onchange = () => {
      if (!input.files || input.files.length !== 1) {
        reject('<input> element get image error');
        return;
      }
      const file = input.files[0];

      const prevUrl = localStorage.getItem('currentImageUrl');
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }

      const url = URL.createObjectURL(file);

      // store url to revoke
      localStorage.setItem('currentImageUrl', url);
      resolve(url);
    };
    input.onerror = () => reject('<input> element onerror');
    input.click();
  });
}

/**
 * download image
 */
export function downloadImage(url: string) {
  const a = document.createElement('a');
  a.download = 'threshold_image_' + Date.now().toString().slice(-4);
  a.href = url;
  a.click();
}

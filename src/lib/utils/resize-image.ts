const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function resizeImageToBase64(file: File, maxSize: number): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    return Promise.reject(new Error('File quá lớn (tối đa 5MB)'));
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = maxSize;
      canvas.height = maxSize;

      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }

      const srcSize = Math.min(img.width, img.height);
      const sx = (img.width - srcSize) / 2;
      const sy = (img.height - srcSize) / 2;

      ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, maxSize, maxSize);

      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không thể đọc ảnh'));
    };

    img.src = url;
  });
}

import multer from 'multer';

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

function fileFilter(_req, file, callback) {
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Only JPEG, PNG, and WebP images are allowed');
    error.status = 400;
    callback(error);
    return;
  }

  callback(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 5);

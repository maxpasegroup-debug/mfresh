import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'node:stream';

function uploadBuffer(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `mfresh/${folder}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    Readable.from(fileBuffer).pipe(stream);
  });
}

export function uploadImage(fileBuffer, folder) {
  return uploadBuffer(fileBuffer, folder);
}

export async function deleteImage(publicId) {
  const response = await cloudinary.uploader.destroy(publicId);
  return { result: response.result };
}

export function uploadMultiple(fileBuffers, folder) {
  return Promise.all(fileBuffers.map((fileBuffer) => uploadImage(fileBuffer, folder)));
}

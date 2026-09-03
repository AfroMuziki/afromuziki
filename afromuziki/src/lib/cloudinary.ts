import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary from environment variables.
 * All secrets stay server-side.
 */
export function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export type UploadResult = {
  public_id: string;
  secure_url: string;
  duration?: number;
  format?: string;
  bytes?: number;
};

/**
 * Upload a file buffer to Cloudinary.
 * resource_type: "video" is used for audio (Cloudinary treats audio under video).
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;
    resource_type?: "image" | "video" | "raw" | "auto";
    public_id?: string;
  }
): Promise<UploadResult> {
  const cld = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resource_type || "auto",
        public_id: options.public_id,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          duration: result.duration,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "video" = "image") {
  const cld = getCloudinary();
  return cld.uploader.destroy(publicId, { resource_type: resourceType });
}

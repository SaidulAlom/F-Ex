import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '@/lib/env';

export function getCloudinary() {
  const config = cloudinaryConfig();
  if (!config) throw new Error('Cloudinary is not configured');
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });
  return { cloudinary, config };
}

export function signUpload(
  paramsToSign: Record<string, string | number | boolean | undefined>,
): string {
  const { cloudinary: client, config } = getCloudinary();
  return client.utils.api_sign_request(paramsToSign, config.apiSecret);
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

export function isDemoMode(): boolean {
  return (
    !isDatabaseConfigured() &&
    (process.env.DEMO_MODE === 'true' || process.env.NODE_ENV === 'development')
  );
}

export function isDemoAdminConfigured(): boolean {
  return Boolean(
    process.env.DEMO_OWNER_EMAIL?.trim() && process.env.DEMO_OWNER_PASSWORD?.trim(),
  );
}

export function cloudinaryConfig():
  | { cloudName: string; apiKey: string; apiSecret: string; folder: string }
  | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) return null;
  return {
    cloudName,
    apiKey,
    apiSecret,
    folder: process.env.CLOUDINARY_FOLDER?.trim() || 'f-ex-store',
  };
}

export function resendConfig():
  | { apiKey: string; from: string; to: string }
  | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.LEAD_FROM_EMAIL?.trim();
  const to = process.env.LEAD_NOTIFICATION_EMAIL?.trim();
  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}

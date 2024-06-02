import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE } = process.env;
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

type UploadFile = {
  bucket: string;
  mimeType: string;
  oldFileUrl?: string | null;
  fileBuffer: Buffer;
  updateCallback: (url: string) => Promise<void>;
};

export const uploadFile = async ({ bucket, mimeType, oldFileUrl, fileBuffer, updateCallback }: UploadFile) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(crypto.randomUUID(), fileBuffer, { contentType: mimeType });

  if (error) {
    throw error;
  }

  const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(data.path).data;

  await updateCallback(publicUrl);

  if (oldFileUrl) {
    try {
      const oldFileName = oldFileUrl.split('/').at(-1)!;
      await supabase.storage.from(bucket).remove([oldFileName]);
    } catch (error) {
      logger.error({ error }, 'Error while deleting file');
    }
  }

  return publicUrl;
};

export const deleteFiles = async ({ bucket, publicUrls }: { bucket: string; publicUrls: string[] }) => {
  const paths = publicUrls.map((publicUrl) => publicUrl.split('/').at(-1)!);

  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) {
    throw error;
  }
};

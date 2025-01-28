import { supabase } from './supabase';

export const uploadImage = async (file: File): Promise<string | null> => {
  const fileName = `${Date.now()}-${file.name}`;

  // Ensure the user is authenticated
  const session = supabase.auth.getSession();

  if (!session) {
    console.error('Supabase session not found');
    return null;
  }

  // Upload the image to the Supabase bucket
  const { error } = await supabase.storage
    .from('twitter-images')
    .upload(fileName, file);

  if (error) {
    console.error('Image upload failed:', error.message);
    return null;
  }

  // Retrieve the public URL for the uploaded image
  const { data } = supabase.storage
    .from('twitter-images')
    .getPublicUrl(fileName);

  return data?.publicUrl || null;
};

export default uploadImage;  
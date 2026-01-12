import { createClient } from "@supabase/supabase-js";

/* Supabase config (from .env) */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* Create Supabase client */
const supabase = createClient(supabaseUrl, supabaseKey);

/* Upload PDF and return public URL */
export const uploadPDF = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from("notes") // ✅ your bucket name
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("notes")
    .getPublicUrl(fileName);

  return data.publicUrl;
};

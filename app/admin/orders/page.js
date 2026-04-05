const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const bucketName = "order-artwork";

function getFileUrl(order) {
  const value =
    order.artwork_url ||
    order.publicUrl ||
    order.file_url ||
    order.artwork_path ||
    order.file_path ||
    order.filePath ||
    order.artwork;

  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${trimmed}`;
}
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/\s+/g, "-");
    const filePath = `${Date.now()}-${safeName}`;

    const { error } = await supabaseAdmin.storage
      .from("order-artwork") // ✅ CORRECT BUCKET
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage
      .from("order-artwork")
      .getPublicUrl(filePath);

    return Response.json({
      success: true,
      filePath,
      fileName: file.name,
      publicUrl: data.publicUrl,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
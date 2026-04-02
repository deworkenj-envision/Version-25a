import { supabaseAdmin } from "../../lib/supabaseAdmin";

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
      .from("order-artwork")
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return Response.json({ error: "Upload failed." }, { status: 500 });
    }

    return Response.json(
      {
        success: true,
        filePath,
        fileName: file.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload artwork route error:", error);
    return Response.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
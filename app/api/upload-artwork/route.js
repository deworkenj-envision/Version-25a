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

    const bucketName = "order-artworkworkworkwork";

    const { error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return Response.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return Response.json(
      {
        success: true,
        filePath,
        fileName: file.name,
        publicUrl: publicUrlData?.publicUrl || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload route error:", error);
    return Response.json(
      { error: "Server error during upload." },
      { status: 500 }
    );
  }
}

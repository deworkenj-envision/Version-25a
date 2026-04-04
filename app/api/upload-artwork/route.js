// FORCE DEPLOY TEST
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKeyExists = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/\s+/g, "-");
    const filePath = `${Date.now()}-${safeName}`;
    const bucket = "order-artwork";

    console.log("UPLOAD DEBUG URL:", supabaseUrl);
    console.log("UPLOAD DEBUG HAS SERVICE KEY:", serviceKeyExists);
    console.log("UPLOAD DEBUG BUCKET:", bucket);

    const { data: bucketList, error: bucketListError } =
      await supabaseAdmin.storage.listBuckets();

    console.log(
      "UPLOAD DEBUG BUCKETS:",
      bucketList?.map((b) => b.name) || []
    );

    if (bucketListError) {
      console.error("UPLOAD DEBUG listBuckets error:", bucketListError);
    }

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        {
          error: uploadError.message || "Upload failed.",
          debug: {
            supabaseUrl,
            serviceKeyExists,
            bucket,
            buckets: bucketList?.map((b) => b.name) || [],
          },
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json(
      {
        success: true,
        filePath,
        fileName: file.name,
        publicUrl,
        debug: {
          supabaseUrl,
          serviceKeyExists,
          bucket,
          buckets: bucketList?.map((b) => b.name) || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload artwork route error:", error);
    return NextResponse.json(
      { error: error.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
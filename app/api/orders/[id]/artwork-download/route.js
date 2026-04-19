import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

function getExtension(fileName = "", url = "") {
  const fromName = String(fileName).match(/\.([a-zA-Z0-9]+)$/);
  if (fromName) return fromName[1].toLowerCase();

  try {
    const pathname = new URL(url).pathname;
    const fromUrl = pathname.match(/\.([a-zA-Z0-9]+)$/);
    if (fromUrl) return fromUrl[1].toLowerCase();
  } catch {}

  return "pdf";
}

function getContentType(ext) {
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "pdf":
      return "application/pdf";
    case "ai":
      return "application/postscript";
    case "eps":
      return "application/postscript";
    case "psd":
      return "application/octet-stream";
    default:
      return "application/octet-stream";
  }
}

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams?.id;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order id." }, { status: 400 });
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, file_name, artwork_url")
      .eq("id", orderId)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (!order.artwork_url) {
      return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
    }

    const fileRes = await fetch(order.artwork_url);

    if (!fileRes.ok) {
      return NextResponse.json(
        { error: "Unable to fetch artwork file." },
        { status: 502 }
      );
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    const ext = getExtension(order.file_name, order.artwork_url);
    const downloadName = `${order.order_number || order.id}.${ext}`;
    const contentType =
      fileRes.headers.get("content-type") || getContentType(ext);

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${downloadName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Artwork download error:", error);

    return NextResponse.json(
      { error: error.message || "Download failed." },
      { status: 500 }
    );
  }
}
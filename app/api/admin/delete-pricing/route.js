import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { isAdminAuthenticated } from "../../../../lib/adminAuth";

export async function POST(req) {
  try {
    const authed = await isAdminAuthenticated();

    if (!authed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id } = body || {};

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing pricing row id." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("pricing").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || "Delete failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
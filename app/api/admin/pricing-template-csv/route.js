import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/adminAuth";

export async function GET() {
  try {
    const authed = await isAdminAuthenticated();

    if (!authed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const csv = [
      "product_name,size,paper,finish,sides,quantity,price,sort_order,active",
      "Business Cards,3.5 x 2,14pt Gloss,Gloss,Front Only,100,24.99,1,true",
      "Business Cards,3.5 x 2,14pt Gloss,Gloss,Front Only,250,39.99,2,true",
      "Flyers,8.5 x 11,100lb Gloss Text,Gloss,Front Only,100,49.99,1,true",
    ].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="pricing-template.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
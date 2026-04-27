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
      "product_name,size,paper,finish,sides,quantity,your_cost,markup_percent,shipping_cost,sort_order,active",
      "Business Cards,3.5 x 2,16pt,Matte,Front Only,100,10,50,5,1,true",
      "Business Cards,3.5 x 2,16pt,Matte,Front Only,250,18,50,7,2,true",
      "Flyers,8.5 x 11,100lb Gloss,Gloss,Front Only,100,25,40,10,1,true",
    ].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="pricing-template.csv"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";

let orders = [
  {
    id: "ORD-1001",
    customerName: "John Smith",
    product: "Business Cards",
    quantity: 500,
    total: 48.98,
    status: "Paid",
    createdAt: "2026-03-31T10:00:00.000Z",
  },
  {
    id: "ORD-1002",
    customerName: "Sarah Johnson",
    product: "Flyers",
    quantity: 250,
    total: 69.98,
    status: "Processing",
    createdAt: "2026-04-01T14:30:00.000Z",
  },
  {
    id: "ORD-1003",
    customerName: "Michael Brown",
    product: "Postcards",
    quantity: 1000,
    total: 129.99,
    status: "Shipped",
    createdAt: "2026-04-02T09:15:00.000Z",
  },
];

export async function GET() {
  try {
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const newOrder = {
      id: `ORD-${Date.now()}`,
      customerName: body.customerName || "New Customer",
      product: body.product || "Unknown Product",
      quantity: Number(body.quantity || 0),
      total: Number(body.total || 0),
      status: body.status || "Pending",
      createdAt: new Date().toISOString(),
      paperType: body.paperType || "Standard",
      finishes: body.finishes || [],
      shippingMethod: body.shippingMethod || "Ground",
      shippingPrice: Number(body.shippingPrice || 0),
      printPrice: Number(body.printPrice || 0),
      tax: Number(body.tax || 0),
    };

    orders = [newOrder, ...orders];

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = [
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

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}
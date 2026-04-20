import { supabaseAdmin } from "../../../lib/supabaseAdmin";

function safe(value) {
  return value || "—";
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function formatMoney(value) {
  const num = Number(value || 0);
  return `$${num.toFixed(2)}`;
}

export const dynamic = "force-dynamic";

export default async function PackingSlipsPage({ searchParams }) {
  const params = await searchParams;
  const idsParam = params?.ids || "";
  const ids = String(idsParam)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  let orders = [];

  if (ids.length > 0) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .in("id", ids)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Packing slips fetch error:", error);
    } else {
      const map = new Map((data || []).map((order) => [order.id, order]));
      orders = ids.map((id) => map.get(id)).filter(Boolean);
    }
  }

  return (
    <html>
      <head>
        <title>Packing Slips</title>
        <style>{`
          * {
            box-sizing: border-box;
          }

          html, body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #f4f4f5;
            color: #111827;
          }

          .toolbar {
            position: sticky;
            top: 0;
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 14px 20px;
            background: #111827;
            color: white;
            border-bottom: 1px solid #27272a;
          }

          .toolbar-left {
            font-size: 14px;
            font-weight: 600;
          }

          .toolbar-buttons {
            display: flex;
            gap: 10px;
          }

          .btn {
            border: 0;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
          }

          .btn-print {
            background: #22c55e;
            color: #000;
          }

          .btn-close {
            background: #27272a;
            color: #fff;
          }

          .container {
            padding: 24px;
          }

          .sheet {
            width: 8.5in;
            min-height: 11in;
            margin: 0 auto 24px auto;
            background: white;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            padding: 28px;
            page-break-after: always;
          }

          .sheet:last-child {
            page-break-after: auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            border-bottom: 2px solid #111827;
            padding-bottom: 14px;
            margin-bottom: 18px;
          }

          .brand h1 {
            margin: 0;
            font-size: 28px;
            line-height: 1.1;
          }

          .brand p {
            margin: 6px 0 0 0;
            color: #52525b;
            font-size: 13px;
          }

          .slip-title {
            text-align: right;
          }

          .slip-title h2 {
            margin: 0;
            font-size: 24px;
          }

          .slip-title p {
            margin: 6px 0 0 0;
            color: #52525b;
            font-size: 13px;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin-bottom: 20px;
          }

          .card {
            border: 1px solid #e4e4e7;
            border-radius: 14px;
            padding: 16px;
          }

          .card h3 {
            margin: 0 0 12px 0;
            font-size: 14px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: #52525b;
          }

          .line {
            margin-bottom: 8px;
            font-size: 14px;
          }

          .label {
            display: inline-block;
            min-width: 110px;
            color: #52525b;
            font-weight: 700;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }

          th, td {
            border: 1px solid #e4e4e7;
            padding: 10px;
            text-align: left;
            font-size: 14px;
            vertical-align: top;
          }

          th {
            background: #f4f4f5;
          }

          .notes {
            margin-top: 18px;
            border: 1px solid #e4e4e7;
            border-radius: 14px;
            padding: 16px;
          }

          .notes h3 {
            margin: 0 0 12px 0;
            font-size: 14px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: #52525b;
          }

          .footer {
            margin-top: 24px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }

          .signature {
            border-top: 1px solid #d4d4d8;
            padding-top: 10px;
            font-size: 13px;
            color: #52525b;
            min-height: 52px;
          }

          .empty {
            max-width: 900px;
            margin: 40px auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          }

          @media print {
            body {
              background: white;
            }

            .toolbar {
              display: none;
            }

            .container {
              padding: 0;
            }

            .sheet {
              margin: 0;
              box-shadow: none;
              width: 100%;
              min-height: auto;
              padding: 0.35in;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="toolbar">
          <div className="toolbar-left">
            {orders.length} Packing Slip{orders.length === 1 ? "" : "s"}
          </div>
          <div className="toolbar-buttons">
            <button className="btn btn-print" onClick={() => window.print()}>
              Print
            </button>
            <button className="btn btn-close" onClick={() => window.close()}>
              Close
            </button>
          </div>
        </div>

        <div className="container">
          {orders.length === 0 ? (
            <div className="empty">
              <h1 style={{ marginTop: 0 }}>No packing slips found</h1>
              <p style={{ color: "#52525b", marginBottom: 0 }}>
                Go back to Admin Orders, select one or more orders, then click
                <strong> Print Packing Slips</strong>.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div className="sheet" key={order.id}>
                <div className="header">
                  <div className="brand">
                    <h1>EnVision Direct</h1>
                    <p>Production Packing Slip</p>
                  </div>

                  <div className="slip-title">
                    <h2>{safe(order.order_number)}</h2>
                    <p>Created: {formatDate(order.created_at)}</p>
                  </div>
                </div>

                <div className="grid">
                  <div className="card">
                    <h3>Customer</h3>
                    <div className="line">
                      <span className="label">Name:</span>
                      {safe(order.customer_name)}
                    </div>
                    <div className="line">
                      <span className="label">Email:</span>
                      {safe(order.customer_email)}
                    </div>
                  </div>

                  <div className="card">
                    <h3>Order Summary</h3>
                    <div className="line">
                      <span className="label">Status:</span>
                      {safe(order.status)}
                    </div>
                    <div className="line">
                      <span className="label">Total:</span>
                      {formatMoney(order.total)}
                    </div>
                    <div className="line">
                      <span className="label">Order ID:</span>
                      {safe(order.id)}
                    </div>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "28%" }}>Product</th>
                      <th style={{ width: "15%" }}>Size</th>
                      <th style={{ width: "15%" }}>Paper</th>
                      <th style={{ width: "12%" }}>Finish</th>
                      <th style={{ width: "12%" }}>Sides</th>
                      <th style={{ width: "8%" }}>Qty</th>
                      <th style={{ width: "10%" }}>Artwork</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{safe(order.product_name)}</td>
                      <td>{safe(order.size)}</td>
                      <td>{safe(order.paper)}</td>
                      <td>{safe(order.finish)}</td>
                      <td>{safe(order.sides)}</td>
                      <td>{safe(order.quantity)}</td>
                      <td>{safe(order.file_name)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="notes">
                  <h3>Production Notes</h3>
                  <div style={{ fontSize: "14px", minHeight: "70px" }}>
                    {order.notes ? order.notes : "No customer notes provided."}
                  </div>
                </div>

                <div className="footer">
                  <div className="signature">
                    Packed By: ______________________________________
                  </div>
                  <div className="signature">
                    Checked By: _____________________________________
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </body>
    </html>
  );
}
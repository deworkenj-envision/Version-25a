const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.envisiondirect.net";

const LOGO_URL = `${SITE_URL}/images/logo-hero.png`;

export function getTrackingLink(carrier, trackingNumber) {
  if (!carrier || !trackingNumber) return "";

  const cleanCarrier = String(carrier).toLowerCase().trim();
  const cleanTracking = encodeURIComponent(String(trackingNumber).trim());

  if (cleanCarrier.includes("ups")) {
    return `https://www.ups.com/track?tracknum=${cleanTracking}`;
  }

  if (cleanCarrier.includes("usps")) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${cleanTracking}`;
  }

  if (cleanCarrier.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${cleanTracking}`;
  }

  return "";
}

function baseLayout({ title, preheader, contentHtml }) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${title}</title>
      </head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
          ${preheader || ""}
        </div>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">

                <!-- HEADER -->
                <tr>
                  <td style="background:linear-gradient(90deg,#1d4ed8 0%,#0ea5e9 100%);padding:16px 32px 12px;color:#ffffff;text-align:center;">
                    
                    <!-- LOGO -->
                    <div style="margin:0;text-align:center;line-height:0;">
                      <img
                        src="${LOGO_URL}"
                        alt="EnVision Direct"
                        width="340"
                        style="display:block;width:340px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;margin:0 auto;"
                      />
                    </div>

                    <!-- TAGLINE -->
                    <div style="font-size:20px;line-height:1.2;font-weight:800;text-align:center;margin:4px 0 0 0;">
                      Top Quality Printing. Fast Turnaround. The Best Prices.
                    </div>

                  </td>
                </tr>

                <!-- CONTENT -->
                <tr>
                  <td style="padding:20px 32px 30px;">
                    ${contentHtml}
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="padding:24px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                    <div style="font-size:13px;color:#475569;line-height:1.7;">
                      EnVision Direct<br/>
                      Questions? Reply to this email and we’ll help you out.
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function detailRow(label, value) {
  return `
    <tr>
      <td style="padding:10px 0;color:#64748b;font-size:14px;width:170px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:600;vertical-align:top;">${value || "-"}</td>
    </tr>
  `;
}

export function buildOrderConfirmationEmail({
  orderNumber,
  customerName,
  productName,
  size,
  paper,
  finish,
  sides,
  quantity,
  subtotal,
  shipping,
  total,
  fileName,
}) {
  const html = baseLayout({
    title: `Order Confirmation - ${orderNumber}`,
    preheader: `Your order ${orderNumber} has been confirmed.`,
    contentHtml: `
      <h1 style="margin:0 0 8px;font-size:28px;line-height:1.2;color:#0f172a;">Order Confirmed</h1>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#334155;">
        Hi ${customerName || "there"}, thanks for your order. We’ve received your payment and your job is now in our system.
      </p>

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;padding:18px 20px;margin-bottom:20px;">
        <div style="font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:#1d4ed8;font-weight:700;">Order Number</div>
        <div style="font-size:28px;font-weight:800;color:#0f172a;margin-top:6px;">${orderNumber}</div>
      </div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${detailRow("Product", productName)}
        ${detailRow("Size", size)}
        ${detailRow("Paper", paper)}
        ${detailRow("Finish", finish)}
        ${detailRow("Sides", sides)}
        ${detailRow("Quantity", quantity)}
        ${detailRow("Artwork File", fileName)}
        ${detailRow("Print Price", `$${Number(subtotal || 0).toFixed(2)}`)}
        ${detailRow("Shipping", `$${Number(shipping || 0).toFixed(2)}`)}
        ${detailRow("Total", `$${Number(total || 0).toFixed(2)}`)}
      </table>

      <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:#475569;">
        We’ll email you again when your order ships, along with your tracking details.
      </p>
    `,
  });

  return {
    subject: `Order Confirmation - ${orderNumber}`,
    html,
  };
}

export function buildShippedEmail({
  orderNumber,
  customerName,
  productName,
  carrier,
  trackingNumber,
}) {
  const trackingLink = getTrackingLink(carrier, trackingNumber);

  const buttonHtml = trackingLink
    ? `
      <div style="margin-top:20px;">
        <a href="${trackingLink}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:12px;font-weight:700;">
          Track Your Package
        </a>
      </div>
    `
    : "";

  const html = baseLayout({
    title: `Your Order Has Shipped - ${orderNumber}`,
    preheader: `Your order ${orderNumber} is on the way.`,
    contentHtml: `
      <h1 style="margin:0 0 8px;font-size:28px;color:#0f172a;">Your Order Has Shipped</h1>
      <p style="margin:0 0 20px;font-size:16px;color:#334155;">
        Hi ${customerName || "there"}, your ${productName || "order"} is on the way.
      </p>

      ${buttonHtml}
    `,
  });

  return {
    subject: `Your Order Has Shipped - ${orderNumber}`,
    html,
  };
}

export function buildDeliveredEmail({
  orderNumber,
  customerName,
  productName,
}) {
  const html = baseLayout({
    title: `Delivered - ${orderNumber}`,
    preheader: `Your order ${orderNumber} has been delivered.`,
    contentHtml: `
      <h1 style="margin:0 0 8px;font-size:28px;color:#0f172a;">Delivered</h1>
      <p style="margin:0 0 20px;font-size:16px;color:#334155;">
        Hi ${customerName || "there"}, your ${productName || "order"} has been delivered.
      </p>
    `,
  });

  return {
    subject: `Delivered - ${orderNumber}`,
    html,
  };
}
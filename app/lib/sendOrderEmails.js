import { Resend } from "resend";

export async function sendOrderEmails(order) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ORDER_ALERT_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;

  if (!apiKey || !adminEmail || !fromEmail) {
    console.warn("Email env vars are missing. Skipping email send.");
    return;
  }

  const resend = new Resend(apiKey);

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2>Thank you for your order</h2>
      <p>Your print order has been received.</p>
      <p><strong>Order Number:</strong> ${order.order_number}</p>
      <p><strong>Product:</strong> ${order.product_name}</p>
      <p><strong>Quantity:</strong> ${order.quantity}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p>We will update you as your order moves forward.</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2>New print order received</h2>
      <p><strong>Order Number:</strong> ${order.order_number}</p>
      <p><strong>Customer:</strong> ${order.customer_name}</p>
      <p><strong>Email:</strong> ${order.customer_email}</p>
      <p><strong>Product:</strong> ${order.product_name}</p>
      <p><strong>Size:</strong> ${order.size}</p>
      <p><strong>Paper:</strong> ${order.paper}</p>
      <p><strong>Finish:</strong> ${order.finish}</p>
      <p><strong>Sides:</strong> ${order.sides}</p>
      <p><strong>Quantity:</strong> ${order.quantity}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Artwork File:</strong> ${order.file_name}</p>
    </div>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: order.customer_email,
    subject: `Order Confirmation - ${order.order_number}`,
    html: customerHtml,
  });

  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New Order - ${order.order_number}`,
    html: adminHtml,
  });
}

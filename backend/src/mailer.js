// Sends notification emails to the Techtig owner inbox.
//
// Configure real credentials in .env (see .env.example) to actually deliver mail:
//   MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS   -> any SMTP provider, OR
//   GMAIL_USER, GMAIL_APP_PASSWORD               -> quick setup using a Gmail account
//                                                    (create an "App Password", not your
//                                                    normal Gmail password, at
//                                                    https://myaccount.google.com/apppasswords)
//
// If nothing is configured, emails are simply logged to the console so the app keeps
// working in local/demo mode without crashing.
const nodemailer = require("nodemailer");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "techtig9@gmail.com";

let transporter = null;
let warned = false;

function getTransporter() {
  if (transporter) return transporter;

  if (process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: Number(process.env.MAIL_PORT) === 465,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });
  } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
  }

  return transporter;
}

async function sendMail({ subject, html, text }) {
  const t = getTransporter();

  if (!t) {
    if (!warned) {
      console.warn(
        "[mailer] No email credentials configured (see backend/.env.example) — " +
          "notifications will be logged here instead of delivered to " + ADMIN_EMAIL
      );
      warned = true;
    }
    console.log(`[mailer] (not sent — no SMTP configured) To: ${ADMIN_EMAIL} | Subject: ${subject}\n${text}`);
    return { delivered: false };
  }

  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || process.env.GMAIL_USER || `"Visiting Places" <no-reply@visitingplaces.app>`,
      to: ADMIN_EMAIL,
      subject,
      text,
      html,
    });
    return { delivered: true };
  } catch (err) {
    console.error("[mailer] Failed to send email:", err.message);
    return { delivered: false, error: err.message };
  }
}

function userLine(user) {
  return `${user.name} (${user.email || user.phone})`;
}

function notifySignUp(user) {
  return sendMail({
    subject: `New sign-up — ${user.name}`,
    text: `A new account was just created on Visiting Places.\n\nName: ${user.name}\nContact: ${user.email || user.phone}\nUser ID: ${user.id}\nWhen: ${new Date().toLocaleString()}`,
    html: `<p>A new account was just created on <strong>Visiting Places</strong>.</p>
      <ul>
        <li><strong>Name:</strong> ${user.name}</li>
        <li><strong>Contact:</strong> ${user.email || user.phone}</li>
        <li><strong>User ID:</strong> ${user.id}</li>
        <li><strong>When:</strong> ${new Date().toLocaleString()}</li>
      </ul>`,
  });
}

function notifyLogIn(user) {
  return sendMail({
    subject: `Login alert — ${user.name}`,
    text: `${userLine(user)} just signed in to Visiting Places.\nWhen: ${new Date().toLocaleString()}`,
    html: `<p><strong>${userLine(user)}</strong> just signed in to Visiting Places.</p><p>When: ${new Date().toLocaleString()}</p>`,
  });
}

function notifyPaymentSubmitted({ user, plan, payment }) {
  return sendMail({
    subject: `Payment submitted for verification — ${plan.name} plan (${payment.currency === "PKR" ? "Rs. " + payment.amountRs : payment.amountRs})`,
    text: `${userLine(user)} says they paid for the ${plan.name} plan.\n\nMethod: ${payment.method}\nSender number/reference: ${payment.senderReference}\nTransaction ID: ${payment.transactionId}\nAmount: PKR ${payment.amountRs} (~US$ ${payment.amountUsd})\nPayment record ID: ${payment.id}\n\nVerify it in the Admin panel once the funds are confirmed in the JazzCash / EasyPaisa / NayaPay account.`,
    html: `<p><strong>${userLine(user)}</strong> says they paid for the <strong>${plan.name}</strong> plan.</p>
      <ul>
        <li><strong>Method:</strong> ${payment.method}</li>
        <li><strong>Sender number/reference:</strong> ${payment.senderReference}</li>
        <li><strong>Transaction ID:</strong> ${payment.transactionId}</li>
        <li><strong>Amount:</strong> PKR ${payment.amountRs} (~US$ ${payment.amountUsd})</li>
        <li><strong>Payment record ID:</strong> ${payment.id}</li>
      </ul>
      <p>Verify it in the Admin panel once the funds are confirmed in the JazzCash / EasyPaisa / NayaPay account.</p>`,
  });
}

function notifyPaymentVerified({ user, plan, payment }) {
  return sendMail({
    subject: `Payment verified — ${plan.name} plan activated for ${user.name}`,
    text: `Payment ${payment.id} for ${userLine(user)} was verified. The ${plan.name} plan (PKR ${payment.amountRs} / ~US$ ${payment.amountUsd}) is now active on their account.`,
    html: `<p>Payment <strong>${payment.id}</strong> for <strong>${userLine(user)}</strong> was verified.</p><p>The <strong>${plan.name}</strong> plan (PKR ${payment.amountRs} / ~US$ ${payment.amountUsd}) is now active on their account.</p>`,
  });
}

module.exports = {
  ADMIN_EMAIL,
  sendMail,
  notifySignUp,
  notifyLogIn,
  notifyPaymentSubmitted,
  notifyPaymentVerified,
};

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.WHATSAPP_FROM; // مثال: 'whatsapp:+14155238886'

const client = twilio(accountSid, authToken);

/**
 * إرسال رسالة واتساب للعميل بعد الحجز
 * @param {Object} options
 * @param {string} options.to رقم العميل (مثال: 'whatsapp:+9665xxxxxxx')
 * @param {string} options.body نص الرسالة
 */
export async function sendWhatsAppNotification({ to, body }) {
  if (!to || !body) return;
  try {
    await client.messages.create({
      from: whatsappFrom,
      to,
      body
    });
  } catch (error) {
    console.error('فشل إرسال إشعار واتساب:', error.message);
  }
}

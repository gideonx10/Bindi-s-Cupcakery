// src/app/api/send-message/route.ts
import twilio from "twilio";

export async function POST(request: Request) {
  const { phoneNumber, message } = await request.json();
  const accountSid: string = "ACacc7bef3837101d5e0ccea50f7497441";
  const authToken: string = "47258132e0a724a7ad737dd6ecbe369f";

  const client = twilio(accountSid, authToken);

  client.messages
    .create({
      body: message,
      from: "whatsapp:+14155238886", // Your Twilio WhatsApp number
      to: `whatsapp:${phoneNumber}`, // Recipient number
    })
    .then((message: { sid: string }) =>
      console.log(`Message sent with SID: ${message.sid}`)
    )
    .catch((error: unknown) =>
      console.error(`Error sending message: ${error}`)
    );
}

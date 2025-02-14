import QRCode from "react-qr-code";

const WhatsAppQR = ({
  phoneNumber,
  message,
}: {
  phoneNumber: string;
  message: string;
}) => {
  const generateWhatsAppLink = () => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <QRCode value={generateWhatsAppLink()} size={200} />
      <a
        href={generateWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        Open in WhatsApp
      </a>
    </div>
  );
};

export default WhatsAppQR;

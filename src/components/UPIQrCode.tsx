import React from "react";
import { QRCodeCanvas } from "qrcode.react";

interface UPIQrCodeProps {
  upiId: string;
  name?: string;
  amount?: number;
}

const UPIQrCode: React.FC<UPIQrCodeProps> = ({ upiId, name, amount }) => {
  const upiUrl = `upi://pay?pa=${upiId}&pn=${name || "Merchant"}&am=${
    amount || 0
  }&cu=INR`;

  return (
    <div className="flex flex-col items-center p-4">
      <QRCodeCanvas value={upiUrl} size={250} /> {/* ✅ Correct component */}
    </div>
  );
};

export default UPIQrCode;

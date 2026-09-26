import { QRCodeSVG } from "qrcode.react"; // Импортируем SVG версию

interface PageQRCodeProps {
  bgColor: string;
  fgColor: string;
}

export const PageQRCode = ({ bgColor, fgColor }: PageQRCodeProps) => {
  return (
    <div>
      <QRCodeSVG
        id="page-qr-code-svg"
        value={window.location.href}
        size={300}
        bgColor={bgColor}
        fgColor={fgColor}
        level={"H"}
        marginSize={5}
      />
    </div>
  );
};

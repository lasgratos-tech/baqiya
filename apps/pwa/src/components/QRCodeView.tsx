import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

type Props = {
  value: string;
};

export default function QRCodeView({ value }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 240;

    QRCode.toCanvas(
      canvas,
      value,
      {
        width: size,
        margin: 1,
        errorCorrectionLevel: 'H' // IMPORTANT pour logo central
      },
      (err) => {
        if (err) return console.error(err);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 🔲 Fond blanc central
        const boxSize = 70;
        const center = size / 2;

        ctx.fillStyle = 'white';
        ctx.fillRect(
          center - boxSize / 2,
          center - boxSize / 2,
          boxSize,
          boxSize
        );

        // ✍️ Texte BAQIYA
        ctx.fillStyle = 'black';
        ctx.font = 'bold 14px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BAQIYA', center, center);
      }
    );
  }, [value]);

  return <canvas ref={canvasRef} />;
}

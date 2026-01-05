import { useEffect, useRef } from 'react';
import * as QRCode from 'qrcode';

type Props = {
  value: string;
};

export default function QRCodeView({ value }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      JSON.stringify({ code: value }),
      {
        width: 220,
        margin: 1,
        errorCorrectionLevel: 'H'
      }
    ).catch((err) => {
      console.error('[BAQIYA] QR generation failed', err);
    });
  }, [value]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

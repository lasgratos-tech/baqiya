import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

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
        margin: 1
      }
    );
  }, [value]);

  return <canvas ref={canvasRef} />;
}

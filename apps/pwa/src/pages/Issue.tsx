import { useState } from 'react';
import BigButton from '../components/BigButton';
import QRCodeView from '../components/QRCodeView';

const API_URL = import.meta.env.VITE_API_URL;

// ⚠️ V3 : valeurs fixes (admin plus tard)
const MERCHANT_ID = 'BAQ-0001';
const CURRENCY = 'MAD';
const MAX_AMOUNT = 20;

// 🌍 Langue automatique (FR / AR darija)
const lang = navigator.language.startsWith('ar') ? 'ar' : 'fr';

const t = {
  fr: {
    title: 'Rendre la monnaie',
    amountPlaceholder: `Montant (max ${MAX_AMOUNT} Dh)`,
    generate: 'Générer',
    invalidAmount: `Montant invalide (max ${MAX_AMOUNT} Dh)`,
    signed: 'QR signé serveur • expiration automatique',
    brand: 'BAQIYA'
  },
  ar: {
    title: 'إرجاع الباقي',
    amountPlaceholder: `المبلغ (حد أقصى ${MAX_AMOUNT} درهم)`,
    generate: 'إصدار',
    invalidAmount: `المبلغ غير صالح (حد أقصى ${MAX_AMOUNT} درهم)`,
    signed: 'رمز مؤمَّن من الخادم • صالح لمدة محدودة',
    brand: 'باقية'
  }
}[lang];

export default function Issue() {
  const [amount, setAmount] = useState('');
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [qrPayload, setQrPayload] = useState<any>(null);
  const [displayCode, setDisplayCode] = useState<string | null>(null);

  async function submit() {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0 || numericAmount > MAX_AMOUNT) {
      alert(t.invalidAmount);
      return;
    }

    // Reset UI
    setQrValue(null);
    setQrPayload(null);
    setDisplayCode(null);

    try {
      const res = await fetch(`${API_URL}/qr/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          merchant_id: MERCHANT_ID,
          amount: numericAmount,
          currency: CURRENCY
        })
      });

      if (!res.ok) {
        throw new Error('QR_SIGN_FAILED');
      }

      const signedQr = await res.json();

      // UI uniquement
      setQrPayload(signedQr.payload);
      setDisplayCode(signedQr.payload.nonce.slice(0, 6).toUpperCase());
      setQrValue(JSON.stringify(signedQr));
      setAmount('');
    } catch (err) {
      console.error('[BAQIYA] QR generation failed', err);
      alert('Erreur');
    }
  }

  return (
    <>
      <h2>{t.title}</h2>

      <input
        type="number"
        min="0"
        max={MAX_AMOUNT}
        step="0.5"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={t.amountPlaceholder}
      />

      <BigButton onClick={submit}>{t.generate}</BigButton>

      {qrValue && qrPayload && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <h3>{t.brand}</h3>

          {/* Code court lisible */}
          <div style={{ fontSize: 28, letterSpacing: 4, marginBottom: 6 }}>
            {displayCode}
          </div>

          {/* Montant + devise */}
          <div style={{ fontSize: 16, marginBottom: 12 }}>
            {qrPayload.amount} {qrPayload.currency}
          </div>

          <QRCodeView value={qrValue} />

          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
            {t.signed}
          </div>
        </div>
      )}
    </>
  );
}

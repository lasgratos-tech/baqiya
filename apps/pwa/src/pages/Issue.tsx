import { useState } from 'react';
import BigButton from '../components/BigButton';
import QRCodeView from '../components/QRCodeView';
import { enqueueTask } from '../offline/queue';
import { sync } from '../offline/sync';

// V1 simple : merchant_id local (plus tard configurable)
const MERCHANT_ID =
  localStorage.getItem('merchant_id') || 'BAQ-0001';

export default function Issue() {
  const [amount, setAmount] = useState('');
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [displayCode, setDisplayCode] = useState<string | null>(null);

  async function submit() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔹 Payload QR structuré (V1)
    const payload = {
      v: 1,
      brand: 'BAQIYA',
      merchant_id: MERCHANT_ID,
      code
    };

    // ✅ UI IMMÉDIATE (OFFLINE-FIRST)
    setDisplayCode(code);
    setQrPayload(JSON.stringify(payload));
    setAmount('');

    try {
      const task = {
        type: 'CHANGE_ISSUE',
        offline_id: crypto.randomUUID(),
        payload: {
          amount_snaps: Number(amount),
          client_code: code,
          merchant_id: MERCHANT_ID
        }
      };

      await enqueueTask(task);
      await sync();
    } catch (err) {
      console.error('[BAQIYA] Sync failed, ticket kept offline', err);
      // ❗ On ne bloque JAMAIS l’UI
    }
  }

  return (
    <>
      <h2>Rendre la monnaie</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Montant"
      />

      <BigButton onClick={submit}>Générer</BigButton>

      {qrPayload && displayCode && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <h3>BAQIYA</h3>

          <div style={{ fontSize: 32, letterSpacing: 4, marginBottom: 8 }}>
            {displayCode}
          </div>

          <QRCodeView value={qrPayload} />

          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
            Magasin : {MERCHANT_ID}
          </div>
        </div>
      )}
    </>
  );
}

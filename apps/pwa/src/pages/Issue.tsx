import { useState } from 'react';
import BigButton from '../components/BigButton';
import QRCodeView from '../components/QRCodeView';
import { enqueueTask } from '../offline/queue';
import { sync } from '../offline/sync';

export default function Issue() {
  const [amount, setAmount] = useState('');
  const [lastCode, setLastCode] = useState<string | null>(null);

  async function submit() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ 1. AFFICHAGE IMMÉDIAT (AVANT RÉSEAU)
    setLastCode(code);
    setAmount('');

    try {
      const task = {
        type: 'CHANGE_ISSUE',
        offline_id: crypto.randomUUID(),
        payload: {
          amount_snaps: Number(amount),
          client_code: code
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

      {lastCode && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <h3>BAQIYA</h3>

          <div style={{ fontSize: 32, letterSpacing: 4, marginBottom: 12 }}>
            {lastCode}
          </div>

          <QRCodeView value={lastCode} />
        </div>
      )}
    </>
  );
}

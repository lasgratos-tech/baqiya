import { useState } from 'react';
import BigButton from '../components/BigButton';
import QRCodeView from '../components/QRCodeView';
import { enqueueTask } from '../offline/queue';
import { sync } from '../offline/sync';
import { v4 as uuid } from 'uuid';

export default function Issue() {
  const [amount, setAmount] = useState('');
  const [lastCode, setLastCode] = useState<string | null>(null);

  async function submit() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const task = {
      type: 'CHANGE_ISSUE',
      offline_id: uuid(),
      payload: {
        amount_snaps: Number(amount),
        client_code: code
      }
    };

    await enqueueTask(task);
    await sync();

    setLastCode(code);
    setAmount('');
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
          <h3>Code</h3>
          <div style={{ fontSize: 32, letterSpacing: 4 }}>
            {lastCode}
          </div>

          <div style={{ marginTop: 16 }}>
            <QRCodeView value={lastCode} />
          </div>
        </div>
      )}
    </>
  );
}

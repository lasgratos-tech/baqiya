import { useState } from 'react';
import BigButton from '../components/BigButton';
import { enqueueTask } from '../offline/queue';
import { sync } from '../offline/sync';
import { v4 as uuid } from 'uuid';

export default function Issue() {
  const [amount, setAmount] = useState('');

  async function submit() {
    const task = {
      type: 'CHANGE_ISSUE',
      offline_id: uuid(),
      payload: { amount_snaps: Number(amount) }
    };

    await enqueueTask(task);
    await sync();
    alert('Ticket généré');
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
    </>
  );
}

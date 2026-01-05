import { useState } from 'react';
import BigButton from '../components/BigButton';
import { enqueueTask } from '../offline/queue';
import { sync } from '../offline/sync';
import { v4 as uuid } from 'uuid';

export default function Use() {
  const [code, setCode] = useState('');

  async function submit() {
    const task = {
      type: 'CHANGE_USE',
      offline_id: uuid(),
      payload: { code }
    };

    await enqueueTask(task);
    await sync();
    alert('Ticket utilisé');
    setCode('');
  }

  return (
    <>
      <h2>Utiliser un ticket</h2>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Code à 6 chiffres"
      />
      <BigButton onClick={submit}>Valider</BigButton>
    </>
  );
}

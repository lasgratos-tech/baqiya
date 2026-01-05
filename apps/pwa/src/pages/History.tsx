import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function History() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/merchant/history').then(setItems);
  }, []);

  return (
    <>
      <h2>Historique</h2>
      <ul>
        {items.map((t) => (
          <li key={t.id}>
            {t.amountSnaps} — {t.status}
          </li>
        ))}
      </ul>
    </>
  );
}

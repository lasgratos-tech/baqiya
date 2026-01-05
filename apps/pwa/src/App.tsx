import { useState } from 'react';
import Issue from './pages/Issue';
import Use from './pages/Use';
import History from './pages/History';

export default function App() {
  const [page, setPage] = useState<'issue' | 'use' | 'history'>('issue');

  return (
    <div style={{ padding: 16 }}>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setPage('issue')}>Rendre</button>
        <button onClick={() => setPage('use')}>Utiliser</button>
        <button onClick={() => setPage('history')}>Historique</button>
      </nav>

      {page === 'issue' && <Issue />}
      {page === 'use' && <Use />}
      {page === 'history' && <History />}
    </div>
  );
}

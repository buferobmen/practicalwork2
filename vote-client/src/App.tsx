import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from './api';
import { cable } from './cable';
import { Poll, Vote } from './types';
import EditPollPage from './pages/EditPollPage';
import PollDetailsPage from './pages/PollDetailsPage';
 // імпортуємо нову сторінку

function PollPage() {
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    api.get<Poll>('/polls/1').then((res) => setPoll(res.data));
  }, []);

  useEffect(() => {
    if (!poll) return;

    const subscription = cable.subscriptions.create(
      { channel: 'PollChannel', poll_id: poll.id },
      {
        received: (data: Vote) => {
          setPoll((prev) => {
            if (!prev) return prev;
            return { ...prev, votes: [...prev.votes, data] };
          });
        },
      }
    );

    return () => subscription.unsubscribe();
  }, [poll?.id]);

  const handleVote = (option: string) => {
    api.post('/votes', {
      vote: { poll_id: poll?.id, option },
    });
  };

  const getCount = (option: string) =>
    poll?.votes.filter((v) => v.option === option).length ?? 0;

  if (!poll) return <p>Loading...</p>;

  const uniqueOptions = Array.from(new Set(poll.votes.map((v) => v.option)));

  return (
    <div>
      <h1>{poll.title}</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {uniqueOptions.map((option) => (
          <button key={option} onClick={() => handleVote(option)}>
            {option} ({getCount(option)})
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
           {/* маршрут для перегляду голосування */}
        <Route path="/polls/:id" element={<PollDetailsPage />} />

        {/* маршрут для редагування голосування */}
        <Route path="/polls/:id/edit" element={<EditPollPage />} />

        {/* інші маршрути, наприклад головна сторінка */}
        <Route path="/" element={<div>Головна сторінка</div>} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from './api';
import { cable } from './cable';
import { Poll, Vote } from './types';
import EditPollPage from './pages/EditPollPage';
import PollDetailsPage from './pages/PollDetailsPage';
import HomePage from './pages/HomePage';

// Компонент сторінки голосування
function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    api.get<Poll>(`/polls/${id}`).then((res) => setPoll(res.data));
  }, [id]);

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
    api.post(`/polls/${id}/vote`, { option });
  };

  const getCount = (option: string) =>
    poll?.votes.filter((v) => v.option === option).length ?? 0;

  if (!poll) return <p>Завантаження...</p>;

  const uniqueOptions = poll.options;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{poll.title}</h1>
      <div className="flex flex-col gap-2 mb-4">
        {uniqueOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleVote(option)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {option} ({getCount(option)})
          </button>
        ))}
      </div>
    </div>
  );
}

// Головний компонент з маршрутами
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/polls/:id/vote" element={<PollPage />} />
        <Route path="/polls/:id" element={<PollDetailsPage />} />
        <Route path="/polls/:id/edit" element={<EditPollPage />} />
      </Routes>
    </Router>
  );
}

export default App;

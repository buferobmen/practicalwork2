import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { Poll } from "../types"; // або звідки ти його визначив


export default function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/polls/${id}`).then((res) => setPoll(res.data));
  }, [id]);

 const handleVote = (option: string) => {
  api.post(`/polls/${id}/vote`, { option }).then(() => {
    // Після голосування оновлюємо дані голосування
    api.get<Poll>(`/polls/${id}`).then((res) => setPoll(res.data));
  });
};

  if (!poll) return <div>Завантаження...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{poll.title}</h1>
      <div className="flex flex-col gap-2 mb-4">
     {poll.options.map((opt: string, index: number) => (
  <button
    key={index}
    onClick={() => handleVote(opt)}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    {opt} ({poll.votes?.[opt] || 0} голосів)
  </button>
))}

      </div>
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}

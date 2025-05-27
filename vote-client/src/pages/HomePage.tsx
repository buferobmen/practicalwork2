// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { api } from "../api";
import { Poll } from "../types";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    api.get("/polls").then((res) => setPolls(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Список голосувань</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Назва</th>
            <th className="p-2 border">Дата створення</th>
            <th className="p-2 border">Кількість варіантів</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <tr key={poll.id}>
              <td className="p-2 border">
                <Link to={`/polls/${poll.id}`} className="text-blue-500 hover:underline">
                  {poll.title}
                </Link>
              </td>
              <td className="p-2 border">
                {new Date(poll.created_at).toLocaleDateString()}
              </td>
              <td className="p-2 border">{poll.options.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Poll {
  id: number;
  title: string;
  options: string[];
}

const PollDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Для редагування title і options
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/api/v1/polls/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Помилка при завантаженні голосування');
        return res.json();
      })
      .then(data => {
        setPoll(data);
        setTitle(data.title);
        setOptions(data.options || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Не вдалося завантажити голосування');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!poll) return <p>Голосування не знайдено</p>;

  // Функції для зміни опцій
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Відправка оновлених даних на сервер
  const handleSave = () => {
    fetch(`http://localhost:3000/api/v1/polls/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        poll: {
          title,
          options,
        },
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Помилка при оновленні');
        return res.json();
      })
      .then(() => {
        alert('Голосування оновлено!');
        navigate('/'); // редірект кудись, наприклад на головну
      })
      .catch(() => {
        alert('Не вдалося оновити голосування');
      });
  };

  return (
    <div>
      <h2>Редагувати голосування</h2>

      <label>
        Питання:
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </label>

      <h3>Опції:</h3>
      {options.map((option, i) => (
        <div key={i} style={{ marginBottom: '8px' }}>
          <input
            type="text"
            value={option}
            onChange={e => handleOptionChange(i, e.target.value)}
            style={{ width: '300px' }}
          />
          <button onClick={() => handleRemoveOption(i)}>Видалити</button>
        </div>
      ))}

      <button onClick={handleAddOption}>Додати опцію</button>
      <br />
      <br />

      <button onClick={handleSave}>Зберегти</button>
    </div>
  );
};

export default PollDetailsPage;

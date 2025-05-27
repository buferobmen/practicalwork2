import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditPollPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
   fetch(`http://localhost:3000/api/v1/polls/${id}`)

      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setOptions(data.options || ['']);
        setLoading(false);
      })
      .catch(() => {
        setError('Не вдалося завантажити голосування.');
        setLoading(false);
      });
  }, [id]);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (filteredOptions.length < 2) {
      setError('Мінімум 2 непорожні опції');
      return;
    }

   fetch(`http://localhost:3000/api/v1/polls/${id}`, {
  method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, options: filteredOptions }),
    })
      .then((res) => {
        if (res.ok) {
          navigate(`/polls/${id}`);
        } else {
          setError('Не вдалося оновити голосування.');
        }
      })
      .catch(() => {
        setError('Помилка зʼєднання з сервером.');
      });
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Редагувати голосування</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Назва:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Опції:</label>
          {options.map((opt, index) => (
            <input
              key={index}
              type="text"
              value={opt}
              onChange={e => handleOptionChange(index, e.target.value)}
              style={{ display: 'block', marginBottom: '0.5rem' }}
            />
          ))}
          <button type="button" onClick={() => setOptions([...options, ''])}>
            ➕ Додати опцію
          </button>
        </div>
        <button type="submit">💾 Зберегти</button>
      </form>
    </div>
  );
};

export default EditPollPage;

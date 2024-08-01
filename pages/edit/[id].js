import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function EditEntry() {
  const router = useRouter();
  const { id } = router.query;
  const [entry, setEntry] = useState(null);
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    async function fetchEntry() {
      if (id) {
        const res = await fetch('/api/entries');
        const entries = await res.json();
        const foundEntry = entries.find(e => e.id === id);
        if (foundEntry) {
          setEntry(foundEntry);
          setDate(foundEntry.date);
          setContent(foundEntry.content);
        }
      }
    }

    fetchEntry();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedEntry = { id, date, content };
    await fetch('/api/entries', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEntry),
    });
    router.push(`/${id}`);
  };

  if (!entry) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Entry</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </label>
        <br />
        <button type="submit">Update Entry</button>
      </form>
    </div>
  );
}

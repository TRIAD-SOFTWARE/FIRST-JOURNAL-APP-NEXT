import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';

export default function NewEntry() {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEntry = {
      id: uuidv4(),
      date,
      title,
      content,
      mood,
      tags: tags.split(',').map(tag => tag.trim())
    };
    await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    });
    router.push('/');
  };

  return (
    <div>
      <h1>ADD NEW ENTRY</h1>
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
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
        <label>
          Mood:
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
        </label>
        <br />
        <label>
          Tags (comma separated):
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
}

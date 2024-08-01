import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditEntry() {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      async function fetchEntry() {
        const res = await fetch(`/api/entries/${id}`);
        if (res.ok) {
          const entry = await res.json();
          setDate(entry.date);
          setTitle(entry.title);
          setContent(entry.content);
          setMood(entry.mood);
          setTags(entry.tags.join(', '));
          setIsEditing(true);
        }
      }

      fetchEntry();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const entryData = {
      id: isEditing ? id : uuidv4(), // Use existing ID for update or generate a new one
      date,
      title,
      content,
      mood,
      tags: tags.split(',').map(tag => tag.trim())
    };
    const method = isEditing ? 'PUT' : 'POST';
    const res = await fetch(`/api/entries/${isEditing ? id : ''}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });
    if (res.ok) {
      router.push('/');
    } else {
      console.error('Failed to save entry');
    }
  };

  return (
    <div>
      <h1>{isEditing ? 'Edit Entry' : 'Add New Entry'}</h1>
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
        <button type="submit">{isEditing ? 'Update Entry' : 'Add Entry'}</button>
      </form>
    </div>
  );
}

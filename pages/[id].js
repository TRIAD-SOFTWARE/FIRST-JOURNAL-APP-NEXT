import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link component from Next.js
import styles from './styles.css'; // Import your styles

const EntryDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (id) {
      async function fetchEntry() {
        const res = await fetch(`/api/entries/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEntry(data);
          setDate(data.date);
          setTitle(data.title);
          setContent(data.content);
          setMood(data.mood);
          setTags(data.tags.join(', '));
          setIsLoading(false);
        } else {
          console.error('Failed to fetch entry');
          setIsLoading(false);
        }
      }

      fetchEntry();
    }
  }, [id]);

  const handleDelete = async () => {
    const res = await fetch(`/api/entries/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      router.push('/');
    } else {
      console.error('Failed to delete entry');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedEntry = {
      id,
      date,
      title,
      content,
      mood,
      tags: tags.split(',').map(tag => tag.trim())
    };
    const res = await fetch(`/api/entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEntry),
    });
    if (res.ok) {
      setEntry(updatedEntry); // Update local state
      setIsEditing(false); // Exit edit mode
    } else {
      console.error('Failed to update entry');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!entry) {
    return <div>Entry not found</div>;
  }

  return (
    <div className="container">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
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
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div className="entry-detail">
          <h1 className="entry-title">{entry.title}</h1>
          <div className="entry-date">Date: {entry.date}</div>
          <div className="entry-mood">Mood: {entry.mood}</div>
          <div className="entry-tags">Tags: {entry.tags.join(', ')}</div>
          <div className="entry-content">{entry.content}</div>
          <button onClick={handleDelete}>Delete Entry</button>
          <button onClick={() => setIsEditing(true)}>Edit Entry</button>
          <Link href="/" passHref>
            <button id="back-to-home">Back to Home</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EntryDetail;

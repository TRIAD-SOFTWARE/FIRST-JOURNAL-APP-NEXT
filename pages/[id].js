import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/styles.css'

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
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  if (!entry) {
    return <div className="text-center text-lg text-red-500">Entry not found</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mood:</label>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma separated):</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-gray-700 bg-gray-200 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 uppercase">{entry.title}</h1>
          <div className="text-md text-gray-500 uppercase">Date: {entry.date}</div>
          <div className="text-md text-gray-500 uppercase">Mood: {entry.mood}</div>
          <div className="text-smd text-gray-500 uppercase">Tags: {entry.tags.join(', ')}</div>
          <div className="text-gray-700 uppercase border-2 border-black rounded-lg px-4 py-4">{entry.content}</div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Entry
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 shadow-sm hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Entry
            </button>
            <Link href="/" passHref>
              <button
                className="inline-flex items-center px-4 py-2 rounded-md  bg-gradient-to-r from-red-500 to-purple-700 text-white font-bold text-lg transition-transform transform hover:bg-purple-700 hover:scale-105"
              >
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryDetail;

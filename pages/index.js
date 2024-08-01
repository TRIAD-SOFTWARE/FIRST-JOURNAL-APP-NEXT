import Link from 'next/link';
import { useEffect, useState } from 'react';
import './styles.css';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    async function fetchEntries() {
      const res = await fetch('/api/entries');
      const data = await res.json();
      setEntries(data);
    }

    fetchEntries();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredEntries(
      entries.filter(entry =>
        entry.tags.some(tag => tag.toLowerCase().includes(query)) ||
        entry.mood.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, entries]);

  return (
    <div className="container">
      <div id="page-title">
        <h1>YOUR HANDY & VERY PORTABLE JOURNAL/DIARY</h1>
      </div>
      <div id="search-bar">
        <input 
          type="text"
          placeholder="Search by tags or mood..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <br></br>
      <div id="add-entry">
        <Link href="/newEntry" passHref>
          <button>
            Add New Entry
          </button>
        </Link>
      </div>
      <ul>
        {filteredEntries.map(entry => (
          <li key={entry.id}>
            <Link href={`/${entry.id}`} passHref>
              <div className="entry-item">
                <div className="entry-title">{entry.title}</div>
                <div className="entry-tags">DATE: {entry.date}</div>
                <div className="entry-tags">MOOD: {entry.mood}</div>
                <div className="entry-tags">TAGS: {entry.tags.join(', ')}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

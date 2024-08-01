import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../styles/styles.css';

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
    <div className="bg-container flex flex-col items-center p-5 max-w-full h-screen overflow-y-auto">
      <div id="page-title" className="text-center mb-5 text-white font-extrabold text-5xl shadow-md p-4 rounded-md bg-none ">
        YOUR HANDY & VERY PORTABLE JOURNAL/DIARY
      </div>
      <div id="search-bar" className="mb-5 w-full max-w-lg">
        <input 
          type="text"
          placeholder="Search by tags or mood..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-2 border-purple-300 rounded-lg px-4 py-2 text-lg w-full"
        />
      </div>
      <div id="add-entry" className="mb-5">
        <Link href="/newEntry" passHref>
          <button className="rounded-md px-6 py-3 bg-gradient-to-r from-red-500 to-purple-700 text-white font-bold text-lg transition-transform transform hover:bg-purple-700 hover:scale-105 uppercase">
            Add New Entry
          </button>
        </Link>
      </div>
      <ul className="list-none p-0 w-full max-w-screen-lg">
        {filteredEntries.map(entry => (
          <li key={entry.id} className="mb-5">
            <Link href={`/${entry.id}`} passHref>
              <div className="flex flex-col items-center border-2 border-purple-700 rounded-lg shadow-lg p-6 bg-none transition-transform transform hover:translate-y-[-5px] hover:shadow-xl uppercase">
                <div className="text-white text-4xl font-bold mb-2 uppercase text-center">
                  {entry.title}
                </div>
                <div className="text-white text-lg font-bold text-center mb-2">DATE: {entry.date}</div>
                <div className="text-white text-lg font-bold text-center mb-2">MOOD: {entry.mood}</div>
                <div className="text-white text-lg font-bold text-center">TAGS: {entry.tags.join(', ')}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

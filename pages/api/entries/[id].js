import fs from 'fs';
import path from 'path';

const entriesPath = path.join(process.cwd(), 'data', 'entries.json');

async function getEntries() {
  const fileContents = fs.readFileSync(entriesPath, 'utf8');
  return JSON.parse(fileContents);
}

async function writeEntries(entries) {
  fs.writeFileSync(entriesPath, JSON.stringify(entries, null, 2));
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const entries = await getEntries();
    const entry = entries.find(entry => entry.id === id);
    if (entry) {
      res.status(200).json(entry);
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } else if (req.method === 'PUT') {
    const updatedEntry = req.body;
    const entries = await getEntries();
    const index = entries.findIndex(entry => entry.id === id);
    if (index !== -1) {
      entries[index] = updatedEntry;
      await writeEntries(entries);
      res.status(200).json(updatedEntry);
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } else if (req.method === 'DELETE') {
    const entries = await getEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id);
    await writeEntries(updatedEntries);
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

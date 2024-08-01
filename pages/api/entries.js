import fs from 'fs';
import path from 'path';

const entriesPath = path.join(process.cwd(), 'data', 'entries.json');

export async function getEntries() {
  const fileContents = fs.readFileSync(entriesPath, 'utf8');
  return JSON.parse(fileContents);
}

export async function writeEntries(entries) {
  fs.writeFileSync(entriesPath, JSON.stringify(entries, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const entries = await getEntries();
    res.status(200).json(entries);
  } else if (req.method === 'POST') {
    const newEntry = req.body;
    const entries = await getEntries();
    entries.push(newEntry);
    await writeEntries(entries);
    res.status(201).json(newEntry);
  } else if (req.method === 'PUT') {
    const updatedEntry = req.body;
    const entries = await getEntries();
    const index = entries.findIndex(e => e.id === updatedEntry.id);
    if (index !== -1) {
      entries[index] = updatedEntry;
      await writeEntries(entries);
      res.status(200).json(updatedEntry);
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const entries = await getEntries();
    const updatedEntries = entries.filter(e => e.id !== id);
    await writeEntries(updatedEntries);
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { readAndAppend, writeToFile } = require('./fsUtils.js');
const uuid = require('./uuid.js');

const PORT = process.env.PORT || 3001;
const app = express();
const notesDB = './db.json';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/api/notes', async (req, res) => {
  try {
    const data = await fs.readFile(notesDB, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get notes' });
  }
});


app.post('/api/notes', async (req, res) => {
  const { title, text } = req.body;

  console.log('Received POST request:', req.body); // Debugging log

  if (title && text) {
    const newNote = { title, text, id: uuid() };
    await readAndAppend(newNote, notesDB);

    res.json({ status: 'Note posted successfully.', body: newNote });
  } else {
    res.status(400).json('Error in posting note.');
  }
});


app.delete('/api/notes/:id', async (req, res) => {
  try {
    const data = await fs.readFile(notesDB, 'utf8');
    const notesData = JSON.parse(data);
    const filteredNotes = notesData.filter(note => note.id !== req.params.id);

    if (notesData.length === filteredNotes.length) {
      return res.status(404).json('Note not found.');
    }

    await writeToFile(notesDB, filteredNotes);
    res.json({ status: 'Note deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/notes.html'));
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
// app/api/notes/route.js

let notes = []; // temporary in-memory store

export async function GET() {
  return Response.json(notes);
}

export async function POST(request) {
  const newNote = await request.json();
  newNote.id = Date.now(); // simple unique id
  notes.push(newNote);
  return Response.json({ message: "Note saved", note: newNote });
}

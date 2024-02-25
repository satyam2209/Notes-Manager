// -----------------using then and catch---------------

// export function fetchNotes() {
//     return fetch('http://localhost:8001/notes')
//       .then((response) => {
//         if (!response.ok) throw new Error('Unable to fetch Notes!');
//         return response.json();
//       })
//       .then((data) => {
//         return data;
//       })

// }

// ---------------using async await--------------

// ---------------- Notes.js ----------------
// export async function fetchNotes() {
//     const response = await fetch('http://localhost:8001/notes');
//     if(!response.ok) {
//         const error = new Error('Error occured while fetching notes');
//         error.code = response.status;
//         // error.message = await response.json();
//         error.message = error.code === 404 ? 'Something went wrong' : await response.json();
//         throw error;
//     }
//     return await response.json();
// }

// ------ by repeating this code everytime we should take a better approach ---------
// ---------- creating a common function to handle responses --------

// --------------------------------------------------------------------------------------------------------------------------

// ----- common handle response function ---------

async function handleResponse(response) {
  if (!response.ok) {
    const error = new Error("Error occured while fetching notes");
    error.code = response.status;
    error.message =
      error.code === 404 ? "Something went wrong" : await response.json();
    throw error;
  }
  return await response.json();
}

// ----- Notes.js ---------
export async function fetchNotes({ signal }) {
  const response = await fetch("http://localhost:8001/notes", { signal });
  return await handleResponse(response);
}

// ------ FindNote.js ---------
export async function searchNotes(searchTerm) {
  const response = await fetch(
    `http://localhost:8001/search?query=${searchTerm}`,
  );
  return await handleResponse(response);
}

// -------- NewNote.js -------------
export async function addNewNote(note) {
  const response = await fetch("http://localhost:8001/notes", {
    method: "POST",
    headers: {
      "content-Type": "applications/json",
    },
    body: JSON.stringify({
      title: note.title,
      description: note.description,
    }),
  });

  return await handleResponse(response);
}

// ----------- ViewNote.js  &&  EditNote.js ---------
export async function fetchNoteById({ id, signal }) {
  const response = await fetch(`http://localhost:8001/notes/${id}`, { signal });
  return await handleResponse(response);
}

// ----------- EditNote.js ---------------
export async function updateNote({ id, payload }) {
  const response = await fetch(`http://localhost:8001/notes/${id}/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
    }),
  });

  return await handleResponse(response);
}

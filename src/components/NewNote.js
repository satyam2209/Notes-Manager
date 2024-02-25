import React from "react";
import { useNavigate } from "react-router-dom";
import NoteForm from "./NoteForm";
import { useMutation } from "@tanstack/react-query";
import { addNewNote } from "../utility/http";
import ErrorBlock from "./ErrorBlock";
import { queryClient } from "../utility/queryClient";

const NewNote = () => {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: addNewNote,
    onSuccess: () => {
      // when new data add then all cached data refreshed
      queryClient.invalidateQueries({        
        queryKey: ['notes'],
        // exact: true,   // this is for only update queries related to this querykey
      })
      navigate('/')
    }
  });

  const noteSubmissionHandler = (note) => {
    mutate(note);
  };

  return (
    <div className="new-note-container">
      <h1>Add Note!</h1>
      {isError && <ErrorBlock message={error.message}/>}
      <NoteForm onSubmit={noteSubmissionHandler} />
      {isPending && 'Sending data to backend!'}
    </div>
  );
};
export default NewNote;

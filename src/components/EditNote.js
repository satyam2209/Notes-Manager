import React from "react";
import { redirect, useNavigate, useNavigation, useParams, useSubmit } from "react-router-dom";
import LoadingBlock from "./LoadingBlock";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchNoteById, updateNote } from "../utility/http";
import { queryClient } from "../utility/queryClient";
import ErrorBlock from "./ErrorBlock";
import NoteForm from "./NoteForm";

const EditNote = () => {
  const navigate = useNavigate();
  const params = useParams();
  const submit = useSubmit();
  const navigation = useNavigation();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", { id: params.id }],
    // queryFn: () => fetchNoteById,
    queryFn: ({ signal }) => fetchNoteById({ signal, id: params.id }),
    staleTime: 10 * 1000, // 10 seconds
  });

  // const { mutate } = useMutation({
  //   mutationFn: updateNote,
  //   // onSuccess: () => {
  //   //   queryClient.invalidateQueries({
  //   //     queryKey: ["notes", { id: params.id }],
  //   //   });
  //   // },
  //   // firstly update data on ui and after update on server and if server fail to request update then revert back with previous data on ui
  //   onMutate: async (data) => {
  //     const note = data.payload;
  //     // cancelling query to avoid server data
  //     await queryClient.cancelQueries({
  //       queryKey: ["notes", { id: params.id }],
  //     });
  //     // getting previous data (note)
  //     const previousNote = queryClient.getQueryData([
  //       "notes",
  //       { id: params.id },
  //     ]);
  //     queryClient.setQueryData(["notes", { id: params.id }], note);
  //     return {
  //       previousNote,
  //     };
  //   },
  //   onSuccess: () => {
  //     console.log("note has been updated successfully");
  //   },
  //   onError: (error, data, context) => {
  //     queryClient.setQueryData(
  //       ["notes", { id: params.id }],
  //       context.previousNote,
  //     );
  //     console.error("Note failed to update", error);
  //   },
  //   onSettled: () => {
  //     // query invalidate - UI + backend => sync
  //     queryClient.invalidateQueries({
  //       queryKey: ["notes", { id: params.id }],
  //     });
  //   },
  // });

  const noteSubmissionHandler = (note) => {
    // mutate({ id: params.id, payload: note });
    // navigate(`/view-note/${params.id}`);
    console.log(note);
    submit(note, {
      method: 'PUT',
    });
  };

  let content = "fetching notes....";

  if (isLoading) {
    content = <LoadingBlock />;
  }

  if (isError) {
    content = <ErrorBlock message={error.message} />;
  }

  if (data) {
    content = <NoteForm data={data} onSubmit={noteSubmissionHandler} />;
  }

  return (
    <div className="new-note-container">
      <h1>Edit Note!</h1>
      {content}
      {navigation.state === 'submitting' && 'please wait...'}
    </div>
  );
};
export default EditNote;

export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ["notes", { id: params.id }],
    queryFn: ({ signal }) => fetchNoteById({ signal, id: params.id }),
  });
}

export async function action({ request, params }){
   const formData = await request.formData();
   const updatedNoteData = Object.fromEntries(formData);
   await updateNote({ id: params.id, payload: updatedNoteData});
   // update the cache related to notes
   await queryClient.invalidateQueries(['notes']);
   return redirect(`/view-notes/${params.id}`);
}




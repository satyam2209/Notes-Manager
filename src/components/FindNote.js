import {  useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ErrorBlock from './ErrorBlock';
import LoadingBlock from './LoadingBlock';
import Note from './Note';
import { searchNotes } from '../utility/http';
import { useDebounce } from './useDebounce';

const FindNote = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedvalue = useDebounce(searchTerm, 800);   // for waiting in search 

  const { data = [], isLoading, isError, error} = useQuery({
    // queryKey: ['notes', {searchTerm}],
    queryKey: ['notes', { mySearchTerm: debouncedvalue}],
    queryFn: () => searchNotes(searchTerm),
    // enabled: searchTerm.length > 0,
    // enabled: !!searchTerm,
    enabled: !!debouncedvalue,
    staleTime: 1000 * 30,
  })

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  let content = 'Type anything to search notes!';

  if(isLoading){
    content = <LoadingBlock/>
  }

  if(isError){
    content = <ErrorBlock message={error.message}/>
  }

  if(data){
    content = data.map((note) => <Note key={note.id} note={note} />)
  }


  return (
    <div className='find-note-container'>
      <input type='text' placeholder='Search notes' value={searchTerm} onChange={handleSearch} />
      <div className='search-results-container'>
        {content}
      </div>
    </div>
  );
};

export default FindNote;

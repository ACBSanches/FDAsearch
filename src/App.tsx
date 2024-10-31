
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import "./App.css"

interface Reaction {
  term: string;
  count: number;
}

function App() {
  const [searchValue,setSearchValue] = useState<string>('');
  const [searchResults,setSearchResults]=useState<Reaction[]>();
  
  const [debounceSearchInput] = useDebounce(searchValue,1000)
  
  const url = `https://api.fda.gov/drug/event.json?search=patient.drug.openfda.brand_name:"`;

  useEffect(() => {
    const fetchData = async () => {
      if(searchValue.trim() === ''){
        setSearchResults([]);
        return;
      }

      try{
        const response = await fetch (url + debounceSearchInput + `"+patient.drug.openfda.generic_name:"` + debounceSearchInput + `"&count=patient.reaction.reactionmeddrapt.exact`);
        const data = await response.json();
        setSearchResults(data.results);
        console.log(data)
        console.log(searchResults)
      }catch(error){
        console.error(error)
      }
    }

    fetchData();
  },[debounceSearchInput])

  return (
    <div className='App'>
      <header>
                  <h1>Vericantion of adverse reaction to drugs</h1>
                  <h2>Based on Open FDA data</h2>
      </header>
      <div>
      <label className='drug-input'>Inform the drug name: </label>
        <input 
          value={searchValue} 
          type='search' 
          placeholder='Drug name'
          onChange={(e) => setSearchValue(e.target.value)}      
        />
        <div>
          {searchResults?.length ? searchResults.map(item => (
            <li>{item.term} - Noted: {item.count} times.</li>
          )):''}
        </div>
      </div>
    </div>
  );
}

export default App;

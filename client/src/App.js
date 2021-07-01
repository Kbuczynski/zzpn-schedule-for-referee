import { useState } from "react";

function App() {
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch(`/api/schedule/${name}`)
      .then(res => res.json())
      .then(data => {
        setSchedule(data);
        setIsLoading(false);
        setIsError(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      })
  }

  return (
    <div className="App">
      <form>
        <input type="text" placeholder="Kowalski J" onChange={(e) => setName(e.target.value)} autoFocus />
        <button onClick={handleClick} type="submit">Wyszukaj</button>
      </form>


      {
        isLoading && <p>Trwa ładowanie...</p>
      }

      {
        isError && <p>Brak szukanej osoby w obsadzie lub błąd wyszukiwania</p>
      }

      {
        schedule?.map(({ hosts, guests, date, hour, main_referee, assistant_referee_one, assistant_referee_two, address }) => {
          return <div key={hosts + guests}>
            <h1>{hosts} vs {guests}</h1>
            <p>{hour} {date}</p>
            <p>Główny sędzia: {main_referee}</p>
            <p>Asystent 1: {assistant_referee_one}</p>
            <p>Asystent 2: {assistant_referee_two}</p>
            <p>{address}</p>
          </div>
        })
      }
    </div>
  );
}

export default App;

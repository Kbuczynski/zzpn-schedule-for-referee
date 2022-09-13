import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch(`/api/schedule/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
        setIsLoading(false);
        setIsError(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <form>
        <label>Szukaj po nazwie klubu lub nazwisku sędziego: </label>
        <input
          type="text"
          placeholder="Kowalski J"
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <button onClick={handleClick} type="submit">
          Wyszukaj
        </button>
      </form>

      {isLoading && <p>Trwa ładowanie...</p>}

      {isError && <p>Brak szukanej osoby w obsadzie lub błąd wyszukiwania.</p>}

      {schedule.matches?.map((match) => {
        return (
          <div key={match.hosts + match.guests}>
            <h1>
              {match.hosts} vs {match.guests}
            </h1>
            <p>
              {match.hour} {match.date}
            </p>
            <p>Główny sędzia: {match.main_referee}</p>
            <p>Asystent nr 1: {match.assistant_referee_one}</p>
            <p>Asystent nr 2: {match.assistant_referee_two}</p>
            <p>{match.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;

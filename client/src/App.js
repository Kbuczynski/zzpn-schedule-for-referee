import { useState } from "react";

function App() {
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState([]);

  const handleClick = () => {
    fetch(`/api/schedule/${name}`)
        .then((res) => res.json())
        .then((data) => setSchedule(data));
  }
  return (
    <div className="App">
      <input type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)}/>
      <button onClick={handleClick}>Wyszukaj</button>

        {
            schedule?.map(({ hosts, guests, date, hour, main_referee, assistant_referee_one, assistant_referee_two, address }) => {
                return <div key={hosts+guests}>
                    <h1>{ hosts } vs { guests }</h1>
                    <p>{ hour } { date }</p>
                    <p>Główny sędzia: { main_referee }</p>
                    <p>Asystent 1: { assistant_referee_one }</p>
                    <p>Asystent 2: { assistant_referee_two }</p>
                    <p>{ address }</p>
                </div>
            })
        }
    </div>
  );
}

export default App;

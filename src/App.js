import { useState } from "react";


function App() {
  const [query, setQuery] = useState("تهران");
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState({ name: "", population: "" });
  const [weekDays, setWeekDays] = useState([])

  return (
    <div className="App">
      <h1>Hello world</h1>
    </div>
  );
}

export default App;

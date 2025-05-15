import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [timezones, setTimezones] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);

  // list of timezones
  useEffect(() => {
    axios
      .get('https://datetimebackend.runasp.net/Time/GetTimeZones') 
      .then((response) => {
        // console.log("Fetched Timezones:", response.data);
        setTimezones(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching timezones", error);
      });
  }, []);

  
  const onTimezoneChange = (event) => {
    const selectedZone = event.target.value; //selected timezone

    if (!selectedZone) {
      setSelectedTime(null); // If no timezone is selected, reset the displayed time
      return;
    }

    //true while fetching time for the selected timezone
    setLoading(true);

    // Fetch the time for the selected timezone
    axios
      .get(`https://datetimebackend.runasp.net/Time/GetDateTime?timeZoneId=${encodeURIComponent(selectedZone)}`)
      .then((response) => {
        // console.log("Fetched Time:", response.data);
        setSelectedTime(response.data); 
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching time", error);
        setLoading(false); 
        setSelectedTime(null);
      });
  };

  return (
    <div className="App">
      <h1>World Time Zones</h1>

      <label htmlFor="timezone">Select a Timezone:</label>
      <select id="timezone" onChange={onTimezoneChange} defaultValue="">
        <option value="">-- Choose a timezone --</option>
        {timezones && timezones.length > 0 ? (
          timezones.map((tz, index) => (
            <option key={index} value={tz}>
              {tz}
            </option>
          ))
        ) : (
          <option value="">No timezones available</option>
        )}
      </select>

      {loading && <p>Loading...</p>}

      {selectedTime && !loading && (
        <div>
          <h3>Time in {selectedTime.timeZone}:</h3>
          <p>{selectedTime.dateTime}</p>
        </div>
      )}
    </div>
  );
}

export default App;

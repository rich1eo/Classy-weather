import { useEffect, useState } from 'react';
import { convertToFlag } from './utils/utils';
import Input from './components/Input';
import Weather from './components/Weather';

function App() {
  const [location, setLocation] = useState('');
  const [displayLocation, setDisplayLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState({});

  useEffect(() => {
    setLocation(localStorage.getItem('location') || '');
  }, []);

  useEffect(() => {
    if (location.length <= 2) {
      setWeather({});
      localStorage.removeItem('location');
      return;
    }

    async function fetchWeather() {
      try {
        setIsLoading(true);
        localStorage.setItem('location', location);

        // 1) Getting location (geocoding)
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );
        const geoData = await geoRes.json();
        console.log(geoData);

        if (!geoData.results) throw new Error('Location not found');

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);
        setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

        // 2) Getting actual weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData.daily);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWeather();
  }, [location]);

  function handleLocationChange(event) {
    setLocation(event.target.value);
  }

  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <Input location={location} onChangeLocation={handleLocationChange} />
      {isLoading && <p className="loader">Loading...</p>}
      {weather.weathercode && (
        <Weather weather={weather} location={displayLocation} />
      )}
    </div>
  );
}

export default App;

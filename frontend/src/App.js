import React, { useState } from 'react';
import { CloudIcon, SearchIcon } from 'lucide-react';

function App() {
  const [location, setLocation] = useState('');
  const [searchType, setSearchType] = useState('city');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9/5) + 32);

  const formatTemperature = (celsius) => {
    return isCelsius ? `${Math.round(celsius)}°C` : `${celsiusToFahrenheit(celsius)}°F`;
  };

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Only capitalize if it's a city search
    if (searchType === 'city') setLocation(capitalizeWords(value));

    // Don't modify the input for zip code
     else setLocation(value); 
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/get_weather?location=${encodeURIComponent(location)}&type=${searchType}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
      } else {
        setError(data.error || 'Failed to fetch weather data');
      }
    } catch (err) {
      setError('Failed to connect to weather service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 py-6 flex flex-col items-center">
      <div className="w-full max-w-md">

        {/* Search Section */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <CloudIcon className="mr-2 text-blue-400" /> Weather App
            </h1>

            {/* Temp toggle button */}
            <button
              onClick={() => setIsCelsius(!isCelsius)}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm font-medium text-gray-200"
            >
              Switch to {isCelsius ? '°F' : '°C'}
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex rounded-md shadow-sm" role="group">

              {/* Search by city button */}
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border focus:outline-none ${
                  searchType === 'city'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                } rounded-l-lg`}
                onClick={() => setSearchType('city')}
              >
                Search by City
              </button>
              
              {/* Search by zip button */}
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border focus:outline-none ${
                  searchType === 'zip'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                } rounded-r-lg`}
                onClick={() => setSearchType('zip')}
              >
                Search by ZIP
              </button>
            </div>
            
            {/* Search bar and submit button */}
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={handleInputChange}
                placeholder={searchType === 'city' ? "Enter city name..." : "Enter ZIP code..."}
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Loading...' : <SearchIcon size={20} />}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {/* Weather Display */}
        {weather && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="text-center mb-6">

              {/* Location name */}
              <h2 className="text-3xl font-bold text-white mb-2">
                {weather.location.name}
              </h2>

              {/* Weather description */}
              <div className="flex items-center justify-center gap-2">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather.icon}@2x.png`}
                  alt={weather.weather.description}
                  className="w-12 h-12"
                />
                <p className="text-gray-300">
                  {weather.weather.main} - {weather.weather.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              {/* Temperature display */}
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">Temperature</p>
                <p className="text-4xl font-bold text-blue-400">
                  {formatTemperature(weather.weather.temperature.current)}
                </p>
                <p className="text-sm text-gray-400">
                  Feels like {formatTemperature(weather.weather.temperature.feels_like)}
                </p>
              </div>

              {/* Humidity display */}
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">Humidity</p>
                <p className="text-4xl font-bold text-blue-400">
                  {weather.weather.humidity}%
                </p>
              </div>

              {/* Min and max temp display */}
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">Min/Max</p>
                <p className="text-xl font-bold text-blue-400">
                  {formatTemperature(weather.weather.temperature.min)} / {formatTemperature(weather.weather.temperature.max)}
                </p>
              </div>

              {/* Wind speed display */}
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">Wind Speed</p>
                <p className="text-xl font-bold text-blue-400">
                  {weather.weather.wind.speed} m/s
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
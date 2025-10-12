function getWeatherIcon(code) {
  const iconMap = {
    0: 'icon-sunny.webp',
    1: 'icon-partly-cloudy.webp',
    2: 'icon-partly-cloudy.webp',
    3: 'icon-overcast.webp',
    45: 'icon-fog.webp',
    48: 'icon-fog.webp',
    51: 'icon-drizzle.webp',
    53: 'icon-drizzle.webp',
    55: 'icon-drizzle.webp',
    56: 'icon-drizzle.webp',
    57: 'icon-drizzle.webp',
    61: 'icon-drizzle.webp',
    63: 'icon-drizzle.webp',
    65: 'icon-drizzle.webp',
    66: 'icon-drizzle.webp',
    67: 'icon-drizzle.webp',
    71: 'icon-snow.webp',
    73: 'icon-snow.webp',
    75: 'icon-snow.webp',
    77: 'icon-snow.webp',
    80: 'icon-rain.webp',
    81: 'icon-rain.webp',
    82: 'icon-rain.webp',
    85: 'icon-snow.webp',
    86: 'icon-snow.webp',
    95: 'icon-storm.webp',
    96: 'icon-storm.webp',
    99: 'icon-storm.webp'
  };
  return iconMap[code] || 'icon-overcast.svg';
}

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  return descriptions[code] || 'Unknown weather';
}

function formatTemp(temp) {
  return `${Math.round(temp)}°C`;
}

function formatWind(value) {
  return `${Math.round(value)} km/h`;
}

function formatPrecipitation(value) {
  return `${Math.round(value)} mm`;
}

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}&` +
    `current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation&` +  
    `hourly=temperature_2m,weather_code&` +
    `daily=weather_code,temperature_2m_max,temperature_2m_min&` +
    `timezone=auto`;

  try {
    const response = await fetchWithTimeout(url, {});
    if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log("Fetch request was aborted");
    }
    throw error;
  }
}

async function getCoordinates(city) {
  if (!city || typeof city !== 'string' || city.trim() === '') {
    throw new Error('Invalid city name');
  }

  try {
    const encodedCity = encodeURIComponent(city.trim());
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=en&format=json`;

    const response = await fetchWithTimeout(url, {});
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.results) || data.results.length === 0) {
      throw new Error(`No geocoding results for: "${city}"`);
    }

    const result = data.results[0];
    if (result.latitude == null || result.longitude == null) {
      throw new Error("Invalid geocoding response: missing coordinates");
    }
    
    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
      name: data.results[0].name,
      country: data.results[0].country
    }; 
  } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Geocoding request timed out`);
      }
      throw error;
  }
}

function renderDailyWeather(daily) {
  if (!daily || !Array.isArray(daily.time)) {
    throw new Error('Invalid daily weather data');
  }

  const items = document.querySelectorAll('.daily-forecast__item');
  if (items.length === 0) {
    console.warn('No daily forecast elements found');
    return;
  }

  items.forEach((item, i) => {
    const apiDate = new Date(daily.time[i]);
    
    const dayName = apiDate.toLocaleDateString('en-US', { weekday: 'short' });

    const icon = getWeatherIcon(daily.weather_code[i]);
    const high = formatTemp(daily.temperature_2m_max[i]);
    const low = formatTemp(daily.temperature_2m_min[i]);
    
    item.querySelector('.daily-forecast__day').textContent = dayName;
    item.querySelector('.daily-forecast__icon').src = `/assets/images/${icon}`;
    item.querySelector('.daily-forecast__icon').alt = getWeatherDescription(daily.weather_code[i]);
    item.querySelector('.daily-forecast__high').textContent = high;
    item.querySelector('.daily-forecast__low').textContent = low;
  });
}

function renderCurrentWeather(current, location) {
  if (!current || typeof current !== 'object' || !location || typeof location !== 'object') {
    throw new Error('Invalid current weather or location data');
  }

  const weatherInfoEl = document.querySelector('.weather__info');
  const icon = getWeatherIcon(current.weather_code);

  const currentDate = new Date(current.time);
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  weatherInfoEl.innerHTML = `
    <section class="weather__location">
      <h2>${location.name}, ${location.country}</h2>
      <p class="weather__date">${formattedDate}</p>
    </section>
    <section class="weather__temperature">
      <img src="/assets/images/${icon}" alt="Current weather" class="weather__icon">
      <p class="weather__degrees">${formatTemp(current.temperature_2m, true)}</p>
    </section>
  `;
    
  const metrics = document.querySelectorAll('.key-metrics__value');
  metrics[0].textContent = formatTemp(current.temperature_2m, true); // Feels like
  metrics[1].textContent = `${Math.round(current.relative_humidity_2m)}%`; // Humidity
  metrics[2].textContent = formatWind(current.wind_speed_10m, true); // Wind
  metrics[3].textContent = formatPrecipitation(current.precipitation, true); // Precipitation
}

async function initApp() {
  const coords = await getCoordinates('London');
  const weather = await fetchWeather(coords.latitude, coords.longitude);
  console.log(weather, coords); // NEED TO REMOVE

  renderDailyWeather(weather.daily);
  renderCurrentWeather(weather.current, coords);
}

document.addEventListener('DOMContentLoaded', initApp);
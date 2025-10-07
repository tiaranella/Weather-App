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
    const response = await fetchWithTimeout(url, {}, 5000);
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

    const response = await fetchWithTimeout(url, {}, 5000);
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
        throw new Error(`Geocoding request timed out after ${TIMEOUT_DURATION}ms`);
      }
      throw error;
  }
}

async function initApp() {
  const coords = await getCoordinates('London');
  const weather = await fetchWeather(coords.latitude, coords.longitude);
  console.log(weather, coords);
}

document.addEventListener('DOMContentLoaded', initApp);
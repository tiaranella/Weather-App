async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}&` +
    `current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation&` +  
    `hourly=temperature_2m,weather_code&` +
    `daily=weather_code,temperature_2m_max,temperature_2m_min&` +
    `timezone=auto`;

  const controller = new AbortController();
  const { signal } = controller;
  const TIMEOUT_DURATION = 5000;

  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    const response = await fetch(url, { signal });

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
  } finally {
    clearTimeout(timeoutId);
  }
}

async function initApp() {
  const weather = await fetchWeather(51.5072, 0.1276); // Search for London
  console.log(weather);
}

document.addEventListener('DOMContentLoaded', initApp);
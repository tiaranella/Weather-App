export function getWeatherIcon(code) {
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

export function getWeatherDescription(code) {
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

export function formatTemp(temp, unit = 'celsius') {
    const rounded = Math.round(temp);
    return unit === 'fahrenheit' ? `${Math.round((temp * 9/5) + 32)}°F` : `${rounded}°C`;
}

export function formatWind(value, unit = 'kmh') {
    return unit === 'mph' ? `${Math.round(value * 0.621371)} mph` : `${Math.round(value)} km/h`;
}

export function formatPrecipitation(value, unit = 'mm') {
    if (value == null) value = 0;
    return unit === 'inch' ? `${(value * 0.0393701).toFixed(2)} inch` : `${Math.round(value)} mm`;
}
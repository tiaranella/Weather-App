import { fetchWithTimeout } from '../utils/fetchUtils.js';

export class WeatherService {
    async fetchWeather(lat, lon) {
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

    async getCoordinates(city) {
        if (!city || typeof city !== 'string' || city.trim() === '') {
            throw new Error('Invalid search query');
        }
        
        try {
            const encodedQuery = encodeURIComponent(city.trim());
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedQuery}&count=1&language=en&format=json`;
            const response = await fetchWithTimeout(url, {});

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!Array.isArray(data.results) || data.results.lenght === 0) {
                throw new Error(`No geocoding results for: "${city}"`);
            }

            const result = data.results[0];
            if (result.latitude == null || result.longitude == null) {
                throw new Error(`Invalid geocoding response: missing coordinates`);
            }

            return {
                latitude: result.latitude,
                longitude: result.longitude,
                name: result.name,
                country: result.country
            };
        } catch(error) {
            if (error.name === 'AbortError') {
                throw new Error(`Geocoding request timed out`);
            }
        }
    }

    async fetchGeocodingResults(query, count = 1) {
        if (!query || typeof query !== 'string' || query.trim() === '') {
            throw new Error('Invalid search query');
        }

        try {
            const encodedQuery = encodeURIComponent(query.trim());
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedQuery}&count=${count}&language=en&format=json`;
            const response = await fetchWithTimeout(url, {});

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!Array.isArray(data.results) || data.results.length === 0) {
                throw new Error(`No geocoding results for: "${query}"`);
            }

            return data.results;
        } catch(error) {
            if (error.name === 'AbortError') {
                throw new Error('Geocoding request timed out');
            }
            throw error;
        }
    }

    async searchLocation(city) {
        const coords = await this.getCoordinates(city);
        const weather = await this.fetchWeather(coords.latitude, coords.longitude);

        return { ...weather, location: coords };
    }
}

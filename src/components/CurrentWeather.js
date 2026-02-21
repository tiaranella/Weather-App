import { getWeatherIcon, formatTemp, formatWind, formatPrecipitation } from "../utils/WeatherUtils.js";

export class CurrentWeather {
    constructor() {
        this.container = document.querySelector('.weather__info');
        this.metrics = document.querySelectorAll('.key-metrics__value');
    }

    render(data, units) {
        const { current, location } = data;
        if (!current || !location) return;

        const icon = getWeatherIcon(current.weather_code);
        const currentDate = new Date(current.time);
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        this.container.innerHTML = `
            <section class="weather__location">
                <h2>${location.name}, ${location.country}</h2>
                <p class="weather__date">${formattedDate}</p>
            </section>
            <section class="weather__temperature">
                <img src="./assets/images/${icon}" alt="Current weather" class="weather__icon">
                <p class="weather__degrees">${formatTemp(current.temperature_2m, units?.temperature)}</p>
            </section>
        `;

        if (this.metrics.length >= 4) {
            this.metrics[0].textContent = formatTemp(current.temperature_2m, units?.temperature);
            this.metrics[1].textContent = `${Math.round(current.relative_humidity_2m)}%`;
            this.metrics[2].textContent = formatWind(current.wind_speed_10m, units?.wind);
            this.metrics[3].textContent = formatPrecipitation(current.precipitation, units?.precipitation);
        }
    }
}

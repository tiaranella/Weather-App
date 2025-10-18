import { getWeatherIcon, formatTemp, getWeatherDescription } from "../WeatherUtils";

export class HourlyForecast {
    constructor() {
        this.items = document.querySelectorAll('.hourly-forecast__item');
    }

    render(hourly, timezone) {
        if (!hourly || !hourly.time || this.items.length === 0) return;

        const now = new Date();
        const startIndex = hourly.time.findIndex(time => new Date(time) >= now);

        if (startIndex === -1) {
            this.items.forEach(item => item.style.display = 'none');
            return;
        }

        this.items.forEach((item, i) => {
            const idx = startIndex + i;
            if (idx >= hourly.time.length) {
                item.computedStyleMap.display = 'none';
                return;
            }

            try {
                const time = new Date(hourly.time[idx]);
                item.querySelector('.hourly-forecast__time').textContent = time.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    hour12: true,
                    timeZone: timezone
                });
                item.querySelector('.hourly-forecast__temp').textContent = formatTemp(hourly.temperature_2m[idx]);

                const icon = getWeatherIcon(hourly.weather_code[idx]);
                const desc = getWeatherDescription(hourly.weather_code[idx]);
                const iconEl = item.querySelector('.hourly-forecast__icon');

                iconEl.src = `/assets/images/${icon}`;
                iconEl.alt = desc;
                item.style.display = 'flex';
            } catch (error) {
                console.error(`Error rendering hourly forecast item`, error);
                item.style.display = 'none';
            }
        });
    }
}
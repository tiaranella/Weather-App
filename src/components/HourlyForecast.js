import { getWeatherIcon, formatTemp, getWeatherDescription } from "../utils/WeatherUtils.js";

export class HourlyForecast {
    constructor() {
        this.items = document.querySelectorAll('.hourly-forecast__item');
    }

    render(hourly, timezone, units, dayIndex = 0) {
        if (!hourly || !hourly.time || this.items.length === 0) return;

        const today = new Date();
        let startIndex = 0;

        if (dayIndex === 0) {
            const currentHour = today.getHours();
            for(let i = 0; i < hourly.time.length; i++) {
                const forecastDate = new Date(hourly.time[i]);
                if (forecastDate.getDate() === today.getDate() && forecastDate.getHours() >= currentHour) {
                    startIndex = i;
                    break;
                }
            }
        } else {
            const startDay = new Date(today);
            startDay.setDate(today.getDate() + dayIndex);
            startDay.setHours(0, 0, 0, 0);

            for(let i = 0; i < hourly.time.length; i++) {
                const forecastDate = new Date(hourly.time[i]);
                if (forecastDate.toDateString() === startDay.toDateString()) {
                    startIndex = i;
                    break;
                }
            }
        }

        this.items.forEach((item, i) => {
            const idx = startIndex + i;
            if (idx >= hourly.time.length) {
                item.style.display = 'none';
                return;
            }

            try {
                const time = new Date(hourly.time[idx]);
                item.querySelector('.hourly-forecast__time').textContent = time.toLocaleTimeString('en-US', {
                    hour: 'numeric', hour12: true, timeZone: timezone
                });
                item.querySelector('.hourly-forecast__temp').textContent = formatTemp(hourly.temperature_2m[idx], units?.temperature);

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
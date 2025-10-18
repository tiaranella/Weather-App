import { getWeatherIcon, formatTemp, getWeatherDescription } from "../WeatherUtils";

export class DailyForecast {
    constructor() {
        this.items = document.querySelectorAll('.daily-forecast__item');
    }

    render(daily) {
        if (!daily || !Array.isArray(daily.time) || this.items.length === 0) return;

        this.items.forEach((item, i) => {
            if (i >= daily.time.length) return;

            const apiDate = new Date(daily.time[i]);
            const dayName = apiDate.toLocaleDateString('en-US', { weekday: 'short' });
            const icon = getWeatherIcon(daily.weather_code[i]);

            item.querySelector('.daily-forecast__day').textContent = dayName;
            item.querySelector('.daily-forecast__icon').src = `/assets/images/${icon}`;
            item.querySelector('.daily-forecast__icon').alt = getWeatherDescription(daily.weather_code[i]);
            item.querySelector('.daily-forecast__high').textContent = formatTemp(daily.temperature_2m_max[i]);
            item.querySelector('.daily-forecast__low').textContent = formatTemp(daily.temperature_2m_min[i]);
        });
    }
}
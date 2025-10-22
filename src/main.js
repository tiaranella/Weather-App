import { WeatherService } from "./services/WeatherService.js";
import { Search } from "./components/Search.js";
import { CurrentWeather } from "./components/CurrentWeather.js";
import { DailyForecast } from "./components/DailyForecast.js";
import { HourlyForecast } from "./components/HourlyForecast.js";
import { Dropdown } from "./components/Dropdown.js";

class App {
    constructor() {
        this.service = new WeatherService();
        this.state = {
            units: {
                temperature: localStorage.getItem('tempUnit') || 'celsius',
                wind: localStorage.getItem('windUnit') || 'kmh',
                precipitation: localStorage.getItem('precipUnit') || 'mm'
            },
            selectedDayIndex: 0,
            weatherData: null
        };
        this.components = {
            search: null,
            current: new CurrentWeather(),
            daily: new DailyForecast(),
            hourly: new HourlyForecast(),
            dropdown: null
        };
    }

    async handleSearch(query) {
        try {
            const data = await this.service.searchLocation(query);
            this.state.weatherData = data;
            this.renderAll();
        } catch (error) {
            console.error(`App search error:`, error);
        }
    }

    handleUnitChange(type, value) {
        if (type === 'system') {
            const isMetric = this.state.units.temperature === 'celsius';
            this.state.units = isMetric ? 
                { temperature: 'fahrenheit', wind: 'mph', precipitation: 'inch' } :
                { temperature: 'celsius', wind: 'kmh', precipitation: 'mm' };
        } else {
            this.state.units[type] = value;
        }
        Object.keys(this.state.units).forEach(key => localStorage.setItem(`${key}Unit`, this.state.units[key]));
        
        // Notify dropdown to update checkmarks and buttons
        if (this.components.dropdown) {
            this.components.dropdown.updateUnitUI(this.state.units);
        }

        this.renderAll();
    }

    handleDayChange(dayIndex) {
        this.state.selectedDayIndex = dayIndex;
        if (!this.state.weatherData) return;
        
        this.components.daily.render(this.state.weatherData.daily, this.state.selectedDayIndex, this.state.units);
        this.components.hourly.render(this.state.weatherData.hourly, this.state.weatherData.timezone, this.state.units, this.state.selectedDayIndex);
    }

    renderAll() {
        if (!this.state.weatherData) return;
        const { weatherData, units, selectedDayIndex } = this.state;
        this.components.current.render(weatherData, units);
        this.components.daily.render(weatherData.daily, selectedDayIndex, units);
        this.components.hourly.render(weatherData.hourly, weatherData.timezone, units, selectedDayIndex);
    }

    init() {
        this.components.search = new Search(this.handleSearch.bind(this));
        this.components.dropdown = new Dropdown(this.handleUnitChange.bind(this), this.handleDayChange.bind(this));
        this.components.dropdown.updateUnitUI(this.state.units); // Initial UI update

        this.handleSearch('London');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
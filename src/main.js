import { WeatherService } from "./services/WeatherService.js";
import { Search } from "./components/Search.js";
import { CurrentWeather } from "./components/CurrentWeather.js";
import { DailyForecast } from "./components/DailyForecast.js";
import { HourlyForecast } from "./components/HourlyForecast.js";

class App {
    constructor() {
        this.service = new WeatherService();
        this.components = {
            search: null,
            current: new CurrentWeather(),
            daily: new DailyForecast(),
            hourly: new HourlyForecast()
        };
    }

    async handleSearch(query) {
        try {
            const data = await this.service.searchLocation(query);
            this.components.current.render(data);
            this.components.daily.render(data.daily);
            this.components.hourly.render(data.hourly, data.timezone);
        } catch (error) {
            console.error(`App search error:`, error);
        }
    }

    init() {
        this.components.search = new Search(this.handleSearch.bind(this));
        this.handleSearch('London');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
export class Search {
    constructor(onSearchCallback) {
        this.form = document.getElementById('searchForm');
        this.input = document.getElementById('search_query');
        this.autocompleteContainer = document.getElementById('autocompleteResults');
        this.onSearchCallback = onSearchCallback;
        this.autocompleteTimeout = null;

        this.init();
    }

    init() {
        if (this.input) {
            this.input.addEventListener('input', (e) => this.handleInput(e));
        }

        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    handleInput(e) {
        clearTimeout(this.autocompleteTimeout);
        const query = e.target.value;

        if (!query || query.trim().length < 2) {
            this.hideAutocomplete();
            return;
        }

        this.autocompleteTimeout = setTimeout(() => {
            this.fetchAutocomplete(query);
        }, 300);
    }

    async fetchAutocomplete(query) {
        try {
            const encodedQuery = encodeURIComponent(query.trim());
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedQuery}&count=5&language=en&format=json`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results) {
                this.showAutocomplete(data.results);
            }
        } catch (error) {
            console.error(`Autocomplete error:`, error);
        }
    }

    showAutocomplete(results) {
        this.autocompleteContainer.innerHTML = '';
        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'search__result';
            item.textContent = `${result.name}, ${result.country}`;
            item.addEventListener('click', () => {
                this.input.value = result.name;
                this.hideAutocomplete();
                this.triggerSearch(result.name);
            });
            this.autocompleteContainer.appendChild(item);
        });
        this.autocompleteContainer.classList.remove('hidden');
    }

    hideAutocomplete() {
        if (this.autocompleteContainer) {
            this.autocompleteContainer.innerHTML = '';
            this.autocompleteContainer.classList.add('hidden');
        }
    }

    handleOutsideClick(e) {
        if (!e.target.closest('#search_query') && !e.target.closest('#autocompleteResults')) {
            this.hideAutocomplete();
        }
    }

    handleSearch() {
        const query = this.input.value.trim();
        if (query) {
            this.hideAutocomplete();
            this.triggerSearch(query);
        }
    }

    triggerSearch(query) {
        if (typeof this.onSearchCallback === 'function') {
            this.onSearchCallback(query);
        }
    }
}

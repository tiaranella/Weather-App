export class Dropdown {
    constructor(onUnitChange, onDayChange) {
        this.onUnitChange = onUnitChange;
        this.onDayChange = onDayChange;
        
        this.unitsTrigger = document.getElementById('unitsButton');
        this.dayTrigger = document.getElementById('daySelectorButton');

        this.unitsMenu = document.getElementById('unitsDropdown');
        this.dayMenu = document.getElementById('hourlyForecastDropdown');
        
        this.toggleUnitsButton = document.getElementById('toggleUnitsButton');
        this.unitOptions = document.querySelectorAll('.dropdown__option[data-unit]');
        this.dayOptions = document.querySelectorAll('.hourly-forecast__dropdown-button');
        
        this.init();
    }

    init() {
        if (this.unitsTrigger) {
            this.unitsTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMenus(this.unitsMenu);
                this.unitsMenu?.classList.toggle('visible');
            });
        }

        if (this.dayTrigger) {
            this.dayTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMenus(this.dayMenu);
                this.dayMenu?.classList.toggle('visible');
            });
        }

        if (this.toggleUnitsButton) {
            this.toggleUnitsButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.onUnitChange('system', 'toggle');
                this.closeMenus();
            });
        }

        this.unitOptions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const button = e.target.closest('.dropdown__option');
                if (!button) return;
                
                const unitType = button.dataset.unit;
                const value = button.dataset.value;
                this.onUnitChange(unitType, value);
                this.closeMenus();
            });
        });

        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.dayOptions.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const todayActualIndex = new Date().getDay();
                const clickedDayName = btn.textContent.trim();
                const clickedDayActualIndex = weekdays.indexOf(clickedDayName);
                
                let relativeIndex = (clickedDayActualIndex - todayActualIndex + 7) % 7;

                if (relativeIndex === 0) {
                    const currentDayName = weekdays[todayActualIndex];
                    if (clickedDayName !== currentDayName) {
                        relativeIndex = 7;
                    }
                }

                const selectedDayIndex = Math.min(relativeIndex, 6);
                
                this.onDayChange(selectedDayIndex);
                this.updateDayButtonText(selectedDayIndex);
                this.closeMenus();
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown__menu') && !e.target.closest('.dropdown__trigger')) {
                this.closeMenus();
            }
        });
        
        this.updateDayButtonText(0);
    }

    closeMenus(exceptMenu = null) {
        if (this.unitsMenu && this.unitsMenu !== exceptMenu) {
            this.unitsMenu.classList.remove('visible');
        }
        if (this.dayMenu && this.dayMenu !== exceptMenu) {
            this.dayMenu.classList.remove('visible');
        }
    }

    updateDayButtonText(dayIndex) {
        if (!this.dayTrigger) return;
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayIndex = new Date().getDay();
        const dayName = dayIndex === 0 ? 'Today' : weekdays[(todayIndex + dayIndex) % 7];
        this.dayTrigger.innerHTML = `${dayName} <img src="./assets/images/icon-dropdown.svg" alt="dropdown" class="dropdown__arrow">`;
    }

    updateUnitUI(units) {
        if (!units) return;
        const isMetric = units.temperature === 'celsius' && units.wind === 'kmh' && units.precipitation === 'mm';
        
        if (this.toggleUnitsButton) {
            this.toggleUnitsButton.textContent = isMetric ? 'Switch to Imperial' : 'Switch to Metric';
        }

        this.unitOptions.forEach(btn => {
            const unitType = btn.dataset.unit;
            const value = btn.dataset.value;
            if (units[unitType] === value) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
}
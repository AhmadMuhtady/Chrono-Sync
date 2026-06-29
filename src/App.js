import EventBus from './core/EventBus.js';
import UIManager from './ui/UIManager.js';
import ClockManager from './core/ClockManager.js';
import FormManager from './ui/FormManager.js';

class App {
	container = document.getElementById('clock-container');
	configs = [];
	clocks = [];
	started = false;
	constructor() {
		this.EventBus = new EventBus();
		this.form = new FormManager(this.EventBus);

		document
			.getElementById('add-clock')
			.addEventListener('click', () => this.form.open());

		this.configs.forEach((config) => this.addClock(config));

		this.EventBus.subscribe('clock:remove', this.removeClock.bind(this));
		this.EventBus.subscribe('clock:add', this.addClock.bind(this));
	}

	addClock({ tz, type }) {
		if (this.clocks.some((c) => c.tz === tz)) return;

		const clockManager = new ClockManager(this.EventBus, tz);
		const uiManager = new UIManager(this.container, this.EventBus, tz, type);

		this.clocks.push({
			tz,
			type,
			ClockManager: clockManager,
			UIManager: uiManager,
		});

		if (this.started) {
			clockManager.start();
			uiManager.mount();
		}
	}

	removeClock(tz) {
		const index = this.clocks.findIndex((c) => c.tz === tz);
		if (index === -1) return;

		const { ClockManager, UIManager } = this.clocks[index];
		ClockManager.stop();
		UIManager.unmount();
		this.clocks.splice(index, 1);
	}

	start() {
		this.started = true;
		this.clocks.forEach((city) => {
			city.ClockManager.start();
			city.UIManager.mount();
		});
	}
}

const app = new App();
window.app = app;
app.start();

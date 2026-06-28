import EventBus from './core/EventBus.js';
import UIManager from './ui/UIManager.js';
import ClockManager from './core/ClockManager.js';
class App {
	container = document.getElementById('clock-container');
	timeZones = ['Asia/Beirut', 'America/New_York', 'Asia/Tokyo'];
	clocks = [];
	constructor() {
		this.EventBus = new EventBus();
		this.timeZones.forEach((tz) => {
			const clockManager = new ClockManager(this.EventBus, tz);
			const uiManager = new UIManager(this.container, this.EventBus, tz);

			this.clocks.push({
				tz,
				ClockManager: clockManager,
				UIManager: uiManager,
			});
		});

		this.EventBus.subscribe('clock:remove', this.removeClock.bind(this));
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
		this.clocks.forEach((city) => {
			city.ClockManager.start();
			city.UIManager.mount();
		});
	}
}

const app = new App();
window.app = app;
app.start();

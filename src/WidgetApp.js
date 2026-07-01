import EventBus from './core/EventBus.js';
import UIManager from './ui/UIManager.js';
import ClockManager from './core/ClockManager.js';

class WidgetApp {
	container = document.getElementById('root');
	tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	type = 'flip';
	showControls = false;

	constructor() {
		this.EventBus = new EventBus();
		this.clockManager = new ClockManager(this.EventBus, this.tz);
		this.ui = new UIManager(
			this.container,
			this.EventBus,
			this.tz,
			this.type,
			this.showControls,
		);
	}

	unmount() {
		this.clockManager.stop();
		this.ui.unmount();
	}

	start() {
		this.clockManager.start();
		this.ui.mount();
	}
}

const widgetApp = new WidgetApp();
widgetApp.start();

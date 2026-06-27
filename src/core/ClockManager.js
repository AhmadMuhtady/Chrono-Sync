import ClockTime from '../models/ClockTime';

export default class ClockManager {
	constructor(
		eventBus,
		config = Intl.DateTimeFormat().resolvedOptions().timeZone,
	) {
		this.eventBus = eventBus;
		this.config = config;
		this.intervalId = null;
	}

	start() {
		if (this.intervalId !== null) return;

		this.intervalId = setInterval(() => {
			const date = new Date();
			const locale = navigator.language;
			const tick = new ClockTime(date, this.config, locale);
			this.eventBus.emit('time:update', tick);
		}, 1000);
	}
	stop() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	setTimezone(tz) {
		if (tz !== this.config) {
			this.config = tz;
			this.stop();
			this.start();
		}
	}
}

export default class EventBus {
	storage = {};

	emit(eventName, data) {
		const events = this.storage[eventName];

		if (!events) return;

		events.forEach((cl) => cl(data));
	}

	subscribe(eventName, callback) {
		if (!this.storage[eventName]) this.storage[eventName] = [];

		if (!this.storage[eventName].includes(callback))
			this.storage[eventName].push(callback);
	}

	unsubscribe(eventName, callback) {
		const events = this.storage[eventName];
		if (!events) return;

		this.storage[eventName] = events.filter((cb) => cb !== callback);
	}
}

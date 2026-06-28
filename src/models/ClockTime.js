export default class ClockTime {
	constructor(date, timezone, userLocale) {
		this.date = date;
		this.timezone = timezone;
		this.userLocale = userLocale;
	}

	getTime() {
		const parts12 = new Intl.DateTimeFormat(this.userLocale, {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true,
			timeZone: this.timezone,
		}).formatToParts(this.date);

		const parts24 = new Intl.DateTimeFormat(this.userLocale, {
			hour: '2-digit',
			hourCycle: 'h23',
			timeZone: this.timezone,
		}).formatToParts(this.date);

		const find = (parts, type) =>
			parts.find((p) => p.type === type)?.value ?? '';

		return {
			hours12: find(parts12, 'hour'),
			hours24: find(parts24, 'hour'),
			minutes: find(parts12, 'minute'),
			seconds: find(parts12, 'second'),
			meridiem: find(parts12, 'dayPeriod'),
		};
	}

	getCity() {
		return this.timezone.replaceAll('_', ' ').split('/').pop();
	}

	getFormattedDate() {
		const dateOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			timeZone: this.timezone,
		};

		return new Intl.DateTimeFormat(this.userLocale, dateOptions).format(
			this.date,
		);
	}
}

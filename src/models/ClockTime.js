export default class ClockTime {
	constructor(date, timezone, userLocale) {
		this.date = date;
		this.timezone = timezone;
		this.userLocale = userLocale;
	}

	getFormattedTime() {
		const timeOptions = {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true,
			timeZone: this.timezone,
		};

		return new Intl.DateTimeFormat(this.userLocale, timeOptions).format(
			this.date,
		);
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

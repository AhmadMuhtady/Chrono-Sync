export default class ClockTime {
	constructor(date, timezone, userLocale) {
		this.date = date;
		this.timezone = timezone;
		this.userLocale = userLocale;

		if (!Intl.supportedValuesOf('timeZone').includes(this.timezone)) {
			throw new Error(`ClockTime: unknown timezone "${this.timezone}"`);
		}
	}

	getTime(use24h = false) {
		const opts = use24h
			? {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hourCycle: 'h23',
				}
			: { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

		const parts = new Intl.DateTimeFormat('en-US', {
			...opts,
			timeZone: this.timezone,
		}).formatToParts(this.date);

		const pick = (t) => parts.find((p) => p.type === t)?.value ?? '';
		const dayPeriod = pick('dayPeriod');

		return {
			hours: pick('hour'),
			minutes: pick('minute'),
			seconds: pick('second'),
			milliseconds: String(this.date.getMilliseconds()).padStart(3, '0'),
			meridiem: dayPeriod,
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

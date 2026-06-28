export default class UIManager {
	constructor(
		container,
		eventBus,
		config = Intl.DateTimeFormat().resolvedOptions().timeZone,
	) {
		this.container = container;
		this.clockContainer = document.createElement('div');
		this.eventBus = eventBus;
		this.handleRender = null;
		this.config = config;
	}

	mount() {
		this.handleRender = this.renderClock.bind(this);
		this.eventBus.subscribe(`time:update:${this.config}`, this.handleRender);
		this.container.appendChild(this.clockContainer);
	}

	unmount() {
		if (this.handleRender)
			this.eventBus.unsubscribe(
				`time:update:${this.config}`,
				this.handleRender,
			);
		this.handleRender = null;
		this.clockContainer.remove();
	}

	renderClock(tick) {
		const [time, mark] = tick.getFormattedTime().split(' ');
		const [hours, mints, seconds] = time.split(':');
		const [, city] = this.config.replaceAll('_', ' ').split('/');
		const digitalHTML = `
    <div
					class="glass-card p-10 rounded-xl border border-outline-variant/30 group relative"
					data-city="${city}"
				>
					<div class="flex justify-between items-start mb-6">
						<div>
							<div class="flex items-center gap-2 mb-1">
								<span class="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
								<span
									class="font-label-caps text-label-caps text-tertiary uppercase"
									>${city}</span
								>
							</div>
							<div
								class="mt-4 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/10 inline-block"
							>
								<p
									class="text-[10px] text-on-surface-variant mb-0.5 tracking-widest font-label-caps"
								>
									DATE
								</p>
								<p class="font-bold text-sm">${tick.getFormattedDate()}</p>
							</div>
						</div>
						<label class="inline-flex items-center cursor-pointer">
							<input class="sr-only peer" type="checkbox" />
							<div
								class="relative w-20 h-10 bg-gray-200 rounded-full peer-focus:outline-none transition-colors duration-300 peer peer-checked:bg-tertiary/80"
							>
								<div
									class="absolute top-1 left-1 bg-white w-8 h-8 rounded-full shadow transition-transform duration-300 peer-checked:translate-x-10 flex items-center justify-center font-semibold text-[10px] text-gray-700"
								>
									<span class="">12h</span>
								</div>
								<div
									class="absolute top-1 right-1 w-8 h-8 flex items-center justify-center font-semibold text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300"
								>
									24h
								</div>
							</div>
						</label>
					</div>
					<div class="flex flex-col items-center justify-center py-4">
						
							<div
								class="font-display-clock text-display-clock text-tertiary dark:text-tertiary-fixed-dim relative flex justify-center tracking-tighter digital-glow-tertiary"
							>
								${hours}:${mints}:${seconds} <span class="text-4xl ml-2">${mark}</span>
							</div>
						
					</div>
				</div>
    `;

		this.clockContainer.innerHTML = digitalHTML;
	}
}

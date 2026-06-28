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
		this.handleClick = null;
		this.config = config;
		this.use24h = false; // format state, survives re-renders
		this.lastTick = null; // so a toggle can re-render immediately
	}

	mount() {
		this.handleRender = this.renderClock.bind(this);
		this.handleClick = this.onClick.bind(this);
		this.eventBus.subscribe(`time:update:${this.config}`, this.handleRender);
		this.clockContainer.addEventListener('click', this.handleClick);
		this.container.appendChild(this.clockContainer);
	}

	unmount() {
		if (this.handleRender)
			this.eventBus.unsubscribe(
				`time:update:${this.config}`,
				this.handleRender,
			);
		if (this.handleClick)
			this.clockContainer.removeEventListener('click', this.handleClick);
		this.handleRender = null;
		this.handleClick = null;
		this.clockContainer.remove();
	}

	onClick(e) {
		if (e.target.closest('[data-action="delete"]')) {
			this.eventBus.emit('clock:remove', this.config);
			return;
		}

		if (e.target.closest('[data-action="toggle-format"]')) {
			this.use24h = !this.use24h;
			if (this.lastTick) this.renderClock(this.lastTick); // update now, don't wait a second
		}
	}

	renderClock(tick) {
		this.lastTick = tick;
		const { hours12, hours24, minutes, seconds, meridiem } = tick.getTime();
		const city = tick.getCity();

		const hours = this.use24h ? hours24 : hours12;
		const mark = this.use24h ? '' : meridiem;

		const digitalHTML = `
    <div
					class="glass-card p-10 rounded-xl border border-outline-variant/30 group relative"
					data-city="${city}"
				>
					<button
						type="button"
						data-action="delete"
						aria-label="Remove ${city} clock"
						class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-error text-on-error shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
							<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
						</svg>
					</button>
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
						<label
							class="inline-flex items-center cursor-pointer"
							data-action="toggle-format"
						>
							<input class="sr-only peer" type="checkbox" ${this.use24h ? 'checked' : ''} />
							<div
								class="relative w-20 h-10 bg-gray-200 rounded-full peer-focus:outline-none transition-colors duration-300 peer peer-checked:bg-tertiary/80"
							>
								<div
									class="absolute top-1 ${this.use24h ? 'right' : 'left'}-1 bg-white w-8 h-8 rounded-full shadow transition-transform duration-300 peer-checked:translate-x-10 flex items-center justify-center font-semibold text-[10px] text-gray-700"
								>
									${this.use24h ? '24h' : '12h'}
								</div>
							</div>
						</label>
					</div>
					<div class="flex flex-col items-center justify-center py-4">
						
							<div
								class="font-display-clock text-display-clock text-tertiary dark:text-tertiary-fixed-dim relative flex justify-center tracking-tighter digital-glow-tertiary"
							>
								${hours}:${minutes}:${seconds} <span class="text-4xl ml-2">${mark}</span>
							</div>
						
					</div>
				</div>
    `;

		this.clockContainer.innerHTML = digitalHTML;
	}
}

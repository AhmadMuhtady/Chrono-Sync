import { digitalRender } from './views/digitalViews.js';
import { analogRender } from './views/analogView.js';
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
		this.use24h = false;
		this.lastTick = null;
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
			if (this.lastTick) this.renderClock(this.lastTick);
		}
	}

	renderClock(tick) {
		this.lastTick = tick;
		// const html = digitalRender(tick, this.use24h);
		const html = analogRender(tick);

		this.clockContainer.innerHTML = html;
	}
}

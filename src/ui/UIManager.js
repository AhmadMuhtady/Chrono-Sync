import { digitalRender } from './views/digitalViews.js';
import { analogRender } from './views/analogView.js';
import { flipRender } from './views/FlipRender.js';

export default class UIManager {
	constructor(
		container,
		eventBus,
		config = Intl.DateTimeFormat().resolvedOptions().timeZone,
		type = 'digital',
	) {
		this.container = container;
		this.clockContainer = document.createElement('div');
		this.eventBus = eventBus;
		this.handleRender = null;
		this.handleClick = null;
		this.config = config;
		this.use24h = false;
		this.lastTick = null;
		this.type = type;
		this.flip = null;
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
		this.flip = null;
		this.clockContainer.remove();
	}

	onClick(e) {
		if (e.target.closest('[data-action="delete"]')) {
			this.eventBus.emit('clock:remove', this.config);
			return;
		}

		if (e.target.closest('[data-action="toggle-format"]')) {
			this.use24h = !this.use24h;
			if (this.type === 'flip') this.flip = null;
			if (this.lastTick) this.renderClock(this.lastTick);
		}
	}

	handleClockType(tick) {
		switch (this.type) {
			case 'analog':
				return analogRender(tick);
			case 'digital':
			default:
				return digitalRender(tick, this.use24h);
		}
	}

	renderClock(tick) {
		this.lastTick = tick;

		if (this.type === 'flip') {
			if (!this.flip) {
				this.clockContainer.innerHTML = '';
				this.flip = flipRender(tick, this.use24h);
				this.clockContainer.appendChild(this.flip.el);
			} else {
				this.flip.update(tick);
			}
			return;
		}

		this.clockContainer.innerHTML = this.handleClockType(tick);
	}
}
